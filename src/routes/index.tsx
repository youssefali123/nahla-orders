import { createFileRoute, getRouteApi, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft, AlertTriangle, Clock, MessageCircle } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BannerCarousel, type ResolvedBanner } from "@/components/BannerCarousel";
import { HomeLoadingScreen } from "@/components/HomeLoadingScreen";
import { ProductGrid } from "@/components/ProductCard";
import { useCart } from "@/lib/cart";
import { whatsappContactUrl } from "@/lib/whatsapp";
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
import { site, SUPABASE_ENABLED } from "@/config/site";

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
    if (!SUPABASE_ENABLED) {
      return { banners: [], featured: [], optionFlags: {}, error: null };
    }
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
  pendingComponent: HomeLoadingScreen,
});

function Index() {
  const { banners, featured, optionFlags, error } = Route.useLoaderData();
  const categories = rootApi.useLoaderData();
  const router = useRouter();
  const navigate = useNavigate();
  const { add } = useCart();
  const [customText, setCustomText] = useState("");

  function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault();
    const note = customText.trim();
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
    });
    toast.success("تمت إضافة طلبك المخصص للسلة 🐝");
    setCustomText("");
    navigate({ to: "/cart" });
  }

  // Branded splash: once per session on first home entry (guaranteed visible),
  // plus the route pendingComponent covers slow data loads afterwards.
  const [splash, setSplash] = useState(false);
  useEffect(() => {
    try {
      if (!sessionStorage.getItem("nahla-home-splash")) {
        setSplash(true);
        const timer = setTimeout(() => {
          try {
            sessionStorage.setItem("nahla-home-splash", "1");
          } catch {
            /* ignore */
          }
          setSplash(false);
        }, 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      /* storage unavailable — skip splash */
    }
    return undefined;
  }, []);

  if (splash) return <HomeLoadingScreen />;

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

  if (!SUPABASE_ENABLED) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-3 pt-4">
        {/* Technical issue / maintenance announcement banner */}
        <div className="rounded-3xl border border-amber-300/40 bg-gradient-to-br from-amber-50 to-amber-100/60 p-5 shadow-soft dark:from-amber-950/30 dark:to-background dark:border-amber-700/30">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-500/20 text-xl text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-amber-950 dark:text-amber-200 text-base sm:text-lg">
                  تنبيه هام لعملائنا الكرام 🐝
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-200/70 px-2 py-0.5 text-[11px] font-bold text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                  <Clock className="h-3 w-3 animate-pulse" />
                  صيانة مؤقتة
                </span>
              </div>
              <p className="mt-1.5 text-xs sm:text-sm font-semibold leading-relaxed text-amber-900/90 dark:text-amber-300/90">
                نعتذر لكم، بقية أقسام المتجر معطلة حالياً بسبب مشكلة فنية، وجاري العمل على الإصلاح والعودة في أسرع وقت ممكن.
              </p>
              <p className="mt-1 text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-200">
                ✨ خدمة «الطلب المخصص» تعمل بكفاءة وبشكل طبيعي! اكتب أي طلب محتاجه وسنقوم بتوفيره وتوصيله لك فوراً.
              </p>
            </div>
          </div>
        </div>

        {/* Custom Order Box */}
        <div className="rounded-3xl bg-card p-6 shadow-card border border-border">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">✍️</span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">
                اطلب اللي على مزاجك
              </h1>
            </div>
            <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              مش لاقي اللي بتدور عليه أو الأقسام مقفولة؟ اكتب طلبك أو أي حاجة محتاجها وإحنا نحاول نوفرهولك ونوصلهولك لحد باب بيتك!
            </p>
          </div>

          <form onSubmit={handleCustomSubmit} className="space-y-4">
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              rows={6}
              placeholder="اكتب كل طلباتك هنا بالتفصيل... (مثال: طلب من سوبر ماركت كذا، أو وجبة معينة من مطعم كذا، أو أي منتجات محتاجها)..."
              className="w-full resize-none rounded-2xl border border-border bg-muted p-4 text-sm outline-none transition-colors focus:border-primary focus:bg-card leading-relaxed"
            />
            <button
              type="submit"
              className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90 shadow-soft"
            >
              <span>أضف للسلة ومتابعة الطلب</span>
              <ArrowLeft className="h-5 w-5" />
            </button>
          </form>

          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center text-[11px] sm:text-xs font-bold text-muted-foreground">
            <div className="rounded-xl bg-muted/60 p-2">
              <p className="text-base sm:text-lg mb-0.5">🛵</p>
              <p>توصيل سريع</p>
            </div>
            <div className="rounded-xl bg-muted/60 p-2">
              <p className="text-base sm:text-lg mb-0.5">💬</p>
              <p>تأكيد عبر واتساب</p>
            </div>
            <div className="rounded-xl bg-muted/60 p-2">
              <p className="text-base sm:text-lg mb-0.5">💛</p>
              <p>أسعار مناسبة للطلاب</p>
            </div>
          </div>
        </div>

        {/* Support & Contact Cards */}
        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href={whatsappContactUrl()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-2xl bg-accent/30 p-4 transition-colors hover:bg-accent/40 shadow-soft"
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold">تواصل مع الدعم الفني</p>
              <p className="text-xs text-muted-foreground truncate">جاهزون للرد على استفساراتك فوراً</p>
            </div>
          </a>

          <div className="rounded-2xl bg-card p-4 shadow-soft border border-border flex items-center gap-3">
            <span className="text-2xl">🐝</span>
            <div className="min-w-0">
              <p className="text-sm font-extrabold">{site.name} — {site.slogan}</p>
              <p className="text-xs text-muted-foreground">خدمتك راحتك وهدفنا رضاك دايمًا.</p>
            </div>
          </div>
        </div>
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
                  className={`grid aspect-square w-full place-items-center overflow-hidden rounded-2xl text-4xl transition-transform duration-300 group-hover:scale-[1.03] ${
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
              "anim-rise group flex flex-col items-center gap-1.5 text-center";
            const animStyle = { "--anim-delay": `${Math.min(i, 4) * 60}ms` } as CSSProperties;
            return c.type === "custom_order" ? (
              <Link key={c.id} to="/custom-order" className={className} style={animStyle}>
                {tile}
              </Link>
            ) : (
              <Link key={c.id} to="/category/$categoryId" params={{ categoryId: c.id }} className={className} style={animStyle}>
                {tile}
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold">🔥 عروض خاصة</h2>
          <Link
            to="/custom-items"
            className="inline-flex items-center gap-1 text-sm font-bold text-primary-dark"
          >
            عرض الكل
            <ArrowLeft className="h-4 w-4" />
          </Link>
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
