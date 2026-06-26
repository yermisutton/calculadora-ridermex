import React, { useState } from 'react';
import { Globe, TrendingUp, MapPin, DollarSign, BarChart3, ChevronDown, ChevronUp, Target, Award, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils/formatters';

interface MarketInsightsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

const marketData = {
  global: {
    marketSize: 125000000000, // $125B USD
    annualGrowth: 18,
    mexicoRanking: 6, // 6to lugar mundial en ventas de motos
    mexicoShare: 8.5,
    exportValue: 4200000000
  },
  destinations: [
    { country: "Rappi", percentage: 35, value: 1470000000, flag: "📦" },
    { country: "Uber Eats", percentage: 28, value: 1176000000, flag: "🍽️" },
    { country: "Didi Food", percentage: 18, value: 756000000, flag: "🚗" },
    { country: "Independientes", percentage: 15, value: 630000000, flag: "👤" },
    { country: "Otros (99, JustEat)", percentage: 4, value: 168000000, flag: "📱" }
  ],
  advantages: [
    {
      title: "Demanda Inelástica",
      description: "Riders necesitan motos para generar ingresos diarios",
      impact: "Rotación garantizada 21-30 días",
      icon: TrendingUp,
      color: "blue"
    },
    {
      title: "Cobro Rápido",
      description: "Alianzas Maxikash, Galgo, Atrato garantizan pago 24-48h",
      impact: "Liquidez constante sin riesgo",
      icon: Target,
      color: "green"
    },
    {
      title: "Margen Alto",
      description: "$21,000 MXN utilidad mensual por tienda (30 motos/mes)",
      impact: "$252k anual = $420k en 20 meses por tienda",
      icon: DollarSign,
      color: "purple"
    },
    {
      title: "Activo Tangible",
      description: "Motocicleta física con valor de mercado secundario",
      impact: "Protección de capital e inversión segura",
      icon: Award,
      color: "orange"
    }
  ],
  projections: {
    marketGrowth: 45,
    priceIncrease: 35,
    drivers: [
      "Crecimiento exponencial de gig economy en México",
      "Mayor preferencia por entregas rápidas post-pandemia",
      "Expansión de plataformas en ciudades secundarias",
      "Demanda por independencia financiera de trabajadores"
    ]
  }
};

const MarketInsightsPanel: React.FC<MarketInsightsPanelProps> = ({ isOpen, onToggle }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'destinations' | 'advantages' | 'projections'>('overview');

  return (
    <div className="bg-dark-card rounded-2xl shadow-lg border border-dark-border overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-neon-red/10 to-orange-500/10 hover:from-neon-red/20 hover:to-orange-500/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neon-red/20 rounded-xl flex items-center justify-center">
            <Globe className="w-5 h-5 text-neon-red" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-neutral-50">Análisis de Mercado de Motocicletas y Gig Economy</h3>
            <p className="text-sm text-neutral-300">Contexto global y ventajas competitivas de RiderMex</p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-neon-red" /> : <ChevronDown className="w-5 h-5 text-neon-red" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-6">
              {/* Tab Navigation */}
              <div className="flex bg-dark-surface rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'overview' ? 'bg-neon-red text-white shadow-sm' : 'text-neutral-300 hover:text-neutral-50'
                  }`}
                >
                  Panorama Global
                </button>
                <button
                  onClick={() => setActiveTab('destinations')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'destinations' ? 'bg-neon-red text-white shadow-sm' : 'text-neutral-300 hover:text-neutral-50'
                  }`}
                >
                  Plataformas
                </button>
                <button
                  onClick={() => setActiveTab('advantages')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'advantages' ? 'bg-neon-red text-white shadow-sm' : 'text-neutral-300 hover:text-neutral-50'
                  }`}
                >
                  Ventajas
                </button>
                <button
                  onClick={() => setActiveTab('projections')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'projections' ? 'bg-neon-red text-white shadow-sm' : 'text-neutral-300 hover:text-neutral-50'
                  }`}
                >
                  Proyecciones
                </button>
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="bg-dark-surface border border-blue-500/30 p-4 rounded-xl">
                        <div className="text-sm text-blue-400 mb-1">Mercado Global</div>
                        <div className="text-2xl font-bold text-blue-300">$125B</div>
                        <div className="text-xs text-neutral-400">USD anuales</div>
                      </div>
                      <div className="bg-dark-surface border border-neon-green/30 p-4 rounded-xl">
                        <div className="text-sm text-neon-green mb-1">Crecimiento</div>
                        <div className="text-2xl font-bold text-neon-green">18%</div>
                        <div className="text-xs text-neutral-400">anual</div>
                      </div>
                      <div className="bg-dark-surface border border-amber-500/30 p-4 rounded-xl">
                        <div className="text-sm text-amber-400 mb-1">Ranking Mundial</div>
                        <div className="text-2xl font-bold text-amber-300">6to</div>
                        <div className="text-xs text-neutral-400">lugar en ventas MX</div>
                      </div>
                      <div className="bg-dark-surface border border-cyan-500/30 p-4 rounded-xl">
                        <div className="text-sm text-cyan-400 mb-1">Participación MX</div>
                        <div className="text-2xl font-bold text-cyan-300">8.5%</div>
                        <div className="text-xs text-neutral-400">mercado emergente</div>
                      </div>
                      <div className="bg-dark-surface border border-neon-red/30 p-4 rounded-xl">
                        <div className="text-sm text-neon-red mb-1">Impacto Económico MX</div>
                        <div className="text-2xl font-bold text-orange-400">$4.2B</div>
                        <div className="text-xs text-neutral-400">USD anuales</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'destinations' && (
                  <motion.div
                    key="destinations"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    {marketData.destinations.map((dest, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-dark-surface border border-dark-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{dest.flag}</span>
                          <div>
                            <div className="font-medium text-neutral-50">{dest.country}</div>
                            <div className="text-sm text-neutral-300">${(dest.value / 1000000).toFixed(0)}M USD</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-400">{dest.percentage}%</div>
                          <div className="w-16 h-2 bg-dark-bg rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${dest.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'advantages' && (
                  <motion.div
                    key="advantages"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {marketData.advantages.map((advantage, index) => {
                      const Icon = advantage.icon;
                      const colorClasses = {
                        blue: 'border-blue-500/30 text-neutral-50 bg-blue-500/20',
                        green: 'border-neon-green/30 text-neutral-50 bg-neon-green/20',
                        purple: 'border-purple-500/30 text-neutral-50 bg-purple-500/20',
                        orange: 'border-neon-red/30 text-neutral-50 bg-neon-red/20'
                      };

                      return (
                        <div key={index} className={`bg-dark-surface border ${colorClasses[advantage.color]} p-4 rounded-xl`}>
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-8 h-8 ${colorClasses[advantage.color].split(' ')[2]} rounded-lg flex items-center justify-center`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <h4 className="font-semibold text-neutral-50">{advantage.title}</h4>
                          </div>
                          <p className="text-sm mb-2 text-neutral-300">{advantage.description}</p>
                          <p className="text-xs font-medium text-neutral-400">💡 {advantage.impact}</p>
                        </div>
                      );
                    })}
                  </motion.div>
                )}

                {activeTab === 'projections' && (
                  <motion.div
                    key="projections"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-dark-surface border border-neon-green/30 p-6 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                          <TrendingUp className="w-6 h-6 text-neon-green" />
                          <h4 className="font-semibold text-neutral-50">Crecimiento del Mercado</h4>
                        </div>
                        <div className="text-3xl font-bold text-neon-green mb-2">+{marketData.projections.marketGrowth}%</div>
                        <div className="text-sm text-neutral-300">Proyección 2024-2030</div>
                      </div>

                      <div className="bg-dark-surface border border-blue-500/30 p-6 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                          <DollarSign className="w-6 h-6 text-blue-400" />
                          <h4 className="font-semibold text-neutral-50">Incremento de Precios</h4>
                        </div>
                        <div className="text-3xl font-bold text-blue-400 mb-2">+{marketData.projections.priceIncrease}%</div>
                        <div className="text-sm text-neutral-300">Esperado hasta 2030</div>
                      </div>
                    </div>

                    <div className="bg-dark-surface border border-dark-border p-4 rounded-xl">
                      <h4 className="font-semibold text-neutral-50 mb-3">Factores de Crecimiento:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {marketData.projections.drivers.map((driver, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-neutral-300">
                            <Zap className="w-4 h-4 text-neon-red" />
                            <span>{driver}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarketInsightsPanel;