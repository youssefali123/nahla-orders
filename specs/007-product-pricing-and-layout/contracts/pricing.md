# Contract: Pricing

**Feature**: `007-product-pricing-and-layout`

Single source of truth: `src/lib/pricing.ts`. UI, cart, checkout, and the order
message MUST call these helpers instead of re-implementing the formula.

## Input types

```ts
export type PricingInput = {
  base: number;            // products.price
  extra: number;           // products.extra_price, >= 0, default 0
  discountPercent: number; // products.discount_percent, 0..100, default 0
};
```

## Function contract

```ts
export function round2(value: number): number;

export function normalizeExtraPrice(value: unknown): number;      // finite >= 0 else 0
export function normalizeDiscountPercent(value: unknown): number; // finite 0..100 else 0

export function isOnOffer(pricing: PricingInput): boolean; // discountPercent > 0

export function grossUnitPrice(pricing: PricingInput, optionDeltas?: number): number;
export function unitPrice(pricing: PricingInput, optionDeltas?: number): number;
export function discountPerUnit(pricing: PricingInput): number;

export function lineTotal(pricing: PricingInput, qty: number, optionDeltas?: number): number;
export function lineExtraTotal(pricing: PricingInput, qty: number): number;
export function lineDiscountTotal(pricing: PricingInput, qty: number): number;
```

## Formulas

| Function | Result |
|---|---|
| `grossUnitPrice` | `round2(base + extra + optionDeltas)` |
| `unitPrice` | `round2((base + extra) × (1 − discountPercent / 100) + optionDeltas)` |
| `discountPerUnit` | `round2((base + extra) × discountPercent / 100)` |
| `lineTotal` | `round2(unitPrice(...) × qty)` |
| `lineExtraTotal` | `round2(extra × qty)` |
| `lineDiscountTotal` | `round2(discountPerUnit(...) × qty)` |

Defaults: `optionDeltas = 0`; `qty` is a positive integer in normal use.

## Invariants

1. `discountPercent = 0` → `unitPrice === grossUnitPrice`.
2. `extra = 0` → `lineExtraTotal === 0`.
3. `0 <= discountPercent <= 100` → `0 <= unitPrice <= grossUnitPrice + optionDeltas`
   (option deltas are not discounted).
4. `discountPercent = 100` → combined base + extra contributes `0`; only option
   deltas remain payable.
5. Legacy cart items without `extraPrice` / `discountPercent` behave as
   `0` / `0`, so their result equals today's `base + optionDeltas`.
6. Custom-order lines (`note` present) never call these helpers and keep price
   `0`.
7. Money is rounded to 2 decimals at unit, line, fee, and total boundaries;
   totals are sums of rounded line totals.

## Worked examples

| Base | Extra | Discount | Options | Gross unit | Final unit |
|---|---|---|---|---|---|
| 100 | 0 | 0% | 0 | 100 | 100 |
| 100 | 20 | 0% | 0 | 120 | 120 |
| 100 | 0 | 20% | 0 | 100 | 80 |
| 100 | 20 | 20% | 0 | 120 | 96 |
| 100 | 20 | 20% | +10 | 130 | 106 |
| 100 | 20 | 100% | +10 | 130 | 10 |
| 99.90 | 10.05 | 15% | +2.50 | 112.45 | 95.96 |

## Where it must be used

- `src/components/ProductCard.tsx` — grid and list cards.
- `src/routes/product.$productId.tsx` — displayed unit price and add-to-cart.
- `src/lib/cart.tsx` — `unitPriceOf` and the cart context total.
- `src/routes/cart.tsx` — live unit price and line totals.
- `src/routes/checkout.tsx` — screen summary, submit-time `liveTotal`, service
  fee, grand total.
- `src/lib/whatsapp.ts` — line totals, additions, discounts.
- `src/routes/admin.product-editor.tsx` — live preview and validation.
