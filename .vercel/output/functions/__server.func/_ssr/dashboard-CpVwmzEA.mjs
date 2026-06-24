import { t as supabase } from "./client-C3cIRk-V.mjs";
import { n as useAuth } from "./use-auth-eGZW1w9W.mjs";
import { i as useT, n as formatTZS, t as formatDate } from "./i18n-C8ZZqtNN.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { U as CreditCard, c as TriangleAlert, l as TrendingUp, nt as Boxes, r as Users } from "../_libs/lucide-react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as Bar, i as CartesianGrid, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CpVwmzEA.js
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const t = useT();
	const { branchId } = useAuth();
	const { data: stats, isLoading } = useQuery({
		queryKey: ["dashboard-stats", branchId],
		queryFn: async () => {
			const today = /* @__PURE__ */ new Date();
			today.setHours(0, 0, 0, 0);
			const weekAgo = /* @__PURE__ */ new Date(Date.now() - 6 * 864e5);
			weekAgo.setHours(0, 0, 0, 0);
			const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
			const [todayRes, weekRes, monthRes, allTimeRes, productsRes, lowStockRes, customersRes, debtsRes] = await Promise.all([
				(() => {
					let q = supabase.from("sales").select("total").gte("created_at", today.toISOString()).eq("status", "completed");
					if (branchId) q = q.or(`branch_id.eq.${branchId},branch_id.is.null`);
					return q;
				})(),
				(() => {
					let q = supabase.from("sales").select("total, created_at").gte("created_at", weekAgo.toISOString()).eq("status", "completed");
					if (branchId) q = q.or(`branch_id.eq.${branchId},branch_id.is.null`);
					return q;
				})(),
				(() => {
					let q = supabase.from("sales").select("total").gte("created_at", monthStart.toISOString()).eq("status", "completed");
					if (branchId) q = q.or(`branch_id.eq.${branchId},branch_id.is.null`);
					return q;
				})(),
				(() => {
					let q = supabase.from("sales").select("total").eq("status", "completed");
					if (branchId) q = q.or(`branch_id.eq.${branchId},branch_id.is.null`);
					return q;
				})(),
				supabase.from("products").select("id", {
					count: "exact",
					head: true
				}),
				supabase.from("products").select("id, name, stock_quantity, low_stock_threshold").lte("stock_quantity", 5).limit(10),
				supabase.from("customers").select("id", {
					count: "exact",
					head: true
				}),
				supabase.from("customers").select("balance").gt("balance", 0)
			]);
			const sum = (rows) => (rows ?? []).reduce((s, r) => s + Number(r.total || 0), 0);
			const sumDebts = (rows) => (rows ?? []).reduce((s, r) => s + Number(r.balance || 0), 0);
			const monthTotal = sum(monthRes.data);
			const monthCount = monthRes.data?.length || 0;
			const avgOrderValue = monthCount > 0 ? monthTotal / monthCount : 0;
			const chartData = Array.from({ length: 7 }).map((_, i) => {
				const d = new Date(today);
				d.setDate(d.getDate() - (6 - i));
				return {
					date: d.toISOString().split("T")[0],
					name: d.toLocaleDateString("en-US", { weekday: "short" }),
					total: 0
				};
			});
			weekRes.data?.forEach((sale) => {
				const dateString = sale.created_at.split("T")[0];
				const day = chartData.find((d) => d.date === dateString);
				if (day) day.total += Number(sale.total);
			});
			return {
				today: sum(todayRes.data),
				week: sum(weekRes.data),
				month: monthTotal,
				allTime: sum(allTimeRes.data),
				productCount: productsRes.count ?? 0,
				lowStock: lowStockRes.data ?? [],
				customerCount: customersRes.count ?? 0,
				pendingDebts: sumDebts(debtsRes.data),
				avgOrderValue,
				chartData
			};
		}
	});
	const { data: recent } = useQuery({
		queryKey: ["recent-sales", branchId],
		queryFn: async () => {
			let q = supabase.from("sales").select("id, receipt_number, total, payment_method, created_at").order("created_at", { ascending: false }).limit(8);
			if (branchId) q = q.or(`branch_id.eq.${branchId},branch_id.is.null`);
			const { data } = await q;
			return data ?? [];
		}
	});
	const cards = [
		{
			label: "Total Sales (All Time)",
			value: formatTZS(stats?.allTime ?? 0),
			icon: TrendingUp,
			accent: "var(--gradient-primary)",
			primary: true
		},
		{
			label: t("todaySales"),
			value: formatTZS(stats?.today ?? 0),
			icon: TrendingUp
		},
		{
			label: t("weekSales"),
			value: formatTZS(stats?.week ?? 0),
			icon: TrendingUp
		},
		{
			label: t("monthSales"),
			value: formatTZS(stats?.month ?? 0),
			icon: TrendingUp
		}
	];
	const secondaryCards = [
		{
			label: "Pending Debts",
			value: formatTZS(stats?.pendingDebts ?? 0),
			icon: CreditCard,
			color: "text-warning"
		},
		{
			label: t("totalProducts"),
			value: String(stats?.productCount ?? 0),
			icon: Boxes
		},
		{
			label: t("customers"),
			value: String(stats?.customerCount ?? 0),
			icon: Users
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold",
				children: t("dashboard")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Comprehensive overview of your business."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: cards.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] ${isLoading ? "animate-pulse" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
							children: c.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `grid h-8 w-8 place-items-center rounded-md ${c.primary ? "text-primary-foreground" : "text-primary bg-primary/10"}`,
							style: c.primary ? { background: c.accent } : void 0,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(c.icon, { className: `h-4 w-4 ${c.color || ""}` })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 text-2xl font-bold tracking-tight",
						children: c.value
					})]
				}, c.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: secondaryCards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `rounded-xl border border-border bg-card p-4 flex items-center gap-4 ${isLoading ? "animate-pulse" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-3 bg-muted rounded-full text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(c.icon, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium text-muted-foreground",
						children: c.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xl font-bold",
						children: c.value
					})] })]
				}, c.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2 rounded-xl border border-border bg-card shadow-sm flex flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-5 py-4 border-b border-border flex items-center justify-between",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: "Sales Summary (Last 7 Days)"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-5 flex-1 min-h-[300px]",
						children: stats?.chartData && stats.chartData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: stats.chartData,
								margin: {
									top: 10,
									right: 10,
									left: -20,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										vertical: false,
										stroke: "var(--border)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "name",
										axisLine: false,
										tickLine: false,
										tick: {
											fontSize: 12,
											fill: "var(--muted-foreground)"
										},
										dy: 10
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										axisLine: false,
										tickLine: false,
										tick: {
											fontSize: 12,
											fill: "var(--muted-foreground)"
										},
										tickFormatter: (val) => `TZS ${val / 1e3}k`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										cursor: { fill: "var(--muted)" },
										contentStyle: {
											borderRadius: "8px",
											border: "1px solid var(--border)",
											backgroundColor: "var(--card)"
										},
										formatter: (value) => [formatTZS(value), "Revenue"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "total",
										fill: "var(--primary)",
										radius: [
											4,
											4,
											0,
											0
										],
										maxBarSize: 50
									})
								]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full w-full flex items-center justify-center text-sm text-muted-foreground",
							children: isLoading ? "Loading chart..." : "No data available"
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card shadow-sm flex flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 py-4 border-b border-border flex items-center gap-2 bg-warning/5 text-warning",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-semibold",
							children: [t("lowStock"), " Alerts"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-border overflow-y-auto max-h-[300px]",
						children: stats?.lowStock && stats.lowStock.length > 0 ? stats.lowStock.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between px-5 py-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium truncate pr-2",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full bg-warning/15 px-2 py-0.5 text-xs font-bold whitespace-nowrap",
								style: { color: "var(--warning)" },
								children: [p.stock_quantity, " left"]
							})]
						}, p.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-5 py-10 text-center text-sm text-muted-foreground",
							children: "All products are well stocked."
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-5 py-4 border-b border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: t("recentSales")
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-border",
					children: recent && recent.length > 0 ? recent.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: s.receipt_number
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: [
									formatDate(s.created_at),
									" · ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "uppercase",
										children: s.payment_method
									})
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-bold text-base",
							children: formatTZS(Number(s.total))
						})]
					}, s.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-5 py-10 text-center text-sm text-muted-foreground",
						children: t("noData")
					})
				})]
			})
		]
	});
}
//#endregion
export { Dashboard as component };
