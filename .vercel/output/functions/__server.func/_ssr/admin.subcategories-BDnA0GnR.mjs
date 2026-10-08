import { r as __toESM } from "../_runtime.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as saveSubcategory, h as listSubcategoriesAdmin, l as deleteSubcategory, p as listCategoriesAdmin, t as Button } from "./button-B0qzXPB4.mjs";
import { d as Plus, f as Pencil, i as Trash2, u as Power } from "../_libs/lucide-react.mjs";
import { n as AdminShell, t as AdminGuard } from "./AdminShell-JKfXsZUA.mjs";
import { n } from "../_libs/react-hot-toast.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { a as StatusBadge, i as SearchInput, n as EmptyState, o as TableSkeleton, r as ErrorState, t as DataTable } from "./DataTable-DIKUwHNX.mjs";
import { t as ConfirmDialog } from "./dialogs-DeG17a-H.mjs";
import { n as ImageUploader, t as Field } from "./forms-DZ9oyO3O.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as Switch, r as DialogFooter, t as Dialog } from "./switch--xCqLQN7.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.subcategories-BDnA0GnR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY_FORM = {
	category_id: "",
	name: "",
	icon: "",
	image_url: null,
	sort_order: 0,
	is_active: true,
	requires_preorder: false
};
function AdminSubcategoriesPage() {
	const [rows, setRows] = (0, import_react.useState)(null);
	const [categories, setCategories] = (0, import_react.useState)([]);
	const [failed, setFailed] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const [parentFilter, setParentFilter] = (0, import_react.useState)("all");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [deleting, setDeleting] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const load = (0, import_react.useCallback)(async () => {
		setFailed(false);
		try {
			const [subs, cats] = await Promise.all([listSubcategoriesAdmin(), listCategoriesAdmin()]);
			setRows(subs);
			setCategories(cats);
		} catch {
			setFailed(true);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	const parentName = (0, import_react.useCallback)((id) => categories.find((c) => c.id === id)?.name ?? "—", [categories]);
	const filtered = (0, import_react.useMemo)(() => (rows ?? []).filter((s) => (parentFilter === "all" || s.category_id === parentFilter) && s.name.includes(query.trim())), [
		rows,
		query,
		parentFilter
	]);
	function openCreate() {
		setEditing({
			id: null,
			form: {
				...EMPTY_FORM,
				category_id: parentFilter !== "all" ? parentFilter : ""
			}
		});
	}
	function openEdit(row) {
		setEditing({
			id: row.id,
			form: {
				category_id: row.category_id,
				name: row.name,
				icon: row.icon ?? "",
				image_url: row.image_url,
				sort_order: row.sort_order,
				is_active: row.is_active,
				requires_preorder: row.requires_preorder
			}
		});
	}
	async function save() {
		if (!editing) return;
		if (!editing.form.category_id) {
			n.error("اختار التصنيف الرئيسي");
			return;
		}
		if (!editing.form.name.trim()) {
			n.error("اسم التصنيف الفرعي مطلوب");
			return;
		}
		setSaving(true);
		try {
			await saveSubcategory(editing.id, {
				...editing.form,
				name: editing.form.name.trim()
			});
			n.success(editing.id ? "تم حفظ التصنيف الفرعي بنجاح" : "تمت إضافة التصنيف الفرعي بنجاح");
			setEditing(null);
			load();
		} catch (e) {
			n.error(e?.message ?? "حصل خطأ، حاول تاني.");
		} finally {
			setSaving(false);
		}
	}
	async function toggle(row) {
		try {
			await saveSubcategory(row.id, {
				category_id: row.category_id,
				name: row.name,
				icon: row.icon,
				image_url: row.image_url,
				sort_order: row.sort_order,
				is_active: !row.is_active,
				requires_preorder: row.requires_preorder
			});
			n.success(row.is_active ? "تم تعطيل التصنيف الفرعي" : "تم تفعيل التصنيف الفرعي");
			load();
		} catch (e) {
			n.error(e?.message ?? "حصل خطأ، حاول تاني.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminGuard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "التصنيفات الفرعية",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			type: "button",
			onClick: openCreate,
			className: "h-11 gap-2 rounded-xl font-bold",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
				className: "h-4 w-4",
				"aria-hidden": true
			}), "إضافة تصنيف فرعي"]
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchInput, {
					value: query,
					onChange: setQuery,
					placeholder: "بحث..."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: parentFilter,
					onValueChange: setParentFilter,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "h-11 w-full rounded-xl sm:w-56",
						"aria-label": "تصفية بالتصنيف",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "كل التصنيفات" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "all",
						children: "كل التصنيفات"
					}), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: c.id,
						children: c.name
					}, c.id))] })]
				})]
			}),
			failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { onRetry: load }) : rows === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableSkeleton, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				rows: filtered,
				columns: [
					{
						key: "name",
						header: "التصنيف الفرعي",
						render: (s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-muted text-xl",
								"aria-hidden": true,
								children: s.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: s.image_url,
									alt: "",
									className: "h-full w-full object-cover"
								}) : s.icon ?? "🐝"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-bold",
								children: s.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs text-muted-foreground",
								children: parentName(s.category_id)
							})] })]
						})
					},
					{
						key: "preorder",
						header: "طلب مسبق",
						render: (s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-muted px-2.5 py-1 text-xs font-bold",
							children: s.requires_preorder ? "قبلها بيوم" : "فوري"
						})
					},
					{
						key: "order",
						header: "الترتيب",
						render: (s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold",
							children: s.sort_order
						})
					},
					{
						key: "status",
						header: "الحالة",
						render: (s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { active: s.is_active })
					},
					{
						key: "actions",
						header: "الإجراءات",
						render: (s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": `تعديل ${s.name}`,
									onClick: () => openEdit(s),
									className: "grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
										className: "h-4 w-4",
										"aria-hidden": true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": s.is_active ? `تعطيل ${s.name}` : `تفعيل ${s.name}`,
									onClick: () => toggle(s),
									className: "grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, {
										className: "h-4 w-4",
										"aria-hidden": true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": `حذف ${s.name}`,
									onClick: () => setDeleting(s),
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
				renderMobileCard: (s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-muted text-2xl",
								"aria-hidden": true,
								children: s.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: s.image_url,
									alt: "",
									className: "h-full w-full object-cover"
								}) : s.icon ?? "🐝"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-extrabold",
									children: s.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										parentName(s.category_id),
										" · ",
										s.requires_preorder ? "طلب مسبق" : "فوري"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { active: s.is_active })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 border-t border-border pt-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => openEdit(s),
								className: "flex-1 rounded-xl font-bold",
								children: "تعديل"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => toggle(s),
								className: "flex-1 rounded-xl font-bold",
								children: s.is_active ? "تعطيل" : "تفعيل"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => setDeleting(s),
								className: "flex-1 rounded-xl font-bold text-destructive",
								children: "حذف"
							})
						]
					})]
				}),
				empty: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "لا توجد تصنيفات فرعية",
					hint: "أضف أول تصنيف فرعي تحت تصنيف رئيسي.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						onClick: openCreate,
						className: "h-12 gap-2 rounded-xl font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
							className: "h-4 w-4",
							"aria-hidden": true
						}), "إضافة تصنيف فرعي"]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: editing !== null,
				onOpenChange: (open) => !open && setEditing(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-h-[90vh] overflow-y-auto rounded-2xl",
					"aria-label": "تصنيف فرعي",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing?.id ? "تعديل التصنيف الفرعي" : "تصنيف فرعي جديد" }) }),
						editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									id: "sub-parent",
									label: "التصنيف الرئيسي",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: editing.form.category_id,
										onValueChange: (v) => setEditing({
											...editing,
											form: {
												...editing.form,
												category_id: v
											}
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "sub-parent",
											className: "h-12 rounded-xl",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "اختار التصنيف" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: c.id,
											children: c.name
										}, c.id)) })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									id: "sub-name",
									label: "الاسم",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "sub-name",
										value: editing.form.name,
										onChange: (e) => setEditing({
											...editing,
											form: {
												...editing.form,
												name: e.target.value
											}
										}),
										className: "h-12 rounded-xl",
										placeholder: "مثال: مشاوي"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										id: "sub-icon",
										label: "الأيقونة",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "sub-icon",
											value: editing.form.icon ?? "",
											onChange: (e) => setEditing({
												...editing,
												form: {
													...editing.form,
													icon: e.target.value
												}
											}),
											className: "h-12 rounded-xl",
											placeholder: "🍢"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										id: "sub-order",
										label: "الترتيب",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "sub-order",
											type: "number",
											value: editing.form.sort_order,
											onChange: (e) => setEditing({
												...editing,
												form: {
													...editing.form,
													sort_order: Number(e.target.value)
												}
											}),
											className: "h-12 rounded-xl",
											inputMode: "numeric"
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									id: "sub-image",
									label: "الصورة",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploader, {
										id: "sub-image",
										prefix: "subcategories",
										value: editing.form.image_url ?? null,
										onChange: (url) => setEditing({
											...editing,
											form: {
												...editing.form,
												image_url: url
											}
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2 rounded-xl bg-muted p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-bold",
										children: "يتطلب طلبًا مسبقًا (قبلها بيوم)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: editing.form.requires_preorder,
										onCheckedChange: (v) => setEditing({
											...editing,
											form: {
												...editing.form,
												requires_preorder: v
											}
										}),
										"aria-label": "يتطلب طلبًا مسبقًا"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2 rounded-xl bg-muted p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-bold",
										children: "الحالة"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: editing.form.is_active ? "مفعل" : "معطل"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
											checked: editing.form.is_active,
											onCheckedChange: (v) => setEditing({
												...editing,
												form: {
													...editing.form,
													is_active: v
												}
											}),
											"aria-label": "حالة التصنيف الفرعي"
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "flex-row-reverse gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setEditing(null),
								className: "rounded-xl",
								children: "إلغاء"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								onClick: save,
								disabled: saving,
								className: "rounded-xl font-bold",
								children: saving ? "جاري الحفظ..." : "حفظ"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: deleting !== null,
				onOpenChange: (open) => !open && setDeleting(null),
				title: `حذف «${deleting?.name}»؟`,
				impact: "سيتم حذف التصنيف الفرعي نهائيًا، وستفقد المنتجات المرتبطة به تصنيفها الفرعي.",
				onConfirm: async () => {
					if (!deleting) return;
					try {
						await deleteSubcategory(deleting.id);
						n.success("تم حذف التصنيف الفرعي");
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
export { AdminSubcategoriesPage as component };
