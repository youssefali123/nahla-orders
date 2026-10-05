# Research: Product Options (Variants & Add-ons)

**Feature**: `002-product-options` | **Date**: 2026-10-03

No NEEDS CLARIFICATION — spec plus two clarification answers resolve everything.

## R1 — Nested fetch strategy for the configured product

- **Decision**: Three constant-count queries in `getProduct`: product row (1),
  active groups of the product ordered (1), active options of those groups
  ordered (1). Assemble the tree in code.
- **Rationale**: supabase-js nested-embed syntax for filtered + ordered
  grandchildren is brittle and risks over-fetching inactive rows; three
  indexed queries are trivially fast at this scale and each filters
  active-only at the database.
- **Alternatives considered**: single embedded
  `select(*, groups(*, options(*)))` (rejected — nested filter/order
  awkwardness, inactive-row leakage); per-group option queries (rejected —
  N+1, violates the efficiency principle).

## R2 — Has-options flag for listings without N+1

- **Decision**: New helper `getProductsWithOptions(ids)` issuing one query
  (`select product_id from product_option_groups where product_id in (...)
  and is_active`) plus, only when needed, one options-existence check per
  group set — folded into a single round-trip pair; listings map ids to a
  boolean in code.
- **Rationale**: supabase-js cannot project computed columns; one extra
  constant-count query per listing page satisfies SC-006 with no schema
  additions.
- **Alternatives considered**: database view (rejected — extra DB object for
  a boolean); per-product existence checks (rejected — N+1).

## R3 — RLS scoping options to active products

- **Decision**: Group SELECT policy:
  `is_active AND EXISTS (SELECT 1 FROM products p WHERE p.id = product_id
  AND p.is_active)`; option SELECT policy: `is_active AND EXISTS (SELECT 1
  FROM product_option_groups g JOIN products p ON p.id = g.product_id WHERE
  g.id = option_group_id AND g.is_active AND p.is_active)`. No `auth.*`
  calls inside (pure row checks → no initplan penalty). Admin `ALL` policies
  via existing `is_admin()`.
- **Rationale**: Enforces "options of inactive products invisible" at the
  database, keeping the DAL free of manual active-product joins.
- **Alternatives considered**: DAL-side filtering with宽 policies (rejected —
  leaks inactive data to anyone with the anon key).

## R4 — Uniqueness per parent (from clarification)

- **Decision**: `UNIQUE(product_id, name)` on groups,
  `UNIQUE(option_group_id, name)` on options.
- **Rationale**: Prevents visually identical duplicate choices and gives
  future admin writes natural idempotency keys.
- **Alternatives considered**: no uniqueness (rejected in clarification —
  confusing duplicates, harder upserts).

## R5 — Single-type cap enforcement

- **Decision**: CHECK `(type = 'multiple' OR max_selections IS NULL OR
  max_selections <= 1)` plus CHECK `(type = 'multiple' OR min_selections <=
  1)`, combined with `min_selections >= 0` and `(max_selections IS NULL OR
  max_selections >= min_selections)`.
- **Rationale**: Four small CHECKs compose exactly the documented rule table
  (required/optional single, open/capped multiple) with clear violation
  errors.
- **Alternatives considered**: trigger-based validation (rejected — CHECKs
  suffice, no procedural code to maintain).

## R6 — Delta bounds

- **Decision**: `price_delta NUMERIC(10,2) NOT NULL DEFAULT 0`, no negativity
  CHECK (legitimate discount/removal cases per brief).
- **Rationale**: Brief explicitly permits negatives; validation belongs to
  future UI guidance, not the schema.

## R7 — Trigger/index reuse

- **Decision**: Attach existing `handle_updated_at()` to both tables;
  indexes `(product_id, is_active, sort_order)` and `(option_group_id,
  is_active, sort_order)` (FK columns get btree support from these
  composites; no extra single-column FK indexes).
- **Rationale**: Zero new functions, consistent with the established pattern.

## R8 — Verification with zero residue (from clarification)

- **Decision**: Create one TEMP product + groups + options, run the full
  matrix (valid shapes, invalid rejections, RLS allow/deny, cascade by
  deleting the temp product and separately a temp group), then confirm zero
  residue by counts. No persistent demo rows.
- **Rationale**: Temp-product cascade proves product deletion end-to-end and
  guarantees no fake production options remain.
- **Alternatives considered**: temp groups on a real product (rejected —
  touches production rows unnecessarily).

## R9 — DAL shape extension

- **Decision**: `getProduct` returns `ConfiguredProduct` (product fields +
  `option_groups[]`, each with `options[]`; empty array for plain products).
  Listings keep the `Product` shape plus a client-mapped `has_options`
  boolean. No new route files, no component changes.
- **Rationale**: Backward compatible — existing pages ignore the new fields
  until the selection UI phase consumes them.
