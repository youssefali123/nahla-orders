import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { E as saveZone, d as deleteZone, t as Button, v as listZonesAdmin } from "./button-Bg-fJMWs.mjs";
import { a as Trash2, d as Power, f as Plus, p as Pencil } from "../_libs/lucide-react.mjs";
import { n as AdminShell, t as AdminGuard } from "./skeleton-OgoHEvYG.mjs";
import { t as Input } from "./input-DbL56wQ4.mjs";
import { a as StatusBadge, i as SearchInput, n as EmptyState, o as TableSkeleton, r as ErrorState, t as DataTable } from "./DataTable-B9ICDh_M.mjs";
import { t as ConfirmDialog } from "./dialogs-D6Y_PhWQ.mjs";
import { t as Field } from "./forms-D1V1pCkc.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as Switch, r as DialogFooter, t as Dialog } from "./switch-G3lBlemf.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.zones-CjHwXUCa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY_FORM = {
	name: "",
	fee: 0,
	sort_order: 0,
	is_active: true
};
function formatFee(fee) {
	return fee === 0 ? "توصيل مجاني 🎉" : `${fee} جنيه`;
}
function AdminZonesPage() {
	const [rows, setRows] = (0, import_react.useState)(null);
	const [failed, setFailed] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [deleting, setDeleting] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const load = (0, import_react.useCallback)(async () => {
		setFailed(false);
		try {
			setRows(await listZonesAdmin());
		} catch {
			setFailed(true);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	const filtered = (0, import_react.useMemo)(() => (rows ?? []).filter((z) => z.name.includes(query.trim())), [rows, query]);
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
				fee: Number(row.fee),
				sort_order: row.sort_order,
				is_active: row.is_active
			}
		});
	}
	async function save() {
		if (!editing) return;
		if (!editing.form.name.trim()) {
			toast.error("اسم المنطقة مطلوب");
			return;
		}
		if (!(editing.form.fee >= 0)) {
			toast.error("سعر التوصيل يجب أن يكون صفرًا أو أكثر");
			return;
		}
		setSaving(true);
		try {
			await saveZone(editing.id, {
				...editing.form,
				name: editing.form.name.trim()
			});
			toast.success(editing.id ? "تم حفظ المنطقة بنجاح" : "تمت إضافة المنطقة بنجاح");
			setEditing(null);
			load();
		} catch (e) {
			toast.error(e?.message ?? "حصل خطأ، حاول تاني.");
		} finally {
			setSaving(false);
		}
	}
	async function toggle(row) {
		try {
			await saveZone(row.id, {
				name: row.name,
				fee: Number(row.fee),
				sort_order: row.sort_order,
				is_active: !row.is_active
			});
			toast.success(row.is_active ? "تم تعطيل المنطقة" : "تم تفعيل المنطقة");
			load();
		} catch (e) {
			toast.error(e?.message ?? "حصل خطأ، حاول تاني.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminGuard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "مناطق التوصيل",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			type: "button",
			onClick: openCreate,
			className: "h-11 gap-2 rounded-xl font-bold",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
				className: "h-4 w-4",
				"aria-hidden": true
			}), "إضافة منطقة"]
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchInput, {
					value: query,
					onChange: setQuery,
					placeholder: "بحث عن منطقة..."
				})
			}),
			failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { onRetry: load }) : rows === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableSkeleton, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				rows: filtered,
				columns: [
					{
						key: "name",
						header: "المنطقة",
						render: (z) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold",
							children: z.name
						})
					},
					{
						key: "fee",
						header: "سعر التوصيل",
						render: (z) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-extrabold text-primary-dark",
							children: formatFee(Number(z.fee))
						})
					},
					{
						key: "order",
						header: "الترتيب",
						render: (z) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold",
							children: z.sort_order
						})
					},
					{
						key: "status",
						header: "الحالة",
						render: (z) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { active: z.is_active })
					},
					{
						key: "actions",
						header: "الإجراءات",
						render: (z) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": `تعديل ${z.name}`,
									onClick: () => openEdit(z),
									className: "grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
										className: "h-4 w-4",
										"aria-hidden": true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": z.is_active ? `تعطيل ${z.name}` : `تفعيل ${z.name}`,
									onClick: () => toggle(z),
									className: "grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, {
										className: "h-4 w-4",
										"aria-hidden": true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": `حذف ${z.name}`,
									onClick: () => setDeleting(z),
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
				renderMobileCard: (z) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-extrabold",
								children: z.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { active: z.is_active })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-extrabold text-primary-dark",
							children: formatFee(Number(z.fee))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 border-t border-border pt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									onClick: () => openEdit(z),
									className: "flex-1 rounded-xl font-bold",
									children: "تعديل"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									onClick: () => toggle(z),
									className: "flex-1 rounded-xl font-bold",
									children: z.is_active ? "تعطيل" : "تفعيل"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									onClick: () => setDeleting(z),
									className: "flex-1 rounded-xl font-bold text-destructive",
									children: "حذف"
								})
							]
						})
					]
				}),
				empty: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "لا توجد مناطق توصيل",
					hint: "أضف أول منطقة مع سعر التوصيل الخاص بها.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						onClick: openCreate,
						className: "h-12 gap-2 rounded-xl font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
							className: "h-4 w-4",
							"aria-hidden": true
						}), "إضافة منطقة"]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: editing !== null,
				onOpenChange: (open) => !open && setEditing(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-h-[90vh] overflow-y-auto rounded-2xl",
					"aria-label": "منطقة توصيل",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing?.id ? "تعديل المنطقة" : "منطقة جديدة" }) }),
						editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									id: "zone-name",
									label: "اسم المنطقة",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "zone-name",
										value: editing.form.name,
										onChange: (e) => setEditing({
											...editing,
											form: {
												...editing.form,
												name: e.target.value
											}
										}),
										className: "h-12 rounded-xl",
										placeholder: "مثال: وسط البلد"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										id: "zone-fee",
										label: "سعر التوصيل (جنيه)",
										required: true,
										hint: "صفر يعني توصيل مجاني",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "zone-fee",
											type: "number",
											min: 0,
											value: editing.form.fee,
											onChange: (e) => setEditing({
												...editing,
												form: {
													...editing.form,
													fee: Number(e.target.value)
												}
											}),
											className: "h-12 rounded-xl",
											inputMode: "decimal"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										id: "zone-order",
										label: "الترتيب",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "zone-order",
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2 rounded-xl bg-muted p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-bold",
										children: "الحالة"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: editing.form.is_active ? "مفعلة" : "معطلة"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
											checked: editing.form.is_active,
											onCheckedChange: (v) => setEditing({
												...editing,
												form: {
													...editing.form,
													is_active: v
												}
											}),
											"aria-label": "حالة المنطقة"
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
				impact: "سيتم حذف منطقة التوصيل نهائيًا. الطلبات المرسلة سابقًا لن تتأثر.",
				onConfirm: async () => {
					if (!deleting) return;
					try {
						await deleteZone(deleting.id);
						toast.success("تم حذف المنطقة");
						setDeleting(null);
						load();
					} catch (e) {
						toast.error(e?.message ?? "حصل خطأ، حاول تاني.");
					}
				}
			})
		]
	}) });
}
//#endregion
export { AdminZonesPage as component };
