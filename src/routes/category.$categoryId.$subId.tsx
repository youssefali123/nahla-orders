import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { Notice } from "@/components/Notice";
import { ProductGrid } from "@/components/ProductCard";
import {
  getActiveProducts,
  getCategory,
  getProductsWithOptions,
  getSubcategory,
  type Category,
  type Product,
  type Subcategory,
} from "@/lib/catalog";

type SubcategoryLoaderData = {
  category: Category | null;
  sub: Subcategory | null;
  products: Product[];
  optionFlags: Record<string, boolean>;
  error: string | null;
};

export const Route = createFileRoute("/category/$categoryId/$subId")({
  loader: async ({ params }): Promise<SubcategoryLoaderData> => {
    let category: Category | null;
    let sub: Subcategory | null;
    try {
      category = await getCategory(params.categoryId);
      sub = await getSubcategory(params.categoryId, params.subId);
    } catch (error) {
      console.error(error);
      return { category: null, sub: null, products: [], optionFlags: {}, error: "حصل خطأ، حاول تاني." };
    }
    if (!category || !sub) throw notFound();
    try {
      const products = await getActiveProducts(category.id, sub.id);
      const optionFlags = await getProductsWithOptions(products.map((p) => p.id));
      return { category, sub, products, optionFlags, error: null };
    } catch (error) {
      console.error(error);
      return { category: null, sub: null, products: [], optionFlags: {}, error: "حصل خطأ، حاول تاني." };
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
  const { category, sub, products, optionFlags, error } = Route.useLoaderData();
  const router = useRouter();

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
          <Link to="/category/$categoryId" params={{ categoryId: category.id }} className="hover:text-foreground">
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

      {sub.requires_preorder && <Notice text="طلبات الأكل البيتي يجب طلبها قبلها بيوم." />}

      {products.length > 0 ? (
        <ProductGrid products={products} optionFlags={optionFlags} />
      ) : (
        <div className="rounded-2xl bg-card p-8 text-center shadow-soft">
          <p className="text-4xl">🐝</p>
          <p className="mt-2 font-bold">مفيش منتجات في القسم ده حالياً.</p>
        </div>
      )}
    </div>
  );
}
