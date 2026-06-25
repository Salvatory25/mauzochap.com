-- Update the sale item insert trigger to respect sale_status
CREATE OR REPLACE FUNCTION public.decrement_stock_on_sale()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE 
  v_branch_id UUID;
  v_status public.sale_status;
BEGIN
  -- get branch_id and status of the sale
  SELECT branch_id, status INTO v_branch_id, v_status FROM public.sales WHERE id = NEW.sale_id;

  -- Only decrement stock if the sale is completed. Pending (Proforma) sales do not decrement stock.
  IF NEW.product_id IS NOT NULL AND v_branch_id IS NOT NULL AND v_status = 'completed' THEN
    -- Update branch_inventory
    UPDATE public.branch_inventory 
    SET stock_quantity = stock_quantity - NEW.quantity 
    WHERE branch_id = v_branch_id AND product_id = NEW.product_id;
    
    INSERT INTO public.stock_movements (product_id, branch_id, movement_type, quantity_change, reference_id)
    VALUES (NEW.product_id, v_branch_id, 'sale', -NEW.quantity, NEW.sale_id);
  END IF;
  RETURN NEW;
END; $$;

-- Create a trigger function for when a sale's status changes from pending to completed
CREATE OR REPLACE FUNCTION public.process_completed_sale_stock()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  item RECORD;
BEGIN
  -- If sale is marked as completed and it was previously pending
  IF NEW.status = 'completed' AND OLD.status = 'pending' THEN
    FOR item IN SELECT * FROM public.sale_items WHERE sale_id = NEW.id
    LOOP
      IF item.product_id IS NOT NULL AND NEW.branch_id IS NOT NULL THEN
        UPDATE public.branch_inventory 
        SET stock_quantity = stock_quantity - item.quantity 
        WHERE branch_id = NEW.branch_id AND product_id = item.product_id;
        
        INSERT INTO public.stock_movements (product_id, branch_id, movement_type, quantity_change, reference_id)
        VALUES (item.product_id, NEW.branch_id, 'sale', -item.quantity, NEW.id);
      END IF;
    END LOOP;
  END IF;
  
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_completed_sale_stock
AFTER UPDATE OF status ON public.sales
FOR EACH ROW EXECUTE FUNCTION public.process_completed_sale_stock();
