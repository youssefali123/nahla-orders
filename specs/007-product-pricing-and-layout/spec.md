# Feature Specification: Product Extra Price, Offers & Display Layouts

**Feature Branch**: `007-product-pricing-and-layout`

**Created**: 2026-11-23

**Status**: Draft

**Input**: User description: "عايز اضيف خاصيه على سعر المنتجات مثلا سعر منتج ما 100 جنيه يكون فيه امكانيه اني اضيف سعر اضافي مثلا 20 جنيه فا السعر النهائي اللي يظهر المستخدم يكون 120 جنيه ويظهر طبيعي اي منتج طب ال 20 جنيه الزيادة دي اي فايدتها ان انها هتظهر في الرساله اللي بتتبعت على التليجرام ان فيه اضافات او زيادة والاجمالي 20 جنيه. تاني حاجه عايز اضيف امكانية اني اضيف عرض على المنتج خصم نسبة مؤية ولو المنتج عليه عرض يظهر السعر القديم والسعر الجديد ويبقى ظاهر انه عليه عرض. تالت حاجه التصنيفات الفرعيه يكونو 3 جنب بعض بالعرض. رابع حاجها اتحكم في طريقة عرض المنتجات هل زي ماهي موجوده دلوقتي ولا صوره بس على الشمال والاسم والوصف والسعر على اليمين هي حاليا في وضع الموبايل بيقي في 2 منتج جنب بعض بشكل افقي انا عايز اتحكم من الداش بورد لو عايز اخلي القسم ده يعرض بالوضع الحالي او ومنتج عرضه مالي الشاشة"

## Overview

This feature adds three independent storefront capabilities and one display
change:

1. A per-product **extra amount** that raises the price the shopper pays and
   is itemized as a separate addition in the order message.
2. A per-product **discount percentage** that renders the product as an offer
   with its old and new price side by side.
3. **Three subcategories per row** on the category page.
4. A per-section **product layout choice** in the dashboard: keep the current
   grid or switch the section to a full-width, one-product-per-row list.

Pricing, cart, checkout, and the order message MUST stay internally consistent:
the shopper always sees the same final amount that the manager sees in the
telegram message.

## Clarifications

### Session 2026-11-23

- Q: When a product has both a discount and an extra amount, how is the final unit price calculated? → A: The extra amount is added to the base price first, the discount is then applied to that combined amount, and option differences are added last: `(base + extra) × (1 − discount%) + option differences`.
- Q: Does an offer need a start and end date with automatic activation and expiry, or does it stay active until removed manually? → A: No scheduling; an offer stays active until the manager removes it or changes its percentage.
- Q: At what level is the product layout choice saved? → A: Independently per section that directly lists products: a category with no subcategories, or any individual subcategory.
- Q: How should a discounted product be displayed in the cart and checkout review? → A: Show the old price struck through and the new price on each discounted line, matching the listings and product detail page.
- Q: Which pages does a section's chosen product layout apply to? → A: Only the section's own pages (a category listing products directly and its subcategory pages); the homepage featured section and search results keep their existing layout.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Manager adds an extra amount to a product (Priority: P1)

A manager editing a product enters an extra amount (for example 20) on top of
the base price (for example 100). Everywhere the product appears, the shopper
sees the final price of 120 and can order it at that price. The order message
sent to Telegram shows the extra as a distinct "addition" line and a summed
additions total, so the manager can see how much of the order is extra.

**Why this priority**: This is the first requested capability and it changes the
amount collected for every sale of the product, so it must be correct before
any offer or layout work ships.

**Independent Test**: Set an extra amount on a test product, open the product
card, product page, cart, and checkout, then place a test order and inspect the
Telegram message. The final amount matches base + extra, the extra appears as
its own addition, and clearing the extra restores the original behavior.

**Acceptance Scenarios**:

1. **Given** a product priced 100 with an extra amount of 20, **When** a shopper
   views it anywhere, **Then** the displayed price is 120.
2. **Given** the same product, **When** the shopper adds it to the cart and
   checks out, **Then** the cart line, order total, delivery calculation, service
   fee calculation, and Telegram message all use 120 per unit.
3. **Given** an order containing that product, **When** the Telegram message is
   read, **Then** the product line shows the extra amount as an addition and the
   message contains an additions total equal to the extra multiplied by quantity.
