import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useT, formatTZS } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const t = useT();

  const { data, isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const last30 = new Date(Date.now() - 30 * 86400000).toISOString();
      const [salesRes, expensesRes, productsRes] = await Promise.all([
        supabase.from("sales").select("total, payment_method, created_at, status").gte("created_at", last30),
        supabase.from("expenses").select("amount, category, expense_date").gte("expense_date", last30.slice(0, 10)),
        supabase.from("products").select("name, stock_quantity, cost, price").order("stock_quantity"),
      ]);

      const sales = (salesRes.data ?? []).filter((s) => s.status === "completed");
      const expenses = expensesRes.data ?? [];
      const products = productsRes.data ?? [];

      const byDay: Record<string, number> = {};
      sales.forEach((s) => {
        const d = String(s.created_at).slice(0, 10);
        byDay[d] = (byDay[d] || 0) + Number(s.total);
      });
      const days = Object.entries(byDay).sort().slice(-14);
      const maxDay = Math.max(1, ...days.map((d) => d[1]));

      const byPayment: Record<string, number> = {};
      sales.forEach((s) => {
        byPayment[s.payment_method] = (byPayment[s.payment_method] || 0) + Number(s.total);
      });

      const byCategory: Record<string, number> = {};
      expenses.forEach((e: any) => {
        byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount);
      });

      const inventoryValue = products.reduce((s, p: any) => s + Number(p.cost) * Number(p.stock_quantity), 0);
      const totalSales = sales.reduce((s, x) => s + Number(x.total), 0);
      const totalExpenses = expenses.reduce((s: number, x: any) => s + Number(x.amount), 0);

      return { days, maxDay, byPayment, byCategory, inventoryValue, totalSales, totalExpenses, products };
    },
  });

  if (isLoading || !data) return <div className="text-muted-foreground">{t("loading")}</div>;

  const profit = data.totalSales - data.totalExpenses;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("reports")}</h1>
        <p className="text-sm text-muted-foreground">Last 30 days</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Total Sales", v: formatTZS(data.totalSales) },
          { l: "Total Expenses", v: formatTZS(data.totalExpenses) },
          { l: "Net (estimate)", v: formatTZS(profit) },
          { l: "Inventory Value", v: formatTZS(data.inventoryValue) },
        ].map((c) => (
          <div key={c.l} className="rounded-xl border border-border bg-card p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.l}</div>
            <div className="mt-2 text-2xl font-bold">{c.v}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold mb-4">Sales — last 14 days</h2>
        <div className="flex items-end gap-2 h-48">
          {data.days.length === 0 ? (
            <div className="text-sm text-muted-foreground m-auto">{t("noData")}</div>
          ) : data.days.map(([d, val]) => (
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
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold mb-4">By Payment Method</h2>
          <div className="space-y-3">
            {Object.entries(data.byPayment).length === 0 ? (
              <div className="text-sm text-muted-foreground">{t("noData")}</div>
            ) : Object.entries(data.byPayment).map(([k, v]) => (
              <div key={k}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{k.replace("_", " ")}</span>
                  <span className="font-semibold">{formatTZS(v)}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full" style={{ width: `${(v / data.totalSales) * 100}%`, background: "var(--gradient-primary)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold mb-4">Expenses by Category</h2>
          <div className="space-y-3">
            {Object.entries(data.byCategory).length === 0 ? (
              <div className="text-sm text-muted-foreground">{t("noData")}</div>
            ) : Object.entries(data.byCategory).map(([k, v]) => (
              <div key={k}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{k}</span>
                  <span className="font-semibold">{formatTZS(v)}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-warning" style={{ width: `${(v / data.totalExpenses) * 100}%`, background: "var(--warning)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
