# Contract: Zones Data Access

**Feature**: `004-delivery-zones` | **Date**: 2026-10-03

Catalog DAL (`src/lib/catalog.ts`) gains reads; admin module
(`src/lib/admin.ts`) gains writes. Errors surface as Arabic `CatalogError` /
`AdminError`. No other modules change shape.

## Types (added)

```text
DeliveryZone { id, name, fee: number, sort_order, is_active }
```

## Functions (added)

```text
getActiveZones(): Promise<DeliveryZone[]>
  Resolves: active zones ordered by sort_order. Empty array is valid
  (caller shows the unavailable state).
  Rejects: CatalogError on backend failure.

listZonesAdmin(): Promise<DeliveryZone[]>
  Resolves: all zones ordered by sort_order (inactive included).
  Session client; managers only (RLS-enforced).

saveZone(id | null, input): Promise<void>
  Input: { name (trimmed, non-empty), fee (>= 0), sort_order, is_active }.
  Rejects: duplicate-name and invalid-fee messages verbatim.

deleteZone(id): Promise<void>
  No cascade (nothing references zones); confirm dialog states this.
```

## Changed behaviors (no signature breaks)

```text
Checkout confirm: extends live revalidation to zones (deltas + bases +
  zone fee all live); grand total replaces the items-only total in the
  message, which gains zone name, delivery fee, grand total lines.
Customer prefill object: gains zoneId alongside name/phone/address.
WhatsApp builder: appends the three delivery lines after items.
```

## Guarantees relied upon

```text
- Anonymous zone reads return active rows only; writes rejected.
- fee >= 0 enforced by CHECK; 0 means free delivery.
- Stored zone ids revalidated live; stale ids fall back, never charge wrong.
- Zero zones blocks confirm with explanation instead of a fee-less order.
```
