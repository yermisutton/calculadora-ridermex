# Calculadora de Rendimiento RiderMex

## Descripción General

La **Calculadora de Rendimiento RiderMex** es una aplicación web financiera premium diseñada para que los inversionistas puedan simular y analizar el rendimiento de inversión en el modelo operativo de RiderMex.

## URL de Acceso

```
/calculadora/ridermex-rendimiento
```

## Características Principales

### 1. Motor de Cálculo Financiero
- **Ubicación**: `src/utils/ridermexCalculations.ts`
- **Funcionalidades**:
  - Cálculo de metrics por agencia (fee base y bonos)
  - Proyección anual con ajuste de inflación
  - Distribución automática de ingresos entre tickets del fondo
  - Cálculo de ROI, payback period y utilidad anual

### 2. Interfaz Principal
- **Ubicación**: `src/components/RiderMexPerformanceCalculator.tsx`
- **Características**:
  - Selección de escenarios (Conservador, Base, Agresivo, Manual)
  - Inputs editables para todos los parámetros
  - Botón de reseteo a valores por defecto
  - Secciones colapsables para mejor UX

### 3. Dashboard de Resultados (KPIs)
- **Ubicación**: `src/components/ridermexComponents/RiderMexKPIs.tsx`
- **Métricas mostradas**:
  - Inversión total
  - Tickets equivalentes
  - Porcentaje del fondo
  - Motos vendidas/mes
  - Rendimiento mensual
  - ROI anual
  - Utilidad anual
  - Payback en meses
  - Resumen de fee base + bonos

### 4. Tabla de Agencias
- **Ubicación**: `src/components/ridermexComponents/RiderMexAgencyTable.tsx`
- **Funcionalidades**:
  - Visualización de las 10 agencias del portafolio
  - Edición en tiempo real de ventas mensuales
  - Indicadores de estado con código de colores:
    - Rojo: No activa (bajo mínimo)
    - Amarillo: Fee base
    - Verde: Bono 1 (15%)
    - Azul: Bono 2 (25%)
    - Púrpura: Bono 3 (35%)

### 5. Gráficos Interactivos
- **Ubicación**: `src/components/ridermexComponents/RiderMexCharts.tsx`
- **Gráficos disponibles** (con navegación):
  1. Proyección de rendimiento anual (línea)
  2. Composición fee base vs bonos (pie)
  3. Ventas por modelo A/B/C (barras)

### 6. Explicación del Modelo
- **Ubicación**: `src/components/ridermexComponents/RiderMexExplanation.tsx`
- **Secciones**:
  - Fee base por motocicleta
  - Mínimos por modelo de agencia
  - Sistema de bonos
  - Portafolio de agencias
  - Ajuste anual del fee
  - Aclaración: Solo motos
  - Fórmulas de cálculo

## Parámetros de Entrada

| Parámetro | Valor Defecto | Descripción |
|-----------|---------------|-------------|
| Inversión (MXN) | 100,000 | Monto de inversión inicial |
| Precio/Ticket (MXN) | 68,500 | Valor de cada ticket del fondo |
| Total Tickets Fondo | 375 | Cantidad total de tickets disponibles |
| Fee Base/Moto (MXN) | 700 | Pago base por motocicleta vendida |
| Inflación Anual (%) | 3.5 | Tasa de inflación esperada |
| Spread Adicional (%) | 1.5 | Incremento adicional sobre inflación |
| Años Proyección | 5 | Período de proyección de resultados |

## Modelos de Agencia

### Modelo A
- **Renta**: Hasta 35,000 MXN
- **Mínimo de ventas**: 32 motos/mes

### Modelo B
- **Renta**: 35,001 a 60,000 MXN
- **Mínimo de ventas**: 40 motos/mes

### Modelo C
- **Renta**: 60,001 o más MXN
- **Mínimo de ventas**: 50 motos/mes

## Escenarios Preestablecidos

### Escenario Conservador
- Vendas bajas
- Algunas agencias no alcanzan mínimos
- Rendimiento moderado

### Escenario Base
- Vendas normales
- Todas las agencias activas
- Algunos bonos activados

### Escenario Agresivo
- Vendas altas
- Todos los bonos activados
- Máximo rendimiento

### Modo Manual
- Personalización completa de ventas por agencia

## Sistema de Bonos

Los bonos se aplican SOLO al diferencial de ventas por encima del mínimo:

| Bono | Threshold | Porcentaje |
|------|-----------|-----------|
| Bono 1 | +20% del mínimo | 15% adicional |
| Bono 2 | +35% del mínimo | 25% adicional |
| Bono 3 | +50% del mínimo | 35% adicional |

## Fórmulas Clave

### Rendimiento Mensual por Ticket
```
(Total Motos × Fee/Moto + Bonos) ÷ 375 Tickets
```

### Tu Rendimiento Mensual
```
(Rendimiento/Ticket) × Tus Tickets
```

### ROI Anual
```
(Rendimiento Anual ÷ Inversión Inicial) × 100
```

### Ajuste Anual del Fee
```
Fee Nuevo = Fee Actual × (1 + (Inflación + Spread) / 100)
```

## Portafolio de Agencias

El fondo invierte en **10 agencias**:
- **3 Modelo A** (A1, A2, A3)
- **4 Modelo B** (B1, B2, B3, B4)
- **3 Modelo C** (C1, C2, C3)

## Estructura de Archivos

```
src/
├── utils/
│   └── ridermexCalculations.ts      # Motor de cálculo
├── components/
│   ├── RiderMexPerformanceCalculator.tsx
│   └── ridermexComponents/
│       ├── RiderMexKPIs.tsx         # Dashboard KPIs
│       ├── RiderMexAgencyTable.tsx  # Tabla de agencias
│       ├── RiderMexCharts.tsx       # Gráficos interactivos
│       └── RiderMexExplanation.tsx  # Explicación del modelo
```

## Estilos y Tema

- **Paleta**: Rojo RiderMex (#dc2626), Negro profundo, Blanco limpio
- **Acentos**: Verdes para métricas positivas
- **Tipografía**: Montserrat (sistema)
- **Estética**: Fintech institucional premium, ciudad nocturna

## Validaciones

- Inversión mínima: 0 MXN
- Tickets máximos: 375
- Fee base mínimo: 50 MXN
- Inflación mínima: -10%
- Años máximos: 30

## Performance

- Cálculos optimizados con `useMemo`
- Renderizado suave de 10 agencias
- Gráficos con Recharts (optimizados)
- Build size: ~25KB gzipped

## Accesibilidad

- Colores de estado bien definidos
- Inputs con validación visual
- Navegación clara entre secciones
- Responsive design para mobile y desktop

## Notas Importantes

1. El modelo SOLO genera ingresos por motocicletas vendidas
2. No incluye accesorios, refacciones, créditos, intereses, seguros o comisiones
3. Base: volumen de motos vendidas por agencia
4. El fee se divide automáticamente entre los 375 tickets del fondo
5. Los bonos son acumulativos según el desempeño de cada agencia

## Próximas Mejoras Sugeridas

- Exportar resultados a PDF/Excel
- Comparador de múltiples escenarios
- Histórico de simulaciones guardadas
- Integración con API de datos reales
- Visualización 3D de portafolio