4. **Given** a product with no extra amount, **When** viewed or ordered, **Then**
   prices and messages are identical to today's behavior.
5. **Given** an extra amount of zero or empty, **When** saved, **Then** the
   product is treated as having no extra amount anywhere.

---

### User Story 2 - Manager puts a product on offer (Priority: P1)

A manager enters a discount percentage for a product. The product is visibly
marked as an offer: the old price is shown struck through, the new discounted
price is shown prominently, and an offer badge identifies it in listings. The
discounted amount is used in the cart, checkout, and order message.

**Why this priority**: Offers are the second requested capability and directly
affect the amount charged; they must never disagree with the cart or message.

**Independent Test**: Apply a 20% discount to a 100 product, confirm listings,
product page, cart, checkout, and Telegram message all use 80, confirm the old
price and offer badge are visible, then remove the discount and confirm the
product returns to its normal appearance.

**Acceptance Scenarios**:

1. **Given** a product priced 100 with a 20% discount, **When** viewed in any
   listing, **Then** the old price 100 is shown struck through, the new price 80
   is shown, and an offer badge is visible.
2. **Given** the same product, **When** its detail page is opened, **Then** the
   old and new prices and the offer state are shown together with the normal
   product information.
3. **Given** the same product in the cart, checkout, and order message, **When**
   inspected, **Then** every amount uses 80 and the order total equals the sum of
   discounted line totals.
4. **Given** a product with a 0% discount, **When** viewed, **Then** no old price
   and no offer badge appear.
5. **Given** a product with both a discount and an extra amount, **When** viewed
   and ordered, **Then** the extra is added to the base price first, the discount
   is applied to the combined amount, option differences are added last, and the
   final amount is identical in every surface.

---

### User Story 3 - Manager chooses how a section's products are displayed (Priority: P2)

A manager opens a section in the dashboard and chooses between the current grid
and a full-width list. The chosen mode applies to all products in that section
on the storefront without affecting any other section.

**Why this priority**: It is a presentation preference; the store remains fully
usable with the default layout if this is not configured.

**Independent Test**: Switch a test section to the full-width mode, verify one
product per row with the image on the left and name, description, and price on
the right at mobile and desktop widths, then switch it back to grid and verify
the existing two-per-row mobile layout returns. Confirm a second section is
unaffected.

**Acceptance Scenarios**:

1. **Given** a section using the default grid, **When** the manager selects the
   full-width list and saves, **Then** every product in that section renders one
   per row with the image on the left and the text and price on the right.
2. **Given** a section in full-width mode, **When** viewed on a narrow phone
   screen, **Then** the card fills the available width, does not overflow
   horizontally, and keeps the add-to-cart or customize action reachable.
3. **Given** a section in grid mode, **When** viewed, **Then** it keeps today's
   layout (two per row on mobile, more per row on wider screens).
4. **Given** a changed layout in one section, **When** other sections are opened,
   **Then** they keep their own saved layout.
5. **Given** a product on offer or with an extra amount, **When** displayed in
   full-width mode, **Then** the price treatment from User Stories 1 and 2 is
   preserved.

---

### User Story 4 - Subcategories appear three across (Priority: P2)

A shopper opening a category that has subcategories sees three subcategory tiles
side by side on a phone, and at least three per row on larger screens, without
horizontal scrolling.

**Why this priority**: It is a compact visual improvement that does not change
data or pricing behavior, and it can ship independently.

**Independent Test**: Open a category with at least three subcategories at a
phone width, confirm three tiles fit in one row with readable names and no
clipping, then confirm the tiles still navigate to the correct subcategory.

**Acceptance Scenarios**:

1. **Given** a category with three or more subcategories on a phone, **When**
   opened, **Then** exactly three tiles appear per row with no horizontal scroll.
2. **Given** a category with fewer than three subcategories, **When** opened,
   **Then** the available tiles share the row without stretching oddly.
3. **Given** a wider screen, **When** opened, **Then** at least three tiles appear
   per row and the number may grow to use the space.
4. **Given** a subcategory tile, **When** tapped, **Then** it opens the same
   subcategory page as before.

---

### User Story 5 - Existing carts and orders stay correct (Priority: P3)

A shopper with items already in the cart from before the feature keeps a valid
cart. Items saved without the new pricing information behave as products with no
extra amount and no discount, and newly added items always use the current
pricing.

