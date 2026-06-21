
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
