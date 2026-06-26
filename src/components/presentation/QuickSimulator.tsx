import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Hash, Calendar, BarChart3, ArrowRight } from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';
import AnimatedNumberDisplay from '../ui/AnimatedNumberDisplay';
import { calculateResults } from '../../utils/calculations';

const QuickSimulator: React.FC = () => {
  const { investment, updateInvestment } = useCalculator();
  const [quickCertificates, setQuickCertificates] = useState(investment.initialCertificates);
  const [quickYears, setQuickYears] = useState(investment.years);
  const [quickReturn, setQuickReturn] = useState(investment.annualProfit);

  const quickCertificatesOptions = [1, 5, 10, 25, 50];
  const quickYearsOptions = [10, 15, 20, 25, 30];

  const productionPresets = [
    { label: 'Conservador', production: 25000, price: 35, color: 'orange' },
    { label: 'Moderado', production: 30000, price: 35, color: 'blue' },
    { label: 'Optimista', production: 35000, price: 38, color: 'green' }
  ];

  const [selectedPreset, setSelectedPreset] = useState(productionPresets[1]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: investment.currencyFormat,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const applyQuickScenario = () => {
    const initialPayment = quickCertificates * investment.certificateBasePrice;
    updateInvestment({
      initialCertificates: quickCertificates,
      initialPayment: initialPayment,
      years: quickYears,
      averageProductionPerHectare: selectedPreset.production,
      averageSalePricePerKg: selectedPreset.price
    });
  };

  const quickResults = calculateResults({
    ...investment,
    initialCertificates: quickCertificates,
    initialPayment: quickCertificates * investment.certificateBasePrice,
    years: quickYears,
    averageProductionPerHectare: selectedPreset.production,
    averageSalePricePerKg: selectedPreset.price
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <motion.div
        className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl p-6 shadow-2xl"
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-8 h-8" />
          <h2 className="text-3xl font-bold">Simulador Express</h2>
        </div>
        <p className="text-yellow-100">Prueba diferentes montos y ve resultados instantáneos</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          className="bg-dark-card rounded-2xl p-6 shadow-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Hash className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Número de Certificados</h3>
          </div>
          <div className="space-y-2">
            {quickCertificatesOptions.map((certificates) => (
              <button
                key={certificates}
                onClick={() => setQuickCertificates(certificates)}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                  quickCertificates === certificates
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                {certificates} certificado{certificates !== 1 ? 's' : ''}
                <div className="text-xs mt-1 opacity-80">
                  {formatCurrency(certificates * investment.certificateBasePrice)}
                </div>
              </button>
            ))}
            <input
              type="number"
              min="1"
              max="100"
              value={quickCertificates}
              onChange={(e) => setQuickCertificates(Number(e.target.value))}
              className="w-full py-2 px-4 border-2 border-blue-300 rounded-lg text-center font-semibold text-blue-700 focus:border-blue-500 focus:outline-none"
              placeholder="Personalizado"
            />
          </div>
        </motion.div>

        <motion.div
          className="bg-dark-card rounded-2xl p-6 shadow-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">Plazo en Años</h3>
          </div>
          <div className="space-y-2">
            {quickYearsOptions.map((years) => (
              <button
                key={years}
                onClick={() => setQuickYears(years)}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                  quickYears === years
                    ? 'bg-green-600 text-white shadow-lg scale-105'
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                {years} años
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="bg-dark-card rounded-2xl p-6 shadow-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">Escenario de Producción</h3>
          </div>
          <div className="space-y-2">
            {productionPresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => setSelectedPreset(preset)}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all text-left ${
                  selectedPreset.label === preset.label
                    ? `bg-${preset.color}-600 text-white shadow-lg scale-105`
                    : `bg-${preset.color}-50 text-${preset.color}-700 hover:bg-${preset.color}-100`
                }`}
              >
                <div className="font-bold">{preset.label}</div>
                <div className="text-xs opacity-80">
                  {preset.production.toLocaleString()} kg/ha · ${preset.price}/kg
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl p-8 shadow-2xl text-white"
      >
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6" />
          Proyección Instantánea
        </h3>

        <div className="grid md:grid-cols-5 gap-4 mb-6">
          <div className="bg-dark-card/10 backdrop-blur rounded-xl p-4">
            <div className="text-sm text-emerald-100 mb-2">Certificados</div>
            <div className="text-2xl font-bold">{quickCertificates}</div>
            <div className="text-xs text-emerald-100 mt-1">{formatCurrency(quickCertificates * investment.certificateBasePrice)}</div>
          </div>
          <div className="bg-dark-card/10 backdrop-blur rounded-xl p-4">
            <div className="text-sm text-emerald-100 mb-2">Certificados Totales</div>
            <div className="text-2xl font-bold">{Math.round(quickResults.finalCertificates).toLocaleString()}</div>
            <div className="text-xs text-emerald-100 mt-1">Al finalizar</div>
          </div>
          <div className="bg-dark-card/10 backdrop-blur rounded-xl p-4">
            <div className="text-sm text-emerald-100 mb-2">Plazo</div>
            <div className="text-2xl font-bold">{quickYears} años</div>
          </div>
          <div className="bg-dark-card/10 backdrop-blur rounded-xl p-4">
            <div className="text-sm text-emerald-100 mb-2">Escenario</div>
            <div className="text-2xl font-bold">{selectedPreset.label}</div>
            <div className="text-xs text-emerald-100 mt-1">{selectedPreset.production.toLocaleString()} kg/ha</div>
          </div>
          <div className="bg-dark-card/10 backdrop-blur rounded-xl p-4">
            <div className="text-sm text-emerald-100 mb-2">Retorno Estimado Total</div>
            <AnimatedNumberDisplay
              value={quickResults.roi}
              className="text-2xl font-bold"
              suffix="%"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-dark-card/20 backdrop-blur rounded-xl p-6">
            <div className="text-sm text-emerald-100 mb-2">Patrimonio Final Estimado</div>
            <AnimatedNumberDisplay
              value={quickResults.finalPatrimony}
              className="text-4xl font-bold"
              prefix="$"
            />
          </div>
          <div className="bg-dark-card/20 backdrop-blur rounded-xl p-6">
            <div className="text-sm text-emerald-100 mb-2">Utilidades Totales</div>
            <AnimatedNumberDisplay
              value={quickResults.totalProfit}
              className="text-4xl font-bold"
              prefix="$"
            />
          </div>
        </div>

        <motion.button
          onClick={applyQuickScenario}
          className="w-full bg-dark-card text-green-600 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Aplicar este Escenario
          <ArrowRight className="w-6 h-6" />
        </motion.button>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
          <div className="text-sm text-blue-600 font-semibold mb-1">Ingreso Mensual Promedio</div>
          <AnimatedNumberDisplay
            value={quickResults.totalProfit / (quickYears * 12)}
            className="text-2xl font-bold text-blue-700"
            prefix="$"
          />
        </div>
        <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
          <div className="text-sm text-green-600 font-semibold mb-1">Ingreso Anual Promedio</div>
          <AnimatedNumberDisplay
            value={quickResults.totalProfit / quickYears}
            className="text-2xl font-bold text-green-700"
            prefix="$"
          />
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
          <div className="text-sm text-purple-600 font-semibold mb-1">Multiplicador de Capital</div>
          <AnimatedNumberDisplay
            value={quickResults.finalPatrimony / (quickCertificates * investment.certificateBasePrice)}
            className="text-2xl font-bold text-purple-700"
            suffix="x"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default QuickSimulator;
