import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Investment, InvestmentResults, WhatIfScenarioParams, ScenarioType } from '../types';
import { calculateResults } from '../utils/calculations';
import { convertToMXN } from '../utils/formatters';
import { calculateUnitEconomics } from '../utils/unitEconomicsEngine';

// Chart visibility interfaces
export interface PatrimonyChartVisibility {
  ridermex: boolean;
  contributedCapital: boolean;
  cetes: boolean;
  savings: boolean;
  realEstate: boolean;
  showReal: boolean;
  ebitda: boolean;
}

export interface IncomeChartVisibility {
  ridermex: boolean;
  cetes: boolean;
  savings: boolean;
  realEstate: boolean;
  showReal: boolean;
  showTaxes: boolean;
}

export interface CashFlowChartVisibility {
  ridermex: boolean;
  cetes: boolean;
  savings: boolean;
  realEstate: boolean;
  cumulativeFlow: boolean;
  showPartialCashOut: boolean;
}

export interface ComparisonChartVisibility {
  ridermex: boolean;
  cetes: boolean;
  savings: boolean;
  realEstate: boolean;
  showReal: boolean;
  showCustom: boolean;
}

export interface WithdrawalPlanChartVisibility {
  showPercentages: boolean;
  showAmounts: boolean;
  showCumulativeRetirement: boolean;
  showCumulativeReinvestment: boolean;
}

interface CalculatorContextType {
  investment: Investment;
  results: InvestmentResults | null;
  updateInvestment: (updates: Partial<Investment>) => void;
  toggleReinvest: () => void;
  toggleContributions: () => void;
  toggleLemonPrice: () => void;
  toggleTaxes: () => void;
  togglePartialCashOut: () => void;
  updateCashOutPercentage: (percentage: number) => void;
  updateYearlyCashOutPercentage: (year: number, percentage: number) => void;
  resetYearlyCashOutPercentages: () => void;
  setDefaultYearlyCashOutPercentage: (percentage: number) => void;
  resetCalculator: () => void;
  setUtilityScenario: (scenario: 'conservative' | 'moderate' | 'optimistic') => void;

  // What-if scenario functionality
  whatIfScenario: WhatIfScenarioParams | null;
  whatIfResults: InvestmentResults | null;
  setWhatIfScenario: (scenario: WhatIfScenarioParams) => void;
  clearWhatIfScenario: () => void;
  applyPredefinedScenario: (scenarioType: ScenarioType) => void;

  // Chart visibility controls
  patrimonyChartVisibility: PatrimonyChartVisibility;
  incomeChartVisibility: IncomeChartVisibility;
  cashFlowChartVisibility: CashFlowChartVisibility;
  comparisonChartVisibility: ComparisonChartVisibility;
  withdrawalPlanChartVisibility: WithdrawalPlanChartVisibility;

  togglePatrimonyChartElement: (element: keyof PatrimonyChartVisibility) => void;
  toggleIncomeChartElement: (element: keyof IncomeChartVisibility) => void;
  toggleCashFlowChartElement: (element: keyof CashFlowChartVisibility) => void;
  toggleComparisonChartElement: (element: keyof ComparisonChartVisibility) => void;
  toggleWithdrawalPlanChartElement: (element: keyof WithdrawalPlanChartVisibility) => void;

  resetPatrimonyChartVisibility: () => void;
  resetIncomeChartVisibility: () => void;
  resetCashFlowChartVisibility: () => void;
  resetComparisonChartVisibility: () => void;
  resetWithdrawalPlanChartVisibility: () => void;

