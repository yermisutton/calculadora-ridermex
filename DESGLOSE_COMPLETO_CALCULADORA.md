# DESGLOSE COMPLETO DE LA CALCULADORA
## Guía para Clonar con Nueva Lógica

---

## 1. DATOS DE ENTRADA (Investment Interface)

### A) DATOS DEL CERTIFICADO/PRODUCTO BASE
```typescript
initialCertificates: 1                 // Cantidad inicial de certificados/unidades
certificateBasePrice: 266000           // Precio base del certificado en pesos
initialPayment: 266000                 // Pago inicial (puede ser menor que el precio total)
```

**CÓMO SUSTITUIR:**
- Si vendes otro producto (paneles solares, ganado, etc.), cambia el precio base
- Ejemplo: Panel solar = $50,000
- Ejemplo: Cabeza de ganado = $15,000
- Ejemplo: Colmena de abejas = $8,000

---

### B) PARÁMETROS DE TIEMPO
```typescript
years: 25                              // Plazo de la inversión en años
```

**CÓMO SUSTITUIR:**
- Ajusta según el ciclo de vida de tu producto
- Paneles solares: 25 años
- Ganado: 5-10 años
- Cultivos anuales: 1-5 años

---

### C) PRODUCCIÓN Y RENDIMIENTO
```typescript
averageProductionPerHectare: 35000     // Kg de limón por hectárea al año
averageSalePricePerKg: 38              // Precio de venta por kg en pesos
investorFactor: 65                     // Factor del inversionista (65% = 0.65)
```

**CÓMO SUSTITUIR:**
- **Para ganado:**
  - `averageProductionPerHead: 200` (kg de carne por cabeza)
  - `averageSalePricePerKg: 80` (precio del kg de carne)
  - `investorFactor: 70` (70% para el inversionista)

- **Para paneles solares:**
  - `averageKwhPerYear: 4500` (kwh generados por año)
  - `averageSalePricePerKwh: 2.5` (precio de venta por kwh)
  - `investorFactor: 80` (80% para el inversionista)

- **Para miel:**
  - `averageProductionPerHive: 40` (kg de miel por colmena)
  - `averageSalePricePerKg: 150` (precio del kg de miel)
  - `investorFactor: 75` (75% para el inversionista)

---

### D) TASAS DE CRECIMIENTO Y APRECIACIÓN
```typescript
annualProfit: 20                       // Rendimiento anual estimado (%)
lemonPriceIncrease: 5                  // Incremento anual del precio del limón (%)
increaseLemonPrice: true               // ¿Aplicar incremento de precio?
appreciationRate: 12                   // Apreciación del activo (certificado) años 1-5 (%)
```

**CÓMO SUSTITUIR:**
- **Para ganado:**
  - `annualProfit: 25` (ganado se aprecia rápido)
  - `meatPriceIncrease: 6` (inflación de proteína animal)
  - `cattleAppreciation: 15` (apreciación del ganado)

- **Para paneles solares:**
  - `annualProfit: 12` (rendimiento eléctrico)
  - `electricityPriceIncrease: 8` (incremento tarifas eléctricas)
  - `panelAppreciation: 3` (paneles se deprecian, no aprecian)

- **Para aguacate:**
  - `annualProfit: 22`
  - `avocadoPriceIncrease: 7` (alta demanda)
  - `treeAppreciation: 10`

---

### E) ESTRATEGIA DE REINVERSIÓN
```typescript
reinvestProfits: true                  // ¿Reinvertir las utilidades?
partialCashOut: false                  // ¿Retiro parcial de utilidades?
cashOutPercentage: 30                  // % de utilidad a retirar (si partialCashOut = true)
yearlyCashOutPercentages: [30, 30...]  // % de retiro por año (array de 30 años)
citrusReinvestment: true               // ¿Reinvertir en más certificados?
citrusReinvestmentPercentages: [100...]// % a reinvertir por año
```

