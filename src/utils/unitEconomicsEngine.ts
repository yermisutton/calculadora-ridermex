/**
 * Unit Economics Calculation Engine
 *
 * Este es el motor de cálculo principal basado en la lógica de Unit Economics.
 * TODAS las calculadoras deben usar este sistema en lugar del contexto global.
 */

import { getDetailedCertificateEvolution } from './calculations/certificateEvolution';
import { calculateAlternativeInvestmentPatrimony } from './calculations/comparativeInvestments';
import type { Investment } from '../types';

export interface UnitEconomicsConfig {
  // Configuración básica
  initialCertificates: number;
  certificateBasePrice: number;
  initialPayment: number;
  years: number;

  // Configuración de producto
  productType?: 'A' | 'B' | 'C' | 'D';
  ridermexEscalon?: number;
  ridermexFinancingMonths?: number;
  ridermexFirstMonthlyIncome?: number;
  ridermexScenario?: 'conservative' | 'moderate' | 'optimistic';

  // Configuración de reinversión
  reinvestProfits: boolean;
  cashOutPercentage: number;
  yearlyCashOutPercentages?: number[];

  // Configuración de ROI
  investorAnnualReturn: number;

  // Flags opcionales
  enableMonthlyContributions?: boolean;
  includeInflation?: boolean;
  currencyFormat?: 'MXN' | 'USD';

  // Tasas de comparación
  cetesRate?: number;
  savingsRate?: number;
  realEstateRate?: number;
  customInvestmentRate?: number;
  inflationRate?: number;
}

export interface UnitEconomicsResults {
  // Resumen principal
  finalPatrimony: number;
  finalMonthlyIncome: number;
  roi: number;

  // Tickets
  certificatesSummary: {
    initialCertificates: number;
    fromReinvestment: number;
    totalCertificates: number;
  };

  // Métricas
  capitalMultiplier: number;
  cagr: number;
  irr: number;
  paybackYear: number | null;

  // Comparativas
  cetesPatrimony: number;
  savingsPatrimony: number;
  realEstatePatrimony: number;

  cetesMonthlyIncome: number;
  savingsMonthlyIncome: number;
  realEstateMonthlyIncome: number;

  // Datos anuales detallados
  yearlyData: YearlyDataPoint[];

  // Evolución de certificados
  certificateEvolution: any[];
}

export interface YearlyDataPoint {
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
  cetesIncome: number;
  savingsIncome: number;
  realEstateIncome: number;
}

/**
 * Función principal de cálculo basada en Unit Economics
 *
 * @param config Configuración del cálculo
 * @returns Resultados completos del cálculo
 */
