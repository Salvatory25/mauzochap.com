import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useT, formatTZS, formatDate } from "@/lib/i18n";
import { useAuth } from "@/lib/use-auth";
import { Button } from "@/components/ui/button";
import { Receipt } from "@/components/Receipt";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FileText, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/invoices")({
  component: InvoicesPage,
});

function InvoicesPage() {
  const t = useT();
  const qc = useQueryClient();
  const { branchId, user } = useAuth();
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [viewInvoice, setViewInvoice] = useState<any>(null);

  const [paymentAmount, setPaymentAmount] = useState<number | "">("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [submitting, setSubmitting] = useState(false);

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["invoices", branchId],
    queryFn: async () => {
      let q = supabase
        .from("sales")
        .select(`
          id, receipt_number, total, amount_paid, payment_method, status, created_at, customer_id, notes,
          customer:customers(name, phone)
        `)
        .or('status.eq.pending,payment_method.eq.credit')
        .order("created_at", { ascending: false })
        .limit(1000);
      if (branchId) {
        q = q.or(`branch_id.eq.${branchId},branch_id.is.null`);
      }
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  const handleReceivePayment = async () => {
    if (!selectedInvoice || !user) return;
    const amount = Number(paymentAmount);
    if (!amount || amount <= 0) return toast.error("Enter a valid payment amount");
    
    setSubmitting(true);
    try {
      const newPaid = Number(selectedInvoice.amount_paid) + amount;
      const isFullyPaid = newPaid >= selectedInvoice.total;
      
      const { error } = await supabase
        .from("sales")
        .update({
          amount_paid: newPaid,
          status: isFullyPaid ? 'completed' : selectedInvoice.status,
          payment_method: paymentMethod as any,
          notes: (selectedInvoice.notes ? selectedInvoice.notes + '\n' : '') + `Payment received: ${formatTZS(amount)} via ${paymentMethod}`
        })
        .eq("id", selectedInvoice.id);

      if (error) throw error;

      toast.success("Payment recorded successfully");
      setSelectedInvoice(null);
      setPaymentAmount("");
      qc.invalidateQueries({ queryKey: ["invoices"] });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewInvoice = async (invoice: any) => {
    // Fetch items for the invoice to display the receipt
    const { data: items } = await supabase
      .from("sale_items")
      .select("id, product_name, quantity, unit_price")
      .eq("sale_id", invoice.id);
      
    setViewInvoice({
      ...invoice,
      items: (items || []).map(i => ({ id: i.id, name: i.product_name, qty: i.quantity, price: i.unit_price }))
    });
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" /> 
          Invoices
        </h1>
        <p className="text-sm text-muted-foreground">Manage Proforma and Credit invoices.</p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Invoice No.</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">Balance</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  {t("loading")}
                </td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  No invoices found.
                </td>
              </tr>
            ) : (
              invoices.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE).map((inv: any) => {
                const isProforma = inv.status === 'pending';
                const balance = Number(inv.total) - Number(inv.amount_paid);
                
                return (
                <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{inv.receipt_number}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(inv.created_at)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{inv.customer?.name || 'Walk-in'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${
                        isProforma ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive"
                      }`}
                    >
                      {isProforma ? "Proforma" : "Credit"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {formatTZS(Number(inv.total))}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-destructive">
                    {formatTZS(balance)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewInvoice(inv)}>
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => { setSelectedInvoice(inv); setPaymentAmount(balance); }}
                        disabled={balance <= 0}
                      >
                        Receive Payment
                      </Button>
                    </div>
                  </td>
                </tr>
              )})
            )}
          </tbody>
        </table>
      </div>

      {Math.ceil(invoices.length / ITEMS_PER_PAGE) > 1 && (
        <div className="flex items-center justify-between border border-border bg-card p-3 rounded-lg mt-4 shadow-sm">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground font-medium">
            Page {page} of {Math.ceil(invoices.length / ITEMS_PER_PAGE)}
          </span>
          <Button variant="outline" size="sm" disabled={page === Math.ceil(invoices.length / ITEMS_PER_PAGE)} onClick={() => setPage(p => p + 1)}>
            Next
          </Button>
        </div>
      )}

      {/* View Invoice Dialog */}
      <Dialog open={!!viewInvoice} onOpenChange={() => setViewInvoice(null)}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          {viewInvoice && (
            <div className="w-full mt-4 bg-muted p-4 rounded-md">
              <Receipt sale={viewInvoice} onClose={() => setViewInvoice(null)} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Receive Payment Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedInvoice && (
            <div className="space-y-4 pt-4">
              <div className="flex flex-col items-center justify-center space-y-2 mb-6 text-center">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold">Receive Payment</h2>
                <p className="text-sm text-muted-foreground">For Invoice {selectedInvoice.receipt_number}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="text-muted-foreground">Invoice Total</span>
                  <span>{formatTZS(Number(selectedInvoice.total))}</span>
                </div>
                <div className="flex justify-between text-sm font-medium mb-4 pb-4 border-b border-border">
                  <span className="text-destructive font-bold">Outstanding Balance</span>
                  <span className="text-destructive font-bold">{formatTZS(Number(selectedInvoice.total) - Number(selectedInvoice.amount_paid))}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Payment Amount</Label>
                  <Input 
                    type="number" 
                    value={paymentAmount} 
                    onChange={(e) => setPaymentAmount(e.target.value === "" ? "" : Number(e.target.value))} 
                    max={Number(selectedInvoice.total) - Number(selectedInvoice.amount_paid)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <select 
                    value={paymentMethod} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="cash">Cash</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="card">Card</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 w-full mt-6">
                <Button className="w-1/3" variant="outline" onClick={() => setSelectedInvoice(null)}>
                  Cancel
                </Button>
                <Button className="w-2/3" onClick={handleReceivePayment} disabled={submitting || !paymentAmount}>
                  {submitting ? "Processing..." : "Confirm Payment"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
