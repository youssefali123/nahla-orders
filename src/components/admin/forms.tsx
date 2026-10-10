import { useRef, useState, type ReactNode } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadImage } from "@/lib/admin";

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
      {hint && !error && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs font-semibold text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/** Upload-then-save image field: failed uploads block the save with retry. */
export function ImageUploader({
  id,
  prefix,
  value,
  onChange,
  error,
}: {
  id: string;
  prefix: "categories" | "subcategories" | "products" | "banners" | "options";
  value: string | null;
  onChange: (url: string | null) => void;
  error?: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploadImage(prefix, file);
      onChange(url);
    } catch {
      setUploadError("تعذر رفع الصورة. حاول تاني.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-dashed border-border bg-muted text-muted-foreground transition-colors hover:border-primary disabled:opacity-60"
          aria-label={value ? "تغيير الصورة" : "رفع صورة"}
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
          ) : value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-6 w-6" aria-hidden />
          )}
        </button>
        <div className="min-w-0 flex-1 text-xs text-muted-foreground">
          {uploading ? "جاري الرفع..." : value ? "تم الرفع. اضغط على الصورة لتغييرها." : "اضغط لرفع صورة."}
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="mt-1 block font-bold text-destructive hover:underline"
            >
              إزالة الصورة
            </button>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-describedby={uploadError || error ? `${id}-error` : undefined}
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {(uploadError || error) && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs font-semibold text-destructive">
          {uploadError ?? error}
        </p>
      )}
    </div>
  );
}
