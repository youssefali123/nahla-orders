# Data Model: Delivery Zones

**Feature**: `004-delivery-zones` | **Date**: 2026-10-03

Additive only: existing tables untouched. IDs UUIDs defaulting to
`gen_random_uuid()`.

## delivery_zones

| Column | Type | Constraints / default |
|---|---|---|
| id | UUID PK | default `gen_random_uuid()` |
| name | TEXT | NOT NULL, UNIQUE, non-empty (CHECK `length(name) > 0`) |
| fee | NUMERIC(10,2) | NOT NULL DEFAULT 0, CHECK `fee >= 0` (0 = free delivery) |
| sort_order | INTEGER | NOT NULL DEFAULT 0 |
| is_active | BOOLEAN | NOT NULL DEFAULT true |
| created_at / updated_at | TIMESTAMPTZ | NOT NULL DEFAULT `now()` (reused trigger) |

- No foreign keys in or out (global per-order config; order messages snapshot
  name+fee as text, never reference rows).
- No seeds (research R7): empty table is valid and handled in checkout.

## Cross-cutting objects (all reused, none new)

- **Trigger**: existing `handle_updated_at()` attached to the table.
- **Helper**: existing `is_admin()` for admin `ALL` policies.
- **Index**: `(is_active, sort_order)` composite.
- **RLS matrix**: RLS-enabled; anon+authenticated SELECT restricted to
  `is_active = true`; authenticated `ALL` gated on `is_admin()`; no public
  writes.

## Read shapes (no new tables)

- **Zone**: `{ id, name, fee: number, sort_order, is_active }`; fee 0
  renders as free-delivery wording, never a zero-price line.
- **Order totals (computed)**: items total + selected zone fee = grand total;
  recomputed live at confirm; message carries all three lines.
- **Stored choice (client-side)**: zone id inside the existing
  `nahla-customer-v1` object; fallback stored → first active → unavailable.
