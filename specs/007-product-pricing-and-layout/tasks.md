---

description: "Task list for feature 007 product pricing and display layouts"
---

# Tasks: Product Extra Price, Offers & Display Layouts

**Input**: Design documents from `/specs/007-product-pricing-and-layout/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: No automated test framework exists in this project and no TDD
approach was requested. Verification tasks are manual acceptance checks tied
to `quickstart.md`; the pure pricing helpers are written so tests can be added
later without refactoring.

**Organization**: Tasks are grouped by user story. Because the storefront
surfaces (`ProductCard.tsx`, `cart.tsx`, `checkout.tsx`, `whatsapp.ts`) are
shared, the recommended execution order is US1 → US2 → US3 → US4 → US5, even
though each story remains independently testable after the shared foundation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: `US1`–`US5`, mapped to `spec.md`
- Exact file paths are included in every task

## Path Conventions

Single TanStack Start app: source under `src/`, documentation under `specs/007-product-pricing-and-layout/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the baseline and make the additive schema available.

- [X] T001 Capture the current baseline: run `npx tsc --noEmit`, start the dev server, and record today's prices/layouts for home, one category with subcategories, one subcategory with products, a product page, cart, and checkout, following `specs/007-product-pricing-and-layout/quickstart.md` sections 1–3
- [X] T002 Apply `specs/007-product-pricing-and-layout/migration.sql` in the Supabase SQL editor, run it twice to prove it is rerunnable, and confirm the verification query returns `products.extra_price`, `products.discount_percent`, `categories.product_layout`, and `subcategories.product_layout` with defaults `0`, `0`, and `'grid'`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types, pricing engine, cart shape, price display, and live
pricing wiring that every story depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T003 [P] Extend `src/lib/catalog.ts`: add `extra_price: number` and `discount_percent: number` to `Product`, add `product_layout: "grid" | "list"` to `Category` and `Subcategory`, normalize all three numerics/layouts in `toProduct`/getters (conform to `extra_price NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (extra_price >= 0)` and `discount_percent NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100)`), and add `product_layout: "grid"` to `FALLBACK_CUSTOM_ORDER_CATEGORY`
- [X] T004 [P] Create `src/lib/pricing.ts` implementing the contract in `specs/007-product-pricing-and-layout/contracts/pricing.md`: `round2`, `normalizeExtraPrice`, `normalizeDiscountPercent`, `isOnOffer`, `grossUnitPrice`, `unitPrice`, `discountPerUnit`, `lineTotal`, `lineExtraTotal`, `lineDiscountTotal`, with the formula `(base + extra) × (1 − discount/100) + optionDeltas`
- [X] T005 Extend `src/lib/admin.ts`: add `extra_price: number` and `discount_percent: number` to `ProductInput`, add `product_layout: "grid" | "list"` to `CategoryInput` and `SubcategoryInput`, normalize the two product numerics in `listProductsAdmin`/`getProductAdmin`, ensure save payloads include the new fields, and initialize the existing category/subcategory form state (`src/routes/admin.categories.tsx`, `src/routes/admin.subcategories.tsx`) with `product_layout: row.product_layout ?? "grid"` so the project still type-checks before the selectors land
- [X] T006 Extend `src/lib/cart.tsx`: add optional `extraPrice?: number` and `discountPercent?: number` to `CartItem`; make `normalizeItem` default missing/non-finite/negative values to `0`; change `unitPriceOf` to call `src/lib/pricing.ts`; keep custom-order (`note`) lines at `0` and keep the existing line key behavior
- [X] T007 [P] Create `src/components/PriceBlock.tsx` per `contracts/ui.md`: render a normal final price, or an offer with the old price struck through, the new price, and a `خصم X%` badge; use semantic strike markup, support the existing currency/unit suffix, and never render negative values
- [X] T008 [P] Update `src/routes/cart.tsx` to use the live `extra_price`/`discount_percent` from `useLiveProducts` and `src/lib/pricing.ts` for unit price, line total, order total, and service fee; keep the stored snapshot fallback while live data loads
- [X] T009 [P] Update `src/routes/checkout.tsx` to carry live `extra_price`/`discount_percent` through `baseOf`/`priced`/`liveTotal`, and compute the displayed total, service fee, grand total, and message total from the shared pricing helpers (legacy lines without the fields behave as `0`/`0`)

