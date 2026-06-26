import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ChevronRight, ChevronLeft, AlertCircle, Calendar, TrendingUp } from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';
import ReinvestmentWithdrawalPlan from '../reinvestmentCalculator/ReinvestmentWithdrawalPlan';
import { RIDERMEX_CONFIG } from '../../data/ridermexConfig';

interface Step09WithdrawalPlanProps {
  onNext: () => void;
  onPrevious: () => void;
  onStepChange?: (step: number) => void;
}

const startIncomeInfo = {
  A: {
    month: 7,
    text: 'Los primeros ingresos comenzarán a partir del mes 7 con el Modelo A (Contado Tradicional)',
    color: 'bg-blue-900/20 border-blue-700/50'
  },
  B: {
    month: 19,
    text: 'Los primeros ingresos comenzarán a partir del mes 19 con el Modelo B (Financiado 12m)',
    color: 'bg-emerald-900/20 border-emerald-700/50'
  },
  C: {
    month: 2,
    text: 'Los ingresos comienzan a partir del mes 2 con el Modelo C (Agencia Madura)',
    color: 'bg-amber-900/20 border-amber-700/50'
  },
  D: {
    month: 55,
    text: 'Los ingresos comenzarán 6 meses después de liquidar el plazo con el Modelo D (Financiado Flexible)',
    color: 'bg-purple-900/20 border-purple-700/50'
  }
};

const Step09WithdrawalPlan: React.FC<Step09WithdrawalPlanProps> = ({ onNext, onPrevious }) => {
  const { investment, toggleReinvest } = useCalculator();
  const productType = (investment.ridermexProductType as 'A' | 'B' | 'C' | 'D') || 'B';
  const info = startIncomeInfo[productType] || startIncomeInfo.B;
  const startMonth = productType === 'D'
    ? (investment.ridermexFinancingMonths || 48) + 7
    : info.month;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl border border-slate-700/50 shadow-2xl overflow-clip">
        {/* Header with RiderMex Branding */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white rounded-t-3xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-blue-900/30 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-blue-200">RM</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">Plan de Retiros Trimestrales</h2>
                <p className="text-white/80">Recibe ${RIDERMEX_CONFIG.QUARTERLY_PAYMENT.toLocaleString()} por ticket cada trimestre, respaldados por fideicomisos de RiderMex</p>
              </div>
            </div>

            {/* Reinvestment Toggle */}
            <motion.button
              onClick={toggleReinvest}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                investment.reinvestProfits
                  ? 'bg-white/20 text-white border-2 border-white shadow-lg'
                  : 'bg-white/10 text-white/60 border border-white/30'
              }`}
            >
              <TrendingUp className={`w-5 h-5 ${investment.reinvestProfits ? 'animate-pulse' : ''}`} />
              <div className="text-left">
                <div className="text-sm leading-tight">
                  {investment.reinvestProfits ? 'ICM Activado' : 'ICM Desactivado'}
                </div>
                <div className="text-xs opacity-75">
                  {investment.reinvestProfits ? 'Con reinversión' : 'Sin reinversión'}
                </div>
              </div>
            </motion.button>
          </div>

          {/* Income Start Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${info.color} border rounded-lg p-3 flex items-start gap-3`}
          >
            <Calendar className="w-5 h-5 mt-0.5 flex-shrink-0 text-neon-green" />
            <div>
              <p className="font-semibold text-neutral-50">Inicio de Ingresos: Mes {startMonth}</p>
              <p className="text-sm text-neutral-300 mt-1">{info.text}</p>
            </div>
          </motion.div>
        </div>

        {/* Withdrawal Plan Content - Component handles its own layout */}
        <ReinvestmentWithdrawalPlan onNext={onNext} onPrevious={onPrevious} />
      </div>
    </div>
  );
};

export default Step09WithdrawalPlan;