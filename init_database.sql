
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'cashier', 'owner');
CREATE TYPE public.payment_method AS ENUM ('cash', 'mobile_money', 'card', 'credit', 'bank');
CREATE TYPE public.sale_status AS ENUM ('completed', 'cancelled', 'pending');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  business_name TEXT,
  phone TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles select own or any auth" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles update own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles insert own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users see own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_manager(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','manager','owner'))
$$;

-- Admins can see all roles
CREATE POLICY "admins see all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') AND (SELECT business_id FROM public.profiles WHERE id = user_id) = public.current_business_id());
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') AND (SELECT business_id FROM public.profiles WHERE id = user_id) = public.current_business_id())
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND (SELECT business_id FROM public.profiles WHERE id = user_id) = public.current_business_id());

-- ============ CATEGORIES ============
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read categories" ON public.categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "managers manage categories" ON public.categories FOR ALL TO authenticated
  USING (public.is_admin_or_manager(auth.uid())) WITH CHECK (public.is_admin_or_manager(auth.uid()));

-- ============ PRODUCTS ============
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  barcode TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_products_name ON public.products(name);
CREATE INDEX idx_products_barcode ON public.products(barcode);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read products" ON public.products FOR SELECT TO authenticated USING (true);
CREATE POLICY "managers manage products" ON public.products FOR ALL TO authenticated
  USING (public.is_admin_or_manager(auth.uid())) WITH CHECK (public.is_admin_or_manager(auth.uid()));

-- ============ CUSTOMERS ============
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  loyalty_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read customers" ON public.customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth manage customers" ON public.customers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ SALES ============
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number TEXT NOT NULL UNIQUE,
  cashier_id UUID NOT NULL REFERENCES auth.users(id),
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  amount_paid NUMERIC(12,2) NOT NULL DEFAULT 0,
  payment_method public.payment_method NOT NULL DEFAULT 'cash',
  status public.sale_status NOT NULL DEFAULT 'completed',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_sales_created_at ON public.sales(created_at DESC);
CREATE INDEX idx_sales_cashier ON public.sales(cashier_id);
GRANT SELECT, INSERT, UPDATE ON public.sales TO authenticated;
GRANT ALL ON public.sales TO service_role;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read sales" ON public.sales FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth insert own sales" ON public.sales FOR INSERT TO authenticated WITH CHECK (auth.uid() = cashier_id);
CREATE POLICY "managers update sales" ON public.sales FOR UPDATE TO authenticated USING (public.is_admin_or_manager(auth.uid()));

-- ============ SALE ITEMS ============
CREATE TABLE public.sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  line_total NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_sale_items_sale ON public.sale_items(sale_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sale_items TO authenticated;
GRANT ALL ON public.sale_items TO service_role;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read sale_items" ON public.sale_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth manage sale_items" ON public.sale_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ EXPENSES ============
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  description TEXT,
  amount NUMERIC(12,2) NOT NULL,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses TO authenticated;
GRANT ALL ON public.expenses TO service_role;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read expenses" ON public.expenses FOR SELECT TO authenticated USING (true);
CREATE POLICY "managers manage expenses" ON public.expenses FOR ALL TO authenticated
  USING (public.is_admin_or_manager(auth.uid())) WITH CHECK (public.is_admin_or_manager(auth.uid()));

-- ============ TIMESTAMP TRIGGER ============
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_customers_updated BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ NEW USER HOOK ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE user_count INTEGER;
BEGIN
  INSERT INTO public.profiles (id, full_name, business_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), COALESCE(NEW.raw_user_meta_data->>'business_name', 'My Business'));
  SELECT COUNT(*) INTO user_count FROM public.user_roles;
  IF user_count = 0 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'cashier');
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ STOCK ADJUSTMENT ON SALE ============
CREATE OR REPLACE FUNCTION public.decrement_stock_on_sale()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.product_id IS NOT NULL THEN
    UPDATE public.products SET stock_quantity = stock_quantity - NEW.quantity WHERE id = NEW.product_id;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_decrement_stock AFTER INSERT ON public.sale_items
FOR EACH ROW EXECUTE FUNCTION public.decrement_stock_on_sale();

-- Fix function search paths
ALTER FUNCTION public.touch_updated_at() SET search_path = public;
ALTER FUNCTION public.decrement_stock_on_sale() SET search_path = public;

