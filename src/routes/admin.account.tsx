import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, User } from "lucide-react";
// import { toast } from "react-hot-toast";
import { toast } from "react-hot-toast";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell, PageHeader } from "@/components/admin/AdminShell";
import { getManagerSession, signOutManager } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/admin/account")({
  head: () => ({ meta: [{ title: "الحساب الشخصي | إدارة نحلة" }] }),
  component: AdminAccountPage,
});

function AdminAccountPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    getManagerSession().then((session) => setEmail(session?.user.email ?? null));
  }, []);

  async function logout() {
    await signOutManager();
    toast.success("تم تسجيل الخروج");
    navigate({ to: "/admin/login", replace: true });
  }

  return (
    <AdminGuard>
      <AdminShell title="الحساب الشخصي">
        <PageHeader title="الحساب الشخصي" description="بيانات حساب المدير الحالي." />
        <div className="max-w-xl rounded-2xl border border-border bg-card p-4 shadow-soft md:p-5">
          {email === null ? (
            <Skeleton className="h-16 rounded-xl" aria-label="جاري التحميل" />
          ) : (
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary-dark" aria-hidden>
                <User className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                <p className="truncate font-extrabold" dir="ltr">
                  {email}
                </p>
              </div>
            </div>
          )}
          <Button type="button" variant="outline" onClick={logout} className="mt-4 h-12 w-full gap-2 rounded-xl font-bold text-destructive">
            <LogOut className="h-4 w-4" aria-hidden />
            تسجيل الخروج
          </Button>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
