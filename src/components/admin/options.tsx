import { useState } from "react";
import { GripVertical, ImagePlus, Pencil, Plus, Trash2, X } from "lucide-react";
// import { toast } from "react-hot-toast";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  deleteOption,
  deleteOptionGroup,
  saveOption,
  saveOptionGroup,
  uploadImage,
  type AdminError,
} from "@/lib/admin";
import type { ConfiguredGroup, ProductOption } from "@/lib/catalog";
import { Field } from "./forms";
import { ConfirmDialog } from "./dialogs";

function errMessage(error: unknown): string {
  return (error as AdminError)?.message ?? "حصل خطأ، حاول تاني.";
}

export function PriceDeltaInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <Input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-10 w-24 rounded-xl"
        aria-label="الزيادة على السعر"
        inputMode="decimal"
      />
      <span className="shrink-0 text-xs font-bold text-muted-foreground">جنيه</span>
    </div>
  );
}

function OptionRow({
  option,
  onSaved,
  onDeleted,
}: {
  option: ProductOption;
  onSaved: () => void;
  onDeleted: () => void;
}) {
  const [name, setName] = useState(option.name);
  const [delta, setDelta] = useState(Number(option.price_delta));
  const [image, setImage] = useState<string | null>(option.image_url ?? null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [active, setActive] = useState(option.is_active);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dirty =
    name.trim() !== option.name ||
    delta !== Number(option.price_delta) ||
    active !== option.is_active ||
    (image ?? null) !== (option.image_url ?? null);

  async function save() {
    if (!name.trim()) {
      toast.error("اسم الاختيار مطلوب");
      return;
    }
    setSaving(true);
    try {
      await saveOption(option.option_group_id, option.id, {
        name: name.trim(),
        price_delta: delta,
        image_url: image,
        sort_order: option.sort_order,
        is_active: active,
      });
      toast.success("تم حفظ الاختيار بنجاح");
      onSaved();
    } catch (e) {
      toast.error(errMessage(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-xl bg-card p-2 shadow-soft">
      <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
      <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-muted text-muted-foreground">
        <label
          className="grid h-full w-full cursor-pointer place-items-center transition-colors hover:border-primary"
          aria-label={image ? `تغيير صورة ${option.name}` : `رفع صورة لـ ${option.name}`}
          title={image ? "تغيير الصورة" : "رفع صورة للاختيار"}
        >
          {uploadingImage ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary" aria-hidden />
          ) : image ? (
            <img src={image} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-4 w-4" aria-hidden />
          )}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={uploadingImage}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              setUploadingImage(true);
              try {
                setImage(await uploadImage("options", file));
                toast.success("تم رفع الصورة — اضغط حفظ لتثبيتها");
              } catch (err) {
                toast.error(errMessage(err));
              } finally {
                setUploadingImage(false);
              }
            }}
          />
        </label>
        {image && (
          <button
            type="button"
            aria-label={`مسح صورة ${option.name}`}
            title="مسح الصورة"
            onClick={() => {
              setImage(null);
              toast.success("اتشالت الصورة من المعاينة — دوس حفظ للتثبيت");
            }}
            className="absolute -left-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-destructive text-destructive-foreground shadow transition-transform hover:scale-110"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        )}
      </span>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="h-10 min-w-0 flex-1 rounded-xl"
        aria-label="اسم الاختيار"
      />
      <PriceDeltaInput value={delta} onChange={setDelta} />
      <button
        type="button"
        role="switch"
        aria-checked={active}
        aria-label="حالة الاختيار"
        onClick={() => setActive((v) => !v)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${active ? "bg-primary" : "bg-muted"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${active ? "right-0.5" : "left-0.5"}`}
          aria-hidden
        />
      </button>
      {dirty && (
        <Button type="button" size="sm" onClick={save} disabled={saving} className="shrink-0 rounded-xl font-bold">
          {saving ? "حفظ..." : "حفظ"}
        </Button>
      )}
      <button
        type="button"
        aria-label={`حذف ${option.name}`}
        onClick={() => setConfirmDelete(true)}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-destructive transition-colors hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" aria-hidden />
      </button>
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={`حذف «${option.name}»؟`}
        impact="سيتم حذف هذا الاختيار نهائيًا."
        onConfirm={async () => {
          try {
            await deleteOption(option.id);
            toast.success("تم حذف الاختيار");
            onDeleted();
            setConfirmDelete(false);
          } catch (e) {
            toast.error(errMessage(e));
          }
        }}
      />
    </div>
  );
}

function GroupDialog({
  productId,
  group,
  open,
  onOpenChange,
  onSaved,
}: {
  productId: string;
  group: ConfiguredGroup | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(group?.name ?? "");
  const [type, setType] = useState<"single" | "multiple">(group?.type ?? "single");
  const [min, setMin] = useState(group?.min_selections ?? 0);
  const [max, setMax] = useState<number | null>(group?.max_selections ?? (group?.type === "multiple" ? null : 1));
  const [active, setActive] = useState(group?.is_active ?? true);
  const [saving, setSaving] = useState(false);

  function pickType(next: "single" | "multiple") {
    setType(next);
    if (next === "single") {
      setMax(1);
      setMin((m) => Math.min(m, 1));
    }
  }

  async function save() {
    if (!name.trim()) {
      toast.error("اسم المجموعة مطلوب");
      return;
    }
    setSaving(true);
    try {
      await saveOptionGroup(productId, group?.id ?? null, {
        name: name.trim(),
        type,
        min_selections: min,
        max_selections: type === "single" ? 1 : max,
        sort_order: group?.sort_order ?? 0,
        is_active: active,
      });
      toast.success("تم حفظ المجموعة بنجاح");
      onSaved();
      onOpenChange(false);
    } catch (e) {
      toast.error(errMessage(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl" aria-label={group ? "تعديل المجموعة" : "مجموعة جديدة"}>
        <DialogHeader>
          <DialogTitle>{group ? "تعديل المجموعة" : "مجموعة خيارات جديدة"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Field id="group-name" label="اسم المجموعة" required>
            <Input id="group-name" value={name} onChange={(e) => setName(e.target.value)} className="h-12 rounded-xl" placeholder="مثال: الحجم" />
          </Field>
          <div>
            <Label className="mb-1.5 block text-sm font-bold">نوع الاختيار</Label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { v: "single", t: "اختيار واحد", h: "يسمح للعميل باختيار عنصر واحد فقط." },
                  { v: "multiple", t: "متعدد الاختيارات", h: "يسمح للعميل باختيار أكثر من عنصر." },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => pickType(opt.v)}
                  aria-pressed={type === opt.v}
                  className={`rounded-xl border p-3 text-right transition-colors ${
                    type === opt.v ? "border-primary bg-primary/10" : "border-border bg-card"
                  }`}
                >
                  <span className="block text-sm font-extrabold">{opt.t}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{opt.h}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field id="group-min" label="الحد الأدنى" hint={type === "single" ? "0 أو 1 فقط" : undefined}>
              <Input
                id="group-min"
                type="number"
                min={0}
                max={type === "single" ? 1 : undefined}
                value={min}
                onChange={(e) => setMin(Math.max(0, Number(e.target.value)))}
                className="h-12 rounded-xl"
                inputMode="numeric"
              />
            </Field>
            <Field id="group-max" label="الحد الأقصى" hint={type === "single" ? "دائمًا 1" : "اتركه فارغًا بدون حد"}>
              <Input
                id="group-max"
                type="number"
                min={0}
                value={max ?? ""}
                disabled={type === "single"}
                onChange={(e) => setMax(e.target.value === "" ? null : Math.max(0, Number(e.target.value)))}
                className="h-12 rounded-xl"
                inputMode="numeric"
                placeholder="بدون حد"
              />
            </Field>
          </div>
          <div className="flex items-center justify-between gap-2 rounded-xl bg-muted p-3">
            <span className="text-sm font-bold">الحالة</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{active ? "مفعلة" : "معطلة"}</span>
              <Switch checked={active} onCheckedChange={setActive} aria-label="حالة المجموعة" />
            </div>
          </div>
        </div>
        <DialogFooter className="flex-row-reverse gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            إلغاء
          </Button>
          <Button type="button" onClick={save} disabled={saving} className="rounded-xl font-bold">
            {saving ? "جاري الحفظ..." : "حفظ المجموعة"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function OptionGroupEditor({
  productId,
  group,
  onChanged,
}: {
  productId: string;
  group: ConfiguredGroup;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [showAddOption, setShowAddOption] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDelta, setNewDelta] = useState(0);
  const [savingOption, setSavingOption] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function addOption() {
    if (!newName.trim()) {
      toast.error("اسم الاختيار مطلوب");
      return;
    }
    setSavingOption(true);
    try {
      await saveOption(group.id, null, {
        name: newName.trim(),
        price_delta: newDelta,
        sort_order: group.options.length,
        is_active: true,
      });
      toast.success("تمت إضافة الاختيار بنجاح");
      setNewName("");
      setNewDelta(0);
      setShowAddOption(false);
      onChanged();
    } catch (e) {
      toast.error(errMessage(e));
    } finally {
      setSavingOption(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-muted p-3">
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold">{group.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {group.type === "single" ? "اختيار واحد" : "متعدد الاختيارات"}
            {group.min_selections > 0 ? " · مطلوب" : " · اختياري"}
            {group.type === "multiple" && group.max_selections !== null ? ` · حتى ${group.max_selections}` : ""}
            {!group.is_active ? " · معطلة" : ""}
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            aria-label={`تعديل ${group.name}`}
            onClick={() => setEditing(true)}
            className="grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-card"
          >
            <Pencil className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            aria-label={`حذف ${group.name}`}
            onClick={() => setConfirmDelete(true)}
            className="grid h-9 w-9 place-items-center rounded-xl text-destructive transition-colors hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
      <div className="mt-2 space-y-2">
        {group.options.map((option) => (
          <OptionRow key={option.id} option={option} onSaved={onChanged} onDeleted={onChanged} />
        ))}
      </div>
      {showAddOption ? (
        <div className="mt-2 flex items-center gap-2 rounded-xl bg-card p-2 shadow-soft">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="اسم الاختيار"
            aria-label="اسم الاختيار الجديد"
            className="h-10 min-w-0 flex-1 rounded-xl"
          />
          <PriceDeltaInput value={newDelta} onChange={setNewDelta} />
          <Button type="button" size="sm" onClick={addOption} disabled={savingOption} className="shrink-0 rounded-xl font-bold">
            {savingOption ? "..." : "إضافة"}
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddOption(true)}
          className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card text-sm font-bold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Plus className="h-4 w-4" aria-hidden />
          إضافة اختيار
        </button>
      )}
      <GroupDialog productId={productId} group={group} open={editing} onOpenChange={setEditing} onSaved={onChanged} />
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={`حذف «${group.name}»؟`}
        impact="سيتم حذف المجموعة وجميع الاختيارات المرتبطة بها نهائيًا."
        onConfirm={async () => {
          try {
            await deleteOptionGroup(group.id);
            toast.success("تم حذف المجموعة");
            onChanged();
            setConfirmDelete(false);
          } catch (e) {
            toast.error(errMessage(e));
          }
        }}
      />
    </div>
  );
}

export function NewOptionGroupButton({ productId, onChanged }: { productId: string; onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card text-sm font-bold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Plus className="h-4 w-4" aria-hidden />
        إضافة مجموعة
      </button>
      <GroupDialog productId={productId} group={null} open={open} onOpenChange={setOpen} onSaved={onChanged} />
    </>
  );
}

export function PricePreview({ base, picks }: { base: number; picks: { label: string; delta: number }[] }) {
  const total = base + picks.reduce((n, p) => n + p.delta, 0);
  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-sm" aria-label="معاينة السعر">
      <p className="text-xs font-bold text-muted-foreground">معاينة — للمساعدة فقط</p>
      <div className="mt-2 flex justify-between">
        <span>السعر الأساسي</span>
        <span className="font-bold">{base} جنيه</span>
      </div>
      {picks.map((p, i) => (
        <div key={i} className="mt-1 flex justify-between text-muted-foreground">
          <span>+ {p.label}</span>
          <span className="font-bold">+{p.delta} جنيه</span>
        </div>
      ))}
      <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-extrabold text-primary-dark">
        <span>الإجمالي</span>
        <span>{total} جنيه</span>
      </div>
    </div>
  );
}
