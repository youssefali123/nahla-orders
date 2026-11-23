import { site } from "@/config/site";
import {
  grossUnitPrice,
  isOnOffer,
  normalizeDiscountPercent,
  unitPrice,
} from "@/lib/pricing";
import { cn } from "@/lib/utils";

export type PriceBlockProps = {
  price: number;
  extraPrice?: number | null;
  discountPercent?: number | null;
  optionDeltas?: number;
  unit?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
  hideBadge?: boolean;
};

export function PriceBlock({
  price,
  extraPrice = 0,
  discountPercent = 0,
  optionDeltas = 0,
  unit,
  className,
  size = "md",
  hideBadge = false,
}: PriceBlockProps) {
  const pricing = {
    base: price,
    extra: extraPrice ?? 0,
    discountPercent: discountPercent ?? 0,
  };

  const finalPrice = Math.max(0, unitPrice(pricing, optionDeltas));
  const onOffer = isOnOffer(pricing);
  const grossPrice = Math.max(0, grossUnitPrice(pricing, optionDeltas));
  const discount = normalizeDiscountPercent(discountPercent);

  const sizeClasses = {
    sm: {
      final: "text-sm font-bold",
      old: "text-[11px]",
      badge: "text-[10px] px-1 py-0.5",
      unit: "text-[10px]",
    },
    md: {
      final: "text-base font-extrabold",
      old: "text-xs",
      badge: "text-[11px] px-1.5 py-0.5",
      unit: "text-[11px]",
    },
    lg: {
      final: "text-2xl font-black",
      old: "text-sm",
      badge: "text-xs px-2 py-0.5",
      unit: "text-xs",
    },
  }[size];

  if (!onOffer) {
    return (
      <div
        className={cn(
          "inline-flex items-baseline gap-1 text-primary-dark",
          className,
        )}
      >
        <span className={sizeClasses.final}>
          {finalPrice} {site.currency}
        </span>
        {unit && (
          <span
            className={cn(
              "font-semibold text-muted-foreground",
              sizeClasses.unit,
            )}
          >
            {" "}
            / {unit}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn("inline-flex flex-wrap items-baseline gap-1.5", className)}
    >
      <span
        className={cn("font-extrabold text-primary-dark", sizeClasses.final)}
      >
        {finalPrice} {site.currency}
      </span>
      <s
        className={cn(
          "font-medium text-muted-foreground line-through decoration-muted-foreground/70",
          sizeClasses.old,
        )}
      >
        <span className="sr-only">السعر الأصلي: </span>
        {grossPrice} {site.currency}
      </s>
      {!hideBadge && (
        <span
          className={cn(
            "rounded-full bg-red-500/10 font-bold text-red-600 dark:bg-red-950/40 dark:text-red-400",
            sizeClasses.badge,
          )}
        >
          خصم {discount}%
        </span>
      )}
      {unit && (
        <span
          className={cn(
            "font-semibold text-muted-foreground",
            sizeClasses.unit,
          )}
        >
          {" "}
          / {unit}
        </span>
      )}
    </div>
  );
}
