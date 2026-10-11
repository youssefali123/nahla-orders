import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell } from "@/components/admin/AdminShell";
import { ErrorState } from "@/components/admin/DataTable";
import { ConfirmDialog, FormSection } from "@/components/admin/dialogs";
import { Field, ImageUploader } from "@/components/admin/forms";
import { NewOptionGroupButton, OptionGroupEditor, PricePreview } from "@/components/admin/options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  deleteProduct,
  getProductAdmin,
  getProductFilter,
  listCategoriesAdmin,
  listFiltersAdmin,
  listSubcategoriesAdmin,
  saveProduct,
  saveProductFilter,
  type ProductInput,
} from "@/lib/admin";
import type { Category, ConfiguredProduct, DisplayFilter, Subcategory } from "@/lib/catalog";

export const Route = createFileRoute("/admin/product-editor")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: typeof search["id"] === "string" ? search["id"] : null,
  }),
  head: () => ({ meta: [{ title: "محرر المنتج | إدارة نحلة" }] }),
  component: ProductEditorPage,
});

const EMPTY: ProductInput = {
  category_id: "",
  subcategory_id: null,
  name: "",
  price: 0,
  icon: "",
  image_url: null,
  description: "",
  unit: "",
  sort_order: 0,
  is_active: true,
  is_featured: false,
};

