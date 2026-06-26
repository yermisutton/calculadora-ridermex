# Calculadora Unit Economics - Guía de Usuario

## Descripción General

La calculadora de Unit Economics es una herramienta interactiva diseñada para mostrar con transparencia total cómo funciona el modelo de negocio de motos RiderMex. Permite a los inversionistas potenciales entender exactamente cómo se generan los rendimientos.

## Características Principales

### 1. Selector de Escalones de Inversión
- **10 escalones disponibles**: Desde "Fundador" ($68,500) hasta "Institucional" ($77,500)
- **Precio de entrada escalonado**: Cada escalón tiene un precio $1,000 MXN mayor que el anterior
- **ROI variable**: A menor precio de entrada (escalón más bajo), mayor ROI porcentual
- Los escalones determinan automáticamente el capital invertido

**Escalones:**
1. Fundador - $68,500 (ROI más alto)
2. Preferente - $69,500
3. Semilla - $70,500
4. Activación - $71,500
5. Tracción - $72,500
6. Escala - $73,500
7. Dominio - $74,500
8. Elite - $75,500
9. Legacy - $76,500
10. Institucional - $77,500 (ROI más bajo)

### 2. Escenarios de Negocio

Tres escenarios basados en volumen de ventas:

- **Conservador**: 500 motos/año → $11,667 retorno anual por ticket
- **Moderado**: 600 motos/año → $14,000 retorno anual por ticket (por defecto)
- **Optimista**: 700 motos/año → $16,333 retorno anual por ticket

### 3. Parámetros del Modelo

#### Parámetros Ajustables:
- **Ventas Anuales de Motos**: 100 - 1,000 motos/año (predeterminado: 600)
  - Control completo con slider y botones +/-
  - Botones rápidos para escenarios: Conservador (500), Moderado (600), Optimista (700)
  - Muestra promedio mensual de ventas
  - Este valor afecta directamente las utilidades totales del negocio

- **Utilidad por Moto**: $300 - $2,000 MXN (predeterminado: $700)
  - Ajustable mediante slider interactivo
  - Representa la ganancia neta después de costos por cada moto vendida

- **Cantidad de Tickets**: 1 - 50 tickets (predeterminado: 1)
  - Controla cuántos tickets deseas comprar
  - Cada ticket tiene el precio del escalón seleccionado
  - La inversión total se multiplica por la cantidad de tickets

- **Reinversión Automática**: ON / OFF (predeterminado: OFF)
  - **ON**: Las ganancias anuales se reinvierten automáticamente comprando nuevos tickets
  - **OFF**: Las ganancias se retiran cada año sin reinvertir

- **Años de Proyección**: 1 - 30 años (predeterminado: 5)
  - Define el horizonte temporal de la proyección
  - Permite visualizar el crecimiento a largo plazo con o sin reinversión

#### Parámetros Fijos:
- **Número de Inversionistas por Tienda**: 30 personas (fijo)
  - Modelo estándar de 30 tickets por tienda
  - No es ajustable - es parte del modelo de negocio

### 4. Resultados en Tiempo Real

La calculadora muestra instantáneamente:

#### Métricas Principales:
- **ROI Anual**: Porcentaje de retorno sobre inversión
- **Ganancia Anual**: Total de ganancias esperadas (multiplicado por cantidad de tickets)
- **ROI Mensual**: Rendimiento mensual
- **Ganancia Diaria**: Ingreso pasivo diario
- **Capital Total**: Inversión total = precio por ticket × cantidad de tickets

#### Desglose Matemático en 3 Pasos:
1. **Ventas Totales Anuales**: Motos × Utilidad por moto
2. **División Entre Inversionistas**: Total ÷ 30 inversionistas
3. **Tu ROI**: (Ganancia por ticket ÷ Capital por ticket) × 100

#### Análisis Detallado:
- **Volumen de Ventas**: Desglose mensual, diario y anual
- **Utilidad por Moto**: Información sobre ganancia neta por unidad
- **Número de Inversionistas**: Fijo en 30 (modelo estándar)
- **Tu Participación**: Capital invertido y multiplicador de ganancias

