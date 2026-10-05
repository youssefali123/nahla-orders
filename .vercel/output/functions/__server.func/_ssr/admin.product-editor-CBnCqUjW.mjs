import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { S as saveProduct, b as saveOption, c as deleteOptionGroup, f as getProductAdmin, g as listSubcategoriesAdmin, l as deleteProduct, m as listCategoriesAdmin, r as cn, s as deleteOption, t as Button, x as saveOptionGroup } from "./button-DumUo7Sd.mjs";
import { S as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as GripVertical, d as Plus, f as Pencil, i as Trash2 } from "../_libs/lucide-react.mjs";
import { i as Skeleton, n as AdminShell, t as AdminGuard } from "./skeleton-lkUnX65X.mjs";
import { n } from "../_libs/react-hot-toast.mjs";
import { t as Input } from "./input-DGCbXmEg.mjs";
import { r as ErrorState } from "./DataTable-Dt2byNFy.mjs";
import { n as FormSection, t as ConfirmDialog } from "./dialogs-BUZFYiWy.mjs";
import { n as ImageUploader, r as Label, t as Field } from "./forms-PIJApsPo.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as Switch, r as DialogFooter, t as Dialog } from "./switch-AEp1smtQ.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-D5sLhE3e.mjs";
import { t as Route } from "./admin.product-editor-CESVWf2t.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.product-editor-CBnCqUjW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function errMessage(error) {
	return error?.message ?? "حصل خطأ، حاول تاني.";
}
function PriceDeltaInput({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			type: "number",
			value: Number.isFinite(value) ? value : 0,
			onChange: (e) => onChange(Number(e.target.value)),
			className: "h-10 w-24 rounded-xl",
			"aria-label": "الزيادة على السعر",
			inputMode: "decimal"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "shrink-0 text-xs font-bold text-muted-foreground",
			children: "جنيه"
		})]
	});
}
function OptionRow({ option, onSaved, onDeleted }) {
	const [name, setName] = (0, import_react.useState)(option.name);
	const [delta, setDelta] = (0, import_react.useState)(Number(option.price_delta));
	const [active, setActive] = (0, import_react.useState)(option.is_active);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
	const dirty = name.trim() !== option.name || delta !== Number(option.price_delta) || active !== option.is_active;
	async function save() {
		if (!name.trim()) {
			n.error("اسم الاختيار مطلوب");
			return;
		}
		setSaving(true);
		try {
			await saveOption(option.option_group_id, option.id, {
				name: name.trim(),
				price_delta: delta,
				sort_order: option.sort_order,
				is_active: active
			});
			n.success("تم حفظ الاختيار بنجاح");
			onSaved();
		} catch (e) {
			n.error(errMessage(e));
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 rounded-xl bg-card p-2 shadow-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, {
				className: "h-4 w-4 shrink-0 text-muted-foreground",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: name,
				onChange: (e) => setName(e.target.value),
				className: "h-10 min-w-0 flex-1 rounded-xl",
				"aria-label": "اسم الاختيار"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceDeltaInput, {
				value: delta,
				onChange: setDelta
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				role: "switch",
				"aria-checked": active,
				"aria-label": "حالة الاختيار",
				onClick: () => setActive((v) => !v),
				className: `relative h-6 w-11 shrink-0 rounded-full transition-colors ${active ? "bg-primary" : "bg-muted"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${active ? "right-0.5" : "left-0.5"}`,
					"aria-hidden": true
				})
			}),
			dirty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				size: "sm",
				onClick: save,
				disabled: saving,
				className: "shrink-0 rounded-xl font-bold",
				children: saving ? "حفظ..." : "حفظ"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": `حذف ${option.name}`,
				onClick: () => setConfirmDelete(true),
				className: "grid h-9 w-9 shrink-0 place-items-center rounded-xl text-destructive transition-colors hover:bg-destructive/10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
					className: "h-4 w-4",
					"aria-hidden": true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: confirmDelete,
				onOpenChange: setConfirmDelete,
				title: `حذف «${option.name}»؟`,
				impact: "سيتم حذف هذا الاختيار نهائيًا.",
				onConfirm: async () => {
					try {
						await deleteOption(option.id);
						n.success("تم حذف الاختيار");
						onDeleted();
						setConfirmDelete(false);
					} catch (e) {
						n.error(errMessage(e));
					}
				}
			})
		]
	});
}
function GroupDialog({ productId, group, open, onOpenChange, onSaved }) {
	const [name, setName] = (0, import_react.useState)(group?.name ?? "");
	const [type, setType] = (0, import_react.useState)(group?.type ?? "single");
	const [min, setMin] = (0, import_react.useState)(group?.min_selections ?? 0);
	const [max, setMax] = (0, import_react.useState)(group?.max_selections ?? (group?.type === "multiple" ? null : 1));
	const [active, setActive] = (0, import_react.useState)(group?.is_active ?? true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	function pickType(next) {
		setType(next);
		if (next === "single") {
			setMax(1);
			setMin((m) => Math.min(m, 1));
		}
	}
	async function save() {
		if (!name.trim()) {
			n.error("اسم المجموعة مطلوب");
			return;
		}
		setSaving(true);
		try {
			await saveOptionGroup(productId, group?.id ?? null, {
				name: name.trim(),
				type,
				min_selections: min,
				max_selections: type === "single" ? 1 : max,
				sort_order: group?.sort_order ?? 0,
				is_active: active
			});
			n.success("تم حفظ المجموعة بنجاح");
			onSaved();
			onOpenChange(false);
		} catch (e) {
			n.error(errMessage(e));
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto rounded-2xl",
			"aria-label": group ? "تعديل المجموعة" : "مجموعة جديدة",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: group ? "تعديل المجموعة" : "مجموعة خيارات جديدة" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							id: "group-name",
							label: "اسم المجموعة",
							required: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "group-name",
								value: name,
								onChange: (e) => setName(e.target.value),
								className: "h-12 rounded-xl",
								placeholder: "مثال: الحجم"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "mb-1.5 block text-sm font-bold",
							children: "نوع الاختيار"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [{
								v: "single",
								t: "اختيار واحد",
								h: "يسمح للعميل باختيار عنصر واحد فقط."
							}, {
								v: "multiple",
								t: "متعدد الاختيارات",
								h: "يسمح للعميل باختيار أكثر من عنصر."
							}].map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => pickType(opt.v),
								"aria-pressed": type === opt.v,
								className: `rounded-xl border p-3 text-right transition-colors ${type === opt.v ? "border-primary bg-primary/10" : "border-border bg-card"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm font-extrabold",
									children: opt.t
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 block text-xs text-muted-foreground",
									children: opt.h
								})]
							}, opt.v))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								id: "group-min",
								label: "الحد الأدنى",
								hint: type === "single" ? "0 أو 1 فقط" : void 0,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "group-min",
									type: "number",
									min: 0,
									max: type === "single" ? 1 : void 0,
									value: min,
									onChange: (e) => setMin(Math.max(0, Number(e.target.value))),
									className: "h-12 rounded-xl",
									inputMode: "numeric"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								id: "group-max",
								label: "الحد الأقصى",
								hint: type === "single" ? "دائمًا 1" : "اتركه فارغًا بدون حد",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "group-max",
									type: "number",
									min: 0,
									value: max ?? "",
									disabled: type === "single",
									onChange: (e) => setMax(e.target.value === "" ? null : Math.max(0, Number(e.target.value))),
									className: "h-12 rounded-xl",
									inputMode: "numeric",
									placeholder: "بدون حد"
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
									children: active ? "مفعلة" : "معطلة"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: active,
									onCheckedChange: setActive,
									"aria-label": "حالة المجموعة"
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
						onClick: () => onOpenChange(false),
						className: "rounded-xl",
						children: "إلغاء"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						onClick: save,
						disabled: saving,
						className: "rounded-xl font-bold",
						children: saving ? "جاري الحفظ..." : "حفظ المجموعة"
					})]
				})
			]
		})
	});
}
function OptionGroupEditor({ productId, group, onChanged }) {
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [showAddOption, setShowAddOption] = (0, import_react.useState)(false);
	const [newName, setNewName] = (0, import_react.useState)("");
	const [newDelta, setNewDelta] = (0, import_react.useState)(0);
	const [savingOption, setSavingOption] = (0, import_react.useState)(false);
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
	async function addOption() {
		if (!newName.trim()) {
			n.error("اسم الاختيار مطلوب");
			return;
		}
		setSavingOption(true);
		try {
			await saveOption(group.id, null, {
				name: newName.trim(),
				price_delta: newDelta,
				sort_order: group.options.length,
				is_active: true
			});
			n.success("تمت إضافة الاختيار بنجاح");
			setNewName("");
			setNewDelta(0);
			setShowAddOption(false);
			onChanged();
		} catch (e) {
			n.error(errMessage(e));
		} finally {
			setSavingOption(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-muted p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm font-extrabold",
						children: group.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 text-xs text-muted-foreground",
						children: [
							group.type === "single" ? "اختيار واحد" : "متعدد الاختيارات",
							group.min_selections > 0 ? " · مطلوب" : " · اختياري",
							group.type === "multiple" && group.max_selections !== null ? ` · حتى ${group.max_selections}` : "",
							!group.is_active ? " · معطلة" : ""
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": `تعديل ${group.name}`,
						onClick: () => setEditing(true),
						className: "grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
							className: "h-4 w-4",
							"aria-hidden": true
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": `حذف ${group.name}`,
						onClick: () => setConfirmDelete(true),
						className: "grid h-9 w-9 place-items-center rounded-xl text-destructive transition-colors hover:bg-destructive/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
							className: "h-4 w-4",
							"aria-hidden": true
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 space-y-2",
				children: group.options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OptionRow, {
					option,
					onSaved: onChanged,
					onDeleted: onChanged
				}, option.id))
			}),
			showAddOption ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-center gap-2 rounded-xl bg-card p-2 shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: newName,
						onChange: (e) => setNewName(e.target.value),
						placeholder: "اسم الاختيار",
						"aria-label": "اسم الاختيار الجديد",
						className: "h-10 min-w-0 flex-1 rounded-xl"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceDeltaInput, {
						value: newDelta,
						onChange: setNewDelta
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "sm",
						onClick: addOption,
						disabled: savingOption,
						className: "shrink-0 rounded-xl font-bold",
						children: savingOption ? "..." : "إضافة"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setShowAddOption(true),
				className: "mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card text-sm font-bold text-muted-foreground transition-colors hover:border-primary hover:text-primary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
					className: "h-4 w-4",
					"aria-hidden": true
				}), "إضافة اختيار"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupDialog, {
				productId,
				group,
				open: editing,
				onOpenChange: setEditing,
				onSaved: onChanged
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: confirmDelete,
				onOpenChange: setConfirmDelete,
				title: `حذف «${group.name}»؟`,
				impact: "سيتم حذف المجموعة وجميع الاختيارات المرتبطة بها نهائيًا.",
				onConfirm: async () => {
					try {
						await deleteOptionGroup(group.id);
						n.success("تم حذف المجموعة");
						onChanged();
						setConfirmDelete(false);
					} catch (e) {
						n.error(errMessage(e));
					}
				}
			})
		]
	});
}
function NewOptionGroupButton({ productId, onChanged }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => setOpen(true),
		className: "flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card text-sm font-bold text-muted-foreground transition-colors hover:border-primary hover:text-primary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
			className: "h-4 w-4",
			"aria-hidden": true
		}), "إضافة مجموعة"]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupDialog, {
		productId,
		group: null,
		open,
		onOpenChange: setOpen,
		onSaved: onChanged
	})] });
}
function PricePreview({ base, picks }) {
	const total = base + picks.reduce((n, p) => n + p.delta, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-4 text-sm",
		"aria-label": "معاينة السعر",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-bold text-muted-foreground",
				children: "معاينة — للمساعدة فقط"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "السعر الأساسي" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-bold",
					children: [base, " جنيه"]
				})]
			}),
			picks.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex justify-between text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["+ ", p.label] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-bold",
					children: [
						"+",
						p.delta,
						" جنيه"
					]
				})]
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex justify-between border-t border-border pt-2 text-base font-extrabold text-primary-dark",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الإجمالي" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [total, " جنيه"] })]
			})
		]
	});
}
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var EMPTY = {
	category_id: "",
	subcategory_id: null,
	name: "",
	price: 0,
	icon: "",
	image_url: null,
	description: "",
	unit: "",
	sort_order: 0,
	is_active: true,
	is_featured: false
};
function ProductEditorPage() {
	const { id } = Route.useSearch();
	const navigate = useNavigate();
	const [loading, setLoading] = (0, import_react.useState)(id !== null);
	const [failed, setFailed] = (0, import_react.useState)(false);
	const [categories, setCategories] = (0, import_react.useState)([]);
	const [subcategories, setSubcategories] = (0, import_react.useState)([]);
	const [form, setForm] = (0, import_react.useState)({ ...EMPTY });
	const [product, setProduct] = (0, import_react.useState)(null);
	const [errors, setErrors] = (0, import_react.useState)([]);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [dirty, setDirty] = (0, import_react.useState)(false);
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
	const [confirmLeave, setConfirmLeave] = (0, import_react.useState)(false);
	const summaryRef = (0, import_react.useRef)(null);
	const load = (0, import_react.useCallback)(async () => {
		setFailed(false);
		try {
			const [cats, subs] = await Promise.all([listCategoriesAdmin(), listSubcategoriesAdmin()]);
			setCategories(cats);
			setSubcategories(subs);
			if (id) {
				const fetched = await getProductAdmin(id);
				if (!fetched) {
					setFailed(true);
					return;
				}
				setProduct(fetched);
				setForm({
					category_id: fetched.category_id,
					subcategory_id: fetched.subcategory_id,
					name: fetched.name,
					price: Number(fetched.price),
					icon: fetched.icon ?? "",
					image_url: fetched.image_url,
					description: fetched.description ?? "",
					unit: fetched.unit ?? "",
					sort_order: fetched.sort_order,
					is_active: fetched.is_active,
					is_featured: fetched.is_featured
				});
			}
		} catch {
			setFailed(true);
		} finally {
			setLoading(false);
		}
	}, [id]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	function set(key, value) {
		setForm((f) => ({
			...f,
			[key]: value,
			...key === "category_id" ? { subcategory_id: null } : {}
		}));
		setDirty(true);
	}
	function validate() {
		const problems = [];
		if (!form.name.trim()) problems.push("اسم المنتج مطلوب");
		if (!form.category_id) problems.push("اختار التصنيف");
		if (!(form.price >= 0)) problems.push("السعر يجب أن يكون صفرًا أو أكثر");
		return problems;
	}
	async function save() {
		const problems = validate();
		setErrors(problems);
		if (problems.length > 0) {
			summaryRef.current?.focus();
			return;
		}
		setSaving(true);
		try {
			const savedId = await saveProduct(id, {
				...form,
				name: form.name.trim()
			});
			n.success(id ? "تم حفظ المنتج بنجاح" : "تمت إضافة المنتج بنجاح");
			setDirty(false);
			if (!id) navigate({
				to: "/admin/product-editor",
				search: { id: savedId },
				replace: true
			});
			else load();
		} catch (e) {
			n.error(e?.message ?? "تعذر حفظ المنتج. يرجى المحاولة مرة أخرى.");
		} finally {
			setSaving(false);
		}
	}
	function back() {
		if (dirty) setConfirmLeave(true);
		else navigate({ to: "/admin/products" });
	}
	const subOptions = subcategories.filter((s) => s.category_id === form.category_id);
	const previewPicks = product?.option_groups.flatMap((g) => g.options.slice(0, g.type === "single" ? 1 : 2).map((o) => ({
		label: `${g.name}: ${o.name}`,
		delta: Number(o.price_delta)
	}))) ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminGuard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: id ? "تعديل المنتج" : "منتج جديد",
		actions: id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			type: "button",
			variant: "outline",
			onClick: () => setConfirmDelete(true),
			className: "h-11 gap-2 rounded-xl font-bold text-destructive",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
				className: "h-4 w-4",
				"aria-hidden": true
			}), "حذف"]
		}) : void 0,
		children: [
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				"aria-busy": "true",
				"aria-label": "جاري التحميل",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 rounded-2xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 rounded-2xl" })]
			}) : failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { onRetry: load }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 pb-24 lg:pb-0",
				children: [
					errors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: summaryRef,
						tabIndex: -1,
						role: "alert",
						"aria-labelledby": "editor-errors-title",
						className: "rounded-2xl border border-destructive/40 bg-destructive/5 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							id: "editor-errors-title",
							className: "font-extrabold text-destructive",
							children: [
								"يوجد ",
								errors.length,
								" ",
								errors.length === 1 ? "مشكلة" : "مشاكل",
								" يجب حلها"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-1 list-disc space-y-0.5 pr-5 text-sm font-semibold text-destructive",
							children: errors.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: e }, i))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormSection, {
						title: "معلومات المنتج",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								id: "pe-name",
								label: "اسم المنتج",
								required: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "pe-name",
									value: form.name,
									onChange: (e) => set("name", e.target.value),
									className: "h-12 rounded-xl",
									placeholder: "مثال: فرخة مشوية"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								id: "pe-desc",
								label: "الوصف",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "pe-desc",
									value: form.description ?? "",
									onChange: (e) => set("description", e.target.value),
									className: "min-h-20 rounded-xl",
									placeholder: "وصف مختصر للمنتج"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									id: "pe-price",
									label: "السعر الأساسي (جنيه)",
									required: true,
									hint: "سعر المنتج بدون أي إضافات",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "pe-price",
										type: "number",
										min: 0,
										value: form.price,
										onChange: (e) => set("price", Number(e.target.value)),
										className: "h-12 rounded-xl",
										inputMode: "decimal"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									id: "pe-unit",
									label: "الوحدة",
									hint: "مثال: كيلو، علبة",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "pe-unit",
										value: form.unit ?? "",
										onChange: (e) => set("unit", e.target.value),
										className: "h-12 rounded-xl",
										placeholder: "كيلو"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									id: "pe-cat",
									label: "التصنيف",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: form.category_id,
										onValueChange: (v) => set("category_id", v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "pe-cat",
											className: "h-12 rounded-xl",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "اختار التصنيف" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: c.id,
											children: c.name
										}, c.id)) })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									id: "pe-sub",
									label: "التصنيف الفرعي",
									hint: "اختياري",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: form.subcategory_id ?? "none",
										onValueChange: (v) => set("subcategory_id", v === "none" ? null : v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "pe-sub",
											className: "h-12 rounded-xl",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "بدون" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "none",
											children: "بدون تصنيف فرعي"
										}), subOptions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: s.id,
											children: s.name
										}, s.id))] })]
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									id: "pe-icon",
									label: "الأيقونة",
									hint: "إيموجي يظهر عند غياب الصورة",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "pe-icon",
										value: form.icon ?? "",
										onChange: (e) => set("icon", e.target.value),
										className: "h-12 rounded-xl",
										placeholder: "🍗"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									id: "pe-order",
									label: "الترتيب",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "pe-order",
										type: "number",
										value: form.sort_order,
										onChange: (e) => set("sort_order", Number(e.target.value)),
										className: "h-12 rounded-xl",
										inputMode: "numeric"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								id: "pe-image",
								label: "الصورة",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploader, {
									id: "pe-image",
									prefix: "products",
									value: form.image_url ?? null,
									onChange: (url) => set("image_url", url ?? null)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2 rounded-xl bg-muted p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-bold",
										children: "مفعل"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: form.is_active,
										onCheckedChange: (v) => set("is_active", v),
										"aria-label": "حالة المنتج"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2 rounded-xl bg-muted p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-bold",
										children: "الأكثر طلبًا 🔥"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: form.is_featured,
										onCheckedChange: (v) => set("is_featured", v),
										"aria-label": "منتج مميز"
									})]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormSection, {
						title: "خيارات المنتج",
						hint: "الزيادات هنا تُضاف على السعر الأساسي. اترك القسم فارغًا لمنتج بدون خيارات.",
						children: [
							id ? product && product.option_groups.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-3",
								children: product.option_groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OptionGroupEditor, {
									productId: id,
									group,
									onChanged: load
								}, group.id))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-dashed border-border p-6 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-extrabold",
									children: "لا توجد مجموعات خيارات لهذا المنتج."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: "أضف مجموعة مثل: الحجم، الطعم، أو الإضافات."
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "rounded-2xl bg-muted p-4 text-center text-sm font-bold text-muted-foreground",
								children: "احفظ المنتج أولًا لتتمكن من إضافة مجموعات الخيارات."
							}),
							id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewOptionGroupButton, {
								productId: id,
								onChanged: load
							}),
							id && product && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PricePreview, {
								base: form.price,
								picks: previewPicks
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-border bg-card/95 p-3 backdrop-blur lg:static lg:border-0 lg:bg-transparent lg:p-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: back,
							className: "h-13 flex-1 rounded-xl py-3.5 font-bold lg:flex-none lg:px-8",
							children: dirty ? "تجاهل" : "رجوع"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: save,
							disabled: saving,
							className: "h-13 flex-[2] rounded-xl py-3.5 text-base font-extrabold lg:flex-none lg:px-10",
							children: saving ? "جاري الحفظ..." : "حفظ المنتج"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: confirmDelete,
				onOpenChange: setConfirmDelete,
				title: `حذف «${form.name || "المنتج"}»؟`,
				impact: "سيتم حذف المنتج وجميع مجموعات الخيارات والاختيارات المرتبطة به نهائيًا.",
				onConfirm: async () => {
					if (!id) return;
					try {
						await deleteProduct(id);
						n.success("تم حذف المنتج");
						navigate({ to: "/admin/products" });
					} catch (e) {
						n.error(e?.message ?? "حصل خطأ، حاول تاني.");
						setConfirmDelete(false);
					}
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: confirmLeave,
				onOpenChange: setConfirmLeave,
				title: "تجاهل التغييرات؟",
				impact: "لديك تغييرات غير محفوظة ستفقدها.",
				confirmLabel: "تجاهل ورجوع",
				onConfirm: () => navigate({ to: "/admin/products" })
			})
		]
	}) });
}
//#endregion
export { ProductEditorPage as component };
