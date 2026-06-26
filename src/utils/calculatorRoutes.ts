export const CALCULATOR_ROUTES = {
  HOME: '/',
  COMPLETA: '/calculadora/completa',
  SIMPLIFICADA: '/calculadora/simplificada',
  EXPRESS: '/calculadora/express',
  ARBOL_MULTIPLICADOR: '/calculadora/arbol-multiplicador',
  RETIRO: '/calculadora/retiro',
  ICM: '/calculadora/icm',
  SEGUBECA: '/calculadora/segubeca',
  VITAMINADA: '/calculadora/vitaminada',
  SIMULADOR_SUENOS: '/calculadora/simulador-suenos',
  MOTOCICLETAS: '/calculadora/motocicletas',
  RIDERMEX_REINVERSION: '/calculadora/ridermex-reinversion',
  RIDERMEX_EXPRESS: '/calculadora/ridermex-express',
  RIDERMEX_CORTA: '/calculadora/ridermex-corta',
  COMPARADOR_3_ESCENARIOS: '/calculadora/comparador-3-escenarios',
  MADRE: '/calculadora/madre',

  // Landing Pages
  LANDING_DREAM_SIMULATOR: '/landing/simulador-suenos',
  LANDING_ICM: '/landing/icm',
  LANDING_RETIRO: '/landing/retiro',
  LANDING_SEGUBECA: '/landing/segubeca',
  LANDING_VITAMINADA: '/landing/vitaminada',
  LANDING_RIDERMEX: '/landing/ridermex',
  LANDING_3_ESCENARIOS: '/landing/comparador-3-escenarios',
  RIDERMEX_HOME: '/ridermex',
} as const;

export type CalculatorRoute = typeof CALCULATOR_ROUTES[keyof typeof CALCULATOR_ROUTES];

export const CALCULATOR_NAMES: Record<CalculatorRoute, string> = {
  [CALCULATOR_ROUTES.HOME]: 'Inicio',
  [CALCULATOR_ROUTES.COMPLETA]: 'Calculadora Completa',
  [CALCULATOR_ROUTES.SIMPLIFICADA]: 'Calculadora Simplificada',
  [CALCULATOR_ROUTES.EXPRESS]: 'Calculadora Express',
  [CALCULATOR_ROUTES.ARBOL_MULTIPLICADOR]: 'Árbol Multiplicador',
  [CALCULATOR_ROUTES.RETIRO]: 'Calculadora de Retiro',
  [CALCULATOR_ROUTES.ICM]: 'Interés Compuesto Multiplicador',
  [CALCULATOR_ROUTES.SEGUBECA]: 'Calculadora Segubeca',
  [CALCULATOR_ROUTES.VITAMINADA]: 'Calculadora Vitaminada',
  [CALCULATOR_ROUTES.SIMULADOR_SUENOS]: 'Simulador de Sueños',
  [CALCULATOR_ROUTES.MOTOCICLETAS]: 'Calculadora de Motocicletas',
  [CALCULATOR_ROUTES.RIDERMEX_REINVERSION]: 'Ridermex - Reinversión',
  [CALCULATOR_ROUTES.RIDERMEX_EXPRESS]: 'Ridermex - Express',
  [CALCULATOR_ROUTES.RIDERMEX_CORTA]: 'Ridermex - Corta',
  [CALCULATOR_ROUTES.COMPARADOR_3_ESCENARIOS]: 'Comparador 3 Escenarios',
  [CALCULATOR_ROUTES.MADRE]: 'Calculadora Madre (Central)',

  // Landing Pages
  [CALCULATOR_ROUTES.LANDING_DREAM_SIMULATOR]: 'Dream Simulator Landing',
  [CALCULATOR_ROUTES.LANDING_ICM]: 'ICM Landing',
  [CALCULATOR_ROUTES.LANDING_RETIRO]: 'Retirement Future Landing',
  [CALCULATOR_ROUTES.LANDING_SEGUBECA]: 'Segubeca Landing',
  [CALCULATOR_ROUTES.LANDING_VITAMINADA]: 'Vitaminada Landing',
  [CALCULATOR_ROUTES.LANDING_RIDERMEX]: 'Ridermex Landing',
  [CALCULATOR_ROUTES.LANDING_3_ESCENARIOS]: 'Comparador 3 Escenarios Landing',
  [CALCULATOR_ROUTES.RIDERMEX_HOME]: 'RiderMex Homepage',
};
