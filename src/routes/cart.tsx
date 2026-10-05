import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { site } from "@/config/site";
import { useCart, useLiveProducts, type CartItem } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "السلة | نحلة" },
      { name: "description", content: "راجع منتجات سلتك، عدّل الكميات وأكمل طلبك من نحلة في خطوات بسيطة." },
      { property: "og:title", content: "السلة | نحلة" },
      { property: "og:description", content: "عدّل كميات طلبك وأكمل الطلب بسرعة." },
    ],
  }),
  component: CartPage,
});

function isUnavailable(item: CartItem, live: Map<string, { id: string }> | null) {
  return !item.note && live !== null && !live.has(item.id);
}

function liveUnitPrice(item: CartItem, live: Map<string, { price: number }> | null) {
  if (item.note) return 0;
  const base = live?.get(item.id)?.price ?? item.price;
  const deltas = (item.selectedOptions ?? []).reduce((n, s) => n + s.priceDelta, 0);
  return base + deltas;
}

function CartPage() {
  const { items, increase, decrease, remove } = useCart();
  const { live } = useLiveProducts();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-3 pt-4 text-center">
        <div className="flex justify-start">
          <BackButton />
        </div>
        <img src="/favicon.png" alt={site.name} className="mx-auto h-32 w-32 rounded-3xl object-cover" />
        <h1 className="mt-4 text-xl font-extrabold">السلة لسه فاضية 🐝</h1>
        <p className="mt-2 text-sm text-muted-foreground">اختار اللي نفسك فيه وإحنا نوصلّهولك.</p>
        <Link
          to="/"
          className="mt-6 inline-flex h-13 items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          ابدأ التسوق
        </Link>
      </div>
    );
  }

  const total = items.reduce((n, i) => (isUnavailable(i, live) ? n : n + liveUnitPrice(i, live) * i.qty), 0);
  const orderable = items.some((i) => !isUnavailable(i, live));

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-3 pt-4">
      <div className="flex items-center gap-3">
        <BackButton />
        <h1 className="text-xl font-extrabold">السلة</h1>
      </div>

      <ul className="space-y-3">
        {items.map((item) => {
          const unavailable = isUnavailable(item, live);
          const price = liveUnitPrice(item, live);
          const selections = item.selectedOptions ?? [];
          const visual = (
            <>
              <span
                className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-muted text-3xl"
                aria-hidden
              >
                {item.image ? (
                  <img src={item.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  item.icon
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate font-bold group-hover:text-primary-dark group-hover:underline">
                  {item.name}
                </p>
                {item.note ? (
                  <p className="mt-0.5 line-clamp-3 text-xs text-muted-foreground">{item.note}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {price} {site.currency}
                  </p>
                )}
                {selections.length > 0 && (
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                    {selections.map((s) => `${s.groupName}: ${s.optionName}`).join("، ")}
                  </p>
                )}
                {unavailable && (
                  <p className="mt-1 inline-block rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-bold text-destructive">
                    غير متاح حالياً
                  </p>
                )}
              </div>
            </>
          );

          return (
            <li key={item.key} className="rounded-2xl bg-card p-3 shadow-soft">
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                {item.note || unavailable ? (
                  visual
                ) : (
                  <Link
                    to="/product/$productId"
                    params={{ productId: item.id }}
                    aria-label={item.name}
                    className="contents group"
                  >
                    {visual}
                  </Link>
                )}
                <button
                  type="button"
                  aria-label="حذف"
                  onClick={() => remove(item.key)}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              {!item.note && !unavailable && (
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex h-11 items-center gap-1 rounded-xl bg-muted px-1">
                    <button
                      type="button"
                      aria-label="زيادة"
                      onClick={() => increase(item.key)}
                      className="grid h-9 w-9 place-items-center rounded-lg bg-card shadow-soft"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <span className="w-9 text-center font-extrabold">{item.qty}</span>
                    <button
                      type="button"
                      aria-label="تقليل"
                      onClick={() => decrease(item.key)}
                      className="grid h-9 w-9 place-items-center rounded-lg bg-card shadow-soft"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="font-extrabold text-primary-dark">
                    {item.qty * price} {site.currency}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="sticky bottom-3 space-y-3 rounded-2xl bg-card p-4 shadow-card">
        <div className="flex items-center justify-between text-base font-extrabold">
          <span>إجمالي الطلب</span>
          <span className="text-primary-dark">
            {total} {site.currency}
          </span>
        </div>
        {orderable ? (
          <Link
            to="/checkout"
            className="flex h-13 w-full items-center justify-center rounded-xl bg-primary py-3.5 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            إتمام الطلب
          </Link>
        ) : (
          <p className="rounded-xl bg-muted p-3 text-center text-sm font-bold text-muted-foreground">
            كل المنتجات في السلة غير متاحة حالياً.
          </p>
        )}
      </div>
    </div>
  );
}
