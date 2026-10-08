# Research: Delivery Zones

**Feature**: `004-delivery-zones` | **Date**: 2026-10-03

No NEEDS CLARIFICATION — spec plus the address-coexistence answer resolve everything.

## R1 — Single table, no zone-product linkage

- **Decision**: One `delivery_zones` table (name unique, fee ≥ 0, order,
  active flag, stamps); zones are global, never linked to products,
  categories, or carts.
- **Rationale**: The fee is flat per order by area; any linkage would add
  join complexity with zero required behavior.
- **Alternatives considered**: per-category delivery rules (rejected — never
  requested, over-engineering).

## R2 — RLS and trigger reuse

- **Decision**: Same posture as catalog tables — anon+authenticated SELECT
  on active rows ordered by `sort_order`, authenticated writes via existing
  `is_admin()`, reused `handle_updated_at()`, composite
  `(is_active, sort_order)` index.
- **Rationale**: Proven pattern, zero new security surface, advisors already
  clean under it.
- **Alternatives considered**: none viable.

## R3 — Totals and message shape

- **Decision**: Grand total = items total + selected zone fee, computed in
  app code at confirm from live rows. Order message appends three lines
  after the items block: zone name, delivery fee (or free-delivery wording
  for 0), grand total. Existing item lines byte-identical.
- **Rationale**: Keeps the established message format stable while making
  the fee legible; zero-fee wording avoids a confusing "0 جنيه" line.
- **Alternatives considered**: percentage/fragile formatting (rejected —
  flat fees only per spec).

## R4 — Selection state and persistence

- **Decision**: Checkout holds `selectedZoneId` in component state,
  initialized stored → first-active; persisted to `nahla-customer-v1`
  alongside name/phone/address (same write path). Stale ids fall back to
  first active; zero zones blocks confirm.
- **Rationale**: One storage object already exists for checkout prefill;
  extending it avoids a second key and keeps fallback logic in one place.
- **Alternatives considered**: separate storage key (rejected — needless
  split); URL param (rejected — leaks choice into shareable links).

## R5 — Live re-read at confirm

- **Decision**: Extend the existing checkout revalidation (which re-reads
  configured products) to also re-read active zones; recompute the grand
  total from live rows, update a changed selection silently only when the
  stored zone vanished (fall back + toast), abort with explanation when
  none remain.
- **Rationale**: Same "never trust stored money" rule already proven for
  prices, applied to fees with no new mechanism.
- **Alternatives considered**: trusting stored fee (rejected — violates the
  money rule).

## R6 — Admin placement and shape

- **Decision**: New `src/routes/admin.zones.tsx` under a "التوصيل" nav group
  (between المحتوى and الحساب), reusing the category-page pattern
  (searchable table/cards, dialog form with name/fee/order/status, toggle,
  cascade-free delete confirm, toasts). New `saveZone`/`deleteZone`/
  `listZonesAdmin` in `src/lib/admin.ts`. Home metrics unchanged (zones are
  operational config, not catalog content).
- **Rationale**: Maximum pattern reuse — the categories screen is the proven
  template; a dedicated group keeps delivery visibly separate from catalog.
- **Alternatives considered**: zones inside settings/home (rejected — CRUD
  needs a real screen); catalog-group placement (rejected — not catalog).

## R7 — Seed data

- **Decision**: No seed zones. An empty zones table is a valid state the
  checkout handles (unavailable message); real areas/fees are business data
  only the manager knows.
- **Rationale**: Invented areas or fees would charge real shoppers wrongly —
  worse than an explicit empty state.
- **Alternatives considered**: one sample zone (rejected — would appear in
  production checkout).
