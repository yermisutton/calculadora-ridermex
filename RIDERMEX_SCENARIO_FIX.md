# Correcciones Realizadas: Escenarios RiderMex y Notas Importantes

## Problema 1: Escenarios de RiderMex No Afectaban los Tickets Finales

### Causa Raíz
Cuando seleccionabas diferentes escenarios (Conservador, Moderado, Optimista) en la calculadora RiderMex, el número de tickets finales NO cambiaba. Esto ocurría porque:

1. Los componentes actualizaban los valores de producción (`averageProductionPerHectare`, `averageSalePricePerKg`)
2. PERO no actualizaban la propiedad crítica `ridermexScenario` en el objeto `investment`
3. El código de cálculo siempre usaba el valor por defecto 'moderate':

```typescript
const scenario = investment.ridermexScenario || 'moderate'; // Siempre usaba 'moderate'
```

### Solución: Actualizar ridermexScenario

#### 1. ReinvestmentInvestorGoals.tsx (Paso 3)

```typescript
const handleSaveScenario = (scenario: string) => {
  // ... otros valores ...

  const scenarioMap = {
    'conservador': 'conservative',
    'moderado': 'moderate',
    'optimista': 'optimistic'
  };

  updateInvestment({
    // ... otros campos ...
    ridermexScenario: scenarioMap[scenario] || 'moderate' // ✅ AGREGADO
  });
};
```

#### 2. InteractiveDashboard.tsx (Dashboard Presentación)

```typescript
const handleScenarioPreset = (motos_mes: number, utilidad: number) => {
  let scenario: 'conservative' | 'moderate' | 'optimistic' = 'moderate';
  if (motos_mes <= 50) scenario = 'conservative';
  else if (motos_mes <= 60) scenario = 'moderate';
  else scenario = 'optimistic';

  updateInvestment({
    ridermexMotosMonth: motos_mes,
    ridermexUtilityPerMoto: utilidad,
    ridermexScenario: scenario // ✅ AGREGADO
  });
};
```

---

## Problema 2: Notas Importantes Mostraban Información Incorrecta

### Causa Raíz
Las notas mostradas en reportes y tablas de RiderMex mostraban información de **Cosecha/Citrus** (certificados de limón), no de RiderMex. Esto ocurría porque:

1. Los reportes generaban las notas directamente en HTML sin verificar el tipo de producto
2. Siempre mostraban: "5 años de maduración", "12% apreciación", "24,500 kg/ha × $30/kg"
3. Estas notas son correctas para Cosecha, INCORRECTAS para RiderMex

### Solución: Notas Dinámicas por Tipo de Producto

#### 1. ExcelTableV5.tsx (Tabla de Evolución)

Ahora verifica `investment.ridermex` y muestra notas correspondientes:

**RiderMex:**
- Los primeros 18 meses corresponden al período de maduración
- A partir del mes 19 se comienzan a generar utilidades (pagos trimestrales)
- $3,500 MXN trimestrales por ticket
- 50% apreciación primer año, luego 5% anual compuesto
- 2% descuento anual para tickets posteriores al año 1
- 5% crecimiento anual para tickets en producción

**Cosecha/Citrus:**
- Los primeros 5 años período de maduración
- A partir del año 5 se generan utilidades
- 12% apreciación anual primeros 5 años
- 5% incremento anual en precio del limón a partir del año 6
- Utilidad: 24,500 kg/ha × $30/kg × 0.1 × 0.65

#### 2. existingCompleteReport.ts (Reporte Completo)

Agregada lógica condicional:
```typescript
${investment.ridermex ? `
  // Notas RiderMex
` : `
  // Notas Cosecha/Citrus
`}
```

#### 3. certificateEvolutionReport.ts (Reporte Evolución)

Misma lógica condicional aplicada.

---

## Impacto

### Antes
- Cambiar de escenario → sin efecto en tickets finales
- Reportes RiderMex → notas de Cosecha (incorrectas)
- Confusión del usuario sobre rentabilidad real

### Después
- Cambiar de escenario → actualiza tickets finales correctamente
- Reportes RiderMex → notas específicas de RiderMex (correctas)
- Reportes Cosecha → notas específicas de Cosecha (correctas)
- Mayor rendimiento → más tickets finales (efecto multiplicador)

---

## Archivos Modificados

✅ `src/components/ExcelTableV5.tsx` (líneas 766-796)
- Notas dinámicas en tabla de evolución

✅ `src/utils/reports/existingCompleteReport.ts` (líneas 593-628)
- Notas dinámicas en reporte completo

✅ `src/utils/reports/certificateEvolutionReport.ts` (líneas 940-962)
- Notas dinámicas en reporte de evolución

✅ `src/components/reinvestmentCalculator/ReinvestmentInvestorGoals.tsx` (líneas 270-289)
- Actualiza `ridermexScenario` al guardar

✅ `src/components/presentation/InteractiveDashboard.tsx` (líneas 260-276)
- Actualiza `ridermexScenario` al cambiar escenario

✅ Build exitoso sin errores

---

## Cómo Verificar

### Test 1: Escenarios Afectan Tickets Finales
1. Abre calculadora RiderMex
2. Configura: 1 ticket, 20 años, reinversión 100%
3. Selecciona "Conservador" → anota tickets finales
4. Selecciona "Moderado" → verifica que aumentan (~20%)
5. Selecciona "Optimista" → verifica que aumentan (~40%)

### Test 2: Notas Correctas en Reportes
1. Genera PDF de un escenario RiderMex
2. Verifica sección "Notas Importantes" → debe mostrar info de RiderMex
3. Genera PDF de Cosecha
4. Verifica sección "Notas Importantes" → debe mostrar info de Cosecha

---

## Notas Técnicas

- Escenarios RiderMex: `src/data/ridermexConfig.ts` (líneas 14-30)
- Cálculo de certificados: `src/utils/calculations/certificateEvolution.ts` (líneas 255-280)
- Descuento 2% anual: líneas 265-268
- Crecimiento 5% anual: líneas 272-278