**Checkpoint**: Foundation ready — the pricing formula, types, cart shape, and price display are in place.

---

## Phase 3: User Story 1 — Manager adds an extra amount to a product (Priority: P1) 🎯 MVP

**Goal**: A manager can set a flat per-unit extra amount; shoppers see and pay
the final price; the Telegram message itemizes the addition and its total.

**Independent Test**: Set base `100` + extra `20` on a test product, verify
every surface shows `120`, order quantity `3`, and confirm the message reports
an addition of `60` with an additions total of `60` (`quickstart.md` sections
5 and 8).

### Implementation for User Story 1

- [X] T010 [P] [US1] Update `src/components/ProductCard.tsx` to display the final unit price using `unitPrice` with `extra_price`, and pass `extraPrice` plus the current `discountPercent` in the `add()` call from the grid card (offer styling arrives in US2)
- [X] T011 [P] [US1] Update `src/routes/product.$productId.tsx` to compute the unit price with `extra_price` and selected option deltas, display the final amount, and pass `extraPrice` plus `discountPercent` on add
- [X] T012 [P] [US1] Update `src/lib/whatsapp.ts` to use `lineTotal`/`lineExtraTotal` from `src/lib/pricing.ts`: emit `↳ إضافة: +N جنيه` per line with an extra and `💵 إجمالي الإضافات: N جنيه` after the items only when the total is above zero; keep custom-order and zero-extra lines unchanged
- [X] T013 [US1] Update `src/routes/admin.product-editor.tsx` to add the `extra_price` input (number, minimum `0`, decimals allowed), include both new pricing fields in the `EMPTY` form and existing-product load (`discount_percent` defaults to `0`, not yet rendered), validate `>= 0` and finite with the Arabic message "السعر الإضافي يجب أن يكون صفرًا أو أكثر", and show a live final-price preview
- [X] T014 [P] [US1] Update `src/routes/admin.products.tsx` so the quick active/inactive toggle payload includes `extra_price: Number(row.extra_price)` and `discount_percent: Number(row.discount_percent)` so neither value is wiped
- [X] T015 [US1] Verify User Story 1 with `specs/007-product-pricing-and-layout/quickstart.md` sections 5 (extra only) and 8: `100 + 20 = 120` in listing, product page, cart, checkout, and message; quantity `3` gives line total `360` and additions total `60`; clearing the extra restores today's behavior

**Checkpoint**: User Story 1 is fully functional and independently testable as the MVP.

---

## Phase 4: User Story 2 — Manager puts a product on offer (Priority: P1)

**Goal**: A manager can set a 0–100% discount; shoppers see the old price,
new price, and an offer badge everywhere, and all totals/messages use the
discounted amount.

**Independent Test**: Apply `20%` to a `100` product and confirm `100` is
struck through, `80` is the new price, the badge appears, and cart/checkout/
message all use `80`; then remove the discount and confirm normal rendering
(`quickstart.md` sections 5 and 8).

### Implementation for User Story 2

