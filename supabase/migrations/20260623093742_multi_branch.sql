-- Create branches table
CREATE TABLE public.branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert a default branch
INSERT INTO public.branches (name, location) VALUES ('Main Branch', 'HQ');

-- Add branch_id to profiles
ALTER TABLE public.profiles ADD COLUMN branch_id UUID REFERENCES public.branches(id);
UPDATE public.profiles SET branch_id = (SELECT id FROM public.branches LIMIT 1);

-- Add branch_id to sales
ALTER TABLE public.sales ADD COLUMN branch_id UUID REFERENCES public.branches(id);
UPDATE public.sales SET branch_id = (SELECT id FROM public.branches LIMIT 1);

-- Add branch_id to expenses
ALTER TABLE public.expenses ADD COLUMN branch_id UUID REFERENCES public.branches(id);
UPDATE public.expenses SET branch_id = (SELECT id FROM public.branches LIMIT 1);

-- Add branch_id to purchases
ALTER TABLE public.purchases ADD COLUMN branch_id UUID REFERENCES public.branches(id);
UPDATE public.purchases SET branch_id = (SELECT id FROM public.branches LIMIT 1);

-- Add branch_id to stock_movements
ALTER TABLE public.stock_movements ADD COLUMN branch_id UUID REFERENCES public.branches(id);
UPDATE public.stock_movements SET branch_id = (SELECT id FROM public.branches LIMIT 1);

-- Create branch_inventory table
CREATE TABLE public.branch_inventory (
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (branch_id, product_id)
);

-- Migrate existing stock to Main Branch
INSERT INTO public.branch_inventory (branch_id, product_id, stock_quantity)
SELECT (SELECT id FROM public.branches LIMIT 1), id, stock_quantity
FROM public.products;

-- Create stock_transfers table
CREATE TABLE public.stock_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_branch_id UUID REFERENCES public.branches(id),
  to_branch_id UUID REFERENCES public.branches(id),
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, cancelled
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS for branches
GRANT SELECT, INSERT, UPDATE, DELETE ON public.branches TO authenticated;
GRANT ALL ON public.branches TO service_role;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read branches" ON public.branches FOR SELECT TO authenticated USING (true);
CREATE POLICY "managers manage branches" ON public.branches FOR ALL TO authenticated USING (public.is_admin_or_manager(auth.uid()));

-- RLS for branch_inventory
GRANT SELECT, INSERT, UPDATE, DELETE ON public.branch_inventory TO authenticated;
GRANT ALL ON public.branch_inventory TO service_role;
ALTER TABLE public.branch_inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read branch_inventory" ON public.branch_inventory FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth manage branch_inventory" ON public.branch_inventory FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RLS for stock_transfers
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stock_transfers TO authenticated;
GRANT ALL ON public.stock_transfers TO service_role;
ALTER TABLE public.stock_transfers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read stock_transfers" ON public.stock_transfers FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth manage stock_transfers" ON public.stock_transfers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Update triggers to use branch_inventory instead of products for stock

-- 1. Sales decrement stock
CREATE OR REPLACE FUNCTION public.decrement_stock_on_sale()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE v_branch_id UUID;
BEGIN
  -- get branch_id of the sale
  SELECT branch_id INTO v_branch_id FROM public.sales WHERE id = NEW.sale_id;

  IF NEW.product_id IS NOT NULL AND v_branch_id IS NOT NULL THEN
    -- Update branch_inventory
    UPDATE public.branch_inventory 
    SET stock_quantity = stock_quantity - NEW.quantity 
    WHERE branch_id = v_branch_id AND product_id = NEW.product_id;
    
    INSERT INTO public.stock_movements (product_id, branch_id, movement_type, quantity_change, reference_id)
    VALUES (NEW.product_id, v_branch_id, 'sale', -NEW.quantity, NEW.sale_id);
  END IF;
  RETURN NEW;
END; $$;

-- 2. Purchases increment stock
CREATE OR REPLACE FUNCTION public.process_purchase_item()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE v_branch_id UUID;
BEGIN
  -- get branch_id of the purchase
  SELECT branch_id INTO v_branch_id FROM public.purchases WHERE id = NEW.purchase_id;

  IF NEW.product_id IS NOT NULL AND v_branch_id IS NOT NULL THEN
    -- Update products cost
    UPDATE public.products SET cost = NEW.unit_cost WHERE id = NEW.product_id;
    
    -- Insert or update branch_inventory
    INSERT INTO public.branch_inventory (branch_id, product_id, stock_quantity)
    VALUES (v_branch_id, NEW.product_id, NEW.quantity)
    ON CONFLICT (branch_id, product_id) 
    DO UPDATE SET stock_quantity = public.branch_inventory.stock_quantity + EXCLUDED.stock_quantity;
    
    -- Record movement
    INSERT INTO public.stock_movements (product_id, branch_id, movement_type, quantity_change, reference_id)
    VALUES (NEW.product_id, v_branch_id, 'purchase', NEW.quantity, NEW.purchase_id);
  END IF;
  RETURN NEW;
END; $$;

-- 3. Stock Transfers Execution
CREATE OR REPLACE FUNCTION public.execute_stock_transfer()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Deduct from source branch
    UPDATE public.branch_inventory 
    SET stock_quantity = stock_quantity - NEW.quantity 
    WHERE branch_id = NEW.from_branch_id AND product_id = NEW.product_id;
    
    -- Add to destination branch
    INSERT INTO public.branch_inventory (branch_id, product_id, stock_quantity)
    VALUES (NEW.to_branch_id, NEW.product_id, NEW.quantity)
    ON CONFLICT (branch_id, product_id) 
    DO UPDATE SET stock_quantity = public.branch_inventory.stock_quantity + EXCLUDED.stock_quantity;
    
    -- Record movements
    INSERT INTO public.stock_movements (product_id, branch_id, movement_type, quantity_change, reference_id)
    VALUES (NEW.product_id, NEW.from_branch_id, 'adjustment', -NEW.quantity, NEW.id);
    
    INSERT INTO public.stock_movements (product_id, branch_id, movement_type, quantity_change, reference_id)
    VALUES (NEW.product_id, NEW.to_branch_id, 'adjustment', NEW.quantity, NEW.id);
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_execute_stock_transfer AFTER UPDATE ON public.stock_transfers
FOR EACH ROW EXECUTE FUNCTION public.execute_stock_transfer();
