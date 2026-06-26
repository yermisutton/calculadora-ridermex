import { Investment, InvestmentResults } from '../types';
import { getDetailedCertificateEvolution } from './calculations/certificateEvolution';
import {
  calculateAlternativeInvestmentPatrimony,
  calculateAlternativeInvestmentIncome,
  calculateCETESInvestment,
  calculateSavingsInvestment,
  calculateRealEstateInvestment,
  calculateCustomInvestment
} from './calculations/comparativeInvestments';
import {
  calculateAllPerformanceMetrics
} from './calculations/performanceMetrics';
import {
  adjustPatrimonyForInflation,
  adjustIncomeForInflation
} from './calculations/inflationAdjustments';

export function calculateResults(investment: Investment): InvestmentResults {
  try {
    // Guard clause: ensure investment object exists and has required properties
    if (!investment) {
      throw new Error('Investment object is undefined');
    }

    if (typeof investment.initialCertificates === 'undefined') {
      throw new Error('Investment initialCertificates is undefined');
    }

    if (typeof investment.certificateBasePrice === 'undefined') {
      throw new Error('Investment certificateBasePrice is undefined');
    }

    // Get detailed certificate evolution
    const certificateEvolution = getDetailedCertificateEvolution(investment);

    if (!certificateEvolution || certificateEvolution.length === 0) {
      throw new Error('No certificate evolution data available');
    }

    // Get final year data
    const finalYearData = certificateEvolution[certificateEvolution.length - 1];

    // Calculate basic metrics
    // For products with initial payment (like RiderMex), use the actual down payment
    // Otherwise, calculate as certificates * price
    const model = investment.ridermexProductType;
    const isRidermex = !!model;
    const numTickets = investment.initialCertificates || 1;
    const finalPricePerTicket = investment.certificateBasePrice;
    const totalInitialCost = finalPricePerTicket * numTickets;
    const isFinanced = model === 'B' || model === 'D';
    const downPayment = investment.initialPayment;
    const financingMonths = investment.ridermexFinancingMonths || 0;

    const initialInvestment = investment.initialPayment > 0
      ? investment.initialPayment
      : investment.initialCertificates * investment.certificateBasePrice;

    const totalInvestedAtEnd = isRidermex && isFinanced
      ? totalInitialCost
      : initialInvestment;

    const finalPatrimony = finalYearData.citrusPatrimony + (finalYearData.availableForReinvestment || 0);
    const finalMonthlyIncome = finalYearData.citrusIncome / 12;
    
    // Calculate certificates summary
    const certificatesSummary = {
      initialCertificates: investment.initialCertificates,
      fromReinvestment: finalYearData.certificatesFromReinvestment,
      totalCertificates: finalYearData.totalCertificates
    };
    
    // Calculate total cash out (all withdrawn cash, whether from partial cashout or no reinvestment)
    const totalCashOut = certificateEvolution.reduce((sum, data) => sum + (data.yearlyCashOutAmount || 0), 0);

    // Calculate performance metrics using centralized module
    const years = investment.years;
    const yearlyUtilityData = certificateEvolution.map(data => ({
      year: data.year,
      totalUtility: data.totalUtility
    }));

    const performanceMetrics = calculateAllPerformanceMetrics(
      finalPatrimony,
      finalMonthlyIncome,
      totalInvestedAtEnd,
      years,
      yearlyUtilityData,
      totalCashOut
    );

    const { capitalMultiplier, cagr, irr, paybackYear, roi, totalProfit, passiveIncomeEfficiency: calculatedPassiveIncomeEfficiency } = performanceMetrics;
    
    // Calculate comparative investments considering cash out percentage
    const cetesPatrimony = calculateAlternativeInvestmentPatrimony(
      totalInvestedAtEnd,
      investment.cetesRate,
      years,
      investment
    );
    const savingsPatrimony = calculateAlternativeInvestmentPatrimony(
      totalInvestedAtEnd,
      investment.savingsRate,
      years,
      investment
    );
    const realEstatePatrimony = calculateAlternativeInvestmentPatrimony(
      totalInvestedAtEnd,
      investment.realEstateRate || investment.realEstateAppreciation,
      years,
      investment
    );
    const customInvestmentPatrimony = calculateAlternativeInvestmentPatrimony(
      totalInvestedAtEnd,
      investment.customInvestmentRate || 8.0,
      years,
      investment
    );

    // Calculate real values (inflation-adjusted) using centralized module
    const realFinalPatrimony = adjustPatrimonyForInflation(finalPatrimony, investment.inflationRate, years);
    const realCetesPatrimony = adjustPatrimonyForInflation(cetesPatrimony, investment.inflationRate, years);
    const realSavingsPatrimony = adjustPatrimonyForInflation(savingsPatrimony, investment.inflationRate, years);
    const realRealEstatePatrimony = adjustPatrimonyForInflation(realEstatePatrimony, investment.inflationRate, years);
    const realCustomInvestmentPatrimony = adjustPatrimonyForInflation(customInvestmentPatrimony, investment.inflationRate, years);
    
    // Calculate EBITDA value
    const finalEbitdaValue = finalYearData.totalUtility * investment.ebitdaFactor;
    
    // Calculate calculated annual profit percentage
    const calculatedAnnualProfitPercentage = isRidermex
      ? investment.averageSalePricePerKg
      : (investment.averageProductionPerHectare * investment.averageSalePricePerKg * 0.1 * 0.65 / investment.certificateBasePrice) * 100;
    
    // Calculate first year utility and price differential for long-term calculator
    const firstYearUtility = investment.isLongTermCalculator ? 
      (investment.averageProductionPerHectare * investment.averageSalePricePerKg * 0.1 * 0.65) : 0;
    const priceDifferential = investment.isLongTermCalculator ? 
      investment.certificateBasePrice * 0.25 : 0;
    
    // Prepare yearly data
    const monthlyPayment = isFinanced && financingMonths > 0 
      ? Math.max(0, totalInitialCost - downPayment) / financingMonths 
      : 0;

    const yearlyData = certificateEvolution.map(data => {
      const yearContributedCapital = isRidermex && isFinanced
        ? downPayment + Math.min(data.year * 12, financingMonths) * monthlyPayment
        : initialInvestment;

      return {
        year: data.year,
        citrusPatrimony: data.citrusPatrimony,
        citrusIncome: data.citrusIncome,
        certificatesFromReinvestment: data.certificatesFromReinvestment,
        reinvestmentFund: data.reinvestmentFund,
        availableCashFlow: data.totalUtility - (data.yearlyCashOutAmount || 0),
        partialCashOutAmount: data.yearlyCashOutAmount,
        yearlyReinvestmentContribution: data.yearlyReinvestmentContribution,
        cumulativeReinvestmentContribution: data.cumulativeReinvestmentContribution,
        cumulativeTotalUtility: data.cumulativeTotalUtility,
        contributedCapital: yearContributedCapital,
        
        // Calculate comparative investments for this year considering cash out percentage
        cetesPatrimony: calculateAlternativeInvestmentPatrimony(
          totalInvestedAtEnd,
          investment.cetesRate,
          data.year,
          investment
        ),
        savingsPatrimony: calculateAlternativeInvestmentPatrimony(
          totalInvestedAtEnd,
          investment.savingsRate,
          data.year,
          investment
        ),
        realEstatePatrimony: calculateAlternativeInvestmentPatrimony(
          totalInvestedAtEnd,
          investment.realEstateRate || investment.realEstateAppreciation,
          data.year,
          investment
        ),
        customInvestmentPatrimony: calculateAlternativeInvestmentPatrimony(
          totalInvestedAtEnd,
          investment.customInvestmentRate || 8.0,
          data.year,
          investment
        ),

        // Calculate income from comparative investments considering cash out percentage
        cetesIncome: (() => {
          const patrimony = calculateAlternativeInvestmentPatrimony(totalInvestedAtEnd, investment.cetesRate, data.year, investment);
          return calculateAlternativeInvestmentIncome(patrimony, totalInvestedAtEnd, investment.cetesRate, investment);
        })(),
        savingsIncome: (() => {
          const patrimony = calculateAlternativeInvestmentPatrimony(totalInvestedAtEnd, investment.savingsRate, data.year, investment);
          return calculateAlternativeInvestmentIncome(patrimony, totalInvestedAtEnd, investment.savingsRate, investment);
        })(),
        realEstateIncome: (() => {
          const patrimony = calculateAlternativeInvestmentPatrimony(totalInvestedAtEnd, investment.realEstateRate || investment.realEstateAppreciation, data.year, investment);
          return calculateAlternativeInvestmentIncome(patrimony, totalInvestedAtEnd, investment.realEstateRent, investment);
        })(),
        customInvestmentIncome: (() => {
          const patrimony = calculateAlternativeInvestmentPatrimony(totalInvestedAtEnd, investment.customInvestmentRate || 8.0, data.year, investment);
          return calculateAlternativeInvestmentIncome(patrimony, totalInvestedAtEnd, investment.customInvestmentRate || 8.0, investment);
        })(),

        // Calculate taxes if applicable
        cetesTaxes: (() => {
          if (!investment.applyTaxes) return 0;
          const patrimony = calculateAlternativeInvestmentPatrimony(totalInvestedAtEnd, investment.cetesRate, data.year, investment);
          const income = calculateAlternativeInvestmentIncome(patrimony, totalInvestedAtEnd, investment.cetesRate, investment);
          return income * (investment.taxRate / 100);
        })(),
        savingsTaxes: (() => {
          if (!investment.applyTaxes) return 0;
          const patrimony = calculateAlternativeInvestmentPatrimony(totalInvestedAtEnd, investment.savingsRate, data.year, investment);
          const income = calculateAlternativeInvestmentIncome(patrimony, totalInvestedAtEnd, investment.savingsRate, investment);
          return income * (investment.taxRate / 100);
        })(),
        realEstateTaxes: (() => {
          if (!investment.applyTaxes) return 0;
          const patrimony = calculateAlternativeInvestmentPatrimony(totalInvestedAtEnd, investment.realEstateRate || investment.realEstateAppreciation, data.year, investment);
          const income = calculateAlternativeInvestmentIncome(patrimony, totalInvestedAtEnd, investment.realEstateRent, investment);
          return income * (investment.taxRate / 100);
        })(),
        customInvestmentTaxes: (() => {
          if (!investment.applyTaxes) return 0;
          const patrimony = calculateAlternativeInvestmentPatrimony(totalInvestedAtEnd, investment.customInvestmentRate || 8.0, data.year, investment);
          const income = calculateAlternativeInvestmentIncome(patrimony, totalInvestedAtEnd, investment.customInvestmentRate || 8.0, investment);
          return income * (investment.taxRate / 100);
        })(),

        // Calculate real values (inflation-adjusted) using centralized module
        realCitrusPatrimony: adjustPatrimonyForInflation(data.citrusPatrimony, investment.inflationRate, data.year),
        realCetesPatrimony: adjustPatrimonyForInflation(calculateAlternativeInvestmentPatrimony(totalInvestedAtEnd, investment.cetesRate, data.year, investment), investment.inflationRate, data.year),
        realSavingsPatrimony: adjustPatrimonyForInflation(calculateAlternativeInvestmentPatrimony(investment.initialPayment > 0 ? investment.initialPayment : investment.initialCertificates * investment.certificateBasePrice, investment.savingsRate, data.year, investment), investment.inflationRate, data.year),
        realEstateRealPatrimony: adjustPatrimonyForInflation(calculateAlternativeInvestmentPatrimony(totalInvestedAtEnd, investment.realEstateRate || investment.realEstateAppreciation, data.year, investment), investment.inflationRate, data.year),
        realCustomInvestmentPatrimony: adjustPatrimonyForInflation(calculateAlternativeInvestmentPatrimony(totalInvestedAtEnd, investment.customInvestmentRate || 8.0, data.year, investment), investment.inflationRate, data.year),

        // Calculate real income using centralized module
        realCitrusIncome: adjustIncomeForInflation(data.citrusIncome, investment.inflationRate, data.year),
        realCetesIncome: (() => {
          const patrimony = calculateAlternativeInvestmentPatrimony(totalInvestedAtEnd, investment.cetesRate, data.year, investment);
          const income = calculateAlternativeInvestmentIncome(patrimony, totalInvestedAtEnd, investment.cetesRate, investment);
          return adjustIncomeForInflation(income, investment.inflationRate, data.year);
        })(),
        realSavingsIncome: (() => {
          const patrimony = calculateAlternativeInvestmentPatrimony(totalInvestedAtEnd, investment.savingsRate, data.year, investment);
          const income = calculateAlternativeInvestmentIncome(patrimony, totalInvestedAtEnd, investment.savingsRate, investment);
          return adjustIncomeForInflation(income, investment.inflationRate, data.year);
        })(),
        realEstateRealIncome: (() => {
          const patrimony = calculateAlternativeInvestmentPatrimony(totalInvestedAtEnd, investment.realEstateRate || investment.realEstateAppreciation, data.year, investment);
          const income = calculateAlternativeInvestmentIncome(patrimony, totalInvestedAtEnd, investment.realEstateRent, investment);
          return adjustIncomeForInflation(income, investment.inflationRate, data.year);
        })(),
        realCustomInvestmentIncome: (() => {
          const patrimony = calculateAlternativeInvestmentPatrimony(totalInvestedAtEnd, investment.customInvestmentRate || 8.0, data.year, investment);
          const income = calculateAlternativeInvestmentIncome(patrimony, totalInvestedAtEnd, investment.customInvestmentRate || 8.0, investment);
          return adjustIncomeForInflation(income, investment.inflationRate, data.year);
        })(),

      // EBITDA value
      ebitdaValue: data.totalUtility * investment.ebitdaFactor,
      
      // Cash flow calculations
      cetesCashFlow: (() => {
        const patrimony = calculateAlternativeInvestmentPatrimony(initialInvestment, investment.cetesRate, data.year, investment);
        const income = calculateAlternativeInvestmentIncome(patrimony, initialInvestment, investment.cetesRate, investment);
        return data.year === 1 ? -initialInvestment + income : income;
      })(),
      savingsCashFlow: (() => {
        const patrimony = calculateAlternativeInvestmentPatrimony(initialInvestment, investment.savingsRate, data.year, investment);
        const income = calculateAlternativeInvestmentIncome(patrimony, initialInvestment, investment.savingsRate, investment);
        return data.year === 1 ? -initialInvestment + income : income;
      })(),
      realEstateCashFlow: (() => {
        const patrimony = calculateAlternativeInvestmentPatrimony(initialInvestment, investment.realEstateRate || investment.realEstateAppreciation, data.year, investment);
        const income = calculateAlternativeInvestmentIncome(patrimony, initialInvestment, investment.realEstateRent, investment);
        return data.year === 1 ? -initialInvestment + income : income;
      })(),
      customInvestmentCashFlow: (() => {
        const patrimony = calculateAlternativeInvestmentPatrimony(initialInvestment, investment.customInvestmentRate || 8.0, data.year, investment);
        const income = calculateAlternativeInvestmentIncome(patrimony, initialInvestment, investment.customInvestmentRate || 8.0, investment);
        return data.year === 1 ? -initialInvestment + income : income;
      })(),

      // Additional fields for partial cash out
      yearCashOutPercentage: investment.partialCashOut ? 
        (investment.yearlyCashOutPercentages && investment.yearlyCashOutPercentages[data.year - 1] !== undefined ? 
          investment.yearlyCashOutPercentages[data.year - 1] : investment.cashOutPercentage) : 0
    };
  });
    
    // Use calculated passive income efficiency from performance metrics
    const passiveIncomeEfficiency = calculatedPassiveIncomeEfficiency;

    // Calculate monthly income for comparative investments (from final year)
    const finalYearComparative = yearlyData[yearlyData.length - 1];
    const cetesMonthlyIncome = finalYearComparative.cetesIncome / 12;
    const savingsMonthlyIncome = finalYearComparative.savingsIncome / 12;
    const realEstateMonthlyIncome = finalYearComparative.realEstateIncome / 12;

    // Total profit and ROI already calculated in performance metrics

    return {
      finalMonthlyIncome,
      finalPatrimony,
      capitalMultiplier,
      cagr,
      irr,
      paybackYear,
      certificatesSummary,
      passiveIncomeEfficiency,
      cetesPatrimony,
      savingsPatrimony,
      realEstatePatrimony,
      customInvestmentPatrimony,
      cetesMonthlyIncome,
      savingsMonthlyIncome,
      realEstateMonthlyIncome,
      customInvestmentMonthlyIncome: customInvestmentPatrimony * ((investment.customInvestmentRate || 8.0) / 100) / 12,
      realFinalPatrimony,
      realCetesPatrimony,
      realSavingsPatrimony,
      realRealEstatePatrimony,
      realCustomInvestmentPatrimony,
      finalEbitdaValue,
      totalCashOut,
      calculatedAnnualProfitPercentage,
      firstYearUtility,
      priceDifferential,
      totalProfit,
      roi,
      yearlyData
    };
  } catch (error) {
    console.error('Error in calculateResults:', error);
    throw error;
  }
}