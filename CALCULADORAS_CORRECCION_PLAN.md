# Plan de Corrección: Alineación de Calculadoras con Unit Economics

## RESUMEN EJECUTIVO

Después del análisis completo, se identificaron **6 calculadoras** que necesitan actualizaciones para alinearse con la lógica matemática de Unit Economics documentada en `UNIT_ECONOMICS_LOGICA_MATEMATICA.md`.

**Estado actual:**
- ✅ **3 calculadoras alineadas:** ReinvestmentCalculator, RidermexReinvestmentCalculator, SimplifiedCalculator
- ⚠️ **3 parcialmente alineadas:** ICMCalculator, VitaminadaCalculator, SegubecaCalculator
- ❌ **2 completamente desalineadas:** MotorcycleCalculator, ThreeScenarioComparator
- ✅ **1 correcta (retiro):** RetirementCalculator

---

## PRIORIDAD 1: CALCULADORAS CRÍTICAS

### 1. MotorcycleCalculator ❌ CRÍTICO

**Archivo:** `/src/components/MotorcycleCalculator.tsx`
**Función problemática:** `calculateMotorcycleCompoundGrowth()` en `/src/utils/calculations/compoundGrowth.ts`

#### Problemas Identificados:

1. **NO maneja financiamiento**
   - Actual: Asume pago de contado inmediato
   - Requerido: Opciones 0, 6, 12 meses con inicio diferido de rendimientos

2. **NO maneja escalones**
   - Actual: Precio fijo de ticket
   - Requerido: $1,000 adicional por cada 30 tickets

3. **NO maneja sistema de apartado**
   - Actual: Compra inmediata de tickets con utilidades
   - Requerido: Sistema de 5 tickets máximo en pago simultáneo

4. **NO maneja descuento por año de compra**
   - Actual: Todos los tickets tienen mismo rendimiento base
   - Requerido: 2% descuento por cada año desde compra inicial

5. **Plusvalía incorrecta**
   - Actual: `ticketPrice * Math.pow(1 + ticketAppreciation / 100, Math.min(year, 5))`
   - Requerido: 50% año 1, luego 5% anual compuesto

6. **NO calcula patrimonio neto**
   - Actual: `patrimony = totalInvestedInTickets`
   - Requerido: Valor apreciado - deuda pendiente

#### Solución Propuesta:

**Opción A (Recomendada): Usar certificateEvolution.ts**
```typescript
// En MotorcycleCalculator.tsx
import { useCalculator } from '../context/CalculatorContext';

const { results } = useCalculator();

// Usar results.yearlyData en lugar de calculateMotorcycleCompoundGrowth
```

**Opción B: Actualizar compoundGrowth.ts**
- Replicar TODA la lógica de certificateEvolution.ts
- Alto riesgo de inconsistencias futuras
- NO RECOMENDADO

#### Estimación de Trabajo:
- **Opción A:** 2-3 horas (refactorizar UI para usar context)
- **Opción B:** 8-10 horas (replicar lógica + testing)

---

### 2. ThreeScenarioComparator ❌ CRÍTICO

**Archivo:** `/src/components/ThreeScenarioComparator.tsx`

#### Problemas Identificados:

1. **"Multiplicador" demasiado simplificado**
   ```typescript
   // Actual (líneas 23-42)
   const multiplicador = capitalInicial *
     Math.pow(1 + tasaMultiplicador / 100, year) *
     Math.pow(1 + (activosMultiplicador - 1) * 0.05, year);
   ```
   - NO considera mecánica real de certificados
   - Factor `0.05` arbitrario por activo
   - NO hay sistema de apartado/pago

2. **NO hay financiamiento**

3. **NO hay escalones**

4. **Interés simple vs compuesto mal implementado**

#### Solución Propuesta:

**Opción A (Recomendada): Usar certificateEvolution.ts para "Multiplicador"**
```typescript
// Escenario 1: Interés Simple (mantener actual)
// Escenario 2: Interés Compuesto (mantener actual)
// Escenario 3: Multiplicador → usar certificateEvolution.ts
```

