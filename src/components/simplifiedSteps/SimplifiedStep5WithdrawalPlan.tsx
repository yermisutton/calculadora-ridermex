import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ChevronLeft, ChevronRight, Percent, Settings, RefreshCw, Sliders } from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';
import { Toggle } from '../ui/Toggle';
import EditableCard from '../ui/EditableCard';

interface SimplifiedStep5WithdrawalPlanProps {
  onNext: () => void;
  onPrevious: () => void;
}

const SimplifiedStep5WithdrawalPlan: React.FC<SimplifiedStep5WithdrawalPlanProps> = ({ onNext, onPrevious }) => {
  const { 
    investment, 
    updateInvestment,
    updateCashOutPercentage, 
    setDefaultYearlyCashOutPercentage
  } = useCalculator();
  
  const [defaultPercentage, setDefaultPercentage] = useState(investment.cashOutPercentage);

  // Apply default percentage to all years
  const handleApplyDefaultToAll = () => {
    setDefaultYearlyCashOutPercentage(defaultPercentage);
    updateCashOutPercentage(defaultPercentage);
  };

  // Create predefined patterns
  const handleCreateIncreasingPattern = () => {
    const maxYears = Math.min(investment.years, 30);
    const step = (80 - 0) / (maxYears - 1);
    
    for (let year = 1; year <= maxYears; year++) {
      const percentage = Math.round((year - 1) * step);
      updateInvestment({ 
        yearlyCashOutPercentages: investment.yearlyCashOutPercentages.map((_, index) => 
          index === year - 1 ? percentage : investment.yearlyCashOutPercentages[index]
        )
      });
    }
    
    updateCashOutPercentage(40);
    setDefaultPercentage(40);
  };

  const handleCreateRetirementPattern = () => {
    const maxYears = Math.min(investment.years, 30);
    const newPercentages = [...investment.yearlyCashOutPercentages];
    
    for (let year = 1; year <= maxYears; year++) {
      let percentage;
      if (year <= 5) {
        percentage = 0;
      } else if (year <= 15) {
        percentage = Math.round((year - 5) * (30 / 10));
      } else {
        percentage = Math.round(30 + ((year - 15) * (70 - 30) / (maxYears - 15)));
      }
      newPercentages[year - 1] = percentage;
    }
    
    updateInvestment({ yearlyCashOutPercentages: newPercentages });
    updateCashOutPercentage(30);
    setDefaultPercentage(30);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-dark-card rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-white">
          <div className="flex items-center gap-6">
            <img
              src="/rider_inversiones.png"
              alt="Ridermex Inversiones"
              className="h-20 w-auto drop-shadow-lg"
            />
            <div className="w-16 h-16 bg-dark-card/20 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Plan de Retiros</h2>
              <p className="text-amber-100 text-lg">Estrategia de retiro de utilidades</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Activar Retiro Parcial */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-200 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-amber-800">Activar Retiro Parcial</h3>
                  <p className="text-amber-600">Retira un porcentaje de utilidades como ingreso mensual</p>
                </div>
              </div>
              <Toggle
                checked={investment.partialCashOut}
                onChange={() => updateInvestment({ partialCashOut: !investment.partialCashOut })}
              />
            </div>
            
            <div className="text-center">
              <p className="text-sm text-amber-700">
                {investment.partialCashOut 
                  ? "Con el retiro parcial activado, podrás disfrutar de un ingreso mensual mientras sigues reinvirtiendo para el crecimiento a largo plazo."
                  : "Con el retiro parcial desactivado, todas las utilidades se reinvertirán para maximizar el crecimiento patrimonial."
                }
              </p>
            </div>
          </div>

          {/* Configuración de Porcentaje */}
          {investment.partialCashOut && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EditableCard
                  title="Porcentaje de Retiro"
                  value={defaultPercentage}
                  unit="% de utilidades"
                  color="#f59e0b"
                  min={0}
                  max={100}
                  step={5}
                  presets={[
                    { label: '0%', value: 0 },
                    { label: '25%', value: 25 },
                    { label: '50%', value: 50 },
                    { label: '75%', value: 75 }
                  ]}
                  onChange={(value) => {
                    setDefaultPercentage(value);
                    updateCashOutPercentage(value);
                  }}
                  formatValue={(v) => `${v}%`}
                />

                <div className="bg-dark-card rounded-xl shadow-sm border border-gray-200 p-4">
                  <h4 className="font-medium text-gray-700 mb-4">Aplicar Configuración</h4>
                  <div className="space-y-3">
                    <button
                      onClick={handleApplyDefaultToAll}
                      className="w-full py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                    >
                      Aplicar a Todos los Años
                    </button>
                  </div>
                </div>
              </div>

              {/* Patrones Predefinidos */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-600" />
                  <span>Patrones Rápidos</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handleCreateIncreasingPattern}
                    className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-md transition-all duration-300 text-left"
                  >
                    <h5 className="font-medium text-green-800 mb-2">Patrón Creciente</h5>
                    <p className="text-sm text-green-600 mb-3">Retiros bajos al inicio, altos al final</p>
                    <div className="h-2 bg-dark-card rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-200 via-green-400 to-green-600 w-full"></div>
                    </div>
                  </button>
                  
                  <button
                    onClick={handleCreateRetirementPattern}
                    className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-all duration-300 text-left"
                  >
                    <h5 className="font-medium text-blue-800 mb-2">Patrón de Retiro</h5>
                    <p className="text-sm text-blue-600 mb-3">Optimizado para jubilación</p>
                    <div className="h-2 bg-dark-card rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-200 via-blue-300 to-blue-600 w-full"></div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Explicación */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-medium text-neutral-100 mb-3">¿Cómo Funciona?</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium text-amber-700">Retiro Parcial:</span> Puedes retirar un porcentaje de las utilidades generadas cada año como ingreso mensual.
                  </p>
                  <p>
                    <span className="font-medium text-amber-700">Estrategia Personalizada:</span> Configura diferentes porcentajes para cada año según tus necesidades financieras.
                  </p>
                  <p>
                    <span className="font-medium text-amber-700">Ejemplos:</span>
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Años 1-10: 0% retiro (máximo crecimiento)</li>
                    <li>Años 11-20: 30% retiro (ingreso moderado)</li>
                    <li>Años 21-30: 70% retiro (preparación para retiro)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

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
              className="px-12 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 text-lg"
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

export default SimplifiedStep5WithdrawalPlan;