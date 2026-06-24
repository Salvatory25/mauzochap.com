import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-C3cIRk-V.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useAuth } from "./use-auth-eGZW1w9W.mjs";
import { i as useT, n as formatTZS, t as formatDate } from "./i18n-C8ZZqtNN.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-DSKqFpbT.mjs";
import { n as Label, t as Input } from "./label-Cdxd-27C.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as Pencil, b as Search, i as User, rt as Banknote, s as Truck, u as Trash2, w as Plus } from "../_libs/lucide-react.mjs";
import { a as DialogTrigger, i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-CBFrTUY_.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as stringType, n as numberType, r as objectType, t as literalType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/suppliers-CNmE4ry4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var supplierSchema = objectType({
	name: stringType().min(1, "Supplier name is required"),
	phone: stringType().optional().nullable(),
	email: stringType().email("Invalid email").optional().or(literalType("")).nullable(),
	address: stringType().optional().nullable(),
	balance: numberType().min(0, "Balance cannot be negative")
});
function SuppliersPage() {
	const t = useT();
	const qc = useQueryClient();
	const { isManager } = useAuth();
	const [search, setSearch] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [paymentOpen, setPaymentOpen] = (0, import_react.useState)(false);
	const [payingSupplier, setPayingSupplier] = (0, import_react.useState)(null);
	const [profileSupplier, setProfileSupplier] = (0, import_react.useState)(null);
	const [page, setPage] = (0, import_react.useState)(1);
	const ITEMS_PER_PAGE = 50;
	const { data: suppliers = [], isLoading } = useQuery({
		queryKey: ["suppliers"],
		queryFn: async () => {
			const { data, error } = await supabase.from("suppliers").select("*").order("name");
			if (error) throw error;
			return data;
		}
	});
	const filtered = suppliers.filter((s) => (s.name || "").toLowerCase().includes(search.toLowerCase()) || (s.phone ?? "").includes(search) || (s.email ?? "").toLowerCase().includes(search.toLowerCase()));
	const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
	const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
	const handleDelete = async (id) => {
		if (!confirm("Are you sure you want to delete this supplier?")) return;
		const { error } = await supabase.from("suppliers").delete().eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Deleted successfully");
		qc.invalidateQueries({ queryKey: ["suppliers"] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between flex-wrap gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold",
					children: t("suppliers")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [suppliers.length, " suppliers registered"]
				})] }), isManager && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open,
					onOpenChange: (o) => {
						setOpen(o);
						if (!o) setEditing(null);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => setEditing(null),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-2" }), " Add Supplier"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupplierDialog, {
						editing,
						onClose: () => setOpen(false)
					})]
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
					placeholder: "Search suppliers...",
					className: "pl-10 max-w-md"
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
								children: "Supplier"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Contact"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Balance"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-3" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 4,
							className: "px-4 py-10 text-center text-muted-foreground",
							children: t("loading")
						}) }) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 4,
							className: "px-4 py-10 text-center text-muted-foreground",
							children: t("noData")
						}) }) : paginated.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-muted/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-medium flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4 text-muted-foreground" }), s.name]
									}), s.address && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: s.address
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: s.phone || "—" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs",
										children: s.email
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: s.balance > 0 ? "text-warning font-semibold" : "",
										children: formatTZS(s.balance)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3 text-right space-x-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "ghost",
											className: "h-8 text-primary",
											onClick: () => setProfileSupplier(s),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 mr-2" }), " Profile"]
										}),
										isManager && s.balance > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											className: "h-8",
											onClick: () => {
												setPayingSupplier(s);
												setPaymentOpen(true);
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "h-4 w-4 mr-2" }), "Pay Supplier"]
										}),
										isManager && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											className: "h-8 w-8",
											onClick: () => {
												setEditing(s);
												setOpen(true);
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											onClick: () => handleDelete(s.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
										})] })
									]
								})
							]
						}, s.id))
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
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: paymentOpen,
				onOpenChange: setPaymentOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupplierPaymentDialog, {
					supplier: payingSupplier,
					onClose: () => setPaymentOpen(false)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!profileSupplier,
				onOpenChange: (o) => !o && setProfileSupplier(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupplierProfileDialog, {
					supplier: profileSupplier,
					onClose: () => setProfileSupplier(null)
				})
			})
		]
	});
}
function SupplierDialog({ editing, onClose }) {
	const qc = useQueryClient();
	const t = useT();
	const [form, setForm] = (0, import_react.useState)({
		name: editing?.name ?? "",
		phone: editing?.phone ?? "",
		email: editing?.email ?? "",
		address: editing?.address ?? "",
		balance: editing?.balance ?? 0
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const submit = async (e) => {
		e.preventDefault();
		setSaving(true);
		try {
			const payload = {
				...form,
				phone: form.phone || null,
				email: form.email || null,
				address: form.address || null,
				balance: Number(form.balance)
			};
			const parsed = supplierSchema.safeParse(payload);
			if (!parsed.success) {
				parsed.error.errors.forEach((err) => toast.error(err.message));
				return;
			}
			const { error } = editing ? await supabase.from("suppliers").update(payload).eq("id", editing.id) : await supabase.from("suppliers").insert(payload);
			if (error) throw error;
			toast.success(editing ? "Supplier updated" : "Supplier created");
			qc.invalidateQueries({ queryKey: ["suppliers"] });
			onClose();
		} catch (err) {
			toast.error(err.message);
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit Supplier" : "Add Supplier" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Supplier Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: form.name,
				onChange: (e) => setForm({
					...form,
					name: e.target.value
				}),
				required: true
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: form.phone,
					onChange: (e) => setForm({
						...form,
						phone: e.target.value
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "email",
					value: form.email,
					onChange: (e) => setForm({
						...form,
						email: e.target.value
					})
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Address" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: form.address,
				onChange: (e) => setForm({
					...form,
					address: e.target.value
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Initial Balance (TZS)" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					value: form.balance,
					onChange: (e) => setForm({
						...form,
						balance: Number(e.target.value)
					}),
					disabled: !!editing
				}),
				!!editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-1",
					children: "Balance is updated via purchases and payments."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-end gap-2 pt-2",
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
	})] });
}
function SupplierPaymentDialog({ supplier, onClose }) {
	const qc = useQueryClient();
	const { user } = useAuth();
	const [amount, setAmount] = (0, import_react.useState)("");
	const [method, setMethod] = (0, import_react.useState)("bank");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	if (!supplier) return null;
	const submit = async (e) => {
		e.preventDefault();
		if (!amount || amount <= 0) return toast.error("Invalid amount");
		setSaving(true);
		try {
			const { error } = await supabase.from("supplier_payments").insert({
				supplier_id: supplier.id,
				amount: Number(amount),
				payment_method: method,
				notes: notes || null,
				paid_by: user?.id
			});
			if (error) throw error;
			toast.success("Payment recorded successfully");
			qc.invalidateQueries({ queryKey: ["suppliers"] });
			onClose();
		} catch (err) {
			toast.error(err.message);
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Pay Supplier" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg bg-muted p-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-muted-foreground",
						children: "Supplier"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-semibold",
						children: supplier.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between mt-2 pt-2 border-t border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Outstanding Balance to Pay" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-warning",
							children: formatTZS(supplier.balance)
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Amount to Pay (TZS)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "number",
				step: "0.01",
				max: supplier.balance,
				value: amount,
				onChange: (e) => setAmount(Number(e.target.value)),
				required: true,
				autoFocus: true
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Payment Method" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 grid grid-cols-3 gap-2",
				children: [
					"cash",
					"mobile_money",
					"bank"
				].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMethod(m),
					className: `rounded-md border px-2 py-2 text-xs font-medium capitalize ${method === m ? "border-primary bg-primary/10 text-primary" : "border-border bg-background"}`,
					children: m.replace("_", " ")
				}, m))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reference / Notes (Optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: notes,
				onChange: (e) => setNotes(e.target.value),
				placeholder: "e.g. Bank Transfer Ref: TR123"
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
					disabled: saving,
					children: saving ? "..." : "Record Payment"
				})]
			})
		]
	})] });
}
function SupplierProfileDialog({ supplier, onClose }) {
	const [tab, setTab] = (0, import_react.useState)("purchases");
	const { data: purchases = [], isLoading: loadingPurchases } = useQuery({
		queryKey: ["supplier-purchases", supplier?.id],
		enabled: !!supplier,
		queryFn: async () => {
			const { data } = await supabase.from("purchases").select("*").eq("supplier_id", supplier.id).order("created_at", { ascending: false });
			return data ?? [];
		}
	});
	const { data: payments = [], isLoading: loadingPayments } = useQuery({
		queryKey: ["supplier-payments", supplier?.id],
		enabled: !!supplier,
		queryFn: async () => {
			const { data } = await supabase.from("supplier_payments").select("*").eq("supplier_id", supplier.id).order("created_at", { ascending: false });
			return data ?? [];
		}
	});
	if (!supplier) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "max-w-4xl max-h-[85vh] flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Supplier Profile" }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-4 p-4 rounded-xl border border-border bg-muted/20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-8 w-8" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-bold",
							children: supplier.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm text-muted-foreground flex gap-4 mt-1",
							children: [
								supplier.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: supplier.phone }),
								supplier.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: supplier.email }),
								supplier.address && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: supplier.address })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: "Outstanding Balance"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `text-2xl font-bold ${supplier.balance > 0 ? "text-warning" : "text-success"}`,
							children: formatTZS(supplier.balance)
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 border-b border-border mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setTab("purchases"),
					className: `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === "purchases" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`,
					children: "Purchase History"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setTab("payments"),
					className: `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === "payments" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`,
					children: "Payment History"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 overflow-auto mt-2",
				children: [tab === "purchases" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
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
								children: "Invoice No"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Total Amount"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Amount Paid"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: loadingPurchases ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 4,
							className: "px-4 py-8 text-center",
							children: "Loading..."
						}) }) : purchases.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 4,
							className: "px-4 py-8 text-center text-muted-foreground",
							children: "No purchases found."
						}) }) : purchases.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-muted/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 whitespace-nowrap",
									children: formatDate(p.created_at)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-mono",
									children: p.invoice_number || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right font-medium",
									children: formatTZS(p.total_amount)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right text-success",
									children: formatTZS(p.amount_paid)
								})
							]
						}, p.id))
					})]
				}), tab === "payments" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/50 sticky top-0 text-xs uppercase tracking-wider text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Amount Paid"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Method"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left pl-8",
								children: "Notes/Ref"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: loadingPayments ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 4,
							className: "px-4 py-8 text-center",
							children: "Loading..."
						}) }) : payments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 4,
							className: "px-4 py-8 text-center text-muted-foreground",
							children: "No payments found."
						}) }) : payments.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-muted/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 whitespace-nowrap",
									children: formatDate(p.created_at)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3 text-right font-medium text-success",
									children: ["+", formatTZS(p.amount)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right capitalize",
									children: p.payment_method.replace("_", " ")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 pl-8 text-muted-foreground text-xs",
									children: p.notes || "—"
								})
							]
						}, p.id))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pt-4 border-t border-border flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: onClose,
					children: "Close Profile"
				})
			})
		]
	});
}
//#endregion
export { SuppliersPage as component };
