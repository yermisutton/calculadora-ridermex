/*
  # Tabla de Leads de Inversión CosechaCAPITAL

  1. Nueva Tabla
    - `investment_leads`
      - `id` (uuid, primary key) - Identificador único del lead
      - `created_at` (timestamptz) - Fecha de creación del lead
      - `nombre_completo` (text) - Nombre completo del prospecto
      - `whatsapp` (text) - Número de WhatsApp (obligatorio)
      - `correo` (text, nullable) - Correo electrónico (opcional)
      - `cantidad_certificados` (integer) - Cantidad de certificados de interés
      - `modalidad` (text) - Modalidad elegida (Clásica / Premium)
      - `escenario_reinversion` (integer) - Porcentaje de reinversión (0, 50, 100)
      - `plazo_anos` (integer) - Plazo de inversión en años
      - `requiere_financiamiento` (boolean) - Si requiere opciones de financiamiento
      - `campaign_source` (text) - Origen de la campaña
      - `lead_status` (text) - Estado del lead (new, contacted, qualified, converted)
      - `notas` (text, nullable) - Notas adicionales del lead
      - `updated_at` (timestamptz) - Última actualización

  2. Seguridad
    - Enable RLS en la tabla
    - Política para permitir inserción pública (leads desde landing)
    - Política para lectura solo autenticada (admin/equipo ventas)
*/

CREATE TABLE IF NOT EXISTS investment_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  nombre_completo text NOT NULL,
  whatsapp text NOT NULL,
  correo text,
  cantidad_certificados integer NOT NULL,
  modalidad text NOT NULL,
  escenario_reinversion integer NOT NULL CHECK (escenario_reinversion IN (0, 50, 100)),
  plazo_anos integer NOT NULL CHECK (plazo_anos IN (5, 10, 15, 20, 25)),
  requiere_financiamiento boolean DEFAULT false,
  campaign_source text DEFAULT 'segubeca-2025',
  lead_status text DEFAULT 'new' CHECK (lead_status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  notas text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE investment_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cualquiera puede crear leads desde landing"
  ON investment_leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Solo usuarios autenticados pueden leer leads"
  ON investment_leads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Solo usuarios autenticados pueden actualizar leads"
  ON investment_leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_investment_leads_created ON investment_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_investment_leads_status ON investment_leads(lead_status);
CREATE INDEX IF NOT EXISTS idx_investment_leads_campaign ON investment_leads(campaign_source);
CREATE INDEX IF NOT EXISTS idx_investment_leads_whatsapp ON investment_leads(whatsapp);

CREATE OR REPLACE FUNCTION update_investment_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_investment_leads_updated_at'
  ) THEN
    CREATE TRIGGER update_investment_leads_updated_at
      BEFORE UPDATE ON investment_leads
      FOR EACH ROW
      EXECUTE FUNCTION update_investment_leads_updated_at();
  END IF;
END $$;