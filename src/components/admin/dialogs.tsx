import { useState, type ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/** Two-step destructive confirmation with truthful impact text. */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  impact,
  confirmLabel = "تأكيد الحذف",
  onConfirm,
  pending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  impact: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
  pending?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const working = busy || pending;

  async function handleConfirm() {
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(next) => { if (!working) onOpenChange(next); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{impact}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse gap-2">
          <AlertDialogCancel disabled={working}>تراجع</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={working}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {working ? "جاري الحذف..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function FormSection({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-soft md:p-5" aria-label={title}>
      <div>
        <h3 className="text-base font-extrabold text-primary-dark">{title}</h3>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
