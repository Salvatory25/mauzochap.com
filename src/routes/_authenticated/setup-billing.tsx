import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CreditCard, CheckCircle2, Package, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/setup-billing")({
  component: SetupBilling,
});

const PACKAGES = [
  { 
    id: "kilimanjaro", 
    name: "Kilimanjaro", 
    price: 250000, 
    duration: "1 Year",
    features: ["1 Location", "2 Users", "200 Products", "Basic Reports", "Receipt Printing"]
  },
  { 
    id: "serengeti", 
    name: "Serengeti", 
    price: 450000, 
    duration: "1 Year",
    features: ["1 Location", "5 Users", "500 Products", "Credit Sales", "Advanced Reports"]
  },
  { 
    id: "zanzibar", 
    name: "Zanzibar", 
    price: 750000, 
    duration: "1 Year",
    features: ["3 Locations", "10 Users", "2,000 Products", "Multi-Branch", "Profit Reports"]
  },
  { 
    id: "uhuru", 
    name: "Uhuru", 
    price: 1000000, 
    duration: "1 Year",
    features: ["Unlimited Locations", "Unlimited Users", "Unlimited Products", "Accounting", "Priority Support"]
  },
];

function SetupBilling() {
  const { business } = useAuth();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<string>("kilimanjaro");
  const [paymentRef, setPaymentRef] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!business) {
    return <div className="p-8 text-center text-muted-foreground">Loading business info...</div>;
  }

  // If already approved and not expired, redirect to dashboard
  if (business.account_status === "approved" && (!business.expiry_date || new Date(business.expiry_date) > new Date())) {
    navigate({ to: "/dashboard", replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentRef.trim()) return toast.error("Payment reference is required");
    
    setSubmitting(true);
    try {
      const selectedInfo = PACKAGES.find(p => p.id === selectedPackage);
      if (!selectedInfo) throw new Error("Invalid package");

      // 1. Update business package selection
      const { error: bErr } = await supabase
        .from("businesses")
        .update({ package: selectedPackage as any })
        .eq("id", business.id);
      
      if (bErr) throw bErr;

      // 2. Submit payment record
      const { error: pErr } = await supabase
        .from("payments")
        .insert({
          business_id: business.id,
          amount: selectedInfo.price,
          payment_reference: paymentRef,
          verification_status: "waiting_verification"
        });
        
      if (pErr) throw pErr;

      toast.success("Payment submitted successfully! Awaiting admin verification.");
      // We don't automatically redirect because they are still pending verification,
      // but we can clear the form and show a success state.
      setPaymentRef("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">Select a Subscription Package</h1>
        <p className="text-muted-foreground mt-2">
          Choose the right plan to activate your business account for <strong>{business.business_name}</strong>.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PACKAGES.map((pkg) => (
          <div 
            key={pkg.id}
            onClick={() => setSelectedPackage(pkg.id)}
            className={`cursor-pointer rounded-2xl border p-6 transition-all flex flex-col ${
              selectedPackage === pkg.id 
                ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary scale-[1.02]" 
                : "border-border bg-card hover:border-primary/50 hover:shadow-md"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2.5 rounded-xl ${selectedPackage === pkg.id ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground"}`}>
                <Package className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg tracking-tight uppercase">{pkg.name}</h3>
            </div>
            
            <div className="text-3xl font-extrabold mb-1 tracking-tight">
              {pkg.price.toLocaleString()} <span className="text-base font-medium text-muted-foreground">TZS</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-6 bg-muted/50 w-fit px-2 py-0.5 rounded-full">
              Billed Annually
            </p>
            
            <ul className="space-y-3 mb-8 flex-1">
              {pkg.features.map((feature, i) => (
                <li key={i} className="flex items-start text-sm">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground leading-tight">{feature}</span>
                </li>
              ))}
            </ul>

            <div className={`w-full py-2.5 rounded-lg text-center font-semibold text-sm transition-colors ${
              selectedPackage === pkg.id ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground"
            }`}>
              {selectedPackage === pkg.id ? "Selected Plan" : "Choose Plan"}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/30">
          <h2 className="text-lg font-semibold flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Payment Details
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Please transfer the amount to our business number and enter the transaction reference below.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-primary/10 text-primary p-4 rounded-lg text-sm mb-6">
            <strong>Payment Instructions:</strong> Send exactly <strong>{PACKAGES.find(p => p.id === selectedPackage)?.price.toLocaleString()} TZS</strong> to Lipa Namba <strong>123456 (MauzoChap)</strong>.
          </div>
          
          <div className="space-y-3">
            <Label>Mobile Money Reference Number</Label>
            <Input 
              placeholder="e.g. 5K92J1LX" 
              value={paymentRef}
              onChange={(e) => setPaymentRef(e.target.value)}
              className="max-w-md uppercase"
            />
            <p className="text-xs text-muted-foreground">
              Enter the exact transaction ID you received from M-Pesa / Tigo Pesa / Airtel Money.
            </p>
          </div>

          <Button type="submit" size="lg" disabled={submitting || !paymentRef.trim()}>
            {submitting ? "Submitting..." : "Submit Payment for Verification"}
            {!submitting && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
