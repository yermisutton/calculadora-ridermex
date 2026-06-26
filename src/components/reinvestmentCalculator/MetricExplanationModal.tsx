import React from 'react';
import { X, Info, Calculator, BookOpen } from 'lucide-react';
import { formatCurrency, convertFromMXN, formatPaybackPeriod } from '../../utils/formatters';

export interface MetricExplanation {
  id: string;
  title: string;
  formula: string | ((investment: any, results: any) => React.ReactNode);
  description: string;
  example?: string;
}

export const METRIC_EXPLANATIONS: Record<string, MetricExplanation> = {
  'certificados-finales': {
    id: 'certificados-finales',
    title: 'Certificados Finales Proyectados',
    formula: (investment, results) => (
      <div className="space-y-2">
        <div>Certificados Iniciales: <span className="font-bold text-white">{investment.initialCertificates}</span></div>
        <div>+ Adquiridos por Reinversión: <span className="font-bold text-white">{results.certificatesSummary.fromReinvestment}</span></div>
        <div className="border-t border-slate-700 pt-2 mt-2 text-emerald-400 font-bold">
          Total: {results.certificatesSummary.totalCertificates} Certificados
        </div>
      </div>
    ),
    description: 'Es el número total de tickets o certificados que poseerás al finalizar el plazo. Si el interés compuesto (multiplicador) está activado, este número crecerá a medida que tus rendimientos se utilicen automáticamente para comprar más participaciones.'
  },
  'ingreso-mensual': {
    id: 'ingreso-mensual',
    title: 'Ingreso Mensual Proyectado',
    formula: (investment, results) => {
      const annualYield = results.finalMonthlyIncome * 12;
      return (
        <div className="space-y-4">
          <div className="text-emerald-400 font-bold uppercase text-xs">Evolución Año con Año</div>
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
            {results.yearlyData && results.yearlyData.length > 0 ? (
              results.yearlyData.map((data, index) => {
                const isFinalYear = index === results.yearlyData.length - 1;
                const monthlyIncome = data.citrusIncome / 12;
                return (
                  <div key={data.year} className={`flex justify-between items-center p-2 rounded-lg ${isFinalYear ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-slate-800/50'}`}>
                    <span className="text-sm opacity-90">Año {data.year}:</span>
                    <span className={`font-bold ${isFinalYear ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {formatCurrency(convertFromMXN(monthlyIncome, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)} / mes
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-sm opacity-70">No hay datos de evolución disponibles.</div>
            )}
          </div>
          
          <div className="pt-4 border-t border-slate-700">
            <div className="text-emerald-400 font-bold uppercase text-xs mb-2">Fórmula (Año {investment.years})</div>
            <div className="text-sm opacity-90 mb-1">
              Rendimiento Anual Total: <span className="font-bold text-white">{formatCurrency(convertFromMXN(annualYield, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span>
            </div>
            <div className="text-sm opacity-90">÷ 12 meses</div>
            <div className="flex justify-between items-center border-t border-slate-700/50 pt-2 mt-2 text-emerald-400 font-bold">
              <span>Ingreso Mensual Final:</span>
              <span>{formatCurrency(convertFromMXN(results.finalMonthlyIncome, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span>
            </div>
          </div>
        </div>
      );
    },
    description: 'Es la cantidad promedio de dinero que recibirías mes a mes por concepto de rendimientos al llegar al año proyectado. Este cálculo asume que tu portafolio está completamente operativo y maduro.'
  },
  'patrimonio-final': {
    id: 'patrimonio-final',
    title: 'Patrimonio Final Proyectado',
    formula: (investment, results) => {
      const isRidermex = !!investment.ridermexProductType;
      
      const inflationRate = investment.inflationRate || 3.5;
      const lemonIncrease = investment.increaseLemonPrice ? investment.lemonPriceIncrease : 0;
      const annualPriceGrowthRate = lemonIncrease + inflationRate;
      const growthFactor = 1 + annualPriceGrowthRate / 100;
      
      const matureBasePrice = isRidermex ? 120000 : investment.certificateBasePrice;
      const priceAtEnd = matureBasePrice * Math.pow(growthFactor, Math.max(0, investment.years - 1));
      
      const realInvestmentPerTicket = investment.certificateBasePrice;
      const valorRealTicket = isRidermex ? 100000 : investment.certificateBasePrice;
      const initialPlusvalia = isRidermex ? valorRealTicket - realInvestmentPerTicket : 0;
      const maturityIncrement = isRidermex ? matureBasePrice - valorRealTicket : 0;

      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-emerald-400 font-bold uppercase text-xs">1. Evolución del Valor de tu 1er Certificado</div>
            {isRidermex ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Precio Nominal (Costo del Ticket):</span>
                  <span className="font-bold text-white">{formatCurrency(convertFromMXN(realInvestmentPerTicket, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span>
                </div>
                {initialPlusvalia > 0 && (
                  <div className="flex justify-between items-center text-emerald-400">
                    <span className="text-sm opacity-90">+ 1era Plusvalía (Utilidad Intrínseca):</span>
                    <span className="font-bold">+{formatCurrency(convertFromMXN(initialPlusvalia, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-slate-700/50 pt-1 mt-1 text-white">
                  <span className="text-sm opacity-90">Valor Real del Ticket:</span>
                  <span>{formatCurrency(convertFromMXN(valorRealTicket, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span>
                </div>
                {maturityIncrement > 0 && (
                  <div className="flex justify-between items-center mt-2 text-purple-400">
                    <span className="text-sm opacity-90">+ 2da Plusvalía (Madurez Curva J):</span>
                    <span className="font-bold">+{formatCurrency(convertFromMXN(maturityIncrement, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-slate-700/50 pt-1 mt-1 text-white font-bold">
                  <span className="text-sm opacity-90">Valor Comercial Madurado:</span>
                  <span>{formatCurrency(convertFromMXN(matureBasePrice, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span>
                </div>
                {annualPriceGrowthRate > 0 && (
                  <div className="flex justify-between items-center mt-2 text-blue-400">
                    <span className="text-sm opacity-90">+ 3era Plusvalía (Incremento {annualPriceGrowthRate}% por {Math.max(0, investment.years - 1)} años):</span>
                    <span className="font-bold">+{formatCurrency(convertFromMXN(priceAtEnd - matureBasePrice, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-slate-700 pt-1 mt-1 text-emerald-400 font-bold">
                  <span className="text-sm opacity-90">Valor Comercial Final (del 1er ticket):</span>
                  <span>{formatCurrency(convertFromMXN(priceAtEnd, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-center font-bold text-emerald-400">
                <span className="text-sm opacity-90">Valor Comercial Final (del 1er ticket):</span>
                <span>{formatCurrency(convertFromMXN(priceAtEnd, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2 pt-2 border-t border-slate-700">
            <div className="text-emerald-400 font-bold uppercase text-xs">2. Cálculo del Patrimonio Total</div>
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-90">Suma del valor individual de tus {results.certificatesSummary.totalCertificates} certificado(s):</span>
              <span className="font-bold text-white">{formatCurrency(convertFromMXN(results.finalPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-700 pt-2 mt-2 text-emerald-400 font-bold text-lg">
              <span className="text-sm opacity-90">Total Patrimonio Final (Neto):</span>
              <span>{formatCurrency(convertFromMXN(results.finalPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span>
            </div>
          </div>
        </div>
      );
    },
    description: 'El Patrimonio Final refleja el valor comercial total de tus certificados. En RiderMex tu capital se multiplica por 3 plusvalías: 1) Utilidad intrínseca desde el día cero, 2) Madurez de la sucursal (Curva J) y 3) Apreciación anual del negocio. Si adquiriste más tickets por reinversión, se suma el valor individual de cada uno según el año en que se compraron.'
  },
  'multiplicador': {
    id: 'multiplicador',
    title: 'Poder del Multiplicador',
    formula: (investment, results) => {
      const initialPatrimony = investment.ridermexProductType === 'B' || investment.ridermexProductType === 'D' ? (investment.initialCertificates * investment.certificateBasePrice) : investment.initialPayment;
      return (
        <div className="space-y-2">
          <div>Patrimonio Final: <span className="font-bold text-white">{formatCurrency(convertFromMXN(results.finalPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span></div>
          <div>÷ Inversión Inicial: <span className="font-bold text-white">{formatCurrency(convertFromMXN(initialPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span></div>
          <div className="border-t border-slate-700 pt-2 mt-2 text-emerald-400 font-bold">
            Multiplicador: {results.capitalMultiplier}x
          </div>
        </div>
      );
    },
    description: 'Mide cuántas veces creció tu inversión original gracias al efecto del interés compuesto. Un "2X" significa que duplicaste el valor de tu aportación inicial.'
  },
  'comparativa-ridermex': {
    id: 'comparativa-ridermex',
    title: 'Proyección RiderMex',
    formula: (investment, results) => {
      const initialPatrimony = investment.ridermexProductType === 'B' || investment.ridermexProductType === 'D' ? (investment.initialCertificates * investment.certificateBasePrice) : investment.initialPayment;
      const reinvestAmount = results.yearlyData?.length > 0 ? results.yearlyData[results.yearlyData.length - 1].cumulativeReinvestmentContribution : 0;
      const nonReinvestYield = results.yearlyData?.length > 0 ? results.yearlyData[results.yearlyData.length - 1].cumulativeTotalUtility : 0;
      
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-emerald-400 font-bold uppercase text-xs">1. Valor Proyectado</div>
            <div>Inversión Inicial: <span className="font-bold text-white">{formatCurrency(convertFromMXN(initialPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span></div>
            <div>+ Rendimiento y Plusvalía Acumulada: <span className="font-bold text-white">{formatCurrency(convertFromMXN(results.finalPatrimony - initialPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span></div>
            <div className="border-t border-slate-700 pt-1 mt-1 font-bold">
              Total Proyectado: {formatCurrency(convertFromMXN(results.finalPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}
            </div>
          </div>
          
          <div className="space-y-2 pt-2 border-t border-slate-700">
            {investment.reinvestProfits ? (
              <>
                <div className="text-emerald-400 font-bold uppercase text-xs">2. Total pagado desde rendimientos</div>
                <div>Suma total de los rendimientos generados mes a mes que se utilizaron automáticamente para comprar más certificados.</div>
                <div className="border-t border-slate-700 pt-1 mt-1 font-bold text-white">
                  Total: +{formatCurrency(convertFromMXN(reinvestAmount, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}
                </div>
              </>
            ) : (
              <>
                <div className="text-emerald-400 font-bold uppercase text-xs">2. Rendimiento Acumulado</div>
                <div>Suma exacta del total de interés simple/ganancia que generó el capital a lo largo del periodo, sin reinvertirse.</div>
                <div className="border-t border-slate-700 pt-1 mt-1 font-bold text-white">
                  Total: +{formatCurrency(convertFromMXN(nonReinvestYield, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}
                </div>
              </>
            )}
          </div>
        </div>
      );
    },
    description: 'La tarjeta se divide en dos secciones. La principal muestra el valor final de tus certificados apreciados. La sección inferior detalla qué proporción de ese crecimiento provino estrictamente de los rendimientos (ya sea cobrados en efectivo o reinvertidos para comprar más tickets).'
  },
  'comparativa-cetes': {
    id: 'comparativa-cetes',
    title: 'Proyección CETES',
    formula: (investment, results) => {
      const initialPatrimony = investment.ridermexProductType === 'B' || investment.ridermexProductType === 'D' ? (investment.initialCertificates * investment.certificateBasePrice) : investment.initialPayment;
      const rate = 11.0;
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-emerald-400 font-bold uppercase text-xs">1. {investment.reinvestProfits ? 'Valor Proyectado' : 'Valor de Inversión'}</div>
            <div>Inversión Inicial: <span className="font-bold text-white">{formatCurrency(convertFromMXN(initialPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span></div>
            {investment.reinvestProfits && <div>× (1 + Tasa {rate}%)^{(investment.years)}</div>}
            <div className="border-t border-slate-700 pt-1 mt-1 font-bold">
              Total: {formatCurrency(convertFromMXN(investment.reinvestProfits ? results.cetesPatrimony : initialPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}
            </div>
          </div>

          {!investment.reinvestProfits && (
            <div className="space-y-2 pt-2 border-t border-slate-700">
              <div className="text-emerald-400 font-bold uppercase text-xs">2. Rendimiento Acumulado</div>
              <div>Valor Proyectado ({formatCurrency(convertFromMXN(results.cetesPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}) - Inversión Inicial</div>
              <div className="border-t border-slate-700 pt-1 mt-1 font-bold text-white">
                Total: +{formatCurrency(convertFromMXN(results.cetesPatrimony - initialPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}
              </div>
            </div>
          )}
        </div>
      );
    },
    description: 'Es la proyección de tu mismo capital si lo hubieras invertido en deuda gubernamental (CETES). Muestra el crecimiento compuesto si reinviertes, o separa tu inversión original de las ganancias si decides no reinvertir.'
  },
  'comparativa-ahorro': {
    id: 'comparativa-ahorro',
    title: 'Proyección Ahorro Tradicional',
    formula: (investment, results) => {
      const initialPatrimony = investment.ridermexProductType === 'B' || investment.ridermexProductType === 'D' ? (investment.initialCertificates * investment.certificateBasePrice) : investment.initialPayment;
      const rate = 4.0;
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-emerald-400 font-bold uppercase text-xs">1. {investment.reinvestProfits ? 'Valor Proyectado' : 'Valor de Inversión'}</div>
            <div>Inversión Inicial: <span className="font-bold text-white">{formatCurrency(convertFromMXN(initialPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span></div>
            {investment.reinvestProfits && <div>× (1 + Tasa {rate}%)^{(investment.years)}</div>}
            <div className="border-t border-slate-700 pt-1 mt-1 font-bold">
              Total: {formatCurrency(convertFromMXN(investment.reinvestProfits ? results.savingsPatrimony : initialPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}
            </div>
          </div>

          {!investment.reinvestProfits && (
            <div className="space-y-2 pt-2 border-t border-slate-700">
              <div className="text-emerald-400 font-bold uppercase text-xs">2. Rendimiento Acumulado</div>
              <div>Valor Proyectado ({formatCurrency(convertFromMXN(results.savingsPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}) - Inversión Inicial</div>
              <div className="border-t border-slate-700 pt-1 mt-1 font-bold text-white">
                Total: +{formatCurrency(convertFromMXN(results.savingsPatrimony - initialPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}
              </div>
            </div>
          )}
        </div>
      );
    },
    description: 'Proyección simulada si dejas tu dinero en una cuenta de banco o pagaré tradicional. Si no reinviertes, te mostramos por separado tu capital estancado frente al pequeño rendimiento generado.'
  },
  'comparativa-bienes-raices': {
    id: 'comparativa-bienes-raices',
    title: 'Proyección Bienes Raíces',
    formula: (investment, results) => {
      const initialPatrimony = investment.ridermexProductType === 'B' || investment.ridermexProductType === 'D' ? (investment.initialCertificates * investment.certificateBasePrice) : investment.initialPayment;
      const rate = 9.0;
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-emerald-400 font-bold uppercase text-xs">1. {investment.reinvestProfits ? 'Valor Proyectado' : 'Valor de Inversión'}</div>
            <div>Inversión Inicial: <span className="font-bold text-white">{formatCurrency(convertFromMXN(initialPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span></div>
            {investment.reinvestProfits && <div>× (1 + Plusvalía + Rentas {rate}%)^{(investment.years)}</div>}
            <div className="border-t border-slate-700 pt-1 mt-1 font-bold">
              Total: {formatCurrency(convertFromMXN(investment.reinvestProfits ? results.realEstatePatrimony : initialPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}
            </div>
          </div>

          {!investment.reinvestProfits && (
            <div className="space-y-2 pt-2 border-t border-slate-700">
              <div className="text-emerald-400 font-bold uppercase text-xs">2. Rendimiento Acumulado</div>
              <div>Valor Proyectado ({formatCurrency(convertFromMXN(results.realEstatePatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}) - Inversión Inicial</div>
              <div className="border-t border-slate-700 pt-1 mt-1 font-bold text-white">
                Total: +{formatCurrency(convertFromMXN(results.realEstatePatrimony - initialPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}
              </div>
            </div>
          )}
        </div>
      );
    },
    description: 'Proyecta el crecimiento en inmuebles asumiendo que reinviertes rentas, o si no lo haces, te separa el capital estancado de la plusvalía + rentas acumuladas.'
  },
  'cagr': {
    id: 'cagr',
    title: 'CAGR (Crecimiento Anual Compuesto)',
    formula: (investment, results) => {
      const isFinanced = investment.ridermexProductType === 'B' || investment.ridermexProductType === 'D';
      const initialInvestment = investment.initialPayment > 0 ? investment.initialPayment : (investment.initialCertificates * investment.certificateBasePrice);
      const totalInvestedAtEnd = investment.ridermexProductType && isFinanced ? (investment.initialCertificates * investment.certificateBasePrice) : initialInvestment;

      // The backend now uses (initial + cumulative utility) for CAGR
      const cumulativeUtility = results.yearlyData?.reduce((sum, d) => sum + d.totalUtility, 0) || 0;
      const totalYieldValue = totalInvestedAtEnd + cumulativeUtility;

      return (
        <div className="space-y-2">
          <div>[(Inversión Inicial + Rendimiento Acumulado): <span className="font-bold text-white">{formatCurrency(convertFromMXN(totalYieldValue, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span></div>
          <div>÷ Valor Inicial: <span className="font-bold text-white">{formatCurrency(convertFromMXN(totalInvestedAtEnd, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span>)</div>
          <div>^ (1 / {investment.years} Años)] - 1</div>
          <div className="border-t border-slate-700 pt-2 mt-2 text-emerald-400 font-bold">
            CAGR: {(results.cagr).toFixed(2)}% Anual
          </div>
        </div>
      );
    },
    description: 'La Tasa de Crecimiento Anual Compuesto (CAGR por sus siglas en inglés) suaviza el crecimiento de tu inversión, dándote una tasa promedio anual "constante". Es la métrica estándar oro para comparar diferentes inversiones a lo largo del tiempo.'
  },
  'tir': {
    id: 'tir',
    title: 'TIR (Tasa Interna de Retorno)',
    formula: (investment, results) => (
      <div className="space-y-2">
        <div>Tasa de descuento donde el VPN (Valor Presente Neto) de todos los flujos de efectivo es igual a 0.</div>
        <div className="border-t border-slate-700 pt-2 mt-2 text-emerald-400 font-bold">
          TIR Proyectada: {(results.irr).toFixed(2)}%
        </div>
      </div>
    ),
    description: 'Es la tasa de rentabilidad promedio que genera cada peso mientras está invertido en el proyecto. Es la métrica financiera más importante para medir la rentabilidad real de un flujo de caja complejo.'
  },
  'payback': {
    id: 'payback',
    title: 'Payback (Recuperación de Capital)',
    formula: (investment, results) => {
      const initialPatrimony = investment.ridermexProductType === 'B' || investment.ridermexProductType === 'D' ? (investment.initialCertificates * investment.certificateBasePrice) : investment.initialPayment;
      return (
        <div className="space-y-2">
          <div>Mes y Año exacto en que:</div>
          <div>Utilidades Acumuladas = <span className="font-bold text-white">{formatCurrency(convertFromMXN(initialPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span></div>
          <div className="border-t border-slate-700 pt-2 mt-2 text-emerald-400 font-bold">
            Payback Proyectado: {formatPaybackPeriod(results.paybackYear)}
          </div>
        </div>
      );
    },
    description: 'Es el tiempo exacto que tardas en recuperar el 100% del dinero que sacaste de tu bolsillo, basándose únicamente en los rendimientos o utilidades generadas por el proyecto.'
  },
  'sin-reinversion': {
    id: 'sin-reinversion',
    title: 'Sin Reinversión',
    formula: (investment, results) => {
      const initialInvestment = investment.initialCertificates * investment.certificateBasePrice;
      const isRidermex = !!investment.ridermexProductType;
      
      const inflationRate = investment.inflationRate || 3.5;
      const lemonIncrease = investment.increaseLemonPrice ? investment.lemonPriceIncrease : 0;
      const annualPriceGrowthRate = lemonIncrease + inflationRate;
      const growthFactor = 1 + annualPriceGrowthRate / 100;
      
      const matureBasePrice = isRidermex ? 120000 : investment.certificateBasePrice;
      const finalCertificatePrice = matureBasePrice * Math.pow(growthFactor, Math.max(0, investment.years - 1));
      
      const patrimony = investment.initialCertificates * finalCertificatePrice;
      const gains = patrimony - initialInvestment;

      return (
        <div className="space-y-2">
          <div className="text-emerald-400 font-bold uppercase text-xs mb-1">Cálculo del Valor (Plusvalía)</div>
          <div>Tickets Iniciales: <span className="font-bold text-white">{investment.initialCertificates}</span></div>
          <div>× Valor Final del Ticket: <span className="font-bold text-white">{formatCurrency(convertFromMXN(finalCertificatePrice, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span></div>
          <div className="border-t border-slate-700 pt-2 mt-2 text-red-400 font-bold">
            Total Plusvalía: {formatCurrency(convertFromMXN(patrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}
          </div>
          <div className="mt-4 pt-2 border-t border-slate-700/50">
            <div className="text-emerald-400 font-bold uppercase text-xs mb-1">Cálculo de Ganancias</div>
            <div>Plusvalía Total: <span className="font-bold text-white">{formatCurrency(convertFromMXN(patrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span></div>
            <div>- Inversión Inicial: <span className="font-bold text-white">{formatCurrency(convertFromMXN(initialInvestment, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span></div>
            <div className="text-sm opacity-80 mt-1 italic">* Todo el flujo de efectivo mensual/anual se retira y NO compra nuevos tickets.</div>
          </div>
        </div>
      );
    },
    description: 'Representa el valor total de tus certificados originales al final del plazo, sumado a las ganancias que obtuviste únicamente por la plusvalía del certificado.'
  },
  'con-reinversion': {
    id: 'con-reinversion',
    title: 'Con Reinversión (Ridermex)',
    formula: (investment, results) => {
      const initialInvestment = investment.initialCertificates * investment.certificateBasePrice;
      const finalYearData = results.yearlyData[results.yearlyData.length - 1];
      const patrimony = finalYearData.citrusPatrimony;
      const gains = patrimony - initialInvestment;

      return (
        <div className="space-y-2">
          <div className="text-emerald-400 font-bold uppercase text-xs mb-1">Cálculo del Valor Total</div>
          <div>Tickets Iniciales: <span className="font-bold text-white">{investment.initialCertificates}</span></div>
          <div>+ Tickets Nuevos Adquiridos: <span className="font-bold text-white">{results.certificatesSummary.fromReinvestment}</span></div>
          <div className="border-t border-slate-700 pt-2 mt-2 text-neon-green font-bold">
            Valor de Todos los Tickets: {formatCurrency(convertFromMXN(patrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}
          </div>
          <div className="mt-4 pt-2 border-t border-slate-700/50">
            <div className="text-emerald-400 font-bold uppercase text-xs mb-1">Cálculo de Ganancias</div>
            <div>Valor Total: <span className="font-bold text-white">{formatCurrency(convertFromMXN(patrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span></div>
            <div>- Inversión Inicial: <span className="font-bold text-white">{formatCurrency(convertFromMXN(initialInvestment, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span></div>
            <div className="text-sm opacity-80 mt-1 italic">* El flujo de efectivo se reinvierte en el Fondo de Reinversión para comprar nuevos tickets.</div>
          </div>
        </div>
      );
    },
    description: 'Representa el valor total de TODOS tus certificados (los originales más los nuevos que compraste reinvirtiendo tus rendimientos). Genera el "Efecto Multiplicador".'
  },
  'roi': {
    id: 'roi',
    title: 'ROI (Retorno de Inversión)',
    formula: (investment, results) => {
      const initialInvestment = investment.initialCertificates * investment.certificateBasePrice;
      const finalYearData = results.yearlyData?.[results.yearlyData.length - 1];
      const cumulativeUtility = finalYearData ? finalYearData.cumulativeTotalUtility : 0;
      const roiPercentage = initialInvestment > 0 ? (cumulativeUtility / initialInvestment) * 100 : 0;
      return (
        <div className="space-y-2">
          <div>Rendimiento Acumulado: <span className="font-bold text-emerald-400">{formatCurrency(convertFromMXN(cumulativeUtility, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span></div>
          <div>÷ Inversión Inicial: <span className="font-bold text-white">{formatCurrency(convertFromMXN(initialInvestment, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span></div>
          <div>× 100</div>
          <div className="border-t border-slate-700 pt-2 mt-2 text-emerald-400 font-bold">
            ROI Proyectado: {roiPercentage.toFixed(2)}%
          </div>
        </div>
      );
    },
    description: 'El Retorno sobre la Inversión (ROI) para RiderMex se calcula basándose únicamente en los rendimientos o utilidades acumuladas a lo largo del periodo, sin considerar la plusvalía del certificado.'
  },
  'inversion-inicial': {
    id: 'inversion-inicial',
    title: 'Inversión Inicial',
    formula: (investment, results) => {
      const initialInvestment = investment.initialCertificates * investment.certificateBasePrice;
      return (
        <div className="space-y-2">
          <div>Número de Certificados: <span className="font-bold text-white">{investment.initialCertificates}</span></div>
          <div>× Precio por Certificado: <span className="font-bold text-white">{formatCurrency(convertFromMXN(investment.certificateBasePrice, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span></div>
          <div className="border-t border-slate-700 pt-2 mt-2 text-emerald-400 font-bold">
            Total Inversión Inicial: {formatCurrency(convertFromMXN(initialInvestment, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}
          </div>
        </div>
      );
    },
    description: 'Es el capital total aportado originalmente para adquirir tus certificados iniciales. Se calcula multiplicando la cantidad de certificados adquiridos por el precio base de preventa de cada uno.'
  },
  'ganancia-total': {
    id: 'ganancia-total',
    title: 'Ganancia Total',
    formula: (investment, results) => {
      const initialInvestment = investment.initialCertificates * investment.certificateBasePrice;
      const finalPatrimony = results.finalPatrimony;
      const totalGain = finalPatrimony - initialInvestment;
      return (
        <div className="space-y-2">
          <div>Patrimonio Final: <span className="font-bold text-white">{formatCurrency(convertFromMXN(finalPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span></div>
          <div>- Inversión Inicial: <span className="font-bold text-white">{formatCurrency(convertFromMXN(initialInvestment, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}</span></div>
          <div className="border-t border-slate-700 pt-2 mt-2 text-emerald-400 font-bold">
            Ganancia Total: {formatCurrency(convertFromMXN(totalGain, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}
          </div>
        </div>
      );
    },
    description: 'Es la utilidad neta total que genera tu inversión al final del periodo proyectado. Representa el incremento absoluto de tu patrimonio, restando tu capital inicial del valor final comercializado.'
  }
};

interface MetricExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  metricId: string | null;
  investment?: any;
  results?: any;
}

export function MetricExplanationModal({ isOpen, onClose, metricId, investment, results }: MetricExplanationModalProps) {
  if (!isOpen || !metricId || !METRIC_EXPLANATIONS[metricId]) return null;

  const metric = METRIC_EXPLANATIONS[metricId];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-800 rounded-2xl shadow-2xl border border-slate-600/50 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Info className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-neutral-50">
              {metric.title}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* Formula */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Calculator className="w-4 h-4 text-purple-400" />
              Fórmula y Valores
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700 font-mono text-sm text-purple-300 break-words">
              {typeof metric.formula === 'function' ? (investment && results ? metric.formula(investment, results) : 'Cargando datos...') : metric.formula}
            </div>
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Explicación
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {metric.description}
            </p>
          </div>
          
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-700/50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
