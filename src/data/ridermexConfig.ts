export const RIDERMEX_CONFIG = {
  BASE_CALCULATION_PRICE: 100000,
  TICKET_PRICE: 100000,
  TICKET_PRICE_MODEL_C: 120000,
  TICKETS_PER_STORE: 30,

  PROFIT_PER_MOTORCYCLE: 900,
  MOTORCYCLES_PER_MONTH: 40,
  MOTORCYCLES_PER_YEAR: 480,
  ANNUAL_PROFIT_POOL: 432000,
  ANNUAL_RETURN_PER_TICKET: 14400,
  QUARTERLY_PAYMENT: 3600,

  MONTHLY_PAYMENT_FINANCING: 5000,
  DOWN_PAYMENT_MODEL_A: 10000,

  SCENARIOS: {
    conservative: {
      motorcyclesPerMonth: 30,
      motorcyclesPerYear: 360,
      annualProfitPool: 324000,
      annualReturnPerTicket: 10800
    },
    moderate: {
      motorcyclesPerMonth: 40,
      motorcyclesPerYear: 480,
      annualProfitPool: 432000,
      annualReturnPerTicket: 14400
    },
    optimistic: {
      motorcyclesPerMonth: 55,
      motorcyclesPerYear: 660,
      annualProfitPool: 594000,
      annualReturnPerTicket: 19800
    }
  },

  TARGET_ROI_MIN: 14,
  TARGET_ROI_MAX: 21,
  ESTIMATED_ROI: 14.40,

  TOTAL_ESCALONES: 7,
  TOTAL_TICKETS: 300,

  ANNUAL_APPRECIATION: 5,

  CONSTRUCTION_MONTHS: 12,
  ACLIENTADO_MONTHS: 6,
  FIRST_INCOME_CONTADO_MONTH: 7,
  FIRST_INCOME_CREDITO_MONTH: 19,

  INVENTORY_ROTATION_DAYS_MIN: 21,
  INVENTORY_ROTATION_DAYS_MAX: 30,
  CASH_COLLECTION_HOURS: 24,

  DEFAULT_YEARS: 25,

  INFLATION_RATE: 3.5,

  TRUSTS: {
    ASSETS: 'Fideicomiso de Activos y Contratos',
    OPERATIONS: 'Fideicomiso Operativo',
    COLLECTION: 'Fideicomiso de Cobro y Reparto'
  },

  BANK: 'Banco BX+ (Ve por Mas)',

  FINANCIAL_PARTNERS: ['Maxikash', 'Galgo', 'Atrato'],

  INSURANCE: {
    ASSETS: {
      name: 'Seguro de Cobertura Amplia',
      coverage: 'Inventario completo (piso y transito)'
    },
    PATRIMONIAL: {
      name: 'Seguro de Proteccion Patrimonial',
      description: 'Adquisicion de tickets adicionales en caso de fallecimiento',
      lockPeriod: 1
    }
  },

  COLORS: {
    PRIMARY: '#FF0000',
    SUCCESS: '#00FF00',
    SECURITY: '#00FFFF',
    GOLD: '#FFD700',
    GRAY: '#808080',
    DARK_BG: '#000000',
    DARK_CARD: '#1a1a1a'
  },

  TEXTS: {
    PRODUCT: 'motocicletas',
    ASSET: 'moto',
    BUSINESS: 'tienda RiderMex',
    INVESTOR: 'socio',
    RETURN: 'rendimiento trimestral estimado'
  }
};

export interface EscalonData {
  number: number;
  name: string;
  ticketStart: number;
  ticketEnd: number;
  ticketsInPhase: number;
  discount: number;
  entryPrice: number;
  roi: number;
  annualReturn: number;
  quarterlyReturn: number;
}

