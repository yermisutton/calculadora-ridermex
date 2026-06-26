import { Investment } from '../../types';

export interface PerformanceMetrics {
  capitalMultiplier: number;
  cagr: number;
  irr: number;
  paybackYear: number | null;
  roi: number;
  totalProfit: number;
  passiveIncomeEfficiency: number;
}

export function calculateCapitalMultiplier(
  finalPatrimony: number,
  initialInvestment: number
): number {
  if (initialInvestment === 0) return 0;
  return finalPatrimony / initialInvestment;
}

export function calculateCAGR(
  finalValue: number,
  initialValue: number,
  years: number
): number {
  if (initialValue === 0 || years === 0) return 0;
  return Math.pow(finalValue / initialValue, 1 / years) - 1;
}

export function calculateROI(
  finalPatrimony: number,
  initialInvestment: number
): number {
  if (initialInvestment === 0) return 0;
  return ((finalPatrimony - initialInvestment) / initialInvestment) * 100;
}

export function calculateTotalProfit(
  finalPatrimony: number,
  initialInvestment: number
): number {
  return finalPatrimony - initialInvestment;
}

export function calculatePaybackYear(
  yearlyUtilityData: Array<{ year: number; totalUtility: number }>,
  initialInvestment: number
): number | null {
  let cumulativeCashFlow = -initialInvestment;

  for (let i = 0; i < yearlyUtilityData.length; i++) {
    const yearData = yearlyUtilityData[i];
    const prevCashFlow = cumulativeCashFlow;
    cumulativeCashFlow += yearData.totalUtility;
    if (cumulativeCashFlow >= 0) {
      const utilityInYear = yearData.totalUtility;
      const remainingToRecover = -prevCashFlow;
      const proportion = utilityInYear > 0 ? remainingToRecover / utilityInYear : 0;
      return (yearData.year - 1) + proportion;
    }
  }

  return null;
}

export function calculateIRR(
  initialInvestment: number,
  finalValue: number,
  years: number
): number {
  return calculateCAGR(finalValue, initialInvestment, years);
}

export function calculatePassiveIncomeEfficiency(
  monthlyIncome: number,
  patrimony: number
): number {
  if (patrimony === 0) return 0;
  return monthlyIncome / (patrimony * 0.01);
}

export function calculateAllPerformanceMetrics(
  finalPatrimony: number,
  finalMonthlyIncome: number,
  initialInvestment: number,
  years: number,
  yearlyUtilityData: Array<{ year: number; totalUtility: number }>,
  totalCashOut: number = 0
): PerformanceMetrics {
  const cumulativeUtility = yearlyUtilityData.reduce((sum, d) => sum + d.totalUtility, 0);

  // For ROI and Multiplier, we keep using the Patrimony-based value
  const totalPatrimonyValue = finalPatrimony + totalCashOut;
  
  // For CAGR and IRR, the user explicitly requested to use Rendimiento (Utility) instead of Plusvalia
  const totalYieldValue = initialInvestment + cumulativeUtility;

  const roi = initialInvestment > 0 ? (cumulativeUtility / initialInvestment) * 100 : 0;
  const cagr = (initialInvestment > 0 && years > 0)
    ? (Math.pow(totalYieldValue / initialInvestment, 1 / years) - 1) * 100
    : 0;
  const irr = cagr;
  const capitalMultiplier = initialInvestment > 0 ? totalPatrimonyValue / initialInvestment : 1;
  const totalProfit = totalPatrimonyValue - initialInvestment;

  return {
    capitalMultiplier,
    cagr,
    irr,
    paybackYear: calculatePaybackYear(yearlyUtilityData, initialInvestment),
    roi,
    totalProfit,
    passiveIncomeEfficiency: calculatePassiveIncomeEfficiency(finalMonthlyIncome, finalPatrimony)
  };
}