  // Presentation mode
  presentationMode: boolean;
  togglePresentationMode: () => void;
  savedScenarios: Array<{ id: string; name: string; investment: Investment }>;
  saveScenario: (name: string) => void;
  loadScenario: (id: string) => void;
  deleteScenario: (id: string) => void;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

function recalculateRidermexPricing(inv: Investment): Investment {
  const model = inv.ridermexProductType || 'B';
  const numTickets = inv.initialCertificates || 1;
  const manualDiscount = inv.ridermexDiscount !== undefined ? inv.ridermexDiscount : (model === 'C' ? 0 : 30);
  const financingMonths = model === 'B' ? 12 : (model === 'D' ? (inv.ridermexFinancingMonths || 48) : 0);

  const basePrice = model === 'C' ? 120000 : 100000;

  let volumeDiscount = 0;
  if (numTickets >= 10) volumeDiscount = 10;
  else if (numTickets >= 5) volumeDiscount = 5;
  else if (numTickets >= 3) volumeDiscount = 3;

  let financingFactor = 1.0;
  if (model === 'B') {
    financingFactor = 0.83;
  } else if (model === 'D') {
    const months = financingMonths || 48;
    if (months <= 12) {
      financingFactor = 0.83;
    } else if (months >= 48) {
      financingFactor = 1 / 3;
    } else {
      financingFactor = 0.83 - ((months - 12) * (0.496667 / 36));
    }
  }

  const phaseDiscountPercent = manualDiscount * financingFactor;
  const priceAfterDiscount = basePrice * (1 - phaseDiscountPercent / 100) * (1 - volumeDiscount / 100);

  let surchargePercentage = 0;
  const finalPricePerTicket = priceAfterDiscount;

  const isFinanced = model === 'B' || model === 'D';
  const minDownPayment = 10000 * numTickets;
  const downPaymentInput = inv.ridermexDownPaymentAmount !== undefined ? inv.ridermexDownPaymentAmount : minDownPayment;
  const initialPayment = isFinanced ? Math.max(minDownPayment, downPaymentInput) : finalPricePerTicket * numTickets;

  // Scenario calculations
  const scenario = inv.ridermexScenario || 'moderate';
  const yieldPerTicket = scenario === 'conservative' ? 10800 : scenario === 'optimistic' ? 19800 : 14400;
  const annualUtilityTotal = yieldPerTicket * 30; // 30 tickets per store
  const roi = (yieldPerTicket / finalPricePerTicket) * 100;

  return {
    ...inv,
    certificateBasePrice: finalPricePerTicket,
    initialPayment: initialPayment,
    ridermexEntryPrice: finalPricePerTicket,
    averageProductionPerHectare: annualUtilityTotal,
    averageSalePricePerKg: roi,
    annualProfit: roi,
    investorAnnualReturn: roi,
    ridermexFirstMonthlyIncome: model === 'A' ? 7 : model === 'B' ? 19 : model === 'C' ? 2 : (financingMonths + 7),
    ridermexDiscount: manualDiscount,
    ridermexFinancingMonths: financingMonths,
    // Align growth and inflation values with RiderMex business assumptions:
    // 3.5% inflation + 1.5% plusvalia = 5% total growth rate
    marketGrowthRate: inv.marketGrowthRate === 2 || inv.marketGrowthRate === undefined ? 5 : inv.marketGrowthRate,
    inflationRate: inv.inflationRate === 5 || inv.inflationRate === undefined ? 3.5 : inv.inflationRate,
    lemonPriceIncrease: inv.lemonPriceIncrease === 5 || inv.lemonPriceIncrease === undefined ? 1.5 : inv.lemonPriceIncrease,
    increaseLemonPrice: inv.increaseLemonPrice !== undefined ? inv.increaseLemonPrice : true,
    enableMarketGrowth: inv.enableMarketGrowth !== undefined ? inv.enableMarketGrowth : true
  };
}

const baseDefaultInvestment: Investment = {
  initialCertificates: 1,
  certificateBasePrice: 70000,
  initialPayment: 70000,
  years: 25,
  annualProfit: 30.66,
  increaseLemonPrice: true,
  lemonPriceIncrease: 5,
  enableMarketGrowth: true,
  marketGrowthRate: 5,
  usePresentValue: false,
  reinvestProfits: false,
  additionalContributions: false,
  monthlyContribution: 10000,
  currencyFormat: 'MXN',
  exchangeRate: 20,
  exchangeRateEUR: 21.70,
  inflationRate: 3.5,
  applyTaxes: false,
  taxRate: 30,
  partialCashOut: false,
  cashOutPercentage: 30,
  yearlyCashOutPercentages: Array(30).fill(30),
  appreciationRate: 12,
  cetesRate: 7.5,
  savingsRate: 4.0,
  realEstateRate: 8.0,
  realEstateAppreciation: 8,
  realEstateRent: 6,
  ebitdaFactor: 10,
  averageProductionPerHectare: 24500, // Kilogramos de limón por hectárea (Cosecha)
  averageSalePricePerKg: 30, // Precio por kilogramo de limón (Cosecha)
  isLongTermCalculator: false,
  firstYearUtilityToUser: false,
  commissionRate: 0.05,
  citrusReinvestment: true,
  citrusReinvestmentPercentages: Array(30).fill(100),
  enablePaymentBoost: false,
  paymentBoostAmount: undefined,
  paymentBoostGrowthRate: 0,
  paymentBoostYears: undefined,
  investorFactor: 65,
  // New payment calculator properties
  investorName: '',
  investorPhone: '',
  investorEmail: '',
  executiveName: '',
  executivePhone: '',
  executiveEmail: '',
  downPaymentPercentage: 30,
  enableCustomPayments: false,
  customPaymentSchedule: [],
  financingInterestRate: 0,
  enableCustomDownPaymentSchedule: false,
  customDownPaymentSchedule: [],
  downPaymentInstallments: 1,
  customInvestmentRate: 8,
  customInvestmentName: 'Mi Inversión',
  investorAnnualReturn: 20,
  investorPriceAppreciation: 12,
  financingDownPaymentPercent: 30,
  financingAnnualInterestRate: 12,
  ridermexProductType: 'B' as const,
  ridermexFirstMonthlyIncome: 7,
  ridermexScenario: 'moderate' as const
};

const defaultInvestment = recalculateRidermexPricing(baseDefaultInvestment);

// Default chart visibility states
const defaultPatrimonyChartVisibility: PatrimonyChartVisibility = {
  ridermex: true,
  contributedCapital: true,
  cetes: true,
  savings: true,
  realEstate: true,
  showReal: false,
  ebitda: true
};

const defaultIncomeChartVisibility: IncomeChartVisibility = {
  ridermex: true,
  cetes: true,
  savings: true,
  realEstate: true,
  showReal: false,
  showTaxes: true
};

const defaultCashFlowChartVisibility: CashFlowChartVisibility = {
  ridermex: true,
  cetes: true,
  savings: true,
  realEstate: true,
  cumulativeFlow: true,
  showPartialCashOut: true
};

const defaultComparisonChartVisibility: ComparisonChartVisibility = {
  ridermex: true,
  cetes: true,
  savings: true,
  realEstate: true,
  showReal: false,
  showCustom: true
};

const defaultWithdrawalPlanChartVisibility: WithdrawalPlanChartVisibility = {
  showPercentages: true,
  showAmounts: true,
  showCumulativeRetirement: true,
  showCumulativeReinvestment: true
};

export const CalculatorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [investment, setInvestment] = useState<Investment>(defaultInvestment);
  const [results, setResults] = useState<InvestmentResults | null>(null);
  const [whatIfScenario, setWhatIfScenarioState] = useState<WhatIfScenarioParams | null>(null);
  const [whatIfResults, setWhatIfResults] = useState<InvestmentResults | null>(null);

