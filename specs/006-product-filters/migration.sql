-- Nahla product display filters migration (feature 006).
-- Run once in Supabase Dashboard → SQL Editor. Rerunnable. No seeds.

create table if not exists subcategory_filters (
  id uuid primary key default gen_random_uuid(),
  subcategory_id uuid references subcategories(id) on delete cascade,
  category_id uuid references categories(id) on delete cascade,
  name text not null check (length(name) > 0),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((subcategory_id is null) != (category_id is null)),
  unique (subcategory_id, name),
  unique (category_id, name)
);

create table if not exists product_filter_values (
  product_id uuid not null references products(id) on delete cascade,
  filter_id uuid not null references subcategory_filters(id) on delete cascade,
  primary key (product_id)
);

alter table subcategories
  add column if not exists has_filters boolean not null default false;
alter table categories
  add column if not exists has_filters boolean not null default false;

drop trigger if exists set_updated_at on subcategory_filters;
create trigger set_updated_at before update on subcategory_filters
  for each row execute function public.handle_updated_at();

create index if not exists filters_sub_active_sort_idx
  on subcategory_filters (subcategory_id, is_active, sort_order);
create index if not exists filters_cat_active_sort_idx
  on subcategory_filters (category_id, is_active, sort_order);
create index if not exists filter_values_filter_idx
  on product_filter_values (filter_id);

alter table subcategory_filters enable row level security;
alter table product_filter_values enable row level security;

drop policy if exists "public read active" on subcategory_filters;
create policy "public read active" on subcategory_filters
  for select to anon, authenticated
  using (
    is_active = true
    and (
      (subcategory_id is not null and exists (
        select 1 from subcategories s
        where s.id = subcategory_id and s.is_active = true and s.has_filters = true
      ))
      or
      (category_id is not null and exists (
        select 1 from categories c
        where c.id = category_id and c.is_active = true and c.has_filters = true
      ))
    )
  );

drop policy if exists "public read active" on product_filter_values;
create policy "public read active" on product_filter_values
  for select to anon, authenticated
  using (
    exists (
      select 1 from products p
      where p.id = product_id and p.is_active = true
    )
    and exists (
      select 1 from subcategory_filters f
      where f.id = filter_id and f.is_active = true
    )
  );

drop policy if exists "admin full access" on subcategory_filters;
create policy "admin full access" on subcategory_filters
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin full access" on product_filter_values;
create policy "admin full access" on product_filter_values
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Verify: expect 2 rows "...| t".
select tablename, rowsecurity from pg_tables
where tablename in ('subcategory_filters', 'product_filter_values');
