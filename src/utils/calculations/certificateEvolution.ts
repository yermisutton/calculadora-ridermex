import { Investment, InvestmentResults } from '../../types';
import { RIDERMEX_CONFIG, getPriceForTicketNumber } from '../../data/ridermexConfig';

export interface CertificateStatus {
  id: number;
  status: 'reserved' | 'waiting' | 'growing' | 'producing';
  reservedYear: number;
  maturationYear?: number;
  yearPaidOff?: number;
  remainingPayment: number;
  paymentYearsRemaining?: number;
  details: string;
  isContingency?: boolean;
  initialPrice?: number;
}

export interface YearEvolutionData {
  year: number;
  date: string;
  certificatePrice: number;
  certificates: CertificateStatus[];
  totalUtility: number;
  reinvestmentFund: number;
  availableForReinvestment: number;
  newCertificateIds: number[];
  reservedCertificateIds: number[];
  payments: { id: number; amount: number }[];
  // New fields for integration with main calculations
  totalCertificates: number; // All certificates (fully paid + reserved)
  certificatesFromReinvestment: number; // Cumulative certificates from reinvestment
  citrusPatrimony: number; // Total patrimony value
  citrusIncome: number; // Annual income from producing certificates
  // New fields for cash out tracking
  yearlyCashOutAmount: number; // Amount withdrawn this year
  cumulativeCashOutAmount: number; // Total amount withdrawn so far
  yearlyReinvestmentContribution: number; // Amount contributed to reinvestment fund this year
  cumulativeReinvestmentContribution: number; // Cumulative amount contributed to reinvestment fund
  cumulativeTotalUtility: number; // Cumulative total utility generated
  // New fields for payment boost
  paymentBoostActive: boolean; // Whether payment boost is active this year
  paymentBoostAmount: number; // Amount added by payment boost this year
  // New fields for Propuesta Cosecha & Citrus
  citrusExtraUtility?: number; // Extra utility for Citrus (from price increase and first year)
  citrusNetUtility?: number; // Net utility for Citrus after commissions
  citrusReinvestmentContribution?: number; // Amount Citrus reinvests
  citrusCertificatesFromReinvestment?: number; // Certificates Citrus acquires through reinvestment
  citrusTotalCertificates?: number; // Total certificates owned by Citrus
}

