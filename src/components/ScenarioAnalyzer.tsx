import React, { useState } from 'react';
import { useCalculator } from '../context/CalculatorContext';
import { TrendingUp, TrendingDown, Activity, Target, BarChart3, Zap, AlertTriangle, CheckCircle, Calendar, Plus, Minus, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { DisclaimerBanner } from './ui/DisclaimerBanner';
import { formatCurrency } from '../utils/formatters';
import { calculateResults } from '../utils/calculations';

interface ScenarioAnalyzerProps {
  className?: string;
}

interface ScenarioConfig {
  motos_mes: number;
  utilidad: number;
  tickets: number;
}

const defaultScenarios = {
  optimistic: {
    motos_mes: 70,
    utilidad: 900,
    tickets: 30
  },
  realistic: {
    motos_mes: 60,
    utilidad: 800,
    tickets: 30
  },
  conservative: {
    motos_mes: 50,
    utilidad: 900,
    tickets: 30
  }
};

const ScenarioAnalyzer: React.FC<ScenarioAnalyzerProps> = ({ className = '' }) => {
  const { investment } = useCalculator();
  const [activeScenario, setActiveScenario] = useState<'optimistic' | 'realistic' | 'conservative'>('realistic');
  const [timeframe, setTimeframe] = useState(investment.years);
  const [scenarioResults, setScenarioResults] = useState<any>({});
  const [scenarios, setScenarios] = useState(defaultScenarios);
  const [isEditing, setIsEditing] = useState(false);

  const calculateROI = (motos_mes: number, utilidad: number, tickets: number) => {
    const motos_anual = motos_mes * 12;
    const utilidad_total = motos_anual * utilidad;
    const utilidad_por_ticket = utilidad_total / tickets;
    const certificatePrice = investment.certificateBasePrice || 70000;
    return (utilidad_por_ticket / certificatePrice) * 100;
  };

  // Calculate results for all scenarios
  React.useEffect(() => {
    const results: any = {};

    Object.entries(scenarios).forEach(([key, config]) => {
      try {
        const roi = calculateROI(config.motos_mes, config.utilidad, config.tickets);
        const production = config.motos_mes * 12 * config.utilidad;

        const adjustedInvestment = {
          ...investment,
          averageProductionPerHectare: production,
          averageSalePricePerKg: roi,
          years: timeframe
        };

        results[key] = calculateResults(adjustedInvestment);
      } catch (error) {
        console.error(`Error calculating ${key} scenario:`, error);
        results[key] = null;
      }
    });

    setScenarioResults(results);
  }, [investment, timeframe, scenarios]);

  // Handlers for timeframe adjustment
  const handleIncrementTimeframe = () => {
    if (timeframe < 30) {
      setTimeframe(timeframe + 1);
    }
  };

  const handleDecrementTimeframe = () => {
    if (timeframe > 5) {
      setTimeframe(timeframe - 1);
    }
  };

  const activeScenarioConfig = scenarios[activeScenario];
  const activeResults = scenarioResults[activeScenario];
  const activeROI = calculateROI(activeScenarioConfig.motos_mes, activeScenarioConfig.utilidad, activeScenarioConfig.tickets);

  const handleUpdateScenario = (scenario: keyof typeof scenarios, field: 'motos_mes' | 'utilidad' | 'tickets', value: number) => {
    setScenarios(prev => ({
      ...prev,
      [scenario]: {
        ...prev[scenario],
        [field]: value
      }
    }));
  };

  // Calculate weighted expected value
  const calculateExpectedValue = () => {
    let expectedPatrimony = 0;
    let expectedIncome = 0;

    const weights = {
      conservative: 0.25,
      realistic: 0.50,
      optimistic: 0.25
    };

    Object.entries(scenarioResults).forEach(([key, results]) => {
      if (results) {
        const weight = weights[key as keyof typeof weights] || 0.33;
        expectedPatrimony += results.finalPatrimony * weight;
        expectedIncome += results.finalMonthlyIncome * weight;
      }
    });

    return { expectedPatrimony, expectedIncome };
  };

  const expectedValue = calculateExpectedValue();

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <Target className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Análisis de Escenarios</h3>
          <p className="text-sm text-gray-600">Evalúa tu inversión bajo diferentes condiciones de mercado</p>
        </div>
      </div>

      <DisclaimerBanner variant="compact" />

      {/* Timeframe Configuration */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-blue-700" />
          </div>
          <h4 className="font-medium text-blue-800">Horizonte de Tiempo</h4>
        </div>
        
        <div className="flex items-center justify-center gap-4 mb-4">
          <button 
            onClick={handleDecrementTimeframe}
            className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-50 rounded-full transition-colors border border-blue-200"
            disabled={timeframe <= 5}
          >
            <Minus className="w-4 h-4 text-blue-700" />
          </button>
          <div className="text-center">
            <input
              type="number"
              min="5"
              max="30"
              value={timeframe}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 5 && value <= 30) {
                  setTimeframe(value);
                }
              }}
              onWheel={(e) => e.currentTarget.blur()}
              className="w-16 text-center text-2xl font-bold text-blue-900 mb-1 border-0 focus:ring-0 focus:outline-none bg-transparent"
            />
            <div className="text-sm text-blue-600">años</div>
          </div>
          <button 
            onClick={handleIncrementTimeframe}
            className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-50 rounded-full transition-colors border border-blue-200"
            disabled={timeframe >= 30}
          >
            <Plus className="w-4 h-4 text-blue-700" />
          </button>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min="5"
            max="30"
            step="1"
            value={timeframe}
            onChange={(e) => setTimeframe(parseInt(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg appearance-none cursor-pointer"
            title="Ajusta el horizonte de tiempo para el análisis"
          />
          <div className="flex justify-between text-xs text-blue-600">
            <span>5 años</span>
            <span>30 años</span>
          </div>
        </div>
        
        <div className="mt-3 text-center">
          <div className="text-xs text-blue-700">
            Analizando escenarios para <strong>{timeframe} años</strong> de inversión
          </div>
        </div>
      </div>

      {/* Scenario Selector with Edit Mode */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-800">Presets de Producción Rápidos</h4>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-100 to-orange-50 hover:from-orange-200 hover:to-orange-100 text-orange-700 text-sm font-medium transition border border-orange-300"
          >
            <Settings className="w-4 h-4" />
            {isEditing ? 'Guardar Cambios' : 'Editar Valores'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(['conservative', 'realistic', 'optimistic'] as const).map((key) => {
            const config = scenarios[key];
            const roi = calculateROI(config.motos_mes, config.utilidad, config.tickets);
            const colors = {
              conservative: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700' },
              realistic: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700' },
              optimistic: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700' }
            };
            const labels = { conservative: 'Conservador', realistic: 'Moderado', optimistic: 'Optimista' };

            return (
              <div key={key} className="space-y-2">
                <motion.button
                  onClick={() => setActiveScenario(key)}
                  whileHover={{ scale: 1.02 }}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                    activeScenario === key
                      ? `${colors[key].bg} ${colors[key].border} shadow-lg border-opacity-100`
                      : `${colors[key].bg} ${colors[key].border} border-opacity-50 hover:border-opacity-100`
                  }`}
                >
                  <div className="text-left">
                    <div className={`font-semibold text-sm mb-1 ${colors[key].text}`}>{labels[key]}</div>
                    <div className="text-xs space-y-1 text-gray-600">
                      <div>• {config.motos_mes} motos/mes</div>
                      <div>• ${config.utilidad} utilidad/moto</div>
                      <div className={`font-medium ${colors[key].text}`}>ROI Estimado: {roi.toFixed(2)}%</div>
                    </div>
                  </div>
                </motion.button>

                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-3 space-y-2 border border-orange-200">
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">Motos/mes</label>
                      <input
                        type="number"
                        value={config.motos_mes}
                        onChange={(e) => handleUpdateScenario(key, 'motos_mes', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">Utilidad/moto ($)</label>
                      <input
                        type="number"
                        value={config.utilidad}
                        onChange={(e) => handleUpdateScenario(key, 'utilidad', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">Tickets/agencia</label>
                      <input
                        type="number"
                        value={config.tickets}
                        onChange={(e) => handleUpdateScenario(key, 'tickets', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div className="pt-2 border-t border-orange-200 text-xs text-gray-600 space-y-1">
                      <div className="font-medium">Motos/año: {config.motos_mes * 12}</div>
                      <div className="font-medium">Utilidad total: ${(config.motos_mes * 12 * config.utilidad).toLocaleString()}</div>
                      <div className="font-medium text-orange-700">Utilidad/ticket: ${((config.motos_mes * 12 * config.utilidad) / config.tickets).toLocaleString()}</div>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Scenario Details */}
      <motion.div
        key={activeScenario}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className={`bg-gradient-to-br from-${activeScenario === 'optimistic' ? 'green' : activeScenario === 'realistic' ? 'blue' : 'orange'}-50 to-${activeScenario === 'optimistic' ? 'green' : activeScenario === 'realistic' ? 'blue' : 'orange'}-100 p-4 rounded-xl`}>
          <h4 className={`font-semibold text-${activeScenario === 'optimistic' ? 'green' : activeScenario === 'realistic' ? 'blue' : 'orange'}-800 mb-2`}>
            Escenario {activeScenario === 'optimistic' ? 'Optimista' : activeScenario === 'realistic' ? 'Moderado' : 'Conservador'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div>
              <div className="text-xs text-gray-600 mb-1">Motos Mensuales</div>
              <div className={`text-lg font-bold text-${activeScenario === 'optimistic' ? 'green' : activeScenario === 'realistic' ? 'blue' : 'orange'}-700`}>
                {activeScenarioConfig.motos_mes}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Utilidad por Moto</div>
              <div className={`text-lg font-bold text-${activeScenario === 'optimistic' ? 'green' : activeScenario === 'realistic' ? 'blue' : 'orange'}-700`}>
                ${activeScenarioConfig.utilidad}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Tickets Agencia</div>
              <div className={`text-lg font-bold text-${activeScenario === 'optimistic' ? 'green' : activeScenario === 'realistic' ? 'blue' : 'orange'}-700`}>
                {activeScenarioConfig.tickets}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-opacity-30 space-y-1 text-xs">
            <div className="text-gray-600">Proyección anual</div>
            <div className={`text-sm font-semibold text-${activeScenario === 'optimistic' ? 'green' : activeScenario === 'realistic' ? 'blue' : 'orange'}-700`}>
              {activeScenarioConfig.motos_mes * 12} motos × ${activeScenarioConfig.utilidad} = ${(activeScenarioConfig.motos_mes * 12 * activeScenarioConfig.utilidad).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Scenario Results */}
        {activeResults && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Patrimonio Final Estimado</div>
              <div className={`text-xl font-bold text-${activeScenario === 'optimistic' ? 'green' : activeScenario === 'realistic' ? 'blue' : 'orange'}-700`}>
                {formatCurrency(activeResults.finalPatrimony, investment.currencyFormat)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {activeROI.toFixed(1)}% ROI Estimado anual
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Ingreso Mensual</div>
              <div className={`text-xl font-bold text-${activeScenario === 'optimistic' ? 'green' : activeScenario === 'realistic' ? 'blue' : 'orange'}-700`}>
                {formatCurrency(activeResults.finalMonthlyIncome, investment.currencyFormat)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {(activeresults.cagr).toFixed(1)}% CAGR
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Certificados Totales</div>
              <div className={`text-xl font-bold text-${activeScenario === 'optimistic' ? 'green' : activeScenario === 'realistic' ? 'blue' : 'orange'}-700`}>
                {activeResults.certificatesSummary?.totalCertificates || 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                +{activeResults.certificatesSummary?.fromReinvestment || 0} por reinversión
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Expected Value Summary */}
      <div className="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-100 rounded-xl">
        <div className="flex items-center gap-3 mb-3">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          <h4 className="font-semibold text-indigo-800">Valor Esperado Ponderado</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-sm text-indigo-600 mb-1">Patrimonio Esperado</div>
            <div className="text-2xl font-bold text-indigo-700">
              {formatCurrency(expectedValue.expectedPatrimony, investment.currencyFormat)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-indigo-600 mb-1">Ingreso Esperado</div>
            <div className="text-2xl font-bold text-indigo-700">
              {formatCurrency(expectedValue.expectedIncome, investment.currencyFormat)}
            </div>
          </div>
        </div>
        <div className="text-xs text-indigo-600 text-center mt-2">
          Basado en probabilidades para {timeframe} años: Optimista 25% | Realista 50% | Conservador 25%
        </div>
      </div>
    </div>
  );
};

export default ScenarioAnalyzer;