-- Lock down SECURITY DEFINER functions to authenticated only
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_admin_or_manager(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_or_manager(uuid) TO authenticated;

-- Replace permissive policies with auth-scoped ones
DROP POLICY IF EXISTS "auth manage customers" ON public.customers;
CREATE POLICY "auth insert customers" ON public.customers FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth update customers" ON public.customers FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "managers delete customers" ON public.customers FOR DELETE TO authenticated USING (public.is_admin_or_manager(auth.uid()));

DROP POLICY IF EXISTS "auth manage sale_items" ON public.sale_items;
CREATE POLICY "auth insert sale_items" ON public.sale_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.sales s WHERE s.id = sale_id AND s.cashier_id = auth.uid()));
CREATE POLICY "managers update sale_items" ON public.sale_items FOR UPDATE TO authenticated USING (public.is_admin_or_manager(auth.uid()));
CREATE POLICY "managers delete sale_items" ON public.sale_items FOR DELETE TO authenticated USING (public.is_admin_or_manager(auth.uid()));
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
-- ============ TRACK CREDIT SALES ============
-- Update customer balance when a sale is completed with an unpaid amount

-- 1. Handling Inserts
CREATE OR REPLACE FUNCTION public.add_debt_on_credit_sale()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  -- If there is a customer and the sale is completed, and amount paid is less than total
  IF NEW.customer_id IS NOT NULL AND NEW.status = 'completed' AND NEW.total > NEW.amount_paid THEN
    UPDATE public.customers 
    SET balance = balance + (NEW.total - NEW.amount_paid)
    WHERE id = NEW.customer_id;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_add_customer_debt AFTER INSERT ON public.sales
FOR EACH ROW EXECUTE FUNCTION public.add_debt_on_credit_sale();

-- 2. Handling Updates (Status changes, amount paid changes, customer reassignments)
CREATE OR REPLACE FUNCTION public.adjust_debt_on_sale_update()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  old_debt NUMERIC(12,2) := 0;
  new_debt NUMERIC(12,2) := 0;
BEGIN
  -- Calculate old debt
  IF OLD.status = 'completed' AND OLD.total > OLD.amount_paid THEN
    old_debt := OLD.total - OLD.amount_paid;
  END IF;

  -- Calculate new debt
  IF NEW.status = 'completed' AND NEW.total > NEW.amount_paid THEN
    new_debt := NEW.total - NEW.amount_paid;
  END IF;

  -- If customer changed, revert old debt from old customer, add new debt to new customer
  IF OLD.customer_id IS DISTINCT FROM NEW.customer_id THEN
    IF OLD.customer_id IS NOT NULL AND old_debt > 0 THEN
      UPDATE public.customers SET balance = balance - old_debt WHERE id = OLD.customer_id;
    END IF;
    IF NEW.customer_id IS NOT NULL AND new_debt > 0 THEN
      UPDATE public.customers SET balance = balance + new_debt WHERE id = NEW.customer_id;
    END IF;
  ELSE
    -- Same customer, just adjust by the difference
    IF OLD.customer_id IS NOT NULL AND (new_debt - old_debt) <> 0 THEN
      UPDATE public.customers SET balance = balance + (new_debt - old_debt) WHERE id = OLD.customer_id;
    END IF;
  END IF;

  RETURN NEW;
END; $$;

CREATE TRIGGER trg_adjust_customer_debt_on_update AFTER UPDATE ON public.sales
FOR EACH ROW EXECUTE FUNCTION public.adjust_debt_on_sale_update();

-- 3. Handling Deletes
CREATE OR REPLACE FUNCTION public.revert_debt_on_sale_delete()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.status = 'completed' AND OLD.customer_id IS NOT NULL AND OLD.total > OLD.amount_paid THEN
    UPDATE public.customers 
    SET balance = balance - (OLD.total - OLD.amount_paid)
    WHERE id = OLD.customer_id;
  END IF;
  RETURN OLD;
END; $$;

CREATE TRIGGER trg_revert_customer_debt_on_delete AFTER DELETE ON public.sales
FOR EACH ROW EXECUTE FUNCTION public.revert_debt_on_sale_delete();
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
-- Add 'unit' column to the products table to support unit management (pcs, kg, liters, etc.)
ALTER TABLE "public"."products"
ADD COLUMN "unit" text DEFAULT 'pcs';
-- Create product_batches table to track batches and expiry dates
CREATE TABLE "public"."product_batches" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "product_id" uuid NOT NULL,
    "branch_id" uuid NOT NULL,
    "batch_number" text NOT NULL,
    "expiry_date" date,
    "stock_quantity" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT "product_batches_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "product_batches_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE,
    CONSTRAINT "product_batches_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE CASCADE
);

