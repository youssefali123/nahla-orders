# Data Model: Product Extra Price, Offers & Display Layouts

**Feature**: `007-product-pricing-and-layout` | **Date**: 2026-11-23

No new tables, no renames, no drops, no data resets. Five additive columns
with defaults, plus derived (never stored) pricing and message shapes.

## products (altered)

| Column | Type | Constraints / default |
|---|---|---|
| `extra_price` | `NUMERIC(10,2)` | `NOT NULL DEFAULT 0`, CHECK `extra_price >= 0` |
| `discount_percent` | `NUMERIC(5,2)` | `NOT NULL DEFAULT 0`, CHECK `discount_percent >= 0 AND discount_percent <= 100` |

- Existing rows automatically receive `0` / `0`, which means "no extra, no
  offer" and reproduces today's behavior exactly.
- No index is added: neither column is filtered, sorted, or joined on.
- Changes are pure `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` so the migration
  is rerunnable and safe on the live project.

## categories (altered)

| Column | Type | Constraints / default |
|---|---|---|
| `product_layout` | `TEXT` | `NOT NULL DEFAULT 'grid'`, CHECK `product_layout IN ('grid','list')` |

## subcategories (altered)

| Column | Type | Constraints / default |
|---|---|---|
| `product_layout` | `TEXT` | `NOT NULL DEFAULT 'grid'`, CHECK `product_layout IN ('grid','list')` |

- The layout is meaningful only when that row directly lists products: a
  category with no subcategories, or any subcategory.
- A category that renders subcategory tiles ignores its value until it lists
  products.
- Homepage featured products and search results never read this column.

## Derived pricing (computed, never stored)

Inputs: `base` (product `price`), `extra` (`extra_price`), `d`
(`discount_percent / 100`), `optionDeltas` (sum of selected options’
`price_delta`), `qty`.

| Value | Formula |
|---|---|
| Gross (pre-offer) unit price | `round2(base + extra + optionDeltas)` |
| Final unit price | `round2((base + extra) × (1 − d) + optionDeltas)` |
| Discount per unit | `round2((base + extra) × d)` |
| Line total | `round2(finalUnit × qty)` |
| Line additions | `round2(extra × qty)` (pre-discount) |
| Line discount | `round2((base + extra) × d × qty)` |
| Additions total | sum of line additions for all non-note lines |
| Discount total | sum of line discounts for all non-note lines |
| Order total | sum of rounded line totals |
| Service fee | `round2(orderTotal × serviceFeePercent / 100)` |
| Grand total | `round2(orderTotal + deliveryFee + serviceFee)` |

- `round2(n) = Math.round(n × 100) / 100`.
- Custom-order lines (`note` present) have no pricing math and keep `0` price.
- `discount_percent = 0` → gross equals final; no offer state.
- `discount_percent = 100` → combined base + extra is free; option deltas
  remain payable; never negative.

## CartItem (browser `localStorage`, not a database table)

Source: `src/lib/cart.tsx`, key `nahla-cart-v1`.

| Field | Type | Notes |
|---|---|---|
| `key` | `string` | Existing line identity (product + sorted option ids) |
| `id` | `string` | Product id, or `custom-<timestamp>` |
| `name` | `string` | Snapshot |
| `price` | `number` | Base price snapshot (unchanged meaning) |
| `extraPrice` | `number?` | **New**, optional; missing/legacy = `0` |
| `discountPercent` | `number?` | **New**, optional; missing/legacy = `0` |
| `icon`, `image`, `qty`, `note`, `selectedOptions`, `subcategoryId`, `subcategoryName` | existing | Unchanged |

- `normalizeItem` fills missing/invalid `extraPrice` and `discountPercent`
  with `0`, so pre-feature carts load unchanged.
- `unitPriceOf` uses the shared formula and ignores the fields for notes.
- `useLiveProducts` reconciliation refreshes `price`, `extraPrice`, and
  `discountPercent` from the current catalog; stored values remain the fallback
  while the lookup is in flight or unavailable.

## Order message line (computed)

Source: `src/lib/whatsapp.ts` and `src/services/send_order.ts` (transport
unchanged).

| Field | Source | Rule |
|---|---|---|
| `name`, `qty` | cart line | Always shown |
| Base price | reconciled product | Shown as today |
| `selectedOptions[]` | cart line | Itemized as today, deltas per unit |
| `extra` | reconciled `extra_price` | Addition line only when `> 0` |
| `discountPercent` | reconciled `discount_percent` | Discount line only when `> 0` |
| Line total | derived | `finalUnit × qty` |
| Additions total | derived | Emitted only when any line has `extra > 0` |
| Discount total | derived | Emitted only when any line has `discount > 0` |

## Validation rules

| Rule | Where enforced | Message / behavior |
|---|---|---|
| `extra_price >= 0` and finite | admin form + DB CHECK | "السعر الإضافي يجب أن يكون صفرًا أو أكثر" |
| `0 <= discount_percent <= 100` and finite | admin form + DB CHECK | "نسبة الخصم يجب أن تكون بين 0 و 100" |
| Empty/NaN parses to `0` | admin form + read normalization | No offer / no extra |
| Layout only `grid` or `list` | DB CHECK + typed union | Falls back to `grid` on unknown legacy values |
| 100% discount never negative | pricing helper | Phones free; options only |

## Relationships

- `products.category_id → categories.id` (unchanged, CASCADE).
- `products.subcategory_id → subcategories.id` (unchanged, SET NULL).
- No new foreign keys; pricing columns belong to the product row and the layout
  columns belong to their section row.

## RLS and security posture

- No policy changes. New columns inherit the existing table policies:
  anon/authenticated SELECT on active catalog rows; writes gated by
  `public.is_admin()`.
- No service-role key is introduced anywhere in the frontend.
- No new database functions, triggers, or grants.

## Migration and rollback

- File: `specs/007-product-pricing-and-layout/migration.sql`.
- Apply once in the Supabase SQL editor; rerunnable.
- Backfill is implicit through `NOT NULL DEFAULT`.
- Rollback (only if ever needed) is dropping the five columns; it is not part
  of the feature and is not automated.
- No test rows, seeds, or sample prices are inserted.

## Worked examples

| Scenario | Base | Extra | Discount | Options | Gross unit | Final unit |
|---|---|---|---|---|---|---|
| No pricing changes | 100 | 0 | 0% | 0 | 100 | 100 |
| Extra only | 100 | 20 | 0% | 0 | 120 | 120 |
| Offer only | 100 | 0 | 20% | 0 | 100 | 80 |
| Both (clarified order) | 100 | 20 | 20% | 0 | 120 | 96 |
| Both + option | 100 | 20 | 20% | +10 | 130 | 106 |
| Full discount | 100 | 20 | 100% | +10 | 130 | 10 |
| Decimals | 99.90 | 10.05 | 15% | +2.50 | 112.45 | 95.96 |

For the "both" row, three units produce an additions total of `60`, a discount
total of `72`, and an order total of `288`.
