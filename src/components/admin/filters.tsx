import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  deleteFilter,
  listFiltersAdmin,
  saveFilter,
  type AdminError,
  type FilterParentKind,
} from "@/lib/admin";
import type { DisplayFilter } from "@/lib/catalog";
import { ConfirmDialog } from "./dialogs";

function errMessage(error: unknown): string {
  return (error as AdminError)?.message ?? "حصل خطأ، حاول تاني.";
}

/** Inline CRUD for one section's display-filter values. */
export function FilterValuesManager({ kind, parentId }: { kind: FilterParentKind; parentId: string }) {
  const [rows, setRows] = useState<DisplayFilter[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, { name: string; sort: number; active: boolean }>>({});
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<DisplayFilter | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setFailed(false);
    try {
      setRows(await listFiltersAdmin(kind, parentId));
    } catch {
      setFailed(true);
    }
  }, [kind, parentId]);

  useEffect(() => {
    load();
  }, [load]);

  function draftOf(row: DisplayFilter) {
    return drafts[row.id] ?? { name: row.name, sort: row.sort_order, active: row.is_active };
  }

  async function persist(id: string | null, values: { name: string; sort: number; active: boolean }) {
    if (!values.name.trim()) {
      toast.error("اسم الفلتر مطلوب");
      return;
    }
    if (id) setSavingId(id);
    else setAdding(true);
    try {
      await saveFilter(kind, parentId, id, {
        name: values.name.trim(),
        sort_order: values.sort,
        is_active: values.active,
      });
      toast.success(id ? "تم حفظ الفلتر بنجاح" : "تمت إضافة الفلتر بنجاح");
      setDrafts((d) => {
        const next = { ...d };
        if (id) delete next[id];
        return next;
      });
      setEditingId(null);
      setNewName("");
      load();
    } catch (e) {
      toast.error(errMessage(e));
    } finally {
      setSavingId(null);
      setAdding(false);
    }
  }

  if (failed) {
    return (
      <div className="rounded-xl bg-muted p-3 text-center text-sm">
        <p className="font-bold">حصل خطأ، حاول تاني.</p>
        <Button type="button" variant="outline" size="sm" onClick={load} className="mt-2 rounded-xl font-bold">
          حاول تاني
        </Button>
      </div>
    );
  }

  if (rows === null) {
    return (
      <div className="space-y-2" aria-busy="true" aria-label="جاري التحميل">
        <div className="h-11 animate-pulse rounded-xl bg-muted" />
        <div className="h-11 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {rows.length === 0 && (
        <p className="rounded-xl bg-muted p-3 text-center text-xs font-bold text-muted-foreground">
          لا توجد قيم بعد. أضف أول قيمة مثل: سوائل، مساحيق.
        </p>
      )}
      {rows.map((row) => {
        const active = row.is_active;
        const isEditing = editingId === row.id;
        const draft = draftOf(row);
        const dirty =
          draft.name.trim() !== row.name || draft.sort !== row.sort_order || draft.active !== active;
        return (
          <div key={row.id} className="rounded-xl bg-card p-2 shadow-soft">
            <div className="flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate text-sm font-extrabold">{row.name}</span>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${active ? "bg-primary/15 text-primary-dark" : "bg-muted text-muted-foreground"}`}>
                {active ? "مفعل" : "معطل"}
              </span>
              <button
                type="button"
                aria-label={`تعديل ${row.name}`}
                onClick={() => setEditingId(isEditing ? null : row.id)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors hover:bg-muted"
              >
                <Pencil className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                aria-label={`حذف ${row.name}`}
                onClick={() => setDeleting(row)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-destructive transition-colors hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
            {isEditing && (
              <div className="mt-2 space-y-2 border-t border-border pt-2">
                <Input
                  value={draft.name}
                  onChange={(e) => setDrafts((d) => ({ ...d, [row.id]: { ...draftOf(row), name: e.target.value } }))}
                  className="h-10 rounded-xl"
                  aria-label="اسم الفلتر"
                />
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={draft.sort}
                    onChange={(e) =>
                      setDrafts((d) => ({ ...d, [row.id]: { ...draftOf(row), sort: Number(e.target.value) } }))
                    }
                    className="h-10 w-24 rounded-xl"
                    aria-label="الترتيب"
                    inputMode="numeric"
                  />
                  <button
                    type="button"
                    role="switch"
                    aria-checked={draft.active}
                    aria-label="حالة الفلتر"
                    onClick={() => setDrafts((d) => ({ ...d, [row.id]: { ...draftOf(row), active: !draft.active } }))}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${draft.active ? "bg-primary" : "bg-muted"}`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${draft.active ? "right-0.5" : "left-0.5"}`}
                      aria-hidden
                    />
                  </button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={!dirty || savingId === row.id}
                    onClick={() => persist(row.id, draft)}
                    className="rounded-xl font-bold"
                  >
                    {savingId === row.id ? "حفظ..." : "حفظ"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div className="flex items-center gap-2 rounded-xl bg-card p-2 shadow-soft">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="قيمة جديدة (مثال: سوائل)"
          aria-label="اسم الفلتر الجديد"
          className="h-10 min-w-0 flex-1 rounded-xl"
        />
        <Button
          type="button"
          size="sm"
          disabled={adding || !newName.trim()}
          onClick={() => persist(null, { name: newName, sort: rows.length, active: true })}
          className="shrink-0 gap-1 rounded-xl font-bold"
        >
          <Plus className="h-4 w-4" aria-hidden />
          {adding ? "..." : "إضافة"}
        </Button>
      </div>
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`حذف «${deleting?.name}»؟`}
        impact="سيتم حذف الفلتر نهائيًا. المنتجات المرتبطة به ستفقد ارتباطها فقط ولن تُحذف."
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await deleteFilter(deleting.id);
            toast.success("تم حذف الفلتر");
            setDeleting(null);
            load();
          } catch (e) {
            toast.error(errMessage(e));
          }
        }}
      />
    </div>
  );
}
