import { useEffect, useState } from "react";
import {
  Link2,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ImageUrlDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value?: string | null;
  onSave: (url: string | null) => void;
  title?: string;
  description?: string;
}

export function ImageUrlDialog({
  open,
  onOpenChange,
  value,
  onSave,
  title,
  description,
}: ImageUrlDialogProps) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "loaded" | "error">(
    "idle",
  );

  useEffect(() => {
    if (open) {
      const initial = value ?? "";
      setUrl(initial);
      setStatus(initial.trim() ? "loading" : "idle");
    }
  }, [open, value]);

  const trimmed = url.trim();

  function handleUrlChange(next: string) {
    setUrl(next);
    if (next.trim()) {
      setStatus("loading");
    } else {
      setStatus("idle");
    }
  }

  function handleConfirm() {
    if (!trimmed) {
      onSave(null);
    } else {
      onSave(trimmed);
    }
    onOpenChange(false);
  }

  function handleRemove() {
    onSave(null);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl" dir="rtl">
        <DialogHeader className="text-right sm:text-right">
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <Link2 className="h-5 w-5 text-primary" />
            {title ?? (value ? "تعديل رابط الصورة" : "إضافة رابط الصورة")}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {description ??
              "أدخل رابط الصورة (URL) مباشرة ليتم عرضها في التطبيق."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (trimmed) handleConfirm();
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="image-url-input" className="text-xs font-bold">
              رابط الصورة (URL)
            </Label>
            <Input
              id="image-url-input"
              type="text"
              dir="ltr"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="h-11 rounded-xl text-left font-mono text-xs placeholder:text-muted-foreground/60"
              autoFocus
            />
            <p className="text-[11px] text-muted-foreground">
              يمكنك نسخ رابط أي صورة من الإنترنت أو خدمة استضافة ولصقه هنا.
            </p>
          </div>

          {trimmed ? (
            <div className="space-y-1.5">
              <span className="block text-xs font-bold text-muted-foreground">
                معاينة الصورة
              </span>
              <div className="relative flex min-h-[140px] max-h-[220px] items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/30 p-2">
                <img
                  key={trimmed}
                  src={trimmed}
                  alt="معاينة الصورة"
                  className={cn(
                    "max-h-[200px] w-auto max-w-full rounded-lg object-contain transition-opacity duration-200",
                    status === "loading" && "opacity-30",
                    status === "error" && "hidden",
                  )}
                  onLoad={() => setStatus("loaded")}
                  onError={() => setStatus("error")}
                />
                {status === "loading" && (
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/40 text-xs text-muted-foreground backdrop-blur-[1px]">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>جاري التحقق من الصورة...</span>
                  </div>
                )}
                {status === "error" && (
                  <div className="flex flex-col items-center justify-center p-3 text-center text-xs text-destructive">
                    <AlertCircle className="mb-1 h-5 w-5" />
                    <span className="font-semibold">
                      تعذر تحميل الصورة من هذا الرابط
                    </span>
                    <span className="mt-0.5 text-[11px] text-muted-foreground">
                      تأكد أن الرابط يعمل ومباشر للملف (jpg, png, webp...)
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-24 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 text-muted-foreground">
              <ImageIcon className="mb-1 h-6 w-6 opacity-40" />
              <span className="text-xs">
                ضع رابط الصورة بالأعلى لمعاينتها هنا
              </span>
            </div>
          )}

          <DialogFooter className="flex-row-reverse justify-between gap-2 pt-2 sm:justify-between">
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                disabled={!trimmed}
                className="h-10 rounded-xl px-5 font-bold"
              >
                حفظ الرابط
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-10 rounded-xl"
              >
                إلغاء
              </Button>
            </div>
            {value && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleRemove}
                className="h-10 gap-1.5 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="text-xs font-semibold">مسح الصورة</span>
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
