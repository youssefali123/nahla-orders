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
  getCategory,
  getGroup,
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

type GroupLoaderData = {
  category: Category | null;
  sub: Subcategory | null;
  group: ProductGroup | null;
  products: ProductWithFilter[];
  filters: DisplayFilter[];
  optionFlags: Record<string, boolean>;
  error: string | null;
};

export const Route = createFileRoute("/category/$categoryId/$subId/$groupId")({
  loader: async ({ params }): Promise<GroupLoaderData> => {
    if (!SUPABASE_ENABLED) {
      throw redirect({ to: "/" });
    }
    let category: Category | null;
    let sub: Subcategory | null;
    let group: ProductGroup | null;

    try {
      category = await getCategory(params.categoryId);
      sub = await getSubcategory(params.categoryId, params.subId);
      group = await getGroup(params.subId, params.groupId);
    } catch (error) {
      console.error(error);
      return {
        category: null,
        sub: null,
        group: null,
        products: [],
        filters: [],
        optionFlags: {},
        error: "حصل خطأ، حاول تاني.",
      };
    }
    if (!category || !sub || !group) throw notFound();
    try {
      const products = await getProductsWithFilters(
        category.id,
        sub.id,
        group.id,
      );
      const [optionFlags, filters] = await Promise.all([
        getProductsWithOptions(products.map((p) => p.id)),
        getSectionFilters("group", group.id),
      ]);
      return {
        category,
        sub,
        group,
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
        group,
        products: [],
        filters: [],
        optionFlags: {},
        error: "حصل خطأ، حاول تاني.",
      };
    }
  },
  head: ({ loaderData }) => {
    const group = loaderData?.group;
    const title = group ? `${group.name} | نحلة` : "المنتجات | نحلة";
    const description = group
      ? `اطلب ${group.name} من نحلة بأسعار مناسبة وتوصيل سريع.`
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
  component: GroupPage,
});

function GroupPage() {
  const { category, sub, group, products, filters, optionFlags, error } =
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

  if (error || !category || !sub || !group) {
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
        <div className="flex min-w-0 items-center gap-1 text-xs font-semibold text-muted-foreground">
          <Link
            to="/category/$categoryId"
            params={{ categoryId: category.id }}
            className="truncate hover:text-foreground"
          >
            {category.name}
          </Link>
          <ChevronLeft className="h-3.5 w-3.5 shrink-0" />
          <Link
            to="/category/$categoryId/$subId"
            params={{ categoryId: category.id, subId: sub.id }}
            className="truncate hover:text-foreground"
          >
            {sub.name}
          </Link>
          <ChevronLeft className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate text-foreground">{group.name}</span>
        </div>
        <BackButton />
      </nav>

      <h1 className="text-xl font-extrabold">
        <span className="ml-2" aria-hidden>
          {group.icon ?? "🐝"}
        </span>
        {group.name}
      </h1>

      {group.requires_preorder && (
        <Notice text="الطلبات من المجموعة دي يجب طلبها قبلها بيوم." />
      )}

      {products.length > 0 ? (
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
              layout={group.product_layout}
            />
          ) : (
            <div className="rounded-2xl bg-card p-8 text-center shadow-soft">
              <p className="text-4xl">🐝</p>
              <p className="mt-2 font-bold">
                مفيش منتجات في المجموعة دي حالياً.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl bg-card p-8 text-center shadow-soft">
          <p className="text-4xl">🐝</p>
          <p className="mt-2 font-bold">مفيش منتجات في المجموعة دي حالياً.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            لو نفسك في حاجة معينة، اكتبهالنا كطلب مخصص.
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
