export type PricingInput = {
  base: number; // products.price
  extra: number; // products.extra_price, >= 0, default 0
  discountPercent: number; // products.discount_percent, 0..100, default 0
};

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function normalizeExtraPrice(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return round2(n);
}

export function normalizeDiscountPercent(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 0 || n > 100) return 0;
  return round2(n);
}

export function isOnOffer(pricing: PricingInput): boolean {
  return normalizeDiscountPercent(pricing.discountPercent) > 0;
}

export function grossUnitPrice(
  pricing: PricingInput,
  optionDeltas = 0,
): number {
  const base = Number.isFinite(pricing.base) ? pricing.base : 0;
  const extra = normalizeExtraPrice(pricing.extra);
  const options = Number.isFinite(optionDeltas) ? optionDeltas : 0;
  return round2(base + extra + options);
}

export function discountPerUnit(pricing: PricingInput): number {
  const base = Number.isFinite(pricing.base) ? pricing.base : 0;
  const extra = normalizeExtraPrice(pricing.extra);
  const d = normalizeDiscountPercent(pricing.discountPercent) / 100;
  return round2((base + extra) * d);
}

export function unitPrice(pricing: PricingInput, optionDeltas = 0): number {
  const base = Number.isFinite(pricing.base) ? pricing.base : 0;
  const extra = normalizeExtraPrice(pricing.extra);
  const d = normalizeDiscountPercent(pricing.discountPercent) / 100;
  const options = Number.isFinite(optionDeltas) ? optionDeltas : 0;
  const discountedBaseExtra = (base + extra) * (1 - d);
  return round2(discountedBaseExtra + options);
}

export function lineTotal(
  pricing: PricingInput,
  qty: number,
  optionDeltas = 0,
): number {
  const validQty = Number.isFinite(qty) && qty > 0 ? qty : 0;
  return round2(unitPrice(pricing, optionDeltas) * validQty);
}

export function lineExtraTotal(pricing: PricingInput, qty: number): number {
  const validQty = Number.isFinite(qty) && qty > 0 ? qty : 0;
  return round2(normalizeExtraPrice(pricing.extra) * validQty);
}

export function lineDiscountTotal(pricing: PricingInput, qty: number): number {
  const validQty = Number.isFinite(qty) && qty > 0 ? qty : 0;
  return round2(discountPerUnit(pricing) * validQty);
}
