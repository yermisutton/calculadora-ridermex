import { Investment, InvestmentResults } from '../types';
import { getDetailedCertificateEvolution } from './calculations/certificateEvolution';
import { formatCurrency } from './formatters';
import { compoundMultiplierContent } from '../data/compoundMultiplierContent';

export interface CompoundInterestData {
  year: number;
  certificates: {
    total: number;
    producing: number;
    growing: number;
    waiting: number;
    reserved: number;
  };
  patrimony: number;
  monthlyIncome: number;
  yearlyUtility: number;
  certificatePrice: number;
  events: string[];
  keyMilestone?: {
    type: 'first_production' | 'certificate_paid' | 'new_certificate' | 'major_milestone';
    description: string;
  };
}

export interface CompoundInterestComparison {
  withReinvestment: {
    certificates: number;
    patrimony: number;
    monthlyIncome: number;
    multiplier: number;
  };
  withoutReinvestment: {
    certificates: number;
    patrimony: number;
    monthlyIncome: number;
    multiplier: number;
  };
}

export interface InvestmentComparisonData {
  riderMex: {
    patrimony: number;
    monthlyIncome: number;
    certificates: number;
    multiplier: number;
    strategy: 'diversified';
  };
  cetes: {
    patrimony: number;
    monthlyIncome: number;
    certificates: number;
    multiplier: number;
    strategy: 'single';
  };
  savings: {
    patrimony: number;
    monthlyIncome: number;
    certificates: number;
    multiplier: number;
    strategy: 'single';
  };
  realEstate: {
    patrimony: number;
    monthlyIncome: number;
    certificates: number;
    multiplier: number;
    strategy: 'single';
  };
}

/**
 * Generates explanation of compound multiplier effect
 */
export function generateCompoundMultiplierExplanation(
  initialCertificates: number,
  totalCertificates: number,
  years: number,
  finalMonthlyIncome: number,
  finalPatrimony: number,
  currencyFormat: string = 'MXN'
): string {
  const assetMultiplier = (totalCertificates / initialCertificates).toFixed(1);
  const patrimonialMultiplier = (finalPatrimony / (initialCertificates * 315000)).toFixed(1);
  const newCertificates = totalCertificates - initialCertificates;
  
  return `
🚀 Tu Revolución Financiera Personal con el Interés Compuesto Multiplicador

Iniciaste con ${initialCertificates} certificado${initialCertificates > 1 ? 's' : ''}, y en ${years} años has construido un imperio de ${totalCertificates} certificados.

🎯 EL PODER DEL MULTIPLICADOR:
• Multiplicaste tus ACTIVOS por ${assetMultiplier}x (de ${initialCertificates} a ${totalCertificates} certificados)
• Multiplicaste tu PATRIMONIO por ${patrimonialMultiplier}x (${formatCurrency(finalPatrimony, currencyFormat)})
• Creaste ${newCertificates} NUEVAS fuentes de ingresos completamente GRATIS
• Generas ${formatCurrency(finalMonthlyIncome, currencyFormat)} mensuales SIN trabajar

🌟 Esto NO es solo "interés compuesto tradicional" - es la EVOLUCIÓN del concepto financiero más poderoso del mundo.

Con inversiones tradicionales tendrías 1 activo. Con el Multiplicador tienes ${totalCertificates} activos trabajando para ti.
Con ahorros tradicionales tendrías números en una pantalla. Con el Multiplicador tienes plantaciones REALES produciendo para ti.

🏆 Has logrado lo que el 99% de inversionistas nunca conseguirá: MULTIPLICAR tus activos, no solo tu dinero.
  `.trim();
}

/**
 * Generates explanation of compound multiplier effect (alias for compatibility)
 */
export function getCompoundMultiplierExplanation(
  initialCertificates: number,
  totalCertificates: number,
  years: number,
  finalMonthlyIncome: number,
  finalPatrimony: number,
  currencyFormat: string = 'MXN'
): string {
  return generateCompoundMultiplierExplanation(
    initialCertificates,
    totalCertificates,
    years,
    finalMonthlyIncome,
    finalPatrimony,
    currencyFormat
  );
}

/**
 * Generates compound interest evolution data for visualization
 */
