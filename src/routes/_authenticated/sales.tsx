import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useT, formatTZS, formatDate } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/sales")({
  component: SalesPage,
});

function SalesPage() {
  const t = useT();

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ["sales-history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales")
        .select("id, receipt_number, total, payment_method, status, created_at, customer_id")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("sales")}</h1>
        <p className="text-sm text-muted-foreground">Latest 100 transactions.</p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">{t("receipt")}</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Payment</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">{t("total")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">{t("loading")}</td></tr>
            ) : sales.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">{t("noData")}</td></tr>
            ) : sales.map((s) => (
              <tr key={s.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{s.receipt_number}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(s.created_at)}</td>
                <td className="px-4 py-3 capitalize">{String(s.payment_method).replace("_", " ")}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    s.status === "completed" ? "bg-success/15 text-success" : "bg-muted"
                  }`} style={s.status === "completed" ? { color: "var(--success)" } : {}}>
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-semibold">{formatTZS(Number(s.total))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
