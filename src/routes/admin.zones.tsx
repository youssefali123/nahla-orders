import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Power, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell } from "@/components/admin/AdminShell";
import { DataTable, EmptyState, ErrorState, SearchInput, StatusBadge, TableSkeleton } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/dialogs";
import { Field } from "@/components/admin/forms";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  deleteZone,
  listZonesAdmin,
  saveZone,
  type ZoneInput,
} from "@/lib/admin";
import type { DeliveryZone } from "@/lib/catalog";

export const Route = createFileRoute("/admin/zones")({
  head: () => ({ meta: [{ title: "مناطق التوصيل | إدارة نحلة" }] }),
  component: AdminZonesPage,
});

const EMPTY_FORM: ZoneInput = { name: "", fee: 0, sort_order: 0, is_active: true };

function formatFee(fee: number) {
  return fee === 0 ? "توصيل مجاني 🎉" : `${fee} جنيه`;
}

function AdminZonesPage() {
  const [rows, setRows] = useState<DeliveryZone[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<{ id: string | null; form: ZoneInput } | null>(null);
  const [deleting, setDeleting] = useState<DeliveryZone | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setFailed(false);
    try {
      setRows(await listZonesAdmin());
    } catch {
      setFailed(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () => (rows ?? []).filter((z) => z.name.includes(query.trim())),
    [rows, query],
  );

  function openCreate() {
    setEditing({ id: null, form: { ...EMPTY_FORM } });
  }

  function openEdit(row: DeliveryZone) {
    setEditing({
      id: row.id,
      form: { name: row.name, fee: Number(row.fee), sort_order: row.sort_order, is_active: row.is_active },
    });
  }

  async function save() {
    if (!editing) return;
    if (!editing.form.name.trim()) {
      toast.error("اسم المنطقة مطلوب");
      return;
    }
    if (!(editing.form.fee >= 0)) {
      toast.error("سعر التوصيل يجب أن يكون صفرًا أو أكثر");
      return;
    }
    setSaving(true);
    try {
      await saveZone(editing.id, { ...editing.form, name: editing.form.name.trim() });
      toast.success(editing.id ? "تم حفظ المنطقة بنجاح" : "تمت إضافة المنطقة بنجاح");
      setEditing(null);
      load();
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "حصل خطأ، حاول تاني.");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(row: DeliveryZone) {
    try {
      await saveZone(row.id, {
        name: row.name,
        fee: Number(row.fee),
        sort_order: row.sort_order,
        is_active: !row.is_active,
      });
      toast.success(row.is_active ? "تم تعطيل المنطقة" : "تم تفعيل المنطقة");
      load();
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "حصل خطأ، حاول تاني.");
    }
  }

  return (
    <AdminGuard>
      <AdminShell
        title="مناطق التوصيل"
        actions={
          <Button type="button" onClick={openCreate} className="h-11 gap-2 rounded-xl font-bold">
            <Plus className="h-4 w-4" aria-hidden />
            إضافة منطقة
          </Button>
        }
      >
        <div className="flex flex-wrap gap-2">
          <SearchInput value={query} onChange={setQuery} placeholder="بحث عن منطقة..." />
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
                header: "المنطقة",
                render: (z) => <span className="font-bold">{z.name}</span>,
              },
              {
                key: "fee",
                header: "سعر التوصيل",
                render: (z) => <span className="font-extrabold text-primary-dark">{formatFee(Number(z.fee))}</span>,
              },
              { key: "order", header: "الترتيب", render: (z) => <span className="font-bold">{z.sort_order}</span> },
              { key: "status", header: "الحالة", render: (z) => <StatusBadge active={z.is_active} /> },
              {
                key: "actions",
                header: "الإجراءات",
                render: (z) => (
                  <span className="flex gap-1">
                    <button type="button" aria-label={`تعديل ${z.name}`} onClick={() => openEdit(z)} className="grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-muted">
                      <Pencil className="h-4 w-4" aria-hidden />
                    </button>
                    <button type="button" aria-label={z.is_active ? `تعطيل ${z.name}` : `تفعيل ${z.name}`} onClick={() => toggle(z)} className="grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-muted">
                      <Power className="h-4 w-4" aria-hidden />
                    </button>
                    <button type="button" aria-label={`حذف ${z.name}`} onClick={() => setDeleting(z)} className="grid h-9 w-9 place-items-center rounded-xl text-destructive transition-colors hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </span>
                ),
              },
            ]}
            renderMobileCard={(z) => (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-extrabold">{z.name}</p>
                  <StatusBadge active={z.is_active} />
                </div>
                <p className="text-sm font-extrabold text-primary-dark">{formatFee(Number(z.fee))}</p>
                <div className="flex gap-2 border-t border-border pt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => openEdit(z)} className="flex-1 rounded-xl font-bold">تعديل</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => toggle(z)} className="flex-1 rounded-xl font-bold">{z.is_active ? "تعطيل" : "تفعيل"}</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setDeleting(z)} className="flex-1 rounded-xl font-bold text-destructive">حذف</Button>
                </div>
              </div>
            )}
            empty={
              <EmptyState
                title="لا توجد مناطق توصيل"
                hint="أضف أول منطقة مع سعر التوصيل الخاص بها."
                action={
                  <Button type="button" onClick={openCreate} className="h-12 gap-2 rounded-xl font-bold">
                    <Plus className="h-4 w-4" aria-hidden />
                    إضافة منطقة
                  </Button>
                }
              />
            }
          />
        )}

        <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
          <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl" aria-label="منطقة توصيل">
            <DialogHeader>
              <DialogTitle>{editing?.id ? "تعديل المنطقة" : "منطقة جديدة"}</DialogTitle>
            </DialogHeader>
            {editing && (
              <div className="space-y-3">
                <Field id="zone-name" label="اسم المنطقة" required>
                  <Input
                    id="zone-name"
                    value={editing.form.name}
                    onChange={(e) => setEditing({ ...editing, form: { ...editing.form, name: e.target.value } })}
                    className="h-12 rounded-xl"
                    placeholder="مثال: وسط البلد"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field id="zone-fee" label="سعر التوصيل (جنيه)" required hint="صفر يعني توصيل مجاني">
                    <Input
                      id="zone-fee"
                      type="number"
                      min={0}
                      value={editing.form.fee}
                      onChange={(e) => setEditing({ ...editing, form: { ...editing.form, fee: Number(e.target.value) } })}
                      className="h-12 rounded-xl"
                      inputMode="decimal"
                    />
                  </Field>
                  <Field id="zone-order" label="الترتيب">
                    <Input
                      id="zone-order"
                      type="number"
                      value={editing.form.sort_order}
                      onChange={(e) => setEditing({ ...editing, form: { ...editing.form, sort_order: Number(e.target.value) } })}
                      className="h-12 rounded-xl"
                      inputMode="numeric"
                    />
                  </Field>
                </div>
                <div className="flex items-center justify-between gap-2 rounded-xl bg-muted p-3">
                  <span className="text-sm font-bold">الحالة</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{editing.form.is_active ? "مفعلة" : "معطلة"}</span>
                    <Switch
                      checked={editing.form.is_active}
                      onCheckedChange={(v) => setEditing({ ...editing, form: { ...editing.form, is_active: v } })}
                      aria-label="حالة المنطقة"
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
          title={`حذف «${deleting?.name}»؟`}
          impact="سيتم حذف منطقة التوصيل نهائيًا. الطلبات المرسلة سابقًا لن تتأثر."
          onConfirm={async () => {
            if (!deleting) return;
            try {
              await deleteZone(deleting.id);
              toast.success("تم حذف المنطقة");
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
