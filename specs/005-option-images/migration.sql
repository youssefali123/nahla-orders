-- Nahla product option images migration (feature 005).
-- Run once in Supabase Dashboard → SQL Editor. Rerunnable.
-- Adds exactly one nullable column; alters nothing else.

alter table product_options
  add column if not exists image_url text null;

-- Verify: expect 1 row showing image_url as nullable.
select column_name, is_nullable, data_type
from information_schema.columns
where table_name = 'product_options' and column_name = 'image_url';
