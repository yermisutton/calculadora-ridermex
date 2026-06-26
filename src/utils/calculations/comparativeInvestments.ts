import { Investment } from '../../types';

export function shouldUseCompoundInterest(investment: Investment): boolean {
  if (!investment.reinvestProfits) {
    return false;
  }

  if (investment.partialCashOut) {
    const avgCashOutPercentage = investment.yearlyCashOutPercentages.length > 0
      ? investment.yearlyCashOutPercentages.reduce((sum, p) => sum + p, 0) / investment.yearlyCashOutPercentages.length
      : investment.cashOutPercentage;

    if (avgCashOutPercentage >= 95) {
      return false;
    }
  }

  return true;
}

export function calculateAlternativeInvestmentPatrimony(
  initialInvestment: number,
  rate: number,
  year: number,
  investment: Investment
): number {
  const useCompound = shouldUseCompoundInterest(investment);

  if (!useCompound) {
    return initialInvestment + (initialInvestment * (rate / 100) * year);
  }

  if (investment.partialCashOut) {
    let patrimony = initialInvestment;

    for (let y = 1; y <= year; y++) {
      const yearIndex = Math.min(y - 1, investment.yearlyCashOutPercentages.length - 1);
      const cashOutPercentage = investment.yearlyCashOutPercentages[yearIndex] || investment.cashOutPercentage;
      const reinvestPercentage = 100 - cashOutPercentage;

      const yearlyReturn = patrimony * (rate / 100);
      const reinvestedAmount = yearlyReturn * (reinvestPercentage / 100);
      patrimony += reinvestedAmount;
    }

    return patrimony;
  }

  return initialInvestment * Math.pow(1 + rate / 100, year);
}

export function calculateAlternativeInvestmentIncome(
  patrimony: number,
  initialInvestment: number,
  rate: number,
  investment: Investment
): number {
  const useCompound = shouldUseCompoundInterest(investment);

  if (!useCompound) {
    return initialInvestment * (rate / 100);
  }

  return patrimony * (rate / 100);
}

export interface ComparativeInvestmentData {
  patrimony: number;
  income: number;
  monthlyIncome: number;
  taxes: number;
  cashFlow: number;
  realPatrimony: number;
  realIncome: number;
}

export function calculateComparativeInvestment(
  initialInvestment: number,
  rate: number,
  incomeRate: number,
  year: number,
  investment: Investment,
  inflationRate: number = 0,
  applyTaxes: boolean = false,
  taxRate: number = 0
): ComparativeInvestmentData {
  const patrimony = calculateAlternativeInvestmentPatrimony(
    initialInvestment,
    rate,
    year,
    investment
  );

  const income = calculateAlternativeInvestmentIncome(
    patrimony,
    initialInvestment,
    incomeRate,
    investment
  );

  const monthlyIncome = income / 12;

  const taxes = applyTaxes ? income * (taxRate / 100) : 0;

  const cashFlow = year === 1 ? -initialInvestment + income : income;

  const inflationFactor = Math.pow(1 + inflationRate / 100, year);
  const realPatrimony = patrimony / inflationFactor;
  const realIncome = income / inflationFactor;

  return {
    patrimony,
    income,
    monthlyIncome,
    taxes,
    cashFlow,
    realPatrimony,
    realIncome
  };
}

export function calculateCETESInvestment(
  initialInvestment: number,
  year: number,
  investment: Investment,
  inflationRate: number = 0
): ComparativeInvestmentData {
  return calculateComparativeInvestment(
    initialInvestment,
    investment.cetesRate,
    investment.cetesRate,
    year,
    investment,
    inflationRate,
    investment.applyTaxes,
    investment.taxRate
  );
}

export function calculateSavingsInvestment(
  initialInvestment: number,
  year: number,
  investment: Investment,
  inflationRate: number = 0
): ComparativeInvestmentData {
  return calculateComparativeInvestment(
    initialInvestment,
    investment.savingsRate,
    investment.savingsRate,
    year,
    investment,
    inflationRate,
    investment.applyTaxes,
    investment.taxRate
  );
}

export function calculateRealEstateInvestment(
  initialInvestment: number,
  year: number,
  investment: Investment,
  inflationRate: number = 0
): ComparativeInvestmentData {
  const appreciationRate = investment.realEstateRate || investment.realEstateAppreciation;
  const rentRate = investment.realEstateRent;

  return calculateComparativeInvestment(
    initialInvestment,
    appreciationRate,
    rentRate,
    year,
    investment,
    inflationRate,
    investment.applyTaxes,
    investment.taxRate
  );
}

export function calculateCustomInvestment(
  initialInvestment: number,
  year: number,
  investment: Investment,
  inflationRate: number = 0
): ComparativeInvestmentData {
  const rate = investment.customInvestmentRate || 8.0;

  return calculateComparativeInvestment(
    initialInvestment,
    rate,
    rate,
    year,
    investment,
    inflationRate,
    investment.applyTaxes,
    investment.taxRate
  );
}
