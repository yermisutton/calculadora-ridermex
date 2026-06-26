import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, ChevronLeft, ChevronRight, TrendingUp, Percent, Calculator, DollarSign } from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';
import EditableCard from '../ui/EditableCard';
import { Toggle } from '../ui/Toggle';

interface SimplifiedStep3SpecificDataProps {
  onNext: () => void;
  onPrevious: () => void;
}

const SimplifiedStep3SpecificData: React.FC<SimplifiedStep3SpecificDataProps> = ({ onNext, onPrevious }) => {
  const { investment, updateInvestment } = useCalculator();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-dark-card rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-cyan-400/30 p-8 text-white">
          <div className="flex items-center gap-6">
            <img
              src="/rider_inversiones.png"
              alt="Ridermex Inversiones"
              className="h-20 w-auto drop-shadow-lg"
            />
            <div className="w-16 h-16 bg-dark-card/20 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Datos Específicos</h2>
              <p className="text-teal-100 text-lg">Parámetros específicos para tu análisis</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Inflación */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span>Tasa de Inflación</span>
            </h3>
            
            <EditableCard
              title="Inflación Anual"
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

          {/* Incremento Precio Limón */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
                <Percent className="w-5 h-5 text-green-600" />
                <span>Incremento Precio Limón</span>
              </h3>
              <Toggle
                checked={investment.increaseLemonPrice}
                onChange={() => updateInvestment({ increaseLemonPrice: !investment.increaseLemonPrice })}
              />
            </div>
            
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

          {/* Impuestos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-purple-600" />
                <span>Aplicar Impuestos</span>
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

          {/* Tasas Comparativas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <span>Tasas de Inversiones Comparativas</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <EditableCard
                title="CETES"
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
                title="Ahorro Tradicional"
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
                title="Bienes Raíces"
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

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPrevious}
              className="px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-all duration-300 flex items-center gap-3"
            >
              <ChevronLeft className="w-6 h-6" />
              <span>Anterior</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="px-12 py-4 bg-gradient-to-r from-slate-800 to-slate-700 border-b border-cyan-400/30 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 text-lg"
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

export default SimplifiedStep3SpecificData;