function ProductEditorPage() {
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id !== null);
  const [failed, setFailed] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [form, setForm] = useState<ProductInput>({ ...EMPTY });
  const [product, setProduct] = useState<ConfiguredProduct | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [filterOptions, setFilterOptions] = useState<DisplayFilter[]>([]);
  const [filterId, setFilterId] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setFailed(false);
    try {
      const [cats, subs] = await Promise.all([listCategoriesAdmin(), listSubcategoriesAdmin()]);
      setCategories(cats);
      setSubcategories(subs);
      if (id) {
        const fetched = await getProductAdmin(id);
        if (!fetched) {
          setFailed(true);
          return;
        }
        setProduct(fetched);
        setForm({
          category_id: fetched.category_id,
          subcategory_id: fetched.subcategory_id,
          name: fetched.name,
          price: Number(fetched.price),
          icon: fetched.icon ?? "",
          image_url: fetched.image_url,
          description: fetched.description ?? "",
          unit: fetched.unit ?? "",
          sort_order: fetched.sort_order,
          is_active: fetched.is_active,
          is_featured: fetched.is_featured,
        });
      }
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  // Section filter values: subcategory wins, else the direct category.
  // Re-resolves on section change; stale assignments clear automatically.
  useEffect(() => {
    let cancelled = false;
    const subId = form.subcategory_id;
    const catId = form.category_id;
    (async () => {
      try {
        let list: DisplayFilter[] = [];
        if (subId) list = (await listFiltersAdmin("subcategory", subId)).filter((f) => f.is_active);
        else if (catId) list = (await listFiltersAdmin("category", catId)).filter((f) => f.is_active);
        if (cancelled) return;
        setFilterOptions(list);
        setFilterId((current) => (current && list.some((f) => f.id === current) ? current : null));
      } catch {
        if (!cancelled) setFilterOptions([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [form.subcategory_id, form.category_id]);

  // Current assignment for existing products.
  useEffect(() => {
    if (!id) {
      setFilterId(null);
      return;
    }
    let cancelled = false;
    getProductFilter(id).then(
      (value) => {
        if (!cancelled) setFilterId(value);
      },
      () => {
        if (!cancelled) setFilterId(null);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [id]);

  function set<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setForm((f) => ({ ...f, [key]: value, ...(key === "category_id" ? { subcategory_id: null } : {}) }));
    setDirty(true);
  }

  function validate(): string[] {
    const problems: string[] = [];
    if (!form.name.trim()) problems.push("اسم المنتج مطلوب");
    if (!form.category_id) problems.push("اختار التصنيف");
    if (!(form.price >= 0)) problems.push("السعر يجب أن يكون صفرًا أو أكثر");
    return problems;
  }

  async function save() {
    const problems = validate();
    setErrors(problems);
    if (problems.length > 0) {
      summaryRef.current?.focus();
      return;
    }
    setSaving(true);
    try {
      const savedId = await saveProduct(id, { ...form, name: form.name.trim() });
      await saveProductFilter(savedId, filterId);
      toast.success(id ? "تم حفظ المنتج بنجاح" : "تمت إضافة المنتج بنجاح");
      setDirty(false);
      if (!id) navigate({ to: "/admin/product-editor", search: { id: savedId }, replace: true });
      else load();
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "تعذر حفظ المنتج. يرجى المحاولة مرة أخرى.");
    } finally {
      setSaving(false);
    }
  }

  function back() {
    if (dirty) setConfirmLeave(true);
    else navigate({ to: "/admin/products" });
  }

  const subOptions = subcategories.filter((s) => s.category_id === form.category_id);
  const previewPicks =
    product?.option_groups.flatMap((g) =>
      g.options.slice(0, g.type === "single" ? 1 : 2).map((o) => ({ label: `${g.name}: ${o.name}`, delta: Number(o.price_delta) })),
    ) ?? [];

  return (
    <AdminGuard>
      <AdminShell
        title={id ? "تعديل المنتج" : "منتج جديد"}
        actions={
          id ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmDelete(true)}
              className="h-11 gap-2 rounded-xl font-bold text-destructive"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
              حذف
            </Button>
          ) : undefined
        }
      >
        {loading ? (
          <div className="space-y-3" aria-busy="true" aria-label="جاري التحميل">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
        ) : failed ? (
          <ErrorState onRetry={load} />
        ) : (
          <div className="space-y-4 pb-24 lg:pb-0">
            {errors.length > 0 && (
              <div
                ref={summaryRef}
                tabIndex={-1}
                role="alert"
                aria-labelledby="editor-errors-title"
                className="rounded-2xl border border-destructive/40 bg-destructive/5 p-4"
              >
                <p id="editor-errors-title" className="font-extrabold text-destructive">
                  يوجد {errors.length} {errors.length === 1 ? "مشكلة" : "مشاكل"} يجب حلها
                </p>
                <ul className="mt-1 list-disc space-y-0.5 pr-5 text-sm font-semibold text-destructive">
                  {errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            )}

            <FormSection title="معلومات المنتج">
              <Field id="pe-name" label="اسم المنتج" required>
                <Input id="pe-name" value={form.name} onChange={(e) => set("name", e.target.value)} className="h-12 rounded-xl" placeholder="مثال: فرخة مشوية" />
              </Field>
              <Field id="pe-desc" label="الوصف">
                <Textarea id="pe-desc" value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} className="min-h-20 rounded-xl" placeholder="وصف مختصر للمنتج" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field id="pe-price" label="السعر الأساسي (جنيه)" required hint="سعر المنتج بدون أي إضافات">
                  <Input id="pe-price" type="number" min={0} value={form.price} onChange={(e) => set("price", Number(e.target.value))} className="h-12 rounded-xl" inputMode="decimal" />
                </Field>
                <Field id="pe-unit" label="الوحدة" hint="مثال: كيلو، علبة">
                  <Input id="pe-unit" value={form.unit ?? ""} onChange={(e) => set("unit", e.target.value)} className="h-12 rounded-xl" placeholder="كيلو" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field id="pe-cat" label="التصنيف" required>
                  <Select value={form.category_id} onValueChange={(v) => set("category_id", v)}>
                    <SelectTrigger id="pe-cat" className="h-12 rounded-xl">
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
                <Field id="pe-sub" label="التصنيف الفرعي" hint="اختياري">
                  <Select value={form.subcategory_id ?? "none"} onValueChange={(v) => set("subcategory_id", v === "none" ? null : v)}>
                    <SelectTrigger id="pe-sub" className="h-12 rounded-xl">
                      <SelectValue placeholder="بدون" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">بدون تصنيف فرعي</SelectItem>
                      {subOptions.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              {filterOptions.length > 0 && (
                <Field id="pe-filter" label="فلتر العرض" hint="يظهر المنتج تحت هذا التصنيف في شريط الفلاتر">
                  <Select value={filterId ?? "none"} onValueChange={(v) => setFilterId(v === "none" ? null : v)}>
                    <SelectTrigger id="pe-filter" className="h-12 rounded-xl">
                      <SelectValue placeholder="بدون فلتر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">بدون فلتر</SelectItem>
                      {filterOptions.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
              <div className="grid grid-cols-2 gap-3">
                <Field id="pe-icon" label="الأيقونة" hint="إيموجي يظهر عند غياب الصورة">
                  <Input id="pe-icon" value={form.icon ?? ""} onChange={(e) => set("icon", e.target.value)} className="h-12 rounded-xl" placeholder="🍗" />
                </Field>
                <Field id="pe-order" label="الترتيب">
                  <Input id="pe-order" type="number" value={form.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} className="h-12 rounded-xl" inputMode="numeric" />
                </Field>
              </div>
              <Field id="pe-image" label="الصورة">
                <ImageUploader id="pe-image" prefix="products" value={form.image_url ?? null} onChange={(url) => set("image_url", url ?? null)} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between gap-2 rounded-xl bg-muted p-3">
                  <span className="text-sm font-bold">مفعل</span>
                  <Switch checked={form.is_active} onCheckedChange={(v) => set("is_active", v)} aria-label="حالة المنتج" />
                </div>
                <div className="flex items-center justify-between gap-2 rounded-xl bg-muted p-3">
                  <span className="text-sm font-bold">الأكثر طلبًا 🔥</span>
                  <Switch checked={form.is_featured} onCheckedChange={(v) => set("is_featured", v)} aria-label="منتج مميز" />
                </div>
              </div>
            </FormSection>

            <FormSection
              title="خيارات المنتج"
              hint="الزيادات هنا تُضاف على السعر الأساسي. اترك القسم فارغًا لمنتج بدون خيارات."
            >
              {id ? (
                product && product.option_groups.length > 0 ? (
                  <div className="space-y-3">
                    {product.option_groups.map((group) => (
                      <OptionGroupEditor key={group.id} productId={id} group={group} onChanged={load} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-border p-6 text-center">
                    <p className="font-extrabold">لا توجد مجموعات خيارات لهذا المنتج.</p>
                    <p className="mt-1 text-sm text-muted-foreground">أضف مجموعة مثل: الحجم، الطعم، أو الإضافات.</p>
                  </div>
                )
              ) : (
                <p className="rounded-2xl bg-muted p-4 text-center text-sm font-bold text-muted-foreground">
                  احفظ المنتج أولًا لتتمكن من إضافة مجموعات الخيارات.
                </p>
              )}
              {id && <NewOptionGroupButton productId={id} onChanged={load} />}
              {id && product && <PricePreview base={form.price} picks={previewPicks} />}
            </FormSection>

            <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-border bg-card/95 p-3 backdrop-blur lg:static lg:border-0 lg:bg-transparent lg:p-0">
              <Button type="button" variant="outline" onClick={back} className="h-13 flex-1 rounded-xl py-3.5 font-bold lg:flex-none lg:px-8">
                {dirty ? "تجاهل" : "رجوع"}
              </Button>
              <Button type="button" onClick={save} disabled={saving} className="h-13 flex-[2] rounded-xl py-3.5 text-base font-extrabold lg:flex-none lg:px-10">
                {saving ? "جاري الحفظ..." : "حفظ المنتج"}
              </Button>
            </div>
          </div>
        )}

        <ConfirmDialog
          open={confirmDelete}
          onOpenChange={setConfirmDelete}
          title={`حذف «${form.name || "المنتج"}»؟`}
          impact="سيتم حذف المنتج وجميع مجموعات الخيارات والاختيارات المرتبطة به نهائيًا."
          onConfirm={async () => {
            if (!id) return;
            try {
              await deleteProduct(id);
              toast.success("تم حذف المنتج");
              navigate({ to: "/admin/products" });
            } catch (e) {
              toast.error((e as { message?: string })?.message ?? "حصل خطأ، حاول تاني.");
              setConfirmDelete(false);
            }
          }}
        />
        <ConfirmDialog
          open={confirmLeave}
          onOpenChange={setConfirmLeave}
          title="تجاهل التغييرات؟"
          impact="لديك تغييرات غير محفوظة ستفقدها."
          confirmLabel="تجاهل ورجوع"
          onConfirm={() => navigate({ to: "/admin/products" })}
        />
      </AdminShell>
    </AdminGuard>
  );
}
