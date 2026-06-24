-- ============ SUPPLIERS ============
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.suppliers TO authenticated;
GRANT ALL ON public.suppliers TO service_role;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read suppliers" ON public.suppliers FOR SELECT TO authenticated USING (true);
CREATE POLICY "managers manage suppliers" ON public.suppliers FOR ALL TO authenticated
  USING (public.is_admin_or_manager(auth.uid())) WITH CHECK (public.is_admin_or_manager(auth.uid()));

CREATE TRIGGER trg_suppliers_updated BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ PURCHASES ============
CREATE TABLE public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  invoice_number TEXT,
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  amount_paid NUMERIC(12,2) NOT NULL DEFAULT 0,
  payment_method public.payment_method NOT NULL DEFAULT 'cash',
  status TEXT NOT NULL DEFAULT 'completed',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.purchases TO authenticated;
GRANT ALL ON public.purchases TO service_role;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read purchases" ON public.purchases FOR SELECT TO authenticated USING (true);
CREATE POLICY "managers manage purchases" ON public.purchases FOR ALL TO authenticated
  USING (public.is_admin_or_manager(auth.uid())) WITH CHECK (public.is_admin_or_manager(auth.uid()));

-- ============ PURCHASE ITEMS ============
CREATE TABLE public.purchase_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID NOT NULL REFERENCES public.purchases(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  unit_cost NUMERIC(12,2) NOT NULL,
  line_total NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.purchase_items TO authenticated;
GRANT ALL ON public.purchase_items TO service_role;
ALTER TABLE public.purchase_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read purchase_items" ON public.purchase_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "managers manage purchase_items" ON public.purchase_items FOR ALL TO authenticated
  USING (public.is_admin_or_manager(auth.uid())) WITH CHECK (public.is_admin_or_manager(auth.uid()));

-- ============ STOCK MOVEMENTS ============
CREATE TYPE public.stock_movement_type AS ENUM ('sale', 'purchase', 'adjustment', 'return');

CREATE TABLE public.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  movement_type public.stock_movement_type NOT NULL,
  quantity_change INTEGER NOT NULL,
  reference_id UUID, -- Can be sale_id, purchase_id, etc.
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.stock_movements TO authenticated;
GRANT ALL ON public.stock_movements TO service_role;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read stock_movements" ON public.stock_movements FOR SELECT TO authenticated USING (true);
CREATE POLICY "managers manage stock_movements" ON public.stock_movements FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_or_manager(auth.uid()));

-- ============ TRIGGERS FOR PURCHASES AND SUPPLIERS ============
-- Update supplier balance
CREATE OR REPLACE FUNCTION public.update_supplier_balance_on_purchase()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.supplier_id IS NOT NULL AND NEW.total_amount > NEW.amount_paid THEN
    UPDATE public.suppliers 
    SET balance = balance + (NEW.total_amount - NEW.amount_paid)
    WHERE id = NEW.supplier_id;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_update_supplier_debt AFTER INSERT ON public.purchases
FOR EACH ROW EXECUTE FUNCTION public.update_supplier_balance_on_purchase();

-- Increase stock and create movement on purchase
CREATE OR REPLACE FUNCTION public.process_purchase_item()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.product_id IS NOT NULL THEN
    -- Update stock and cost (moving average or last cost, we will just update cost to last unit_cost for MVP)
    UPDATE public.products 
    SET stock_quantity = stock_quantity + NEW.quantity, cost = NEW.unit_cost 
    WHERE id = NEW.product_id;
    
    -- Record movement
    INSERT INTO public.stock_movements (product_id, movement_type, quantity_change, reference_id)
    VALUES (NEW.product_id, 'purchase', NEW.quantity, NEW.purchase_id);
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_process_purchase_item AFTER INSERT ON public.purchase_items
FOR EACH ROW EXECUTE FUNCTION public.process_purchase_item();

-- Record movement on sale (the actual stock reduction is already in trg_decrement_stock)
-- Let's replace the old decrement_stock_on_sale to also include stock_movements
CREATE OR REPLACE FUNCTION public.decrement_stock_on_sale()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.product_id IS NOT NULL THEN
    UPDATE public.products SET stock_quantity = stock_quantity - NEW.quantity WHERE id = NEW.product_id;
    
    INSERT INTO public.stock_movements (product_id, movement_type, quantity_change, reference_id)
    VALUES (NEW.product_id, 'sale', -NEW.quantity, NEW.sale_id);
  END IF;
  RETURN NEW;
END; $$;
