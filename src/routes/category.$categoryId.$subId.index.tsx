import {
  createFileRoute,
  Link,
  notFound,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { FilterBar } from "@/components/FilterBar";
import { Notice } from "@/components/Notice";
import { ProductGrid } from "@/components/ProductCard";
import {
  getActiveGroups,
  getCategory,
  getProductsWithFilters,
  getProductsWithOptions,
  getSectionFilters,
  getSubcategory,
  type Category,
  type DisplayFilter,
  type ProductGroup,
  type ProductWithFilter,
  type Subcategory,
} from "@/lib/catalog";
import { SUPABASE_ENABLED } from "@/config/site";

type SubcategoryLoaderData = {
  category: Category | null;
  sub: Subcategory | null;
  groups: ProductGroup[];
  products: ProductWithFilter[];
  filters: DisplayFilter[];
  optionFlags: Record<string, boolean>;
  error: string | null;
};

export const Route = createFileRoute("/category/$categoryId/$subId/")({
  loader: async ({ params }): Promise<SubcategoryLoaderData> => {
    if (!SUPABASE_ENABLED) {
      throw redirect({ to: "/" });
    }
    let category: Category | null;

    let sub: Subcategory | null;
    try {
      category = await getCategory(params.categoryId);
      sub = await getSubcategory(params.categoryId, params.subId);
    } catch (error) {
      console.error(error);
      return {
        category: null,
        sub: null,
        groups: [],
        products: [],
        filters: [],
        optionFlags: {},
        error: "حصل خطأ، حاول تاني.",
      };
    }
    if (!category || !sub) throw notFound();
    try {
      const groups = await getActiveGroups(sub.id);
      const products =
        groups.length === 0
          ? await getProductsWithFilters(category.id, sub.id)
          : [];
      const [optionFlags, filters] = await Promise.all([
        getProductsWithOptions(products.map((p) => p.id)),
        groups.length === 0
          ? getSectionFilters("subcategory", sub.id)
          : Promise.resolve([] as DisplayFilter[]),
      ]);
      return {
        category,
        sub,
        groups,
        products,
        filters,
        optionFlags,
        error: null,
      };
    } catch (error) {
      console.error(error);
      return {
        category,
        sub,
        groups: [],
        products: [],
        filters: [],
        optionFlags: {},
        error: "حصل خطأ، حاول تاني.",
      };
    }
  },
  head: ({ loaderData }) => {
    const sub = loaderData?.sub;
    const title = sub ? `${sub.name} | نحلة` : "المنتجات | نحلة";
    const description = sub
      ? `اطلب ${sub.name} من نحلة بأسعار مناسبة وتوصيل سريع.`
      : "اطلب منتجاتك من نحلة بسرعة.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: SubcategoryPage,
});

function SubcategoryPage() {
  const { category, sub, groups, products, filters, optionFlags, error } =
    Route.useLoaderData();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  // "All" view follows the filter-bar grouping: each filter's products first
  // in bar order, unassigned products trail at the end.
  const filterOrder = new Map(filters.map((f, i) => [f.id, i]));
  const visibleProducts = selectedFilter
    ? products.filter((p) => p.filter_id === selectedFilter)
    : [...products].sort(
        (a, b) =>
          (a.filter_id
            ? (filterOrder.get(a.filter_id) ?? Number.MAX_SAFE_INTEGER)
            : Number.MAX_SAFE_INTEGER) -
            (b.filter_id
              ? (filterOrder.get(b.filter_id) ?? Number.MAX_SAFE_INTEGER)
              : Number.MAX_SAFE_INTEGER) || a.sort_order - b.sort_order,
      );

  if (error || !category || !sub) {
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
    <div className="mx-auto max-w-5xl space-y-4 px-3 pt-4">
      <nav className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
          <Link
            to="/category/$categoryId"
            params={{ categoryId: category.id }}
            className="hover:text-foreground"
          >
            {category.name}
          </Link>
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="text-foreground">{sub.name}</span>
        </div>
        <BackButton />
      </nav>

      <h1 className="text-xl font-extrabold">
        <span className="ml-2" aria-hidden>
          {sub.icon ?? "🐝"}
        </span>
        {sub.name}
      </h1>

      {sub.requires_preorder && (
        <Notice text="طلبات الأكل البيتي يجب طلبها قبلها بيوم." />
      )}

      {groups.length > 0 ? (
        <div className="grid grid-cols-3 gap-2.5 rounded-2xl bg-card p-3 shadow-soft sm:grid-cols-3 sm:p-4 md:grid-cols-4 lg:grid-cols-6">
          {groups.map((group) => (
            <Link
              key={group.id}
              to="/category/$categoryId/$subId/$groupId"
              params={{
                categoryId: category.id,
                subId: sub.id,
                groupId: group.id,
              }}
              className="group flex flex-col items-center gap-1.5 text-center"
            >
              <span
                className="grid aspect-square w-full place-items-center overflow-hidden rounded-2xl bg-accent/25 text-3xl transition-transform duration-300 group-hover:scale-[1.03] sm:text-4xl"
                aria-hidden
              >
                {group.image_url ? (
                  <img
                    src={group.image_url}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  (group.icon ?? "🐝")
                )}
              </span>
              <span className="line-clamp-2 text-xs font-bold leading-tight sm:text-sm">
                {group.name}
              </span>
            </Link>
          ))}
        </div>
      ) : products.length > 0 ? (
        <>
          {filters.length > 0 && (
            <FilterBar
              filters={filters}
              selected={selectedFilter}
              onSelect={setSelectedFilter}
            />
          )}
          {visibleProducts.length > 0 ? (
            <ProductGrid
              products={visibleProducts}
              optionFlags={optionFlags}
              layout={sub.product_layout}
            />
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
          <p className="mt-1 text-sm text-muted-foreground">
            لو نفسك في حاجة معينة من {sub.name}، اكتبهالنا كطلب مخصص.
          </p>
          <Link
            to="/custom-order"
            search={{ cat: category.id, sub: sub.id }}
            className="mt-4 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            اطلب طلب مخصص في {sub.name} ✍️
          </Link>
        </div>
      )}
    </div>
  );
}
