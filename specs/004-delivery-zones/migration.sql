-- Nahla delivery zones migration (feature 004).
-- Run once in Supabase Dashboard → SQL Editor. Rerunnable (IF NOT EXISTS / OR REPLACE).
-- No seeds: an empty table is valid; the manager adds real zones via /admin/zones.

create table if not exists delivery_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (length(name) > 0),
  fee numeric(10,2) not null default 0 check (fee >= 0),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on delivery_zones;
create trigger set_updated_at before update on delivery_zones
  for each row execute function public.handle_updated_at();

create index if not exists zones_active_sort_idx
  on delivery_zones (is_active, sort_order);

alter table delivery_zones enable row level security;

drop policy if exists "public read active" on delivery_zones;
create policy "public read active" on delivery_zones
  for select to anon, authenticated using (is_active = true);

drop policy if exists "admin full access" on delivery_zones;
create policy "admin full access" on delivery_zones
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Verify: expect 1 row "delivery_zones | t".
select tablename, rowsecurity from pg_tables where tablename = 'delivery_zones';
