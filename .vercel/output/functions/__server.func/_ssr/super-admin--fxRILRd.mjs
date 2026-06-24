import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-C3cIRk-V.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useAuth } from "./use-auth-eGZW1w9W.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-DSKqFpbT.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { K as Clock, U as CreditCard, Y as CircleCheck, _ as ShieldAlert, ot as Activity, tt as Building2 } from "../_libs/lucide-react.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/super-admin--fxRILRd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SuperAdminDashboard() {
	const { isSuperAdmin } = useAuth();
	const qc = useQueryClient();
	const [activeTab, setActiveTab] = (0, import_react.useState)("businesses");
	const [bPage, setBPage] = (0, import_react.useState)(1);
	const [pPage, setPPage] = (0, import_react.useState)(1);
	const ITEMS_PER_PAGE = 50;
	const { data: businesses = [], isLoading: bLoading } = useQuery({
		queryKey: ["super-admin-businesses"],
		enabled: isSuperAdmin,
		queryFn: async () => {
			const { data, error } = await supabase.from("businesses").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	const { data: payments = [], isLoading: pLoading } = useQuery({
		queryKey: ["super-admin-payments"],
		enabled: isSuperAdmin,
		queryFn: async () => {
			const { data, error } = await supabase.from("payments").select("*, businesses(business_name)").order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	if (!isSuperAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-center text-muted-foreground",
		children: "Unauthorized. Super Admin access required."
	});
	const handleUpdateBusinessStatus = async (id, status) => {
		try {
			const { error } = await supabase.from("businesses").update({ account_status: status }).eq("id", id);
			if (error) throw error;
			toast.success(`Business marked as ${status}`);
			qc.invalidateQueries({ queryKey: ["super-admin-businesses"] });
		} catch (err) {
			toast.error(err.message);
		}
	};
	const handleApprovePayment = async (paymentId, businessId, pkg) => {
		try {
			const { error: pErr } = await supabase.from("payments").update({ verification_status: "paid" }).eq("id", paymentId);
			if (pErr) throw pErr;
			const days = 365;
			const expiry = /* @__PURE__ */ new Date();
			expiry.setDate(expiry.getDate() + days);
			const { error: bErr } = await supabase.from("businesses").update({
				account_status: "approved",
				expiry_date: expiry.toISOString().split("T")[0]
			}).eq("id", businessId);
			if (bErr) throw bErr;
			toast.success("Payment verified and subscription activated!");
			qc.invalidateQueries({ queryKey: ["super-admin-payments"] });
			qc.invalidateQueries({ queryKey: ["super-admin-businesses"] });
		} catch (err) {
			toast.error(err.message);
		}
	};
	const totalRevenue = payments.filter((p) => p.verification_status === "paid").reduce((acc, curr) => acc + Number(curr.amount), 0);
	const activeSubs = businesses.filter((b) => b.account_status === "approved").length;
	const pendingApprovals = businesses.filter((b) => b.account_status === "pending").length;
	const totalBPages = Math.ceil(businesses.length / ITEMS_PER_PAGE);
	const paginatedBusinesses = businesses.slice((bPage - 1) * ITEMS_PER_PAGE, bPage * ITEMS_PER_PAGE);
	const totalPPages = Math.ceil(payments.length / ITEMS_PER_PAGE);
	const paginatedPayments = payments.slice((pPage - 1) * ITEMS_PER_PAGE, pPage * ITEMS_PER_PAGE);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-3xl font-bold flex items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-8 w-8 mr-3 text-primary" }), "Super Admin Dashboard"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground mt-1",
				children: "Manage tenants, subscriptions, and verify payments."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid md:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-card border border-border p-5 rounded-xl shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-muted-foreground text-sm font-medium mb-1 flex items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4 mr-2" }), " Total Businesses"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-3xl font-bold",
							children: businesses.length
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-card border border-border p-5 rounded-xl shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-muted-foreground text-sm font-medium mb-1 flex items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4 mr-2" }), " Active Subs"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-3xl font-bold text-success",
							children: activeSubs
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-card border border-border p-5 rounded-xl shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-muted-foreground text-sm font-medium mb-1 flex items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 mr-2" }), " Pending"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-3xl font-bold text-amber-500",
							children: pendingApprovals
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-card border border-border p-5 rounded-xl shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-muted-foreground text-sm font-medium mb-1 flex items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4 mr-2" }), " Total Revenue"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-3xl font-bold",
							children: [
								totalRevenue.toLocaleString(),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-normal text-muted-foreground",
									children: "TZS"
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 border-b border-border mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setActiveTab("businesses"),
					className: `px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === "businesses" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`,
					children: "Businesses"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setActiveTab("payments"),
					className: `px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === "payments" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`,
					children: "Payments & Verifications"
				})]
			}),
			activeTab === "businesses" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-border bg-card overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Business Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Owner"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Contact"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Package"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: bLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 6,
							className: "p-4 text-center",
							children: "Loading..."
						}) }) : paginatedBusinesses.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-muted/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-medium",
									children: b.business_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: b.owner_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3 text-xs text-muted-foreground",
									children: [
										b.email,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										b.phone
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${b.account_status === "approved" ? "bg-success/15 text-success" : b.account_status === "pending" ? "bg-amber-500/15 text-amber-600" : "bg-destructive/15 text-destructive"}`,
										children: b.account_status
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 capitalize",
									children: b.package
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3 text-right space-x-1",
									children: [b.account_status !== "approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => handleUpdateBusinessStatus(b.id, "approved"),
										children: "Approve"
									}), b.account_status !== "suspended" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										className: "text-destructive hover:bg-destructive/10",
										onClick: () => handleUpdateBusinessStatus(b.id, "suspended"),
										children: "Suspend"
									})]
								})
							]
						}, b.id))
					})]
				})
			}), totalBPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border border-border bg-card p-3 rounded-lg mt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						disabled: bPage === 1,
						onClick: () => setBPage((p) => p - 1),
						children: "Previous"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-muted-foreground",
						children: [
							"Page ",
							bPage,
							" of ",
							totalBPages
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						disabled: bPage === totalBPages,
						onClick: () => setBPage((p) => p + 1),
						children: "Next"
					})
				]
			})] }),
			activeTab === "payments" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-border bg-card overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Business"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Reference"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Amount"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Action"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: pLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 6,
							className: "p-4 text-center",
							children: "Loading..."
						}) }) : paginatedPayments.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-muted/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: new Date(p.created_at).toLocaleDateString()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-medium",
									children: p.businesses?.business_name || "Unknown"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-mono text-xs",
									children: p.payment_reference
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right font-semibold",
									children: Number(p.amount).toLocaleString()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${p.verification_status === "paid" ? "bg-success/15 text-success" : "bg-amber-500/15 text-amber-600"}`,
										children: [p.verification_status === "paid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), p.verification_status.replace("_", " ")]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right",
									children: p.verification_status === "waiting_verification" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										onClick: () => handleApprovePayment(p.id, p.business_id, p.businesses?.package || "kilimanjaro"),
										children: "Verify & Activate"
									})
								})
							]
						}, p.id))
					})]
				})
			}), totalPPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border border-border bg-card p-3 rounded-lg mt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						disabled: pPage === 1,
						onClick: () => setPPage((p) => p - 1),
						children: "Previous"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-muted-foreground",
						children: [
							"Page ",
							pPage,
							" of ",
							totalPPages
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						disabled: pPage === totalPPages,
						onClick: () => setPPage((p) => p + 1),
						children: "Next"
					})
				]
			})] })
		]
	});
}
//#endregion
export { SuperAdminDashboard as component };
