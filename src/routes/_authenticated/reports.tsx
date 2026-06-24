import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useT, formatTZS } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { FileDown, Calendar as CalendarIcon, DownloadCloud, ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/_authenticated/reports")({
  component: ReportsPage,
});

type DateFilter = "today" | "week" | "month" | "all";

function ReportsPage() {
  const t = useT();
  const { branchId, isManager } = useAuth();
  const [dateFilter, setDateFilter] = useState<DateFilter>("month");

  const { data, isLoading } = useQuery({
    queryKey: ["reports", branchId, dateFilter],
    enabled: isManager,
    queryFn: async () => {
      let startDate = new Date(0).toISOString(); // all time
      const now = new Date();
      if (dateFilter === "today") {
        startDate = new Date(now.setHours(0,0,0,0)).toISOString();
      } else if (dateFilter === "week") {
        startDate = new Date(now.setDate(now.getDate() - 7)).toISOString();
      } else if (dateFilter === "month") {
        startDate = new Date(now.setDate(now.getDate() - 30)).toISOString();
      }

      let salesQuery = supabase
        .from("sales")
        .select("id, total, payment_method, created_at, status, profiles(full_name)")
        .gte("created_at", startDate);
      if (branchId) {
        salesQuery = salesQuery.or(`branch_id.eq.${branchId},branch_id.is.null`);
      }

      let expensesQuery = supabase
        .from("expenses")
        .select("amount, category, expense_date")
        .gte("expense_date", startDate.slice(0, 10));
      if (branchId) {
        expensesQuery = expensesQuery.or(`branch_id.eq.${branchId},branch_id.is.null`);
      }

      let productsQuery = branchId
        ? supabase
            .from("products")
            .select("name, cost, price, branch_inventory!inner(stock_quantity)")
            .eq("branch_inventory.branch_id", branchId)
        : supabase
            .from("products")
            .select("name, cost, price, branch_inventory(stock_quantity)");

      const results = await Promise.all([
        salesQuery,
        expensesQuery,
        productsQuery,
        // Customers/Suppliers are global for now
        supabase.from("customers").select("name, phone, email, balance").gt("balance", 0),
        supabase.from("suppliers").select("name, phone, email, balance").gt("balance", 0),
      ]);

      const salesData = (results[0].data ?? []).filter((s) => s.status === "completed");
      const expenses = results[1].data ?? [];
      const products = results[2].data ?? [];
      const customersData = results[3].data || [];
      const suppliersData = results[4].data || [];

      // Fetch sale items for the matched sales to compute product performance
      let saleItems: any[] = [];
      if (salesData.length > 0) {
        const saleIds = salesData.map(s => s.id);
        const { data: items } = await supabase
          .from("sale_items")
          .select("product_id, quantity, subtotal, products(name)")
          .in("sale_id", saleIds);
        saleItems = items ?? [];
      }

      // Compute User Performance
      const byUser: Record<string, { name: string, total: number, count: number }> = {};
      salesData.forEach(s => {
        const name = (s.profiles as any)?.full_name || 'System / Admin';
        if (!byUser[name]) byUser[name] = { name, total: 0, count: 0 };
        byUser[name].total += Number(s.total);
        byUser[name].count += 1;
      });
      const topUsers = Object.values(byUser).sort((a,b) => b.total - a.total);

      // Compute Top Products
      const byProduct: Record<string, { name: string, quantity: number, revenue: number }> = {};
      saleItems.forEach(item => {
        const name = item.products?.name || "Unknown Product";
        if (!byProduct[name]) byProduct[name] = { name, quantity: 0, revenue: 0 };
        byProduct[name].quantity += Number(item.quantity);
        byProduct[name].revenue += Number(item.subtotal);
      });
      const topProducts = Object.values(byProduct).sort((a,b) => b.revenue - a.revenue).slice(0, 10);

      const byDay: Record<string, number> = {};
      salesData.forEach((s) => {
        const d = String(s.created_at).slice(0, 10);
        byDay[d] = (byDay[d] || 0) + Number(s.total);
      });
      const days = Object.entries(byDay).sort().slice(-14);
      const maxDay = Math.max(1, ...days.map((d) => d[1]));

      const byPayment: Record<string, number> = {};
      salesData.forEach((s) => {
        byPayment[s.payment_method] = (byPayment[s.payment_method] || 0) + Number(s.total);
      });

      const byCategory: Record<string, number> = {};
      expenses.forEach((e: { category: string; amount: number | null | string }) => {
        byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount);
      });

      const inventoryValue = products.reduce(
        (s, p: any) => {
          const totalStock = Array.isArray(p.branch_inventory)
            ? p.branch_inventory.reduce((sumStock: number, bi: any) => sumStock + Number(bi.stock_quantity || 0), 0)
            : Number(p.branch_inventory?.[0]?.stock_quantity || 0);
          return s + Number(p.cost) * totalStock;
        },
        0,
      );
      const totalSales = salesData.reduce((s, x) => s + Number(x.total), 0);
      const totalExpenses = expenses.reduce(
        (s: number, x: { amount: number | null | string }) => s + Number(x.amount),
        0,
      );

      const customerDebt = customersData.reduce((s: number, c: any) => s + Number(c.balance), 0);
      const supplierDebt = suppliersData.reduce((s: number, c: any) => s + Number(c.balance), 0);

      return {
        days,
        maxDay,
        byPayment,
        byCategory,
        inventoryValue,
        totalSales,
        totalExpenses,
        products,
        customerDebt,
        supplierDebt,
        customers: customersData,
        suppliers: suppliersData,
        topUsers,
        topProducts,
      };
    },
  });

  if (!isManager) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <ShieldAlert className="h-6 w-6 text-destructive" />
        </div>
        <h2 className="text-xl font-bold">Unauthorized Access</h2>
        <p className="text-muted-foreground max-w-sm">
          You do not have the required permissions to access this page. Please contact your administrator if you believe this is an error.
        </p>
      </div>
    );
  }

  const profit = data ? data.totalSales - data.totalExpenses : 0;

  const getFilterLabel = () => {
    if (dateFilter === "today") return "Today";
    if (dateFilter === "week") return "Last 7 Days";
    if (dateFilter === "month") return "Last 30 Days";
    return "All Time";
  };

  const exportDebtCSV = () => {
    if (!data) return;
    let csv = "Type,Name,Phone,Email,Outstanding Balance (TZS)\n";
    data.customers.forEach((c: any) => {
      csv += `Customer (Owes Us),"${c.name}","${c.phone||""}","${c.email||""}",${c.balance}\n`;
    });
    data.suppliers.forEach((s: any) => {
      csv += `Supplier (We Owe),"${s.name}","${s.phone||""}","${s.email||""}",${s.balance}\n`;
    });
    downloadCSV(csv, "debt_report");
  };

  const exportSalesCSV = () => {
    if (!data) return;
    let csv = `Date Range: ${getFilterLabel()}\n\n`;
    csv += "Date,Sales Revenue (TZS)\n";
    data.days.forEach(([d, val]) => {
      csv += `${d},${val}\n`;
    });
    csv += `\nTOTAL SALES,${data.totalSales}\n`;
    csv += `TOTAL EXPENSES,${data.totalExpenses}\n`;
    csv += `NET PROFIT,${profit}\n`;
    downloadCSV(csv, `sales_profit_report_${dateFilter}`);
  };

  const exportProductsCSV = () => {
    if (!data) return;
    let csv = `Date Range: ${getFilterLabel()}\n\n`;
    csv += "Product,Quantity Sold,Total Revenue (TZS)\n";
    data.topProducts.forEach(p => {
      csv += `"${p.name}",${p.quantity},${p.revenue}\n`;
    });
    downloadCSV(csv, `product_performance_${dateFilter}`);
  };

  const exportUsersCSV = () => {
    if (!data) return;
    let csv = `Date Range: ${getFilterLabel()}\n\n`;
    csv += "User/Cashier,Sales Count,Total Revenue Generated (TZS)\n";
    data.topUsers.forEach(u => {
      csv += `"${u.name}",${u.count},${u.total}\n`;
    });
    downloadCSV(csv, `user_performance_${dateFilter}`);
  };

  const downloadCSV = (csv: string, filename: string) => {
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading || !data) return <div className="text-muted-foreground p-8 text-center">{t("loading")}</div>;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("reports")} & Analytics</h1>
          <p className="text-sm text-muted-foreground">Comprehensive business performance insights</p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-border">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {getFilterLabel()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setDateFilter("today")}>Today (Daily)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter("week")}>Last 7 Days (Weekly)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter("month")}>Last 30 Days (Monthly)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter("all")}>All Time</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <DownloadCloud className="mr-2 h-4 w-4" />
                Export Reports
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportSalesCSV}>Download Sales & Profit Report</DropdownMenuItem>
              <DropdownMenuItem onClick={exportProductsCSV}>Download Product Performance Report</DropdownMenuItem>
              <DropdownMenuItem onClick={exportUsersCSV}>Download User Performance Report</DropdownMenuItem>
              <DropdownMenuItem onClick={exportDebtCSV}>Download Outstanding Debt Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Total Sales", v: formatTZS(data.totalSales), color: "" },
          { l: "Total Expenses", v: formatTZS(data.totalExpenses), color: "text-destructive" },
          { l: "Net Profit (estimate)", v: formatTZS(profit), color: profit > 0 ? "text-success" : "" },
          { l: "Inventory Value", v: formatTZS(data.inventoryValue), color: "" },
        ].map((c) => (
          <div key={c.l} className="rounded-xl border border-border bg-card p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.l}</div>
            <div className={`mt-2 text-2xl font-bold ${c.color}`}>{c.v}</div>
          </div>
        ))}
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 mt-4">
        <div className="rounded-xl border border-border bg-card p-5 bg-muted/10">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Customer Debt (To Collect)</div>
          <div className="mt-2 text-xl font-bold text-warning">{formatTZS(data.customerDebt)}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 bg-muted/10">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Supplier Debt (To Pay)</div>
          <div className="mt-2 text-xl font-bold text-destructive">{formatTZS(data.supplierDebt)}</div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold mb-4">Sales Trend ({getFilterLabel()})</h2>
        <div className="flex items-end gap-2 h-48">
          {data.days.length === 0 ? (
            <div className="text-sm text-muted-foreground m-auto">{t("noData")}</div>
          ) : (
            data.days.map(([d, val]) => (
              <div key={d} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md"
                  style={{
                    height: `${(val / data.maxDay) * 100}%`,
                    background: "var(--gradient-primary)",
                    minHeight: "4px",
                  }}
                  title={`${d}: ${formatTZS(val)}`}
                />
                <span className="text-[10px] text-muted-foreground">{d.slice(5)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold mb-4">Top 10 Products by Revenue</h2>
          <div className="space-y-4">
            {data.topProducts.length === 0 ? (
              <div className="text-sm text-muted-foreground">{t("noData")}</div>
            ) : (
              data.topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-bold text-muted-foreground">{i + 1}</div>
                    <div>
                      <div className="font-medium text-sm">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.quantity} units sold</div>
                    </div>
                  </div>
                  <div className="font-semibold">{formatTZS(p.revenue)}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold mb-4">Cashier Performance</h2>
          <div className="space-y-4">
            {data.topUsers.length === 0 ? (
              <div className="text-sm text-muted-foreground">{t("noData")}</div>
            ) : (
              data.topUsers.map((u, i) => (
                <div key={u.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{u.name}</div>
                      <div className="text-xs text-muted-foreground">{u.count} sales processed</div>
                    </div>
                  </div>
                  <div className="font-semibold text-success">{formatTZS(u.total)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold mb-4">By Payment Method</h2>
          <div className="space-y-3">
            {Object.entries(data.byPayment).length === 0 ? (
              <div className="text-sm text-muted-foreground">{t("noData")}</div>
            ) : (
              Object.entries(data.byPayment).map(([k, v]) => (
                <div key={k}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{k.replace("_", " ")}</span>
                    <span className="font-semibold">{formatTZS(v)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: `${(v / data.totalSales) * 100}%`,
                        background: "var(--gradient-primary)",
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold mb-4">Expenses by Category</h2>
          <div className="space-y-3">
            {Object.entries(data.byCategory).length === 0 ? (
              <div className="text-sm text-muted-foreground">{t("noData")}</div>
            ) : (
              Object.entries(data.byCategory).map(([k, v]) => (
                <div key={k}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{k}</span>
                    <span className="font-semibold">{formatTZS(v)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-warning"
                      style={{
                        width: `${(v / data.totalExpenses) * 100}%`,
                        background: "var(--warning)",
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
