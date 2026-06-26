import { Investment, InvestmentResults } from '../../types';
import { formatCurrency, convertFromMXN } from '../formatters';
import { getDetailedCertificateEvolution } from '../calculations/certificateEvolution';
import { DISCLAIMER_HTML, DISCLAIMER_STYLES, WHY_INVEST_HTML, WHY_INVEST_STYLES } from './disclaimerContent';
import { generateFinancingPlanHTML } from './financingPlanReport';
import { getReportBranding, getScenarioName, getScenarioDetails, getProductTypeLabel } from './reportConfig';

export interface ReportOptions {
  advisorName: string;
  advisorPhone: string;
  advisorEmail: string;
  clientName?: string;
}

export function generateExistingCompleteReport(
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

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Análisis Completo - ${branding.companyName}</title>
      
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
          background: #f8fafc;
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
          background: linear-gradient(135deg, ${branding.primaryColor}, ${branding.secondaryColor});
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
          border-left: 6px solid ${branding.primaryColor};
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .section-title {
          font-size: 2em;
          font-weight: bold;
          color: ${branding.primaryColor};
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 3px solid ${branding.secondaryColor};
          text-align: center;
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
          background: ${branding.primaryColor};
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
        
        .certificate {
          display: inline-block;
          width: 24px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          border-radius: 50%;
          margin: 0 2px;
          font-size: 12px;
          font-weight: 500;
        }
        .certificate.reserved {
          background: #e0f2fe;
          color: #0277bd;
        }
        .certificate.waiting {
          background: #e5e7eb;
          color: #4b5563;
        }
        .certificate.growing {
          background: #fef3c7;
          color: #92400e;
        }
        .certificate.producing {
          background: #dcfce7;
          color: #166534;
        }
        .event-new {
          color: #16a34a;
          font-weight: 500;
          font-size: 12px;
        }
        .event-reserved {
          color: #0d9488;
          font-weight: 500;
          font-size: 12px;
        }
        .payment-info {
          font-size: 11px;
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
          background: #047857;
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

        ${DISCLAIMER_STYLES}
        ${WHY_INVEST_STYLES}
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
          <h1>Análisis Completo de Inversión</h1>
          <div class="subtitle">Ticket de Inversión de Crecimiento Exponencial</div>
          <div class="date">${currentDate}</div>
        </div>
        
        <div class="content">
          <!-- INFORMACIÓN DEL ASESOR -->
          <div class="section">
            <h2 class="section-title">Información del Asesor</h2>
            <div style="background: white; padding: 20px; border-radius: 10px;">
              <p><strong>👤 Nombre del Asesor:</strong> ${options.advisorName}</p>
              <p><strong>📞 Teléfono:</strong> ${options.advisorPhone}</p>
              <p><strong>📧 Email:</strong> ${options.advisorEmail}</p>
              ${options.clientName ? `<p><strong>👥 Cliente:</strong> ${options.clientName}</p>` : ''}
            </div>
          </div>

          <!-- EVOLUCIÓN DETALLADA DE CERTIFICADOS -->
          <div class="section">
            <h2 class="section-title">Evolución Detallada de Tickets de Inversión</h2>

            <!-- ESCENARIO DE PRODUCCIÓN -->
            <div style="background: linear-gradient(135deg, ${branding.secondaryColor} 0%, ${branding.primaryColor} 100%); border-radius: 12px; padding: 20px; margin-bottom: 24px; border-left: 5px solid #047857; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="background: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${branding.secondaryColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
                    <th>Fecha</th>
                    <th>Precio Cert.</th>
                    <th>Valor Total Certs.</th>
                    <th>Certificados</th>
                    <th>Utilidad Total</th>
                    <th>Fondo Reinversión</th>
                    <th>Saldo Disponible</th>
                    <th>Eventos</th>
                  </tr>
                </thead>
                <tbody>
                  ${(() => {
                    const certificateEvolution = getDetailedCertificateEvolution(investment);
                    return certificateEvolution.map(row => `
                      <tr class="${row.newCertificateIds.length > 0 ? 'cosecha-row' : ''}">
                        <td>${row.year}</td>
                        <td>${row.date}</td>
                        <td>${formatCurrency(convertFromMXN(row.certificatePrice, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                        <td style="font-weight: bold; color: #047857;">${formatCurrency(convertFromMXN(row.certificatePrice * row.certificates.filter(cert => cert.status === 'producing').length, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                        <td>
                          ${row.certificates.sort((a, b) => a.id - b.id).map(cert => `
                            <span class="certificate ${cert.status}" title="${cert.details}">${cert.id}</span>
                          `).join('')}
                        </td>
                        <td>${formatCurrency(convertFromMXN(row.totalUtility, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                        <td>${formatCurrency(convertFromMXN(row.reinvestmentFund, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                        <td>${formatCurrency(convertFromMXN(row.availableForReinvestment, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                        <td>
                          ${row.newCertificateIds.map(id => `
                            <div class="event-new">¡Ticket de Inversión ${id} liquidado completamente!</div>
                          `).join('')}
                          ${row.reservedCertificateIds.map(id => `
                            <div class="event-reserved">Apartado Ticket de Inversión ${id}</div>
                          `).join('')}
                          ${row.payments.length > 0 ? `
                            <div class="payment-info">Pagos realizados: ${row.payments.length}</div>
                          ` : ''}
                        </td>
                      </tr>
                    `).join('');
                  })()}
                </tbody>
              </table>
            </div>
          </div>

          <!-- RESUMEN EJECUTIVO -->
          <div class="section">
            <h2 class="section-title">📊 Resumen Ejecutivo</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 25px; margin: 30px 0;">
              <div style="background: white; padding: 25px; border-radius: 15px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <div style="font-size: 3em; font-weight: bold; color: ${branding.primaryColor}; margin-bottom: 10px;">${investment.initialCertificates}</div>
                <div style="color: #374151; font-weight: bold;">Certificados Iniciales</div>
                <div style="color: #6b7280; font-size: 0.9em;">Inversión base</div>
              </div>
              <div style="background: white; padding: 25px; border-radius: 15px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <div style="font-size: 3em; font-weight: bold; color: ${branding.primaryColor}; margin-bottom: 10px;">${results.certificatesSummary.totalCertificates}</div>
                <div style="color: #374151; font-weight: bold;">Certificados Finales</div>
                <div style="color: #6b7280; font-size: 0.9em;">Con reinversión</div>
              </div>
              <div style="background: white; padding: 25px; border-radius: 15px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <div style="font-size: 3em; font-weight: bold; color: ${branding.primaryColor}; margin-bottom: 10px;">${formatCurrency(convertFromMXN(results.finalMonthlyIncome, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</div>
                <div style="color: #374151; font-weight: bold;">Ingreso Mensual</div>
                <div style="color: #6b7280; font-size: 0.9em;">Al año ${investment.years}</div>
              </div>
              <div style="background: white; padding: 25px; border-radius: 15px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <div style="font-size: 3em; font-weight: bold; color: ${branding.primaryColor}; margin-bottom: 10px;">${results.capitalMultiplier.toFixed(1)}x</div>
                <div style="color: #374151; font-weight: bold;">Multiplicador</div>
                <div style="color: #6b7280; font-size: 0.9em;">Crecimiento total</div>
              </div>
            </div>
          </div>

          <!-- MÉTRICAS CLAVE -->
          <div class="section">
            <h2 class="section-title">Métricas Clave de Rendimiento</h2>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 25px 0;">
              <div style="background: white; padding: 25px; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: 2px solid #16a34a;">
                <h4>CAGR</h4>
                <div style="font-size: 1.8em; font-weight: bold; color: #1f2937; margin-bottom: 8px;">${(results.cagr).toFixed(1)}%</div>
                <div style="font-size: 0.9em; color: #6b7280;">Crecimiento anual compuesto</div>
              </div>
              <div style="background: white; padding: 25px; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: 2px solid #16a34a;">
                <h4>TIR</h4>
                <div style="font-size: 1.8em; font-weight: bold; color: #1f2937; margin-bottom: 8px;">${(results.irr).toFixed(1)}%</div>
                <div style="font-size: 0.9em; color: #6b7280;">Tasa interna de retorno</div>
              </div>
              <div style="background: white; padding: 25px; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: 2px solid #16a34a;">
                <h4>ROI Estimado</h4>
                <div style="font-size: 1.8em; font-weight: bold; color: #1f2937; margin-bottom: 8px;">${((results.capitalMultiplier - 1) * 100).toFixed(0)}%</div>
                <div style="font-size: 0.9em; color: #6b7280;">Retorno estimado sobre inversión</div>
              </div>
              <div style="background: white; padding: 25px; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: 2px solid #16a34a;">
                <h4>Payback</h4>
                <div style="font-size: 1.8em; font-weight: bold; color: #1f2937; margin-bottom: 8px;">${typeof results.paybackYear === 'number' ? results.paybackYear.toFixed(2) : (results.paybackYear || 'N/A')}</div>
                <div style="font-size: 0.9em; color: #6b7280;">Año de recuperación</div>
              </div>
            </div>
          </div>

          <!-- PLAN DE PAGOS -->
          <div class="section">
            <h2 class="section-title">Plan de Pagos</h2>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 25px 0;">
              <div style="background: white; padding: 25px; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <h4>Inversión Total</h4>
                <div style="font-size: 1.8em; font-weight: bold; color: #1f2937; margin-bottom: 8px;">${formatCurrency(totalInvestment, investment.currencyFormat)}</div>
                <div style="font-size: 0.9em; color: #6b7280;">${investment.initialCertificates} ${branding.productName}</div>
              </div>
              <div style="background: white; padding: 25px; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <h4>Enganche</h4>
                <div style="font-size: 1.8em; font-weight: bold; color: #1f2937; margin-bottom: 8px;">${formatCurrency(totalInvestment * (investment.downPaymentPercentage / 100), investment.currencyFormat)}</div>
                <div style="font-size: 0.9em; color: #6b7280;">${investment.downPaymentPercentage}% inicial</div>
              </div>
              <div style="background: white; padding: 25px; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <h4>Mensualidad</h4>
                <div style="font-size: 1.8em; font-weight: bold; color: #1f2937; margin-bottom: 8px;">${formatCurrency((totalInvestment * (100 - investment.downPaymentPercentage) / 100) / 48, investment.currencyFormat)}</div>
                <div style="font-size: 0.9em; color: #6b7280;">48 pagos mensuales</div>
              </div>
              <div style="background: white; padding: 25px; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <h4>Utilidad Anual</h4>
                <div style="font-size: 1.8em; font-weight: bold; color: #1f2937; margin-bottom: 8px;">${((investment.averageProductionPerHectare * investment.averageSalePricePerKg * 0.1 * 0.65 / investment.certificateBasePrice) * 100).toFixed(1)}%</div>
                <div style="font-size: 0.9em; color: #6b7280;">Rendimiento proyectado</div>
              </div>
            </div>
          </div>

          <!-- EVOLUCIÓN DETALLADA -->
          <div class="section">
            <h2 class="section-title">Evolución Detallada por Año</h2>
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Año</th>
                    <th>Fecha</th>
                    <th>Precio Cert.</th>
                    <th>Valor Total Certs.</th>
                    <th>Certificados</th>
                    <th>Utilidad Total</th>
                    <th>Fondo Reinversión</th>
                    <th>Saldo Disponible</th>
                    <th>Eventos</th>
                  </tr>
                </thead>
                <tbody>
                  ${(() => {
                    const certificateEvolution = getDetailedCertificateEvolution(investment);
                    return certificateEvolution.map(row => `
                      <tr class="${row.newCertificateIds.length > 0 ? 'cosecha-row' : ''}">
                        <td>${row.year}</td>
                        <td>${row.date}</td>
                        <td>${formatCurrency(convertFromMXN(row.certificatePrice, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                        <td style="font-weight: bold; color: #047857;">${formatCurrency(convertFromMXN(row.certificatePrice * row.certificates.filter(cert => cert.status === 'producing').length, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                        <td>
                          ${row.certificates.sort((a, b) => a.id - b.id).map(cert => `
                            <span class="certificate ${cert.status}" title="${cert.details}">${cert.id}</span>
                          `).join('')}
                        </td>
                        <td>${formatCurrency(convertFromMXN(row.totalUtility, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                        <td>${formatCurrency(convertFromMXN(row.reinvestmentFund, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                        <td>${formatCurrency(convertFromMXN(row.availableForReinvestment, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                        <td>
                          ${row.newCertificateIds.map(id => `
                            <div class="event-new">¡Ticket de Inversión ${id} liquidado completamente!</div>
                          `).join('')}
                          ${row.reservedCertificateIds.map(id => `
                            <div class="event-reserved">Apartado Ticket de Inversión ${id}</div>
                          `).join('')}
                          ${row.payments.length > 0 ? `
                            <div class="payment-info">Pagos realizados: ${row.payments.length}</div>
                          ` : ''}
                        </td>
                      </tr>
                    `).join('');
                  })()}
                </tbody>
              </table>
            </div>
          </div>

          <!-- LEYENDA -->
          <div class="section">
            <h2 class="section-title">Leyenda de Estados</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
              <div style="display: flex; align-items: center; gap: 15px;">
                <span class="certificate reserved" style="background: #e0f2fe; color: #0277bd;">1</span>
                <div>
                  <div style="font-weight: bold; color: #374151;">En proceso de pago</div>
                  <div style="color: #6b7280; font-size: 0.9em;">Muestra el monto pagado y pendiente</div>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 15px;">
                <span class="certificate waiting" style="background: #e5e7eb; color: #4b5563;">2</span>
                <div>
                  <div style="font-weight: bold; color: #374151;">En maduración</div>
                  <div style="color: #6b7280; font-size: 0.9em;">Indica años restantes para producción</div>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 15px;">
                <span class="certificate growing" style="background: #fef3c7; color: #92400e;">3</span>
                <div>
                  <div style="font-weight: bold; color: #374151;">Iniciando producción</div>
                  <div style="color: #6b7280; font-size: 0.9em;">Primer año de utilidades</div>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 15px;">
                <span class="certificate producing" style="background: #dcfce7; color: #166534;">4</span>
                <div>
                  <div style="font-weight: bold; color: #374151;">Generando utilidades</div>
                  <div style="color: #6b7280; font-size: 0.9em;">Muestra años en producción y utilidad actual</div>
                </div>
              </div>
            </div>
          </div>

          <!-- COMPARACIÓN CON ALTERNATIVAS -->
          <div class="section">
            <h2 class="section-title">Comparación con Inversiones Alternativas</h2>
            
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Tipo de Inversión</th>
                    <th>Patrimonio Final</th>
                    <th>Ingreso Mensual</th>
                    <th>Multiplicador</th>
                    <th>Ventaja vs ${branding.companyName}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="cosecha-row">
                    <td><strong>${branding.companyName}</strong></td>
                    <td><strong>${formatCurrency(convertFromMXN(results.finalPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</strong></td>
                    <td><strong>${formatCurrency(convertFromMXN(results.finalMonthlyIncome, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</strong></td>
                    <td><strong>${results.capitalMultiplier.toFixed(1)}x</strong></td>
                    <td><strong>100% (Referencia)</strong></td>
                  </tr>
                  <tr>
                    <td>📊 CETES</td>
                    <td>${formatCurrency(convertFromMXN(results.cetesPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                    <td>${formatCurrency(convertFromMXN(results.cetesPatrimony * (investment.cetesRate / 100) / 12, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                    <td>${(results.cetesPatrimony / (investment.initialCertificates * investment.certificateBasePrice)).toFixed(1)}x</td>
                    <td>${((results.cetesPatrimony / results.finalPatrimony) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td>🏦 Ahorro Tradicional</td>
                    <td>${formatCurrency(convertFromMXN(results.savingsPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                    <td>${formatCurrency(convertFromMXN(results.savingsPatrimony * (investment.savingsRate / 100) / 12, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                    <td>${(results.savingsPatrimony / (investment.initialCertificates * investment.certificateBasePrice)).toFixed(1)}x</td>
                    <td>${((results.savingsPatrimony / results.finalPatrimony) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td>🏠 Bienes Raíces</td>
                    <td>${formatCurrency(convertFromMXN(results.realEstatePatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                    <td>${formatCurrency(convertFromMXN(results.realEstatePatrimony * (investment.realEstateRent / 100) / 12, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</td>
                    <td>${(results.realEstatePatrimony / (investment.initialCertificates * investment.certificateBasePrice)).toFixed(1)}x</td>
                    <td>${((results.realEstatePatrimony / results.finalPatrimony) * 100).toFixed(1)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>


          <!-- CONTACTO -->
          <div class="section">
            <h2 class="section-title">Información de Contacto</h2>
            <div style="background: white; padding: 20px; border-radius: 10px;">
              <p><strong>📞 WhatsApp:</strong> ${branding.phone}</p>
              <p><strong>📧 Email:</strong> ${branding.email}</p>
              <p><strong>🕒 Horario:</strong> Lun-Vie 9:00-18:00</p>
              <p><strong>⚡ Atención:</strong> Inmediata por WhatsApp</p>
            </div>
          </div>
          <!-- PLAN DE FINANCIAMIENTO -->
          ${generateFinancingPlanHTML(investment, {
            downPaymentPercent: investment.financingDownPaymentPercent ?? options.downPaymentPercent ?? 30,
            annualInterestRate: investment.financingAnnualInterestRate ?? options.annualInterestRate ?? 12
          })}

          ${WHY_INVEST_HTML}

          ${DISCLAIMER_HTML}

          <!-- FOOTER -->
          <div style="text-align: center; margin-top: 40px; padding: 25px; background: #f3f4f6; border-radius: 8px; color: #6b7280;">
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
