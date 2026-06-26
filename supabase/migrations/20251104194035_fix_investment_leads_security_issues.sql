/*
  # Fix Security Issues in Investment Leads Table

  ## Changes Made
  
  1. **Remove Unused Indexes**
     - Drop `idx_investment_leads_created` - not being used in queries
     - Drop `idx_investment_leads_status` - not being used in queries
     - Drop `idx_investment_leads_campaign` - not being used in queries
     - Drop `idx_investment_leads_whatsapp` - not being used in queries
     
  2. **Fix Function Search Path**
     - Update `update_investment_leads_updated_at` function with immutable search_path
     - Add `SET search_path = pg_catalog, public` to prevent search path mutable vulnerability
     
  ## Security Impact
  - Removes unused indexes that create unnecessary overhead
  - Prevents potential security vulnerability from mutable search_path in trigger function
*/

-- Drop unused indexes
DROP INDEX IF EXISTS idx_investment_leads_created;
DROP INDEX IF EXISTS idx_investment_leads_status;
DROP INDEX IF EXISTS idx_investment_leads_campaign;
DROP INDEX IF EXISTS idx_investment_leads_whatsapp;

-- Recreate the trigger function with secure search_path
CREATE OR REPLACE FUNCTION update_investment_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = pg_catalog, public;
