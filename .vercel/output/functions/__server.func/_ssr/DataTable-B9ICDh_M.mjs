import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { r as cn, t as Button } from "./button-Bg-fJMWs.mjs";
import { u as Search } from "../_libs/lucide-react.mjs";
import { i as Skeleton } from "./skeleton-OgoHEvYG.mjs";
import { t as Input } from "./input-DbL56wQ4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DataTable-B9ICDh_M.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var Table = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "relative w-full overflow-auto",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
		ref,
		className: cn("w-full caption-bottom text-sm", className),
		...props
	})
}));
Table.displayName = "Table";
var TableHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
	ref,
	className: cn("[&_tr]:border-b", className),
	...props
}));
TableHeader.displayName = "TableHeader";
var TableBody = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
	ref,
	className: cn("[&_tr:last-child]:border-0", className),
	...props
}));
TableBody.displayName = "TableBody";
var TableFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", {
	ref,
	className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
	...props
}));
TableFooter.displayName = "TableFooter";
var TableRow = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
	ref,
	className: cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className),
	...props
}));
TableRow.displayName = "TableRow";
var TableHead = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
	ref,
	className: cn("h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableHead.displayName = "TableHead";
var TableCell = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
	ref,
	className: cn("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableCell.displayName = "TableCell";
var TableCaption = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("caption", {
	ref,
	className: cn("mt-4 text-sm text-muted-foreground", className),
	...props
}));
TableCaption.displayName = "TableCaption";
function SearchInput({ value, onChange, placeholder = "بحث..." }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-w-0 flex-1 sm:max-w-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
			className: "absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			value,
			onChange: (e) => onChange(e.target.value),
			placeholder,
			"aria-label": placeholder,
			className: "h-11 rounded-xl pr-10"
		})]
	});
}
function StatusBadge({ active, activeLabel = "مفعل", inactiveLabel = "معطل" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		variant: active ? "default" : "secondary",
		className: "gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `h-1.5 w-1.5 rounded-full ${active ? "bg-primary-foreground" : "bg-muted-foreground"}`,
			"aria-hidden": true
		}), active ? activeLabel : inactiveLabel]
	});
}
/** Desktop table + automatic mobile card fallback. */
function DataTable({ columns, rows, rowKey, renderMobileCard, empty }) {
	if (rows.length === 0 && empty) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: empty });
	const keyOf = rowKey ?? ((row) => row.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "hidden overflow-hidden rounded-2xl border border-border bg-card md:block",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
			className: `text-start ${col.className ?? ""}`,
			children: col.header
		}, col.key)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
			className: `text-start ${col.className ?? ""}`,
			children: col.render(row)
		}, col.key)) }, keyOf(row))) })] })
	}), renderMobileCard && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3 md:hidden",
		children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
			children: renderMobileCard(row)
		}, keyOf(row)))
	})] });
}
function TableSkeleton({ rows = 5, cols = 4 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-2xl border border-border bg-card p-4",
		"aria-busy": "true",
		"aria-label": "جاري التحميل",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: Array.from({ length: rows }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-10 shrink-0 rounded-xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-2/3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-1/3" })]
					}),
					Array.from({ length: Math.max(cols - 2, 0) }).map((_, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "hidden h-8 w-20 sm:block" }, j))
				]
			}, i))
		})
	});
}
function EmptyState({ title, hint, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-dashed border-border bg-card p-8 text-center shadow-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-4xl",
				"aria-hidden": true,
				children: "🐝"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-extrabold",
				children: title
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-1 max-w-sm text-sm text-muted-foreground",
				children: hint
			}),
			action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex justify-center",
				children: action
			})
		]
	});
}
function ErrorState({ message = "حصل خطأ، حاول تاني.", onRetry }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-8 text-center shadow-soft",
		role: "alert",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-4xl",
				"aria-hidden": true,
				children: "🐝"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-bold",
				children: message
			}),
			onRetry && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				onClick: onRetry,
				className: "mt-4 h-12 rounded-xl px-6 font-bold",
				children: "حاول تاني"
			})
		]
	});
}
//#endregion
export { StatusBadge as a, SearchInput as i, EmptyState as n, TableSkeleton as o, ErrorState as r, DataTable as t };