#### Proyección Multianual:
- **Gráfico de Crecimiento**: Visualización del capital y ganancias acumuladas
- **Tabla Detallada**: Año por año con tickets, ganancias y capital
- **Con Reinversión**: Muestra cómo crecen los tickets automáticamente
- **Sin Reinversión**: Muestra las ganancias retiradas anualmente

## Fórmulas de Cálculo

### ROI (Return on Investment)
```
ROI por Ticket = (Utilidad por Ticket / Capital por Ticket) × 100
```

### Utilidad Total Anual
```
Utilidad Total = Motos Vendidas Anual × Utilidad por Moto
```

### Utilidad por Ticket
```
Utilidad por Ticket = Utilidad Total / 30 inversionistas (fijo)
```

### Tu Ganancia Total
```
Tu Ganancia = Utilidad por Ticket × Cantidad de Tickets
```

### Proyección Multianual Completa

#### Factores de Crecimiento:
```
INFLACION_ANUAL = 4.5%
INCREMENTO_SOBRE_INFLACION = 2%
APRECIACION_TICKET = 6.5% (4.5% + 2%)
```

#### Fórmulas por Año:
```
Variables Acumulativas:
  - Capital Inicial: Inversión original (constante)
  - Capital de Reinversión: Capital invertido comprando nuevos tickets
  - Tickets Iniciales: Tickets comprados originalmente (constante)
  - Tickets de Reinversión: Tickets adquiridos con utilidades

Para cada año N:

  1. Utilidad por Ticket Creciente:
     Utilidad Ticket[N] = Utilidad Base × (1 + 2%)^(N-1)

  2. Precio Ticket Creciente:
     Precio Ticket[N] = Precio Base × (1 + 6.5%)^(N-1)

  3. Ganancia Anual:
     Ganancia[N] = Tickets Acumulados × Utilidad Ticket[N]

  4. Plusvalía de Tickets:
     Plusvalía Inicial[N] = Capital Inicial × (1 + 6.5%)^N
     Plusvalía Reinversión[N] = Capital Reinversión × (1 + 6.5%)^(N-1)
     Plusvalía Total[N] = Plusvalía Inicial[N] + Plusvalía Reinversión[N]

  5a. Con Reinversión:
     Tickets Nuevos = floor(Ganancia[N] / Precio Ticket[N])

     Si Tickets Nuevos > 0:
       Costo = Tickets Nuevos × Precio Ticket[N]
       Tickets Acumulados += Tickets Nuevos
       Tickets de Reinversión += Tickets Nuevos
       Capital de Reinversión += Costo
       Ganancia Retirable = Ganancia[N] - Costo

     Si Tickets Nuevos = 0:
       Ganancia Retirable = Ganancia[N]

  5b. Sin Reinversión:
     Ganancia Retirable = Ganancia[N]

  6. Capital Total Acumulado:
     Capital Total[N] = Capital Inicial + Capital de Reinversión

  7. Patrimonio Total:
     Patrimonio[N] = Plusvalía Total[N] + Suma(Ganancias Retirables[1..N])
```

#### Nota Importante sobre Acumulación de Capital:
La reinversión acumula correctamente:
- Cada ticket nuevo comprado incrementa el **Capital de Reinversión**
- Los tickets nuevos se suman a **Tickets de Reinversión**
- La plusvalía se calcula sobre TODO el capital invertido (inicial + reinversión)
- Los tickets de reinversión generan utilidades desde el año siguiente

## Ejemplos de Uso

### Ejemplo 1: Inversión Simple (1 Ticket)
- **Escalón**: 1 - Fundador ($68,500)
- **Escenario**: Moderado (600 motos/año)
- **Utilidad por moto**: $700
- **Cantidad de Tickets**: 1
- **Reinversión**: OFF

#### Cálculo:
1. Ventas totales: 600 × $700 = $420,000
2. Por ticket: $420,000 ÷ 30 = $14,000
3. Tu ganancia: $14,000 × 1 ticket = $14,000
4. ROI: ($14,000 ÷ $68,500) × 100 = 20.44%

#### Resultados:
- **Capital Invertido**: $68,500 MXN
- **ROI Anual**: 20.44%
- **Ganancia Anual**: $14,000 MXN
- **Ganancia Mensual**: $1,166 MXN
- **Ganancia Diaria**: $38 MXN

