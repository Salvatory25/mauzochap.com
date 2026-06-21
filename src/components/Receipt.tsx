import { Button } from "@/components/ui/button";
import { useT, formatTZS, formatDate } from "@/lib/i18n";
import { useState } from "react";
import { Printer, X } from "lucide-react";

type SaleData = {
  id: string;
  receipt_number: string;
  total: number;
  subtotal: number;
  discount: number;
  payment_method: string;
  amount_paid: number;
  created_at: string;
  items: { id: string; name: string; qty: number; price: number }[];
};

export function Receipt({ sale, onClose }: { sale: SaleData; onClose: () => void }) {
  const t = useT();
  const [format, setFormat] = useState<"thermal" | "a4">("thermal");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold">{t("receipt")} {sale.receipt_number}</h1>
          <p className="text-sm text-muted-foreground">Sale completed successfully.</p>
        </div>
        <div className="flex gap-2">
          <div className="rounded-lg border border-border p-1 bg-card">
            <button
              onClick={() => setFormat("thermal")}
              className={`px-3 py-1.5 text-xs rounded-md ${format === "thermal" ? "bg-primary text-primary-foreground" : ""}`}
            >
              {t("thermal")}
            </button>
            <button
              onClick={() => setFormat("a4")}
              className={`px-3 py-1.5 text-xs rounded-md ${format === "a4" ? "bg-primary text-primary-foreground" : ""}`}
            >
              {t("a4")}
            </button>
          </div>
          <Button onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" /> {t("print")}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-4 w-4 mr-2" /> Close
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        {format === "thermal" ? <ThermalReceipt sale={sale} /> : <A4Receipt sale={sale} />}
      </div>
    </div>
  );
}

function ThermalReceipt({ sale }: { sale: SaleData }) {
  return (
    <div
      className="print-area bg-white text-black font-mono text-xs p-4 shadow-[var(--shadow-elevated)] rounded"
      style={{ width: "302px" }}
    >
      <div className="text-center">
        <div className="font-bold text-base">MauzoChap</div>
        <div className="text-[10px]">Tanzania</div>
        <div className="text-[10px] mt-1">--------------------------------</div>
      </div>
      <div className="my-2 text-[11px]">
        <div>Receipt: {sale.receipt_number}</div>
        <div>{formatDate(sale.created_at)}</div>
        <div>Payment: {sale.payment_method}</div>
      </div>
      <div className="text-[10px]">--------------------------------</div>
      {sale.items.map((i) => (
        <div key={i.id} className="flex justify-between text-[11px] my-0.5">
          <div className="flex-1 truncate">
            {i.name}
            <div className="text-[10px] text-gray-600">  {i.qty} x {formatTZS(i.price)}</div>
          </div>
          <div className="font-semibold">{formatTZS(i.qty * i.price)}</div>
        </div>
      ))}
      <div className="text-[10px]">--------------------------------</div>
      <div className="flex justify-between"><span>Subtotal</span><span>{formatTZS(sale.subtotal)}</span></div>
      <div className="flex justify-between"><span>Discount</span><span>-{formatTZS(sale.discount)}</span></div>
      <div className="flex justify-between font-bold text-sm mt-1"><span>TOTAL</span><span>{formatTZS(sale.total)}</span></div>
      <div className="flex justify-between"><span>Paid</span><span>{formatTZS(sale.amount_paid)}</span></div>
      <div className="text-center mt-3 text-[10px]">
        Thank you! Asante!
        <br />Powered by MauzoChap
      </div>
    </div>
  );
}

function A4Receipt({ sale }: { sale: SaleData }) {
  return (
    <div className="print-area bg-white text-black p-12 shadow-[var(--shadow-elevated)] rounded" style={{ width: "210mm", minHeight: "297mm" }}>
      <div className="flex justify-between items-start border-b-2 border-black pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">MauzoChap</h2>
          <p className="text-sm text-gray-600 mt-1">Business Receipt · Tanzania</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 uppercase tracking-widest">Invoice</div>
          <div className="text-2xl font-bold">{sale.receipt_number}</div>
          <div className="text-sm text-gray-600 mt-1">{formatDate(sale.created_at)}</div>
        </div>
      </div>

      <table className="w-full mt-8 text-sm">
        <thead>
          <tr className="border-b border-gray-300 text-left">
            <th className="py-2">Item</th>
            <th className="py-2 text-right">Qty</th>
            <th className="py-2 text-right">Price</th>
            <th className="py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {sale.items.map((i) => (
            <tr key={i.id} className="border-b border-gray-100">
              <td className="py-3">{i.name}</td>
              <td className="py-3 text-right">{i.qty}</td>
              <td className="py-3 text-right">{formatTZS(i.price)}</td>
              <td className="py-3 text-right font-medium">{formatTZS(i.qty * i.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-8 ml-auto w-72 text-sm space-y-2">
        <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatTZS(sale.subtotal)}</span></div>
        <div className="flex justify-between"><span className="text-gray-600">Discount</span><span>-{formatTZS(sale.discount)}</span></div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-black"><span>Total</span><span>{formatTZS(sale.total)}</span></div>
        <div className="flex justify-between text-gray-600"><span>Paid via {sale.payment_method}</span><span>{formatTZS(sale.amount_paid)}</span></div>
      </div>

      <div className="mt-16 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
        Thank you for your business · Asante kwa ununuzi wako
      </div>
    </div>
  );
}
