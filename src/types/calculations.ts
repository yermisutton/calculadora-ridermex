import { Investment } from './index';

export interface ComparativeInvestmentResult {
  patrimony: number;
  income: number;
  taxes: number;
  cashFlow: number;
  realPatrimony: number;
  realIncome: number;
}

export interface CompoundGrowthParams {
  initialInvestment: number;
  rate: number;
  years: number;
  reinvestProfits: boolean;
  partialCashOut: boolean;
  cashOutPercentage: number;
  yearlyCashOutPercentages: number[];
}

export interface PerformanceMetrics {
  capitalMultiplier: number;
  cagr: number;
  irr: number;
  paybackYear: number | null;
  roi: number;
  totalProfit: number;
}

export interface InflationAdjustedValues {
  realPatrimony: number;
  realIncome: number;
  inflationFactor: number;
}

export interface IncomeProjection {
  monthlyIncome: number;
  annualIncome: number;
  cumulativeIncome: number;
}

export interface AlternativeInvestmentCalculation {
  name: string;
  patrimony: number;
  monthlyIncome: number;
  annualIncome: number;
  multiplier: number;
  realPatrimony: number;
  taxes: number;
  cashFlow: number;
}
