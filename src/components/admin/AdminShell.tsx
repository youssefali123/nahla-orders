import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Image,
  LayoutDashboard,
  ListTree,
  LogOut,
  Menu,
  Shapes,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { signOutManager } from "@/lib/admin";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; matchPrefix?: boolean };

const NAV: { title: string; items: NavItem[] }[] = [
  { title: "", items: [{ to: "/admin", label: "الرئيسية", icon: LayoutDashboard }] },
  {
    title: "الكتالوج",
    items: [
      { to: "/admin/categories", label: "التصنيفات", icon: Shapes, matchPrefix: true },
      { to: "/admin/subcategories", label: "التصنيفات الفرعية", icon: ListTree, matchPrefix: true },
      { to: "/admin/products", label: "المنتجات", icon: ShoppingBag, matchPrefix: true },
    ],
  },
  { title: "المحتوى", items: [{ to: "/admin/banners", label: "البنرات", icon: Image, matchPrefix: true }] },
  { title: "الحساب", items: [{ to: "/admin/account", label: "الحساب الشخصي", icon: User }] },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const { location } = useRouterState();
  const path = location.pathname;
  return (
    <nav aria-label="التنقل الرئيسي" className="space-y-4">
      {NAV.map((group, gi) => (
        <div key={gi}>
          {group.title !== "" && (
            <p className="mb-1 px-3 text-xs font-bold text-white/60">{group.title}</p>
          )}
          <ul className="space-y-1">
            {group.items.map((item) => {
              const active = item.matchPrefix ? path.startsWith(item.to) : path === item.to;
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${
                      active ? "bg-primary font-extrabold text-primary-foreground" : "text-white hover:bg-white/10"
                    }`}
                  >
                    {active && <span className="absolute inset-y-2 right-0 w-1 rounded-full bg-accent" aria-hidden />}
                    <Icon className="h-5 w-5 shrink-0" aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AdminShell({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  async function logout() {
    await signOutManager();
    navigate({ to: "/admin/login", replace: true });
  }

  return (
    <div className="flex min-h-screen bg-background" dir="rtl">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-[#0F3B3B] p-4 text-white lg:flex" aria-label="الشريط الجانبي">
        <Link to="/admin" className="mb-6 flex items-center gap-2 px-1">
          <img src="/favicon.png" alt="نحلة" className="h-10 w-10 rounded-xl object-cover" />
          <span className="text-lg font-extrabold">نحلة · الإدارة</span>
        </Link>
        <div className="flex-1 overflow-y-auto">
          <NavList />
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={logout}
          className="mt-4 w-full justify-start gap-3 text-white hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-5 w-5" aria-hidden />
          تسجيل الخروج
        </Button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/95 px-3 backdrop-blur md:px-6">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="فتح القائمة"
            className="grid h-10 w-10 place-items-center rounded-xl transition-colors hover:bg-muted lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
          <h1 className="min-w-0 flex-1 truncate text-lg font-extrabold text-primary-dark">{title}</h1>
          {actions}
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 space-y-4 p-3 md:p-6">{children}</main>
      </div>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="flex w-72 flex-col bg-[#0F3B3B] text-white" aria-label="قائمة التنقل">
          <SheetTitle className="sr-only">قائمة التنقل</SheetTitle>
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2 text-lg font-extrabold">
              <img src="/favicon.png" alt="نحلة" className="h-9 w-9 rounded-xl object-cover" />
              نحلة · الإدارة
            </span>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="إغلاق القائمة"
              className="grid h-10 w-10 place-items-center rounded-xl transition-colors hover:bg-white/10"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <NavList onNavigate={() => setDrawerOpen(false)} />
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={logout}
            className="mt-4 w-full justify-start gap-3 text-white hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-5 w-5" aria-hidden />
            تسجيل الخروج
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-xl font-extrabold text-primary-dark">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
