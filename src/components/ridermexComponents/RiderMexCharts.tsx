import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { RiderMexResults, AgencyData } from '../../utils/ridermexCalculations';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RiderMexChartsProps {
  results: RiderMexResults;
  agencies: AgencyData[];
}

const RiderMexCharts: React.FC<RiderMexChartsProps> = ({ results, agencies }) => {
  const [activeChart, setActiveChart] = useState(0);

  const MINIMUMS = { A: 32, B: 40, C: 50 };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      notation: 'compact',
      compactDisplay: 'short'
    }).format(value);
  };

  const projectionData = results.yearlyProjection.map((year) => ({
    year: `Año ${year.year}`,
    fee: year.totalFeeAnnual,
    bonus: year.totalBonusAnnual,
    userReturn: year.userReturnAnnual
  }));

  const agencyModelData = [
    {
      name: 'Modelo A',
      count: agencies.filter(a => a.model === 'A').length,
      sales: agencies.filter(a => a.model === 'A').reduce((sum, a) => sum + a.monthlySales, 0),
      fill: '#3b82f6'
    },
    {
      name: 'Modelo B',
      count: agencies.filter(a => a.model === 'B').length,
      sales: agencies.filter(a => a.model === 'B').reduce((sum, a) => sum + a.monthlySales, 0),
      fill: '#10b981'
    },
    {
      name: 'Modelo C',
      count: agencies.filter(a => a.model === 'C').length,
      sales: agencies.filter(a => a.model === 'C').reduce((sum, a) => sum + a.monthlySales, 0),
      fill: '#f59e0b'
    }
  ];

  const feeCompositionData = [
    {
      name: 'Fee Base',
      value: results.monthlyFeeTotal,
      fill: '#10b981'
    },
    {
      name: 'Bonos',
      value: results.monthlyBonusTotal,
      fill: '#3b82f6'
    }
  ];

  const charts = [
    {
      title: 'Proyección de Rendimiento (5 años)',
      render: () => (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="year" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #444', borderRadius: '8px' }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="fee"
              stroke="#10b981"
              strokeWidth={2}
              name="Fee Base"
              dot={{ fill: '#10b981' }}
            />
            <Line
              type="monotone"
              dataKey="bonus"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Bonos"
              dot={{ fill: '#3b82f6' }}
            />
            <Line
              type="monotone"
              dataKey="userReturn"
              stroke="#f59e0b"
              strokeWidth={2}
              name="Tu Rendimiento"
              dot={{ fill: '#f59e0b' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )
    },
    {
      title: 'Composición de Ingresos Mensuales',
      render: () => (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={feeCompositionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {feeCompositionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>
      )
    },
    {
      title: 'Ventas Mensuales por Modelo',
      render: () => (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={agencyModelData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #444', borderRadius: '8px' }}
            />
            <Bar dataKey="sales" fill="#ec4899" name="Motos Vendidas" />
          </BarChart>
        </ResponsiveContainer>
      )
    }
  ];

  const handlePrev = () => {
    setActiveChart((prev) => (prev - 1 + charts.length) % charts.length);
  };

  const handleNext = () => {
    setActiveChart((prev) => (prev + 1) % charts.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-8"
    >
      <div className="bg-gradient-to-b from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">{charts[activeChart].title}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-400" />
              </button>
              <span className="text-xs text-slate-400">
                {activeChart + 1} / {charts.length}
              </span>
              <button
                onClick={handleNext}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <motion.div
            key={activeChart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {charts[activeChart].render()}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default RiderMexCharts;