- [X] T016 [US2] Update `src/components/ProductCard.tsx` to use `PriceBlock` offer rendering (old struck price, new price, `خصم X%` badge) and pass `discountPercent` in the `add()` call; keep the no-offer state identical
- [X] T017 [US2] Update `src/routes/product.$productId.tsx` to show the old gross price, the discounted price, and the offer badge, compute the total from the discounted `(base + extra)` plus option deltas, and pass `discountPercent` on add
- [X] T018 [P] [US2] Update `src/routes/cart.tsx` so discounted lines show the old price struck through and the new price while line totals, order total, and service fee use the discounted amount
- [X] T019 [P] [US2] Update `src/routes/checkout.tsx` so the order summary shows old/new prices per discounted line and the submit-time `priced`/`liveTotal`/`liveServiceFee`/`liveGrandTotal` all use the discount
- [X] T020 [P] [US2] Update `src/lib/whatsapp.ts` to emit `↳ خصم X%: -N جنيه` per discounted line and `🏷️ إجمالي الخصم: N جنيه` after the items only when the discount total is above zero
- [X] T021 [US2] Update `src/routes/admin.product-editor.tsx` to render the `discount_percent` input (number, `0`–`100`, decimals allowed) using the already-loaded form field, validate the range with "نسبة الخصم يجب أن تكون بين 0 و 100", state that offers have no scheduling, and preview the old/new price
- [X] T022 [P] [US2] Update `src/routes/admin.products.tsx` so the price cell shows the final price plus an offer hint, and confirm the quick toggle payload still preserves both `extra_price` and `discount_percent`
- [X] T023 [US2] Verify User Story 2 with `quickstart.md` sections 5 and 8: `100` at `20%` shows struck `100`, new `80`, badge in all listings/cart/checkout; the message shows the discount line and total; `0%` shows no badge; `100%` never goes negative; decimals match the contract example

**Checkpoint**: User Stories 1 and 2 both work and remain independently testable.

---

## Phase 5: User Story 3 — Manager chooses how a section's products are displayed (Priority: P2)

**Goal**: A manager can switch a section between the current grid and a
full-width one-product-per-row list without affecting other sections.

**Independent Test**: Set one subcategory to `list`, confirm full-width rows
with the image on the physical left and name/description/price/action on the
right at 360 px and desktop, confirm another section stays `grid`, then switch
back (`quickstart.md` sections 6).

### Implementation for User Story 3

- [X] T024 [US3] Update `src/components/ProductCard.tsx` to add a `ProductListItem` and accept `layout?: "grid" | "list"` on `ProductGrid`; `grid` keeps today's classes, `list` renders one full-width row with the image on the physical left in RTL, the name/description (2-line clamp)/price/actions on the right, and the same add/customize/quantity behavior
- [X] T025 [P] [US3] Update `src/routes/category.$categoryId.index.tsx` to pass `category.product_layout` to `ProductGrid` only when the category lists products directly, and ignore it when rendering subcategory tiles
- [X] T026 [P] [US3] Update `src/routes/category.$categoryId.$subId.tsx` to pass `sub.product_layout` to `ProductGrid`
- [X] T027 [P] [US3] Update `src/routes/admin.categories.tsx` to add a `product_layout` selector (`grid` = "الشبكة الحالية", `list` = "منتج بعرض الشاشة") to the create/edit form, default `grid`, with a hint that it applies only when the category lists products directly
- [X] T028 [P] [US3] Update `src/routes/admin.subcategories.tsx` to add the same `product_layout` selector and hint to the create/edit form, default `grid`
- [X] T029 [US3] Verify User Story 3 with `quickstart.md` section 6: switch one section to `list`, confirm full-width RTL rows and working actions at 360/768/1280 px, confirm the other section and home/search remain `grid`, then switch back

**Checkpoint**: All layout modes work per section without affecting home or search.

---

## Phase 6: User Story 4 — Subcategories appear three across (Priority: P2)

**Goal**: Category pages show three subcategory tiles per row on phones and at
least three on larger screens, with no horizontal scrolling.

**Independent Test**: Open a category with at least three subcategories at
360 px and confirm exactly three tiles fit with readable names and correct
navigation (`quickstart.md` section 7).

### Implementation for User Story 4