  // Chart visibility states
  const [patrimonyChartVisibility, setPatrimonyChartVisibility] = useState<PatrimonyChartVisibility>(defaultPatrimonyChartVisibility);
  const [incomeChartVisibility, setIncomeChartVisibility] = useState<IncomeChartVisibility>(defaultIncomeChartVisibility);
  const [cashFlowChartVisibility, setCashFlowChartVisibility] = useState<CashFlowChartVisibility>(defaultCashFlowChartVisibility);
  const [comparisonChartVisibility, setComparisonChartVisibility] = useState<ComparisonChartVisibility>(defaultComparisonChartVisibility);
  const [withdrawalPlanChartVisibility, setWithdrawalPlanChartVisibility] = useState<WithdrawalPlanChartVisibility>(defaultWithdrawalPlanChartVisibility);

  // Presentation mode states
  const [presentationMode, setPresentationMode] = useState(false);
  const [savedScenarios, setSavedScenarios] = useState<Array<{ id: string; name: string; investment: Investment }>>([]);

  const [calculationRequested, setCalculationRequested] = useState(false);

  useEffect(() => {
    if (!calculationRequested) return;
    try {
      const unitEconomicsConfig = {
        initialCertificates: investment.initialCertificates,
        certificateBasePrice: investment.certificateBasePrice,
        initialPayment: investment.initialPayment,
        years: investment.years,
        productType: investment.ridermexProductType as 'A' | 'B' | 'C' | 'D',
        ridermexEscalon: investment.ridermexEscalon,
        ridermexFinancingMonths: investment.ridermexFinancingMonths as number,
        ridermexFirstMonthlyIncome: investment.ridermexFirstMonthlyIncome,
        ridermexScenario: investment.ridermexScenario,
        reinvestProfits: investment.reinvestProfits,
        cashOutPercentage: investment.cashOutPercentage,
        yearlyCashOutPercentages: investment.yearlyCashOutPercentages,
        investorAnnualReturn: investment.investorAnnualReturn,
        enableMonthlyContributions: investment.enableMonthlyContributions,
        includeInflation: investment.includeInflation,
        currencyFormat: investment.currencyFormat,
        cetesRate: investment.cetesRate,
        savingsRate: investment.savingsRate,
        realEstateRate: investment.realEstateRate,
        customInvestmentRate: investment.customInvestmentRate,
        inflationRate: investment.inflationRate,
      };

      const unitResults = calculateUnitEconomics(unitEconomicsConfig);

      // Convertir resultados de Unit Economics a formato InvestmentResults
      const newResults: InvestmentResults = {
        finalPatrimony: unitResults.finalPatrimony,
        finalMonthlyIncome: unitResults.finalMonthlyIncome,
        capitalMultiplier: unitResults.capitalMultiplier,
        cagr: unitResults.cagr,
        irr: unitResults.irr,
        paybackYear: unitResults.paybackYear,
        certificatesSummary: unitResults.certificatesSummary,
        passiveIncomeEfficiency: unitResults.finalMonthlyIncome / (investment.initialPayment / 12),
        cetesPatrimony: unitResults.cetesPatrimony,
        savingsPatrimony: unitResults.savingsPatrimony,
        realEstatePatrimony: unitResults.realEstatePatrimony,
        customInvestmentPatrimony: 0,
        cetesMonthlyIncome: unitResults.cetesMonthlyIncome,
        savingsMonthlyIncome: unitResults.savingsMonthlyIncome,
        realEstateMonthlyIncome: unitResults.realEstateMonthlyIncome,
        customInvestmentMonthlyIncome: 0,
        realFinalPatrimony: unitResults.finalPatrimony,
        realCetesPatrimony: unitResults.cetesPatrimony,
        realSavingsPatrimony: unitResults.savingsPatrimony,
        realRealEstatePatrimony: unitResults.realEstatePatrimony,
        realCustomInvestmentPatrimony: 0,
        finalEbitdaValue: 0,
        totalCashOut: unitResults.yearlyData.reduce((sum, y) => sum + y.partialCashOutAmount, 0),
        calculatedAnnualProfitPercentage: investment.annualProfit,
        firstYearUtility: unitResults.yearlyData[0]?.citrusIncome || 0,
        priceDifferential: 0,
        totalProfit: unitResults.finalPatrimony - investment.initialPayment,
        roi: unitResults.roi,
        yearlyData: unitResults.yearlyData.map(yd => ({
          ...yd,
          cetesMonthlyIncome: yd.cetesIncome / 12,
          savingsMonthlyIncome: yd.savingsIncome / 12,
          realEstateMonthlyIncome: yd.realEstateIncome / 12,
          customInvestmentPatrimony: 0,
          customInvestmentIncome: 0,
          customInvestmentMonthlyIncome: 0,
          realCitrusPatrimony: yd.citrusPatrimony,
          realCetesPatrimony: yd.cetesPatrimony,
          realSavingsPatrimony: yd.savingsPatrimony,
          realRealEstatePatrimony: yd.realEstatePatrimony,
          realCustomInvestmentPatrimony: 0,
        })),
        certificateEvolution: unitResults.certificateEvolution,
      };

      setResults(newResults);
    } catch (error) {
      console.error('Error calculating results:', error);
      setResults(null);
    }
  }, [investment, calculationRequested]);

