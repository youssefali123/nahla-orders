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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  deleteSubcategory,
  listCategoriesAdmin,
  listSubcategoriesAdmin,
  saveSubcategory,
  type SubcategoryInput,
} from "@/lib/admin";
import type { Category, Subcategory } from "@/lib/catalog";

export const Route = createFileRoute("/admin/subcategories")({
  head: () => ({ meta: [{ title: "التصنيفات الفرعية | إدارة نحلة" }] }),
  component: AdminSubcategoriesPage,
});

const EMPTY_FORM: SubcategoryInput = {
  category_id: "",
  name: "",
  icon: "",
  image_url: null,
  sort_order: 0,
  is_active: true,
  requires_preorder: false,
  has_filters: false,
};

function AdminSubcategoriesPage() {
  const [rows, setRows] = useState<Subcategory[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [parentFilter, setParentFilter] = useState<string>("all");
  const [editing, setEditing] = useState<{ id: string | null; form: SubcategoryInput } | null>(null);
  const [deleting, setDeleting] = useState<Subcategory | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setFailed(false);
    try {
      const [subs, cats] = await Promise.all([listSubcategoriesAdmin(), listCategoriesAdmin()]);
      setRows(subs);
      setCategories(cats);
    } catch {
      setFailed(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const parentName = useCallback((id: string) => categories.find((c) => c.id === id)?.name ?? "—", [categories]);

  const filtered = useMemo(
    () =>
      (rows ?? []).filter(
        (s) =>
          (parentFilter === "all" || s.category_id === parentFilter) && s.name.includes(query.trim()),
      ),
    [rows, query, parentFilter],
  );

  function openCreate() {
    setEditing({ id: null, form: { ...EMPTY_FORM, category_id: parentFilter !== "all" ? parentFilter : "" } });
  }

  function openEdit(row: Subcategory) {
    setEditing({
      id: row.id,
      form: {
        category_id: row.category_id,
        name: row.name,
        icon: row.icon ?? "",
        image_url: row.image_url,
        sort_order: row.sort_order,
        is_active: row.is_active,
        requires_preorder: row.requires_preorder,
        has_filters: row.has_filters ?? false,
      },
    });
  }

  async function save() {
    if (!editing) return;
    if (!editing.form.category_id) {
      toast.error("اختار التصنيف الرئيسي");
      return;
    }
    if (!editing.form.name.trim()) {
      toast.error("اسم التصنيف الفرعي مطلوب");
      return;
    }
    setSaving(true);
    try {
      await saveSubcategory(editing.id, { ...editing.form, name: editing.form.name.trim() });
      toast.success(editing.id ? "تم حفظ التصنيف الفرعي بنجاح" : "تمت إضافة التصنيف الفرعي بنجاح");
      setEditing(null);
      load();
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "حصل خطأ، حاول تاني.");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(row: Subcategory) {
    try {
      await saveSubcategory(row.id, {
        category_id: row.category_id,
        name: row.name,
        icon: row.icon,
        image_url: row.image_url,
        sort_order: row.sort_order,
        is_active: !row.is_active,
        requires_preorder: row.requires_preorder,
        has_filters: row.has_filters ?? false,
      });
      toast.success(row.is_active ? "تم تعطيل التصنيف الفرعي" : "تم تفعيل التصنيف الفرعي");
      load();
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "حصل خطأ، حاول تاني.");
    }
  }

  return (
    <AdminGuard>
      <AdminShell
        title="التصنيفات الفرعية"
        actions={
          <Button type="button" onClick={openCreate} className="h-11 gap-2 rounded-xl font-bold">
            <Plus className="h-4 w-4" aria-hidden />
            إضافة تصنيف فرعي
          </Button>
        }
      >
        <div className="flex flex-wrap gap-2">
          <SearchInput value={query} onChange={setQuery} placeholder="بحث..." />
          <Select value={parentFilter} onValueChange={setParentFilter}>
            <SelectTrigger className="h-11 w-full rounded-xl sm:w-56" aria-label="تصفية بالتصنيف">
              <SelectValue placeholder="كل التصنيفات" />
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
                header: "التصنيف الفرعي",
                render: (s) => (
                  <span className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-muted text-xl" aria-hidden>
                      {s.image_url ? <img src={s.image_url} alt="" className="h-full w-full object-cover" /> : (s.icon ?? "🐝")}
                    </span>
                    <span>
                      <span className="block font-bold">{s.name}</span>
                      <span className="block text-xs text-muted-foreground">{parentName(s.category_id)}</span>
                    </span>
                  </span>
                ),
              },
              {
                key: "preorder",
                header: "طلب مسبق",
                render: (s) => (
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold">
                    {s.requires_preorder ? "قبلها بيوم" : "فوري"}
                  </span>
                ),
              },
              { key: "order", header: "الترتيب", render: (s) => <span className="font-bold">{s.sort_order}</span> },
              { key: "status", header: "الحالة", render: (s) => <StatusBadge active={s.is_active} /> },
              {
                key: "actions",
                header: "الإجراءات",
                render: (s) => (
                  <span className="flex gap-1">
                    <button type="button" aria-label={`تعديل ${s.name}`} onClick={() => openEdit(s)} className="grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-muted">
                      <Pencil className="h-4 w-4" aria-hidden />
                    </button>
                    <button type="button" aria-label={s.is_active ? `تعطيل ${s.name}` : `تفعيل ${s.name}`} onClick={() => toggle(s)} className="grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-muted">
                      <Power className="h-4 w-4" aria-hidden />
                    </button>
                    <button type="button" aria-label={`حذف ${s.name}`} onClick={() => setDeleting(s)} className="grid h-9 w-9 place-items-center rounded-xl text-destructive transition-colors hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </span>
                ),
              },
            ]}
            renderMobileCard={(s) => (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-muted text-2xl" aria-hidden>
                    {s.image_url ? <img src={s.image_url} alt="" className="h-full w-full object-cover" /> : (s.icon ?? "🐝")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-extrabold">{s.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {parentName(s.category_id)} · {s.requires_preorder ? "طلب مسبق" : "فوري"}
                    </p>
                  </div>
                  <StatusBadge active={s.is_active} />
                </div>
                <div className="flex gap-2 border-t border-border pt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => openEdit(s)} className="flex-1 rounded-xl font-bold">تعديل</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => toggle(s)} className="flex-1 rounded-xl font-bold">{s.is_active ? "تعطيل" : "تفعيل"}</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setDeleting(s)} className="flex-1 rounded-xl font-bold text-destructive">حذف</Button>
                </div>
              </div>
            )}
            empty={
              <EmptyState
                title="لا توجد تصنيفات فرعية"
                hint="أضف أول تصنيف فرعي تحت تصنيف رئيسي."
                action={
                  <Button type="button" onClick={openCreate} className="h-12 gap-2 rounded-xl font-bold">
                    <Plus className="h-4 w-4" aria-hidden />
                    إضافة تصنيف فرعي
                  </Button>
                }
              />
            }
          />
        )}

        <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
          <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl" aria-label="تصنيف فرعي">
            <DialogHeader>
              <DialogTitle>{editing?.id ? "تعديل التصنيف الفرعي" : "تصنيف فرعي جديد"}</DialogTitle>
            </DialogHeader>
            {editing && (
              <div className="space-y-3">
                <Field id="sub-parent" label="التصنيف الرئيسي" required>
                  <Select
                    value={editing.form.category_id}
                    onValueChange={(v) => setEditing({ ...editing, form: { ...editing.form, category_id: v } })}
                  >
                    <SelectTrigger id="sub-parent" className="h-12 rounded-xl">
                      <SelectValue placeholder="اختار التصنيف" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field id="sub-name" label="الاسم" required>
                  <Input
                    id="sub-name"
                    value={editing.form.name}
                    onChange={(e) => setEditing({ ...editing, form: { ...editing.form, name: e.target.value } })}
                    className="h-12 rounded-xl"
                    placeholder="مثال: مشاوي"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field id="sub-icon" label="الأيقونة">
                    <Input
                      id="sub-icon"
                      value={editing.form.icon ?? ""}
                      onChange={(e) => setEditing({ ...editing, form: { ...editing.form, icon: e.target.value } })}
                      className="h-12 rounded-xl"
                      placeholder="🍢"
                    />
                  </Field>
                  <Field id="sub-order" label="الترتيب">
                    <Input
                      id="sub-order"
                      type="number"
                      value={editing.form.sort_order}
                      onChange={(e) => setEditing({ ...editing, form: { ...editing.form, sort_order: Number(e.target.value) } })}
                      className="h-12 rounded-xl"
                      inputMode="numeric"
                    />
                  </Field>
                </div>
                <Field id="sub-image" label="الصورة">
                  <ImageUploader
                    id="sub-image"
                    prefix="subcategories"
                    value={editing.form.image_url ?? null}
                    onChange={(url) => setEditing({ ...editing, form: { ...editing.form, image_url: url } })}
                  />
                </Field>
                <div className="flex items-center justify-between gap-2 rounded-xl bg-muted p-3">
                  <span className="text-sm font-bold">يتطلب طلبًا مسبقًا (قبلها بيوم)</span>
                  <Switch
                    checked={editing.form.requires_preorder}
                    onCheckedChange={(v) => setEditing({ ...editing, form: { ...editing.form, requires_preorder: v } })}
                    aria-label="يتطلب طلبًا مسبقًا"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 rounded-xl bg-muted p-3">
                  <span className="text-sm font-bold">الحالة</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{editing.form.is_active ? "مفعل" : "معطل"}</span>
                    <Switch
                      checked={editing.form.is_active}
                      onCheckedChange={(v) => setEditing({ ...editing, form: { ...editing.form, is_active: v } })}
                      aria-label="حالة التصنيف الفرعي"
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
                    <FilterValuesManager kind="subcategory" parentId={editing.id} />
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
          impact="سيتم حذف التصنيف الفرعي نهائيًا، وستفقد المنتجات المرتبطة به تصنيفها الفرعي."
          onConfirm={async () => {
            if (!deleting) return;
            try {
              await deleteSubcategory(deleting.id);
              toast.success("تم حذف التصنيف الفرعي");
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
