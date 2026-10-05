import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ExternalLink, Pencil, Plus, Power, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell } from "@/components/admin/AdminShell";
import { DataTable, EmptyState, ErrorState, SearchInput, StatusBadge, TableSkeleton } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/dialogs";
import { Field, ImageUploader } from "@/components/admin/forms";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  deleteBanner,
  listBannersAdmin,
  listCategoriesAdmin,
  listProductsAdmin,
  listSubcategoriesAdmin,
  saveBanner,
  type BannerInput,
} from "@/lib/admin";
import type { Banner } from "@/lib/catalog";

export const Route = createFileRoute("/admin/banners")({
  head: () => ({ meta: [{ title: "البنرات | إدارة نحلة" }] }),
  component: AdminBannersPage,
});

type BannerForm = Omit<Required<Pick<BannerInput, "title" | "image_url" | "sort_order" | "is_active">>, "title"> & {
  title: string;
  link_type: NonNullable<BannerInput["link_type"]>;
  link_id: string | null;
  link_url: string | null;
};

const EMPTY_FORM: BannerForm = {
  title: "",
  image_url: "",
  link_type: "none",
  link_id: null,
  link_url: null,
  sort_order: 0,
  is_active: true,
};

function AdminBannersPage() {
  const [rows, setRows] = useState<Banner[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [targets, setTargets] = useState<{ categories: { id: string; name: string }[]; subcategories: { id: string; name: string }[]; products: { id: string; name: string }[] }>({ categories: [], subcategories: [], products: [] });
  const [editing, setEditing] = useState<{ id: string | null; form: BannerForm } | null>(null);
  const [deleting, setDeleting] = useState<Banner | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setFailed(false);
    try {
      const [banners, cats, subs, prods] = await Promise.all([
        listBannersAdmin(),
        listCategoriesAdmin(),
        listSubcategoriesAdmin(),
        listProductsAdmin(),
      ]);
      setRows(banners);
      setTargets({ categories: cats, subcategories: subs, products: prods });
    } catch {
      setFailed(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () => (rows ?? []).filter((b) => (b.title ?? "").includes(query.trim())),
    [rows, query],
  );

  function targetLabel(b: Banner): string {
    if (b.link_type === "category") return `تصنيف: ${targets.categories.find((c) => c.id === b.link_id)?.name ?? "—"}`;
    if (b.link_type === "subcategory") return `فرعي: ${targets.subcategories.find((s) => s.id === b.link_id)?.name ?? "—"}`;
    if (b.link_type === "product") return `منتج: ${targets.products.find((p) => p.id === b.link_id)?.name ?? "—"}`;
    if (b.link_type === "custom") return b.link_url ?? "رابط مخصص";
    return "بدون رابط";
  }

  function openCreate() {
    setEditing({ id: null, form: { ...EMPTY_FORM } });
  }

  function openEdit(row: Banner) {
    setEditing({
      id: row.id,
      form: {
        title: row.title ?? "",
        image_url: row.image_url,
        link_type: row.link_type ?? "none",
        link_id: row.link_id,
        link_url: row.link_url,
        sort_order: row.sort_order,
        is_active: row.is_active,
      },
    });
  }

  async function save() {
    if (!editing) return;
    if (!editing.form.image_url) {
      toast.error("صورة البنر مطلوبة");
      return;
    }
    setSaving(true);
    try {
      await saveBanner(editing.id, {
        title: editing.form.title || null,
        image_url: editing.form.image_url,
        link_type: editing.form.link_type,
        link_id: ["category", "subcategory", "product"].includes(editing.form.link_type) ? editing.form.link_id : null,
        link_url: editing.form.link_type === "custom" ? editing.form.link_url : null,
        sort_order: editing.form.sort_order,
        is_active: editing.form.is_active,
      });
      toast.success(editing.id ? "تم حفظ البنر بنجاح" : "تمت إضافة البنر بنجاح");
      setEditing(null);
      load();
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "حصل خطأ، حاول تاني.");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(row: Banner) {
    try {
      await saveBanner(row.id, {
        title: row.title,
        image_url: row.image_url,
        link_type: row.link_type,
        link_id: row.link_id,
        link_url: row.link_url,
        sort_order: row.sort_order,
        is_active: !row.is_active,
      });
      toast.success(row.is_active ? "تم تعطيل البنر" : "تم تفعيل البنر");
      load();
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "حصل خطأ، حاول تاني.");
    }
  }

  const linkOptions =
    editing?.form.link_type === "category"
      ? targets.categories
      : editing?.form.link_type === "subcategory"
        ? targets.subcategories
        : editing?.form.link_type === "product"
          ? targets.products
          : [];

  return (
    <AdminGuard>
      <AdminShell
        title="البنرات"
        actions={
          <Button type="button" onClick={openCreate} className="h-11 gap-2 rounded-xl font-bold">
            <Plus className="h-4 w-4" aria-hidden />
            إضافة بنر
          </Button>
        }
      >
        <div className="flex flex-wrap gap-2">
          <SearchInput value={query} onChange={setQuery} placeholder="بحث عن بنر..." />
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
                key: "banner",
                header: "البنر",
                render: (b) => (
                  <span className="flex items-center gap-3">
                    <span className="grid h-10 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-muted" aria-hidden>
                      <img src={b.image_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                    </span>
                    <span>
                      <span className="block font-bold">{b.title || "بدون عنوان"}</span>
                      <span className="block max-w-48 truncate text-xs text-muted-foreground">{targetLabel(b)}</span>
                    </span>
                  </span>
                ),
              },
              { key: "order", header: "الترتيب", render: (b) => <span className="font-bold">{b.sort_order}</span> },
              { key: "status", header: "الحالة", render: (b) => <StatusBadge active={b.is_active} /> },
              {
                key: "actions",
                header: "الإجراءات",
                render: (b) => (
                  <span className="flex gap-1">
                    <button type="button" aria-label="تعديل البنر" onClick={() => openEdit(b)} className="grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-muted">
                      <Pencil className="h-4 w-4" aria-hidden />
                    </button>
                    <button type="button" aria-label={b.is_active ? "تعطيل البنر" : "تفعيل البنر"} onClick={() => toggle(b)} className="grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-muted">
                      <Power className="h-4 w-4" aria-hidden />
                    </button>
                    <button type="button" aria-label="حذف البنر" onClick={() => setDeleting(b)} className="grid h-9 w-9 place-items-center rounded-xl text-destructive transition-colors hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </span>
                ),
              },
            ]}
            renderMobileCard={(b) => (
              <div className="space-y-2">
                <div className="overflow-hidden rounded-xl bg-muted">
                  <img src={b.image_url} alt={b.title ?? ""} className="aspect-video w-full object-cover" loading="lazy" />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-extrabold">{b.title || "بدون عنوان"}</p>
                  <StatusBadge active={b.is_active} />
                </div>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  {targetLabel(b)}
                </p>
                <div className="flex gap-2 border-t border-border pt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => openEdit(b)} className="flex-1 rounded-xl font-bold">تعديل</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => toggle(b)} className="flex-1 rounded-xl font-bold">{b.is_active ? "تعطيل" : "تفعيل"}</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setDeleting(b)} className="flex-1 rounded-xl font-bold text-destructive">حذف</Button>
                </div>
              </div>
            )}
            empty={
              <EmptyState
                title="لا توجد بنرات"
                hint="أضف أول بنر للصفحة الرئيسية."
                action={
                  <Button type="button" onClick={openCreate} className="h-12 gap-2 rounded-xl font-bold">
                    <Plus className="h-4 w-4" aria-hidden />
                    إضافة بنر
                  </Button>
                }
              />
            }
          />
        )}

        <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
          <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl" aria-label="بنر">
            <DialogHeader>
              <DialogTitle>{editing?.id ? "تعديل البنر" : "بنر جديد"}</DialogTitle>
            </DialogHeader>
            {editing && (
              <div className="space-y-3">
                <Field id="banner-image" label="الصورة" required>
                  <ImageUploader
                    id="banner-image"
                    prefix="banners"
                    value={editing.form.image_url || null}
                    onChange={(url) => setEditing({ ...editing, form: { ...editing.form, image_url: url ?? "" } })}
                  />
                </Field>
                <Field id="banner-title" label="العنوان">
                  <Input
                    id="banner-title"
                    value={editing.form.title}
                    onChange={(e) => setEditing({ ...editing, form: { ...editing.form, title: e.target.value } })}
                    className="h-12 rounded-xl"
                    placeholder="مثال: خصومات خاصة"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field id="banner-link-type" label="وجهة الرابط">
                    <Select
                      value={editing.form.link_type}
                      onValueChange={(v: BannerForm["link_type"]) =>
                        setEditing({ ...editing, form: { ...editing.form, link_type: v, link_id: null, link_url: null } })
                      }
                    >
                      <SelectTrigger id="banner-link-type" className="h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">بدون رابط</SelectItem>
                        <SelectItem value="category">تصنيف</SelectItem>
                        <SelectItem value="subcategory">تصنيف فرعي</SelectItem>
                        <SelectItem value="product">منتج</SelectItem>
                        <SelectItem value="custom">رابط مخصص</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field id="banner-order" label="الترتيب">
                    <Input
                      id="banner-order"
                      type="number"
                      value={editing.form.sort_order}
                      onChange={(e) => setEditing({ ...editing, form: { ...editing.form, sort_order: Number(e.target.value) } })}
                      className="h-12 rounded-xl"
                      inputMode="numeric"
                    />
                  </Field>
                </div>
                {["category", "subcategory", "product"].includes(editing.form.link_type) && (
                  <Field id="banner-link-target" label="الهدف">
                    <Select
                      value={editing.form.link_id ?? ""}
                      onValueChange={(v) => setEditing({ ...editing, form: { ...editing.form, link_id: v } })}
                    >
                      <SelectTrigger id="banner-link-target" className="h-12 rounded-xl">
                        <SelectValue placeholder="اختار الهدف" />
                      </SelectTrigger>
                      <SelectContent>
                        {linkOptions.map((o) => (
                          <SelectItem key={o.id} value={o.id}>
                            {o.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
                {editing.form.link_type === "custom" && (
                  <Field id="banner-link-url" label="الرابط">
                    <Input
                      id="banner-link-url"
                      value={editing.form.link_url ?? ""}
                      onChange={(e) => setEditing({ ...editing, form: { ...editing.form, link_url: e.target.value } })}
                      className="h-12 rounded-xl"
                      placeholder="https://…"
                      dir="ltr"
                    />
                  </Field>
                )}
                <div className="flex items-center justify-between gap-2 rounded-xl bg-muted p-3">
                  <span className="text-sm font-bold">الحالة</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{editing.form.is_active ? "مفعل" : "معطل"}</span>
                    <Switch
                      checked={editing.form.is_active}
                      onCheckedChange={(v) => setEditing({ ...editing, form: { ...editing.form, is_active: v } })}
                      aria-label="حالة البنر"
                    />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter className="flex-row-reverse gap-2">
              <Button type="button" variant="outline" onClick={() => setEditing(null)} className="rounded-xl">
                إلغاء
              </Button>
              <Button type="button" onClick={save} disabled={saving} className="rounded-xl font-bold">
                {saving ? "جاري الحفظ..." : "حفظ"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={deleting !== null}
          onOpenChange={(open) => !open && setDeleting(null)}
          title={`حذف «${deleting?.title || "البنر"}»؟`}
          impact="سيتم حذف البنر نهائيًا من الصفحة الرئيسية."
          onConfirm={async () => {
            if (!deleting) return;
            try {
              await deleteBanner(deleting.id);
              toast.success("تم حذف البنر");
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
