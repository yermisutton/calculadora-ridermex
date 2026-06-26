import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, TrendingUp, Wallet, ChevronDown, ChevronUp, Settings, PlusCircle } from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';

interface AlternativeInvestment {
  id: 'cetes' | 'realEstate' | 'savings' | 'custom';
  name: string;
  icon: React.ElementType;
  defaultValue: number;
  color: string;
  description: string;
  isCustom?: boolean;
}

const AlternativeInvestmentsCard: React.FC = () => {
  const { investment, updateInvestment } = useCalculator();
  const [isExpanded, setIsExpanded] = useState(false);
  const [customName, setCustomName] = useState(investment.customInvestmentName || 'Mi Inversión');

  const alternatives: AlternativeInvestment[] = [
    {
      id: 'cetes',
      name: 'CETES',
      icon: TrendingUp,
      defaultValue: 7.5,
      color: 'from-blue-500 to-cyan-600',
      description: 'Rendimiento anual promedio'
    },
    {
      id: 'realEstate',
      name: 'Bien Raíz',
      icon: Building,
      defaultValue: 8.0,
      color: 'from-orange-500 to-red-600',
      description: 'Plusvalía anual estimada'
    },
    {
      id: 'savings',
      name: 'Ahorro',
      icon: Wallet,
      defaultValue: 4.0,
      color: 'from-green-500 to-emerald-600',
      description: 'Interés bancario anual'
    },
    {
      id: 'custom',
      name: investment.customInvestmentName || 'Mi Inversión',
      icon: PlusCircle,
      defaultValue: 8.0,
      color: 'from-purple-500 to-pink-600',
      description: 'Inversión personalizada',
      isCustom: true
    }
  ];

  const getInvestmentValue = (id: string): number => {
    switch (id) {
      case 'cetes':
        return investment.cetesRate || 7.5;
      case 'realEstate':
        return investment.realEstateRate || 8.0;
      case 'savings':
        return investment.savingsRate || 4.0;
      case 'custom':
        return investment.customInvestmentRate || 8.0;
      default:
        return 0;
    }
  };

  const handleValueChange = (id: string, value: number) => {
    switch (id) {
      case 'cetes':
        updateInvestment({ cetesRate: value });
        break;
      case 'realEstate':
        updateInvestment({ realEstateRate: value });
        break;
      case 'savings':
        updateInvestment({ savingsRate: value });
        break;
      case 'custom':
        updateInvestment({ customInvestmentRate: value });
        break;
    }
  };

  const handleInputChange = (id: string, inputValue: string) => {
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      handleValueChange(id, numValue);
    }
  };

  const resetToDefaults = () => {
    updateInvestment({
      cetesRate: 7.5,
      realEstateRate: 8.0,
      savingsRate: 4.0,
      customInvestmentRate: 8.0,
      customInvestmentName: 'Mi Inversión'
    });
    setCustomName('Mi Inversión');
  };

  const handleCustomNameChange = (name: string) => {
    setCustomName(name);
    updateInvestment({ customInvestmentName: name });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-lg border-2 border-blue-200 overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-white/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-gray-900">Otras Inversiones</h3>
            <p className="text-sm text-gray-600">Configura las tasas de comparación</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-6 h-6 text-gray-600" />
        ) : (
          <ChevronDown className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="px-6 pb-6"
        >
          <div className="bg-white rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Ajusta las tasas de rendimiento para comparar tu inversión con otras alternativas
              </p>
              <button
                onClick={resetToDefaults}
                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-lg transition-colors text-sm"
              >
                Restaurar
              </button>
            </div>

            {alternatives.map((alt) => {
              const Icon = alt.icon;
              const currentValue = getInvestmentValue(alt.id);

              return (
                <div key={alt.id} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${alt.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      {alt.isCustom ? (
                        <input
                          type="text"
                          value={customName}
                          onChange={(e) => handleCustomNameChange(e.target.value)}
                          placeholder="Nombre de tu inversión"
                          className="font-bold text-gray-900 bg-transparent border-b-2 border-purple-300 focus:border-purple-500 outline-none w-full"
                        />
                      ) : (
                        <h4 className="font-bold text-gray-900">{alt.name}</h4>
                      )}
                      <p className="text-xs text-gray-600">{alt.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{currentValue.toFixed(1)}%</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="30"
                      step="0.1"
                      value={currentValue}
                      onChange={(e) => handleValueChange(alt.id, parseFloat(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentValue / 30) * 100}%, #e5e7eb ${(currentValue / 30) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <input
                      type="number"
                      min="0"
                      max="30"
                      step="0.1"
                      value={currentValue}
                      onChange={(e) => handleInputChange(alt.id, e.target.value)}
                      className="w-24 px-3 py-2 border-2 border-gray-300 rounded-lg text-center font-semibold text-gray-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span className="text-gray-400">Rango: 0% - 30%</span>
                    <span>30%</span>
                  </div>

                  {alt.id !== 'custom' && <div className="border-t border-gray-200 pt-4 mt-4"></div>}
                </div>
              );
            })}

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 mt-6">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-blue-700">Nota:</span> Estos valores se utilizan para comparar tu inversión con otras alternativas en las gráficas y reportes comparativos.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AlternativeInvestmentsCard;
