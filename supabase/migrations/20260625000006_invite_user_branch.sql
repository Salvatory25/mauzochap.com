-- Update handle_new_user function to support joining an existing business WITH a specific branch_id
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
    
    -- Check if branch_id was provided
    IF (NEW.raw_user_meta_data->>'branch_id') IS NOT NULL THEN
      target_branch_id := (NEW.raw_user_meta_data->>'branch_id')::UUID;
    ELSE
      -- Find the first branch for this business (usually the Main Branch)
      SELECT id INTO target_branch_id 
      FROM public.branches 
      WHERE business_id = target_biz_id 
      LIMIT 1;
    END IF;
    
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