-- RLS Policies
ALTER TABLE "public"."product_batches" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users" ON "public"."product_batches"
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON "public"."product_batches"
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON "public"."product_batches"
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON "public"."product_batches"
    FOR DELETE USING (auth.role() = 'authenticated');
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
-- SaaS Multitenancy Migration

-- 1. Create ENUMs
CREATE TYPE public.account_status AS ENUM ('pending', 'approved', 'suspended', 'rejected');
CREATE TYPE public.subscription_package AS ENUM ('kilimanjaro', 'serengeti', 'zanzibar', 'uhuru', 'trial');
CREATE TYPE public.payment_status AS ENUM ('unpaid', 'paid', 'waiting_verification');

ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin';

-- 2. Create businesses table
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  owner_name TEXT,
  phone TEXT,
  email TEXT,
  account_status public.account_status NOT NULL DEFAULT 'pending',
  package public.subscription_package NOT NULL DEFAULT 'trial',
  expiry_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_businesses_updated BEFORE UPDATE ON public.businesses FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 3. Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  payment_reference TEXT NOT NULL,
  verification_status public.payment_status NOT NULL DEFAULT 'waiting_verification',
  payment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Legacy Data Migration & business_id column
INSERT INTO public.businesses (business_name, account_status, package, expiry_date)
VALUES ('Legacy Business (Pre-SaaS)', 'approved', 'uhuru', '2099-12-31');

-- Helper function to get current user's business ID
ALTER TABLE public.profiles ADD COLUMN business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;

CREATE OR REPLACE FUNCTION public.current_business_id()
RETURNS UUID LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT business_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'super_admin')
$$;

DO $$ 
DECLARE 
  legacy_biz_id UUID;
