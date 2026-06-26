import { Investment, InvestmentResults } from '../../types';
import { formatCurrency, convertFromMXN } from '../formatters';
import { RIDERMEX_CONFIG, ESCALONES } from '../../data/ridermexConfig';
import { generateFinancingPlanHTML } from './financingPlanReport';
import { getDetailedCertificateEvolution } from '../calculations/certificateEvolution';
import { RIDERMEX_LETTERHEAD_BASE64 } from './letterheadAsset';

function generateSvgLineChart(
  title: string,
  data: any[],
  series: Array<{ key: string; name: string; color: string }>,
  isCurrency = true,
  currencyFormat = 'MXN'
): string {
  const width = 230;
  const height = 120;
  const padLeft = 38;
  const padBottom = 16;
  const padTop = 15;
  const padRight = 8;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  let maxVal = 0;
  data.forEach(d => {
    series.forEach(s => {
      const v = d[s.key] || 0;
      if (v > maxVal) maxVal = v;
    });
  });
  if (maxVal === 0) maxVal = 1;

  const ticksY = [0, maxVal / 2, maxVal];
  let gridHTML = '';
  ticksY.forEach((tick) => {
    const y = padTop + plotH - (tick / maxVal) * plotH;
    const label = isCurrency 
      ? `$${(tick / 1000).toFixed(0)}k` 
      : tick.toFixed(0);
    gridHTML += `
      <line x1="${padLeft}" y1="${y}" x2="${width - padRight}" y2="${y}" stroke="rgba(255, 255, 255, 0.15)" stroke-width="0.5" stroke-dasharray="2 2" />
      <text x="${padLeft - 4}" y="${y + 2.5}" fill="#cbd5e1" font-size="6.5" font-family="sans-serif" text-anchor="end">${label}</text>
    `;
  });

  let pathsHTML = '';
  const yearsCount = data.length - 1;

  series.forEach(s => {
    let points: string[] = [];
    data.forEach((d, yearIdx) => {
      const val = d[s.key] || 0;
      const x = padLeft + (yearIdx / yearsCount) * plotW;
      const y = padTop + plotH - (val / maxVal) * plotH;
      points.push(`${x},${y}`);
    });
    const dAttr = `M ${points.join(' L ')}`;
    pathsHTML += `
      <path d="${dAttr}" fill="none" stroke="${s.color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    `;
  });

  gridHTML += `
    <line x1="${padLeft}" y1="${padTop + plotH}" x2="${width - padRight}" y2="${padTop + plotH}" stroke="rgba(255, 255, 255, 0.3)" stroke-width="0.5" />
    <text x="${padLeft}" y="${height - 4}" fill="#cbd5e1" font-size="6.5" font-family="sans-serif" text-anchor="start">Año 0</text>
    <text x="${width - padRight}" y="${height - 4}" fill="#cbd5e1" font-size="6.5" font-family="sans-serif" text-anchor="end">Año ${yearsCount}</text>
  `;

  let legendHTML = '';
  series.forEach((s, idx) => {
    const legX = width - padRight - (series.length - idx) * 35;
    legendHTML += `
      <rect x="${legX}" y="4" width="4" height="4" fill="${s.color}" rx="1" />
      <text x="${legX + 6}" y="7.5" fill="#94a3b8" font-size="5.5" font-family="sans-serif" font-weight="bold">${s.name.substring(0, 8)}</text>
    `;
  });

  return `
    <div style="font-weight: bold; color: white; font-size: 8.5px; margin-bottom: 2px; text-align: center; font-family: sans-serif;">${title}</div>
    <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" style="overflow: visible;">
      ${legendHTML}
      ${gridHTML}
      ${pathsHTML}
    </svg>
  `;
}

function generateSvgBarChart(
  title: string,
  data: Array<{ name: string; value: number; color: string }>
): string {
  const width = 230;
  const height = 120;
  const padLeft = 38;
  const padBottom = 16;
  const padTop = 15;
  const padRight = 8;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const maxVal = Math.max(...data.map(d => d.value), 1);
  const barWidth = 20;
  const gap = (plotW - data.length * barWidth) / (data.length + 1);

  let gridHTML = `
    <line x1="${padLeft}" y1="${padTop + plotH}" x2="${width - padRight}" y2="${padTop + plotH}" stroke="rgba(255, 255, 255, 0.3)" stroke-width="0.5" />
  `;

  const ticksY = [0, maxVal / 2, maxVal];
  ticksY.forEach(tick => {
    const y = padTop + plotH - (tick / maxVal) * plotH;
    gridHTML += `
      <line x1="${padLeft}" y1="${y}" x2="${width - padRight}" y2="${y}" stroke="rgba(255, 255, 255, 0.15)" stroke-width="0.5" stroke-dasharray="2 2" />
      <text x="${padLeft - 4}" y="${y + 2.5}" fill="#cbd5e1" font-size="6.5" font-family="sans-serif" text-anchor="end">$${(tick / 1000).toFixed(0)}k</text>
    `;
  });

  let barsHTML = '';
  data.forEach((d, idx) => {
    const x = padLeft + gap + idx * (barWidth + gap);
    const barH = (d.value / maxVal) * plotH;
    const y = padTop + plotH - barH;

    barsHTML += `
      <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" fill="${d.color}" rx="2" ry="2" />
      <text x="${x + barWidth / 2}" y="${height - 4}" fill="#cbd5e1" font-size="6" font-family="sans-serif" text-anchor="middle">${d.name.substring(0, 10)}</text>
      <text x="${x + barWidth / 2}" y="${y - 3}" fill="white" font-weight="bold" font-size="6.5" font-family="sans-serif" text-anchor="middle">$${(d.value / 1000).toFixed(0)}k</text>
    `;
  });

  return `
    <div style="font-weight: bold; color: white; font-size: 8.5px; margin-bottom: 2px; text-align: center; font-family: sans-serif;">${title}</div>
    <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" style="overflow: visible;">
      ${gridHTML}
      ${barsHTML}
    </svg>
  `;
}

function generateSvgStackedBarChart(
  title: string,
  data: Array<{ name: string; value: number; color: string }>
): string {
  const width = 230;
  const height = 120;
  
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return '';

  const barY = 22;
  const barHeight = 15;
  const barWidth = 190;
  const padLeft = 20;

  let currentX = padLeft;
  let rectsHTML = '';
  let legendHTML = '';

  data.forEach((d, idx) => {
    const segmentW = (d.value / total) * barWidth;
    const pct = ((d.value / total) * 100).toFixed(0);

    rectsHTML += `
      <rect x="${currentX}" y="${barY}" width="${segmentW}" height="${barHeight}" fill="${d.color}" />
      ${segmentW > 15 ? `<text x="${currentX + segmentW / 2}" y="${barY + 10}" fill="white" font-weight="bold" font-size="7" font-family="sans-serif" text-anchor="middle">${pct}%</text>` : ''}
    `;

    const legY = 48 + idx * 11;
    legendHTML += `
      <rect x="${padLeft}" y="${legY}" width="6" height="6" fill="${d.color}" rx="1" />
      <text x="${padLeft + 10}" y="${legY + 5.5}" fill="#cbd5e1" font-size="7" font-family="sans-serif">${d.name}: <tspan fill="white" font-weight="bold">$${(d.value / 1000).toFixed(0)}k</tspan></text>
    `;

    currentX += segmentW;
  });

  return `
    <div style="font-weight: bold; color: white; font-size: 8.5px; margin-bottom: 2px; text-align: center; font-family: sans-serif;">${title}</div>
    <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" style="overflow: visible;">
      <g clip-path="url(#bar-clip-report)">
        ${rectsHTML}
      </g>
      <clipPath id="bar-clip-report">
        <rect x="${padLeft}" y="${barY}" width="${barWidth}" height="${barHeight}" rx="3" ry="3" />
      </clipPath>
      ${legendHTML}
    </svg>
  `;
}