**CÓMO SUSTITUIR:**
- Mantén la misma lógica pero ajusta los nombres:
  - `cattleReinvestment`, `panelReinvestment`, `honeyReinvestment`
  - Los porcentajes funcionan igual para cualquier tipo de inversión

---

### F) APORTACIONES ADICIONALES
```typescript
additionalContributions: false         // ¿Hacer aportaciones mensuales?
monthlyContribution: 10000             // Aportación mensual en pesos
```

**CÓMO SUSTITUIR:**
- Funciona igual para cualquier tipo de inversión
- Solo cambia el contexto: "comprar más paneles", "comprar más ganado"

---

### G) INFLACIÓN Y TASAS COMPARATIVAS
```typescript
inflationRate: 5                       // Tasa de inflación anual (%)
cetesRate: 7.5                         // Rendimiento de CETES (%)
savingsRate: 4.0                       // Rendimiento de ahorro bancario (%)
realEstateRate: 8.0                    // Rendimiento de bienes raíces (%)
realEstateAppreciation: 8              // Apreciación de bienes raíces (%)
realEstateRent: 6                      // Rendimiento por renta (%)
customInvestmentRate: 8                // Inversión personalizada (%)
customInvestmentName: 'Mi Inversión'   // Nombre de inversión personalizada
```

**CÓMO SUSTITUIR:**
- Estas tasas sirven para comparar tu inversión con alternativas
- Mantén las mismas, son estándares del mercado mexicano

---

### H) IMPUESTOS
```typescript
applyTaxes: false                      // ¿Aplicar impuestos?
taxRate: 30                            // Tasa impositiva (%)
```

**CÓMO SUSTITUIR:**
- Ajusta según el régimen fiscal de tu inversión
- Limones: 30% (ISR)
- Ganado: 35% (puede tener más impuestos)
- Paneles solares: 25% (pueden tener incentivos fiscales)

---

### I) VALORACIÓN (EBITDA)
```typescript
ebitdaFactor: 10                       // Factor de EBITDA para valuación
```

**CÓMO SUSTITUIR:**
- Este factor convierte utilidad anual en valor del negocio
- Agroindustria: 8-12x
- Tecnología: 15-20x
- Ganadería: 6-10x
- Paneles solares: 10-15x

---

### J) CALCULADORA DE LARGO PLAZO
```typescript
isLongTermCalculator: false            // ¿Es calculadora de largo plazo?
firstYearUtilityToUser: false          // ¿Utilidad del año 1 al usuario?
```

**CÓMO SUSTITUIR:**
- Si tu producto tiene periodo de espera (árboles frutales), usa `isLongTermCalculator: true`
- Ejemplo: Aguacate tarda 3 años en producir
- Ejemplo: Ganado puede venderse en 1 año

---

### K) MONEDA Y FORMATO
```typescript
currencyFormat: 'MXN'                  // Formato de moneda
exchangeRate: 20                       // Tipo de cambio MXN/USD
exchangeRateEUR: 21.70                 // Tipo de cambio MXN/EUR
```

**CÓMO SUSTITUIR:**
- Mantén igual si trabajas en México
- Ajusta si trabajas en otro país

---

### L) COMISIONES Y FINANCIAMIENTO
```typescript
commissionRate: 0.05                   // Comisión (5%)
downPaymentPercentage: 30              // Enganche (%)
financingInterestRate: 0               // Tasa de interés de financiamiento (%)
financingDownPaymentPercent: 30        // Porcentaje de enganche
financingAnnualInterestRate: 12        // Tasa anual de interés (%)
downPaymentInstallments: 1             // Número de parcialidades del enganche
```

**CÓMO SUSTITUIR:**
- Ajusta según tu modelo de negocio
- Paneles solares: enganche 20%, tasa 9%
- Ganado: enganche 40%, tasa 15%

---

