import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowLeft, TrendingUp, DollarSign, Sparkles, Layers, Video } from 'lucide-react';
import InteractiveDashboard from './presentation/InteractiveDashboard';
// import IncomeChart from './charts/IncomeChart';
// import CashFlowChart from './charts/CashFlowChart';
// import InvestmentAdvantages from './InvestmentAdvantages';
// import AvalancheSequentialShowcase from './compoundInterest/AvalancheSequentialShowcase';
// import TikTokResultsShowcase from './TikTokResultsShowcase';
import { useCalculator } from '../context/CalculatorContext';

interface ExpressCalculatorProps {
  onBack?: () => void;
}

type TabType = 'dashboard' | 'porque-invertir' | 'efecto-avalancha' | 'vista-tiktok';

const ExpressCalculator: React.FC<ExpressCalculatorProps> = ({ onBack }) => {
  const { investment, results } = useCalculator();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {onBack && (
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mb-6 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 border-2 border-gray-200 hover:border-cyan-400"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver al Menú</span>
            </motion.button>
          )}

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Calculadora Express</h1>
                <p className="text-gray-600 mt-1">Ajusta parámetros y visualiza resultados en tiempo real</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h2 className="text-lg font-semibold text-gray-800">Calculadora Activa</h2>
            </div>
            <p className="text-gray-600">
              Modifica cualquier parámetro y observa cómo cambian las proyecciones instantáneamente.
              Configura tu inversión ideal ajustando certificados, plazo, escenario de producción y retiros.
            </p>
          </div>

          <div className="flex gap-3 mb-6 overflow-x-auto">
            <motion.button
              onClick={() => setActiveTab('dashboard')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              Dashboard
            </motion.button>

            <motion.button
              onClick={() => setActiveTab('porque-invertir')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'porque-invertir'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              Porque Invertir
            </motion.button>

            <motion.button
              onClick={() => setActiveTab('efecto-avalancha')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'efecto-avalancha'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
              }`}
            >
              <Layers className="w-5 h-5" />
              Efecto Avalancha
            </motion.button>

            <motion.button
              onClick={() => setActiveTab('vista-tiktok')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'vista-tiktok'
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
              }`}
            >
              <Video className="w-5 h-5" />
              Vista TikTok
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {activeTab === 'dashboard' && <InteractiveDashboard />}
          {activeTab === 'porque-invertir' && <div className="p-8 text-center text-gray-500">Ventajas de Inversión</div>}
          {activeTab === 'efecto-avalancha' && <div className="p-8 text-center text-gray-500">Efecto Avalancha</div>}
          {activeTab === 'vista-tiktok' && <div className="p-8 text-center text-gray-500">Vista TikTok</div>}
        </motion.div>

        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-6 shadow-2xl mb-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-8 h-8" />
                <h2 className="text-3xl font-bold">Gráficas Complementarias</h2>
              </div>
              <p className="text-green-100">Análisis detallado de ingresos y flujo de efectivo durante el periodo de inversión</p>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Evolución del Ingreso</h3>
                    <p className="text-sm text-gray-600">Ingresos generados año tras año</p>
                  </div>
                </div>
                {/* <IncomeChart /> */}
                <p className="text-gray-500 text-center py-8">Gráfica de evolución de ingresos</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Flujo de Efectivo</h3>
                    <p className="text-sm text-gray-600">Entradas y salidas de efectivo durante la inversión</p>
                  </div>
                </div>
                {/* <CashFlowChart /> */}
                <p className="text-gray-500 text-center py-8">Gráfica de flujo de efectivo</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200"
              >
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Interpretación de las Gráficas
                </h4>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="bg-white rounded-lg p-4">
                    <div className="font-semibold text-blue-600 mb-1">Evolución del Ingreso</div>
                    <p>Muestra cómo crecen tus ingresos año con año gracias a la reinversión de utilidades. Cada año incrementa tu capacidad de generar ingresos debido al efecto compuesto.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="font-semibold text-green-600 mb-1">Flujo de Efectivo</div>
                    <p>Visualiza el efectivo real que recibes cada año después de reinvertir. Este flujo te permite planificar tus finanzas personales mientras tu patrimonio crece.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="font-semibold text-orange-600 mb-1">Ventaja Clave</div>
                    <p>Al mantener una estrategia disciplinada de reinversión con el {investment.cashOutPercentage}% de retiro, logras un equilibrio óptimo entre liquidez inmediata y crecimiento a largo plazo.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ExpressCalculator;
