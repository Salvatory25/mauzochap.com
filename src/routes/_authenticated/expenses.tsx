import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useT, formatTZS, formatDate } from "@/lib/i18n";
import { useAuth } from "@/lib/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/expenses")({
  component: ExpensesPage,
});

function ExpensesPage() {
  const t = useT();
  const qc = useQueryClient();
  const { user, isManager } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ category: "Rent", description: "", amount: 0 });

  const { data: expenses = [] } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const { data } = await supabase.from("expenses").select("*").order("expense_date", { ascending: false });
      return data ?? [];
    },
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("expenses").insert({ ...form, created_by: user?.id });
    if (error) return toast.error(error.message);
    toast.success("Expense added");
    setOpen(false);
    setForm({ category: "Rent", description: "", amount: 0 });
    qc.invalidateQueries({ queryKey: ["expenses"] });
  };

  const total = expenses.reduce((s: number, e: any) => s + Number(e.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("expenses")}</h1>
          <p className="text-sm text-muted-foreground">Total tracked: {formatTZS(total)}</p>
        </div>
        {isManager && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Add Expense</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="space-y-3">
                <div>
                  <Label>{t("category")}</Label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    {["Rent", "Utilities", "Salaries", "Supplies", "Transport", "Marketing", "Other"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <div><Label>Amount (TZS)</Label><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} required /></div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)}>{t("cancel")}</Button>
                  <Button type="submit">{t("save")}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">{t("category")}</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {expenses.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">{t("noData")}</td></tr>
            ) : expenses.map((e: any) => (
              <tr key={e.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 text-muted-foreground">{formatDate(e.expense_date)}</td>
                <td className="px-4 py-3 font-medium">{e.category}</td>
                <td className="px-4 py-3 text-muted-foreground">{e.description ?? "—"}</td>
                <td className="px-4 py-3 text-right">{formatTZS(Number(e.amount))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