### M) INFORMACIÓN DEL INVERSIONISTA Y EJECUTIVO
```typescript
investorName: ''                       // Nombre del inversionista
investorPhone: ''                      // Teléfono del inversionista
investorEmail: ''                      // Email del inversionista
executiveName: ''                      // Nombre del ejecutivo
executivePhone: ''                     // Teléfono del ejecutivo
executiveEmail: ''                     // Email del ejecutivo
```

**CÓMO SUSTITUIR:**
- Mantén igual, son datos de contacto

---

## 2. CÁLCULOS PRINCIPALES

### A) CÁLCULO DE UTILIDAD POR CERTIFICADO/UNIDAD
```typescript
// FÓRMULA ACTUAL (LIMONES):
utilityPerCertificate =
  averageProductionPerHectare     // 35,000 kg/ha
  × currentLemonPrice              // $38/kg (ajustado por incremento anual)
  × 0.1                           // hectáreas por certificado
  × (investorFactor / 100)        // 0.65 (65% para inversionista)

// Resultado: $85,750 por certificado al año 1
```

**CÓMO SUSTITUIR:**

**Para GANADO:**
```typescript
utilityPerHead =
  averageWeightPerHead            // 450 kg por cabeza
  × currentMeatPrice              // $80/kg
  × reproductionRate              // 0.8 (80% de éxito en reproducción)
  × (investorFactor / 100)        // 0.70 (70% para inversionista)

// Ejemplo: 450 × 80 × 0.8 × 0.70 = $20,160 por cabeza
```

**Para PANELES SOLARES:**
```typescript
utilityPerPanel =
  averageKwhPerYear               // 4,500 kwh/año
  × currentElectricityPrice       // $2.5/kwh
  × efficiencyFactor              // 0.95 (pérdidas del 5%)
  × (investorFactor / 100)        // 0.80 (80% para inversionista)

// Ejemplo: 4,500 × 2.5 × 0.95 × 0.80 = $8,550 por panel
```

**Para COLMENAS DE ABEJAS:**
```typescript
utilityPerHive =
  averageHoneyPerHive             // 40 kg/año
  × currentHoneyPrice             // $150/kg
  × survivalRate                  // 0.90 (90% supervivencia)
  × (investorFactor / 100)        // 0.75 (75% para inversionista)

// Ejemplo: 40 × 150 × 0.90 × 0.75 = $4,050 por colmena
```

---

### B) CRECIMIENTO DEL PRECIO DEL PRODUCTO
```typescript
// FÓRMULA ACTUAL (LIMONES):
// Años 1-5: Precio fijo
// Año 6+: Incremento compuesto
if (year > 5) {
  currentLemonPrice = averageSalePricePerKg × Math.pow(1 + lemonPriceIncrease/100, year - 5)
}

// Ejemplo año 10:
// currentLemonPrice = 38 × (1.05)^5 = $48.48/kg
```

**CÓMO SUSTITUIR:**
- Mantén la misma fórmula pero cambia el nombre de la variable
- `currentMeatPrice`, `currentElectricityPrice`, `currentHoneyPrice`

---

### C) APRECIACIÓN DEL ACTIVO (CERTIFICADO)
```typescript
// FÓRMULA ACTUAL:
// Años 1-5: Apreciación compuesta
// Año 6+: Precio fijo
currentCertPrice = certificateBasePrice × Math.pow(1 + appreciationRate/100, Math.min(year, 5))

// Ejemplo:
// Año 1: $266,000
// Año 5: $266,000 × (1.12)^5 = $469,096
// Año 10: $469,096 (sin más apreciación)
```

**CÓMO SUSTITUIR:**
- **Para GANADO:**
  ```typescript
  currentCattlePrice = baseHeadPrice × Math.pow(1 + cattleAppreciation/100, Math.min(year, 3))
  // Ganado aprecia rápido los primeros 3 años
  ```

