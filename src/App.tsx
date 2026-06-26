import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './components/HomePage';
import { ThemeProvider } from './context/ThemeContext';
import CalculatorWrapper from './components/CalculatorWrapper';

const ReinvestmentCalculator = lazy(() => import('./components/ReinvestmentCalculator'));
const SimplifiedCalculator = lazy(() => import('./components/SimplifiedCalculator'));
const ExpressCalculator = lazy(() => import('./components/ExpressCalculator'));
const MultiplierTreeCalculator = lazy(() => import('./components/MultiplierTreeCalculator'));
const RetirementCalculator = lazy(() => import('./components/RetirementCalculator'));
const ICMLandingPage = lazy(() => import('./components/ICMLandingPage'));
const ICMCalculator = lazy(() => import('./components/ICMCalculator'));
const InteresCompuestoMultiplicador = lazy(() => import('./components/InteresCompuestoMultiplicador'));
const SegubecaCalculator = lazy(() => import('./components/SegubecaCalculator'));
const SegubecaLandingPage = lazy(() => import('./components/SegubecaLandingPage'));
const RetirementFutureLandingPage = lazy(() => import('./components/RetirementFutureLandingPage'));
const VitaminadaLandingPage = lazy(() => import('./components/VitaminadaLandingPage'));
const VitaminadaCalculator = lazy(() => import('./components/VitaminadaCalculator'));
const DreamSimulatorLandingPage = lazy(() => import('./components/DreamSimulatorLandingPage'));
const DreamSimulator = lazy(() => import('./components/DreamSimulator'));
const MotorcycleLandingPage = lazy(() => import('./components/MotorcycleLandingPage'));
const MotorcycleCalculator = lazy(() => import('./components/MotorcycleCalculator'));
const RidermexReinvestmentLandingPage = lazy(() => import('./components/RidermexReinvestmentLandingPage'));
const RidermexReinvestmentCalculator = lazy(() => import('./components/RidermexReinvestmentCalculator'));
const RidermexExpressCalculator = lazy(() => import('./components/RidermexExpressCalculator'));
const RidermexShortCalculator = lazy(() => import('./components/RidermexShortCalculator'));
const RidermexRiderCalculator = lazy(() => import('./components/RidermexRiderCalculator'));
const RidermexHomeLandingPage = lazy(() => import('./components/RidermexHomeLandingPage'));
const CompoundInterestCalculator = lazy(() => import('./components/CompoundInterestCalculator'));
const ThreeScenarioComparator = lazy(() => import('./components/ThreeScenarioComparator'));
const ThreeScenarioLandingPage = lazy(() => import('./components/ThreeScenarioLandingPage'));
const UnitEconomicsCalculator = lazy(() => import('./components/UnitEconomicsCalculator'));
const UnitEconomicsLandingPage = lazy(() => import('./components/UnitEconomicsLandingPage'));
const RiderMexPerformanceCalculator = lazy(() => import('./components/RiderMexPerformanceCalculator'));
const CalculadoraMadre = lazy(() => import('./components/CalculadoraMadre'));