const ESCALONES_RAW: Omit<EscalonData, 'roi' | 'annualReturn' | 'quarterlyReturn'>[] = [
  { number: 1, name: 'Pioneros Rider', ticketStart: 1, ticketEnd: 40, ticketsInPhase: 40, discount: 30, entryPrice: 70000 },
  { number: 2, name: 'Inicio del Movimiento', ticketStart: 41, ticketEnd: 80, ticketsInPhase: 40, discount: 25, entryPrice: 75000 },
  { number: 3, name: 'Primera Aceleracion', ticketStart: 81, ticketEnd: 120, ticketsInPhase: 40, discount: 20, entryPrice: 80000 },
  { number: 4, name: 'Momentum Rider', ticketStart: 121, ticketEnd: 160, ticketsInPhase: 40, discount: 15, entryPrice: 85000 },
  { number: 5, name: 'Expansion Rider', ticketStart: 161, ticketEnd: 200, ticketsInPhase: 40, discount: 10, entryPrice: 90000 },
  { number: 6, name: 'Dominio del Camino', ticketStart: 201, ticketEnd: 240, ticketsInPhase: 40, discount: 5, entryPrice: 95000 },
  { number: 7, name: 'Potencia Rider', ticketStart: 241, ticketEnd: 300, ticketsInPhase: 60, discount: 0, entryPrice: 100000 },
];

export const ESCALONES: EscalonData[] = ESCALONES_RAW.map(e => ({
  ...e,
  annualReturn: RIDERMEX_CONFIG.ANNUAL_RETURN_PER_TICKET,
  quarterlyReturn: RIDERMEX_CONFIG.QUARTERLY_PAYMENT,
  roi: parseFloat(((RIDERMEX_CONFIG.ANNUAL_RETURN_PER_TICKET / e.entryPrice) * 100).toFixed(2))
}));

export const DISCOUNT_BY_ESCALON: Record<number, number> = {
  1: 30,
  2: 25,
  3: 20,
  4: 15,
  5: 10,
  6: 5,
  7: 0
};

export const getDiscountByEscalon = (escalon: number): number => {
  return DISCOUNT_BY_ESCALON[escalon] ?? 0;
};

export const getEscalonByNumber = (escalon: number): EscalonData => {
  const found = ESCALONES.find(e => e.number === escalon);
  return found || ESCALONES[0];
};

export const getEscalonROI = (escalon: number): number => {
  return getEscalonByNumber(escalon).roi;
};

export const getEscalonByTicketNumber = (ticketNumber: number): EscalonData => {
  const found = ESCALONES.find(e => ticketNumber >= e.ticketStart && ticketNumber <= e.ticketEnd);
  return found || ESCALONES[ESCALONES.length - 1];
};

export const getPriceForTicketNumber = (ticketNumber: number): number => {
  return getEscalonByTicketNumber(ticketNumber).entryPrice;
};

export const calculateEscalonPrice = (escalon: number): number => {
  return getEscalonByNumber(escalon).entryPrice;
};

export const calculateTicketAppreciation = (initialPrice: number, years: number): number => {
  const appreciationRate = RIDERMEX_CONFIG.ANNUAL_APPRECIATION / 100;
  return initialPrice * Math.pow(1 + appreciationRate, years);
};

export const calculateQuarterlyReturn = (_ticketPrice: number): number => {
  return RIDERMEX_CONFIG.ANNUAL_RETURN_PER_TICKET / 4;
};

export const calculateROI = (ticketPrice: number): number => {
  return (RIDERMEX_CONFIG.ANNUAL_RETURN_PER_TICKET / ticketPrice) * 100;
};

export const calculateTotalStores = (totalTickets: number): number => {
  return Math.floor(totalTickets / RIDERMEX_CONFIG.TICKETS_PER_STORE);
};

export const calculateMotorcyclesSold = (stores: number, years: number): number => {
  return stores * RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR * years;
};

export const getEscalonInfo = (currentTicketsSold: number) => {
  const currentEscalonData = getEscalonByTicketNumber(Math.max(1, currentTicketsSold));
  const currentEscalon = currentEscalonData.number;

  const nextEscalonNumber = Math.min(currentEscalon + 1, RIDERMEX_CONFIG.TOTAL_ESCALONES);
  const nextEscalonData = getEscalonByNumber(nextEscalonNumber);

  const ticketsUntilNextEscalon = currentEscalonData.ticketEnd - currentTicketsSold + 1;

  return {
    currentEscalon,
    nextEscalon: nextEscalonNumber,
    currentPrice: currentEscalonData.entryPrice,
    nextPrice: nextEscalonData.entryPrice,
    ticketsUntilNextEscalon: Math.max(0, ticketsUntilNextEscalon),
    isLastEscalon: currentEscalon >= RIDERMEX_CONFIG.TOTAL_ESCALONES
  };
};