  // Calculate what-if results when scenario changes
  useEffect(() => {
    if (whatIfScenario) {
      try {
        // Create a modified investment with what-if parameters
        const modifiedInvestment: Investment = {
          ...investment,
          averageProductionPerHectare: whatIfScenario.averageProductionPerHectare || investment.averageProductionPerHectare,
          averageSalePricePerKg: whatIfScenario.averageSalePricePerKg || investment.averageSalePricePerKg,
          lemonPriceIncrease: whatIfScenario.lemonPriceIncrease || investment.lemonPriceIncrease,
          inflationRate: whatIfScenario.inflationRate || investment.inflationRate,
          cetesRate: whatIfScenario.cetesRate || investment.cetesRate,
          savingsRate: whatIfScenario.savingsRate || investment.savingsRate,
          realEstateAppreciation: whatIfScenario.realEstateAppreciation || investment.realEstateAppreciation,
          realEstateRent: whatIfScenario.realEstateRent || investment.realEstateRent,
          ebitdaFactor: whatIfScenario.ebitdaFactor || investment.ebitdaFactor
        };

        const unitEconomicsConfig = {
          initialCertificates: modifiedInvestment.initialCertificates,
          certificateBasePrice: modifiedInvestment.certificateBasePrice,
          initialPayment: modifiedInvestment.initialPayment,
          years: modifiedInvestment.years,
          productType: modifiedInvestment.ridermexProductType as 'A' | 'B' | 'C' | 'D',
          ridermexEscalon: modifiedInvestment.ridermexEscalon,
          ridermexFinancingMonths: modifiedInvestment.ridermexFinancingMonths as number,
          ridermexFirstMonthlyIncome: modifiedInvestment.ridermexFirstMonthlyIncome,
          ridermexScenario: modifiedInvestment.ridermexScenario,
          reinvestProfits: modifiedInvestment.reinvestProfits,
          cashOutPercentage: modifiedInvestment.cashOutPercentage,
          yearlyCashOutPercentages: modifiedInvestment.yearlyCashOutPercentages,
          investorAnnualReturn: modifiedInvestment.investorAnnualReturn,
          enableMonthlyContributions: modifiedInvestment.enableMonthlyContributions,
          includeInflation: modifiedInvestment.includeInflation,
          currencyFormat: modifiedInvestment.currencyFormat,
        };

        const unitResults = calculateUnitEconomics(unitEconomicsConfig);

        const newWhatIfResults: InvestmentResults = {
          finalPatrimony: unitResults.finalPatrimony,
          finalMonthlyIncome: unitResults.finalMonthlyIncome,
          capitalMultiplier: unitResults.capitalMultiplier,
          cagr: unitResults.cagr,
          irr: unitResults.irr,
          paybackYear: unitResults.paybackYear,
          certificatesSummary: unitResults.certificatesSummary,
          passiveIncomeEfficiency: unitResults.finalMonthlyIncome / (modifiedInvestment.initialPayment / 12),
          cetesPatrimony: unitResults.cetesPatrimony,
          savingsPatrimony: unitResults.savingsPatrimony,
          realEstatePatrimony: unitResults.realEstatePatrimony,
          customInvestmentPatrimony: 0,
          cetesMonthlyIncome: unitResults.cetesMonthlyIncome,
          savingsMonthlyIncome: unitResults.savingsMonthlyIncome,
          realEstateMonthlyIncome: unitResults.realEstateMonthlyIncome,
          customInvestmentMonthlyIncome: 0,
          realFinalPatrimony: unitResults.finalPatrimony,
          realCetesPatrimony: unitResults.cetesPatrimony,
          realSavingsPatrimony: unitResults.savingsPatrimony,
          realRealEstatePatrimony: unitResults.realEstatePatrimony,
          realCustomInvestmentPatrimony: 0,
          finalEbitdaValue: 0,
          totalCashOut: unitResults.yearlyData.reduce((sum, y) => sum + y.partialCashOutAmount, 0),
          calculatedAnnualProfitPercentage: modifiedInvestment.annualProfit,
          firstYearUtility: unitResults.yearlyData[0]?.citrusIncome || 0,
          priceDifferential: 0,
          totalProfit: unitResults.finalPatrimony - modifiedInvestment.initialPayment,
          roi: unitResults.roi,
          yearlyData: unitResults.yearlyData.map(yd => ({
            ...yd,
            cetesMonthlyIncome: yd.cetesIncome / 12,
            savingsMonthlyIncome: yd.savingsIncome / 12,
            realEstateMonthlyIncome: yd.realEstateIncome / 12,
            customInvestmentPatrimony: 0,
            customInvestmentIncome: 0,
            customInvestmentMonthlyIncome: 0,
            realCitrusPatrimony: yd.citrusPatrimony,
            realCetesPatrimony: yd.cetesPatrimony,
            realSavingsPatrimony: yd.savingsPatrimony,
            realRealEstatePatrimony: yd.realEstatePatrimony,
            realCustomInvestmentPatrimony: 0,
          })),
          certificateEvolution: unitResults.certificateEvolution,
        };

        setWhatIfResults(newWhatIfResults);
      } catch (error) {
        console.error('Error calculating what-if results:', error);
        setWhatIfResults(null);
      }
    } else {
      setWhatIfResults(null);
    }
  }, [whatIfScenario, investment]);

