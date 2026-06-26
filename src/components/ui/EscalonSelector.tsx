import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Info, Layers, TrendingDown, Target, TrendingUp } from 'lucide-react';
import { ESCALONES, RIDERMEX_CONFIG, type EscalonData, getDiscountByEscalon } from '../../data/ridermexConfig';

export type ScenarioType = 'conservative' | 'moderate' | 'optimistic';

interface EscalonSelectorProps {
  selectedEscalon: number;
  onEscalonChange: (escalon: EscalonData) => void;
  onScenarioChange?: (scenario: ScenarioType) => void;
  selectedScenario?: ScenarioType;
  compact?: boolean;
  theme?: 'dark' | 'light';
  showScenarioSelector?: boolean;
}

const SCENARIO_CONFIG = {
  conservative: {
    label: 'Conservador',
    description: `${RIDERMEX_CONFIG.SCENARIOS.conservative.motorcyclesPerMonth} motos/mes`,
    icon: TrendingDown,
    color: 'amber',
    bgGradient: 'from-amber-500/20 to-amber-600/10',
    borderActive: 'border-amber-500',
    textActive: 'text-amber-400',
    annualReturn: RIDERMEX_CONFIG.SCENARIOS.conservative.annualReturnPerTicket,
  },
  moderate: {
    label: 'Moderado',
    description: `${RIDERMEX_CONFIG.SCENARIOS.moderate.motorcyclesPerMonth} motos/mes`,
    icon: Target,
    color: 'emerald',
    bgGradient: 'from-emerald-500/20 to-emerald-600/10',
    borderActive: 'border-emerald-500',
    textActive: 'text-emerald-400',
    annualReturn: RIDERMEX_CONFIG.SCENARIOS.moderate.annualReturnPerTicket,
  },
  optimistic: {
    label: 'Optimista',
    description: `${RIDERMEX_CONFIG.SCENARIOS.optimistic.motorcyclesPerMonth} motos/mes`,
    icon: TrendingUp,
    color: 'cyan',
    bgGradient: 'from-cyan-500/20 to-cyan-600/10',
    borderActive: 'border-cyan-500',
    textActive: 'text-cyan-400',
    annualReturn: RIDERMEX_CONFIG.SCENARIOS.optimistic.annualReturnPerTicket,
  },
};