- [X] T030 [US4] Update the subcategory tile container in `src/routes/category.$categoryId.index.tsx` to use three columns on phones and at least three on wider screens (for example `grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6`), with names that wrap or truncate and no horizontal overflow
- [X] T031 [US4] Verify User Story 4 with `quickstart.md` section 7: three tiles per row at 360 px, no horizontal scroll, fewer-than-three rows behave well, wider screens grow beyond three, and every tile still opens its subcategory

**Checkpoint**: Subcategory navigation is compact and overflow-free.

---

## Phase 7: User Story 5 — Existing carts and orders stay correct (Priority: P3)

**Goal**: Pre-feature carts remain valid and behave as products with no extra
and no discount, while freshly added items use current pricing.

**Independent Test**: Seed a cart item without the new fields, reload, confirm
it is usable, totals correctly, shows no offer/addition, and can be ordered;
then add the same product fresh and confirm live pricing (`quickstart.md`
section 9).

### Implementation for User Story 5

- [X] T032 [US5] Harden `src/lib/cart.tsx`: `normalizeItem` and `unitPriceOf` treat missing, `null`, non-finite, or negative `extraPrice`/`discountPercent` as `0`, and old items keep their stored base price until live reconciliation replaces it
- [X] T033 [US5] Update `src/routes/cart.tsx` and `src/routes/checkout.tsx` so reconciliation falls back to the stored snapshot whenever a live product lacks the new fields, and never emits an addition/discount for legacy lines
- [X] T034 [US5] Verify User Story 5 with `quickstart.md` section 9: seed a legacy cart item, reload, confirm the price/total/message have no addition or offer lines, then add the same product fresh and confirm the current pricing wins

**Checkpoint**: Legacy carts and new pricing coexist without data loss.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, quality gates, and end-to-end confirmation.

- [X] T035 [P] Run `npx tsc --noEmit` and `npm run build` from the repository root (config in `package.json` and `tsconfig.json`) and fix every error without using `any` or weakening types
- [X] T036 [P] Run `npm run lint` and resolve new warnings/errors in the touched files (`src/lib/pricing.ts`, `src/lib/catalog.ts`, `src/lib/cart.tsx`, `src/lib/admin.ts`, `src/components/ProductCard.tsx`, `src/components/PriceBlock.tsx`, `src/routes/*.tsx`)
- [X] T037 Render the full matrix from `specs/007-product-pricing-and-layout/quickstart.md` sections 5–7 at 360 px, 768 px, and 1280 px: RTL alignment, no horizontal overflow, keyboard focus, image fallback, long names/descriptions, and both layouts
- [X] T038 Send one mixed test order to the Telegram test chat (extra-only quantity 3, discount-only quantity 2, both + option) and confirm the additions total, discount total, order total, and the absence of zero-value lines match `specs/007-product-pricing-and-layout/contracts/message.md`
- [X] T039 Final review: confirm the migration is additive/rerunnable, no RLS or table changes beyond the five columns, no new dependencies, no catalog rows deleted, no hard-coded prices, and that `quickstart.md` acceptance mapping (SC-001…SC-008) is satisfied

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 → T002. T002 requires database access; everything else waits on it.
- **Foundational (Phase 2)**: Depends on T002. Blocks all user stories.
  - T003 and T004 can run in parallel.
  - T005 depends on T003.
  - T006 depends on T003 and T004.
  - T007 depends on T003 and T004; can run parallel with T005/T006 once those inputs exist.
  - T008 and T009 depend on T006 and can run in parallel with each other.
- **US1 (Phase 3)**: Depends on Phase 2. T010–T014 can run in parallel across their different files; T015 runs after them.
- **US2 (Phase 4)**: Depends on US1 for the shared files. T016/T017 continue `ProductCard.tsx` and `product.$productId.tsx`; T018–T022 can run in parallel once their respective US1 files are updated; T023 runs after.
- **US3 (Phase 5)**: Depends on US2 for `ProductCard.tsx`. T025/T026/T027/T028 can run in parallel after T024; T029 runs after.
- **US4 (Phase 6)**: Depends on US3 because both touch `category.$categoryId.index.tsx`.
- **US5 (Phase 7)**: Depends on US1/US2 because it hardens the pricing fields in cart/checkout. T033 depends on T032.
- **Polish (Phase 8)**: Depends on all desired stories. T035/T036 can run in parallel; T037→T038→T039 are sequential verification.

