-- Nahla product groups (third catalog level) migration (feature 008).
-- Run once in Supabase Dashboard -> SQL Editor. Rerunnable. No seeds, no data loss.
--
-- Adds:
--   product_groups                  subcategory -> group -> products
--   products.group_id               nullable group link (NULL keeps today's behavior)
--   subcategory_filters.group_id    group-level display filters
--
-- Hierarchy: categories -> subcategories -> product_groups -> products.
-- A subcategory with active groups shows its groups; otherwise it lists
-- products directly (exactly like a category with no subcategories today).

create table if not exists public.product_groups (
  id uuid primary key default gen_random_uuid(),
  subcategory_id uuid not null references public.subcategories(id) on delete cascade,
  name text not null check (length(name) > 0),
  icon text,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  requires_preorder boolean not null default false,
  has_filters boolean not null default false,
  product_layout text not null default 'grid'
    check (product_layout in ('grid', 'list')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (subcategory_id, name)
);

drop trigger if exists set_updated_at on public.product_groups;
create trigger set_updated_at before update on public.product_groups
  for each row execute function public.handle_updated_at();

create index if not exists product_groups_sub_active_sort_idx
  on public.product_groups (subcategory_id, is_active, sort_order);

alter table public.product_groups enable row level security;

drop policy if exists "public read active" on public.product_groups;
create policy "public read active" on public.product_groups
  for select to anon, authenticated
  using (
    is_active = true
    and exists (
      select 1 from public.subcategories s
      join public.categories c on c.id = s.category_id
      where s.id = subcategory_id
        and s.is_active = true
        and c.is_active = true
    )
  );

drop policy if exists "admin full access" on public.product_groups;
create policy "admin full access" on public.product_groups
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

alter table public.products
  add column if not exists group_id uuid
    references public.product_groups(id) on delete set null;

create index if not exists products_group_idx on public.products (group_id);

-- ---------- Group-level display filters ----------

alter table public.subcategory_filters
  add column if not exists group_id uuid
    references public.product_groups(id) on delete cascade;

-- Replace the old exactly-one-parent CHECK (category XOR subcategory) with
-- one that also accepts a group parent. Dropped by definition, not by name,
-- so the script is rerunnable regardless of the auto-generated name.
do $$
declare
  con record;
begin
  for con in
    select conname
    from pg_constraint
    where conrelid = 'public.subcategory_filters'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%subcategory_id IS NULL%'
      and pg_get_constraintdef(oid) ilike '%category_id IS NULL%'
      and pg_get_constraintdef(oid) not ilike '%group_id%'
  loop
    execute format(
      'alter table public.subcategory_filters drop constraint %I',
      con.conname
    );
  end loop;
end $$;

alter table public.subcategory_filters
  drop constraint if exists subcategory_filters_one_parent_check;

alter table public.subcategory_filters
  add constraint subcategory_filters_one_parent_check check (
    (
      (subcategory_id is not null)::integer
      + (category_id is not null)::integer
      + (group_id is not null)::integer
    ) = 1
  );

create unique index if not exists filters_group_name_key
  on public.subcategory_filters (group_id, name);

-- Public read must also accept a group parent with filtering enabled.
drop policy if exists "public read active" on public.subcategory_filters;
create policy "public read active" on public.subcategory_filters
  for select to anon, authenticated
  using (
    is_active = true
    and (
      (subcategory_id is not null and exists (
        select 1 from public.subcategories s
        where s.id = subcategory_id and s.is_active = true and s.has_filters = true
      ))
      or
      (category_id is not null and exists (
        select 1 from public.categories c
        where c.id = category_id and c.is_active = true and c.has_filters = true
      ))
      or
      (group_id is not null and exists (
        select 1 from public.product_groups g
        where g.id = group_id and g.is_active = true and g.has_filters = true
      ))
    )
  );

-- Verify: expect the new table, the new product column and the filter column.
select table_name, column_name, data_type, column_default
from information_schema.columns
where table_schema = 'public'
  and (
    (table_name = 'product_groups' and column_name in ('id', 'subcategory_id', 'name', 'product_layout'))
    or (table_name = 'products' and column_name = 'group_id')
    or (table_name = 'subcategory_filters' and column_name = 'group_id')
  )
order by table_name, column_name;
