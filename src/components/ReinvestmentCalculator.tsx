import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Target, Settings, BarChart3, Award, TrendingUp, DollarSign, Users, Globe, PieChart, Activity, BookOpen, Shield, Zap, GitCompare } from 'lucide-react';
import { useCalculator } from '../context/CalculatorContext';
import PresentationControls from './presentation/PresentationControls';
import InteractiveDashboard from './presentation/InteractiveDashboard';
import ScenarioComparator from './presentation/ScenarioComparator';
import QuickSimulator from './presentation/QuickSimulator';
import PresentationExportTools from './presentation/PresentationExportTools';

// Import individual step components
import Step01CurrencyLanguage from './reinvestmentSteps/Step01CurrencyLanguage';
import Step02Education from './reinvestmentSteps/Step02Education';
import Step03InvestorGoals from './reinvestmentSteps/Step03InvestorGoals';
import Step04LegalProtection from './reinvestmentSteps/Step04LegalProtection';
import Step05ClientInfo from './reinvestmentSteps/Step05ClientInfo';
import Step06CentralData from './reinvestmentSteps/Step06CentralData';
import Step07SpecificData from './reinvestmentSteps/Step07SpecificData';
import Step08MarketContext from './reinvestmentSteps/Step08MarketContext';
import Step09WithdrawalPlan from './reinvestmentSteps/Step09WithdrawalPlan';
import Step10Results from './reinvestmentSteps/Step11Results';

interface ReinvestmentCalculatorProps {
  onBack: () => void;
}

