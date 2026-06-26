import { Investment, InvestmentResults } from '../../types';
import { formatCurrency, convertFromMXN } from '../formatters';
import { compoundMultiplierContent } from '../../data/compoundMultiplierContent';
import { generateCompoundInterestData, calculateCompoundInterestComparison, calculateInvestmentComparison } from '../compoundInterestUtils';
import { getDetailedCertificateEvolution } from '../calculations/certificateEvolution';
import { generateFinancingPlanHTML } from './financingPlanReport';
import { getReportBranding } from './reportConfig';

export interface ReportOptions {
  advisorName: string;
  advisorPhone: string;
  advisorEmail: string;
  clientName?: string;
}

export function generateCompoundMultiplierReport(
  investment: Investment,
  results: InvestmentResults,
  options: ReportOptions
): string {
  const branding = getReportBranding(investment);
  const currentDate = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getScenarioName = () => {
    const prod = investment.averageProductionPerHectare;
    const price = investment.averageSalePricePerKg;

    if (prod === 25000 && price === 30) return 'Conservador';
    if (prod === 30000 && price === 35) return 'Moderado';
    if (prod === 35000 && price === 38) return 'Optimista';
    return 'Personalizado';
  };

  const scenarioName = getScenarioName();

  const compoundData = generateCompoundInterestData(investment);
  const comparison = calculateCompoundInterestComparison(investment, results);
  const investmentComparison = calculateInvestmentComparison(investment, results);

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reporte del Interés Compuesto Multiplicador - ${branding.companyName}</title>
      
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: #1f2937;
          background: #f3f4f6;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          overflow: hidden;
        }
        
        .header {
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          color: white;
          padding: 50px 30px;
          text-align: center;
          position: relative;
        }
        
        .header-logos {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 40px;
          margin-bottom: 40px;
        }
        
        .logo {
          height: 100px;
          width: auto;
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3));
          drop-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        }
        
        .multiplier-icon {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
        }
        
        .header h1 {
          font-size: 3em;
          margin-bottom: 15px;
          font-weight: bold;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .header .subtitle {
          font-size: 1.4em;
          opacity: 0.9;
          margin-bottom: 15px;
        }
        
        .header .tagline {
          font-size: 1.1em;
          opacity: 0.8;
          background: rgba(255, 255, 255, 0.2);
          padding: 15px 30px;
          border-radius: 25px;
          display: inline-block;
          margin-bottom: 20px;
        }
        
        .header .date {
          font-size: 1em;
          opacity: 0.7;
        }
        
        .content {
          padding: 40px;
        }
        
        .section {
          margin-bottom: 50px;
          padding: 30px;
          background: #f8fafc;
          border-radius: 15px;
          border-left: 6px solid #8b5cf6;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .section-title {
          font-size: 2em;
          font-weight: bold;
          color: #8b5cf6;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 3px solid #a78bfa;
          text-align: center;
        }
        
        .advisor-section {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          padding: 30px;
          border-radius: 15px;
          margin-bottom: 40px;
          border: none;
        }
        
        .revolution-section {
          background: linear-gradient(135deg, #16a34a, #22c55e);
          color: white;
          padding: 40px;
          border-radius: 20px;
          margin: 40px 0;
          text-align: center;
          border: none;
        }
        
        .revolution-title {
          font-size: 2.5em;
          font-weight: bold;
          margin-bottom: 30px;
        }
        
        .revolution-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          margin: 30px 0;
        }
        
        .revolution-card {
          background: rgba(255, 255, 255, 0.2);
          padding: 30px;
          border-radius: 15px;
          text-align: center;
        }
        
        .revolution-number {
          font-size: 4em;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .revolution-label {
          font-size: 1.2em;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .revolution-desc {
          font-size: 0.9em;
          opacity: 0.9;
        }
        
        .pillars-section {
          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
          padding: 40px;
          border-radius: 20px;
          margin: 40px 0;
          border: 3px solid #16a34a;
        }
        
        .pillars-title {
          font-size: 2.2em;
          font-weight: bold;
          color: #16a34a;
          text-align: center;
          margin-bottom: 40px;
        }
        
        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 25px;
        }
        
        .pillar-card {
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border-left: 5px solid #16a34a;
        }
        
        .pillar-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .pillar-number {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #16a34a, #22c55e);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1.8em;
        }
        
        .pillar-title {
          color: #16a34a;
          font-size: 1.3em;
          font-weight: bold;
        }
        
        .pillar-description {
          color: #374151;
          margin-bottom: 20px;
          font-weight: 600;
          font-size: 1.1em;
        }
        
        .pillar-examples {
          list-style: none;
          padding: 0;
        }
        
        .pillar-examples li {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          margin-bottom: 12px;
          color: #374151;
        }
        
        .pillar-arrow {
          color: #16a34a;
          font-weight: bold;
          margin-top: 2px;
        }
        
        .comparison-section {
          background: linear-gradient(135deg, #dbeafe, #bfdbfe);
          padding: 40px;
          border-radius: 20px;
          margin: 40px 0;
          border: 3px solid #3b82f6;
        }
        
        .comparison-title {
          font-size: 2em;
          font-weight: bold;
          color: #1e40af;
          text-align: center;
          margin-bottom: 30px;
        }
        
        .comparison-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin: 30px 0;
        }
        
        .comparison-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .comparison-card.primary {
          background: linear-gradient(135deg, #dcfce7, #bbf7d0);
          border: 2px solid #16a34a;
        }
        
        .comparison-card h3 {
          color: #6b7280;
          margin-bottom: 20px;
          text-align: center;
          font-size: 1.2em;
        }
        
        .comparison-card.primary h3 {
          color: #16a34a;
          font-weight: bold;
        }
        
        .comparison-metric {
          margin-bottom: 15px;
        }
        
        .comparison-metric strong {
          color: #1f2937;
        }
        
        .multiplier-highlight {
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          color: white;
          padding: 30px;
          border-radius: 15px;
          text-align: center;
          margin: 30px 0;
        }
        
        .multiplier-highlight h3 {
          font-size: 1.8em;
          margin-bottom: 20px;
          font-weight: bold;
        }
        
        .multiplier-stats {
          font-size: 1.3em;
          margin: 20px 0;
          line-height: 1.8;
        }
        
        .table-container {
          overflow-x: auto;
          margin: 25px 0;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }
        
        th {
          background: #8b5cf6;
          color: white;
          padding: 15px 10px;
          text-align: center;
          font-weight: bold;
          font-size: 0.9em;
        }
        
        td {
          padding: 12px 10px;
          text-align: center;
          border-bottom: 1px solid #e5e7eb;
          font-size: 0.9em;
        }
        
        tr:nth-child(even) {
          background: #f9fafb;
        }
        
        .cosecha-row {
          background: #dcfce7 !important;
          font-weight: bold;
          border-left: 4px solid #16a34a;
        }
        
        .contact-section {
          background: linear-gradient(135deg, #dbeafe, #bfdbfe);
          padding: 30px;
          border-radius: 12px;
          margin: 30px 0;
          border: 2px solid #3b82f6;
        }
        
        .contact-title {
          font-size: 1.5em;
          font-weight: bold;
          color: #1e40af;
          margin-bottom: 25px;
          text-align: center;
        }
        
        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        
        .contact-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #bfdbfe;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .contact-card h4 {
          font-size: 1.1em;
          font-weight: bold;
          color: #1e40af;
          margin-bottom: 12px;
        }
        
        .contact-card p {
          margin-bottom: 6px;
          color: #374151;
          line-height: 1.4;
        }
        
        .disclaimer {
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          padding: 25px;
          border-radius: 12px;
          margin: 30px 0;
          border: 2px solid #f59e0b;
        }
        
        .disclaimer h4 {
          font-size: 1.3em;
          font-weight: bold;
          color: #92400e;
          margin-bottom: 15px;
        }
        
        .disclaimer p {
          color: #78350f;
          line-height: 1.5;
        }
        
        .footer {
          text-align: center;
          margin-top: 40px;
          padding: 25px;
          background: #f3f4f6;
          border-radius: 8px;
          color: #6b7280;
        }
        
        .print-button {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #8b5cf6;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }
        
        .print-button:hover {
          background: #7c3aed;
        }
        
        @media print {
          body {
            background: white;
            padding: 0;
          }
          
          .print-button {
            display: none;
          }
          
          .container {
            box-shadow: none;
          }
          
          .section {
            page-break-inside: avoid;
          }
        }
        
        @media (max-width: 768px) {
          body {
            padding: 10px;
          }
          
          .content {
            padding: 20px;
          }
          
          .header {
            padding: 40px 20px;
          }
          
          .header h1 {
            font-size: 2.2em;
          }
          
          .header-logos {
            flex-direction: column;
            gap: 25px;
          }
          
          .logo {
            height: 70px;
          }
          
          .multiplier-icon {
            width: 60px;
            height: 60px;
            font-size: 30px;
          }
        }
      </style>
    </head>
    <body>
      <button class="print-button" onclick="window.print()">🖨️ Imprimir Reporte</button>
      
      <div class="container">
        <!-- HEADER -->
        <div class="header">
          <div class="header-logos">
            <img src="/rider_inversiones.png" alt="${branding.companyName}" class="logo">
            <div class="multiplier-icon">⚡</div>
          </div>
          <h1>${compoundMultiplierContent.title}</h1>
          <div class="subtitle">${compoundMultiplierContent.subtitle}</div>
          <div class="tagline">${compoundMultiplierContent.tagline}</div>
          <div class="date">${currentDate}</div>
        </div>
        
        <div class="content">
          <!-- INFORMACIÓN DEL ASESOR -->
          <div class="advisor-section">
            <div class="advisor-title">Información del Asesor</div>
            <div class="advisor-grid">
              <div class="advisor-item">
                <div class="advisor-label">👤 Nombre del Asesor</div>
                <div class="advisor-value">${options.advisorName}</div>
              </div>
              <div class="advisor-item">
                <div class="advisor-label">📞 Teléfono</div>
                <div class="advisor-value">${options.advisorPhone}</div>
              </div>
              <div class="advisor-item">
                <div class="advisor-label">📧 Email</div>
                <div class="advisor-value">${options.advisorEmail}</div>
              </div>
            </div>
          </div>

          <!-- TU REVOLUCIÓN FINANCIERA PERSONAL -->
          <div class="revolution-section">
            <div class="revolution-title">🚀 Tu Revolución Financiera Personal</div>
            <div class="revolution-grid">
              <div class="revolution-card">
                <div class="revolution-number">${investment.initialCertificates}</div>
                <div class="revolution-label">Tickets de Inversión que compras</div>
                <div class="revolution-desc">Tu inversión inicial</div>
              </div>
              <div class="revolution-card">
                <div class="revolution-number">${results.certificatesSummary.totalCertificates}</div>
                <div class="revolution-label">Tickets de Inversión que tendrás</div>
                <div class="revolution-desc">Con el Multiplicador</div>
              </div>
              <div class="revolution-card">
                <div class="revolution-number">+${results.certificatesSummary.fromReinvestment}</div>
                <div class="revolution-label">Tickets de Inversión POR REINVERSIÓN</div>
                <div class="revolution-desc">Por reinversión automática</div>
              </div>
            </div>
            
            <div style="background: rgba(255, 255, 255, 0.2); padding: 25px; border-radius: 15px; margin-top: 30px;">
              <h3 style="margin-bottom: 15px;">🏆 El Poder del Multiplicador</h3>
              <p style="font-size: 1.3em; margin: 15px 0;">
                <strong>Multiplicador de Activos: ${(results.certificatesSummary.totalCertificates / investment.initialCertificates).toFixed(1)}x</strong><br>
                <strong>Multiplicador de Patrimonio: ${results.capitalMultiplier.toFixed(1)}x</strong><br>
                <strong>Nuevas Fuentes de Ingresos: +${results.certificatesSummary.fromReinvestment}</strong>
              </p>
            </div>
          </div>

          <!-- LOS 4 PILARES DEL MULTIPLICADOR -->
          <div class="pillars-section">
            <div class="pillars-title">${compoundMultiplierContent.pillars.title}</div>
            <div class="pillars-grid">
              ${compoundMultiplierContent.pillars.items.map(pillar => `
                <div class="pillar-card">
                  <div class="pillar-header">
                    <div class="pillar-number">${pillar.number}</div>
                    <h3 class="pillar-title">${pillar.title}</h3>
                  </div>
                  <p class="pillar-description">${pillar.description}</p>
                  <ul class="pillar-examples">
                    ${pillar.examples.map(example => `
                      <li>
                        <span class="pillar-arrow">→</span>
                        <span>${example}</span>
                      </li>
                    `).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- COMPARACIÓN: INTERÉS SIMPLE VS MULTIPLICADOR -->
          <div class="comparison-section">
            <div class="comparison-title">Comparación: Interés Simple vs Interés Compuesto Multiplicador</div>
            <div class="comparison-grid">
              <div class="comparison-card">
                <h3 style="color: #6b7280; margin-bottom: 20px;">Sin Reinversión (Interés Simple)</h3>
                <div class="comparison-metric"><strong>Tickets de Inversión:</strong> ${comparison.withoutReinvestment.certificates}</div>
                <div class="comparison-metric"><strong>Patrimonio Final:</strong> ${formatCurrency(convertFromMXN(comparison.withoutReinvestment.patrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</div>
                <div class="comparison-metric"><strong>Ingreso Mensual:</strong> ${formatCurrency(convertFromMXN(comparison.withoutReinvestment.monthlyIncome, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</div>
                <div class="comparison-metric"><strong>Multiplicador:</strong> ${comparison.withoutReinvestment.multiplier.toFixed(1)}x</div>
              </div>
              
              <div class="comparison-card primary">
                <h3 style="color: #16a34a; margin-bottom: 20px;">Con Multiplicador (Interés Compuesto)</h3>
                <div class="comparison-metric"><strong>Tickets de Inversión:</strong> ${comparison.withReinvestment.certificates}</div>
                <div class="comparison-metric"><strong>Patrimonio Final:</strong> ${formatCurrency(convertFromMXN(comparison.withReinvestment.patrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</div>
                <div class="comparison-metric"><strong>Ingreso Mensual:</strong> ${formatCurrency(convertFromMXN(comparison.withReinvestment.monthlyIncome, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</div>
                <div class="comparison-metric"><strong>Multiplicador:</strong> ${comparison.withReinvestment.multiplier.toFixed(1)}x</div>
              </div>
            </div>
            
            <div class="multiplier-highlight">
              <h3>Efecto Multiplicador del Interés Compuesto</h3>
              <div class="multiplier-stats">
                <strong>${(comparison.withReinvestment.certificates / comparison.withoutReinvestment.certificates).toFixed(1)}x más Tickets de Inversión</strong> | 
                <strong>${(comparison.withReinvestment.patrimony / comparison.withoutReinvestment.patrimony).toFixed(1)}x más patrimonio</strong> | 
                <strong>${(comparison.withReinvestment.monthlyIncome / comparison.withoutReinvestment.monthlyIncome).toFixed(1)}x más ingresos</strong>
              </div>
            </div>
          </div>

          <!-- COMPARATIVO CON OTRAS INVERSIONES -->
          <div class="section">
            <h2 class="section-title">Comparativo con Otras Inversiones</h2>
            
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Tipo de Inversión</th>
                    <th>Patrimonio Final</th>
                    <th>Ingreso Mensual</th>
                    <th>Multiplicador</th>
                    <th>Estrategia</th>
                    <th>Superioridad vs ${branding.companyName}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="cosecha-row">
                    <td><strong>🌱 ${branding.companyName}</strong></td>
                    <td><strong>${formatCurrency(convertFromMXN(investmentComparison.cosechaCapital.patrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</strong></td>
                    <td><strong>${formatCurrency(convertFromMXN(investmentComparison.cosechaCapital.monthlyIncome, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</strong></td>
                    <td><strong>${investmentComparison.cosechaCapital.multiplier.toFixed(1)}x</strong></td>
                    <td><strong>Portafolio Diversificado (${investmentComparison.cosechaCapital.certificates} certificados)</strong></td>
                    <td><strong>100% (Referencia)</strong></td>
                  </tr>
                  <tr>
                    <td>📊 CETES</td>
                    <td>${formatCurrency(convertFromMXN(investmentComparison.cetes.patrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                    <td>${formatCurrency(convertFromMXN(investmentComparison.cetes.monthlyIncome, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                    <td>${investmentComparison.cetes.multiplier.toFixed(1)}x</td>
                    <td>Activo Único</td>
                    <td>${((investmentComparison.cetes.patrimony / investmentComparison.cosechaCapital.patrimony) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td>🏦 Ahorro Tradicional</td>
                    <td>${formatCurrency(convertFromMXN(investmentComparison.savings.patrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                    <td>${formatCurrency(convertFromMXN(investmentComparison.savings.monthlyIncome, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                    <td>${investmentComparison.savings.multiplier.toFixed(1)}x</td>
                    <td>Activo Único</td>
                    <td>${((investmentComparison.savings.patrimony / investmentComparison.cosechaCapital.patrimony) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td>🏠 Bienes Raíces</td>
                    <td>${formatCurrency(convertFromMXN(investmentComparison.realEstate.patrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                    <td>${formatCurrency(convertFromMXN(investmentComparison.realEstate.monthlyIncome, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                    <td>${investmentComparison.realEstate.multiplier.toFixed(1)}x</td>
                    <td>Activo Único</td>
                    <td>${((investmentComparison.realEstate.patrimony / investmentComparison.cosechaCapital.patrimony) * 100).toFixed(1)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="multiplier-highlight">
              <h3>🏆 Ventaja Competitiva de ${branding.companyName}</h3>
              <div class="multiplier-stats">
                <strong>Estrategia Diversificada:</strong> ${investmentComparison.cosechaCapital.certificates} certificados vs 1 activo único<br>
                <strong>Mejor Rendimiento:</strong> Supera a la segunda mejor opción por ${Math.max(
                  investmentComparison.cosechaCapital.patrimony / investmentComparison.cetes.patrimony,
                  investmentComparison.cosechaCapital.patrimony / investmentComparison.savings.patrimony,
                  investmentComparison.cosechaCapital.patrimony / investmentComparison.realEstate.patrimony
                ).toFixed(1)}x<br>
                <strong>Activo Real:</strong> Respaldado por plantaciones productivas, no solo papel
              </div>
            </div>
          </div>

          <!-- EVOLUCIÓN DETALLADA -->
          <div class="section">
            <h2 class="section-title">Evolución Detallada por Año</h2>

            <!-- ESCENARIO DE PRODUCCIÓN -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px; padding: 20px; margin-bottom: 24px; border-left: 5px solid #047857; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="background: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div style="flex: 1;">
                  <div style="color: white; font-size: 18px; font-weight: 700; margin-bottom: 4px;">Escenario de Producción: ${scenarioName}</div>
                  <div style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin-bottom: 6px;">Los cálculos reflejan la proyección realista basada en datos históricos de producción</div>
                  <div style="display: flex; gap: 16px; margin-top: 8px;">
                    <div style="background: rgba(255, 255, 255, 0.2); padding: 6px 12px; border-radius: 6px; font-size: 13px;">
                      <span style="color: rgba(255, 255, 255, 0.8);">Producción:</span>
                      <strong style="color: white; margin-left: 4px;">${investment.averageProductionPerHectare.toLocaleString()} kg/ha</strong>
                    </div>
                    <div style="background: rgba(255, 255, 255, 0.2); padding: 6px 12px; border-radius: 6px; font-size: 13px;">
                      <span style="color: rgba(255, 255, 255, 0.8);">Precio:</span>
                      <strong style="color: white; margin-left: 4px;">$${investment.averageSalePricePerKg}/kg</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Año</th>
                    <th>Total Tickets de Inversión</th>
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
                    <tr ${data.keyMilestone ? 'class="highlight-row"' : ''}>
                      <td>${data.year}</td>
                      <td>${data.certificates.total}</td>
                      <td>${data.certificates.producing}</td>
                      <td>${data.certificates.waiting}</td>
                      <td>${data.certificates.reserved}</td>
                      <td>${formatCurrency(convertFromMXN(data.patrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                      <td>${formatCurrency(convertFromMXN(data.monthlyIncome, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                      <td>
                        ${data.keyMilestone ? `<strong>${data.keyMilestone.description}</strong><br>` : ''}
                        ${data.events.join('<br>')}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- CONCLUSIONES -->
          <div class="section">
            <h2 class="section-title">Conclusiones del Interés Compuesto Multiplicador</h2>
            <ul style="list-style: disc; padding-left: 25px; color: #374151; line-height: 1.8;">
              <li>El Interés Compuesto Multiplicador permite transformar una inversión inicial de ${investment.initialCertificates} certificado${investment.initialCertificates > 1 ? 's' : ''} en un portafolio de ${comparison.withReinvestment.certificates} certificados.</li>
              <li>En el mes 49, el inversionista puede elegir seguir el plan de reinversión para generar ${(comparison.withReinvestment.multiplier / comparison.withoutReinvestment.multiplier).toFixed(1)}x más rendimiento que una estrategia sin reinversión.</li>
              <li>La diversificación del portafolio reduce el riesgo al distribuir la inversión entre múltiples activos en diferentes fases.</li>
              <li>El crecimiento exponencial se acelera significativamente después del año 5, cuando los Tickets de Inversión iniciales comienzan a producir y el inversionista puede elegir reinvertir.</li>
              <li>Has logrado lo que el 99% de inversionistas nunca conseguirá: MULTIPLICAR tus activos, no solo tu dinero.</li>
            </ul>
          </div>

          <!-- CONTACTO Y CUENTAS BANCARIAS -->
          <div class="contact-section">
            <div class="contact-title">Información de Contacto y Cuentas Bancarias</div>
            <div class="contact-grid">
              <div class="contact-card">
                <h4>📞 Contacto Principal</h4>
                <p><strong>WhatsApp:</strong> ${branding.phone}</p>
                <p><strong>Email:</strong> ${branding.email}</p>
                <p><strong>Horario:</strong> Lun-Vie 9:00-18:00</p>
                <p><strong>Atención:</strong> Inmediata por WhatsApp</p>
              </div>
              
              <div class="contact-card">
                <h4>💳 Pago con Tarjeta</h4>
                <p><strong>Link de Pago:</strong></p>
                <p style="font-size: 0.9em; word-break: break-all; color: #3b82f6;">
                  <a href="https://inversion.citruspatrimonial.com/b/14k9EAdvE78T0N26oN" target="_blank">
                    https://inversion.citruspatrimonial.com/b/14k9EAdvE78T0N26oN
                  </a>
                </p>
                <p><strong>Disponible:</strong> 24/7</p>
                <p><strong>Procesamiento:</strong> Seguro y encriptado</p>
              </div>
              
              <div class="contact-card">
                <h4>🏛️ FIDECOMISO 697</h4>
                <p><strong>Banco:</strong> INSTITUCIÓN DE BANCA MÚLTIPLE, GRUPO FINANCIERO VE POR MÁS</p>
                <p><strong>No. de Cuenta:</strong> 00000701758</p>
                <p><strong>CLABE:</strong> 113180000007017586</p>
                <p style="color: #dc2626; font-weight: bold;">SOLO TRANSFERENCIA</p>
              </div>
              
              <div class="contact-card">
                <h4>🏦 SANTANDER</h4>
                <p><strong>No. de Cuenta:</strong> 65 511166996</p>
                <p><strong>CLABE:</strong> 014910655111669968</p>
                <p style="color: #16a34a; font-weight: bold;">SOLO EFECTIVO</p>
              </div>
              
              <div class="contact-card">
                <h4>💵 CUENTAS EN DÓLARES</h4>
                <p><strong>Banco:</strong> JP MORGAN CHASE BANK N.A.</p>
                <p><strong>No. de Cuenta:</strong> 3367971222</p>
                <p><strong>ABA (ACH):</strong> 111000614</p>
                <p><strong>Routing No. (Wire Transfer):</strong> 21000021</p>
              </div>
            </div>
          </div>
          <!-- PLAN DE FINANCIAMIENTO -->
          ${generateFinancingPlanHTML(investment, {
            downPaymentPercent: investment.financingDownPaymentPercent ?? options.downPaymentPercent ?? 30,
            annualInterestRate: investment.financingAnnualInterestRate ?? options.annualInterestRate ?? 12
          })}

          <!-- DISCLAIMER -->
          <div class="disclaimer">
            <h4>⚠️ Aviso Legal Importante</h4>
            <p>Las proyecciones mostradas en este reporte son estimaciones basadas en los parámetros especificados y datos históricos del sector agrícola.
            No constituyen garantías de rendimientos futuros. Los resultados reales pueden variar debido a factores de mercado,
            climáticos, económicos y otros riesgos inherentes a la inversión agrícola. Se recomienda consultar con un asesor financiero
            antes de tomar decisiones de inversión. ${branding.companyName} no garantiza rendimientos específicos y toda inversión conlleva riesgos.</p>
            <p style="margin-top: 15px;"><strong>Este documento es únicamente informativo y no genera obligaciones contractuales.</strong>
            La información presentada no debe considerarse como asesoramiento legal, fiscal o de inversión.
            Todas las decisiones de inversión deben basarse en una evaluación completa de los documentos oficiales y contratos correspondientes.</p>
          </div>

          <!-- FOOTER -->
          <div class="footer">
            <p><strong>© 2025 ${branding.companyName} - Interés Compuesto Multiplicador</strong></p>
            <p>Este reporte es confidencial y está dirigido exclusivamente al cliente mencionado.</p>
            <p><strong>Para más información:</strong> ${branding.email} | WhatsApp: ${branding.phone}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}