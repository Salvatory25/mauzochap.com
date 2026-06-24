import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-C3cIRk-V.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useAuth } from "./use-auth-eGZW1w9W.mjs";
import { i as useT, n as formatTZS } from "./i18n-C8ZZqtNN.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-DSKqFpbT.mjs";
import { n as Label, t as Input } from "./label-Cdxd-27C.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as Pencil, H as Download, I as Image, R as FileUp, Y as CircleCheck, b as Search, d as Tags, u as Trash2, w as Plus } from "../_libs/lucide-react.mjs";
import { a as DialogTrigger, i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-CBFrTUY_.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as stringType, n as numberType, r as objectType, t as literalType } from "../_libs/zod.mjs";
import { t as require_papaparse } from "../_libs/papaparse.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products-DdfCrLdK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_papaparse = /* @__PURE__ */ __toESM(require_papaparse());
var productSchema = objectType({
	name: stringType().min(1, "Product name is required"),
	price: numberType().min(0, "Price cannot be negative"),
	cost: numberType().min(0, "Cost cannot be negative"),
	low_stock_threshold: numberType().min(0, "Low stock threshold cannot be negative"),
	stock_quantity: numberType().min(0, "Stock cannot be negative"),
	sku: stringType().optional().nullable(),
	barcode: stringType().optional().nullable(),
	category_id: stringType().optional().nullable(),
	unit: stringType().optional(),
	image_url: stringType().url("Invalid image URL").optional().or(literalType(""))
});
function ProductsPage() {
	const t = useT();
	const qc = useQueryClient();
	const { isManager, branchId } = useAuth();
	const [search, setSearch] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [catOpen, setCatOpen] = (0, import_react.useState)(false);
	const [bulkOpen, setBulkOpen] = (0, import_react.useState)(false);
	const [page, setPage] = (0, import_react.useState)(1);
	const ITEMS_PER_PAGE = 50;
	const { data: products = [], isLoading } = useQuery({
		queryKey: ["products", branchId],
		enabled: !!branchId,
		queryFn: async () => {
			const { data, error } = await supabase.from("products").select("*, categories(name), branch_inventory(stock_quantity, branch_id)").order("name");
			if (error) throw error;
			return data.map((p) => {
				const branchStock = p.branch_inventory?.find((bi) => bi.branch_id === branchId);
				return {
					...p,
					stock_quantity: branchStock?.stock_quantity || 0
				};
			});
		}
	});
	const filtered = products.filter((p) => (p.name || "").toLowerCase().includes(search.toLowerCase()) || (p.sku || "").toLowerCase().includes(search.toLowerCase()) || (p.barcode || "").includes(search));
	const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
	const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
	const handleDelete = async (id) => {
		if (!confirm("Delete this product?")) return;
		const { error } = await supabase.from("products").delete().eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Deleted");
		qc.invalidateQueries({ queryKey: ["products"] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between flex-wrap gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold",
					children: t("products")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [products.length, " items in catalog"]
				})] }), isManager && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
							open: catOpen,
							onOpenChange: setCatOpen,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tags, { className: "h-4 w-4 mr-2" }), " Categories"]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoriesDialog, {})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
							open: bulkOpen,
							onOpenChange: setBulkOpen,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "h-4 w-4 mr-2" }), " Bulk Import"]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulkImportDialog, { onClose: () => setBulkOpen(false) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
							open,
							onOpenChange: (o) => {
								setOpen(o);
								if (!o) setEditing(null);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => setEditing(null),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-2" }),
										" ",
										t("addProduct")
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductDialog, {
								editing,
								onClose: () => setOpen(false)
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: search,
					onChange: (e) => {
						setSearch(e.target.value);
						setPage(1);
					},
					placeholder: t("search"),
					className: "pl-10"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-border bg-card overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-3 text-left w-12" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: t("productName")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: t("category")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Product Code / Barcode"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: t("price")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: t("stock")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-3" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 7,
							className: "px-4 py-10 text-center text-muted-foreground",
							children: t("loading")
						}) }) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 7,
							className: "px-4 py-10 text-center text-muted-foreground",
							children: t("noData")
						}) }) : paginated.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-muted/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-10 w-10 rounded-md overflow-hidden bg-muted flex items-center justify-center border border-border",
										children: p.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: p.image_url,
											alt: p.name,
											className: "h-full w-full object-cover"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-4 w-4 text-muted-foreground opacity-50" })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-medium",
									children: p.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: p.categories?.name ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3 text-muted-foreground text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: p.sku || "—" }), p.barcode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground mt-0.5",
										children: p.barcode
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right",
									children: formatTZS(Number(p.price))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `inline-flex items-center gap-1 ${p.stock_quantity <= p.low_stock_threshold ? "text-destructive font-semibold" : ""}`,
										children: [p.stock_quantity, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-normal text-muted-foreground uppercase",
											children: p.unit || "pcs"
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right space-x-1",
									children: isManager && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										onClick: () => {
											setEditing(p);
											setOpen(true);
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										onClick: () => handleDelete(p.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
									})] })
								})
							]
						}, p.id))
					})]
				})
			}),
			totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border border-border bg-card p-3 rounded-lg mt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						disabled: page === 1,
						onClick: () => setPage((p) => p - 1),
						children: "Previous"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-muted-foreground",
						children: [
							"Page ",
							page,
							" of ",
							totalPages
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						disabled: page === totalPages,
						onClick: () => setPage((p) => p + 1),
						children: "Next"
					})
				]
			})
		]
	});
}
function ProductDialog({ editing, onClose }) {
	const qc = useQueryClient();
	const t = useT();
	const { branchId, user } = useAuth();
	const [form, setForm] = (0, import_react.useState)({
		name: editing?.name ?? "",
		sku: editing?.sku ?? "",
		barcode: editing?.barcode ?? "",
		price: editing?.price ?? 0,
		cost: editing?.cost ?? 0,
		stock_quantity: editing?.stock_quantity ?? 0,
		low_stock_threshold: editing?.low_stock_threshold ?? 5,
		category_id: editing?.category_id ?? "",
		unit: editing?.unit ?? "pcs",
		image_url: editing?.image_url ?? ""
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const { data: categories = [] } = useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			const { data } = await supabase.from("categories").select("id,name").order("name");
			return data ?? [];
		}
	});
	const submit = async (e) => {
		e.preventDefault();
		if (!branchId) return toast.error("No active branch");
		setSaving(true);
		try {
			const payload = {
				name: form.name,
				price: Number(form.price),
				cost: Number(form.cost),
				low_stock_threshold: Number(form.low_stock_threshold),
				sku: form.sku || null,
				barcode: form.barcode || null,
				category_id: form.category_id || null,
				unit: form.unit || "pcs",
				image_url: form.image_url || null
			};
			const parsed = productSchema.safeParse({
				...payload,
				stock_quantity: Number(form.stock_quantity)
			});
			if (!parsed.success) {
				parsed.error.errors.forEach((err) => toast.error(err.message));
				return;
			}
			let newProduct = null;
			if (editing) {
				const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
				if (error) throw error;
			} else {
				const { data, error } = await supabase.from("products").insert({
					...payload,
					stock_quantity: Number(form.stock_quantity)
				}).select().single();
				if (error) throw error;
				newProduct = data;
				await supabase.from("branch_inventory").insert({
					branch_id: branchId,
					product_id: newProduct.id,
					stock_quantity: Number(form.stock_quantity)
				});
				if (Number(form.stock_quantity) > 0) await supabase.from("stock_movements").insert({
					product_id: newProduct.id,
					branch_id: branchId,
					movement_type: "adjustment",
					quantity_change: Number(form.stock_quantity),
					created_by: user?.id
				});
			}
			toast.success(editing ? "Updated" : "Created");
			qc.invalidateQueries({ queryKey: ["products"] });
			onClose();
		} catch (err) {
			toast.error(err.message);
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "max-w-2xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? t("edit") : t("addProduct") }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid sm:grid-cols-3 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm:col-span-2 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("productName") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.name,
							onChange: (e) => setForm({
								...form,
								name: e.target.value
							}),
							required: true
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("category") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: form.category_id,
								onChange: (e) => setForm({
									...form,
									category_id: e.target.value
								}),
								className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm h-9",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "None"
								}), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c.id,
									children: c.name
								}, c.id))]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Unit (e.g. pcs, kg, L)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.unit,
								onChange: (e) => setForm({
									...form,
									unit: e.target.value
								})
							})] })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Image URL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.image_url,
							onChange: (e) => setForm({
								...form,
								image_url: e.target.value
							}),
							placeholder: "https://..."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-24 rounded-md border border-dashed border-border bg-muted flex items-center justify-center overflow-hidden",
							children: form.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: form.image_url,
								alt: "Preview",
								className: "h-full w-full object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-6 w-6 text-muted-foreground opacity-50" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Product Code" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.sku,
						onChange: (e) => setForm({
							...form,
							sku: e.target.value
						})
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm:col-span-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Barcode" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.barcode,
							onChange: (e) => setForm({
								...form,
								barcode: e.target.value
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: [t("price"), " (TZS)"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						step: "0.01",
						value: form.price,
						onChange: (e) => setForm({
							...form,
							price: Number(e.target.value)
						}),
						required: true
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: [t("cost"), " (TZS)"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						step: "0.01",
						value: form.cost,
						onChange: (e) => setForm({
							...form,
							cost: Number(e.target.value)
						})
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("stock") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: form.stock_quantity,
							onChange: (e) => setForm({
								...form,
								stock_quantity: Number(e.target.value)
							}),
							disabled: !!editing
						}),
						!!editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-muted-foreground mt-1",
							children: "Use Inventory to adjust stock."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("lowStockAlert") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: form.low_stock_threshold,
						onChange: (e) => setForm({
							...form,
							low_stock_threshold: Number(e.target.value)
						})
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-2 pt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						onClick: onClose,
						children: t("cancel")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: saving,
						children: saving ? "..." : t("save")
					})]
				})
			]
		})]
	});
}
function CategoriesDialog() {
	const qc = useQueryClient();
	useT();
	const [name, setName] = (0, import_react.useState)("");
	const [desc, setDesc] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const { data: categories = [], isLoading } = useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			const { data } = await supabase.from("categories").select("*").order("name");
			return data ?? [];
		}
	});
	const submit = async (e) => {
		e.preventDefault();
		if (!name.trim()) return;
		setSaving(true);
		const { error } = await supabase.from("categories").insert({
			name,
			description: desc || null
		});
		setSaving(false);
		if (error) return toast.error(error.message);
		setName("");
		setDesc("");
		qc.invalidateQueries({ queryKey: ["categories"] });
	};
	const deleteCat = async (id) => {
		if (!confirm("Delete category? Products in this category will remain but without a category.")) return;
		const { error } = await supabase.from("categories").delete().eq("id", id);
		if (error) return toast.error(error.message);
		qc.invalidateQueries({ queryKey: ["categories"] });
		qc.invalidateQueries({ queryKey: ["products"] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Manage Categories" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "flex gap-2 items-end",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						required: true,
						placeholder: "e.g. Electronics"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: desc,
						onChange: (e) => setDesc(e.target.value),
						placeholder: "Optional"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: saving || !name.trim(),
					children: "Add"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border border-border rounded-md max-h-[40vh] overflow-y-auto",
			children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-4 text-center text-sm text-muted-foreground",
				children: "Loading..."
			}) : categories.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-4 text-center text-sm text-muted-foreground",
				children: "No categories yet"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y divide-border",
				children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between items-center p-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: c.name
					}), c.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: c.description
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						onClick: () => deleteCat(c.id),
						className: "h-8 w-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
					})]
				}, c.id))
			})
		})]
	})] });
}
function BulkImportDialog({ onClose }) {
	const qc = useQueryClient();
	useT();
	const { branchId, user } = useAuth();
	const [file, setFile] = (0, import_react.useState)(null);
	const [importing, setImporting] = (0, import_react.useState)(false);
	const [results, setResults] = (0, import_react.useState)(null);
	const handleDownloadTemplate = () => {
		const csvContent = "data:text/csv;charset=utf-8," + [
			"Name",
			"Category",
			"Product Code",
			"Barcode",
			"Price",
			"Cost",
			"Stock",
			"Low Stock Alert",
			"Unit"
		].join(",") + "\nExample Product,Electronics,SKU123,123456789,15000,10000,50,5,pcs";
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "mauzochap_products_template.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	const handleImport = async () => {
		if (!file) return toast.error("Please select a file");
		if (!branchId) return toast.error("No active branch");
		setImporting(true);
		setResults(null);
		import_papaparse.default.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: async (results) => {
				try {
					const rows = results.data;
					const errors = [];
					const validProducts = [];
					const uniqueCategories = Array.from(new Set(rows.map((r) => r["Category"]?.trim()).filter(Boolean)));
					const { data: existingCats } = await supabase.from("categories").select("id, name");
					const catMap = new Map((existingCats || []).map((c) => [c.name.toLowerCase(), c.id]));
					for (const catName of uniqueCategories) if (!catMap.has(catName.toLowerCase())) {
						const { data: newCat } = await supabase.from("categories").insert({ name: catName }).select("id, name").single();
						if (newCat) catMap.set(newCat.name.toLowerCase(), newCat.id);
					}
					for (const [index, row] of rows.entries()) {
						const name = row["Name"]?.trim();
						const price = parseFloat(row["Price"]);
						if (!name) {
							errors.push(`Row ${index + 1}: Name is required`);
							continue;
						}
						if (isNaN(price)) {
							errors.push(`Row ${index + 1}: Price is required and must be a number`);
							continue;
						}
						const catName = row["Category"]?.trim();
						const catId = catName ? catMap.get(catName.toLowerCase()) : null;
						validProducts.push({
							name,
							price,
							cost: parseFloat(row["Cost"]) || 0,
							sku: row["Product Code"]?.trim() || null,
							barcode: row["Barcode"]?.trim() || null,
							category_id: catId,
							stock_quantity: parseInt(row["Stock"]) || 0,
							low_stock_threshold: parseInt(row["Low Stock Alert"]) || 5,
							unit: row["Unit"]?.trim() || "pcs"
						});
					}
					if (validProducts.length === 0) {
						setImporting(false);
						setResults({
							success: 0,
							errors: ["No valid products found in CSV"]
						});
						return;
					}
					const productsToInsert = validProducts.map(({ stock_quantity, ...rest }) => rest);
					const { data: insertedProducts, error: pErr } = await supabase.from("products").insert(productsToInsert).select("id");
					if (pErr) throw pErr;
					const inventoryToInsert = [];
					const movementsToInsert = [];
					for (let i = 0; i < insertedProducts.length; i++) {
						const product = insertedProducts[i];
						const stock = validProducts[i].stock_quantity;
						inventoryToInsert.push({
							branch_id: branchId,
							product_id: product.id,
							stock_quantity: stock
						});
						if (stock > 0) movementsToInsert.push({
							product_id: product.id,
							branch_id: branchId,
							movement_type: "adjustment",
							quantity_change: stock,
							created_by: user?.id
						});
					}
					const { error: invErr } = await supabase.from("branch_inventory").insert(inventoryToInsert);
					if (invErr) throw invErr;
					if (movementsToInsert.length > 0) {
						const { error: movErr } = await supabase.from("stock_movements").insert(movementsToInsert);
						if (movErr) throw movErr;
					}
					setResults({
						success: insertedProducts.length,
						errors
					});
					qc.invalidateQueries({ queryKey: ["products"] });
					qc.invalidateQueries({ queryKey: ["categories"] });
				} catch (err) {
					toast.error(err.message || "Import failed");
				} finally {
					setImporting(false);
				}
			},
			error: (error) => {
				toast.error("Failed to parse CSV: " + error.message);
				setImporting(false);
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Bulk Import Products" }) }), !results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-muted/30 p-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-medium text-sm",
						children: "How it works"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "list-decimal list-inside text-xs text-muted-foreground space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Download the template CSV below." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Fill it in using Excel or Google Sheets." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Upload the saved CSV file here." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "We will automatically create missing categories." })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: handleDownloadTemplate,
						className: "w-full mt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4 mr-2" }), " Download Template"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Select CSV File" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "file",
					accept: ".csv",
					onChange: (e) => setFile(e.target.files?.[0] || null)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-end gap-2 pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: onClose,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: handleImport,
					disabled: !file || importing,
					children: importing ? "Importing..." : "Start Import"
				})]
			})
		]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 py-4 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto h-12 w-12 rounded-full bg-success/20 flex items-center justify-center mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-6 w-6 text-success" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-xl font-bold",
				children: "Import Complete!"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-muted-foreground",
				children: [
					"Successfully imported ",
					results.success,
					" products."
				]
			}),
			results.errors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-left mt-4 max-h-32 overflow-y-auto rounded bg-destructive/10 p-3 text-xs text-destructive",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold mb-1",
					children: "Errors skipped:"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "list-disc pl-4 space-y-1",
					children: results.errors.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: e }, i))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: onClose,
				className: "w-full mt-6",
				children: "Done"
			})
		]
	})] });
}
//#endregion
export { ProductsPage as component };
