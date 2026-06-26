# Verificación de Sincronización: RetirementLandingPage ↔ RetirementCalculator

## 🎯 OBJETIVO
La landing page (RetirementLandingPage) debe usar la **MISMA lógica y parámetros** que la calculadora completa (RetirementCalculator) para garantizar coherencia en los resultados.

---

## ✅ PARÁMETROS SINCRONIZADOS

### 1. Escenario de Producción
| Parámetro | RetirementCalculator | RetirementLandingPage | Estado |
|-----------|---------------------|----------------------|--------|
| Escenario por defecto | `optimista` | Hardcodeado a Optimista | ✅ |
| Producción (kg/ha) | `35000` | `35000` | ✅ |
| Precio limón (MXN/kg) | `38` | `38` | ✅ |
| Rendimiento anual | `32.5%` | `32.5%` | ✅ |

### 2. Parámetros de Inversión
| Parámetro | RetirementCalculator | RetirementLandingPage | Estado |
|-----------|---------------------|----------------------|--------|
| Precio certificado | `266000` | `266000` | ✅ |
| Incremento limón (año 6+) | `5%` | `5%` | ✅ |
| Factor inversionista | `0.65` (65%) | `0.65` (65%) | ✅ |
| Hectárea por certificado | `0.1` | `0.1` | ✅ |
| Apreciación (años 1-5) | `12%` | `12%` | ✅ |

### 3. Lógica de Cálculo
| Aspecto | RetirementCalculator | RetirementLandingPage | Estado |
|---------|---------------------|----------------------|--------|
| Función de cálculo | `getDetailedCertificateEvolution()` | `getDetailedCertificateEvolution()` | ✅ |
| Reinversión | 100% automática | 100% automática | ✅ |
| Aportaciones mensuales | Soportadas | Soportadas | ✅ |

---

## 🔄 DIFERENCIAS INTENCIONALES (Simplificación)

### RetirementCalculator (Completa)
- 3 escenarios seleccionables (Conservador, Moderado, Optimista)
- Control completo de parámetros
- Animación año por año
- Tabla detallada de evolución
- Gráficos múltiples

### RetirementLandingPage (Simplificada)
- 1 escenario fijo (Optimista)
- Solo ajuste de edad y aportación mensual
- Vista comparativa rápida
- Enfoque en AFORE vs PPR vs Cosecha
- Llamado a acción a calculadora completa

---

## 🧪 PRUEBA DE VERIFICACIÓN

Para verificar que ambas generan los mismos resultados:

### Entrada de Prueba:
```
Edad actual: 35 años
Edad de retiro: 65 años
Años de inversión: 30 años
Aportación mensual: $5,000 MXN
```

### Resultados Esperados (Cosecha Capital):
```
Escenario: Optimista
Producción: 35,000 kg/ha
Precio: $38 MXN/kg
Rendimiento: 32.5% anual

Ambas calculadoras DEBEN mostrar:
- MISMO patrimonio final
- MISMA pensión mensual
- MISMO número de certificados
- MISMA evolución año por año
```

---

## 📝 CHECKLIST DE VERIFICACIÓN

- [x] Landing usa producción 35000 kg/ha (Optimista)
- [x] Landing usa precio $38 MXN/kg (Optimista)
- [x] Landing muestra tasa 32.5%
- [x] Landing usa getDetailedCertificateEvolution()
- [x] Landing usa mismos parámetros de reinversión
- [x] Landing usa mismo appreciationRate (12%)
- [x] Landing usa mismo lemonPriceIncrease (5%)
- [x] Build exitoso sin errores

---

## ⚠️ IMPORTANTE

**Cuando se cambie algún parámetro del escenario Optimista en RetirementCalculator, SE DEBE actualizar también en RetirementLandingPage.**

### Ubicación de Parámetros:

#### RetirementCalculator.tsx
```typescript
// Líneas 67-76
optimista: {
  name: 'Optimista',
  description: 'Escenario de alto rendimiento...',
  production: 35000,  // ⬅️ Aquí
  price: 38,          // ⬅️ Aquí
  annualReturn: 32.5, // ⬅️ Aquí
  color: '#10b981',
  icon: '🚀'
}
```

#### RetirementLandingPage.tsx
```typescript
// Líneas 33-39
const certificatePrice = 266000;
const averageProductionPerHectare = 35000; // ⬅️ Aquí
const averageSalePricePerKg = 38;          // ⬅️ Aquí
const lemonPriceIncrease = 5;
const investorFactor = 0.65;
const hectarePerCertificate = 0.1;
```

---

Última actualización: 2025-10-19
Estado: ✅ SINCRONIZADO