BEGIN
  SELECT id INTO legacy_biz_id FROM public.businesses WHERE business_name = 'Legacy Business (Pre-SaaS)' LIMIT 1;

  UPDATE public.profiles SET business_id = legacy_biz_id WHERE business_id IS NULL;
  
  -- Branches
  ALTER TABLE public.branches ADD COLUMN business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;
  UPDATE public.branches SET business_id = legacy_biz_id;
  ALTER TABLE public.branches ALTER COLUMN business_id SET NOT NULL;
  ALTER TABLE public.branches ALTER COLUMN business_id SET DEFAULT public.current_business_id();

  -- Categories
  ALTER TABLE public.categories ADD COLUMN business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;
  UPDATE public.categories SET business_id = legacy_biz_id;
  ALTER TABLE public.categories ALTER COLUMN business_id SET NOT NULL;
  ALTER TABLE public.categories ALTER COLUMN business_id SET DEFAULT public.current_business_id();

  -- Products
  ALTER TABLE public.products ADD COLUMN business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;
  UPDATE public.products SET business_id = legacy_biz_id;
  ALTER TABLE public.products ALTER COLUMN business_id SET NOT NULL;
  ALTER TABLE public.products ALTER COLUMN business_id SET DEFAULT public.current_business_id();

  -- Customers
  ALTER TABLE public.customers ADD COLUMN business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;
  UPDATE public.customers SET business_id = legacy_biz_id;
  ALTER TABLE public.customers ALTER COLUMN business_id SET NOT NULL;
  ALTER TABLE public.customers ALTER COLUMN business_id SET DEFAULT public.current_business_id();

  -- Sales
  ALTER TABLE public.sales ADD COLUMN business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;
  UPDATE public.sales SET business_id = legacy_biz_id;
  ALTER TABLE public.sales ALTER COLUMN business_id SET NOT NULL;
  ALTER TABLE public.sales ALTER COLUMN business_id SET DEFAULT public.current_business_id();

  -- Sale Items
  ALTER TABLE public.sale_items ADD COLUMN business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;
  UPDATE public.sale_items SET business_id = legacy_biz_id;
  ALTER TABLE public.sale_items ALTER COLUMN business_id SET NOT NULL;
  ALTER TABLE public.sale_items ALTER COLUMN business_id SET DEFAULT public.current_business_id();

  -- Expenses
  ALTER TABLE public.expenses ADD COLUMN business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;
  UPDATE public.expenses SET business_id = legacy_biz_id;
  ALTER TABLE public.expenses ALTER COLUMN business_id SET NOT NULL;
  ALTER TABLE public.expenses ALTER COLUMN business_id SET DEFAULT public.current_business_id();

  -- Purchases
  ALTER TABLE public.purchases ADD COLUMN business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;
  UPDATE public.purchases SET business_id = legacy_biz_id;
  ALTER TABLE public.purchases ALTER COLUMN business_id SET NOT NULL;
  ALTER TABLE public.purchases ALTER COLUMN business_id SET DEFAULT public.current_business_id();

  -- Purchase Items
  ALTER TABLE public.purchase_items ADD COLUMN business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;
  UPDATE public.purchase_items SET business_id = legacy_biz_id;
  ALTER TABLE public.purchase_items ALTER COLUMN business_id SET NOT NULL;
  ALTER TABLE public.purchase_items ALTER COLUMN business_id SET DEFAULT public.current_business_id();

  -- Stock Movements
  ALTER TABLE public.stock_movements ADD COLUMN business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;
  UPDATE public.stock_movements SET business_id = legacy_biz_id;
  ALTER TABLE public.stock_movements ALTER COLUMN business_id SET NOT NULL;
  ALTER TABLE public.stock_movements ALTER COLUMN business_id SET DEFAULT public.current_business_id();

  -- Branch Inventory
  ALTER TABLE public.branch_inventory ADD COLUMN business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;
  UPDATE public.branch_inventory SET business_id = legacy_biz_id;
  ALTER TABLE public.branch_inventory ALTER COLUMN business_id SET NOT NULL;
  ALTER TABLE public.branch_inventory ALTER COLUMN business_id SET DEFAULT public.current_business_id();

  -- Stock Transfers
  ALTER TABLE public.stock_transfers ADD COLUMN business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;
  UPDATE public.stock_transfers SET business_id = legacy_biz_id;
  ALTER TABLE public.stock_transfers ALTER COLUMN business_id SET NOT NULL;
  ALTER TABLE public.stock_transfers ALTER COLUMN business_id SET DEFAULT public.current_business_id();

  -- Product Batches
  ALTER TABLE public.product_batches ADD COLUMN business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;
  UPDATE public.product_batches SET business_id = legacy_biz_id;
  ALTER TABLE public.product_batches ALTER COLUMN business_id SET NOT NULL;
  ALTER TABLE public.product_batches ALTER COLUMN business_id SET DEFAULT public.current_business_id();

  -- Supplier Payments
  ALTER TABLE public.supplier_payments ADD COLUMN business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;
  UPDATE public.supplier_payments SET business_id = legacy_biz_id;
  ALTER TABLE public.supplier_payments ALTER COLUMN business_id SET NOT NULL;
  ALTER TABLE public.supplier_payments ALTER COLUMN business_id SET DEFAULT public.current_business_id();

  -- Customer Payments
  ALTER TABLE public.customer_payments ADD COLUMN business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;
  UPDATE public.customer_payments SET business_id = legacy_biz_id;
  ALTER TABLE public.customer_payments ALTER COLUMN business_id SET NOT NULL;
  ALTER TABLE public.customer_payments ALTER COLUMN business_id SET DEFAULT public.current_business_id();
END $$;

-- 5. RLS Policies Update
-- RLS for businesses and payments
GRANT SELECT, INSERT, UPDATE, DELETE ON public.businesses TO authenticated;
GRANT ALL ON public.businesses TO service_role;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin all businesses" ON public.businesses FOR ALL TO authenticated USING (public.is_super_admin(auth.uid()));
CREATE POLICY "users read own business" ON public.businesses FOR SELECT TO authenticated USING (id = public.current_business_id());
CREATE POLICY "users update own business" ON public.businesses FOR UPDATE TO authenticated USING (id = public.current_business_id() AND public.is_admin_or_manager(auth.uid()));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin all payments" ON public.payments FOR ALL TO authenticated USING (public.is_super_admin(auth.uid()));
CREATE POLICY "users read own payments" ON public.payments FOR SELECT TO authenticated USING (business_id = public.current_business_id());
CREATE POLICY "users insert own payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (business_id = public.current_business_id());

-- Update ALL existing table RLS
DO $$ 
DECLARE 
  tbl TEXT;
