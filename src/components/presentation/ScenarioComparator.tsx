import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, GitCompare, Zap, Check, X, Edit2, Sparkles } from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';
import { calculateResults } from '../../utils/calculations';
import { Investment } from '../../types';
import AnimatedNumberDisplay from '../ui/AnimatedNumberDisplay';

interface ScenarioPreset {
  id: string;
  name: string;
  description: string;
  certificates: number;
  years: number;
  withdrawalPercentage: number;
  productionPreset: 'conservative' | 'moderate' | 'optimistic';
  color: string;
}

const ScenarioComparator: React.FC = () => {
  const { investment, results } = useCalculator();
  const [scenarioA, setScenarioA] = useState<Investment | null>(null);
  const [scenarioB, setScenarioB] = useState<Investment | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [editingA, setEditingA] = useState(false);
  const [editingB, setEditingB] = useState(false);

  const presets: ScenarioPreset[] = [
    {
      id: 'small-conservative',
      name: 'Inversor Conservador',
      description: '1 certificado, 25 años, retiro 50%',
      certificates: 1,
      years: 25,
      withdrawalPercentage: 50,
      productionPreset: 'conservative',
      color: 'blue'
    },
    {
      id: 'medium-moderate',
      name: 'Inversor Moderado',
      description: '2 certificados, 20 años, retiro 30%',
      certificates: 2,
      years: 20,
      withdrawalPercentage: 30,
      productionPreset: 'moderate',
      color: 'green'
    },
    {
      id: 'large-aggressive',
      name: 'Inversor Agresivo',
      description: '5 certificados, 15 años, retiro 10%',
      certificates: 5,
      years: 15,
      withdrawalPercentage: 10,
      productionPreset: 'optimistic',
      color: 'orange'
    },
    {
      id: 'long-term',
      name: 'Largo Plazo',
      description: '3 certificados, 30 años, retiro 20%',
      certificates: 3,
      years: 30,
      withdrawalPercentage: 20,
      productionPreset: 'moderate',
      color: 'purple'
    },
    {
      id: 'high-income',
      name: 'Alto Flujo',
      description: '4 certificados, 15 años, retiro 70%',
      certificates: 4,
      years: 15,
      withdrawalPercentage: 70,
      productionPreset: 'optimistic',
      color: 'yellow'
    },
    {
      id: 'balanced',
      name: 'Balanceado',
      description: '2 certificados, 20 años, retiro 40%',
      certificates: 2,
      years: 20,
      withdrawalPercentage: 40,
      productionPreset: 'moderate',
      color: 'teal'
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: investment.currencyFormat,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const captureCurrentScenario = (target: 'A' | 'B') => {
    const scenarioCopy = { ...investment };
    if (target === 'A') {
      setScenarioA(scenarioCopy);
      setEditingA(false);
    } else {
      setScenarioB(scenarioCopy);
      setEditingB(false);
    }
  };

  const loadPreset = (preset: ScenarioPreset, target: 'A' | 'B') => {
    const productionSettings = {
      conservative: { production: 25000, price: 35 },
      moderate: { production: 30000, price: 35 },
      optimistic: { production: 35000, price: 38 }
    };

    const settings = productionSettings[preset.productionPreset];
    const newScenario: Investment = {
      ...investment,
      initialCertificates: preset.certificates,
      initialPayment: preset.certificates * investment.certificateBasePrice,
      years: preset.years,
      cashOutPercentage: preset.withdrawalPercentage,
      averageProductionPerHectare: settings.production,
      averageSalePricePerKg: settings.price
    };

    if (target === 'A') {
      setScenarioA(newScenario);
      setEditingA(false);
    } else {
      setScenarioB(newScenario);
      setEditingB(false);
    }
  };

  const resultsA = scenarioA ? calculateResults(scenarioA) : null;
  const resultsB = scenarioB ? calculateResults(scenarioB) : null;

  const compareScenarios = () => {
    if (resultsA && resultsB) {
      setShowComparison(true);
    }
  };

  const updateScenarioA = (updates: Partial<Investment>) => {
    if (scenarioA) {
      setScenarioA({ ...scenarioA, ...updates });
    }
  };

  const updateScenarioB = (updates: Partial<Investment>) => {
    if (scenarioB) {
      setScenarioB({ ...scenarioB, ...updates });
    }
  };

  const clearScenario = (target: 'A' | 'B') => {
    if (target === 'A') {
      setScenarioA(null);
      setEditingA(false);
    } else {
      setScenarioB(null);
      setEditingB(false);
    }
  };

  const getProductionPresetName = (scenario: Investment) => {
    if (scenario.averageProductionPerHectare === 25000 && scenario.averageSalePricePerKg === 30) {
      return 'Conservador';
    }
    if (scenario.averageProductionPerHectare === 30000 && scenario.averageSalePricePerKg === 35) {
      return 'Moderado';
    }
    if (scenario.averageProductionPerHectare === 35000 && scenario.averageSalePricePerKg === 38) {
      return 'Optimista';
    }
    return 'Personalizado';
  };

  const renderScenarioCard = (
    target: 'A' | 'B',
    scenario: Investment | null,
    results: any,
    editing: boolean,
    setEditing: (val: boolean) => void,
    borderColor: string,
    bgColor: string,
    textColor: string,
    updateFunction: (updates: Partial<Investment>) => void
  ) => (
    <motion.div
      initial={{ opacity: 0, x: target === 'A' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-dark-card rounded-2xl p-6 shadow-lg border-2 ${borderColor}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-2xl font-bold ${textColor}`}>Escenario {target}</h3>
        {scenario && <Check className={`w-6 h-6 ${textColor}`} />}
      </div>

      <div className="space-y-3 mb-6">
        <button
          onClick={() => captureCurrentScenario(target)}
          className={`w-full ${bgColor} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all`}
        >
          Capturar Escenario Actual
        </button>

        <div className="border-t-2 border-dark-border pt-3">
          <div className="text-sm font-semibold text-neutral-200 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Presets Rápidos
          </div>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => loadPreset(preset, target)}
                className="bg-dark-surface hover:bg-dark-border text-neutral-200 p-3 rounded-lg text-xs font-medium transition-all text-left border border-dark-border"
              >
                <div className="font-bold mb-1">{preset.name}</div>
                <div className="text-neutral-400 opacity-75">{preset.description}</div>
              </button>
            ))}
          </div>
        </div>

        {scenario && (
          <button
            onClick={() => clearScenario(target)}
            className="w-full bg-red-900/30 text-red-400 py-2 rounded-lg font-semibold hover:bg-red-900/50 transition-colors flex items-center justify-center gap-2 border border-red-800"
          >
            <X className="w-4 h-4" />
            Limpiar
          </button>
        )}
      </div>

      {scenario && results && (
        <div className="space-y-3 bg-dark-surface rounded-xl p-4 border border-dark-border">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-semibold ${textColor}`}>Parámetros</span>
            <button
              onClick={() => setEditing(!editing)}
              className="p-2 bg-dark-card hover:bg-dark-border rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4 text-neutral-300" />
            </button>
          </div>

          <div>
            <div className="text-sm text-neutral-400 mb-1">Certificados</div>
            {editing ? (
              <input
                type="number"
                min="1"
                max="100"
                value={scenario.initialCertificates}
                onChange={(e) => {
                  const certs = Number(e.target.value);
                  updateFunction({
                    initialCertificates: certs,
                    initialPayment: certs * scenario.certificateBasePrice
                  });
                }}
                className="w-full px-3 py-2 border-2 border-dark-border bg-dark-card rounded-lg font-semibold text-neutral-100 focus:outline-none focus:border-blue-500"
              />
            ) : (
              <div className="text-xl font-bold text-neutral-100">
                {scenario.initialCertificates} - {formatCurrency(scenario.initialPayment)}
              </div>
            )}
          </div>

          <div>
            <div className="text-sm text-neutral-400 mb-1">Plazo (años)</div>
            {editing ? (
              <input
                type="number"
                min="5"
                max="40"
                value={scenario.years}
                onChange={(e) => updateFunction({ years: Number(e.target.value) })}
                className="w-full px-3 py-2 border-2 border-dark-border bg-dark-card rounded-lg font-semibold text-neutral-100 focus:outline-none focus:border-blue-500"
              />
            ) : (
              <div className="text-xl font-bold text-neutral-100">{scenario.years} años</div>
            )}
          </div>

          <div>
            <div className="text-sm text-neutral-400 mb-1">Presets de Producción Rápidos</div>
            {editing ? (
              <select
                value={`${scenario.averageProductionPerHectare}-${scenario.averageSalePricePerKg}`}
                onChange={(e) => {
                  const [production, price] = e.target.value.split('-').map(Number);
                  updateFunction({
                    averageProductionPerHectare: production,
                    averageSalePricePerKg: price
                  });
                }}
                className="w-full px-3 py-2 border-2 border-dark-border bg-dark-card rounded-lg font-semibold text-neutral-100 focus:outline-none focus:border-blue-500 [&>option]:bg-dark-card [&>option]:text-neutral-100"
              >
                <option value="25000-30" className="bg-dark-card text-neutral-100">Conservador (25k kg/ha × $30/kg)</option>
                <option value="30000-35" className="bg-dark-card text-neutral-100">Moderado (30k kg/ha × $35/kg)</option>
                <option value="35000-38" className="bg-dark-card text-neutral-100">Optimista (35k kg/ha × $38/kg)</option>
              </select>
            ) : (
              <div className="text-xl font-bold text-neutral-100">
                {getProductionPresetName(scenario)}
              </div>
            )}
          </div>

          <div>
            <div className="text-sm text-neutral-400 mb-1">Retiro de Utilidades (%)</div>
            {editing ? (
              <input
                type="number"
                min="0"
                max="100"
                value={scenario.cashOutPercentage}
                onChange={(e) => updateFunction({ cashOutPercentage: Number(e.target.value) })}
                className="w-full px-3 py-2 border-2 border-dark-border bg-dark-card rounded-lg font-semibold text-neutral-100 focus:outline-none focus:border-blue-500"
              />
            ) : (
              <div className="text-xl font-bold text-neutral-100">{scenario.cashOutPercentage}%</div>
            )}
          </div>

          <div className="border-t-2 border-dark-border pt-3 mt-3">
            <div className="text-sm text-neutral-400">Patrimonio Final Estimado</div>
            <div className={`text-2xl font-bold ${textColor}`}>{formatCurrency(results.finalPatrimony)}</div>
          </div>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl p-6 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-2">
          <GitCompare className="w-8 h-8" />
          <h2 className="text-3xl font-bold">Comparador de Escenarios</h2>
        </div>
        <p className="text-blue-100">Compara diferentes estrategias de inversión lado a lado usando presets o valores personalizados</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {renderScenarioCard('A', scenarioA, resultsA, editingA, setEditingA, 'border-blue-500', 'bg-blue-600', 'text-blue-400', updateScenarioA)}
        {renderScenarioCard('B', scenarioB, resultsB, editingB, setEditingB, 'border-green-500', 'bg-green-600', 'text-green-400', updateScenarioB)}
      </div>

      {scenarioA && scenarioB && resultsA && resultsB && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <button
            onClick={compareScenarios}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 mx-auto hover:scale-105"
          >
            <Zap className="w-6 h-6" />
            Generar Comparación Detallada
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {showComparison && scenarioA && scenarioB && resultsA && resultsB && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-dark-card rounded-2xl p-8 shadow-2xl border-2 border-yellow-600"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-yellow-600 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-100">Comparación de Resultados</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-dark-surface rounded-xl p-6 shadow-lg border border-dark-border">
                <div className="text-sm text-neutral-400 mb-2">Patrimonio Final Estimado</div>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-blue-400">Escenario A</div>
                    <AnimatedNumberDisplay
                      value={resultsA.finalPatrimony}
                      className="text-xl font-bold text-blue-400"
                      prefix="$"
                    />
                  </div>
                  <div>
                    <div className="text-xs text-green-400">Escenario B</div>
                    <AnimatedNumberDisplay
                      value={resultsB.finalPatrimony}
                      className="text-xl font-bold text-green-400"
                      prefix="$"
                    />
                  </div>
                  <div className="pt-2 border-t-2 border-dark-border">
                    <div className="text-xs text-neutral-400">Diferencia</div>
                    <div className={`text-lg font-bold ${resultsB.finalPatrimony > resultsA.finalPatrimony ? 'text-green-400' : 'text-blue-400'}`}>
                      {formatCurrency(Math.abs(resultsB.finalPatrimony - resultsA.finalPatrimony))}
                      <span className="text-sm ml-1">
                        ({resultsB.finalPatrimony > resultsA.finalPatrimony ? '+' : '-'}
                        {((Math.abs(resultsB.finalPatrimony - resultsA.finalPatrimony) / resultsA.finalPatrimony) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-surface rounded-xl p-6 shadow-lg border border-dark-border">
                <div className="text-sm text-neutral-400 mb-2">Utilidades Totales</div>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-blue-400">Escenario A</div>
                    <AnimatedNumberDisplay
                      value={resultsA.totalProfit}
                      className="text-xl font-bold text-blue-400"
                      prefix="$"
                    />
                  </div>
                  <div>
                    <div className="text-xs text-green-400">Escenario B</div>
                    <AnimatedNumberDisplay
                      value={resultsB.totalProfit}
                      className="text-xl font-bold text-green-400"
                      prefix="$"
                    />
                  </div>
                  <div className="pt-2 border-t-2 border-dark-border">
                    <div className="text-xs text-neutral-400">Diferencia</div>
                    <div className={`text-lg font-bold ${resultsB.totalProfit > resultsA.totalProfit ? 'text-green-400' : 'text-blue-400'}`}>
                      {formatCurrency(Math.abs(resultsB.totalProfit - resultsA.totalProfit))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-surface rounded-xl p-6 shadow-lg border border-dark-border">
                <div className="text-sm text-neutral-400 mb-2">Retorno Estimado Total</div>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-blue-400">Escenario A</div>
                    <AnimatedNumberDisplay
                      value={resultsA.roi}
                      className="text-xl font-bold text-blue-400"
                      suffix="%"
                    />
                  </div>
                  <div>
                    <div className="text-xs text-green-400">Escenario B</div>
                    <AnimatedNumberDisplay
                      value={resultsB.roi}
                      className="text-xl font-bold text-green-400"
                      suffix="%"
                    />
                  </div>
                  <div className="pt-2 border-t-2 border-dark-border">
                    <div className="text-xs text-neutral-400">Diferencia</div>
                    <div className={`text-lg font-bold ${resultsB.roi > resultsA.roi ? 'text-green-400' : 'text-blue-400'}`}>
                      {Math.abs(resultsB.roi - resultsA.roi).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-dark-surface rounded-xl p-6 shadow-lg mb-6 border border-dark-border">
              <h4 className="font-bold text-neutral-100 mb-4">Resumen de Parámetros</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-semibold text-blue-400 mb-2">Escenario A</div>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-neutral-400">Certificados:</span> <span className="font-semibold text-neutral-200">{scenarioA.initialCertificates}</span></div>
                    <div><span className="text-neutral-400">Plazo:</span> <span className="font-semibold text-neutral-200">{scenarioA.years} años</span></div>
                    <div><span className="text-neutral-400">Retiro:</span> <span className="font-semibold text-neutral-200">{scenarioA.cashOutPercentage}%</span></div>
                    <div><span className="text-neutral-400">Producción:</span> <span className="font-semibold text-neutral-200">{getProductionPresetName(scenarioA)}</span></div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-green-400 mb-2">Escenario B</div>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-neutral-400">Certificados:</span> <span className="font-semibold text-neutral-200">{scenarioB.initialCertificates}</span></div>
                    <div><span className="text-neutral-400">Plazo:</span> <span className="font-semibold text-neutral-200">{scenarioB.years} años</span></div>
                    <div><span className="text-neutral-400">Retiro:</span> <span className="font-semibold text-neutral-200">{scenarioB.cashOutPercentage}%</span></div>
                    <div><span className="text-neutral-400">Producción:</span> <span className="font-semibold text-neutral-200">{getProductionPresetName(scenarioB)}</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowComparison(false)}
                className="bg-dark-surface text-neutral-200 px-6 py-2 rounded-lg font-semibold hover:bg-dark-border transition-colors border border-dark-border"
              >
                Cerrar Comparación
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScenarioComparator;
