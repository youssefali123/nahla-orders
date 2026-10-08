import { r as __toESM } from "../_runtime.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as deleteProduct, h as listSubcategoriesAdmin, m as listProductsAdmin, p as listCategoriesAdmin, t as Button, x as saveProduct } from "./button-B0qzXPB4.mjs";
import { S as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as Plus, f as Pencil, i as Trash2, u as Power } from "../_libs/lucide-react.mjs";
import { n as AdminShell, t as AdminGuard } from "./AdminShell-JKfXsZUA.mjs";
import { n } from "../_libs/react-hot-toast.mjs";
import { a as StatusBadge, i as SearchInput, n as EmptyState, o as TableSkeleton, r as ErrorState, t as DataTable } from "./DataTable-DIKUwHNX.mjs";
import { t as ConfirmDialog } from "./dialogs-DeG17a-H.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.products-bANi4TFX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminProductsPage() {
	const navigate = useNavigate();
	const [rows, setRows] = (0, import_react.useState)(null);
	const [categories, setCategories] = (0, import_react.useState)([]);
	const [subcategories, setSubcategories] = (0, import_react.useState)([]);
	const [failed, setFailed] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const [catFilter, setCatFilter] = (0, import_react.useState)("all");
	const [subFilter, setSubFilter] = (0, import_react.useState)("all");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [deleting, setDeleting] = (0, import_react.useState)(null);
	const load = (0, import_react.useCallback)(async () => {
		setFailed(false);
		try {
			const [products, cats, subs] = await Promise.all([
				listProductsAdmin(),
				listCategoriesAdmin(),
				listSubcategoriesAdmin()
			]);
			setRows(products);
			setCategories(cats);
			setSubcategories(subs);
		} catch {
			setFailed(true);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	const catName = (0, import_react.useCallback)((id) => categories.find((c) => c.id === id)?.name ?? "—", [categories]);
	(0, import_react.useCallback)((id) => id ? subcategories.find((s) => s.id === id)?.name ?? "—" : "—", [subcategories]);
	const filtered = (0, import_react.useMemo)(() => (rows ?? []).filter((p) => (catFilter === "all" || p.category_id === catFilter) && (subFilter === "all" || p.subcategory_id === subFilter) && (statusFilter === "all" || statusFilter === "active" === p.is_active) && p.name.includes(query.trim())), [
		rows,
		query,
		catFilter,
		subFilter,
		statusFilter
	]);
	async function toggle(row) {
		try {
			await saveProduct(row.id, {
				category_id: row.category_id,
				subcategory_id: row.subcategory_id,
				name: row.name,
				price: Number(row.price),
				icon: row.icon,
				image_url: row.image_url,
				description: row.description,
				unit: row.unit,
				sort_order: row.sort_order,
				is_active: !row.is_active,
				is_featured: row.is_featured
			});
			n.success(row.is_active ? "تم تعطيل المنتج" : "تم تفعيل المنتج");
			load();
		} catch (e) {
			n.error(e?.message ?? "حصل خطأ، حاول تاني.");
		}
	}
	function edit(id) {
		navigate({
			to: "/admin/product-editor",
			search: { id }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminGuard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "المنتجات",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			type: "button",
			onClick: () => navigate({
				to: "/admin/product-editor",
				search: { id: null }
			}),
			className: "h-11 gap-2 rounded-xl font-bold",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
				className: "h-4 w-4",
				"aria-hidden": true
			}), "إضافة منتج"]
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchInput, {
						value: query,
						onChange: setQuery,
						placeholder: "بحث عن منتج..."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: catFilter,
						onValueChange: (v) => {
							setCatFilter(v);
							setSubFilter("all");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-11 w-full rounded-xl sm:w-44",
							"aria-label": "تصفية بالتصنيف",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "التصنيف" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "كل التصنيفات"
						}), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: c.id,
							children: c.name
						}, c.id))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: subFilter,
						onValueChange: setSubFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-11 w-full rounded-xl sm:w-44",
							"aria-label": "تصفية بالتصنيف الفرعي",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "الفرعي" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "كل الفروع"
						}), subcategories.filter((s) => catFilter === "all" || s.category_id === catFilter).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s.id,
							children: s.name
						}, s.id))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: statusFilter,
						onValueChange: setStatusFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-11 w-full rounded-xl sm:w-36",
							"aria-label": "تصفية بالحالة",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "الحالة" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "الكل"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "active",
								children: "مفعل"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "inactive",
								children: "معطل"
							})
						] })]
					})
				]
			}),
			failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { onRetry: load }) : rows === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableSkeleton, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				rows: filtered,
				columns: [
					{
						key: "product",
						header: "المنتج",
						render: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-muted text-xl",
								"aria-hidden": true,
								children: p.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: p.image_url,
									alt: "",
									className: "h-full w-full object-cover",
									loading: "lazy"
								}) : p.icon ?? "🐝"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-bold",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs text-muted-foreground",
								children: catName(p.category_id)
							})] })]
						})
					},
					{
						key: "price",
						header: "السعر",
						render: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-extrabold text-primary-dark",
							children: [Number(p.price), " جنيه"]
						})
					},
					{
						key: "status",
						header: "الحالة",
						render: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { active: p.is_active })
					},
					{
						key: "actions",
						header: "الإجراءات",
						render: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": `تعديل ${p.name}`,
									onClick: () => edit(p.id),
									className: "grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
										className: "h-4 w-4",
										"aria-hidden": true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": p.is_active ? `تعطيل ${p.name}` : `تفعيل ${p.name}`,
									onClick: () => toggle(p),
									className: "grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, {
										className: "h-4 w-4",
										"aria-hidden": true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": `حذف ${p.name}`,
									onClick: () => setDeleting(p),
									className: "grid h-9 w-9 place-items-center rounded-xl text-destructive transition-colors hover:bg-destructive/10",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
										className: "h-4 w-4",
										"aria-hidden": true
									})
								})
							]
						})
					}
				],
				renderMobileCard: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-muted text-2xl",
								"aria-hidden": true,
								children: p.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: p.image_url,
									alt: "",
									className: "h-full w-full object-cover"
								}) : p.icon ?? "🐝"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-extrabold",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										catName(p.category_id),
										" · ",
										Number(p.price),
										" جنيه"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { active: p.is_active })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 border-t border-border pt-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => edit(p.id),
								className: "flex-1 rounded-xl font-bold",
								children: "تعديل"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => toggle(p),
								className: "flex-1 rounded-xl font-bold",
								children: p.is_active ? "تعطيل" : "تفعيل"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => setDeleting(p),
								className: "flex-1 rounded-xl font-bold text-destructive",
								children: "حذف"
							})
						]
					})]
				}),
				empty: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "لا توجد منتجات",
					hint: "ابدأ بإضافة أول منتج إلى الكتالوج.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						onClick: () => navigate({
							to: "/admin/product-editor",
							search: { id: null }
						}),
						className: "h-12 gap-2 rounded-xl font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
							className: "h-4 w-4",
							"aria-hidden": true
						}), "إضافة منتج"]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: deleting !== null,
				onOpenChange: (open) => !open && setDeleting(null),
				title: `حذف «${deleting?.name}»؟`,
				impact: "سيتم حذف المنتج وجميع مجموعات الخيارات والاختيارات المرتبطة به نهائيًا.",
				onConfirm: async () => {
					if (!deleting) return;
					try {
						await deleteProduct(deleting.id);
						n.success("تم حذف المنتج");
						setDeleting(null);
						load();
					} catch (e) {
						n.error(e?.message ?? "حصل خطأ، حاول تاني.");
					}
				}
			})
		]
	}) });
}
//#endregion
export { AdminProductsPage as component };
