import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { getManagerSession, onManagerAuthChange, type AdminError } from "@/lib/admin";
import type { User } from "@supabase/supabase-js";

/**
 * Display-only gate: renders children solely for verified managers.
 * Real enforcement stays in RLS; this only controls what is shown.
 */
export function AdminGuard({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ checked: boolean; user: User | null; error: AdminError | null }>({
    checked: false,
    user: null,
    error: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    getManagerSession()
      .then((session) => {
        if (!cancelled) setState({ checked: true, user: session?.user ?? null, error: null });
      })
      .catch((error) => {
        if (!cancelled)
          setState({
            checked: true,
            user: null,
            error: { message: "حصل خطأ، حاول تاني.", cause: error },
          });
      });
    let unsubscribe: (() => void) | undefined;
    onManagerAuthChange((session) => {
      if (!cancelled) setState({ checked: true, user: session?.user ?? null, error: null });
    }).then((unsub) => {
      unsubscribe = unsub;
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (state.checked && !state.user && !state.error) {
      navigate({ to: "/admin/login", replace: true });
    }
  }, [state, navigate]);

  if (!state.checked) {
    return (
      <div className="grid min-h-screen place-items-center bg-background" aria-busy="true" aria-label="جاري التحميل">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-primary" />
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="mx-auto grid min-h-screen max-w-md place-items-center bg-background px-4">
        <div className="w-full rounded-2xl bg-card p-8 text-center shadow-soft">
          <p className="text-4xl">🐝</p>
          <p className="mt-3 font-bold">{state.error.message}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground"
          >
            حاول تاني
          </button>
        </div>
      </div>
    );
  }

  if (!state.user) {
    return (
      <div className="mx-auto grid min-h-screen max-w-md place-items-center bg-background px-4">
        <div className="w-full rounded-2xl bg-card p-8 text-center shadow-soft">
          <ShieldAlert className="mx-auto h-10 w-10 text-destructive" aria-hidden />
          <h1 className="mt-3 text-xl font-extrabold">غير مصرح لك بالدخول</h1>
          <p className="mt-2 text-sm text-muted-foreground">هذه المنطقة مخصصة لمديري نحلة فقط.</p>
          <div className="mt-6 flex flex-col gap-2">
            <Link
              to="/admin/login"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground"
            >
              تسجيل الدخول
            </Link>
            <Link
              to="/"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border px-6 text-sm font-bold"
            >
              العودة للمتجر
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
