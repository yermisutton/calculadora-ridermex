import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, ChevronRight, ChevronLeft, Info, X, Check } from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';
import ReinvestmentCentralData from '../reinvestmentCalculator/ReinvestmentCentralData';
import { ESCALONES, RIDERMEX_CONFIG } from '../../data/ridermexConfig';

interface Step06CentralDataProps {
  onNext: () => void;
  onPrevious: () => void;
  onStepChange?: (step: number) => void;
}

const productInfo = {
  A: {
    title: 'Modelo A: Contado Tradicional',
    description: 'Costo: $100,000 | Pago de Contado | Descuento inicial: 30% | Rendimiento en Mes 7',
    color: 'from-blue-500 to-cyan-600'
  },
  B: {
    title: 'Modelo B: Financiado 12m',
    description: 'Costo: $100,000 | Enganche: $10,000 + 12 mensualidades | Descuento máximo: 25% | Rendimiento en Mes 19',
    color: 'from-emerald-500 to-emerald-600'
  },
  C: {
    title: 'Modelo C: Agencia Madura',
    description: 'Costo: $120,000 | Pago de Contado | Sin descuentos | Rendimiento en Mes 2',
    color: 'from-amber-500 to-orange-600'
  },
  D: {
    title: 'Modelo D: Financiado Flexible 48m',
    description: 'Costo: $100,000 | Enganche: $10,000 + hasta 48 mensualidades | Descuento castigado 5% por año | Rendimiento en Mes meses+7',
    color: 'from-purple-500 to-indigo-600'
  }
};

const Step06CentralData: React.FC<Step06CentralDataProps> = ({ onNext, onPrevious }) => {
  const { investment, updateInvestment } = useCalculator();
  const [showModelSelector, setShowModelSelector] = useState(false);
  const productType = (investment.ridermexProductType as 'A' | 'B' | 'C' | 'D') || 'B';
  const info = productInfo[productType] || productInfo.B;

  const handleChangeModel = (newModel: 'A' | 'B' | 'C' | 'D') => {
    let financingMonths = 0;
    let discount = 30;
    let downPayment = 0;

    if (newModel === 'B') {
      financingMonths = 12;
      discount = 30; // before penalty
      downPayment = 10000;
    } else if (newModel === 'D') {
      financingMonths = 48;
      discount = 30;
      downPayment = 10000;
    } else if (newModel === 'C') {
      discount = 0;
    }

    updateInvestment({
      ridermexProductType: newModel,
      ridermexFinancingMonths: financingMonths,
      ridermexDiscount: discount,
      ridermexDownPaymentAmount: downPayment
    });
    setShowModelSelector(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">
        {/* Header with RiderMex Branding and Product Info - Clickable */}
        <button
          onClick={() => setShowModelSelector(true)}
          className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white text-left hover:shadow-lg transition-shadow cursor-pointer group`}
        >
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-blue-900/30 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform border border-blue-400/30">
              <span className="text-2xl font-bold text-blue-200">RM</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{info.title}</h2>
                <ChevronRight className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-white/90 text-sm mt-1">{info.description}</p>
            </div>
          </div>

          {/* Quick Info Box for Product Type */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 group-hover:bg-white/20 transition-colors"
          >
            <div className="flex items-start gap-2 text-sm">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                {productType === 'A' && 'Pago de contado con descuento del 30% inicial. Cosecha a partir del mes 7.'}
                {productType === 'B' && 'Enganche de $10,000 pesos y diferencia a 12 meses. Penalización de 5% en descuento. Cosecha a partir del mes 19.'}
                {productType === 'C' && 'Inversión en agencia ya operativa. Ingresos desde el segundo mes (mes 2).'}
                {productType === 'D' && 'Enganche de $10,000 pesos y saldo hasta 48 meses. El descuento se reduce 5% por año. Cosecha a partir de liquidación + 6 meses.'}
              </p>
            </div>
          </motion.div>
        </button>

        {/* Model Selector Modal */}
        {showModelSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModelSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Selecciona un Modelo</h3>
                <button
                  onClick={() => setShowModelSelector(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-300" />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 gap-4">
                {(['A', 'B', 'C', 'D'] as const).map((model) => {
                  const modelInfo = productInfo[model];
                  const isSelected = productType === model;
                  const colorMap = {
                    A: 'from-blue-600 to-blue-700',
                    B: 'from-emerald-600 to-emerald-700',
                    C: 'from-amber-600 to-amber-700',
                    D: 'from-purple-600 to-purple-700'
                  };

                  return (
                    <motion.button
                      key={model}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleChangeModel(model)}
                      className={`p-6 rounded-xl text-left transition-all border-2 ${
                        isSelected
                          ? `bg-gradient-to-r ${colorMap[model]} text-white border-transparent shadow-lg`
                          : 'bg-slate-800/50 text-slate-200 border-slate-600/50 hover:border-slate-500 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-white'}`}>
                            {modelInfo.title}
                          </h4>
                          <p className={`text-sm mt-2 ${isSelected ? 'text-white/90' : 'text-slate-300'}`}>
                            {modelInfo.description}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="ml-4 w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-5 h-5 text-blue-600" />
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Central Data Content - Component handles its own layout */}
        <ReinvestmentCentralData onNext={onNext} onPrevious={onPrevious} />
      </div>
    </div>
  );
};

export default Step06CentralData;
