import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { k as uploadImage, r as cn } from "./button-Bg-fJMWs.mjs";
import { S as ImagePlus, v as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forms-D1V1pCkc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Root.displayName;
function Field({ id, label, required, hint, error, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
			htmlFor: id,
			className: "mb-1.5 block text-sm font-bold",
			children: [label, required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-destructive",
				"aria-hidden": true,
				children: " *"
			})]
		}),
		children,
		hint && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs text-muted-foreground",
			children: hint
		}),
		error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			id: `${id}-error`,
			role: "alert",
			className: "mt-1 text-xs font-semibold text-destructive",
			children: error
		})
	] });
}
/** Upload-then-save image field: failed uploads block the save with retry. */
function ImageUploader({ id, prefix, value, onChange, error }) {
	const inputRef = (0, import_react.useRef)(null);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [uploadError, setUploadError] = (0, import_react.useState)(null);
	async function handleFile(file) {
		if (!file) return;
		setUploading(true);
		setUploadError(null);
		try {
			onChange(await uploadImage(prefix, file));
		} catch {
			setUploadError("تعذر رفع الصورة. حاول تاني.");
		} finally {
			setUploading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => inputRef.current?.click(),
				disabled: uploading,
				className: "grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-dashed border-border bg-muted text-muted-foreground transition-colors hover:border-primary disabled:opacity-60",
				"aria-label": value ? "تغيير الصورة" : "رفع صورة",
				children: uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
					className: "h-6 w-6 animate-spin",
					"aria-hidden": true
				}) : value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: value,
					alt: "",
					className: "h-full w-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, {
					className: "h-6 w-6",
					"aria-hidden": true
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1 text-xs text-muted-foreground",
				children: [uploading ? "جاري الرفع..." : value ? "تم الرفع. اضغط على الصورة لتغييرها." : "اضغط لرفع صورة.", value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onChange(null),
					className: "mt-1 block font-bold text-destructive hover:underline",
					children: "إزالة الصورة"
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			ref: inputRef,
			id,
			type: "file",
			accept: "image/*",
			className: "sr-only",
			"aria-describedby": uploadError || error ? `${id}-error` : void 0,
			onChange: (e) => {
				handleFile(e.target.files?.[0]);
				e.target.value = "";
			}
		}),
		(uploadError || error) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			id: `${id}-error`,
			role: "alert",
			className: "mt-1 text-xs font-semibold text-destructive",
			children: uploadError ?? error
		})
	] });
}
//#endregion
export { ImageUploader as n, Label as r, Field as t };
