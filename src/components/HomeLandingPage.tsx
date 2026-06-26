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

interface HomeLandingPageProps {
  onNavigate: (page: string) => void;
}

const HomeLandingPage: React.FC<HomeLandingPageProps> = ({ onNavigate }) => {
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
      marketGrowthRate: 2,
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
      marketGrowthRate: 2,
      appreciationRate: RIDERMEX_CONFIG.ANNUAL_APPRECIATION,
    });
  }, [comparisonTickets, comparisonYears, updateInvestment]);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 500);
    };
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !sessionStorage.getItem('exitIntentShown')) {
        setShowExitIntent(true);
        sessionStorage.setItem('exitIntentShown', 'true');
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
        yearlyData.push({
          year,
          patrimony: Math.round(patrimony),
          monthlyIncome: Math.round(yearlyReturn / 12),
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

  const chartData = Array.from({ length: comparisonYears + 1 }, (_, i) => ({
    year: i,
    Banco: i === 0 ? comparisonAmount : (ahorroData[i - 1]?.patrimony || comparisonAmount),
    CETES: i === 0 ? comparisonAmount : (cetesData[i - 1]?.patrimony || comparisonAmount),
    AFORE: i === 0 ? comparisonAmount : (ahorroData[i - 1]?.patrimony || comparisonAmount),
    'Bien Raiz': i === 0 ? comparisonAmount : (bienRaizData[i - 1]?.patrimony || comparisonAmount),
    'RiderMex ICM': i === 0 ? comparisonAmount : (icmData[i - 1]?.patrimony || comparisonAmount),
  }));

  const calculatorCards = [
    {
      id: 'dream-landing',
      icon: Sparkles,
      title: 'Simulador de Suenos',
      subtitle: 'Cumple tus metas con tickets RiderMex',
      description: 'Casa, auto, viaje... calcula cuantos tickets necesitas para lograr cualquier objetivo financiero',
      benefits: ['Meta personalizada', 'Plazo flexible', 'Plan claro'],
      cta: 'Calcula tu sueno'
    },
    {
      id: 'segubeca-landing',
      icon: GraduationCap,
      title: 'Educacion Garantizada',
      subtitle: 'Asegura el futuro de tus hijos',
      description: 'Invierte en tickets RiderMex hoy y garantiza la universidad de tus hijos mientras construyes patrimonio',
      benefits: ['Desde edad 0', 'Universidad garantizada', 'Patrimonio despues'],
      cta: 'Planear educacion'
    },
    {
      id: 'retirement-landing',
      icon: Briefcase,
      title: 'Pension Digna',
      subtitle: 'Retirate sin preocupaciones',
      description: 'Construye una pension superior a las AFOREs con el poder del ICM aplicado a motocicletas',
      benefits: ['Pension 5X mayor', 'Sin depender del gobierno', 'Libertad financiera'],
      cta: 'Proyectar retiro'
    },
    {
      id: 'vitaminada-landing',
      icon: TrendingUp,
      title: 'Vitamina tu Ahorro',
      subtitle: 'Supera todas las inversiones',
      description: 'Compara como tu dinero crece con RiderMex ICM vs bancos, CETES y bienes raices',
      benefits: ['Rendimiento superior', 'Negocio real', 'Comparacion clara'],
      cta: 'Ver comparativa'
    },
    {
      id: 'ridermex-reinvestment-landing',
      icon: Bike,
      title: 'ICM RiderMex Completo',
      subtitle: 'Entiende el modelo a fondo',
      description: 'Descubre como funciona el Interes Compuesto Multiplicador aplicado a tiendas de motocicletas',
      benefits: ['Modelo explicado', 'Unit economics', 'Fundamentos solidos'],
      cta: 'Conocer ICM'
    },
    {
      id: 'madre',
      icon: Bike,
      title: 'Calculadora Madre (Central)',
      subtitle: 'Análisis central de los 4 modelos',
      description: 'Ajusta descuentos, enganches y plazos. Compara los 3 escenarios operativos y proyecta con ICM.',
      benefits: ['4 modelos (A, B, C, D)', 'Ajuste manual de descuentos', 'Amortización y Escenarios'],
      cta: 'Ir a Calculadora Madre'
    }
  ];

  const testimonials = [
    {
      name: 'Carlos Mendez',
      role: 'Empresario, CDMX',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
      quote: 'Compre mi primer ticket hace 2 anos. Hoy genero utilidades trimestrales consistentes y mi ticket vale mas. Mejor decision de inversion.',
      result: '+20% ROI anual'
    },
    {
      name: 'Laura Rios',
      role: 'Doctora, Monterrey',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura',
      quote: 'Mi AFORE me proyectaba $4,500/mes. Con RiderMex ICM, voy camino a ingresos 5X superiores. El negocio real hace la diferencia.',
      result: '5X vs AFORE'
    },
    {
      name: 'Miguel Torres',
      role: 'Ingeniero, Guadalajara',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel',
      quote: 'Desde el mes 7 recibo mis primeras utilidades. Es increible ver como un negocio de motos genera tanto valor a largo plazo.',
      result: 'Ingresos desde mes 7'
    }
  ];

  const faqs = [
    {
      question: 'Es seguro invertir en RiderMex?',
      answer: 'Si. Tu inversion esta protegida por un triple esquema de fideicomisos (Activos, Operativo y Cobro) con Banco BX+. Cada ticket representa participacion directa en tiendas de motocicletas reales y operando.'
    },
    {
      question: 'Desde cuanto puedo invertir?',
      answer: `La inversion minima es de ${formatCurrency(ticketPrice, 'MXN')} (1 ticket). Cada ticket te da participacion en las utilidades de una tienda RiderMex que vende 480+ motocicletas al ano.`
    },
    {
      question: 'Que rendimientos son realistas?',
      answer: `El ROI estimado es de ${RIDERMEX_CONFIG.ESTIMATED_ROI}% anual basado en unit economics reales: ${RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR} motos/ano x $${RIDERMEX_CONFIG.PROFIT_PER_MOTORCYCLE} utilidad/moto = ${formatCurrency(RIDERMEX_CONFIG.ANNUAL_PROFIT_POOL, 'MXN')}/ano por tienda, repartido entre ${RIDERMEX_CONFIG.TICKETS_PER_STORE} tickets.`
    },
    {
      question: 'Que pasa si necesito mi dinero?',
      answer: 'Puedes vender tus tickets a otros socios (mercado secundario) o ajustar tu estrategia de reinversion para recibir utilidades en efectivo en lugar de reinvertir en mas tickets.'
    },
    {
      question: 'Como se que las tiendas son reales?',
      answer: 'Las tiendas RiderMex son negocios fisicos operando. Puedes visitarlas, ver reportes de ventas en tiempo real y recibir estados de cuenta trimestrales auditados. La transparencia total es uno de nuestros pilares.'
    },
    {
      question: 'Cual es la diferencia entre ICT e ICM?',
      answer: 'ICT (Interes Compuesto Tradicional) reinvierte solo dinero. ICM (Interes Compuesto Multiplicador) reinvierte tus utilidades en mas tickets que generan mas utilidades. Con RiderMex, cada ticket comprado con utilidades genera mas ventas de motos.'
    }
  ];

  const trustBadges = [
    { icon: Lock, text: 'Triple Fideicomiso' },
    { icon: FileCheck, text: 'Banco BX+' },
    { icon: Shield, text: 'Seguros de Cobertura' },
    { icon: Eye, text: 'Transparencia Total' },
    { icon: Store, text: 'Negocio Real Operando' },
    { icon: Bike, text: 'Activo Productivo' }
  ];

  return (
    <div className="min-h-screen bg-black">
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 bg-gray-950 shadow-lg z-50 border-b border-gray-800"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-2">
                  <Bike className="w-8 h-8 text-red-500" />
                  <span className="text-white font-bold text-lg">RiderMex</span>
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
                      const element = document.getElementById('calculators');
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
        <div className="absolute right-20 bg-gray-900 px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-700">
          <p className="text-sm font-medium text-white">Tienes dudas?</p>
          <p className="text-xs text-gray-400">Chatea con nosotros</p>
        </div>
      </a>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-950 to-black pt-20 pb-32">
        <div className="absolute top-20 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-red-600/5 rounded-full blur-3xl"></div>

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
                <div className="w-14 h-14 bg-red-600 rounded-xl flex items-center justify-center">
                  <Bike className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full border border-gray-700">
                  <Store className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-semibold text-gray-300">Negocio Real Operando</span>
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
                    const element = document.getElementById('calculators');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
                >
                  <Calculator className="w-5 h-5" />
                  Descubre tu camino
                </button>
                <button
                  onClick={() => {
                    const element = document.getElementById('video');
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
                  <p className="text-3xl font-bold text-red-500">20%+</p>
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
              <div className="bg-gray-900/80 rounded-3xl shadow-2xl p-8 border border-gray-800">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Proyeccion Real</h3>
                  <div className="px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-sm font-semibold border border-red-600/30">
                    1 Ticket
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 font-medium">Inversion inicial</span>
                      <Bike className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-3xl font-bold text-white">{formatCurrency(ticketPrice, 'MXN')}</p>
                    <p className="text-sm text-gray-500 mt-1">1 ticket - Escalon Pioneros Rider</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[4, 9, 14, 19].map((idx, i) => {
                      const colors = ['text-red-400', 'text-orange-400', 'text-yellow-400', 'text-green-400'];
                      const bgs = ['bg-red-500/10 border-red-500/20', 'bg-orange-500/10 border-orange-500/20', 'bg-yellow-500/10 border-yellow-500/20', 'bg-green-500/10 border-green-500/20'];
                      return (
                        <div key={idx} className={`${bgs[i]} border rounded-xl p-4`}>
                          <p className="text-sm text-gray-400 mb-1">Patrimonio Ano {idx + 1}</p>
                          <p className={`text-xl font-bold ${colors[i]}`}>
                            {heroICMData[idx] ? formatCurrency(heroICMData[idx].patrimony, 'MXN') : '-'}
                          </p>
                        </div>
                      );
                    })}
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 col-span-2">
                      <p className="text-sm text-gray-400 mb-1">Patrimonio Ano 25</p>
                      <p className="text-2xl font-bold text-white">
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
              Cada tienda RiderMex genera utilidades medibles, auditables y repartibles
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { value: `${RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR}`, label: 'Motos vendidas/ano', icon: Bike },
              { value: formatCurrency(RIDERMEX_CONFIG.PROFIT_PER_MOTORCYCLE, 'MXN'), label: 'Utilidad por moto', icon: DollarSign },
              { value: formatCurrency(RIDERMEX_CONFIG.ANNUAL_PROFIT_POOL, 'MXN'), label: 'Pool anual por tienda', icon: Target },
              { value: formatCurrency(RIDERMEX_CONFIG.ANNUAL_RETURN_PER_TICKET, 'MXN'), label: 'Retorno anual/ticket', icon: TrendingUp },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 text-center"
              >
                <stat.icon className="w-8 h-8 text-red-500 mx-auto mb-3" />
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 text-center"
          >
            <p className="text-lg text-gray-300">
              <span className="text-2xl font-bold text-white">{RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR} motos</span>
              <span className="text-gray-500 mx-3">x</span>
              <span className="text-2xl font-bold text-red-400">${RIDERMEX_CONFIG.PROFIT_PER_MOTORCYCLE}/moto</span>
              <span className="text-gray-500 mx-3">=</span>
              <span className="text-2xl font-bold text-green-400">{formatCurrency(RIDERMEX_CONFIG.ANNUAL_PROFIT_POOL, 'MXN')}/ano</span>
              <span className="text-gray-500 mx-3">/</span>
              <span className="text-2xl font-bold text-white">{RIDERMEX_CONFIG.TICKETS_PER_STORE} tickets</span>
              <span className="text-gray-500 mx-3">=</span>
              <span className="text-2xl font-bold text-yellow-400">{formatCurrency(RIDERMEX_CONFIG.ANNUAL_RETURN_PER_TICKET, 'MXN')}/ticket/ano</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Problema-Solucion */}
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
              { title: 'Bancos', rate: '1-3%', desc: 'Pierdes poder adquisitivo cada ano. La inflacion es ~4-5%', icon: TrendingDown, color: 'text-red-400' },
              { title: 'AFOREs', rate: '6-7%', desc: 'Pension promedio: $4,500/mes. Imposible vivir dignamente', icon: AlertTriangle, color: 'text-yellow-400' },
              { title: 'CETES', rate: '10-11%', desc: 'Apenas superas la inflacion. No construyes riqueza real', icon: AlertCircle, color: 'text-blue-400' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8"
              >
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <item.icon className={`w-8 h-8 ${item.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">{item.title}</h3>
                <p className={`text-3xl font-bold ${item.color} text-center mb-2`}>{item.rate}</p>
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
              No es un fondo de inversion. Es participacion directa en un negocio real y operando.
              El ICM reinvierte tus utilidades en mas tickets que generan mas utilidades.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <div>
                <p className="text-5xl font-bold">20%+</p>
                <p className="opacity-90">ROI anual estimado</p>
              </div>
              <div className="w-px bg-white opacity-30"></div>
              <div>
                <p className="text-5xl font-bold">100%</p>
                <p className="opacity-90">Negocio real</p>
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

      {/* Comparativa Interactiva */}
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
                  Tickets: {comparisonTickets} ({formatCurrency(comparisonAmount, 'MXN')})
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
                  <span>30 tickets</span>
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
                  <span>15 anos</span>
                  <span>25 anos</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-5 gap-4 mb-12">
              {[
                { label: 'Ahorro (5%)', value: comparisonResults.banco, income: ahorroData[ahorroData.length - 1]?.monthlyIncome || 0, color: 'text-red-400' },
                { label: 'AFORE (5%)', value: comparisonResults.afore, income: ahorroData[ahorroData.length - 1]?.monthlyIncome || 0, color: 'text-yellow-400' },
                { label: 'Bien Raiz (8%)', value: comparisonResults.bienRaiz, income: bienRaizData[bienRaizData.length - 1]?.monthlyIncome || 0, color: 'text-orange-400' },
                { label: 'CETES (10%)', value: comparisonResults.cetes, income: cetesData[cetesData.length - 1]?.monthlyIncome || 0, color: 'text-blue-400' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-400 mb-1">Patrimonio:</p>
                  <p className={`text-lg font-bold ${item.color} mb-2`}>{formatCurrency(item.value, 'MXN')}</p>
                  <p className="text-xs text-gray-500">Ingreso mensual:</p>
                  <p className={`text-sm font-semibold ${item.color}`}>{formatCurrency(item.income, 'MXN')}</p>
                </div>
              ))}
              <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
                <p className="text-xs text-red-200 mb-1">RiderMex ICM</p>
                <p className="text-sm font-semibold text-white mb-1">Patrimonio:</p>
                <p className="text-lg font-bold text-white mb-2">{formatCurrency(comparisonResults.icm, 'MXN')}</p>
                <p className="text-xs text-red-200">Ingreso mensual:</p>
                <p className="text-sm font-semibold text-white">{formatCurrency(icmData[icmData.length - 1]?.monthlyIncome || 0, 'MXN')}</p>
                <div className="absolute -top-1 -right-1">
                  <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                </div>
              </div>
            </div>

            <div className="h-80 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="year" stroke="#6b7280" label={{ value: 'Anos', position: 'insideBottom', offset: -5, fill: '#6b7280' }} />
                  <YAxis stroke="#6b7280" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
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

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
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
                      <p className="text-2xl font-bold text-red-400">{formatCurrency(comparisonResults.icm, 'MXN')}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-4">
                    Diferencia: <strong className="text-green-400">+{formatCurrency(comparisonResults.icm - comparisonResults.cetes, 'MXN')}</strong>
                    {' '}({(((comparisonResults.icm / comparisonResults.cetes) - 1) * 100).toFixed(0)}% mas)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculadoras */}
      <section id="calculators" className="py-20 bg-black">
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
              como el ICM te ayuda a lograr exactamente lo que buscas
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
                  <div className="w-16 h-16 bg-red-600/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform border border-red-600/30">
                    <card.icon className="w-8 h-8 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{card.title}</h3>
                    <p className="text-sm font-semibold text-red-400 mb-3">{card.subtitle}</p>
                    <p className="text-gray-400 mb-4">{card.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {card.benefits.map((benefit, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-medium border border-gray-700">
                          <CheckCircle className="w-3 h-3 text-red-400" />
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
            <p className="text-gray-400 mb-4">No estas seguro cual elegir?</p>
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
      <section id="video" className="py-20 bg-gradient-to-b from-gray-950 to-black">
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
              Descubre por que el Interes Compuesto Multiplicador aplicado a motocicletas es diferente
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center border border-gray-700"
          >
            <div className="text-center">
              <Play className="w-24 h-24 text-red-500 mx-auto mb-6 opacity-80" />
              <p className="text-white text-lg opacity-90">Video proximamente</p>
              <p className="text-gray-400 text-sm mt-2">Mientras tanto, agenda una videollamada personalizada</p>
              <a
                href="https://wa.me/529982024327?text=Quiero%20agendar%20una%20videollamada%20para%20entender%20RiderMex"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all mt-6"
              >
                <Calendar className="w-5 h-5" />
                Agendar llamada
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-20 bg-black">
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
              Socios que ya transformaron su futuro financiero con RiderMex
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
                className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800 hover:border-red-600/30 transition-all"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full bg-gray-800" />
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
                <div className="bg-red-600/10 rounded-xl p-4 border border-red-600/20">
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
            <p className="text-gray-400 mb-6">Quieres ser el siguiente caso de exito?</p>
            <button
              onClick={() => {
                const element = document.getElementById('calculators');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-600/30 inline-flex items-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              Calcula tu proyeccion ahora
            </button>
          </motion.div>
        </div>
      </section>

      {/* Por que RiderMex */}
      <section className="py-20 bg-gradient-to-b from-gray-950 to-black">
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
              No somos otro fondo de inversion. Es participacion directa en un negocio real
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Store, title: 'Negocio Real Operando', desc: 'Tu inversion es participacion directa en tiendas de motocicletas que venden 480+ unidades al ano. No es papel, son ventas reales.' },
              { icon: Shield, title: 'Triple Proteccion Legal', desc: 'Sistema de tres fideicomisos con Banco BX+ que garantiza tu participacion, separa patrimonios y protege tus derechos.' },
              { icon: Eye, title: 'Transparencia Total', desc: 'Visitas a tiendas, reportes de ventas en tiempo real, estados de cuenta trimestrales y auditorias externas.' },
              { icon: TrendingUp, title: 'Rendimientos Superiores', desc: `${RIDERMEX_CONFIG.ESTIMATED_ROI}% ROI anual estimado vs 4-6% de metodos tradicionales. La diferencia entre sobrevivir y prosperar.` },
              { icon: Wrench, title: 'Modelo Probado', desc: `Unit economics transparentes: ${RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR} motos x $${RIDERMEX_CONFIG.PROFIT_PER_MOTORCYCLE} utilidad = $${RIDERMEX_CONFIG.ANNUAL_PROFIT_POOL.toLocaleString()}/ano por tienda. Numeros auditables.` },
              { icon: Users, title: 'Aliados Financieros', desc: `Maxikash, Galgo y Atrato como aliados financieros. ${RIDERMEX_CONFIG.BANK} como banco fiduciario.` },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-red-600/50 transition-all"
              >
                <div className="w-16 h-16 bg-red-600/20 rounded-2xl flex items-center justify-center mb-6 border border-red-600/30">
                  <item.icon className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Pasos */}
      <section className="py-20 bg-black">
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
              3 pasos simples para ser socio de un negocio real
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: 1, title: 'Elige tu Estrategia', desc: 'Usa nuestra calculadora especifica para tu objetivo: educacion, retiro, suenos o crecimiento patrimonial.', items: ['Sin compromiso', 'Proyeccion personalizada', 'Asesoria incluida'], gradient: 'from-red-600 to-red-700', light: 'text-red-200' },
              { num: 2, title: 'Compra tus Tickets', desc: `Desde ${formatCurrency(ticketPrice, 'MXN')} (1 ticket). Cada ticket es participacion directa en una tienda RiderMex.`, items: ['Proceso simple', 'Triple fideicomiso', 'Respaldo legal total'], gradient: 'from-red-700 to-red-800', light: 'text-red-200' },
              { num: 3, title: 'Recibe Utilidades', desc: 'Utilidades trimestrales que se reinvierten en mas tickets o las retiras segun tu plan.', items: ['Pago trimestral', 'Reinversion automatica', 'Crecimiento exponencial'], gradient: 'from-red-800 to-red-900', light: 'text-red-200' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative"
              >
                <div className={`bg-gradient-to-br ${step.gradient} rounded-2xl p-8 h-full`}>
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-red-600 mb-6">
                    {step.num}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className={`${step.light} mb-6`}>{step.desc}</p>
                  <ul className="space-y-2">
                    {step.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <Check className={`w-5 h-5 ${step.light}`} />
                        <span className={step.light}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {i < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 w-8 h-8 bg-gray-800 rounded-full items-center justify-center border border-gray-700 z-10">
                    <ArrowRight className="w-5 h-5 text-red-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gradient-to-b from-gray-950 to-black">
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
                  <span className="text-left font-semibold text-white pr-4">{faq.question}</span>
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
                      <div className="px-6 pb-5 text-gray-400 leading-relaxed">{faq.answer}</div>
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
            <p className="text-gray-400 mb-4">Tienes mas preguntas?</p>
            <a
              href="https://wa.me/529982024327?text=Tengo%20preguntas%20sobre%20RiderMex"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Habla con un experto
            </a>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden">
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
              Cada dia que esperas es un dia menos de crecimiento exponencial.
              No es un fondo. Es un negocio real de motocicletas generando utilidades.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <button
                onClick={() => {
                  const element = document.getElementById('calculators');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-white text-red-700 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all shadow-lg flex items-center justify-center gap-2"
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
      <footer className="bg-gray-950 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bike className="w-10 h-10 text-red-500" />
                <span className="text-xl font-bold">RiderMex</span>
              </div>
              <p className="text-gray-400 text-sm">
                Interes Compuesto Multiplicador aplicado a Motocicletas. Construyendo patrimonio con el negocio mas rentable de Mexico.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Calculadoras</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => onNavigate('dream-landing')} className="hover:text-white transition-colors">Simulador de Suenos</button></li>
                <li><button onClick={() => onNavigate('segubeca-landing')} className="hover:text-white transition-colors">Educacion Garantizada</button></li>
                <li><button onClick={() => onNavigate('retirement-landing')} className="hover:text-white transition-colors">Pension Digna</button></li>
                <li><button onClick={() => onNavigate('vitaminada-landing')} className="hover:text-white transition-colors">Vitamina tu Ahorro</button></li>
                <li><button onClick={() => onNavigate('ridermex-reinvestment-landing')} className="hover:text-white transition-colors">ICM RiderMex Completo</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Informacion</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Como Funciona</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Casos de Exito</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Legal</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+529982024327" className="hover:text-white transition-colors">+52 998 202 4327</a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:contacto@ridermex.com" className="hover:text-white transition-colors">contacto@ridermex.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Mexico</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
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
                <X className="w-5 h-5 text-gray-400" />
              </button>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bike className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-3xl font-bold text-white mb-4">
                  Espera! No Te Vayas Sin Esto
                </h3>

                <p className="text-lg text-gray-300 mb-6">
                  Descarga GRATIS nuestra guia: <strong className="text-white">"5 Errores Que Destruyen Tu Retiro"</strong>
                </p>

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
                  <ul className="space-y-2 text-left">
                    {['Por que las AFOREs no son suficientes', 'El costo real de la inflacion', 'Alternativas que SI funcionan'].map((item, i) => (
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
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl mb-4 focus:border-red-500 focus:outline-none placeholder-gray-500"
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

                <p className="text-xs text-gray-500 mt-4">
                  No spam. Solo contenido valioso para tu libertad financiera.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomeLandingPage;
