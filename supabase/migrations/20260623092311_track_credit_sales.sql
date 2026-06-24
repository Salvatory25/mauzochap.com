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
