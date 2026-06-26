# Supabase Security Configuration

## Issues Fixed

### 1. RLS Policies (FIXED via Migration)

Las políticas de Row Level Security han sido actualizadas con las siguientes mejoras:

#### INSERT Policy para Usuarios Anónimos
- **Antes:** `WITH CHECK (true)` - Permitía cualquier inserción
- **Después:** Validación estricta de datos:
  - Nombre completo debe tener al menos 3 caracteres
  - WhatsApp debe tener al menos 10 caracteres
  - Cantidad de certificados entre 1 y 1000
  - Modalidad solo permite 'Clásica' o 'Premium'
  - Escenario de reinversión solo 0, 50, o 100
  - Plazo solo 5, 10, 15, 20, o 25 años

#### UPDATE Policy para Usuarios Autenticados
- **Antes:** `USING (true)` y `WITH CHECK (true)` - Permitía cualquier actualización
- **Después:**
  - Solo usuarios autenticados pueden actualizar
  - Solo se permite actualizar lead_status y notas
  - El lead_status debe ser uno de los valores válidos

#### DELETE Policy
- **Nueva:** Solo permite eliminaciones con permisos de service_role (efectivamente bloqueando eliminaciones de usuarios regulares)

### 2. Auth DB Connection Strategy (REQUIERE CONFIGURACIÓN MANUAL)

Este ajuste debe hacerse en el Dashboard de Supabase:

#### Pasos para Configurar:

1. Ve al Dashboard de Supabase: https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a **Project Settings** (Configuración del Proyecto)
4. Selecciona **Database** en el menú lateral
5. Busca la sección **Connection Pooling** o **Auth Configuration**
6. Cambia la estrategia de conexión de Auth de:
   - **De:** Número fijo (10 conexiones)
   - **A:** Porcentaje basado en el tamaño de la instancia

#### Por qué es importante:
- Con un número fijo de conexiones, aumentar el tamaño de la instancia no mejorará el rendimiento del servidor de Auth
- Una estrategia basada en porcentaje permite que Auth escale automáticamente con tu base de datos

#### Valores Recomendados:
- **Desarrollo/Staging:** 5-10% del pool de conexiones
- **Producción:** 10-15% del pool de conexiones (ajustar según carga)

## Verificación de Seguridad

Para verificar que las políticas RLS están funcionando correctamente:

```sql
-- Verificar que RLS está habilitado
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'investment_leads';

-- Ver todas las políticas actuales
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'investment_leads';
```

## Notas Adicionales

- Las políticas RLS ahora previenen la inserción de datos maliciosos o vacíos
- Los usuarios autenticados solo pueden modificar el estado y notas de los leads
- Los datos originales del lead (nombre, contacto, inversión) son inmutables después de la creación
- Las eliminaciones están efectivamente bloqueadas para usuarios regulares
