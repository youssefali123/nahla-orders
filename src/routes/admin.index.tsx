import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Image, Plus, Shapes, ShoppingBag } from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell, PageHeader } from "@/components/admin/AdminShell";
import { ErrorState } from "@/components/admin/DataTable";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardCounts } from "@/lib/admin";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "الرئيسية | إدارة نحلة" }] }),
  component: AdminHomePage,
});

function AdminHomePage() {
  const [counts, setCounts] = useState<{ categories: number; products: number; banners: number; configurable: number } | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setError(false);
    try {
      setCounts(await dashboardCounts());
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const cards = counts
    ? [
        { label: "تصنيفات مفعلة", value: counts.categories, to: "/admin/categories", icon: Shapes },
        { label: "منتجات مفعلة", value: counts.products, to: "/admin/products", icon: ShoppingBag },
        { label: "بنرات مفعلة", value: counts.banners, to: "/admin/banners", icon: Image },
        { label: "منتجات قابلة للتخصيص", value: counts.configurable, to: "/admin/products", icon: ShoppingBag },
      ]
    : [];

  return (
    <AdminGuard>
      <AdminShell title="الرئيسية">
        <PageHeader title="نظرة عامة" description="أرقام حقيقية من الكتالوج الحالي." />
        {error ? (
          <ErrorState onRetry={load} />
        ) : !counts ? (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-busy="true" aria-label="جاري التحميل">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {cards.map((card) => (
              <Link
                key={card.label}
                to={card.to}
                className="rounded-2xl border border-border bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
              >
                <card.icon className="h-6 w-6 text-primary" aria-hidden />
                <p className="mt-2 text-3xl font-extrabold text-primary-dark">{card.value}</p>
                <p className="mt-1 text-sm font-bold text-muted-foreground">{card.label}</p>
              </Link>
            ))}
          </div>
        )}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft md:p-5">
          <h3 className="text-base font-extrabold text-primary-dark">إجراءات سريعة</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {[
              { to: "/admin/products", label: "إضافة منتج" },
              { to: "/admin/categories", label: "إضافة تصنيف" },
              { to: "/admin/banners", label: "إضافة بنر" },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Plus className="h-4 w-4" aria-hidden />
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
