import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BackButton } from "@/components/BackButton";
import { useCart } from "@/lib/cart";
import { getCategory, getSubcategory } from "@/lib/catalog";

export const Route = createFileRoute("/custom-order")({
  validateSearch: (search: Record<string, unknown>): { cat?: string; sub?: string } => ({
    ...(typeof search["cat"] === "string" ? { cat: search["cat"] } : {}),
    ...(typeof search["sub"] === "string" ? { sub: search["sub"] } : {}),
  }),
  loaderDeps: ({ search }) => ({ cat: search.cat, sub: search.sub }),
  loader: async ({ deps }): Promise<{ categoryName: string | null; subName: string | null }> => {
    try {
      if (!deps.cat) return { categoryName: null, subName: null };
      const category = await getCategory(deps.cat);
      if (!category) return { categoryName: null, subName: null };
      if (!deps.sub) return { categoryName: category.name, subName: null };
      const sub = await getSubcategory(deps.cat, deps.sub);
      if (!sub) return { categoryName: category.name, subName: null };
      return { categoryName: category.name, subName: sub.name };
    } catch (error) {
      console.error(error);
      return { categoryName: null, subName: null };
    }
  },
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
  const { cat, sub } = Route.useSearch();
  const { categoryName, subName } = Route.useLoaderData();
  const { add } = useCart();
  const navigate = useNavigate();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const note = text.trim();
    if (!note) {
      toast.error("اكتب طلبك الأول 🐝");
      return;
    }
    add({
      id: `custom-${Date.now()}`,
      name: "طلب مخصص",
      price: 0,
      icon: "✍️",
      note,
      ...(sub && subName ? { subcategoryId: sub, subcategoryName: subName } : {}),
    });
    toast.success("تمت إضافة طلبك المخصص للسلة 🐝");
    setText("");
    navigate({ to: "/cart" });
  }

  return (
    <div className="mx-auto max-w-2xl px-3 pt-4">
      <div className="mb-3 flex items-center gap-3">
        <BackButton />
        <h1 className="text-xl font-extrabold">طلب مخصص{subName ? ` — ${subName}` : ""}</h1>
      </div>
      <form onSubmit={submit} className="space-y-4 rounded-3xl bg-card p-5 shadow-card">
        <div>
          <h1 className="text-2xl font-extrabold">اطلب اللي على مزاجك</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {subName
              ? `القسم ده فاضي حاليًا — اكتب اللي نفسك فيه من ${subName} (${categoryName}) وإحنا نحاول نوفرهولك.`
              : "مش لاقي اللي بتدور عليه؟ اكتب طلبك وإحنا نحاول نوفرهولك."}
          </p>
        </div>
        {cat && !subName && categoryName && (
          <p className="rounded-xl bg-muted p-3 text-center text-xs font-bold text-muted-foreground">
            طلب مخصص في قسم: {categoryName}
          </p>
        )}
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
