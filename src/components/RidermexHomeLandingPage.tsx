import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Target, TrendingUp, Award, CheckCircle, ArrowRight, Star, ChevronDown,
  Calculator, DollarSign, Play, ArrowLeft, Clock,
  Plus, Check, X, Eye, ChevronUp, MessageCircle, Calendar,
  GraduationCap, Briefcase, PiggyBank, Zap, Building2,
  Shield, Users, Phone, Mail, MapPin, TrendingDown, AlertTriangle,
  AlertCircle, Bike, Store, Wrench, BarChart3, Lock, FileCheck, Download
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { useCalculator } from '../context/CalculatorContext';
import type { Investment, InvestmentResults } from '../types';
import { calculateResults } from '../utils/calculations';
import { ESCALONES, RIDERMEX_CONFIG } from '../data/ridermexConfig';

interface RidermexHomeLandingPageProps {
  onNavigate: (page: string) => void;
}

const RidermexHomeLandingPage: React.FC<RidermexHomeLandingPageProps> = ({ onNavigate }) => {
  const { updateInvestment, results } = useCalculator();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [email, setEmail] = useState('');
  const [comparisonTickets, setComparisonTickets] = useState(1);
  const [comparisonYears, setComparisonYears] = useState(25);
  const [heroResults, setHeroResults] = useState<InvestmentResults | null>(null);

  const ticketPrice = RIDERMEX_CONFIG.TICKET_PRICE;
  const comparisonAmount = comparisonTickets * ticketPrice;

  useEffect(() => {
    const heroInvestment: Investment = {
      initialCertificates: 1,
      certificateBasePrice: ticketPrice,
      initialPayment: ticketPrice,
      years: 25,
      reinvestProfits: true,
      reinvestmentPercentages: Array(25).fill(100),
      increaseLemonPrice: false,
      lemonPriceIncrease: 0,
      partialCashOut: false,
      cashOutPercentage: 0,
      yearlyCashOutPercentages: Array(25).fill(0),
      inflationRate: RIDERMEX_CONFIG.INFLATION_RATE,
      monthlyContribution: 0,
      ridermexProductType: 'B',
      ridermexFirstMonthlyIncome: 7,
      ridermexScenario: 'moderate',
      enableMarketGrowth: true,
      marketGrowthRate: 5,
      appreciationRate: RIDERMEX_CONFIG.ANNUAL_APPRECIATION,
    };

    const heroCalc = calculateResults(heroInvestment);
    setHeroResults(heroCalc);
  }, []);

  useEffect(() => {
    updateInvestment({
      initialCertificates: comparisonTickets,
      certificateBasePrice: ticketPrice,
      initialPayment: ticketPrice * comparisonTickets,
      years: comparisonYears,
      reinvestProfits: true,
      reinvestmentPercentages: Array(comparisonYears).fill(100),
      increaseLemonPrice: false,
      lemonPriceIncrease: 0,
      partialCashOut: false,
      cashOutPercentage: 0,
      yearlyCashOutPercentages: Array(comparisonYears).fill(0),
      inflationRate: RIDERMEX_CONFIG.INFLATION_RATE,
      monthlyContribution: 0,
      ridermexProductType: 'B',
      ridermexFirstMonthlyIncome: 7,
      ridermexScenario: 'moderate',
      enableMarketGrowth: true,
      marketGrowthRate: 5,
      appreciationRate: RIDERMEX_CONFIG.ANNUAL_APPRECIATION,
    });
  }, [comparisonTickets, comparisonYears, updateInvestment]);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 500);
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !sessionStorage.getItem('exitIntentShownRidermex')) {
        setShowExitIntent(true);
        sessionStorage.setItem('exitIntentShownRidermex', 'true');
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const calculateProjection = (option: { id: string; rate: number }) => {
    const yearlyData = [];

    if (option.id === 'icm') {
      if (results && results.yearlyData && results.yearlyData.length > 0) {
        results.yearlyData.forEach((yearData, index) => {
          if (index < comparisonYears) {
            yearlyData.push({
              year: index + 1,
              patrimony: Math.round(yearData.citrusPatrimony),
              monthlyIncome: Math.round(yearData.citrusIncome / 12),
              totalCertificates: yearData.totalCertificates
            });
          }
        });
      }
    } else {
      let patrimony = comparisonAmount;

      for (let year = 1; year <= comparisonYears; year++) {
        const yearlyReturn = patrimony * (option.rate / 100);
        patrimony += yearlyReturn;

        const monthlyIncome = yearlyReturn / 12;

        yearlyData.push({
          year,
          patrimony: Math.round(patrimony),
          monthlyIncome: Math.round(monthlyIncome),
          totalCertificates: 0
        });
      }
    }

    return yearlyData;
  };

  const ahorroData = calculateProjection({ id: 'ahorro', rate: 5 });
  const bienRaizData = calculateProjection({ id: 'bienRaiz', rate: 8 });
  const cetesData = calculateProjection({ id: 'cetes', rate: 10 });
  const icmData = calculateProjection({ id: 'icm', rate: 0 });

  const heroICMData = React.useMemo(() => {
    if (heroResults && heroResults.yearlyData && heroResults.yearlyData.length > 0) {
      return heroResults.yearlyData.map((yearData, index) => ({
        year: index + 1,
        patrimony: Math.round(yearData.citrusPatrimony),
        monthlyIncome: Math.round(yearData.citrusIncome / 12),
        totalCertificates: yearData.totalCertificates
      }));
    }
    return [];
  }, [heroResults]);

  const comparisonResults = {
    banco: ahorroData[ahorroData.length - 1]?.patrimony || comparisonAmount,
    cetes: cetesData[cetesData.length - 1]?.patrimony || comparisonAmount,
    afore: ahorroData[ahorroData.length - 1]?.patrimony || comparisonAmount,
    bienRaiz: bienRaizData[bienRaizData.length - 1]?.patrimony || comparisonAmount,
    icm: icmData[icmData.length - 1]?.patrimony || comparisonAmount
  };

  const chartData = Array.from({ length: comparisonYears + 1 }, (_, i) => {
    const ahorroValue = i === 0 ? comparisonAmount : (ahorroData[i - 1]?.patrimony || comparisonAmount);
    const bienRaizValue = i === 0 ? comparisonAmount : (bienRaizData[i - 1]?.patrimony || comparisonAmount);
    const cetesValue = i === 0 ? comparisonAmount : (cetesData[i - 1]?.patrimony || comparisonAmount);
    const icmValue = i === 0 ? comparisonAmount : (icmData[i - 1]?.patrimony || comparisonAmount);

    return {
      year: i,
      Banco: ahorroValue,
      CETES: cetesValue,
      AFORE: ahorroValue,
      'Bien Raiz': bienRaizValue,
      'RiderMex ICM': icmValue,
    };
  });

  const calculatorCards = [
    {
      id: 'dream-landing',
      icon: Sparkles,
      color: 'from-red-600 to-red-800',
      title: 'Simulador de Suenos',
      subtitle: 'Cumple tus metas con tickets RiderMex',
      description: 'Casa, auto, viaje... calcula cuantos tickets necesitas para lograr cualquier objetivo con rendimientos reales.',
      example: `Ej: 5 tickets hoy = $${ESCALONES[0].entryPrice.toLocaleString()}/mes en 10 anos`,
      benefits: ['Meta personalizada', 'Plazo flexible', 'Plan de inversion claro'],
      cta: 'Calcula tu sueno'
    },
    {
      id: 'segubeca-landing',
      icon: GraduationCap,
      color: 'from-gray-700 to-gray-900',
      title: 'Educacion Garantizada',
      subtitle: 'Asegura el futuro de tus hijos',
      description: 'Invierte en tickets hoy y garantiza la universidad de tus hijos mientras tu patrimonio crece con el negocio.',
      example: 'Ej: 1 ticket hoy = Universidad pagada + ingresos despues',
      benefits: ['Desde edad 0', 'Universidad garantizada', 'Patrimonio despues'],
      cta: 'Planear educacion'
    },
    {
      id: 'retirement-landing',
      icon: Briefcase,
      color: 'from-red-700 to-red-900',
      title: 'Pension Digna',
      subtitle: 'Retirate sin preocupaciones',
      description: 'Construye una pension 5X superior a las AFORES con el poder del ICM aplicado al negocio de motocicletas.',
      example: 'Ej: Invierte hoy, retirate con $120k/mes en 20 anos',
      benefits: ['Pension 5X mayor', 'Sin depender del gobierno', 'Libertad financiera'],
      cta: 'Proyectar retiro'
    },
    {
      id: 'vitaminada-landing',
      icon: TrendingUp,
      color: 'from-gray-800 to-black',
      title: 'Vitamina tu Ahorro',
      subtitle: 'Supera todas las inversiones',
      description: 'Compara como tu dinero crece con RiderMex vs bancos, CETES, bienes raices. El ICM les gana a todos.',
      example: `Ej: $${ESCALONES[0].entryPrice.toLocaleString()} en 15 anos = millones (vs miles en banco)`,
      benefits: ['Rendimiento superior', 'Negocio real', 'Comparacion clara'],
      cta: 'Ver comparativa'
    },
    {
      id: 'ridermex-reinvestment-landing',
      icon: Bike,
      color: 'from-red-600 to-black',
      title: 'ICM RiderMex Completo',
      subtitle: 'Entiende el modelo a fondo',
      description: 'Descubre como funciona el Interes Compuesto Multiplicador aplicado al negocio de motocicletas mas rentable de Mexico.',
      example: 'ICM: Tus utilidades compran mas tickets que generan mas utilidades',
      benefits: ['Modelo explicado', 'Escenarios reales', 'Fundamentos solidos'],
      cta: 'Conocer ICM RiderMex'
    },
    {
      id: 'unit-economics-landing',
      icon: BarChart3,
      color: 'from-blue-600 to-blue-800',
      title: 'Unit Economics Transparente',
      subtitle: 'La matematica del negocio real',
      description: 'Analiza los numeros reales del negocio de motocicletas. Entiende la mecanica detallada de cada metro de utilidad y como se multiplica tu patrimonio.',
      example: `Unit Economics: ${RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR} motos/ano x $${RIDERMEX_CONFIG.PROFIT_PER_MOTORCYCLE}/moto = $${Math.round(RIDERMEX_CONFIG.ANNUAL_PROFIT_POOL / 1000)}k/ano entre ${RIDERMEX_CONFIG.TICKETS_PER_STORE} tickets`,
      benefits: ['Numeros verificables', 'Proyecciones precisas', 'Transparencia total'],
      cta: 'Explorar Unit Economics'
    },
    {
      id: 'madre',
      icon: Bike,
      color: 'from-red-600 to-black',
      title: 'Calculadora Madre (Central)',
      subtitle: 'Análisis central de los 4 modelos',
      description: 'Ajusta descuentos, enganches y plazos. Compara los 3 escenarios operativos y proyecta con ICM.',
      example: 'Alineada con Unit Economics',
      benefits: ['4 modelos (A, B, C, D)', 'Ajuste manual de descuentos', 'Amortización y Escenarios'],
      cta: 'Ir a Calculadora Madre'
    }
  ];

  const testimonials = [
    {
      name: 'Carlos Mendez',
      role: 'Empresario, CDMX',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
      quote: 'Compre 3 tickets de RiderMex y en el segundo ano ya estoy recibiendo utilidades trimestrales. El negocio de motos es impresionante.',
      result: '+20% ROI anual'
    },
    {
      name: 'Laura Rios',
      role: 'Doctora, Monterrey',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura',
      quote: 'Mi AFORE me proyectaba $18k al mes. Con RiderMex, mis tickets ya generan mas que eso y apenas estoy empezando.',
      result: '5X vs AFORE'
    },
    {
      name: 'Miguel Torres',
      role: 'Ingeniero, Guadalajara',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel',
      quote: `Lo que me convencio fue ver la tienda real operando. ${RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR} motos al ano, utilidades trimestrales. Es un negocio transparente.`,
      result: 'Ingresos desde mes 7'
    }
  ];

  const faqs = [
    {
      question: 'Que es un ticket RiderMex?',
      answer: `Un ticket representa tu participacion como socio en una tienda de motocicletas RiderMex. Cada tienda tiene ${RIDERMEX_CONFIG.TICKETS_PER_STORE} tickets de $${ESCALONES[0].entryPrice.toLocaleString()} MXN cada uno. Como socio, recibes utilidades trimestrales proporcionales a tus tickets.`
    },
    {
      question: 'Desde cuanto puedo invertir?',
      answer: `La inversion minima es de ${formatCurrency(ticketPrice, 'MXN')} (1 ticket). Cada ticket te da derecho a recibir utilidades trimestrales estimadas de ${formatCurrency(RIDERMEX_CONFIG.QUARTERLY_PAYMENT, 'MXN')} basadas en la venta de motocicletas.`
    },
    {
      question: 'Cuando empiezo a recibir utilidades?',
      answer: 'Con el modelo Tipo B, empiezas a recibir utilidades desde el mes 7. La tienda inicia operaciones mientras se termina la construccion, y tu ya participas en las ganancias. No hay que esperar anos para ver resultados.'
    },
    {
      question: 'Que rendimientos son realistas?',
      answer: `En escenario moderado (${RIDERMEX_CONFIG.SCENARIOS.moderate.motorcyclesPerYear} motos/ano), cada ticket genera ${formatCurrency(RIDERMEX_CONFIG.ANNUAL_RETURN_PER_TICKET, 'MXN')} anuales (${RIDERMEX_CONFIG.ESTIMATED_ROI.toFixed(1)}% ROI). En escenario conservador: ${formatCurrency(RIDERMEX_CONFIG.SCENARIOS.conservative.annualReturnPerTicket, 'MXN')}/ano. En optimista: ${formatCurrency(RIDERMEX_CONFIG.SCENARIOS.optimistic.annualReturnPerTicket, 'MXN')}/ano.`
    },
    {
      question: 'Como estan protegidos mis activos?',
      answer: `Tu inversion esta protegida por tres fideicomisos en ${RIDERMEX_CONFIG.BANK}: ${RIDERMEX_CONFIG.TRUSTS.ASSETS}, ${RIDERMEX_CONFIG.TRUSTS.OPERATIONS} y ${RIDERMEX_CONFIG.TRUSTS.COLLECTION}. Ademas, cuentas con seguro de cobertura amplia y proteccion patrimonial.`
    },
    {
      question: 'Que es el Interes Compuesto Multiplicador (ICM)?',
      answer: 'El ICM reinvierte tus utilidades en mas tickets de tiendas RiderMex, que a su vez generan mas utilidades. No solo crece tu dinero, se MULTIPLICAN tus activos productivos. Es la diferencia entre ganar intereses y multiplicar negocios.'
    }
  ];

  const trustBadges = [
    { icon: Lock, text: 'Triple Fideicomiso' },
    { icon: FileCheck, text: RIDERMEX_CONFIG.BANK },
    { icon: Shield, text: 'Seguros de Proteccion' },
    { icon: Eye, text: 'Tiendas Visitables' },
    { icon: Users, text: 'Aliados Financieros' },
    { icon: Bike, text: '480+ Motos/Ano' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-md shadow-lg z-50 border-b border-red-900/30"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                  <Bike className="w-8 h-8 text-red-500" />
                  <span className="font-bold text-white text-lg">RiderMex</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onNavigate('home')}
                    className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium hidden sm:inline">Menu</span>
                  </button>
                  <a
                    href="https://wa.me/529982024327?text=Hola,%20quiero%20informacion%20sobre%20RiderMex"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium">WhatsApp</span>
                  </a>
                  <button
                    onClick={() => {
                      const element = document.getElementById('calculators-ridermex');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Ver Calculadoras
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href="https://wa.me/529982024327?text=Hola,%20quiero%20informacion%20sobre%20RiderMex"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-green-500 rounded-full shadow-2xl flex items-center justify-center hover:bg-green-600 transition-all hover:scale-110 group"
      >
        <MessageCircle className="w-8 h-8 text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
        <div className="absolute right-20 bg-white px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          <p className="text-sm font-medium text-gray-900">Tienes dudas?</p>
          <p className="text-xs text-gray-600">Chatea con nosotros</p>
        </div>
      </a>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-950 to-red-950 pt-20 pb-32">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-red-800/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Volver al menu</span>
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg">
                  <Bike className="w-6 h-6 text-white" />
                  <span className="font-bold text-white text-xl">RiderMex</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full">
                  <Store className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-semibold text-gray-300">Tiendas de Motocicletas</span>
                </div>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Invierte en el <span className="text-red-500">Negocio Real</span> de Motocicletas
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Se socio de tiendas RiderMex operando. El <strong className="text-white">Interes Compuesto Multiplicador</strong> reinvierte
                tus utilidades en mas tickets que generan mas utilidades.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => {
                    const element = document.getElementById('calculators-ridermex');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-600/30 hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Calculator className="w-5 h-5" />
                  Descubre tu camino
                </button>
                <button
                  onClick={() => {
                    const element = document.getElementById('video-ridermex');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Ver como funciona
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-500">{RIDERMEX_CONFIG.ESTIMATED_ROI.toFixed(0)}%+</p>
                  <p className="text-sm text-gray-400">ROI anual estimado</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-500">Mes 7</p>
                  <p className="text-sm text-gray-400">Primeras utilidades</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-500">100%</p>
                  <p className="text-sm text-gray-400">Negocio real</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl shadow-2xl p-8 border border-red-900/30">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Proyeccion Real</h3>
                  <div className="px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-sm font-semibold border border-red-600/30">
                    1 Ticket
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-red-950/50 to-red-900/30 rounded-2xl p-6 border border-red-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 font-medium">Inversion por ticket</span>
                      <Bike className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-3xl font-bold text-white">{formatCurrency(ticketPrice, 'MXN')}</p>
                    <p className="text-sm text-gray-400 mt-1">Escenario moderado - {RIDERMEX_CONFIG.SCENARIOS.moderate.motorcyclesPerYear} motos/ano</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                      <p className="text-sm text-gray-400 mb-1">Patrimonio Ano 5</p>
                      <p className="text-xl font-bold text-green-400">
                        {heroICMData[4] ? formatCurrency(heroICMData[4].patrimony, 'MXN') : '-'}
                      </p>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                      <p className="text-sm text-gray-400 mb-1">Patrimonio Ano 10</p>
                      <p className="text-xl font-bold text-green-400">
                        {heroICMData[9] ? formatCurrency(heroICMData[9].patrimony, 'MXN') : '-'}
                      </p>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                      <p className="text-sm text-gray-400 mb-1">Patrimonio Ano 15</p>
                      <p className="text-xl font-bold text-green-400">
                        {heroICMData[14] ? formatCurrency(heroICMData[14].patrimony, 'MXN') : '-'}
                      </p>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                      <p className="text-sm text-gray-400 mb-1">Patrimonio Ano 20</p>
                      <p className="text-xl font-bold text-green-400">
                        {heroICMData[19] ? formatCurrency(heroICMData[19].patrimony, 'MXN') : '-'}
                      </p>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 col-span-2 border border-gray-700/50">
                      <p className="text-sm text-gray-400 mb-1">Patrimonio Ano 25</p>
                      <p className="text-2xl font-bold text-green-400">
                        {heroICMData[24] ? formatCurrency(heroICMData[24].patrimony, 'MXN') : '-'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5" />
                      <span className="font-semibold">Ingreso mensual ano 25</span>
                    </div>
                    <p className="text-4xl font-bold">
                      {heroICMData[24] ? formatCurrency(heroICMData[24].monthlyIncome, 'MXN') : '-'}
                    </p>
                    <p className="text-sm opacity-90 mt-1">Sin tocar tu patrimonio</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Unit Economics */}
      <section className="py-20 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Un Negocio con <span className="text-red-500">Numeros Reales</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Cada tienda RiderMex vende {RIDERMEX_CONFIG.SCENARIOS.moderate.motorcyclesPerYear}+ motocicletas al ano con utilidad de {formatCurrency(RIDERMEX_CONFIG.PROFIT_PER_MOTORCYCLE, 'MXN')} por moto
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Bike, label: 'Motos vendidas/ano', value: `${RIDERMEX_CONFIG.SCENARIOS.moderate.motorcyclesPerYear}+`, color: 'text-red-500' },
              { icon: DollarSign, label: 'Utilidad por moto', value: formatCurrency(RIDERMEX_CONFIG.PROFIT_PER_MOTORCYCLE, 'MXN'), color: 'text-green-400' },
              { icon: Store, label: 'Utilidad anual/tienda', value: formatCurrency(RIDERMEX_CONFIG.ANNUAL_PROFIT_POOL, 'MXN'), color: 'text-yellow-400' },
              { icon: Target, label: 'ROI estimado', value: `${RIDERMEX_CONFIG.ESTIMATED_ROI.toFixed(1)}%`, color: 'text-red-500' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 text-center"
              >
                <stat.icon className={`w-10 h-10 ${stat.color} mx-auto mb-4`} />
                <p className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-red-600/20 to-red-800/20 border border-red-600/30 rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-3">La Matematica es Simple</h3>
            <div className="flex flex-wrap justify-center items-center gap-4 text-lg">
              <span className="bg-gray-800 px-4 py-2 rounded-lg text-gray-300">{RIDERMEX_CONFIG.SCENARIOS.moderate.motorcyclesPerYear} motos</span>
              <span className="text-red-500 font-bold">x</span>
              <span className="bg-gray-800 px-4 py-2 rounded-lg text-gray-300">{formatCurrency(RIDERMEX_CONFIG.PROFIT_PER_MOTORCYCLE, 'MXN')}/moto</span>
              <span className="text-red-500 font-bold">=</span>
              <span className="bg-red-600 px-4 py-2 rounded-lg text-white font-bold">{formatCurrency(RIDERMEX_CONFIG.ANNUAL_PROFIT_POOL, 'MXN')}/ano</span>
              <span className="text-red-500 font-bold">/</span>
              <span className="bg-gray-800 px-4 py-2 rounded-lg text-gray-300">{RIDERMEX_CONFIG.TICKETS_PER_STORE} tickets</span>
              <span className="text-red-500 font-bold">=</span>
              <span className="bg-green-600 px-4 py-2 rounded-lg text-white font-bold">{formatCurrency(RIDERMEX_CONFIG.ANNUAL_RETURN_PER_TICKET, 'MXN')}/ticket/ano</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem-Solution */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Los Metodos Tradicionales <span className="text-red-500">NO Funcionan</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              La inflacion destruye tu dinero mas rapido de lo que los bancos lo hacen crecer
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: TrendingDown, title: 'Bancos', rate: '1-3%', desc: 'Pierdes poder adquisitivo cada ano. La inflacion es ~4-5%', color: 'red' },
              { icon: AlertTriangle, title: 'AFOREs', rate: '6-7%', desc: 'Pension promedio: $4,500/mes. Imposible vivir dignamente', color: 'yellow' },
              { icon: AlertCircle, title: 'CETES', rate: '10-11%', desc: 'Apenas superas la inflacion. No construyes riqueza real', color: 'orange' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8"
              >
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <item.icon className={`w-8 h-8 text-${item.color}-500`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">{item.title}</h3>
                <p className={`text-3xl font-bold text-${item.color}-500 text-center mb-2`}>{item.rate}</p>
                <p className="text-gray-400 text-center">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-red-600 to-red-800 rounded-3xl p-12 text-white text-center"
          >
            <Bike className="w-16 h-16 mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-4">La Solucion: RiderMex + ICM</h3>
            <p className="text-xl opacity-90 mb-6 max-w-3xl mx-auto">
              No solo reinviertes dinero. Reinviertes en mas tickets de tiendas que venden motocicletas.
              Tus utilidades compran mas participaciones que generan mas utilidades.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <div>
                <p className="text-5xl font-bold">{RIDERMEX_CONFIG.ESTIMATED_ROI.toFixed(0)}%+</p>
                <p className="opacity-90">ROI anual estimado</p>
              </div>
              <div className="w-px bg-white opacity-30"></div>
              <div>
                <p className="text-5xl font-bold">Mes 7</p>
                <p className="opacity-90">Primeras utilidades</p>
              </div>
              <div className="w-px bg-white opacity-30"></div>
              <div>
                <p className="text-5xl font-bold">3X-5X</p>
                <p className="opacity-90">vs metodos tradicionales</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Comparison */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Compruebalo Tu Mismo
            </h2>
            <p className="text-xl text-gray-400">
              Ajusta los valores y observa la diferencia
            </p>
          </motion.div>

          <div className="bg-gray-900/80 rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-800">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Cuantos tickets? {comparisonTickets} ticket{comparisonTickets > 1 ? 's' : ''} ({formatCurrency(comparisonAmount, 'MXN')})
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={comparisonTickets}
                  onChange={(e) => setComparisonTickets(Number(e.target.value))}
                  className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 ticket</span>
                  <span>30 tickets (1 tienda)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  A cuantos anos? {comparisonYears} anos
                </label>
                <input
                  type="range"
                  min="5"
                  max="25"
                  step="5"
                  value={comparisonYears}
                  onChange={(e) => setComparisonYears(Number(e.target.value))}
                  className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5 anos</span>
                  <span>10</span>
                  <span>15</span>
                  <span>20</span>
                  <span>25 anos</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-5 gap-4 mb-12">
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <p className="text-xs text-gray-500 mb-1">Ahorro (5%)</p>
                <p className="text-sm font-semibold text-gray-300 mb-1">Patrimonio:</p>
                <p className="text-lg font-bold text-red-400 mb-2">{formatCurrency(comparisonResults.banco, 'MXN')}</p>
                <p className="text-xs text-gray-500">Ingreso mensual:</p>
                <p className="text-sm font-semibold text-red-400">{formatCurrency(ahorroData[ahorroData.length - 1]?.monthlyIncome || 0, 'MXN')}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <p className="text-xs text-gray-500 mb-1">AFORE (5%)</p>
                <p className="text-sm font-semibold text-gray-300 mb-1">Patrimonio:</p>
                <p className="text-lg font-bold text-yellow-400 mb-2">{formatCurrency(comparisonResults.afore, 'MXN')}</p>
                <p className="text-xs text-gray-500">Ingreso mensual:</p>
                <p className="text-sm font-semibold text-yellow-400">{formatCurrency(ahorroData[ahorroData.length - 1]?.monthlyIncome || 0, 'MXN')}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <p className="text-xs text-gray-500 mb-1">Bien Raiz (8%)</p>
                <p className="text-sm font-semibold text-gray-300 mb-1">Patrimonio:</p>
                <p className="text-lg font-bold text-orange-400 mb-2">{formatCurrency(comparisonResults.bienRaiz, 'MXN')}</p>
                <p className="text-xs text-gray-500">Ingreso mensual:</p>
                <p className="text-sm font-semibold text-orange-400">{formatCurrency(bienRaizData[bienRaizData.length - 1]?.monthlyIncome || 0, 'MXN')}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <p className="text-xs text-gray-500 mb-1">CETES (10%)</p>
                <p className="text-sm font-semibold text-gray-300 mb-1">Patrimonio:</p>
                <p className="text-lg font-bold text-blue-400 mb-2">{formatCurrency(comparisonResults.cetes, 'MXN')}</p>
                <p className="text-xs text-gray-500">Ingreso mensual:</p>
                <p className="text-sm font-semibold text-blue-400">{formatCurrency(cetesData[cetesData.length - 1]?.monthlyIncome || 0, 'MXN')}</p>
              </div>
              <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-4 border border-red-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
                <p className="text-xs text-red-200 mb-1">RiderMex ICM</p>
                <p className="text-sm font-semibold text-white mb-1">Patrimonio:</p>
                <p className="text-lg font-bold text-white mb-2">{formatCurrency(comparisonResults.icm, 'MXN')}</p>
                <p className="text-xs text-red-200">Ingreso mensual:</p>
                <p className="text-sm font-semibold text-white">{formatCurrency(icmData[icmData.length - 1]?.monthlyIncome || 0, 'MXN')}</p>
                <div className="absolute -top-1 -right-1">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                </div>
              </div>
            </div>

            <div className="h-80 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="year" stroke="#9ca3af" label={{ value: 'Anos', position: 'insideBottom', offset: -5, fill: '#9ca3af' }} />
                  <YAxis stroke="#9ca3af" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value, 'MXN')}
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem', color: '#fff' }}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                  <Area type="monotone" dataKey="Banco" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="AFORE" stroke="#eab308" fill="#eab308" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="CETES" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="Bien Raiz" stroke="#f97316" fill="#f97316" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="RiderMex ICM" stroke="#dc2626" fill="#dc2626" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-red-950/50 border border-red-800/50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <Award className="w-8 h-8 text-red-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-white mb-2">Diferencia real en {comparisonYears} anos:</h4>
                  <p className="text-gray-300 mb-2">
                    Con <strong className="text-white">{comparisonTickets} ticket{comparisonTickets > 1 ? 's' : ''} ({formatCurrency(comparisonAmount, 'MXN')})</strong> tendrias:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Mejor metodo tradicional (CETES):</p>
                      <p className="text-2xl font-bold text-blue-400">{formatCurrency(comparisonResults.cetes, 'MXN')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Con RiderMex ICM:</p>
                      <p className="text-2xl font-bold text-red-500">{formatCurrency(comparisonResults.icm, 'MXN')}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-4">
                    Diferencia: <strong className="text-green-400">+{formatCurrency(comparisonResults.icm - comparisonResults.cetes, 'MXN')}</strong>
                    {' '}({comparisonResults.cetes > 0 ? (((comparisonResults.icm / comparisonResults.cetes) - 1) * 100).toFixed(0) : 0}% mas)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculators */}
      <section id="calculators-ridermex" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Cual es Tu <span className="text-red-500">Meta Financiera</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Cada persona tiene objetivos diferentes. Elige tu calculadora ideal y descubre
              como RiderMex te ayuda a lograr exactamente lo que buscas
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {calculatorCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-red-600/50 hover:shadow-2xl hover:shadow-red-600/10 transition-all cursor-pointer"
                onClick={() => onNavigate(card.id)}
              >
                <div className="flex items-start gap-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <card.icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{card.title}</h3>
                    <p className="text-sm font-semibold text-red-400 mb-3">{card.subtitle}</p>
                    <p className="text-gray-400 mb-4">{card.description}</p>

                    <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
                      <p className="text-sm font-medium text-gray-300 mb-2">Ejemplo practico:</p>
                      <p className="text-sm text-gray-400">{card.example}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {card.benefits.map((benefit, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-red-950/50 text-red-300 rounded-full text-xs font-medium border border-red-800/30">
                          <CheckCircle className="w-3 h-3" />
                          {benefit}
                        </span>
                      ))}
                    </div>

                    <button className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02]">
                      {card.cta}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-gray-500 mb-4">No estas seguro cual elegir?</p>
            <a
              href="https://wa.me/529982024327?text=Hola,%20necesito%20ayuda%20para%20elegir%20la%20calculadora%20RiderMex%20ideal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-red-600 text-red-400 rounded-xl font-semibold hover:bg-red-600/10 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Habla con un asesor
            </a>
          </motion.div>
        </div>
      </section>

      {/* Video */}
      <section id="video-ridermex" className="py-20 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Entiende RiderMex en 3 Minutos
            </h2>
            <p className="text-xl text-gray-400">
              Descubre como funciona el negocio de motocicletas mas rentable de Mexico
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-video bg-gradient-to-br from-gray-900 to-red-950/30 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center border border-gray-800"
          >
            <div className="text-center">
              <Play className="w-24 h-24 text-red-500 mx-auto mb-6 opacity-80" />
              <p className="text-white text-lg opacity-90">Video proximamente</p>
              <p className="text-gray-400 text-sm mt-2">Mientras tanto, agenda una videollamada personalizada</p>
              <a
                href="https://wa.me/529982024327?text=Quiero%20agendar%20una%20videollamada%20para%20entender%20RiderMex"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all mt-6"
              >
                <Calendar className="w-5 h-5" />
                Agendar llamada
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Historias Reales de Exito
            </h2>
            <p className="text-xl text-gray-400">
              Socios que ya generan utilidades con RiderMex
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/80 rounded-2xl p-8 border border-gray-800 hover:border-red-800/50 transition-colors"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full bg-gray-800"
                  />
                  <div>
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>

                <div className="mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 inline text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>

                <div className="bg-red-950/30 rounded-xl p-4 border border-red-800/30">
                  <p className="text-sm text-gray-400 mb-1">Resultado:</p>
                  <p className="text-xl font-bold text-red-400">{testimonial.result}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-gray-500 mb-6">Quieres ser el siguiente caso de exito?</p>
            <button
              onClick={() => {
                const element = document.getElementById('calculators-ridermex');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-600/20 inline-flex items-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              Calcula tu proyeccion ahora
            </button>
          </motion.div>
        </div>
      </section>

      {/* Why RiderMex */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Por Que <span className="text-red-500">RiderMex</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              No es un fondo de inversion. Es participacion directa en un negocio real y operando
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Store, title: 'Negocio Real Operando', desc: 'Tu ticket representa participacion en tiendas de motocicletas que ya estan vendiendo. No es promesa, es realidad operativa.', color: 'red' },
              { icon: Shield, title: 'Triple Proteccion Legal', desc: `Tres fideicomisos en ${RIDERMEX_CONFIG.BANK} que separan y protegen tus activos, la operacion y tus pagos.`, color: 'blue' },
              { icon: Eye, title: 'Transparencia Total', desc: 'Puedes visitar las tiendas, ver el inventario, conocer las ventas. Todo verificable en persona.', color: 'green' },
              { icon: TrendingUp, title: 'Rendimientos Superiores', desc: `${RIDERMEX_CONFIG.ESTIMATED_ROI.toFixed(0)}%+ ROI anual estimado vs 4-6% de metodos tradicionales. La diferencia es exponencial con ICM.`, color: 'yellow' },
              { icon: Wrench, title: 'Modelo Probado', desc: `${RIDERMEX_CONFIG.SCENARIOS.moderate.motorcyclesPerYear}+ motos vendidas por tienda al ano. Rotacion de inventario de ${RIDERMEX_CONFIG.INVENTORY_ROTATION_DAYS_MIN}-${RIDERMEX_CONFIG.INVENTORY_ROTATION_DAYS_MAX} dias.`, color: 'orange' },
              { icon: Users, title: 'Aliados Financieros', desc: `Respaldado por ${RIDERMEX_CONFIG.FINANCIAL_PARTNERS.join(', ')} como aliados financieros para financiamiento de los clientes.`, color: 'cyan' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className={`w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-6`}>
                  <item.icon className={`w-8 h-8 text-${item.color}-500`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Steps */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Comenzar es Mas Facil de lo que Piensas
            </h2>
            <p className="text-xl text-gray-400">
              3 pasos simples para ser socio de RiderMex
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: 1,
                color: 'from-red-600 to-red-800',
                title: 'Elige tu Estrategia',
                desc: 'Usa nuestras calculadoras para tu objetivo: educacion, retiro, suenos o crecimiento patrimonial con tickets RiderMex.',
                items: ['Sin compromiso', 'Proyeccion personalizada', 'Asesoria incluida']
              },
              {
                num: 2,
                color: 'from-gray-700 to-gray-900',
                title: 'Adquiere tus Tickets',
                desc: `Desde ${formatCurrency(ticketPrice, 'MXN')} (1 ticket). Se socio de una tienda de motocicletas real y operando.`,
                items: ['Proceso simple', 'Triple fideicomiso', 'Respaldo legal total']
              },
              {
                num: 3,
                color: 'from-green-600 to-green-800',
                title: 'Recibe Utilidades',
                desc: 'Utilidades trimestrales desde el mes 7. Reinvierte con ICM para multiplicar tus tickets o retira segun tu plan.',
                items: ['Pago trimestral', 'Reinversion ICM', 'Crecimiento exponencial']
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className={`bg-gradient-to-br ${step.color} rounded-2xl p-8 h-full`}>
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-gray-900 mb-6">
                    {step.num}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-white/80 mb-6">{step.desc}</p>
                  <ul className="space-y-2">
                    {step.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-white/70" />
                        <span className="text-white/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {index < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 w-8 h-8 bg-red-600 rounded-full items-center justify-center z-10">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-xl text-gray-400">
              Respuestas claras a las dudas mas comunes
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/80 rounded-xl border border-gray-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                >
                  <span className="text-left font-semibold text-white pr-4">
                    {faq.question}
                  </span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-red-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-gray-400 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-gray-500 mb-4">Tienes mas preguntas?</p>
            <a
              href="https://wa.me/529982024327?text=Tengo%20preguntas%20sobre%20RiderMex"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Habla con un experto
            </a>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Bike className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Es Momento de Ser Socio de un Negocio Real
            </h2>
            <p className="text-xl opacity-90 mb-12 max-w-3xl mx-auto">
              Cada dia que esperas es un dia menos de crecimiento exponencial. Las tiendas RiderMex
              estan vendiendo motocicletas ahora mismo. Tu puedes ser parte de eso.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <button
                onClick={() => {
                  const element = document.getElementById('calculators-ridermex');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-white text-red-700 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                Calcular mi proyeccion
              </button>

              <a
                href="https://wa.me/529982024327?text=Quiero%20agendar%20una%20llamada%20sobre%20RiderMex"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-red-700 transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Agendar llamada
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-8 opacity-90">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center gap-2">
                  <badge.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bike className="w-8 h-8 text-red-500" />
                <span className="font-bold text-xl">RiderMex</span>
              </div>
              <p className="text-gray-500 text-sm">
                Construyendo patrimonio con el negocio de motocicletas mas rentable de Mexico.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-gray-300">Calculadoras</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><button onClick={() => onNavigate('dream-landing')} className="hover:text-white transition-colors">Simulador de Suenos</button></li>
                <li><button onClick={() => onNavigate('segubeca-landing')} className="hover:text-white transition-colors">Educacion Garantizada</button></li>
                <li><button onClick={() => onNavigate('retirement-landing')} className="hover:text-white transition-colors">Pension Digna</button></li>
                <li><button onClick={() => onNavigate('vitaminada-landing')} className="hover:text-white transition-colors">Vitamina tu Ahorro</button></li>
                <li><button onClick={() => onNavigate('ridermex-reinvestment-landing')} className="hover:text-white transition-colors">ICM RiderMex Completo</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-gray-300">Informacion</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Como Funciona</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Casos de Exito</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Legal</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-gray-300">Contacto</h4>
              <ul className="space-y-3 text-gray-500 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+529982024327" className="hover:text-white transition-colors">
                    +52 998 202 4327
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:contacto@ridermex.com" className="hover:text-white transition-colors">
                    contacto@ridermex.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Mexico</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-900 pt-8 text-center text-gray-600 text-sm">
            <p>&copy; {new Date().getFullYear()} RiderMex. Todos los derechos reservados.</p>
            <p className="mt-2">Interes Compuesto Multiplicador aplicado a Motocicletas</p>
          </div>
        </div>
      </footer>

      {/* Exit Intent */}
      <AnimatePresence>
        {showExitIntent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
            onClick={() => setShowExitIntent(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative border border-gray-800"
            >
              <button
                onClick={() => setShowExitIntent(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bike className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-3xl font-bold text-white mb-4">
                  Espera! No Te Vayas Sin Esto
                </h3>

                <p className="text-lg text-gray-300 mb-6">
                  Descarga GRATIS: <strong className="text-white">"Guia del Inversionista RiderMex"</strong>
                </p>

                <div className="bg-red-950/30 border border-red-800/30 rounded-xl p-6 mb-6">
                  <ul className="space-y-2 text-left">
                    {['Como funciona el modelo de tickets', 'Numeros reales del negocio de motos', 'Por que el ICM multiplica tu patrimonio'].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu mejor email"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl mb-4 focus:border-red-500 focus:outline-none text-white placeholder-gray-500"
                />

                <button
                  onClick={() => {
                    if (email) {
                      alert('Gracias! Revisa tu email.');
                      setShowExitIntent(false);
                    }
                  }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Descargar Guia Gratis
                </button>

                <p className="text-xs text-gray-600 mt-4">
                  No spam. Solo contenido valioso para tu patrimonio.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RidermexHomeLandingPage;
