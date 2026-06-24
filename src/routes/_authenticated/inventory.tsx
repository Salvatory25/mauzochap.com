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
import { Plus, Search, Settings2, DownloadCloud, History, FileDown } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/inventory")({
  component: InventoryPage,
});

type Product = {
  id: string;
  name: string;
  sku: string | null;
  stock_quantity: number;
  low_stock_threshold: number;
  cost: number;
};

function InventoryPage() {
  const t = useT();
  const { isManager, branchId } = useAuth();
  const [search, setSearch] = useState("");
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products-inventory", branchId],
    enabled: !!branchId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`id,name,sku,low_stock_threshold,cost, branch_inventory!inner(stock_quantity)`)
        .eq("branch_inventory.branch_id", branchId!)
        .order("name");
        
      if (error) throw error;
      return (data ?? []).map((p: any) => ({
        ...p,
        stock_quantity: p.branch_inventory?.[0]?.stock_quantity || 0
      })) as Product[];
    },
  });

  const filtered = products.filter(
    (p) =>
      (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.sku || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const exportCSV = () => {
    const header = ["Product", "SKU", "In Stock", "Cost Value (TZS)", "Status"];
    const rows = filtered.map(p => {
      const status = p.stock_quantity <= 0 ? "Out of Stock" : (p.stock_quantity <= p.low_stock_threshold ? "Low Stock" : "In Stock");
      return `"${p.name}","${p.sku || ""}","${p.stock_quantity}","${p.stock_quantity * p.cost}","${status}"`;
    });
    const csvContent = "data:text/csv;charset=utf-8," + [header.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `inventory_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Report downloaded");
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("inventory")}</h1>
          <p className="text-sm text-muted-foreground">{products.length} active products in inventory</p>
        </div>
        {isManager && (
          <div className="flex gap-2">
            <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-border">
                  <History className="h-4 w-4 mr-2" /> Stock History
                </Button>
              </DialogTrigger>
              {historyOpen && <StockHistoryDialog onClose={() => setHistoryOpen(false)} />}
            </Dialog>

            <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-border">
                  <Settings2 className="h-4 w-4 mr-2" /> Adjust Stock
                </Button>
              </DialogTrigger>
              <AdjustStockDialog products={products} onClose={() => setAdjustOpen(false)} />
            </Dialog>

            <Dialog open={receiveOpen} onOpenChange={setReceiveOpen}>
              <DialogTrigger asChild>
                <Button>
                  <DownloadCloud className="h-4 w-4 mr-2" /> Receive Purchase
                </Button>
              </DialogTrigger>
              <ReceivePurchaseDialog products={products} onClose={() => setReceiveOpen(false)} />
            </Dialog>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search products..."
            className="pl-10"
          />
        </div>
        
        {isManager && (
          <Button variant="secondary" onClick={exportCSV}>
            <FileDown className="h-4 w-4 mr-2" /> Export Report
          </Button>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">SKU</th>
              <th className="px-4 py-3 text-right">In Stock</th>
              <th className="px-4 py-3 text-right">Cost Value</th>
              <th className="px-4 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  {t("loading")}
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  {t("noData")}
                </td>
              </tr>
            ) : (
              paginated.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.sku || "—"}</td>
                  <td className="px-4 py-3 text-right text-lg font-bold">{p.stock_quantity}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {formatTZS(p.stock_quantity * p.cost)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {p.stock_quantity <= 0 ? (
                      <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                        Out of Stock
                      </span>
                    ) : p.stock_quantity <= p.low_stock_threshold ? (
                      <span className="inline-flex items-center rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning">
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
                        In Stock
                      </span>
                    )}
                  </td>
                </tr>
              ))
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

function StockHistoryDialog({ onClose }: { onClose: () => void }) {
  const { branchId } = useAuth();
  
  const { data: movements = [], isLoading } = useQuery({
    queryKey: ["stock-movements", branchId],
    enabled: !!branchId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stock_movements")
        .select(`
          id, movement_type, quantity_change, notes, created_at,
          products(name, sku),
          profiles(full_name)
        `)
        .eq("branch_id", branchId!)
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    }
  });

  return (
    <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>Stock Movement History</DialogTitle>
      </DialogHeader>
      
      <div className="flex-1 overflow-auto mt-4 rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 sticky top-0 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-right">Change</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center">Loading history...</td></tr>
            ) : movements.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No stock movements found.</td></tr>
            ) : (
              movements.map((m: any) => (
                <tr key={m.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground text-xs">{formatDate(m.created_at)}</td>
                  <td className="px-4 py-3 font-medium">{m.products?.name} <span className="text-muted-foreground text-xs font-normal">({m.products?.sku || '-'})</span></td>
                  <td className="px-4 py-3 capitalize">{m.movement_type}</td>
                  <td className="px-4 py-3 text-right font-mono font-medium">
                    <span className={m.quantity_change > 0 ? "text-success" : "text-destructive"}>
                      {m.quantity_change > 0 ? "+" : ""}{m.quantity_change}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{m.profiles?.full_name || 'System'}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{m.notes || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="pt-2 text-right">
        <Button onClick={onClose} variant="ghost">Close</Button>
      </div>
    </DialogContent>
  );
}

function AdjustStockDialog({ products, onClose }: { products: Product[]; onClose: () => void }) {
  const qc = useQueryClient();
  const { user, branchId } = useAuth();
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(0); 
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || quantity === 0 || !branchId) return toast.error("Invalid adjustment");
    setSaving(true);
    
    try {
      const { error: moveErr } = await supabase.from("stock_movements").insert({
        product_id: productId,
        branch_id: branchId,
        movement_type: "adjustment",
        quantity_change: quantity,
        notes,
        created_by: user?.id,
      });
      if (moveErr) throw moveErr;

      const product = products.find(p => p.id === productId);
      if (!product) throw new Error("Product not found");
      
      const { error: prodErr } = await supabase
        .from("branch_inventory")
        .update({ stock_quantity: product.stock_quantity + quantity })
        .match({ product_id: productId, branch_id: branchId });
        
      if (prodErr) throw prodErr;

      toast.success("Stock adjusted successfully");
      qc.invalidateQueries({ queryKey: ["products-inventory"] });
      onClose();
    } catch (err: unknown) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adjust Stock</DialogTitle>
      </DialogHeader>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label>Select Product</Label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          >
            <option value="">-- Select Product --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (Current: {p.stock_quantity})
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Quantity Adjustment (+ to add, - to remove)</Label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
            placeholder="-5 or +10"
          />
        </div>
        <div>
          <Label>Reason / Notes</Label>
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Damaged goods, inventory count correction"
            required
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving || !productId || quantity === 0}>
            {saving ? "..." : "Adjust Stock"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}

function ReceivePurchaseDialog({ products, onClose }: { products: Product[]; onClose: () => void }) {
  const qc = useQueryClient();
  const { user, branchId } = useAuth();
  
  const [supplierId, setSupplierId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitCost, setUnitCost] = useState(0);
  const [amountPaid, setAmountPaid] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  
  const [saving, setSaving] = useState(false);

  const { data: suppliers = [] } = useQuery({
    queryKey: ["suppliers-list"],
    queryFn: async () => {
      const { data } = await supabase.from("suppliers").select("id,name").order("name");
      return data ?? [];
    },
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || quantity <= 0 || !supplierId || !branchId) return toast.error("Please fill all required fields");
    setSaving(true);
    
    try {
      const lineTotal = quantity * unitCost;
      const paid = amountPaid === "" ? lineTotal : Number(amountPaid);
      
      const { data: purchase, error: purchErr } = await supabase.from("purchases").insert({
        supplier_id: supplierId,
        branch_id: branchId,
        invoice_number: invoiceNumber || null,
        total_amount: lineTotal,
        amount_paid: paid,
        created_by: user?.id,
      }).select().single();
      
      if (purchErr) throw purchErr;

      const { error: itemErr } = await supabase.from("purchase_items").insert({
        purchase_id: purchase.id,
        product_id: productId,
        quantity,
        unit_cost: unitCost,
        line_total: lineTotal,
      });

      if (itemErr) throw itemErr;

      // Track Batch & Expiry Date if provided
      if (batchNumber) {
        await supabase.from("product_batches").insert({
          product_id: productId,
          branch_id: branchId,
          batch_number: batchNumber,
          expiry_date: expiryDate || null,
          stock_quantity: quantity
        });
      }

      toast.success("Purchase received successfully");
      qc.invalidateQueries(); 
      onClose();
    } catch (err: unknown) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Receive Purchase from Supplier</DialogTitle>
      </DialogHeader>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Supplier</Label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
            >
              <option value="">-- Select --</option>
              {suppliers.map((s: {id: string, name: string}) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Invoice Number (Optional)</Label>
            <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
          </div>
        </div>
        
        <div className="border-t border-border pt-4">
          <Label>Product to Restock</Label>
          <select
            value={productId}
            onChange={(e) => {
              setProductId(e.target.value);
              const p = products.find(x => x.id === e.target.value);
              if (p) setUnitCost(p.cost || 0);
            }}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          >
            <option value="">-- Select Product --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Quantity Received</Label>
            <Input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required />
          </div>
          <div>
            <Label>Unit Cost (TZS)</Label>
            <Input type="number" step="0.01" value={unitCost} onChange={(e) => setUnitCost(Number(e.target.value))} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div>
            <Label>Batch/Lot Number</Label>
            <Input value={batchNumber} onChange={(e) => setBatchNumber(e.target.value)} placeholder="Optional" />
          </div>
          <div>
            <Label>Expiry Date</Label>
            <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
          </div>
        </div>

        <div className="border-t border-border pt-4 grid grid-cols-2 gap-3 items-end">
          <div>
            <Label>Total Value</Label>
            <div className="text-lg font-bold">{formatTZS(quantity * unitCost)}</div>
          </div>
          <div>
            <Label>Amount Paid</Label>
            <Input 
              type="number" 
              placeholder={String(quantity * unitCost)} 
              value={amountPaid} 
              onChange={(e) => setAmountPaid(e.target.value)} 
            />
            <p className="text-[10px] text-muted-foreground mt-1">Leave empty if fully paid.</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-border mt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving || !productId || !supplierId}>
            {saving ? "..." : "Complete Purchase"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
