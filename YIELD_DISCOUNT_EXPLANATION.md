# Descuento de Rendimiento del 2% por Año de Compra

## Regla de Rendimiento Decreciente

Los certificados adquiridos en diferentes años tienen un rendimiento que disminuye en **2% por cada año** diferente en que se compran.

## Cómo Funciona

### Fórmula de Descuento
```
Rendimiento = Rendimiento Base × (1 - (Año de Compra - 1) × 0.02)
```

### Ejemplos Prácticos

**Escenario Moderado** (Rendimiento base: $18,000/año por certificado)

| Año de Compra | Descuento Aplicado | Rendimiento Efectivo | Cálculo |
|---------------|-------------------|---------------------|---------|
| Año 1 | 0% | $18,000 | $18,000 × 100% |
| Año 2 | 2% | $17,640 | $18,000 × 98% |
| Año 3 | 4% | $17,280 | $18,000 × 96% |
| Año 4 | 6% | $16,920 | $18,000 × 94% |
| Año 5 | 8% | $16,560 | $18,000 × 92% |
| Año 7 | 12% | $15,840 | $18,000 × 88% |
| Año 10 | 18% | $14,760 | $18,000 × 82% |

## Caso de Uso Completo

### Ejemplo: Reinversión de Utilidades

**Año 1:**
- Apartas 5 certificados → Rinden **100%** ($18,000 c/u)
- Utilidad total: $90,000

**Año 3:**
- Con las utilidades apartas 3 certificados más → Rinden **96%** ($17,280 c/u)
- Los 5 certificados originales siguen rindiendo $18,000 c/u
- Si apartas 2 certificados más en el mismo año 3 → También rinden **96%**
- Utilidad total: (5 × $18,000) + (5 × $17,280) = $176,400

**Año 5:**
- Apartas 2 certificados más → Rinden **92%** ($16,560 c/u)
- Certificados año 1: 5 × $18,000 = $90,000
- Certificados año 3: 5 × $17,280 = $86,400
- Certificados año 5: 2 × $16,560 = $33,120
- Utilidad total: $209,520

## Puntos Clave

1. **El descuento se aplica por AÑO de compra**, no por certificado individual
2. **Todos los certificados comprados en el mismo año tienen el mismo rendimiento**
3. **Los certificados mantienen su rendimiento asignado** (no disminuye con el tiempo)
4. **El crecimiento del 5% anual se aplica DESPUÉS del descuento base**

## Implementación Técnica

### Código de Cálculo
```typescript
// Apply 2% discount per YEAR of purchase
const yearsFromFirstPurchase = cert.reservedYear - 1;
const discountPercentage = yearsFromFirstPurchase * 2; // 2% per year
const yieldMultiplier = Math.max(0, 1 - (discountPercentage / 100));
annualUtilityPerCertificate = annualUtilityPerCertificate * yieldMultiplier;
```

### Orden de Aplicación
1. **Base de Rendimiento** → Según escenario (conservador/moderado/optimista)
2. **Descuento por Año** → 2% × (Año de Reserva - 1)
3. **Crecimiento de Mercado** → 5% anual compuesto desde año de maduración

## Impacto en la Estrategia

### Ventaja de Compra Temprana
- Los primeros certificados son los más rentables
- Incentiva la inversión inicial fuerte
- Los certificados del año 1 mantienen su ventaja permanentemente

### Consideración para Reinversión
- Aunque el rendimiento disminuye, sigue siendo positivo
- El crecimiento compuesto del 5% anual compensa parcialmente
- La apreciación del capital (50% año 1, luego 5% anual) no se afecta

### Límite Teórico
- Con 2% de descuento por año, el rendimiento llega a 0% en el año 51
- En práctica, el límite de 300 certificados se alcanza mucho antes

## Validación

Para verificar el cálculo:
1. Revisar tabla de evolución año por año
2. Comparar utilidades de certificados por año de compra
3. Verificar que certificados del mismo año tienen igual rendimiento

## Verificación en la Interfaz

### Tooltip Interactivo en la Tabla Excel

Cada certificado en la tabla de evolución muestra un **tooltip detallado** al pasar el mouse:

**Información mostrada:**
- 📅 **Año de Compra**: Identifica cuándo se adquirió el certificado
- 🎯 **Estado Actual**: En Pago / En Maduración / Iniciando / Produciendo
- 💰 **Saldo Pendiente**: Si aún está en proceso de pago
- 📊 **Rendimiento Anual Detallado**:
  - **Base (100%)**: Rendimiento sin descuento según escenario
  - **Descuento (X%)**: Porcentaje y monto descontado por año de compra
  - **Rendimiento (Y%)**: Rendimiento efectivo después del descuento
  - **Con Crecimiento 5%**: Rendimiento final si ya está produciendo

### Ejemplo de Tooltip

**Certificado #3 comprado en Año 1:**
```
Certificado #3
─────────────────
Año de Compra: Año 1
Estado: Produciendo
─────────────────
Rendimiento Anual:
Base (100%): $18,000
─────────────────
```

**Certificado #8 comprado en Año 3:**
```
Certificado #8
─────────────────
Año de Compra: Año 3
Estado: Produciendo
─────────────────
Rendimiento Anual:
Base (100%): $18,000
Descuento (4%): -$720
Rendimiento (96%): $17,280
─────────────────
Con Crecimiento 5%: $18,144
(Si ya está produciendo hace 1 año)
```

### Códigos de Color de los Certificados

- 🔵 **Cian**: En proceso de pago (Reserved)
- ⚪ **Gris**: En período de maduración (Waiting)
- 🟡 **Amarillo**: Iniciando producción (Growing)
- 🟢 **Verde**: Generando utilidades (Producing)
