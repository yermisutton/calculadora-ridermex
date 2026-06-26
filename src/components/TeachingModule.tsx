import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Step {
  title: string;
  description: string;
  // Optional: targetElementId?: string; // For highlighting specific elements
  // Optional: image?: string; // For showing images
}

interface TeachingModuleProps {
  title: string;
  steps: Step[];
  isOpen: boolean;
  onClose: () => void;
}

const TeachingModule: React.FC<TeachingModuleProps> = ({ title, steps, isOpen, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0); // Reset to first step when opened
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onClose(); // Close if it's the last step
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  if (!isOpen) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 z-50 w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                title="Cerrar tutorial"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">{currentStep.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{currentStep.description}</p>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentStepIndex === 0}
                className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <span className="text-sm text-gray-500">
                {currentStepIndex + 1} / {steps.length}
              </span>

              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>{currentStepIndex === steps.length - 1 ? 'Finalizar' : 'Siguiente'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TeachingModule;