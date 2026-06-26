# Mapeo Completo de Calculadoras y Corrección de Límites

## Problema Identificado

**El error estaba en los límites de adquisición de certificados.**

### Lógica INCORRECTA (antes):
```typescript
// Años 5-10: Compra 1 certificado POR AÑO
// Años 11-15: Compra 2 certificados POR AÑO
// Años 16-20: Compra 4 certificados POR AÑO
// Años 21-25: Compra 8 certificados POR AÑO

// TOTAL POSIBLE: 1 + (6×1) + (5×2) + (5×4) + (5×8) = 77 certificados
// TOTAL REAL: ~22 certificados (limitado por fondos)
```

### Lógica CORRECTA (después):
```typescript
// Años 5-10: Máximo 2 certificados TOTALES (1 inicial + 1 reinversión)
// Años 11-15: Máximo 4 certificados TOTALES (1 inicial + 3 reinversión)
// Años 16-20: Máximo 8 certificados TOTALES (1 inicial + 7 reinversión)
// Años 21-25: Máximo 16 certificados TOTALES (1 inicial + 15 reinversión)

// TOTAL MÁXIMO: 16 certificados (mucho más razonable)
```

## Resultado Esperado

Con esta corrección:
- **ICT:** $468,759 (1 certificado, sin reinversión)
- **ICM:** $5,600,000 aprox (12 certificados promedio)
- **Multiplicador:** ~12x (en vez de 21x)

Los números ahora son más conservadores y realistas.
