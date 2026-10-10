import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { site } from "@/config/site";
import { whatsappContactUrl } from "@/lib/whatsapp";
import logoIcon from "@/assets/favicon.ico";

export function Footer() {
  return (
    <footer className="mt-10 bg-primary-dark text-primary-foreground">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:grid-cols-2">
        <div className="flex items-center gap-3">
          <img src={logoIcon} alt={site.name} className="h-14 w-14 rounded-2xl object-cover" />
          <div className="min-w-0">
            <p className="text-xl font-extrabold">{site.name}</p>
            <p className="text-sm opacity-90">{site.slogan} 🐝</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-sm font-semibold sm:items-end">
          <Link to="/" className="opacity-90 transition-opacity hover:opacity-100">
            الرئيسية
          </Link>
          <Link to="/category/$categoryId" params={{ categoryId: "market" }} className="opacity-90 transition-opacity hover:opacity-100">
            الأقسام
          </Link>
          <Link to="/cart" className="opacity-90 transition-opacity hover:opacity-100">
            السلة
          </Link>
          <a
            href={whatsappContactUrl()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-accent-foreground transition-opacity hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" />
            تواصل معنا على واتساب
          </a>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 py-3 text-center text-xs opacity-80">
        © {new Date().getFullYear()} {site.name}. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
