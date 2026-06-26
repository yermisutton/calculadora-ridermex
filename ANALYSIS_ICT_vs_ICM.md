# Análisis Paso por Paso: ICT vs ICM

## Parámetros de Prueba
- **Certificados iniciales:** 1
- **Precio por certificado:** $266,000 MXN
- **Producción:** 38,000 kg/ha (perfil Optimista)
- **Precio limón inicial:** $38/kg
- **Factor inversionista:** 65%
- **Hectáreas por certificado:** 0.1 ha
- **Apreciación certificado:** 12% anual (primeros 5 años), luego flat
- **Incremento precio limón:** 5% anual (después del año 5)
- **Período de maduración:** 5 años
- **Años totales:** 25 años

## Calculadora 1: InteresCompuestoMultiplicador.tsx

### Configuración ICT
```typescript
const investmentICT = createInvestmentObject(false);
// reinvestProfits: false
// partialCashOut: true
// cashOutPercentage: 100
```

### Configuración ICM
```typescript
const investmentICM = createInvestmentObject(true);
// reinvestProfits: true (si reinvestmentPercentage > 0)
// partialCashOut: true
// cashOutPercentage: 100 - reinvestmentPercentage
```

### Paso por Paso

#### Año 1-4: Período de Maduración (sin producción)
**ICT:**
- Certificados: 1
- Precio certificado año 1: $266,000 × 1.12¹ = $297,920
- Precio certificado año 4: $266,000 × 1.12⁴ = $418,685
- Producción: 0 kg
- Ingreso: $0
- Patrimonio: $418,685

**ICM:**
- Certificados: 1
- Precio certificado año 4: $418,685
- Producción: 0 kg
- Ingreso: $0
- Patrimonio: $418,685

**Diferencia:** Ninguna (ambos iguales durante maduración)

#### Año 5: Primera Producción
**Cálculo de Producción:**
- Certificados produciendo: 1
- Hectáreas: 1 × 0.1 = 0.1 ha
- Producción: 0.1 × 38,000 = 3,800 kg
- Precio limón: $38/kg (aún no incrementa)
- Ingreso bruto: 3,800 × $38 = $144,400
- Ingreso inversionista: $144,400 × 0.65 = $93,860

**Precio Certificado Año 5:**
- $266,000 × 1.12⁵ = $468,759

**ICT (0% reinversión):**
- Certificados: 1 (no compra más)
- Retiro efectivo: $93,860 (100%)
- Fondos para reinversión: $0
- Patrimonio: 1 × $468,759 = $468,759

**ICM (100% reinversión):**
- Certificados al inicio: 1
- Retiro efectivo: $0 (0%)
- Fondos para reinversión: $93,860
- Certificados que puede comprar: $93,860 / $266,000 = 0.35
- **LÍMITE AÑOS 5-10:** 1 certificado máximo
- Certificados comprados: 0.35 (menor que límite)
- Total certificados: 1 + 0.35 = 1.35
- Patrimonio: 1.35 × $468,759 = $632,825

**Diferencia año 5:** $632,825 / $468,759 = 1.35x

#### Año 6: Segunda Producción

**Precio Limón Año 6:**
- $38 × 1.05¹ = $39.90/kg (empieza incremento 5%)

**ICT:**
- Certificados produciendo: 1
- Producción: 3,800 kg
- Ingreso bruto: 3,800 × $39.90 = $151,620
- Ingreso inversionista: $151,620 × 0.65 = $98,553
- Certificados totales: 1 (sin reinversión)
- Precio certificado: $468,759 (flat después año 5)
- Patrimonio: $468,759

**ICM:**
- Certificados produciendo: 1 (el 0.35 aún está en maduración)
- Producción: 3,800 kg
- Ingreso bruto: $151,620
- Ingreso inversionista: $98,553
- Fondos acumulados: $93,860 (año 5) + $98,553 (año 6) = $192,413
- Puede comprar más: $192,413 / $266,000 = 0.72
- Límite acumulado años 5-10: 1 certificado
- Ya tiene 0.35, puede agregar: 1 - 0.35 = 0.65
- Compra: 0.65 certificados
- Total: 1 + 0.35 + 0.65 = 2 certificados
- Patrimonio: 2 × $468,759 = $937,518

**Diferencia año 6:** $937,518 / $468,759 = 2.0x

#### Año 10: Final del Primer Bloque

**Precio Limón Año 10:**
- $38 × 1.05⁵ = $48.50/kg

