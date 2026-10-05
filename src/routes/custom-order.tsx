import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/custom-order")({
  head: () => ({
    meta: [
      { title: "طلب مخصص | نحلة" },
      { name: "description", content: "اكتب طلبك بنفسك وإحنا نحاول نوفرهولك ونوصلّه لحد باب البيت." },
      { property: "og:title", content: "طلب مخصص | نحلة" },
      { property: "og:description", content: "مش لاقي اللي بتدور عليه؟ اكتب طلبك في نحلة." },
    ],
  }),
  component: CustomOrderPage,
});

function CustomOrderPage() {
  const [text, setText] = useState("");
  const { add } = useCart();
  const navigate = useNavigate();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const note = text.trim();
    if (!note) {
      toast.error("اكتب طلبك الأول 🐝");
      return;
    }
    add({ id: `custom-${Date.now()}`, name: "طلب مخصص", price: 0, icon: "✍️", note });
    toast.success("تمت إضافة طلبك المخصص للسلة 🐝");
    setText("");
    navigate({ to: "/cart" });
  }

  return (
    <div className="mx-auto max-w-2xl px-3 pt-4">
      <form onSubmit={submit} className="space-y-4 rounded-3xl bg-card p-5 shadow-card">
        <div>
          <h1 className="text-2xl font-extrabold">اطلب اللي على مزاجك</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            مش لاقي اللي بتدور عليه؟ اكتب طلبك وإحنا نحاول نوفرهولك.
          </p>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={7}
          placeholder="اكتب طلبك هنا..."
          className="w-full resize-none rounded-2xl border border-border bg-muted p-4 text-sm outline-none transition-colors focus:border-primary focus:bg-card"
        />
        <button
          type="submit"
          className="h-13 w-full rounded-xl bg-primary py-3.5 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          أضف للسلة
        </button>
      </form>
    </div>
  );
}
