import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useAuth } from "./use-auth-eGZW1w9W.mjs";
import { r as useLang } from "./i18n-C8ZZqtNN.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { _ as Navigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as Languages, Q as ChartColumn, S as Receipt, f as Sun, g as ShieldCheck, j as MessageCircle, k as Moon, nt as Boxes, p as Store, r as Users } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DF4yTEbe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Landing() {
	const { user, loading } = useAuth();
	const [lang, setLang] = useLang();
	const [isDark, setIsDark] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setIsDark(document.documentElement.classList.contains("dark"));
	}, []);
	const toggleTheme = () => {
		const root = document.documentElement;
		if (isDark) {
			root.classList.remove("dark");
			localStorage.setItem("theme", "light");
		} else {
			root.classList.add("dark");
			localStorage.setItem("theme", "dark");
		}
		setIsDark(!isDark);
	};
	if (!loading && user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/dashboard" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-border/60 backdrop-blur sticky top-0 z-50",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex w-full items-center justify-between px-6 py-4 md:px-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-bold",
							children: "M"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-lg font-semibold tracking-tight",
							children: "MauzoChap"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setLang(lang === "en" ? "sw" : "en"),
								className: "flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors",
								title: "Change Language",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Languages, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "uppercase",
									children: lang
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: toggleTheme,
								className: "flex items-center justify-center h-9 w-9 rounded-full bg-muted/50 hover:bg-muted transition-colors",
								title: "Toggle Theme",
								children: isDark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/auth",
								className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 transition-opacity",
								children: "Sign in"
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-0 -z-10 opacity-60",
					style: { background: "var(--gradient-subtle)" }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto w-full px-6 py-20 lg:py-28 md:px-12",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-10 lg:grid-cols-2 lg:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-success" }), " Built for Tanzania"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-5 text-5xl font-bold tracking-tight lg:text-6xl",
								children: [
									"Run your shop with",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "bg-clip-text text-transparent",
										style: { backgroundImage: "var(--gradient-primary)" },
										children: "confidence"
									}),
									"."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 max-w-lg text-lg text-muted-foreground",
								children: "MauzoChap is the modern point of sale and business management platform for retail, pharmacies, restaurants, and wholesalers — sales, inventory, customers and reports in one place."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex flex-wrap gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/auth",
									className: "rounded-lg px-5 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-elevated)]",
									style: { background: "var(--gradient-primary)" },
									children: "Get started — free"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#features",
									className: "rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium hover:bg-accent",
									children: "See features"
								})]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-2xl border border-border bg-card p-2 shadow-[var(--shadow-elevated)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-sidebar p-6 text-sidebar-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs uppercase tracking-widest text-sidebar-foreground/60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Today" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Live" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 text-4xl font-bold",
										children: "TZS 1,284,500"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 text-sm text-sidebar-foreground/60",
										children: "+18% vs yesterday"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-6 grid grid-cols-3 gap-3 text-sm",
										children: [
											{
												l: "Orders",
												v: "47"
											},
											{
												l: "Avg ticket",
												v: "27,330"
											},
											{
												l: "Low stock",
												v: "3"
											}
										].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg bg-sidebar-accent/60 p-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-sidebar-foreground/60",
												children: x.l
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1 font-semibold",
												children: x.v
											})]
										}, x.l))
									})
								]
							})
						})]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "features",
				className: "mx-auto w-full px-6 py-20 md:px-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-3xl font-bold",
						children: "Everything your business needs"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-muted-foreground",
						children: "Replace notebooks and spreadsheets with one fast, simple system."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
						children: [
							{
								icon: Store,
								title: "Lightning POS",
								desc: "Sell in seconds with barcode and search."
							},
							{
								icon: Boxes,
								title: "Smart inventory",
								desc: "Stock levels, low-stock alerts, movements."
							},
							{
								icon: Users,
								title: "Customer profiles",
								desc: "Purchase history, credit, loyalty points."
							},
							{
								icon: Receipt,
								title: "Receipts your way",
								desc: "80mm thermal or A4 PDF receipts."
							},
							{
								icon: ChartColumn,
								title: "Real-time reports",
								desc: "Daily, weekly, monthly performance."
							},
							{
								icon: ShieldCheck,
								title: "Role-based access",
								desc: "Admin, Manager, Cashier — secure."
							}
						].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-10 w-10 place-items-center rounded-lg text-primary-foreground",
									style: { background: "var(--gradient-primary)" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-4 font-semibold",
									children: f.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: f.desc
								})
							]
						}, f.title))
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border py-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto w-full px-6 text-sm text-muted-foreground md:px-12 flex flex-col md:flex-row items-center justify-between",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" MauzoChap. Made for African businesses."
					] })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "https://wa.me/255627274168",
				target: "_blank",
				rel: "noopener noreferrer",
				className: "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform duration-300",
				title: "Chat with us on WhatsApp",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-7 w-7" })
			})
		]
	});
}
//#endregion
export { Landing as component };
