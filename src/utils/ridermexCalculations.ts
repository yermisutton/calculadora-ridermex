export interface AgencyData {
  id: string;
  name: string;
  model: 'A' | 'B' | 'C';
  monthlySales: number;
  monthlyFee: number;
  monthlyBonus: number;
  status: 'inactive' | 'active' | 'bonus1' | 'bonus2' | 'bonus3';
}

export interface RiderMexParams {
  investmentAmount: number;
  pricePerTicket: number;
  totalTickets: number;
  feePerMoto: number;
  annualInflation: number;
  additionalSpread: number;
  years: number;
  agencies: AgencyData[];
}

export interface MonthlyProjection {
  month: number;
  year: number;
  monthlyFlow: number;
  cumulativeFlow: number;
}

export interface RiderMexResults {
  userTickets: number;
  fundPercentage: number;
  monthlyFeeTotal: number;
  monthlyBonusTotal: number;
  totalMotosSold: number;
  monthlyUserReturn: number;
  annualUserReturn: number;
  annualUtilityPerTicket: number;
  annualROI: number;
  paybackMonths: number;
  yearlyProjection: YearProjection[];
  monthlyProjection: MonthlyProjection[];
}

export interface YearProjection {
  year: number;
  adjustedFeePerMoto: number;
  totalMotosAnnual: number;
  totalFeeAnnual: number;
  totalBonusAnnual: number;
  userReturnAnnual: number;
  cumulativeReturn: number;
}

interface AgencyMinimums {
  A: number;
  B: number;
  C: number;
}

const AGENCY_MINIMUMS: AgencyMinimums = {
  A: 32,
  B: 40,
  C: 50
};

const BONUS_TIERS = [
  { threshold: 1.5, percentage: 0.35, label: 'Bono 3' },
  { threshold: 1.35, percentage: 0.25, label: 'Bono 2' },
  { threshold: 1.2, percentage: 0.15, label: 'Bono 1' }
];

export function calculateAgencyMetrics(
  agency: AgencyData,
  feePerMoto: number
): {
  monthlyFee: number;
  monthlyBonus: number;
  status: AgencyData['status'];
} {
  const minimum = AGENCY_MINIMUMS[agency.model];
  const threshold70 = minimum * 0.7;

  if (agency.monthlySales < threshold70) {
    return {
      monthlyFee: 0,
      monthlyBonus: 0,
      status: 'inactive'
    };
  }

  const baseFee = agency.monthlySales * feePerMoto;
  let bonus = 0;
  let status: AgencyData['status'] = 'active';

  const excessPercentage = agency.monthlySales / minimum;

  for (const tier of BONUS_TIERS) {
    if (excessPercentage >= tier.threshold) {
      const bonusMotos = agency.monthlySales - minimum;
      bonus = bonusMotos * feePerMoto * tier.percentage;
      if (tier.label === 'Bono 3') status = 'bonus3';
      else if (tier.label === 'Bono 2') status = 'bonus2';
      else if (tier.label === 'Bono 1') status = 'bonus1';
      break;
    }
  }

  return {
    monthlyFee: baseFee,
    monthlyBonus: bonus,
    status
  };
}

export function calculateRiderMexResults(params: RiderMexParams): RiderMexResults {
  const userTickets = Math.floor(params.investmentAmount / params.pricePerTicket);
  const fundPercentage = (userTickets / params.totalTickets) * 100;

  let totalMonthlyFee = 0;
  let totalMonthlyBonus = 0;
  let totalMotosSold = 0;

  const updatedAgencies = params.agencies.map(agency => {
    const metrics = calculateAgencyMetrics(agency, params.feePerMoto);
    totalMonthlyFee += metrics.monthlyFee;
    totalMonthlyBonus += metrics.monthlyBonus;
    totalMotosSold += agency.monthlySales;

    return {
      ...agency,
      monthlyFee: metrics.monthlyFee,
      monthlyBonus: metrics.monthlyBonus,
      status: metrics.status
    };
  });

  const totalMonthlyReturn = totalMonthlyFee + totalMonthlyBonus;
  const monthlyUserReturn = (totalMonthlyReturn / params.totalTickets) * userTickets;
  const annualUserReturn = monthlyUserReturn * 12;
  const annualUtilityPerTicket = (monthlyUserReturn * 12);
  const annualROI = (annualUserReturn / params.investmentAmount) * 100;

  const yearlyProjection: YearProjection[] = [];
  const monthlyProjection: MonthlyProjection[] = [];
  let paybackMonths = 0;

  for (let year = 1; year <= params.years; year++) {
    const adjustmentFactor = Math.pow(
      1 + (params.annualInflation + params.additionalSpread) / 100,
      year - 1
    );
    const adjustedFeePerMoto = params.feePerMoto * adjustmentFactor;

    let totalMotosAnnual = 0;
    let totalFeeAnnual = 0;
    let totalBonusAnnual = 0;

    updatedAgencies.forEach(agency => {
      totalMotosAnnual += agency.monthlySales * 12;

      const minimum = AGENCY_MINIMUMS[agency.model];
      const threshold70 = minimum * 0.7;
      if (agency.monthlySales >= threshold70) {
        totalFeeAnnual += agency.monthlySales * 12 * adjustedFeePerMoto;

        const excessPercentage = agency.monthlySales / minimum;
        for (const tier of BONUS_TIERS) {
          if (excessPercentage >= tier.threshold) {
            const bonusMotos = (agency.monthlySales - minimum) * 12;
            totalBonusAnnual += bonusMotos * adjustedFeePerMoto * tier.percentage;
            break;
          }
        }
      }
    });

    const totalReturnAnnual = totalFeeAnnual + totalBonusAnnual;
    const userReturnAnnual = (totalReturnAnnual / params.totalTickets) * userTickets;
    const cumulativeReturn = (yearlyProjection[year - 2]?.cumulativeReturn ?? 0) + userReturnAnnual;

    yearlyProjection.push({
      year,
      adjustedFeePerMoto,
      totalMotosAnnual,
      totalFeeAnnual,
      totalBonusAnnual,
      userReturnAnnual,
      cumulativeReturn
    });
  }

  let cumulativeFlow = 0;

  for (let year = 1; year <= params.years; year++) {
    const yearData = yearlyProjection.find(y => y.year === year);
    const annualFlow = yearData ? yearData.userReturnAnnual : 0;

    const monthlyGrowthRate = Math.pow(1 + (params.annualInflation + params.additionalSpread) / 100, 1 / 12) - 1;
    const baseMonthlyFlow = annualFlow / 12;

    for (let month = 1; month <= 12; month++) {
      const monthlyFlowAdjusted = baseMonthlyFlow * Math.pow(1 + monthlyGrowthRate, month - 1);
      cumulativeFlow += monthlyFlowAdjusted;

      monthlyProjection.push({
        month,
        year,
        monthlyFlow: parseFloat(monthlyFlowAdjusted.toFixed(2)),
        cumulativeFlow: parseFloat(cumulativeFlow.toFixed(2))
      });

      if (paybackMonths === 0 && cumulativeFlow >= params.investmentAmount) {
        paybackMonths = (year - 1) * 12 + month;
      }
    }
  }

  return {
    userTickets,
    fundPercentage,
    monthlyFeeTotal: totalMonthlyFee,
    monthlyBonusTotal: totalMonthlyBonus,
    totalMotosSold,
    monthlyUserReturn,
    annualUserReturn,
    annualUtilityPerTicket,
    annualROI,
    paybackMonths,
    yearlyProjection,
    monthlyProjection
  };
}

export const DEFAULT_AGENCIES = [
  { id: 'A1', name: 'Agencia A1', model: 'A' as const, monthlySales: 32 },
  { id: 'A2', name: 'Agencia A2', model: 'A' as const, monthlySales: 36 },
  { id: 'A3', name: 'Agencia A3', model: 'A' as const, monthlySales: 42 },
  { id: 'B1', name: 'Agencia B1', model: 'B' as const, monthlySales: 44 },
  { id: 'B2', name: 'Agencia B2', model: 'B' as const, monthlySales: 50 },
  { id: 'B3', name: 'Agencia B3', model: 'B' as const, monthlySales: 56 },
  { id: 'B4', name: 'Agencia B4', model: 'B' as const, monthlySales: 62 },
  { id: 'C1', name: 'Agencia C1', model: 'C' as const, monthlySales: 58 },
  { id: 'C2', name: 'Agencia C2', model: 'C' as const, monthlySales: 70 },
  { id: 'C3', name: 'Agencia C3', model: 'C' as const, monthlySales: 80 }
];

export const SCENARIOS = {
  conservative: [
    { id: 'A1', monthlySales: 28 },
    { id: 'A2', monthlySales: 35 },
    { id: 'A3', monthlySales: 38 },
    { id: 'B1', monthlySales: 41 },
    { id: 'B2', monthlySales: 45 },
    { id: 'B3', monthlySales: 50 },
    { id: 'B4', monthlySales: 55 },
    { id: 'C1', monthlySales: 52 },
    { id: 'C2', monthlySales: 60 },
    { id: 'C3', monthlySales: 68 }
  ],
  base: [
    { id: 'A1', monthlySales: 30 },
    { id: 'A2', monthlySales: 36 },
    { id: 'A3', monthlySales: 42 },
    { id: 'B1', monthlySales: 44 },
    { id: 'B2', monthlySales: 50 },
    { id: 'B3', monthlySales: 56 },
    { id: 'B4', monthlySales: 62 },
    { id: 'C1', monthlySales: 58 },
    { id: 'C2', monthlySales: 70 },
    { id: 'C3', monthlySales: 80 }
  ],
  aggressive: [
    { id: 'A1', monthlySales: 33 },
    { id: 'A2', monthlySales: 40 },
    { id: 'A3', monthlySales: 50 },
    { id: 'B1', monthlySales: 48 },
    { id: 'B2', monthlySales: 55 },
    { id: 'B3', monthlySales: 65 },
    { id: 'B4', monthlySales: 70 },
    { id: 'C1', monthlySales: 65 },
    { id: 'C2', monthlySales: 75 },
    { id: 'C3', monthlySales: 90 }
  ]
};
