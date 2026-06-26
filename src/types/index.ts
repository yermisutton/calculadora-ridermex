export interface Investment {
  initialCertificates: number;
  certificateBasePrice: number;
  initialPayment: number;
  years: number;
  annualProfit: number;
  increaseLemonPrice: boolean;
  lemonPriceIncrease: number;
  enableMarketGrowth: boolean;
  marketGrowthRate: number;
  usePresentValue: boolean;
  reinvestProfits: boolean;
  additionalContributions: boolean;
  monthlyContribution: number;
  currencyFormat: CurrencyFormat;
  exchangeRate: number;
  exchangeRateEUR: number;
  inflationRate: number;
  applyTaxes: boolean;
  taxRate: number;
  partialCashOut: boolean;
  cashOutPercentage: number;
  yearlyCashOutPercentages: number[];
  appreciationRate: number;
  cetesRate: number;
  savingsRate: number;
  realEstateRate: number;
  realEstateAppreciation: number;
  realEstateRent: number;
  ebitdaFactor: number;
  averageProductionPerHectare: number;
  averageSalePricePerKg: number;
  isLongTermCalculator: boolean;
  firstYearUtilityToUser: boolean;
  commissionRate: number;
  citrusReinvestment: boolean;
  citrusReinvestmentPercentages: number[];
  enablePaymentBoost: boolean;
  paymentBoostAmount?: number;
  paymentBoostGrowthRate: number;
  paymentBoostYears?: number;
  investorFactor: number;
  language?: Language;
  financingDownPaymentPercent?: number;
  financingAnnualInterestRate?: number;

  // New investor goals properties
  investorMonthlyGoal?: number;
  investorTimeframe?: number;
  investorAnnualReturn?: number;
  investorPriceAppreciation?: number;

  // RiderMex product type (A: Contado, B: Financed 12m, C: Mature Agency, D: Financed 48m)
  ridermexProductType?: 'A' | 'B' | 'C' | 'D';
  ridermexFirstMonthlyIncome?: number; // Month when first income starts
  ridermexDownPaymentAmount?: number;
  ridermexFinancingMonths?: number; // For financed models, months to pay remaining
  ridermexScenario?: 'conservative' | 'moderate' | 'optimistic'; // Business performance scenario
  ridermexEscalon?: number; // Escalon level
  ridermexEntryPrice?: number; // Price paid by investor
  ridermexDiscount?: number; // Manual discount selected by user

  // Payment calculator properties
  investorName: string;
  investorPhone: string;
  investorEmail: string;
  executiveName: string;
  executivePhone: string;
  executiveEmail: string;
  downPaymentPercentage: number;
  enableCustomPayments: boolean;
  customPaymentSchedule: Array<{ amount: number; date: string; description?: string }>;
  financingInterestRate: number;
  enableCustomDownPaymentSchedule: boolean;
  customDownPaymentSchedule: Array<{ id: string; amount: number; date: string; description?: string }>;
  downPaymentInstallments: number;
  customInvestmentRate: number;
  customInvestmentName: string;
}

export interface InvestmentResults {
  finalMonthlyIncome: number;
  finalPatrimony: number;
  capitalMultiplier: number;
  cagr: number;
  irr: number;
  paybackYear: number | null;
  certificatesSummary: {
    initialCertificates: number;
    fromReinvestment: number;
    totalCertificates: number;
  };
  passiveIncomeEfficiency: number;
  cetesPatrimony: number;
  savingsPatrimony: number;
  realEstatePatrimony: number;
  customInvestmentPatrimony: number;
  cetesMonthlyIncome: number;
  savingsMonthlyIncome: number;
  realEstateMonthlyIncome: number;
  customInvestmentMonthlyIncome: number;
  realFinalPatrimony: number;
  realCetesPatrimony: number;
  realSavingsPatrimony: number;
  realRealEstatePatrimony: number;
  realCustomInvestmentPatrimony: number;
  finalEbitdaValue: number;
  totalCashOut: number;
  calculatedAnnualProfitPercentage: number;
  firstYearUtility: number;
  priceDifferential: number;
  totalProfit: number;
  roi: number;
  yearlyData: Array<{
    year: number;
    citrusPatrimony: number;
    citrusIncome: number;
    certificatesFromReinvestment: number;
    totalCertificates: number;
    reinvestmentFund: number;
    availableCashFlow: number;
    partialCashOutAmount: number;
    yearlyReinvestmentContribution: number;
    cumulativeReinvestmentContribution: number;
    cumulativeTotalUtility: number;
    contributedCapital: number;
    cetesPatrimony: number;
    savingsPatrimony: number;
    realEstatePatrimony: number;
    customInvestmentPatrimony: number;
    cetesIncome: number;
    savingsIncome: number;
    realEstateIncome: number;
    customInvestmentIncome: number;
    cetesTaxes: number;
    savingsTaxes: number;
    realEstateTaxes: number;
    customInvestmentTaxes: number;
    realCitrusPatrimony: number;
    realCetesPatrimony: number;
    realSavingsPatrimony: number;
    realEstateRealPatrimony: number;
    realCustomInvestmentPatrimony: number;
    realCitrusIncome: number;
    realCetesIncome: number;
    realSavingsIncome: number;
    realEstateRealIncome: number;
    realCustomInvestmentIncome: number;
    ebitdaValue: number;
    cetesCashFlow: number;
    savingsCashFlow: number;
    realEstateCashFlow: number;
    customInvestmentCashFlow: number;
    yearCashOutPercentage: number;
  }>;
  certificateEvolution?: Array<{
    year: number;
    date: string;
    certificatePrice: number;
    certificates: any[];
    totalUtility: number;
    reinvestmentFund: number;
    availableForReinvestment: number;
    newCertificateIds: number[];
    reservedCertificateIds: number[];
    payments: { id: number; amount: number }[];
    totalCertificates: number;
    certificatesFromReinvestment: number;
    citrusPatrimony: number;
    citrusIncome: number;
    yearlyCashOutAmount: number;
    cumulativeCashOutAmount: number;
    yearlyReinvestmentContribution: number;
    cumulativeReinvestmentContribution: number;
    cumulativeTotalUtility: number;
    paymentBoostActive: boolean;
    paymentBoostAmount: number;
  }>;
}

export interface WhatIfScenarioParams {
  name: string;
  description: string;
  averageProductionPerHectare?: number;
  averageSalePricePerKg?: number;
  lemonPriceIncrease?: number;
  inflationRate?: number;
  cetesRate?: number;
  savingsRate?: number;
  realEstateAppreciation?: number;
  realEstateRent?: number;
  ebitdaFactor?: number;
}

export type ScenarioType = 'optimistic' | 'pessimistic' | 'crisis' | 'boom' | 'inflation';

export type ChartDisplayType = 'line' | 'bar' | 'area' | 'pie';

export type Language = 'es' | 'en' | 'fr';

export type CurrencyFormat = 'MXN' | 'USD' | 'EUR';

// Chart visibility interfaces
export interface ChartVisibilityControls {
  [key: string]: {
    visibility: any;
    toggle: (element: string) => void;
  };
}

export interface ChartVisibilityResetFunctions {
  [key: string]: () => void;
}