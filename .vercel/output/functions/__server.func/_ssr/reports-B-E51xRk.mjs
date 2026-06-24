import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-C3cIRk-V.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useAuth } from "./use-auth-eGZW1w9W.mjs";
import { i as useT, n as formatTZS } from "./i18n-C8ZZqtNN.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as cn, t as Button } from "./button-DSKqFpbT.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { G as CloudDownload, J as Circle, X as ChevronRight, Z as Check, _ as ShieldAlert, et as Calendar } from "../_libs/lucide-react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { t as require_jspdf_node_min } from "../_libs/jspdf.mjs";
import { t as autoTable } from "../_libs/jspdf-autotable.mjs";
import { t as require_dom_to_image_more_min } from "../_libs/dom-to-image-more.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-B-E51xRk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_jspdf_node_min = require_jspdf_node_min();
var import_dom_to_image_more_min = /* @__PURE__ */ __toESM(require_dom_to_image_more_min());
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
function ReportsPage() {
	const t = useT();
	const { branchId, isManager, business } = useAuth();
	const [dateFilter, setDateFilter] = (0, import_react.useState)("month");
	const [isExportingPDF, setIsExportingPDF] = (0, import_react.useState)(false);
	const { data, isLoading } = useQuery({
		queryKey: [
			"reports",
			branchId,
			dateFilter
		],
		enabled: isManager,
		queryFn: async () => {
			let startDate = (/* @__PURE__ */ new Date(0)).toISOString();
			const now = /* @__PURE__ */ new Date();
			if (dateFilter === "today") startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
			else if (dateFilter === "week") startDate = new Date(now.setDate(now.getDate() - 7)).toISOString();
			else if (dateFilter === "month") startDate = new Date(now.setDate(now.getDate() - 30)).toISOString();
			let salesQuery = supabase.from("sales").select("id, total, payment_method, created_at, status, cashier_id").gte("created_at", startDate);
			if (branchId) salesQuery = salesQuery.or(`branch_id.eq.${branchId},branch_id.is.null`);
			let expensesQuery = supabase.from("expenses").select("amount, category, expense_date").gte("expense_date", startDate.slice(0, 10));
			if (branchId) expensesQuery = expensesQuery.or(`branch_id.eq.${branchId},branch_id.is.null`);
			let productsQuery = branchId ? supabase.from("products").select("name, cost, price, branch_inventory!inner(stock_quantity)").eq("branch_inventory.branch_id", branchId) : supabase.from("products").select("name, cost, price, branch_inventory(stock_quantity)");
			const results = await Promise.all([
				salesQuery,
				expensesQuery,
				productsQuery,
				supabase.from("customers").select("name, phone, email, balance").gt("balance", 0),
				supabase.from("suppliers").select("name, phone, email, balance").gt("balance", 0),
				supabase.from("profiles").select("id, full_name")
			]);
			if (results[0].error) console.error("Sales query error:", results[0].error);
			if (results[1].error) console.error("Expenses query error:", results[1].error);
			if (results[2].error) console.error("Products query error:", results[2].error);
			const salesData = (results[0].data ?? []).filter((s) => s.status === "completed");
			const expenses = results[1].data ?? [];
			const products = results[2].data ?? [];
			const customersData = results[3].data || [];
			const suppliersData = results[4].data || [];
			const profilesData = results[5].data || [];
			const profileMap = new Map(profilesData.map((p) => [p.id, p.full_name]));
			let saleItems = [];
			if (salesData.length > 0) {
				const saleIds = salesData.map((s) => s.id);
				const { data: items } = await supabase.from("sale_items").select("product_id, quantity, subtotal, products(name)").in("sale_id", saleIds);
				saleItems = items ?? [];
			}
			const byUser = {};
			salesData.forEach((s) => {
				const name = profileMap.get(s.cashier_id) || "System / Admin";
				if (!byUser[name]) byUser[name] = {
					name,
					total: 0,
					count: 0
				};
				byUser[name].total += Number(s.total);
				byUser[name].count += 1;
			});
			const topUsers = Object.values(byUser).sort((a, b) => b.total - a.total);
			const byProduct = {};
			saleItems.forEach((item) => {
				const name = item.products?.name || "Unknown Product";
				if (!byProduct[name]) byProduct[name] = {
					name,
					quantity: 0,
					revenue: 0
				};
				byProduct[name].quantity += Number(item.quantity);
				byProduct[name].revenue += Number(item.subtotal);
			});
			const topProducts = Object.values(byProduct).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
			const byDay = {};
			salesData.forEach((s) => {
				const d = String(s.created_at).slice(0, 10);
				byDay[d] = (byDay[d] || 0) + Number(s.total);
			});
			const days = Object.entries(byDay).sort().slice(-14);
			const maxDay = Math.max(1, ...days.map((d) => d[1]));
			const byPayment = {};
			salesData.forEach((s) => {
				byPayment[s.payment_method] = (byPayment[s.payment_method] || 0) + Number(s.total);
			});
			const byCategory = {};
			expenses.forEach((e) => {
				byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount);
			});
			return {
				days,
				maxDay,
				byPayment,
				byCategory,
				inventoryValue: products.reduce((s, p) => {
					const totalStock = Array.isArray(p.branch_inventory) ? p.branch_inventory.reduce((sumStock, bi) => sumStock + Number(bi.stock_quantity || 0), 0) : Number(p.branch_inventory?.[0]?.stock_quantity || 0);
					return s + Number(p.cost) * totalStock;
				}, 0),
				totalSales: salesData.reduce((s, x) => s + Number(x.total), 0),
				totalExpenses: expenses.reduce((s, x) => s + Number(x.amount), 0),
				products,
				customerDebt: customersData.reduce((s, c) => s + Number(c.balance), 0),
				supplierDebt: suppliersData.reduce((s, c) => s + Number(c.balance), 0),
				customers: customersData,
				suppliers: suppliersData,
				topUsers,
				topProducts
			};
		}
	});
	if (!isManager) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center py-20 text-center space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-6 w-6 text-destructive" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-bold",
				children: "Unauthorized Access"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground max-w-sm",
				children: "You do not have the required permissions to access this page. Please contact your administrator if you believe this is an error."
			})
		]
	});
	const profit = data ? data.totalSales - data.totalExpenses : 0;
	const getFilterLabel = () => {
		if (dateFilter === "today") return "Today";
		if (dateFilter === "week") return "Last 7 Days";
		if (dateFilter === "month") return "Last 30 Days";
		return "All Time";
	};
	const generateTabularPDF = (title, columns, rows, summary) => {
		try {
			const pdf = new import_jspdf_node_min.jsPDF("p", "mm", "a4");
			const businessName = business?.business_name || "MauzoChap System";
			pdf.setFillColor(248, 250, 252);
			pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), 35, "F");
			pdf.setFontSize(20);
			pdf.setTextColor(15, 23, 42);
			pdf.text(`${businessName} - ${title}`, 14, 18);
			pdf.setFontSize(9);
			pdf.setTextColor(100, 116, 139);
			pdf.text(`Date Range: ${getFilterLabel()}   |   Generated on: ${(/* @__PURE__ */ new Date()).toLocaleString()}`, 14, 26);
			pdf.setDrawColor(226, 232, 240);
			pdf.line(14, 30, pdf.internal.pageSize.getWidth() - 14, 30);
			autoTable(pdf, {
				startY: 38,
				head: [columns],
				body: rows,
				theme: "grid",
				headStyles: {
					fillColor: [
						15,
						23,
						42
					],
					textColor: 255
				},
				alternateRowStyles: { fillColor: [
					248,
					250,
					252
				] },
				styles: {
					fontSize: 10,
					cellPadding: 4
				}
			});
			let finalY = pdf.lastAutoTable.finalY || 40;
			if (summary && summary.length > 0) {
				finalY += 10;
				pdf.setFontSize(11);
				pdf.setTextColor(15, 23, 42);
				summary.forEach((line, i) => {
					pdf.text(line, 14, finalY + i * 6);
				});
			}
			const pageCount = pdf.getNumberOfPages();
			for (let i = 1; i <= pageCount; i++) {
				pdf.setPage(i);
				const pageHeight = pdf.internal.pageSize.getHeight();
				pdf.setFontSize(8);
				pdf.setTextColor(148, 163, 184);
				pdf.text(`© ${(/* @__PURE__ */ new Date()).getFullYear()} ${businessName}. All rights reserved. Powered by MauzoChap.`, 14, pageHeight - 10);
				pdf.text(`Page ${i} of ${pageCount}`, pdf.internal.pageSize.getWidth() - 30, pageHeight - 10);
			}
			pdf.save(`MauzoChap_${title.replace(/\s+/g, "_")}_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.pdf`);
			toast.success(`${title} downloaded successfully!`);
		} catch (error) {
			console.error("PDF Generation Error:", error);
			toast.error("Failed to generate PDF. Please try again.");
		}
	};
	const exportDebtPDF = () => {
		if (!data) return;
		const columns = [
			"Type",
			"Name",
			"Phone",
			"Email",
			"Outstanding Balance (TZS)"
		];
		const rows = [];
		data.customers.forEach((c) => {
			rows.push([
				"Customer (Owes Us)",
				c.name,
				c.phone || "-",
				c.email || "-",
				formatTZS(c.balance)
			]);
		});
		data.suppliers.forEach((s) => {
			rows.push([
				"Supplier (We Owe)",
				s.name,
				s.phone || "-",
				s.email || "-",
				formatTZS(s.balance)
			]);
		});
		generateTabularPDF("Outstanding Debt Report", columns, rows);
	};
	const exportSalesPDF = () => {
		if (!data) return;
		generateTabularPDF("Sales & Profit Report", ["Date", "Sales Revenue (TZS)"], data.days.map(([d, val]) => [d, formatTZS(val)]), [
			`TOTAL SALES: ${formatTZS(data.totalSales)}`,
			`TOTAL EXPENSES: ${formatTZS(data.totalExpenses)}`,
			`NET PROFIT (ESTIMATE): ${formatTZS(profit)}`
		]);
	};
	const exportProductsPDF = () => {
		if (!data) return;
		generateTabularPDF("Product Performance Report", [
			"Product Name",
			"Quantity Sold",
			"Total Revenue (TZS)"
		], data.topProducts.map((p) => [
			p.name,
			p.quantity,
			formatTZS(p.revenue)
		]));
	};
	const exportUsersPDF = () => {
		if (!data) return;
		generateTabularPDF("Cashier Performance Report", [
			"User/Cashier",
			"Sales Processed",
			"Total Revenue Generated (TZS)"
		], data.topUsers.map((u) => [
			u.name,
			u.count,
			formatTZS(u.total)
		]));
	};
	const exportToPDF = async () => {
		const input = document.getElementById("report-content");
		if (!input) return;
		setIsExportingPDF(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 300));
			const width = input.offsetWidth;
			const height = input.offsetHeight;
			const imgData = await import_dom_to_image_more_min.default.toPng(input, {
				bgcolor: "#ffffff",
				quality: 1,
				width: width * 2,
				height: height * 2,
				style: {
					transform: "scale(2)",
					transformOrigin: "top left"
				}
			});
			const pdf = new import_jspdf_node_min.jsPDF("p", "mm", "a4");
			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = height * pdfWidth / width;
			const businessName = business?.business_name || "MauzoChap System";
			pdf.setFillColor(248, 250, 252);
			pdf.rect(0, 0, pdfWidth, 42, "F");
			pdf.setFontSize(22);
			pdf.setTextColor(15, 23, 42);
			pdf.text(`${businessName} - Analytics Report`, 14, 20);
			pdf.setFontSize(11);
			pdf.setTextColor(100, 116, 139);
			pdf.text(`Date Range: ${getFilterLabel()}`, 14, 28);
			pdf.text(`Generated on: ${(/* @__PURE__ */ new Date()).toLocaleString()}`, 14, 34);
			pdf.setDrawColor(226, 232, 240);
			pdf.setLineWidth(.5);
			pdf.line(14, 42, pdfWidth - 14, 42);
			pdf.addImage(imgData, "PNG", 0, 45, pdfWidth, pdfHeight);
			const pageHeight = pdf.internal.pageSize.getHeight();
			pdf.setFillColor(248, 250, 252);
			pdf.rect(0, pageHeight - 15, pdfWidth, 15, "F");
			pdf.setFontSize(9);
			pdf.setTextColor(148, 163, 184);
			pdf.text(`© ${(/* @__PURE__ */ new Date()).getFullYear()} ${businessName}. All rights reserved. Powered by MauzoChap.`, 14, pageHeight - 6);
			pdf.save(`MauzoChap_Report_${dateFilter}_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.pdf`);
			toast.success("Visual Dashboard PDF downloaded successfully!");
		} catch (error) {
			console.error("Error generating PDF", error);
			toast.error("Failed to generate Visual PDF. Please try again.");
		} finally {
			setIsExportingPDF(false);
		}
	};
	if (isLoading || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-muted-foreground p-8 text-center",
		children: t("loading")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
			"data-html2canvas-ignore": true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-3xl font-bold",
				children: [t("reports"), " & Analytics"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Comprehensive business performance insights"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						className: "border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "mr-2 h-4 w-4" }), getFilterLabel()]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
					align: "end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							onClick: () => setDateFilter("today"),
							children: "Today (Daily)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							onClick: () => setDateFilter("week"),
							children: "Last 7 Days (Weekly)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							onClick: () => setDateFilter("month"),
							children: "Last 30 Days (Monthly)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							onClick: () => setDateFilter("all"),
							children: "All Time"
						})
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						disabled: isExportingPDF,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudDownload, { className: `mr-2 h-4 w-4 ${isExportingPDF ? "animate-bounce" : ""}` }), isExportingPDF ? "Generating PDF..." : "Export Reports"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
					align: "end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							onClick: exportToPDF,
							className: "font-medium text-primary",
							children: "Download Visual Dashboard PDF"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							onClick: exportSalesPDF,
							children: "Download Sales & Profit PDF"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							onClick: exportProductsPDF,
							children: "Download Product Performance PDF"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							onClick: exportUsersPDF,
							children: "Download User Performance PDF"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							onClick: exportDebtPDF,
							children: "Download Outstanding Debt PDF"
						})
					]
				})] })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			id: "report-content",
			className: "space-y-6 bg-background rounded-xl p-2 sm:p-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						{
							l: "Total Sales",
							v: formatTZS(data.totalSales),
							color: ""
						},
						{
							l: "Total Expenses",
							v: formatTZS(data.totalExpenses),
							color: "text-destructive"
						},
						{
							l: "Net Profit (estimate)",
							v: formatTZS(profit),
							color: profit > 0 ? "text-success" : ""
						},
						{
							l: "Inventory Value",
							v: formatTZS(data.inventoryValue),
							color: ""
						}
					].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase tracking-wider text-muted-foreground",
							children: c.l
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `mt-2 text-2xl font-bold ${c.color}`,
							children: c.v
						})]
					}, c.l))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-2 mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-5 bg-muted/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase tracking-wider text-muted-foreground",
							children: "Customer Debt (To Collect)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 text-xl font-bold text-warning",
							children: formatTZS(data.customerDebt)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-5 bg-muted/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase tracking-wider text-muted-foreground",
							children: "Supplier Debt (To Pay)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 text-xl font-bold text-destructive",
							children: formatTZS(data.supplierDebt)
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-semibold mb-4",
						children: [
							"Sales Trend (",
							getFilterLabel(),
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-end gap-2 h-48",
						children: data.days.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground m-auto",
							children: t("noData")
						}) : data.days.map(([d, val]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 flex flex-col items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full rounded-t-md",
								style: {
									height: `${val / data.maxDay * 100}%`,
									background: "var(--gradient-primary)",
									minHeight: "4px"
								},
								title: `${d}: ${formatTZS(val)}`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground",
								children: d.slice(5)
							})]
						}, d))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold mb-4",
							children: "Top 10 Products by Revenue"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: data.topProducts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted-foreground",
								children: t("noData")
							}) : data.topProducts.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-bold text-muted-foreground",
										children: i + 1
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium text-sm",
										children: p.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [p.quantity, " units sold"]
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold",
									children: formatTZS(p.revenue)
								})]
							}, p.name))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold mb-4",
							children: "Cashier Performance"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: data.topUsers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted-foreground",
								children: t("noData")
							}) : data.topUsers.map((u, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold",
										children: u.name.charAt(0).toUpperCase()
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium text-sm",
										children: u.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [u.count, " sales processed"]
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold text-success",
									children: formatTZS(u.total)
								})]
							}, u.name))
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold mb-4",
							children: "By Payment Method"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: Object.entries(data.byPayment).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted-foreground",
								children: t("noData")
							}) : Object.entries(data.byPayment).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-sm mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "capitalize",
									children: k.replace("_", " ")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: formatTZS(v)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-2 rounded-full bg-muted overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full",
									style: {
										width: `${v / data.totalSales * 100}%`,
										background: "var(--gradient-primary)"
									}
								})
							})] }, k))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold mb-4",
							children: "Expenses by Category"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: Object.entries(data.byCategory).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted-foreground",
								children: t("noData")
							}) : Object.entries(data.byCategory).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-sm mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: k }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: formatTZS(v)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-2 rounded-full bg-muted overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full bg-warning",
									style: {
										width: `${v / data.totalExpenses * 100}%`,
										background: "var(--warning)"
									}
								})
							})] }, k))
						})]
					})]
				})
			]
		})]
	});
}
//#endregion
export { ReportsPage as component };
