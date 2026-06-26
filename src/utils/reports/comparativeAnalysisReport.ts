import { Investment, InvestmentResults } from '../../types';
import { formatCurrency, convertFromMXN } from '../formatters';
import { getDetailedCertificateEvolution } from '../calculations/certificateEvolution';
import { generateFinancingPlanHTML } from './financingPlanReport';
import { getReportBranding } from './reportConfig';

export interface ReportOptions {
  advisorName: string;
  advisorPhone: string;
  advisorEmail: string;
  clientName?: string;
}

export function generateComparativeAnalysisReport(
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

  const initialInvestment = convertFromMXN(
    investment.initialCertificates * investment.certificateBasePrice,
    investment.currencyFormat,
    investment.exchangeRate,
    investment.exchangeRateEUR
  );

  // Calculate comparative investments
  const cetesPatrimony = convertFromMXN(results.cetesPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR);
  const savingsPatrimony = convertFromMXN(results.savingsPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR);
  const realEstatePatrimony = convertFromMXN(results.realEstatePatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR);
  const cosechaPatrimony = convertFromMXN(results.finalPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR);

  // Generate charts data
  const generatePlusvaliaBars = () => {
    const maxValue = Math.max(cosechaPatrimony, cetesPatrimony, savingsPatrimony, realEstatePatrimony);
    const chartHeight = 200;
    
    return `
      <div class="bar-item">
        <div class="bar cosecha-bar" style="height: ${(cosechaPatrimony / maxValue) * chartHeight}px;"></div>
        <div class="bar-label">${branding.companyName}</div>
        <div class="bar-value">${formatCurrency(cosechaPatrimony, investment.currencyFormat)}</div>
      </div>
      <div class="bar-item">
        <div class="bar cetes-bar" style="height: ${(cetesPatrimony / maxValue) * chartHeight}px;"></div>
        <div class="bar-label">CETES</div>
        <div class="bar-value">${formatCurrency(cetesPatrimony, investment.currencyFormat)}</div>
      </div>
      <div class="bar-item">
        <div class="bar savings-bar" style="height: ${(savingsPatrimony / maxValue) * chartHeight}px;"></div>
        <div class="bar-label">Ahorro</div>
        <div class="bar-value">${formatCurrency(savingsPatrimony, investment.currencyFormat)}</div>
      </div>
      <div class="bar-item">
        <div class="bar realestate-bar" style="height: ${(realEstatePatrimony / maxValue) * chartHeight}px;"></div>
        <div class="bar-label">Bienes Raíces</div>
        <div class="bar-value">${formatCurrency(realEstatePatrimony, investment.currencyFormat)}</div>
      </div>
    `;
  };

  const generateRendimientosBars = () => {
    const cosechaIncome = convertFromMXN(results.finalMonthlyIncome * 12, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR);
    const cetesIncome = cetesPatrimony * (investment.cetesRate / 100);
    const savingsIncome = savingsPatrimony * (investment.savingsRate / 100);
    const realEstateIncome = realEstatePatrimony * (investment.realEstateRent / 100);
    
    const maxIncome = Math.max(cosechaIncome, cetesIncome, savingsIncome, realEstateIncome);
    const chartHeight = 200;
    
    return `
      <div class="bar-item">
        <div class="bar cosecha-bar" style="height: ${(cosechaIncome / maxIncome) * chartHeight}px;"></div>
        <div class="bar-label">${branding.companyName}</div>
        <div class="bar-value">${formatCurrency(cosechaIncome, investment.currencyFormat)}</div>
      </div>
      <div class="bar-item">
        <div class="bar cetes-bar" style="height: ${(cetesIncome / maxIncome) * chartHeight}px;"></div>
        <div class="bar-label">CETES</div>
        <div class="bar-value">${formatCurrency(cetesIncome, investment.currencyFormat)}</div>
      </div>
      <div class="bar-item">
        <div class="bar savings-bar" style="height: ${(savingsIncome / maxIncome) * chartHeight}px;"></div>
        <div class="bar-label">Ahorro</div>
        <div class="bar-value">${formatCurrency(savingsIncome, investment.currencyFormat)}</div>
      </div>
      <div class="bar-item">
        <div class="bar realestate-bar" style="height: ${(realEstateIncome / maxIncome) * chartHeight}px;"></div>
        <div class="bar-label">Bienes Raíces</div>
        <div class="bar-value">${formatCurrency(realEstateIncome, investment.currencyFormat)}</div>
      </div>
    `;
  };

  const generatePatrimonialEvolution = () => {
    const periods = [5, 10, 15, 20, 25];
    return periods.filter(year => year <= investment.years).map(year => {
      const cosechaValue = convertFromMXN(
        results.yearlyData[year - 1]?.citrusPatrimony || 0,
        investment.currencyFormat,
        investment.exchangeRate,
        investment.exchangeRateEUR
      );
      const cetesValue = convertFromMXN(
        initialInvestment * Math.pow(1 + investment.cetesRate / 100, year),
        investment.currencyFormat,
        investment.exchangeRate,
        investment.exchangeRateEUR
      );
      const savingsValue = convertFromMXN(
        initialInvestment * Math.pow(1 + investment.savingsRate / 100, year),
        investment.currencyFormat,
        investment.exchangeRate,
        investment.exchangeRateEUR
      );
      const realEstateValue = convertFromMXN(
        initialInvestment * Math.pow(1 + investment.realEstateAppreciation / 100, year),
        investment.currencyFormat,
        investment.exchangeRate,
        investment.exchangeRateEUR
      );
      
      return `
        <tr ${year === investment.years ? 'class="highlight-row"' : ''}>
          <td><strong>Año ${year}</strong></td>
          <td style="background: #dcfce7; font-weight: bold;">${formatCurrency(cosechaValue, investment.currencyFormat)}</td>
          <td>${formatCurrency(cetesValue, investment.currencyFormat)}</td>
          <td>${formatCurrency(savingsValue, investment.currencyFormat)}</td>
          <td>${formatCurrency(realEstateValue, investment.currencyFormat)}</td>
          <td style="color: #16a34a; font-weight: bold;">${(cosechaValue / Math.max(cetesValue, savingsValue, realEstateValue)).toFixed(1)}x</td>
        </tr>
      `;
    }).join('');
  };

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reporte de Análisis Comparativo - ${branding.companyName}</title>
      
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
          background: #f1f5f9;
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
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
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
        
        .chart-icon {
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
          margin-bottom: 10px;
        }
        
        .header .date {
          font-size: 1em;
          opacity: 0.8;
        }
        
        .content {
          padding: 40px;
        }
        
        .section {
          margin-bottom: 50px;
          padding: 30px;
          background: #f8fafc;
          border-radius: 15px;
          border-left: 6px solid #0ea5e9;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .section-title {
          font-size: 2em;
          font-weight: bold;
          color: #0ea5e9;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 3px solid #38bdf8;
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
        
        .advisor-title {
          font-size: 1.5em;
          font-weight: bold;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .advisor-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        
        .advisor-item {
          background: rgba(255, 255, 255, 0.2);
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }
        
        .advisor-label {
          font-size: 0.9em;
          margin-bottom: 8px;
          font-weight: 500;
          opacity: 0.9;
        }
        
        .advisor-value {
          font-size: 1.1em;
          font-weight: bold;
        }
        
        .chart-section {
          margin: 30px 0;
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 2px solid #e2e8f0;
        }
        
        .chart-title {
          font-size: 1.5em;
          font-weight: bold;
          color: #374151;
          margin-bottom: 25px;
          text-align: center;
          padding-bottom: 15px;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .bar-chart {
          display: flex;
          justify-content: space-around;
          align-items: end;
          height: 250px;
          background: #f8fafc;
          padding: 25px;
          border-radius: 12px;
          border: 2px solid #e5e7eb;
          margin: 25px 0;
        }
        
        .bar-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 140px;
        }
        
        .bar {
          width: 50px;
          min-height: 20px;
          border-radius: 6px 6px 0 0;
          margin-bottom: 15px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          position: relative;
        }
        
        .cosecha-bar {
          background: linear-gradient(to top, #16a34a, #22c55e);
        }
        
        .cetes-bar {
          background: linear-gradient(to top, #0284c7, #0ea5e9);
        }
        
        .savings-bar {
          background: linear-gradient(to top, #7c3aed, #8b5cf6);
        }
        
        .realestate-bar {
          background: linear-gradient(to top, #ea580c, #f97316);
        }
        
        .bar-label {
          font-size: 0.9em;
          color: #374151;
          margin-bottom: 8px;
          text-align: center;
          font-weight: bold;
        }
        
        .bar-value {
          font-size: 0.8em;
          font-weight: bold;
          color: #1f2937;
          text-align: center;
          background: white;
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
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
          background: #0ea5e9;
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
        
        .highlight-row {
          background: #fef3c7 !important;
          font-weight: bold;
        }
        
        .area-section {
          background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
          padding: 40px;
          border-radius: 20px;
          margin: 40px 0;
          border: 3px solid #0ea5e9;
        }
        
        .area-title {
          font-size: 2.2em;
          font-weight: bold;
          color: #0c4a6e;
          text-align: center;
          margin-bottom: 30px;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 25px 0;
        }
        
        .metric-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 2px solid #e2e8f0;
        }
        
        .metric-card.primary {
          background: linear-gradient(135deg, #dcfce7, #bbf7d0);
          border-color: #16a34a;
        }
        
        .metric-card h4 {
          font-size: 1.1em;
          font-weight: bold;
          margin-bottom: 15px;
          color: #374151;
        }
        
        .metric-value {
          font-size: 1.8em;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 8px;
        }
        
        .metric-label {
          font-size: 0.9em;
          color: #6b7280;
        }
        
        .advantage-highlight {
          background: linear-gradient(135deg, #16a34a, #22c55e);
          color: white;
          padding: 30px;
          border-radius: 15px;
          text-align: center;
          margin: 30px 0;
        }
        
        .advantage-highlight h3 {
          font-size: 1.8em;
          margin-bottom: 20px;
          font-weight: bold;
        }
        
        .advantage-stats {
          font-size: 1.2em;
          margin: 20px 0;
          line-height: 1.8;
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
          background: #0ea5e9;
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
          background: #0284c7;
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
          
          .chart-icon {
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
            <div class="chart-icon">📊</div>
          </div>
          <h1>Reporte de Análisis Comparativo</h1>
          <div class="subtitle">${branding.companyName} vs Inversiones Tradicionales</div>
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

          <!-- ÁREA 1: ANÁLISIS DE PLUSVALÍA -->
          <div class="area-section">
            <div class="area-title">📈 ÁREA 1: ANÁLISIS DE PLUSVALÍA</div>

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

            <div class="chart-section">
              <div class="chart-title">Comparación de Valores Finales (Año ${investment.years})</div>
              <div class="bar-chart">
                ${generatePlusvaliaBars()}
              </div>
            </div>

            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Período</th>
                    <th>${branding.companyName}</th>
                    <th>CETES</th>
                    <th>Ahorro Tradicional</th>
                    <th>Bienes Raíces</th>
                    <th>Ventaja Cosecha</th>
                  </tr>
                </thead>
                <tbody>
                  ${generatePatrimonialEvolution()}
                </tbody>
              </table>
            </div>

            <div class="metrics-grid">
              <div class="metric-card primary">
                <h4>🌱 ${branding.companyName}</h4>
                <div class="metric-value">${formatCurrency(cosechaPatrimony, investment.currencyFormat)}</div>
                <div class="metric-label">Valor Final</div>
              </div>
              <div class="metric-card">
                <h4>📊 CETES</h4>
                <div class="metric-value">${formatCurrency(cetesPatrimony, investment.currencyFormat)}</div>
                <div class="metric-label">Valor Final</div>
              </div>
              <div class="metric-card">
                <h4>🏦 Ahorro</h4>
                <div class="metric-value">${formatCurrency(savingsPatrimony, investment.currencyFormat)}</div>
                <div class="metric-label">Valor Final</div>
              </div>
              <div class="metric-card">
                <h4>🏠 Bienes Raíces</h4>
                <div class="metric-value">${formatCurrency(realEstatePatrimony, investment.currencyFormat)}</div>
                <div class="metric-label">Valor Final</div>
              </div>
            </div>
          </div>

          <!-- ÁREA 2: ANÁLISIS DE RENDIMIENTOS -->
          <div class="area-section">
            <div class="area-title">💰 ÁREA 2: ANÁLISIS DE RENDIMIENTOS</div>
            
            <div class="chart-section">
              <div class="chart-title">Comparación de Ingresos Anuales Finales</div>
              <div class="bar-chart">
                ${generateRendimientosBars()}
              </div>
            </div>

            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Tipo de Inversión</th>
                    <th>Ingreso Anual</th>
                    <th>Ingreso Mensual</th>
                    <th>Yield %</th>
                    <th>Eficiencia</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="cosecha-row">
                    <td><strong>🌱 ${branding.companyName}</strong></td>
                    <td><strong>${formatCurrency(convertFromMXN(results.finalMonthlyIncome * 12, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</strong></td>
                    <td><strong>${formatCurrency(convertFromMXN(results.finalMonthlyIncome, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</strong></td>
                    <td><strong>${((results.finalMonthlyIncome * 12) / results.finalPatrimony * 100).toFixed(1)}%</strong></td>
                    <td><strong>Excelente</strong></td>
                  </tr>
                  <tr>
                    <td>📊 CETES</td>
                    <td>${formatCurrency(cetesPatrimony * (investment.cetesRate / 100), investment.currencyFormat)}</td>
                    <td>${formatCurrency(cetesPatrimony * (investment.cetesRate / 100) / 12, investment.currencyFormat)}</td>
                    <td>${investment.cetesRate.toFixed(1)}%</td>
                    <td>Buena</td>
                  </tr>
                  <tr>
                    <td>🏦 Ahorro Tradicional</td>
                    <td>${formatCurrency(savingsPatrimony * (investment.savingsRate / 100), investment.currencyFormat)}</td>
                    <td>${formatCurrency(savingsPatrimony * (investment.savingsRate / 100) / 12, investment.currencyFormat)}</td>
                    <td>${investment.savingsRate.toFixed(1)}%</td>
                    <td>Baja</td>
                  </tr>
                  <tr>
                    <td>🏠 Bienes Raíces</td>
                    <td>${formatCurrency(realEstatePatrimony * (investment.realEstateRent / 100), investment.currencyFormat)}</td>
                    <td>${formatCurrency(realEstatePatrimony * (investment.realEstateRent / 100) / 12, investment.currencyFormat)}</td>
                    <td>${investment.realEstateRent.toFixed(1)}%</td>
                    <td>Moderada</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ÁREA 3: ANÁLISIS PATRIMONIAL -->
          <div class="area-section">
            <div class="area-title">🏆 ÁREA 3: ANÁLISIS PATRIMONIAL</div>
            
            <div class="metrics-grid">
              <div class="metric-card primary">
                <h4>Multiplicador de Capital</h4>
                <div class="metric-value">${results.capitalMultiplier.toFixed(1)}x</div>
                <div class="metric-label">${branding.companyName}</div>
              </div>
              <div class="metric-card">
                <h4>CAGR</h4>
                <div class="metric-value">${(results.cagr).toFixed(1)}%</div>
                <div class="metric-label">Crecimiento anual</div>
              </div>
              <div class="metric-card">
                <h4>TIR</h4>
                <div class="metric-value">${(results.irr).toFixed(1)}%</div>
                <div class="metric-label">Tasa interna retorno</div>
              </div>
              <div class="metric-card">
                <h4>Payback</h4>
                <div class="metric-value">${typeof results.paybackYear === 'number' ? results.paybackYear.toFixed(2) : (results.paybackYear || 'N/A')}</div>
                <div class="metric-label">Año recuperación</div>
              </div>
            </div>

            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Década</th>
                    <th>${branding.companyName}</th>
                    <th>CETES</th>
                    <th>Ahorro</th>
                    <th>Bienes Raíces</th>
                    <th>Ventaja Cosecha</th>
                  </tr>
                </thead>
                <tbody>
                  ${[10, 20, 30].filter(year => year <= investment.years).map(year => {
                    const cosechaValue = convertFromMXN(
                      results.yearlyData[year - 1]?.citrusPatrimony || 0,
                      investment.currencyFormat,
                      investment.exchangeRate,
                      investment.exchangeRateEUR
                    );
                    const cetesValue = initialInvestment * Math.pow(1 + investment.cetesRate / 100, year);
                    const savingsValue = initialInvestment * Math.pow(1 + investment.savingsRate / 100, year);
                    const realEstateValue = initialInvestment * Math.pow(1 + investment.realEstateAppreciation / 100, year);
                    const bestAlternative = Math.max(cetesValue, savingsValue, realEstateValue);
                    
                    return `
                      <tr>
                        <td><strong>Año ${year}</strong></td>
                        <td style="background: #dcfce7; font-weight: bold;">${formatCurrency(cosechaValue, investment.currencyFormat)}</td>
                        <td>${formatCurrency(cetesValue, investment.currencyFormat)}</td>
                        <td>${formatCurrency(savingsValue, investment.currencyFormat)}</td>
                        <td>${formatCurrency(realEstateValue, investment.currencyFormat)}</td>
                        <td style="color: #16a34a; font-weight: bold;">${(cosechaValue / bestAlternative).toFixed(1)}x</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- ÁREA 4: TOTALES Y RESUMEN EJECUTIVO -->
          <div class="area-section">
            <div class="area-title">📋 ÁREA 4: TOTALES Y RESUMEN EJECUTIVO</div>
            
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Métrica</th>
                    <th>${branding.companyName}</th>
                    <th>CETES</th>
                    <th>Ahorro</th>
                    <th>Bienes Raíces</th>
                    <th>Ranking</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="cosecha-row">
                    <td><strong>Patrimonio Final</strong></td>
                    <td><strong>${formatCurrency(cosechaPatrimony, investment.currencyFormat)}</strong></td>
                    <td>${formatCurrency(cetesPatrimony, investment.currencyFormat)}</td>
                    <td>${formatCurrency(savingsPatrimony, investment.currencyFormat)}</td>
                    <td>${formatCurrency(realEstatePatrimony, investment.currencyFormat)}</td>
                    <td><strong>🥇 #1</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Ingreso Mensual</strong></td>
                    <td style="background: #dcfce7; font-weight: bold;">${formatCurrency(convertFromMXN(results.finalMonthlyIncome, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                    <td>${formatCurrency(cetesPatrimony * (investment.cetesRate / 100) / 12, investment.currencyFormat)}</td>
                    <td>${formatCurrency(savingsPatrimony * (investment.savingsRate / 100) / 12, investment.currencyFormat)}</td>
                    <td>${formatCurrency(realEstatePatrimony * (investment.realEstateRent / 100) / 12, investment.currencyFormat)}</td>
                    <td><strong>🥇 #1</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Multiplicador</strong></td>
                    <td style="background: #dcfce7; font-weight: bold;">${results.capitalMultiplier.toFixed(1)}x</td>
                    <td>${(cetesPatrimony / initialInvestment).toFixed(1)}x</td>
                    <td>${(savingsPatrimony / initialInvestment).toFixed(1)}x</td>
                    <td>${(realEstatePatrimony / initialInvestment).toFixed(1)}x</td>
                    <td><strong>🥇 #1</strong></td>
                  </tr>
                  <tr>
                    <td><strong>CAGR</strong></td>
                    <td style="background: #dcfce7; font-weight: bold;">${(results.cagr).toFixed(1)}%</td>
                    <td>${investment.cetesRate.toFixed(1)}%</td>
                    <td>${investment.savingsRate.toFixed(1)}%</td>
                    <td>${investment.realEstateAppreciation.toFixed(1)}%</td>
                    <td><strong>🥇 #1</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="advantage-highlight">
              <h3>🏆 Factores de Superioridad de ${branding.companyName}</h3>
              <div class="advantage-stats">
                <strong>Factor vs CETES:</strong> ${(cosechaPatrimony / cetesPatrimony).toFixed(1)}x mejor<br>
                <strong>Factor vs Ahorro:</strong> ${(cosechaPatrimony / savingsPatrimony).toFixed(1)}x mejor<br>
                <strong>Factor vs Bienes Raíces:</strong> ${(cosechaPatrimony / realEstatePatrimony).toFixed(1)}x mejor<br>
                <strong>Estrategia:</strong> Diversificación automática con ${results.certificatesSummary.totalCertificates} activos vs 1 activo único
              </div>
            </div>

            <div style="background: white; padding: 30px; border-radius: 15px; margin: 30px 0; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <h4 style="color: #0c4a6e; font-size: 1.4em; margin-bottom: 20px; text-align: center;">🎯 Conclusiones Ejecutivas</h4>
              <ul style="list-style: disc; padding-left: 25px; color: #374151; line-height: 1.8;">
                <li><strong>Superioridad Comprobada:</strong> ${branding.companyName} supera consistentemente a todas las alternativas tradicionales</li>
                <li><strong>Diversificación Inteligente:</strong> ${results.certificatesSummary.totalCertificates} Tickets de Inversión vs 1 activo único reduce riesgo significativamente</li>
                <li><strong>Doble Motor de Crecimiento:</strong> Apreciación del activo + rendimiento operativo</li>
                <li><strong>Activo Real Tangible:</strong> Respaldado por plantaciones productivas, no solo papel</li>
                <li><strong>Protección Inflacionaria:</strong> Ingresos dolarizados por exportación</li>
              </ul>
            </div>
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
            <p><strong>© 2025 ${branding.companyName} - Análisis Comparativo Especializado</strong></p>
            <p>Este reporte es confidencial y está dirigido exclusivamente al cliente mencionado.</p>
            <p><strong>Para más información:</strong> ${branding.email} | WhatsApp: ${branding.phone}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
