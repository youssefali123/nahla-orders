# Data Model: Supabase Catalog Migration

**Feature**: `001-supabase-catalog-migration` | **Date**: 2026-10-03

Source: `spec.md` Key Entities + FR-016/FR-017 + clarification sessions
(`is_featured`, emoji `icon` on all visual entities, `link_url` for custom
banners). All IDs are UUIDs generated database-side (`gen_random_uuid()`).

## categories

| Column | Type | Constraints / default |
|---|---|---|
| id | UUID PK | default `gen_random_uuid()` |
| name | TEXT | NOT NULL, UNIQUE |
| icon | TEXT | NULL (emoji, preserved from current UI) |
| image_url | TEXT | NULL |
| sort_order | INTEGER | NOT NULL DEFAULT 0 |
| is_active | BOOLEAN | NOT NULL DEFAULT true |
| type | TEXT | NOT NULL DEFAULT `'normal'`, CHECK in (`'normal'`, `'custom_order'`) |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT `now()` |
| updated_at | TIMESTAMPTZ | NOT NULL DEFAULT `now()` (trigger-maintained) |

- Relationships: has many subcategories, has many products (both cascade on
  delete). Exactly one row is expected to carry `type = 'custom_order'`
  (the "طلب مخصص" seed); the app treats it as the custom-request entry point.
- Seed rows: ماركت, مطاعم, خضار وفاكهة, عيش ومعجنات (`normal`), طلب مخصص
  (`custom_order`), all active, icons 🛒 🍽️ 🥬 🥖 ✍️.

## subcategories

| Column | Type | Constraints / default |
|---|---|---|
| id | UUID PK | default `gen_random_uuid()` |
| category_id | UUID FK → categories(id) | NOT NULL, ON DELETE CASCADE |
| name | TEXT | NOT NULL |
| icon | TEXT | NULL (emoji) |
| image_url | TEXT | NULL |
| sort_order | INTEGER | NOT NULL DEFAULT 0 |
| is_active | BOOLEAN | NOT NULL DEFAULT true |
| requires_preorder | BOOLEAN | NOT NULL DEFAULT false |
| created_at / updated_at | TIMESTAMPTZ | NOT NULL DEFAULT `now()` |

- Uniqueness: UNIQUE (`category_id`, `name`) — doubles as the idempotent-seed
  key. Deleting a category cascades to its subcategories.
- Seed rows: under ماركت — ألبان أجبان مخلل 🧀, منظفات 🧼, مشروبات وسناكس 🥤,
  قهوة شاي أعشاب ☕ (all `requires_preorder = false`); under مطاعم — مشاوي 🍢,
  فطائر وبيتزا 🍕, كشري وطواجن 🍲, أسماك 🐟, أكل بيتي 🥘
  (`requires_preorder = true` only for أكل بيتي).

## products

| Column | Type | Constraints / default |
|---|---|---|
| id | UUID PK | default `gen_random_uuid()` |
| category_id | UUID FK → categories(id) | NOT NULL, ON DELETE CASCADE |
| subcategory_id | UUID FK → subcategories(id) | NULL, ON DELETE SET NULL |
| name | TEXT | NOT NULL |
| price | NUMERIC(10,2) | NOT NULL, CHECK `price >= 0` |
| icon | TEXT | NULL (emoji, preserved from current catalog) |
| image_url | TEXT | NULL (photo shown when present) |
| description | TEXT | NULL |
| unit | TEXT | NULL (e.g. "كيلو", "علبة" — preserved from current catalog) |
| sort_order | INTEGER | NOT NULL DEFAULT 0 |
| is_active | BOOLEAN | NOT NULL DEFAULT true |
| is_featured | BOOLEAN | NOT NULL DEFAULT false (homepage "most-ordered") |
| created_at / updated_at | TIMESTAMPTZ | NOT NULL DEFAULT `now()` |

- Nullable `subcategory_id` supports both shapes: category→product
  (vegetables, bakery) and category→subcategory→product (market, restaurants).
