import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dream, DreamConfig } from '../../types/dreamSimulator';
import { formatCurrency } from '../../utils/formatters';
import { Investment } from '../../types';
import { ChevronRight, Target, Calendar, DollarSign, Plus, Minus, Ticket } from 'lucide-react';
import { optimizeCertificatesForGoal } from '../../utils/calculations/dreamSimulatorCalculations';
import { RIDERMEX_CONFIG } from '../../data/ridermexConfig';

interface DreamConfigurationProps {
  dream: Dream;
  config: DreamConfig;
  onConfigUpdate: (config: Partial<DreamConfig>) => void;
  onContinue: () => void;
  investment: Investment;
}

const DreamConfiguration: React.FC<DreamConfigurationProps> = ({
  dream,
  config,
  onConfigUpdate,
  onContinue,
  investment
}) => {
  const Icon = dream.icon;
  const [localMonthlyGoal, setLocalMonthlyGoal] = useState(config.monthlyGoal);
  const [localTimeframe, setLocalTimeframe] = useState(config.timeframe);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsCalculating(true);
      const requiredCertificates = optimizeCertificatesForGoal(
        {
          ...config,
          monthlyGoal: localMonthlyGoal,
          timeframe: localTimeframe
        },
        investment
      );
      onConfigUpdate({
        monthlyGoal: localMonthlyGoal,
        timeframe: localTimeframe,
        certificatesNeeded: requiredCertificates
      });
      setIsCalculating(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localMonthlyGoal, localTimeframe]);

  const ticketPrice = investment.ridermexEntryPrice || RIDERMEX_CONFIG.TICKET_PRICE;
  const totalInvestment = config.certificatesNeeded * ticketPrice;
  const annualReturnPerTicket = RIDERMEX_CONFIG.ANNUAL_RETURN_PER_TICKET;
  const estimatedAnnualReturn = config.certificatesNeeded * annualReturnPerTicket;
  const estimatedMonthlyReturn = estimatedAnnualReturn / 12;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-red-600 to-red-800 p-8 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{dream.name}</h2>
              <p className="text-red-200">{dream.description}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="p-8 space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-red-800">
              <strong>Ajusta tu meta:</strong> Modifica el ingreso mensual deseado y el plazo.
              El sistema calculara automaticamente cuantos tickets necesitas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-200 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-red-700" />
                </div>
                <h4 className="font-medium text-red-800">Meta Mensual</h4>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setLocalMonthlyGoal(Math.max(10000, localMonthlyGoal - 5000))}
                    className="w-10 h-10 bg-red-200 hover:bg-red-300 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-5 h-5 text-red-700" />
                  </button>
                  <div className="text-center flex-1">
                    <input
                      type="number"
                      value={localMonthlyGoal}
                      onChange={(e) => setLocalMonthlyGoal(Math.max(10000, parseInt(e.target.value) || 10000))}
                      className="w-full text-center text-2xl font-bold text-red-700 bg-transparent border-0 focus:outline-none"
                      step="5000"
                    />
                    <p className="text-sm text-red-600">MXN mensuales</p>
                  </div>
                  <button
                    onClick={() => setLocalMonthlyGoal(localMonthlyGoal + 5000)}
                    className="w-10 h-10 bg-red-200 hover:bg-red-300 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-5 h-5 text-red-700" />
                  </button>
                </div>

                <input
                  type="range"
                  min="10000"
                  max="200000"
                  step="5000"
                  value={localMonthlyGoal}
                  onChange={(e) => setLocalMonthlyGoal(parseInt(e.target.value))}
                  className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-amber-700" />
                </div>
                <h4 className="font-medium text-amber-800">Plazo</h4>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setLocalTimeframe(Math.max(5, localTimeframe - 1))}
                    className="w-10 h-10 bg-amber-200 hover:bg-amber-300 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-5 h-5 text-amber-700" />
                  </button>
                  <div className="text-center flex-1">
                    <input
                      type="number"
                      value={localTimeframe}
                      onChange={(e) => setLocalTimeframe(Math.max(5, Math.min(30, parseInt(e.target.value) || 5)))}
                      className="w-full text-center text-2xl font-bold text-amber-700 bg-transparent border-0 focus:outline-none"
                      min="5"
                      max="30"
                    />
                    <p className="text-sm text-amber-600">anos</p>
                  </div>
                  <button
                    onClick={() => setLocalTimeframe(Math.min(30, localTimeframe + 1))}
                    className="w-10 h-10 bg-amber-200 hover:bg-amber-300 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-5 h-5 text-amber-700" />
                  </button>
                </div>

                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={localTimeframe}
                  onChange={(e) => setLocalTimeframe(parseInt(e.target.value))}
                  className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-orange-100 p-6 rounded-xl relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-200 rounded-lg flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-red-700" />
                </div>
                <h4 className="font-medium text-red-800">Tickets RiderMex</h4>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-red-700 mb-1">
                  {isCalculating ? '...' : config.certificatesNeeded}
                </p>
                <p className="text-sm text-red-600">calculados automaticamente</p>
              </div>
              {isCalculating && (
                <div className="absolute inset-0 bg-red-50/50 rounded-xl flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Plan de Inversion RiderMex</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-gray-700 font-medium">Tickets RiderMex</span>
                  <p className="text-xs text-gray-500">{config.certificatesNeeded} x {formatCurrency(ticketPrice, investment.currencyFormat)}</p>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {formatCurrency(totalInvestment, investment.currencyFormat)}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                <div>
                  <span className="text-red-700 font-medium">Retorno Anual Estimado</span>
                  <p className="text-xs text-red-500">{config.certificatesNeeded} tickets x {formatCurrency(annualReturnPerTicket, investment.currencyFormat)}/ano</p>
                </div>
                <span className="text-xl font-bold text-red-700">
                  {formatCurrency(estimatedAnnualReturn, investment.currencyFormat)}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                <div>
                  <span className="text-orange-700 font-medium">Ingreso Mensual Estimado Inicial</span>
                  <p className="text-xs text-orange-500">Dividendos trimestrales / 3</p>
                </div>
                <span className="text-xl font-bold text-orange-700">
                  {formatCurrency(estimatedMonthlyReturn, investment.currencyFormat)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-orange-100 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4">Detalles de tu Sueno</h3>
            <ul className="space-y-3">
              {dream.details.map((detail, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-700 text-sm font-medium">{index + 1}</span>
                  </div>
                  <span className="text-gray-700">{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          <motion.div
            className="flex justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                window.scrollTo(0, 0);
                onContinue();
              }}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <span>Ver Proyeccion</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DreamConfiguration;