export function calculateUnitEconomics(config: UnitEconomicsConfig): UnitEconomicsResults {
  // Convertir config a Investment para usar certificateEvolution
  const investment: Investment = {
    initialCertificates: config.initialCertificates,
    certificateBasePrice: config.certificateBasePrice,
    initialPayment: config.initialPayment,
    years: config.years,

    // Producto
    ridermexProductType: config.productType || 'B',
    ridermexEscalon: config.ridermexEscalon || 1,
    ridermexFinancingMonths: config.ridermexFinancingMonths || 0,
    ridermexFirstMonthlyIncome: config.ridermexFirstMonthlyIncome || 7,
    ridermexScenario: config.ridermexScenario || 'moderate',
    ridermexEntryPrice: config.certificateBasePrice,

    // Reinversión
    reinvestProfits: config.reinvestProfits,
    cashOutPercentage: config.cashOutPercentage,
    yearlyCashOutPercentages: config.yearlyCashOutPercentages || Array(config.years).fill(config.cashOutPercentage),

    // ROI
    investorAnnualReturn: config.investorAnnualReturn,
    annualProfit: config.investorAnnualReturn,

    // Defaults necesarios
    monthlyContribution: 0,
    enableMonthlyContributions: config.enableMonthlyContributions || false,
    includeInflation: config.includeInflation || false,
    currencyFormat: config.currencyFormat || 'MXN',

    // Flags adicionales
    isRidermex: true,
    useLemonPrice: false,
    applyTaxes: false,
    partialCashOut: config.cashOutPercentage > 0 || (config.yearlyCashOutPercentages || []).some(p => p > 0),

    // Tasas comparativas
    cetesRate: config.cetesRate ?? 10.5,
    savingsRate: config.savingsRate ?? 3.5,
    realEstateRate: config.realEstateRate ?? 8.0,
    customInvestmentRate: config.customInvestmentRate ?? 12.0,
    inflationRate: config.inflationRate ?? 3.5,
  };

  // Obtener certificateEvolution completo
  const certificateEvolution = getDetailedCertificateEvolution(investment);

  // Datos del último año
  const finalYearData = certificateEvolution[certificateEvolution.length - 1];

  // Calcular resultados
  const finalPatrimony = finalYearData.citrusPatrimony + (finalYearData.availableForReinvestment || 0);
  const finalMonthlyIncome = finalYearData.citrusIncome / 12;

  // Resumen de certificados
  const certificatesSummary = {
    initialCertificates: config.initialCertificates,
    fromReinvestment: finalYearData.certificatesFromReinvestment,
    totalCertificates: finalYearData.totalCertificates
  };

  // Calcular métricas de performance
  const productType = config.productType;
  const isFinanced = productType === 'B' || productType === 'D';
  const numTickets = config.initialCertificates || 1;
  const totalInitialCost = config.certificateBasePrice * numTickets;
  const downPayment = config.initialPayment;
  const financingMonths = config.ridermexFinancingMonths || 0;

  const totalInvestedAtEnd = isFinanced
    ? totalInitialCost
    : downPayment;

  const totalCashOut = certificateEvolution.reduce((sum, data) => sum + (data.yearlyCashOutAmount || 0), 0);
  const totalFinalValue = finalPatrimony + totalCashOut;

  const cumulativeUtility = certificateEvolution.reduce((sum, data) => sum + data.totalUtility, 0);
  const roi = totalInvestedAtEnd > 0 ? (cumulativeUtility / totalInvestedAtEnd) * 100 : 0;

  const capitalMultiplier = totalInvestedAtEnd > 0 ? totalFinalValue / totalInvestedAtEnd : 1;

  // CAGR: (Valor Final Total / Inversión Inicial)^(1/años) - 1
  const cagr = (totalInvestedAtEnd > 0 && config.years > 0) ? (Math.pow(totalFinalValue / totalInvestedAtEnd, 1 / config.years) - 1) * 100 : 0;
  const irr = cagr;

  // Payback year (año en que recuperas inversión inicial)
  let paybackYear: number | null = null;
  // Simulate up to 25 years to find payback, regardless of selected projection years
  const paybackSimulation = getDetailedCertificateEvolution({ ...investment, years: 25 });
  for (let i = 0; i < paybackSimulation.length; i++) {
    if (paybackSimulation[i].cumulativeTotalUtility >= totalInvestedAtEnd) {
      const prevUtility = i > 0 ? paybackSimulation[i - 1].cumulativeTotalUtility : 0;
      const utilityInYear = paybackSimulation[i].cumulativeTotalUtility - prevUtility;
      const proportion = utilityInYear > 0 ? (totalInvestedAtEnd - prevUtility) / utilityInYear : 0;
      paybackYear = i + proportion;
      break;
    }
  }


  // Calcular comparativas (Cetes, ahorros, bienes raíces) usando la función estándar
  const cetesPatrimony = calculateAlternativeInvestmentPatrimony(totalInvestedAtEnd, investment.cetesRate, config.years, investment);
  const savingsPatrimony = calculateAlternativeInvestmentPatrimony(totalInvestedAtEnd, investment.savingsRate, config.years, investment);
  const realEstatePatrimony = calculateAlternativeInvestmentPatrimony(totalInvestedAtEnd, investment.realEstateRate, config.years, investment);

  const cetesMonthlyIncome = (cetesPatrimony * (investment.cetesRate / 100)) / 12;
  const savingsMonthlyIncome = (savingsPatrimony * (investment.savingsRate / 100)) / 12;
  const realEstateMonthlyIncome = (realEstatePatrimony * (investment.realEstateRate / 100)) / 12;

  // monthly financing payment
  const monthlyPayment = isFinanced && financingMonths > 0 
    ? Math.max(0, totalInitialCost - downPayment) / financingMonths 
    : 0;

  // Construir yearlyData
  const yearlyData: YearlyDataPoint[] = certificateEvolution.map(yearData => {
    // Calcular patrimonio de inversiones alternativas para este año
    const cetesYearPatrimony = calculateAlternativeInvestmentPatrimony(totalInvestedAtEnd, investment.cetesRate, yearData.year, investment);
    const savingsYearPatrimony = calculateAlternativeInvestmentPatrimony(totalInvestedAtEnd, investment.savingsRate, yearData.year, investment);
    const realEstateYearPatrimony = calculateAlternativeInvestmentPatrimony(totalInvestedAtEnd, investment.realEstateRate, yearData.year, investment);

    const yearContributedCapital = isFinanced
      ? downPayment + Math.min(yearData.year * 12, financingMonths) * monthlyPayment
      : downPayment;

    return {
      year: yearData.year,
      citrusPatrimony: yearData.citrusPatrimony,
      citrusIncome: yearData.citrusIncome,
      certificatesFromReinvestment: yearData.certificatesFromReinvestment,
      totalCertificates: yearData.totalCertificates,
      reinvestmentFund: yearData.reinvestmentFund,
      availableCashFlow: yearData.availableForReinvestment || 0,
      partialCashOutAmount: yearData.yearlyCashOutAmount || 0,
      yearlyReinvestmentContribution: yearData.yearlyReinvestmentContribution || 0,
      cumulativeReinvestmentContribution: yearData.cumulativeReinvestmentContribution || 0,
      cumulativeTotalUtility: yearData.cumulativeTotalUtility,
      contributedCapital: yearContributedCapital,
      cetesPatrimony: cetesYearPatrimony,
      savingsPatrimony: savingsYearPatrimony,
      realEstatePatrimony: realEstateYearPatrimony,
      cetesIncome: (cetesYearPatrimony * (investment.cetesRate / 100)),
      savingsIncome: (savingsYearPatrimony * (investment.savingsRate / 100)),
      realEstateIncome: (realEstateYearPatrimony * (investment.realEstateRate / 100)),
    };
  });

  return {
    finalPatrimony,
    finalMonthlyIncome,
    roi,
    certificatesSummary,
    capitalMultiplier,
    cagr,
    irr,
    paybackYear,
    cetesPatrimony,
    savingsPatrimony,
    realEstatePatrimony,
    cetesMonthlyIncome,
    savingsMonthlyIncome,
    realEstateMonthlyIncome,
    yearlyData,
    certificateEvolution,
  };
}

/**
 * Hook de React para usar Unit Economics en componentes
 */
export function useUnitEconomics(initialConfig: UnitEconomicsConfig) {
  return {
    calculate: () => calculateUnitEconomics(initialConfig)
  };
}