**Opción B: Agregar disclaimer educativo**
- Marcar como "modelo simplificado"
- Agregar nota: "Para cálculos precisos, usar calculadora RiderMex"

#### Estimación de Trabajo:
- **Opción A:** 3-4 horas
- **Opción B:** 30 minutos (solo disclaimer)

---

## PRIORIDAD 2: CALCULADORAS PARCIALMENTE ALINEADAS

### 3. ICMCalculator ⚠️ MEDIO

**Archivo:** `/src/components/ICMCalculator.tsx`

#### Estado Actual:
- ✅ Path RiderMex usa certificateEvolution.ts correctamente
- ❌ Path "Inversión Tradicional" usa lógica custom (líneas 245-253)

#### Problemas en Path Custom:

```typescript
// Líneas 245-253
const annualReturn = scenarioAccumulated * (selectedTraditional.rate / 100);
scenarioAccumulated += annualReturn + params.monthlyContribution * 12;
```

1. **NO considera inflación**
2. **NO considera impuestos**
3. **NO replica descuento por año de compra**
4. **Tasa fija, no crece con mercado**

#### Solución Propuesta:

**¿Necesita corrección?** DEPENDE
- Si el propósito es **comparar con inversiones tradicionales reales** → Correcto como está
- Si debe **simular RiderMex sin reinversión** → Usar certificateEvolution con reinvestment=false

#### Recomendación:
- Mantener actual PERO agregar disclaimers:
  - "Simulación simplificada de inversión tradicional"
  - "No considera todos los factores (impuestos, inflación, comisiones)"

#### Estimación de Trabajo:
- **Mantener + disclaimers:** 1 hora
- **Alinear completamente:** 4-5 horas

---

### 4. VitaminadaCalculator ⚠️ MEDIO

**Archivo:** `/src/components/VitaminadaCalculator.tsx`

#### Estado Actual:
- ✅ Path RiderMex usa certificateEvolution.ts (líneas 223-241)
- ❌ Path custom usa lógica simplificada (líneas 243-267)

#### Problemas en Path Custom:

```typescript
// Líneas 243-267
const yearlyReturn = currentPatrimony * (selectedProduct.rate / 100);
const reinvestedAmount = yearlyReturn * (reinvestmentPercentage / 100);
patrimony += reinvestedAmount;
```

1. **NO considera escalones** (precio +$1,000 cada 30 tickets)
2. **NO considera apartado** (máximo 5 simultáneos)
3. **NO considera financiamiento**
4. **Reinversión inmediata** (no hay período de pago)

#### Solución Propuesta:

**Opción A:** Usar certificateEvolution.ts también para comparativos
**Opción B:** Mantener custom pero agregar disclaimers claros

#### Estimación de Trabajo:
- **Opción A:** 3-4 horas
- **Opción B:** 1 hora (disclaimers)

---

### 5. SegubecaCalculator ⚠️ MEDIO

**Archivo:** `/src/components/SegubecaCalculator.tsx`

#### Estado Actual:
- ✅ Path RiderMex (isRidermex=true) usa certificateEvolution.ts (líneas 251-275)
- ❌ Path seguros usa lógica custom (líneas 297-338)

#### Problemas en Path Custom:

Similar a VitaminadaCalculator:
1. **NO considera mecánica de tickets**
2. **Reinversión simplificada**
3. **NO considera deuda/patrimonio neto**

#### Solución: Igual que VitaminadaCalculator

#### Estimación de Trabajo:
- **Opción A:** 3-4 horas
- **Opción B:** 1 hora (disclaimers)

---

## RESUMEN DE ESTIMACIONES

