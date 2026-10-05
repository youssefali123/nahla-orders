import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as deleteBanner, g as listSubcategoriesAdmin, h as listProductsAdmin, m as listCategoriesAdmin, p as listBannersAdmin, t as Button, v as saveBanner } from "./button-DumUo7Sd.mjs";
import { C as ExternalLink, d as Plus, f as Pencil, i as Trash2, u as Power } from "../_libs/lucide-react.mjs";
import { n as AdminShell, t as AdminGuard } from "./skeleton-lkUnX65X.mjs";
import { n } from "../_libs/react-hot-toast.mjs";
import { t as Input } from "./input-DGCbXmEg.mjs";
import { a as StatusBadge, i as SearchInput, n as EmptyState, o as TableSkeleton, r as ErrorState, t as DataTable } from "./DataTable-Dt2byNFy.mjs";
import { t as ConfirmDialog } from "./dialogs-BUZFYiWy.mjs";
import { n as ImageUploader, t as Field } from "./forms-PIJApsPo.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as Switch, r as DialogFooter, t as Dialog } from "./switch-AEp1smtQ.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-D5sLhE3e.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.banners-wukFRgS4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY_FORM = {
	title: "",
	image_url: "",
	link_type: "none",
	link_id: null,
	link_url: null,
	sort_order: 0,
	is_active: true
};
function AdminBannersPage() {
	const [rows, setRows] = (0, import_react.useState)(null);
	const [failed, setFailed] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const [targets, setTargets] = (0, import_react.useState)({
		categories: [],
		subcategories: [],
		products: []
	});
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [deleting, setDeleting] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const load = (0, import_react.useCallback)(async () => {
		setFailed(false);
		try {
			const [banners, cats, subs, prods] = await Promise.all([
				listBannersAdmin(),
				listCategoriesAdmin(),
				listSubcategoriesAdmin(),
				listProductsAdmin()
			]);
			setRows(banners);
			setTargets({
				categories: cats,
				subcategories: subs,
				products: prods
			});
		} catch {
			setFailed(true);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	const filtered = (0, import_react.useMemo)(() => (rows ?? []).filter((b) => (b.title ?? "").includes(query.trim())), [rows, query]);
	function targetLabel(b) {
		if (b.link_type === "category") return `تصنيف: ${targets.categories.find((c) => c.id === b.link_id)?.name ?? "—"}`;
		if (b.link_type === "subcategory") return `فرعي: ${targets.subcategories.find((s) => s.id === b.link_id)?.name ?? "—"}`;
		if (b.link_type === "product") return `منتج: ${targets.products.find((p) => p.id === b.link_id)?.name ?? "—"}`;
		if (b.link_type === "custom") return b.link_url ?? "رابط مخصص";
		return "بدون رابط";
	}
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
				title: row.title ?? "",
				image_url: row.image_url,
				link_type: row.link_type ?? "none",
				link_id: row.link_id,
				link_url: row.link_url,
				sort_order: row.sort_order,
				is_active: row.is_active
			}
		});
	}
	async function save() {
		if (!editing) return;
		if (!editing.form.image_url) {
			n.error("صورة البنر مطلوبة");
			return;
		}
		setSaving(true);
		try {
			await saveBanner(editing.id, {
				title: editing.form.title || null,
				image_url: editing.form.image_url,
				link_type: editing.form.link_type,
				link_id: [
					"category",
					"subcategory",
					"product"
				].includes(editing.form.link_type) ? editing.form.link_id : null,
				link_url: editing.form.link_type === "custom" ? editing.form.link_url : null,
				sort_order: editing.form.sort_order,
				is_active: editing.form.is_active
			});
			n.success(editing.id ? "تم حفظ البنر بنجاح" : "تمت إضافة البنر بنجاح");
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
			await saveBanner(row.id, {
				title: row.title,
				image_url: row.image_url,
				link_type: row.link_type,
				link_id: row.link_id,
				link_url: row.link_url,
				sort_order: row.sort_order,
				is_active: !row.is_active
			});
			n.success(row.is_active ? "تم تعطيل البنر" : "تم تفعيل البنر");
			load();
		} catch (e) {
			n.error(e?.message ?? "حصل خطأ، حاول تاني.");
		}
	}
	const linkOptions = editing?.form.link_type === "category" ? targets.categories : editing?.form.link_type === "subcategory" ? targets.subcategories : editing?.form.link_type === "product" ? targets.products : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminGuard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "البنرات",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			type: "button",
			onClick: openCreate,
			className: "h-11 gap-2 rounded-xl font-bold",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
				className: "h-4 w-4",
				"aria-hidden": true
			}), "إضافة بنر"]
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchInput, {
					value: query,
					onChange: setQuery,
					placeholder: "بحث عن بنر..."
				})
			}),
			failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { onRetry: load }) : rows === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableSkeleton, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				rows: filtered,
				columns: [
					{
						key: "banner",
						header: "البنر",
						render: (b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-10 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-muted",
								"aria-hidden": true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: b.image_url,
									alt: "",
									className: "h-full w-full object-cover",
									loading: "lazy"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-bold",
								children: b.title || "بدون عنوان"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block max-w-48 truncate text-xs text-muted-foreground",
								children: targetLabel(b)
							})] })]
						})
					},
					{
						key: "order",
						header: "الترتيب",
						render: (b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold",
							children: b.sort_order
						})
					},
					{
						key: "status",
						header: "الحالة",
						render: (b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { active: b.is_active })
					},
					{
						key: "actions",
						header: "الإجراءات",
						render: (b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "تعديل البنر",
									onClick: () => openEdit(b),
									className: "grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
										className: "h-4 w-4",
										"aria-hidden": true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": b.is_active ? "تعطيل البنر" : "تفعيل البنر",
									onClick: () => toggle(b),
									className: "grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, {
										className: "h-4 w-4",
										"aria-hidden": true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "حذف البنر",
									onClick: () => setDeleting(b),
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
				renderMobileCard: (b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-hidden rounded-xl bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: b.image_url,
								alt: b.title ?? "",
								className: "aspect-video w-full object-cover",
								loading: "lazy"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-extrabold",
								children: b.title || "بدون عنوان"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { active: b.is_active })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-1 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {
								className: "h-3.5 w-3.5",
								"aria-hidden": true
							}), targetLabel(b)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 border-t border-border pt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									onClick: () => openEdit(b),
									className: "flex-1 rounded-xl font-bold",
									children: "تعديل"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									onClick: () => toggle(b),
									className: "flex-1 rounded-xl font-bold",
									children: b.is_active ? "تعطيل" : "تفعيل"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									onClick: () => setDeleting(b),
									className: "flex-1 rounded-xl font-bold text-destructive",
									children: "حذف"
								})
							]
						})
					]
				}),
				empty: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "لا توجد بنرات",
					hint: "أضف أول بنر للصفحة الرئيسية.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						onClick: openCreate,
						className: "h-12 gap-2 rounded-xl font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
							className: "h-4 w-4",
							"aria-hidden": true
						}), "إضافة بنر"]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: editing !== null,
				onOpenChange: (open) => !open && setEditing(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-h-[90vh] overflow-y-auto rounded-2xl",
					"aria-label": "بنر",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing?.id ? "تعديل البنر" : "بنر جديد" }) }),
						editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									id: "banner-image",
									label: "الصورة",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploader, {
										id: "banner-image",
										prefix: "banners",
										value: editing.form.image_url || null,
										onChange: (url) => setEditing({
											...editing,
											form: {
												...editing.form,
												image_url: url ?? ""
											}
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									id: "banner-title",
									label: "العنوان",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "banner-title",
										value: editing.form.title,
										onChange: (e) => setEditing({
											...editing,
											form: {
												...editing.form,
												title: e.target.value
											}
										}),
										className: "h-12 rounded-xl",
										placeholder: "مثال: خصومات خاصة"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										id: "banner-link-type",
										label: "وجهة الرابط",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: editing.form.link_type,
											onValueChange: (v) => setEditing({
												...editing,
												form: {
													...editing.form,
													link_type: v,
													link_id: null,
													link_url: null
												}
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												id: "banner-link-type",
												className: "h-12 rounded-xl",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "none",
													children: "بدون رابط"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "category",
													children: "تصنيف"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "subcategory",
													children: "تصنيف فرعي"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "product",
													children: "منتج"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "custom",
													children: "رابط مخصص"
												})
											] })]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										id: "banner-order",
										label: "الترتيب",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "banner-order",
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
								[
									"category",
									"subcategory",
									"product"
								].includes(editing.form.link_type) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									id: "banner-link-target",
									label: "الهدف",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: editing.form.link_id ?? "",
										onValueChange: (v) => setEditing({
											...editing,
											form: {
												...editing.form,
												link_id: v
											}
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "banner-link-target",
											className: "h-12 rounded-xl",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "اختار الهدف" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: linkOptions.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: o.id,
											children: o.name
										}, o.id)) })]
									})
								}),
								editing.form.link_type === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									id: "banner-link-url",
									label: "الرابط",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "banner-link-url",
										value: editing.form.link_url ?? "",
										onChange: (e) => setEditing({
											...editing,
											form: {
												...editing.form,
												link_url: e.target.value
											}
										}),
										className: "h-12 rounded-xl",
										placeholder: "https://…",
										dir: "ltr"
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
											"aria-label": "حالة البنر"
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
				title: `حذف «${deleting?.title || "البنر"}»؟`,
				impact: "سيتم حذف البنر نهائيًا من الصفحة الرئيسية.",
				onConfirm: async () => {
					if (!deleting) return;
					try {
						await deleteBanner(deleting.id);
						n.success("تم حذف البنر");
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
export { AdminBannersPage as component };
