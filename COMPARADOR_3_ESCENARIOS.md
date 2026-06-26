# Comparador de 3 Escenarios de Inversión

## Vista General

Esta calculadora permite comparar a vista de águila tres estrategias diferentes de inversión para entender claramente las diferencias en el crecimiento de tu capital.

## URLs de Acceso

- **Landing Page**: `/landing/comparador-3-escenarios`
- **Calculadora**: `/calculadora/comparador-3-escenarios`

## Los 3 Escenarios

### 1. Interés Simple
**Fórmula**: `A = P + (P × r × n)`

- Crecimiento lineal y predecible
- Los intereses NO se reinvierten
- Los intereses se calculan siempre sobre el capital inicial
- Ideal para: CETES, bonos, inversiones conservadoras

**Ejemplo**: Si inviertes $100,000 al 5% anual:
- Año 1: $105,000 (+$5,000)
- Año 2: $110,000 (+$5,000)
- Año 3: $115,000 (+$5,000)

### 2. Interés Compuesto
**Fórmula**: `A = P(1 + r)^n`

- Crecimiento exponencial
- Los intereses SÍ se reinvierten en el MISMO activo
- Efecto bola de nieve: los intereses generan más intereses
- Un solo certificado/activo que crece exponencialmente

**Ejemplo**: Si inviertes $100,000 al 8% anual:
- Año 1: $108,000 (+$8,000)
- Año 2: $116,640 (+$8,640)
- Año 3: $125,971 (+$9,331)

### 3. Interés Compuesto Multiplicador
**Concepto**: Reinversión → Múltiples Activos Productivos

- Crecimiento exponencial ACELERADO
- Los intereses se reinvierten para COMPRAR MÁS ACTIVOS
- Múltiples certificados/activos trabajando en paralelo
- Cada activo crece exponencialmente de forma independiente
- Efecto avalancha: diversificación automática

**Diferencia clave**: No es solo un activo que crece, son VARIOS activos creciendo simultáneamente.

**Ejemplo**: Si inviertes $100,000 al 12% con 3 activos:
- Año 1: Compras 1 certificado → $112,000
- Año 2: Reinviertes y compras otro certificado → ambos crecen
- Año 3: Reinviertes y compras un tercer certificado → los 3 crecen
- El resultado es significativamente mayor porque tienes múltiples fuentes de rendimiento

## Funcionalidades

### Inputs Configurables
1. **Capital Inicial**: Cantidad a invertir
2. **Tasa Simple**: % anual para interés simple (inflación, CETES, etc.)
3. **Tasa Compuesto**: % anual para interés compuesto tradicional
4. **Tasa Multiplicador**: % anual para compuesto multiplicador
5. **Número de Activos**: Cuántos activos productivos trabajarán en paralelo
6. **Período**: Años de inversión

### Visualizaciones

1. **Gráfico de Áreas Comparativo**
   - Muestra visualmente las tres estrategias
   - Código de colores:
     - Ámbar: Interés Simple
     - Azul: Interés Compuesto
     - Verde: Compuesto Multiplicador

2. **Tarjetas de Resultados**
   - Valor final de cada estrategia
   - Ganancias totales
   - ROI (Retorno sobre inversión)
   - Diferencias entre estrategias

### Análisis Educativo

Cada escenario incluye:
- **Ventajas**: Beneficios de la estrategia
- **Desventajas**: Limitaciones y consideraciones
- Ayuda a tomar decisiones informadas

## Conclusión del Comparador

El comparador demuestra claramente que:

1. **Interés Simple** es predecible pero limitado
2. **Interés Compuesto** aprovecha el efecto bola de nieve
3. **Compuesto Multiplicador** maximiza el potencial al tener múltiples activos productivos

## Caso de Uso

Esta herramienta es ideal para:
- Asesores financieros que necesitan explicar diferentes estrategias
- Inversionistas que quieren entender el impacto de sus decisiones
- Presentaciones educativas sobre estrategias de inversión
- Comparar productos de inversión diferentes

## Tecnología

- Framework: React + TypeScript
- Visualización: Recharts (AreaChart)
- Estilo: Tailwind CSS
- Iconos: Lucide React
- Enrutamiento: React Router

## Notas Importantes

1. Esta es una herramienta **educativa e ilustrativa**
2. Los resultados no constituyen asesoría financiera
3. El modelo del Multiplicador asume reinversión disciplinada
4. Consultar con un asesor financiero profesional antes de invertir
