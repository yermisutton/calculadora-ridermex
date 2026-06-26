export interface InflationAdjustedValue {
  nominalValue: number;
  realValue: number;
  inflationFactor: number;
  inflationLoss: number;
}

export function calculateInflationFactor(
  inflationRate: number,
  years: number
): number {
  return Math.pow(1 + inflationRate / 100, years);
}

export function adjustForInflation(
  nominalValue: number,
  inflationRate: number,
  years: number
): InflationAdjustedValue {
  const inflationFactor = calculateInflationFactor(inflationRate, years);
  const realValue = nominalValue / inflationFactor;
  const inflationLoss = nominalValue - realValue;

  return {
    nominalValue,
    realValue,
    inflationFactor,
    inflationLoss
  };
}

export function adjustPatrimonyForInflation(
  patrimony: number,
  inflationRate: number,
  year: number
): number {
  const inflationFactor = calculateInflationFactor(inflationRate, year);
  return patrimony / inflationFactor;
}

export function adjustIncomeForInflation(
  income: number,
  inflationRate: number,
  year: number
): number {
  const inflationFactor = calculateInflationFactor(inflationRate, year);
  return income / inflationFactor;
}

export interface InflationAdjustedComparison {
  nominal: {
    patrimony: number;
    income: number;
  };
  real: {
    patrimony: number;
    income: number;
  };
  inflationImpact: {
    patrimonyLoss: number;
    incomeLoss: number;
    lossPercentage: number;
  };
}

export function compareNominalVsReal(
  nominalPatrimony: number,
  nominalIncome: number,
  inflationRate: number,
  years: number
): InflationAdjustedComparison {
  const inflationFactor = calculateInflationFactor(inflationRate, years);
  const realPatrimony = nominalPatrimony / inflationFactor;
  const realIncome = nominalIncome / inflationFactor;

  const patrimonyLoss = nominalPatrimony - realPatrimony;
  const incomeLoss = nominalIncome - realIncome;
  const lossPercentage = ((inflationFactor - 1) / inflationFactor) * 100;

  return {
    nominal: {
      patrimony: nominalPatrimony,
      income: nominalIncome
    },
    real: {
      patrimony: realPatrimony,
      income: realIncome
    },
    inflationImpact: {
      patrimonyLoss,
      incomeLoss,
      lossPercentage
    }
  };
}

export function calculateRealReturn(
  nominalReturn: number,
  inflationRate: number
): number {
  return ((1 + nominalReturn / 100) / (1 + inflationRate / 100) - 1) * 100;
}

export function generateInflationAdjustedSeries(
  nominalValues: number[],
  inflationRate: number
): Array<{ year: number; nominal: number; real: number }> {
  return nominalValues.map((nominal, index) => {
    const year = index + 1;
    const real = adjustPatrimonyForInflation(nominal, inflationRate, year);
    return { year, nominal, real };
  });
}