- **Para PANELES SOLARES:**
  ```typescript
  currentPanelPrice = basePanelPrice × Math.pow(1 - panelDepreciation/100, year)
  // Paneles SE DEPRECIAN (usar signo negativo)
  // O simplemente mantenerlos a precio fijo
  ```

---

### D) REINVERSIÓN DE UTILIDADES
```typescript
// FÓRMULA ACTUAL:
yearlyUtility = totalCertificates × utilityPerCertificate

// Si reinvestProfits = true:
if (year > 4) { // Periodo de espera
  reinvestmentAmount = yearlyUtility × (citrusReinvestmentPercentages[year-1] / 100)
  newCertificates = reinvestmentAmount / currentCertPrice
  totalCertificates += newCertificates
}
```

**CÓMO SUSTITUIR:**
- La lógica es idéntica para cualquier activo
- Solo cambia el periodo de espera según tu producto:
  - Limones: 4 años
  - Ganado: 1 año (se reproduce rápido)
  - Paneles: 0 años (producen inmediato)
  - Aguacate: 3 años

---

### E) RETIRO PARCIAL DE UTILIDADES
```typescript
// FÓRMULA ACTUAL:
if (partialCashOut && year > 4) {
  cashOutPercentageThisYear = yearlyCashOutPercentages[year - 1]
  yearlyCashOutAmount = yearlyUtility × (cashOutPercentageThisYear / 100)

  // Solo se reinvierte lo que NO se retiró:
  reinvestmentAmount = yearlyUtility - yearlyCashOutAmount
  newCertificates = reinvestmentAmount / currentCertPrice
}
```

**CÓMO SUSTITUIR:**
- Mantén la misma lógica, funciona para cualquier inversión

---

### F) PATRIMONIO TOTAL
```typescript
// FÓRMULA ACTUAL:
citrusPatrimony = totalCertificates × currentCertPrice

// También se suma:
// - Utilidades acumuladas retiradas
// - Valor de los certificados
```

**CÓMO SUSTITUIR:**
- **Para GANADO:**
  ```typescript
  cattlePatrimony = totalHeads × currentCattlePrice
  ```

- **Para PANELES:**
  ```typescript
  solarPatrimony = totalPanels × currentPanelPrice
  ```

---

### G) INGRESO MENSUAL PROYECTADO
```typescript
// FÓRMULA ACTUAL:
annualIncome = totalCertificates × utilityPerCertificate
monthlyIncome = annualIncome / 12
```

**CÓMO SUSTITUIR:**
- Mantén igual para cualquier inversión

---

### H) MÉTRICAS DE RENDIMIENTO

#### ROI (Return on Investment)
```typescript
ROI = ((finalPatrimony - initialInvestment) / initialInvestment) × 100
```

#### CAGR (Tasa de Crecimiento Anual Compuesta)
```typescript
CAGR = (Math.pow(finalPatrimony / initialInvestment, 1 / years) - 1) × 100
```

#### IRR (Tasa Interna de Retorno)
```typescript
// Se calcula iterativamente hasta encontrar la tasa que hace NPV = 0
NPV = -initialInvestment + Σ(cashFlow_year_i / (1 + IRR)^i)
```

#### Multiplicador de Capital
```typescript
capitalMultiplier = finalPatrimony / initialInvestment
```

#### Año de Recuperación (Payback)
```typescript
// Año en que las utilidades acumuladas >= inversión inicial
paybackYear = año donde: cumulativeUtility >= initialInvestment
```

**CÓMO SUSTITUIR:**
- Estas fórmulas son universales, NO las cambies
- Funcionan para cualquier tipo de inversión

---

### I) COMPARATIVAS CON OTRAS INVERSIONES
```typescript
// CETES (con reinversión):
cetesPatrimony = initialInvestment × Math.pow(1 + cetesRate/100, years)

// AHORRO (con reinversión):
savingsPatrimony = initialInvestment × Math.pow(1 + savingsRate/100, years)

// BIENES RAÍCES (apreciación + renta):
realEstatePatrimony = initialInvestment × Math.pow(1 + realEstateAppreciation/100, years)
realEstateIncome = realEstatePatrimony × (realEstateRent/100)
```

