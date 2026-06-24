-- Create supplier_payments table to track payments to suppliers
CREATE TABLE "public"."supplier_payments" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "supplier_id" uuid NOT NULL,
    "amount" numeric NOT NULL,
    "payment_method" text NOT NULL,
    "notes" text,
    "paid_by" uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT "supplier_payments_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "supplier_payments_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE CASCADE
);

-- RLS Policies
ALTER TABLE "public"."supplier_payments" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users" ON "public"."supplier_payments"
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON "public"."supplier_payments"
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON "public"."supplier_payments"
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON "public"."supplier_payments"
    FOR DELETE USING (auth.role() = 'authenticated');

-- Trigger to update supplier balance
CREATE OR REPLACE FUNCTION update_supplier_balance_on_payment()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.suppliers
    SET balance = balance - NEW.amount
    WHERE id = NEW.supplier_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_supplier_balance_after_payment
AFTER INSERT ON public.supplier_payments
FOR EACH ROW
EXECUTE FUNCTION update_supplier_balance_on_payment();
