import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Power, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  DataTable,
  EmptyState,
  ErrorState,
  SearchInput,
  StatusBadge,
  TableSkeleton,
} from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/dialogs";
import { FilterValuesManager } from "@/components/admin/filters";
import { Field, ImageUploader } from "@/components/admin/forms";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  deleteProductGroup,
  deleteStoredImage,
  listCategoriesAdmin,
  listProductGroupsAdmin,
  listSubcategoriesAdmin,
  saveProductGroup,
  type ProductGroupInput,
} from "@/lib/admin";
import type { Category, ProductGroup, Subcategory } from "@/lib/catalog";

export const Route = createFileRoute("/admin/groups")({
  head: () => ({ meta: [{ title: "مجموعات المنتجات | إدارة نحلة" }] }),
  component: AdminGroupsPage,
});

const EMPTY_FORM: ProductGroupInput = {
  subcategory_id: "",
  name: "",
  icon: "",
  image_url: null,
  sort_order: 0,
  is_active: true,
  requires_preorder: false,
  has_filters: false,
  product_layout: "grid",
};

function AdminGroupsPage() {
  const [rows, setRows] = useState<ProductGroup[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [parentFilter, setParentFilter] = useState<string>("all");
  const [editing, setEditing] = useState<{
    id: string | null;
    form: ProductGroupInput;
  } | null>(null);
  const [deleting, setDeleting] = useState<ProductGroup | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setFailed(false);
    try {
      const [groups, cats, subs] = await Promise.all([
        listProductGroupsAdmin(),
        listCategoriesAdmin(),
        listSubcategoriesAdmin(),
      ]);
      setRows(groups);
      setCategories(cats);
      setSubcategories(subs);
    } catch {
      setFailed(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const parentLabel = useCallback(
    (subId: string) => {
      const sub = subcategories.find((s) => s.id === subId);
      if (!sub) return "—";
      const cat = categories.find((c) => c.id === sub.category_id);
      return cat ? `${cat.name} · ${sub.name}` : sub.name;
    },
    [categories, subcategories],
  );

  const filtered = useMemo(
    () =>
      (rows ?? []).filter(
        (g) =>
          (parentFilter === "all" || g.subcategory_id === parentFilter) &&
          g.name.includes(query.trim()),
      ),
    [rows, query, parentFilter],
  );

  function openCreate() {
    setEditing({
      id: null,
      form: {
        ...EMPTY_FORM,
        subcategory_id: parentFilter !== "all" ? parentFilter : "",
      },
    });
  }

  function openEdit(row: ProductGroup) {
    setEditing({
      id: row.id,
      form: {
        subcategory_id: row.subcategory_id,
        name: row.name,
        icon: row.icon ?? "",
        image_url: row.image_url,
        sort_order: row.sort_order,
        is_active: row.is_active,
        requires_preorder: row.requires_preorder,
        has_filters: row.has_filters ?? false,
        product_layout: row.product_layout ?? "grid",
      },
    });
  }

  async function save() {
    if (!editing) return;
    if (!editing.form.subcategory_id) {
      toast.error("اختار القسم الفرعي");
      return;
    }
    if (!editing.form.name.trim()) {
      toast.error("اسم المجموعة مطلوب");
      return;
    }
    setSaving(true);
    try {
      const prevImage = editing.id
        ? (rows?.find((r) => r.id === editing.id)?.image_url ?? null)
        : null;
      await saveProductGroup(editing.id, {
        ...editing.form,
        name: editing.form.name.trim(),
      });
      if (prevImage && prevImage !== editing.form.image_url)
        await deleteStoredImage(prevImage);
      toast.success(
        editing.id ? "تم حفظ المجموعة بنجاح" : "تمت إضافة المجموعة بنجاح",
      );
      setEditing(null);
      load();
    } catch (e) {
      toast.error(
        (e as { message?: string })?.message ?? "حصل خطأ، حاول تاني.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggle(row: ProductGroup) {
    try {
      await saveProductGroup(row.id, {
        subcategory_id: row.subcategory_id,
        name: row.name,
        icon: row.icon,
        image_url: row.image_url,
        sort_order: row.sort_order,
        is_active: !row.is_active,
        requires_preorder: row.requires_preorder,
        has_filters: row.has_filters ?? false,
        product_layout: row.product_layout ?? "grid",
      });
      toast.success(row.is_active ? "تم تعطيل المجموعة" : "تم تفعيل المجموعة");
      load();
    } catch (e) {
      toast.error(
        (e as { message?: string })?.message ?? "حصل خطأ، حاول تاني.",
      );
    }
  }

  return (
    <AdminGuard>
      <AdminShell
        title="مجموعات المنتجات"
        actions={
          <Button
            type="button"
            onClick={openCreate}
            className="h-11 gap-2 rounded-xl font-bold"
          >
            <Plus className="h-4 w-4" aria-hidden />
            إضافة مجموعة
          </Button>
        }
      >
        <div className="flex flex-wrap gap-2">
          <SearchInput value={query} onChange={setQuery} placeholder="بحث..." />
          <Select value={parentFilter} onValueChange={setParentFilter}>
            <SelectTrigger
              className="h-11 w-full rounded-xl sm:w-64"
              aria-label="تصفية بالقسم الفرعي"
            >
              <SelectValue placeholder="كل الأقسام الفرعية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الأقسام الفرعية</SelectItem>
              {subcategories.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {parentLabel(s.id)}
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
                header: "المجموعة",
                render: (g) => (
                  <span className="flex items-center gap-3">
                    <span
                      className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-muted text-xl"
                      aria-hidden
                    >
                      {g.image_url ? (
                        <img
                          src={g.image_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        (g.icon ?? "🐝")
                      )}
                    </span>
                    <span>
                      <span className="block font-bold">{g.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {parentLabel(g.subcategory_id)}
                      </span>
                    </span>
                  </span>
                ),
              },
              {
                key: "preorder",
                header: "طلب مسبق",
                render: (g) => (
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold">
                    {g.requires_preorder ? "قبلها بيوم" : "فوري"}
                  </span>
                ),
              },
              {
                key: "order",
                header: "الترتيب",
                render: (g) => (
                  <span className="font-bold">{g.sort_order}</span>
                ),
              },
              {
                key: "status",
                header: "الحالة",
                render: (g) => <StatusBadge active={g.is_active} />,
              },
              {
                key: "actions",
                header: "الإجراءات",
                render: (g) => (
                  <span className="flex gap-1">
                    <button
                      type="button"
                      aria-label={`تعديل ${g.name}`}
                      onClick={() => openEdit(g)}
                      className="grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-muted"
                    >
                      <Pencil className="h-4 w-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      aria-label={
                        g.is_active ? `تعطيل ${g.name}` : `تفعيل ${g.name}`
                      }
                      onClick={() => toggle(g)}
                      className="grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-muted"
                    >
                      <Power className="h-4 w-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      aria-label={`حذف ${g.name}`}
                      onClick={() => setDeleting(g)}
                      className="grid h-9 w-9 place-items-center rounded-xl text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </span>
                ),
              },
            ]}
            renderMobileCard={(g) => (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-muted text-2xl"
                    aria-hidden
                  >
                    {g.image_url ? (
                      <img
                        src={g.image_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      (g.icon ?? "🐝")
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-extrabold">{g.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {parentLabel(g.subcategory_id)} ·{" "}
                      {g.requires_preorder ? "طلب مسبق" : "فوري"}
                    </p>
                  </div>
                  <StatusBadge active={g.is_active} />
                </div>
                <div className="flex gap-2 border-t border-border pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(g)}
                    className="flex-1 rounded-xl font-bold"
                  >
                    تعديل
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => toggle(g)}
                    className="flex-1 rounded-xl font-bold"
                  >
                    {g.is_active ? "تعطيل" : "تفعيل"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleting(g)}
                    className="flex-1 rounded-xl font-bold text-destructive"
                  >
                    حذف
                  </Button>
                </div>
              </div>
            )}
            empty={
              <EmptyState
                title="لا توجد مجموعات منتجات"
                hint="أضف أول مجموعة تحت قسم فرعي، وستظهر للعميل بدل المنتجات المباشرة."
                action={
                  <Button
                    type="button"
                    onClick={openCreate}
                    className="h-12 gap-2 rounded-xl font-bold"
                  >
                    <Plus className="h-4 w-4" aria-hidden />
                    إضافة مجموعة
                  </Button>
                }
              />
            }
          />
        )}

        <Dialog
          open={editing !== null}
          onOpenChange={(open) => !open && setEditing(null)}
        >
          <DialogContent
            className="max-h-[90vh] overflow-y-auto rounded-2xl"
            aria-label="مجموعة منتجات"
          >
            <DialogHeader>
              <DialogTitle>
                {editing?.id ? "تعديل المجموعة" : "مجموعة جديدة"}
              </DialogTitle>
            </DialogHeader>
            {editing && (
              <div className="space-y-3">
                <Field id="group-parent" label="القسم الفرعي" required>
                  <Select
                    value={editing.form.subcategory_id}
                    onValueChange={(v) =>
                      setEditing({
                        ...editing,
                        form: { ...editing.form, subcategory_id: v },
                      })
                    }
                  >
                    <SelectTrigger
                      id="group-parent"
                      className="h-12 rounded-xl"
                    >
                      <SelectValue placeholder="اختار القسم الفرعي" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {parentLabel(s.id)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field id="group-name" label="الاسم" required>
                  <Input
                    id="group-name"
                    value={editing.form.name}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        form: { ...editing.form, name: e.target.value },
                      })
                    }
                    className="h-12 rounded-xl"
                    placeholder="مثال: ألبان"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field id="group-icon" label="الأيقونة">
                    <Input
                      id="group-icon"
                      value={editing.form.icon ?? ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          form: { ...editing.form, icon: e.target.value },
                        })
                      }
                      className="h-12 rounded-xl"
                      placeholder="🥛"
                    />
                  </Field>
                  <Field id="group-order" label="الترتيب">
                    <Input
                      id="group-order"
                      type="number"
                      value={editing.form.sort_order}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          form: {
                            ...editing.form,
                            sort_order: Number(e.target.value),
                          },
                        })
                      }
                      className="h-12 rounded-xl"
                      inputMode="numeric"
                    />
                  </Field>
                </div>
                <Field id="group-image" label="الصورة">
                  <ImageUploader
                    id="group-image"
                    prefix="product-groups"
                    value={editing.form.image_url ?? null}
                    onChange={(url) =>
                      setEditing({
                        ...editing,
                        form: { ...editing.form, image_url: url },
                      })
                    }
                  />
                </Field>
                <Field
                  id="group-layout"
                  label="شكل عرض المنتجات"
                  hint="طريقة عرض المنتجات التابعة لهذه المجموعة"
                >
                  <Select
                    value={editing.form.product_layout ?? "grid"}
                    onValueChange={(v: "grid" | "list") =>
                      setEditing({
                        ...editing,
                        form: { ...editing.form, product_layout: v },
                      })
                    }
                  >
                    <SelectTrigger
                      id="group-layout"
                      className="h-12 rounded-xl"
                    >
                      <SelectValue placeholder="اختر شكل العرض" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">الشبكة الحالية</SelectItem>
                      <SelectItem value="list">منتج بعرض الشاشة</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <div className="flex items-center justify-between gap-2 rounded-xl bg-muted p-3">
                  <span className="text-sm font-bold">
                    يتطلب طلبًا مسبقًا (قبلها بيوم)
                  </span>
                  <Switch
                    checked={editing.form.requires_preorder}
                    onCheckedChange={(v) =>
                      setEditing({
                        ...editing,
                        form: { ...editing.form, requires_preorder: v },
                      })
                    }
                    aria-label="يتطلب طلبًا مسبقًا"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 rounded-xl bg-muted p-3">
                  <span className="text-sm font-bold">الحالة</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {editing.form.is_active ? "مفعل" : "معطل"}
                    </span>
                    <Switch
                      checked={editing.form.is_active}
                      onCheckedChange={(v) =>
                        setEditing({
                          ...editing,
                          form: { ...editing.form, is_active: v },
                        })
                      }
                      aria-label="حالة المجموعة"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 rounded-xl bg-muted p-3">
                  <span className="text-sm font-bold">فلاتر العرض</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {editing.form.has_filters ? "مفعلة" : "معطلة"}
                    </span>
                    <Switch
                      checked={editing.form.has_filters}
                      onCheckedChange={(v) =>
                        setEditing({
                          ...editing,
                          form: { ...editing.form, has_filters: v },
                        })
                      }
                      aria-label="تفعيل فلاتر العرض"
                    />
                  </div>
                </div>
                {editing.id && editing.form.has_filters && (
                  <div className="space-y-2 rounded-xl bg-muted p-3">
                    <p className="text-sm font-extrabold">قيم الفلاتر</p>
                    <FilterValuesManager kind="group" parentId={editing.id} />
                  </div>
                )}
              </div>
            )}
            <DialogFooter className="flex-row-reverse gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(null)}
                className="rounded-xl"
              >
                إلغاء
              </Button>
              <Button
                type="button"
                onClick={save}
                disabled={saving}
                className="rounded-xl font-bold"
              >
                {saving ? "جاري الحفظ..." : "حفظ"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={deleting !== null}
          onOpenChange={(open) => !open && setDeleting(null)}
          title={`حذف «${deleting?.name}»؟`}
          impact="سيتم حذف المجموعة نهائيًا، وستفقد المنتجات المرتبطة بها المجموعة (المنتجات نفسها لن تُحذف)."
          onConfirm={async () => {
            if (!deleting) return;
            try {
              await deleteProductGroup(deleting.id);
              await deleteStoredImage(deleting.image_url ?? null);
              toast.success("تم حذف المجموعة");
              setDeleting(null);
              load();
            } catch (e) {
              toast.error(
                (e as { message?: string })?.message ?? "حصل خطأ، حاول تاني.",
              );
            }
          }}
        />
      </AdminShell>
    </AdminGuard>
  );
}
