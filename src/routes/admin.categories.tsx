import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Power, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell } from "@/components/admin/AdminShell";
import { DataTable, EmptyState, ErrorState, SearchInput, StatusBadge, TableSkeleton } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/dialogs";
import { FilterValuesManager } from "@/components/admin/filters";
import { Field, ImageUploader } from "@/components/admin/forms";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  deleteCategory,
  listCategoriesAdmin,
  saveCategory,
  type CategoryInput,
} from "@/lib/admin";
import type { Category } from "@/lib/catalog";

export const Route = createFileRoute("/admin/categories")({
  head: () => ({ meta: [{ title: "التصنيفات | إدارة نحلة" }] }),
  component: AdminCategoriesPage,
});

const EMPTY_FORM: CategoryInput = { name: "", icon: "", image_url: null, sort_order: 0, is_active: true, type: "normal", has_filters: false };

function AdminCategoriesPage() {
  const [rows, setRows] = useState<Category[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<{ id: string | null; form: CategoryInput } | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setFailed(false);
    try {
      setRows(await listCategoriesAdmin());
    } catch {
      setFailed(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () => (rows ?? []).filter((c) => c.name.includes(query.trim())),
    [rows, query],
  );

  function openCreate() {
    setEditing({ id: null, form: { ...EMPTY_FORM } });
  }

  function openEdit(row: Category) {
    setEditing({
      id: row.id,
      form: {
        name: row.name,
        icon: row.icon ?? "",
        image_url: row.image_url,
        sort_order: row.sort_order,
        is_active: row.is_active,
        type: row.type,
        has_filters: row.has_filters ?? false,
      },
    });
  }

  async function save() {
    if (!editing || !editing.form.name.trim()) {
      toast.error("اسم التصنيف مطلوب");
      return;
    }
    setSaving(true);
    try {
      await saveCategory(editing.id, { ...editing.form, name: editing.form.name.trim() });
      toast.success(editing.id ? "تم حفظ التصنيف بنجاح" : "تمت إضافة التصنيف بنجاح");
      setEditing(null);
      load();
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "حصل خطأ، حاول تاني.");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(row: Category) {
    try {
      await saveCategory(row.id, {
        name: row.name,
        icon: row.icon,
        image_url: row.image_url,
        sort_order: row.sort_order,
        is_active: !row.is_active,
        type: row.type,
        has_filters: row.has_filters ?? false,
      });
      toast.success(row.is_active ? "تم تعطيل التصنيف" : "تم تفعيل التصنيف");
      load();
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "حصل خطأ، حاول تاني.");
    }
  }

  return (
    <AdminGuard>
      <AdminShell
        title="التصنيفات"
        actions={
          <Button type="button" onClick={openCreate} className="h-11 gap-2 rounded-xl font-bold">
            <Plus className="h-4 w-4" aria-hidden />
            إضافة تصنيف
          </Button>
        }
      >
        <div className="flex flex-wrap gap-2">
          <SearchInput value={query} onChange={setQuery} placeholder="بحث عن تصنيف..." />
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
                key: "name",
                header: "التصنيف",
                render: (c) => (
                  <span className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-muted text-xl" aria-hidden>
                      {c.image_url ? <img src={c.image_url} alt="" className="h-full w-full object-cover" /> : (c.icon ?? "🐝")}
                    </span>
                    <span className="font-bold">{c.name}</span>
                  </span>
                ),
              },
              {
                key: "type",
                header: "النوع",
                render: (c) => (
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold">
                    {c.type === "custom_order" ? "طلب مخصص" : "عادي"}
                  </span>
                ),
              },
              { key: "order", header: "الترتيب", render: (c) => <span className="font-bold">{c.sort_order}</span> },
              { key: "status", header: "الحالة", render: (c) => <StatusBadge active={c.is_active} /> },
              {
                key: "actions",
                header: "الإجراءات",
                render: (c) => (
                  <span className="flex gap-1">
                    <button type="button" aria-label={`تعديل ${c.name}`} onClick={() => openEdit(c)} className="grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-muted">
                      <Pencil className="h-4 w-4" aria-hidden />
                    </button>
                    <button type="button" aria-label={c.is_active ? `تعطيل ${c.name}` : `تفعيل ${c.name}`} onClick={() => toggle(c)} className="grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-muted">
                      <Power className="h-4 w-4" aria-hidden />
                    </button>
                    <button type="button" aria-label={`حذف ${c.name}`} onClick={() => setDeleting(c)} className="grid h-9 w-9 place-items-center rounded-xl text-destructive transition-colors hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </span>
                ),
              },
            ]}
            renderMobileCard={(c) => (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-muted text-2xl" aria-hidden>
                    {c.image_url ? <img src={c.image_url} alt="" className="h-full w-full object-cover" /> : (c.icon ?? "🐝")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-extrabold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.type === "custom_order" ? "طلب مخصص" : "عادي"} · ترتيب {c.sort_order}</p>
                  </div>
                  <StatusBadge active={c.is_active} />
                </div>
                <div className="flex gap-2 border-t border-border pt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => openEdit(c)} className="flex-1 rounded-xl font-bold">تعديل</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => toggle(c)} className="flex-1 rounded-xl font-bold">{c.is_active ? "تعطيل" : "تفعيل"}</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setDeleting(c)} className="flex-1 rounded-xl font-bold text-destructive">حذف</Button>
                </div>
              </div>
            )}
            empty={
              <EmptyState
                title="لا توجد تصنيفات"
                hint="ابدأ بإضافة أول تصنيف للكتالوج."
                action={
                  <Button type="button" onClick={openCreate} className="h-12 gap-2 rounded-xl font-bold">
                    <Plus className="h-4 w-4" aria-hidden />
                    إضافة تصنيف
                  </Button>
                }
              />
            }
          />
        )}

        <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
          <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl" aria-label="تصنيف">
            <DialogHeader>
              <DialogTitle>{editing?.id ? "تعديل التصنيف" : "تصنيف جديد"}</DialogTitle>
            </DialogHeader>
            {editing && (
              <div className="space-y-3">
                <Field id="cat-name" label="اسم التصنيف" required>
                  <Input
                    id="cat-name"
                    value={editing.form.name}
                    onChange={(e) => setEditing({ ...editing, form: { ...editing.form, name: e.target.value } })}
                    className="h-12 rounded-xl"
                    placeholder="مثال: ماركت"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field id="cat-icon" label="الأيقونة" hint="إيموجي يظهر بجانب الاسم">
                    <Input
                      id="cat-icon"
                      value={editing.form.icon ?? ""}
                      onChange={(e) => setEditing({ ...editing, form: { ...editing.form, icon: e.target.value } })}
                      className="h-12 rounded-xl"
                      placeholder="🛒"
                    />
                  </Field>
                  <Field id="cat-order" label="الترتيب">
                    <Input
                      id="cat-order"
                      type="number"
                      value={editing.form.sort_order}
                      onChange={(e) => setEditing({ ...editing, form: { ...editing.form, sort_order: Number(e.target.value) } })}
                      className="h-12 rounded-xl"
                      inputMode="numeric"
                    />
                  </Field>
                </div>
                <Field id="cat-image" label="الصورة">
                  <ImageUploader
                    id="cat-image"
                    prefix="categories"
                    value={editing.form.image_url ?? null}
                    onChange={(url) => setEditing({ ...editing, form: { ...editing.form, image_url: url } })}
                  />
                </Field>
                <div className="flex items-center justify-between gap-2 rounded-xl bg-muted p-3">
                  <span className="text-sm font-bold">الحالة</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{editing.form.is_active ? "مفعل" : "معطل"}</span>
                    <Switch
                      checked={editing.form.is_active}
                      onCheckedChange={(v) => setEditing({ ...editing, form: { ...editing.form, is_active: v } })}
                      aria-label="حالة التصنيف"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 rounded-xl bg-muted p-3">
                  <span className="text-sm font-bold">فلاتر العرض</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{editing.form.has_filters ? "مفعلة" : "معطلة"}</span>
                    <Switch
                      checked={editing.form.has_filters}
                      onCheckedChange={(v) => setEditing({ ...editing, form: { ...editing.form, has_filters: v } })}
                      aria-label="تفعيل فلاتر العرض"
                    />
                  </div>
                </div>
                {editing.id && editing.form.has_filters && (
                  <div className="space-y-2 rounded-xl bg-muted p-3">
                    <p className="text-sm font-extrabold">قيم الفلاتر</p>
                    <FilterValuesManager kind="category" parentId={editing.id} />
                  </div>
                )}
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
          title={`حذف «${deleting?.name}»؟`}
          impact="سيتم حذف التصنيف وجميع التصنيفات الفرعية والمنتجات وخياراتها المرتبطة به نهائيًا."
          onConfirm={async () => {
            if (!deleting) return;
            try {
              await deleteCategory(deleting.id);
              toast.success("تم حذف التصنيف");
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
