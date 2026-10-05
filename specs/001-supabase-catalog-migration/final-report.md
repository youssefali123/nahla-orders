# Final Implementation Report: Supabase Catalog Migration

**Feature**: `001-supabase-catalog-migration` | **Date**: 2026-10-03
**Project**: Supabase `nahla_app` (`gcrcfsuydfmsaclwubzj`, eu-west-1)

## 1. Database tables created

`categories`, `subcategories`, `products`, `banners`, `admin_profiles` —
UUID PKs (`gen_random_uuid()`), `TIMESTAMPTZ` stamps, plus clarification-driven
columns: `icon` on categories/subcategories/products, `is_featured` on
products, `link_url` + `unit` where needed. 8 migrations applied, all via
`supabase_apply_migration`.

## 2. Columns created

Per `data-model.md`: names (NOT NULL), `icon`/`image_url` (nullable),
`sort_order` (default 0), `is_active` (default true), `type` (CHECK
normal/custom_order), `requires_preorder`, `price NUMERIC(10,2)` (CHECK ≥ 0),
`description`, `unit`, `subcategory_id` (nullable), `is_featured`,
`link_type` (CHECK 5 values), `link_id` (no FK by design), `link_url`,
`admin_profiles.role` (CHECK admin, FK `auth.users`).

## 3. Relationships

Category → subcategories/products (CASCADE); product → subcategory (SET NULL,
nullable for both category shapes); `link_id` intentionally FK-less with
homepage fallback; `admin_profiles.id` → `auth.users(id)` CASCADE.

## 4. Indexes

`(is_active, sort_order)` on categories/banners; `(category_id, …)` and
`(subcategory_id, …)` composites on subcategories/products; partial
`products(is_featured) WHERE is_active AND is_featured`.

## 5. RLS policies

RLS on all 5 tables. Anon+authenticated SELECT restricted to active rows;
authenticated writes gated on `SECURITY DEFINER` `is_admin()` (fixed
search_path, no recursion); `admin_profiles` deny-by-default + owner self-read
(`(select auth.uid()) = id` initplan-safe). Live-proven: anon writes → 42501,
anon storage writes → RLS violation, `admin_profiles` invisible (0 rows).

## 6. Storage bucket/policies

`nahla-images` (public flag ON — required for the public URL path; lesson
learned after a private bucket returned `NoSuchBucket`), folders per entity,
anon SELECT policy, admin-only writes. 2 banner JPEGs uploaded with
migration-time rights; both serve HTTP 200.

## 7. Seed data

5 categories (طلب مخصص = `custom_order`), 9 subcategories (only أكل بيتي
pre-order), 42 products (names/prices/units/descriptions/icons/order kept,
7 featured), 2 banners linked to seeded categories. Rerun-safe (conflict +
NOT EXISTS guards; rerun changed 0 rows) and live-proven (deactivation hides
a category with no redeploy).

## 8. Images migrated

`banner-hero.jpg` + `banner-offers.jpg` → storage `banners/`; DB rows reference
public URLs. Products/categories keep emoji icons with photo-first fallback —
no product lost its visual.

## 9. Static files replaced

`src/data/catalog.ts` deleted (zero imports proven by grep). Converts:
`__root` loader, `Navbar`, `BannerCarousel` (resolved targets), `index`,
category, subcategory, product, search routes, `ProductCard`, cart lib/route,
checkout. `custom-order.tsx`, `whatsapp.ts`, `site.ts` untouched (verified
catalog-free).

## 10. Data-access layer created

`src/lib/supabase.ts` (singleton anon client, Arabic missing-env error) +
`src/lib/catalog.ts` (11 typed functions per `contracts/data-access.md`,
zero `any`): active categories/subcategories/products, single fetchers,
featured, banners, ilike search (blank → [], cap 50), batch `getProductsByIds`
+ `getSubcategoryById` for reconciliation and banner targets.

## 11. Public pages converted to Supabase

All catalog pages load via route loaders (SSR first paint): homepage grid +
banners + most-ordered, dynamic sub-or-products navigation, custom-order
redirect (307 proven), pre-order notice from flag, product unavailable vs
404 states (both proven live), search, cart/checkout on live prices with
unavailable exclusion. `tsc --noEmit` clean; every page HTTP 200 on live data.

## 12. Remaining issues & manual actions

- **Rotate the Supabase secret key** (Project Settings → API): it previously
  lived in `src/env.txt` / `src/.env` (secret lines now removed, but treat the
  old key as exposed). This is the sole outstanding security action.
- Linter WARNs kept by design: `is_admin()` callable by anon/authenticated
  (required for policy evaluation; boolean-only, no data leak), overlapping
  public/admin SELECT policies (standard pattern, negligible at this scale),
  unused-index INFOs (fresh tables, no traffic yet).
- Legacy slug URLs (`/category/market`) now 404 by design (UUID routing, no
  slug column per anti-over-engineering decision).
- Deferred to later phases: admin dashboard (foundation ready), Arabic search
  normalization, product photos beyond the 2 banners.
