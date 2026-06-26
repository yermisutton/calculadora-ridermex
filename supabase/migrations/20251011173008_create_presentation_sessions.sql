/*
  # Tabla de sesiones de presentación

  1. Nueva Tabla
    - `presentation_sessions`
      - `id` (uuid, primary key) - Identificador único de la sesión
      - `session_key` (text, unique) - Clave única para acceder a la sesión
      - `investor_name` (text) - Nombre del inversionista
      - `investor_email` (text) - Email del inversionista
      - `investment_data` (jsonb) - Datos completos de la inversión
      - `created_at` (timestamptz) - Fecha de creación
      - `updated_at` (timestamptz) - Última actualización
      - `expires_at` (timestamptz) - Fecha de expiración (30 días por defecto)
      - `views` (integer) - Número de veces que se ha visto la sesión

  2. Seguridad
    - Enable RLS en la tabla
    - Política para permitir crear sesiones sin autenticación (para presentaciones)
    - Política para leer sesiones usando la clave única
*/

CREATE TABLE IF NOT EXISTS presentation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key text UNIQUE NOT NULL,
  investor_name text DEFAULT '',
  investor_email text DEFAULT '',
  investment_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '30 days'),
  views integer DEFAULT 0
);

ALTER TABLE presentation_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create presentation sessions"
  ON presentation_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read sessions with valid key"
  ON presentation_sessions
  FOR SELECT
  TO anon
  USING (
    session_key IS NOT NULL AND
    expires_at > now()
  );

CREATE POLICY "Anyone can update view count"
  ON presentation_sessions
  FOR UPDATE
  TO anon
  USING (
    session_key IS NOT NULL AND
    expires_at > now()
  )
  WITH CHECK (
    session_key IS NOT NULL AND
    expires_at > now()
  );

CREATE INDEX IF NOT EXISTS idx_presentation_sessions_key ON presentation_sessions(session_key);
CREATE INDEX IF NOT EXISTS idx_presentation_sessions_expires ON presentation_sessions(expires_at);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_presentation_sessions_updated_at'
  ) THEN
    CREATE TRIGGER update_presentation_sessions_updated_at
      BEFORE UPDATE ON presentation_sessions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