- Uniqueness: UNIQUE (`category_id`, `subcategory_id`, `name`) is not null-safe
  in Postgres for the NULL case; seed idempotency for products is handled by
  lookup-then-insert in the seed step instead of a bare unique constraint.
  Migrated static products keep name, price, unit, description, icon,
  category/subcategory links, `featured` → `is_featured`, ordered by current
  listing order.

## banners

| Column | Type | Constraints / default |
|---|---|---|
| id | UUID PK | default `gen_random_uuid()` |
| title | TEXT | NULL |
| image_url | TEXT | NOT NULL |
| link_type | TEXT | NULL, CHECK in (`'category'`, `'subcategory'`, `'product'`, `'custom'`, `'none'`) |
| link_id | UUID | NULL (target record id for category/subcategory/product links) |
| link_url | TEXT | NULL (external address; only meaningful when `link_type = 'custom'`) |
| sort_order | INTEGER | NOT NULL DEFAULT 0 |
| is_active | BOOLEAN | NOT NULL DEFAULT true |
| created_at / updated_at | TIMESTAMPTZ | NOT NULL DEFAULT `now()` |

- `link_id` is intentionally not a foreign key (one column cannot reference
  three tables). Dangling `link_id`s fall back to the homepage link (spec
  edge case). Seed: the two current homepage banners, images uploaded to
  storage `banners/`, linking to the seeded ماركت and خضار وفاكهة categories.

## admin_profiles

| Column | Type | Constraints / default |
|---|---|---|
| id | UUID PK FK → `auth.users(id)` | ON DELETE CASCADE |
| role | TEXT | NOT NULL DEFAULT `'admin'`, CHECK in (`'admin'`) |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT `now()` |

- No seed rows in this phase. No public policies (deny-by-default); owner row
  read via `auth.uid() = id` only. Checked exclusively through the
  `is_admin()` helper — never directly from policies.

## Cross-cutting database objects

- **Trigger** `handle_updated_at()` (`BEFORE UPDATE`, sets `NEW.updated_at =
  now()`), attached to categories, subcategories, products, banners.
- **Helper** `is_admin()` — `SECURITY DEFINER`, `STABLE`, fixed `search_path`:
  `EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role =
  'admin')`.
- **Indexes**: `categories(is_active, sort_order)`;
  `subcategories(category_id, is_active, sort_order)`;
  `products(category_id, is_active, sort_order)`;
  `products(subcategory_id, is_active, sort_order)`;
  `banners(is_active, sort_order)`; plus `products(is_featured)` partial index
  `WHERE is_active AND is_featured` for the homepage query.
- **RLS matrix**: all five tables RLS-enabled. anon+authenticated `SELECT`
  restricted to `is_active = true` (catalog tables). Authenticated `ALL`
  gated on `is_admin()` (catalog tables). `admin_profiles`: no anon policies;
  authenticated `SELECT` own row only; writes owner-assignable only by a
  future privileged path (none in this phase).

## Storage layout (`nahla-images`: public-flag ON for display, writes admin-only)

- `categories/`, `subcategories/`, `products/`, `banners/` prefixes. The
  bucket's public flag is ON (required — Supabase only serves the
  `/object/public/` URL for public-flagged buckets) with a `SELECT` policy on
  `storage.objects` for this bucket plus admin-only write policies via
  `is_admin()`. Lesson learned during implementation: a policy-gated private
  bucket returns `NoSuchBucket` on the public URL path, and SQL-created
  buckets must be managed through the Storage API (direct deletes are
  blocked). Seed uploads (2 banner images) run with elevated migration-time
  rights, never from the browser.

## Client-side only (never in the database)

- **Cart item**: `{ id, name, price, icon, image?, qty, note? }` — UUID product
  ids post-migration; `custom-<ts>` ids and `note` texts stay local-only.
  Legacy slug ids (`m-dairy-1`, …) still in a device's storage resolve to
  nothing and are treated as unavailable per the spec edge case.
