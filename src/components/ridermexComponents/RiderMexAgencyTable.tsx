import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AgencyData } from '../../utils/ridermexCalculations';
import { calculateAgencyMetrics } from '../../utils/ridermexCalculations';

interface RiderMexAgencyTableProps {
  agencies: AgencyData[];
  onSalesChange: (agencyId: string, sales: number) => void;
  feePerMoto: number;
}

const RiderMexAgencyTable: React.FC<RiderMexAgencyTableProps> = ({ agencies, onSalesChange, feePerMoto }) => {
  const MINIMUMS = { A: 32, B: 40, C: 50 };

  const getStatusColor = (status: AgencyData['status']) => {
    const colors = {
      inactive: 'from-red-600/20 to-red-700/20 border-red-500/30 text-red-300',
      active: 'from-yellow-600/20 to-yellow-700/20 border-yellow-500/30 text-yellow-300',
      bonus1: 'from-green-600/20 to-green-700/20 border-green-500/30 text-green-300',
      bonus2: 'from-blue-600/20 to-blue-700/20 border-blue-500/30 text-blue-300',
      bonus3: 'from-purple-600/20 to-purple-700/20 border-purple-500/30 text-purple-300'
    };
    return colors[status];
  };

  const getStatusLabel = (status: AgencyData['status']) => {
    const labels = {
      inactive: 'No activa',
      active: 'Fee Base',
      bonus1: 'Bono 1 (15%)',
      bonus2: 'Bono 2 (25%)',
      bonus3: 'Bono 3 (35%)'
    };
    return labels[status];
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-b from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-widest">
                Agencia
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-widest">
                Modelo
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-300 uppercase tracking-widest">
                Mín. Ventas
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-300 uppercase tracking-widest">
                Ventas Reales
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-widest">
                Fee Mensual
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-widest">
                Bono Mensual
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-300 uppercase tracking-widest">
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {agencies.map((agency, idx) => {
              const minimum = MINIMUMS[agency.model];
              const metrics = calculateAgencyMetrics(agency, feePerMoto);

              return (
                <motion.tr
                  key={agency.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-slate-700/30 hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4 text-white font-medium">{agency.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-700/50 text-slate-200">
                      Modelo {agency.model}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-slate-300">{minimum} motos</td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      value={agency.monthlySales}
                      onChange={(e) => onSalesChange(agency.id, parseInt(e.target.value))}
                      className="w-20 px-2 py-1 bg-slate-700/50 border border-slate-600 rounded text-white text-center focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50"
                    />
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-green-400">
                    {formatCurrency(metrics.monthlyFee)}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-blue-400">
                    {formatCurrency(metrics.monthlyBonus)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border bg-gradient-to-r ${getStatusColor(
                        metrics.status
                      )}`}
                    >
                      {getStatusLabel(metrics.status)}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Row */}
      <div className="border-t border-slate-700/50 px-6 py-4 bg-slate-800/30">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-300">
            <strong className="text-white">{agencies.length}</strong> agencias |
            <strong className="text-red-400 ml-2">{agencies.reduce((sum, a) => sum + a.monthlySales, 0)}</strong> motos/mes
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default RiderMexAgencyTable;
