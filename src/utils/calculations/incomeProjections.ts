export interface IncomeProjection {
  annualIncome: number;
  monthlyIncome: number;
  weeklyIncome: number;
  dailyIncome: number;
}

export function calculateIncomeProjections(annualIncome: number): IncomeProjection {
  return {
    annualIncome,
    monthlyIncome: annualIncome / 12,
    weeklyIncome: annualIncome / 52,
    dailyIncome: annualIncome / 365
  };
}

export function calculateMonthlyIncome(annualIncome: number): number {
  return annualIncome / 12;
}

export function calculateAnnualIncome(monthlyIncome: number): number {
  return monthlyIncome * 12;
}

export interface CumulativeIncomeData {
  year: number;
  annualIncome: number;
  cumulativeIncome: number;
}

export function calculateCumulativeIncome(
  yearlyIncomes: number[]
): CumulativeIncomeData[] {
  let cumulative = 0;

  return yearlyIncomes.map((income, index) => {
    cumulative += income;
    return {
      year: index + 1,
      annualIncome: income,
      cumulativeIncome: cumulative
    };
  });
}

export interface IncomeFromPatrimony {
  patrimony: number;
  annualYield: number;
  annualIncome: number;
  monthlyIncome: number;
}

export function calculateIncomeFromPatrimony(
  patrimony: number,
  annualYieldPercentage: number
): IncomeFromPatrimony {
  const annualIncome = patrimony * (annualYieldPercentage / 100);
  const monthlyIncome = annualIncome / 12;

  return {
    patrimony,
    annualYield: annualYieldPercentage,
    annualIncome,
    monthlyIncome
  };
}

export interface WithdrawalPlanProjection {
  year: number;
  totalUtility: number;
  cashOutPercentage: number;
  withdrawnAmount: number;
  reinvestedAmount: number;
  cumulativeWithdrawn: number;
  cumulativeReinvested: number;
}

export function calculateWithdrawalPlan(
  yearlyUtilities: number[],
  cashOutPercentages: number[]
): WithdrawalPlanProjection[] {
  let cumulativeWithdrawn = 0;
  let cumulativeReinvested = 0;

  return yearlyUtilities.map((utility, index) => {
    const year = index + 1;
    const cashOutPercentage = cashOutPercentages[index] || 0;
    const withdrawnAmount = utility * (cashOutPercentage / 100);
    const reinvestedAmount = utility - withdrawnAmount;

    cumulativeWithdrawn += withdrawnAmount;
    cumulativeReinvested += reinvestedAmount;

    return {
      year,
      totalUtility: utility,
      cashOutPercentage,
      withdrawnAmount,
      reinvestedAmount,
      cumulativeWithdrawn,
      cumulativeReinvested
    };
  });
}

export function calculatePassiveIncomeReplacement(
  monthlyIncome: number,
  targetMonthlyExpenses: number
): {
  monthlyIncome: number;
  targetExpenses: number;
  coveragePercentage: number;
  shortfall: number;
  isFinanciallyFree: boolean;
} {
  const coveragePercentage = (monthlyIncome / targetMonthlyExpenses) * 100;
  const shortfall = Math.max(0, targetMonthlyExpenses - monthlyIncome);
  const isFinanciallyFree = monthlyIncome >= targetMonthlyExpenses;

  return {
    monthlyIncome,
    targetExpenses: targetMonthlyExpenses,
    coveragePercentage,
    shortfall,
    isFinanciallyFree
  };
}
