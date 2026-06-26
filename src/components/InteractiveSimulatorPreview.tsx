import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Clock, Target, AlertCircle, PlayCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { optimizeCertificatesForGoal, calculateProjections } from '../utils/calculations/dreamSimulatorCalculations';
import { Investment } from '../types';

interface InteractiveSimulatorPreviewProps {
  onGetStarted: () => void;
  buttonText?: string;
  defaultMonthlyGoal?: number;
  defaultTimeframe?: number;
}

const InteractiveSimulatorPreview: React.FC<InteractiveSimulatorPreviewProps> = ({
  onGetStarted,
  buttonText = 'Ver proyección completa',
  defaultMonthlyGoal = 80000,
  defaultTimeframe = 25
}) => {
  const [monthlyGoal, setMonthlyGoal] = useState(defaultMonthlyGoal);
  const [timeframe, setTimeframe] = useState(defaultTimeframe);

  const certificatePrice = 266000;
  const certificateYield = 0.09;
  const averageProductionPerHectare = 42.7;
  const averageSalePricePerKg = 30;
  const investorFactor = averageProductionPerHectare * averageSalePricePerKg;

  const createInvestmentObject = (): Investment => {
    return {
      id: 'preview',
      initialAmount: certificatePrice,
      monthlyContribution: 0,
      reinvestmentPercentage: 100,
      years: timeframe,
      annualRate: certificateYield,
      certificateQuantity: 1,
      certificatePurchasePrice: certificatePrice,
      inflationRate: 0.04,
      currencyFormat: 'MXN',
      date: new Date().toISOString(),
      includeInflation: true,
      compoundingFrequency: 12,
      taxRate: 0,
      adjustForInflation: true,
      realEstateRent: 0,
      ebitdaFactor: 0,
      averageProductionPerHectare,
      averageSalePricePerKg,
      isLongTermCalculator: false,
      firstYearUtilityToUser: false,
      commissionRate: 0,
      citrusReinvestment: false,
      citrusReinvestmentPercentages: [],
      enablePaymentBoost: false,
      paymentBoostGrowthRate: 0,
      investorFactor,
      investorName: '',
      investorPhone: '',
      investorEmail: '',
      executiveName: '',
      executivePhone: '',
      executiveEmail: '',
      isHumanReadable: false
    };
  };

  const investment = createInvestmentObject();

  const requiredCertificates = optimizeCertificatesForGoal(
    {
      id: 'custom',
      monthlyGoal,
      timeframe,
      certificatesNeeded: 1,
      isCustom: false,
      reinvestProfits: true
    },
    investment
  );

  const totalInvestment = requiredCertificates * certificatePrice;
  const downPayment = totalInvestment * 0.3;
  const monthlyPayment = (totalInvestment * 0.7) / 48;

  const projections = calculateProjections(
    {
      id: 'custom',
      monthlyGoal,
      timeframe,
      certificatesNeeded: requiredCertificates,
      isCustom: false,
      reinvestProfits: true
    },
    investment
  );

  const finalProjection = projections[projections.length - 1];

  const goalReachedIndex = projections.findIndex(p => p.monthlyIncome >= monthlyGoal);
  const goalReachedYear = goalReachedIndex >= 0 ? goalReachedIndex + 1 : 0;
  const goalReached = goalReachedYear > 0;
  const goalProjection = goalReached ? projections[goalReachedIndex] : null;

  return (
    <section id="simulador" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Ajusta y <span className="text-green-600">Visualiza</span> en Tiempo Real
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Mueve los controles y ve cómo cambia tu plan de inversión instantáneamente
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl shadow-xl p-8"
        >
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
            <p className="text-sm text-blue-800">
              <strong>💡 Demo Interactiva:</strong> Ajusta los valores manualmente o usa los sliders para ver cómo cambian los certificados necesarios en tiempo real
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-700" />
                </div>
                <h4 className="font-bold text-green-800 text-lg">Meta Mensual</h4>
              </div>

              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-bold text-gray-400">$</span>
                  <input
                    type="number"
                    value={monthlyGoal}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setMonthlyGoal(Math.max(0, value));
                    }}
                    className="text-4xl font-bold text-green-700 bg-transparent border-b-2 border-green-300 focus:border-green-500 outline-none text-center w-48 transition-colors"
                    min="0"
                    step="1000"
                  />
                  <span className="text-xl font-medium text-gray-500">MXN</span>
                </div>
                <p className="text-sm text-green-600 mt-2">ingreso pasivo mensual</p>
              </div>

              <input
                type="range"
                min="10000"
                max="200000"
                step="5000"
                value={Math.min(monthlyGoal, 200000)}
                onChange={(e) => setMonthlyGoal(parseInt(e.target.value))}
                className="w-full h-3 bg-green-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>$10k</span>
                <span>$200k (usar input para valores mayores)</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-700" />
                </div>
                <h4 className="font-bold text-blue-800 text-lg">Plazo</h4>
              </div>

              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2">
                  <input
                    type="number"
                    value={timeframe}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      setTimeframe(Math.max(1, value));
                    }}
                    className="text-4xl font-bold text-blue-700 bg-transparent border-b-2 border-blue-300 focus:border-blue-500 outline-none text-center w-24 transition-colors"
                    min="1"
                    step="1"
                  />
                  <span className="text-xl font-medium text-gray-500">años</span>
                </div>
                <p className="text-sm text-blue-600 mt-2">plazo de inversión</p>
              </div>

              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={Math.min(timeframe, 30)}
                onChange={(e) => setTimeframe(parseInt(e.target.value))}
                className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>5 años</span>
                <span>30 años (usar input para valores mayores)</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white mb-2">
                <Target className="w-6 h-6" />
                <span className="text-3xl font-bold">{requiredCertificates}</span>
              </div>
              <p className="text-sm text-gray-600">certificados calculados automáticamente</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Inversión Total</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalInvestment, 'MXN')}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm text-green-600 mb-1">Enganche (30%)</p>
                <p className="text-xl font-bold text-green-700">{formatCurrency(downPayment, 'MXN')}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-blue-600 mb-1">Pago Mensual (48m)</p>
                <p className="text-xl font-bold text-blue-700">{formatCurrency(monthlyPayment, 'MXN')}</p>
              </div>
            </div>

            {goalReached && (
              <div className="mt-6 p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white shadow-lg">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Target className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">¡Meta Alcanzada!</h3>
                </div>
                <div className="text-center">
                  <p className="text-lg mb-2">
                    Llegarás a tu meta de <strong>{formatCurrency(monthlyGoal, 'MXN')}</strong> mensuales
                  </p>
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Clock className="w-6 h-6" />
                    <span className="text-3xl font-bold">Año {goalReachedYear}</span>
                  </div>
                  <p className="text-sm mt-3 opacity-90">
                    Con {goalProjection?.totalCertificates || 0} certificados generando {formatCurrency(goalProjection?.monthlyIncome || 0, 'MXN')} mensuales
                  </p>
                </div>
              </div>
            )}

            {!goalReached && (
              <div className="mt-6 p-6 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl text-white shadow-lg">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <AlertCircle className="w-8 h-8" />
                  <h3 className="text-xl font-bold">Ajusta tu estrategia</h3>
                </div>
                <p className="text-center">
                  Con esta configuración alcanzarás <strong>{formatCurrency(finalProjection?.monthlyIncome || 0, 'MXN')}</strong> mensuales en {timeframe} años.
                  <br />
                  <span className="text-sm opacity-90">Necesitas {requiredCertificates > 0 ? 'más certificados o más tiempo' : 'ajustar los valores'} para llegar a tu meta de {formatCurrency(monthlyGoal, 'MXN')}</span>
                </p>
              </div>
            )}

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h4 className="font-bold text-gray-900 mb-4 text-center">Proyección al año {timeframe}</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Certificados</p>
                  <p className="text-2xl font-bold text-emerald-600">{finalProjection?.totalCertificates || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ingreso Mensual</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(finalProjection?.monthlyIncome || 0, 'MXN')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Patrimonio</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(finalProjection?.patrimony || 0, 'MXN')}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
          >
            <PlayCircle className="w-5 h-5" />
            {buttonText}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveSimulatorPreview;
