import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode, Suspense, lazy } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "@/lib/cart";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

// Loaded lazily: react-loader-spinner crashes Node SSR at import time,
// so it must only ever load in the browser.
const Loader = lazy(() => import("@/components/Loader"));

function RoutePending() {
  return (
    <Suspense fallback={null}>
      <Loader />
    </Suspense>
  );
}
import { getActiveCategories, type Category } from "@/lib/catalog";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
// import { Toaster } from "@/components/ui/sonner";
import {Toaster} from "react-hot-toast";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-6xl">🐝</p>
        <h1 className="mt-4 text-2xl font-extrabold text-foreground">الصفحة مش موجودة</h1>
        <p className="mt-2 text-sm text-muted-foreground">يمكن الرابط قديم أو اتغير.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-extrabold tracking-tight text-foreground">حدثت مشكلة غير متوقعة</h1>
        <p className="mt-2 text-sm text-muted-foreground">جرّب تحديث الصفحة أو العودة للرئيسية.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            حاول مرة أخرى
          </button>
          <a
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-card px-6 text-sm font-bold text-foreground transition-colors hover:bg-muted"
          >
            العودة للرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "نحلة | هنوصلك بسرعة النحلة" },
      { name: "description", content: "نحلة منصة طلبات وتوصيل سريعة: ماركت، مطاعم، خضار وفاكهة، عيش ومعجنات وطلبات مخصصة." },
      { property: "og:title", content: "نحلة | هنوصلك بسرعة النحلة" },
      { property: "og:description", content: "اطلب كل احتياجاتك من مكان واحد ووصّلها لحد باب البيت بسرعة النحلة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  pendingComponent: RoutePending,
  loader: async (): Promise<Category[]> => {
    try {
      return await getActiveCategories();
    } catch (error) {
      console.error(error);
      return [];
    }
  },
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const categories = Route.useLoaderData();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <div className="flex min-h-screen flex-col">
          {!isAdmin && <Navbar categories={categories} />}
          <main key={pathname} className="anim-page flex-1 pb-6">
            {/* Required: nested routes render here. */}
            <Outlet />
          </main>
          {!isAdmin && <Footer />}
        </div>
        {!isAdmin && <WhatsAppFloat />}
        <Toaster position="top-center" />
      </CartProvider>
    </QueryClientProvider>
  );
}
