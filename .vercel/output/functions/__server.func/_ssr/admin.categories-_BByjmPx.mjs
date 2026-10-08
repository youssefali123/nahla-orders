import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as listCategoriesAdmin, o as deleteCategory, t as Button, x as saveCategory } from "./button-Bg-fJMWs.mjs";
import { a as Trash2, d as Power, f as Plus, p as Pencil } from "../_libs/lucide-react.mjs";
import { n as AdminShell, t as AdminGuard } from "./skeleton-OgoHEvYG.mjs";
import { n } from "../_libs/react-hot-toast.mjs";
import { t as Input } from "./input-DbL56wQ4.mjs";
import { a as StatusBadge, i as SearchInput, n as EmptyState, o as TableSkeleton, r as ErrorState, t as DataTable } from "./DataTable-B9ICDh_M.mjs";
import { t as ConfirmDialog } from "./dialogs-D6Y_PhWQ.mjs";
import { n as ImageUploader, t as Field } from "./forms-D1V1pCkc.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as Switch, r as DialogFooter, t as Dialog } from "./switch-G3lBlemf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.categories-_BByjmPx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY_FORM = {
	name: "",
	icon: "",
	image_url: null,
	sort_order: 0,
	is_active: true,
	type: "normal"
};
function AdminCategoriesPage() {
	const [rows, setRows] = (0, import_react.useState)(null);
	const [failed, setFailed] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [deleting, setDeleting] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const load = (0, import_react.useCallback)(async () => {
		setFailed(false);
		try {
			setRows(await listCategoriesAdmin());
		} catch {
			setFailed(true);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	const filtered = (0, import_react.useMemo)(() => (rows ?? []).filter((c) => c.name.includes(query.trim())), [rows, query]);
	function openCreate() {
		setEditing({
			id: null,
			form: { ...EMPTY_FORM }
		});
	}
	function openEdit(row) {
		setEditing({
			id: row.id,
			form: {
				name: row.name,
				icon: row.icon ?? "",
				image_url: row.image_url,
				sort_order: row.sort_order,
				is_active: row.is_active,
				type: row.type
			}
		});
	}
	async function save() {
		if (!editing || !editing.form.name.trim()) {
			n.error("اسم التصنيف مطلوب");
			return;
		}
		setSaving(true);
		try {
			await saveCategory(editing.id, {
				...editing.form,
				name: editing.form.name.trim()
			});
			n.success(editing.id ? "تم حفظ التصنيف بنجاح" : "تمت إضافة التصنيف بنجاح");
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
			await saveCategory(row.id, {
				name: row.name,
				icon: row.icon,
				image_url: row.image_url,
				sort_order: row.sort_order,
				is_active: !row.is_active,
				type: row.type
			});
			n.success(row.is_active ? "تم تعطيل التصنيف" : "تم تفعيل التصنيف");
			load();
		} catch (e) {
			n.error(e?.message ?? "حصل خطأ، حاول تاني.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminGuard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "التصنيفات",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			type: "button",
			onClick: openCreate,
			className: "h-11 gap-2 rounded-xl font-bold",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
				className: "h-4 w-4",
				"aria-hidden": true
			}), "إضافة تصنيف"]
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchInput, {
					value: query,
					onChange: setQuery,
					placeholder: "بحث عن تصنيف..."
				})
			}),
			failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { onRetry: load }) : rows === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableSkeleton, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				rows: filtered,
				columns: [
					{
						key: "name",
						header: "التصنيف",
						render: (c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-muted text-xl",
								"aria-hidden": true,
								children: c.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: c.image_url,
									alt: "",
									className: "h-full w-full object-cover"
								}) : c.icon ?? "🐝"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold",
								children: c.name
							})]
						})
					},
					{
						key: "type",
						header: "النوع",
						render: (c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-muted px-2.5 py-1 text-xs font-bold",
							children: c.type === "custom_order" ? "طلب مخصص" : "عادي"
						})
					},
					{
						key: "order",
						header: "الترتيب",
						render: (c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold",
							children: c.sort_order
						})
					},
					{
						key: "status",
						header: "الحالة",
						render: (c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { active: c.is_active })
					},
					{
						key: "actions",
						header: "الإجراءات",
						render: (c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": `تعديل ${c.name}`,
									onClick: () => openEdit(c),
									className: "grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
										className: "h-4 w-4",
										"aria-hidden": true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": c.is_active ? `تعطيل ${c.name}` : `تفعيل ${c.name}`,
									onClick: () => toggle(c),
									className: "grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, {
										className: "h-4 w-4",
										"aria-hidden": true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": `حذف ${c.name}`,
									onClick: () => setDeleting(c),
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
				renderMobileCard: (c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-muted text-2xl",
								"aria-hidden": true,
								children: c.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: c.image_url,
									alt: "",
									className: "h-full w-full object-cover"
								}) : c.icon ?? "🐝"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-extrabold",
									children: c.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										c.type === "custom_order" ? "طلب مخصص" : "عادي",
										" · ترتيب ",
										c.sort_order
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { active: c.is_active })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 border-t border-border pt-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => openEdit(c),
								className: "flex-1 rounded-xl font-bold",
								children: "تعديل"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => toggle(c),
								className: "flex-1 rounded-xl font-bold",
								children: c.is_active ? "تعطيل" : "تفعيل"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => setDeleting(c),
								className: "flex-1 rounded-xl font-bold text-destructive",
								children: "حذف"
							})
						]
					})]
				}),
				empty: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "لا توجد تصنيفات",
					hint: "ابدأ بإضافة أول تصنيف للكتالوج.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						onClick: openCreate,
						className: "h-12 gap-2 rounded-xl font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
							className: "h-4 w-4",
							"aria-hidden": true
						}), "إضافة تصنيف"]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: editing !== null,
				onOpenChange: (open) => !open && setEditing(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-h-[90vh] overflow-y-auto rounded-2xl",
					"aria-label": "تصنيف",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing?.id ? "تعديل التصنيف" : "تصنيف جديد" }) }),
						editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									id: "cat-name",
									label: "اسم التصنيف",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "cat-name",
										value: editing.form.name,
										onChange: (e) => setEditing({
											...editing,
											form: {
												...editing.form,
												name: e.target.value
											}
										}),
										className: "h-12 rounded-xl",
										placeholder: "مثال: ماركت"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										id: "cat-icon",
										label: "الأيقونة",
										hint: "إيموجي يظهر بجانب الاسم",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "cat-icon",
											value: editing.form.icon ?? "",
											onChange: (e) => setEditing({
												...editing,
												form: {
													...editing.form,
													icon: e.target.value
												}
											}),
											className: "h-12 rounded-xl",
											placeholder: "🛒"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										id: "cat-order",
										label: "الترتيب",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "cat-order",
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
									id: "cat-image",
									label: "الصورة",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploader, {
										id: "cat-image",
										prefix: "categories",
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
											"aria-label": "حالة التصنيف"
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
				impact: "سيتم حذف التصنيف وجميع التصنيفات الفرعية والمنتجات وخياراتها المرتبطة به نهائيًا.",
				onConfirm: async () => {
					if (!deleting) return;
					try {
						await deleteCategory(deleting.id);
						n.success("تم حذف التصنيف");
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
export { AdminCategoriesPage as component };
