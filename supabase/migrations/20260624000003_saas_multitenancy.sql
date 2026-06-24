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
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE 
  user_count INTEGER;
  new_biz_id UUID;
  new_branch_id UUID;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.user_roles;
  
  -- Create a new business for this user
  INSERT INTO public.businesses (business_name, owner_name, email)
  VALUES (COALESCE(NEW.raw_user_meta_data->>'business_name', 'My Business'), COALESCE(NEW.raw_user_meta_data->>'full_name', 'Owner'), NEW.email)
  RETURNING id INTO new_biz_id;
  
  -- Create a default branch for this business
  INSERT INTO public.branches (name, location, business_id)
  VALUES ('Main Branch', 'HQ', new_biz_id)
  RETURNING id INTO new_branch_id;

  INSERT INTO public.profiles (id, full_name, business_name, business_id, branch_id)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 
    COALESCE(NEW.raw_user_meta_data->>'business_name', 'My Business'),
    new_biz_id,
    new_branch_id
  );
  
  IF user_count = 0 THEN
    -- Make the very first user in the whole system super_admin
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'super_admin');
  ELSE
    -- For now, every new signup creates a new business, so they are the owner/admin of that business
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  
  RETURN NEW;
END; $$;