export function generateCompoundInterestData(investment: Investment): CompoundInterestData[] {
  const certificateEvolution = getDetailedCertificateEvolution(investment);
  const data: CompoundInterestData[] = [];
  
  certificateEvolution.forEach((yearData, index) => {
    const year = index + 1;
    
    // Count certificates by status
    const certificatesByStatus = {
      total: yearData.totalCertificates,
      producing: yearData.certificates.filter(c => c.status === 'producing').length,
      growing: yearData.certificates.filter(c => c.status === 'growing').length,
      waiting: yearData.certificates.filter(c => c.status === 'waiting').length,
      reserved: yearData.certificates.filter(c => c.status === 'reserved').length
    };
    
    // Identify events
    const events: string[] = [];
    if (yearData.newCertificateIds.length > 0) {
      events.push(`Certificados liquidados: ${yearData.newCertificateIds.join(', ')}`);
    }
    if (yearData.reservedCertificateIds.length > 0) {
      events.push(`Nuevos certificados apartados: ${yearData.reservedCertificateIds.join(', ')}`);
    }
    
    // Identify key milestones
    let keyMilestone: CompoundInterestData['keyMilestone'];
    
    if (year === 5) {
      keyMilestone = {
        type: 'first_production',
        description: 'Inicio de producción - Primeras utilidades generadas'
      };
    } else if (yearData.newCertificateIds.length > 0) {
      keyMilestone = {
        type: 'certificate_paid',
        description: `Ticket de Inversión${yearData.newCertificateIds.length > 1 ? 's' : ''} ${yearData.newCertificateIds.join(', ')} liquidado${yearData.newCertificateIds.length > 1 ? 's' : ''} completamente`
      };
    } else if (yearData.reservedCertificateIds.length > 0) {
      keyMilestone = {
        type: 'new_certificate',
        description: `Nuevo${yearData.reservedCertificateIds.length > 1 ? 's' : ''} certificado${yearData.reservedCertificateIds.length > 1 ? 's' : ''} apartado${yearData.reservedCertificateIds.length > 1 ? 's' : ''}`
      };
    } else if ([10, 15, 20, 25].includes(year)) {
      keyMilestone = {
        type: 'major_milestone',
        description: `Hito importante: ${year} años de inversión`
      };
    }
    
    data.push({
      year,
      certificates: certificatesByStatus,
      patrimony: yearData.citrusPatrimony,
      monthlyIncome: yearData.totalUtility / 12,
      yearlyUtility: yearData.totalUtility,
      certificatePrice: yearData.certificatePrice,
      events,
      keyMilestone
    });
  });
  
  return data;
}

/**
 * Generates avalanche timeline for compound interest visualization
 */
export function generateAvalancheTimeline(
  initialCertificates: number,
  totalCertificates: number,
  years: number,
  yearlyData?: any[],
  currencyFormat: string = 'MXN'
): Array<{
  year: number;
  certificates: number;
  event: string;
  description: string;
}> {
  const timeline = [];

  for (let year = 1; year <= years; year++) {
    // Use actual yearly data if available, otherwise fallback to estimated growth
    let certificates: number;
    if (yearlyData && yearlyData[year - 1]) {
      certificates = yearlyData[year - 1].totalCertificates || yearlyData[year - 1].certificatesFromReinvestment + initialCertificates;
    } else {
      // Fallback to estimated growth
      const certificateGrowthRate = Math.pow(totalCertificates / initialCertificates, 1 / years);
      certificates = Math.round(initialCertificates * Math.pow(certificateGrowthRate, year - 1));
    }

    let event = '';
    let description = '';

    if (year === 1) {
      event = 'Inicio de la Inversión';
      description = `Adquieres ${initialCertificates} certificado${initialCertificates > 1 ? 's' : ''} inicial${initialCertificates > 1 ? 'es' : ''}`;
    } else if (year <= 4) {
      event = 'Período de Maduración';
      description = `Año ${year} de maduración. Los certificados se están desarrollando y apreciando en valor.`;
    } else if (year === 5) {
      event = 'Primera Producción';
      description = 'Los certificados iniciales comienzan a generar utilidades que se reinvierten automáticamente.';
    } else if (certificates > initialCertificates) {
      const newCertificates = certificates - initialCertificates;
      event = 'Efecto Avalancha';
      description = `Las utilidades han adquirido ${newCertificates} certificado${newCertificates > 1 ? 's' : ''} adicional${newCertificates > 1 ? 'es' : ''}. El Multiplicador está acelerando tu crecimiento.`;
    } else {
      event = 'Crecimiento Sostenido';
      description = 'Las utilidades se acumulan para la próxima adquisición de certificados.';
    }

    timeline.push({
      year,
      certificates,
      event,
      description
    });
  }

  return timeline;
}

