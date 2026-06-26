import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Target, Leaf, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { DisclaimerBanner } from './ui/DisclaimerBanner';
import { compoundMultiplierContent } from '../data/compoundMultiplierContent';
import { useCalculator } from '../context/CalculatorContext';
import { Dream, DreamConfig, DreamSimulatorState } from '../types/dreamSimulator';
import { predefinedDreams } from '../data/dreamSimulatorData';
import { calculateProjections } from '../utils/calculations/dreamSimulatorCalculations';
import GoalSelector from './dreamSimulator/GoalSelector';
import DreamConfiguration from './dreamSimulator/DreamConfiguration';
import DreamResults from './dreamSimulator/DreamResults';

interface DreamSimulatorProps {
  onBack: () => void;
}

const DreamSimulator: React.FC<DreamSimulatorProps> = ({ onBack }) => {
  const { investment } = useCalculator();

  const [state, setState] = useState<DreamSimulatorState>({
    selectedDream: null,
    dreamConfig: null,
    dreamProjections: [],
    portfolioComparison: null,
    activeView: 'selection'
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [state.activeView]);

  const handleDreamSelect = (dream: Dream) => {
    setState(prev => ({
      ...prev,
      selectedDream: dream,
      dreamConfig: {
        id: dream.id,
        monthlyGoal: dream.monthlyGoal,
        timeframe: dream.timeline === 'short' ? 5 :
                  dream.timeline === 'medium' ? 10 :
                  dream.timeline === 'long' ? 20 : 25,
        certificatesNeeded: dream.certificatesNeeded,
        isCustom: dream.isCustom || false,
        reinvestProfits: investment.reinvestProfits
      },
      activeView: 'configuration'
    }));
  };

  const handleCreateCustomDream = () => {
    alert('Funcionalidad de sueño personalizado - Próximamente');
  };

  const handleConfigUpdate = (updates: Partial<DreamConfig>) => {
    setState(prev => ({
      ...prev,
      dreamConfig: {
        ...prev.dreamConfig!,
        ...updates
      }
    }));
  };

  useEffect(() => {
    if (state.dreamConfig) {
      const projections = calculateProjections(state.dreamConfig, investment);

      setState(prev => ({
        ...prev,
        dreamProjections: projections
      }));
    }
  }, [state.dreamConfig, investment]);

  const steps = [
    { id: 'selection', label: 'Selección', icon: <Target className="w-4 h-4" /> },
    { id: 'configuration', label: 'Configuración', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'results', label: 'Resultados', icon: <BarChart3 className="w-4 h-4" /> }
  ];

  const navigateTo = (view: DreamSimulatorState['activeView']) => {
    setState(prev => ({
      ...prev,
      activeView: view
    }));
  };

  const renderView = () => {
    switch (state.activeView) {
      case 'selection':
        return (
          <GoalSelector
            dreams={predefinedDreams}
            onDreamSelect={handleDreamSelect}
            onCreateCustomDream={handleCreateCustomDream}
          />
        );
      case 'configuration':
        if (!state.selectedDream || !state.dreamConfig) {
          navigateTo('selection');
          return null;
        }
        return (
          <DreamConfiguration
            dream={state.selectedDream}
            config={state.dreamConfig}
            onConfigUpdate={handleConfigUpdate}
            onContinue={() => navigateTo('results')}
            investment={investment}
          />
        );
      case 'results':
        if (!state.selectedDream || !state.dreamConfig || state.dreamProjections.length === 0) {
          navigateTo('selection');
          return null;
        }
        return (
          <DreamResults
            dream={state.selectedDream}
            config={state.dreamConfig}
            projections={state.dreamProjections}
            investment={investment}
          />
        );
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Vista en desarrollo
            </h3>
            <p className="text-gray-600 mb-8">
              Esta funcionalidad estará disponible próximamente
            </p>
            <button
              onClick={() => navigateTo('selection')}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              Volver a Selección
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100/50 rounded-xl transition-all duration-200"
              title="Volver al menú principal"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Volver</span>
            </button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Simulador de Suenos RiderMex</h1>
                <h2 className="text-lg font-semibold text-red-700">RiderMex Inversiones</h2>
                <p className="text-gray-600">{compoundMultiplierContent.tagline}</p>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>⚠️ Aviso:</strong> Las proyecciones mostradas son estimaciones y no garantizan rendimientos futuros.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = state.activeView === step.id;
              const isPast = steps.findIndex(s => s.id === state.activeView) > index;

              return (
                <div key={step.id} className="flex items-center">
                  {index > 0 && (
                    <div className={`h-0.5 w-10 mx-2 ${isPast ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                  )}
                  <div
                    className={`flex flex-col items-center transition-all duration-200 ${
                      isActive ? 'text-red-600' : isPast ? 'text-red-400' : 'text-gray-400'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-red-100 text-red-600 ring-2 ring-red-500' :
                      isPast ? 'bg-red-50 text-red-500' : 'bg-gray-100'
                    }`}>
                      {step.icon}
                    </div>
                    <span className="text-xs mt-1">{step.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <motion.div
        className="max-w-7xl mx-auto px-6 py-8"
        key={state.activeView}
      >
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          {renderView()}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DreamSimulator;
