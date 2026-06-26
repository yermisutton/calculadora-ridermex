import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { Download, TrendingUp } from 'lucide-react';
import { MonthlyProjection } from '../../utils/ridermexCalculations';
import { formatCurrency } from '../../utils/formatters';

interface MonthlyFlowChartProps {
  monthlyProjection: MonthlyProjection[];
  investmentAmount: number;
}

type ViewMode = 'chart' | 'table';

const MonthlyFlowChart: React.FC<MonthlyFlowChartProps> = ({ monthlyProjection, investmentAmount }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const yearlyData = useMemo(() => {
    const years: { [key: number]: MonthlyProjection[] } = {};
    monthlyProjection.forEach(item => {
      if (!years[item.year]) years[item.year] = [];
      years[item.year].push(item);
    });
    return Object.entries(years).map(([year, data]) => ({
      year: parseInt(year),
      data,
      totalFlow: data.reduce((sum, item) => sum + item.monthlyFlow, 0),
      yearEndCumulative: data[data.length - 1]?.cumulativeFlow || 0
    }));
  }, [monthlyProjection]);

  const chartData = useMemo(() => {
    if (selectedYear) {
      return yearlyData.find(y => y.year === selectedYear)?.data.map((item, idx) => ({
        name: `M${item.month}`,
        monthlyFlow: Math.round(item.monthlyFlow),
        cumulativeFlow: Math.round(item.cumulativeFlow)
      })) || [];
    }
    return yearlyData.map(y => ({
      name: `Año ${y.year}`,
      monthlyFlow: Math.round(y.totalFlow),
      cumulativeFlow: Math.round(y.yearEndCumulative)
    }));
  }, [yearlyData, selectedYear]);

  const paybackYear = useMemo(() => {
    return monthlyProjection.find(m => m.cumulativeFlow >= investmentAmount)?.year || null;
  }, [monthlyProjection, investmentAmount]);

  const formatValue = (value: number) => {
    return `$${Math.round(value).toLocaleString('es-MX')}`;
  };

  const monthlyWithAnnualFlow = useMemo(() => {
    const result: (MonthlyProjection & { annualFlow: number })[] = [];
    let currentYearFlow = 0;
    let lastYear: number | null = null;

    monthlyProjection.forEach(item => {
      if (item.year !== lastYear) {
        currentYearFlow = 0;
        lastYear = item.year;
      }
      currentYearFlow += item.monthlyFlow;
      result.push({
        ...item,
        annualFlow: currentYearFlow
      });
    });

    return result;
  }, [monthlyProjection]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h3 className="text-xl font-bold text-white">Flujo Mensual de Ingresos</h3>
            </div>
            <p className="text-slate-400 text-sm">Proyección {monthlyProjection.length / 12} años - {monthlyProjection.length} meses</p>
          </div>
          {paybackYear && (
            <div className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg">
              <p className="text-xs text-slate-400">Recuperación de inversión</p>
              <p className="text-lg font-bold text-green-400">Año {paybackYear}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setViewMode('chart')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              viewMode === 'chart'
                ? 'bg-green-600 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
            }`}
          >
            Gráfico
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              viewMode === 'table'
                ? 'bg-green-600 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
            }`}
          >
            Tabla
          </button>
          <button
            onClick={() => setSelectedYear(selectedYear ? null : 1)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedYear
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
            }`}
          >
            {selectedYear ? `Año ${selectedYear} (click para volver)` : 'Ver por Año'}
          </button>
        </div>

        {selectedYear && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {yearlyData.map(y => (
              <button
                key={y.year}
                onClick={() => setSelectedYear(y.year)}
                className={`px-3 py-1 text-sm rounded-lg transition-all ${
                  selectedYear === y.year
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                }`}
              >
                Año {y.year}
              </button>
            ))}
          </div>
        )}
      </div>

      {viewMode === 'chart' ? (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.3)" />
              <XAxis
                dataKey="name"
                tick={{ fill: 'rgb(148, 163, 184)', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fill: 'rgb(148, 163, 184)', fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(100, 116, 139, 0.5)',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => formatValue(value)}
                labelStyle={{ color: 'rgb(226, 232, 240)' }}
              />
              <Legend
                wrapperStyle={{ color: 'rgb(148, 163, 184)' }}
                iconType="line"
              />
              <Bar
                dataKey="monthlyFlow"
                fill="rgba(34, 197, 94, 0.6)"
                name="Flujo Mensual"
                radius={[8, 8, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="cumulativeFlow"
                stroke="rgb(34, 197, 94)"
                name="Flujo Acumulado"
                strokeWidth={3}
                dot={{ fill: 'rgb(34, 197, 94)', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-900/50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Mes</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Año</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-green-400">Flujo Mensual</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-green-400">Flujo Anual</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-green-400">Acumulado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {monthlyWithAnnualFlow.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`${
                      item.cumulativeFlow >= investmentAmount
                        ? 'bg-green-500/10'
                        : idx % 2 === 0
                        ? 'bg-slate-800/20'
                        : 'bg-transparent'
                    } hover:bg-slate-700/20 transition-colors`}
                  >
                    <td className="px-6 py-3 text-sm text-slate-400">{item.month}</td>
                    <td className="px-6 py-3 text-sm text-slate-400">{item.year}</td>
                    <td className="px-6 py-3 text-sm text-green-400 text-right font-semibold">
                      {formatCurrency(item.monthlyFlow)}
                    </td>
                    <td className="px-6 py-3 text-sm text-green-400 text-right font-semibold">
                      {formatCurrency(item.annualFlow)}
                    </td>
                    <td className="px-6 py-3 text-sm text-green-400 text-right font-bold">
                      {formatCurrency(item.cumulativeFlow)}
                      {item.cumulativeFlow >= investmentAmount && idx === monthlyWithAnnualFlow.findIndex(m => m.cumulativeFlow >= investmentAmount) && (
                        <span className="ml-2 text-xs text-green-300 font-semibold">✓ RECUPERADO</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
          <p className="text-slate-400 text-xs font-semibold mb-1">Inversión Inicial</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(investmentAmount)}</p>
        </div>
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
          <p className="text-slate-400 text-xs font-semibold mb-1">Total Años</p>
          <p className="text-2xl font-bold text-white">{monthlyProjection.length / 12}</p>
        </div>
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
          <p className="text-slate-400 text-xs font-semibold mb-1">Total Acumulado</p>
          <p className="text-2xl font-bold text-green-400">
            {formatCurrency(monthlyProjection[monthlyProjection.length - 1]?.cumulativeFlow || 0)}
          </p>
        </div>
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
          <p className="text-slate-400 text-xs font-semibold mb-1">ROI Total</p>
          <p className="text-2xl font-bold text-blue-400">
            {(((monthlyProjection[monthlyProjection.length - 1]?.cumulativeFlow || 0) / investmentAmount - 1) * 100).toFixed(0)}%
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default MonthlyFlowChart;
