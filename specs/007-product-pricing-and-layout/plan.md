# Implementation Plan: Product Extra Price, Offers & Display Layouts

**Branch**: `007-product-pricing-and-layout` | **Date**: 2026-11-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-product-pricing-and-layout/spec.md`

## Summary

Add two optional pricing attributes to every product (a flat per-unit extra
amount and a 0–100% discount), a per-section product layout preference
(current grid or full-width list), and a three-across subcategory grid. The
shopper-facing price becomes `(base + extra) × (1 − discount%) + option
deltas` everywhere: listings, product page, cart, checkout, service fee,
and the Telegram order message. The Telegram message itemizes the extra
amount per line and reports an additions total, plus the discount applied.
All changes are additive: five defaulted columns, no new tables, no data
deletion, no new dependencies, and the existing Supabase/no-database
fallback stays intact.

## Technical Context

**Language/Version**: TypeScript 5.8 (strict, bundler resolution), React 19.2

**Primary Dependencies**: TanStack Start 1.x (SSR), TanStack Router 1.x, Tailwind CSS v4, `@supabase/supabase-js` 2.x, react-hot-toast/sonner, lucide-react

**Storage**: Supabase Postgres with RLS + Storage for catalog images; cart and customer info in browser `localStorage` (`nahla-cart-v1`, `nahla-customer-v1`); no cart/order tables

**Testing**: Project has no test runner. Verification is `npx tsc --noEmit`, `npm run build`, and manual dev-server rendering of touched routes plus a real Telegram test message. Pure pricing helpers stay deterministic so they can be unit-tested later without refactoring.

**Target Platform**: Mobile-first RTL Arabic web app, SSR on Vercel

**Project Type**: Single TanStack Start web application

**Performance Goals**: Zero additional network requests when rendering listings (new columns arrive with existing `select("*")`); price recomputation under 1 ms per product; filter/layout switches remain client-side with no reload.

**Constraints**: Preserve Arabic RTL design and existing card interactions; no destructive or non-rerunnable SQL; no service-role key in the browser; admin writes remain RLS-gated; app must keep working when `SUPABASE_ENABLED = false` (custom order only); never rewrite published git history (Lovable).

**Scale/Scope**: ~5 categories, ~15 subcategories, ~50 products; 2 storefront pricing surfaces (listing card, product page) + cart/checkout; 3 admin screens touched (product editor, categories, subcategories); 1 migration; 2 message surfaces (direct Telegram send and WhatsApp text builder).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status | Evidence |
|-----------|------|--------|----------|
| I. Supabase Is the Source of Truth | Pricing and layout values live in the catalog, not hard-coded UI | PASS | Five defaulted columns on `products`, `categories`, `subcategories`; UI reads them through `src/lib/catalog.ts`; no hard-coded product prices or section layout |
| II. Client-Side Commerce Boundaries | Cart stays local; no orders/customers/payments tables; service role never in browser; RLS enforced | PASS | Only `localStorage` cart changes; no new tables; Telegram send stays client-side; migration adds columns under existing table policies |
| III. Type Safety and Data-Access Discipline | Typed data layer, no scattered queries, no `any`, efficient reads | PASS | Types extended in `src/lib/catalog.ts` and `src/lib/admin.ts`; pricing logic centralized in a typed pure module; no new queries or N+1 |
| IV. Arabic-First UX Preservation | Arabic copy, existing visual language, loading/error/empty states, live prices in messages | PASS | Arabic labels/validation/badges; existing cards and RTL preserved; message builder reads live reconciled values |
| V. Verification Before Done | `tsc --noEmit`, rendered pages, reproducible migration, no destructive DB changes | PASS | Plan includes full verification matrix; migration is additive and rerunnable; no drops/resets |

**Post-design re-check**: All five gates still pass. No violations, so
Complexity Tracking stays empty.

## Project Structure

### Documentation (this feature)

```text
specs/007-product-pricing-and-layout/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── migration.sql        # Rerunnable additive migration
├── quickstart.md        # Phase 1 validation guide
├── contracts/
│   ├── pricing.md       # Formula, rounding, helper contract
│   ├── message.md       # Telegram/WhatsApp message contract
│   └── ui.md            # Storefront + admin UI contracts
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit.tasks — not created here)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── ProductCard.tsx          # Grid card + new list item + layout-aware grid
│   └── PriceBlock.tsx           # (new) shared old/new price + offer badge
├── lib/
│   ├── pricing.ts               # (new) pure pricing helpers + rounding
│   ├── catalog.ts               # Product/Category/Subcategory types + numeric normalization
│   ├── cart.tsx                 # CartItem pricing snapshot + unitPriceOf
│   ├── whatsapp.ts              # buildOrderMessage additions/discount lines
│   └── admin.ts                 # Admin input types and numeric mapping
├── routes/
│   ├── index.tsx                # Featured grid stays default
│   ├── search.tsx               # Search grid stays default
│   ├── category.$categoryId.index.tsx
│   ├── category.$categoryId.$subId.tsx
│   ├── product.$productId.tsx
│   ├── cart.tsx
│   ├── checkout.tsx
│   ├── admin.product-editor.tsx
│   ├── admin.products.tsx
│   ├── admin.categories.tsx
│   └── admin.subcategories.tsx
└── services/
    └── send_order.ts            # Unchanged transport; message content changes upstream
