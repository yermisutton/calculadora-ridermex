# Integración: Calculadora de Rendimiento RiderMex

## Cambios Realizados

### 1. Agregar Componente al HomePage
**Archivo**: `src/components/HomePage.tsx`

#### Cambio 1: Import Lazy
```typescript
const RiderMexPerformanceCalculator = lazy(() => import('./RiderMexPerformanceCalculator'));
```

#### Cambio 2: Agregar Tipo al Estado
Se agregó `'ridermex-performance'` al type union de `selectedCalculator` (línea 51)

#### Cambio 3: Validar en sessionStorage
Se agregó `'ridermex-performance'` a la lista de `validCalculators` (línea 53)

#### Cambio 4: Condicional de Renderizado
```typescript
if (selectedCalculator === 'ridermex-performance') {
  window.scrollTo(0, 0);
  return (
    <Suspense fallback={<CalculatorLoading />}>
      <RiderMexPerformanceCalculator onBack={() => setSelectedCalculator('home')} />
    </Suspense>
  );
}
```

#### Cambio 5: Item en Grid de Calculadores
```typescript
{
  id: 'ridermex-performance',
  name: 'RiderMex Rendimiento',
  description: 'Calculadora de rendimiento profesional RiderMex',
  icon: <Bike className="w-6 h-6" />,
  features: ['Modelo completo', '10 agencias', 'Escenarios avanzados', 'Gráficos interactivos'],
  action: () => setSelectedCalculator('ridermex-performance'),
},
```

## Ubicación en Home
- **Sección**: Calculadoras (Herramientas de Cálculo Directo)
- **Posición**: Último item en el grid (después de Unit Economics)
- **Icono**: Bike (moto)
- **Color**: Asignado automáticamente por el sistema de colorMapping

## Cómo Funciona
1. El usuario hace clic en la tarjeta "RiderMex Rendimiento" desde el home
2. Se actualiza el estado `selectedCalculator` a `'ridermex-performance'`
3. Se guarda en `sessionStorage` para persistencia
4. Se renderiza el componente `RiderMexPerformanceCalculator` con lazy loading
5. El botón "Volver" regresa al home

## URL Directa
Además del acceso desde el home, puede accederse directamente en:
```
/calculadora/ridermex-rendimiento
```

## Archivo de Configuración de Rutas
**Ubicación**: `src/App.tsx` (línea 67)

```typescript
<Route path="/calculadora/ridermex-rendimiento" element={<RiderMexPerformanceCalculator onBack={() => window.history.back()} />} />
```

## Estructura de Componentes Relacionados
```
src/
├── components/
│   ├── HomePage.tsx (actualizado)
│   ├── RiderMexPerformanceCalculator.tsx (nuevo)
│   └── ridermexComponents/
│       ├── RiderMexKPIs.tsx
│       ├── RiderMexAgencyTable.tsx
│       ├── RiderMexCharts.tsx
│       └── RiderMexExplanation.tsx
└── utils/
    └── ridermexCalculations.ts
```

## Status de Integración
✅ Componente principal creado
✅ Componentes auxiliares creados
✅ Cálculos financieros implementados
✅ Rutas configuradas en App.tsx
✅ Integración en HomePage completada
✅ Build sin errores
✅ Visible en el grid de home

## Próximos Pasos (Opcionales)
- Agregar landing page dedicada para RiderMex Performance
- Implementar exportación de reportes a PDF
- Agregar persistencia de escenarios guardados
- Integración con base de datos para histórico de simulaciones
