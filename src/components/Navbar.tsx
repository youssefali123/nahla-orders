import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import logoIcon from "@/assets/favicon.ico";
import type { Category } from "@/lib/catalog";
import { site } from "@/config/site";
import { useCart } from "@/lib/cart";

export function Navbar({ categories }: { categories: Category[] }) {
  const { count } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setMenuOpen(false);
    navigate({ to: "/search", search: { q } });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-2">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="القائمة"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-foreground transition-colors hover:bg-muted md:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="flex min-w-0 shrink-0 items-center gap-2">
          <img src={logoIcon} alt={site.name} className="h-10 w-10 rounded-xl object-cover" />
          <span className="hidden text-lg font-extrabold text-primary-dark sm:inline">{site.name}</span>
        </Link>

        <form onSubmit={submit} className="relative min-w-0 flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن منتج..."
            aria-label="ابحث عن منتج"
            className="h-11 w-full rounded-full border border-border bg-muted pr-10 pl-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-card"
          />
        </form>

        <Link
          to="/cart"
          aria-label="السلة"
          className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90"
        >
          <ShoppingCart className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-foreground">
              {count}
            </span>
          )}
        </Link>
      </div>

      <nav className="mx-auto hidden max-w-5xl items-center gap-1 px-3 pb-2 md:flex">
        <Link to="/" className="rounded-full px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-muted">
          الرئيسية
        </Link>
        {categories.map((c) =>
          c.type === "custom_order" ? (
            <Link
              key={c.id}
              to="/custom-order"
              className="rounded-full px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-muted"
            >
              {c.name}
            </Link>
          ) : (
            <Link
              key={c.id}
              to="/category/$categoryId"
              params={{ categoryId: c.id }}
              className="rounded-full px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-muted"
            >
              {c.name}
            </Link>
          ),
        )}
      </nav>

      {menuOpen && (
        <nav className="border-t border-border bg-card px-3 py-2 md:hidden">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
          >
            الرئيسية
          </Link>
          {categories.map((c) =>
            c.type === "custom_order" ? (
              <Link
                key={c.id}
                to="/custom-order"
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
              >
                <span className="ml-2">{c.icon}</span>
                {c.name}
              </Link>
            ) : (
              <Link
                key={c.id}
                to="/category/$categoryId"
                params={{ categoryId: c.id }}
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
              >
                <span className="ml-2">{c.icon}</span>
                {c.name}
              </Link>
            ),
          )}
        </nav>
      )}
    </header>
  );
}
