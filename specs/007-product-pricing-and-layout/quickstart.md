# Quickstart: Validate Product Pricing & Layouts

**Feature**: `007-product-pricing-and-layout`

This guide proves the feature end-to-end. It contains commands and manual
checks only; see [data-model.md](./data-model.md) and
[contracts/](./contracts/) for the rules.

## Prerequisites

- Node.js 20+ and npm (repo already has `node_modules`).
- `.env.local` with `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and the
  Telegram bot/chat values.
- Access to the Supabase project SQL editor and one manager account in
  `admin_profiles`.
- A Telegram test chat (use the configured test chat, not the live customer
  group, for validation orders).
- Two test products in an active section; one with options if possible.

## 1. Apply the migration

1. Open Supabase Dashboard → SQL Editor.
2. Paste the contents of `specs/007-product-pricing-and-layout/migration.sql`
   and run it.
3. Run it a second time to confirm it is rerunnable.
4. Confirm the verification query returns the five columns with defaults
   `0`, `0`, and `'grid'`.

Expected: four rows — `products.extra_price`, `products.discount_percent`,
`categories.product_layout`, `subcategories.product_layout`.

## 2. Static checks

```bash
npx tsc --noEmit
npm run build
```

Expected: zero TypeScript errors and a successful production build.

## 3. Run the app

```bash
npm run dev
```

Open the printed local URL. Keep the browser devtools open at a 360 px viewport
for the mobile checks.

## 4. Admin setup

1. Sign in at `/admin/login`.
2. Edit a test product:
   - Base price `100`, extra `20`, discount `0`.
   - Confirm the live preview shows `120`.
3. Edit a second product (or the same one after the first check):
   - Base `100`, extra `20`, discount `20`.
   - Confirm the preview shows `96` and the pre-offer price `120`.
4. Set one active subcategory to `list` and keep another on `grid`.
5. Save and return to the storefront.

## 5. Storefront pricing checks

### Extra only

- Open the product in the grid, list, product page, cart, and checkout.
- Confirm every surface shows `120` for one unit.
- Add quantity `3`; confirm the cart line is `360`.

### Discount only

- Set base `100`, extra `0`, discount `20`; confirm:
  - old price `100` struck through, new price `80`, badge `خصم 20%`;
  - cart and checkout show the struck old price and `80` per unit.

### Both + options

- Base `100`, extra `20`, discount `20`, option delta `+10`.
- Confirm the product page unit price is `106` and quantity `2` shows `212`.

### Edge cases

- Discount `100`: unit should be `0` plus any option delta; never negative.
- Discount `0`: no old price and no badge.
- Extra `0`: no addition line anywhere.
- Negative extra, discount `-1`, discount `101`, or non-numeric: save is
  blocked with an Arabic message.
- Decimals: base `99.90`, extra `10.05`, discount `15`, option `+2.50` →
  final `95.96`.

## 6. Layout checks

1. Open the section whose layout is `grid`:
   - mobile: two cards per row; tablet/desktop: more columns.
2. Open the `list` section:
   - one product per row, image on the physical left in RTL, name/description/
     price/action on the right;
   - no horizontal scroll at 360 px;
   - add/customize/quantity still work.
3. Confirm the other section did not change.
4. Confirm the homepage featured row and search results remain grid.
5. Toggle a section back to `grid` and confirm the original layout returns.

## 7. Subcategory checks

1. Open a category with at least three subcategories at 360 px.
2. Confirm exactly three tiles per row, no horizontal scroll, readable names.
3. Confirm every tile still opens the correct subcategory.
4. Increase the width and confirm at least three per row with more columns on
   desktop.

## 8. Telegram message checks

Place a test order containing:

- an extra-only product, quantity `3`;
- a discounted product, quantity `2`;
- a product with both and an option.

Confirm the message contains:

- `↳ إضافة: +60 جنيه` for the extra-only line, and `💵 إجمالي الإضافات: 60 جنيه`;
- `↳ خصم 20%: -40 جنيه` for the discounted line, and `🏷️ إجمالي الخصم: 40 جنيه`;
- a final order total that matches the checkout screen total;
- no additions/discount lines for products without them.

Also confirm the WhatsApp copy (if used) shows the same values.

## 9. Legacy cart compatibility

1. In devtools → Application → Local Storage, confirm the key
   `nahla-cart-v1`.
2. Add an item, then remove `extraPrice`/`discountPercent` from the stored JSON
   (or use an older snapshot).
3. Reload: the item must still appear, total correctly, and be orderable with
   no offer badge and no addition line.
4. Add the same product fresh and confirm live pricing applies.

## 10. Cleanup

- Remove test extra/discount values or set them to `0`.
- Reset test section layouts to `grid` if they should not stay changed.
- Clear the test order from the Telegram test chat if needed.
- The migration adds no test rows, so no data cleanup is required.

## Acceptance mapping

| Check | Success criterion |
|---|---|
| Extra-only surfaces show 120 | SC-001 |
| 20% offer shows 80 and struck 100 | SC-002 |
| Three units × 20 extra → additions 60 | SC-003 |
| Layout change reflected in under 1 minute, other sections unchanged | SC-004 |
| Three tiles at 360 px without scroll | SC-005 |
| No-change products behave exactly as before | SC-006 |
| No catalog rows lost or altered | SC-007 |
| Mixed matrix agrees across all surfaces | SC-008 |
