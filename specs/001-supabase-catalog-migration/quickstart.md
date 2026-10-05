# Quickstart: Supabase Catalog Migration

**Feature**: `001-supabase-catalog-migration` | **Date**: 2026-10-03

Proves the migration end-to-end. Run sections in order; each has an expected
outcome. Details live in `data-model.md` and `contracts/data-access.md` —
nothing is duplicated here.

## Prerequisites

- Node 20+, dependencies installed (`npm install`, includes
  `@supabase/supabase-js` once implementation adds it).
- Supabase project `nahla_app` reachable; anon/publishable key on hand.
- A `.env` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
  (publishable key only — never the secret key).

## 1. Database is live and locked down

```bash
# Apply the migration (see plan.md), then verify from a shell with the ANON key:
```

- Expected: tables `categories`, `subcategories`, `products`, `banners`,
  `admin_profiles` exist; RLS enabled on all five.
- Expected: anonymous `SELECT` returns only `is_active = true` rows; anonymous
  `INSERT`/`UPDATE`/`DELETE` on any catalog table is rejected; reading
  `admin_profiles` anonymously returns nothing.

## 2. Seeds are present and rerunnable

- Expected: 5 categories (طلب مخصص has `type = 'custom_order'`), 9
  subcategories (only أكل بيتي has `requires_preorder = true`), migrated
  products with emoji icons and correct `is_featured` flags, 2 active banners
  with storage-hosted images.
- Expected: rerunning the seed step creates zero duplicate categories or
  subcategories.

## 3. Images load from storage

- Expected: bucket `nahla-images` holds the two banner images under
  `banners/`; homepage banners render from those URLs; products without photos
  render their emoji icon, never a broken image.

## 4. Website runs on live data

```bash
npm run dev
```

- Expected: `/` shows exactly the active categories/banners in catalog order;
  deactivating a category in the database hides it after refresh (no redeploy).
- Expected: a category with subcategories lists them; one without lists
  products; the custom-order tile opens `/custom-order`; the pre-order notice
  appears on the flagged subsection.
- Expected: `/search?q=لبن` returns matching products; product pages show
  database prices; cart → checkout → WhatsApp message shows current prices;
  the cart survives reload; custom-order texts never leave the device.
- Expected: with the backend blocked, pages show "حصل خطأ، حاول تاني." with
  retry — never a blank screen.

## 5. Quality gates (constitution V)

```bash
npx tsc --noEmit -p tsconfig.json   # must pass with 0 errors
```

- Expected: type check passes; every touched page rendered via the dev server
  (`/`, one category, one subcategory, one product, `/search`, `/cart`,
  `/checkout`); `admin_profiles` holds no rows; no `/admin` routes, no orders
  tables, and no secret keys exist in frontend code or the built bundle.
