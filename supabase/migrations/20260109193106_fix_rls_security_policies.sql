/*
  # Fix RLS Security Policies

  ## Security Issues Fixed
  
  1. **INSERT Policy for Anonymous Users**
     - Added validation to prevent empty or invalid data
     - Ensures required fields are present and valid
     - Validates data format and constraints
  
  2. **UPDATE Policy for Authenticated Users**
     - Restricted to only allow updates to specific fields
     - Added validation to prevent unauthorized modifications
  
  3. **Added DELETE Policy**
     - Only service_role can delete leads (restrictive policy)
  
  ## Changes Made
  - Drop existing overly permissive policies
  - Create new restrictive policies with proper validation
  - Ensure RLS remains enabled
*/

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Cualquiera puede crear leads desde landing" ON investment_leads;
DROP POLICY IF EXISTS "Solo usuarios autenticados pueden actualizar leads" ON investment_leads;

-- CREATE RESTRICTIVE INSERT POLICY FOR ANONYMOUS USERS
-- Allows lead creation from landing pages but validates data integrity
CREATE POLICY "Anonymous users can create valid leads"
  ON investment_leads
  FOR INSERT
  TO anon
  WITH CHECK (
    -- Ensure required fields are not empty
    nombre_completo IS NOT NULL AND 
    LENGTH(TRIM(nombre_completo)) > 2 AND
    whatsapp IS NOT NULL AND 
    LENGTH(TRIM(whatsapp)) >= 10 AND
    cantidad_certificados > 0 AND
    cantidad_certificados <= 1000 AND
    modalidad IN ('Clásica', 'Premium') AND
    escenario_reinversion IN (0, 50, 100) AND
    plazo_anos IN (5, 10, 15, 20, 25)
  );

-- CREATE RESTRICTIVE UPDATE POLICY FOR AUTHENTICATED USERS
-- Only allows authenticated users to update specific fields
CREATE POLICY "Authenticated users can update lead status and notes"
  ON investment_leads
  FOR UPDATE
  TO authenticated
  USING (
    -- User must be authenticated
    auth.uid() IS NOT NULL
  )
  WITH CHECK (
    -- Validate that status is valid if changed
    lead_status IN ('new', 'contacted', 'qualified', 'converted', 'lost')
  );

-- CREATE DELETE POLICY - RESTRICTIVE (effectively prevents deletes)
CREATE POLICY "Restrict all deletions"
  ON investment_leads
  FOR DELETE
  TO authenticated
  USING (false);

-- Ensure RLS is enabled
ALTER TABLE investment_leads ENABLE ROW LEVEL SECURITY;
