# Contract: Catalog Data-Access Layer

**Feature**: `001-supabase-catalog-migration` | **Date**: 2026-10-03

This is the only interface presentation code may use to reach catalog data
(FR-012). No Supabase client imports outside `src/lib/supabase.ts` and
`src/lib/catalog.ts`. All functions return active records ordered by
`sort_order ASC` unless noted, and throw a localizable `CatalogError` on
backend failure (callers map it to "حصل خطأ، حاول تاني." with retry).

## Types

```text
Category     { id, name, icon: string|null, image_url: string|null,
               sort_order, is_active, type: 'normal'|'custom_order' }
Subcategory  { id, category_id, name, icon: string|null, image_url: string|null,
               sort_order, is_active, requires_preorder }
Product      { id, category_id, subcategory_id: string|null, name,
               price: number, icon: string|null, image_url: string|null,
               description: string|null, unit: string|null, sort_order,
               is_active, is_featured }
Banner       { id, title: string|null, image_url, sort_order, is_active,
               link_type: 'category'|'subcategory'|'product'|'custom'|'none'|null,
               link_id: string|null, link_url: string|null }
CatalogError { message: string, cause?: unknown }
```

Visual rule (binding): when rendering any entity, use `image_url` if present,
else `icon` emoji, else the generic placeholder. Never render a broken image.

## Functions

```text
getActiveCategories(): Promise<Category[]>
  Resolves: all active categories ordered by sort_order.
  Rejects: CatalogError when the backend is unreachable.

getActiveSubcategories(categoryId: string): Promise<Subcategory[]>
  Resolves: active subcategories of the category, ordered by sort_order.
            Empty array when the category has none (caller shows products).
  Rejects: CatalogError on backend failure.

getCategory(categoryId: string): Promise<Category|null>
  Resolves: the category regardless of active flag (routing needs to
            distinguish "missing" from "inactive"), or null.
  Rejects: CatalogError on backend failure.

getSubcategory(categoryId: string, subId: string): Promise<Subcategory|null>
  Resolves: the subcategory when it belongs to the category, else null.
  Rejects: CatalogError on backend failure.

getSubcategoryById(subId: string): Promise<Subcategory|null>
  Resolves: the subcategory by id (banner target resolution), or null.
  Rejects: CatalogError on backend failure.

getActiveProducts(categoryId: string, subcategoryId?: string): Promise<Product[]>
  Resolves: active products of the category, optionally narrowed to one
            subcategory, ordered by sort_order.
  Rejects: CatalogError on backend failure.

getFeaturedProducts(limit?: number): Promise<Product[]>
  Resolves: active products with is_featured ordered by sort_order,
            default limit 12. Feeds the homepage "most-ordered" section.
  Rejects: CatalogError on backend failure.

getProduct(productId: string): Promise<Product|null>
  Resolves: the product regardless of active flag (detail page decides
            unavailable vs not-found), or null.
  Rejects: CatalogError on backend failure.

getProductsByIds(ids: string[]): Promise<Product[]>
  Resolves: active products matching the ids in a single query (cart
            reconciliation without N+1); empty array for empty input.
  Rejects: CatalogError on backend failure.

getActiveBanners(): Promise<Banner[]>
  Resolves: active banners ordered by sort_order.
  Rejects: CatalogError on backend failure.

searchProducts(query: string): Promise<Product[]>
  Input: raw user text; blank/whitespace-only input short-circuits to [].
  Resolves: active products whose name contains the query (case-insensitive
            substring), ordered by sort_order, capped at 50.
  Rejects: CatalogError on backend failure.
```

## Backend guarantees the UI relies on

```text
- Anonymous reads return active rows only; anonymous writes are all rejected.
- subcategory_id on products is nullable; category deletes cascade;
  subcategory deletes null the product link.
- Prices are non-negative numerics; clients format with two decimals max
  and the site currency label (pricing source: database, never hard-coded).
- Banner targets: category/subcategory/product resolve link_id against the
  matching table; custom uses link_url; none/dangling targets fall back
  to the homepage route.
- Seeds are idempotent: rerunning never duplicates categories/subcategories.
```

## Out of contract (explicitly not provided)

Cart persistence, checkout, order sending, customer data, authentication
flows, and any admin write operations — none exist in this phase.
