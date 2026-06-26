import { Investment } from '../../types';

export interface AmortizationEntry {
  paymentNumber: number;
  date: string;
  paymentAmount: number;
  principalAmount: number;
  interestAmount: number;
  remainingBalance: number;
  cumulativePrincipal: number;
  cumulativeInterest: number;
}

export interface PaymentData {
  totalInvestment: number;
  downPaymentAmount: number;
  totalFinanced: number;
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
  amortizationTable: AmortizationEntry[];
}

export function calculatePaymentData(investment: Investment): PaymentData {
  const totalInvestment = investment.initialCertificates * investment.certificateBasePrice;
  const downPaymentPercentage = investment.downPaymentPercentage || 30;
  const downPaymentAmount = totalInvestment * (downPaymentPercentage / 100);
  const totalFinanced = totalInvestment - downPaymentAmount;
  const monthlyPayment = totalFinanced / 48; // 48 months financing
  const interestRate = investment.financingInterestRate || 0; // No interest by default
  
  // Generate amortization table
  const amortizationTable: AmortizationEntry[] = [];
  let remainingBalance = totalFinanced;
  let cumulativePrincipal = downPaymentAmount;
  let cumulativeInterest = 0;
  
  for (let i = 1; i <= 48; i++) {
    const paymentDate = new Date();
    paymentDate.setMonth(paymentDate.getMonth() + i);
    
    const interestAmount = remainingBalance * (interestRate / 100 / 12);
    const principalAmount = monthlyPayment - interestAmount;
    
    remainingBalance = Math.max(0, remainingBalance - principalAmount);
    cumulativePrincipal += principalAmount;
    cumulativeInterest += interestAmount;
    
    amortizationTable.push({
      paymentNumber: i,
      date: paymentDate.toLocaleDateString('es-MX'),
      paymentAmount: monthlyPayment,
      principalAmount: principalAmount,
      interestAmount: interestAmount,
      remainingBalance: remainingBalance,
      cumulativePrincipal: cumulativePrincipal,
      cumulativeInterest: cumulativeInterest
    });
  }
  
  const totalInterest = cumulativeInterest;
  
  return {
    totalInvestment,
    downPaymentAmount,
    totalFinanced,
    monthlyPayment,
    totalPayments: 48,
    totalInterest,
    amortizationTable
  };
}