/**
 * Calculates comparison between reinvestment and no reinvestment scenarios
 */
export function calculateCompoundInterestComparison(
  investment: Investment,
  results: InvestmentResults
): CompoundInterestComparison {
  // Guard clause: validate inputs
  if (!investment || !results || !results.yearlyData || results.yearlyData.length === 0) {
    return {
      withReinvestment: {
        certificates: 0,
        patrimony: 0,
        monthlyIncome: 0,
        multiplier: 0
      },
      withoutReinvestment: {
        certificates: 0,
        patrimony: 0,
        monthlyIncome: 0,
        multiplier: 0
      }
    };
  }

  const initialInvestment = investment.initialCertificates * investment.certificateBasePrice;
  const finalYearData = results.yearlyData[results.yearlyData.length - 1];

  if (!finalYearData || !initialInvestment || initialInvestment === 0) {
    return {
      withReinvestment: {
        certificates: 0,
        patrimony: 0,
        monthlyIncome: 0,
        multiplier: 0
      },
      withoutReinvestment: {
        certificates: 0,
        patrimony: 0,
        monthlyIncome: 0,
        multiplier: 0
      }
    };
  }

  // With reinvestment (actual results)
  const withReinvestment = {
    certificates: results.certificatesSummary.totalCertificates || 0,
    patrimony: finalYearData.citrusPatrimony || 0,
    monthlyIncome: (finalYearData.citrusIncome || 0) / 12,
    multiplier: (finalYearData.citrusPatrimony || 0) / initialInvestment
  };

  // Without reinvestment (theoretical)
  const certificateEvolution = getDetailedCertificateEvolution(investment);
  const finalCertificatePrice = certificateEvolution[certificateEvolution.length - 1]?.certificatePrice || investment.certificateBasePrice;
  const annualUtilityPerCertificate = investment.averageProductionPerHectare * investment.averageSalePricePerKg * 0.1 * 0.65;

  const withoutReinvestment = {
    certificates: investment.initialCertificates || 0,
    patrimony: (investment.initialCertificates || 0) * finalCertificatePrice,
    monthlyIncome: ((investment.initialCertificates || 0) * annualUtilityPerCertificate) / 12,
    multiplier: ((investment.initialCertificates || 0) * finalCertificatePrice) / initialInvestment
  };

  return {
    withReinvestment,
    withoutReinvestment
  };
}

/**
 * Calculates comparison data for all investment types
 */
