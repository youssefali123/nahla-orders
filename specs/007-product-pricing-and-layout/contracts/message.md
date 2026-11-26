# Contract: Order Message (Telegram / WhatsApp)

**Feature**: `007-product-pricing-and-layout`

`src/lib/whatsapp.ts` builds the text; `src/services/send_order.ts` sends the
same plain text to Telegram (no parse mode). The transport is unchanged. The
message follows this fixed top-to-bottom order:

1. `🔢 رقم الطلب`
2. `👤 اسم العميل`
3. `📱 رقم التليفون`
4. `📍 منطقة التوصيل` (when a zone is selected)
5. `📍 العنوان`
6. `🛒 تفاصيل الطلب`
7. `💰 إجمالي الطلب`
8. `🏷️ إجمالي الخصم` (only when a discount applies)
9. `🧾 رسوم الخدمة` (only when the service percent is above zero)
10. `💵 السعر الإضافي` (only when any line has an extra, i.e. the additions total)
11. `🛵 رسوم التوصيل`
12. `💰 الإجمالي الكلي`
13. Footer slogan

Sections from step 4 and steps 8–12 are omitted when not applicable; nothing
else changes order.

## Line rules

For each non-custom item, in the existing grouped order:

1. `n. <name> × <qty>` — unchanged.
2. `السعر: <lineTotal> <currency>` — uses `lineTotal` from the shared pricing
   helper (final price × qty).
3. When `extra > 0`: `↳ إضافة: +<lineExtraTotal> <currency>`.
4. When `discountPercent > 0`: `↳ خصم <discountPercent>%: -<lineDiscountTotal> <currency>`.
5. Selected options: existing `↳ <group>: <option> (+delta)` lines, unchanged
   (per-unit deltas, as today).

Custom-order items keep their existing block and never emit pricing lines.

## Summaries block

- `💰 إجمالي الطلب` always follows the items and uses the order total before
  service fee and delivery.
- `🏷️ إجمالي الخصم` follows the order total when any line has
  `discountPercent > 0`.
- `🧾 رسوم الخدمة (N%)` follows the discount when the service percent is
  above zero.
- `💵 السعر الإضافي` follows the service fee when any line has `extra > 0`;
  its value is `additionsTotal`.
- `🛵 رسوم التوصيل` then `💰 الإجمالي الكلي` close the block when a delivery
  zone is selected.

`additionsTotal` uses the configured extra before discount. `discountTotal`
uses `(base + extra) × discountPercent / 100 × qty` summed over lines.

## Existing sections that stay unchanged

- Category grouping and custom-order grouping.
- Free-delivery text (`توصيل مجاني 🎉`) when the fee is zero.
- Footer slogan.
- No line is emitted when `extra = 0` and `discountPercent = 0`.

## Example — extra only

Product 100 + 20 extra, quantity 3, no discount, delivery fee 25, no service
fee:

```text
🛒 تفاصيل الطلب:

▪️ ماركت:

1. عسل نحل × 3
السعر: 360 جنيه
↳ إضافة: +60 جنيه

💰 إجمالي الطلب:
360 جنيه

💵 السعر الإضافي:
60 جنيه

🛵 رسوم التوصيل:
25 جنيه

💰 الإجمالي الكلي:
385 جنيه
```

## Example — discount only

Product 100 with 20% discount, quantity 2, no delivery block:

```text
1. عسل نحل × 2
السعر: 160 جنيه
↳ خصم 20%: -40 جنيه

💰 إجمالي الطلب:
160 جنيه

🏷️ إجمالي الخصم:
40 جنيه
```

## Example — both + option + service fee

Product 100 + extra 20, 20% discount, option +10, quantity 2. Final unit 106,
line total 212, additions 40, discount 48, service fee 10%, delivery 25:

```text
1. عسل نحل × 2
السعر: 212 جنيه
↳ إضافة: +40 جنيه
↳ خصم 20%: -48 جنيه
↳ الحجم: كبير (+10)

💰 إجمالي الطلب:
212 جنيه

🏷️ إجمالي الخصم:
48 جنيه

🧾 رسوم الخدمة (10%):
21.2 جنيه

💵 السعر الإضافي:
40 جنيه

🛵 رسوم التوصيل:
25 جنيه

💰 الإجمالي الكلي:
258.2 جنيه
```

## Acceptance checks

- The message total equals the checkout grand-total breakdown.
- Additions total equals `extra × qty` summed across lines.
- Discount total equals the checkout discount.
- Removing extra/discount removes the corresponding lines and summaries.
- Arabic copy and plain-text sending remain valid (no markup).
