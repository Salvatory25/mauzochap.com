import { t as supabase } from "./client-C3cIRk-V.mjs";
import { n as useAuth } from "./use-auth-eGZW1w9W.mjs";
import { i as useT, r as useLang } from "./i18n-C8ZZqtNN.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-DSKqFpbT.mjs";
import { f as Outlet, g as Link, l as useLocation, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as Languages, M as LogOut, P as LayoutDashboard, Q as ChartColumn, S as Receipt, U as CreditCard, _ as ShieldAlert, h as ShoppingCart, n as Wallet, nt as Boxes, o as UserCog, q as ClipboardList, r as Users, s as Truck, v as Settings } from "../_libs/lucide-react.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-Cpy0C8Et.js
var import_jsx_runtime = require_jsx_runtime();
function Blocker({ title, message, icon: Icon, action }) {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const handleSignOut = async () => {
		await queryClient.cancelQueries();
		queryClient.clear();
		await supabase.auth.signOut();
		navigate({
			to: "/auth",
			replace: true
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen bg-background items-center justify-center p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md w-full bg-card rounded-xl border border-border p-8 text-center space-y-6 shadow-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6 text-destructive" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-bold",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground mt-2",
					children: message
				})] }),
				action,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pt-4 border-t border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						onClick: handleSignOut,
						className: "w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4 mr-2" }), " Sign Out"]
					})
				})
			]
		})
	});
}
function AppShell({ children }) {
	const t = useT();
	const [lang, setLang] = useLang();
	const { user, roles, business, isSuperAdmin, isAdmin, isManager, loading } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground font-medium animate-pulse",
				children: "Loading workspace..."
			})]
		})
	});
	if (!isSuperAdmin && business && location.pathname !== "/setup-billing") {
		if (business.account_status === "pending") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Blocker, {
			title: "Account Pending",
			message: "Your account is currently pending verification. Please set up billing to continue.",
			icon: ShieldAlert,
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				onClick: () => navigate({ to: "/setup-billing" }),
				children: "Set up Billing"
			})
		});
		if (business.account_status === "suspended") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Blocker, {
			title: "Account Suspended",
			message: "Your account has been suspended. Please contact support.",
			icon: ShieldAlert
		});
		if (business.account_status === "rejected") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Blocker, {
			title: "Account Rejected",
			message: "Your application to use MauzoChap was rejected.",
			icon: ShieldAlert
		});
		if (business.expiry_date && new Date(business.expiry_date) < /* @__PURE__ */ new Date()) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Blocker, {
			title: "Subscription Expired",
			message: "Your subscription has expired. Please renew your package to continue using MauzoChap.",
			icon: CreditCard,
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				onClick: () => navigate({ to: "/setup-billing" }),
				children: "Renew Subscription"
			})
		});
	}
	const nav = isSuperAdmin ? [{
		to: "/super-admin",
		icon: ShieldAlert,
		label: "Super Admin"
	}, {
		to: "/dashboard",
		icon: LayoutDashboard,
		label: t("dashboard")
	}] : [
		{
			to: "/dashboard",
			icon: LayoutDashboard,
			label: t("dashboard")
		},
		{
			to: "/pos",
			icon: ShoppingCart,
			label: t("pos")
		},
		{
			to: "/products",
			icon: Boxes,
			label: t("products")
		},
		{
			to: "/inventory",
			icon: ClipboardList,
			label: t("inventory")
		},
		{
			to: "/sales",
			icon: Receipt,
			label: t("sales")
		},
		{
			to: "/customers",
			icon: Users,
			label: t("customers")
		},
		{
			to: "/suppliers",
			icon: Truck,
			label: t("suppliers")
		},
		...isManager ? [{
			to: "/expenses",
			icon: Wallet,
			label: t("expenses")
		}, {
			to: "/reports",
			icon: ChartColumn,
			label: t("reports")
		}] : [],
		...isAdmin ? [{
			to: "/users",
			icon: UserCog,
			label: t("users")
		}] : [],
		{
			to: "/settings",
			icon: Settings,
			label: t("settings")
		}
	];
	const handleSignOut = async () => {
		await queryClient.cancelQueries();
		queryClient.clear();
		await supabase.auth.signOut();
		navigate({
			to: "/auth",
			replace: true
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "hidden lg:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-6 py-5 border-b border-sidebar-border flex flex-col gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/dashboard",
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-bold shadow-md",
								children: "M"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lg font-bold tracking-tight",
								children: "MauzoChap"
							})]
						}), business && !isSuperAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-sidebar-foreground/60 font-medium px-1 truncate",
							children: business.business_name
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex-1 px-3 py-4 space-y-1 overflow-y-auto",
						children: nav.map((item) => {
							const active = location.pathname.startsWith(item.to);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${active ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4" }), item.label]
							}, item.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-sidebar-border p-4 space-y-3 bg-sidebar/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-sidebar-foreground/80 truncate font-medium",
								children: user?.email
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1",
								children: roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-primary/20",
									children: r
								}, r))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setLang(lang === "en" ? "sw" : "en"),
								className: "flex w-full items-center gap-2 rounded-md border border-sidebar-border px-3 py-2 text-sm hover:bg-sidebar-accent transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Languages, { className: "h-4 w-4" }),
									lang === "en" ? "English" : "Kiswahili",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-auto text-xs text-sidebar-foreground/50",
										children: "↔"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleSignOut,
								className: "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), t("signOut")]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between bg-sidebar text-sidebar-foreground px-4 py-3 border-b border-sidebar-border shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/dashboard",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground font-bold text-sm",
						children: "M"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold tracking-tight",
						children: "MauzoChap"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setLang(lang === "en" ? "sw" : "en"),
					className: "text-xs font-bold uppercase tracking-wider bg-sidebar-accent px-2 py-1 rounded",
					children: lang
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 lg:ml-0 pt-14 lg:pt-0 bg-muted/20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-6 lg:p-8 max-w-7xl mx-auto",
						children
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "lg:hidden fixed bottom-0 inset-x-0 grid grid-cols-5 gap-1 border-t border-border bg-card p-2 z-40 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]",
						children: nav.slice(0, 5).map((item) => {
							const active = location.pathname.startsWith(item.to);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: `flex flex-col items-center justify-center gap-1 py-1 text-[10px] rounded-md transition-colors ${active ? "text-primary font-medium" : "text-muted-foreground"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate w-full text-center px-1",
									children: item.label
								})]
							}, item.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:hidden h-20" })
				]
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
//#endregion
export { SplitComponent as component };
