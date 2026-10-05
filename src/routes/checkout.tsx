import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BackButton } from "@/components/BackButton";
import { site } from "@/config/site";
import { useCart, useLiveProducts, type CartItem, type SelectedOption } from "@/lib/cart";
import { getProduct } from "@/lib/catalog";
import { buildOrderMessage, type CustomerInfo } from "@/lib/whatsapp";
import sendOrderMessage from "@/services/send_order";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "إتمام الطلب | نحلة" },
      { name: "description", content: "أدخل بياناتك وأكد طلبك ليتم إرساله لفريق نحلة فورًا." },
      { property: "og:title", content: "إتمام الطلب | نحلة" },
      { property: "og:description", content: "بيانات التوصيل وتأكيد الطلب في خطوة واحدة." },
    ],
  }),
  component: CheckoutPage,
});

type Errors = Partial<Record<keyof CustomerInfo, string>>;

function CheckoutPage() {
  const { items, clear } = useCart();
  const { live } = useLiveProducts();
  const navigate = useNavigate();
  const [form, setForm] = useState<CustomerInfo>({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);

  // Reconcile with the live catalog: drop deleted/inactive products and use
  // current prices. While the lookup is in flight, fall back to stored values.
  const orderable: CartItem[] =
    live === null ? items : items.filter((i) => i.note || live.has(i.id));
  const baseOf = (item: CartItem) => (item.note ? item.price : (live?.get(item.id)?.price ?? item.price));
  const unitOf = (item: CartItem, selections: SelectedOption[] = item.selectedOptions ?? []) =>
    baseOf(item) + selections.reduce((n, s) => n + s.priceDelta, 0);
  const total = orderable.reduce((n, i) => (i.note ? n : n + unitOf(i) * i.qty), 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-3 pt-10 text-center">
        <div className="flex justify-start">
          <BackButton />
        </div>
        <p className="text-5xl">🐝</p>
        <h1 className="mt-3 text-xl font-extrabold">السلة فاضية</h1>
        <p className="mt-2 text-sm text-muted-foreground">أضف منتجات الأول وبعدين أكمل الطلب.</p>
        <Link
          to="/"
          className="mt-6 inline-flex h-13 items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-base font-bold text-primary-foreground"
        >
          ابدأ التسوق
        </Link>
      </div>
    );
  }

  if (live !== null && orderable.length === 0) {
    return (
      <div className="mx-auto max-w-md px-3 pt-4">
        <div className="flex items-center gap-3">
          <BackButton />
          <h1 className="text-xl font-extrabold">بيانات التوصيل</h1>
        </div>
        <div className="mt-4 rounded-2xl bg-card p-8 text-center shadow-soft">
          <p className="text-5xl">🐝</p>
          <p className="mt-3 font-bold">المنتجات في السلة غير متاحة حالياً.</p>
          <Link
            to="/"
            className="mt-6 inline-flex h-13 items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-base font-bold text-primary-foreground"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  function validate(): boolean {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "الاسم مطلوب";
    const phone = form.phone.trim();
    if (!phone) next.phone = "رقم الهاتف مطلوب";
    else if (!/^(\+?20)?0?1[0125][0-9]{8}$/.test(phone.replace(/[\s-]/g, "")))
      next.phone = "اكتب رقم هاتف صحيح (مثال: 01012345678)";
    if (!form.address.trim()) next.address = "العنوان مطلوب";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (orderable.length === 0) {
      toast.error("مفيش منتجات متاحة للطلب حالياً");
      return;
    }
    if (!validate()) {
      toast.error("فضلاً راجع البيانات الناقصة");
      return;
    }
    setSending(true);
    try {
      // Never trust stored prices for configured items: re-read live trees.
      const needsLive = orderable.filter((i) => !i.note && (i.selectedOptions ?? []).length > 0);
      const trees = new Map<string, NonNullable<Awaited<ReturnType<typeof getProduct>>>>();
      await Promise.all(
        [...new Set(needsLive.map((i) => i.id))].map(async (id) => {
          const tree = await getProduct(id);
          if (tree) trees.set(id, tree);
        }),
      );
      const priced = orderable.flatMap((item) => {
        if (item.note) return [item];
        const base = baseOf(item);
        if ((item.selectedOptions ?? []).length === 0) return [{ ...item, price: base }];
        const tree = trees.get(item.id);
        if (!tree || !tree.is_active) return [];
        const selections: SelectedOption[] = (item.selectedOptions ?? []).flatMap((s) => {
          const group = tree.option_groups.find((g) => g.id === s.groupId && g.is_active);
          const option = group?.options.find((o) => o.id === s.optionId && o.is_active);
          if (!group || !option) return [];
          return [
            {
              groupId: group.id,
              groupName: group.name,
              optionId: option.id,
              optionName: option.name,
              priceDelta: Number(option.price_delta),
            },
          ];
        });
        return [{ ...item, name: tree.name, price: tree.price, selectedOptions: selections }];
      });
      if (priced.filter((i) => !i.note).length === 0 && priced.length > 0 && orderable.some((i) => !i.note)) {
        toast.error("الاختيارات المحفوظة لم تعد متاحة، راجع السلة");
        setSending(false);
        return;
      }
      const liveTotal = priced.reduce(
        (n, i) => (i.note ? n : n + (i.price + (i.selectedOptions ?? []).reduce((m, s) => m + s.priceDelta, 0)) * i.qty),
        0,
      );
      const message = buildOrderMessage(priced, form, liveTotal);
      const result = await sendOrderMessage(message);
      if (!result.ok) {
        toast.error(result.error || "تعذر إرسال الطلب، حاول تاني");
        setSending(false);
        return;
      }
      clear();
      navigate({ to: "/order-success" });
    } catch (error) {
      console.error(error);
      toast.error("تعذر تأكيد الأسعار الحالية، حاول تاني");
      setSending(false);
    }
  }

  const field =
    "h-12 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none transition-colors focus:border-primary focus:bg-card";

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-3 pt-4">
      <div className="flex items-center gap-3">
        <BackButton />
        <h1 className="text-xl font-extrabold">بيانات التوصيل</h1>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-3 rounded-2xl bg-card p-4 shadow-soft">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-bold">
              الاسم
            </label>
            <input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="اكتب اسمك"
              className={field}
            />
            {errors.name && <p className="mt-1 text-xs font-semibold text-destructive">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-bold">
              رقم الهاتف
            </label>
            <input
              id="phone"
              inputMode="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="01012345678"
              className={field}
            />
            {errors.phone && <p className="mt-1 text-xs font-semibold text-destructive">{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor="address" className="mb-1 block text-sm font-bold">
              العنوان
            </label>
            <textarea
              id="address"
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="اكتب عنوانك بالتفصيل"
              className="w-full resize-none rounded-xl border border-border bg-muted p-4 text-sm outline-none transition-colors focus:border-primary focus:bg-card"
            />
            {errors.address && <p className="mt-1 text-xs font-semibold text-destructive">{errors.address}</p>}
          </div>
        </div>

        <div className="space-y-2 rounded-2xl bg-card p-4 shadow-soft">
          <h2 className="font-extrabold">ملخص الطلب</h2>
          <ul className="divide-y divide-border">
            {orderable.map((item) => (
              <li key={item.key} className="flex items-start justify-between gap-3 py-2 text-sm">
                <span className="min-w-0">
                  <span className="font-bold">{item.name}</span>
                  {item.note ? (
                    <span className="block text-xs text-muted-foreground">{item.note}</span>
                  ) : (
                    <>
                      <span className="block text-xs text-muted-foreground">× {item.qty}</span>
                      {(item.selectedOptions ?? []).length > 0 && (
                        <span className="block text-xs text-muted-foreground">
                          {(item.selectedOptions ?? []).map((s) => `${s.groupName}: ${s.optionName}`).join("، ")}
                        </span>
                      )}
                    </>
                  )}
                </span>
                {!item.note && (
                  <span className="shrink-0 font-bold">
                    {unitOf(item) * item.qty} {site.currency}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-border pt-3 text-base font-extrabold">
            <span>الإجمالي</span>
            <span className="text-primary-dark">
              {total} {site.currency}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={sending}
          className="h-14 w-full rounded-xl bg-primary py-4 text-lg font-extrabold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {sending ? "جاري إرسال الطلب..." : "تأكيد الطلب"}
        </button>
        <p className="text-center text-xs text-muted-foreground">
          مفيش دفع أونلاين — الطلب هيتم إرساله مباشرة لفريق نحلة وهنأكده معاك.
        </p>
      </form>
    </div>
  );
}
