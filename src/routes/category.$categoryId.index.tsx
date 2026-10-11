import { createFileRoute, Link, notFound, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { BackButton } from "@/components/BackButton";
import { FilterBar } from "@/components/FilterBar";
import { ProductGrid } from "@/components/ProductCard";
import {
  getActiveSubcategories,
  getCategory,
  getProductsWithFilters,
  getProductsWithOptions,
  getSectionFilters,
  type Category,
  type DisplayFilter,
  type ProductWithFilter,
  type Subcategory,
} from "@/lib/catalog";

type CategoryLoaderData = {
  category: Category | null;
  subcategories: Subcategory[];
  products: ProductWithFilter[];
  filters: DisplayFilter[];
  optionFlags: Record<string, boolean>;
  error: string | null;
};

export const Route = createFileRoute("/category/$categoryId/")({
  loader: async ({ params }): Promise<CategoryLoaderData> => {
    let category: Category | null;
    try {
      category = await getCategory(params.categoryId);
    } catch (error) {
      console.error(error);
      return { category: null, subcategories: [], products: [], filters: [], optionFlags: {}, error: "حصل خطأ، حاول تاني." };
    }
    if (!category) throw notFound();
    if (category.type === "custom_order") throw redirect({ to: "/custom-order" });
    try {
      const subcategories = await getActiveSubcategories(category.id);
      const products = subcategories.length === 0 ? await getProductsWithFilters(category.id) : [];
      const [optionFlags, filters] = await Promise.all([
        getProductsWithOptions(products.map((p) => p.id)),
        subcategories.length === 0 ? getSectionFilters("category", category.id) : Promise.resolve([] as DisplayFilter[]),
      ]);
      return { category, subcategories, products, filters, optionFlags, error: null };
    } catch (error) {
      console.error(error);
      return { category, subcategories: [], products: [], filters: [], optionFlags: {}, error: "حصل خطأ، حاول تاني." };
    }
  },
  head: ({ loaderData }) => {
    const category = loaderData?.category;
    const title = category ? `${category.name} | نحلة` : "الأقسام | نحلة";
    const description = category
      ? `تصفح ${category.name} في نحلة واطلب بسرعة مع توصيل لحد باب البيت.`
      : "تصفح أقسام نحلة واطلب بسرعة.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category, subcategories, products, filters, optionFlags, error } = Route.useLoaderData();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const visibleProducts = selectedFilter ? products.filter((p) => p.filter_id === selectedFilter) : products;

  if (error || !category) {
    return (
      <div className="mx-auto max-w-5xl px-3 pt-10 text-center">
        <div className="flex justify-start">
          <BackButton />
        </div>
        <p className="text-5xl">🐝</p>
        <p className="mt-3 font-bold">{error ?? "حصل خطأ، حاول تاني."}</p>
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

  return (
    <div className="mx-auto max-w-5xl space-y-5 px-3 pt-4">
      <div className="flex items-center gap-3">
        <BackButton />
        <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-primary/12 text-2xl" aria-hidden>
          {category.image_url ? (
            <img src={category.image_url} alt="" className="h-full w-full object-cover" />
          ) : (
            (category.icon ?? "🐝")
          )}
        </span>
        <h1 className="truncate text-xl font-extrabold">{category.name}</h1>
      </div>

      {subcategories.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {subcategories.map((sub) => (
            <Link
              key={sub.id}
              to="/category/$categoryId/$subId"
              params={{ categoryId: category.id, subId: sub.id }}
              className="flex flex-col items-center gap-2 rounded-2xl bg-card p-4 text-center shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
            >
              <span className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl bg-accent/25 text-3xl" aria-hidden>
                {sub.image_url ? (
                  <img src={sub.image_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  (sub.icon ?? "🐝")
                )}
              </span>
              <span className="text-sm font-bold leading-tight">{sub.name}</span>
            </Link>
          ))}
        </div>
      ) : products.length > 0 ? (
        <>
          {filters.length > 0 && (
            <FilterBar filters={filters} selected={selectedFilter} onSelect={setSelectedFilter} />
          )}
          {visibleProducts.length > 0 ? (
            <ProductGrid products={visibleProducts} optionFlags={optionFlags} />
          ) : (
            <div className="rounded-2xl bg-card p-8 text-center shadow-soft">
              <p className="text-4xl">🐝</p>
              <p className="mt-2 font-bold">مفيش منتجات في القسم ده حالياً.</p>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl bg-card p-8 text-center shadow-soft">
          <p className="text-4xl">🐝</p>
          <p className="mt-2 font-bold">مفيش منتجات في القسم ده حالياً.</p>
          <Link to="/" className="mt-4 inline-flex text-sm font-bold text-primary-dark">
            العودة للرئيسية
          </Link>
        </div>
      )}
    </div>
  );
}
