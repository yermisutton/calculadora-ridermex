import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Target, Settings, BarChart3, Award, TrendingUp, DollarSign, Users, Globe, Activity, BookOpen, Shield, GitCompare, Bike } from 'lucide-react';
import { useCalculator } from '../context/CalculatorContext';
import PresentationControls from './presentation/PresentationControls';
import InteractiveDashboard from './presentation/InteractiveDashboard';
import ScenarioComparator from './presentation/ScenarioComparator';
import QuickSimulator from './presentation/QuickSimulator';
import PresentationExportTools from './presentation/PresentationExportTools';

import Step00ProductSelector from './reinvestmentSteps/Step00ProductSelector';
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
import { ESCALONES } from '../data/ridermexConfig';

interface RidermexReinvestmentCalculatorProps {
  onBack: () => void;
}

const RidermexReinvestmentCalculator: React.FC<RidermexReinvestmentCalculatorProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { presentationMode, investment, updateInvestment } = useCalculator();
  const [showPresentationTools, setShowPresentationTools] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;

    const defaultProductType = investment.ridermexProductType || ('B' as const);
    let defaultFinancingMonths = 12;
    let defaultFirstIncome = 19;
    let defaultDownPayment = 10000;
    let defaultPrice = 75100;
    let defaultROI = 19.17;

    if (defaultProductType === 'A') {
      defaultFinancingMonths = 0;
      defaultFirstIncome = 7;
      defaultDownPayment = 70000;
      defaultPrice = 70000;
      defaultROI = 20.57;
    } else if (defaultProductType === 'C') {
      defaultFinancingMonths = 0;
      defaultFirstIncome = 2;
      defaultDownPayment = 120000;
      defaultPrice = 120000;
      defaultROI = 12.0;
    } else if (defaultProductType === 'D') {
      defaultFinancingMonths = 48;
      defaultFirstIncome = 55;
      defaultDownPayment = 10000;
      defaultPrice = 90000;
      defaultROI = 16.0;
    }

    const ridermexDefaults = {
      initialCertificates: 1,
      certificateBasePrice: defaultPrice,
      initialPayment: defaultDownPayment,
      years: 20,
      reinvestProfits: false,
      currencyFormat: 'MXN' as const,
      inflationRate: 3.5,
      partialCashOut: false,
      cashOutPercentage: 0,
      yearlyCashOutPercentages: Array(30).fill(0),
      ridermexProductType: defaultProductType,
      ridermexDownPaymentAmount: defaultDownPayment,
      ridermexFinancingMonths: defaultFinancingMonths,
      ridermexFirstMonthlyIncome: defaultFirstIncome,
      annualProfit: defaultROI,
      investorAnnualReturn: defaultROI,
      ridermexDiscount: defaultProductType === 'C' ? 0 : 30
    };

    updateInvestment(ridermexDefaults);
    setIsInitialized(true);
  }, [isInitialized]); // eslint-disable-line react-hooks/exhaustive-deps


  const steps = [
    {
      id: 'product-selector',
      title: 'Selecciona tu Modelo',
      component: Step00ProductSelector,
      icon: Bike,
      description: 'Elige entre 3 modelos de inversión'
    },
    {
      id: 'currency-language',
      title: 'Moneda e Idioma',
      component: Step01CurrencyLanguage,
      icon: Globe,
      description: 'Configuración de moneda e idioma'
    },
    {
      id: 'education',
      title: 'Educación Financiera',
      component: Step02Education,
      icon: BookOpen,
      description: 'Aprende sobre inversión en motocicletas'
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
      description: 'Estructura de protección legal'
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
      description: 'Configuración de inversión en Ridermex'
    },
    {
      id: 'specific-data',
      title: 'Datos Específicos',
      component: Step07SpecificData,
      icon: BarChart3,
      description: 'Parámetros del negocio de motocicletas'
    },
    {
      id: 'market-context',
      title: 'Contexto de Mercado',
      component: Step08MarketContext,
      icon: TrendingUp,
      description: 'Análisis del mercado automotriz'
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
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    } else {
      console.log('Already at last step');
    }
  };

  const handlePrevious = () => {
    console.log('=== handlePrevious CALLED ===');
    console.log('Current step BEFORE:', currentStep);

    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      console.log('Moving to previous step:', prevStep, 'Title:', steps[prevStep].title);
      setCurrentStep(prevStep);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    } else {
      console.log('Already at first step');
    }
  };

  const handleStepClick = (index: number) => {
    console.log('=== handleStepClick CALLED ===');
    console.log('Jumping from step:', currentStep, 'to step:', index);
    setCurrentStep(index);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  const CurrentStepComponent = steps[currentStep].component;

  if (!investment || !isInitialized) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <img src="/rider_inversiones.png" alt="Ridermex Inversiones" className="h-20 w-auto mb-4 mx-auto animate-pulse" />
          <p className="text-neutral-300 text-lg">Inicializando calculadora...</p>
        </div>
      </div>
    );
  }

  if (presentationMode) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <PresentationControls
          onBack={onBack}
          onToggleTools={() => setShowPresentationTools(!showPresentationTools)}
        />
        {showPresentationTools && <QuickSimulator />}
        <div className="container mx-auto px-4 py-8">
          <CurrentStepComponent onNext={handleNext} onPrevious={handlePrevious} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-dark-card text-neutral-200 rounded-lg hover:shadow-neon-red hover:border-neon-red transition-all font-medium border border-dark-border"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Volver</span>
              </button>

              <div className="flex items-center gap-3">
                <img src="/rider_inversiones.png" alt="Ridermex Inversiones" className="h-10 w-auto" />
                <div className="px-4 py-2 bg-dark-card rounded-lg border border-dark-border">
                  <span className="text-sm text-neutral-400">Paso {currentStep + 1} de {steps.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-dark-card rounded-xl border border-dark-border p-4 mb-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;

                  return (
                    <React.Fragment key={step.id}>
                      <button
                        onClick={() => handleStepClick(index)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${
                          isActive
                            ? 'bg-gradient-to-r from-neon-red to-rose-600 text-white shadow-neon-red scale-105'
                            : isCompleted
                            ? 'bg-neon-green/20 text-neon-green hover:bg-neon-green/30'
                            : 'bg-dark-bg text-neutral-400 hover:bg-dark-surface hover:text-neutral-200'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium hidden md:inline">{step.title}</span>
                        <span className={`text-xs px-2 py-1 rounded ${isActive ? 'bg-white/20' : 'bg-dark-bg'}`}>
                          {index + 1}
                        </span>
                      </button>
                      {index < steps.length - 1 && (
                        <div className={`h-0.5 w-8 ${isCompleted ? 'bg-neon-green' : 'bg-dark-border'}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentStepComponent onNext={handleNext} onPrevious={handlePrevious} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RidermexReinvestmentCalculator;
