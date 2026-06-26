import { Investment, InvestmentResults } from '../../types';
import { RIDERMEX_CONFIG, getEscalonByNumber } from '../../data/ridermexConfig';
import { generateRidermexCompleteReport } from './ridermexReport';

export interface ReportOptions {
  advisorName: string;
  advisorPhone: string;
  advisorEmail: string;
  clientName?: string;
  downPaymentPercent?: number;
  annualInterestRate?: number;
}

export interface ReportBranding {
  companyName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  email: string;
  phone: string;
  website: string;
  productName: string;
  assetName: string;
  businessName: string;
  investorName: string;
  returnName: string;
}

export function detectInvestmentType(investment: Investment): 'ridermex' | 'citrus' {
  return investment.ridermexProductType ? 'ridermex' : 'citrus';
}

export function getReportBranding(investment: Investment): ReportBranding {
  const type = detectInvestmentType(investment);

  if (type === 'ridermex') {
    return {
      companyName: 'RiderMex',
      logoUrl: '/rider_inversiones.png',
      primaryColor: '#FF0000',
      secondaryColor: '#00FF00',
      accentColor: '#00FFFF',
      email: 'informacion@ridermex.com',
      phone: '55 1000 0604',
      website: 'https://ridermex.com',
      productName: 'tickets',
      assetName: 'motocicleta',
      businessName: 'tienda RiderMex',
      investorName: 'socio',
      returnName: 'rendimiento trimestral'
    };
  }

  // Citrus/Cosecha Capital
  return {
    companyName: 'Cosecha Capital',
    logoUrl: '/rider_inversiones.png',
    primaryColor: '#16a34a',
    secondaryColor: '#22c55e',
    accentColor: '#047857',
    email: 'inversiones@cosechacapital.com',
    phone: '+52 55 1000 0615',
    website: 'https://inversion.citruspatrimonial.com',
    productName: 'certificados',
    assetName: 'hectárea',
    businessName: 'cultivo de cítricos',
    investorName: 'inversionista',
    returnName: 'utilidad anual'
  };
}

export function getScenarioName(investment: Investment): string {
  const type = detectInvestmentType(investment);

  if (type === 'ridermex') {
    const scenario = investment.ridermexScenario || 'moderate';
    const scenarioNames = {
      conservative: 'Conservador',
      moderate: 'Moderado',
      optimistic: 'Optimista'
    };
    return scenarioNames[scenario];
  }

  // Citrus scenarios
  const prod = investment.averageProductionPerHectare;
  const price = investment.averageSalePricePerKg;

  if (prod === 25000 && price === 30) return 'Conservador';
  if (prod === 30000 && price === 35) return 'Moderado';
  if (prod === 35000 && price === 38) return 'Optimista';
  return 'Personalizado';
}

export function getScenarioDetails(investment: Investment): string {
  const type = detectInvestmentType(investment);

  if (type === 'ridermex') {
    const scenario = investment.ridermexScenario || 'moderate';
    const scenarioConfig = RIDERMEX_CONFIG.SCENARIOS[scenario];
    const escalon = getEscalonByNumber(investment.ridermexEscalon || 1);
    return `
      <div style="background: rgba(255, 255, 255, 0.2); padding: 6px 12px; border-radius: 6px; font-size: 13px;">
        <span style="color: rgba(255, 255, 255, 0.9);">Escalón:</span>
        <strong style="color: white; margin-left: 4px;">${escalon.name} ($${escalon.entryPrice.toLocaleString()}) - ROI Estimado ${escalon.roi}%</strong>
      </div>
      <div style="background: rgba(255, 255, 255, 0.2); padding: 6px 12px; border-radius: 6px; font-size: 13px;">
        <span style="color: rgba(255, 255, 255, 0.9);">Motos/año:</span>
        <strong style="color: white; margin-left: 4px;">${scenarioConfig.motorcyclesPerYear.toLocaleString()}</strong>
      </div>
      <div style="background: rgba(255, 255, 255, 0.2); padding: 6px 12px; border-radius: 6px; font-size: 13px;">
        <span style="color: rgba(255, 255, 255, 0.9);">Retorno/ticket:</span>
        <strong style="color: white; margin-left: 4px;">$${scenarioConfig.annualReturnPerTicket.toLocaleString()}/año</strong>
      </div>
    `;
  }

  // Citrus scenario details
  return `
    <div style="background: rgba(255, 255, 255, 0.2); padding: 6px 12px; border-radius: 6px; font-size: 13px;">
      <span style="color: rgba(255, 255, 255, 0.9);">Producción:</span>
      <strong style="color: white; margin-left: 4px;">${investment.averageProductionPerHectare.toLocaleString()} kg/ha</strong>
    </div>
    <div style="background: rgba(255, 255, 255, 0.2); padding: 6px 12px; border-radius: 6px; font-size: 13px;">
      <span style="color: rgba(255, 255, 255, 0.9);">Precio:</span>
      <strong style="color: white; margin-left: 4px;">$${investment.averageSalePricePerKg}/kg</strong>
    </div>
  `;
}

export function getProductTypeLabel(investment: Investment): string {
  const type = detectInvestmentType(investment);

  if (type === 'ridermex') {
    const typeLabels = {
      A: 'Modelo A - Contado Tradicional',
      B: 'Modelo B - Financiado 12m',
      C: 'Modelo C - Agencia Madura',
      D: 'Modelo D - Financiado Flexible 48m'
    };
    return typeLabels[investment.ridermexProductType as 'A' | 'B' | 'C' | 'D'] || 'Modelo B';
  }

  return 'Certificado de Inversión en Agricultura';
}

export function generateRidermexReport(
  investment: Investment,
  results: InvestmentResults,
  options: ReportOptions
): string {
  return generateRidermexCompleteReport(investment, results, options);
}
