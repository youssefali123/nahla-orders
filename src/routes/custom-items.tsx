import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { BackButton } from "@/components/BackButton";
import { ProductGrid } from "@/components/ProductCard";
import {
  getFeaturedProducts,
  getProductsWithOptions,
  type Product,
} from "@/lib/catalog";
import { SUPABASE_ENABLED } from "@/config/site";

type CustomItemsLoaderData = {
  products: Product[];
  optionFlags: Record<string, boolean>;
  error: string | null;
};

export const Route = createFileRoute("/custom-items")({
  loader: async (): Promise<CustomItemsLoaderData> => {
    if (!SUPABASE_ENABLED) {
      throw redirect({ to: "/" });
    }
    try {
      const products = await getFeaturedProducts(100);

      const optionFlags = await getProductsWithOptions(products.map((p) => p.id));
      return { products, optionFlags, error: null };
    } catch (error) {
      console.error(error);
      return { products: [], optionFlags: {}, error: "حصل خطأ، حاول تاني." };
    }
  },
  head: () => ({
    meta: [
      { title: "الأكثر طلبًا | نحلة" },
      { name: "description", content: "كل المنتجات الأكثر طلبًا في نحلة." },
      { property: "og:title", content: "الأكثر طلبًا | نحلة" },
      { property: "og:description", content: "تصفح المنتجات الأكثر طلبًا واطلبها بسرعة." },
    ],
  }),
  component: CustomItemsPage,
});

function CustomItemsPage() {
  const { products, optionFlags, error } = Route.useLoaderData();
  const router = useRouter();

  return (
    <div className="mx-auto max-w-5xl space-y-4 px-3 pt-4">
      <div className="flex items-center gap-3">
        <BackButton />
        <h1 className="text-xl font-extrabold">🔥 عروض خاصة</h1>
      </div>

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
      ) : products.length > 0 ? (
        <ProductGrid products={products} optionFlags={optionFlags} />
      ) : (
        <div className="rounded-2xl bg-card p-8 text-center shadow-soft">
          <p className="text-4xl">🐝</p>
          <p className="mt-2 font-bold">مفيش منتجات متاحة حالياً.</p>
        </div>
      )}
    </div>
  );
}
