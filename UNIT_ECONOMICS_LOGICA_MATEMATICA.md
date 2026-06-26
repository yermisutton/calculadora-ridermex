# Lógica Matemática Completa: Unit Economics Calculator

## 📋 ÍNDICE
1. [Constantes del Sistema](#constantes-del-sistema)
2. [Métricas Básicas (Año 0)](#métricas-básicas-año-0)
3. [Proyección Multianual](#proyección-multianual)
4. [Sistema de Financiamiento](#sistema-de-financiamiento)
5. [Cálculo de Utilidades](#cálculo-de-utilidades)
6. [Cálculo de Plusvalía](#cálculo-de-plusvalía)
7. [Sistema de Reinversión](#sistema-de-reinversión)
8. [Sistema de Apartado y Pago](#sistema-de-apartado-y-pago)
9. [Cálculo de Patrimonio](#cálculo-de-patrimonio)
10. [Cálculo de ROI](#cálculo-de-roi)

---

## 1. CONSTANTES DEL SISTEMA

```typescript
const NUMERO_INVERSIONISTAS = 30;           // Tickets fijos por tienda
const MARKET_GROWTH_RATE = 5;               // 5% crecimiento anual utilidades
const CAPITAL_APPRECIATION_YEAR_1 = 1.50;   // 50% plusvalía año 1
const CAPITAL_APPRECIATION_ANNUAL = 1.05;   // 5% plusvalía anual (año 2+)
const YIELD_DISCOUNT_PER_YEAR = 2;          // 2% descuento rendimiento/año compra
const PURCHASE_PRICE_INCREASE = 1.05;       // 5% incremento anual precio tickets
const TICKETS_PER_ESCALON = 30;             // 30 tickets por escalón
const ESCALON_INCREMENT = 1000;             // $1,000 incremento por escalón
const MAX_CONCURRENT_PAYMENTS = 5;          // Máximo 5 tickets en pago simultáneo
```

---

## 2. MÉTRICAS BÁSICAS (AÑO 0)

### 2.1 Utilidad Total Anual
```typescript
utilidadTotalAnual = motosVendidasAnual × utilidadPorMoto
```
**Ejemplo:** 600 motos × $700 = $420,000

### 2.2 Utilidad por Ticket
```typescript
utilidadPorTicket = utilidadTotalAnual ÷ NUMERO_INVERSIONISTAS
```
**Ejemplo:** $420,000 ÷ 30 = $14,000 por ticket

### 2.3 Capital por Ticket
```typescript
capitalPorTicket = capitalInvertido  // Precio del escalón
```
**Ejemplo:** $68,500 (Escalón 1)

### 2.4 ROI Base
```typescript
roi = (utilidadPorTicket ÷ capitalPorTicket) × 100
```
**Ejemplo:** ($14,000 ÷ $68,500) × 100 = 20.44%

### 2.5 ROI Mensual
```typescript
roiMensual = roi ÷ 12
```
**Ejemplo:** 20.44% ÷ 12 = 1.70% mensual

### 2.6 Ganancias Mensuales
```typescript
gananciasMensual = utilidadPorInversionista ÷ 12
```

### 2.7 Multiplicador de Capital
```typescript
multiplicadorCapital = utilidadPorTicket ÷ capitalPorTicket
```
**Ejemplo:** $14,000 ÷ $68,500 = 0.2044x anual

---

## 3. PROYECCIÓN MULTIANUAL

### 3.1 Variables de Seguimiento
```typescript
let ticketsAcumulados = numTicketsIniciales;
let ticketsDeReinversion = 0;
let capitalInicial = numTicketsIniciales × capitalPorTicket;
let capitalDeReinversion = 0;
let gananciasRetiradasAcumuladas = 0;
let fondoAcumulado = 0; // Liquidez disponible

// Array para rastrear tickets por año de compra
const ticketsPorAno: {
  year: number;
  tickets: number;
  costoUnitario: number;
  escalonNumber: number;
}[] = [];

// Array para rastrear tickets APARTADOS (precio amarrado pero en pago)
const ticketsApartados: {
  yearApartado: number;
  precioAmarrado: number;
  montoPagado: number;
  montoPendiente: number;
}[] = [];
```

### 3.2 Inicialización Año 0
```typescript
ticketsPorAno.push({
  year: 0,
  tickets: numTicketsIniciales,
  costoUnitario: capitalPorTicket,
  escalonNumber: Math.floor((numTicketsIniciales - 1) / TICKETS_PER_ESCALON)
});
```

---

## 4. SISTEMA DE FINANCIAMIENTO

### 4.1 Mes de Inicio de Rendimientos
```typescript
// Contado (0 meses): mes 7 (liquidas hoy + 6 meses maduración)
// Plan 6 meses: mes 13 (6 pagos + 6 meses = mes 13)
// Plan 12 meses: mes 19 (12 pagos + 6 meses = mes 19)

const mesInicioRendimientos = financingMonths === 0 ? 7 : financingMonths + 7;
```

### 4.2 Meses con Utilidades en un Año
```typescript
const primerMesDelAno = (year - 1) × 12 + 1;
const ultimoMesDelAno = year × 12;

let mesesConUtilidades = 0;
if (mesInicioRendimientos <= ultimoMesDelAno) {
  const mesInicioEnEsteAno = Math.max(mesInicioRendimientos, primerMesDelAno);
  mesesConUtilidades = ultimoMesDelAno - mesInicioEnEsteAno + 1;
}
```

### 4.3 Ajuste de Ganancia Anual
```typescript
gananciaAnualAjustada = gananciaAnualOriginal × (mesesConUtilidades ÷ 12);
```

**Ejemplo: Plan 12 meses, Año 1**
- Mes inicio rendimientos: 19
- Primer mes del año 1: 1
- Último mes del año 1: 12
- Meses con utilidades: 0 (porque 19 > 12)
- **Ganancia ajustada: $0**

**Ejemplo: Plan 12 meses, Año 2**
- Mes inicio rendimientos: 19
- Primer mes del año 2: 13
- Último mes del año 2: 24
- Mes inicio en este año: max(19, 13) = 19
- Meses con utilidades: 24 - 19 + 1 = 6 meses
- **Ganancia ajustada: gananciaAnual × (6 ÷ 12) = 50%**

---

## 5. CÁLCULO DE UTILIDADES

### 5.1 Ganancia Anual por Grupo de Tickets
```typescript
let gananciaAnual = 0;

for (const grupo of ticketsPorAno) {
  // PASO 1: Aplicar descuento del 2% por cada AÑO desde compra inicial (año 0)
  const yearsFromFirstPurchase = grupo.year; // 0, 1, 2, 3...
  const discountPercentage = yearsFromFirstPurchase × YIELD_DISCOUNT_PER_YEAR;
  const yieldMultiplier = Math.max(0, 1 - (discountPercentage ÷ 100));

  // PASO 2: Calcular utilidad base con descuento
  let utilidadPorTicket = utilidadPorTicketBase × yieldMultiplier;

  // PASO 3: Aplicar market growth del 5% desde el año de compra
  const yearsOfGrowth = year - grupo.year;
  if (yearsOfGrowth > 0) {
    utilidadPorTicket = utilidadPorTicket × Math.pow(1 + MARKET_GROWTH_RATE / 100, yearsOfGrowth);
  }

  gananciaAnual += grupo.tickets × utilidadPorTicket;
}
```

### 5.2 Ejemplo de Descuento por Año de Compra

**Tickets comprados en año 0:**
- Año 1: 0% descuento → 100% rendimiento
- Año 2: 0% descuento → 100% × 1.05 (market growth) = 105%
- Año 3: 0% descuento → 100% × 1.05² = 110.25%

**Tickets comprados en año 1:**
- Año 1: 2% descuento → 98% rendimiento
- Año 2: 2% descuento → 98% × 1.05 = 102.9%
- Año 3: 2% descuento → 98% × 1.05² = 108.045%

**Tickets comprados en año 2:**
- Año 2: 4% descuento → 96% rendimiento
- Año 3: 4% descuento → 96% × 1.05 = 100.8%

---

## 6. CÁLCULO DE PLUSVALÍA

### 6.1 Precio de Compra de Nuevos Tickets
```typescript
// El precio incrementa 5% cada año respecto al año anterior
const precioTicketCompra = year === 1
  ? precioTicketBase
  : precioTicketBase × Math.pow(PURCHASE_PRICE_INCREASE, year - 1);
```

**Ejemplo:**
- Año 1: $68,500 (base)
- Año 2: $68,500 × 1.05¹ = $71,925
- Año 3: $68,500 × 1.05² = $75,521.25
- Año 10: $68,500 × 1.05⁹ = $106,229.72

### 6.2 Valor Actual de Tickets (Plusvalía)
```typescript
let plusvaliaTotalTickets = 0;
let capitalTotalInvertido = 0;

for (const grupo of ticketsPorAno) {
  const yearsHeld = year - grupo.year;
  let valorActualPorTicket: number;

  if (yearsHeld === 0) {
    // En el año de compra: 50% de apreciación inmediata
    valorActualPorTicket = grupo.costoUnitario × CAPITAL_APPRECIATION_YEAR_1;
  } else {
    // Años siguientes: 50% en año 1, luego 5% compuesto
    const yearOneValue = grupo.costoUnitario × CAPITAL_APPRECIATION_YEAR_1;
    valorActualPorTicket = yearOneValue × Math.pow(CAPITAL_APPRECIATION_ANNUAL, yearsHeld);
  }

  plusvaliaTotalTickets += grupo.tickets × valorActualPorTicket;
  capitalTotalInvertido += grupo.tickets × grupo.costoUnitario;
}
```

### 6.3 Ejemplo de Plusvalía

**Ticket comprado en año 0 por $68,500:**
- Año 0: $68,500 × 1.50 = $102,750
- Año 1: $102,750 × 1.05 = $107,887.50
- Año 2: $107,887.50 × 1.05 = $113,281.88
- Año 10: $68,500 × 1.50 × 1.05¹⁰ = $167,410.31

**Ticket comprado en año 2 por $75,521.25:**
- Año 2: $75,521.25 × 1.50 = $113,281.88
- Año 3: $113,281.88 × 1.05 = $118,945.97
- Año 10: $75,521.25 × 1.50 × 1.05⁸ = $166,993.88

---

## 7. SISTEMA DE REINVERSIÓN

### 7.1 Flujo Mes a Mes

```typescript
const gananciaMensual = gananciaAnualOriginal / 12;

for (let mes = 1; mes <= 12; mes++) {
  const mesAbsoluto = (year - 1) × 12 + mes;

  // Solo se generan utilidades después del mes de inicio de rendimientos
  if (mesAbsoluto >= mesInicioRendimientos) {
    fondoAcumulado += gananciaMensual;

    // PASO 1: Pagar tickets apartados
    // (Ver sección 8)

    // PASO 2: Si fondo restante y espacio disponible, apartar nuevo ticket
    if (ticketsApartados.length < MAX_CONCURRENT_PAYMENTS) {
      ticketsApartados.push({
        yearApartado: year,
        precioAmarrado: precioTicketCompra,
        montoPagado: 0,
        montoPendiente: precioTicketCompra
      });
    }
  }
}
```

### 7.2 Retiros Parciales (Cash Out)
```typescript
// Al final del año, si hay retiros habilitados
if (partialCashOut && yearlyCashOutPercentages[year - 1] > 0) {
  const porcentajeRetiro = yearlyCashOutPercentages[year - 1] / 100;
  montoRetirado = gananciaAnual × porcentajeRetiro;
  fondoAcumulado -= montoRetirado;
  gananciasRetiradasAcumuladas += montoRetirado;
}
```

---

## 8. SISTEMA DE APARTADO Y PAGO

### 8.1 Lógica de Pago de Tickets Apartados

```typescript
let fondoRestante = fondoAcumulado;
let i = 0;

while (i < ticketsApartados.length && fondoRestante > 0) {
  const ticketApartado = ticketsApartados[i];

  if (fondoRestante >= ticketApartado.montoPendiente) {
    // CASO 1: Se completa el pago del ticket
    const pagoFinal = ticketApartado.montoPendiente;
    fondoRestante -= pagoFinal;
    costoTicketsComprados += pagoFinal;

    // El ticket ahora genera rendimientos
    ticketsAcumulados += 1;
    ticketsDeReinversion += 1;
    capitalDeReinversion += ticketApartado.precioAmarrado;

    // Registrar en ticketsPorAno
    const nuevoEscalon = Math.floor((ticketsAcumulados - 1) / TICKETS_PER_ESCALON);
    ticketsPorAno.push({
      year: year,
      tickets: 1,
      costoUnitario: ticketApartado.precioAmarrado,
      escalonNumber: nuevoEscalon
    });

    // Remover de apartados
    ticketsApartados.splice(i, 1);

    // IMPORTANTE: Apartar siguiente ticket si hay espacio
    if (ticketsApartados.length < MAX_CONCURRENT_PAYMENTS) {
      ticketsApartados.push({
        yearApartado: year,
        precioAmarrado: precioTicketCompra,
        montoPagado: 0,
        montoPendiente: precioTicketCompra
      });
    }
    // NO incrementar i (se removió elemento)

  } else {
    // CASO 2: Abono parcial (distribuir proporcionalmente)
    const totalPendiente = ticketsApartados.reduce((sum, t) => sum + t.montoPendiente, 0);
    const proporcionPago = ticketApartado.montoPendiente / totalPendiente;
    const abono = fondoRestante × proporcionPago;

    ticketApartado.montoPagado += abono;
    ticketApartado.montoPendiente -= abono;
    costoTicketsComprados += abono;
    fondoRestante -= abono;

    i++; // Avanzar al siguiente ticket
  }
}

fondoAcumulado = fondoRestante;
```

### 8.2 Valor de Tickets Apartados
```typescript
let valorTicketsApartados = 0;
for (const apartado of ticketsApartados) {
  valorTicketsApartados += apartado.montoPagado; // Solo lo pagado
}

// Este valor se incluye en gananciasRetiradasAcumuladas
gananciasRetiradasAcumuladas = fondoAcumulado + valorTicketsApartados;
```

---

## 9. CÁLCULO DE PATRIMONIO

### 9.1 Patrimonio Total
```typescript
const patrimonioTotal = plusvaliaTotalTickets + gananciasRetiradasAcumuladas;
```

**Componentes:**
- `plusvaliaTotalTickets`: Valor apreciado de todos los tickets completamente pagados
- `gananciasRetiradasAcumuladas`: Fondo líquido + valor pagado de tickets apartados

### 9.2 Capital Total Acumulado
```typescript
const capitalTotalAcumulado = capitalInicial + capitalDeReinversion;
```

---

## 10. CÁLCULO DE ROI

### 10.1 Retorno Total
```typescript
const valorActualTickets = plusvaliaTotalTickets;

const retornoTotal = reinvestmentEnabled
  ? (valorActualTickets - capitalTotalAcumulado)  // Durante reinversión: plusvalía
  : gananciasRetiradasAcumuladas;                  // Sin reinversión: ganancias acumuladas
```

### 10.2 ROI Porcentaje
```typescript
const roiPorcentaje = capitalTotalAcumulado > 0
  ? (retornoTotal / capitalTotalAcumulado) × 100
  : 0;
```

### 10.3 Recuperación de Inversión
```typescript
const recuperoInversion = retornoTotal >= capitalInicial;
```

### 10.4 Año de Recuperación
```typescript
const yearRecuperacion = proyeccionMultianual.find(y => y.recuperoInversion);
```

---

## 11. EJEMPLO COMPLETO: 1 TICKET, 10 AÑOS, PLAN 12 MESES

### Datos de Entrada
- Capital invertido: $68,500
- Número de tickets: 1
- Utilidad por ticket año 0: $14,000
- Plan financiamiento: 12 meses
- Reinversión: Habilitada
- Sin retiros parciales

### Año 1
- **Mes inicio rendimientos:** 19 (no hay utilidades este año)
- **Ganancia anual ajustada:** $0
- **Plusvalía:** $68,500 × 1.50 = $102,750
- **Tickets acumulados:** 1
- **Patrimonio:** $102,750 + $0 = $102,750

### Año 2
- **Meses con utilidades:** 6 (meses 19-24)
- **Ganancia anual original:** $14,000 × 1.05 = $14,700
- **Ganancia ajustada:** $14,700 × (6/12) = $7,350
- **Fondo acumulado:** $7,350
- **Precio ticket compra:** $68,500 × 1.05 = $71,925
- **Tickets apartados:** 1 (precio amarrado $71,925, pagado $7,350)
- **Plusvalía:** $68,500 × 1.50 × 1.05 = $107,887.50
- **Patrimonio:** $107,887.50 + $7,350 = $115,237.50

### Año 3
- **Ganancia anual:** $14,000 × 1.05² = $15,435
- **Fondo mes 1:** $7,350 + $1,286.25 = $8,636.25
- **Se completa pago ticket año 2:** Pago final $64,575, fondo restante = $0
- **Tickets acumulados:** 2 (1 inicial + 1 de reinversión)
- **Se aparta nuevo ticket:** Precio $75,521.25
- **Ganancia de 2 tickets resto del año:**
  - Ticket año 0: $14,000 × 1.05² = $15,435 (11 meses restantes)
  - Ticket año 2: $14,000 × 0.96 × 1.05 = $14,112 (desde mes 2, solo 11 meses)
- **Plusvalía ticket 1:** $68,500 × 1.50 × 1.05² = $113,281.88
- **Plusvalía ticket 2:** $71,925 × 1.50 = $107,887.50
- **Patrimonio:** $221,169.38 + fondoAcumulado

### Progresión Años 4-10
- Cada año se completan 1-2 tickets más
- Plusvalía continúa creciendo 5% anual
- Ganancias crecen por más tickets Y market growth
- Sistema de apartado mantiene máximo 5 tickets simultáneos

### Año 10
- **Tickets estimados:** ~15-20 tickets
- **Plusvalía total:** ~$2,500,000 - $3,000,000
- **ROI:** 2,500% - 3,000%
- **Ingreso mensual:** ~$30,000 - $40,000

---

## 12. DIFERENCIAS CLAVE VS OTRAS CALCULADORAS

### Unit Economics vs ICM/ReinvestmentCalculator

| Característica | Unit Economics | ICM/Reinvestment |
|----------------|----------------|------------------|
| **Enfoque** | Negocio (motos vendidas) | Inversión (certificados) |
| **Utilidad base** | Motos × Utilidad/moto | % fijo anual |
| **Reinversión** | Mes a mes con apartado | Anual o mensual |
| **Tickets simultáneos** | Máx 5 en pago | Sin límite |
| **Financiamiento** | 0, 6, 12 meses | Solo contado |
| **Precio amarrado** | Sí (al apartar) | No |
| **Descuento rendimiento** | Sí (2%/año compra) | Variable |

---

## 13. NOTAS IMPORTANTES

1. **Sistema de apartado:** Los tickets se "amarran" al precio actual pero se pagan mes a mes. Generan rendimientos SOLO cuando están 100% pagados.

2. **Máximo 5 simultáneos:** Evita dispersión de capital y acelera completar pagos.

3. **Descuento 2% por año:** Tickets comprados en años posteriores tienen 2% menos rendimiento base por cada año desde la inversión inicial.

4. **Market growth 5%:** Las utilidades crecen 5% anual independiente del año de compra.

5. **Plusvalía inmediata 50%:** En el año de compra, el ticket se aprecia 50%, luego 5% anual.

6. **Precio aumenta 5% anual:** Cada año cuesta 5% más comprar un ticket nuevo.

7. **Financiamiento afecta mes inicio:** Plan 12 meses comienza a generar en mes 19, no en mes 7.

8. **Patrimonio = Plusvalía + Liquidez:** Incluye valor apreciado de tickets + fondo disponible + valor pagado de tickets apartados.

---

## 14. FÓRMULAS RESUMEN

```typescript
// UTILIDAD POR GRUPO DE TICKETS
utilidadGrupo = tickets × utilidadBase × (1 - descuento%) × (1.05)^añosCrecimiento

// PRECIO COMPRA TICKET AÑO N
precioAñoN = precioBase × (1.05)^(N-1)

// PLUSVALÍA TICKET
valorAño0 = precioCompra × 1.50
valorAñoN = valorAño0 × (1.05)^N

// PATRIMONIO TOTAL
patrimonio = ΣplusvalíaTickets + fondoLíquido + valorTicketsApartados

// ROI
roi = (patrimonio - capitalTotal) / capitalTotal × 100
```

---

**Fecha de documentación:** 2026-02-28
**Versión:** 2.0.0
**Archivo fuente:** `/src/components/UnitEconomicsCalculator.tsx`
