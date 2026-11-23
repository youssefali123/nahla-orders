# Contract: UI

**Feature**: `007-product-pricing-and-layout`

## Shared price display

A small shared component (for example `PriceBlock`) renders money identically
on the grid card, list card, product page, cart, and checkout:

| State | Rendering |
|---|---|
| No offer | Final unit price + currency, with the existing `/ unit` suffix when present |
| Offer | Old gross price with `line-through` and muted color, final price prominently, plus a `خصم X%` badge |
| Extra only | Final unit price only; no separate addition line on the storefront |
| 100% offer | Final price may be `0`; badge still visible; never negative |

- The badge uses text, not color alone, and remains readable at 11–12 px.
- The old price uses a semantic strike element (`s`/`line-through`) so screen
  readers announce both values; the new price is the prominent value.
- Currency and Western digits follow the existing `site.currency` style.

## `ProductGrid` / `ProductCard` (`src/components/ProductCard.tsx`)

```ts
type ProductLayout = "grid" | "list";

<ProductGrid
  products={products}
  optionFlags={optionFlags}
  layout?: ProductLayout // default "grid"
/>
```

### `grid` (default, unchanged)

- Mobile: 2 columns; tablet: 3; desktop: 4 (`grid-cols-2 md:grid-cols-3
  lg:grid-cols-4`).
- Vertical card: image top, name, price row, add/customize/qty action.
- Home featured, search results, and any caller that omits `layout` use this.

### `list` (new)

- One product per row at every breakpoint, full available width.
- Physical left in RTL: product image/icon in a fixed square (about 96–128 px
  on mobile, larger on desktop).
- Physical right in RTL: name (truncate/wrap safely), description (2-line
  clamp), price block (old/new/badge), then the existing add/customize/quantity
  action.
- No horizontal overflow at 360 px; action remains reachable; image fallback
  icon preserved.
- Uses the same cart behavior as the grid card; no duplicate logic.

## Section routes

- `category.$categoryId.index.tsx`: when it lists products directly, pass
  `category.product_layout`. When it renders subcategories, ignore layout.
- `category.$categoryId.$subId.tsx`: pass `sub.product_layout`.
- `index.tsx` (featured) and `search.tsx`: do not pass `layout` (stay grid).
- Switching sections must not require a reload; layout comes with the loader
  data.

## Subcategory tiles

- Container: 3 columns on phones, at least 3 on tablet/desktop
  (`grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6` or equivalent).
- Tile: square image/icon + name, centered, same navigation target.
- Names wrap or truncate gracefully; no horizontal scroll at 360 px; fewer
  than three items do not stretch oddly.

## Product detail (`product.$productId.tsx`)

- Price block uses the shared component with `extra` and `discount`.
- Options still add `price_delta` after the discounted `(base + extra)`.
- The displayed total is `unitPrice(pricing, selectedOptionDeltas) × qty`.
- Add-to-cart passes `extraPrice` and `discountPercent`.

## Cart and checkout lines

- Each discounted line shows the old price struck through and the new price,
  per the clarification.
- Line total and order total use the shared helpers.
- Service fee, delivery, and grand total keep their current placement and
  Arabic labels.
- Legacy lines with no offer show a single price, exactly as today.

## Admin product editor (`admin.product-editor.tsx`)

New fields inside the existing product form, near the base price:

| Field | Input | Validation | Hint |
|---|---|---|---|
| `extra_price` | number, min 0, decimal | `>= 0` and finite | "يضاف على السعر ويظهر كإضافة في رسالة الطلب" |
| `discount_percent` | number, 0–100, decimal | `0..100` and finite | "0 يعني بدون عرض. العرض مستمر حتى يتم إلغاؤه" |

- Live preview shows the customer-facing final price, and when on offer the
  pre-offer price, using `src/lib/pricing.ts`.
- Invalid values block save with the Arabic messages from the spec and focus
  the error summary.

## Admin section dialogs (`admin.categories.tsx`, `admin.subcategories.tsx`)

- Add a `product_layout` selector with two choices:
  - `grid` → "الشبكة الحالية (منتجان جنب بعض على الموبايل)"
  - `list` → "منتج بعرض الشاشة (صورة شمال والبيانات يمين)"
- Default is `grid` for new and existing rows.
- Hint: applies only when the section lists products directly; categories with
  subcategories ignore it.
- Saving persists with the rest of the form; no new page.

## States to verify

- Product with image, without image (emoji fallback), long name/description.
- No extra/discount, extra only, discount only, both, 100% discount, decimals.
- Grid and list at 360 px, 768 px, and 1280 px.
- Empty section and loading/error states unchanged.
- Keyboard focus and pressed states for add/customize/quantity controls.
