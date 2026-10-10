-- Nahla service-fee setting migration (service fee percent feature).
-- Run once in Supabase Dashboard → SQL Editor. Rerunnable. No seeds.

create table if not exists app_settings (
  key text primary key check (length(key) > 0),
  value text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on app_settings;
create trigger set_updated_at before update on app_settings
  for each row execute function public.handle_updated_at();

alter table app_settings enable row level security;

drop policy if exists "public read settings" on app_settings;
create policy "public read settings" on app_settings
  for select to anon, authenticated using (true);

drop policy if exists "admin full access" on app_settings;
create policy "admin full access" on app_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Verify: expect 1 row "app_settings | t".
select tablename, rowsecurity from pg_tables where tablename = 'app_settings';
