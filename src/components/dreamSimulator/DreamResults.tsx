import React from 'react';
import { motion } from 'framer-motion';
import { Dream, DreamConfig, DreamProjection } from '../../types/dreamSimulator';
import { formatCurrency } from '../../utils/formatters';
import { DisclaimerBanner } from '../ui/DisclaimerBanner';
import { Investment } from '../../types';
import { Award, BarChart3, TrendingUp, DollarSign, Calendar, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';

interface DreamResultsProps {
  dream: Dream;
  config: DreamConfig;
  projections: DreamProjection[];
  investment: Investment;
}

const DreamResults: React.FC<DreamResultsProps> = ({
  dream,
  config,
  projections,
  investment
}) => {
  const Icon = dream.icon;
  const finalProjection = projections[projections.length - 1];

  const goalReachedIndex = projections.findIndex(p => p.monthlyIncome >= config.monthlyGoal);
  const goalReachedYear = goalReachedIndex >= 0 ? projections[goalReachedIndex].year : null;

  const chartData = projections.map(p => ({
    year: p.year,
    ingresoMensual: p.monthlyIncome,
    patrimonio: p.patrimony / 1000,
    tickets: p.totalCertificates,
    progreso: p.progressToGoal
  }));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-red-600 to-red-800 p-8 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Proyeccion: {dream.name}</h2>
              <p className="text-red-200">Resultados Estimados con RiderMex Inversiones</p>
            </div>
          </div>
        </motion.div>

        <div className="px-8 pt-6">
          <DisclaimerBanner variant="compact" />
        </div>

        <motion.div
          className="p-8 space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-8 h-8 text-red-600" />
                <h4 className="font-medium text-red-800">Meta Alcanzada</h4>
              </div>
              <p className="text-3xl font-bold text-red-700 mb-1">
                {finalProjection.progressToGoal.toFixed(0)}%
              </p>
              <p className="text-sm text-red-600">de tu objetivo</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <DollarSign className="w-8 h-8 text-orange-600" />
                <h4 className="font-medium text-orange-800">Ingreso Mensual Estimado</h4>
              </div>
              <p className="text-3xl font-bold text-orange-700 mb-1">
                {formatCurrency(finalProjection.monthlyIncome, investment.currencyFormat)}
              </p>
              <p className="text-sm text-orange-600">al ano {config.timeframe}</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-100 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-8 h-8 text-amber-600" />
                <h4 className="font-medium text-amber-800">Patrimonio Estimado</h4>
              </div>
              <p className="text-3xl font-bold text-amber-700 mb-1">
                {formatCurrency(finalProjection.patrimony, investment.currencyFormat)}
              </p>
              <p className="text-sm text-amber-600">valor total</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-orange-100 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-8 h-8 text-red-600" />
                <h4 className="font-medium text-red-800">Crecimiento de Tickets</h4>
              </div>
              <p className="text-3xl font-bold text-red-700 mb-1">
                {config.certificatesNeeded} → {finalProjection.totalCertificates}
              </p>
              <p className="text-sm text-red-600">
                de {config.certificatesNeeded} iniciales a {finalProjection.totalCertificates} por reinversion
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-red-600" />
              <span>Evolucion de Ingreso Mensual Estimado</span>
            </h3>
            {goalReachedYear && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Meta alcanzada en el ano {goalReachedYear}</strong> - La linea roja marca tu objetivo de {formatCurrency(config.monthlyGoal, investment.currencyFormat)} mensuales
                </p>
              </div>
            )}
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIngresoRidermex" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: 'Ano', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Ingreso (MXN)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value: number) => formatCurrency(value, investment.currencyFormat)} />
                <Legend />

                <ReferenceLine
                  y={config.monthlyGoal}
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{
                    value: `Meta: ${formatCurrency(config.monthlyGoal, investment.currencyFormat)}`,
                    position: 'right',
                    fill: '#f59e0b',
                    fontSize: 12,
                    fontWeight: 'bold'
                  }}
                />

                {goalReachedYear && (
                  <ReferenceLine
                    x={goalReachedYear}
                    stroke="#ea580c"
                    strokeWidth={3}
                    label={{
                      value: `Ano ${goalReachedYear}`,
                      position: 'top',
                      fill: '#ea580c',
                      fontSize: 12,
                      fontWeight: 'bold'
                    }}
                  />
                )}

                <Area
                  type="monotone"
                  dataKey="ingresoMensual"
                  stroke="#dc2626"
                  fillOpacity={1}
                  fill="url(#colorIngresoRidermex)"
                  name="Ingreso Mensual Estimado"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-orange-600" />
              <span>Crecimiento Estimado de Tickets y Patrimonio</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: 'Ano', position: 'insideBottom', offset: -5 }} />
                <YAxis yAxisId="left" label={{ value: 'Tickets', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Patrimonio (miles)', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="tickets"
                  stroke="#dc2626"
                  strokeWidth={2}
                  name="Tickets RiderMex Estimados"
                  dot={{ fill: '#dc2626', r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="patrimonio"
                  stroke="#ea580c"
                  strokeWidth={2}
                  name="Patrimonio Estimado (miles MXN)"
                  dot={{ fill: '#ea580c', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-orange-100 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
              <Award className="w-6 h-6" />
              <span>El Poder Estimado de RiderMex</span>
            </h3>
            <p className="text-gray-700 mb-4">
              Comenzaste con <strong>{config.certificatesNeeded} ticket{config.certificatesNeeded > 1 ? 's' : ''} RiderMex</strong> y
              la reinversion de utilidades los convirtio en <strong>{finalProjection.totalCertificates} activos
              productivos reales</strong>.
            </p>
            <p className="text-gray-700">
              Esto significa que tienes <strong>{(finalProjection.totalCertificates / config.certificatesNeeded).toFixed(1)}x
              mas fuentes de ingreso permanente</strong>, todo sin invertir capital adicional, solo reinvirtiendo
              tus utilidades en mas tickets RiderMex.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DreamResults;
