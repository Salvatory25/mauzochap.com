import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useT, formatTZS, formatDate } from "@/lib/i18n";
import { TrendingUp, Boxes, Users, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const t = useT();

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekAgo = new Date(Date.now() - 7 * 86400000);
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

      const [todayRes, weekRes, monthRes, productsRes, lowStockRes, customersRes] = await Promise.all([
        supabase.from("sales").select("total").gte("created_at", today.toISOString()).eq("status", "completed"),
        supabase.from("sales").select("total").gte("created_at", weekAgo.toISOString()).eq("status", "completed"),
        supabase.from("sales").select("total").gte("created_at", monthStart.toISOString()).eq("status", "completed"),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id, name, stock_quantity, low_stock_threshold").lte("stock_quantity", 5),
        supabase.from("customers").select("id", { count: "exact", head: true }),
      ]);

      const sum = (rows: any) => (rows ?? []).reduce((s: number, r: any) => s + Number(r.total || 0), 0);

      return {
        today: sum(todayRes.data),
        week: sum(weekRes.data),
        month: sum(monthRes.data),
        productCount: productsRes.count ?? 0,
        lowStock: lowStockRes.data ?? [],
        customerCount: customersRes.count ?? 0,
      };
    },
  });

  const { data: recent } = useQuery({
    queryKey: ["recent-sales"],
    queryFn: async () => {
      const { data } = await supabase
        .from("sales")
        .select("id, receipt_number, total, payment_method, created_at")
        .order("created_at", { ascending: false })
        .limit(8);
      return data ?? [];
    },
  });

  const cards = [
    { label: t("todaySales"), value: formatTZS(stats?.today ?? 0), icon: TrendingUp, accent: "var(--gradient-primary)" },
    { label: t("weekSales"), value: formatTZS(stats?.week ?? 0), icon: TrendingUp },
    { label: t("monthSales"), value: formatTZS(stats?.month ?? 0), icon: TrendingUp },
    { label: t("totalProducts"), value: String(stats?.productCount ?? 0), icon: Boxes },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("dashboard")}</h1>
        <p className="text-sm text-muted-foreground">Overview of your business today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <div key={c.label} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{c.label}</span>
              <div
                className="grid h-8 w-8 place-items-center rounded-md text-primary-foreground"
                style={{ background: i === 0 ? "var(--gradient-primary)" : "var(--primary)" }}
              >
                <c.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold tracking-tight">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold">{t("recentSales")}</h2>
          </div>
          <div className="divide-y divide-border">
            {recent && recent.length > 0 ? recent.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <div>
                  <div className="font-medium">{s.receipt_number}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(s.created_at)} · {s.payment_method}</div>
                </div>
                <div className="font-semibold">{formatTZS(Number(s.total))}</div>
              </div>
            )) : (
              <div className="px-5 py-10 text-center text-sm text-muted-foreground">{t("noData")}</div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <h2 className="font-semibold">{t("lowStock")}</h2>
          </div>
          <div className="divide-y divide-border">
            {stats?.lowStock && stats.lowStock.length > 0 ? stats.lowStock.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <span>{p.name}</span>
                <span className="rounded-full bg-warning/15 text-warning-foreground px-2 py-0.5 text-xs font-medium" style={{ color: "var(--warning)" }}>
                  {p.stock_quantity}
                </span>
              </div>
            )) : (
              <div className="px-5 py-10 text-center text-sm text-muted-foreground">{t("noData")}</div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
        <Users className="h-5 w-5 text-primary" />
        <div>
          <div className="text-sm font-semibold">{stats?.customerCount ?? 0} {t("customers")}</div>
          <div className="text-xs text-muted-foreground">in your system</div>
        </div>
      </div>
    </div>
  );
}
