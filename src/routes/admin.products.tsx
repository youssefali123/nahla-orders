import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Power, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell } from "@/components/admin/AdminShell";
import { DataTable, EmptyState, ErrorState, SearchInput, StatusBadge, TableSkeleton } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/dialogs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  deleteProduct,
  listCategoriesAdmin,
  listProductsAdmin,
  listSubcategoriesAdmin,
  saveProduct,
} from "@/lib/admin";
import type { Category, Product, Subcategory } from "@/lib/catalog";

export const Route = createFileRoute("/admin/products")({
  head: () => ({ meta: [{ title: "المنتجات | إدارة نحلة" }] }),
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [subFilter, setSubFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleting, setDeleting] = useState<Product | null>(null);

  const load = useCallback(async () => {
    setFailed(false);
    try {
      const [products, cats, subs] = await Promise.all([
        listProductsAdmin(),
        listCategoriesAdmin(),
        listSubcategoriesAdmin(),
      ]);
      setRows(products);
      setCategories(cats);
      setSubcategories(subs);
    } catch {
      setFailed(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const catName = useCallback((id: string) => categories.find((c) => c.id === id)?.name ?? "—", [categories]);
  const subName = useCallback(
    (id: string | null) => (id ? (subcategories.find((s) => s.id === id)?.name ?? "—") : "—"),
    [subcategories],
  );

  const filtered = useMemo(
    () =>
      (rows ?? []).filter(
        (p) =>
          (catFilter === "all" || p.category_id === catFilter) &&
          (subFilter === "all" || p.subcategory_id === subFilter) &&
          (statusFilter === "all" || (statusFilter === "active") === p.is_active) &&
          p.name.includes(query.trim()),
      ),
    [rows, query, catFilter, subFilter, statusFilter],
  );

  async function toggle(row: Product) {
    try {
      await saveProduct(row.id, {
        category_id: row.category_id,
        subcategory_id: row.subcategory_id,
        name: row.name,
        price: Number(row.price),
        icon: row.icon,
        image_url: row.image_url,
        description: row.description,
        unit: row.unit,
        sort_order: row.sort_order,
        is_active: !row.is_active,
        is_featured: row.is_featured,
      });
      toast.success(row.is_active ? "تم تعطيل المنتج" : "تم تفعيل المنتج");
      load();
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "حصل خطأ، حاول تاني.");
    }
  }

  function edit(id: string) {
    navigate({ to: "/admin/product-editor", search: { id } });
  }

  return (
    <AdminGuard>
      <AdminShell
        title="المنتجات"
        actions={
          <Button
            type="button"
            onClick={() => navigate({ to: "/admin/product-editor", search: { id: null } })}
            className="h-11 gap-2 rounded-xl font-bold"
          >
            <Plus className="h-4 w-4" aria-hidden />
            إضافة منتج
          </Button>
        }
      >
        <div className="flex flex-wrap gap-2">
          <SearchInput value={query} onChange={setQuery} placeholder="بحث عن منتج..." />
          <Select value={catFilter} onValueChange={(v) => { setCatFilter(v); setSubFilter("all"); }}>
            <SelectTrigger className="h-11 w-full rounded-xl sm:w-44" aria-label="تصفية بالتصنيف">
              <SelectValue placeholder="التصنيف" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل التصنيفات</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={subFilter} onValueChange={setSubFilter}>
            <SelectTrigger className="h-11 w-full rounded-xl sm:w-44" aria-label="تصفية بالتصنيف الفرعي">
              <SelectValue placeholder="الفرعي" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الفروع</SelectItem>
              {subcategories
                .filter((s) => catFilter === "all" || s.category_id === catFilter)
                .map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11 w-full rounded-xl sm:w-36" aria-label="تصفية بالحالة">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="active">مفعل</SelectItem>
              <SelectItem value="inactive">معطل</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {failed ? (
          <ErrorState onRetry={load} />
        ) : rows === null ? (
          <TableSkeleton />
        ) : (
          <DataTable
            rows={filtered}
            columns={[
              {
                key: "product",
                header: "المنتج",
                render: (p) => (
                  <span className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-muted text-xl" aria-hidden>
                      {p.image_url ? <img src={p.image_url} alt="" className="h-full w-full object-cover" loading="lazy" /> : (p.icon ?? "🐝")}
                    </span>
                    <span>
                      <span className="block font-bold">{p.name}</span>
                      <span className="block text-xs text-muted-foreground">{catName(p.category_id)}</span>
                    </span>
                  </span>
                ),
              },
              { key: "price", header: "السعر", render: (p) => <span className="font-extrabold text-primary-dark">{Number(p.price)} جنيه</span> },
              { key: "status", header: "الحالة", render: (p) => <StatusBadge active={p.is_active} /> },
              {
                key: "actions",
                header: "الإجراءات",
                render: (p) => (
                  <span className="flex gap-1">
                    <button type="button" aria-label={`تعديل ${p.name}`} onClick={() => edit(p.id)} className="grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-muted">
                      <Pencil className="h-4 w-4" aria-hidden />
                    </button>
                    <button type="button" aria-label={p.is_active ? `تعطيل ${p.name}` : `تفعيل ${p.name}`} onClick={() => toggle(p)} className="grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-muted">
                      <Power className="h-4 w-4" aria-hidden />
                    </button>
                    <button type="button" aria-label={`حذف ${p.name}`} onClick={() => setDeleting(p)} className="grid h-9 w-9 place-items-center rounded-xl text-destructive transition-colors hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </span>
                ),
              },
            ]}
            renderMobileCard={(p) => (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-muted text-2xl" aria-hidden>
                    {p.image_url ? <img src={p.image_url} alt="" className="h-full w-full object-cover" /> : (p.icon ?? "🐝")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-extrabold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {catName(p.category_id)} · {Number(p.price)} جنيه
                    </p>
                  </div>
                  <StatusBadge active={p.is_active} />
                </div>
                <div className="flex gap-2 border-t border-border pt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => edit(p.id)} className="flex-1 rounded-xl font-bold">تعديل</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => toggle(p)} className="flex-1 rounded-xl font-bold">{p.is_active ? "تعطيل" : "تفعيل"}</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setDeleting(p)} className="flex-1 rounded-xl font-bold text-destructive">حذف</Button>
                </div>
              </div>
            )}
            empty={
              <EmptyState
                title="لا توجد منتجات"
                hint="ابدأ بإضافة أول منتج إلى الكتالوج."
                action={
                  <Button type="button" onClick={() => navigate({ to: "/admin/product-editor", search: { id: null } })} className="h-12 gap-2 rounded-xl font-bold">
                    <Plus className="h-4 w-4" aria-hidden />
                    إضافة منتج
                  </Button>
                }
              />
            }
          />
        )}

        <ConfirmDialog
          open={deleting !== null}
          onOpenChange={(open) => !open && setDeleting(null)}
          title={`حذف «${deleting?.name}»؟`}
          impact="سيتم حذف المنتج وجميع مجموعات الخيارات والاختيارات المرتبطة به نهائيًا."
          onConfirm={async () => {
            if (!deleting) return;
            try {
              await deleteProduct(deleting.id);
              toast.success("تم حذف المنتج");
              setDeleting(null);
              load();
            } catch (e) {
              toast.error((e as { message?: string })?.message ?? "حصل خطأ، حاول تاني.");
            }
          }}
        />
      </AdminShell>
    </AdminGuard>
  );
}
