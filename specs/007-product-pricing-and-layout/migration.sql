-- Nahla product pricing + section layout migration (feature 007).
-- Run once in Supabase Dashboard -> SQL Editor. Rerunnable. No seeds, no data loss.
--
-- Adds:
--   products.extra_price        flat per-unit addition (>= 0)
--   products.discount_percent   offer percentage (0..100)
--   categories.product_layout   'grid' (current) | 'list' (full-width)
--   subcategories.product_layout same as categories
--
-- Effective price rule (also implemented in src/lib/pricing.ts):
--   final unit = (price + extra_price) * (1 - discount_percent / 100) + option deltas
-- Defaults are 0/0/'grid', so every existing product and section keeps its
-- current behavior immediately after this migration.

alter table public.products
  add column if not exists extra_price numeric(10,2) not null default 0
    check (extra_price >= 0);

alter table public.products
  add column if not exists discount_percent numeric(5,2) not null default 0
    check (discount_percent >= 0 and discount_percent <= 100);

alter table public.categories
  add column if not exists product_layout text not null default 'grid'
    check (product_layout in ('grid', 'list'));

alter table public.subcategories
  add column if not exists product_layout text not null default 'grid'
    check (product_layout in ('grid', 'list'));

comment on column public.products.extra_price is
  'Flat per-unit addition shown in the order message and included in the price before discount.';
comment on column public.products.discount_percent is
  'Offer percentage 0..100. 0 means no offer. No scheduling.';
comment on column public.categories.product_layout is
  'Product listing layout for categories that list products directly: grid | list.';
comment on column public.subcategories.product_layout is
  'Product listing layout for subcategory product listings: grid | list.';

-- Verify: expect four rows with the new columns and their defaults/checks.
select table_name, column_name, data_type, column_default
from information_schema.columns
where table_schema = 'public'
  and (
    (table_name = 'products' and column_name in ('extra_price', 'discount_percent'))
    or (table_name in ('categories', 'subcategories') and column_name = 'product_layout')
  )
order by table_name, column_name;
