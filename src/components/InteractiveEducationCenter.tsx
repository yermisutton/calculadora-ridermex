import React, { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Target, BarChart3, Play, Pause, RotateCcw, Award, Lightbulb, BookOpen, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/formatters';
import AnimatedNumberDisplay from './ui/AnimatedNumberDisplay';
import EducationalTooltip from './EducationalTooltips';
// import ROICalculator from './calculators/ROICalculator';

interface InteractiveEducationCenterProps {
  className?: string;
}

const InteractiveEducationCenter: React.FC<InteractiveEducationCenterProps> = ({ className = '' }) => {
  const [activeModule, setActiveModule] = useState<'roi' | 'compound' | 'diversification' | 'scenarios'>('roi');
  
  // State for compound multiplier simulator
  const [multiplierExample, setMultiplierExample] = useState({
    initialCertificates: 1,
    certificatePrice: 266000,
    utilityRate: 20,
    years: 15,
    currentYear: 0,
    isAnimating: false,
    reinvestmentEnabled: true
  });

  const modules = [
    {
      id: 'roi',
      title: 'Calculadora ROI',
      description: 'Compara diferentes inversiones interactivamente',
      icon: Calculator,
      color: 'purple'
    },
    {
      id: 'compound',
      title: 'Multiplicador',
      description: 'Simula el efecto del Interés Compuesto Multiplicador',
      icon: Zap,
      color: 'green'
    },
    {
      id: 'diversification',
      title: 'Diversificación',
      description: 'Aprende sobre distribución de riesgo',
      icon: Target,
      color: 'blue'
    },
    {
      id: 'scenarios',
      title: 'Escenarios',
      description: 'Analiza diferentes condiciones de mercado',
      icon: BarChart3,
      color: 'orange'
    }
  ];

  const renderCompoundMultiplierModule = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-green-800">Simulador del Interés Compuesto Multiplicador</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Certificados Iniciales</label>
          <input
            type="number"
            min="1"
            max="10"
            value={multiplierExample.initialCertificates}
            onChange={(e) => setMultiplierExample(prev => ({ ...prev, initialCertificates: parseInt(e.target.value) || 1 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Precio por Certificado</label>
          <input
            type="number"
            value={multiplierExample.certificatePrice}
            onChange={(e) => setMultiplierExample(prev => ({ ...prev, certificatePrice: parseInt(e.target.value) || 266000 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Utilidad Anual (%)</label>
          <input
            type="number"
            min="10"
            max="30"
            value={multiplierExample.utilityRate}
            onChange={(e) => setMultiplierExample(prev => ({ ...prev, utilityRate: parseInt(e.target.value) || 20 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Años de Simulación</label>
          <input
            type="number"
            min="5"
            max="25"
            value={multiplierExample.years}
            onChange={(e) => setMultiplierExample(prev => ({ ...prev, years: parseInt(e.target.value) || 15 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h5 className="font-medium text-green-800">Multiplicador Activado</h5>
          <button
            onClick={() => setMultiplierExample(prev => ({ ...prev, reinvestmentEnabled: !prev.reinvestmentEnabled }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              multiplierExample.reinvestmentEnabled ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                multiplierExample.reinvestmentEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="text-center mb-4">
          <div className="text-sm text-green-600 mb-1">Año {multiplierExample.currentYear}</div>
          <div className="text-3xl font-bold text-green-700">
            {multiplierExample.reinvestmentEnabled ? 
              Math.ceil(multiplierExample.initialCertificates * Math.pow(1.2, Math.max(0, multiplierExample.currentYear - 4))) :
              multiplierExample.initialCertificates
            } certificados
          </div>
          <div className="text-sm text-green-600">
            Patrimonio: ${(multiplierExample.certificatePrice * 
              (multiplierExample.reinvestmentEnabled ? 
                Math.ceil(multiplierExample.initialCertificates * Math.pow(1.2, Math.max(0, multiplierExample.currentYear - 4))) :
                multiplierExample.initialCertificates
              ) * Math.pow(1.12, Math.min(5, multiplierExample.currentYear))
            ).toLocaleString()}
          </div>
        </div>
        
        <div className="flex justify-center gap-2">
          <button
            onClick={() => {
              if (multiplierExample.isAnimating) {
                setMultiplierExample(prev => ({ ...prev, isAnimating: false }));
              } else {
                setMultiplierExample(prev => ({ ...prev, isAnimating: true }));
                const interval = setInterval(() => {
                  setMultiplierExample(prev => {
                    if (prev.currentYear >= prev.years) {
                      clearInterval(interval);
                      return { ...prev, isAnimating: false };
                    }
                    return { ...prev, currentYear: prev.currentYear + 1 };
                  });
                }, 1500);
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {multiplierExample.isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMultiplierExample(prev => ({ ...prev, currentYear: 0, isAnimating: false }))}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
          <h5 className="font-medium text-green-800 mb-2">🌟 Concepto Clave:</h5>
          <p className="text-sm text-green-700">
            <strong>Interés Compuesto Multiplicador:</strong> {multiplierExample.reinvestmentEnabled ? 
              'Las utilidades se reinvierten para adquirir MÁS certificados. No solo crece el dinero, se multiplican los activos productivos.' :
              'Sin reinversión, solo recibes las utilidades como ingreso. Los certificados no se multiplican.'
            }
          </p>
          <div className="mt-2 text-xs text-green-600">
            <strong>Diferencia:</strong> {multiplierExample.reinvestmentEnabled ? 
              'Activos reales que se multiplican vs números que crecen' :
              'Solo crecimiento de valor, sin multiplicación de activos'
            }
          </div>
        </div>
      </div>
    </div>
  );

  const renderDiversificationModule = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-blue-800">Simulador de Diversificación</h4>
      
      <div className="bg-blue-50 p-4 rounded-xl">
        <h5 className="font-medium text-blue-800 mb-3">Comparación: 1 Activo vs Múltiples Activos</h5>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h6 className="font-medium text-gray-800 mb-2">Estrategia Tradicional</h6>
            <div className="text-center mb-3">
              <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600">1</span>
              </div>
              <div className="text-sm text-gray-600">Un solo activo grande</div>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Todo el riesgo en un activo</li>
              <li>• Si falla, pierdes todo</li>
              <li>• Crecimiento limitado</li>
            </ul>
          </div>
          
          <div className="bg-green-100 p-4 rounded-lg border border-green-300">
            <h6 className="font-medium text-green-800 mb-2">Multiplicador</h6>
            <div className="text-center mb-3">
              <div className="flex justify-center gap-1 mb-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-green-500 rounded-sm"></div>
                ))}
              </div>
              <div className="text-sm text-green-600">Múltiples activos pequeños</div>
            </div>
            <ul className="text-xs text-green-600 space-y-1">
              <li>• Riesgo distribuido</li>
              <li>• Respaldo mutuo</li>
              <li>• Crecimiento exponencial</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScenariosModule = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-orange-800">Simulador de Escenarios</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: 'Optimista', growth: 25, color: 'green' },
          { name: 'Moderado', growth: 20, color: 'blue' },
          { name: 'Conservador', growth: 15, color: 'orange' }
        ].map((scenario) => (
          <div key={scenario.name} className={`bg-${scenario.color}-50 p-4 rounded-xl`}>
            <h5 className={`font-medium text-${scenario.color}-800 mb-2`}>{scenario.name}</h5>
            <div className={`text-2xl font-bold text-${scenario.color}-700 mb-1`}>
              {scenario.growth}%
            </div>
            <div className={`text-sm text-${scenario.color}-600`}>rendimiento anual</div>
            
            <div className="mt-3">
              <div className={`text-lg font-bold text-${scenario.color}-700`}>
                ${(100000 * Math.pow(1 + scenario.growth / 100, 10)).toLocaleString()}
              </div>
              <div className={`text-xs text-${scenario.color}-600`}>después de 10 años</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'roi':
        return renderCompoundMultiplierModule();
      case 'compound':
        return renderCompoundMultiplierModule();
      case 'diversification':
        return renderDiversificationModule();
      case 'scenarios':
        return renderScenariosModule();
      default:
        return renderCompoundMultiplierModule();
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Centro de Educación Interactiva</h3>
          <p className="text-sm text-gray-600">Aprende conceptos financieros con simuladores prácticos</p>
        </div>
      </div>

      {/* Module Navigation */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6 overflow-x-auto">
        {modules.map((module) => {
          const Icon = module.icon;
          
          return (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeModule === module.id
                  ? `bg-white text-${module.color}-600 shadow-sm`
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{module.title}</span>
            </button>
          );
        })}
      </div>

      {/* Module Content */}
      <motion.div
        key={activeModule}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderModuleContent()}
      </motion.div>

      {/* Educational Tips */}
      <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
        <div className="flex items-center gap-3 mb-3">
          <Lightbulb className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold text-blue-800">💡 Tips Educativos</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <EducationalTooltip concept="cagr">
              <div className="cursor-help p-2 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-colors">
                <span className="font-medium text-blue-700 border-b border-dotted border-blue-400">CAGR</span>
                <span className="text-blue-600"> - Tasa de Crecimiento Anual Compuesta</span>
              </div>
            </EducationalTooltip>
            
            <EducationalTooltip concept="roi">
              <div className="cursor-help p-2 bg-white rounded-lg border border-purple-200 hover:border-purple-400 transition-colors">
                <span className="font-medium text-purple-700 border-b border-dotted border-purple-400">ROI</span>
                <span className="text-purple-600"> - Retorno sobre la Inversión</span>
              </div>
            </EducationalTooltip>
          </div>
          
          <div className="space-y-2">
            <EducationalTooltip concept="yield">
              <div className="cursor-help p-2 bg-white rounded-lg border border-orange-200 hover:border-orange-400 transition-colors">
                <span className="font-medium text-orange-700 border-b border-dotted border-orange-400">Yield</span>
                <span className="text-orange-600"> - Rendimiento Anual</span>
              </div>
            </EducationalTooltip>
            
            <EducationalTooltip concept="diversification">
              <div className="cursor-help p-2 bg-white rounded-lg border border-indigo-200 hover:border-indigo-400 transition-colors">
                <span className="font-medium text-indigo-700 border-b border-dotted border-indigo-400">Diversificación</span>
                <span className="text-indigo-600"> - Distribución de Riesgo</span>
              </div>
            </EducationalTooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveEducationCenter;