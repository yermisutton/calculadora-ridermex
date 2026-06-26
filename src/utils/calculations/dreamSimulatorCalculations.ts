import { Investment } from '../../types';
import { DreamConfig, DreamProjection } from '../../types/dreamSimulator';
import { getDetailedCertificateEvolution, getCertificatePhasesSummary } from '../calculations/certificateEvolution';

export function calculateProjections(config: DreamConfig, investment: Investment): DreamProjection[] {
  const projections: DreamProjection[] = [];

  const timeframe = config.timeframe || 15;
  const monthlyGoal = config.monthlyGoal || 50000;

  const dreamInvestment: Investment = {
    ...investment,
    initialCertificates: config.certificatesNeeded,
    years: timeframe,
    reinvestProfits: config.reinvestProfits !== undefined ? config.reinvestProfits : investment.reinvestProfits,
    ridermexProductType: investment.ridermexProductType || 'B',
    ridermexFirstMonthlyIncome: investment.ridermexFirstMonthlyIncome || 7,
    ridermexScenario: investment.ridermexScenario || 'moderate'
  };

  const certificateEvolution = getDetailedCertificateEvolution(dreamInvestment);

  for (let year = 1; year <= timeframe; year++) {
    const yearEvolution = certificateEvolution[year - 1];
    if (!yearEvolution) continue;

    const phases = getCertificatePhasesSummary(certificateEvolution, year);

    const certificatePrice = yearEvolution.certificatePrice;
    const monthlyIncome = yearEvolution.totalUtility / 12;
    const progressToGoal = monthlyIncome > 0 ? Math.min(100, (monthlyIncome / monthlyGoal) * 100) : 0;

    const inflationFactor = Math.pow(1 + investment.inflationRate / 100, year);
    const realPatrimony = yearEvolution.citrusPatrimony / inflationFactor;
    const realMonthlyIncome = monthlyIncome / inflationFactor;

    projections.push({
      year,
      certificatePrice,
      totalCertificates: yearEvolution.totalCertificates,
      producingCertificates: phases.producing,
      waitingCertificates: phases.waiting + phases.reserved,
      yearlyUtility: yearEvolution.totalUtility,
      monthlyIncome,
      patrimony: yearEvolution.citrusPatrimony,
      progressToGoal,
      realPatrimony,
      realMonthlyIncome
    });
  }

  return projections;
}

export function optimizeCertificatesForGoal(config: DreamConfig, investment: Investment): number {
  const monthlyGoal = config.monthlyGoal || 50000;
  const timeframe = config.timeframe || 15;
  const reinvestProfits = config.reinvestProfits !== undefined ? config.reinvestProfits : investment.reinvestProfits;

  let certificates = 1;
  const maxCertificates = 100;

  while (certificates <= maxCertificates) {
    const testConfig = {
      ...config,
      certificatesNeeded: certificates,
      reinvestProfits
    };

    const projections = calculateProjections(testConfig, investment);
    const finalProjection = projections[projections.length - 1];

    if (finalProjection && finalProjection.monthlyIncome >= monthlyGoal) {
      return certificates;
    }

    certificates++;
  }

  return maxCertificates;
}

export function calculateTotalInvestment(certificatesNeeded: number, certificatePrice: number): number {
  return certificatesNeeded * certificatePrice;
}

export function calculateDownPayment(totalInvestment: number): number {
  return totalInvestment * 0.3;
}

export function calculateMonthlyPayment(totalInvestment: number): number {
  return (totalInvestment * 0.7) / 48;
}
