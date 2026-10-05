# Contract: Options Data Access

**Feature**: `002-product-options` | **Date**: 2026-10-03

Extends `../001-supabase-catalog-migration/contracts/data-access.md`. Only
`src/lib/catalog.ts` (plus `src/lib/supabase.ts` singleton) may touch these
tables. Errors surface as `CatalogError` (Arabic message + cause).

## Types (added)

```text
OptionGroupType = 'single' | 'multiple'

OptionGroup  { id, product_id, name, type: OptionGroupType,
               min_selections: number, max_selections: number | null,
               sort_order, is_active }
ProductOption { id, option_group_id, name, price_delta: number,
                sort_order, is_active }
ConfiguredGroup  = OptionGroup & { options: ProductOption[] }
ConfiguredProduct = Product & { option_groups: ConfiguredGroup[] }
```

Rules honored by readers (enforced by DB CHECKs at write time):
single ⇒ at most one pick (max null or ≤ 1, min ≤ 1); min ≥ 0;
max null or ≥ min. Visual rule: groups with no active options are omitted.

## Functions (changed + added)

```text
getProduct(productId: string): Promise<ConfiguredProduct | null>
  Changed: now embeds active groups (ordered) each with active options
  (ordered); plain products return option_groups: []. Still null when
  missing; callers keep the inactive → unavailable vs null → not-found
  distinction. Cost: 3 indexed reads, zero N+1.

getProductsWithOptions(ids: string[]): Promise<Record<string, boolean>>
  Added: one constant-count existence query mapping each id to whether the
  product has any active option group with an active option. Empty input
  → {}. Feeds listing badges without per-product reads.
```

## Unchanged functions

`getActiveCategories`, `getActiveSubcategories`, `getCategory`,
`getSubcategory`, `getSubcategoryById`, `getActiveProducts`,
`getFeaturedProducts`, `getProductsByIds`, `getActiveBanners`,
`searchProducts` — signatures and behavior identical; existing pages are
unaffected (they ignore the new fields).

## Backend guarantees relied upon

```text
- Anonymous option reads return active rows of active products only.
- Single-group caps and min/max coherence rejected by CHECK constraints.
- price_delta is the only option price; products.price stays the base.
- Stable UUIDs on groups/options for future cart snapshots.
- No selection/cart/checkout/admin UI or tables ship in this phase.
```
