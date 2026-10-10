-- Nahla daily order counter (sequential order numbers, reset 9AM Cairo daily).
-- Run once in Supabase Dashboard → SQL Editor. Rerunnable.
--
-- Design: numbers live in per-day buckets keyed by "business day", where the
-- business day flips at 09:00 Africa/Cairo (not midnight). This gives an
-- automatic daily reset with zero schedulers to break. Increments are atomic
-- (single upsert), so concurrent orders never share a number. Skipped numbers
-- can occur if an order fails after reserving (uniqueness is guaranteed,
-- gaplessness is not).

create table if not exists daily_order_counters (
  business_day date primary key,
  last_number integer not null default 0 check (last_number >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on daily_order_counters;
create trigger set_updated_at before update on daily_order_counters
  for each row execute function public.handle_updated_at();

alter table daily_order_counters enable row level security;

drop policy if exists "admin full access" on daily_order_counters;
create policy "admin full access" on daily_order_counters
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create or replace function public.next_order_number()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_business_day date := ((now() at time zone 'Africa/Cairo') - interval '9 hours')::date;
  new_number integer;
begin
  insert into daily_order_counters (business_day, last_number)
  values (v_business_day, 1)
  on conflict (business_day)
  do update set last_number = daily_order_counters.last_number + 1, updated_at = now()
  returning daily_order_counters.last_number into new_number;
  return new_number;
end;
$$;

grant execute on function public.next_order_number() to anon, authenticated;

-- Verify: expect 1 row "daily_order_counters | t".
select tablename, rowsecurity from pg_tables where tablename = 'daily_order_counters';
