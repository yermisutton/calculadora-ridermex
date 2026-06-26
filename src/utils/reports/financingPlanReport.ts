import { Investment } from '../../types';
import { formatCurrency, convertFromMXN } from '../formatters';

interface FinancingPlanOptions {
  downPaymentPercent?: number;
  annualInterestRate?: number;
}

export function generateFinancingPlanHTML(
  investment: Investment,
  _options: FinancingPlanOptions = {}
): string {
  const productType = investment.ridermexProductType || 'B';
  if (productType !== 'B' && productType !== 'D') {
    return '';
  }

  const totalInvestment = investment.initialCertificates * investment.certificateBasePrice;
  const downPayment = 10000 * investment.initialCertificates;
  const loanAmount = totalInvestment - downPayment;
  const months = productType === 'B' ? 12 : (investment.ridermexFinancingMonths || 48);
  const monthlyPayment = loanAmount / months;

  const format = (value: number) => {
    return formatCurrency(
      convertFromMXN(value, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR),
      investment.currencyFormat
    );
  };

  const totalPaid = downPayment + loanAmount;

  let tableHTML = '';
  if (months <= 12) {
    const scheduleRows = Array.from({ length: months }, (_, i) => {
      const month = i + 1;
      const balance = loanAmount - (monthlyPayment * month);
      return `
        <tr class="financing-table-row">
          <td style="padding: 10px 8px; font-weight: 600; text-align: center;">${month}</td>
          <td style="padding: 10px 8px; text-align: right;">${format(monthlyPayment)}</td>
          <td style="padding: 10px 8px; text-align: right;">${format(monthlyPayment)}</td>
          <td style="padding: 10px 8px; text-align: right;">$0</td>
          <td style="padding: 10px 8px; text-align: right; font-weight: 600;">${format(Math.max(0, balance))}</td>
        </tr>
      `;
    }).join('');

    const monthZeroRow = `
      <tr class="financing-table-row" style="background: #fef2f2; font-weight: bold;">
        <td style="padding: 10px 8px; font-weight: 600; text-align: center; color: #dc2626;">0 (Enganche)</td>
        <td style="padding: 10px 8px; text-align: right; color: #dc2626;">${format(downPayment)}</td>
        <td style="padding: 10px 8px; text-align: right; color: #dc2626;">${format(downPayment)}</td>
        <td style="padding: 10px 8px; text-align: right;">$0</td>
        <td style="padding: 10px 8px; text-align: right; font-weight: 600;">${format(loanAmount)}</td>
      </tr>
    `;

    tableHTML = `
      <div class="financing-table-container">
        <table class="financing-table">
          <thead>
            <tr>
              <th style="padding: 12px 8px; text-align: center; font-weight: 600;">Mes</th>
              <th style="padding: 12px 8px; text-align: right; font-weight: 600;">Pago</th>
              <th style="padding: 12px 8px; text-align: right; font-weight: 600;">Capital</th>
              <th style="padding: 12px 8px; text-align: right; font-weight: 600;">Interés</th>
              <th style="padding: 12px 8px; text-align: right; font-weight: 600;">Saldo</th>
            </tr>
          </thead>
          <tbody>
            ${monthZeroRow}
            ${scheduleRows}
          </tbody>
          <tfoot>
            <tr>
              <td style="padding: 12px 8px; font-weight: bold; text-align: center;">TOTALES</td>
              <td style="padding: 12px 8px; text-align: right; font-weight: bold;">${format(totalInvestment)}</td>
              <td style="padding: 12px 8px; text-align: right; font-weight: bold;">${format(totalInvestment)}</td>
              <td style="padding: 12px 8px; text-align: right; font-weight: bold;">$0</td>
              <td style="padding: 12px 8px; text-align: right; font-weight: bold;">$0</td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;
  } else {
    // For months > 12 (typically 48 months), display in 4 side-by-side columns
    const colsCount = 4;
    const totalItems = months + 1; // Month 0 to month N
    const rowsPerCol = Math.ceil(totalItems / colsCount); // e.g. 49 / 4 = 13
    let colsHTML = '';

    for (let c = 0; c < colsCount; c++) {
      let rowsHTML = '';
      for (let r = 0; r < rowsPerCol; r++) {
        const i = c * rowsPerCol + r;
        if (i >= totalItems) break;

        const month = i;
        if (month === 0) {
          rowsHTML += `
            <tr class="financing-table-row" style="background: #fef2f2; font-weight: bold;">
              <td style="padding: 6px 4px; font-weight: 600; text-align: center; color: #dc2626;">0</td>
              <td style="padding: 6px 4px; text-align: right; color: #dc2626;">${format(downPayment)}</td>
              <td style="padding: 6px 4px; text-align: right; font-weight: 600;">${format(loanAmount)}</td>
            </tr>
          `;
        } else {
          const balance = loanAmount - (monthlyPayment * month);
          rowsHTML += `
            <tr class="financing-table-row">
              <td style="padding: 6px 4px; font-weight: 600; text-align: center;">${month}</td>
              <td style="padding: 6px 4px; text-align: right;">${format(monthlyPayment)}</td>
              <td style="padding: 6px 4px; text-align: right; font-weight: 600;">${format(Math.max(0, balance))}</td>
            </tr>
          `;
        }
      }

      colsHTML += `
        <div class="financing-subtable-column">
          <table class="financing-subtable">
            <thead>
              <tr>
                <th style="padding: 8px 4px; text-align: center; font-weight: 600;">Mes</th>
                <th style="padding: 8px 4px; text-align: right; font-weight: 600;">Pago</th>
                <th style="padding: 8px 4px; text-align: right; font-weight: 600;">Saldo</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHTML}
            </tbody>
          </table>
        </div>
      `;
    }

    tableHTML = `
      <div class="financing-columns-container">
        ${colsHTML}
      </div>
    `;
  }

  return `
    <div class="pdf-page financing-page-wrapper">
      <div class="pdf-sidebar"></div>
      <div class="section-title">Plan de Financiamiento</div>

      <div class="financing-summary-container">
        <div class="financing-summary-grid">
          <div class="financing-summary-card primary">
            <div class="label">Monto Total</div>
            <div class="value">${format(totalInvestment)}</div>
          </div>
          <div class="financing-summary-card success">
            <div class="label">Pago Mensual</div>
            <div class="value">${format(monthlyPayment)}</div>
          </div>
          <div class="financing-summary-card info">
            <div class="label">Interés Total</div>
            <div class="value">$0 (Sin Intereses)</div>
          </div>
        </div>
      </div>

      <div class="financing-details-grid">
        <div class="financing-details-card margin-green">
          <div class="label">Enganche (${format(10000)} por ticket)</div>
          <div class="value">${format(downPayment)}</div>
        </div>
        <div class="financing-details-card margin-blue">
          <div class="label">Monto a Financiar</div>
          <div class="value">${format(loanAmount)}</div>
        </div>
      </div>

      <div class="financing-schedule-section">
        <h4 class="financing-schedule-title">
          Tabla de Pagos (${months} meses sin intereses)
        </h4>
        ${tableHTML}
      </div>

      <div class="financing-total-container">
        <div class="financing-total-row">
          <span class="label">Costo del ticket</span>
          <span class="value">${format(totalInvestment)}</span>
        </div>
        <div class="financing-total-row">
          <span class="label">Intereses</span>
          <span class="value">$0 (0%)</span>
        </div>
        <div class="financing-grand-total">
          <span class="label">Total a Pagar</span>
          <span class="value">${format(totalPaid)}</span>
        </div>
      </div>

      <div class="financing-note-box">
        <p>
          <strong>Nota:</strong> Este plan de financiamiento es a ${months} meses sin intereses.
          El enganche es de $10,000 MXN por ticket y la diferencia se paga en ${months} mensualidades iguales.
          Aplica exclusivamente para los Modelos Financiados (Modelo B y Modelo D).
        </p>
      </div>
    </div>
  `;
}
