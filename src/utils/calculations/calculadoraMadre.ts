export interface TicketStatus {
  id: number;
  purchaseMonth: number;
  purchasePrice: number;
  yieldStartMonth: number;
  purchaseYear: number;
}

export interface YearData {
  year: number;
  totalTickets: number;
  producingTickets: number;
  annualYield: number;
  cumulativeYield: number;
  totalInvested: number;
  appreciatedValue: number;
  remainingDebt: number;
  patrimony: number;
  liquidCash: number;
  withdrawnCash: number;
  roi: number;
}

export interface AmortizationRow {
  month: number;
  payment: number;
  capital: number;
  balance: number;
}

export interface ScenarioResult {
  scenarioName: string;
  motosPerMonth: number;
  yieldBaseYear0: number;
  yearlyData: YearData[];
  finalTickets: number;
  finalPatrimony: number;
  finalYield: number;
  totalInvested: number;
  roi: number;
}

export interface CalculadoraMadreParams {
  model: 'A' | 'B' | 'C' | 'D';
  numTickets: number;
  manualDiscount: number; // base discount selected by user
  downPayment: number; // initial down payment (min $10,000 for B and D)
  financingMonths: number; // term months (12 for B, up to 48 for D)
  years: number; // timeframe
  reinvestEnabled: boolean; // toggle for ICM
  inflationRate?: number;
  lemonPriceIncrease?: number;
}

export interface CalculadoraMadreResults {
  ticketPriceBeforeDiscount: number;
  volumeDiscount: number;
  financingPenalty: number;
  netDiscount: number;
  priceAfterDiscount: number;
  surchargePercentage: number;
  finalPricePerTicket: number;
  totalInitialCost: number;
  minDownPayment: number;
  initialDebt: number;
  monthlyPayment: number;
  amortizationTable: AmortizationRow[];
  scenarios: {
    conservative: ScenarioResult;
    moderate: ScenarioResult;
    optimistic: ScenarioResult;
  };
}

export const BASE_PRICES = {
  A: 100000,
  B: 100000,
  C: 120000,
  D: 100000,
};

const UNIT_ECONOMICS = {
  conservative: { name: 'Conservador', motos: 30, yield: 10800 },
  moderate: { name: 'Moderado', motos: 40, yield: 14400 },
  optimistic: { name: 'Optimista', motos: 55, yield: 19800 },
};

