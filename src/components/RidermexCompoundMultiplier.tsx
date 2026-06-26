import React, { useMemo, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Zap, Target, Award } from 'lucide-react';
import { calculateRidermexCompoundGrowth, RidermexCompoundResult, generateRidermexCompoundExplanation } from '../utils/ridermexCompoundCalculations';

interface RidermexCompoundMultiplierProps {
  initialTickets: number;
  ticketPrice: number;
  annualReturnPercentage: number;
  years: number;
  reinvestPercentage?: number;
  theme?: 'dark' | 'light';
  onReinvestmentStrategyChange?: (percentage: number) => void;
}

const RidermexCompoundMultiplier: React.FC<RidermexCompoundMultiplierProps> = ({
  initialTickets,
  ticketPrice,
  annualReturnPercentage,
  years,
  reinvestPercentage: initialReinvestPercentage = 100,
  theme = 'dark',
  onReinvestmentStrategyChange
}) => {
  const [reinvestPercentage, setReinvestPercentage] = useState(initialReinvestPercentage);
  const [chartType, setChartType] = useState<'tickets' | 'patrimony' | 'income'>('tickets');

  const isDark = theme === 'dark';
  const bgCard = isDark ? 'bg-dark-card' : 'bg-white';
  const bgSurface = isDark ? 'bg-dark-surface' : 'bg-gray-50';
  const borderColor = isDark ? 'border-dark-border' : 'border-gray-200';
  const textPrimary = isDark ? 'text-neutral-100' : 'text-gray-900';
  const textSecondary = isDark ? 'text-neutral-400' : 'text-gray-500';

  const result = useMemo(() => {
    return calculateRidermexCompoundGrowth(
      initialTickets,
      ticketPrice,
      annualReturnPercentage,
      years,
      reinvestPercentage
    );
  }, [initialTickets, ticketPrice, annualReturnPercentage, years, reinvestPercentage]);

  const handleReinvestmentChange = (value: number) => {
    setReinvestPercentage(value);
    onReinvestmentStrategyChange?.(value);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const chartData = result.yearData.map(year => ({
    year: year.year,
    tickets: year.totalTickets,
    patrimony: Math.round(year.patrimony),
    monthlyIncome: Math.round(year.monthlyIncome),
    originalTickets: initialTickets
  }));

  return (
    <div className={`${bgCard} rounded-xl border ${borderColor} overflow-hidden`}>
      <div className="p-6 border-b border-dark-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${textPrimary}`}>
              Multiplicador de Interés Compuesto
            </h3>
            <p className={`text-sm ${textSecondary}`}>
              Visualiza cómo crece tu portafolio con reinversión automática
            </p>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${bgSurface} border ${borderColor}`}>
          <div className="flex items-center justify-between mb-3">
            <label className={`text-sm font-semibold ${textPrimary}`}>
              Porcentaje de Reinversión: {reinvestPercentage}%
            </label>
            <span className="text-xs text-emerald-500 font-bold">
              {reinvestPercentage === 100 && 'Máximo crecimiento'}
              {reinvestPercentage >= 75 && reinvestPercentage < 100 && 'Alto crecimiento'}
              {reinvestPercentage >= 50 && reinvestPercentage < 75 && 'Crecimiento moderado'}
              {reinvestPercentage < 50 && 'Crecimiento bajo'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={reinvestPercentage}
            onChange={(e) => handleReinvestmentChange(Number(e.target.value))}
            className="w-full h-3 bg-dark-surface rounded-lg appearance-none cursor-pointer slider-compound mb-2"
          />
          <p className={`text-xs ${textSecondary} mt-2`}>
            A mayor porcentaje de reinversión, más rápido crece tu portafolio. {Math.round(reinvestPercentage / 5) * 5}% se reinvierte, el resto se retira.
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className={`p-3 rounded-lg ${bgSurface} border ${borderColor}`}>
            <div className="text-xs text-emerald-500 font-semibold mb-1">Tickets Iniciales</div>
            <div className={`text-2xl font-bold ${textPrimary}`}>{initialTickets}</div>
          </div>
          <div className={`p-3 rounded-lg ${bgSurface} border ${borderColor}`}>
            <div className="text-xs text-amber-500 font-semibold mb-1">Tickets Finales</div>
            <div className={`text-2xl font-bold ${textPrimary}`}>{result.finalTickets}</div>
          </div>
          <div className={`p-3 rounded-lg ${bgSurface} border ${borderColor}`}>
            <div className="text-xs text-cyan-500 font-semibold mb-1">Tickets Obtenidos</div>
            <div className={`text-2xl font-bold ${textPrimary}`}>+{result.totalTicketsAcquired}</div>
          </div>
          <div className={`p-3 rounded-lg ${bgSurface} border ${borderColor}`}>
            <div className="text-xs text-violet-500 font-semibold mb-1">Multiplicador</div>
            <div className={`text-2xl font-bold ${textPrimary}`}>{result.multiplier.toFixed(2)}x</div>
          </div>
        </div>

        <div className={`mb-6 p-4 rounded-lg ${bgSurface} border ${borderColor}`}>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setChartType('tickets')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
                chartType === 'tickets'
                  ? 'bg-emerald-500 text-white'
                  : `${isDark ? 'bg-dark-border hover:bg-dark-surface' : 'bg-gray-200 hover:bg-gray-300'} ${textPrimary}`
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Tickets
            </button>
            <button
              onClick={() => setChartType('patrimony')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
                chartType === 'patrimony'
                  ? 'bg-amber-500 text-white'
                  : `${isDark ? 'bg-dark-border hover:bg-dark-surface' : 'bg-gray-200 hover:bg-gray-300'} ${textPrimary}`
              }`}
            >
              <Target className="w-4 h-4 inline mr-1" />
              Patrimonio
            </button>
            <button
              onClick={() => setChartType('income')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
                chartType === 'income'
                  ? 'bg-cyan-500 text-white'
                  : `${isDark ? 'bg-dark-border hover:bg-dark-surface' : 'bg-gray-200 hover:bg-gray-300'} ${textPrimary}`
              }`}
            >
              <Award className="w-4 h-4 inline mr-1" />
              Ingresos
            </button>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            {chartType === 'tickets' && (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2d3748' : '#e5e7eb'} />
                <XAxis dataKey="year" stroke={textSecondary} />
                <YAxis stroke={textSecondary} />
                <Tooltip
                  contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}
                  labelStyle={{ color: textPrimary }}
                />
                <Area
                  type="monotone"
                  dataKey="tickets"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorTickets)"
                />
              </AreaChart>
            )}
            {chartType === 'patrimony' && (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPatrimony" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2d3748' : '#e5e7eb'} />
                <XAxis dataKey="year" stroke={textSecondary} />
                <YAxis stroke={textSecondary} />
                <Tooltip
                  contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}
                  labelStyle={{ color: textPrimary }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Area
                  type="monotone"
                  dataKey="patrimony"
                  stroke="#f59e0b"
                  fillOpacity={1}
                  fill="url(#colorPatrimony)"
                />
              </AreaChart>
            )}
            {chartType === 'income' && (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2d3748' : '#e5e7eb'} />
                <XAxis dataKey="year" stroke={textSecondary} />
                <YAxis stroke={textSecondary} />
                <Tooltip
                  contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}
                  labelStyle={{ color: textPrimary }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Area
                  type="monotone"
                  dataKey="monthlyIncome"
                  stroke="#06b6d4"
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className={`p-4 rounded-lg ${bgSurface} border ${borderColor}`}>
          <h4 className={`font-bold ${textPrimary} mb-3`}>Resumen Final (Año {years})</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className={textSecondary}>Patrimonio Total:</span>
              <span className={`font-bold ${textPrimary}`}>{formatCurrency(result.finalPatrimony)}</span>
            </div>
            <div className="flex justify-between">
              <span className={textSecondary}>Ingresos Mensuales:</span>
              <span className={`font-bold text-emerald-500`}>{formatCurrency(result.finalMonthlyIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span className={textSecondary}>Tickets del Portafolio:</span>
              <span className={`font-bold ${textPrimary}`}>{result.finalTickets}</span>
            </div>
            <div className="flex justify-between border-t border-current border-opacity-10 pt-2 mt-2">
              <span className={`font-bold ${textPrimary}`}>Multiplicador Total:</span>
              <span className={`font-bold text-amber-500 text-lg`}>{result.multiplier.toFixed(2)}x</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const compoundSliderStyles = `
  .slider-compound::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #10b981;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  }

  .slider-compound::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #10b981;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  }

  .slider-compound::-webkit-slider-runnable-track {
    height: 8px;
    border-radius: 4px;
  }

  .slider-compound::-moz-range-track {
    background: #374151;
    height: 8px;
    border-radius: 4px;
    border: none;
  }
`;

export default RidermexCompoundMultiplier;
