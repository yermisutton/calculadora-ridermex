import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Target, Settings, Award, DollarSign, Bike } from 'lucide-react';
import { useCalculator } from '../context/CalculatorContext';
import PresentationControls from './presentation/PresentationControls';
import QuickSimulator from './presentation/QuickSimulator';

import Step00ProductSelector from './reinvestmentSteps/Step00ProductSelector';
import Step03InvestorGoals from './reinvestmentSteps/Step03InvestorGoals';
import Step06CentralData from './reinvestmentSteps/Step06CentralData';
import Step09WithdrawalPlan from './reinvestmentSteps/Step09WithdrawalPlan';
import Step11Results from './reinvestmentSteps/Step11Results';

interface RidermexRiderCalculatorProps {
  onBack?: () => void;
}

const RidermexRiderCalculator: React.FC<RidermexRiderCalculatorProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { presentationMode, investment, updateInvestment } = useCalculator();
  const [showPresentationTools, setShowPresentationTools] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    document.title = "Calculadora Rider - RiderMex";
    return () => {
      document.title = "Certificado de Crecimiento Exponencial - Cosecha Capital";
    };
  }, []);

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
      description: 'Elige entre los modelos de inversión de RiderMex'
    },
    {
      id: 'investor-goals',
      title: 'Meta del Inversionista',
      component: Step03InvestorGoals,
      icon: Target,
      description: 'Define tus objetivos financieros'
    },
    {
      id: 'central-data',
      title: 'Datos de Inversión',
      component: Step06CentralData,
      icon: Settings,
      description: 'Configura enganche, certificados y financiamiento'
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
      component: Step11Results,
      icon: Award,
      description: 'Análisis completo de tu inversión en Rider'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  };

  const handleStepClick = (index: number) => {
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
          <p className="text-neutral-300 text-lg">Inicializando Calculadora Rider...</p>
        </div>
      </div>
    );
  }

  if (presentationMode) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <PresentationControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onStepChange={handleStepClick}
        />
        {showPresentationTools && <QuickSimulator />}
        <div className="container mx-auto px-4 py-8 pb-32">
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
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 px-4 py-2 bg-dark-card text-neutral-200 rounded-lg hover:shadow-neon-red hover:border-neon-red transition-all font-medium border border-dark-border"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Volver</span>
                </button>
              )}
              {!onBack && <div />} {/* Spacer if onBack is not provided */}

              <div className="flex items-center gap-3">
                <img src="/rider_inversiones.png" alt="Ridermex Inversiones" className="h-10 w-auto" />
                <div className="px-4 py-2 bg-dark-card rounded-lg border border-dark-border">
                  <span className="text-sm font-bold text-neon-red">Calculadora Rider</span>
                  <span className="mx-2 text-neutral-600">|</span>
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

export default RidermexRiderCalculator;