const EscalonSelector: React.FC<EscalonSelectorProps> = ({
  selectedEscalon,
  onEscalonChange,
  onScenarioChange,
  selectedScenario = 'moderate',
  compact = false,
  theme = 'dark',
  showScenarioSelector = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [showTooltip, setShowTooltip] = useState(false);
  const [internalScenario, setInternalScenario] = useState<ScenarioType>(selectedScenario);

  const activeScenario = onScenarioChange ? selectedScenario : internalScenario;
  const scenarioData = SCENARIO_CONFIG[activeScenario];
  const scenarioReturn = scenarioData.annualReturn;

  const escalonsWithScenario = useMemo(() => {
    return ESCALONES.map(e => ({
      ...e,
      annualReturn: scenarioReturn,
      quarterlyReturn: scenarioReturn / 4,
      roi: parseFloat(((scenarioReturn / e.entryPrice) * 100).toFixed(2)),
    }));
  }, [scenarioReturn]);

  const currentEscalon = escalonsWithScenario.find(e => e.number === selectedEscalon) || escalonsWithScenario[0];
  const baseEscalon = escalonsWithScenario[0];

  const handleScenarioChange = (scenario: ScenarioType) => {
    setInternalScenario(scenario);
    if (onScenarioChange) {
      onScenarioChange(scenario);
    }
  };

  const isDark = theme === 'dark';

  const bgCard = isDark ? 'bg-dark-card' : 'bg-white';
  const bgSurface = isDark ? 'bg-dark-surface' : 'bg-gray-50';
  const borderColor = isDark ? 'border-dark-border' : 'border-gray-200';
  const textPrimary = isDark ? 'text-neutral-100' : 'text-gray-900';
  const textSecondary = isDark ? 'text-neutral-400' : 'text-gray-500';
  const textMuted = isDark ? 'text-neutral-500' : 'text-gray-400';

  return (
    <div className={`${bgCard} rounded-xl border ${borderColor} overflow-hidden`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between p-4 ${isDark ? 'hover:bg-dark-surface/50' : 'hover:bg-gray-50'} transition-colors`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h4 className={`font-bold ${textPrimary}`}>
              Fase {currentEscalon.number}: {currentEscalon.name}
            </h4>
            <p className={`text-sm ${textSecondary}`}>
              ${currentEscalon.entryPrice.toLocaleString()} MXN
              <span className={`ml-2 text-xs ${scenarioData.textActive}`}>({scenarioData.label})</span>
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className={`w-5 h-5 ${textMuted}`} />
        ) : (
          <ChevronDown className={`w-5 h-5 ${textMuted}`} />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {showScenarioSelector && (
              <div className="mb-4">
                <div className={`text-xs font-semibold uppercase tracking-wider ${textSecondary} mb-2`}>
                  Escenario de Negocio
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(SCENARIO_CONFIG) as ScenarioType[]).map((key) => {
                    const scenario = SCENARIO_CONFIG[key];
                    const Icon = scenario.icon;
                    const isActive = activeScenario === key;

                    return (
                      <motion.button
                        key={key}
                        onClick={() => handleScenarioChange(key)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative p-3 rounded-xl text-center transition-all border-2 ${
                          isActive
                            ? `bg-gradient-to-br ${scenario.bgGradient} ${scenario.borderActive} shadow-lg`
                            : `${bgSurface} ${borderColor} ${isDark ? 'hover:border-neutral-600' : 'hover:border-gray-300'}`
                        }`}
                      >
                        <div className={`flex items-center justify-center mb-1.5 ${
                          isActive ? scenario.textActive : textMuted
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className={`text-xs font-bold mb-0.5 ${
                          isActive ? (isDark ? 'text-neutral-100' : 'text-gray-900') : textSecondary
                        }`}>
                          {scenario.label}
                        </div>
                        <div className={`text-[10px] ${isActive ? textSecondary : textMuted}`}>
                          {scenario.description}
                        </div>
                        <div className={`text-[11px] font-semibold mt-1 ${
                          isActive ? scenario.textActive : (isDark ? 'text-neutral-500' : 'text-gray-400')
                        }`}>
                          ${scenario.annualReturn.toLocaleString()}/año
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
              )}

              <div className="relative mb-3">
                <button
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className={`flex items-center gap-1.5 text-xs ${textSecondary} hover:text-amber-500 transition-colors`}
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>El retorno anual varia segun el escenario. El ROI Estimado varia segun el precio de entrada.</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {escalonsWithScenario.map((escalon) => {
                  const isSelected = escalon.number === selectedEscalon;
                  const discount = getDiscountByEscalon(escalon.number);

                  return (
                    <motion.button
                      key={escalon.number}
                      onClick={() => onEscalonChange(escalon)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`relative p-3 rounded-lg text-left transition-all border-2 ${
                        isSelected
                          ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white border-amber-400 shadow-lg shadow-amber-500/20'
                          : `${bgSurface} ${textPrimary} ${borderColor} ${isDark ? 'hover:border-amber-500/50' : 'hover:border-amber-400'}`
                      }`}
                    >
                      {escalon.number === 1 && (
                        <div className={`absolute -top-1.5 -right-1.5 px-1.5 py-0.5 text-[9px] font-bold rounded-full ${
                          isSelected ? 'bg-white text-amber-600' : 'bg-amber-500 text-white'
                        }`}>
                          MEJOR
                        </div>
                      )}

                      <div className="text-[10px] font-medium uppercase tracking-wide opacity-70 mb-0.5">
                        Fase {escalon.number}
                      </div>
                      <div className="font-bold text-xs leading-tight mb-1">
                        {escalon.name}
                      </div>
                      <div className={`text-xs font-semibold ${isSelected ? 'text-white/90' : 'text-amber-600'}`}>
                        ${escalon.entryPrice.toLocaleString()}
                      </div>
                      <div className={`text-[10px] ${isSelected ? 'text-white/70' : textMuted}`}>
                        Tickets {(escalon as any).ticketStart}-{(escalon as any).ticketEnd}
                      </div>
                      {discount > 0 ? (
                        <div className={`text-[10px] font-bold mt-1 ${
                          isSelected ? 'text-white' : isDark ? 'text-cyan-400' : 'text-cyan-600'
                        }`}>
                          Descuento: {discount}%
                        </div>
                      ) : (
                        <div className={`text-[10px] font-bold mt-1 ${
                          isSelected ? 'text-white/60' : textMuted
                        }`}>
                          Precio base
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <div className={`mt-3 grid grid-cols-3 gap-3 p-3 ${bgSurface} rounded-lg border ${borderColor}`}>
                <div className="text-center">
                  <div className={`text-xs ${textSecondary}`}>Precio Entrada</div>
                  <div className={`text-lg font-bold ${textPrimary}`}>
                    ${currentEscalon.entryPrice.toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-xs ${textSecondary}`}>Retorno Anual Est.</div>
                  <div className={`text-lg font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    ${currentEscalon.annualReturn.toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-xs ${textSecondary}`}>Descuento</div>
                  <div className={`text-lg font-bold ${getDiscountByEscalon(currentEscalon.number) > 0 ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {getDiscountByEscalon(currentEscalon.number)}%
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EscalonSelector;
