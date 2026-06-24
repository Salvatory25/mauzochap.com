import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-C3cIRk-V.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useAuth } from "./use-auth-eGZW1w9W.mjs";
import { i as useT, n as formatTZS, t as formatDate } from "./i18n-C8ZZqtNN.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-DSKqFpbT.mjs";
import { n as Label, t as Input } from "./label-Cdxd-27C.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { G as CloudDownload, L as History, b as Search, y as Settings2, z as FileDown } from "../_libs/lucide-react.mjs";
import { a as DialogTrigger, i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-CBFrTUY_.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inventory-DnRVIrnG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InventoryPage() {
	const t = useT();
	const { isManager, branchId } = useAuth();
	const [search, setSearch] = (0, import_react.useState)("");
	const [receiveOpen, setReceiveOpen] = (0, import_react.useState)(false);
	const [adjustOpen, setAdjustOpen] = (0, import_react.useState)(false);
	const [historyOpen, setHistoryOpen] = (0, import_react.useState)(false);
	const [page, setPage] = (0, import_react.useState)(1);
	const ITEMS_PER_PAGE = 50;
	const { data: products = [], isLoading } = useQuery({
		queryKey: ["products-inventory", branchId],
		enabled: !!branchId,
		queryFn: async () => {
			const { data, error } = await supabase.from("products").select(`id,name,sku,low_stock_threshold,cost, branch_inventory!inner(stock_quantity)`).eq("branch_inventory.branch_id", branchId).order("name");
			if (error) throw error;
			return (data ?? []).map((p) => ({
				...p,
				stock_quantity: p.branch_inventory?.[0]?.stock_quantity || 0
			}));
		}
	});
	const filtered = products.filter((p) => (p.name || "").toLowerCase().includes(search.toLowerCase()) || (p.sku || "").toLowerCase().includes(search.toLowerCase()));
	const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
	const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
	const exportCSV = () => {
		const header = [
			"Product",
			"SKU",
			"In Stock",
			"Cost Value (TZS)",
			"Status"
		];
		const rows = filtered.map((p) => {
			const status = p.stock_quantity <= 0 ? "Out of Stock" : p.stock_quantity <= p.low_stock_threshold ? "Low Stock" : "In Stock";
			return `"${p.name}","${p.sku || ""}","${p.stock_quantity}","${p.stock_quantity * p.cost}","${status}"`;
		});
		const csvContent = "data:text/csv;charset=utf-8," + [header.join(","), ...rows].join("\n");
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", `inventory_report_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success("Report downloaded");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between flex-wrap gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold",
					children: t("inventory")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [products.length, " active products in inventory"]
				})] }), isManager && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
							open: historyOpen,
							onOpenChange: setHistoryOpen,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									className: "border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-4 w-4 mr-2" }), " Stock History"]
								})
							}), historyOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockHistoryDialog, { onClose: () => setHistoryOpen(false) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
							open: adjustOpen,
							onOpenChange: setAdjustOpen,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									className: "border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "h-4 w-4 mr-2" }), " Adjust Stock"]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdjustStockDialog, {
								products,
								onClose: () => setAdjustOpen(false)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
							open: receiveOpen,
							onOpenChange: setReceiveOpen,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudDownload, { className: "h-4 w-4 mr-2" }), " Receive Purchase"] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceivePurchaseDialog, {
								products,
								onClose: () => setReceiveOpen(false)
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: search,
						onChange: (e) => {
							setSearch(e.target.value);
							setPage(1);
						},
						placeholder: "Search products...",
						className: "pl-10"
					})]
				}), isManager && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					onClick: exportCSV,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "h-4 w-4 mr-2" }), " Export Report"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-border bg-card overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Product"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "SKU"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "In Stock"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Cost Value"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Status"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 5,
							className: "px-4 py-10 text-center text-muted-foreground",
							children: t("loading")
						}) }) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 5,
							className: "px-4 py-10 text-center text-muted-foreground",
							children: t("noData")
						}) }) : paginated.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-muted/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-medium",
									children: p.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: p.sku || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right text-lg font-bold",
									children: p.stock_quantity
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right text-muted-foreground",
									children: formatTZS(p.stock_quantity * p.cost)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right",
									children: p.stock_quantity <= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive",
										children: "Out of Stock"
									}) : p.stock_quantity <= p.low_stock_threshold ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex items-center rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning",
										children: "Low Stock"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success",
										children: "In Stock"
									})
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
function StockHistoryDialog({ onClose }) {
	const { branchId } = useAuth();
	const { data: movements = [], isLoading } = useQuery({
		queryKey: ["stock-movements", branchId],
		enabled: !!branchId,
		queryFn: async () => {
			const { data, error } = await supabase.from("stock_movements").select(`
          id, movement_type, quantity_change, notes, created_at,
          products(name, sku),
          profiles(full_name)
        `).eq("branch_id", branchId).order("created_at", { ascending: false }).limit(100);
			if (error) throw error;
			return data;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "max-w-4xl max-h-[80vh] flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Stock Movement History" }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-auto mt-4 rounded-md border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/50 sticky top-0 text-xs uppercase tracking-wider text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Product"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Type"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Change"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "User"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Notes"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 6,
							className: "px-4 py-8 text-center",
							children: "Loading history..."
						}) }) : movements.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 6,
							className: "px-4 py-8 text-center text-muted-foreground",
							children: "No stock movements found."
						}) }) : movements.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-muted/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 whitespace-nowrap text-muted-foreground text-xs",
									children: formatDate(m.created_at)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3 font-medium",
									children: [
										m.products?.name,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground text-xs font-normal",
											children: [
												"(",
												m.products?.sku || "-",
												")"
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 capitalize",
									children: m.movement_type
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right font-mono font-medium",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: m.quantity_change > 0 ? "text-success" : "text-destructive",
										children: [m.quantity_change > 0 ? "+" : "", m.quantity_change]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: m.profiles?.full_name || "System"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground text-xs",
									children: m.notes || "—"
								})
							]
						}, m.id))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pt-2 text-right",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: onClose,
					variant: "ghost",
					children: "Close"
				})
			})
		]
	});
}
function AdjustStockDialog({ products, onClose }) {
	const qc = useQueryClient();
	const { user, branchId } = useAuth();
	const [productId, setProductId] = (0, import_react.useState)("");
	const [quantity, setQuantity] = (0, import_react.useState)(0);
	const [notes, setNotes] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const submit = async (e) => {
		e.preventDefault();
		if (!productId || quantity === 0 || !branchId) return toast.error("Invalid adjustment");
		setSaving(true);
		try {
			const { error: moveErr } = await supabase.from("stock_movements").insert({
				product_id: productId,
				branch_id: branchId,
				movement_type: "adjustment",
				quantity_change: quantity,
				notes,
				created_by: user?.id
			});
			if (moveErr) throw moveErr;
			const product = products.find((p) => p.id === productId);
			if (!product) throw new Error("Product not found");
			const { error: prodErr } = await supabase.from("branch_inventory").update({ stock_quantity: product.stock_quantity + quantity }).match({
				product_id: productId,
				branch_id: branchId
			});
			if (prodErr) throw prodErr;
			toast.success("Stock adjusted successfully");
			qc.invalidateQueries({ queryKey: ["products-inventory"] });
			onClose();
		} catch (err) {
			toast.error(err.message);
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Adjust Stock" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Select Product" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				value: productId,
				onChange: (e) => setProductId(e.target.value),
				className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
				required: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "-- Select Product --"
				}), products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
					value: p.id,
					children: [
						p.name,
						" (Current: ",
						p.stock_quantity,
						")"
					]
				}, p.id))]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Quantity Adjustment (+ to add, - to remove)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "number",
				value: quantity,
				onChange: (e) => setQuantity(Number(e.target.value)),
				required: true,
				placeholder: "-5 or +10"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reason / Notes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: notes,
				onChange: (e) => setNotes(e.target.value),
				placeholder: "e.g. Damaged goods, inventory count correction",
				required: true
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-end gap-2 pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					onClick: onClose,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: saving || !productId || quantity === 0,
					children: saving ? "..." : "Adjust Stock"
				})]
			})
		]
	})] });
}
function ReceivePurchaseDialog({ products, onClose }) {
	const qc = useQueryClient();
	const { user, branchId } = useAuth();
	const [supplierId, setSupplierId] = (0, import_react.useState)("");
	const [invoiceNumber, setInvoiceNumber] = (0, import_react.useState)("");
	const [productId, setProductId] = (0, import_react.useState)("");
	const [quantity, setQuantity] = (0, import_react.useState)(1);
	const [unitCost, setUnitCost] = (0, import_react.useState)(0);
	const [amountPaid, setAmountPaid] = (0, import_react.useState)("");
	const [batchNumber, setBatchNumber] = (0, import_react.useState)("");
	const [expiryDate, setExpiryDate] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const { data: suppliers = [] } = useQuery({
		queryKey: ["suppliers-list"],
		queryFn: async () => {
			const { data } = await supabase.from("suppliers").select("id,name").order("name");
			return data ?? [];
		}
	});
	const submit = async (e) => {
		e.preventDefault();
		if (!productId || quantity <= 0 || !supplierId || !branchId) return toast.error("Please fill all required fields");
		setSaving(true);
		try {
			const lineTotal = quantity * unitCost;
			const paid = amountPaid === "" ? lineTotal : Number(amountPaid);
			const { data: purchase, error: purchErr } = await supabase.from("purchases").insert({
				supplier_id: supplierId,
				branch_id: branchId,
				invoice_number: invoiceNumber || null,
				total_amount: lineTotal,
				amount_paid: paid,
				created_by: user?.id
			}).select().single();
			if (purchErr) throw purchErr;
			const { error: itemErr } = await supabase.from("purchase_items").insert({
				purchase_id: purchase.id,
				product_id: productId,
				quantity,
				unit_cost: unitCost,
				line_total: lineTotal
			});
			if (itemErr) throw itemErr;
			if (batchNumber) await supabase.from("product_batches").insert({
				product_id: productId,
				branch_id: branchId,
				batch_number: batchNumber,
				expiry_date: expiryDate || null,
				stock_quantity: quantity
			});
			toast.success("Purchase received successfully");
			qc.invalidateQueries();
			onClose();
		} catch (err) {
			toast.error(err.message);
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "max-w-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Receive Purchase from Supplier" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Supplier" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: supplierId,
						onChange: (e) => setSupplierId(e.target.value),
						className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
						required: true,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "-- Select --"
						}), suppliers.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s.id,
							children: s.name
						}, s.id))]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Invoice Number (Optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: invoiceNumber,
						onChange: (e) => setInvoiceNumber(e.target.value)
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border pt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Product to Restock" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: productId,
						onChange: (e) => {
							setProductId(e.target.value);
							const p = products.find((x) => x.id === e.target.value);
							if (p) setUnitCost(p.cost || 0);
						},
						className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
						required: true,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "-- Select Product --"
						}), products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: p.id,
							children: p.name
						}, p.id))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Quantity Received" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: "1",
						value: quantity,
						onChange: (e) => setQuantity(Number(e.target.value)),
						required: true
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Unit Cost (TZS)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						step: "0.01",
						value: unitCost,
						onChange: (e) => setUnitCost(Number(e.target.value)),
						required: true
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Batch/Lot Number" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: batchNumber,
						onChange: (e) => setBatchNumber(e.target.value),
						placeholder: "Optional"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Expiry Date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: expiryDate,
						onChange: (e) => setExpiryDate(e.target.value)
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border pt-4 grid grid-cols-2 gap-3 items-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Total Value" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-lg font-bold",
						children: formatTZS(quantity * unitCost)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Amount Paid" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							placeholder: String(quantity * unitCost),
							value: amountPaid,
							onChange: (e) => setAmountPaid(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-muted-foreground mt-1",
							children: "Leave empty if fully paid."
						})
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-2 pt-2 border-t border-border mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						onClick: onClose,
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: saving || !productId || !supplierId,
						children: saving ? "..." : "Complete Purchase"
					})]
				})
			]
		})]
	});
}
//#endregion
export { InventoryPage as component };
