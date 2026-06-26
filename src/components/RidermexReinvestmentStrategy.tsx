import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Info, DollarSign, Wallet, Zap } from 'lucide-react';

interface RidermexReinvestmentStrategyProps {
  initialInvestment: number;
  annualReturn: number;
  reinvestPercentage: number;
  onReinvestPercentageChange: (percentage: number) => void;
  theme?: 'dark' | 'light';
}

const RidermexReinvestmentStrategy: React.FC<RidermexReinvestmentStrategyProps> = ({
  initialInvestment,
  annualReturn,
  reinvestPercentage,
  onReinvestPercentageChange,
  theme = 'dark'
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);

  const isDark = theme === 'dark';
  const bgCard = isDark ? 'bg-dark-card' : 'bg-white';
  const bgSurface = isDark ? 'bg-dark-surface' : 'bg-gray-50';
  const borderColor = isDark ? 'border-dark-border' : 'border-gray-200';
  const textPrimary = isDark ? 'text-neutral-100' : 'text-gray-900';
  const textSecondary = isDark ? 'text-neutral-400' : 'text-gray-500';
  const textMuted = isDark ? 'text-neutral-500' : 'text-gray-400';

  const reinvestAmount = (annualReturn * reinvestPercentage) / 100;
  const withdrawAmount = annualReturn - reinvestAmount;

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className={`${bgCard} rounded-xl border ${borderColor} overflow-hidden`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between p-4 ${isDark ? 'hover:bg-dark-surface/50' : 'hover:bg-gray-50'} transition-colors`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h4 className={`font-bold ${textPrimary}`}>
              Estrategia de Reinversión
            </h4>
            <p className={`text-sm ${textSecondary}`}>
              Configura cómo dividir tus ganancias anuales
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
            className="overflow-hidden border-t border-dark-border"
          >
            <div className="p-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={`text-sm font-semibold ${textPrimary}`}>
                    Porcentaje para Reinvertir
                  </label>
                  <span className={`text-lg font-bold text-emerald-500`}>
                    {reinvestPercentage}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={reinvestPercentage}
                  onChange={(e) => onReinvestPercentageChange(Number(e.target.value))}
                  className="w-full h-3 bg-dark-surface rounded-lg appearance-none cursor-pointer slider-reinvest"
                />
              </div>

              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className={`flex items-center gap-1.5 text-xs ${textSecondary} hover:text-emerald-500 transition-colors`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>¿Por qué es importante la reinversión?</span>
              </button>

              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className={`p-3 rounded-lg ${bgSurface} border ${borderColor} text-xs ${textSecondary} space-y-2`}
                  >
                    <p>
                      <strong className={textPrimary}>Reinversión al 100%:</strong> Tus ganancias se usan para comprar más tickets. Esto genera un efecto avalancha donde cada nuevo ticket produce más ingresos, creando crecimiento exponencial.
                    </p>
                    <p>
                      <strong className={textPrimary}>Reinversión parcial:</strong> Retiras una parte para gastos personales mientras la otra compra nuevos tickets. Balance entre crecimiento e ingresos disponibles.
                    </p>
                    <p>
                      <strong className={textPrimary}>Reinversión al 0%:</strong> Retiras todas las ganancias. No hay crecimiento del portafolio, pero tienes ingresos disponibles cada año.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className={`p-3 rounded-lg ${bgSurface} border ${borderColor} text-center`}>
                  <div className="text-[10px] text-emerald-500 font-semibold mb-1">REINVERTIR</div>
                  <div className={`text-lg font-bold ${textPrimary}`}>
                    {formatCurrency(reinvestAmount)}
                  </div>
                  <div className={`text-[10px] ${textMuted} mt-1`}>{reinvestPercentage}% del retorno</div>
                </div>

                <div className="flex items-center justify-center">
                  <div className={`w-8 h-0.5 ${borderColor}`}></div>
                </div>

                <div className={`p-3 rounded-lg ${bgSurface} border ${borderColor} text-center`}>
                  <div className="text-[10px] text-amber-500 font-semibold mb-1">RETIRAR</div>
                  <div className={`text-lg font-bold ${textPrimary}`}>
                    {formatCurrency(withdrawAmount)}
                  </div>
                  <div className={`text-[10px] ${textMuted} mt-1`}>{100 - reinvestPercentage}% del retorno</div>
                </div>
              </div>

              <div className={`p-3 rounded-lg ${bgSurface} border ${borderColor} space-y-2`}>
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <div className={`font-semibold ${textPrimary}`}>Efecto de Reinversión</div>
                    <div className={textSecondary}>
                      Si reinviertes tus ganancias, cada año comprarás más tickets que generarán más ingresos el próximo año. Este efecto compuesto hace que tu portafolio crezca exponencialmente.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <DollarSign className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <div className={`font-semibold ${textPrimary}`}>Información Anual</div>
                    <div className={textSecondary}>
                      Retorno anual estimado: <span className="font-bold text-emerald-500">{formatCurrency(annualReturn)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-3 rounded-lg bg-amber-500/10 border border-amber-500/20`}>
                <p className={`text-xs ${textSecondary}`}>
                  <strong className="text-amber-600">Nota:</strong> A mayor reinversión, mayor crecimiento futuro pero menos ingresos disponibles ahora. Encuentra el balance que funcione para ti.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const sliderStyles = `
  .slider-reinvest::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #10b981;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  }

  .slider-reinvest::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #10b981;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  }

  .slider-reinvest::-webkit-slider-runnable-track {
    height: 8px;
    border-radius: 4px;
  }

  .slider-reinvest::-moz-range-track {
    background: #374151;
    height: 8px;
    border-radius: 4px;
    border: none;
  }
`;

export default RidermexReinvestmentStrategy;
