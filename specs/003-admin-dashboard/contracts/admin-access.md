# Contract: Admin Data Access

**Feature**: `003-admin-dashboard` | **Date**: 2026-10-03

New module `src/lib/admin.ts` (session client). Public `catalog.ts` stays
active-only and untouched. All functions throw `CatalogError`-shaped Arabic
errors; constraint violations map to the specified messages (notably the
per-parent duplicate-name message).

## Auth

```text
signInManager(email, password): Promise<void>
  Resolves on valid credentials; rejects with Arabic invalid-credentials
  message otherwise. Never creates accounts.

signOutManager(): Promise<void>

getManagerSession(): Promise<{ user } | null>
  Resolves the session plus manager-row presence; null when signed out
  or when the user has no admin_profiles row. Single verification point
  for the route guard.
```

## Unfiltered reads (inactive included, sort_order ASC)

```text
listCategoriesAdmin(): Promise<Category[]>
listSubcategoriesAdmin(categoryId?): Promise<Subcategory[]>
listProductsAdmin(filters?): Promise<Product[]>
getProductAdmin(id): Promise<ConfiguredProduct | null>
listBannersAdmin(): Promise<Banner[]>
dashboardCounts(): Promise<{ categories, products, banners, configurable }>
```

## Writes (all gated by RLS is_admin(); UI guard is display-only)

```text
saveCategory(input) / deleteCategory(id)      // delete states cascade impact
saveSubcategory(input) / deleteSubcategory(id)
saveProduct(input) / deleteProduct(id)        // states full-subtree cascade
saveOptionGroup(productId, input) / deleteOptionGroup(id)
saveOption(groupId, input) / deleteOption(id)
saveBanner(input) / deleteBanner(id)
uploadImage(prefix, file): Promise<publicUrl> // nahla-images; failure blocks save
```

## Guarantees relied upon

```text
- Writes from non-managers are rejected by RLS regardless of UI.
- CHECKs reject invalid limits/types; uniques reject per-parent duplicates.
- Deletes cascade exactly as the schema defines; confirmations quote it.
- Price preview recomputes from form values only; saved base/deltas rule.
- No admin_profiles writes, no auth-user creation, no new tables.
```
