# URLs Directas de Calculadoras

Cada calculadora ahora tiene su propia URL que puede ser compartida directamente con inversores. Los inversores pueden acceder a cualquier calculadora sin pasar por la página de inicio.

## URLs Disponibles

### Calculadoras Cosecha Capital

| Calculadora | URL | Descripción |
|------------|-----|-------------|
| Calculadora Completa | `/calculadora/completa` | Calculadora de reinversión con todos los pasos |
| Calculadora Simplificada | `/calculadora/simplificada` | Versión simplificada con menos pasos |
| Calculadora Express | `/calculadora/express` | Calculadora rápida para resultados inmediatos |
| Interés Compuesto Multiplicador (ICM) | `/calculadora/icm` | Simulador del Interés Compuesto Multiplicador |
| Árbol Multiplicador | `/calculadora/arbol-multiplicador` | Visualización del crecimiento compuesto |
| Calculadora de Retiro | `/calculadora/retiro` | Planificación de retiro |
| Calculadora Segubeca | `/calculadora/segubeca` | Simulación Segubeca |
| Calculadora Vitaminada | `/calculadora/vitaminada` | Simulación Vitaminada |
| Simulador de Sueños | `/calculadora/simulador-suenos` | Simulador de objetivos y sueños |

### Calculadoras Ridermex

| Calculadora | URL | Descripción |
|------------|-----|-------------|
| Calculadora de Motocicletas | `/calculadora/motocicletas` | Inversión en motocicletas Ridermex |
| Ridermex - Reinversión | `/calculadora/ridermex-reinversion` | Cálculo de reinversión Ridermex |
| Ridermex - Express | `/calculadora/ridermex-express` | Versión rápida de Ridermex |

### Landing Pages Especializadas

| Landing Page | URL | Descripción |
|-------------|-----|-------------|
| Dream Simulator Landing | `/landing/simulador-suenos` | Landing page del simulador de sueños |
| ICM Landing | `/landing/icm` | Landing page del Interés Compuesto Multiplicador |
| Retirement Future Landing | `/landing/retiro` | Landing page de planificación de retiro |
| Segubeca Landing | `/landing/segubeca` | Landing page de educación asegurada |
| Vitaminada Landing | `/landing/vitaminada` | Landing page de ahorro potenciado |
| Ridermex Landing | `/landing/ridermex` | Landing page de reinversión Ridermex |
| RiderMex Homepage | `/ridermex` | Página principal de Ridermex con todas las calculadoras |

## Ejemplos de Uso

Para compartir una calculadora específica, simplemente envía el enlace completo con tu dominio. Por ejemplo:

```
https://tudominio.com/calculadora/icm
https://tudominio.com/calculadora/ridermex-express
https://tudominio.com/calculadora/retiro
```

## Características

- Cada calculadora es accesible de forma independiente
- Los botones "Atrás" llevan de vuelta a la página de inicio
- Las URLs son limpias y fáciles de compartir
- Ideales para campañas de marketing y presentaciones

## Para Desarrolladores

Las rutas están definidas en:
- `src/App.tsx` - Definición de rutas
- `src/utils/calculatorRoutes.ts` - Constantes de rutas disponibles
