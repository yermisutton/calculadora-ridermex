export interface RidermexCompoundYearData {
  year: number;
  totalTickets: number;
  ticketsFromReinvestment: number;
  annualReturn: number;
  cumulativeReturn: number;
  liquidCash: number;
  patrimony: number;
  multiplier: number;
  monthlyIncome: number;
}

export interface RidermexCompoundResult {
  yearData: RidermexCompoundYearData[];
  finalTickets: number;
  finalPatrimony: number;
  finalMonthlyIncome: number;
  totalTicketsAcquired: number;
  multiplier: number;
}

export function calculateRidermexCompoundGrowth(
  initialTickets: number,
  ticketPrice: number,
  annualReturnPercentage: number,
  years: number,
  reinvestPercentage: number = 100,
  numberOfAgencies: number = 10,
  numberOfInvestors: number = 300
): RidermexCompoundResult {
  const yearData: RidermexCompoundYearData[] = [];
  const portfolioReturn = (ticketPrice * initialTickets * annualReturnPercentage) / 100;
  const returnPerTicket = portfolioReturn / numberOfInvestors;

  let totalTickets = initialTickets;
  let totalTicketsFromReinvestment = 0;
  let liquidCash = 0;
  let cumulativeReturn = 0;

  for (let year = 1; year <= years; year++) {
    const annualReturnThisYear = totalTickets * returnPerTicket;
    cumulativeReturn += annualReturnThisYear;

    const reinvestAmount = (annualReturnThisYear * reinvestPercentage) / 100;
    const withdrawAmount = annualReturnThisYear - reinvestAmount;

    liquidCash += reinvestAmount;

    const newTicketPrice = ticketPrice * Math.pow(1.05, year - 1);
    const newTicketsFromReinvestment = Math.floor(liquidCash / newTicketPrice);

    if (newTicketsFromReinvestment > 0) {
      totalTickets += newTicketsFromReinvestment;
      totalTicketsFromReinvestment += newTicketsFromReinvestment;
      liquidCash -= newTicketsFromReinvestment * newTicketPrice;
    }

    const patrimony = (totalTickets * ticketPrice) + liquidCash;
    const monthlyIncome = (annualReturnThisYear * reinvestPercentage / 100) / 12;
    const multiplier = patrimony / (initialTickets * ticketPrice);

    yearData.push({
      year,
      totalTickets,
      ticketsFromReinvestment: totalTicketsFromReinvestment,
      annualReturn: annualReturnThisYear,
      cumulativeReturn,
      liquidCash,
      patrimony,
      multiplier,
      monthlyIncome
    });
  }

  const finalYear = yearData[yearData.length - 1];

  return {
    yearData,
    finalTickets: finalYear.totalTickets,
    finalPatrimony: finalYear.patrimony,
    finalMonthlyIncome: finalYear.monthlyIncome,
    totalTicketsAcquired: totalTicketsFromReinvestment,
    multiplier: finalYear.multiplier
  };
}

export function generateRidermexCompoundExplanation(
  initialTickets: number,
  totalTickets: number,
  years: number,
  finalMonthlyIncome: number,
  finalPatrimony: number,
  currencyFormat: string = 'MXN'
): string {
  const ticketMultiplier = (totalTickets / initialTickets).toFixed(1);
  const newTickets = totalTickets - initialTickets;

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currencyFormat,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return `
🚀 El Poder del Interés Compuesto Multiplicador en Ridermex

Iniciaste con ${initialTickets} ticket${initialTickets > 1 ? 's' : ''}, y en ${years} años has construido un portafolio de ${totalTickets} tickets.

🎯 EL PODER DEL MULTIPLICADOR:
• Multiplicaste tus TICKETS por ${ticketMultiplier}x (de ${initialTickets} a ${totalTickets} tickets)
• Creaste ${newTickets} NUEVOS tickets completamente GRATIS mediante reinversión
• Generas ${formatCurrency(finalMonthlyIncome)} mensuales SIN hacer nada
• Tu patrimonio total es ${formatCurrency(finalPatrimony)}
`;
}
