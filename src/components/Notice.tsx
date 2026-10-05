import { AlertTriangle } from "lucide-react";

export function Notice({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-2xl bg-accent/25 p-3 text-sm font-semibold text-accent-foreground">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-primary-dark" />
      <p>{text}</p>
    </div>
  );
}