export function getDetailedCertificateEvolution(
  investment: Investment,
  initialCertificatesOverride?: number,
  yearsOverride?: number,
  forceReinvestmentDuringMaturation = false,
  monthlyContributionOverride?: number, // Add monthlyContribution as a parameter
  firstIncomeMonthOverride?: number // RiderMex first income month (1, 7, or 18)
): YearEvolutionData[] {
  try {
    // Guard clause: ensure investment exists
    if (!investment) {
      throw new Error('Investment object is undefined in getDetailedCertificateEvolution');
    }

    const {
      certificateBasePrice,
      reinvestProfits,
      marketGrowthRate = 5, // 5% annual growth for RiderMex utilities
      enableMarketGrowth = true,
      partialCashOut,
      cashOutPercentage,
      yearlyCashOutPercentages,
      isLongTermCalculator,
      firstYearUtilityToUser,
      commissionRate = 0.05,
      citrusReinvestment = true,
      citrusReinvestmentPercentages = Array(30).fill(100),
      currencyFormat,
      exchangeRate,
      exchangeRateEUR,
      inflationRate = 3.5, // Default to 3.5% inflation
      monthlyContribution, // Get monthlyContribution from investment
      applyTaxes,
      taxRate,
      additionalContributions,
      ridermexFirstMonthlyIncome = 7, // Default to Type B (month 7)
      ridermexProductType, // Detect if this is a Ridermex investment
      lemonPriceIncrease = 1.5,
      increaseLemonPrice = true
    } = investment;

    // Dynamic price appreciation/growth rate (inflation + motorcycle price increase)
    const annualPriceGrowthRate = (increaseLemonPrice ? lemonPriceIncrease : 0) + (inflationRate || 0);
    const growthFactor = 1 + annualPriceGrowthRate / 100;

    // Determine if this is a Ridermex investment (no 5-year waiting period)
    const isRidermex = !!ridermexProductType;

    // Use override if provided, otherwise use investment.monthlyContribution
    const effectiveMonthlyContribution = monthlyContributionOverride !== undefined ? monthlyContributionOverride : monthlyContribution;

    // Use overrides if provided
    const initialCertificates = initialCertificatesOverride !== undefined ?
      initialCertificatesOverride : investment.initialCertificates;

    const years = yearsOverride !== undefined ?
      yearsOverride : investment.years;

    // Validate required values
    if (typeof initialCertificates === 'undefined' || initialCertificates === null) {
      throw new Error('initialCertificates is undefined or null');
    }

    if (typeof years === 'undefined' || years === null) {
      throw new Error('years is undefined or null');
    }

    if (typeof certificateBasePrice === 'undefined' || certificateBasePrice === null) {
      throw new Error('certificateBasePrice is undefined or null');
    }

    const currencyTolerance = 0.01;

    // Determine waiting period based on RiderMex product type or general calculator type
    let waitingPeriod = isLongTermCalculator ? 5 : 4;

    if (isRidermex) {
      if (ridermexProductType === 'A') {
        waitingPeriod = 1;
      } else if (ridermexProductType === 'B') {
        waitingPeriod = 2;
      } else if (ridermexProductType === 'C') {
        waitingPeriod = 0;
      } else if (ridermexProductType === 'D') {
        waitingPeriod = Math.ceil(((investment.ridermexFinancingMonths || 48) + 7 - 1) / 12);
      }
    } else {
      const effectiveFirstIncomeMonth = firstIncomeMonthOverride !== undefined ? firstIncomeMonthOverride : ridermexFirstMonthlyIncome;
      if (effectiveFirstIncomeMonth === 1) {
        waitingPeriod = 0;
      } else if (effectiveFirstIncomeMonth === 7) {
        waitingPeriod = 1;
      } else if (effectiveFirstIncomeMonth === 18) {
        waitingPeriod = 2;
      }
    }

    // Additional safety check for Traditional Calculator
    const isTraditionalCalculator = !reinvestProfits && !firstYearUtilityToUser;
    const effectiveWaitingPeriod = isTraditionalCalculator ? 4 : waitingPeriod;

    // Calculate payment period based on Ridermex financing months
    // For RiderMex:
    //   - Modelo A (12 months) = 1 year financing
    //   - Modelo B (0 months) = immediate payment, no financing
    //   - Modelo C (0 months) = immediate payment, no financing
    // For non-RiderMex: default to 4 years
    const paymentPeriod = investment.ridermexFinancingMonths !== undefined
      ? investment.ridermexFinancingMonths / 12  // Convert months to years (0 months = 0 years = immediate)
      : 4; // Default 4 years for non-Ridermex

    const effectiveCertificateBasePrice = isLongTermCalculator ?
      certificateBasePrice * 1.25 : certificateBasePrice;

    let evolutionData: YearEvolutionData[] = [];
    
    // Initialize certificates array
    const certificates: {
      id: number;
      reservedYear: number;
      maturationYear?: number;
      yearPaidOff?: number;
      initialPrice: number;
      remainingPayment: number;
      paymentYearsRemaining: number;
      status: 'reserved' | 'waiting' | 'growing' | 'producing';
      annualPaymentDue?: number;
    }[] = [];

    let totalInitialCost = 0;
    for (let i = 0; i < initialCertificates; i++) {
      const certificatePrice = effectiveCertificateBasePrice;
      totalInitialCost += certificatePrice;
    }

    const initialPaymentPerCertificate = investment.initialPayment / initialCertificates;

    for (let i = 0; i < initialCertificates; i++) {
      const certificatePrice = effectiveCertificateBasePrice;

      const remainingPaymentPerCertificate = Math.max(0, certificatePrice - initialPaymentPerCertificate);
      const isPaid = remainingPaymentPerCertificate < currencyTolerance;

      const isInitialRidermex = isRidermex;
      const isContado = ridermexProductType === 'A' || ridermexProductType === 'C';
      const treatAsPaid = !isRidermex ? isPaid : isContado;

      const financingMonths = investment.ridermexFinancingMonths || 0;
      let mesInicioRendimientos = 7;
      if (ridermexProductType === 'A') {
        mesInicioRendimientos = 7;
      } else if (ridermexProductType === 'B') {
        mesInicioRendimientos = 19;
      } else if (ridermexProductType === 'C') {
        mesInicioRendimientos = 2;
      } else if (ridermexProductType === 'D') {
        mesInicioRendimientos = financingMonths + 7;
      } else {
        mesInicioRendimientos = effectiveWaitingPeriod * 12 + 1;
      }

      const maturationYear = isInitialRidermex
        ? Math.ceil(mesInicioRendimientos / 12)
        : 1 + effectiveWaitingPeriod;

      const yearPaidOff = treatAsPaid ? 1 : undefined;

      certificates.push({
        id: i + 1,
        reservedYear: 1,
        maturationYear: maturationYear,
        yearPaidOff: yearPaidOff,
        initialPrice: certificatePrice,
        remainingPayment: treatAsPaid ? 0 : remainingPaymentPerCertificate,
        paymentYearsRemaining: 0,
        status: treatAsPaid ? 'waiting' : 'reserved',
        annualPaymentDue: 0
      });
    }

    const mesInicioRendimientosGlobal = isRidermex
      ? (ridermexProductType === 'A'
          ? 7
          : ridermexProductType === 'B'
          ? 19
          : ridermexProductType === 'C'
          ? 2
          : ridermexProductType === 'D'
          ? (investment.ridermexFinancingMonths || 48) + 7
          : 7)
      : (effectiveWaitingPeriod * 12 + 1);

    let nextCertificateId = initialCertificates + 1;
    let liquidCashForReinvestment = Math.max(0, investment.initialPayment - totalInitialCost);
    let totalAccumulatedReinvestmentFunds = 0;
    let certificatesFromReinvestment = 0;
    let totalCashOut = 0;
    let cumulativeReinvestmentContribution = 0;
    let cumulativeTotalUtility = 0;

    // Citrus tracking
    let citrusExtraUtilityTotal = 0;
    let citrusNetUtilityTotal = 0;
    let citrusCertificatesFromReinvestment = 0;
    let citrusReinvestmentFund = 0;

    for (let year = 1; year <= years; year++) {
      // Update remaining payment for initial certificates based on external financing payments
      const financingMonths = investment.ridermexFinancingMonths || 0;
      if (isRidermex && financingMonths > 0) {
        certificates.forEach(cert => {
          if (cert.id <= initialCertificates) {
            const initialRemaining = cert.initialPrice - initialPaymentPerCertificate;
            if (initialRemaining > 0) {
              const monthsElapsed = year * 12;
              const remainingDebtRatio = Math.max(0, 1 - Math.min(monthsElapsed, financingMonths) / financingMonths);
              cert.remainingPayment = initialRemaining * remainingDebtRatio;
              if (cert.remainingPayment < currencyTolerance) {
                cert.remainingPayment = 0;
                if (!cert.yearPaidOff) {
                  cert.yearPaidOff = year;
                }
              }
            }
          }
        });
      }

      // Initialize shouldReinvest at the beginning of each year loop
      let shouldReinvest = false;
      
      let certificatePrice: number;

      const adjustedBasePrice = effectiveCertificateBasePrice;

      if (isRidermex) {
        certificatePrice = 120000 * Math.pow(growthFactor, year - 1);
      } else {
        if (year === 1) {
          certificatePrice = adjustedBasePrice * 1.50;
        } else {
          const yearOnePrice = adjustedBasePrice * 1.50;
          certificatePrice = yearOnePrice * Math.pow(growthFactor, year - 1);
        }
      }

      let newCertificateIds: number[] = [];
      let reservedCertificateIds: number[] = [];
      let payments: { id: number; amount: number }[] = [];
      let yearlyCashOutAmount = 0;
      let yearlyReinvestmentContribution = 0;
      let citrusReinvestmentContribution = 0;
      let paymentBoostActive = false;
      let paymentBoostAmount = 0;

      // Add user's monthly contributions to the liquid cash available for payments
      if (investment.additionalContributions) {
        liquidCashForReinvestment += effectiveMonthlyContribution * 12; // Annualize monthly contribution
      }

      let yearUtility = 0;
      let yearUtilityFullYear = 0;
      certificates.forEach(cert => {
        const productionStartYear = cert.maturationYear || (cert.reservedYear + effectiveWaitingPeriod);
        const isFullyPaid = cert.remainingPayment < currencyTolerance;
        const hasMatured = year >= productionStartYear;

        const canProduce = isFullyPaid && hasMatured;
        if (canProduce) {
          const scenario = investment.ridermexScenario || 'moderate';
          const scenarioConfig = RIDERMEX_CONFIG.SCENARIOS[scenario];

          let annualUtilityPerCertificate = scenarioConfig.annualReturnPerTicket;

          const yearsFromFirstPurchase = cert.reservedYear - 1;
          const discountPercentage = yearsFromFirstPurchase * 2;
          const yieldMultiplier = Math.max(0, 1 - (discountPercentage / 100));
          annualUtilityPerCertificate = annualUtilityPerCertificate * yieldMultiplier;

          if (enableMarketGrowth && marketGrowthRate > 0) {
            const yearsOfGrowth = year - (cert.reservedYear - 1);
            if (yearsOfGrowth > 0) {
              annualUtilityPerCertificate = annualUtilityPerCertificate * Math.pow(1 + marketGrowthRate / 100, yearsOfGrowth);
            }
          }

          yearUtilityFullYear += annualUtilityPerCertificate;

          if (isRidermex && cert.id <= initialCertificates) {
            const firstMonthOfYear = (year - 1) * 12 + 1;
            const lastMonthOfYear = year * 12;

            let monthsProducingInYear = 0;
            if (mesInicioRendimientosGlobal <= lastMonthOfYear) {
              const startMonth = Math.max(mesInicioRendimientosGlobal, firstMonthOfYear);
              monthsProducingInYear = lastMonthOfYear - startMonth + 1;
            }

            const proportionOfYear = monthsProducingInYear / 12;
            annualUtilityPerCertificate = annualUtilityPerCertificate * proportionOfYear;
          }

          yearUtility += annualUtilityPerCertificate;
        }
      });

      // Determine how much of this year's utility goes to reinvestment fund
      let currentYearReinvestmentContribution = 0;
      shouldReinvest = reinvestProfits || (forceReinvestmentDuringMaturation && year <= effectiveWaitingPeriod);

      if (yearUtility > 0 && shouldReinvest) {
        const yearIndex = year - 1;
        const yearPercentage = yearlyCashOutPercentages && yearlyCashOutPercentages[yearIndex] !== undefined
          ? yearlyCashOutPercentages[yearIndex]
          : cashOutPercentage;

        if (yearPercentage > 0) {
          const cashOutAmount = yearUtility * (yearPercentage / 100);
          yearlyCashOutAmount = cashOutAmount;
          totalCashOut += cashOutAmount;
          currentYearReinvestmentContribution = yearUtility - cashOutAmount;
        } else {
          currentYearReinvestmentContribution = yearUtility;
        }
      }

      yearlyReinvestmentContribution = currentYearReinvestmentContribution;
      cumulativeReinvestmentContribution += currentYearReinvestmentContribution;
      cumulativeTotalUtility += yearUtility;

      const maxTotalCertificatesAllowed = RIDERMEX_CONFIG.TOTAL_TICKETS;
      const nextTicketNumber = certificates.length + 1;
      const precioTicketCompra = isRidermex ? certificatePrice : getPriceForTicketNumber(Math.min(nextTicketNumber, RIDERMEX_CONFIG.TOTAL_TICKETS));

      if (shouldReinvest && currentYearReinvestmentContribution > 0) {
        const gananciaMensual = yearUtilityFullYear / 12;

        for (let mes = 1; mes <= 12; mes++) {
          const mesAbsoluto = (year - 1) * 12 + mes;

          // Only accumulate in months that produce income
          if (mesAbsoluto >= mesInicioRendimientosGlobal || year > Math.ceil(mesInicioRendimientosGlobal / 12)) {
            liquidCashForReinvestment += gananciaMensual;
          } else {
            continue;
          }

          // CRITICAL: Process only ONE certificate in payment at a time
          const certInPayment = certificates.find(c => c.id > initialCertificates && c.remainingPayment > currencyTolerance);

          if (certInPayment && liquidCashForReinvestment > 0) {
            // Pay down this certificate
            if (liquidCashForReinvestment >= certInPayment.remainingPayment) {
              const pagoFinal = certInPayment.remainingPayment;
              liquidCashForReinvestment -= pagoFinal;
              certInPayment.remainingPayment = 0;
              certInPayment.paymentYearsRemaining = 0;
              certInPayment.yearPaidOff = year;
              certInPayment.status = 'waiting';
              newCertificateIds.push(certInPayment.id);
              payments.push({ id: certInPayment.id, amount: pagoFinal });
              certificatesFromReinvestment++;
            } else {
              // Insufficient cash for full payment; accumulate for next month
              certInPayment.remainingPayment -= liquidCashForReinvestment;
              payments.push({ id: certInPayment.id, amount: liquidCashForReinvestment });
              liquidCashForReinvestment = 0;
            }
          }
        }

        // AFTER the month loop: Reserve NEXT certificate ONLY if previous is fully paid
        // and we have enough accumulated cash
        const anyInPayment = certificates.some(c => c.id > initialCertificates && c.remainingPayment > currencyTolerance);
        if (!anyInPayment && certificates.length < maxTotalCertificatesAllowed && liquidCashForReinvestment >= precioTicketCompra * 0.5) {
          const matYear = isRidermex ? year + 1 : year + effectiveWaitingPeriod;
          certificates.push({
            id: nextCertificateId,
            reservedYear: year,
            maturationYear: matYear,
            yearPaidOff: undefined,
            initialPrice: precioTicketCompra,
            remainingPayment: precioTicketCompra,
            paymentYearsRemaining: 1,
            status: 'reserved',
            annualPaymentDue: 0
          });
          reservedCertificateIds.push(nextCertificateId);
          nextCertificateId++;
        }
      }
      // STEP 2: PROCESS SCHEDULED AND ACCELERATED PAYMENTS
      certificates.forEach(cert => {
        const productionStartYear = cert.maturationYear || (cert.reservedYear + effectiveWaitingPeriod);

        if (cert.remainingPayment < 0) {
          cert.remainingPayment = 0;
        }

        if (isRidermex) {
          if (year < productionStartYear) {
            cert.status = cert.remainingPayment >= currencyTolerance ? 'reserved' : 'waiting';
          } else if (year === productionStartYear) {
            cert.status = 'growing';
          } else {
            cert.status = 'producing';
          }
        } else {
          if (cert.remainingPayment >= currencyTolerance) {
            cert.status = 'reserved';
          } else if (year < productionStartYear) {
            cert.status = 'waiting';
          } else if (year === productionStartYear) {
            cert.status = 'growing';
          } else {
            cert.status = 'producing';
          }
        }
      });

      // Generate certificate status data
      const certificatesData: CertificateStatus[] = certificates.map(cert => {
        const yearsFromReservation = year - cert.reservedYear;
        // CRÍTICO: El certificado SOLO puede producir si está 100% pagado Y ha completado el período de maduración
        
        // Additional safety check for display
        if (cert.remainingPayment < 0) {
          console.warn(`WARNING: Certificate ${cert.id} has negative remaining payment for display: ${cert.remainingPayment}. Setting to 0.`);
          cert.remainingPayment = 0;
        }
        
        let details = '';
        
        if (cert.status === 'reserved') {
          const percentagePaid = ((cert.initialPrice - cert.remainingPayment) / cert.initialPrice) * 100;
          details = `Certificado ${cert.id} en proceso de pago (${Math.round(percentagePaid)}% pagado) - Apartado año ${cert.reservedYear}`;
        } else if (cert.status === 'waiting') {
          const productionStartYear = cert.maturationYear || (cert.reservedYear + effectiveWaitingPeriod);
          const yearsToProduction = productionStartYear - year;
          details = `Certificado ${cert.id} en período de maduración: ${yearsToProduction} años restantes - Apartado año ${cert.reservedYear}`;
        } else if (cert.status === 'growing') {
          details = `Certificado ${cert.id} iniciando producción (primer año) - Apartado año ${cert.reservedYear}`;
        } else {
          const yearsProducing = cert.maturationYear ? (year - cert.maturationYear) + 1 : 1;
          details = `Certificado ${cert.id} en producción: ${yearsProducing} años - Apartado año ${cert.reservedYear}`;
        }
        
        return {
          id: cert.id,
          status: cert.status,
          reservedYear: cert.reservedYear,
          maturationYear: cert.maturationYear,
          yearPaidOff: cert.yearPaidOff,
          paymentYearsRemaining: cert.paymentYearsRemaining,
          remainingPayment: Math.max(0, cert.remainingPayment),
          initialPrice: cert.initialPrice || certificatePrice,
          details
        };
      });

      // Calculate totals - Patrimony counts ALL certificates (fully paid and in payment)
      const totalCertificates = certificates.length;

      // FIXED: Calculate patrimony for ALL certificates
      // Patrimony = Appreciated Value - Remaining Debt
      let citrusPatrimony = 0;
      let fullyPaidCount = 0;
      let partiallyPaidCount = 0;
      certificates.forEach(cert => {
        const isFullyPaid = cert.remainingPayment < currencyTolerance;

        // Calculate individual certificate appreciation from its purchase year
        const yearsHeld = year - cert.reservedYear;
        let currentValue: number;

        if (isRidermex) {
          // RiderMex: Base value is $120,000 (real ticket cost of $100,000 + $20,000 mature agency plusvalía)
          // It appreciates by the growthFactor every year. No 50% Citrus first-year jump.
          currentValue = 120000 * Math.pow(growthFactor, yearsHeld);
        } else {
          // Citrus: 50% appreciation in the first year, then growthFactor
          if (yearsHeld === 0) {
            currentValue = cert.initialPrice * 1.50;
          } else {
            const yearOneValue = cert.initialPrice * 1.50;
            currentValue = yearOneValue * Math.pow(growthFactor, yearsHeld);
          }
        }

        if (isFullyPaid) {
          // Fully paid: add full appreciated value
          citrusPatrimony += currentValue;
          fullyPaidCount++;
        } else {
          // Still being paid: Net equity = Appreciated Value - Remaining Debt
          const netEquity = currentValue - cert.remainingPayment;
          citrusPatrimony += netEquity;
          partiallyPaidCount++;
        }
      });

      const citrusIncome = yearUtility;

      // FIXED: Count only FULLY PAID certificates from reinvestment (not just reserved)
      // certificatesFromReinvestment should count tickets that:
      // 1. Were acquired through reinvestment (id > initialCertificates)
      // 2. Are FULLY PAID (remainingPayment <= currencyTolerance)
      const fullyPaidFromReinvestment = certificates.filter(cert =>
        cert.id > initialCertificates && cert.remainingPayment < currencyTolerance
      ).length;

      // Format date
      const currentDate = new Date(2026, 0, 1);
      currentDate.setFullYear(currentDate.getFullYear() + year - 1);
      const formattedDate = currentDate.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      evolutionData.push({
        year,
        date: formattedDate,
        certificatePrice,
        certificates: certificatesData,
        totalUtility: yearUtility,
        reinvestmentFund: totalAccumulatedReinvestmentFunds,
        availableForReinvestment: liquidCashForReinvestment,
        newCertificateIds,
        reservedCertificateIds,
        payments,
        totalCertificates,
        certificatesFromReinvestment: fullyPaidFromReinvestment,
        citrusPatrimony,
        citrusIncome,
        yearlyCashOutAmount,
        cumulativeCashOutAmount: totalCashOut,
        yearlyReinvestmentContribution,
        cumulativeReinvestmentContribution,
        cumulativeTotalUtility,
        paymentBoostActive,
        paymentBoostAmount,
        citrusReinvestmentContribution,
        citrusTotalCertificates: citrusCertificatesFromReinvestment
      });
    }


    // Apply present value adjustment if enabled
    if (investment.usePresentValue && inflationRate > 0) {
      evolutionData = evolutionData.map(yearData => ({
        ...yearData,
        totalUtility: yearData.totalUtility / Math.pow(1 + inflationRate / 100, yearData.year),
        citrusIncome: yearData.citrusIncome / Math.pow(1 + inflationRate / 100, yearData.year),
        citrusPatrimony: yearData.citrusPatrimony / Math.pow(1 + inflationRate / 100, yearData.year),
        yearlyCashOutAmount: yearData.yearlyCashOutAmount / Math.pow(1 + inflationRate / 100, yearData.year),
        yearlyReinvestmentContribution: yearData.yearlyReinvestmentContribution / Math.pow(1 + inflationRate / 100, yearData.year),
        cumulativeCashOutAmount: yearData.cumulativeCashOutAmount / Math.pow(1 + inflationRate / 100, yearData.year),
        cumulativeReinvestmentContribution: yearData.cumulativeReinvestmentContribution / Math.pow(1 + inflationRate / 100, yearData.year),
        cumulativeTotalUtility: yearData.cumulativeTotalUtility / Math.pow(1 + inflationRate / 100, yearData.year),
        certificatePrice: yearData.certificatePrice / Math.pow(1 + inflationRate / 100, yearData.year),
        reinvestmentFund: yearData.reinvestmentFund / Math.pow(1 + inflationRate / 100, yearData.year),
        availableForReinvestment: yearData.availableForReinvestment / Math.pow(1 + inflationRate / 100, yearData.year)
      }));
    }

    return evolutionData;
  } catch (error) {
    console.error('Error in getDetailedCertificateEvolution:', error);
    return [];
  }
}

// Helper function to format currency (simplified version)
function formatCurrency(value: number): string {
  try {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(value);
  } catch (error) {
    console.error('Error in formatCurrency:', error);
    return `$${value}`;
  }
}

export function getCertificatePhasesSummary(evolutionData: YearEvolutionData[], targetYear: number): {
  reserved: number;
  waiting: number;
  growing: number;
  producing: number;
} {
  try {
    const targetYearData = evolutionData.find(data => data.year === targetYear);
    
    if (!targetYearData) {
      return { reserved: 0, waiting: 0, growing: 0, producing: 0 };
    }

    const summary = {
      reserved: 0,
      waiting: 0,
      growing: 0,
      producing: 0
    };

    targetYearData.certificates.forEach(cert => {
      summary[cert.status]++;
    });

    return summary;
  } catch (error) {
    console.error('Error in getCertificatePhasesSummary:', error);
    return { reserved: 0, waiting: 0, growing: 0, producing: 0 };
  }
}