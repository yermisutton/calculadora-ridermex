# Notas Importantes - Actualizadas para RiderMex

## Resumen de Cambios

Se han actualizado las "Notas Importantes" en la tabla de evolución de certificados para reflejar las reglas específicas de RiderMex, incluyendo el descuento del 2% por año de compra.

## Cambios Implementados

### 1. Tooltips Interactivos en Certificados

Cada certificado en la tabla ahora muestra un tooltip detallado al pasar el mouse que incluye:

- **Año de Compra**: Identifica cuándo se adquirió el certificado
- **Estado Actual**: En Pago / En Maduración / Iniciando / Produciendo
- **Saldo Pendiente**: Si aún está en proceso de pago
- **Rendimiento Anual Detallado**:
  - Base (100%): Rendimiento sin descuento
  - Descuento (X%): Porcentaje descontado por año de compra
  - Rendimiento (Y%): Rendimiento efectivo después del descuento
  - Con Crecimiento 5%: Rendimiento final si ya está produciendo

### 2. Notas Importantes Específicas de RiderMex

Las "Notas Importantes" ahora muestran información diferente dependiendo del tipo de calculadora:

#### Para RiderMex:

1. **Periodo de Maduración**: 18 meses (12 meses construcción + 6 meses aclientado). Primera utilidad en el mes 19.

2. **Pagos Trimestrales**: $3,500 MXN por ticket cada trimestre. Rendimiento anual: $14,000 MXN por ticket (escenario moderado).

3. **Apreciación del Ticket**: 50% el primer año, luego 5% anual compuesto a partir del año 2.

4. **Descuento por Año de Compra**: Los tickets adquiridos después del año 1 tienen un descuento del 2% en su rendimiento anual por cada año de diferencia. Incentiva la inversión temprana.

5. **Crecimiento de Rendimiento**: Los rendimientos de tickets en producción crecen un 5% anual compuesto. Los tickets del año 1 mantienen 100% del rendimiento base.

6. **Reinversión**: Información sobre si la reinversión está activa o inactiva.

7. **Retiros Parciales**: Si aplica, muestra el porcentaje de retiros.

8. **Moneda**: Todos los valores expresados en la moneda seleccionada.

#### Para Calculadoras Tradicionales (Limón):

Mantiene las notas originales:
- Periodo de maduración de 5-6 años
- Apreciación durante los primeros 5 años
- Incremento del precio del limón
- Cálculo de utilidad basado en kg/ha
- Información sobre reinversión y boost de pagos

## Ejemplos de Tooltips

### Certificado Año 1 (Sin Descuento)
```
Certificado #1
──────────────────
Año de Compra: Año 1
Estado: Produciendo
──────────────────
Rendimiento Anual:
Base (100%): $14,000 MXN
```

### Certificado Año 3 (4% Descuento)
```
Certificado #8
──────────────────
Año de Compra: Año 3
Estado: Produciendo
──────────────────
Rendimiento Anual:
Base (100%): $14,000 MXN
Descuento (4%): -$560 MXN
Rendimiento (96%): $13,440 MXN
──────────────────
Con Crecimiento 5%: $14,112 MXN
(Si ya está produciendo hace 1 año)
```

### Certificado Año 5 (8% Descuento)
```
Certificado #15
──────────────────
Año de Compra: Año 5
Estado: Produciendo
──────────────────
Rendimiento Anual:
Base (100%): $14,000 MXN
Descuento (8%): -$1,120 MXN
Rendimiento (92%): $12,880 MXN
──────────────────
Con Crecimiento 5%: $13,524 MXN
(Si ya está produciendo hace 1 año)
```

## Tabla de Referencia Rápida - Escenario Moderado

| Año Compra | Descuento | Multiplicador | Rendimiento Base | Rendimiento con 1 Año Produciendo |
|-----------|-----------|--------------|------------------|-----------------------------------|
| Año 1     | 0%        | 100%         | $14,000          | $14,700 (5% crecimiento)         |
| Año 2     | 2%        | 98%          | $13,720          | $14,406                          |
| Año 3     | 4%        | 96%          | $13,440          | $14,112                          |
| Año 4     | 6%        | 94%          | $13,160          | $13,818                          |
| Año 5     | 8%        | 92%          | $12,880          | $13,524                          |
| Año 6     | 10%       | 90%          | $12,600          | $13,230                          |
| Año 7     | 12%       | 88%          | $12,320          | $12,936                          |
| Año 10    | 18%       | 82%          | $11,480          | $12,054                          |

## Archivos Modificados

1. **src/data/languages.ts**
   - Agregadas propiedades opcionales: `yieldDiscount`, `yieldGrowth`, `ridermexPayment`
   - Actualizados contenidos en español, inglés y francés

2. **src/components/ExcelTableV5.tsx**
   - Agregada función `calculateCertificateYield` para calcular descuentos
   - Tooltips interactivos mejorados con información detallada de rendimiento
   - Sección de "Notas Importantes" diferenciada por tipo de calculadora (RiderMex vs Tradicional)
   - Importación de `RIDERMEX_CONFIG` para valores de configuración

3. **YIELD_DISCOUNT_EXPLANATION.md**
   - Agregada sección de verificación en la interfaz
   - Documentación de tooltips y códigos de color

4. **CERTIFICATE_TOOLTIP_GUIDE.md**
   - Nueva guía completa de uso de tooltips
   - Ejemplos de verificación
   - Tablas de referencia rápida
   - Preguntas frecuentes

## Cómo Verificar

1. Ejecuta cualquier calculadora RiderMex
2. Navega hasta la tabla de evolución de certificados
3. Pasa el mouse sobre cualquier certificado (cajitas numeradas)
4. Verifica que el tooltip muestra:
   - Año de compra correcto
   - Descuento aplicado según el año
   - Rendimiento base y efectivo
   - Crecimiento del 5% si está produciendo
5. Desplázate hasta "Notas Importantes"
6. Verifica que muestra las notas específicas de RiderMex

## Ventajas de esta Implementación

1. **Transparencia Total**: Los inversionistas pueden ver exactamente cómo se calcula el rendimiento de cada certificado

2. **Educación en Tiempo Real**: Los tooltips educan al usuario sobre el sistema de descuentos sin necesidad de leer documentación externa

3. **Verificación Fácil**: Permite validar rápidamente que todos los certificados del mismo año tienen el mismo rendimiento

4. **Incentivo Visual**: El descuento progresivo es visible, incentivando la inversión temprana

5. **Multiidioma**: Toda la información está disponible en español, inglés y francés

## Próximos Pasos

Para futuras mejoras:
- Agregar gráficos de comparación de rendimientos por año de compra
- Incluir calculadora de "momento óptimo de compra"
- Mostrar proyección de rendimiento total considerando el mix de certificados por año
