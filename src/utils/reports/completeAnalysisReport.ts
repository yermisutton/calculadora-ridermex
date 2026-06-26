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

export function generateCompleteAnalysisReport(
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

  const totalInvestment = convertFromMXN(
    investment.initialCertificates * investment.certificateBasePrice,
    investment.currencyFormat,
    investment.exchangeRate,
    investment.exchangeRateEUR
  );

  const getRiskLevel = () => {
    if (investment.averageProductionPerHectare <= 25000) return 'Bajo';
    if (investment.averageProductionPerHectare <= 30000) return 'Moderado';
    return 'Moderado-Alto';
  };

  const getLiquidityScore = () => {
    return (90 - (investment.years * 2)).toFixed(0);
  };

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reporte de Análisis Completo - ${branding.companyName}</title>
      
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 13px;
          line-height: 1.7;
          color: #2c3e50;
          background: #ecf0f1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 15px;
        }

        .container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          overflow: hidden;
        }

        .header {
          background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #059669 100%);
          color: white;
          padding: 60px 40px;
          text-align: center;
          position: relative;
          border-bottom: 5px solid #10b981;
        }

        .header-logos {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 50px;
          margin-bottom: 35px;
        }

        .logo {
          height: 100px;
          width: auto;
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4));
        }

        .executive-icon {
          width: 90px;
          height: 90px;
          background: rgba(255, 255, 255, 0.15);
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 50px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .header h1 {
          font-size: 3.2em;
          margin-bottom: 12px;
          font-weight: 700;
          letter-spacing: -0.5px;
          text-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
        }

        .header .subtitle {
          font-size: 1.3em;
          opacity: 0.95;
          margin-bottom: 8px;
          font-weight: 300;
        }

        .header .date {
          font-size: 0.95em;
          opacity: 0.8;
          text-transform: capitalize;
        }

        .content {
          padding: 50px;
        }

        .section {
          margin-bottom: 55px;
          padding: 35px;
          background: linear-gradient(to bottom, #f8fafb, #ffffff);
          border-radius: 10px;
          border-left: 7px solid #059669;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border-top: 1px solid #e0e6ed;
        }

        .section-title {
          font-size: 1.9em;
          font-weight: 700;
          color: #059669;
          margin-bottom: 30px;
          padding-bottom: 18px;
          border-bottom: 3px solid #10b981;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .advisor-section {
          background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
          color: white;
          padding: 35px;
          border-radius: 10px;
          margin-bottom: 45px;
          border: none;
          box-shadow: 0 4px 15px rgba(0, 102, 204, 0.15);
        }

        .advisor-title {
          font-size: 1.6em;
          font-weight: 700;
          margin-bottom: 25px;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .advisor-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
        }

        .advisor-item {
          background: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .advisor-label {
          font-size: 0.85em;
          opacity: 0.85;
          margin-bottom: 8px;
          text-transform: uppercase;
          font-weight: 600;
        }

        .advisor-value {
          font-size: 1.15em;
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        .executive-summary {
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          color: white;
          padding: 50px;
          border-radius: 12px;
          margin: 50px 0;
          text-align: center;
          border: none;
          box-shadow: 0 8px 25px rgba(5, 150, 105, 0.2);
        }

        .executive-title {
          font-size: 2.3em;
          font-weight: 700;
          margin-bottom: 35px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .executive-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 30px;
          margin: 35px 0;
        }

        .executive-card {
          background: rgba(255, 255, 255, 0.15);
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          border: 2px solid rgba(255, 255, 255, 0.25);
          transition: all 0.3s ease;
        }

        .executive-card:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-5px);
        }

        .executive-number {
          font-size: 2.8em;
          font-weight: 700;
          margin-bottom: 12px;
          letter-spacing: -1px;
        }

        .executive-label {
          font-size: 1em;
          font-weight: 700;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .executive-desc {
          font-size: 0.9em;
          opacity: 0.9;
          font-weight: 500;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 22px;
          margin: 30px 0;
        }

        .metric-card {
          background: white;
          padding: 28px;
          border-radius: 10px;
          text-align: center;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
          border: 1px solid #e8eef5;
          transition: all 0.3s ease;
          border-top: 4px solid #e0e0e0;
        }

        .metric-card:hover {
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.12);
          transform: translateY(-3px);
        }

        .metric-card.primary {
          background: linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%);
          border-color: #4caf50;
          border-top-color: #4caf50;
        }

        .metric-card h4 {
          font-size: 1em;
          font-weight: 700;
          margin-bottom: 15px;
          color: #2c3e50;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .metric-value {
          font-size: 2.2em;
          font-weight: 700;
          color: #059669;
          margin-bottom: 8px;
        }

        .metric-label {
          font-size: 0.8em;
          color: #7f8c8d;
          font-weight: 600;
          text-transform: uppercase;
        }

        .table-container {
          overflow-x: auto;
          margin: 30px 0;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border: 1px solid #e0e6ed;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }

        th {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          color: white;
          padding: 18px 12px;
          text-align: center;
          font-weight: 700;
          font-size: 0.9em;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        td {
          padding: 14px 12px;
          text-align: center;
          border-bottom: 1px solid #e8eef5;
          font-size: 0.9em;
        }

        tr:nth-child(even) {
          background: #fafbfc;
        }

        tr:hover {
          background: #f1f5f9 !important;
        }

        .cosecha-row {
          background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%) !important;
          font-weight: 700;
          border-left: 5px solid #16a34a;
        }

        .contact-section {
          background: linear-gradient(135deg, #e3f2fd 0%, #f1f8ff 100%);
          padding: 40px;
          border-radius: 12px;
          margin: 45px 0;
          border: 2px solid #64b5f6;
          box-shadow: 0 4px 12px rgba(0, 102, 204, 0.1);
        }

        .contact-title {
          font-size: 1.8em;
          font-weight: 700;
          color: #0066cc;
          margin-bottom: 30px;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 25px;
        }

        .contact-card {
          background: white;
          padding: 25px;
          border-radius: 10px;
          border: 2px solid #bbdefb;
          box-shadow: 0 3px 10px rgba(0, 102, 204, 0.08);
          transition: all 0.3s ease;
        }

        .contact-card:hover {
          border-color: #64b5f6;
          box-shadow: 0 5px 15px rgba(0, 102, 204, 0.15);
        }

        .contact-card h4 {
          font-size: 1.1em;
          font-weight: 700;
          color: #0066cc;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .contact-card p {
          margin-bottom: 8px;
          color: #34495e;
          line-height: 1.6;
          font-size: 0.95em;
        }

        .contact-card a {
          color: #0066cc;
          text-decoration: none;
          font-weight: 600;
          word-break: break-word;
        }

        .contact-card a:hover {
          text-decoration: underline;
        }

        .disclaimer {
          background: linear-gradient(135deg, #fff8e1 0%, #fff9c4 100%);
          padding: 30px;
          border-radius: 10px;
          margin: 45px 0;
          border: 3px solid #fbc02d;
          box-shadow: 0 4px 12px rgba(251, 192, 45, 0.15);
        }

        .disclaimer h4 {
          font-size: 1.3em;
          font-weight: 700;
          color: #bf6b04;
          margin-bottom: 18px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .disclaimer p {
          color: #6d4c04;
          line-height: 1.8;
          font-size: 0.95em;
        }

        .footer {
          text-align: center;
          margin-top: 45px;
          padding: 30px;
          background: linear-gradient(135deg, #f5f7fa 0%, #e9ecf1 100%);
          border-radius: 10px;
          color: #7f8c8d;
          border-top: 2px solid #bdc3c7;
        }

        .footer p {
          margin-bottom: 8px;
          font-size: 0.95em;
        }

        .print-button {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #059669;
          color: white;
          border: none;
          padding: 14px 22px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
          z-index: 1000;
          font-size: 0.95em;
          transition: all 0.3s ease;
        }

        .print-button:hover {
          background: #047857;
          box-shadow: 0 6px 20px rgba(5, 150, 105, 0.4);
          transform: translateY(-2px);
        }

        .info-box {
          background: linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%);
          border-left: 5px solid #4caf50;
          padding: 25px;
          border-radius: 8px;
          margin: 25px 0;
          box-shadow: 0 3px 10px rgba(76, 175, 80, 0.1);
        }

        .info-box h5 {
          color: #2e7d32;
          font-weight: 700;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 1.05em;
        }

        .info-box ul {
          list-style: none;
          padding-left: 0;
        }

        .info-box li {
          margin-bottom: 10px;
          color: #388e3c;
          padding-left: 25px;
          position: relative;
          font-size: 0.95em;
          line-height: 1.6;
        }

        .info-box li:before {
          content: '✓';
          position: absolute;
          left: 0;
          font-weight: 700;
          font-size: 1.1em;
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
            box-shadow: none;
            border: 1px solid #e0e6ed;
          }
        }

        @media (max-width: 768px) {
          body {
            padding: 8px;
            font-size: 12px;
          }

          .content {
            padding: 25px;
          }

          .header {
            padding: 40px 20px;
          }

          .header h1 {
            font-size: 2.4em;
          }

          .header-logos {
            flex-direction: column;
            gap: 25px;
          }

          .logo {
            height: 70px;
          }

          .executive-icon {
            width: 70px;
            height: 70px;
            font-size: 40px;
          }

          .section-title {
            font-size: 1.5em;
          }

          table {
            font-size: 0.85em;
          }

          td, th {
            padding: 10px 6px;
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
            <div class="executive-icon">📋</div>
          </div>
          <h1>Reporte de Análisis Completo</h1>
          <div class="subtitle">Ticket de Inversión de Crecimiento Exponencial</div>
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

          <!-- RESUMEN EJECUTIVO -->
          <div class="executive-summary">
            <div class="executive-title">📊 Resumen Ejecutivo</div>
            <div class="executive-grid">
              <div class="executive-card">
                <div class="executive-number">${investment.initialCertificates}</div>
                <div class="executive-label">Tickets de Inversión Iniciales</div>
                <div class="executive-desc">Inversión base</div>
              </div>
              <div class="executive-card">
                <div class="executive-number">${results.certificatesSummary.totalCertificates}</div>
                <div class="executive-label">Tickets de Inversión Finales</div>
                <div class="executive-desc">Con reinversión</div>
              </div>
              <div class="executive-card">
                <div class="executive-number">${formatCurrency(convertFromMXN(results.finalMonthlyIncome, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</div>
                <div class="executive-label">Ingreso Mensual</div>
                <div class="executive-desc">Al año ${investment.years}</div>
              </div>
              <div class="executive-card">
                <div class="executive-number">${results.capitalMultiplier.toFixed(1)}x</div>
                <div class="executive-label">Multiplicador</div>
                <div class="executive-desc">Crecimiento total</div>
              </div>
            </div>
          </div>

          <!-- MÉTRICAS CLAVE -->
          <div class="section">
            <h2 class="section-title">Métricas Clave de Rendimiento</h2>

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

            <div class="metrics-grid">
              <div class="metric-card primary">
                <h4>CAGR</h4>
                <div class="metric-value">${(results.cagr).toFixed(1)}%</div>
                <div class="metric-label">Crecimiento anual compuesto</div>
              </div>
              <div class="metric-card primary">
                <h4>TIR</h4>
                <div class="metric-value">${(results.irr).toFixed(1)}%</div>
                <div class="metric-label">Tasa interna de retorno</div>
              </div>
              <div class="metric-card primary">
                <h4>ROI Estimado</h4>
                <div class="metric-value">${((results.capitalMultiplier - 1) * 100).toFixed(0)}%</div>
                <div class="metric-label">Retorno estimado sobre inversión</div>
              </div>
              <div class="metric-card primary">
                <h4>Payback</h4>
                <div class="metric-value">${typeof results.paybackYear === 'number' ? results.paybackYear.toFixed(2) : (results.paybackYear || 'N/A')}</div>
                <div class="metric-label">Año de recuperación</div>
              </div>
            </div>
          </div>

          <!-- PLAN DE PAGOS RESUMIDO -->
          <div class="section">
            <h2 class="section-title">Plan de Pagos</h2>
            
            <div class="metrics-grid">
              <div class="metric-card">
                <h4>Inversión Total</h4>
                <div class="metric-value">${formatCurrency(totalInvestment, investment.currencyFormat)}</div>
                <div class="metric-label">${investment.initialCertificates} certificados</div>
              </div>
              <div class="metric-card">
                <h4>Enganche</h4>
                <div class="metric-value">${formatCurrency(totalInvestment * (investment.downPaymentPercentage / 100), investment.currencyFormat)}</div>
                <div class="metric-label">${investment.downPaymentPercentage}% inicial</div>
              </div>
              <div class="metric-card">
                <h4>Mensualidad</h4>
                <div class="metric-value">${formatCurrency((totalInvestment * (100 - investment.downPaymentPercentage) / 100) / 48, investment.currencyFormat)}</div>
                <div class="metric-label">48 pagos mensuales</div>
              </div>
              <div class="metric-card">
                <h4>Utilidad Anual</h4>
                <div class="metric-value">${((investment.averageProductionPerHectare * investment.averageSalePricePerKg * 0.1 * 0.65 / investment.certificateBasePrice) * 100).toFixed(1)}%</div>
                <div class="metric-label">Rendimiento proyectado</div>
              </div>
            </div>
          </div>

          <!-- EVOLUCIÓN PATRIMONIAL DETALLADA -->
          <div class="section">
            <h2 class="section-title">Proyección de Evolución Patrimonial</h2>

            <p style="color: #2c3e50; margin-bottom: 25px; text-align: center; font-size: 0.95em; line-height: 1.6;">
              Esta tabla proyecta el crecimiento del patrimonio considerando reinversión de utilidades,
              generación de nuevos tickets y el multiplicador de capital en diferentes horizontes temporales.
            </p>

            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Período</th>
                    <th>Tickets de Inversión</th>
                    <th>Patrimonio Total</th>
                    <th>Ingreso Mensual</th>
                    <th>Utilidad Anual</th>
                    <th>Multiplicador</th>
                  </tr>
                </thead>
                <tbody>
                  ${[5, 10, 15, 20, 25].filter(year => year <= investment.years).map(year => {
                    const yearData = results.yearlyData[year - 1];
                    if (!yearData) return '';

                    const patrimony = convertFromMXN(yearData.citrusPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR);
                    const yearlyIncome = convertFromMXN(yearData.citrusIncome, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR);
                    const monthlyIncome = yearlyIncome / 12;
                    const multiplier = patrimony / totalInvestment;
                    const estimatedTickets = Math.ceil(investment.initialCertificates * Math.pow(1.12, Math.max(0, year - 4)));

                    return `
                      <tr ${year === investment.years ? 'class="cosecha-row"' : ''}>
                        <td><strong>Año ${year}</strong></td>
                        <td>${estimatedTickets}</td>
                        <td><strong>${formatCurrency(patrimony, investment.currencyFormat)}</strong></td>
                        <td>${formatCurrency(monthlyIncome, investment.currencyFormat)}</td>
                        <td>${formatCurrency(yearlyIncome, investment.currencyFormat)}</td>
                        <td><strong>${multiplier.toFixed(2)}x</strong></td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>

            <div class="info-box">
              <h5>Interpretación de la Proyección</h5>
              <ul>
                <li>Los resultados proyectados asumen reinversión automática de dividendos a partir del año 5</li>
                <li>El multiplicador refleja el crecimiento del patrimonio vs inversión inicial</li>
                <li>Los ingresos mensuales provienen de la exportación de producción de cítricos</li>
                <li>Año ${investment.years} marca la culminación del ciclo con máxima rentabilidad acumulada</li>
              </ul>
            </div>
          </div>

          <!-- COMPARACIÓN CON ALTERNATIVAS -->
          <div class="section">
            <h2 class="section-title">Análisis Comparativo de Inversiones</h2>

            <p style="color: #2c3e50; margin-bottom: 25px; text-align: center; font-size: 0.95em; line-height: 1.6;">
              Comparativa del patrimonio final proyectado al año ${investment.years} con diferentes alternativas de inversión
              asumiendo la misma inversión inicial de ${formatCurrency(totalInvestment, investment.currencyFormat)}.
            </p>

            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Instrumento de Inversión</th>
                    <th>Patrimonio Final</th>
                    <th>Ingreso Mensual</th>
                    <th>Multiplicador</th>
                    <th>% vs ${branding.companyName}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="cosecha-row">
                    <td><strong>${branding.companyName}</strong></td>
                    <td><strong>${formatCurrency(convertFromMXN(results.finalPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</strong></td>
                    <td><strong>${formatCurrency(convertFromMXN(results.finalMonthlyIncome, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</strong></td>
                    <td><strong>${results.capitalMultiplier.toFixed(2)}x</strong></td>
                    <td><strong>100%</strong></td>
                  </tr>
                  <tr>
                    <td>CETES (${investment.cetesRate}% anual)</td>
                    <td>${formatCurrency(convertFromMXN(results.cetesPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                    <td>${formatCurrency(convertFromMXN(results.cetesPatrimony * (investment.cetesRate / 100) / 12, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                    <td>${(results.cetesPatrimony / (investment.initialCertificates * investment.certificateBasePrice)).toFixed(2)}x</td>
                    <td>${((results.cetesPatrimony / results.finalPatrimony) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td>Ahorro Bancario (${investment.savingsRate}% anual)</td>
                    <td>${formatCurrency(convertFromMXN(results.savingsPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                    <td>${formatCurrency(convertFromMXN(results.savingsPatrimony * (investment.savingsRate / 100) / 12, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                    <td>${(results.savingsPatrimony / (investment.initialCertificates * investment.certificateBasePrice)).toFixed(2)}x</td>
                    <td>${((results.savingsPatrimony / results.finalPatrimony) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td>Bienes Raíces (${investment.realEstateRent}% rendimiento)</td>
                    <td>${formatCurrency(convertFromMXN(results.realEstatePatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                    <td>${formatCurrency(convertFromMXN(results.realEstatePatrimony * (investment.realEstateRent / 100) / 12, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                    <td>${(results.realEstatePatrimony / (investment.initialCertificates * investment.certificateBasePrice)).toFixed(2)}x</td>
                    <td>${((results.realEstatePatrimony / results.finalPatrimony) * 100).toFixed(1)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style="background: #e8f5e9; border-left: 5px solid #4caf50; padding: 20px; border-radius: 8px; margin-top: 25px;">
              <p style="color: #2e7d32; font-size: 0.95em; line-height: 1.7; margin: 0;">
                <strong>Conclusión:</strong> La inversión en ${branding.companyName} supera significativamente a alternativas tradicionales,
                generando un patrimonio ${(results.finalPatrimony / results.cetesPatrimony).toFixed(1)}x mayor que CETES
                y con ingresos mensuales recurrentes en dólares, ofreciendo protección contra inflación.
              </p>
            </div>
          </div>

          <!-- VENTAJAS COMPETITIVAS -->
          <div class="section">
            <h2 class="section-title">Ventajas Competitivas</h2>

            <div class="metrics-grid">
              <div class="metric-card primary">
                <h4>Activo Real</h4>
                <div class="metric-value">100%</div>
                <div class="metric-label">Respaldado por plantaciones</div>
              </div>
              <div class="metric-card primary">
                <h4>Ingresos Dolarizados</h4>
                <div class="metric-value">65%</div>
                <div class="metric-label">Exportación directa</div>
              </div>
              <div class="metric-card primary">
                <h4>Doble Beneficio</h4>
                <div class="metric-value">${((results.capitalMultiplier - 1) / investment.years).toFixed(2)}x</div>
                <div class="metric-label">Rendimiento anual compuesto</div>
              </div>
              <div class="metric-card primary">
                <h4>Ventaja vs CETES</h4>
                <div class="metric-value">${(results.finalPatrimony / results.cetesPatrimony).toFixed(1)}x</div>
                <div class="metric-label">Mayor patrimonio final</div>
              </div>
            </div>

            <div class="info-box">
              <h5>Razones para Invertir</h5>
              <ul>
                <li>Patrimonio tangible: Fincas de cítricos con certificación internacional</li>
                <li>Ingresos recurrentes: Flujo mensual garantizado desde año 1</li>
                <li>Protección contra inflación: Ingresos en dólares USD</li>
                <li>Gestión profesional: Equipo especializado en agricultura de precisión</li>
                <li>Transparencia: Reportes mensuales detallados de operaciones</li>
                <li>Sostenibilidad: Prácticas agrícolas certificadas ambientalmente</li>
              </ul>
            </div>
          </div>

          <!-- ANÁLISIS DE RIESGO Y SOSTENIBILIDAD -->
          <div class="section">
            <h2 class="section-title">Análisis de Riesgo y Sostenibilidad</h2>

            <div class="metrics-grid">
              <div class="metric-card">
                <h4>Nivel de Riesgo</h4>
                <div class="metric-value">${getRiskLevel()}</div>
                <div class="metric-label">Basado en producción estimada</div>
              </div>
              <div class="metric-card">
                <h4>Score de Liquidez</h4>
                <div class="metric-value">${getLiquidityScore()}%</div>
                <div class="metric-label">Flexibilidad de retiro</div>
              </div>
              <div class="metric-card primary">
                <h4>Diversificación</h4>
                <div class="metric-value">${results.certificatesSummary.totalCertificates}</div>
                <div class="metric-label">Tickets finales al año ${investment.years}</div>
              </div>
              <div class="metric-card primary">
                <h4>Horizonte Mínimo</h4>
                <div class="metric-value">${investment.years}</div>
                <div class="metric-label">Años recomendados</div>
              </div>
            </div>

            <div class="info-box">
              <h5>Factores Clave de Éxito</h5>
              <ul>
                <li>Activo tangible respaldado por plantaciones de cítricos certificadas</li>
                <li>Exportación internacionalizada con ingresos dolarizados</li>
                <li>Gestión profesional por expertos en agricultura de precisión</li>
                <li>Diversificación natural mediante múltiples plantaciones</li>
                <li>Valorización del capital a través del crecimiento del patrimonio</li>
              </ul>
            </div>
          </div>
          <!-- PLAN DE FINANCIAMIENTO -->
          ${generateFinancingPlanHTML(investment, {
            downPaymentPercent: investment.financingDownPaymentPercent ?? options.downPaymentPercent ?? 30,
            annualInterestRate: investment.financingAnnualInterestRate ?? options.annualInterestRate ?? 12
          })}

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
            <p><strong>© 2025 ${branding.companyName} - Análisis Completo</strong></p>
            <p>Este reporte es confidencial y está dirigido exclusivamente al cliente mencionado.</p>
            <p><strong>Para más información:</strong> ${branding.email} | WhatsApp: ${branding.phone}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