**Why this priority**: Prevents broken carts and wrong totals for returning
shoppers during rollout.

**Independent Test**: Seed a cart with a pre-feature item, reload the store, and
confirm the item still appears, adds up correctly, and can be ordered; then add
the same product again after the feature and confirm the fresh pricing applies.

**Acceptance Scenarios**:

1. **Given** a stored cart item without extra or discount information, **When**
   the cart is loaded, **Then** the item remains usable at its stored price with
   no offer badge and no addition line.
2. **Given** a product whose price changed after it was added to a cart, **When**
   the cart is reconciled, **Then** the current catalog price and pricing rules
   are used as they are today.
3. **Given** legacy and new items in one cart, **When** the order message is
   built, **Then** additions are itemized only for lines that actually carry an
   extra amount.

---

### Edge Cases

- A 0% discount, an empty extra amount, or both together MUST produce
  byte-identical storefront behavior to today.
- Offers have no start or end time: saving a percentage makes the offer active
  immediately, and removing the percentage ends it immediately. No scheduled
  activation, countdown, or automatic expiry exists.
- A 100% discount MUST make the combined base + extra amount zero (only option
  differences remain payable) and the product MUST remain orderable; it MUST NOT
  produce a negative total.
- Negative extra amounts, negative discounts, or discounts above 100% MUST be
  rejected in the dashboard with a clear Arabic validation message.
- The extra amount MUST be a flat per-unit amount, not a percentage, and MUST be
  multiplied by quantity in line totals and in the additions total.
- Prices containing decimals MUST render and total without drift; displayed money
  uses the store's existing currency and rounding behavior.
- A product with selectable options MUST combine option price differences with the
  discounted (base + extra) amount using one documented order, and the order
  message MUST continue to itemize each selected option.
- The addition shown in the order message MUST use the configured extra amount
  before any discount is applied, so the additions total always reflects the
  manager's configured extra amount; the discount is reported separately.
- A section that shows subcategories instead of products ignores its layout
  setting until it actually lists products; changing the setting MUST NOT hide
  any products.
- When a section is switched to full-width mode, long product names and
  descriptions MUST wrap or truncate without breaking the row or hiding the
  action button.
- Products without images MUST still render correctly in both layouts using
  their existing icon fallback.
- The order message MUST never fail to send because of the new pricing lines; if
  a product has no extra amount, no addition line or additions total is emitted.
- Searching, filtering, and featured-product sections MUST reflect the same
  offer pricing and offer badge as their normal listings.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Managers MUST be able to set a non-negative extra amount on any
  product; the default is no extra amount.
- **FR-002**: Managers MUST be able to set a discount percentage from 0 to 100 on
  any product; the default is 0% (no offer). Offers MUST NOT require start or end
  dates: a saved offer is active immediately and stays active until the manager
  removes it or changes its percentage.
- **FR-003**: The price shown to shoppers for a product MUST equal the base price
  plus the extra amount, reduced by the discount percentage, plus any selected
  option differences: `(base + extra) × (1 − discount%) + options`.
- **FR-004**: The cart, checkout, delivery calculation, service fee, grand total,
  and order message MUST all use the same final price rule as the storefront.
- **FR-005**: When a product has a discount above 0%, every listing, the product
  detail page, the cart, and the checkout review MUST show the old base price
  struck through, the new discounted price, and a clear offer badge.
- **FR-006**: When a product has no discount, no old price and no offer badge MAY
  appear.
- **FR-007**: When a product has an extra amount, the order message MUST include
  a distinct addition for that line and an additions total that equals the extra
  amount multiplied by the ordered quantity, summed across all lines.
- **FR-008**: The order message MUST continue to show product name, quantity,
  line total, selected options, delivery, service fee, and grand total as it does
  today.
- **FR-009**: The order message MUST show discount information for discounted
  lines so the manager can reconcile the amount charged with the original price.
- **FR-010**: Managers MUST be able to edit the extra amount and discount in the
  existing product editor, with validation and a live price preview before
  saving.
- **FR-011**: Saving an invalid extra amount or discount MUST be blocked and MUST
  explain the allowed range in Arabic.
- **FR-012**: Managers MUST be able to choose, per section that lists products,
  between the current grid layout and a full-width list layout; the default is
  the current grid.
