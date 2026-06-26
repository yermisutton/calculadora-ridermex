# Test de Cálculos: ICT vs ICM

## Configuración de Prueba

### Parámetros en la Imagen
- Edad actual: Desconocida (asumimos 35)
- Edad retiro: 60 años
- Años: 25
- Certificados: 1
- Perfil: Optimista
- Contribución mensual: $0 (asumido)
- Reinversión ICM: 100%

### Resultados Mostrados
- **ICT Patrimonio:** $1,243,821
- **ICT Ingreso Mensual:** $20,753
- **ICM Patrimonio:** $26,406,924
- **ICM Ingreso Mensual:** $269,792
- **Multiplicador:** 21.23x
- **ICM Certificados:** 22.00

## Cálculo Manual del ICT

### Certificados y Apreciación
- Certificados año 25: **1** (nunca reinvierte)
- Precio inicial: $266,000
- Apreciación 5 años: $266,000 × 1.12^5 = $468,759
- Precio año 6-25: $468,759 (flat)
- **Patrimonio certificados: $468,759**

### ¿De dónde vienen los $1,243,821?

Diferencia: $1,243,821 - $468,759 = $775,062

**Hipótesis 1:** ¿Está sumando efectivo retirado acumulado?
- Años 5-25: 21 años de retiros
- Promedio ingreso anual: ~$200,000
- Total retirado: ~$4.2M
- NO tiene sentido sumar esto al patrimonio

**Hipótesis 2:** ¿Valor presente de los ingresos futuros?
- Si capitaliza ingresos futuros...
- Pero eso NO es "patrimonio" tradicional

**Hipótesis 3:** ¿Patrimonio = Certificados + Efectivo NO retirado acumulado?
- Si hay un % que NO se retira...
- Pero configuramos `cashOutPercentage: 100`

**Hipótesis 4:** ¿Bug en el cálculo del precio del certificado?
- Tal vez está usando un precio diferente
- $1,243,821 / 1 = $1,243,821 por certificado
- Eso es 2.65x el precio esperado ($468,759)
- $468,759 × 2.65 = $1,242,211 ✓ MATCH!

**¡ENCONTRADO! El ICT está valuando el certificado a 2.65x su valor real**

## Cálculo Manual del ICM

### Certificados Finales
Según imagen: **22.00 certificados**

### Patrimonio
- Certificados: 22
- Precio por certificado: $468,759
- **Patrimonio esperado: 22 × $468,759 = $10,312,698**

### Pero muestra: $26,406,924

Diferencia: $26,406,924 - $10,312,698 = $16,094,226

**Relación:** $26,406,924 / $10,312,698 = 2.56x
**Similar al ICT:** También ~2.6x

**CONCLUSIÓN: Ambos están multiplicando el precio del certificado por ~2.6x**

## ¿Qué está pasando con el precio del certificado?

### Teoría: Contribuciones Mensuales Ocultas

Si hay contribuciones mensuales, se compran más certificados:
- Con $5,000/mes = $60,000/año
- En 25 años: $1.5M adicionales
- Eso compra: $1,500,000 / $266,000 = 5.6 certificados más

ICT:
- 1 inicial + 5.6 comprados = 6.6 certificados
- 6.6 × $468,759 = $3,093,809
- Aún NO explica $1,243,821

### Teoría: Certificados Parcialmente Pagados

Si el código cuenta certificados "reservados" que aún NO están completamente pagados:
- Certificado reservado vale $266,000 (precio inicial)
- Pero solo has pagado $100,000
- ¿Lo cuenta como $266,000 o como $100,000?

Según el código (línea 555-556):
```typescript
const paidAmount = cert.initialPrice - cert.remainingPayment;
citrusPatrimony += paidAmount;
```
Solo cuenta lo pagado. ✓ Correcto

### Teoría: Efectivo Líquido Acumulado

¿Está sumando `liquidCashForReinvestment` al patrimonio?

Buscar en código...

## Acción Requerida

1. **Agregar console.logs detallados** en `certificateEvolution.ts`:
   - Total de certificados
   - Precio por certificado
   - Patrimonio calculado
   - Efectivo líquido

2. **Verificar si hay contribuciones mensuales** configuradas en la imagen

3. **Ver el año 25 específico** para entender de dónde vienen los valores exactos
