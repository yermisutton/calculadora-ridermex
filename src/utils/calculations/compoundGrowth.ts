import { Investment } from '../../types';

export interface SimpleCompoundResult {
  finalAmount: number;
  monthlyIncome: number;
  multiplier: number;
}

export function calculateSimpleCompoundGrowth(
  initialInvestment: number,
  annualRate: number,
  years: number
): SimpleCompoundResult {
  const finalAmount = initialInvestment * Math.pow(1 + annualRate / 100, years);
  const monthlyIncome = (finalAmount * (annualRate / 100)) / 12;
  const multiplier = finalAmount / initialInvestment;

  return {
    finalAmount,
    monthlyIncome,
    multiplier
  };
}

export interface ICMCompoundResult {
  finalAmount: number;
  monthlyIncome: number;
  totalCertificates: number;
  multiplier: number;
}

export function calculateICMCompoundGrowth(
  initialInvestment: number,
  years: number,
  certificatePrice: number = 266000,
  averageProductionPerHectare: number = 35000,
  averageSalePricePerKg: number = 38,
  lemonPriceIncrease: number = 5,
  investorFactor: number = 0.65,
  hectarePerCertificate: number = 0.1,
  certificateAppreciation: number = 12
): ICMCompoundResult {
  const waitingPeriod = 4;
  const numCertificates = initialInvestment / certificatePrice;
  let totalCertificates = numCertificates;
  let totalInvestedInCertificates = initialInvestment;

  for (let year = 1; year <= years; year++) {
    if (year <= waitingPeriod) {
      continue;
    }

    let currentLemonPrice = averageSalePricePerKg;
    if (year > 5) {
      currentLemonPrice = averageSalePricePerKg * Math.pow(1 + lemonPriceIncrease / 100, year - 5);
    }

    const utilityPerCertificate =
      averageProductionPerHectare *
      currentLemonPrice *
      hectarePerCertificate *
      investorFactor;

    const yearlyUtility = totalCertificates * utilityPerCertificate;

    const currentCertPrice =
      certificatePrice * Math.pow(1 + certificateAppreciation / 100, Math.min(year, 5));

    const newCertificates = yearlyUtility / currentCertPrice;
    totalCertificates += newCertificates;

    totalInvestedInCertificates += yearlyUtility;
  }

  const patrimony = totalInvestedInCertificates;

  let finalLemonPrice = averageSalePricePerKg;
  if (years > 5) {
    finalLemonPrice = averageSalePricePerKg * Math.pow(1 + lemonPriceIncrease / 100, years - 5);
  }

  const finalUtilityPerCertificate =
    averageProductionPerHectare *
    finalLemonPrice *
    hectarePerCertificate *
    investorFactor;

  const annualIncome = totalCertificates * finalUtilityPerCertificate;
  const monthlyIncome = annualIncome / 12;
  const multiplier = patrimony / initialInvestment;

  return {
    finalAmount: patrimony,
    monthlyIncome,
    totalCertificates,
    multiplier
  };
}

export interface CompoundGrowthComparison {
  withReinvestment: SimpleCompoundResult;
  withoutReinvestment: SimpleCompoundResult;
  advantage: {
    patrimonyMultiplier: number;
    incomeMultiplier: number;
  };
}

export function compareCompoundGrowth(
  initialInvestment: number,
  reinvestmentRate: number,
  simpleRate: number,
  years: number
): CompoundGrowthComparison {
  const withReinvestment = calculateSimpleCompoundGrowth(
    initialInvestment,
    reinvestmentRate,
    years
  );

  const withoutReinvestment = calculateSimpleCompoundGrowth(
    initialInvestment,
    simpleRate,
    years
  );

  return {
    withReinvestment,
    withoutReinvestment,
    advantage: {
      patrimonyMultiplier: withReinvestment.finalAmount / withoutReinvestment.finalAmount,
      incomeMultiplier: withReinvestment.monthlyIncome / withoutReinvestment.monthlyIncome
    }
  };
}

export function generateYearlyCompoundData(
  initialInvestment: number,
  rate: number,
  years: number
): Array<{ year: number; amount: number; income: number }> {
  return Array.from({ length: years }, (_, i) => {
    const year = i + 1;
    const amount = initialInvestment * Math.pow(1 + rate / 100, year);
    const income = amount * (rate / 100);

    return { year, amount, income };
  });
}

export interface MotorcycleCompoundResult {
  finalAmount: number;
  monthlyIncome: number;
  totalTickets: number;
  multiplier: number;
}

export function calculateMotorcycleCompoundGrowth(
  initialInvestment: number,
  years: number,
  ticketPrice: number = 70000,
  averageSalesPerYear: number = 480,
  averageUtilityPerMotorcycle: number = 900,
  motorcyclePriceIncrease: number = 5,
  investorFactor: number = 0.70,
  totalTicketsPerStore: number = 30,
  ticketAppreciation: number = 50,
  inflationRate: number = 4.5,
  marketGrowth: number = 2
): MotorcycleCompoundResult {
  const annualReturnPerTicket = (averageSalesPerYear * averageUtilityPerMotorcycle * investorFactor) / totalTicketsPerStore;
  const numTickets = initialInvestment / ticketPrice;
  let totalTickets = numTickets;
  let totalInvestedInTickets = initialInvestment;
  let currentAnnualReturn = annualReturnPerTicket;

  for (let year = 1; year <= years; year++) {
    const yearlyUtility = totalTickets * currentAnnualReturn;

    const currentTicketPrice =
      ticketPrice * Math.pow(1 + ticketAppreciation / 100, Math.min(year, 5));

    const newTickets = yearlyUtility / currentTicketPrice;
    totalTickets += newTickets;

    totalInvestedInTickets += yearlyUtility;

    if (year > 1) {
      const grossPriceIncrease = motorcyclePriceIncrease + marketGrowth;
      const realPriceIncrease = ((1 + grossPriceIncrease / 100) / (1 + inflationRate / 100)) - 1;
      currentAnnualReturn = annualReturnPerTicket * Math.pow(1 + realPriceIncrease, year - 1);
    }
  }

  const patrimony = totalInvestedInTickets;

  const grossPriceIncrease = motorcyclePriceIncrease + marketGrowth;
  const realPriceIncrease = ((1 + grossPriceIncrease / 100) / (1 + inflationRate / 100)) - 1;
  const finalAnnualIncome = totalTickets * annualReturnPerTicket * Math.pow(1 + realPriceIncrease, years - 1);
  const monthlyIncome = finalAnnualIncome / 12;
  const multiplier = patrimony / initialInvestment;

  return {
    finalAmount: patrimony,
    monthlyIncome,
    totalTickets,
    multiplier
  };
}
