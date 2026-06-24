import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useT, formatTZS, formatDate } from "@/lib/i18n";
import { useAuth } from "@/lib/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const expenseSchema = z.object({
  category: z.string().min(1, "Category is required"),
  description: z.string().optional().nullable(),
  amount: z.number().min(0, "Amount cannot be negative"),
});

export const Route = createFileRoute("/_authenticated/expenses")({
  component: ExpensesPage,
});

function ExpensesPage() {
  const t = useT();
  const qc = useQueryClient();
  const { user, isManager, branchId } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ category: "Rent", description: "", amount: 0 });
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  const { data: expenses = [] } = useQuery({
    queryKey: ["expenses", branchId],
    enabled: isManager,
    queryFn: async () => {
      let q = supabase
        .from("expenses")
        .select("*")
        .order("expense_date", { ascending: false });
      if (branchId) {
        q = q.eq("branch_id", branchId);
      }
      const { data } = await q;
      return data ?? [];
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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchId) return toast.error("No active branch");

    const parsed = expenseSchema.safeParse(form);
    if (!parsed.success) {
      parsed.error.errors.forEach((err) => toast.error(err.message));
      return;
    }

    const { error } = await supabase.from("expenses").insert({ ...form, created_by: user?.id, branch_id: branchId });
    if (error) return toast.error(error.message);
    toast.success("Expense added");
    setOpen(false);
    setForm({ category: "Rent", description: "", amount: 0 });
    qc.invalidateQueries({ queryKey: ["expenses"] });
  };

  const total = expenses.reduce(
    (s: number, e: { amount: number | null | string }) => s + Number(e.amount || 0),
    0,
  );

  const totalPages = Math.ceil(expenses.length / ITEMS_PER_PAGE);
  const paginated = expenses.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

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
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Expense</DialogTitle>
              </DialogHeader>
              <form onSubmit={submit} className="space-y-3">
                <div>
                  <Label>{t("category")}</Label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {[
                      "Rent",
                      "Utilities",
                      "Salaries",
                      "Supplies",
                      "Transport",
                      "Marketing",
                      "Other",
                    ].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Amount (TZS)</Label>
                  <Input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                    {t("cancel")}
                  </Button>
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
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                  {t("noData")}
                </td>
              </tr>
            ) : (
              paginated.map(
                (e: {
                  id: string;
                  expense_date: string;
                  category: string;
                  description: string | null;
                  amount: number | string;
                }) => (
                  <tr key={e.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(e.expense_date)}
                    </td>
                    <td className="px-4 py-3 font-medium">{e.category}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.description ?? "—"}</td>
                    <td className="px-4 py-3 text-right">{formatTZS(Number(e.amount))}</td>
                  </tr>
                ),
              )
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border border-border bg-card p-3 rounded-lg mt-4">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