### Ejemplo 2: Inversión Múltiple (5 Tickets, Sin Reinversión)
- **Escalón**: 1 - Fundador ($68,500)
- **Escenario**: Moderado (600 motos/año)
- **Utilidad por moto**: $700
- **Cantidad de Tickets**: 5
- **Reinversión**: OFF
- **Años**: 5

#### Resultados:
- **Capital Total Invertido**: $342,500 MXN (5 × $68,500)
- **ROI Anual**: 20.44% (por ticket)
- **Ganancia Anual**: $70,000 MXN (5 × $14,000)
- **Ganancias 5 años**: $350,000 MXN

### Ejemplo 3: Inversión con Reinversión (2 Tickets, 5 Años)
- **Escalón**: 1 - Fundador ($68,500)
- **Escenario**: Moderado (600 motos/año)
- **Utilidad por moto**: $700
- **Cantidad de Tickets Iniciales**: 2
- **Reinversión**: ON
- **Años**: 5

#### Proyección:
- **Año 1**: 2 tickets → Ganancia $28,000 → Compra 0 tickets (no alcanza)
- **Año 2**: 2 tickets → Ganancia $28,000 → Acumulado $56,000 → No retira
- **Año 3**: 2 tickets → Ganancia $28,000 → Acumulado $84,000 → Compra 1 ticket
- **Año 4**: 3 tickets → Ganancia $42,000 → Compra 0 tickets
- **Año 5**: 3 tickets → Ganancia $42,000 → **Retira** $42,000

#### Resultados Finales:
- **Capital Inicial**: $137,000 (2 tickets)
- **Tickets Finales**: 3 tickets
- **Capital Final**: $205,500 (3 tickets)
- **Ganancias Año 5**: $42,000 MXN

## URLs de Acceso

- **Calculadora Directa**: `/calculadora/unit-economics`
- **Landing Page**: `/landing/unit-economics`

## Valores por Defecto

```javascript
{
  capitalInvertido: 68500,      // Escalón 1 - Fundador (por ticket)
  motosVendidasAnual: 600,      // Ventas anuales (ajustable 100-1000)
  utilidadPorMoto: 700,         // Utilidad por moto (ajustable 300-2000)
  escalon: 1,                   // Escalón Fundador
  scenario: 'moderate',         // Escenario Moderado (solo afecta selector rápido)
  numTickets: 1,                // 1 ticket (ajustable 1-50)
  reinvestmentEnabled: false,   // Sin reinversión
  projectionYears: 5            // 5 años de proyección (ajustable 1-30)
}

// Constantes del Modelo:
NUMERO_INVERSIONISTAS = 30      // Fijo - modelo estándar (30 tickets por tienda)
```

## Objetivo de la Herramienta

La calculadora busca generar **confianza a través de transparencia**:

1. **Claridad matemática**: Cada cálculo es visible y verificable
2. **Interactividad**: Ajusta parámetros y ve resultados instantáneos
3. **Educación**: Entiende cómo se genera cada peso de ganancia
4. **Comparación**: Evalúa diferentes escalones y escenarios

## Notas Importantes

- Los rendimientos mostrados son **estimados** basados en el modelo de negocio
- El escenario "Moderado" (600 motos/año) es el objetivo base del negocio, pero puedes ajustar manualmente el volumen de ventas según tus proyecciones
- A menor escalón, mayor ROI porcentual (mismo retorno absoluto, menor inversión)
- Los escalones se llenan secuencialmente (primero el 1, luego el 2, etc.)
- El **número de inversionistas está fijo en 30** - es parte del modelo de negocio estándar
- Los parámetros de **costo y precio de venta** no se muestran porque no afectan el cálculo del ROI (solo importa la utilidad neta por moto)
- La **proyección multianual con reinversión** muestra el poder del interés compuesto al comprar automáticamente nuevos tickets con las ganancias

## Integración con otras Calculadoras

Esta calculadora complementa:
- **Calculadora de Motos**: Análisis más detallado del producto
- **RiderMex Express**: Cálculo rápido de rendimientos
- **RiderMex Reinversión**: Proyecciones a largo plazo con reinversión

---

**Última actualización**: Febrero 2026
