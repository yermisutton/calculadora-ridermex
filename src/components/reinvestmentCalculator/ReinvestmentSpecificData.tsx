import React from 'react';
import { motion } from 'framer-motion';
import { Settings, ChevronLeft, ChevronRight, TrendingUp, Percent, DollarSign, Calculator, BarChart3, Zap } from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';
import { formatCurrency, convertFromMXN, convertToMXN } from '../../utils/formatters';
import EditableCard from '../ui/EditableCard';
import { Toggle } from '../ui/Toggle';
import { getLanguageContent, getLanguageFromCurrency } from '../../data/languages';

interface ReinvestmentSpecificDataProps {
  onNext: () => void;
  onPrevious: () => void;
}

const ReinvestmentSpecificData: React.FC<ReinvestmentSpecificDataProps> = ({ onNext, onPrevious }) => {
  const { investment, updateInvestment } = useCalculator();
  
  // Get current language content
  const currentLanguage = investment.language || getLanguageFromCurrency(investment.currencyFormat);
  const content = getLanguageContent(currentLanguage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-slate-700/50 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Quick Edit Header */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 border border-cyan-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-50">Configuración Específica</h3>
                <p className="text-neutral-300">Ajusta parámetros específicos para tu análisis de inversión</p>
              </div>
            </div>
          </div>

          {/* Inflation Rate */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-50 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span>{content.traditional.specificData.inflationRate.title}</span>
            </h3>
            
            <EditableCard
              title="Tasa de Inflación"
              value={investment.inflationRate}
              unit="% anual"
              color="#ea580c"
              min={1}
              max={15}
              step={0.5}
              presets={[
                { label: '3%', value: 3 },
                { label: '5%', value: 5 },
                { label: '7%', value: 7 },
                { label: '10%', value: 10 }
              ]}
              onChange={(value) => updateInvestment({ inflationRate: value })}
              formatValue={(v) => `${v}%`}
            />
          </div>

          {/* Lemon Price Increase */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-50 flex items-center gap-2">
                <Percent className="w-5 h-5 text-green-600" />
                <span>{content.traditional.specificData.lemonPriceIncrease.title}</span>
              </h3>
              <Toggle
                checked={investment.increaseLemonPrice}
                onChange={() => updateInvestment({ increaseLemonPrice: !investment.increaseLemonPrice })}
              />
            </div>

            <p className="text-sm text-neutral-300 px-2">
              Incremento anual del precio de motocicletas. Este factor ya incluye implícitamente el efecto de la inflación.
            </p>

            {investment.increaseLemonPrice && (
              <EditableCard
                title="Incremento Anual"
                value={investment.lemonPriceIncrease}
                unit="% anual"
                color="#16a34a"
                min={0}
                max={15}
                step={0.5}
                presets={[
                  { label: '3%', value: 3 },
                  { label: '5%', value: 5 },
                  { label: '7%', value: 7 },
                  { label: '10%', value: 10 }
                ]}
                onChange={(value) => updateInvestment({ lemonPriceIncrease: value })}
                formatValue={(v) => `${v}%`}
              />
            )}
          </div>

          {/* Market Growth Rate */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-50 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>Incremento del Mercado Anual</span>
              </h3>
              <Toggle
                checked={investment.enableMarketGrowth}
                onChange={() => updateInvestment({ enableMarketGrowth: !investment.enableMarketGrowth })}
              />
            </div>

            <p className="text-sm text-neutral-300 px-2">
              Crecimiento adicional del mercado. Se suma al incremento de precio de motocicletas para proyectar el crecimiento total de utilidades.
            </p>

            {investment.enableMarketGrowth && (
              <EditableCard
                title="Crecimiento del Mercado"
                value={investment.marketGrowthRate}
                unit="% anual"
                color="#0284c7"
                min={0}
                max={10}
                step={0.5}
                presets={[
                  { label: '1%', value: 1 },
                  { label: '2%', value: 2 },
                  { label: '3%', value: 3 },
                  { label: '5%', value: 5 }
                ]}
                onChange={(value) => updateInvestment({ marketGrowthRate: value })}
                formatValue={(v) => `${v}%`}
              />
            )}
          </div>

          {/* Present Value Toggle */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-50 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <span>Valor Presente</span>
              </h3>
              <Toggle
                checked={investment.usePresentValue}
                onChange={() => updateInvestment({ usePresentValue: !investment.usePresentValue })}
              />
            </div>

            {investment.usePresentValue && (
              <div className="p-4 bg-indigo-50 rounded-xl">
                <p className="text-sm text-indigo-700">
                  Los valores se ajustan a dinero presente, restando el efecto de la inflación ({investment.inflationRate}% anual). Esto muestra el poder adquisitivo real del dinero.
                </p>
              </div>
            )}
          </div>

          {/* Taxes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-50 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-purple-600" />
                <span>{content.traditional.specificData.taxes.title}</span>
              </h3>
              <Toggle
                checked={investment.applyTaxes}
                onChange={() => updateInvestment({ applyTaxes: !investment.applyTaxes })}
              />
            </div>
            
            {investment.applyTaxes && (
              <EditableCard
                title="Tasa de Impuestos"
                value={investment.taxRate}
                unit="% sobre rendimientos"
                color="#8b5cf6"
                min={10}
                max={40}
                step={1}
                presets={[
                  { label: '20%', value: 20 },
                  { label: '25%', value: 25 },
                  { label: '30%', value: 30 },
                  { label: '35%', value: 35 }
                ]}
                onChange={(value) => updateInvestment({ taxRate: value })}
                formatValue={(v) => `${v}%`}
              />
            )}
          </div>

          {/* Comparative Investment Rates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-50 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>{content.traditional.specificData.comparativeRates.title}</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <EditableCard
                title={content.traditional.specificData.comparativeRates.cetes}
                value={investment.cetesRate}
                unit="% anual"
                color="#0284c7"
                min={4}
                max={15}
                step={0.5}
                presets={[
                  { label: '6%', value: 6 },
                  { label: '8%', value: 8 },
                  { label: '10%', value: 10 },
                  { label: '12%', value: 12 }
                ]}
                onChange={(value) => updateInvestment({ cetesRate: value })}
                formatValue={(v) => `${v}%`}
              />

              <EditableCard
                title={content.traditional.specificData.comparativeRates.savings}
                value={investment.savingsRate}
                unit="% anual"
                color="#7c3aed"
                min={1}
                max={8}
                step={0.5}
                presets={[
                  { label: '2%', value: 2 },
                  { label: '4%', value: 4 },
                  { label: '6%', value: 6 },
                  { label: '8%', value: 8 }
                ]}
                onChange={(value) => updateInvestment({ savingsRate: value })}
                formatValue={(v) => `${v}%`}
              />

              <EditableCard
                title={content.traditional.specificData.comparativeRates.realEstate}
                value={investment.realEstateAppreciation}
                unit="% apreciación"
                color="#ea580c"
                min={3}
                max={15}
                step={0.5}
                presets={[
                  { label: '5%', value: 5 },
                  { label: '8%', value: 8 },
                  { label: '10%', value: 10 },
                  { label: '12%', value: 12 }
                ]}
                onChange={(value) => updateInvestment({ realEstateAppreciation: value })}
                formatValue={(v) => `${v}%`}
              />
            </div>
          </div>

          {/* Payment Boost */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-50 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                <span>Boost de Pago</span>
              </h3>
              <Toggle
                checked={investment.enablePaymentBoost}
                onChange={() => updateInvestment({ enablePaymentBoost: !investment.enablePaymentBoost })}
              />
            </div>
            
            {investment.enablePaymentBoost && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableCard
                  title="Monto Anual del Boost"
                  value={investment.paymentBoostAmount || 120000}
                  unit="por año"
                  color="#8b5cf6"
                  min={50000}
                  max={500000}
                  step={10000}
                  presets={[
                    { label: '100K', value: 100000 },
                    { label: '150K', value: 150000 },
                    { label: '200K', value: 200000 },
                    { label: '300K', value: 300000 }
                  ]}
                  onChange={(value) => updateInvestment({ paymentBoostAmount: value })}
                  formatValue={(v) => `$${v.toLocaleString()}`}
                />

                <EditableCard
                  title="Crecimiento Anual del Boost"
                  value={investment.paymentBoostGrowthRate}
                  unit="% crecimiento"
                  color="#6366f1"
                  min={0}
                  max={10}
                  step={0.5}
                  presets={[
                    { label: '0%', value: 0 },
                    { label: '3%', value: 3 },
                    { label: '5%', value: 5 },
                    { label: '7%', value: 7 }
                  ]}
                  onChange={(value) => updateInvestment({ paymentBoostGrowthRate: value })}
                  formatValue={(v) => `${v}%`}
                />
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPrevious}
              className="px-8 py-4 bg-dark-surface text-neutral-200 font-semibold rounded-2xl hover:bg-dark-border transition-all duration-300 flex items-center gap-3"
            >
              <ChevronLeft className="w-6 h-6" />
              <span>Anterior</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="px-12 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 text-lg"
            >
              <span>Continuar</span>
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReinvestmentSpecificData;