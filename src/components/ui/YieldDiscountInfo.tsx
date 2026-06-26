import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface YieldDiscountInfoProps {
  baseYield: number;
  showExamples?: boolean;
}

const YieldDiscountInfo: React.FC<YieldDiscountInfoProps> = ({
  baseYield,
  showExamples = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const calculateYield = (year: number) => {
    const discountPercentage = (year - 1) * 2;
    const multiplier = Math.max(0, 1 - (discountPercentage / 100));
    return baseYield * multiplier;
  };

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('es-MX', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  };

  const exampleYears = [1, 2, 3, 4, 5, 7, 10];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-lg border-2 border-blue-200 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-md">
            <TrendingDown className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-gray-900">Descuento de Rendimiento</h3>
            <p className="text-sm text-gray-600">2% por cada año diferente de compra</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 pb-4"
          >
            <div className="bg-white rounded-lg p-4 space-y-4">
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold text-blue-900 mb-1">Cómo funciona:</p>
                  <p>Los certificados adquiridos en diferentes años tienen un rendimiento que disminuye en <span className="font-bold text-blue-700">2% por cada año</span> diferente en que se compran.</p>
                </div>
              </div>

              {showExamples && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Ejemplos de Rendimiento Anual:</h4>
                  <div className="space-y-2">
                    {exampleYears.map((year) => {
                      const discountPercentage = (year - 1) * 2;
                      const yieldPercentage = 100 - discountPercentage;
                      const effectiveYield = calculateYield(year);

                      return (
                        <div
                          key={year}
                          className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-16 text-sm font-semibold text-gray-700">
                              Año {year}
                            </span>
                            <span className="text-xs text-gray-500">
                              {discountPercentage > 0 ? `${discountPercentage}% descuento` : 'Sin descuento'}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-gray-900">
                              {formatCurrency(effectiveYield)}
                            </div>
                            <div className={`text-xs ${yieldPercentage === 100 ? 'text-green-600' : 'text-blue-600'} font-semibold`}>
                              {yieldPercentage}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">Puntos Clave:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Todos los certificados comprados en el <span className="font-semibold">mismo año</span> tienen el mismo rendimiento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Los certificados del año 1 son los más rentables (<span className="font-bold text-green-700">100%</span> del rendimiento base)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>El descuento se aplica <span className="font-semibold">antes</span> del crecimiento anual del 5%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>La apreciación de capital (50% año 1, luego 5% anual) <span className="font-semibold">NO</span> se afecta</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <div className="flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-yellow-800">Ventaja:</span> Invertir temprano maximiza tu rendimiento. Los certificados del año 1 mantienen su ventaja del 100% de rendimiento durante toda su vida productiva.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default YieldDiscountInfo;
