import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Video, Users, Target, Settings, BarChart3, Award, TrendingUp, DollarSign, Leaf, Globe, BookOpen, Zap, Phone, Monitor, ArrowRight, Play, Star, FileText, PieChart, LineChart, Table, Receipt, Percent, Calendar, Shield, Coins, TreeDeciduous, Sprout, Trees, Rocket, GraduationCap, Briefcase, Sliders, PiggyBank, Home, Sparkles, Repeat, Bike } from 'lucide-react';
import { lazy, Suspense } from 'react';
import HomeGrid from './HomeGrid';
import ThemeToggle from './ui/ThemeToggle';

const ReinvestmentCalculator = lazy(() => import('./ReinvestmentCalculator'));
const SimplifiedCalculator = lazy(() => import('./SimplifiedCalculator'));
const ExpressCalculator = lazy(() => import('./ExpressCalculator'));
const MultiplierTreeCalculator = lazy(() => import('./MultiplierTreeCalculator'));
const RetirementCalculator = lazy(() => import('./RetirementCalculator'));
const ICMLandingPage = lazy(() => import('./ICMLandingPage'));
const ICMCalculator = lazy(() => import('./ICMCalculator'));
const InteresCompuestoMultiplicador = lazy(() => import('./InteresCompuestoMultiplicador'));
const SegubecaCalculator = lazy(() => import('./SegubecaCalculator'));
const SegubecaLandingPage = lazy(() => import('./SegubecaLandingPage'));
const RetirementFutureLandingPage = lazy(() => import('./RetirementFutureLandingPage'));
const VitaminadaLandingPage = lazy(() => import('./VitaminadaLandingPage'));
const VitaminadaCalculator = lazy(() => import('./VitaminadaCalculator'));
const DreamSimulatorLandingPage = lazy(() => import('./DreamSimulatorLandingPage'));
const DreamSimulator = lazy(() => import('./DreamSimulator'));
const HomeLandingPage = lazy(() => import('./HomeLandingPage'));
const RidermexHomeLandingPage = lazy(() => import('./RidermexHomeLandingPage'));
const MotorcycleLandingPage = lazy(() => import('./MotorcycleLandingPage'));
const MotorcycleCalculator = lazy(() => import('./MotorcycleCalculator'));
const RidermexReinvestmentLandingPage = lazy(() => import('./RidermexReinvestmentLandingPage'));
const RidermexReinvestmentCalculator = lazy(() => import('./RidermexReinvestmentCalculator'));
const RidermexExpressCalculator = lazy(() => import('./RidermexExpressCalculator'));
const CompoundInterestCalculator = lazy(() => import('./CompoundInterestCalculator'));
const ThreeScenarioComparator = lazy(() => import('./ThreeScenarioComparator'));
const ThreeScenarioLandingPage = lazy(() => import('./ThreeScenarioLandingPage'));
const UnitEconomicsCalculator = lazy(() => import('./UnitEconomicsCalculator'));
const UnitEconomicsLandingPage = lazy(() => import('./UnitEconomicsLandingPage'));
const RiderMexPerformanceCalculator = lazy(() => import('./RiderMexPerformanceCalculator'));
const RidermexShortCalculator = lazy(() => import('./RidermexShortCalculator'));
const CalculadoraMadre = lazy(() => import('./CalculadoraMadre'));

const CalculatorLoading = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Cargando calculadora...</p>
      <p className="text-gray-500 text-sm mt-2">Preparando tu experiencia financiera</p>
    </div>
  </div>
);

interface HomePageProps {
  className?: string;
}