  const updateInvestment = (updates: Partial<Investment>) => {
    if (!calculationRequested) setCalculationRequested(true);
    setInvestment(prev => {
      let nextInvestment = { ...prev, ...updates };
      if (nextInvestment.ridermexProductType) {
        nextInvestment = recalculateRidermexPricing(nextInvestment);
      }
      return nextInvestment;
    });
  };

  const ensureCalculation = () => {
    if (!calculationRequested) setCalculationRequested(true);
  };

  const toggleReinvest = () => {
    ensureCalculation();
    setInvestment(prev => ({ ...prev, reinvestProfits: !prev.reinvestProfits }));
  };

  const toggleContributions = () => {
    ensureCalculation();
    setInvestment(prev => ({ ...prev, additionalContributions: !prev.additionalContributions }));
  };

  const toggleLemonPrice = () => {
    ensureCalculation();
    setInvestment(prev => ({ ...prev, increaseLemonPrice: !prev.increaseLemonPrice }));
  };

  const toggleTaxes = () => {
    ensureCalculation();
    setInvestment(prev => ({ ...prev, applyTaxes: !prev.applyTaxes }));
  };

  const togglePartialCashOut = () => {
    ensureCalculation();
    setInvestment(prev => ({ ...prev, partialCashOut: !prev.partialCashOut }));
  };

