import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getManagerSession, signInManager } from "@/lib/admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/admin/forms";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "تسجيل الدخول | إدارة نحلة" }] }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getManagerSession().then((session) => {
      if (session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!email.trim()) next.email = "البريد الإلكتروني مطلوب";
    if (!password) next.password = "كلمة المرور مطلوبة";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSending(true);
    try {
      await signInManager(email.trim(), password);
      toast.success("تم تسجيل الدخول بنجاح");
      navigate({ to: "/admin", replace: true });
    } catch (error) {
      toast.error((error as { message?: string })?.message ?? "بيانات الدخول غير صحيحة.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4" dir="rtl">
      <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-card md:p-8">
        <div className="flex items-center gap-3">
          <img src="/favicon.png" alt="نحلة" className="h-12 w-12 rounded-2xl object-cover" />
          <div>
            <h1 className="text-xl font-extrabold text-primary-dark">إدارة نحلة</h1>
            <p className="text-sm text-muted-foreground">تسجيل دخول المديرين فقط</p>
          </div>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4" noValidate={false}>
          <Field id="login-email" label="البريد الإلكتروني" required error={errors.email}>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="h-12 rounded-xl"
              dir="ltr"
            />
          </Field>
          <Field id="login-password" label="كلمة المرور" required error={errors.password}>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 rounded-xl pl-16"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-primary-dark hover:underline"
              >
                {showPassword ? "إخفاء" : "عرض"}
              </button>
            </div>
          </Field>
          <Button type="submit" disabled={sending} className="h-13 w-full rounded-xl py-3.5 text-base font-extrabold">
            {sending ? "جاري الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>
        <Link to="/" className="mt-4 block text-center text-sm font-bold text-primary-dark hover:underline">
          العودة للمتجر
        </Link>
      </div>
    </div>
  );
}
