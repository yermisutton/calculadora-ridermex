export interface UnitEconomicsData {
  capitalInvertido: number;
  motosVendidasAnual: number;
  utilidadPorMoto: number;
  escalon: number;
  scenario: string;
  numTickets: number;
  reinvestmentEnabled: boolean;
  projectionYears: number;
  partialCashOut?: boolean;
  cashOutPercentage?: number;
  financingMonths: 0 | 12;
  metricas?: any;
  proyeccionMultianual?: any;
  roiData?: any;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: number, decimals = 2): string => {
  return value.toLocaleString('es-MX', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const generateUnitEconomicsHTML = (data: UnitEconomicsData): string => {
  const {
    capitalInvertido,
    motosVendidasAnual,
    utilidadPorMoto,
    escalon,
    scenario,
    numTickets,
    reinvestmentEnabled,
    projectionYears,
    financingMonths,
    partialCashOut,
    cashOutPercentage,
    metricas = {},
    proyeccionMultianual = [],
    roiData = {},
  } = data;

  if (!metricas || typeof metricas !== 'object') {
    throw new Error('Invalid metrics data');
  }
  if (!roiData || typeof roiData !== 'object') {
    throw new Error('Invalid ROI data');
  }
  if (!Array.isArray(proyeccionMultianual)) {
    throw new Error('Invalid projection data');
  }

  const utilizadaUnitariaEstimada = motosVendidasAnual * utilidadPorMoto;
  const currentDate = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Análisis Completo de Inversión - Economía Unitaria</title>
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
          background: linear-gradient(135deg, #e53e3e 0%, #c53030 50%, #9b2c2c 100%);
          color: white;
          padding: 60px 40px;
          text-align: center;
          position: relative;
          border-bottom: 5px solid #f56565;
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
          border-left: 7px solid #e53e3e;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border-top: 1px solid #e0e6ed;
        }

        .section-title {
          font-size: 1.9em;
          font-weight: 700;
          color: #e53e3e;
          margin-bottom: 30px;
          padding-bottom: 18px;
          border-bottom: 3px solid #f56565;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .executive-summary {
          background: linear-gradient(135deg, #e53e3e 0%, #f56565 100%);
          color: white;
          padding: 50px;
          border-radius: 12px;
          margin: 50px 0;
          text-align: center;
          border: none;
          box-shadow: 0 8px 25px rgba(229, 62, 62, 0.2);
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
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          border-color: #dc2626;
          border-top-color: #dc2626;
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
          color: #e53e3e;
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
          background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
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

        .highlight-row {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%) !important;
          font-weight: 700;
          border-left: 5px solid #dc2626;
        }

        .info-box {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          border-left: 5px solid #dc2626;
          padding: 25px;
          border-radius: 8px;
          margin: 25px 0;
          box-shadow: 0 3px 10px rgba(220, 38, 38, 0.1);
        }

        .info-box h5 {
          color: #991b1b;
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
          color: #b91c1c;
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

        @media print {
          body {
            background: white;
            padding: 0;
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
      <div class="container">
        <div class="header">
          <h1>Análisis Completo de Inversión</h1>
          <div class="subtitle">Economía Unitaria - Proyección Detallada</div>
          <div class="date">${currentDate}</div>
        </div>

        <div class="content">
          <!-- RESUMEN EJECUTIVO -->
          <div class="executive-summary">
            <div class="executive-title">Resumen Ejecutivo</div>
            <div class="executive-grid">
              <div class="executive-card">
                <div class="executive-number">${formatCurrency(capitalInvertido)}</div>
                <div class="executive-label">Inversión Inicial</div>
                <div class="executive-desc">${numTickets} ticket${numTickets > 1 ? 's' : ''}</div>
              </div>
              <div class="executive-card">
                <div class="executive-number">${formatCurrency(utilizadaUnitariaEstimada)}</div>
                <div class="executive-label">Utilidad Anual</div>
                <div class="executive-desc">Año 1 estimada</div>
              </div>
              <div class="executive-card">
                <div class="executive-number">${formatNumber((metricas.roi || 0), 1)}%</div>
                <div class="executive-label">ROI Anual</div>
                <div class="executive-desc">Retorno proyectado</div>
              </div>
              <div class="executive-card">
                <div class="executive-number">${formatNumber((metricas.multiplicadorCapital || 1), 2)}x</div>
                <div class="executive-label">Multiplicador</div>
                <div class="executive-desc">Al año ${projectionYears}</div>
              </div>
            </div>
          </div>

          <!-- INFORMACIÓN DE LA INVERSIÓN -->
          <div class="section">
            <h2 class="section-title">Parámetros de Inversión</h2>

            <div class="metrics-grid">
              <div class="metric-card">
                <h4>Motos Vendidas Anualmente</h4>
                <div class="metric-value">${motosVendidasAnual}</div>
                <div class="metric-label">Escenario: ${scenario}</div>
              </div>
              <div class="metric-card">
                <h4>Utilidad por Moto</h4>
                <div class="metric-value">${formatCurrency(utilidadPorMoto)}</div>
                <div class="metric-label">Ganancia unitaria</div>
              </div>
              <div class="metric-card primary">
                <h4>Reinversión</h4>
                <div class="metric-value">${reinvestmentEnabled ? 'Activa' : 'Inactiva'}</div>
                <div class="metric-label">Capitalización</div>
              </div>
            </div>

            <div class="info-box">
              <h5>Configuración del Análisis</h5>
              <ul>
                <li>Horizonte de proyección: ${projectionYears} años</li>
                <li>Estructura de tickets: ${numTickets} inicial${numTickets > 1 ? 'es' : ''}</li>
                <li>Modelo de reinversión: ${reinvestmentEnabled ? 'Ganancias se reinvierten automáticamente' : 'Ganancias se retiran anualmente'}</li>
                <li>Tipo de financiamiento: ${financingMonths === 12 ? '12 meses sin intereses' : 'Pago al contado'}</li>
              </ul>
            </div>
          </div>

          <!-- MÉTRICAS CLAVE DE DESEMPEÑO -->
          <div class="section">
            <h2 class="section-title">Métricas de Desempeño</h2>

            <div class="metrics-grid">
              <div class="metric-card primary">
                <h4>Ganancia Mensual</h4>
                <div class="metric-value">${formatCurrency((metricas.gananciasMensual || 0))}</div>
                <div class="metric-label">Año 1 promedio</div>
              </div>
              <div class="metric-card primary">
                <h4>Ganancia Diaria</h4>
                <div class="metric-value">${formatCurrency((metricas.gananciasDiaria || 0))}</div>
                <div class="metric-label">Promedio diario</div>
              </div>
              <div class="metric-card">
                <h4>ROI Proyectado</h4>
                <div class="metric-value">${formatNumber((metricas.roi || 0), 1)}%</div>
                <div class="metric-label">Retorno anual</div>
              </div>
              <div class="metric-card">
                <h4>Multiplicador Final</h4>
                <div class="metric-value">${formatNumber((metricas.multiplicadorCapital || 1), 2)}x</div>
                <div class="metric-label">En año ${projectionYears}</div>
              </div>
            </div>
          </div>

          <!-- PROYECCIÓN MULTI-ANUAL DETALLADA -->
          ${proyeccionMultianual.length > 0 ? `
            <div class="section">
              <h2 class="section-title">Proyección Financiera ${projectionYears} Años</h2>

              <p style="color: #2c3e50; margin-bottom: 25px; text-align: center; font-size: 0.95em; line-height: 1.6;">
                Proyección detallada del crecimiento del patrimonio, tickets y ganancias considerando reinversión automática de utilidades.
              </p>

              <div class="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Año</th>
                      <th>Tickets Totales</th>
                      <th>Nuevos Tickets</th>
                      <th>Ganancia Anual</th>
                      <th>Ganancia Retirable</th>
                      <th>Plusvalía</th>
                      <th>Patrimonio Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${proyeccionMultianual.slice(0, Math.min(projectionYears, 10)).map((year: any, index: number) => `
                      <tr ${index === Math.min(projectionYears - 1, 9) ? 'class="highlight-row"' : ''}>
                        <td><strong>Año ${year.year}</strong></td>
                        <td>${year.tickets || 0}</td>
                        <td>${year.ticketsComprados || 0}</td>
                        <td>${formatCurrency(year.gananciaAnualTotalEstimada || 0)}</td>
                        <td>${formatCurrency(year.gananciaRetirableEstimada || 0)}</td>
                        <td>${formatCurrency(year.plusvaliaTotalTickets || 0)}</td>
                        <td><strong>${formatCurrency(year.patrimonioTotal || 0)}</strong></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>

              <div class="info-box">
                <h5>Interpretación de la Proyección</h5>
                <ul>
                  <li>Los resultados proyectados asumen reinversión automática de dividendos</li>
                  <li>El multiplicador refleja el crecimiento total del patrimonio vs inversión inicial</li>
                  <li>Las ganancias retirables representan flujo de caja disponible anualmente</li>
                  <li>Año ${projectionYears} marca la culminación del ciclo proyectado</li>
                </ul>
              </div>
            </div>
          ` : ''}

          <!-- ANÁLISIS CLAVE -->
          <div class="section">
            <h2 class="section-title">Análisis Clave</h2>

            ${roiData.recuperoCompleto ? `
              <div class="info-box">
                <h5>Retorno de Inversión Alcanzado</h5>
                <ul>
                  <li>Tu inversión inicial será recuperada completamente en el <strong>Año ${roiData.yearRecuperacion || '?'}</strong></li>
                  <li>ROI Final: <strong>${formatNumber((roiData.roiFinal || 0), 1)}%</strong></li>
                  <li>Ganancias Totales: <strong>${formatCurrency(roiData.retornoFinal || 0)}</strong></li>
                  <li>Multiplicador de Capital: <strong>${formatNumber((metricas.multiplicadorCapital || 1), 2)}x</strong></li>
                </ul>
              </div>
            ` : `
              <div class="info-box">
                <h5>Proyección de Retorno</h5>
                <ul>
                  <li>En ${projectionYears} años proyectados, patrimonio total: <strong>${formatCurrency(roiData.retornoFinal || 0)}</strong></li>
                  <li>ROI Proyectado: <strong>${formatNumber((roiData.roiFinal || 0), 1)}%</strong> sobre inversión inicial</li>
                  <li>Flujo de ganancias acumuladas: <strong>${formatCurrency(roiData.gananciasAcumuladas || 0)}</strong></li>
                  <li>Para acelerar retorno, considera extender el período o optimizar reinversión</li>
                </ul>
              </div>
            `}
          </div>

          <!-- SUPUESTOS METODOLÓGICOS -->
          <div class="section">
            <h2 class="section-title">Supuestos y Metodología</h2>

            <div class="info-box">
              <h5>Supuestos de Cálculo</h5>
              <ul>
                <li><strong>Crecimiento de Mercado:</strong> 5% anual - Asume expansión consistente</li>
                <li><strong>Apreciación de Capital:</strong> 50% año 1, luego 5% compuesto anual</li>
                <li><strong>Descuento de Rendimiento:</strong> 2% anual conservador</li>
                <li><strong>Estructura de Reinversión:</strong> Ganancias reinvertidas automáticamente</li>
              </ul>
            </div>

            ${reinvestmentEnabled ? `
              <div class="info-box">
                <h5>Impacto de la Reinversión Automática</h5>
                <ul>
                  <li>Los tickets iniciales generan ganancias anuales que se reinvierten</li>
                  <li>Acumulación de capital hasta alcanzar el costo de nuevo ticket</li>
                  <li>Nuevos tickets generan utilidades adicionales (efecto compuesto)</li>
                  <li>Ciclo se repite multiplicando exponencialmente el patrimonio</li>
                </ul>
              </div>
            ` : ''}
          </div>

          <!-- DISCLAIMER -->
          <div class="disclaimer">
            <h4>Aviso Legal Importante</h4>
            <p>Esta proyección se proporciona únicamente con fines ilustrativos y educativos. Los resultados reales pueden variar significativamente basándose en condiciones de mercado, desempeño operacional, cambios regulatorios y otros factores. Los rendimientos pasados no garantizan resultados futuros. Este análisis no constituye asesoramiento financiero profesional. Se recomienda consultar con un asesor financiero calificado antes de tomar decisiones de inversión.</p>
          </div>
        </div>

        <div class="footer">
          <p><strong>Análisis Completo de Inversión - Economía Unitaria</strong></p>
          <p>Este reporte fue generado automáticamente con datos de entrada proporcionados.</p>
          <p>Fecha de generación: ${currentDate}</p>
          <p>Para más información sobre este análisis, contacta con tu asesor de inversiones.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return htmlContent;
};

export const generateUnitEconomicsPDF = async (data: UnitEconomicsData): Promise<void> => {
  const htmlContent = generateUnitEconomicsHTML(data);
  const timestamp = new Date().toISOString().split('T')[0];

  try {
    const html2pdf = (window as any).html2pdf;
    if (!html2pdf) {
      throw new Error('html2pdf library not loaded');
    }

    const element = document.createElement('div');
    element.style.width = '210mm';
    element.style.padding = '10mm';
    element.style.backgroundColor = 'white';
    element.innerHTML = htmlContent;

    document.body.appendChild(element);

    await new Promise((resolve, reject) => {
      try {
        html2pdf()
          .set({
            margin: [10, 10, 10, 10],
            filename: `Analisis-Completo-Inversion-${timestamp}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
              scale: 2,
              useCORS: true,
              logging: false,
              backgroundColor: '#ffffff'
            },
            jsPDF: {
              orientation: 'portrait',
              unit: 'mm',
              format: 'a4',
              compress: true
            }
          })
          .from(element)
          .save()
          .then(() => {
            document.body.removeChild(element);
            resolve(undefined);
          });
      } catch (error) {
        document.body.removeChild(element);
        reject(error);
      }
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Error al generar el PDF. Por favor intenta de nuevo.');
  }
};

export const downloadHTMLReport = (data: UnitEconomicsData): void => {
  const htmlContent = generateUnitEconomicsHTML(data);
  const timestamp = new Date().toISOString().split('T')[0];
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Analisis-Completo-Inversion-${timestamp}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
