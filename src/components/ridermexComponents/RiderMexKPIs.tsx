import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Percent, Clock, Target, Zap } from 'lucide-react';
import { RiderMexResults } from '../../utils/ridermexCalculations';

interface RiderMexKPIsProps {
  results: RiderMexResults;
  investmentAmount: number;
}

const RiderMexKPIs: React.FC<RiderMexKPIsProps> = ({ results, investmentAmount }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(value);
  };

  const kpis = [
    {
      label: 'Inversión Total',
      value: formatCurrency(investmentAmount),
      icon: DollarSign,
      color: 'from-red-600 to-red-700',
      textColor: 'text-red-400'
    },
    {
      label: 'Tickets Equivalentes',
      value: results.userTickets.toLocaleString(),
      icon: Target,
      color: 'from-orange-600 to-orange-700',
      textColor: 'text-orange-400'
    },
    {
      label: '% del Fondo',
      value: results.fundPercentage.toFixed(2) + '%',
      icon: Percent,
      color: 'from-amber-600 to-amber-700',
      textColor: 'text-amber-400'
    },
    {
      label: 'Motos Vendidas/Mes',
      value: results.totalMotosSold.toLocaleString(),
      icon: Zap,
      color: 'from-green-600 to-green-700',
      textColor: 'text-green-400'
    },
    {
      label: 'Rendimiento Mensual',
      value: formatCurrency(results.monthlyUserReturn),
      icon: TrendingUp,
      color: 'from-blue-600 to-blue-700',
      textColor: 'text-blue-400'
    },
    {
      label: 'ROI Anual',
      value: results.annualROI.toFixed(2) + '%',
      icon: Percent,
      color: 'from-purple-600 to-purple-700',
      textColor: 'text-purple-400'
    },
    {
      label: 'Utilidad Anual',
      value: formatCurrency(results.annualUserReturn),
      icon: DollarSign,
      color: 'from-cyan-600 to-cyan-700',
      textColor: 'text-cyan-400'
    },
    {
      label: 'Payback (Meses)',
      value: results.paybackMonths.toFixed(1),
      icon: Clock,
      color: 'from-pink-600 to-pink-700',
      textColor: 'text-pink-400'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group"
            >
              <div className={`bg-gradient-to-br ${kpi.color} p-0.5 rounded-xl`}>
                <div className="bg-slate-900 rounded-[10px] p-5 h-full">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                    <div className={`w-8 h-8 bg-slate-800/50 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${kpi.textColor}`} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white leading-tight">{kpi.value}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 bg-gradient-to-r from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Fee Base Mensual</p>
            <p className="text-3xl font-bold text-green-400">{formatCurrency(results.monthlyFeeTotal)}</p>
            <p className="text-xs text-slate-400 mt-1">{results.totalMotosSold} motos x 900 MXN</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Bonos Mensuales</p>
            <p className="text-3xl font-bold text-blue-400">{formatCurrency(results.monthlyBonusTotal)}</p>
            <p className="text-xs text-slate-400 mt-1">Por desempeño superior</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Total Mensual (Fondo)</p>
            <p className="text-3xl font-bold text-red-400">
              {formatCurrency(results.monthlyFeeTotal + results.monthlyBonusTotal)}
            </p>
            <p className="text-xs text-slate-400 mt-1">Base + Bonos</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RiderMexKPIs;
