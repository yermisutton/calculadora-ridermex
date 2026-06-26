import { Investment, InvestmentResults } from '../../types';
import { formatCurrency, convertFromMXN } from '../formatters';
import { getDetailedCertificateEvolution } from '../calculations/certificateEvolution';
import { generateFinancingPlanHTML } from './financingPlanReport';
import { getReportBranding, getScenarioName, getScenarioDetails, getProductTypeLabel } from './reportConfig';

export interface ReportOptions {
  advisorName: string;
  advisorPhone: string;
  advisorEmail: string;
  clientName?: string;
}

export function generateCertificateEvolutionReport(
  investment: Investment,
  results: InvestmentResults,
  options: ReportOptions
): string {
  const currentDate = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const branding = getReportBranding(investment);
  const scenarioName = getScenarioName(investment);
  const scenarioDetails = getScenarioDetails(investment);
  const productType = getProductTypeLabel(investment);

  const certificateEvolution = getDetailedCertificateEvolution(investment);
  const totalInvestment = convertFromMXN(
    investment.initialCertificates * investment.certificateBasePrice,
    investment.currencyFormat,
    investment.exchangeRate,
    investment.exchangeRateEUR
  );
  const downPaymentAmount = totalInvestment * (investment.downPaymentPercentage / 100);
  const totalFinanced = totalInvestment - downPaymentAmount;
  const monthlyPayment = totalFinanced / 48;

  // Generate amortization table
  const generateAmortizationTable = () => {
    let remainingBalance = totalFinanced;
    let cumulativePrincipal = downPaymentAmount;
    let cumulativeInterest = 0;
    let tableRows = '';

    // Down payment row
    tableRows += `
      <tr class="down-payment-row">
        <td><strong>0</strong></td>
        <td><strong>${new Date().toLocaleDateString('es-MX')}</strong></td>
        <td><strong>ENGANCHE</strong></td>
        <td><strong>${formatCurrency(downPaymentAmount, investment.currencyFormat)}</strong></td>
        <td><strong>${formatCurrency(downPaymentAmount, investment.currencyFormat)}</strong></td>
        <td><strong>${formatCurrency(0, investment.currencyFormat)}</strong></td>
        <td><strong>${formatCurrency(remainingBalance, investment.currencyFormat)}</strong></td>
        <td><strong>${formatCurrency(cumulativePrincipal, investment.currencyFormat)}</strong></td>
        <td><strong>${formatCurrency(0, investment.currencyFormat)}</strong></td>
      </tr>
    `;

    // Monthly payments
    for (let i = 1; i <= 48; i++) {
      const paymentDate = new Date();
      paymentDate.setMonth(paymentDate.getMonth() + i);
      
      const interestAmount = 0; // No interest
      const principalAmount = monthlyPayment;
      
      remainingBalance = Math.max(0, remainingBalance - principalAmount);
      cumulativePrincipal += principalAmount;
      cumulativeInterest += interestAmount;
      
      tableRows += `
        <tr>
          <td>${i}</td>
          <td>${paymentDate.toLocaleDateString('es-MX')}</td>
          <td>Mensualidad</td>
          <td>${formatCurrency(monthlyPayment, investment.currencyFormat)}</td>
          <td>${formatCurrency(principalAmount, investment.currencyFormat)}</td>
          <td>${formatCurrency(interestAmount, investment.currencyFormat)}</td>
          <td>${formatCurrency(remainingBalance, investment.currencyFormat)}</td>
          <td>${formatCurrency(cumulativePrincipal, investment.currencyFormat)}</td>
          <td>${formatCurrency(cumulativeInterest, investment.currencyFormat)}</td>
        </tr>
      `;
    }

    // Total row
    tableRows += `
      <tr class="total-row">
        <td colspan="3"><strong>TOTALES FINALES</strong></td>
        <td><strong>${formatCurrency(totalInvestment, investment.currencyFormat)}</strong></td>
        <td><strong>${formatCurrency(totalInvestment, investment.currencyFormat)}</strong></td>
        <td><strong>${formatCurrency(0, investment.currencyFormat)}</strong></td>
        <td><strong>${formatCurrency(0, investment.currencyFormat)}</strong></td>
        <td><strong>${formatCurrency(totalInvestment, investment.currencyFormat)}</strong></td>
        <td><strong>${formatCurrency(0, investment.currencyFormat)}</strong></td>
      </tr>
    `;

    return tableRows;
  };

  // Generate evolution table
  const generateEvolutionTable = () => {
    return certificateEvolution.map(data => {
      const isHighlight = data.newCertificateIds.length > 0;
      const producingCertificates = data.certificates.filter(cert => cert.status === 'producing').length;
      const totalCertificatesValue = data.certificatePrice * producingCertificates;

      return `
        <tr ${isHighlight ? 'class="highlight-row"' : ''}>
          <td>${data.year}</td>
          <td>${data.date}</td>
          <td>${formatCurrency(convertFromMXN(data.certificatePrice, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
          <td style="font-weight: bold; color: #047857;">${formatCurrency(convertFromMXN(totalCertificatesValue, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
          <td>${data.totalCertificates}</td>
          <td>${formatCurrency(convertFromMXN(data.citrusPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
          <td>${formatCurrency(convertFromMXN(data.citrusIncome, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
          <td>${formatCurrency(convertFromMXN(data.totalUtility, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
          <td>${formatCurrency(convertFromMXN(data.reinvestmentFund, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
        </tr>
      `;
    }).join('');
  };

  // Generate phase distribution chart
  const finalYearData = certificateEvolution[certificateEvolution.length - 1];
  const phaseDistribution = {
    producing: finalYearData.certificates.filter(c => c.status === 'producing').length,
    waiting: finalYearData.certificates.filter(c => c.status === 'waiting').length,
    reserved: finalYearData.certificates.filter(c => c.status === 'reserved').length
  };

  const maxPhase = Math.max(phaseDistribution.producing, phaseDistribution.waiting, phaseDistribution.reserved);
  const chartHeight = 120;

  const generatePhaseChart = () => {
    return `
      <div class="bar-item">
        <div class="bar" style="height: ${(phaseDistribution.producing / maxPhase) * chartHeight}px; background: linear-gradient(to top, #16a34a, #16a34aaa);"></div>
        <div class="bar-label">Produciendo</div>
        <div class="bar-value">${phaseDistribution.producing}</div>
      </div>
      <div class="bar-item">
        <div class="bar" style="height: ${(phaseDistribution.waiting / maxPhase) * chartHeight}px; background: linear-gradient(to top, #6b7280, #6b7280aa);"></div>
        <div class="bar-label">En Maduración</div>
        <div class="bar-value">${phaseDistribution.waiting}</div>
      </div>
      <div class="bar-item">
        <div class="bar" style="height: ${(phaseDistribution.reserved / maxPhase) * chartHeight}px; background: linear-gradient(to top, #0284c7, #0284c7aa);"></div>
        <div class="bar-label">Reservados</div>
        <div class="bar-value">${phaseDistribution.reserved}</div>
      </div>
    `;
  };

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reporte de Evolución de ${branding.productName.charAt(0).toUpperCase() + branding.productName.slice(1)} de Inversión - ${branding.companyName}</title>
      
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
          background: #f9fafb;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .header {
          background: linear-gradient(135deg, ${branding.primaryColor}, ${branding.secondaryColor});
          color: white;
          padding: 40px 30px;
          text-align: center;
          position: relative;
        }
        
        .header-logos {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 30px;
          margin-bottom: 30px;
        }
        
        .logo {
          height: 80px;
          width: auto;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          drop-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .header h1 {
          font-size: 2.5em;
          margin-bottom: 10px;
          font-weight: bold;
        }
        
        .header .subtitle {
          font-size: 1.2em;
          opacity: 0.9;
          margin-bottom: 10px;
        }
        
        .header .date {
          font-size: 1em;
          opacity: 0.8;
        }
        
        .content {
          padding: 30px;
        }
        
        .section {
          margin-bottom: 40px;
          padding: 25px;
          background: #f8fafc;
          border-radius: 12px;
          border-left: 4px solid ${branding.primaryColor};
        }

        .section-title {
          font-size: 1.8em;
          font-weight: bold;
          color: ${branding.primaryColor};
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 3px solid ${branding.secondaryColor};
        }
        
        .advisor-section {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          padding: 25px;
          border-radius: 12px;
          margin-bottom: 30px;
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
        
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin: 20px 0;
        }
        
        .card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }
        
        .card h3 {
          font-size: 1.2em;
          font-weight: bold;
          color: #374151;
          margin-bottom: 15px;
        }
        
        .card p {
          margin-bottom: 8px;
          color: #4b5563;
        }
        
        .card strong {
          color: #1f2937;
        }
        
        .payment-summary {
          background: linear-gradient(135deg, #dcfce7, #bbf7d0);
          padding: 25px;
          border-radius: 12px;
          margin: 20px 0;
          border: 2px solid #16a34a;
        }
        
        .payment-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin: 20px 0;
        }
        
        .payment-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          border: 2px solid #16a34a;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .payment-label {
          font-size: 0.9em;
          color: #16a34a;
          margin-bottom: 8px;
          font-weight: bold;
        }
        
        .payment-amount {
          font-size: 1.3em;
          font-weight: bold;
          color: #15803d;
        }
        
        .table-container {
          overflow-x: auto;
          margin: 20px 0;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }
        
        th {
          background: ${branding.primaryColor};
          color: white;
          padding: 12px 8px;
          text-align: center;
          font-weight: bold;
          font-size: 0.9em;
        }
        
        td {
          padding: 10px 8px;
          text-align: center;
          border-bottom: 1px solid #e5e7eb;
          font-size: 0.9em;
        }
        
        tr:nth-child(even) {
          background: #f9fafb;
        }
        
        .down-payment-row {
          background: #dcfce7 !important;
          font-weight: bold;
        }
        
        .total-row {
          background: #dbeafe !important;
          font-weight: bold;
          border-top: 3px solid #3b82f6;
        }
        
        .highlight-row {
          background: #fef3c7 !important;
        }
        
        .chart-section {
          margin: 30px 0;
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .chart-title {
          font-size: 1.3em;
          font-weight: bold;
          color: #374151;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .bar-chart {
          display: flex;
          justify-content: space-around;
          align-items: end;
          height: 200px;
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          margin: 20px 0;
        }
        
        .bar-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 120px;
        }
        
        .bar {
          background: linear-gradient(to top, #16a34a, #22c55e);
          width: 40px;
          min-height: 20px;
          border-radius: 4px 4px 0 0;
          margin-bottom: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .bar-label {
          font-size: 0.8em;
          color: #6b7280;
          margin-bottom: 5px;
          text-align: center;
          font-weight: bold;
        }
        
        .bar-value {
          font-size: 0.9em;
          font-weight: bold;
          color: #16a34a;
          text-align: center;
        }
        
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 25px 0;
        }
        
        .summary-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          border: 2px solid #e2e8f0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .summary-card.primary {
          background: linear-gradient(135deg, #dcfce7, #bbf7d0);
          border-color: #16a34a;
        }
        
        .summary-card h4 {
          font-size: 1em;
          font-weight: bold;
          margin-bottom: 10px;
          color: #374151;
        }
        
        .summary-value {
          font-size: 1.4em;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 5px;
        }
        
        .summary-label {
          font-size: 0.8em;
          color: #6b7280;
        }
        
        .phase-distribution {
          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
          padding: 25px;
          border-radius: 12px;
          margin: 25px 0;
          border: 2px solid #16a34a;
        }
        
        .phase-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }
        
        .phase-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid #bbf7d0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .phase-number {
          font-size: 2.5em;
          font-weight: bold;
          color: #16a34a;
          margin-bottom: 5px;
        }
        
        .phase-label {
          font-size: 0.9em;
          color: #15803d;
          font-weight: bold;
        }
        
        .notes-section {
          background: linear-gradient(135deg, #fffbeb, #fef3c7);
          padding: 25px;
          border-radius: 12px;
          margin: 25px 0;
          border: 2px solid #f59e0b;
        }
        
        .notes-title {
          font-size: 1.3em;
          font-weight: bold;
          color: #92400e;
          margin-bottom: 15px;
        }
        
        .notes-list {
          list-style: disc;
          padding-left: 25px;
        }
        
        .notes-list li {
          margin-bottom: 8px;
          color: #78350f;
          line-height: 1.5;
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
          background: ${branding.primaryColor};
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
          background: ${branding.accentColor};
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
          
          .table-container {
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
            padding: 30px 20px;
          }
          
          .header h1 {
            font-size: 2em;
          }
          
          .grid {
            grid-template-columns: 1fr;
          }
          
          .advisor-grid {
            grid-template-columns: 1fr;
          }
          
          .payment-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
          
          .header-logos {
            flex-direction: column;
            gap: 20px;
          }
          
          .logo {
            height: 60px;
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
            <img src="${branding.logoUrl}" alt="${branding.companyName}" class="logo">
          </div>
          <h1>Reporte de Evolución de ${branding.productName.charAt(0).toUpperCase() + branding.productName.slice(1)} de Inversión</h1>
          <div class="subtitle">${branding.companyName}</div>
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

          <!-- PLAN DE PAGOS -->
          <div class="section">
            <h2 class="section-title">Plan de Pagos Completo</h2>
            
            <div class="payment-summary">
              <h3 style="font-size: 1.4em; font-weight: bold; color: #374151; margin-bottom: 20px; text-align: center;">
                Resumen de Inversión
              </h3>
              <div class="payment-grid">
                <div class="payment-card">
                  <div class="payment-label">Certificados</div>
                  <div class="payment-amount">${investment.initialCertificates}</div>
                </div>
                <div class="payment-card">
                  <div class="payment-label">Inversión Total</div>
                  <div class="payment-amount">${formatCurrency(totalInvestment, investment.currencyFormat)}</div>
                </div>
                <div class="payment-card">
                  <div class="payment-label">Enganche (${investment.downPaymentPercentage}%)</div>
                  <div class="payment-amount">${formatCurrency(downPaymentAmount, investment.currencyFormat)}</div>
                </div>
                <div class="payment-card">
                  <div class="payment-label">A Financiar</div>
                  <div class="payment-amount">${formatCurrency(totalFinanced, investment.currencyFormat)}</div>
                </div>
                <div class="payment-card">
                  <div class="payment-label">Mensualidad</div>
                  <div class="payment-amount">${formatCurrency(monthlyPayment, investment.currencyFormat)}</div>
                </div>
                <div class="payment-card">
                  <div class="payment-label">Total de Pagos</div>
                  <div class="payment-amount">49 pagos</div>
                </div>
              </div>
            </div>

            <h3 style="font-size: 1.3em; font-weight: bold; color: #374151; margin: 25px 0 15px 0; text-align: center;">
              Tabla de Amortización Completa (Enganche + 48 Mensualidades)
            </h3>
            
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Pago #</th>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Pago Total</th>
                    <th>Capital</th>
                    <th>Interés</th>
                    <th>Saldo</th>
                    <th>Capital Acum.</th>
                    <th>Interés Acum.</th>
                  </tr>
                </thead>
                <tbody>
                  ${generateAmortizationTable()}
                </tbody>
              </table>
            </div>
          </div>

          <!-- EVOLUCIÓN DE CERTIFICADOS -->
          <div class="section">
            <h2 class="section-title">Evolución Detallada de Certificados</h2>

            <!-- ESCENARIO DE PRODUCCIÓN/NEGOCIO -->
            <div style="background: linear-gradient(135deg, ${branding.primaryColor} 0%, ${branding.secondaryColor} 100%); border-radius: 12px; padding: 20px; margin-bottom: 24px; border-left: 5px solid ${branding.accentColor}; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="background: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${branding.primaryColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div style="flex: 1;">
                  <div style="color: white; font-size: 18px; font-weight: 700; margin-bottom: 4px;">Escenario: ${scenarioName}</div>
                  <div style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin-bottom: 6px;">${productType}</div>
                  <div style="display: flex; gap: 16px; margin-top: 8px;">
                    ${scenarioDetails}
                  </div>
                </div>
              </div>
            </div>

            <div class="summary-grid">
              <div class="summary-card">
                <h4>Tickets de Inversión Iniciales</h4>
                <div class="summary-value">${investment.initialCertificates}</div>
                <div class="summary-label">Comprados por ti</div>
              </div>
              <div class="summary-card">
                <h4>Por Reinversión</h4>
                <div class="summary-value">+${results.certificatesSummary.fromReinvestment}</div>
                <div class="summary-label">Adquiridos por reinversión</div>
              </div>
              <div class="summary-card primary">
                <h4>Total Final</h4>
                <div class="summary-value">${results.certificatesSummary.totalCertificates}</div>
                <div class="summary-label">Tickets de Inversión totales</div>
              </div>
              <div class="summary-card">
                <h4>Multiplicador</h4>
                <div class="summary-value">${(results.certificatesSummary.totalCertificates / investment.initialCertificates).toFixed(1)}x</div>
                <div class="summary-label">Factor de crecimiento</div>
              </div>
            </div>

            <div class="chart-section">
              <div class="chart-title">Distribución por Fases (Año ${investment.years})</div>
              <div class="bar-chart">
                ${generatePhaseChart()}
              </div>
            </div>

            <div class="phase-distribution">
              <h3 style="font-size: 1.3em; font-weight: bold; color: #16a34a; margin-bottom: 15px; text-align: center;">
                Resumen de Tickets de Inversión por Estado
              </h3>
              <div class="phase-grid">
                <div class="phase-card">
                  <div class="phase-number">${phaseDistribution.producing}</div>
                  <div class="phase-label">Produciendo</div>
                </div>
                <div class="phase-card">
                  <div class="phase-number">${phaseDistribution.waiting}</div>
                  <div class="phase-label">En Maduración</div>
                </div>
                <div class="phase-card">
                  <div class="phase-number">${phaseDistribution.reserved}</div>
                  <div class="phase-label">Reservados</div>
                </div>
                <div class="phase-card">
                  <div class="phase-number">${results.certificatesSummary.totalCertificates}</div>
                  <div class="phase-label">Total</div>
                </div>
              </div>
            </div>

            <h3 style="font-size: 1.3em; font-weight: bold; color: #374151; margin: 30px 0 15px 0; text-align: center;">
              Evolución Anual Detallada
            </h3>
            
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Año</th>
                    <th>Fecha</th>
                    <th>Precio Cert.</th>
                    <th>Valor Total Certs.</th>
                    <th>Tickets de Inversión</th>
                    <th>Patrimonio</th>
                    <th>Ingreso Anual</th>
                    <th>Utilidad</th>
                    <th>Fondo Reinversión</th>
                  </tr>
                </thead>
                <tbody>
                  ${generateEvolutionTable()}
                </tbody>
              </table>
            </div>

          </div>

          <!-- CONTACTO -->
          <div class="contact-section">
            <div class="contact-title">Información de Contacto</div>
            <div class="contact-grid">
              <div class="contact-card">
                <h4>📞 Contacto Principal</h4>
                <p><strong>WhatsApp:</strong> ${branding.phone}</p>
                <p><strong>Email:</strong> ${branding.email}</p>
                <p><strong>Horario:</strong> Lun-Vie 9:00-18:00</p>
                <p><strong>Atención:</strong> Inmediata por WhatsApp</p>
              </div>

              <div class="contact-card">
                <h4>🌐 Sitio Web</h4>
                <p><strong>Website:</strong></p>
                <p style="font-size: 0.9em; word-break: break-all; color: #3b82f6;">
                  <a href="${branding.website}" target="_blank">
                    ${branding.website}
                  </a>
                </p>
                <p><strong>Disponible:</strong> 24/7</p>
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
            <p>Las proyecciones mostradas en este reporte son estimaciones basadas en los parámetros especificados y datos históricos.
            No constituyen garantías de rendimientos futuros. Los resultados reales pueden variar debido a factores de mercado,
            económicos y otros riesgos inherentes a la inversión. Se recomienda consultar con un asesor financiero
            antes de tomar decisiones de inversión. ${branding.companyName} no garantiza rendimientos específicos y toda inversión conlleva riesgos.</p>
            <p style="margin-top: 15px;"><strong>Este documento es únicamente informativo y no genera obligaciones contractuales.</strong>
            La información presentada no debe considerarse como asesoramiento legal, fiscal o de inversión.
            Todas las decisiones de inversión deben basarse en una evaluación completa de los documentos oficiales y contratos correspondientes.</p>
          </div>

          <!-- FOOTER -->
          <div class="footer">
            <p><strong>© 2025 ${branding.companyName}</strong></p>
            <p>Este reporte es confidencial y está dirigido exclusivamente al cliente mencionado.</p>
            <p><strong>Para más información:</strong> ${branding.email} | WhatsApp: ${branding.phone}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}