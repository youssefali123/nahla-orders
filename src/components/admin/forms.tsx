import { useState, type ReactNode } from "react";
import { ImagePlus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ImageUrlDialog } from "@/components/admin/ImageUrlDialog";

export { ImageUrlDialog } from "@/components/admin/ImageUrlDialog";

export function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string | undefined;
  error?: string | null | undefined;
  children: ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id} className="mb-1.5 block text-sm font-bold">
        {label}
        {required && (
          <span className="text-destructive" aria-hidden>
            {" *"}
          </span>
        )}
      </Label>
      {children}
      {hint && !error && (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 text-xs font-semibold text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}

/** Image field that opens a dialog to enter the image URL as text. */
export function ImageUploader({
  id,
  prefix: _prefix,
  value,
  onChange,
  error,
}: {
  id: string;
  prefix?: "categories" | "subcategories" | "products" | "banners" | "options";
  value: string | null;
  onChange: (url: string | null) => void;
  error?: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center gap-3">
        <button
          id={id}
          type="button"
          onClick={() => setOpen(true)}
          className="grid h-20 w-20 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-2xl border border-dashed border-border bg-muted text-muted-foreground transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={value ? "تعديل رابط الصورة" : "إضافة رابط الصورة"}
          title={value ? "اضغط لتعديل رابط الصورة" : "اضغط لإدخال رابط الصورة"}
        >
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-6 w-6" aria-hidden />
          )}
        </button>
        <div className="min-w-0 flex-1 text-xs text-muted-foreground">
          {value
            ? "تم تحديد الصورة. اضغط على الصورة لتعديل الرابط."
            : "اضغط لإدخال رابط الصورة (URL)."}
          {value && (
            <div className="mt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="font-bold text-primary hover:underline cursor-pointer"
              >
                تعديل الرابط
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => onChange(null)}
                className="font-bold text-destructive hover:underline cursor-pointer"
              >
                إزالة الصورة
              </button>
            </div>
          )}
        </div>
      </div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 text-xs font-semibold text-destructive"
        >
          {error}
        </p>
      )}

      <ImageUrlDialog
        open={open}
        onOpenChange={setOpen}
        value={value}
        onSave={(url) => onChange(url)}
      />
    </div>
  );
}