  const updateCashOutPercentage = (percentage: number) => {
    ensureCalculation();
    setInvestment(prev => ({ ...prev, cashOutPercentage: percentage }));
  };

  const updateYearlyCashOutPercentage = (year: number, percentage: number) => {
    ensureCalculation();
    setInvestment(prev => {
      const newPercentages = [...prev.yearlyCashOutPercentages];
      newPercentages[year - 1] = percentage;
      return { ...prev, yearlyCashOutPercentages: newPercentages };
    });
  };

  const resetYearlyCashOutPercentages = () => {
    ensureCalculation();
    setInvestment(prev => ({
      ...prev,
      yearlyCashOutPercentages: Array(30).fill(prev.cashOutPercentage)
    }));
  };

  const setDefaultYearlyCashOutPercentage = (percentage: number) => {
    ensureCalculation();
    setInvestment(prev => ({
      ...prev,
      cashOutPercentage: percentage,
      yearlyCashOutPercentages: Array(30).fill(percentage)
    }));
  };

  const resetCalculator = () => {
    setInvestment(defaultInvestment);
    setResults(null);
    setCalculationRequested(false);
    setWhatIfScenarioState(null);
    setWhatIfResults(null);
  };

  const setUtilityScenario = (scenario: 'conservative' | 'moderate' | 'optimistic') => {
    const scenarios = {
      conservative: { production: 25566, price: 28 },
      moderate: { production: 27341, price: 32 },
      optimistic: { production: 28259, price: 38 }
    };

    updateInvestment({
      averageProductionPerHectare: scenarios[scenario].production,
      averageSalePricePerKg: scenarios[scenario].price
    });
  };

