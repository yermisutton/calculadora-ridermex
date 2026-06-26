# 🚀 Referencia Rápida de Calculadoras

## 📊 RESUMEN VISUAL

```
┌─────────────────────────────────────────────────────────────────────────┐
│                  ✅ TODAS LAS CALCULADORAS FUNCIONALES                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. ReinvestmentCalculator.tsx        → "Calculadora Completa"         │
│     Key: full                         → 11 pasos, presentaciones       │
│     Size: 220 kB                      → La más completa                │
│                                                                         │
│  2. SimplifiedCalculator.tsx          → "Calculadora Simplificada"     │
│     Key: simplified                   → 7 pasos, videollamadas         │
│     Size: 59 kB                       → Balance perfecto               │
│                                                                         │
│  3. ExpressCalculator.tsx             → "Calculadora Express"          │
│     Key: express                      → 1 paso, exploración rápida     │
│     Size: 15 kB                       → Ultra ligera                   │
│                                                                         │
│  4. RetirementCalculator.tsx          → "Calculadora de Retiro"        │
│     Key: retirement                   → Compara AFORE/PPR/Cosecha      │
│     Size: 37 kB                       → Especializada retiro           │
│                                                                         │
│  5. MultiplierTreeCalculator.tsx      → "Calculadora Árbol"            │
│     Key: tree                         → Visualización ICM              │
│     Size: 15 kB                       → Educativa visual               │
│                                                                         │
│  6. ICMCalculator.tsx                 → "Calculadora ICM"              │
│     Key: icm                          → Enfoque en ICM                 │
│     Size: 16 kB                       → Concepto ICM                   │
│                                                                         │
│  7. SegubecaCalculator.tsx            → "Calculadora Segubeca"         │
│     Key: segubeca                     → Seguros becarios               │
│     Size: 30 kB                       → Seguros educativos             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                    ✅ TODAS LAS LANDING PAGES FUNCIONALES               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. ICMLandingPage.tsx                → "Landing ICM"                  │
│     Key: landing / icm-landing        → Lleva a ICMCalculator          │
│                                                                         │
│  2. SegubecaLandingPage.tsx           → "Landing Segubeca"             │
│     Key: segubeca-landing             → Lleva a SegubecaCalculator     │
│                                                                         │
│  3. RetirementLandingPage.tsx         → "Landing Fondo de Retiro"      │
│     Key: retirement-landing           → Lleva a RetirementCalculator   │
│     ⚠️  MISMO ESCENARIO que RetirementCalculator (Optimista)          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 🎯 REGLAS DE NOMENCLATURA

### ✅ CORRECTO
```javascript
// Al referirse a la calculadora de retiro COMPLETA:
"RetirementCalculator (Calculadora de Retiro)"

// Al referirse a la landing de retiro:
"RetirementLandingPage (Landing Fondo de Retiro)"

// Al hacer un cambio:
"Actualizando RetirementLandingPage.tsx para usar escenario Optimista"
```

### ❌ INCORRECTO
```javascript
// ❌ Ambiguo - ¿Cuál calculadora de retiro?
"Calculadora de retiro"

// ❌ Confuso - ¿Landing o Calculator?
"La calculadora completa"

// ❌ No especifica archivo
"Voy a cambiar los datos de calculadora de retiro"
```

## 🔗 RELACIÓN LANDING → CALCULATOR

```
RetirementLandingPage.tsx  ─┐
                             ├─→ Ambos usan:
RetirementCalculator.tsx   ─┘    - getDetailedCertificateEvolution()
                                 - Escenario Optimista (35000 kg/ha, 38 MXN/kg)
                                 - Tasa: 32.5%
```

## ⚡ ATAJO PARA TI

Cuando trabajes con cualquier calculadora, siempre especifica:

1. **Archivo exacto**: `RetirementLandingPage.tsx`
2. **Propósito**: "Landing page simplificada de retiro"
3. **Relación**: "Debe coincidir con RetirementCalculator.tsx"

## 📝 PLANTILLA DE COMUNICACIÓN

```
Calculadora: [NombreArchivo.tsx]
Tipo: [Landing / Calculator / Auxiliary]
Estado: [✅ Funcional / ⚠️ Deshabilitada]
Descripción: [Breve descripción]
Cambio solicitado: [Descripción del cambio]
```

---

**Ejemplo de uso:**
```
Calculadora: RetirementLandingPage.tsx
Tipo: Landing
Estado: ✅ Funcional
Descripción: Landing simplificada de fondo de retiro
Cambio solicitado: Sincronizar parámetros con RetirementCalculator.tsx
```
