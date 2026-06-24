import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-C3cIRk-V.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useAuth } from "./use-auth-eGZW1w9W.mjs";
import { i as useT, n as formatTZS, t as formatDate } from "./i18n-C8ZZqtNN.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-DSKqFpbT.mjs";
import { n as Label, t as Input } from "./label-Cdxd-27C.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as Pencil, b as Search, i as User, rt as Banknote, u as Trash2, w as Plus } from "../_libs/lucide-react.mjs";
import { a as DialogTrigger, i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-CBFrTUY_.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as stringType, r as objectType, t as literalType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/customers-BFQqIss2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var customerSchema = objectType({
	name: stringType().min(1, "Name is required"),
	phone: stringType().optional().nullable(),
	email: stringType().email("Invalid email").optional().or(literalType("")).nullable(),
	address: stringType().optional().nullable()
});
function CustomersPage() {
	const t = useT();
	const qc = useQueryClient();
	const { isManager } = useAuth();
	const [search, setSearch] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [paymentOpen, setPaymentOpen] = (0, import_react.useState)(false);
	const [payingCustomer, setPayingCustomer] = (0, import_react.useState)(null);
	const [profileCustomer, setProfileCustomer] = (0, import_react.useState)(null);
	const [page, setPage] = (0, import_react.useState)(1);
	const ITEMS_PER_PAGE = 50;
	const { data: customers = [], isLoading } = useQuery({
		queryKey: ["customers"],
		queryFn: async () => {
			const { data } = await supabase.from("customers").select("*").order("name");
			return data ?? [];
		}
	});
	const filtered = customers.filter((c) => (c.name || "").toLowerCase().includes(search.toLowerCase()) || (c.phone ?? "").includes(search) || (c.email ?? "").toLowerCase().includes(search.toLowerCase()));
	const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
	const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
	const handleDelete = async (id) => {
		if (!confirm("Are you sure you want to delete this customer?")) return;
		const { error } = await supabase.from("customers").delete().eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Deleted");
		qc.invalidateQueries({ queryKey: ["customers"] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between flex-wrap gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold",
					children: t("customers")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [customers.length, " customers"]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open,
					onOpenChange: (o) => {
						setOpen(o);
						if (!o) setEditing(null);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => setEditing(null),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-2" }), t("addCustomer")]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerDialog, {
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
					placeholder: t("search") + " customers...",
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
								children: "Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: t("phone")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: t("email")
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
							colSpan: 5,
							className: "px-4 py-10 text-center text-muted-foreground",
							children: t("loading")
						}) }) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 5,
							className: "px-4 py-10 text-center text-muted-foreground",
							children: t("noData")
						}) }) : paginated.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-muted/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-medium",
									children: c.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: c.phone ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: c.email ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: c.balance > 0 ? "text-warning font-semibold" : "",
										children: formatTZS(Number(c.balance))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3 text-right space-x-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "ghost",
											className: "h-8 text-primary",
											onClick: () => setProfileCustomer(c),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 mr-2" }), " Profile"]
										}),
										c.balance > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											className: "h-8",
											onClick: () => {
												setPayingCustomer(c);
												setPaymentOpen(true);
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "h-4 w-4 mr-2" }), t("receivePayment")]
										}),
										isManager && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											className: "h-8 w-8",
											onClick: () => {
												setEditing(c);
												setOpen(true);
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											className: "h-8 w-8",
											onClick: () => handleDelete(c.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
										})] })
									]
								})
							]
						}, c.id))
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
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentDialog, {
					customer: payingCustomer,
					onClose: () => setPaymentOpen(false)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!profileCustomer,
				onOpenChange: (o) => !o && setProfileCustomer(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerProfileDialog, {
					customer: profileCustomer,
					onClose: () => setProfileCustomer(null)
				})
			})
		]
	});
}
function CustomerDialog({ editing, onClose }) {
	const t = useT();
	const qc = useQueryClient();
	const [form, setForm] = (0, import_react.useState)({
		name: editing?.name ?? "",
		phone: editing?.phone ?? "",
		email: editing?.email ?? "",
		address: editing?.address ?? ""
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const submit = async (e) => {
		e.preventDefault();
		setSaving(true);
		try {
			const payload = {
				name: form.name,
				phone: form.phone || null,
				email: form.email || null,
				address: form.address || null
			};
			const parsed = customerSchema.safeParse(payload);
			if (!parsed.success) {
				parsed.error.errors.forEach((err) => toast.error(err.message));
				return;
			}
			const { error } = editing ? await supabase.from("customers").update(payload).eq("id", editing.id) : await supabase.from("customers").insert(payload);
			if (error) throw error;
			toast.success(editing ? "Customer updated" : "Customer added");
			qc.invalidateQueries({ queryKey: ["customers"] });
			onClose();
		} catch (err) {
			toast.error(err.message);
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? t("edit") : t("addCustomer") }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: form.name,
				onChange: (e) => setForm({
					...form,
					name: e.target.value
				}),
				required: true
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("phone") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: form.phone,
				onChange: (e) => setForm({
					...form,
					phone: e.target.value
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("email") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "email",
				value: form.email,
				onChange: (e) => setForm({
					...form,
					email: e.target.value
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Address" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: form.address,
				onChange: (e) => setForm({
					...form,
					address: e.target.value
				})
			})] }),
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
function PaymentDialog({ customer, onClose }) {
	const t = useT();
	const qc = useQueryClient();
	const { user } = useAuth();
	const [amount, setAmount] = (0, import_react.useState)("");
	const [method, setMethod] = (0, import_react.useState)("cash");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	if (!customer) return null;
	const submit = async (e) => {
		e.preventDefault();
		if (!amount || amount <= 0) return toast.error("Invalid amount");
		setSaving(true);
		try {
			const { error } = await supabase.from("customer_payments").insert({
				customer_id: customer.id,
				amount: Number(amount),
				payment_method: method,
				notes: notes || null,
				received_by: user?.id
			});
			if (error) throw error;
			toast.success("Payment recorded successfully");
			qc.invalidateQueries({ queryKey: ["customers"] });
			onClose();
		} catch (err) {
			toast.error(err.message);
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: t("receivePayment") }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg bg-muted p-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-muted-foreground",
						children: "Customer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-semibold",
						children: customer.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between mt-2 pt-2 border-t border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Outstanding Balance" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-warning",
							children: formatTZS(customer.balance)
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: [t("paymentAmount"), " (TZS)"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "number",
				step: "0.01",
				max: customer.balance,
				value: amount,
				onChange: (e) => setAmount(Number(e.target.value)),
				required: true,
				autoFocus: true
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("paymentMethod") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 grid grid-cols-2 gap-2 sm:grid-cols-4",
				children: [
					"cash",
					"mobile_money",
					"card",
					"bank"
				].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMethod(m),
					className: `rounded-md border px-2 py-2 text-xs font-medium capitalize ${method === m ? "border-primary bg-primary/10 text-primary" : "border-border bg-background"}`,
					children: m.replace("_", " ")
				}, m))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Notes (Optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: notes,
				onChange: (e) => setNotes(e.target.value)
			})] }),
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
function CustomerProfileDialog({ customer, onClose }) {
	const [tab, setTab] = (0, import_react.useState)("purchases");
	const { data: sales = [], isLoading: loadingSales } = useQuery({
		queryKey: ["customer-sales", customer?.id],
		enabled: !!customer,
		queryFn: async () => {
			const { data } = await supabase.from("sales").select("*").eq("customer_id", customer.id).order("created_at", { ascending: false });
			return data ?? [];
		}
	});
	const { data: payments = [], isLoading: loadingPayments } = useQuery({
		queryKey: ["customer-payments", customer?.id],
		enabled: !!customer,
		queryFn: async () => {
			const { data } = await supabase.from("customer_payments").select("*").eq("customer_id", customer.id).order("created_at", { ascending: false });
			return data ?? [];
		}
	});
	if (!customer) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "max-w-4xl max-h-[85vh] flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Customer Profile" }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-4 p-4 rounded-xl border border-border bg-muted/20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold",
						children: customer.name.charAt(0).toUpperCase()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-bold",
							children: customer.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm text-muted-foreground flex gap-4 mt-1",
							children: [
								customer.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: customer.phone }),
								customer.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: customer.email }),
								customer.address && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: customer.address })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: "Current Balance"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `text-2xl font-bold ${customer.balance > 0 ? "text-warning" : "text-success"}`,
							children: formatTZS(customer.balance)
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
								children: "Receipt"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Total"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Paid"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Method"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: loadingSales ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 5,
							className: "px-4 py-8 text-center",
							children: "Loading..."
						}) }) : sales.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 5,
							className: "px-4 py-8 text-center text-muted-foreground",
							children: "No purchases found."
						}) }) : sales.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-muted/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 whitespace-nowrap",
									children: formatDate(s.created_at)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-mono",
									children: s.receipt_number
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right font-medium",
									children: formatTZS(s.total)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right text-success",
									children: formatTZS(s.amount_paid)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right capitalize",
									children: s.payment_method
								})
							]
						}, s.id))
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
								children: "Notes"
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
export { CustomersPage as component };
