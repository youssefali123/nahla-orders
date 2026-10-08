import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingCart } from "lucide-react";
// import { toast } from "react-hot-toast";
import { toast } from "react-hot-toast";
import type { CSSProperties } from "react";



import { site } from "@/config/site";
import type { Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

export function ProductCard({ product, hasOptions = false, delay = 0 }: { product: Product; hasOptions?: boolean; delay?: number }) {
  const { qtyOf, add, increase, decrease } = useCart();
  const qty = qtyOf(product.id);

  return (
    <div
      className="anim-rise flex flex-col overflow-hidden rounded-2xl bg-card shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card"
      style={{ "--anim-delay": `${delay}ms` } as CSSProperties}
    >
      <Link to="/product/$productId" params={{ productId: product.id }} className="relative block">
        <div className="grid aspect-square place-items-center overflow-hidden bg-muted text-5xl sm:text-6xl">
          {product.image_url ? (
            <img src={product.image_url} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <span aria-hidden>{product.icon ?? "🐝"}</span>
          )}
        </div>
        {hasOptions && (
          <span className="absolute bottom-2 right-2 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground shadow-soft">
            قابل للتخصيص ✨
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <Link
          to="/product/$productId"
          params={{ productId: product.id }}
          className="line-clamp-2 text-sm font-bold leading-snug"
        >
          {product.name}
        </Link>
        {product.unit && <p className="text-xs text-muted-foreground">{product.unit}</p>}
        <p className="mt-auto pt-1 text-base font-extrabold text-primary-dark">
          {product.price} {site.currency}
        </p>

        {hasOptions ? (
          <Link
            to="/product/$productId"
            params={{ productId: product.id }}
            className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.98]"
          >
            خصص وأضف ✨
          </Link>
        ) : qty === 0 ? (
          <button
            type="button"
            onClick={() => {
              add({ id: product.id, name: product.name, price: product.price, icon: product.icon ?? "🐝", image: product.image_url });
              toast.success(`تمت إضافة ${product.name}  للسلة 🐝`);
            }}
            className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.98]"
          >
            <ShoppingCart className="h-4 w-4" />
            أضف للسلة
          </button>
        ) : (
          <div className="mt-2 flex h-11 items-center justify-between rounded-xl bg-primary px-1 text-primary-foreground">
            <button
              type="button"
              aria-label="زيادة"
              onClick={() => increase(product.id)}
              className="grid h-9 w-9 place-items-center rounded-lg transition-colors hover:bg-white/15"
            >
              <Plus className="h-4 w-4" />
            </button>
            <span className="text-base font-extrabold">{qty}</span>
            <button
              type="button"
              aria-label="تقليل"
              onClick={() => decrease(product.id)}
              className="grid h-9 w-9 place-items-center rounded-lg transition-colors hover:bg-white/15"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProductGrid({
  products,
  optionFlags = {},
}: {
  products: Product[];
  optionFlags?: Record<string, boolean>;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} hasOptions={optionFlags[p.id] ?? false} delay={Math.min(i, 7) * 45} />
      ))}
    </div>
  );
}
