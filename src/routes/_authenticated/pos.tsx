import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useT, formatTZS } from "@/lib/i18n";
import { useAuth } from "@/lib/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus, Minus, Trash2, Receipt as ReceiptIcon } from "lucide-react";
import { toast } from "sonner";
import { Receipt } from "@/components/Receipt";

export const Route = createFileRoute("/_authenticated/pos")({
  component: POSPage,
});

type Product = {
  id: string; name: string; price: number; stock_quantity: number; sku: string | null;
};
type CartItem = Product & { qty: number };

function POSPage() {
  const t = useT();
  const qc = useQueryClient();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "mobile_money" | "card" | "credit" | "bank">("cash");
  const [amountPaid, setAmountPaid] = useState(0);
  const [customerId, setCustomerId] = useState<string>("");
  const [completedSale, setCompletedSale] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("id,name,price,stock_quantity,sku").eq("is_active", true);
      return (data ?? []) as Product[];
    },
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["customers-list"],
    queryFn: async () => {
      const { data } = await supabase.from("customers").select("id,name").order("name");
      return data ?? [];
    },
  });

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);
  const total = Math.max(0, subtotal - Number(discount || 0));

  const addToCart = (p: Product) => {
    setCart((c) => {
      const existing = c.find((i) => i.id === p.id);
      if (existing) return c.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      return [...c, { ...p, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((c) =>
      c.map((i) => (i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i)).filter((i) => i.qty > 0),
    );
  };

  const removeItem = (id: string) => setCart((c) => c.filter((i) => i.id !== id));

  const completeSale = async () => {
    if (cart.length === 0) return toast.error("Cart is empty");
    if (!user) return;
    setSubmitting(true);
    try {
      const receiptNumber = `R${Date.now().toString().slice(-8)}`;
      const { data: sale, error } = await supabase
        .from("sales")
        .insert({
          receipt_number: receiptNumber,
          cashier_id: user.id,
          customer_id: customerId || null,
          subtotal,
          discount: Number(discount || 0),
          tax: 0,
          total,
          amount_paid: Number(amountPaid || total),
          payment_method: paymentMethod,
          status: "completed",
        })
        .select()
        .single();
      if (error) throw error;

      const items = cart.map((i) => ({
        sale_id: sale.id,
        product_id: i.id,
        product_name: i.name,
        quantity: i.qty,
        unit_price: i.price,
        line_total: i.price * i.qty,
      }));
      const { error: itemErr } = await supabase.from("sale_items").insert(items);
      if (itemErr) throw itemErr;

      toast.success("Sale completed");
      setCompletedSale({ ...sale, items: cart });
      setCart([]);
      setDiscount(0);
      setAmountPaid(0);
      setCustomerId("");
      qc.invalidateQueries();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (completedSale) {
    return (
      <Receipt
        sale={completedSale}
        onClose={() => setCompletedSale(null)}
      />
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 -mx-2 lg:mx-0">
      {/* Products */}
      <div className="lg:col-span-2 space-y-4">
        <div>
          <h1 className="text-3xl font-bold">{t("pos")}</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search")}
            className="pl-10"
            autoFocus
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[70vh] overflow-y-auto pr-1">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => addToCart(p)}
              disabled={p.stock_quantity <= 0}
              className="text-left rounded-xl border border-border bg-card p-4 hover:border-primary hover:shadow-[var(--shadow-soft)] disabled:opacity-40 transition"
            >
              <div className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">{p.name}</div>
              <div className="mt-2 text-base font-bold">{formatTZS(Number(p.price))}</div>
              <div className="mt-1 text-xs text-muted-foreground">{p.stock_quantity} in stock</div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-sm text-muted-foreground py-10">{t("noData")}</div>
          )}
        </div>
      </div>

      {/* Cart */}
      <div className="rounded-xl border border-border bg-card flex flex-col h-[calc(100vh-8rem)] sticky top-4">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <ReceiptIcon className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">{t("cart")}</h2>
          <span className="ml-auto text-xs text-muted-foreground">{cart.length} items</span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {cart.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">{t("emptyCart")}</div>
          ) : cart.map((i) => (
            <div key={i.id} className="px-4 py-3 flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{i.name}</div>
                <div className="text-xs text-muted-foreground">{formatTZS(i.price)}</div>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" onClick={() => updateQty(i.id, -1)} className="h-7 w-7">
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center text-sm font-medium">{i.qty}</span>
                <Button size="icon" variant="ghost" onClick={() => updateQty(i.id, 1)} className="h-7 w-7">
                  <Plus className="h-3 w-3" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => removeItem(i.id)} className="h-7 w-7">
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border p-4 space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("subtotal")}</span>
              <span>{formatTZS(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">{t("discount")}</span>
              <Input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-24 h-8 text-right"
              />
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
              <span>{t("total")}</span>
              <span>{formatTZS(total)}</span>
            </div>
          </div>

          <div>
            <Label className="text-xs">{t("customer")}</Label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">{t("walkIn")}</option>
              {customers.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-xs">{t("paymentMethod")}</Label>
            <div className="mt-1 grid grid-cols-3 gap-1">
              {(["cash", "mobile_money", "card", "credit", "bank"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`rounded-md border px-2 py-1.5 text-xs font-medium ${
                    paymentMethod === m
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background"
                  }`}
                >
                  {t(m === "mobile_money" ? "mobileMoney" : (m as any))}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={completeSale}
            disabled={submitting || cart.length === 0}
            className="w-full"
            size="lg"
            style={{ background: "var(--gradient-primary)" }}
          >
            {submitting ? "..." : `${t("completeSale")} · ${formatTZS(total)}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