### User Story Dependencies

- **US1 (P1)**: Independent after Phase 2; first MVP.
- **US2 (P1)**: Builds on the same shared surfaces as US1; independently testable once implemented.
- **US3 (P2)**: Independent product value; shares `ProductCard.tsx` with US1/US2.
- **US4 (P2)**: Independent visual value; shares the category route with US3.
- **US5 (P3)**: Cross-cutting compatibility; depends on the pricing fields from US1/US2.

### Within Each User Story

- Shared model/helper changes before UI changes.
- UI display before end-of-story manual verification.
- No automated tests were requested; verification tasks are the acceptance gate.
- Stop at each checkpoint and validate the story before moving on.

### Parallel Opportunities

- T003 + T004 (catalog types vs pricing module).
- T008 + T009 (cart page vs checkout page).
- T010 + T011 + T012 + T014 (card, product page, message, product list).
- T018 + T019 + T020 + T021 + T022 (cart, checkout, message, editor, products list).
- T025 + T026 + T027 + T028 (two storefront routes and two admin dialogs).
- T035 + T036 (typecheck/build vs lint).

---

## Parallel Example: User Story 1

```bash
# After Phase 2, these touch different files and can run together:
Task: "T010 [US1] Update src/components/ProductCard.tsx for the extra amount"
Task: "T011 [US1] Update src/routes/product.$productId.tsx for the extra amount"
Task: "T012 [US1] Update src/lib/whatsapp.ts for addition lines"
Task: "T014 [US1] Update src/routes/admin.products.tsx quick toggle payload"
```

## Parallel Example: User Story 2

```bash
# After US1, launch the independent surfaces together:
Task: "T018 [US2] Update src/routes/cart.tsx offer display"
Task: "T019 [US2] Update src/routes/checkout.tsx offer display"
Task: "T020 [US2] Update src/lib/whatsapp.ts discount lines"
Task: "T021 [US2] Update src/routes/admin.product-editor.tsx discount field"
Task: "T022 [US2] Update src/routes/admin.products.tsx toggle payload"
```

## Parallel Example: User Story 3

```bash
# After T024, the two routes and two admin dialogs are independent:
Task: "T025 [US3] Update src/routes/category.$categoryId.index.tsx layout prop"
Task: "T026 [US3] Update src/routes/category.$categoryId.$subId.tsx layout prop"
Task: "T027 [US3] Update src/routes/admin.categories.tsx layout selector"
Task: "T028 [US3] Update src/routes/admin.subcategories.tsx layout selector"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (baseline + migration).
2. Complete Phase 2 (types, pricing engine, cart shape, price display, live pricing wiring).
3. Complete Phase 3 (extra amount UI, message additions, admin field).
4. **STOP and VALIDATE**: run `quickstart.md` sections 5 (extra only) and 8.
5. Deploy/demo the extra-amount MVP if ready.

### Incremental Delivery

1. Setup + Foundational → the shared formula is ready but no new UI.
2. US1 → extra amount works end-to-end → deploy/demo (MVP).
3. US2 → offers with old/new price and badge → deploy/demo.
4. US3 → per-section full-width layout → deploy/demo.
5. US4 → three-across subcategories → deploy/demo.
6. US5 → legacy cart hardening → deploy/demo.
7. Polish → full verification and cleanup.

### Notes

- [P] tasks touch different files and have no dependency on an incomplete task.
- Every task includes its exact target file or documentation path.
- Do not add `any`, new npm packages, new tables, or destructive SQL.
- Keep the Arabic RTL design and existing loading/error/empty states intact.
- Verify each checkpoint before starting the next priority.
