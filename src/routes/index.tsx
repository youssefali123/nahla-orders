import { createFileRoute, getRouteApi, Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { BannerCarousel, type ResolvedBanner } from "@/components/BannerCarousel";
import { ProductGrid } from "@/components/ProductCard";
import {
  getActiveBanners,
  getFeaturedProducts,
  getCategory,
  getProduct,
  getProductsWithOptions,
  getSubcategoryById,
  type Banner,
  type Product,
} from "@/lib/catalog";
import { site } from "@/config/site";

const rootApi = getRouteApi("__root__");

type IndexLoaderData = {
  banners: ResolvedBanner[];
  featured: Product[];
  optionFlags: Record<string, boolean>;
  error: string | null;
};

async function resolveTarget(banner: Banner): Promise<ResolvedBanner> {
  const none: ResolvedBanner = { banner, target: { kind: "none" } };
  try {
    if (banner.link_type === "category" && banner.link_id) {
      const category = await getCategory(banner.link_id);
      return category ? { banner, target: { kind: "category", categoryId: category.id } } : none;
    }
    if (banner.link_type === "subcategory" && banner.link_id) {
      const sub = await getSubcategoryById(banner.link_id);
      return sub ? { banner, target: { kind: "subcategory", categoryId: sub.category_id, subId: sub.id } } : none;
    }
    if (banner.link_type === "product" && banner.link_id) {
      const product = await getProduct(banner.link_id);
      return product ? { banner, target: { kind: "product", productId: product.id } } : none;
    }
    if (banner.link_type === "custom" && banner.link_url) {
      return { banner, target: { kind: "url", url: banner.link_url } };
    }
  } catch (error) {
    console.error(error);
  }
  return none;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "نحلة | اطلب واستلم بسرعة النحلة" },
      { name: "description", content: "تصفح أقسام نحلة: ماركت، مطاعم، خضار وفاكهة، عيش ومعجنات، أو اكتب طلبك المخصص واستلمه بسرعة." },
      { property: "og:title", content: "نحلة | اطلب واستلم بسرعة النحلة" },
      { property: "og:description", content: "أقسام متنوعة وطلب سهل عبر واتساب في خطوات قليلة." },
    ],
  }),
  loader: async (): Promise<IndexLoaderData> => {
    try {
      const [banners, featured] = await Promise.all([getActiveBanners(), getFeaturedProducts()]);
      const [resolved, optionFlags] = await Promise.all([
        Promise.all(banners.map(resolveTarget)),
        getProductsWithOptions(featured.map((p) => p.id)),
      ]);
      return { banners: resolved, featured, optionFlags, error: null };
    } catch (error) {
      console.error(error);
      return { banners: [], featured: [], optionFlags: {}, error: "حصل خطأ، حاول تاني." };
    }
  },
  component: Index,
});

function Index() {
  const { banners, featured, optionFlags, error } = Route.useLoaderData();
  const categories = rootApi.useLoaderData();
  const router = useRouter();
  const firstCategory = categories.find((c) => c.type !== "custom_order");

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-3 pt-10 text-center">
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

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-3 pt-3">
      <BannerCarousel items={banners} />

      <section>
        <h2 className="mb-3 text-lg font-extrabold">الأقسام الرئيسية</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {categories.map((c, i) => {
            const tile = (
              <>
                <span
                  className={`grid h-14 w-14 place-items-center overflow-hidden rounded-2xl text-3xl ${
                    i % 2 === 0 ? "bg-primary/12" : "bg-accent/30"
                  }`}
                  aria-hidden
                >
                  {c.image_url ? (
                    <img src={c.image_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    (c.icon ?? "🐝")
                  )}
                </span>
                <span className="text-xs font-bold leading-tight sm:text-sm">{c.name}</span>
              </>
            );
            const className =
              "flex flex-col items-center gap-2 rounded-2xl bg-card p-3 text-center shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card";
            return c.type === "custom_order" ? (
              <Link key={c.id} to="/custom-order" className={className}>
                {tile}
              </Link>
            ) : (
              <Link key={c.id} to="/category/$categoryId" params={{ categoryId: c.id }} className={className}>
                {tile}
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold">🔥 الأكثر طلبًا</h2>
          {firstCategory && (
            <Link
              to="/category/$categoryId"
              params={{ categoryId: firstCategory.id }}
              className="inline-flex items-center gap-1 text-sm font-bold text-primary-dark"
            >
              عرض الكل
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )}
        </div>
        {featured.length > 0 ? (
          <ProductGrid products={featured} optionFlags={optionFlags} />
        ) : (
          <p className="rounded-2xl bg-card p-6 text-center text-sm font-bold text-muted-foreground shadow-soft">
            مفيش منتجات متاحة حالياً.
          </p>
        )}
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <Link
          to="/custom-order"
          className="rounded-2xl bg-primary p-5 text-primary-foreground shadow-card transition-opacity hover:opacity-95"
        >
          <p className="text-lg font-extrabold">اطلب اللي على مزاجك ✍️</p>
          <p className="mt-1 text-sm opacity-90">مش لاقي اللي بتدور عليه؟ اكتب طلبك وإحنا نحاول نوفرهولك.</p>
        </Link>
        <div className="rounded-2xl bg-accent/30 p-5 shadow-soft">
          <p className="text-lg font-extrabold">{site.slogan} 🐝</p>
          <p className="mt-1 text-sm text-muted-foreground">
            توصيل سريع لحد باب السكن، وأسعار مناسبة للطلاب.
          </p>
        </div>
      </section>
    </div>
  );
}
