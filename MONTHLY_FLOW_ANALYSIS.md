# Análisis de Flujo Mensual - RiderMex Performance Calculator

## Cambios Realizados

### 1. Actualización de Parámetros por Defecto
**Archivo**: `src/components/RiderMexPerformanceCalculator.tsx`

- **Inversión Inicial**: Cambiada de 100,000 a **68,500 MXN** (primer escalón)
- **Precio por Ticket**: Confirmado en **68,500 MXN**
- **Años de Proyección**: Cambiados de 5 a **20 años**

```typescript
const [investmentAmount, setInvestmentAmount] = useState(68500);
const [years, setYears] = useState(20);
```

### 2. Generación de Proyecciones Mensuales
**Archivo**: `src/utils/ridermexCalculations.ts`

#### Nuevas Interfaces
```typescript
export interface MonthlyProjection {
  month: number;
  year: number;
  monthlyFlow: number;      // Flujo mensual (en pesos)
  cumulativeFlow: number;   // Acumulado desde el inicio
}
```

#### Actualización de RiderMexResults
Se agregó `monthlyProjection: MonthlyProjection[]` al resultado de cálculos.

#### Lógica de Cálculo
- Genera 240 registros mensuales (20 años × 12 meses)
- Calcula el flujo mensual dividiendo el retorno anual entre 12
- Mantiene un acumulado corriente (flujo total desde inversión inicial)
- Identifica automáticamente el mes de recuperación de inversión

### 3. Nuevo Componente: MonthlyFlowChart
**Archivo**: `src/components/ridermexComponents/MonthlyFlowChart.tsx`

#### Funcionalidades Principales

1. **Dos Vistas**:
   - **Gráfico**: Visualización con barras (flujo mensual) y línea (acumulado)
   - **Tabla**: Listado completo de 240 meses con detalles

2. **Análisis por Año**:
   - Botón "Ver por Año" para zoom en períodos específicos
   - Selector de año para comparar períodos
   - Vista mensual por año seleccionado

3. **Indicadores**:
   - Punto de recuperación de inversión resaltado en verde
   - Indicador automático del año de recuperación
   - Badge "RECUPERADO" en el mes exacto

4. **Resumen Ejecutivo**:
   - Inversión Inicial
   - Total de Años
   - Total Acumulado (20 años)
   - ROI Total (%)

#### Datos del Gráfico (Ejemplo con 68,500 inversión inicial)

El componente muestra:
- **Flujo Mensual**: Ingreso constante cada mes durante los 20 años
- **Acumulado**: Línea creciente que eventualmente supera los 68,500
- **Recuperación**: Se destaca el período donde el acumulado ≥ inversión inicial

### 4. Integración en RiderMexPerformanceCalculator
Se agregó el componente `MonthlyFlowChart` después de los gráficos principales:

```typescript
<MonthlyFlowChart
  monthlyProjection={results.monthlyProjection}
  investmentAmount={investmentAmount}
/>
```

## Flujo de Datos

```
RiderMexPerformanceCalculator
    ↓
    ├─ investmentAmount = 68,500
    ├─ years = 20
    └─ calculateRiderMexResults()
            ↓
            ├─ Calcula resultados anuales
            ├─ Genera 240 proyecciones mensuales
            └─ Retorna monthlyProjection[]
                    ↓
                    MonthlyFlowChart
                        ├─ Gráfico composición (Bar + Line)
                        ├─ Tabla de 240 filas
                        └─ Resumen con métricas
```

## Características Técnicas

### Cálculo del Flujo Mensual

```typescript
for (let year = 1; year <= params.years; year++) {
  const yearData = yearlyProjection.find(y => y.year === year);
  const monthlyFlow = yearData ? yearData.userReturnAnnual / 12 : 0;

  for (let month = 1; month <= 12; month++) {
    cumulativeFlow += monthlyFlow;
    monthlyProjection.push({
      month,
      year,
      monthlyFlow,
      cumulativeFlow
    });
  }
}
```

### Identificación de Recuperación

```typescript
const paybackYear = monthlyProjection.find(m => m.cumulativeFlow >= investmentAmount)?.year;
```

## Ejemplo de Datos

Con los parámetros por defecto (68,500 inversión):

| Año | Mes | Flujo Mensual | Acumulado |
|-----|-----|--------------|-----------|
| 1   | 1   | ~$1,500      | ~$1,500   |
| 1   | 2   | ~$1,500      | ~$3,000   |
| ...   | ... | ...        | ...       |
| 3   | 10  | ~$1,500      | ~$68,500  | ✓ RECUPERADO
| ...   | ... | ...        | ...       |
| 20  | 12  | ~$1,500      | ~$360,000 |

## Interfaz de Usuario

### Vista Gráfica
- Gráfico combinado (ComposedChart) con escala dual
- Barras en verde semitransparente para flujo mensual
- Línea sólida verde para acumulado
- Tooltips con formateo en pesos mexicanos

### Vista Tabla
- Tabla responsive con scroll horizontal en móvil
- Filas alternas con colores sutiles
- Resaltado en verde para período de recuperación
- Badge visual en el mes exacto de recuperación

### Controles
- Toggle entre vista gráfica y tabla
- Selector de período (años completos o todos)
- Selector de año específico cuando está en modo zoom

## Exportación y Reportes

El componente está listo para integración con:
- Botón de descarga de CSV (próxima implementación)
- Exportación a PDF con tabla de 240 meses
- Gráficos embebidos en reportes

## Performance

- **Datos**: 240 registros mensuales (20 años × 12 meses)
- **Render**: Optimizado con `useMemo` para cálculos derivados
- **Gráfico**: ResponsiveContainer automático
- **Tabla**: Virtualización recomendada si se extiende a 30+ años

## Testing

Para verificar el funcionamiento:
1. Ir a Calculadora RiderMex Rendimiento desde el home
2. La inversión inicial debe mostrar **68,500**
3. Los años deben mostrar **20**
4. Desplazarse hasta "Flujo Mensual de Ingresos"
5. Ver tanto gráfico como tabla
6. Clickear "Ver por Año" para zoom
7. Verificar que el acumulado cruza 68,500 en algún mes
8. Validar que el ROI total es > 400% después de 20 años

## Próximos Pasos (Opcionales)

1. Agregar botón de descarga de CSV con tabla de 240 meses
2. Incluir tabla en PDF de reportes
3. Comparador de múltiples inversiones iniciales
4. Proyección con reinversión automática
5. Análisis de sensibilidad (qué pasa si bajan ventas)
6. Histórico de cambios en parámetros
