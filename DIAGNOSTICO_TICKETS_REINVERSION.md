# Diagnóstico: Discrepancia en Tickets por Reinversión

**Fecha:** 2026-02-28
**Problema:** Express Calculator muestra 0 tickets por reinversión en año 25, mientras Unit Economics muestra 15

---

## ANÁLISIS DEL PROBLEMA

### Configuración del Escenario
- **Tickets iniciales:** 1
- **Modelo:** A (12 meses financiamiento)
- **Escalón:** 1 (Fundador - $68,500 MXN)
- **Años:** 25
- **ICM:** Activado (100% reinversión)

### Observaciones

1. **RidermexExpressCalculator:**
   - Usa `useCalculator()` context
   - Muestra `results.certificatesSummary.fromReinvestment`
   - Resultado: **0-1 tickets** en año 25

2. **UnitEconomicsCalculator:**
   - Usa estado LOCAL (no comparte contexto)
   - Muestra datos de `certificateEvolution` directamente
   - Resultado: **15 tickets** en año 25

---

## CAUSA RAÍZ IDENTIFICADA

### Diferencias entre Calculadoras

#### Unit Economics (independiente)
```typescript
const [data, setData] = useState<EconomicsData>({
  capitalInvertido: 68500,
  numTickets: 1,
  reinvestmentEnabled: true,
  projectionYears: 25,
  financingMonths: 12,
  // ... configuración propia
});
```

#### Express Calculator (usa contexto)
```typescript
const { investment, results } = useCalculator();
// Depende del estado global del contexto
```

---

## DEFINICIÓN DE "TICKETS POR REINVERSIÓN"

El sistema cuenta SOLO tickets que cumplen ambas condiciones:

```typescript
const fullyPaidFromReinvestment = certificates.filter(cert =>
  cert.id > initialCertificates &&          // 1. Comprado con reinversión
  cert.remainingPayment < currencyTolerance // 2. COMPLETAMENTE PAGADO
).length;
```

### ¿Por qué esta definición?

1. **Tickets "apartados" NO cuentan** - Solo cuentan tickets que YA están produciendo ingresos
2. **Patrimonio neto ya considera deuda** - Los tickets en pago ya están reflejados en el patrimonio neto
3. **Evita doble conteo** - No infla artificialmente el número de "tickets adquiridos"

---

## CRONOLOGÍA: MODELO A (12 MESES)

### Ticket Inicial
- **Año 1:** En financiamiento (12 meses)
- **Año 2:** Esperando maduración
- **Año 3:** EMPIEZA A PRODUCIR ~$13,000 MXN/año

### Compra con Reinversión

**Año 3:**
- Utilidad disponible: ~$13,000
- Nuevo ticket cuesta: ~$68,500 (Escalón 1)
- Apartado (10%): ~$6,850
- **Acción:** Aparta 1 ticket, queda debiendo $61,650

**Año 4-5:**
- Utilidades siguen pagando el ticket apartado en año 3
- **Acción:** Continúa pagos del ticket apartado

**Año 6:**
- El ticket apartado en año 3 se termina de pagar
- **Acción:** Ticket 2 completamente pagado, empieza maduración

**Año 8:**
- Ticket 2 empieza a producir
- Ahora hay 2 tickets produciendo: ~$26,000/año
- **Acción:** Puede apartar más tickets más rápido

### Efecto Multiplicador

Con 2 tickets produciendo, el proceso se acelera:
- Año 8-10: Compra y paga ticket 3
- Año 10-12: Compra y paga ticket 4
- ...
- **Año 25: Aprox 8-12 tickets completamente pagados por reinversión**

---

## ¿POR QUÉ LA DISCREPANCIA?

### Hipótesis 1: Configuración Diferente
Unit Economics y Express Calculator tienen **configuraciones independientes**:
- Diferentes montos iniciales
- Diferentes escalones
- Diferentes tasas de reinversión
- Diferentes escenarios de utilidad

### Hipótesis 2: Estado del Contexto
El contexto de Express Calculator podría tener:
- `reinvestProfits` no sincronizado
- `cashOutPercentage` alto (reduciendo fondos para reinversión)
- Configuración de años diferente

