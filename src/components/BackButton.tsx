import { useRouter } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.history.back()}
      aria-label="رجوع"
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-card shadow-soft transition-all active:scale-90"
    >
      <ArrowRight className="h-5 w-5" />
    </button>
  );
}