const ReinvestmentCalculator: React.FC<ReinvestmentCalculatorProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { presentationMode } = useCalculator();
  const [showPresentationTools, setShowPresentationTools] = useState(false);

  // Debug effect to track step changes
  useEffect(() => {
    console.log('📍 ReinvestmentCalculator: currentStep changed to:', currentStep);
  }, [currentStep]);

  const steps = [
    {
      id: 'currency-language',
      title: 'Moneda e Idioma',
      component: Step01CurrencyLanguage,
      icon: Globe,
      description: 'Elige tu moneda e idioma de preferencia'
    },
    {
      id: 'education',
      title: 'Educación Financiera',
      component: Step02Education,
      icon: BookOpen,
      description: 'Aprende sobre inversión y reinversión'
    },
    {
      id: 'investor-goals',
      title: 'Meta del Inversionista',
      component: Step03InvestorGoals,
      icon: Target,
      description: 'Define tus objetivos financieros'
    },
    {
      id: 'legal-protection',
      title: 'Protección Legal y Seguros',
      component: Step04LegalProtection,
      icon: Shield,
      description: 'Estructura de fideicomisos y seguros'
    },
    {
      id: 'client-info',
      title: 'Información del Cliente',
      component: Step05ClientInfo,
      icon: Users,
      description: 'Datos personales y de contacto'
    },
    {
      id: 'central-data',
      title: 'Datos Centrales',
      component: Step06CentralData,
      icon: Settings,
      description: 'Configuración base de la inversión'
    },
    {
      id: 'specific-data',
      title: 'Datos Específicos',
      component: Step07SpecificData,
      icon: BarChart3,
      description: 'Parámetros detallados del proyecto'
    },
    {
      id: 'market-context',
      title: 'Contexto de Mercado',
      component: Step08MarketContext,
      icon: TrendingUp,
      description: 'Análisis del mercado y tendencias'
    },
    {
      id: 'withdrawal-plan',
      title: 'Plan de Retiros',
      component: Step09WithdrawalPlan,
      icon: DollarSign,
      description: 'Estrategia de retiro de utilidades'
    },
    {
      id: 'results',
      title: 'Resultados y Proyecciones',
      component: Step10Results,
      icon: Award,
      description: 'Análisis completo de tu inversión'
    },
    {
      id: 'interactive-dashboard',
      title: 'Dashboard Interactivo',
      component: () => <InteractiveDashboard />,
      icon: Activity,
      description: 'Ajusta parámetros en tiempo real'
    },
    {
      id: 'scenario-comparator',
      title: 'Comparador de Escenarios',
      component: () => <ScenarioComparator />,
      icon: GitCompare,
      description: 'Compara diferentes estrategias'
    },
    {
      id: 'export-tools',
      title: 'Herramientas de Exportación',
      component: () => <PresentationExportTools />,
      icon: DollarSign,
      description: 'Comparte y guarda la presentación'
    }
  ];

  const handleNext = () => {
    console.log('=== handleNext CALLED ===');
    console.log('Current step BEFORE:', currentStep);

    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      console.log('Moving to next step:', nextStep, 'Title:', steps[nextStep].title);
      setCurrentStep(nextStep);
      // Scroll to top immediately when changing steps
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    } else {
      console.log('Already at last step, staying at:', currentStep);
    }
  };

  const handlePrevious = () => {
    console.log('=== handlePrevious CALLED ===');
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      console.log('Going to previous step:', prevStep);
      setCurrentStep(prevStep);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  };

  const handleStepChange = (step: number) => {
    console.log('=== handleStepChange CALLED with step:', step, 'Title:', steps[step]?.title || 'Unknown');
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    } else {
      console.error('Invalid step index:', step);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;
  const currentStepData = steps[currentStep];

  return (
    <div className={`min-h-screen ${presentationMode ? 'pb-24' : ''} bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900`}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <img
                src="/rider_inversiones.png"
                alt="Cosecha Capital"
                className="h-12 w-auto drop-shadow-md"
              />
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver
              </button>
            </div>
            <div className="text-center">
              <img
                src="/rider_inversiones.png"
                alt="Cosecha Capital"
                className="h-16 w-auto drop-shadow-lg mx-auto mb-2"
              />
              <h1 className="text-xl font-semibold text-gray-900">
                Calculadora de Reinversión
              </h1>
              <p className="text-sm text-gray-500">
                Paso {currentStep + 1} de {steps.length}
              </p>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {currentStepData.title}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center space-x-4 overflow-x-auto">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => {
                      console.log('🔶 Navigation bar: Clicked on step', index, '-', step.title);
                      setCurrentStep(index);
                    }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : isCompleted
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    } hover:bg-opacity-80 transition-colors cursor-pointer`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{step.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              {steps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg scale-110'
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-8 h-1 mx-1 transition-all duration-300 ${
                          index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Step Labels */}
          <div className="mt-4 text-center">
            <div className="text-sm font-medium text-gray-700">
              Paso {currentStep + 1}: {currentStepData.title}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {currentStepData.description}
            </div>
          </div>
        </div>

        <div key={`step-${currentStep}`}>
          {(() => {
            console.log('🔄 Rendering step:', currentStep, 'Title:', currentStepData.title);

            if (currentStep === 0) {
              console.log('✅ Rendering step 0 with only onNext');
              return <CurrentStepComponent onNext={handleNext} />;
            } else if (currentStep >= 1 && currentStep <= 10) {
              console.log('✅ Rendering step', currentStep, 'with onNext, onPrevious, onStepChange');
              console.log('✅ CurrentStepComponent:', CurrentStepComponent);
              console.log('✅ CurrentStepComponent.name:', CurrentStepComponent?.name || 'undefined');
              console.log('✅ About to render CurrentStepComponent...');
              const result = (
                <CurrentStepComponent
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  onStepChange={handleStepChange}
                />
              );
              console.log('✅ CurrentStepComponent rendered, result:', result);
              return result;
            } else {
              console.log('✅ Rendering step', currentStep, 'as presentation component');
              return (
                <div className="max-w-7xl mx-auto">
                  <CurrentStepComponent />
                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={handlePrevious}
                      className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                    >
                      Anterior
                    </button>
                    {currentStep < steps.length - 1 && (
                      <button
                        onClick={handleNext}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Siguiente
                      </button>
                    )}
                  </div>
                </div>
              );
            }
          })()}
        </div>
      </div>

      <PresentationControls
        currentStep={currentStep}
        totalSteps={steps.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onStepChange={handleStepChange}
      />
    </div>
  );
};

export default ReinvestmentCalculator;