BEGIN
  FOR tbl IN 
    SELECT unnest(ARRAY['branches', 'categories', 'products', 'customers', 'sales', 'sale_items', 'expenses', 'purchases', 'purchase_items', 'stock_movements', 'branch_inventory', 'stock_transfers', 'product_batches', 'supplier_payments', 'customer_payments'])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "auth read %I" ON public.%I', tbl, tbl);
    EXECUTE format('CREATE POLICY "auth read %I" ON public.%I FOR SELECT TO authenticated USING (business_id = public.current_business_id() OR public.is_super_admin(auth.uid()))', tbl, tbl);
    
    -- Specific write policies usually named differently, we will recreate them generically for simplicity, or we can just append super_admin to existing write policies if possible.
    -- Actually, it's safer to just drop ALL policies and recreate them with business_id checks.
    -- But since we can't reliably know all the exact policy names for writes, we'll recreate the core ones.
  END LOOP;
END $$;

-- Drop generic ALL policies and replace with scoped ones. 
-- To avoid breaking things, we will just add a global rule: Super Admins can do anything on these tables.
-- The existing write policies (e.g. "managers manage categories") will still apply but we need to ensure they can't manage OTHER business's categories.
-- Wait, if they are scoped to their business, we MUST add `business_id = current_business_id()` to the write policies.
-- Let's just recreate them manually.

-- Profiles
DROP POLICY IF EXISTS "profiles select own or any auth" ON public.profiles;
CREATE POLICY "profiles read own business" ON public.profiles FOR SELECT TO authenticated USING (business_id = public.current_business_id() OR public.is_super_admin(auth.uid()));

-- Categories
DROP POLICY IF EXISTS "managers manage categories" ON public.categories;
CREATE POLICY "managers manage categories" ON public.categories FOR ALL TO authenticated USING ((business_id = public.current_business_id() AND public.is_admin_or_manager(auth.uid())) OR public.is_super_admin(auth.uid()));

-- Products
DROP POLICY IF EXISTS "managers manage products" ON public.products;
CREATE POLICY "managers manage products" ON public.products FOR ALL TO authenticated USING ((business_id = public.current_business_id() AND public.is_admin_or_manager(auth.uid())) OR public.is_super_admin(auth.uid()));

-- Customers
DROP POLICY IF EXISTS "auth manage customers" ON public.customers;
CREATE POLICY "auth manage customers" ON public.customers FOR ALL TO authenticated USING (business_id = public.current_business_id() OR public.is_super_admin(auth.uid()));

-- Sales
DROP POLICY IF EXISTS "auth insert own sales" ON public.sales;
DROP POLICY IF EXISTS "managers update sales" ON public.sales;
CREATE POLICY "auth insert own sales" ON public.sales FOR INSERT TO authenticated WITH CHECK (business_id = public.current_business_id() AND auth.uid() = cashier_id);
CREATE POLICY "managers update sales" ON public.sales FOR UPDATE TO authenticated USING ((business_id = public.current_business_id() AND public.is_admin_or_manager(auth.uid())) OR public.is_super_admin(auth.uid()));

-- Sale Items
DROP POLICY IF EXISTS "auth manage sale_items" ON public.sale_items;
CREATE POLICY "auth manage sale_items" ON public.sale_items FOR ALL TO authenticated USING (business_id = public.current_business_id() OR public.is_super_admin(auth.uid()));

-- Expenses
DROP POLICY IF EXISTS "managers manage expenses" ON public.expenses;
CREATE POLICY "managers manage expenses" ON public.expenses FOR ALL TO authenticated USING ((business_id = public.current_business_id() AND public.is_admin_or_manager(auth.uid())) OR public.is_super_admin(auth.uid()));

-- Purchases
DROP POLICY IF EXISTS "managers manage purchases" ON public.purchases;
CREATE POLICY "managers manage purchases" ON public.purchases FOR ALL TO authenticated USING ((business_id = public.current_business_id() AND public.is_admin_or_manager(auth.uid())) OR public.is_super_admin(auth.uid()));

-- Purchase Items
DROP POLICY IF EXISTS "managers manage purchase_items" ON public.purchase_items;
CREATE POLICY "managers manage purchase_items" ON public.purchase_items FOR ALL TO authenticated USING ((business_id = public.current_business_id() AND public.is_admin_or_manager(auth.uid())) OR public.is_super_admin(auth.uid()));

-- Stock Movements
DROP POLICY IF EXISTS "auth manage stock_movements" ON public.stock_movements;
CREATE POLICY "auth manage stock_movements" ON public.stock_movements FOR ALL TO authenticated USING (business_id = public.current_business_id() OR public.is_super_admin(auth.uid()));