**CÓMO SUSTITUIR:**
- Mantén igual, son estándares del mercado

---

### J) AJUSTE POR INFLACIÓN (VALORES REALES)
```typescript
// Valor real = Valor nominal / (1 + inflación)^años
realPatrimony = nominalPatrimony / Math.pow(1 + inflationRate/100, years)
```

**CÓMO SUSTITUIR:**
- Mantén igual, la inflación afecta a todos por igual

---

### K) VALORACIÓN EBITDA
```typescript
// Valor del negocio = Utilidad anual × Factor EBITDA
ebitdaValue = annualUtility × ebitdaFactor

// Ejemplo:
// Si generas $1,000,000 al año y el factor es 10x
// Tu negocio vale $10,000,000
```

**CÓMO SUSTITUIR:**
- Ajusta el factor según tu industria (ver sección I arriba)

---

## 3. EJEMPLO COMPLETO: CLONAR PARA GANADO

### DATOS DE ENTRADA
```typescript
const ganadoInvestment = {
  // BASE
  initialHeads: 10,                    // 10 cabezas inicial (vs 1 certificado)
  headBasePrice: 15000,                // $15k por cabeza (vs $266k)
  initialPayment: 150000,              // $150k total

  // PRODUCCIÓN
  averageWeightPerHead: 450,           // 450 kg por cabeza (vs 35k kg/ha)
  averageMeatPricePerKg: 80,          // $80/kg (vs $38/kg limón)
  reproductionRate: 0.8,              // 80% éxito (vs hectárea fija)
  investorFactor: 70,                 // 70% inversionista (vs 65%)

  // CRECIMIENTO
  meatPriceIncrease: 6,               // 6% anual (vs 5% limón)
  cattleAppreciation: 15,             // 15% apreciación (vs 12%)
  waitingPeriod: 1,                   // 1 año espera (vs 4 años limón)

  // TIEMPO
  years: 10,                          // 10 años (vs 25)

  // RESTO IGUAL...
  inflationRate: 5,
  cetesRate: 7.5,
  // etc...
}
```

### CÁLCULOS AJUSTADOS
```typescript
// UTILIDAD POR CABEZA
utilityPerHead =
  averageWeightPerHead        // 450 kg
  × currentMeatPrice          // $80/kg → ajustado por incremento anual
  × reproductionRate          // 0.8
  × (investorFactor / 100)    // 0.70

// Año 1: 450 × 80 × 0.8 × 0.70 = $20,160 por cabeza
// Año 10: 450 × 143 × 0.8 × 0.70 = $35,974 por cabeza

// PRECIO DEL GANADO
if (year > 1) { // Incremento desde año 2
  currentMeatPrice = averageMeatPricePerKg × Math.pow(1.06, year - 1)
}

// APRECIACIÓN DEL GANADO
currentHeadPrice = headBasePrice × Math.pow(1.15, Math.min(year, 3))
// Año 1: $15,000
// Año 3: $22,838

// REINVERSIÓN (desde año 2)
if (year > waitingPeriod) { // waitingPeriod = 1
  yearlyUtility = totalHeads × utilityPerHead
  reinvestmentAmount = yearlyUtility × (cattleReinvestmentPercentage / 100)
  newHeads = reinvestmentAmount / currentHeadPrice
  totalHeads += newHeads
}

// PATRIMONIO
cattlePatrimony = totalHeads × currentHeadPrice

// INGRESO MENSUAL
annualIncome = totalHeads × utilityPerHead
monthlyIncome = annualIncome / 12
```

---

## 4. RESUMEN: PASOS PARA CLONAR