const HomePage: React.FC<HomePageProps> = ({ className = '' }) => {
  const [selectedCalculator, setSelectedCalculator] = useState<'home' | 'home-landing' | 'ridermex-home-landing' | 'full' | 'simplified' | 'express' | 'tree' | 'retirement' | 'landing' | 'icm' | 'icm-multiplicador' | 'segubeca' | 'segubeca-landing' | 'retirement-landing' | 'vitaminada-landing' | 'vitaminada' | 'dream-landing' | 'dream' | 'motorcycle-landing' | 'motorcycle' | 'ridermex-reinvestment-landing' | 'ridermex-reinvestment' | 'ridermex-express' | 'ridermex-corta' | 'compound' | 'three-scenario' | 'unit-economics' | 'unit-economics-landing' | 'ridermex-performance' | 'madre'>(() => {
    const saved = sessionStorage.getItem('selectedCalculator');
    const validCalculators = ['home', 'home-landing', 'ridermex-home-landing', 'full', 'simplified', 'express', 'tree', 'retirement', 'landing', 'icm', 'icm-multiplicador', 'segubeca', 'segubeca-landing', 'retirement-landing', 'vitaminada-landing', 'vitaminada', 'dream-landing', 'dream', 'motorcycle-landing', 'motorcycle', 'ridermex-reinvestment-landing', 'ridermex-reinvestment', 'ridermex-express', 'ridermex-corta', 'compound', 'three-scenario', 'unit-economics', 'unit-economics-landing', 'ridermex-performance', 'madre'];
    return validCalculators.includes(saved || '') ? (saved as any) : 'home';
  });

  useEffect(() => {
    sessionStorage.setItem('selectedCalculator', selectedCalculator);
  }, [selectedCalculator]);

  if (selectedCalculator === 'full') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <RidermexReinvestmentCalculator onBack={() => setSelectedCalculator('home')} />
      </Suspense>
    );
  }

  if (selectedCalculator === 'simplified') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <SimplifiedCalculator onBack={() => setSelectedCalculator('home')} />
      </Suspense>
    );
  }

  if (selectedCalculator === 'express') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <ExpressCalculator onBack={() => setSelectedCalculator('home')} />
      </Suspense>
    );
  }

  if (selectedCalculator === 'tree') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <MultiplierTreeCalculator onBack={() => setSelectedCalculator('home')} />
      </Suspense>
    );
  }

  if (selectedCalculator === 'retirement') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <RetirementCalculator onBack={() => setSelectedCalculator('home')} />
      </Suspense>
    );
  }

  if (selectedCalculator === 'landing') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <ICMLandingPage
          onGetStarted={() => setSelectedCalculator('icm')}
          onBack={() => setSelectedCalculator('home-landing')}
        />
      </Suspense>
    );
  }

  if (selectedCalculator === 'icm') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <ICMCalculator onBack={() => setSelectedCalculator('landing')} />
      </Suspense>
    );
  }

  if (selectedCalculator === 'icm-multiplicador') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <InteresCompuestoMultiplicador onBack={() => setSelectedCalculator('home')} />
      </Suspense>
    );
  }

  if (selectedCalculator === 'segubeca') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <SegubecaCalculator onBack={() => setSelectedCalculator('home')} />
      </Suspense>
    );
  }

  if (selectedCalculator === 'segubeca-landing') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <SegubecaLandingPage
          onGetStarted={() => setSelectedCalculator('segubeca')}
          onBack={() => setSelectedCalculator('home')}
        />
      </Suspense>
    );
  }

  if (selectedCalculator === 'retirement-landing') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <RetirementFutureLandingPage
          onGetStarted={() => setSelectedCalculator('retirement')}
          onBack={() => setSelectedCalculator('home')}
        />
      </Suspense>
    );
  }

  if (selectedCalculator === 'vitaminada-landing') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <VitaminadaLandingPage
          onGetStarted={() => setSelectedCalculator('vitaminada')}
          onBack={() => setSelectedCalculator('home')}
        />
      </Suspense>
    );
  }

  if (selectedCalculator === 'vitaminada') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <VitaminadaCalculator onBack={() => setSelectedCalculator('vitaminada-landing')} />
      </Suspense>
    );
  }

  if (selectedCalculator === 'dream-landing') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <DreamSimulatorLandingPage
          onGetStarted={() => setSelectedCalculator('dream-simulator')}
          onBack={() => setSelectedCalculator('home')}
        />
      </Suspense>
    );
  }

  if (selectedCalculator === 'dream-simulator') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <DreamSimulator onBack={() => setSelectedCalculator('dream-landing')} />
      </Suspense>
    );
  }

  if (selectedCalculator === 'motorcycle-landing') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <MotorcycleLandingPage
          onGetStarted={() => setSelectedCalculator('motorcycle')}
          onBack={() => setSelectedCalculator('home')}
        />
      </Suspense>
    );
  }

  if (selectedCalculator === 'motorcycle') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <MotorcycleCalculator onBack={() => setSelectedCalculator('motorcycle-landing')} />
      </Suspense>
    );
  }

  if (selectedCalculator === 'ridermex-reinvestment-landing') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <RidermexReinvestmentLandingPage
          onStart={() => setSelectedCalculator('ridermex-reinvestment')}
          onBack={() => setSelectedCalculator('home')}
        />
      </Suspense>
    );
  }

  if (selectedCalculator === 'ridermex-reinvestment') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <RidermexReinvestmentCalculator onBack={() => setSelectedCalculator('ridermex-reinvestment-landing')} />
      </Suspense>
    );
  }

  if (selectedCalculator === 'ridermex-express') {
    window.scrollTo(0, 0);
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <RidermexExpressCalculator onBack={() => setSelectedCalculator('home')} />
      </Suspense>
    );
  }

  if (selectedCalculator === 'ridermex-corta') {
    window.scrollTo(0, 0);
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <RidermexShortCalculator onBack={() => setSelectedCalculator('home')} />
      </Suspense>
    );
  }

  if (selectedCalculator === 'icm') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <InteresCompuestoMultiplicador onBack={() => setSelectedCalculator('home')} />
      </Suspense>
    );
  }

  if (selectedCalculator === 'segubeca') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <SegubecaCalculator onBack={() => setSelectedCalculator('home')} />
      </Suspense>
    );
  }

  if (selectedCalculator === 'dream') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <DreamSimulator onBack={() => setSelectedCalculator('home')} />
      </Suspense>
    );
  }

  if (selectedCalculator === 'compound') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <CompoundInterestCalculator onBack={() => setSelectedCalculator('home')} />
      </Suspense>
    );
  }

  if (selectedCalculator === 'three-scenario') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <ThreeScenarioComparator onBack={() => setSelectedCalculator('home')} />
      </Suspense>
    );
  }

  if (selectedCalculator === 'unit-economics') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <UnitEconomicsCalculator onBack={() => setSelectedCalculator('home')} />
      </Suspense>
    );
  }

  if (selectedCalculator === 'unit-economics-landing') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <UnitEconomicsLandingPage
          onGetStarted={() => setSelectedCalculator('unit-economics')}
          onBack={() => setSelectedCalculator('home')}
        />
      </Suspense>
    );
  }

  if (selectedCalculator === 'ridermex-performance') {
    window.scrollTo(0, 0);
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <RiderMexPerformanceCalculator onBack={() => setSelectedCalculator('home')} onNavigate={(page) => setSelectedCalculator(page as any)} />
      </Suspense>
    );
  }

  if (selectedCalculator === 'madre') {
    window.scrollTo(0, 0);
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <CalculadoraMadre onBack={() => setSelectedCalculator('home')} />
      </Suspense>
    );
  }

  if (selectedCalculator === 'home-landing') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <HomeLandingPage onNavigate={(page) => setSelectedCalculator(page as any)} />
      </Suspense>
    );
  }

  if (selectedCalculator === 'ridermex-home-landing') {
    return (
      <Suspense fallback={<CalculatorLoading />}>
        <RidermexHomeLandingPage onNavigate={(page) => setSelectedCalculator(page as any)} />
      </Suspense>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 ${className}`}>
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Header Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-red-500 to-green-600 opacity-5"></div>
        <div className="relative bg-gradient-to-r from-orange-600 to-red-600 shadow-2xl border-b-4 border-orange-700">
          <div className="absolute top-0 right-0 w-96 h-96 opacity-5">
            <Bike className="w-full h-full" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-24">
              <div className="flex items-center gap-6 relative z-10">
                <motion.img
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  src="/rider_inversiones.png"
                  alt="Ridermex Inversiones"
                  className="h-20 w-auto"
                />
                <div className="text-white">
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold"
                  >
                    Certificado de Crecimiento Exponencial
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-orange-100 text-lg"
                  >
                    Suite de Calculadoras para el Interés Compuesto Multiplicador
                  </motion.p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-8 mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-32 h-32 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl flex items-center justify-center shadow-2xl relative"
            >
              <Bike className="w-16 h-16 text-white" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                className="absolute -top-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <Repeat className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>
          </div>

          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            INTERÉS COMPUESTO MULTIPLICADOR
          </h2>

          <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            No solo multiplica dinero, multiplica activos reales productivos
          </p>

          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Activos Reales</h3>
                <p className="text-gray-600">Inversión respaldada por plantaciones productivas de limón</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Repeat className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Crecimiento Exponencial</h3>
                <p className="text-gray-600">Las utilidades se reinvierten para adquirir más certificados</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Ingresos Dolarizados</h3>
                <p className="text-gray-600">Protección natural contra devaluación por exportación</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-12 py-8"
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-block mb-6"
            >
              <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-full border border-orange-200">
                <Calculator className="w-5 h-5 text-orange-600" />
                <span className="font-bold text-orange-900">Herramientas Ridermex</span>
              </div>
            </motion.div>

            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Suite Completa de Calculadoras
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Herramientas profesionales optimizadas para presentaciones, educación y cálculos personalizados
            </p>
          </div>

          {/* Calculadoras */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-block mb-6"
              >
                <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full border border-blue-200">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-blue-900">Calculadoras</span>
                </div>
              </motion.div>

              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Herramientas de Cálculo Directo
              </h3>
              <p className="text-lg text-gray-600">
                Acceso rápido a nuestras calculadoras más populares
              </p>
            </div>

            <HomeGrid
              calculators={[
                {
                  id: 'madre',
                  name: 'Calculadora Madre (Central)',
                  description: 'Análisis consolidado de los 4 modelos de inversión y escenarios Unit Economics',
                  icon: <Bike className="w-6 h-6 text-red-500" />,
                  features: ['4 Modelos (A, B, C, D)', 'Descuentos Manuales / Volumen', 'Amortización y Escenarios', 'Reinversión ICM'],
                  action: () => setSelectedCalculator('madre'),
                },
                {
                  id: 'ridermex-express',
                  name: 'RiderMex Express',
                  description: 'Cálculos rápidos optimizados para RiderMex',
                  icon: <Zap className="w-6 h-6" />,
                  features: ['Rápido', 'Interfaz simple', 'Proyecciones ágiles'],
                  action: () => setSelectedCalculator('ridermex-express'),
                },
                {
                  id: 'ridermex-corta',
                  name: 'RiderMex Corta (5 Pasos)',
                  description: 'Versión simplificada que incluye localización, protección legal, datos de la moto, plan de retiros y proyecciones',
                  icon: <Bike className="w-6 h-6 text-emerald-500" />,
                  features: ['5 Pasos rápidos', 'Fideicomiso y Seguros', 'Plan de retiros', 'Resultados completos'],
                  action: () => setSelectedCalculator('ridermex-corta'),
                },
                {
                  id: 'full',
                  name: 'Análisis Completo',
                  description: 'Simulación profunda con reinversión automática',
                  icon: <TrendingUp className="w-6 h-6" />,
                  features: ['Reinversión', 'Escenarios múltiples', 'Reportes'],
                  action: () => setSelectedCalculator('full'),
                },
                {
                  id: 'simplified',
                  name: 'Calculadora Simplificada',
                  description: 'Versión simplificada para análisis rápido',
                  icon: <Sliders className="w-6 h-6" />,
                  features: ['Fácil de usar', 'Resultados claros', 'Plan retiros'],
                  action: () => setSelectedCalculator('simplified'),
                },
                {
                  id: 'express',
                  name: 'Express',
                  description: 'Cálculos rápidos sin configuración compleja',
                  icon: <Zap className="w-6 h-6" />,
                  features: ['Rápida', 'Directa', 'Resultados'],
                  action: () => setSelectedCalculator('express'),
                },
                {
                  id: 'tree',
                  name: 'Árbol Multiplicador',
                  description: 'Visualización del efecto árbol de multiplicación',
                  icon: <TreeDeciduous className="w-6 h-6" />,
                  features: ['Árbol visual', 'Crecimiento exponencial', 'Análisis'],
                  action: () => setSelectedCalculator('tree'),
                },
                {
                  id: 'retirement',
                  name: 'Calculadora de Retiro',
                  description: 'Planificación de jubilación con proyecciones',
                  icon: <PiggyBank className="w-6 h-6" />,
                  features: ['Plan jubilación', 'Proyecciones', 'Rentabilidad'],
                  action: () => setSelectedCalculator('retirement'),
                },
                {
                  id: 'icm',
                  name: 'Interés Compuesto Multiplicador',
                  description: 'Análisis del modelo ICM con visualizaciones',
                  icon: <BarChart3 className="w-6 h-6" />,
                  features: ['Modelo ICM', 'Análisis profundo', 'Gráficos'],
                  action: () => setSelectedCalculator('icm'),
                },
                {
                  id: 'icm-multiplicador',
                  name: 'ICM Multiplicador ICT vs ICM',
                  description: 'Compara ICT vs ICM con escalones RiderMex y perfiles de retiro',
                  icon: <Repeat className="w-6 h-6" />,
                  features: ['ICT vs ICM', 'Escalones', 'Perfil de retiro'],
                  action: () => setSelectedCalculator('icm-multiplicador'),
                },
                {
                  id: 'segubeca',
                  name: 'Segubeca',
                  description: 'Fondo de educación con crecimiento exponencial',
                  icon: <GraduationCap className="w-6 h-6" />,
                  features: ['Fondo educación', 'Crecimiento', 'Garantía'],
                  action: () => setSelectedCalculator('segubeca'),
                },
                {
                  id: 'vitaminada',
                  name: 'Calculadora Vitaminada',
                  description: 'Análisis avanzado con múltiples escenarios',
                  icon: <Sparkles className="w-6 h-6" />,
                  features: ['Análisis avanzado', 'Escenarios', 'Reportes'],
                  action: () => setSelectedCalculator('vitaminada'),
                },
                {
                  id: 'dream',
                  name: 'Simulador de Sueños',
                  description: 'Define tus objetivos y visualiza tu camino',
                  icon: <Target className="w-6 h-6" />,
                  features: ['Metas personales', 'Visualización', 'Plan acción'],
                  action: () => setSelectedCalculator('dream'),
                },
                {
                  id: 'compound',
                  name: 'Interés Compuesto',
                  description: 'Visualización del crecimiento compuesto',
                  icon: <TrendingUp className="w-6 h-6" />,
                  features: ['Crecimiento exponencial', 'Proyecciones', 'Gráficos'],
                  action: () => setSelectedCalculator('compound'),
                },
                {
                  id: 'three-scenario',
                  name: 'Comparador 3 Escenarios',
                  description: 'Compara 3 escenarios de inversión diferentes',
                  icon: <BarChart3 className="w-6 h-6" />,
                  features: ['Análisis comparativo', '3 escenarios', 'Reportes'],
                  action: () => setSelectedCalculator('three-scenario'),
                },
                {
                  id: 'motorcycle',
                  name: 'Calculadora Motos',
                  description: 'Invierte en motos con modelo ICM',
                  icon: <Bike className="w-6 h-6" />,
                  features: ['Negocio motos', 'Rendimiento 19%+', 'Participa'],
                  action: () => setSelectedCalculator('motorcycle'),
                },
                {
                  id: 'unit-economics',
                  name: 'Unit Economics',
                  description: 'Matemática transparente del modelo de motos',
                  icon: <Calculator className="w-6 h-6" />,
                  features: ['Transparencia total', 'Interactivo', 'ROI claro'],
                  action: () => setSelectedCalculator('unit-economics'),
                },
                {
                  id: 'ridermex-performance',
                  name: 'RiderMex Rendimiento',
                  description: 'Calculadora de rendimiento profesional RiderMex',
                  icon: <Bike className="w-6 h-6" />,
                  features: ['Modelo completo', '10 agencias', 'Escenarios avanzados', 'Gráficos interactivos'],
                  action: () => setSelectedCalculator('ridermex-performance'),
                },
              ]}
            />
          </div>

          {/* Landing Pages */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-block mb-6"
              >
                <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border border-purple-200">
                  <Rocket className="w-5 h-5 text-purple-600" />
                  <span className="font-bold text-purple-900">Landing Pages</span>
                </div>
              </motion.div>

              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Experiencias Completas
              </h3>
              <p className="text-lg text-gray-600">
                Landing pages con información detallada y calculadoras integradas
              </p>
            </div>

            <HomeGrid
              calculators={[
                {
                  id: 'ridermex-reinvestment-landing',
                  name: 'Análisis Ridermex',
                  description: 'Simulación completa con reinversión automática y multiplicación de certificados',
                  icon: <TrendingUp className="w-6 h-6" />,
                  features: ['Reinversión automática', 'Análisis profundo', 'Plan de retiros'],
                  action: () => setSelectedCalculator('ridermex-reinvestment-landing'),
                },
                {
                  id: 'retirement-landing',
                  name: 'Calculadora de Retiro',
                  description: 'Simula tu jubilación ideal y calcula cuánto necesitas para vivir',
                  icon: <Target className="w-6 h-6" />,
                  features: ['Meta de retiro', 'Rentabilidad', 'Tiempo estimado'],
                  action: () => setSelectedCalculator('retirement-landing'),
                },
                {
                  id: 'segubeca-landing',
                  name: 'Segubeca',
                  description: 'Fondo de educación para tus hijos con crecimiento exponencial',
                  icon: <GraduationCap className="w-6 h-6" />,
                  features: ['Fondo educación', 'Crecimiento', 'Garantía fondos'],
                  action: () => setSelectedCalculator('segubeca-landing'),
                },
                {
                  id: 'vitaminada-landing',
                  name: 'Calculadora Vitaminada',
                  description: 'Análisis avanzado con múltiples escenarios y reportes profesionales',
                  icon: <Sparkles className="w-6 h-6" />,
                  features: ['Análisis avanzado', 'Escenarios múltiples', 'Reportes profundos'],
                  action: () => setSelectedCalculator('vitaminada-landing'),
                },
                {
                  id: 'dream-landing',
                  name: 'Simulador de Sueños',
                  description: 'Define tus objetivos financieros y ve cómo el ICM los hace realidad',
                  icon: <Target className="w-6 h-6" />,
                  features: ['Metas personales', 'Visualización', 'Plan acción'],
                  action: () => setSelectedCalculator('dream-landing'),
                },
                {
                  id: 'landing',
                  name: 'Descubre el ICM',
                  description: 'Landing principal del Interés Compuesto Multiplicador con casos de éxito',
                  icon: <Rocket className="w-6 h-6" />,
                  features: ['Casos de éxito', 'Ventajas ICM', 'Testimonios'],
                  action: () => setSelectedCalculator('landing'),
                },
                {
                  id: 'motorcycle-landing',
                  name: 'Calculadora Motos',
                  description: 'Invierte en motos con el modelo ICM y multiplica tu patrimonio',
                  icon: <Bike className="w-6 h-6" />,
                  features: ['Negocio establecido', 'Rendimiento 19%+', 'Participa en ventas'],
                  action: () => setSelectedCalculator('motorcycle-landing'),
                },
                {
                  id: 'ridermex-home-landing',
                  name: 'RiderMex Homepage',
                  description: 'Landing principal con todas las calculadoras RiderMex disponibles',
                  icon: <Bike className="w-6 h-6" />,
                  features: ['Todas las herramientas', 'Presentaciones', 'Análisis completo'],
                  action: () => setSelectedCalculator('ridermex-home-landing'),
                },
                {
                  id: 'home-landing',
                  name: 'Home Landing',
                  description: 'Landing inicial con introducción a todas las herramientas disponibles',
                  icon: <Home className="w-6 h-6" />,
                  features: ['Introducción', 'Suite completa', 'Guía de inicio'],
                  action: () => setSelectedCalculator('home-landing'),
                },
                {
                  id: 'unit-economics-landing',
                  name: 'Unit Economics Landing',
                  description: 'Explora la matemática transparente del modelo de motos',
                  icon: <Calculator className="w-6 h-6" />,
                  features: ['Transparencia', 'Modelo claro', 'ROI verificable'],
                  action: () => setSelectedCalculator('unit-economics-landing'),
                },
              ]}
            />
          </div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-20 pt-16 border-t border-gray-200"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 opacity-5">
                <Bike className="w-full h-full" />
              </div>
              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <h3 className="text-4xl font-bold mb-4">
                  Transforma tu Futuro Financiero Hoy
                </h3>
                <p className="text-green-100 mb-8 text-lg">
                  El Interés Compuesto Multiplicador es la evolución del modelo tradicional que multiplica activos reales productivos generando ingresos pasivos dolarizados.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCalculator('landing')}
                    className="px-8 py-4 bg-white text-green-600 font-semibold rounded-2xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                  >
                    <Rocket className="w-6 h-6" />
                    <span>Descubre el ICM</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCalculator('ridermex-home-landing')}
                    className="px-8 py-4 bg-green-400 text-white font-semibold rounded-2xl hover:bg-green-300 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                  >
                    <Bike className="w-6 h-6" />
                    <span>Experiencia Ridermex</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
