import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, ChevronDown, ChevronUp, DollarSign, Calendar, Percent } from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

const AmortizationTable: React.FC = () => {
  const { investment, updateInvestment } = useCalculator();
  const [isExpanded, setIsExpanded] = useState(false);
  const [downPaymentPercent, setDownPaymentPercent] = useState(investment.financingDownPaymentPercent ?? 30);
  const [annualInterestRate, setAnnualInterestRate] = useState(investment.financingAnnualInterestRate ?? 12);

  const totalInvestment = investment.initialCertificates * investment.certificateBasePrice;

  React.useEffect(() => {
    if (investment.financingDownPaymentPercent !== undefined && investment.financingDownPaymentPercent !== downPaymentPercent) {
      setDownPaymentPercent(investment.financingDownPaymentPercent);
    }
    if (investment.financingAnnualInterestRate !== undefined && investment.financingAnnualInterestRate !== annualInterestRate) {
      setAnnualInterestRate(investment.financingAnnualInterestRate);
    }
  }, [investment.financingDownPaymentPercent, investment.financingAnnualInterestRate]);

  const handleDownPaymentChange = (value: number) => {
    setDownPaymentPercent(value);
    updateInvestment({ financingDownPaymentPercent: value });
  };

  const handleInterestRateChange = (value: number) => {
    setAnnualInterestRate(value);
    updateInvestment({ financingAnnualInterestRate: value });
  };

  const amortizationData = useMemo(() => {
    const downPayment = totalInvestment * (downPaymentPercent / 100);
    const loanAmount = totalInvestment - downPayment;
    const months = 48;
    const monthlyRate = annualInterestRate / 100 / 12;

    let monthlyPayment: number;
    if (annualInterestRate === 0) {
      monthlyPayment = loanAmount / months;
    } else {
      monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
                            (Math.pow(1 + monthlyRate, months) - 1);
    }

    let balance = loanAmount;
    const schedule: AmortizationRow[] = [];

    for (let month = 1; month <= months; month++) {
      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;
      balance = Math.max(0, balance - principal);

      schedule.push({
        month,
        payment: monthlyPayment,
        principal,
        interest,
        balance
      });
    }

    return {
      downPayment,
      loanAmount,
      monthlyPayment: isNaN(monthlyPayment) ? 0 : monthlyPayment,
      totalInterest: schedule.reduce((sum, row) => sum + row.interest, 0),
      totalPaid: downPayment + (monthlyPayment * months),
      schedule
    };
  }, [totalInvestment, downPaymentPercent, annualInterestRate]);

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg border-2 border-green-200 overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-white/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-gray-900">Plan de Financiamiento</h3>
            <p className="text-sm text-gray-600">Tabla de amortización a 48 meses</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-6 h-6 text-gray-600" />
        ) : (
          <ChevronDown className="w-6 h-6 text-gray-600" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 pb-6"
          >
            <div className="bg-white rounded-xl p-6 space-y-6">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Monto Total
                    </div>
                    <div className="text-xl font-bold text-gray-900">
                      {formatCurrency(totalInvestment)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Pago Mensual
                    </div>
                    <div className="text-xl font-bold text-green-700">
                      {formatCurrency(amortizationData.monthlyPayment)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                      <Percent className="w-3 h-3" />
                      Interés Total
                    </div>
                    <div className="text-xl font-bold text-orange-600">
                      {formatCurrency(amortizationData.totalInterest)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      Enganche
                    </span>
                    <span className="text-2xl font-bold text-green-700">
                      {downPaymentPercent}%
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={downPaymentPercent}
                      onChange={(e) => handleDownPaymentChange(parseFloat(e.target.value))}
                      className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #10b981 0%, #10b981 ${downPaymentPercent}%, #e5e7eb ${downPaymentPercent}%, #e5e7eb 100%)`
                      }}
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="5"
                      value={downPaymentPercent}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (val >= 0 && val <= 100) {
                          handleDownPaymentChange(val);
                        }
                      }}
                      className="w-24 px-3 py-2 border-2 border-gray-300 rounded-lg text-center font-semibold text-gray-900 focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </label>

                <label className="block mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      Tasa de Interés Anual
                    </span>
                    <span className="text-2xl font-bold text-blue-700">
                      {annualInterestRate}%
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="30"
                      step="0.5"
                      value={annualInterestRate}
                      onChange={(e) => handleInterestRateChange(parseFloat(e.target.value))}
                      className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(annualInterestRate / 30) * 100}%, #e5e7eb ${(annualInterestRate / 30) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <input
                      type="number"
                      min="0"
                      max="30"
                      step="0.5"
                      value={annualInterestRate}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (val >= 0 && val <= 30) {
                          handleInterestRateChange(val);
                        }
                      }}
                      className="w-24 px-3 py-2 border-2 border-gray-300 rounded-lg text-center font-semibold text-gray-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span className="text-gray-600">{(annualInterestRate / 12).toFixed(2)}% mensual</span>
                    <span>30%</span>
                  </div>
                </label>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Enganche</div>
                    <div className="text-lg font-bold text-green-700">
                      {formatCurrency(amortizationData.downPayment)}
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Monto a Financiar</div>
                    <div className="text-lg font-bold text-blue-700">
                      {formatCurrency(amortizationData.loanAmount)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tabla de Amortización (48 meses a {annualInterestRate}% anual)
                </h4>

                <div className="overflow-x-auto max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Mes</th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-700">Pago</th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-700">Capital</th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-700">Interés</th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-700">Saldo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amortizationData.schedule.map((row, index) => (
                        <tr
                          key={row.month}
                          className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        >
                          <td className="px-3 py-2 font-medium text-gray-900">{row.month}</td>
                          <td className="px-3 py-2 text-right text-gray-900">
                            {formatCurrency(row.payment)}
                          </td>
                          <td className="px-3 py-2 text-right text-green-700">
                            {formatCurrency(row.principal)}
                          </td>
                          <td className="px-3 py-2 text-right text-orange-600">
                            {formatCurrency(row.interest)}
                          </td>
                          <td className="px-3 py-2 text-right text-blue-700 font-semibold">
                            {formatCurrency(row.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gradient-to-r from-gray-700 to-gray-900 text-white sticky bottom-0">
                      <tr>
                        <td className="px-3 py-3 font-bold text-left">TOTALES</td>
                        <td className="px-3 py-3 text-right font-bold">
                          {formatCurrency(amortizationData.monthlyPayment * 48)}
                        </td>
                        <td className="px-3 py-3 text-right font-bold text-green-300">
                          {formatCurrency(amortizationData.loanAmount)}
                        </td>
                        <td className="px-3 py-3 text-right font-bold text-orange-300">
                          {formatCurrency(amortizationData.totalInterest)}
                        </td>
                        <td className="px-3 py-3 text-right font-bold text-blue-300">
                          $0.00
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {(() => {
                const minInterestRate = 12;
                const minMonthlyRate = minInterestRate / 100 / 12;
                const months = 48;
                const loanAmount = amortizationData.loanAmount;

                let minMonthlyPayment: number;
                if (minInterestRate === 0) {
                  minMonthlyPayment = loanAmount / months;
                } else {
                  minMonthlyPayment = loanAmount * (minMonthlyRate * Math.pow(1 + minMonthlyRate, months)) /
                                      (Math.pow(1 + minMonthlyRate, months) - 1);
                }

                const minTotalInterest = (minMonthlyPayment * months) - loanAmount;
                const costWithMinInterest = amortizationData.downPayment + (minMonthlyPayment * months);
                const actualTotalWithInterest = amortizationData.downPayment + (amortizationData.monthlyPayment * months);
                const discount = costWithMinInterest - actualTotalWithInterest;
                const hasDiscount = annualInterestRate < minInterestRate;

                return (
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                    <h4 className="font-bold text-gray-900 mb-4 text-lg">Resumen de Ahorro</h4>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="text-sm text-gray-600">Costo del certificado</span>
                        <span className="font-bold text-gray-900">{formatCurrency(totalInvestment)}</span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="text-sm text-gray-600">
                          Intereses {hasDiscount ? `(mínimo ${minInterestRate}%)` : `(${annualInterestRate}%)`}
                        </span>
                        <span className="font-bold text-orange-600">
                          {hasDiscount ? formatCurrency(minTotalInterest) : formatCurrency(amortizationData.totalInterest)}
                        </span>
                      </div>

                      {hasDiscount && (
                        <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg border-2 border-green-300">
                          <span className="text-sm font-semibold text-green-700">
                            Descuento (ahorro vs {minInterestRate}%)
                          </span>
                          <span className="font-bold text-green-700 text-lg">
                            -{formatCurrency(discount)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg mt-4">
                        <span className="text-white font-bold text-lg">Total a Pagar</span>
                        <span className="font-bold text-white text-2xl">
                          {formatCurrency(actualTotalWithInterest)}
                        </span>
                      </div>

                      {hasDiscount && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                          <div className="flex items-start gap-2">
                            <div className="text-2xl">✅</div>
                            <div>
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold text-green-700">Beneficio:</span> Al obtener una tasa del {annualInterestRate}%
                                en lugar del mínimo del {minInterestRate}%, ahorras <span className="font-bold text-green-700">{formatCurrency(discount)}</span> en
                                intereses durante los 48 meses de financiamiento.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <div className="text-2xl">💡</div>
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-orange-700">Nota:</span> Este plan de financiamiento
                      utiliza una tasa de interés del {annualInterestRate}% anual ({(annualInterestRate / 12).toFixed(2)}% mensual).
                      Puedes ajustar el enganche de 0% a 100% del monto total de inversión.
                      Los pagos se calculan mediante el sistema de amortización francés{annualInterestRate === 0 ? ' con división simple' : ''}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AmortizationTable;