function generateChartsGridPageHTML(
  investment: any,
  results: any,
  format: (value: number) => string,
  initialInvestment: number,
  scenarioName: string,
  actualRoi: string
): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const isReinvest = investment.reinvestProfits;
  const finalYear = results.yearlyData[results.yearlyData.length - 1];
  if (!finalYear) return '';

  const convertValue = (val: number) => {
    return convertFromMXN(val, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR);
  };

  const patrimonyChartData = [
    {
      year: 0,
      ridermex: convertValue(initialInvestment),
      cetes: convertValue(initialInvestment),
      ahorro: convertValue(initialInvestment),
      bienesRaices: convertValue(initialInvestment)
    },
    ...results.yearlyData.map((year: any) => ({
      year: year.year,
      ridermex: convertValue(year.citrusPatrimony),
      cetes: convertValue(isReinvest ? year.cetesPatrimony : initialInvestment),
      ahorro: convertValue(isReinvest ? year.savingsPatrimony : initialInvestment),
      bienesRaices: convertValue(isReinvest ? year.realEstatePatrimony : initialInvestment * Math.pow(1.05, year.year))
    }))
  ];

  const incomeChartData = results.yearlyData.map((year: any) => ({
    year: year.year,
    ridermex: convertValue(year.citrusIncome),
    cetes: convertValue(year.cetesIncome),
    ahorro: convertValue(year.savingsIncome),
    bienesRaices: convertValue(year.realEstateIncome)
  }));

  let cumulativeCashOut = 0;
  let cumulativeCetesIncome = 0;
  let cumulativeSavingsIncome = 0;
  let cumulativeRealEstateIncome = 0;

  const accumulatedWealthChartData = [
    {
      year: 0,
      ridermex: convertValue(initialInvestment),
      cetes: convertValue(initialInvestment),
      ahorro: convertValue(initialInvestment),
      bienesRaices: convertValue(initialInvestment)
    },
    ...results.yearlyData.map((year: any) => {
      cumulativeCashOut += year.partialCashOutAmount || 0;
      cumulativeCetesIncome += year.cetesIncome || 0;
      cumulativeSavingsIncome += year.savingsIncome || 0;
      cumulativeRealEstateIncome += year.realEstateIncome || 0;

      const ridermexWealth = year.citrusPatrimony + year.availableCashFlow + cumulativeCashOut;
      const cetesWealth = isReinvest ? year.cetesPatrimony : initialInvestment + cumulativeCetesIncome;
      const savingsWealth = isReinvest ? year.savingsPatrimony : initialInvestment + cumulativeSavingsIncome;
      const bienesRaicesWealth = isReinvest ? year.realEstatePatrimony : (initialInvestment * Math.pow(1.05, year.year)) + cumulativeRealEstateIncome;

      return {
        year: year.year,
        ridermex: convertValue(ridermexWealth),
        cetes: convertValue(cetesWealth),
        ahorro: convertValue(savingsWealth),
        bienesRaices: convertValue(bienesRaicesWealth)
      };
    })
  ];

  const comparisonData = [
    { name: 'Costo Ticket', value: convertValue(initialInvestment), color: '#007aff' },
    { name: 'Plusvalía', value: convertValue(Math.max(0, finalYear.citrusPatrimony - initialInvestment)), color: '#0dfc7b' },
    { name: 'Ingresos Acum.', value: convertValue(finalYear.cumulativeTotalUtility), color: '#ff9f0a' }
  ];

  const growthData = [
    { name: 'Costo Inicial', value: convertValue(initialInvestment), color: '#007aff' },
    { name: 'Plusvalía Final', value: convertValue(Math.max(0, finalYear.citrusPatrimony - initialInvestment)), color: '#0dfc7b' },
    { name: 'Ingresos Acumulados', value: convertValue(finalYear.cumulativeTotalUtility), color: '#ff9f0a' }
  ].filter(item => item.value > 0);

  const series = [
    { key: 'ridermex', name: 'RiderMex', color: '#0dfc7b' },
    { key: 'cetes', name: 'CETES', color: '#ff453a' },
    { key: 'ahorro', name: 'Ahorro', color: '#bf5af2' },
    { key: 'bienesRaices', name: 'B. Raíces', color: '#00e5ff' }
  ];

  const chart1HTML = generateSvgLineChart('Evolución del Patrimonio ($)', patrimonyChartData, series);
  const chart2HTML = generateSvgLineChart('Evolución de Ingresos Anuales ($)', incomeChartData, series);
  const chart3HTML = generateSvgLineChart('Retorno Total Acumulado ($)', accumulatedWealthChartData, series);
  const chart4HTML = generateSvgBarChart('Comparación de Resultados Finales ($)', comparisonData);
  const chart5HTML = generateSvgStackedBarChart('Crecimiento y Composición de Capital', growthData);

  return `
    <div class="pdf-page" style="page-break-after: always; padding: 25px; box-sizing: border-box; background: #000000; position: relative;">
      <!-- Watermark / Brand Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #dc2626; padding-bottom: 6px; margin-bottom: 15px; z-index: 10; position: relative;">
        <div style="font-size: 14px; font-weight: bold; color: white; letter-spacing: 0.5px; font-family: sans-serif;">RIDERMEX <span style="color: #0dfc7b; font-size: 10px; font-weight: 500;">| DASHBOARD DE RENDIMIENTO</span></div>
        <div style="font-size: 8px; color: #cbd5e1; font-family: sans-serif; font-weight: bold;">Horizonte: ${investment.years} años (${scenarioName})</div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; z-index: 10; position: relative;">
        <!-- Card 1: Patrimony -->
        <div style="position: relative; background: rgba(17, 24, 39, 0.85); border: 1px solid #dc2626; border-radius: 10px; padding: 10px; overflow: hidden; height: 195px; box-sizing: border-box;">
          <div style="position: absolute; inset: 0; background-image: url('${origin}/ridermex_sport_bike.png'); background-size: cover; background-position: center; opacity: 0.15; z-index: 1;"></div>
          <div style="position: relative; z-index: 2; height: 100%;">
            ${chart1HTML}
          </div>
        </div>

        <!-- Card 2: Income -->
        <div style="position: relative; background: rgba(17, 24, 39, 0.85); border: 1px solid #dc2626; border-radius: 10px; padding: 10px; overflow: hidden; height: 195px; box-sizing: border-box;">
          <div style="position: absolute; inset: 0; background-image: url('${origin}/ridermex_scooter_delivery.png'); background-size: cover; background-position: center; opacity: 0.15; z-index: 1;"></div>
          <div style="position: relative; z-index: 2; height: 100%;">
            ${chart2HTML}
          </div>
        </div>

        <!-- Card 3: Wealth -->
        <div style="position: relative; background: rgba(17, 24, 39, 0.85); border: 1px solid #dc2626; border-radius: 10px; padding: 10px; overflow: hidden; height: 195px; box-sizing: border-box;">
          <div style="position: absolute; inset: 0; background-image: url('${origin}/ridermex_investor_concept.png'); background-size: cover; background-position: center; opacity: 0.15; z-index: 1;"></div>
          <div style="position: relative; z-index: 2; height: 100%;">
            ${chart3HTML}
          </div>
        </div>

        <!-- Card 4: Final comparison -->
        <div style="position: relative; background: rgba(17, 24, 39, 0.85); border: 1px solid #dc2626; border-radius: 10px; padding: 10px; overflow: hidden; height: 195px; box-sizing: border-box;">
          <div style="position: absolute; inset: 0; background-image: url('${origin}/ridermex_store_interior.png'); background-size: cover; background-position: center; opacity: 0.15; z-index: 1;"></div>
          <div style="position: relative; z-index: 2; height: 100%;">
            ${chart4HTML}
          </div>
        </div>

        <!-- Card 5: Capital growth stacked -->
        <div style="position: relative; background: rgba(17, 24, 39, 0.85); border: 1px solid #dc2626; border-radius: 10px; padding: 10px; overflow: hidden; height: 195px; box-sizing: border-box;">
          <div style="position: absolute; inset: 0; background-image: url('${origin}/ridermex_store_front.png'); background-size: cover; background-position: center; opacity: 0.15; z-index: 1;"></div>
          <div style="position: relative; z-index: 2; height: 100%;">
            ${chart5HTML}
          </div>
        </div>

        <!-- Card 6: Resumen de Retorno (Key metrics card) -->
        <div style="position: relative; background: rgba(17, 24, 39, 0.85); border: 1px solid #dc2626; border-radius: 10px; padding: 10px; overflow: hidden; height: 195px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; box-sizing: border-box;">
          <div style="position: absolute; inset: 0; background-image: url('${origin}/ridermex_delivery_fleet.png'); background-size: cover; background-position: center; opacity: 0.15; z-index: 1;"></div>
          <div style="position: relative; z-index: 2; width: 100%; font-family: sans-serif;">
            <div style="font-weight: bold; color: #0dfc7b; font-size: 8.5px; margin-bottom: 8px; text-transform: uppercase;">Métricas de Retorno</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div>
                <div style="font-size: 6.5px; color: #cbd5e1;">CAGR</div>
                <div style="font-size: 11px; font-weight: bold; color: white;">${results.cagr.toFixed(1)}%</div>
              </div>
              <div>
                <div style="font-size: 6.5px; color: #cbd5e1;">TIR</div>
                <div style="font-size: 11px; font-weight: bold; color: white;">${results.irr.toFixed(1)}%</div>
              </div>
              <div>
                <div style="font-size: 6.5px; color: #cbd5e1;">ROI</div>
                <div style="font-size: 11px; font-weight: bold; color: white;">${results.roi.toFixed(1)}%</div>
              </div>
              <div>
                <div style="font-size: 6.5px; color: #cbd5e1;">Payback</div>
                <div style="font-size: 11px; font-weight: bold; color: white;">${typeof results.paybackYear === 'number' ? results.paybackYear.toFixed(2) : 'N/A'} a</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export interface ReportOptions {
  advisorName: string;
  advisorPhone: string;
  advisorEmail: string;
  clientName?: string;
  downPaymentPercent?: number;
  annualInterestRate?: number;
}

function getRidermexScenarioName(scenario: string): string {
  const names: Record<string, string> = {
    conservative: 'Conservador',
    moderate: 'Moderado',
    optimistic: 'Optimista'
  };
  return names[scenario] || 'Moderado';
}

function getRidermexProductLabel(type: string): string {
  const labels: Record<string, string> = {
    A: 'Modelo A - Contado Tradicional',
    B: 'Modelo B - Financiado 12m',
    C: 'Modelo C - Agencia Madura',
    D: 'Modelo D - Financiado Flexible 48m'
  };
  return labels[type] || 'Modelo B';
}

export function generateRidermexCompleteReport(
  investment: Investment,
  results: InvestmentResults,
  options: ReportOptions
): string {
  const scenario = investment.ridermexScenario || 'moderate';
  const scenarioName = getRidermexScenarioName(scenario);
  const scenarioConfig = RIDERMEX_CONFIG.SCENARIOS[scenario];
  const productType = investment.ridermexProductType || 'B';
  const productTypeLabel = getRidermexProductLabel(productType);

  const currentDate = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const initialInvestment = investment.initialCertificates * investment.certificateBasePrice;
  const certificateEvolution = results.certificateEvolution || getDetailedCertificateEvolution(investment);
  const returnPercentage = results.roi.toFixed(1);
  const actualRoi = investment.certificateBasePrice > 0 
    ? ((scenarioConfig.annualReturnPerTicket / investment.certificateBasePrice) * 100).toFixed(1) 
    : '0';
  const scenarioBaseRoi = ((scenarioConfig.annualReturnPerTicket / 100000) * 100).toFixed(1);

  const format = (value: number) => {
    return formatCurrency(
      convertFromMXN(value, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR),
      investment.currencyFormat
    );
  };

  const totalInvestmentConverted = convertFromMXN(
    initialInvestment,
    investment.currencyFormat,
    investment.exchangeRate,
    investment.exchangeRateEUR
  );

  const currentEscalon = investment.ridermexEscalon || 1;

  const generateMilestoneRows = () => {
    const firstAppreciationPatrimony = investment.initialCertificates * 100000;
    const secondAppreciationPatrimony = investment.initialCertificates * 120000;
    const finalYearData = certificateEvolution[certificateEvolution.length - 1];
    
    const rows = [
      {
        label: '1ª Plusvalía (Escalón 7)',
        tickets: investment.initialCertificates,
        patrimony: firstAppreciationPatrimony,
        monthlyIncome: 0,
        multiplier: 100000 / investment.certificateBasePrice,
        isBold: false,
        rowBg: '#ffffff',
        textColor: '#1f2937'
      },
      {
        label: '2ª Plusvalía (Agencia Madura)',
        tickets: investment.initialCertificates,
        patrimony: secondAppreciationPatrimony,
        monthlyIncome: (investment.initialCertificates * scenarioConfig.annualReturnPerTicket) / 12,
        multiplier: 120000 / investment.certificateBasePrice,
        isBold: false,
        rowBg: '#f8fafc',
        textColor: '#1f2937'
      },
      {
        label: `Rendimiento Acumulado (Año ${investment.years})`,
        tickets: finalYearData ? (investment.initialCertificates + (finalYearData.certificatesFromReinvestment || 0)) : investment.initialCertificates,
        patrimony: results.finalPatrimony,
        monthlyIncome: results.finalMonthlyIncome,
        multiplier: results.capitalMultiplier,
        isBold: true,
        rowBg: '#fef2f2',
        textColor: '#dc2626'
      }
    ];

    return rows.map(r => {
      return `
        <tr style="background: ${r.rowBg}; ${r.isBold ? 'font-weight: bold; border-left: 4px solid #dc2626;' : ''}">
          <td style="padding: 10px 8px; border: 1px solid #e2e8f0; font-weight: 600; text-align: center; color: ${r.textColor};">${r.label}</td>
          <td style="padding: 10px 8px; border: 1px solid #e2e8f0; text-align: center; color: #1f2937;">${Math.round(r.tickets)}</td>
          <td style="padding: 10px 8px; border: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: ${r.textColor};">${format(r.patrimony)}</td>
          <td style="padding: 10px 8px; border: 1px solid #e2e8f0; text-align: right; color: #16a34a;">${r.monthlyIncome > 0 ? format(r.monthlyIncome) : '$0'}</td>
          <td style="padding: 10px 8px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold; color: #dc2626;">${r.multiplier.toFixed(1)}x</td>
        </tr>
      `;
    }).join('');
  };

  const generateEscalonesRows = () => {
    return ESCALONES.map((esc) => {
      const isCurrentEscalon = esc.number === currentEscalon;
      const annualReturnEst = esc.annualReturn;
      const quarterlyReturnEst = esc.quarterlyReturn;
      const rowBg = isCurrentEscalon ? '#fffbeb' : (esc.number % 2 === 0 ? '#ffffff' : '#f8fafc');
      const borderStyle = isCurrentEscalon ? 'border-left: 4px solid #f59e0b;' : '';
      const highlightStyle = isCurrentEscalon ? 'font-weight: 700; color: #b45309;' : '';

      return `
        <tr style="background: ${rowBg}; border-bottom: 1px solid #e2e8f0; ${borderStyle}">
          <td style="padding: 8px 6px; border: 1px solid #e2e8f0; text-align: center; ${highlightStyle}">
            <span style="font-size: 11px; font-weight: 700; color: ${isCurrentEscalon ? '#b45309' : '#1f2937'};">${esc.number}</span>
            ${isCurrentEscalon ? '<div style="font-size: 7px; color: #d97706; margin-top: 1px; text-transform: uppercase;">Tu Escalón</div>' : ''}
          </td>
          <td style="padding: 8px 6px; border: 1px solid #e2e8f0; text-align: center; color: ${isCurrentEscalon ? '#b45309' : '#4b5563'}; font-weight: ${isCurrentEscalon ? '700' : '500'}; font-size: 10px;">${esc.name}</td>
          <td style="padding: 8px 6px; border: 1px solid #e2e8f0; text-align: right; color: ${isCurrentEscalon ? '#b45309' : '#1f2937'}; font-weight: 600; font-size: 10px;">${format(esc.entryPrice)}</td>
          <td style="padding: 8px 6px; border: 1px solid #e2e8f0; text-align: center; color: ${isCurrentEscalon ? '#b45309' : '#16a34a'}; font-weight: 700; font-size: 11px;">${esc.roi}%</td>
          <td style="padding: 8px 6px; border: 1px solid #e2e8f0; text-align: right; color: ${isCurrentEscalon ? '#b45309' : '#16a34a'}; font-weight: 600; font-size: 10px;">${format(annualReturnEst)}</td>
          <td style="padding: 8px 6px; border: 1px solid #e2e8f0; text-align: right; color: ${isCurrentEscalon ? '#b45309' : '#4b5563'}; font-size: 10px;">${format(quarterlyReturnEst)}</td>
        </tr>
      `;
    }).join('');
  };

  const generateDetailedTablePage = (startIndex: number, endIndex: number, pageNum: number, totalPages: number) => {
    const chunk = certificateEvolution.slice(startIndex, endIndex);
    if (chunk.length === 0) return '';

    const rowsHTML = chunk.map((yearData, i) => {
      const globalIndex = startIndex + i;
      const tickets = investment.initialCertificates + (yearData.certificatesFromReinvestment || 0);
      const ticketsInt = Math.floor(tickets);
      const annualIncome = yearData.citrusIncome || 0;
      const reinvestmentFund = yearData.reinvestmentFund || 0;
      const saldoDisponible = yearData.availableForReinvestment || 0;
      const certPrice = yearData.certificatePrice || investment.certificateBasePrice;

      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() + 1);
      const yearDate = new Date(startDate);
      yearDate.setFullYear(yearDate.getFullYear() + globalIndex);
      const dateStr = yearDate.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });

      const totalCertsValue = certPrice * ticketsInt;

      const generateTicketVisual = () => {
        if (ticketsInt <= 0) return '';
        const maxShow = Math.min(ticketsInt, 30);
        let html = '<div style="display: flex; flex-wrap: wrap; gap: 2px; margin-top: 4px;">';
        for (let idx = 0; idx < maxShow; idx++) {
          const isFromReinvestment = idx >= investment.initialCertificates;
          const bgColor = isFromReinvestment ? '#f59e0b' : '#dc2626';
          html += `<div style="width: 14px; height: 14px; border-radius: 2px; background: ${bgColor}; color: white; font-size: 6px; display: flex; align-items: center; justify-content: center; font-weight: bold;">${idx + 1}</div>`;
        }
        if (ticketsInt > maxShow) {
          html += `<div style="font-size: 9px; color: #6b7280; padding: 2px;">+${ticketsInt - maxShow}</div>`;
        }
        html += '</div>';
        return html;
      };

      const generateEvents = () => {
        const events: string[] = [];
        if (yearData.certificatesFromReinvestment > 0) {
          const prevReinv = globalIndex > 0 ? (certificateEvolution[globalIndex - 1]?.certificatesFromReinvestment || 0) : 0;
          const newCerts = (yearData.certificatesFromReinvestment || 0) - prevReinv;
          if (newCerts > 0) {
            for (let idx = 0; idx < Math.min(newCerts, 3); idx++) {
              events.push(`Ticket ${investment.initialCertificates + (yearData.certificatesFromReinvestment || 0) - newCerts + idx + 1} liquidado`);
            }
            if (newCerts > 3) events.push(`...y ${newCerts - 3} más`);
          }
        }
        if (annualIncome > 0 && globalIndex > 0) {
          events.push(`Pago madurando Año ${yearData.year}`);
        }
        return events.length > 0
          ? events.map(e => `<div style="font-size: 8px; color: #4b5563; line-height: 1.2; margin-bottom: 2px;">${e}</div>`).join('')
          : '<div style="font-size: 8px; color: #9ca3af;">-</div>';
      };

      const rowBg = globalIndex % 2 === 0 ? '#ffffff' : '#f8fafc';

      return `
        <tr style="background: ${rowBg}; border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 6px 4px; border: 1px solid #e2e8f0; font-weight: 600; text-align: center; font-size: 10px; color: #1f2937;">${yearData.year}</td>
          <td style="padding: 6px 4px; border: 1px solid #e2e8f0; text-align: center; font-size: 10px; white-space: nowrap; color: #4b5563;">${dateStr}</td>
          <td style="padding: 6px 4px; border: 1px solid #e2e8f0; text-align: right; font-size: 10px; color: #4b5563;">${format(certPrice)}</td>
          <td style="padding: 6px 4px; border: 1px solid #e2e8f0; text-align: right; font-size: 10px; font-weight: 600; color: #dc2626;">${format(totalCertsValue)}</td>
          <td style="padding: 6px 4px; border: 1px solid #e2e8f0; min-width: 90px;">
            <div style="font-weight: 600; color: #1f2937; font-size: 10px; text-align: center;">${ticketsInt}</div>
            ${generateTicketVisual()}
          </td>
          <td style="padding: 6px 4px; border: 1px solid #e2e8f0; text-align: right; font-size: 10px; color: ${annualIncome > 0 ? '#16a34a' : '#9ca3af'}; font-weight: ${annualIncome > 0 ? '600' : '400'};">${format(annualIncome)}</td>
          <td style="padding: 6px 4px; border: 1px solid #e2e8f0; text-align: right; font-size: 10px; color: #0891b2;">${format(reinvestmentFund)}</td>
          <td style="padding: 6px 4px; border: 1px solid #e2e8f0; text-align: right; font-size: 10px; color: #4b5563;">${format(saldoDisponible)}</td>
          <td style="padding: 6px 4px; border: 1px solid #e2e8f0; font-size: 8px; min-width: 100px;">${generateEvents()}</td>
        </tr>
      `;
    }).join('');

    return `
      <div class="pdf-page">
        <div class="pdf-sidebar"></div>
        <div class="section-title">Evolución Detallada de Tickets (Página ${pageNum} de ${totalPages})</div>
        
        <div class="scenario-banner" style="margin-bottom: 12px; background: #f0fdf4; border-color: #22c55e; padding: 10px; border-radius: 8px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <strong style="font-size: 11px; color: #1f2937;">Escenario de Producción: ${scenarioName}</strong>
          </div>
          <div style="font-size: 9px; color: #4b5563; margin-bottom: 4px;">Los cálculos reflejan la proyección estimada basada en datos operativos de producción</div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <span style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.2); padding: 2px 6px; border-radius: 4px; font-size: 9px; color: #4b5563;">Motos/año: <strong style="color: #16a34a;">${scenarioConfig.motorcyclesPerYear}</strong></span>
            <span style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.2); padding: 2px 6px; border-radius: 4px; font-size: 9px; color: #4b5563;">Retorno est.: <strong style="color: #16a34a;">$${scenarioConfig.annualReturnPerTicket.toLocaleString()}/año</strong></span>
          </div>
        </div>

        <div class="table-container" style="border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; background: white;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead style="background: linear-gradient(135deg, #dc2626, #991b1b); color: white;">
              <tr>
                <th style="font-size: 9px; padding: 6px 4px; font-weight: 600;">Año</th>
                <th style="font-size: 9px; padding: 6px 4px; font-weight: 600;">Fecha</th>
                <th style="font-size: 9px; padding: 6px 4px; font-weight: 600;">Precio Cert.</th>
                <th style="font-size: 9px; padding: 6px 4px; font-weight: 600;">Valor Total Certs.</th>
                <th style="font-size: 9px; padding: 6px 4px; font-weight: 600;">Tickets</th>
                <th style="font-size: 9px; padding: 6px 4px; font-weight: 600;">Utilidad Estimada</th>
                <th style="font-size: 9px; padding: 6px 4px; font-weight: 600;">Fondo Reinversión</th>
                <th style="font-size: 9px; padding: 6px 4px; font-weight: 600;">Saldo Disponible</th>
                <th style="font-size: 9px; padding: 6px 4px; font-weight: 600;">Eventos</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHTML}
            </tbody>
          </table>
        </div>
      </div>
    `;
  };

  const generateDetailedTablePages = () => {
    const dataToUse = certificateEvolution;
    const pagesCount = Math.ceil(dataToUse.length / 15);
    let html = '';
    for (let p = 0; p < pagesCount; p++) {
      html += generateDetailedTablePage(p * 15, (p + 1) * 15, p + 1, pagesCount);
    }
    return html;
  };

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Análisis Completo de Inversión - RiderMex</title>
      <style>
        @page {
          size: letter portrait;
          margin: 0;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
          font-size: 11px;
          line-height: 1.4;
          color: #1f2937;
          background: #111827;
          padding: 0;
          margin: 0;
        }
        .pdf-page {
          width: 215.9mm;
          height: 279.4mm;
          padding: 20mm 15mm 20mm 65mm;
          margin: 0 auto;
          background-color: white;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          position: relative;
          page-break-after: always;
          box-sizing: border-box;
          overflow: hidden;
        }
        .pdf-sidebar {
          position: absolute;
          top: 0;
          left: 0;
          width: 55mm;
          height: 279.4mm;
          z-index: 1;
          background-image: url('${RIDERMEX_LETTERHEAD_BASE64}');
          background-size: 100% 100%;
          background-repeat: no-repeat;
          background-position: center;
        }
        .pdf-page:last-child {
          margin-bottom: 0;
          page-break-after: avoid;
        }
        .header {
          background: transparent !important;
          color: #1f2937 !important;
          padding: 10px 0 20px 0;
          text-align: center;
          border-bottom: 2px solid #dc2626;
          margin-bottom: 20px;
          position: relative;
        }
        .header h1 {
          font-size: 2.4em;
          color: #dc2626;
          margin-bottom: 4px;
          font-weight: 800;
        }
        .header .subtitle {
          font-size: 1.2em;
          color: #4b5563;
          font-weight: 500;
        }
        .header .product-badge {
          display: inline-block;
          background: rgba(220, 38, 38, 0.08);
          color: #dc2626;
          padding: 4px 14px;
          border-radius: 20px;
          margin-top: 10px;
          font-weight: 600;
          border: 1px solid rgba(220, 38, 38, 0.2);
          font-size: 10px;
        }
        .header .date {
          font-size: 10px;
          color: #6b7280;
          margin-top: 6px;
        }
        .section-title {
          font-size: 1.4em;
          font-weight: bold;
          color: #dc2626;
          margin-bottom: 12px;
          padding-bottom: 4px;
          border-bottom: 2px solid #e2e8f0;
          text-align: left;
        }
        .advisor-section {
          background: #f8fafc;
          border-radius: 8px;
          padding: 15px;
          border: 1px solid #e2e8f0;
        }
        .advisor-section h3 {
          font-size: 11px;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #4b5563;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 4px;
        }
        .advisor-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        .advisor-item {
          background: white;
          padding: 8px;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }
        .advisor-label { font-size: 8px; color: #6b7280; margin-bottom: 2px; }
        .advisor-value { font-size: 10px; font-weight: 600; color: #1f2937; }

        .executive-summary {
          background: #fdf2f2;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #fca5a5;
        }
        .exec-title {
          font-size: 14px;
          font-weight: bold;
          color: #dc2626;
          text-align: center;
        }
        .exec-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .exec-card {
          background: white;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #fca5a5;
          text-align: center;
        }
        .exec-number { font-size: 16px; font-weight: 800; color: #dc2626; margin-bottom: 2px; }
        .exec-label { font-size: 9px; font-weight: 600; color: #1f2937; }
        .exec-desc { font-size: 8px; color: #6b7280; }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .table-container {
          overflow-x: auto;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }
        table { width: 100%; border-collapse: collapse; background: white; }
        th {
          background: linear-gradient(135deg, #dc2626, #991b1b);
          color: white;
          padding: 8px 6px;
          text-align: center;
          font-weight: 600;
          font-size: 9px;
        }
        td {
          padding: 8px 6px;
          text-align: center;
          border-bottom: 1px solid #e2e8f0;
          font-size: 10px;
          color: #4b5563;
        }
        .print-button {
          position: fixed;
          top: 20px; right: 20px;
          background: #dc2626;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
          z-index: 1000;
        }
        .print-button:hover { background: #b91c1c; }

        /* Rating Section Overrides */
        .pdf-page .rating-section {
          background: transparent !important;
          color: #1f2937 !important;
          border: none !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .pdf-page .rating-section h2 {
          color: #dc2626 !important;
          border-bottom: 2px solid #dc2626 !important;
          font-size: 1.4em !important;
          margin-bottom: 15px !important;
        }
        .pdf-page .rating-section p {
          color: #4b5563 !important;
          font-size: 9px !important;
          margin-bottom: 15px !important;
        }
        .pdf-page .rating-section h4 {
          color: #1f2937 !important;
          font-size: 11px !important;
          margin-bottom: 8px !important;
        }
        .pdf-page .rating-section table {
          background: white !important;
          border: 1px solid #e2e8f0 !important;
        }
        .pdf-page .rating-section table th {
          background: linear-gradient(135deg, #dc2626, #991b1b) !important;
          color: white !important;
          font-size: 9px !important;
          padding: 8px 4px !important;
        }
        .pdf-page .rating-section table td {
          color: #4b5563 !important;
          border-bottom: 1px solid #e2e8f0 !important;
          font-size: 9px !important;
          padding: 6px 4px !important;
        }
        .pdf-page .rating-section table td span {
          color: #1f2937 !important;
        }
        .pdf-page .rating-score-box {
          background: #f8fafc !important;
          border: 2px solid #06b6d4 !important;
          padding: 20px 40px !important;
          border-radius: 12px !important;
          margin-bottom: 20px !important;
        }
        .pdf-page .rating-score-box div {
          color: #1f2937 !important;
        }
        .pdf-page .rating-score-box span {
          color: #0891b2 !important;
        }
        .pdf-page .rating-score-box p {
          color: #4b5563 !important;
          font-size: 9px !important;
        }
        .pdf-page .rating-score-box strong {
          color: #1f2937 !important;
        }
        .pdf-page .rating-score-box div[style*="background: #1a1a2e"] {
          background: white !important;
          border-color: #e5e7eb !important;
          padding: 8px !important;
        }
        .pdf-page .rating-card {
          background: white !important;
          border: 1px solid #e2e8f0 !important;
          padding: 10px 15px !important;
          margin-bottom: 8px !important;
          border-radius: 8px !important;
        }
        .pdf-page .rating-card div {
          color: #1f2937 !important;
        }
        .pdf-page .rating-card span {
          color: #4b5563 !important;
        }
        .pdf-page .rating-notes {
          background: #fffbeb !important;
          border: 1px solid #f59e0b !important;
          padding: 10px 15px !important;
          border-radius: 8px !important;
        }
        .pdf-page .rating-notes h5 {
          color: #d97706 !important;
          font-size: 10px !important;
          margin-bottom: 4px !important;
        }
        .pdf-page .rating-notes ul, .pdf-page .rating-notes li {
          color: #b45309 !important;
          font-size: 9px !important;
        }

        /* Financing Plan Styles */
        .financing-page-wrapper {
          color: #1f2937;
        }
        .financing-summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 12px;
        }
        .financing-summary-card {
          text-align: center;
          background: #f8fafc;
          border-radius: 6px;
          padding: 8px;
          border: 1px solid #e2e8f0;
        }
        .financing-summary-card.primary { border-top: 3px solid #dc2626; }
        .financing-summary-card.success { border-top: 3px solid #16a34a; }
        .financing-summary-card.info { border-top: 3px solid #0891b2; }
        .financing-summary-card .label {
          font-size: 8px;
          color: #6b7280;
          margin-bottom: 2px;
          font-weight: 600;
        }
        .financing-summary-card .value {
          font-size: 13px;
          font-weight: bold;
          color: #1f2937;
        }

        .financing-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 12px;
        }
        .financing-details-card {
          background: #f8fafc;
          border-radius: 6px;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
        }
        .financing-details-card.margin-green { border-left: 4px solid #16a34a; }
        .financing-details-card.margin-blue { border-left: 4px solid #0891b2; }
        .financing-details-card .label {
          font-size: 8px;
          color: #6b7280;
          margin-bottom: 2px;
          font-weight: 600;
        }
        .financing-details-card .value {
          font-size: 11px;
          font-weight: bold;
          color: #1f2937;
        }

        .financing-schedule-title {
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 6px;
          font-size: 11px;
        }
        .financing-table-container {
          overflow-x: auto;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          background: white;
        }
        .financing-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 9px;
        }
        .financing-table thead {
          background: linear-gradient(135deg, #475569, #334155);
          color: white;
        }
        .financing-table-row {
          border-bottom: 1px solid #e2e8f0;
          color: #4b5563;
        }
        .financing-table-row:nth-child(even) {
          background: #f8fafc;
        }
        .financing-table tfoot {
          background: linear-gradient(135deg, #475569, #334155);
          color: white;
        }

        .financing-columns-container {
          display: flex;
          gap: 8px;
          justify-content: space-between;
          align-items: start;
        }
        .financing-subtable-column {
          flex: 1;
          min-width: 0;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          overflow: hidden;
          background: white;
        }
        .financing-subtable {
          width: 100%;
          border-collapse: collapse;
          font-size: 9px;
        }
        .financing-subtable thead {
          background: linear-gradient(135deg, #475569, #334155);
          color: white;
        }

        .financing-total-container {
          background: #f8fafc;
          border-radius: 6px;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          margin-top: 10px;
        }
        .financing-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
          font-size: 9px;
          color: #4b5563;
        }
        .financing-total-row .value {
          font-weight: bold;
          color: #1f2937;
        }
        .financing-grand-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-radius: 6px;
          padding: 8px 12px;
          margin-top: 6px;
          color: white;
          border: 1px solid #2563eb;
        }
        .financing-grand-total .label {
          font-weight: bold;
          font-size: 11px;
        }
        .financing-grand-total .value {
          font-weight: bold;
          font-size: 14px;
        }

        .financing-note-box {
          background: #fffbeb;
          border-radius: 6px;
          padding: 8px 12px;
          border: 1px solid #f59e0b;
          border-left: 4px solid #f59e0b;
          margin-top: 10px;
        }
        .financing-note-box p {
          font-size: 9px;
          color: #b45309;
          line-height: 1.4;
          margin: 0;
        }

        @media print {
          body { background: transparent !important; padding: 0 !important; }
          .print-button { display: none; }
          .pdf-page { margin: 0 !important; box-shadow: none !important; page-break-after: always !important; }
          .pdf-page:last-child { page-break-after: avoid !important; }
        }
      </style>
    </head>
    <body>
      <button class="print-button" onclick="window.print()">Imprimir Reporte</button>

      <!-- PAGE 1: Cover and Executive Summary -->
      <div class="pdf-page">
        <div class="pdf-sidebar"></div>
        <div class="header">
          <h1>RiderMex</h1>
          <div class="subtitle">Análisis Completo de Inversión</div>
          <div class="product-badge">${productTypeLabel}</div>
          <div class="date">${currentDate}</div>
        </div>

        <div class="advisor-section" style="margin-top: 35px;">
          <h3>Información del Asesor</h3>
          <div class="advisor-grid">
            <div class="advisor-item">
              <div class="advisor-label">Nombre</div>
              <div class="advisor-value">${options.advisorName || 'No especificado'}</div>
            </div>
            <div class="advisor-item">
              <div class="advisor-label">Teléfono</div>
              <div class="advisor-value">${options.advisorPhone || 'No especificado'}</div>
            </div>
            <div class="advisor-item">
              <div class="advisor-label">Email</div>
              <div class="advisor-value">${options.advisorEmail || 'No especificado'}</div>
            </div>
            ${options.clientName ? `
              <div class="advisor-item">
                <div class="advisor-label">Cliente</div>
                <div class="advisor-value">${options.clientName}</div>
              </div>
            ` : ''}
          </div>
        </div>

        <div class="executive-summary" style="margin-top: 35px;">
          <div class="exec-title" style="margin-bottom: 20px;">Resumen Ejecutivo</div>
          <div class="exec-grid">
            <div class="exec-card">
              <div class="exec-number">${investment.initialCertificates}</div>
              <div class="exec-label">Tickets Iniciales</div>
              <div class="exec-desc">Inversión base</div>
            </div>
            <div class="exec-card">
              <div class="exec-number">${results.certificatesSummary.totalCertificates}</div>
              <div class="exec-label">Tickets Finales</div>
              <div class="exec-desc">Con reinversión</div>
            </div>
            <div class="exec-card">
              <div class="exec-number">${format(results.finalMonthlyIncome)}</div>
              <div class="exec-label">Ingreso Mensual</div>
              <div class="exec-desc">Al año ${investment.years}</div>
            </div>
            <div class="exec-card">
              <div class="exec-number">${results.capitalMultiplier.toFixed(1)}x</div>
              <div class="exec-label">Multiplicador</div>
              <div class="exec-desc">Crecimiento total</div>
            </div>
          </div>
        </div>
      </div>

      <!-- PAGE 2: Key Metrics & Investment Info -->
      <div class="pdf-page">
        <div class="pdf-sidebar"></div>
        <div class="section-title">Métricas Clave de Rendimiento Estimado</div>
        
        <div class="scenario-banner" style="background: #f0fdf4; border-color: #22c55e; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #22c55e; border-left-width: 4px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="background: rgba(34, 197, 94, 0.15); border: 1px solid #22c55e; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div style="flex: 1;">
              <div style="font-size: 14px; font-weight: 700; color: #1f2937;">Escenario: ${scenarioName}</div>
              <div style="font-size: 11px; color: #4b5563;">Proyección basada en datos operativos del modelo de negocio RiderMex</div>
              <div class="scenario-stats" style="margin-top: 6px; display: flex; gap: 10px;">
                <div class="scenario-stat" style="background: rgba(34, 197, 94, 0.08); border: 1px solid rgba(34, 197, 94, 0.15); padding: 3px 8px; border-radius: 4px; font-size: 10px; color: #4b5563;">
                  <span>Motos/año:</span>
                  <strong style="color: #16a34a;">${scenarioConfig.motorcyclesPerYear.toLocaleString()}</strong>
                </div>
                <div class="scenario-stat" style="background: rgba(34, 197, 94, 0.08); border: 1px solid rgba(34, 197, 94, 0.15); padding: 3px 8px; border-radius: 4px; font-size: 10px; color: #4b5563;">
                  <span>Retorno est./ticket:</span>
                  <strong style="color: #16a34a;">$${scenarioConfig.annualReturnPerTicket.toLocaleString()}/año</strong>
                </div>
                <div class="scenario-stat" style="background: rgba(34, 197, 94, 0.08); border: 1px solid rgba(34, 197, 94, 0.15); padding: 3px 8px; border-radius: 4px; font-size: 10px; color: #4b5563;">
                  <span>ROI estimado:</span>
                  <strong style="color: #16a34a;">${scenarioBaseRoi}%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="metrics-grid" style="margin-bottom: 30px;">
          <div class="metric-card primary" style="background: #f8fafc; border: 1px solid #e2e8f0; border-top: 3px solid #dc2626; padding: 15px; border-radius: 8px; text-align: center;">
            <h4 style="font-size: 11px; color: #4b5563; margin-bottom: 6px;">CAGR Estimado</h4>
            <div class="metric-value" style="font-size: 20px; font-weight: bold; color: #dc2626;">${results.cagr.toFixed(1)}%</div>
            <div class="metric-label" style="font-size: 9px; color: #6b7280;">Crecimiento anual compuesto</div>
          </div>
          <div class="metric-card primary" style="background: #f8fafc; border: 1px solid #e2e8f0; border-top: 3px solid #dc2626; padding: 15px; border-radius: 8px; text-align: center;">
            <h4 style="font-size: 11px; color: #4b5563; margin-bottom: 6px;">TIR Estimada</h4>
            <div class="metric-value" style="font-size: 20px; font-weight: bold; color: #dc2626;">${results.irr.toFixed(1)}%</div>
            <div class="metric-label" style="font-size: 9px; color: #6b7280;">Tasa interna de retorno</div>
          </div>
          <div class="metric-card primary" style="background: #f8fafc; border: 1px solid #e2e8f0; border-top: 3px solid #dc2626; padding: 15px; border-radius: 8px; text-align: center;">
            <h4 style="font-size: 11px; color: #4b5563; margin-bottom: 6px;">ROI Estimado</h4>
            <div class="metric-value" style="font-size: 20px; font-weight: bold; color: #dc2626;">${returnPercentage}%</div>
            <div class="metric-label" style="font-size: 9px; color: #6b7280;">Sobre inversión total</div>
          </div>
          <div class="metric-card primary" style="background: #f8fafc; border: 1px solid #e2e8f0; border-top: 3px solid #dc2626; padding: 15px; border-radius: 8px; text-align: center;">
            <h4 style="font-size: 11px; color: #4b5563; margin-bottom: 6px;">Payback Estimado</h4>
            <div class="metric-value" style="font-size: 20px; font-weight: bold; color: #dc2626;">${typeof results.paybackYear === 'number' ? results.paybackYear.toFixed(2) : (results.paybackYear || 'N/A')}</div>
            <div class="metric-label" style="font-size: 9px; color: #6b7280;">Año de recuperación</div>
          </div>
        </div>

        <div class="section-title">Información de la Inversión</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div style="background: #f8fafc; padding: 12px; border-radius: 8px; display: flex; justify-content: space-between; border: 1px solid #e2e8f0;">
            <span style="color: #4b5563; font-weight: 500;">Tipo de Producto</span>
            <span style="font-weight: 600; color: #1f2937;">${productTypeLabel}</span>
          </div>
          <div style="background: #f8fafc; padding: 12px; border-radius: 8px; display: flex; justify-content: space-between; border: 1px solid #e2e8f0;">
            <span style="color: #4b5563; font-weight: 500;">Escenario</span>
            <span style="font-weight: 600; color: #1f2937;">${scenarioName}</span>
          </div>
          <div style="background: #f8fafc; padding: 12px; border-radius: 8px; display: flex; justify-content: space-between; border: 1px solid #e2e8f0;">
            <span style="color: #4b5563; font-weight: 500;">Plazo de Inversión</span>
            <span style="font-weight: 600; color: #1f2937;">${investment.years} años</span>
          </div>
          <div style="background: #f8fafc; padding: 12px; border-radius: 8px; display: flex; justify-content: space-between; border: 1px solid #e2e8f0;">
            <span style="color: #4b5563; font-weight: 500;">Reinversión de Ganancias</span>
            <span style="font-weight: 600; color: ${investment.reinvestProfits ? '#16a34a' : '#dc2626'};">${investment.reinvestProfits ? 'Activada' : 'Desactivada'}</span>
          </div>
          <div style="background: #f8fafc; padding: 12px; border-radius: 8px; display: flex; justify-content: space-between; border: 1px solid #e2e8f0;">
            <span style="color: #4b5563; font-weight: 500;">Tickets Iniciales</span>
            <span style="font-weight: 600; color: #1f2937;">${investment.initialCertificates}</span>
          </div>
          <div style="background: #f8fafc; padding: 12px; border-radius: 8px; display: flex; justify-content: space-between; border: 1px solid #e2e8f0;">
            <span style="color: #4b5563; font-weight: 500;">Precio por Ticket</span>
            <span style="font-weight: 600; color: #1f2937;">${format(investment.certificateBasePrice)}</span>
          </div>
        </div>
      </div>

      <!-- PAGE 3: Escalones de Inversión -->
      <div class="pdf-page">
        <div class="pdf-sidebar"></div>
        <div class="section-title">Escalones de Inversión</div>

        <div style="background: #fffbeb; padding: 15px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #f59e0b; border-left-width: 4px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="background: rgba(245, 158, 11, 0.15); border: 1px solid #f59e0b; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span style="color: #d97706; font-weight: 800; font-size: 14px;">${currentEscalon}</span>
            </div>
            <div>
              <div style="font-size: 13px; font-weight: 700; color: #b45309;">Tu Escalón Seleccionado: ${ESCALONES[currentEscalon - 1]?.name || ESCALONES[0].name}</div>
              <div style="font-size: 11px; color: #b45309;">Precio de entrada: ${format(ESCALONES[currentEscalon - 1]?.entryPrice || ESCALONES[0].entryPrice)} | ROI Estimado: ${ESCALONES[currentEscalon - 1]?.roi || ESCALONES[0].roi}%</div>
            </div>
          </div>
        </div>

        <div class="table-container" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: white; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; font-size: 10px; padding: 10px 6px;">Escalón #</th>
                <th style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; font-size: 10px; padding: 10px 6px;">Nombre</th>
                <th style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; font-size: 10px; padding: 10px 6px;">Precio Entrada</th>
                <th style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; font-size: 10px; padding: 10px 6px;">ROI Est. %</th>
                <th style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; font-size: 10px; padding: 10px 6px;">Retorno Anual</th>
                <th style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; font-size: 10px; padding: 10px 6px;">Retorno Trimestral</th>
              </tr>
            </thead>
            <tbody>
              ${generateEscalonesRows()}
            </tbody>
          </table>
        </div>

        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h4 style="color: #b45309; font-size: 12px; font-weight: 700; margin-bottom: 12px; text-align: center;">Apreciación por Escalón</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 15px;">
            <div style="background: white; padding: 10px; border-radius: 6px; text-align: center; border: 1px solid #e2e8f0; border-top: 3px solid #16a34a;">
              <div style="font-size: 9px; color: #6b7280; margin-bottom: 2px;">Escalón 1 (${ESCALONES[0].name})</div>
              <div style="font-size: 13px; font-weight: 800; color: #16a34a;">${format(ESCALONES[0].entryPrice)}</div>
              <div style="font-size: 8px; color: #16a34a; margin-top: 2px;">Mejor ROI: ${ESCALONES[0].roi}%</div>
            </div>
            <div style="background: white; padding: 10px; border-radius: 6px; text-align: center; border: 1px solid #e2e8f0; border-top: 3px solid #f59e0b;">
              <div style="font-size: 9px; color: #6b7280; margin-bottom: 2px;">Apreciación Total</div>
              <div style="font-size: 13px; font-weight: 800; color: #f59e0b;">${format(ESCALONES[ESCALONES.length - 1].entryPrice - ESCALONES[0].entryPrice)}</div>
              <div style="font-size: 8px; color: #f59e0b; margin-top: 2px;">por ticket</div>
            </div>
            <div style="background: white; padding: 10px; border-radius: 6px; text-align: center; border: 1px solid #e2e8f0; border-top: 3px solid #dc2626;">
              <div style="font-size: 9px; color: #6b7280; margin-bottom: 2px;">Escalón ${ESCALONES.length} (${ESCALONES[ESCALONES.length - 1].name})</div>
              <div style="font-size: 13px; font-weight: 800; color: #dc2626;">${format(ESCALONES[ESCALONES.length - 1].entryPrice)}</div>
              <div style="font-size: 8px; color: #dc2626; margin-top: 2px;">ROI: ${ESCALONES[ESCALONES.length - 1].roi}%</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 4px; justify-content: center; margin-bottom: 12px;">
            ${ESCALONES.map((esc) => {
              const isActive = esc.number <= currentEscalon;
              const isCurrent = esc.number === currentEscalon;
              return `<div style="width: ${isCurrent ? '24px' : '20px'}; height: ${isCurrent ? '24px' : '20px'}; border-radius: 4px; background: ${isCurrent ? '#f59e0b' : isActive ? 'rgba(245, 158, 11, 0.2)' : '#f1f5f9'}; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: ${isCurrent ? '#fff' : isActive ? '#d97706' : '#94a3b8'}; border: ${isCurrent ? '1.5px solid #d97706' : '1px solid #cbd5e1'}; transition: all 0.2s;">${esc.number}</div>`;
            }).join('<div style="width: 8px; height: 1.5px; background: #cbd5e1;"></div>')}
          </div>
          <div style="background: white; padding: 10px; border-radius: 6px; border-left: 3px solid #f59e0b; border: 1px solid #e2e8f0; border-left-width: 3px;">
            <p style="color: #4b5563; font-size: 10px; line-height: 1.4; margin: 0;">El sistema de escalones recompensa a los socios que invierten primero con un mejor ROI. Los escalones se llenan progresivamente antes de pasar al siguiente nivel de precio.</p>
          </div>
        </div>
      </div>

      <!-- PAGE 4: Milestones & Alternatives Comparison & Summary Info -->
      <div class="pdf-page">
        <div class="pdf-sidebar"></div>
        <div class="section-title">Evolución Patrimonial - Hitos Clave</div>
        <div class="table-container" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: white; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: linear-gradient(135deg, #dc2626, #991b1b); color: white;">
                <th style="padding: 10px 8px; font-size: 10px;">Periodo</th>
                <th style="padding: 10px 8px; font-size: 10px;">Tickets</th>
                <th style="padding: 10px 8px; font-size: 10px;">Patrimonio</th>
                <th style="padding: 10px 8px; font-size: 10px;">Ingreso Mensual</th>
                <th style="padding: 10px 8px; font-size: 10px;">Multiplicador</th>
              </tr>
            </thead>
            <tbody>
              ${generateMilestoneRows()}
            </tbody>
          </table>
        </div>

        <div class="section-title">Comparación con Inversiones Alternativas</div>
        <div class="table-container" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: white; margin-bottom: 15px;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: linear-gradient(135deg, #dc2626, #991b1b); color: white;">
                <th style="padding: 10px 8px; font-size: 10px;">Tipo de Inversión</th>
                <th style="padding: 10px 8px; font-size: 10px;">Patrimonio Final</th>
                <th style="padding: 10px 8px; font-size: 10px;">Ingreso Mensual</th>
                <th style="padding: 10px 8px; font-size: 10px;">Multiplicador</th>
                <th style="padding: 10px 8px; font-size: 10px;">vs RiderMex</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background: #fef2f2; font-weight: bold; border-left: 4px solid #dc2626;">
                <td style="color: #1f2937; padding: 10px 8px; border: 1px solid #e2e8f0;">RiderMex</td>
                <td style="color: #dc2626; padding: 10px 8px; border: 1px solid #e2e8f0; text-align: right;">${format(results.finalPatrimony)}</td>
                <td style="color: #16a34a; padding: 10px 8px; border: 1px solid #e2e8f0; text-align: right;">${format(results.finalMonthlyIncome)}</td>
                <td style="color: #dc2626; padding: 10px 8px; border: 1px solid #e2e8f0;">${results.capitalMultiplier.toFixed(1)}x</td>
                <td style="color: #1f2937; padding: 10px 8px; border: 1px solid #e2e8f0;">100% (Referencia)</td>
              </tr>
              <tr style="background: #ffffff;">
                <td style="color: #4b5563; padding: 10px 8px; border: 1px solid #e2e8f0;">CETES</td>
                <td style="color: #4b5563; padding: 10px 8px; border: 1px solid #e2e8f0; text-align: right;">${format(results.cetesPatrimony)}</td>
                <td style="color: #4b5563; padding: 10px 8px; border: 1px solid #e2e8f0; text-align: right;">${format(results.cetesPatrimony * (investment.cetesRate / 100) / 12)}</td>
                <td style="color: #4b5563; padding: 10px 8px; border: 1px solid #e2e8f0;">${(results.cetesPatrimony / initialInvestment).toFixed(1)}x</td>
                <td style="color: #4b5563; padding: 10px 8px; border: 1px solid #e2e8f0;">${results.finalPatrimony > 0 ? ((results.cetesPatrimony / results.finalPatrimony) * 100).toFixed(1) : 0}%</td>
              </tr>
              <tr style="background: #f8fafc;">
                <td style="color: #4b5563; padding: 10px 8px; border: 1px solid #e2e8f0;">Ahorro Tradicional</td>
                <td style="color: #4b5563; padding: 10px 8px; border: 1px solid #e2e8f0; text-align: right;">${format(results.savingsPatrimony)}</td>
                <td style="color: #4b5563; padding: 10px 8px; border: 1px solid #e2e8f0; text-align: right;">${format(results.savingsPatrimony * (investment.savingsRate / 100) / 12)}</td>
                <td style="color: #4b5563; padding: 10px 8px; border: 1px solid #e2e8f0;">${(results.savingsPatrimony / initialInvestment).toFixed(1)}x</td>
                <td style="color: #4b5563; padding: 10px 8px; border: 1px solid #e2e8f0;">${results.finalPatrimony > 0 ? ((results.savingsPatrimony / results.finalPatrimony) * 100).toFixed(1) : 0}%</td>
              </tr>
              <tr style="background: #ffffff;">
                <td style="color: #4b5563; padding: 10px 8px; border: 1px solid #e2e8f0;">Bienes Raíces</td>
                <td style="color: #4b5563; padding: 10px 8px; border: 1px solid #e2e8f0; text-align: right;">${format(results.realEstatePatrimony)}</td>
                <td style="color: #4b5563; padding: 10px 8px; border: 1px solid #e2e8f0; text-align: right;">${format(results.realEstatePatrimony * (investment.realEstateRent / 100) / 12)}</td>
                <td style="color: #4b5563; padding: 10px 8px; border: 1px solid #e2e8f0;">${(results.realEstatePatrimony / initialInvestment).toFixed(1)}x</td>
                <td style="color: #4b5563; padding: 10px 8px; border: 1px solid #e2e8f0;">${results.finalPatrimony > 0 ? ((results.realEstatePatrimony / results.finalPatrimony) * 100).toFixed(1) : 0}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="background: #fdf2f2; padding: 12px; border-radius: 8px; border: 1px solid #fca5a5; margin-bottom: 20px; text-align: center;">
          <p style="color: #1f2937; font-size: 11px; margin: 0;">
            <strong style="color: #dc2626;">RiderMex supera a CETES por ${results.cetesPatrimony > 0 ? (results.finalPatrimony / results.cetesPatrimony).toFixed(1) : 'N/A'}x</strong>
            y genera <strong style="color: #dc2626;">${results.savingsPatrimony > 0 ? (results.finalPatrimony / results.savingsPatrimony).toFixed(1) : 'N/A'}x</strong> más que el ahorro tradicional.
          </p>
        </div>

        ${(productType === 'B' || productType === 'D') ? `
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 6px; text-align: center;">
              <div style="font-size: 8px; color: #6b7280; margin-bottom: 4px; font-weight: 600;">Inversión Total</div>
              <div style="font-size: 11px; font-weight: bold; color: #1f2937;">${formatCurrency(totalInvestmentConverted, investment.currencyFormat)}</div>
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 6px; text-align: center;">
              <div style="font-size: 8px; color: #6b7280; margin-bottom: 4px; font-weight: 600;">Enganche</div>
              <div style="font-size: 11px; font-weight: bold; color: #1f2937;">${format(10000 * investment.initialCertificates)}</div>
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 6px; text-align: center;">
              <div style="font-size: 8px; color: #6b7280; margin-bottom: 4px; font-weight: 600;">Mensualidad</div>
              <div style="font-size: 11px; font-weight: bold; color: #16a34a;">${format((initialInvestment - 10000 * investment.initialCertificates) / (productType === 'B' ? 12 : (investment.ridermexFinancingMonths || 48)))}</div>
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 6px; text-align: center;">
              <div style="font-size: 8px; color: #6b7280; margin-bottom: 4px; font-weight: 600;">Rendimiento Anual Est.</div>
              <div style="font-size: 11px; font-weight: bold; color: #16a34a;">${actualRoi}%</div>
            </div>
          </div>
        ` : `
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 6px; text-align: center;">
              <div style="font-size: 8px; color: #6b7280; margin-bottom: 4px; font-weight: 600;">Inversión Total</div>
              <div style="font-size: 11px; font-weight: bold; color: #1f2937;">${formatCurrency(totalInvestmentConverted, investment.currencyFormat)}</div>
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 6px; text-align: center;">
              <div style="font-size: 8px; color: #6b7280; margin-bottom: 4px; font-weight: 600;">Precio por Ticket</div>
              <div style="font-size: 11px; font-weight: bold; color: #1f2937;">${format(investment.certificateBasePrice)}</div>
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 6px; text-align: center;">
              <div style="font-size: 8px; color: #6b7280; margin-bottom: 4px; font-weight: 600;">Rendimiento Anual Est.</div>
              <div style="font-size: 11px; font-weight: bold; color: #16a34a;">${actualRoi}%</div>
            </div>
          </div>
        `}
      </div>

      <!-- PAGE 4.5: Charts Dashboard -->
      ${generateChartsGridPageHTML(investment, results, format, initialInvestment, scenarioName, actualRoi)}

      <!-- PAGES 5+: Detailed Evolution (dynamically chunked) -->
      ${generateDetailedTablePages()}

      <!-- PAGE: Why Invest in RiderMex -->
      <div class="pdf-page">
        <div class="pdf-sidebar"></div>
        <div class="section-title">¿Por qué invertir en RiderMex?</div>

        <div class="why-invest-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px;">
          <div class="why-card" style="background: #f8fafc; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: none;">
            <div class="why-card-header" style="background: linear-gradient(135deg, #dc2626, #991b1b); padding: 10px; color: white; text-align: center;">
              <h3 style="font-size: 11px; font-weight: bold; margin: 0;">Alto Rendimiento</h3>
              <div class="sub" style="font-size: 8px; opacity: 0.9; margin-top: 2px;">Retorno trimestral estimado</div>
            </div>
            <div class="why-card-body" style="padding: 10px;">
              <div class="why-point" style="display: flex; gap: 6px; margin-bottom: 8px; align-items: start;">
                <div class="why-check red" style="background: rgba(220, 38, 38, 0.1); color: #dc2626; border-radius: 50%; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: bold; flex-shrink: 0;">+</div>
                <div>
                  <strong style="font-size: 9px; color: #1f2937;">ROI del ${scenarioBaseRoi}% anual</strong>
                  <p style="font-size: 8px; color: #6b7280; margin: 0;">Pagos trimestrales estimados de $${RIDERMEX_CONFIG.QUARTERLY_PAYMENT.toLocaleString()} por ticket.</p>
                </div>
              </div>
              <div class="why-point" style="display: flex; gap: 6px; margin-bottom: 8px; align-items: start;">
                <div class="why-check red" style="background: rgba(220, 38, 38, 0.1); color: #dc2626; border-radius: 50%; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: bold; flex-shrink: 0;">+</div>
                <div>
                  <strong style="font-size: 9px; color: #1f2937;">Interés Compuesto</strong>
                  <p style="font-size: 8px; color: #6b7280; margin: 0;">Reinvirtiendo ganancias, tu capital crece exponencialmente año con año.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="why-card" style="background: #f8fafc; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: none;">
            <div class="why-card-header" style="background: linear-gradient(135deg, #16a34a, #15803d); padding: 10px; color: white; text-align: center;">
              <h3 style="font-size: 11px; font-weight: bold; margin: 0;">Seguridad Patrimonial</h3>
              <div class="sub" style="font-size: 8px; opacity: 0.9; margin-top: 2px;">Triple fideicomiso de protección</div>
            </div>
            <div class="why-card-body" style="padding: 10px;">
              <div class="why-point" style="display: flex; gap: 6px; margin-bottom: 8px; align-items: start;">
                <div class="why-check green" style="background: rgba(34, 197, 94, 0.1); color: #16a34a; border-radius: 50%; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: bold; flex-shrink: 0;">+</div>
                <div>
                  <strong style="font-size: 9px; color: #1f2937;">Triple Fideicomiso</strong>
                  <p style="font-size: 8px; color: #6b7280; margin: 0;">Activos, operaciones y cobranza protegidos por el Banco ${RIDERMEX_CONFIG.BANK}.</p>
                </div>
              </div>
              <div class="why-point" style="display: flex; gap: 6px; margin-bottom: 8px; align-items: start;">
                <div class="why-check green" style="background: rgba(34, 197, 94, 0.1); color: #16a34a; border-radius: 50%; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: bold; flex-shrink: 0;">+</div>
                <div>
                  <strong style="font-size: 9px; color: #1f2937;">Seguro Patrimonial</strong>
                  <p style="font-size: 8px; color: #6b7280; margin: 0;">Garantía de activos reales contra siniestros y robo.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="why-card" style="background: #f8fafc; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: none;">
            <div class="why-card-header" style="background: linear-gradient(135deg, #0891b2, #0e7490); padding: 10px; color: white; text-align: center;">
              <h3 style="font-size: 11px; font-weight: bold; margin: 0;">Modelo Probado</h3>
              <div class="sub" style="font-size: 8px; opacity: 0.9; margin-top: 2px;">Mercado real en crecimiento</div>
            </div>
            <div class="why-card-body" style="padding: 10px;">
              <div class="why-point" style="display: flex; gap: 6px; margin-bottom: 8px; align-items: start;">
                <div class="why-check blue" style="background: rgba(6, 182, 212, 0.1); color: #0891b2; border-radius: 50%; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: bold; flex-shrink: 0;">+</div>
                <div>
                  <strong style="font-size: 9px; color: #1f2937;">Ventas Rápidas</strong>
                  <p style="font-size: 8px; color: #6b7280; margin: 0;">Rotación de inventario ágil de ${RIDERMEX_CONFIG.INVENTORY_ROTATION_DAYS_MIN}-${RIDERMEX_CONFIG.INVENTORY_ROTATION_DAYS_MAX} días.</p>
                </div>
              </div>
              <div class="why-point" style="display: flex; gap: 6px; margin-bottom: 8px; align-items: start;">
                <div class="why-check blue" style="background: rgba(6, 182, 212, 0.1); color: #0891b2; border-radius: 50%; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: bold; flex-shrink: 0;">+</div>
                <div>
                  <strong style="font-size: 9px; color: #1f2937;">Inversión 100% Pasiva</strong>
                  <p style="font-size: 8px; color: #6b7280; margin: 0;">El equipo operativo gestiona la tienda, tú solo recibes rendimientos.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 15px;">
          <h4 style="color: #dc2626; font-size: 12px; font-weight: 700; margin-bottom: 10px; text-align: center;">Puntos Clave</h4>
          <ul style="list-style: disc; padding-left: 20px; color: #4b5563; line-height: 1.6; font-size: 10px;">
            <li><strong style="color: #1f2937;">Superioridad Comprobada:</strong> Supera a CETES por ${results.cetesPatrimony > 0 ? (results.finalPatrimony / results.cetesPatrimony).toFixed(1) : 'N/A'}x.</li>
            <li><strong style="color: #1f2937;">Apreciación del Ticket:</strong> ${RIDERMEX_CONFIG.ANNUAL_APPRECIATION}% anual estimado por el sistema de escalones.</li>
            <li><strong style="color: #1f2937;">Seguro de Cobertura Amplia:</strong> ${RIDERMEX_CONFIG.INSURANCE.ASSETS.coverage}.</li>
            <li><strong style="color: #1f2937;">Gestión Profesional:</strong> Operación a cargo de equipo experto en retail de motocicletas.</li>
            <li><strong style="color: #1f2937;">Transparencia Total:</strong> Reportes trimestrales y auditorías del fideicomiso.</li>
          </ul>
        </div>
      </div>

      <!-- PAGE: Financing Plan (if generated, B/D models) -->
      ${(productType === 'B' || productType === 'D') ? `
        ${generateFinancingPlanHTML(investment, {
          downPaymentPercent: investment.financingDownPaymentPercent ?? options.downPaymentPercent ?? 30,
          annualInterestRate: investment.financingAnnualInterestRate ?? options.annualInterestRate ?? 12
        })}
      ` : ''}

      <!-- PAGE: Contact & Disclaimer & Footer -->
      <div class="pdf-page">
        <div class="pdf-sidebar"></div>
        <div class="section-title">Información de Contacto y Pago</div>
        <div class="contact-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 15px;">
          <div class="contact-card" style="background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
            <h4 style="color: #0891b2; font-size: 11px; font-weight: bold; margin-bottom: 6px;">Contacto Principal</h4>
            <p style="margin: 0 0 4px 0; font-size: 10px; color: #4b5563;"><strong style="color: #1f2937;">WhatsApp:</strong> ${options.advisorPhone || '55 1000 0604'}</p>
            <p style="margin: 0 0 4px 0; font-size: 10px; color: #4b5563;"><strong style="color: #1f2937;">Email:</strong> ${options.advisorEmail || 'informacion@ridermex.com'}</p>
            <p style="margin: 0; font-size: 10px; color: #4b5563;"><strong style="color: #1f2937;">Horario:</strong> Lun-Vie 9:00-18:00</p>
          </div>
          <div class="contact-card" style="background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
            <h4 style="color: #0891b2; font-size: 11px; font-weight: bold; margin-bottom: 6px;">Estructura Fiduciaria</h4>
            <p style="margin: 0 0 4px 0; font-size: 9px; color: #4b5563;"><strong style="color: #1f2937;">Banco:</strong> ${RIDERMEX_CONFIG.BANK}</p>
            <p style="margin: 0 0 2px 0; font-size: 9px; color: #1f2937; font-weight: bold;">Fideicomisos:</p>
            <p style="margin: 0 0 2px 0; font-size: 8px; color: #0891b2;">1. ${RIDERMEX_CONFIG.TRUSTS.ASSETS}</p>
            <p style="margin: 0 0 2px 0; font-size: 8px; color: #0891b2;">2. ${RIDERMEX_CONFIG.TRUSTS.OPERATIONS}</p>
            <p style="margin: 0 0 2px 0; font-size: 8px; color: #0891b2;">3. ${RIDERMEX_CONFIG.TRUSTS.COLLECTION}</p>
          </div>
          <div class="contact-card" style="background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
            <h4 style="color: #0891b2; font-size: 11px; font-weight: bold; margin-bottom: 6px;">Métodos de Pago</h4>
            <p style="margin: 0 0 4px 0; font-size: 9px; color: #4b5563;"><strong style="color: #1f2937;">ENGANCHE:</strong> Pago único de $10,000.00 MXN</p>
            <p style="margin: 0 0 4px 0; font-size: 9px; color: #4b5563;"><strong style="color: #1f2937;">Enlace:</strong> <a href="https://link.ridermex.com/payment-link/6a19c304c3ea3a1" style="color: #0891b2; text-decoration: underline;" target="_blank">Pagar aquí</a></p>
          </div>
        </div>

        <div class="contact-card" style="background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 15px;">
          <h4 style="color: #0891b2; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px; font-size: 11px;">Transferencia a Cuenta Fiduciaria</h4>
          <p style="margin: 0 0 3px 0; font-size: 9px; color: #4b5563;"><strong style="color: #1f2937;">Beneficiario:</strong> Click Seguridad Jurídica, S.A.P.I. de C.V., actuando como fiduciaria del Fideicomiso Irrevocable número 697</p>
          <p style="margin: 0 0 3px 0; font-size: 9px; color: #4b5563;"><strong style="color: #1f2937;">Nombre del Fideicomiso:</strong> OPTIBIX | <strong style="color: #1f2937;">Cuenta:</strong> 00000681503</p>
          <p style="margin: 0 0 3px 0; font-size: 9px; color: #4b5563;"><strong style="color: #1f2937;">CLABE Interbancaria:</strong> 113180000006815035 | <strong style="color: #1f2937;">Banco:</strong> Ve por Más, S.A., Institución de Banca Múltiple (BX+)</p>
        </div>

        <div class="disclaimer" style="background: #fffbeb; padding: 12px; border-radius: 8px; border: 1px solid #f59e0b; border-left: 4px solid #f59e0b; margin-bottom: 15px;">
          <h4 style="color: #d97706; font-size: 11px; font-weight: bold; margin-bottom: 4px;">Aviso Legal Importante</h4>
          <p style="color: #b45309; font-size: 9px; line-height: 1.4; margin: 0 0 4px 0;">Las proyecciones mostradas en este reporte son estimaciones basadas en los parámetros especificados y datos históricos del modelo de negocio RiderMex. No constituyen garantías de rendimientos futuros. Los resultados reales pueden variar debido a factores de mercado y económicos.</p>
          <p style="color: #b45309; font-size: 9px; line-height: 1.4; margin: 0;"><strong style="color: #d97706;">Este documento es únicamente informativo y no genera obligaciones contractuales.</strong></p>
        </div>

        <div class="footer" style="text-align: center; padding: 10px 0; border-top: 1px solid #e2e8f0; color: #6b7280; font-size: 9px;">
          <p style="margin: 0 0 2px 0;"><strong>&copy; ${new Date().getFullYear()} RiderMex - Análisis Completo de Inversión</strong></p>
          <p style="margin: 0;">informacion@ridermex.com | WhatsApp: 55 1000 0604</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
