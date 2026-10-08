import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell, PageHeader } from "@/components/admin/AdminShell";
import { ErrorState } from "@/components/admin/DataTable";
import { FormSection } from "@/components/admin/dialogs";
import { Field } from "@/components/admin/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getServiceFeePercentAdmin, saveServiceFeePercent } from "@/lib/admin";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "الإعدادات | إدارة نحلة" }] }),
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const [percent, setPercent] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setFailed(false);
    try {
      setPercent(await getServiceFeePercentAdmin());
    } catch {
      setFailed(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    if (percent === null || !(percent >= 0) || percent > 100) {
      toast.error("النسبة يجب أن تكون بين 0 و 100");
      return;
    }
    setSaving(true);
    try {
      await saveServiceFeePercent(percent);
      toast.success("تم حفظ نسبة الخدمة بنجاح");
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "حصل خطأ، حاول تاني.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminGuard>
      <AdminShell title="الإعدادات">
        <PageHeader title="الإعدادات" description="إعدادات عامة للمتجر." />
        {failed ? (
          <ErrorState onRetry={load} />
        ) : percent === null ? (
          <Skeleton className="h-48 max-w-xl rounded-2xl" aria-label="جاري التحميل" />
        ) : (
          <div className="max-w-xl">
            <FormSection
              title="رسوم الخدمة"
              hint="نسبة مئوية تُضاف على إجمالي المنتجات في كل طلب وتظهر للعميل قبل التأكيد."
            >
              <Field id="service-fee" label="نسبة الخدمة (%)" required hint="صفر يعني بدون رسوم خدمة">
                <Input
                  id="service-fee"
                  type="number"
                  min={0}
                  max={100}
                  value={percent}
                  onChange={(e) => setPercent(Number(e.target.value))}
                  className="h-12 rounded-xl"
                  inputMode="decimal"
                />
              </Field>
              <div className="rounded-xl bg-muted p-3 text-sm">
                مثال: لو الإجمالي 200 جنيه والنسبة 10% → رسوم الخدمة 20 جنيه.
              </div>
              <Button type="button" onClick={save} disabled={saving} className="h-12 rounded-xl px-8 font-bold">
                {saving ? "جاري الحفظ..." : "حفظ"}
              </Button>
            </FormSection>
          </div>
        )}
      </AdminShell>
    </AdminGuard>
  );
}
