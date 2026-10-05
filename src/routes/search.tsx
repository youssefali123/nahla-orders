import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ProductGrid } from "@/components/ProductCard";
import { searchProducts, getProductsWithOptions, type Product } from "@/lib/catalog";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? search["q"] : "",
  }),
  loaderDeps: ({ search }) => ({ q: search.q }),
  loader: async ({ deps }): Promise<{ results: Product[]; optionFlags: Record<string, boolean>; error: string | null }> => {
    try {
      const results = await searchProducts(deps.q);
      const optionFlags = await getProductsWithOptions(results.map((p) => p.id));
      return { results, optionFlags, error: null };
    } catch (error) {
      console.error(error);
      return { results: [], optionFlags: {}, error: "حصل خطأ، حاول تاني." };
    }
  },
  head: () => ({
    meta: [
      { title: "نتائج البحث | نحلة" },
      { name: "description", content: "ابحث عن أي منتج في نحلة واطلبه في ثواني." },
      { property: "og:title", content: "نتائج البحث | نحلة" },
      { property: "og:description", content: "ابحث عن منتجاتك المفضلة واطلبها بسرعة." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const { results, optionFlags, error } = Route.useLoaderData();
  const router = useRouter();

  return (
    <div className="mx-auto max-w-5xl space-y-4 px-3 pt-4">
      <h1 className="text-xl font-extrabold">نتائج البحث عن: {q}</h1>
      {error ? (
        <div className="rounded-2xl bg-card p-8 text-center shadow-soft">
          <p className="text-4xl">🐝</p>
          <p className="mt-2 font-bold">{error}</p>
          <button
            type="button"
            onClick={() => router.invalidate()}
            className="mt-4 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground"
          >
            حاول تاني
          </button>
        </div>
      ) : results.length > 0 ? (
        <ProductGrid products={results} optionFlags={optionFlags} />
      ) : (
        <div className="rounded-2xl bg-card p-8 text-center shadow-soft">
          <p className="text-4xl">🐝</p>
          <p className="mt-2 font-bold">مفيش نتائج مطابقة</p>
          <p className="mt-1 text-sm text-muted-foreground">جرّب اسم تاني، أو اطلبه كطلب مخصص.</p>
          <Link
            to="/custom-order"
            className="mt-4 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground"
          >
            اطلب طلب مخصص
          </Link>
        </div>
      )}
    </div>
  );
}