```

**Structure Decision**: Single existing TanStack Start app. No new packages,
no new tables, no new routes. New code is limited to one pure helper module,
one small shared price component, and edits to the existing catalog, cart,
checkout, message, and admin files.

## Implementation Approach

### Slice 1 — Data + pricing core

1. Add the rerunnable migration (`migration.sql`) with five columns and CHECK
   constraints.
2. Extend `Product`, `Category`, and `Subcategory` types; normalize numeric
   fields in `toProduct` and admin list mapping; default the fallback
   category layout to `grid`.
3. Create `src/lib/pricing.ts` as the single source of truth for:
   - `round2`
   - `normalizeExtraPrice` / `normalizeDiscountPercent`
   - `unitPrice({ base, extra, discount }, optionDeltas)`
   - `grossUnitPrice({ base, extra }, optionDeltas)`
   - `discountAmount(...)`, `isOnOffer(...)`
   - `lineTotal(...)`, `lineExtraTotal(...)`, `lineDiscountTotal(...)`
4. Add `extraPrice` / `discountPercent` to `CartItem` as optional fields so
   existing `localStorage` carts keep working (missing = 0).

### Slice 2 — Money paths

5. Update `unitPriceOf` in `cart.tsx` and pass the two fields at every `add()`
   call site (grid card, list item, product page). Keep custom-order lines at
   zero.
6. Update `cart.tsx` and `checkout.tsx` live reconciliation to use live
   `extra_price` / `discount_percent`, and replace ad-hoc price math with the
   shared helpers. Line totals, order total, service fee, delivery, and grand
   total must all use rounded line totals.
7. Update `buildOrderMessage` to emit, per discounted/extra line:
   - the final line total,
   - an addition line (`إضافة: +N جنيه`),
   - a discount line (`خصم X%: -N جنيه`),
   and, after the item list, optional `إجمالي الإضافات` and `إجمالي الخصم`
   summaries. Skip both entirely when zero. The additions total uses the
   configured extra before discount, per the spec edge case.
8. Re-check the checkout submit path (`priced`, `liveTotal`, `liveServiceFee`)
   so the message and the amounts shown on screen are derived from the same
   helper output.

### Slice 3 — Storefront presentation

9. Add a shared `PriceBlock` used by grid card, list item, product page, cart,
   and checkout line:
   - normal: single final price;
   - offer: old price struck through, final price, `خصم X%` badge;
   - extra-only: single final price (extra stays implicit, per spec).
10. Extend `ProductGrid` with an optional `layout` prop. `grid` keeps today's
    classes; `list` renders one full-width horizontal card per row with the
    image on the physical left in RTL and name/description/price/actions on the
    right. Default is `grid`, so home, search, and featured stay unchanged.
11. Pass `category.product_layout` / `sub.product_layout` on the two section
    routes only. Categories that render subcategories ignore the value.
12. Change the subcategory tile container to `grid-cols-3` on phones and keep
    at least three columns on wider screens (`sm:grid-cols-3 md:grid-cols-4
    lg:grid-cols-6` or equivalent), with wrapping names and no horizontal
    overflow.
13. Update the product detail page to use `PriceBlock` and shared pricing for
    the selected-options total; pass both pricing fields on add.

### Slice 4 — Admin controls

14. `ProductInput` + product editor: add "سعر إضافي" and "نسبة الخصم" fields
    with validation (`extra >= 0`, `0 <= discount <= 100`, finite numbers) and
    a live preview showing the customer-facing price and the pre-offer price.
    Mirror the fields in the products-list quick toggle payload.
15. `CategoryInput` / `SubcategoryInput` + dialogs: add a layout selector
    ("الشبكة الحالية" vs "منتج بعرض الشاشة") with the grid as default; add a
    hint that the setting applies only when the section lists products
    directly.
16. Optional but low-cost: show the final price with an offer hint in the admin
    products table so managers can spot offers quickly.

### Slice 5 — Verification

17. Run `npx tsc --noEmit` and `npm run build`.
18. Render home, a category with subcategories, a subcategory with products, a
    discounted product, cart, checkout, and the three admin screens.
19. Send one test order to the Telegram test chat and confirm the additions
    total, discount line, and grand total.
20. Re-check security/performance advisories only if the migration is applied
    to the remote project; column-only changes do not alter RLS.

## Design Decisions

- **Pricing fields on `products`** rather than a separate table: 1:1, two
  scalars, always read with the product, defaulted.
- **Layout field on both `categories` and `subcategories`** rather than a JSON
  settings blob: explicit, checkable, and per-section per clarification.
- **Keep `CartItem.price` as the base price** and add two optional fields
  rather than storing only the final price: preserves old/new display,
  discount math, and legacy cart compatibility.
- **Centralize money math** in `pricing.ts`: the cart, checkout screen,
  checkout submit, and message builder must not re-implement the formula.
- **Round at unit/line/total boundaries with `round2`** to prevent float drift;
  service fee and grand total keep existing rounding.
- **No scheduling, no fixed-amount discounts, no separate additions table**:
  all excluded by clarification/scope.

## Complexity Tracking

No constitution violations. No new architecture, tables, packages, or
background jobs. Complexity stays within the existing single-app structure.
