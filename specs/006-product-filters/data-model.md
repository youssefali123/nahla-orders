# Data Model: Product Display Filters

**Feature**: `006-product-filters` | **Date**: 2026-10-03

Two new tables plus one opt-in flag column on each of subcategories and
categories (the explicit opt-in the spec requires must live somewhere; a
boolean column is the smallest honest form — tables are otherwise
untouched). All IDs UUIDs defaulting to `gen_random_uuid()`.

## subcategory_filters

| Column | Type | Constraints / default |
|---|---|---|
| id | UUID PK | default `gen_random_uuid()` |
| subcategory_id | UUID FK → subcategories(id) | NULL, ON DELETE CASCADE |
| category_id | UUID FK → categories(id) | NULL, ON DELETE CASCADE |
| name | TEXT | NOT NULL, non-empty (CHECK `length(name) > 0`) |
| sort_order | INTEGER | NOT NULL DEFAULT 0 |
| is_active | BOOLEAN | NOT NULL DEFAULT true |
| created_at / updated_at | TIMESTAMPTZ | NOT NULL DEFAULT `now()` (reused trigger) |

- Exactly-one-parent: CHECK `((subcategory_id IS NULL) != (category_id IS NULL))`.
- Uniqueness: UNIQUE (`subcategory_id`, `name`) and UNIQUE (`category_id`,
  `name`) — NULLs never collide under a shared composite, so per-parent
  scoping holds with two partial uniques; enforced as two UNIQUE
  constraints (each ignores rows where its parent is NULL in practice —
  documented; duplicates across different parents allowed).
- Relationships: parent delete cascades to values; value delete cascades to
  assignments.

## product_filter_values

| Column | Type | Constraints / default |
|---|---|---|
| product_id | UUID FK → products(id), part of PK | NOT NULL, ON DELETE CASCADE |
| filter_id | UUID FK → subcategory_filters(id) | NOT NULL, ON DELETE CASCADE |
| PRIMARY KEY | (`product_id`) | single-select enforced structurally |

## Opt-in flags (columns on existing tables)

- `subcategories.has_filters BOOLEAN NOT NULL DEFAULT false`
- `categories.has_filters BOOLEAN NOT NULL DEFAULT false` (direct-listing
  categories only; categories with subcategories ignore it)
- No other alteration to existing tables (no renames, no dropped columns,
  no behavior change when false).

## Cross-cutting objects (all reused, none new)

- **Trigger**: existing `handle_updated_at()` attached to
  `subcategory_filters` only.
- **Helper**: existing `is_admin()` for admin `ALL` policies on both tables.
- **Indexes**: `(subcategory_id, is_active, sort_order)`,
  `(category_id, is_active, sort_order)` on filters;
  `(filter_id)` supporting the assignment join.
- **RLS matrix**: both tables RLS-enabled. anon+authenticated SELECT on
  filters = `is_active` AND an enabled, active parent, enforced
  database-side via EXISTS on the owning subcategory/category row (its
  `is_active` and `has_filters`; no `auth.*` calls, so no initplan
  penalty). Assignments readable under the same active-only posture.
  Authenticated `ALL` gated on `is_admin()`. No public writes.

## Read shapes (no new tables)

- **Filter**: `{ id, name, sort_order }` for one enabled section, ordered.
- **Listing rows**: existing product shape plus `filter_id: string | null`
  merged from one constant-cost mapping query.
- **Bar state (client-side)**: selected filter id or all; pure view state.