  // What-if scenario functions
  const setWhatIfScenario = (scenario: WhatIfScenarioParams) => {
    setWhatIfScenarioState(scenario);
  };

  const clearWhatIfScenario = () => {
    setWhatIfScenarioState(null);
    setWhatIfResults(null);
  };

  const applyPredefinedScenario = (scenarioType: ScenarioType) => {
    const scenarios: Record<ScenarioType, WhatIfScenarioParams> = {
      optimistic: {
        name: "Escenario Optimista",
        description: "Condiciones de mercado favorables con alto crecimiento y baja inflación",
        averageProductionPerHectare: 35000,
        averageSalePricePerKg: 45,
        lemonPriceIncrease: 8,
        inflationRate: 2,
        cetesRate: 12,
        savingsRate: 8,
        realEstateAppreciation: 12,
        realEstateRent: 8,
        ebitdaFactor: investment.ebitdaFactor
      },
      pessimistic: {
        name: "Escenario Pesimista",
        description: "Condiciones de mercado desfavorables con bajo crecimiento y alta inflación",
        averageProductionPerHectare: 20000,
        averageSalePricePerKg: 25,
        lemonPriceIncrease: 2,
        inflationRate: 10,
        cetesRate: 6,
        savingsRate: 3,
        realEstateAppreciation: 4,
        realEstateRent: 3,
        ebitdaFactor: investment.ebitdaFactor
      },
      crisis: {
        name: "Crisis Económica",
        description: "Escenario de crisis económica severa con alta inflación y rendimientos reducidos",
        averageProductionPerHectare: 18000,
        averageSalePricePerKg: 22,
        lemonPriceIncrease: 1,
        inflationRate: 15,
        cetesRate: 4,
        savingsRate: 2,
        realEstateAppreciation: 2,
        realEstateRent: 2,
        ebitdaFactor: investment.ebitdaFactor
      },
      boom: {
        name: "Boom Económico",
        description: "Escenario de auge económico con crecimiento excepcional y baja inflación",
        averageProductionPerHectare: 38000,
        averageSalePricePerKg: 50,
        lemonPriceIncrease: 10,
        inflationRate: 1,
        cetesRate: 15,
        savingsRate: 10,
        realEstateAppreciation: 15,
        realEstateRent: 10,
        ebitdaFactor: investment.ebitdaFactor
      },
      inflation: {
        name: "Inflación Alta",
        description: "Escenario de inflación elevada sostenida con ajustes en tasas de interés",
        averageProductionPerHectare: investment.averageProductionPerHectare,
        averageSalePricePerKg: investment.averageSalePricePerKg,
        lemonPriceIncrease: investment.lemonPriceIncrease,
        inflationRate: 12,
        cetesRate: 15,
        savingsRate: 8,
        realEstateAppreciation: 10,
        realEstateRent: 7,
        ebitdaFactor: investment.ebitdaFactor
      }
    };

    setWhatIfScenario(scenarios[scenarioType]);
  };

