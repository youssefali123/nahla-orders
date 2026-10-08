import { createFileRoute, Link } from "@tanstack/react-router";
import { site } from "@/config/site";

export const Route = createFileRoute("/order-success")({
  validateSearch: (search: Record<string, unknown>) => ({
    order: typeof search["order"] === "string" ? search["order"] : null,
  }),
  head: () => ({
    meta: [
      { title: "تم إرسال طلبك | نحلة" },
      { name: "description", content: "طلبك وصل لفريق نحلة وهنتواصل معاك لتأكيد التوصيل." },
      { property: "og:title", content: "تم إرسال طلبك | نحلة" },
      { property: "og:description", content: "هنوصلك بسرعة النحلة." },
    ],
  }),
  component: OrderSuccessPage,
});

function OrderSuccessPage() {
  const { order } = Route.useSearch();
  return (
    <div className="mx-auto max-w-md px-3 pt-10 text-center">
      <img src="/favicon.png" alt={site.name} className="mx-auto h-36 w-36 rounded-3xl object-cover shadow-card" />
      <h1 className="mt-5 text-2xl font-extrabold">طلبك وصل للنحلة! 🐝</h1>
      {order && (
        <div className="mx-auto mt-4 w-fit rounded-2xl bg-primary/10 px-8 py-3">
          <p className="text-xs font-bold text-muted-foreground">رقم الطلب</p>
          <p className="text-3xl font-extrabold tracking-widest text-primary-dark" dir="ltr">
            {order}
          </p>
        </div>
      )}
      <p className="mt-2 text-sm text-muted-foreground">{site.slogan}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        استلمنا طلبك بنجاح وهنكلمك قريب لتأكيد التوصيل.
      </p>
      <Link
        to="/"
        className="mt-7 inline-flex h-13 items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