### PASO 1: Identifica tu activo productivo
- ¿Qué vendes? (limones, ganado, paneles, miel, etc.)
- ¿Cuánto cuesta la unidad base?
- ¿Cuánto produce por año?

### PASO 2: Ajusta los parámetros de producción
```typescript
// CAMBIA:
averageProductionPerHectare → averageProductionPerUnit
averageSalePricePerKg → averageSalePricePerUnit
lemonPriceIncrease → productPriceIncrease
```

### PASO 3: Ajusta el periodo de espera
```typescript
// Limones: 4 años
// Ganado: 1 año
// Paneles: 0 años
// Aguacate: 3 años
const waitingPeriod = X;
```

### PASO 4: Ajusta la apreciación del activo
```typescript
// ¿Tu activo se aprecia o deprecia?
// Aprecia: ganado, árboles frutales
// Deprecia: paneles solares, maquinaria
appreciationRate = X // (+) o (-)
```

### PASO 5: Mantén las métricas estándar
- ROI, CAGR, IRR, Multiplicador → NO cambiar
- Comparativas con CETES, ahorro, bienes raíces → NO cambiar
- Ajuste por inflación → NO cambiar

### PASO 6: Ajusta el factor EBITDA
```typescript
// Según tu industria:
// Agricultura: 8-12x
// Ganadería: 6-10x
// Tecnología/Paneles: 10-15x
ebitdaFactor = X
```

### PASO 7: Renombra las variables en el código
```typescript
// BUSCAR Y REEMPLAZAR:
"citrus" → "cattle" (o "solar", "honey", etc.)
"certificate" → "head" (o "panel", "hive", etc.)
"lemon" → "meat" (o "electricity", "honey", etc.)
```

---

## 5. FÓRMULAS MATEMÁTICAS CLAVE

### Fórmula General de Crecimiento Compuesto
```
FV = PV × (1 + r)^n

Donde:
FV = Valor Futuro
PV = Valor Presente
r = Tasa de crecimiento
n = Número de periodos
```

### Fórmula de Reinversión Continua
```
Total_Unidades(año_n) = Total_Unidades(año_n-1) +
  (Utilidad(año_n-1) × %Reinversión) / Precio_Unidad(año_n)
```

### Fórmula de Utilidad Anual
```
Utilidad = Unidades_Totales × Producción_Por_Unidad × Precio_Producto × Factor_Inversionista
```

### Fórmula de Patrimonio
```
Patrimonio = Unidades_Totales × Precio_Actual_Unidad
```

---

## 6. PREGUNTAS PARA DEFINIR TU NUEVA CALCULADORA

1. **¿Qué estás vendiendo?**
   - Descripción del activo productivo

2. **¿Cuánto cuesta una unidad?**
   - Precio base

3. **¿Cuánto produce por año?**
   - Cantidad y unidad (kg, kwh, litros, etc.)

4. **¿A qué precio se vende lo que produce?**
   - Precio por unidad de producción

5. **¿Qué porcentaje recibe el inversionista?**
   - Factor del inversionista (60%, 70%, 80%?)

6. **¿Cuánto tiempo tarda en empezar a producir?**
   - Periodo de espera (0, 1, 2, 3, 4 años?)

7. **¿El activo se aprecia o deprecia?**
   - Tasa de apreciación/depreciación

8. **¿El precio del producto sube con el tiempo?**
   - Tasa de incremento anual del precio

9. **¿En cuántos años se proyecta?**
   - Plazo de la inversión

10. **¿Cuál es el factor EBITDA de tu industria?**
    - Para valoración del negocio

---

## ¿LISTO PARA CLONAR?

Una vez que respondas estas preguntas, puedo crear la calculadora exacta con tu lógica de negocio.

**¿Qué tipo de inversión quieres calcular?**
- Ganadería
- Paneles solares
- Apicultura (miel)
- Aguacates
- Café
- Otro (especificar)
