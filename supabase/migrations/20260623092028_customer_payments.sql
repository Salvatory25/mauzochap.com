-- ============ CUSTOMER PAYMENTS ============
CREATE TABLE public.customer_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  payment_method public.payment_method NOT NULL DEFAULT 'cash',
  notes TEXT,
  received_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_customer_payments_customer ON public.customer_payments(customer_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_payments TO authenticated;
GRANT ALL ON public.customer_payments TO service_role;

ALTER TABLE public.customer_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth read customer_payments" ON public.customer_payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth manage customer_payments" ON public.customer_payments FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Update customer balance when payment is received
CREATE OR REPLACE FUNCTION public.deduct_balance_on_payment()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.customers 
  SET balance = balance - NEW.amount 
  WHERE id = NEW.customer_id;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_deduct_customer_balance AFTER INSERT ON public.customer_payments
FOR EACH ROW EXECUTE FUNCTION public.deduct_balance_on_payment();