export function calculateCalculadoraMadre(params: CalculadoraMadreParams): CalculadoraMadreResults {
  const { model, numTickets, manualDiscount, downPayment, financingMonths, reinvestEnabled, years, inflationRate, lemonPriceIncrease } = params;

  // 1. Base Price
  const basePrice = BASE_PRICES[model];

  // 2. Volume Discount
  let volumeDiscount = 0;
  if (numTickets >= 10) volumeDiscount = 10;
  else if (numTickets >= 5) volumeDiscount = 5;
  else if (numTickets >= 3) volumeDiscount = 3;

  // 3. Financing Penalty
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

  // 4. Sequential Discount Calculation
  const phaseDiscountPercent = manualDiscount * financingFactor;
  const financingPenalty = Math.round((manualDiscount - phaseDiscountPercent) * 100) / 100;
  const priceAfterDiscount = basePrice * (1 - phaseDiscountPercent / 100) * (1 - volumeDiscount / 100);
  const netDiscount = Math.round(((1 - (priceAfterDiscount / basePrice)) * 100) * 100) / 100;

  // Growth rates (defaulting to 3.5% inflation + 1.5% motorcycle price increase)
  const effInflationRate = inflationRate ?? 3.5;
  const effLemonPriceIncrease = lemonPriceIncrease ?? 1.5;
  const totalGrowthRate = effInflationRate + effLemonPriceIncrease; // 5.0% by default
  const growthFactor = 1 + totalGrowthRate / 100;

  // 6. Surcharge for deferred payment
  let surchargePercentage = 0;
  const finalPricePerTicket = priceAfterDiscount;

  const totalInitialCost = finalPricePerTicket * numTickets;

  // 7. Enganche (Down payment)
  const isFinanced = model === 'B' || model === 'D';
  const minDownPayment = isFinanced ? 10000 * numTickets : totalInitialCost;
  const actualDownPayment = isFinanced ? Math.max(minDownPayment, downPayment) : totalInitialCost;

  // 8. Debt and monthly payments
  const initialDebt = isFinanced ? Math.max(0, totalInitialCost - actualDownPayment) : 0;
  const actualFinancingMonths = model === 'B' ? 12 : model === 'D' ? financingMonths : 0;
  const monthlyPayment = actualFinancingMonths > 0 ? initialDebt / actualFinancingMonths : 0;

  // 9. Amortization Table
  const amortizationTable: AmortizationRow[] = [];
  if (actualFinancingMonths > 0 && initialDebt > 0) {
    let currentBalance = initialDebt;
    for (let m = 1; m <= actualFinancingMonths; m++) {
      currentBalance = Math.max(0, currentBalance - monthlyPayment);
      amortizationTable.push({
        month: m,
        payment: monthlyPayment,
        capital: monthlyPayment,
        balance: currentBalance,
      });
    }
  }

  // 10. Maturation period for yields
  // Model A: Contado (immediate purchase) => 6 months maturation => startsMonth 7
  // Model B: Financed (12m) => starts 6 months after full payment => startsMonth 12 + 7 = 19
  // Model C: Contado (mature agency) => starts next month => startsMonth 2
  // Model D: Financed (financingMonths) => starts 6 months after full payment => startsMonth financingMonths + 7
  let yieldStartMonth = 7;
  if (model === 'A') {
    yieldStartMonth = 7;
  } else if (model === 'B') {
    yieldStartMonth = 19;
  } else if (model === 'C') {
    yieldStartMonth = 2;
  } else if (model === 'D') {
    yieldStartMonth = financingMonths + 7;
  }

  // 11. Run Projections for the 3 Scenarios
  const runScenarioSimulation = (
    scenarioName: string,
    motosPerMonth: number,
    yieldBaseYear0: number
  ): ScenarioResult => {
    const yearlyData: YearData[] = [];
    const tickets: TicketStatus[] = [];

    // Add initial tickets at Month 0
    for (let i = 0; i < numTickets; i++) {
      tickets.push({
        id: i + 1,
        purchaseMonth: 0,
        purchasePrice: finalPricePerTicket,
        yieldStartMonth,
        purchaseYear: 0,
      });
    }

    let liquidCash = 0;
    let withdrawnCash = 0;
    let cumulativeYield = 0;

    const totalMonths = years * 12;

    // We will track monthly yields in a list to simplify year-end reporting
    const monthlyYields: number[] = Array(totalMonths + 1).fill(0);

    for (let m = 1; m <= totalMonths; m++) {
      const currentYear = Math.ceil(m / 12);

      // A. Generate yields
      let monthlyYieldThisMonth = 0;
      for (const ticket of tickets) {
        if (m >= ticket.yieldStartMonth) {
          // Discount: -2% per year of delay in purchase
          const yieldDiscount = ticket.purchaseYear * 0.02;
          const yieldMultiplier = Math.max(0, 1 - yieldDiscount);

          // Growth: compound annually
          const growthMultiplier = Math.pow(growthFactor, currentYear - 1);

          const annualYieldForTicket = yieldBaseYear0 * yieldMultiplier * growthMultiplier;
          const monthlyYieldForTicket = annualYieldForTicket / 12;

          monthlyYieldThisMonth += monthlyYieldForTicket;
        }
      }

      monthlyYields[m] = monthlyYieldThisMonth;
      cumulativeYield += monthlyYieldThisMonth;

      if (reinvestEnabled) {
        liquidCash += monthlyYieldThisMonth;

        // B. Reinvestment purchase
        const currentTicketPrice = finalPricePerTicket * Math.pow(growthFactor, currentYear - 1);
        while (liquidCash >= currentTicketPrice) {
          liquidCash -= currentTicketPrice;
          tickets.push({
            id: tickets.length + 1,
            purchaseMonth: m,
            purchasePrice: currentTicketPrice,
            yieldStartMonth: m + 7, // cash purchase => 6m maturation
            purchaseYear: currentYear, // year index (1-indexed based on m)
          });
        }
      } else {
        withdrawnCash += monthlyYieldThisMonth;
      }

      // C. Year-end aggregation
      if (m % 12 === 0) {
        const year = m / 12;

        // Yield generated in this year
        let annualYield = 0;
        for (let monthIdx = (year - 1) * 12 + 1; monthIdx <= year * 12; monthIdx++) {
          annualYield += monthlyYields[monthIdx];
        }

        // Total out-of-pocket cash paid by user so far
        const totalInvested = actualDownPayment + Math.min(m, actualFinancingMonths) * monthlyPayment;

        // Appreciated value of tickets
        let appreciatedValue = 0;
        for (const ticket of tickets) {
          const ticketPurchaseYear = ticket.purchaseYear;
          const yearsHeld = year - ticketPurchaseYear;
          // RiderMex: Base value is $120,000 (real ticket cost of $100,000 + $20,000 mature agency plusvalía)
          // It appreciates by the growthFactor every year. No 50% Citrus first-year jump.
          const ticketValue = 120000 * Math.pow(growthFactor, yearsHeld);
          appreciatedValue += ticketValue;
        }

        // Debt outstanding
        const remainingDebt = Math.max(0, initialDebt - Math.min(m, actualFinancingMonths) * monthlyPayment);

        // Patrimony
        const patrimony = appreciatedValue - remainingDebt + (reinvestEnabled ? liquidCash : withdrawnCash);

        // ROI: Exclude ticket price appreciation (plusvalía)
        const roi = totalInvested > 0 ? (cumulativeYield / totalInvested) * 100 : 0;

        // Count producing tickets at the end of this year
        const producingTickets = tickets.filter(t => m >= t.yieldStartMonth).length;

        yearlyData.push({
          year,
          totalTickets: tickets.length,
          producingTickets,
          annualYield,
          cumulativeYield,
          totalInvested,
          appreciatedValue,
          remainingDebt,
          patrimony,
          liquidCash,
          withdrawnCash,
          roi,
        });
      }
    }

    const finalYear = yearlyData[yearlyData.length - 1];

    return {
      scenarioName,
      motosPerMonth,
      yieldBaseYear0,
      yearlyData,
      finalTickets: finalYear.totalTickets,
      finalPatrimony: finalYear.patrimony,
      finalYield: finalYear.annualYield,
      totalInvested: finalYear.totalInvested,
      roi: finalYear.roi,
    };
  };

  const conservative = runScenarioSimulation(
    UNIT_ECONOMICS.conservative.name,
    UNIT_ECONOMICS.conservative.motos,
    UNIT_ECONOMICS.conservative.yield
  );

  const moderate = runScenarioSimulation(
    UNIT_ECONOMICS.moderate.name,
    UNIT_ECONOMICS.moderate.motos,
    UNIT_ECONOMICS.moderate.yield
  );

  const optimistic = runScenarioSimulation(
    UNIT_ECONOMICS.optimistic.name,
    UNIT_ECONOMICS.optimistic.motos,
    UNIT_ECONOMICS.optimistic.yield
  );

  return {
    ticketPriceBeforeDiscount: basePrice,
    volumeDiscount,
    financingPenalty,
    netDiscount,
    priceAfterDiscount,
    surchargePercentage,
    finalPricePerTicket,
    totalInitialCost,
    minDownPayment,
    initialDebt,
    monthlyPayment,
    amortizationTable,
    scenarios: {
      conservative,
      moderate,
      optimistic,
    },
  };
}
