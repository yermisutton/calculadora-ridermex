import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize, Minimize, Monitor, Save, FolderOpen, Trash2 } from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';

interface PresentationControlsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onStepChange: (step: number) => void;
}

const PresentationControls: React.FC<PresentationControlsProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onStepChange
}) => {
  const { presentationMode, togglePresentationMode, savedScenarios, saveScenario, loadScenario, deleteScenario } = useCalculator();
  const [showSaveDialog, setShowSaveDialog] = React.useState(false);
  const [showLoadDialog, setShowLoadDialog] = React.useState(false);
  const [scenarioName, setScenarioName] = React.useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentStep < totalSteps - 1) {
        onNext();
      } else if (e.key === 'ArrowLeft' && currentStep > 0) {
        onPrevious();
      } else if (e.key === 'f' && e.ctrlKey) {
        e.preventDefault();
        togglePresentationMode();
      } else if (e.key === 'Home') {
        onStepChange(0);
      } else if (e.key === 'End') {
        onStepChange(totalSteps - 1);
      } else if (e.key >= '1' && e.key <= '9') {
        const stepIndex = parseInt(e.key) - 1;
        if (stepIndex < totalSteps) {
          onStepChange(stepIndex);
        }
      }
    };

    if (presentationMode) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [presentationMode, currentStep, totalSteps, onNext, onPrevious, onStepChange, togglePresentationMode]);

  const handleSaveScenario = () => {
    if (scenarioName.trim()) {
      saveScenario(scenarioName.trim());
      setScenarioName('');
      setShowSaveDialog(false);
    }
  };

  if (!presentationMode) {
    return (
      <div className="fixed bottom-8 right-8 z-50">
        <motion.button
          onClick={togglePresentationMode}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-3xl transition-all flex items-center gap-2 font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Monitor className="w-5 h-5" />
          Modo Presentación
        </motion.button>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-4 px-6 shadow-2xl z-50"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={onPrevious}
              disabled={currentStep === 0}
              className={`p-3 rounded-lg transition-all ${
                currentStep === 0
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              whileHover={currentStep > 0 ? { scale: 1.05 } : {}}
              whileTap={currentStep > 0 ? { scale: 0.95 } : {}}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            <div className="text-center">
              <div className="text-sm text-gray-400">Paso</div>
              <div className="text-2xl font-bold">
                {currentStep + 1} / {totalSteps}
              </div>
            </div>

            <motion.button
              onClick={onNext}
              disabled={currentStep === totalSteps - 1}
              className={`p-3 rounded-lg transition-all ${
                currentStep === totalSteps - 1
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              whileHover={currentStep < totalSteps - 1 ? { scale: 1.05 } : {}}
              whileTap={currentStep < totalSteps - 1 ? { scale: 0.95 } : {}}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>

          <div className="flex-1 flex items-center justify-center gap-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <button
                key={index}
                onClick={() => onStepChange(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-12 bg-blue-500'
                    : index < currentStep
                    ? 'w-8 bg-green-500'
                    : 'w-6 bg-gray-600'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setShowSaveDialog(true)}
              className="p-3 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Guardar escenario"
            >
              <Save className="w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={() => setShowLoadDialog(true)}
              className="p-3 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Cargar escenario"
            >
              <FolderOpen className="w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={togglePresentationMode}
              className="p-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Salir del modo presentación (Ctrl+F)"
            >
              <Minimize className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-2 text-xs text-gray-400 text-center">
          Atajos: ← → para navegar | Inicio/Fin para primera/última | 1-9 para ir a paso | Ctrl+F para salir
        </div>
      </motion.div>

      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Guardar Escenario</h3>
            <input
              type="text"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              placeholder="Nombre del escenario"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 text-gray-900 focus:border-blue-500 focus:outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handleSaveScenario()}
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={handleSaveScenario}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setScenarioName('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showLoadDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[80vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Cargar Escenario</h3>
            {savedScenarios.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay escenarios guardados</p>
            ) : (
              <div className="space-y-3">
                {savedScenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{scenario.name}</h4>
                      <p className="text-sm text-gray-500">
                        ${scenario.investment.initialPayment.toLocaleString()} - {scenario.investment.years} años
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          loadScenario(scenario.id);
                          setShowLoadDialog(false);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Cargar
                      </button>
                      <button
                        onClick={() => deleteScenario(scenario.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowLoadDialog(false)}
              className="w-full mt-4 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
            >
              Cerrar
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default PresentationControls;