const CalculatorLoading = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Cargando calculadora...</p>
      <p className="text-gray-500 text-sm mt-2">Preparando tu experiencia financiera</p>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    switch (page) {
      case 'home':
        navigate('/');
        break;
      case 'dream-landing':
        navigate('/landing/simulador-suenos');
        break;
      case 'segubeca-landing':
        navigate('/landing/segubeca');
        break;
      case 'retirement-landing':
        navigate('/landing/retiro');
        break;
      case 'vitaminada-landing':
        navigate('/landing/vitaminada');
        break;
      case 'ridermex-reinvestment-landing':
        navigate('/landing/ridermex');
        break;
      case 'unit-economics-landing':
        navigate('/landing/unit-economics');
        break;
      case 'madre':
        navigate('/calculadora/madre');
        break;
      default:
        navigate('/');
    }
  };

  const isCalculadoraSubdomain = window.location.hostname === 'calculadora.ridermex.com' || window.location.hostname.includes('calculadora.ridermex');

  React.useEffect(() => {
    if (isCalculadoraSubdomain) {
      document.title = "Calculadora Rider - RiderMex";
    }
  }, [isCalculadoraSubdomain]);

  return (
    <Routes>
      <Route path="/" element={isCalculadoraSubdomain ? <CalculatorWrapper><RidermexRiderCalculator /></CalculatorWrapper> : <HomePage />} />
      <Route path="/calculadora-rider" element={<CalculatorWrapper><RidermexRiderCalculator onBack={() => navigate('/')} /></CalculatorWrapper>} />
      <Route path="/calculadora/rider" element={<CalculatorWrapper><RidermexRiderCalculator onBack={() => navigate('/')} /></CalculatorWrapper>} />
      <Route path="/calculadora/completa" element={<CalculatorWrapper><RidermexReinvestmentCalculator onBack={() => navigate('/')} /></CalculatorWrapper>} />
      <Route path="/calculadora/simplificada" element={<CalculatorWrapper><SimplifiedCalculator onBack={() => navigate('/')} /></CalculatorWrapper>} />
      <Route path="/calculadora/express" element={<CalculatorWrapper><ExpressCalculator onBack={() => navigate('/')} /></CalculatorWrapper>} />
      <Route path="/calculadora/arbol-multiplicador" element={<CalculatorWrapper><MultiplierTreeCalculator onBack={() => navigate('/')} /></CalculatorWrapper>} />
      <Route path="/calculadora/retiro" element={<CalculatorWrapper><RetirementCalculator onBack={() => navigate('/')} /></CalculatorWrapper>} />
      <Route path="/calculadora/icm" element={<CalculatorWrapper><InteresCompuestoMultiplicador onBack={() => navigate('/')} /></CalculatorWrapper>} />
      <Route path="/calculadora/segubeca" element={<CalculatorWrapper><SegubecaCalculator onBack={() => navigate('/')} /></CalculatorWrapper>} />
      <Route path="/calculadora/vitaminada" element={<CalculatorWrapper><VitaminadaCalculator onBack={() => navigate('/')} /></CalculatorWrapper>} />
      <Route path="/calculadora/simulador-suenos" element={<CalculatorWrapper><DreamSimulator onBack={() => navigate('/')} /></CalculatorWrapper>} />
      <Route path="/calculadora/motocicletas" element={<CalculatorWrapper><MotorcycleCalculator onBack={() => navigate('/')} /></CalculatorWrapper>} />
      <Route path="/calculadora/ridermex-reinversion" element={<CalculatorWrapper><RidermexReinvestmentCalculator onBack={() => navigate('/')} /></CalculatorWrapper>} />
      <Route path="/calculadora/ridermex-express" element={<CalculatorWrapper><RidermexExpressCalculator onBack={() => navigate('/')} /></CalculatorWrapper>} />
      <Route path="/calculadora/ridermex-corta" element={<CalculatorWrapper><RidermexShortCalculator onBack={() => navigate('/')} /></CalculatorWrapper>} />
      <Route path="/calculadora/interes-compuesto" element={<CalculatorWrapper><CompoundInterestCalculator /></CalculatorWrapper>} />
      <Route path="/calculadora/comparador-3-escenarios" element={<CalculatorWrapper><ThreeScenarioComparator /></CalculatorWrapper>} />
      <Route path="/calculadora/unit-economics" element={<CalculatorWrapper><UnitEconomicsCalculator onBack={() => navigate('/')} /></CalculatorWrapper>} />
      <Route path="/calculadora/ridermex-rendimiento" element={<RiderMexPerformanceCalculator onBack={() => window.history.back()} />} />
      <Route path="/calculadora/madre" element={<CalculatorWrapper><CalculadoraMadre onBack={() => window.history.back()} /></CalculatorWrapper>} />

      {/* Landing Pages */}
      <Route path="/landing/simulador-suenos" element={<DreamSimulatorLandingPage onBack={() => navigate('/')} onGetStarted={() => navigate('/calculadora/simulador-suenos')} />} />
      <Route path="/landing/icm" element={<ICMLandingPage onNavigate={handleNavigate} />} />
      <Route path="/landing/retiro" element={<RetirementFutureLandingPage onNavigate={handleNavigate} />} />
      <Route path="/landing/segubeca" element={<SegubecaLandingPage onNavigate={handleNavigate} />} />
      <Route path="/landing/vitaminada" element={<VitaminadaLandingPage onNavigate={handleNavigate} />} />
      <Route path="/landing/ridermex" element={<RidermexReinvestmentLandingPage onStart={() => navigate('/calculadora/ridermex-reinversion')} onBack={() => navigate('/')} />} />
      <Route path="/landing/comparador-3-escenarios" element={<ThreeScenarioLandingPage />} />
      <Route path="/landing/unit-economics" element={<UnitEconomicsLandingPage onGetStarted={() => navigate('/calculadora/unit-economics')} />} />
      <Route path="/ridermex" element={<RidermexHomeLandingPage onNavigate={handleNavigate} />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <Suspense fallback={<CalculatorLoading />}>
            <AppContent />
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;