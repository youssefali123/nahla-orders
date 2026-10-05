import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BackButton } from "@/components/BackButton";
import { site } from "@/config/site";
import { getProduct, type ConfiguredGroup, type ConfiguredProduct } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/product/$productId")({
  loader: async ({ params }): Promise<{ product: ConfiguredProduct | null; error: string | null }> => {
    let product: ConfiguredProduct | null;
    try {
      product = await getProduct(params.productId);
    } catch (error) {
      console.error(error);
      return { product: null, error: "حصل خطأ، حاول تاني." };
    }
    if (!product) throw notFound();
    return { product, error: null };
  },
  head: ({ loaderData }) => {
    const product = loaderData?.product;
    const title = product ? `${product.name} | نحلة` : "منتج | نحلة";
    const description = product?.description ?? "تفاصيل المنتج في نحلة.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product, error } = Route.useLoaderData();
  const router = useRouter();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [picked, setPicked] = useState<Record<string, string[]>>({});
  const [triedSubmit, setTriedSubmit] = useState(false);
  const groups = product?.option_groups ?? [];

  function toggleOption(group: ConfiguredGroup, optionId: string) {
    setPicked((prev) => {
      const current = prev[group.id] ?? [];
      if (group.type === "single") {
        return { ...prev, [group.id]: current.includes(optionId) ? [] : [optionId] };
      }
      if (current.includes(optionId)) {
        return { ...prev, [group.id]: current.filter((id) => id !== optionId) };
      }
      if (group.max_selections !== null && current.length >= group.max_selections) {
        toast.error(`اختار بحد أقصى ${group.max_selections} من ${group.name}`);
        return prev;
      }
      return { ...prev, [group.id]: [...current, optionId] };
    });
  }

  function groupError(group: ConfiguredGroup): string | null {
    if (!triedSubmit || group.min_selections <= 0) return null;
    const count = (picked[group.id] ?? []).length;
    return count >= group.min_selections ? null : `اختار ${group.min_selections === 1 ? "اختيار واحد" : `بحد أدنى ${group.min_selections}`} من ${group.name}`;
  }

  const selectionValid = groups.every((g) => (picked[g.id] ?? []).length >= g.min_selections);

  const selectedOptions = groups.flatMap((g) =>
    g.options
      .filter((o) => (picked[g.id] ?? []).includes(o.id))
      .map((o) => ({
        groupId: g.id,
        groupName: g.name,
        optionId: o.id,
        optionName: o.name,
        priceDelta: Number(o.price_delta),
      })),
  );

  const unitPrice = (product?.price ?? 0) + selectedOptions.reduce((n, s) => n + s.priceDelta, 0);

  if (error || !product) {
    if (!error) throw notFound();
    return (
      <div className="mx-auto max-w-3xl px-3 pt-10 text-center">
        <div className="flex justify-start">
          <BackButton />
        </div>
        <p className="text-5xl">🐝</p>
        <p className="mt-3 font-bold">{error}</p>
        <button
          type="button"
          onClick={() => router.invalidate()}
          className="mt-4 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground"
        >
          حاول تاني
        </button>
      </div>
    );
  }

  if (!product.is_active) {
    return (
      <div className="mx-auto max-w-3xl px-3 pt-4">
        <div className="mb-3">
          <BackButton />
        </div>
        <div className="rounded-3xl bg-card p-8 text-center shadow-card">
          <p className="text-5xl">🐝</p>
          <h1 className="mt-3 text-xl font-extrabold">{product.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">المنتج غير متاح حالياً.</p>
          <Link
            to="/"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-3 pt-4">
      <div className="mb-3">
        <BackButton />
      </div>
      <div className="overflow-hidden rounded-3xl bg-card shadow-card">
        <div className="grid aspect-square w-full place-items-center overflow-hidden bg-muted text-[7rem] sm:aspect-[16/9]" aria-hidden>
          {product.image_url ? (
            <img src={product.image_url} alt="" className="h-full w-full object-cover" />
          ) : (
            (product.icon ?? "🐝")
          )}
        </div>
        <div className="space-y-3 p-4">
          <h1 className="text-2xl font-extrabold">{product.name}</h1>
          {product.unit && <p className="text-sm text-muted-foreground">{product.unit}</p>}
          <p className="text-2xl font-extrabold text-primary-dark">
            {product.price} {site.currency}
          </p>
          {product.description && <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>}

          {groups.map((group) => {
            const err = groupError(group);
            return (
              <div key={group.id} className="rounded-2xl bg-muted p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-extrabold">
                    {group.name}
                    {group.min_selections > 0 && <span className="text-destructive"> *</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {group.type === "single"
                      ? group.min_selections > 0
                        ? "اختار واحد"
                        : "اختياري"
                      : group.max_selections !== null
                        ? `اختار حتى ${group.max_selections}`
                        : "اختار اللي يعجبك"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((option) => {
                    const active = (picked[group.id] ?? []).includes(option.id);
                    const delta = Number(option.price_delta);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => toggleOption(group, option.id)}
                        aria-pressed={active}
                        className={`inline-flex h-10 items-center gap-1.5 rounded-xl px-4 text-sm font-bold transition-all active:scale-95 ${
                          active
                            ? "bg-primary text-primary-foreground shadow-soft"
                            : "bg-card text-foreground shadow-soft hover:bg-card"
                        }`}
                      >
                        {option.name}
                        {delta !== 0 && <span className="text-xs opacity-80">{delta > 0 ? `+${delta}` : delta}</span>}
                      </button>
                    );
                  })}
                </div>
                {err && <p className="mt-1.5 text-xs font-semibold text-destructive">{err}</p>}
              </div>
            );
          })}

          <div className="flex items-center gap-3 pt-2">
            <span className="text-sm font-bold">الكمية</span>
            <div className="flex h-12 items-center gap-1 rounded-xl bg-muted px-1">
              <button
                type="button"
                aria-label="زيادة"
                onClick={() => setQty((q) => q + 1)}
                className="grid h-10 w-10 place-items-center rounded-lg bg-card shadow-soft"
              >
                <Plus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-base font-extrabold">{qty}</span>
              <button
                type="button"
                aria-label="تقليل"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-10 w-10 place-items-center rounded-lg bg-card shadow-soft"
              >
                <Minus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-base font-extrabold">
            <span>الإجمالي</span>
            <span className="text-primary-dark">
              {unitPrice * qty} {site.currency}
            </span>
          </div>

          <div className="flex flex-col gap-2 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                if (!selectionValid) {
                  setTriedSubmit(true);
                  toast.error("فضلاً أكمل الاختيارات المطلوبة");
                  return;
                }
                add(
                  {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    icon: product.icon ?? "🐝",
                    image: product.image_url,
                    selectedOptions,
                  },
                  qty,
                );
                toast.success("تمت إضافة المنتج للسلة 🐝");
              }}
              className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.99]"
            >
              <ShoppingCart className="h-5 w-5" />
              أضف للسلة
            </button>
            <Link
              to="/cart"
              className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3.5 text-base font-bold text-accent-foreground transition-opacity hover:opacity-90"
            >
              السلة
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
