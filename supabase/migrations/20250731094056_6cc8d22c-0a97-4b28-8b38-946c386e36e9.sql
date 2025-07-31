-- Fix function search path security issue
-- Drop and recreate the function with proper security settings

DROP FUNCTION IF EXISTS public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public, pg_temp'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;