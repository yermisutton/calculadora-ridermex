import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Target, Users, Award, Video, Phone, Monitor, Settings, DollarSign, BarChart3, TrendingUp } from 'lucide-react';
import { DisclaimerBanner } from './ui/DisclaimerBanner';
import { useCalculator } from '../context/CalculatorContext';

// Import simplified step components
import SimplifiedStep1Config from './simplifiedSteps/SimplifiedStep1Config';
import SimplifiedStep2InvestorGoals from './simplifiedSteps/SimplifiedStep2InvestorGoals';
import SimplifiedStep3SpecificData from './simplifiedSteps/SimplifiedStep3SpecificData';
import SimplifiedStep5WithdrawalPlan from './simplifiedSteps/SimplifiedStep5WithdrawalPlan';
import SimplifiedStep6ClientInfo from './simplifiedSteps/SimplifiedStep6ClientInfo';
import SimplifiedStep7Results from './simplifiedSteps/SimplifiedStep7Results';

interface SimplifiedCalculatorProps {
  onBack: () => void;
}

const SimplifiedCalculator: React.FC<SimplifiedCalculatorProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'config',
      title: 'Configuración Inicial',
      component: SimplifiedStep1Config,
      icon: Settings,
      description: 'Configura los parámetros básicos'
    },
    {
      id: 'investor-goals',
      title: 'Meta del Inversionista',
      component: SimplifiedStep2InvestorGoals,
      icon: Target,
      description: 'Define tus objetivos financieros'
    },
    { 
      id: 'specific-data', 
      title: 'Datos Específicos', 
      component: SimplifiedStep3SpecificData,
      icon: BarChart3,
      description: 'Inflación, impuestos y tasas comparativas'
    },
    { 
      id: 'withdrawal-plan', 
      title: 'Plan de Retiros', 
      component: SimplifiedStep5WithdrawalPlan,
      icon: DollarSign,
      description: 'Estrategia de retiros'
    },
    { 
      id: 'client-info', 
      title: 'Datos del Cliente', 
      component: SimplifiedStep6ClientInfo,
      icon: Users,
      description: 'Información personal y de contacto'
    },
    { 
      id: 'results', 
      title: 'Resultados', 
      component: SimplifiedStep7Results,
      icon: Award,
      description: 'Proyecciones y reportes'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const CurrentStepComponent = steps[currentStep].component;
  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="bg-dark-card shadow-sm border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <img
                src="/rider_inversiones.png"
                alt="Ridermex Inversiones"
                className="h-12 w-auto drop-shadow-md"
              />
              <button
                onClick={onBack}
                className="flex items-center text-neutral-300 hover:text-neutral-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver al Inicio
              </button>
            </div>
            <div className="flex items-center gap-6">
              <img
                src="/rider_inversiones.png"
                alt="Ridermex Inversiones"
                className="h-16 w-auto drop-shadow-lg"
              />
              <div className="text-center">
                <h1 className="text-xl font-semibold text-neutral-100">
                  Calculadora Simplificada
                </h1>
                <p className="text-sm text-neutral-400">
                  Paso {currentStep + 1} de {steps.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-neon-green" />
              <span className="text-sm text-neon-green font-medium">One-to-One</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-dark-card border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-200">
                {currentStepData.title}
              </span>
              <span className="text-sm text-neutral-400">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-dark-surface rounded-full h-3">
              <div
                className="bg-gradient-to-r from-neon-green to-emerald-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="bg-dark-card border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-center space-x-8 overflow-x-auto">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(index)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 whitespace-nowrap ${
                      isActive
                        ? 'bg-neon-green/20 text-neon-green shadow-md scale-105 border-2 border-neon-green/50'
                        : isCompleted
                        ? 'bg-emerald-600/20 text-emerald-400 border-2 border-emerald-600/30'
                        : 'bg-dark-surface text-neutral-400 border-2 border-dark-border'
                    } hover:bg-opacity-80 cursor-pointer`}
                  >
                    <Icon className="h-5 w-5" />
                    <div className="text-left">
                      <div className="text-sm font-semibold">{step.title}</div>
                      <div className={`text-xs ${isActive ? 'text-neon-green/80' : isCompleted ? 'text-emerald-400/80' : 'text-neutral-500'}`}>
                        {step.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Step Progress Indicator */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex justify-center">
              <div className="flex items-center space-x-4">
                {steps.map((step, index) => {
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;
                  
                  return (
                    <div key={step.id} className="flex items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                          isActive
                            ? 'bg-green-600 text-white shadow-lg scale-110'
                            : isCompleted
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {index + 1}
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`w-16 h-2 mx-2 rounded-full transition-all duration-300 ${
                            index < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Step Labels */}
            <div className="mt-6 text-center">
              <div className="text-lg font-semibold text-gray-800">
                Paso {currentStep + 1}: {currentStepData.title}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {currentStepData.description}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === steps.length - 1 && (
          <div className="mb-6">
            <DisclaimerBanner variant="compact" />
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 0 && <CurrentStepComponent onNext={handleNext} />}
            {currentStep === steps.length - 1 && <CurrentStepComponent onPrevious={handlePrevious} />}
            {currentStep > 0 && currentStep < steps.length - 1 && (
              <CurrentStepComponent
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SimplifiedCalculator;