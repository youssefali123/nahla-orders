# Research: Product Extra Price, Offers & Display Layouts

**Feature**: `007-product-pricing-and-layout` | **Date**: 2026-11-23

All Technical Context unknowns are resolved; the spec clarifications fixed the
pricing order, offer scheduling, layout scope, cart display, and page scope.
The decisions below cover the remaining implementation choices.

## 1. Where to store the extra amount and discount

- **Decision**: Add two defaulted numeric columns on `products`
  (`extra_price NUMERIC(10,2) NOT NULL DEFAULT 0`, `discount_percent
  NUMERIC(5,2) NOT NULL DEFAULT 0`), each with a CHECK constraint.
- **Rationale**: The values are 1:1 with a product, always read with it, and
  never shared. Defaults make the migration non-destructive and instantly
  backward compatible. Existing `select("*")` reads need no query changes.
- **Alternatives considered**:
  - Separate `product_pricing` table — rejected: every listing would need a
    join or an extra query for no benefit, and all rows would be mandatory 1:1.
  - JSON settings blob — rejected: weaker typing, harder validation, no CHECK
    constraints, harder admin queries.
  - Store only the final price — rejected: loses the pre-offer price needed for
    the struck-through display and the discount breakdown in the message.

## 2. Where to store the per-section layout

- **Decision**: Add `product_layout TEXT NOT NULL DEFAULT 'grid' CHECK
  (product_layout IN ('grid','list'))` to both `categories` and
  `subcategories`.
- **Rationale**: The clarification says the choice is independent per section
  that directly lists products. A typed column is explicit, cheap to read with
  the existing category/subcategory queries, and validated at the database
  boundary.
- **Alternatives considered**:
  - Global `app_settings` value — rejected: contradicts the per-section
    clarification.
  - Category-only with inheritance — rejected: cannot give one subcategory a
    different layout without extra override logic.
  - JSON map of section id → layout — rejected: no referential integrity, no
    defaults per row, awkward admin updates.

## 3. Cart compatibility and pricing snapshot

- **Decision**: Keep `CartItem.price` as the base price and add optional
  `extraPrice` and `discountPercent` fields (missing = 0 in `normalizeItem`).
  `unitPriceOf` computes `(price + extraPrice) × (1 − discountPercent/100) +
  option deltas` through the shared helper.
- **Rationale**: Existing carts in `localStorage` (`nahla-cart-v1`) must keep
  working. Storing the base plus the two attributes preserves the old/new price
  display and the discount breakdown. Live reconciliation already refreshes
  `price` from the catalog; it will refresh the two new fields the same way.
- **Alternatives considered**:
  - Store only the final unit price — rejected: impossible to show the old
    price or itemize the discount later, and legacy items would look like
    permanent offers.
  - Version the storage key — rejected: would silently empty every existing
    cart, which the spec forbids.
  - Recompute everything only at checkout — rejected: cart totals would
    disagree with the checkout screen before submit.

## 4. Pricing formula, order of operations, and rounding

- **Decision**: One pure module `src/lib/pricing.ts` owns the formula:
  - `grossUnit = round2(base + extra + optionDeltas)`
  - `finalUnit = round2((base + extra) × (1 − discount/100) + optionDeltas)`
  - `lineTotal = round2(finalUnit × qty)`
  - order total, service fee, delivery, grand total keep `round2` at their
    existing boundaries.
- **Rationale**: Clarification chose extra-before-discount. Applying option
  deltas after the discount matches the spec. A single module prevents the
  cart, checkout, and message from drifting.
- **Alternatives considered**:
  - Discount the base only — rejected by clarification.
  - Discount option deltas too — rejected: options are separate add-ons and the
    spec keeps them outside the discount.
  - Round only for display — rejected: produces float drift between surfaces
    and makes the message total differ from the screen total.

## 5. Telegram/WhatsApp message shape

- **Decision**: Keep the plain-text, no-parse-mode message and add, only when
  applicable:
  - per line: `↳ إضافة: +N جنيه` and `↳ خصم X%: -N جنيه`;
  - after all lines: `💵 إجمالي الإضافات: N جنيه` and
    `🏷️ إجمالي الخصم: N جنيه`.
  The additions total uses the configured extra × quantity before discount;
  the discount total uses `(base + extra) × discount% × quantity`.
- **Rationale**: Meets the requirement to show the extra and its total without
  breaking existing Arabic copy. Plain text avoids markup-escaping failures.
- **Alternatives considered**:
  - Markdown/HTML parse mode — rejected: user input and Arabic copy can break
    formatting, an existing deliberate choice.
  - Show additions only in the grand total — rejected: the user explicitly wants
    the extra and its total visible.
  - Show the extra after discount — rejected: the clarification makes the
    configured extra the truthful “addition” value; discount is reported
    separately.

## 6. Validation strategy

- **Decision**: Validate in the admin form (Arabic messages, block save) and
  enforce the same ranges with database CHECK constraints. Normalize any
  non-finite/negative values to 0 when reading legacy or malformed data.
- **Rationale**: Client validation gives immediate feedback; the database
  guarantees correctness even if a write bypasses the UI.
- **Alternatives considered**:
  - Client-only validation — rejected: a stale or hand-crafted request could
    store negative prices.
  - Database-only validation — rejected: poor UX and unclear error messages.

## 7. Full-width list layout in RTL

- **Decision**: Reuse the existing product card actions in a new horizontal
  row: image on the physical left, content and price on the right, one row per
  product at every breakpoint. The shared `ProductGrid` accepts
  `layout?: "grid" | "list"` and defaults to `grid`.
- **Rationale**: The user asked for “صورة على الشمال والاسم والوصف والسعر على
  اليمين”, one product filling the row. Keeping the same action component
  preserves add/customize/qty behavior and accessibility.
- **Alternatives considered**:
  - CSS-only reflow of the existing grid card — rejected: the card is vertical;
    forcing it horizontal breaks the image aspect ratio and action placement.
  - A separate route or duplicate page — rejected: layout is a per-section
    preference, not navigation.

## 8. Three subcategory tiles across

- **Decision**: Set the tile container to three columns on phones, growing to
  three/four/six on wider screens. Tiles keep their current image + name link
  and allow names to wrap/truncate without horizontal scroll.
- **Rationale**: Directly matches the request and remains usable at 360 px.
- **Alternatives considered**:
  - Horizontal scroll carousel — rejected: the user asked for three visible
    across, not a scroller.
  - Exactly three columns at every width — rejected: wastes desktop space and
    makes tiles oversized.

## 9. Verification without a test runner

- **Decision**: Verification uses `npx tsc --noEmit`, `npm run build`, manual
  rendering of every touched route at phone and desktop widths, and one real
  Telegram test order. Pure helpers are written so unit tests can be added
  later without changing their signatures.
- **Rationale**: The project has no test framework today; adding one is outside
  this feature's scope and would inflate the change.
- **Alternatives considered**:
  - Introduce Vitest now — rejected for scope; the pricing module stays
    testable, so a later feature can add it cheaply.
  - Build-only verification — rejected: layout and message behavior need
    rendered/runtime checks.

## 10. Scope exclusions confirmed

- No offer scheduling, countdowns, or auto-expiry (clarification).
- No fixed-amount discounts.
- No multiple named extras per product.
- No cart/order/customer tables; no server-side pricing service.
- No layout control on the homepage featured section or search results
  (clarification).
- No new npm dependencies.