export function calculateInvestmentComparison(
  investment: Investment,
  results: InvestmentResults
): InvestmentComparisonData {
  // Guard clause: validate inputs
  if (!investment || !results || !results.yearlyData || results.yearlyData.length === 0) {
    return {
      riderMex: {
        patrimony: 0,
        monthlyIncome: 0,
        certificates: 0,
        multiplier: 0,
        strategy: 'diversified' as const
      },
      cetes: {
        patrimony: 0,
        monthlyIncome: 0,
        certificates: 1,
        multiplier: 0,
        strategy: 'single' as const
      },
      savings: {
        patrimony: 0,
        monthlyIncome: 0,
        certificates: 1,
        multiplier: 0,
        strategy: 'single' as const
      },
      realEstate: {
        patrimony: 0,
        monthlyIncome: 0,
        certificates: 1,
        multiplier: 0,
        strategy: 'single' as const
      }
    };
  }

  const initialInvestment = investment.initialCertificates * investment.certificateBasePrice;
  const finalYearData = results.yearlyData[results.yearlyData.length - 1];
  const years = investment.years;

  if (!finalYearData || !initialInvestment || initialInvestment === 0) {
    return {
      riderMex: {
        patrimony: 0,
        monthlyIncome: 0,
        certificates: 0,
        multiplier: 0,
        strategy: 'diversified' as const
      },
      cetes: {
        patrimony: 0,
        monthlyIncome: 0,
        certificates: 1,
        multiplier: 0,
        strategy: 'single' as const
      },
      savings: {
        patrimony: 0,
        monthlyIncome: 0,
        certificates: 1,
        multiplier: 0,
        strategy: 'single' as const
      },
      realEstate: {
        patrimony: 0,
        monthlyIncome: 0,
        certificates: 1,
        multiplier: 0,
        strategy: 'single' as const
      }
    };
  }

  // RiderMex (with reinvestment)
  const riderMex = {
    patrimony: finalYearData.citrusPatrimony || 0,
    monthlyIncome: (finalYearData.citrusIncome || 0) / 12,
    certificates: results.certificatesSummary.totalCertificates || 0,
    multiplier: (finalYearData.citrusPatrimony || 0) / initialInvestment,
    strategy: 'diversified' as const
  };

  // CETES
  const cetesPatrimony = initialInvestment * Math.pow(1 + (investment.cetesRate || 0) / 100, years);
  const cetes = {
    patrimony: cetesPatrimony,
    monthlyIncome: cetesPatrimony * ((investment.cetesRate || 0) / 100) / 12,
    certificates: 1,
    multiplier: cetesPatrimony / initialInvestment,
    strategy: 'single' as const
  };

  // Savings
  const savingsPatrimony = initialInvestment * Math.pow(1 + (investment.savingsRate || 0) / 100, years);
  const savings = {
    patrimony: savingsPatrimony,
    monthlyIncome: savingsPatrimony * ((investment.savingsRate || 0) / 100) / 12,
    certificates: 1,
    multiplier: savingsPatrimony / initialInvestment,
    strategy: 'single' as const
  };

  // Real Estate
  const realEstatePatrimony = initialInvestment * Math.pow(1 + (investment.realEstateAppreciation || 0) / 100, years);
  const realEstate = {
    patrimony: realEstatePatrimony,
    monthlyIncome: realEstatePatrimony * ((investment.realEstateRent || 0) / 100) / 12,
    certificates: 1,
    multiplier: realEstatePatrimony / initialInvestment,
    strategy: 'single' as const
  };

  return {
    riderMex,
    cetes,
    savings,
    realEstate
  };
}

/**
 * Generates a detailed report of compound interest evolution
 */