  // Chart visibility toggle functions
  const togglePatrimonyChartElement = (element: keyof PatrimonyChartVisibility) => {
    setPatrimonyChartVisibility(prev => ({
      ...prev,
      [element]: !prev[element]
    }));
  };

  const toggleIncomeChartElement = (element: keyof IncomeChartVisibility) => {
    setIncomeChartVisibility(prev => ({
      ...prev,
      [element]: !prev[element]
    }));
  };

  const toggleCashFlowChartElement = (element: keyof CashFlowChartVisibility) => {
    setCashFlowChartVisibility(prev => ({
      ...prev,
      [element]: !prev[element]
    }));
  };

  const toggleComparisonChartElement = (element: keyof ComparisonChartVisibility) => {
    setComparisonChartVisibility(prev => ({
      ...prev,
      [element]: !prev[element]
    }));
  };

  const toggleWithdrawalPlanChartElement = (element: keyof WithdrawalPlanChartVisibility) => {
    setWithdrawalPlanChartVisibility(prev => ({
      ...prev,
      [element]: !prev[element]
    }));
  };

  // Reset chart visibility functions
  const resetPatrimonyChartVisibility = () => {
    setPatrimonyChartVisibility(defaultPatrimonyChartVisibility);
  };

  const resetIncomeChartVisibility = () => {
    setIncomeChartVisibility(defaultIncomeChartVisibility);
  };

  const resetCashFlowChartVisibility = () => {
    setCashFlowChartVisibility(defaultCashFlowChartVisibility);
  };

  const resetComparisonChartVisibility = () => {
    setComparisonChartVisibility(defaultComparisonChartVisibility);
  };

  const resetWithdrawalPlanChartVisibility = () => {
    setWithdrawalPlanChartVisibility(defaultWithdrawalPlanChartVisibility);
  };

  const togglePresentationMode = () => {
    setPresentationMode(prev => !prev);
  };

  const saveScenario = (name: string) => {
    const newScenario = {
      id: Date.now().toString(),
      name,
      investment: { ...investment }
    };
    setSavedScenarios(prev => [...prev, newScenario]);
  };

  const loadScenario = (id: string) => {
    const scenario = savedScenarios.find(s => s.id === id);
    if (scenario) {
      setInvestment(scenario.investment);
    }
  };

  const deleteScenario = (id: string) => {
    setSavedScenarios(prev => prev.filter(s => s.id !== id));
  };

  const value: CalculatorContextType = {
    investment,
    results,
    updateInvestment,
    toggleReinvest,
    toggleContributions,
    toggleLemonPrice,
    toggleTaxes,
    togglePartialCashOut,
    updateCashOutPercentage,
    updateYearlyCashOutPercentage,
    resetYearlyCashOutPercentages,
    setDefaultYearlyCashOutPercentage,
    resetCalculator,
    setUtilityScenario,
    whatIfScenario,
    whatIfResults,
    setWhatIfScenario,
    clearWhatIfScenario,
    applyPredefinedScenario,
    patrimonyChartVisibility,
    incomeChartVisibility,
    cashFlowChartVisibility,
    comparisonChartVisibility,
    withdrawalPlanChartVisibility,
    togglePatrimonyChartElement,
    toggleIncomeChartElement,
    toggleCashFlowChartElement,
    toggleComparisonChartElement,
    toggleWithdrawalPlanChartElement,
    resetPatrimonyChartVisibility,
    resetIncomeChartVisibility,
    resetCashFlowChartVisibility,
    resetComparisonChartVisibility,
    resetWithdrawalPlanChartVisibility,
    presentationMode,
    togglePresentationMode,
    savedScenarios,
    saveScenario,
    loadScenario,
    deleteScenario
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
};

export const useCalculator = (): CalculatorContextType => {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
};