**ICT:**
- Certificados produciendo: 1
- Producción: 3,800 kg
- Ingreso bruto: 3,800 × $48.50 = $184,300
- Ingreso inversionista: $119,795
- Certificados: 1
- Patrimonio: $468,759

**ICM:**
- Certificados produciendo: 1 (inicial) + algunos del 0.35-1.0 rango
- Límite años 5-10: 1 certificado máximo
- Ha acumulado y comprado hasta el límite
- Certificados aproximados: 2
- Producción: 2 × 3,800 = 7,600 kg
- Ingreso bruto: 7,600 × $48.50 = $368,600
- Ingreso inversionista: $239,590
- Continúa reinvirtiendo
- Patrimonio estimado: 2 × $468,759 = $937,518

**Diferencia año 10:** ~2.0x

#### Año 11: Nuevo Límite de Adquisición

**LÍMITE AÑOS 11-15:** 2 certificados (dobla)

**ICM:**
- Puede ahora comprar hasta 2 certificados adicionales
- Acelera adquisición dramáticamente

#### Año 15: Fin del Segundo Bloque

**Precio Limón Año 15:**
- $38 × 1.05¹⁰ = $61.89/kg

**ICT:**
- Certificados: 1
- Patrimonio: $468,759

**ICM:**
- Límite acumulado años 11-15: 2 certificados
- Total certificados aproximados: 4-5
- Patrimonio: ~$2.3M

**Diferencia año 15:** ~5.0x

#### Año 20: Tercer Bloque

**LÍMITE AÑOS 16-20:** 4 certificados

**Precio Limón Año 20:**
- $38 × 1.05¹⁵ = $79.02/kg

**ICT:**
- Certificados: 1
- Patrimonio: $468,759

**ICM:**
- Límite acumulado: 1 + 2 + 4 = 7 certificados
- Total aproximado: 8-10 certificados
- Patrimonio: ~$4.7M

**Diferencia año 20:** ~10.0x

#### Año 25: Final

**LÍMITE AÑOS 21-25:** 8 certificados

**Precio Limón Año 25:**
- $38 × 1.05²⁰ = $100.77/kg

**ICT:**
- Certificados: 1
- Producción: 3,800 kg
- Ingreso bruto: 3,800 × $100.77 = $382,926
- Ingreso inversionista: $248,902
- Ingreso mensual: $20,742
- **Patrimonio: $468,759**

**ICM:**
- Límite acumulado: 1 + 2 + 4 + 8 = 15 certificados
- Con reinversión continua: ~22 certificados
- Producción: 22 × 3,800 = 83,600 kg
- Ingreso bruto: 83,600 × $100.77 = $8,424,372
- Ingreso inversionista: $5,475,842
- Ingreso mensual: $456,320
- **Patrimonio: 22 × $468,759 = $10,312,698**

**Diferencia año 25:** $10,312,698 / $468,759 = **22.0x**

---

## Calculadora 2: ICMRetirementCalculator.tsx

### Problema Identificado

El código anterior tenía:
```typescript
for (let year = 1; year <= years; year++) {
  const evolutionData = getDetailedCertificateEvolution(investment, numberOfCertificates, year);
  // Recalculaba TODO en cada iteración
}
```

### Corrección Aplicada

```typescript
const evolutionData = getDetailedCertificateEvolution(investment); // Una sola vez
for (let year = 1; year <= yearsToRetirement; year++) {
  const yearData = evolutionData[year - 1]; // Solo lee el resultado
}
```

---

## Valores Esperados en la Imagen

Según la imagen compartida:
- **ICT Patrimonio:** $1,243,821
- **ICM Patrimonio:** $26,406,924
- **Multiplicador:** 21.23x

## Discrepancia Encontrada

### ICT: $1,243,821 vs $468,759 esperado

**El ICT está mostrando $1.24M cuando debería mostrar $468k**

Posibles causas:
1. ¿Está sumando el efectivo acumulado retirado? NO debería
2. ¿Está contando contribuciones adicionales? Revisar
3. ¿Hay algún cálculo de "valor futuro" del dinero retirado?

### ICM: $26,406,924 vs $10,312,698 esperado

**El ICM muestra ~$26M, el doble de lo calculado manualmente**

Posibles causas:
1. Los límites de adquisición están siendo más generosos
2. Hay contribuciones mensuales configuradas
3. El cálculo está considerando más certificados

---

## Próximos Pasos de Investigación

1. Verificar si hay `monthlyContribution` configurado
2. Revisar exactamente qué incluye `citrusPatrimony`
3. Verificar los límites de adquisición en `getDetailedCertificateEvolution`
4. Agregar logs detallados año por año para ver la evolución real