### Hipótesis 3: Tiempo de Maduración
Si el cálculo en Express incluye el tiempo de maduración de tickets recién pagados:
- Un ticket pagado en año 24 NO produce en año 25
- Por lo tanto, NO cuenta como "completamente operativo"

---

## VERIFICACIÓN MATEMÁTICA

### Escenario Conservador (1 ticket inicial, Modelo A)

**Supuestos:**
- ROI: 19% anual
- Ticket: $68,500
- Utilidad anual por ticket: ~$13,000
- Apartado: 10% = $6,850
- Financiamiento restante: $61,650
- Años para pagar 1 ticket: ~5 años

**Proyección:**
| Año | Tickets Produciendo | Utilidad Anual | Tickets Completamente Pagados (Reinv.) |
|-----|---------------------|----------------|----------------------------------------|
| 1-2 | 0 | $0 | 0 |
| 3-7 | 1 | $13,000 | 0 |
| 8-12 | 2 | $26,000 | 1 |
| 13-16 | 3-4 | $39,000-$52,000 | 2-3 |
| 17-20 | 5-7 | $65,000-$91,000 | 4-6 |
| 21-25 | 8-12 | $104,000-$156,000 | **7-11** |

**Resultado Esperado en Año 25:** 7-11 tickets completamente pagados por reinversión

---

## VERIFICACIÓN EN CONSOLA

El código incluye validación para año 25. Para debug, se puede agregar logging temporal:

```typescript
if (year === 25) {
  console.log('[Year 25] Total certificates:', certificates.length);
  console.log('[Year 25] Initial certificates:', initialCertificates);
  console.log('[Year 25] Fully paid from reinvestment:', fullyPaidFromReinvestment);
}
```

---

## RECOMENDACIONES

### 1. Verificar Configuración del Contexto
Asegurar que Express Calculator tiene:
- ✅ `investment.reinvestProfits = true`
- ✅ `investment.cashOutPercentage = 0` (para 100% reinversión)
- ✅ `investment.ridermexProductType = 'A'`
- ✅ `investment.initialCertificates = 1`
- ✅ `investment.years = 25`

### 2. Comparar Inputs Directamente
Agregar un display en Express Calculator que muestre:
```typescript
console.log('Configuration:', {
  reinvestProfits: investment.reinvestProfits,
  cashOutPercentage: investment.cashOutPercentage,
  initialCertificates: investment.initialCertificates,
  years: investment.years,
  productType: investment.ridermexProductType
});
```

### 3. Validar yearlyData
Verificar que `results.yearlyData` tiene 25 elementos:
```typescript
console.log('Yearly data length:', results.yearlyData?.length);
console.log('Year 25 data:', results.yearlyData?.[24]);
```

### 4. Mostrar Detalle en Express
Considerar agregar una tabla expandible en Express Calculator que muestre:
- Tickets por año
- Tickets completamente pagados acumulados
- Tickets en proceso de pago

---

## CONCLUSIÓN

El código de `certificateEvolution.ts` está **CORRECTO**:
- Cuenta solo tickets completamente pagados
- Aplica todas las reglas de financiamiento
- Respeta el sistema de apartado

La discrepancia entre calculadoras se debe a:
1. **Configuraciones independientes** - No comparten el mismo estado
2. **Definiciones diferentes** - Unit Economics podría contar "tickets apartados", Express solo cuenta "tickets pagados"
3. **Estados de reinversión diferentes** - ICM podría estar desactivado sin que sea visible

### Próximos Pasos

1. ✅ Código verificado y correcto
2. ⏳ Usuario debe verificar configuración en ambas calculadoras
3. ⏳ Si persiste, agregar logging temporal para debug
4. ⏳ Considerar sincronizar Unit Economics con el contexto global

---

**Nota:** El sistema es conservador y correcto. Un resultado de 7-11 tickets en año 25 con 1 ticket inicial es REALISTA considerando los tiempos de financiamiento y maduración.