| Calculadora | Prioridad | Método Recomendado | Tiempo | Riesgo |
|-------------|-----------|-------------------|--------|--------|
| MotorcycleCalculator | CRÍTICA | Usar certificateEvolution.ts | 2-3h | Bajo |
| ThreeScenarioComparator | CRÍTICA | Usar certificateEvolution.ts | 3-4h | Medio |
| ICMCalculator | MEDIA | Mantener + disclaimers | 1h | Bajo |
| VitaminadaCalculator | MEDIA | Mantener + disclaimers | 1h | Bajo |
| SegubecaCalculator | MEDIA | Mantener + disclaimers | 1h | Bajo |

**Total estimado:** 8-12 horas de trabajo

---

## DECISIONES ARQUITECTÓNICAS

### ¿Por qué ALGUNAS calculadoras pueden tener lógica custom?

**Calculadoras de COMPARACIÓN** (ICM, Vitaminada, Segubeca):
- **Propósito:** Comparar RiderMex vs otras inversiones tradicionales
- **Path RiderMex:** DEBE usar certificateEvolution.ts (✅ YA LO HACE)
- **Path tradicional:** Puede ser simplificado SI tiene disclaimers claros

**Calculadoras de SIMULACIÓN** (Motorcycle, ThreeScenario):
- **Propósito:** Proyectar crecimiento de inversión RiderMex
- **Path único:** DEBE usar certificateEvolution.ts
- **Riesgo:** Si usan lógica custom, datos inconsistentes con otras calculadoras

### Regla General:
```
SI (calculadora simula RiderMex)
  ENTONCES usar certificateEvolution.ts
SI (calculadora compara con otra inversión tradicional)
  ENTONCES path RiderMex → certificateEvolution.ts
          path tradicional → puede ser custom CON disclaimers
```

---

## PLAN DE IMPLEMENTACIÓN

### FASE 1: Correcciones Críticas (1 semana)
1. ✅ **MotorcycleCalculator** → Migrar a certificateEvolution.ts
2. ✅ **ThreeScenarioComparator** → Escenario "Multiplicador" con certificateEvolution.ts

### FASE 2: Disclaimers (2 días)
3. ⚠️ **ICMCalculator** → Agregar disclaimers en path tradicional
4. ⚠️ **VitaminadaCalculator** → Agregar disclaimers en path custom
5. ⚠️ **SegubecaCalculator** → Agregar disclaimers en path custom

### FASE 3: Testing & Documentación (3 días)
6. Testing cruzado de todas las calculadoras
7. Verificar consistencia de números
8. Documentar diferencias permitidas vs problemas

---

## CHECKLIST DE VALIDACIÓN

Para cada calculadora actualizada, verificar:

- [ ] **Financiamiento:** Maneja opciones 0, 6, 12 meses
- [ ] **Mes inicio rendimientos:** Correcto según plan (mes 7, 13, 19)
- [ ] **Escalones:** Precio incrementa $1,000 cada 30 tickets
- [ ] **Plusvalía:** 50% año 1, luego 5% anual compuesto
- [ ] **Descuento rendimiento:** 2% por año desde compra inicial
- [ ] **Market growth:** 5% anual en utilidades
- [ ] **Sistema apartado:** Máximo 5 tickets en pago simultáneo
- [ ] **Patrimonio neto:** Valor apreciado - deuda pendiente
- [ ] **Tickets reinversión:** Solo cuenta tickets 100% pagados
- [ ] **Precio compra:** Incrementa 5% anual

---

## PRÓXIMOS PASOS INMEDIATOS

1. **Decisión del cliente:** ¿Qué enfoque prefiere para calculadoras de comparación?
   - A) Usar certificateEvolution.ts también para paths tradicionales
   - B) Mantener custom con disclaimers claros

2. **Priorización:** ¿Empezar por MotorcycleCalculator o ThreeScenarioComparator?

3. **Disclaimers:** Redactar texto para calculadoras de comparación

---

**Fecha:** 2026-02-28
**Autor:** Sistema de análisis
**Referencias:**
- `UNIT_ECONOMICS_LOGICA_MATEMATICA.md`
- `certificateEvolution.ts`
- Análisis completo de calculadoras
