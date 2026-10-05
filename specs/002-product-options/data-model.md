# Data Model: Product Options (Variants & Add-ons)

**Feature**: `002-product-options` | **Date**: 2026-10-03

Additive only: existing tables untouched. All IDs UUIDs defaulting to
`gen_random_uuid()`.

## product_option_groups

| Column | Type | Constraints / default |
|---|---|---|
| id | UUID PK | default `gen_random_uuid()` |
| product_id | UUID FK → products(id) | NOT NULL, ON DELETE CASCADE |
| name | TEXT | NOT NULL, non-empty (CHECK `length(name) > 0`) |
| type | TEXT | NOT NULL DEFAULT `'single'`, CHECK in (`'single'`, `'multiple'`) |
| min_selections | INTEGER | NOT NULL DEFAULT 0, CHECK `>= 0`, plus single-cap `type='multiple' OR min_selections <= 1` |
| max_selections | INTEGER | NULL; CHECK `max IS NULL OR max >= min`; single-cap `type='multiple' OR max IS NULL OR max <= 1` |
| sort_order | INTEGER | NOT NULL DEFAULT 0 |
| is_active | BOOLEAN | NOT NULL DEFAULT true |
| created_at / updated_at | TIMESTAMPTZ | NOT NULL DEFAULT `now()` (trigger-maintained) |

- Uniqueness: UNIQUE (`product_id`, `name`) — shopper-facing dedupe +
  idempotent future writes (clarification answer).
- Rule matrix produced: required single (1,1), optional single (0,1),
  open multiple (0,NULL), capped multiple (0,N); anything else rejected.

## product_options

| Column | Type | Constraints / default |
|---|---|---|
| id | UUID PK | default `gen_random_uuid()` |
| option_group_id | UUID FK → product_option_groups(id) | NOT NULL, ON DELETE CASCADE |
| name | TEXT | NOT NULL, non-empty (CHECK `length(name) > 0`) |
| price_delta | NUMERIC(10,2) | NOT NULL DEFAULT 0 (negatives permitted, no bound) |
| sort_order | INTEGER | NOT NULL DEFAULT 0 |
| is_active | BOOLEAN | NOT NULL DEFAULT true |
| created_at / updated_at | TIMESTAMPTZ | NOT NULL DEFAULT `now()` (trigger-maintained) |

- Uniqueness: UNIQUE (`option_group_id`, `name`) (clarification answer).
- Relationship tree: products → groups → options; product delete cascades
  through both levels; group delete cascades to its options.

## Cross-cutting objects

- **Trigger**: existing `handle_updated_at()` attached to both tables (no new
  function).
- **Helper**: existing `is_admin()` reused for admin `ALL` policies.
- **Indexes**: `(product_id, is_active, sort_order)` on groups;
  `(option_group_id, is_active, sort_order)` on options.
- **RLS matrix**: both tables RLS-enabled. anon+authenticated SELECT =
  active row AND active ancestors (groups: own flag + product active;
  options: own flag + group active + product active). Authenticated `ALL`
  gated on `is_admin()`. No policies expose inactive rows; no public writes.

## Read shapes (no new tables)

- **ConfiguredProduct**: product fields + `option_groups[]` (active, ordered),
  each with `options[]` (active, ordered); `[]` for plain products. Groups
  with zero active options are omitted from the tree.
- **Listing flag**: `has_options: boolean` mapped client-side from one
  constant-count existence query (no schema change, no N+1).
- **Future cart snapshot** (not built now): group id/name + option
  id/name/delta; price = base + Σ deltas, × quantity, computed in app code.
