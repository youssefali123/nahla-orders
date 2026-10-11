# Contract: Filter Data Access

**Feature**: `006-product-filters` | **Date**: 2026-10-03

Extends the catalog DAL and admin module. Only listing pages, the product
editor, and the section editors touch these functions.

## Types (added)

```text
DisplayFilter { id, name, sort_order }
ProductWithFilter = Product & { filter_id: string | null }
```

## Functions (added)

```text
getSectionFilters(kind: 'subcategory' | 'category', id: string): Promise<DisplayFilter[]>
  Resolves: active values of an enabled section, ordered. Empty array when
  the section is disabled, missing, or has no active values (caller hides
  the bar). Rejects: CatalogError on backend failure.

getProductsWithFilters(categoryId: string, subcategoryId?: string): Promise<ProductWithFilter[]>
  Resolves: the same rows as getActiveProducts plus each row's filter id
  (null when unassigned), via one constant-cost mapping query.
  Rejects: CatalogError on backend failure.
```

## Admin functions (added, session client)

```text
listFiltersAdmin(kind, parentId): full rows (inactive included) for editors.
saveFilter(kind, parentId, id | null, input): upsert with per-parent
  duplicate rejection surfaced verbatim; invalid parents rejected.
deleteFilter(id): removes the value; assignments vanish by cascade.
setSectionFiltering(kind, id, enabled): flips has_filters.
saveProductFilter(productId, filterId | null): sets or clears one assignment;
  cross-section values rejected (validated against the product's section).
```

## Unchanged functions

Every existing catalog and admin function keeps its exact signature and
behavior; listings without an enabled section never call the new reads.

## Guarantees relied upon

```text
- Anonymous filter reads return active values of enabled, active sections only.
- Assignments resolve only within the product's own section.
- Bar filtering is client-side over already-loaded rows: zero reads per tap.
- Deleting a value never deletes products; deleting a section cascades cleanly.
```
