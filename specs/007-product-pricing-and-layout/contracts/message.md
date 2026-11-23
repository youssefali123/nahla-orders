# Contract: Order Message (Telegram / WhatsApp)

**Feature**: `007-product-pricing-and-layout`

`src/lib/whatsapp.ts` builds the text; `src/services/send_order.ts` sends the
same plain text to Telegram (no parse mode). The transport and message
ordering are unchanged. Only new price lines and summaries are added, and only
when applicable.

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

## Summaries (after all items, before the order total)

- When any line has `extra > 0`:
  `💵 إجمالي الإضافات:` then `<additionsTotal> <currency>`.
- When any line has `discountPercent > 0`:
  `🏷️ إجمالي الخصم:` then `<discountTotal> <currency>`.

`additionsTotal` uses the configured extra before discount. `discountTotal`
uses `(base + extra) × discountPercent / 100 × qty` summed over lines.

## Existing sections that stay unchanged

- Order number, customer name, phone, address.
- Category grouping and custom-order grouping.
- `💰 إجمالي الطلب`, delivery zone/fee, service fee, `💰 الإجمالي الكلي`,
  footer slogan.
- No line is emitted when `extra = 0` and `discountPercent = 0`.

## Example — extra only

Product 100 + 20 extra, quantity 3, no discount:

```text
🛒 تفاصيل الطلب:

▪️ ماركت:

1. عسل نحل × 3
السعر: 360 جنيه
↳ إضافة: +60 جنيه

💵 إجمالي الإضافات:
60 جنيه

💰 إجمالي الطلب:
360 جنيه
```

## Example — discount only

Product 100 with 20% discount, quantity 2:

```text
1. عسل نحل × 2
السعر: 160 جنيه
↳ خصم 20%: -40 جنيه

🏷️ إجمالي الخصم:
40 جنيه

💰 إجمالي الطلب:
160 جنيه
```

## Example — both + option

Product 100 + extra 20, 20% discount, option +10, quantity 2. Final unit 106,
line total 212, additions 40, discount 48:

```text
1. عسل نحل × 2
السعر: 212 جنيه
↳ إضافة: +40 جنيه
↳ خصم 20%: -48 جنيه
↳ الحجم: كبير (+10)

💵 إجمالي الإضافات:
40 جنيه
🏷️ إجمالي الخصم:
48 جنيه

💰 إجمالي الطلب:
212 جنيه
```

## Acceptance checks

- The message total equals the checkout grand-total breakdown.
- Additions total equals `extra × qty` summed across lines.
- Discount total equals the checkout discount.
- Removing extra/discount removes the corresponding lines and summaries.
- Arabic copy and plain-text sending remain valid (no markup).