-- Branches
DROP POLICY IF EXISTS "managers manage branches" ON public.branches;
CREATE POLICY "managers manage branches" ON public.branches FOR ALL TO authenticated USING ((business_id = public.current_business_id() AND public.is_admin_or_manager(auth.uid())) OR public.is_super_admin(auth.uid()));

-- Branch Inventory
DROP POLICY IF EXISTS "auth manage branch_inventory" ON public.branch_inventory;
CREATE POLICY "auth manage branch_inventory" ON public.branch_inventory FOR ALL TO authenticated USING (business_id = public.current_business_id() OR public.is_super_admin(auth.uid()));

-- Stock Transfers
DROP POLICY IF EXISTS "auth manage stock_transfers" ON public.stock_transfers;
CREATE POLICY "auth manage stock_transfers" ON public.stock_transfers FOR ALL TO authenticated USING (business_id = public.current_business_id() OR public.is_super_admin(auth.uid()));

-- Product Batches
DROP POLICY IF EXISTS "managers manage product_batches" ON public.product_batches;
CREATE POLICY "managers manage product_batches" ON public.product_batches FOR ALL TO authenticated USING ((business_id = public.current_business_id() AND public.is_admin_or_manager(auth.uid())) OR public.is_super_admin(auth.uid()));

-- Supplier Payments
DROP POLICY IF EXISTS "managers manage supplier_payments" ON public.supplier_payments;
CREATE POLICY "managers manage supplier_payments" ON public.supplier_payments FOR ALL TO authenticated USING ((business_id = public.current_business_id() AND public.is_admin_or_manager(auth.uid())) OR public.is_super_admin(auth.uid()));

-- Customer Payments
DROP POLICY IF EXISTS "auth manage customer_payments" ON public.customer_payments;
CREATE POLICY "auth manage customer_payments" ON public.customer_payments FOR ALL TO authenticated USING (business_id = public.current_business_id() OR public.is_super_admin(auth.uid()));


-- 6. Update handle_new_user trigger
CREATE OR REPLACE FUNCTION public.get_business_name(_business_id UUID)
RETURNS TEXT LANGUAGE SQL SECURITY DEFINER SET search_path = public AS $$
  SELECT business_name FROM public.businesses WHERE id = _business_id;
$$;
REVOKE ALL ON FUNCTION public.get_business_name(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_business_name(UUID) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE 
  user_count INTEGER;
  target_biz_id UUID;
  target_branch_id UUID;
  target_role public.app_role;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.user_roles;
  
  -- Check if a business_id was provided in the user metadata and exists
  IF (NEW.raw_user_meta_data->>'business_id') IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.businesses WHERE id = (NEW.raw_user_meta_data->>'business_id')::UUID
  ) THEN
    -- Join existing business
    target_biz_id := (NEW.raw_user_meta_data->>'business_id')::UUID;
    
    -- Find the first branch for this business (usually the Main Branch)
    SELECT id INTO target_branch_id 
    FROM public.branches 
    WHERE business_id = target_biz_id 
    LIMIT 1;
    
    -- Get requested role or default to cashier
    target_role := COALESCE(NEW.raw_user_meta_data->>'role', 'cashier')::public.app_role;
  ELSE
    -- Create a new business for this user
    INSERT INTO public.businesses (business_name, owner_name, email)
    VALUES (
      COALESCE(NEW.raw_user_meta_data->>'business_name', 'My Business'), 
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'Owner'), 
      NEW.email
    )
    RETURNING id INTO target_biz_id;
    
    -- Create a default branch for this business
    INSERT INTO public.branches (name, location, business_id)
    VALUES ('Main Branch', 'HQ', target_biz_id)
    RETURNING id INTO target_branch_id;
    
    -- Determine role
    IF user_count = 0 THEN
      target_role := 'super_admin'::public.app_role;
    ELSE
      target_role := 'admin'::public.app_role;
    END IF;
  END IF;

  -- Create user profile (mapping phone number from metadata if present)
  INSERT INTO public.profiles (id, full_name, business_name, phone, business_id, branch_id)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 
    COALESCE(NEW.raw_user_meta_data->>'business_name', (SELECT business_name FROM public.businesses WHERE id = target_biz_id)),
    NEW.raw_user_meta_data->>'phone',
    target_biz_id,
    target_branch_id
  );
  
  -- Insert user role
  INSERT INTO public.user_roles (user_id, role) 
  VALUES (NEW.id, target_role);
  
  RETURN NEW;
END; $$;