export function generateCompoundInterestReport(
  investment: Investment, 
  results: InvestmentResults,
  compoundData: CompoundInterestData[],
  includeClientInfo?: boolean,
  clientInfo?: {
    investorName?: string;
    investorPhone?: string;
    investorEmail?: string;
    executiveName?: string;
    executivePhone?: string;
    executiveEmail?: string;
  }
): string {
  const currentDate = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const comparison = calculateCompoundInterestComparison(investment, results);
  const investmentComparison = calculateInvestmentComparison(investment, results);
  
  // Generate compound multiplier explanation
  const multiplierExplanation = generateCompoundMultiplierExplanation(
    investment.initialCertificates,
    results.certificatesSummary.totalCertificates,
    investment.years,
    results.finalMonthlyIncome,
    results.yearlyData[results.yearlyData.length - 1].citrusPatrimony,
    investment.currencyFormat
  );
  
  // Generate detailed avalanche timeline with financial data
  const avalancheTimeline = generateAvalancheTimeline(
    investment.initialCertificates,
    results.certificatesSummary.totalCertificates,
    investment.years,
    results.yearlyData,
    investment.currencyFormat
  );
  
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>${includeClientInfo ? 'Reporte Completo Personalizado' : 'Reporte de Interés Compuesto Multiplicador'} - RiderMex</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          line-height: 1.6;
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          color: #1f2937;
          background: #ffffff;
        }
        .header {
          text-align: center;
          margin-bottom: 60px;
          padding-bottom: 30px;
          background: linear-gradient(135deg, #16a34a, #22c55e);
          color: white;
          border-radius: 15px;
          padding: 40px 20px;
        }
        .header h1 {
          color: white;
          font-size: 2.5em;
          margin-bottom: 10px;
        }
        .header h2 {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.8em;
          margin-bottom: 10px;
        }
        .header p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.2em;
        }
        .section {
          margin-bottom: 40px;
          padding: 30px;
          background: #f3f4f6;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin: 30px 0;
        }
        .comparison-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .multiplier-highlight {
          background: linear-gradient(135deg, #16a34a, #22c55e);
          color: white;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          margin: 20px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          background: white;
          border-radius: 8px;
          overflow: hidden;
        }
        th, td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        th {
          background: #16a34a;
          color: white;
          font-weight: 500;
        }
        tr:nth-child(even) {
          background: #f9fafb;
        }
        .milestone {
          background: #dcfce7;
          border-left: 4px solid #16a34a;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Reporte de Interés Compuesto Multiplicador</h1>
        <h2>${compoundMultiplierContent.subtitle}</h2>
        <h2>RiderMex</h2>
        <p>Generado el ${currentDate}</p>
        <div style="margin-top: 20px; padding: 15px; background: rgba(255, 255, 255, 0.2); border-radius: 10px;">
          <p style="margin: 0; font-weight: 500;">${compoundMultiplierContent.tagline}</p>
        </div>
      </div>
      
      <div class="section">
        <h2 class="section-title">🚀 Tu Revolución Financiera Personal</h2>
        
        ${multiplierExplanation.split('\n').map(line => 
          line.trim() ? `<p style="margin-bottom: 10px;">${line}</p>` : ''
        ).join('')}
        
        <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 25px; border-radius: 15px; margin: 25px 0; text-align: center;">
          <h3 style="margin-bottom: 15px;">🏆 El Poder del Multiplicador</h3>
          <p style="font-size: 1.3em; margin: 15px 0;">
            <strong>Multiplicador de Activos: ${(results.certificatesSummary.totalCertificates / investment.initialCertificates).toFixed(1)}x</strong><br>
            <strong>Multiplicador de Patrimonio: ${results.capitalMultiplier.toFixed(1)}x</strong><br>
            <strong>Nuevas Fuentes de Ingresos: +${results.certificatesSummary.fromReinvestment}</strong>
          </p>
        </div>
      </div>
      
      <div class="section">
        <h2 class="section-title">🔥 Los 4 Pilares del Interés Compuesto Multiplicador</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px;">
          ${compoundMultiplierContent.pillars.items.map((pillar, index) => `
            <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-left: 5px solid #16a34a;">
              <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #16a34a, #22c55e); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.5em;">
                  ${pillar.number}
                </div>
                <h3 style="color: #16a34a; margin: 0; font-size: 1.2em;">${pillar.title}</h3>
              </div>
              <p style="color: #374151; margin-bottom: 15px; font-weight: 600;">${pillar.description}</p>
              <ul style="list-style: none; padding: 0; margin: 0;">
                ${pillar.examples.map(example => `
                  <li style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px;">
                    <span style="color: #16a34a; margin-top: 2px; font-weight: bold;">→</span>
                    <span style="color: #374151; font-size: 0.95em;">${example}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="section">
        <h2>Comparación: Interés Simple vs Interés Compuesto</h2>
        
        <div class="comparison-grid">
          <div class="comparison-card">
            <h3 style="color: #6b7280; margin-bottom: 20px;">Sin Reinversión (Interés Simple)</h3>
            <p><strong>Certificados:</strong> ${comparison.withoutReinvestment.certificates}</p>
            <p><strong>Patrimonio Final:</strong> ${formatCurrency(comparison.withoutReinvestment.patrimony, investment.currencyFormat)}</p>
            <p><strong>Ingreso Mensual:</strong> ${formatCurrency(comparison.withoutReinvestment.monthlyIncome, investment.currencyFormat)}</p>
            <p><strong>Multiplicador:</strong> ${comparison.withoutReinvestment.multiplier.toFixed(1)}x</p>
          </div>
          
          <div class="comparison-card" style="border: 2px solid #16a34a;">
            <h3 style="color: #16a34a; margin-bottom: 20px;">Con Reinversión (Interés Compuesto)</h3>
            <p><strong>Certificados:</strong> ${comparison.withReinvestment.certificates}</p>
            <p><strong>Patrimonio Final:</strong> ${formatCurrency(comparison.withReinvestment.patrimony, investment.currencyFormat)}</p>
            <p><strong>Ingreso Mensual:</strong> ${formatCurrency(comparison.withReinvestment.monthlyIncome, investment.currencyFormat)}</p>
            <p><strong>Multiplicador:</strong> ${comparison.withReinvestment.multiplier.toFixed(1)}x</p>
          </div>
        </div>
        
        <div class="multiplier-highlight">
          <h3>Efecto Multiplicador del Interés Compuesto</h3>
          <p style="font-size: 1.5em; margin: 15px 0;">
            <strong>${(comparison.withReinvestment.certificates / comparison.withoutReinvestment.certificates).toFixed(1)}x más certificados</strong> | 
            <strong>${(comparison.withReinvestment.patrimony / comparison.withoutReinvestment.patrimony).toFixed(1)}x más patrimonio</strong> | 
            <strong>${(comparison.withReinvestment.monthlyIncome / comparison.withoutReinvestment.monthlyIncome).toFixed(1)}x más ingresos</strong>
          </p>
        </div>
      </div>
      
      <div class="section">
        <h2>Comparativo con Otras Inversiones</h2>
        
        <table>
          <thead>
            <tr>
              <th>Tipo de Inversión</th>
              <th>Patrimonio Final</th>
              <th>Ingreso Mensual</th>
              <th>Multiplicador</th>
              <th>Estrategia</th>
              <th>Superioridad vs RiderMex</th>
            </tr>
          </thead>
          <tbody>
            <tr style="background: #dcfce7; border-left: 4px solid #16a34a;">
              <td><strong>🌱 RiderMex</strong></td>
              <td><strong>${formatCurrency(investmentComparison.riderMex.patrimony, investment.currencyFormat)}</strong></td>
              <td><strong>${formatCurrency(investmentComparison.riderMex.monthlyIncome, investment.currencyFormat)}</strong></td>
              <td><strong>${investmentComparison.riderMex.multiplier.toFixed(1)}x</strong></td>
              <td><strong>Portafolio Diversificado (${investmentComparison.riderMex.certificates} certificados)</strong></td>
              <td><strong>100% (Referencia)</strong></td>
            </tr>
            <tr>
              <td>📊 CETES</td>
              <td>${formatCurrency(investmentComparison.cetes.patrimony, investment.currencyFormat)}</td>
              <td>${formatCurrency(investmentComparison.cetes.monthlyIncome, investment.currencyFormat)}</td>
              <td>${investmentComparison.cetes.multiplier.toFixed(1)}x</td>
              <td>Activo Único</td>
              <td>${((investmentComparison.cetes.patrimony / investmentComparison.riderMex.patrimony) * 100).toFixed(1)}%</td>
            </tr>
            <tr>
              <td>🏦 Ahorro Tradicional</td>
              <td>${formatCurrency(investmentComparison.savings.patrimony, investment.currencyFormat)}</td>
              <td>${formatCurrency(investmentComparison.savings.monthlyIncome, investment.currencyFormat)}</td>
              <td>${investmentComparison.savings.multiplier.toFixed(1)}x</td>
              <td>Activo Único</td>
              <td>${((investmentComparison.savings.patrimony / investmentComparison.riderMex.patrimony) * 100).toFixed(1)}%</td>
            </tr>
            <tr>
              <td>🏠 Bienes Raíces</td>
              <td>${formatCurrency(investmentComparison.realEstate.patrimony, investment.currencyFormat)}</td>
              <td>${formatCurrency(investmentComparison.realEstate.monthlyIncome, investment.currencyFormat)}</td>
              <td>${investmentComparison.realEstate.multiplier.toFixed(1)}x</td>
              <td>Activo Único</td>
              <td>${((investmentComparison.realEstate.patrimony / investmentComparison.riderMex.patrimony) * 100).toFixed(1)}%</td>
            </tr>
          </tbody>
        </table>
        
        <div class="multiplier-highlight">
          <h3>🏆 Ventaja Competitiva de RiderMex</h3>
          <p style="font-size: 1.2em; margin: 15px 0;">
            <strong>Estrategia Diversificada:</strong> ${investmentComparison.riderMex.certificates} certificados vs 1 activo único<br>
            <strong>Mejor Rendimiento:</strong> Supera a la segunda mejor opción por ${Math.max(
              investmentComparison.riderMex.patrimony / investmentComparison.cetes.patrimony,
              investmentComparison.riderMex.patrimony / investmentComparison.savings.patrimony,
              investmentComparison.riderMex.patrimony / investmentComparison.realEstate.patrimony
            ).toFixed(1)}x<br>
            <strong>Activo Real:</strong> Respaldado por plantaciones productivas, no solo papel
          </p>
        </div>
      </div>
      
      <div class="section">
        <h2 class="section-title">¿Por qué RiderMex?</h2>
        
        <div style="background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; padding: 25px; border-radius: 15px; margin-bottom: 25px; text-align: center;">
          <h3 style="margin-bottom: 15px;">🌟 Innovación Financiera Exclusiva</h3>
          <p style="opacity: 0.9; margin-bottom: 15px;">
            El Interés Compuesto Multiplicador es una innovación financiera exclusiva de RiderMex.
            No es solo una inversión, es la evolución natural del interés compuesto tradicional.
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px;">
            ${compoundMultiplierContent.positioning.map(position => `
              <div style="background: rgba(255, 255, 255, 0.2); padding: 15px; border-radius: 8px;">
                <p style="margin: 0; font-size: 0.9em;">${position}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      
      <div class="section">
        <h2>Evolución Detallada por Año</h2>
        <table>
          <thead>
            <tr>
              <th>Año</th>
              <th>Total Certificados</th>
              <th>En Producción</th>
              <th>En Maduración</th>
              <th>Reservados</th>
              <th>Patrimonio</th>
              <th>Ingreso Mensual</th>
              <th>Eventos Clave</th>
            </tr>
          </thead>
          <tbody>
            ${compoundData.map(data => `
              <tr ${data.keyMilestone ? 'class="milestone"' : ''}>
                <td>${data.year}</td>
                <td>${data.certificates.total}</td>
                <td>${data.certificates.producing}</td>
                <td>${data.certificates.waiting}</td>
                <td>${data.certificates.reserved}</td>
                <td>${formatCurrency(data.patrimony, investment.currencyFormat)}</td>
                <td>${formatCurrency(data.monthlyIncome, investment.currencyFormat)}</td>
                <td>
                  ${data.keyMilestone ? `<strong>${data.keyMilestone.description}</strong><br>` : ''}
                  ${data.events.join('<br>')}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="section">
        <h2>Conclusiones</h2>
        <ul>
          <li>El Interés Compuesto Multiplicador permite transformar una inversión inicial de ${investment.initialCertificates} certificado${investment.initialCertificates > 1 ? 's' : ''} en un portafolio de ${comparison.withReinvestment.certificates} certificados.</li>
          <li>En el mes 49, el inversionista puede elegir seguir el plan de reinversión para generar ${(comparison.withReinvestment.multiplier / comparison.withoutReinvestment.multiplier).toFixed(1)}x más rendimiento que una estrategia sin reinversión.</li>
          <li>La diversificación del portafolio reduce el riesgo al distribuir la inversión entre múltiples activos en diferentes fases.</li>
          <li>El crecimiento exponencial se acelera significativamente después del año 5, cuando los certificados iniciales comienzan a producir y el inversionista puede elegir reinvertir.</li>
        </ul>
      </div>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} RiderMex</p>
        <p style="margin: 10px 0; font-weight: 600; color: #16a34a;">Interés Compuesto Multiplicador - La Nueva Era de Crecimiento Patrimonial</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Downloads the compound interest report
 */
export async function downloadCompoundInterestReport(
  investment: Investment,
  results: InvestmentResults,
  format: 'html' | 'pdf' = 'html'
): Promise<void> {
  const compoundData = generateCompoundInterestData(investment);
  const htmlContent = generateCompoundInterestReport(investment, results, compoundData);

  if (format === 'pdf') {
    let element: HTMLElement | null = null;

    try {
      // Configure PDF options
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `Reporte_Interes_Compuesto_Multiplicador_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff'
        },
        jsPDF: {
          unit: 'in',
          format: 'letter',
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      // Create a temporary element for PDF generation
      element = document.createElement('div');
      element.innerHTML = htmlContent;
      element.style.width = '8.5in';
      element.style.minHeight = '11in';
      element.style.padding = '0.5in';
      element.style.backgroundColor = 'white';
      element.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.style.top = '0';

      // Add to DOM temporarily
      document.body.appendChild(element);

      // Generate PDF with dynamic import
      const html2pdfModule = await import('html2pdf.js/dist/html2pdf.bundle.min.js');
      const html2pdf = html2pdfModule.default || html2pdfModule;
      await html2pdf().set(opt).from(element).save();

      // Remove temporary element
      if (element && document.body.contains(element)) {
        document.body.removeChild(element);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);

      // Clean up element if it exists
      if (element && document.body.contains(element)) {
        try {
          document.body.removeChild(element);
        } catch (cleanupError) {
          console.error('Error cleaning up element:', cleanupError);
        }
      }

      // Fallback to HTML download
      downloadAsHTML(htmlContent);

      throw new Error(`Error al generar el PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  } else {
    downloadAsHTML(htmlContent);
  }
}

// Helper function to download as HTML
function downloadAsHTML(htmlContent: string): void {
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Reporte_Interes_Compuesto_Multiplicador_${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}