- **FR-013**: The layout choice MUST apply to all products in that section only
  and MUST persist across sessions.
- **FR-014**: In full-width mode, each product MUST occupy its own row with the
  image on the left and the name, description, price treatment, and action on the
  right, at mobile and desktop widths.
- **FR-015**: In grid mode, the existing responsive column behavior MUST remain
  unchanged.
- **FR-016**: Category pages with subcategories MUST show three subcategory tiles
  per row on phone widths with no horizontal scrolling, and at least three per
  row on larger screens.
- **FR-017**: The offer treatment and extra amount MUST be visible anywhere a
  product price is shown to shoppers, including search results, featured
  products, and filter results.
- **FR-018**: Existing carts and stored items that lack the new pricing
  information MUST remain valid, treating missing information as no extra amount
  and no discount.
- **FR-019**: All new pricing and layout fields MUST remain editable only by
  authenticated store managers; public visitors MUST only read the resulting
  prices and layouts.
- **FR-020**: The feature MUST be additive: it MUST NOT delete or reset existing
  catalog data, and it MUST remain compatible with the current data source being
  temporarily unavailable, falling back to today's behavior.
- **FR-021**: A section's layout choice MUST apply only to that section's own
  product listing pages; the homepage featured section and search results MUST
  keep the existing grid layout regardless of section settings.

### Key Entities *(include if feature involves data)*

- **Product pricing**: The base price, an optional flat extra amount, and an
  optional discount percentage that together produce the shopper-facing price.
- **Product offer state**: Whether a product is on offer, the old price, the new
  price, and the percentage shown to shoppers.
- **Section display preference**: The chosen product layout for a category or
  subcategory that lists products, with the current grid as the default.
- **Order line breakdown**: The per-line base price, discount, extra amount,
  selected option differences, quantity, and final line total shown in the order
  message.
- **Additions summary**: The total of all extra amounts across the order, shown
  separately in the order message.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A product priced 100 with a 20 extra amount shows and charges 120
  in 100% of surfaces (listing, detail, cart, checkout, message).
- **SC-002**: A product priced 100 with a 20% discount shows 80 as the new price
  and 100 as the struck-through old price in 100% of surfaces, with the offer
  badge visible in every listing.
- **SC-003**: For a test order of 3 units with a 20 extra amount each, the order
  message reports an additions total of exactly 60.
- **SC-004**: A manager can change a section's layout and see the storefront
  reflect it in under 1 minute, with no other section changing.
- **SC-005**: On a 360-pixel-wide screen, three subcategory tiles fit in one row
  with no horizontal scroll and no clipped names.
- **SC-006**: 100% of existing cart, checkout, and order-message behaviors remain
  unchanged for products with no discount and no extra amount.
- **SC-007**: Zero existing products, categories, subcategories, options, or
  orders are lost or altered beyond the new optional pricing and layout values.
- **SC-008**: All pricing surfaces agree on the final amount for at least 10
  mixed test products covering discounts, extras, options, decimals, and no
  pricing changes.

## Assumptions

- The extra amount is a flat amount per unit, added to the base price before the
  discount is applied; the discount applies to the combined base + extra amount,
  and option differences are added afterwards. Example: base 100 + extra 20 = 120,
  then a 20% discount gives 96, then option differences are added.
- The discount applies to the product base price plus its extra amount; selected
  option differences are not discounted and are added afterwards as they are
  today.
- The extra amount is visible to shoppers only through the final price; the
  separate "addition" breakdown is primarily for the Telegram order message.
- Discounts are a percentage, not a fixed amount, as requested.
- Offers are always-on until a manager removes or changes them; scheduling,
  countdowns, and automatic expiry are out of scope for this version.
- The full-width layout is a single-product-per-row card with the image on the
  left and the text and price on the right; it uses the existing product card
  actions and option behavior.
- Layout is configured independently for each section that directly lists
  products (a category without subcategories, or any subcategory); the default is
  the current grid.
- Subcategory tiles keep their current image, name, and navigation behavior;
  only the column count changes.
- The store continues to use Supabase as the catalog source of truth once
  available; no data is deleted, and the current no-database fallback behavior is
  preserved.
- Existing currencies, rounding, delivery fees, service fee, and order-message
  layout remain unchanged apart from the new pricing lines.
- Only authenticated store managers can edit pricing and layout; shoppers remain
  read-only.
