import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Target, TrendingUp, Award, CheckCircle, ArrowRight, Star, ChevronDown,
  Calculator, DollarSign, AlertCircle, Sliders, Play, ArrowLeft, Home, Clock,
  BarChart3, Plus, Check, X, Eye, ChevronUp, PlayCircle, Send, Heart,
  GraduationCap, Briefcase, PiggyBank, Plane, Landmark, Zap, Building2,
  Bike, MessageCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { predefinedDreams } from '../data/dreamSimulatorData';
import { optimizeCertificatesForGoal } from '../utils/calculations/dreamSimulatorCalculations';
import { calculateProjections } from '../utils/calculations/dreamSimulatorCalculations';
import { RIDERMEX_CONFIG } from '../data/ridermexConfig';
import type { Investment } from '../types';

interface DreamSimulatorLandingPageProps {
  onGetStarted?: () => void;
  onBack?: () => void;
}

const DreamSimulatorLandingPage: React.FC<DreamSimulatorLandingPageProps> = ({ onGetStarted, onBack }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [selectedDream, setSelectedDream] = useState(predefinedDreams[0]);
  const [monthlyGoal, setMonthlyGoal] = useState(80000);
  const [timeframe, setTimeframe] = useState(20);

  const ticketPrice = RIDERMEX_CONFIG.TICKET_PRICE;
  const annualReturnPerTicket = RIDERMEX_CONFIG.ANNUAL_RETURN_PER_TICKET;

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const createInvestmentObject = (): Investment => {
    return {
      initialCertificates: 1,
      certificateBasePrice: ticketPrice,
      initialPayment: ticketPrice,
      years: timeframe,
      annualProfit: 0,
      increaseLemonPrice: true,
      lemonPriceIncrease: 5,
      reinvestProfits: true,
      additionalContributions: false,
      monthlyContribution: 0,
      currencyFormat: 'MXN',
      exchangeRate: 1,
      exchangeRateEUR: 1,
      inflationRate: 0,
      applyTaxes: false,
      taxRate: 0,
      partialCashOut: false,
      cashOutPercentage: 0,
      yearlyCashOutPercentages: Array(timeframe).fill(0),
      appreciationRate: RIDERMEX_CONFIG.ANNUAL_APPRECIATION,
      cetesRate: 0,
      savingsRate: 0,
      realEstateRate: 0,
      realEstateAppreciation: 0,
      realEstateRent: 0,
      ebitdaFactor: 0,
      averageProductionPerHectare: 0,
      averageSalePricePerKg: 0,
      isLongTermCalculator: false,
      firstYearUtilityToUser: false,
      commissionRate: 0,
      citrusReinvestment: false,
      citrusReinvestmentPercentages: [],
      enablePaymentBoost: false,
      paymentBoostGrowthRate: 0,
      investorFactor: 0.65,
      investorName: '',
      investorPhone: '',
      investorEmail: '',
      executiveName: '',
      executivePhone: '',
      executiveEmail: '',
      isHumanReadable: false
    };
  };

  const investment = createInvestmentObject();

  const requiredCertificates = optimizeCertificatesForGoal(
    {
      id: 'custom',
      monthlyGoal,
      timeframe,
      certificatesNeeded: 1,
      isCustom: false,
      reinvestProfits: true
    },
    investment
  );

  const totalInvestment = requiredCertificates * ticketPrice;
  const estimatedAnnualReturn = requiredCertificates * annualReturnPerTicket;
  const estimatedMonthlyReturn = estimatedAnnualReturn / 12;

  const projections = calculateProjections(
    {
      id: 'custom',
      monthlyGoal,
      timeframe,
      certificatesNeeded: requiredCertificates,
      isCustom: false,
      reinvestProfits: true
    },
    investment
  );

  const finalProjection = projections[projections.length - 1];

  const goalReachedYear = projections.findIndex(p => p.monthlyIncome >= monthlyGoal) + 1;
  const goalReached = goalReachedYear > 0;
  const goalProjection = goalReached ? projections[goalReachedYear - 1] : null;

  const categories = [
    { id: 'retirement', label: 'Retiro', icon: PiggyBank, color: 'from-red-500 to-red-700' },
    { id: 'education', label: 'Educacion', icon: GraduationCap, color: 'from-red-600 to-red-800' },
    { id: 'home', label: 'Casa', icon: Home, color: 'from-red-600 to-red-800' },
    { id: 'business', label: 'Negocio', icon: Briefcase, color: 'from-red-700 to-red-900' },
    { id: 'travel', label: 'Viajes', icon: Plane, color: 'from-red-500 to-red-700' }
  ];

  const faqs = [
    {
      question: 'Que es el Simulador de Suenos RiderMex?',
      answer: 'Es una herramienta que te ayuda a visualizar y planificar tus suenos mas importantes usando RiderMex Inversiones. Puedes ajustar tu meta mensual y plazo, y el sistema calcula automaticamente cuantos tickets necesitas.'
    },
    {
      question: 'Como se calculan los tickets necesarios?',
      answer: 'El sistema analiza tu meta de ingreso mensual y el plazo que deseas. Luego calcula cuantos tickets RiderMex iniciales necesitas considerando la reinversion de utilidades y la apreciacion anual de los activos.'
    },
    {
      question: 'Puedo ajustar los valores en tiempo real?',
      answer: 'Si, el simulador es completamente interactivo. Puedes mover los sliders o ajustar directamente los valores de meta mensual (desde $10,000 hasta $200,000 MXN) y plazo (de 5 a 30 anos), y veras el calculo actualizado instantaneamente.'
    },
    {
      question: 'Que incluye el plan de inversion?',
      answer: 'El plan incluye: inversion total calculada basada en el precio por ticket RiderMex, retorno anual estimado, e ingreso mensual estimado. Tambien te muestra las proyecciones completas de crecimiento de tickets, patrimonio e ingreso mensual.'
    },
    {
      question: 'Los suenos son personalizables?',
      answer: 'Si, aunque ofrecemos 6 suenos predefinidos (Retiro Digno, Retiro Anticipado, Educacion Universitaria, Casa de Ensueno, Negocio Propio y Vuelta al Mundo), puedes personalizar completamente los montos y plazos de cada uno.'
    },
    {
      question: 'Como funciona la reinversion con RiderMex?',
      answer: 'RiderMex reinvierte tus utilidades en nuevos tickets, cada nuevo ticket genera su propio ingreso a traves del negocio de motocicletas, creando un efecto multiplicador que hace crecer tu patrimonio de forma exponencial.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 bg-gray-950/95 backdrop-blur-md border-b border-gray-800 shadow-lg z-50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                  <Bike className="w-8 h-8 text-red-500" />
                  <span className="font-bold text-white text-lg">RiderMex</span>
                  <span className="text-gray-500 hidden sm:inline">|</span>
                  <span className="text-sm text-gray-400 hidden sm:inline">Simulador de Suenos</span>
                </div>
                <div className="flex items-center gap-4">
                  <a
                    href="https://wa.me/529982024327?text=Hola,%20quiero%20usar%20el%20Simulador%20de%20Suenos%20RiderMex"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">WhatsApp</span>
                  </a>
                  <button
                    onClick={onGetStarted}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Empezar ahora
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href="https://wa.me/529982024327?text=Hola,%20quiero%20informacion%20sobre%20el%20Simulador%20de%20Suenos%20RiderMex"
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

      {onBack && (
        <div className="bg-black border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Volver al Home</span>
            </button>
          </div>
        </div>
      )}

      <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-black via-gray-950 to-red-950 py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-800/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-900/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8"
            >
              <Sparkles className="w-5 h-5 text-red-500" />
              <span className="text-sm font-semibold text-gray-300">Simulador de Suenos RiderMex</span>
              <Award className="w-5 h-5 text-red-500" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl lg:text-7xl font-bold text-white mb-6"
            >
              Convierte tus <span className="text-red-500">Suenos</span> en{' '}
              <span className="text-red-500">Metas Financieras</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl lg:text-2xl text-gray-300 mb-10 max-w-4xl mx-auto"
            >
              Visualiza, planifica y alcanza tus objetivos de vida con el poder de{' '}
              <strong className="text-white">RiderMex Inversiones</strong>. Ajusta tu meta mensual y plazo, nosotros calculamos el resto.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative mb-12"
            >
              <div className="bg-gray-900/80 rounded-3xl shadow-2xl p-8 max-w-3xl mx-auto border border-gray-800">
                <div className="flex items-center justify-center gap-8 mb-6">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-2xl bg-gray-800 flex items-center justify-center mb-3 shadow-lg relative border border-gray-700">
                      <Calculator className="w-10 h-10 text-gray-500" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                        <X className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Calculadoras estaticas</p>
                  </div>

                  <div className="relative">
                    <ArrowRight className="w-12 h-12 text-red-500" />
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center mb-3 shadow-xl relative">
                      <Sparkles className="w-12 h-12 text-white" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <p className="text-sm font-bold text-red-500">Simulador RiderMex</p>
                  </div>
                </div>
                <p className="text-gray-400 text-center">
                  La unica herramienta que <strong className="text-red-500">ajusta en tiempo real</strong> tus suenos financieros con RiderMex
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                onClick={onGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-600/30 hover:shadow-xl flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-5 h-5" />
                Calcular mis suenos
              </motion.button>
              <motion.a
                href="#suenos"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-5 h-5" />
                Ver suenos disponibles
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="problema" className="py-20 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Todos tenemos suenos,{' '}
              <span className="text-red-500">pocos los convierten en metas reales</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Las calculadoras tradicionales te dan numeros sin contexto. El Simulador RiderMex te muestra{' '}
              <strong className="text-white">exactamente que necesitas para vivir la vida que deseas</strong>.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: AlertCircle,
                title: 'Sin Contexto',
                description: 'Las calculadoras te dicen cuanto tendras en X anos, pero no que significa eso para tu vida'
              },
              {
                icon: Clock,
                title: 'Poco Flexibles',
                description: 'Datos estaticos que no te permiten explorar diferentes escenarios en tiempo real'
              },
              {
                icon: Target,
                title: 'Sin Vision',
                description: 'No conectan tus numeros con tus verdaderos objetivos de vida y suenos'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800"
              >
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                  <item.icon className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-red-950/30 border border-red-800/30 rounded-xl">
              <Zap className="w-8 h-8 text-red-500" />
              <div className="text-left">
                <p className="font-bold text-white">El Simulador RiderMex cambia todo esto</p>
                <p className="text-sm text-gray-400">Conecta tus numeros con tus suenos reales</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="suenos" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              6 Suenos, <span className="text-red-500">Infinitas Posibilidades</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Elige el sueno que quieres alcanzar y personalizalo completamente con nuestros controles interactivos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {predefinedDreams.map((dream, index) => {
              const Icon = dream.icon;
              const difficultyColors = {
                easy: 'from-red-500 to-red-700',
                medium: 'from-red-600 to-red-800',
                hard: 'from-red-700 to-red-900'
              };
              const difficultyLabels = {
                easy: 'Facil',
                medium: 'Medio',
                hard: 'Ambicioso'
              };

              return (
                <motion.div
                  key={dream.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-900/50 rounded-2xl border border-gray-800 hover:border-red-800/50 transition-all p-6 cursor-pointer"
                  whileHover={{ y: -5 }}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${difficultyColors[dream.difficulty]} flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{dream.name}</h3>
                  <p className="text-gray-400 mb-4">{dream.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Meta mensual:</span>
                      <span className="font-bold text-red-500">{formatCurrency(dream.monthlyGoal, 'MXN')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Plazo:</span>
                      <span className="font-bold text-red-400">{dream.timeframe} anos</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Tickets:</span>
                      <span className="font-bold text-red-400">{dream.certificatesNeeded}</span>
                    </div>
                  </div>

                  <div className={`inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r ${difficultyColors[dream.difficulty]} rounded-full`}>
                    <Star className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">{difficultyLabels[dream.difficulty]}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12"
          >
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-600/20 hover:shadow-xl inline-flex items-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              Personalizar mi sueno
            </button>
          </motion.div>
        </div>
      </section>

      <section id="simulador" className="py-20 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ajusta y <span className="text-red-500">Visualiza</span> en Tiempo Real
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Mueve los controles y ve como cambia tu plan de inversion instantaneamente
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-900/80 rounded-3xl shadow-2xl p-8 border border-gray-800"
          >
            <div className="bg-red-950/30 border border-red-800/30 rounded-xl p-4 mb-8">
              <p className="text-sm text-gray-300">
                <strong className="text-red-400">Demo Interactiva:</strong> Ajusta los valores manualmente o usa los sliders para ver como cambian los tickets necesarios en tiempo real
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-red-500" />
                  </div>
                  <h4 className="font-bold text-white text-lg">Meta Mensual</h4>
                </div>

                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-bold text-gray-500">$</span>
                    <input
                      type="number"
                      value={monthlyGoal}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setMonthlyGoal(Math.max(0, value));
                      }}
                      className="text-4xl font-bold text-red-500 bg-transparent border-b-2 border-gray-600 focus:border-red-500 outline-none text-center w-48 transition-colors"
                      min="0"
                      step="1000"
                    />
                    <span className="text-xl font-medium text-gray-500">MXN</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">ingreso pasivo mensual</p>
                </div>

                <input
                  type="range"
                  min="10000"
                  max="200000"
                  step="5000"
                  value={Math.min(monthlyGoal, 200000)}
                  onChange={(e) => setMonthlyGoal(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>$10k</span>
                  <span>$200k (usar input para valores mayores)</span>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-red-500" />
                  </div>
                  <h4 className="font-bold text-white text-lg">Plazo</h4>
                </div>

                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2">
                    <input
                      type="number"
                      value={timeframe}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        setTimeframe(Math.max(1, value));
                      }}
                      className="text-4xl font-bold text-red-500 bg-transparent border-b-2 border-gray-600 focus:border-red-500 outline-none text-center w-24 transition-colors"
                      min="1"
                      step="1"
                    />
                    <span className="text-xl font-medium text-gray-500">anos</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">plazo de inversion</p>
                </div>

                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={Math.min(timeframe, 30)}
                  onChange={(e) => setTimeframe(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>5 anos</span>
                  <span>30 anos (usar input para valores mayores)</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-xl text-white mb-2">
                  <Target className="w-6 h-6" />
                  <span className="text-3xl font-bold">{requiredCertificates}</span>
                </div>
                <p className="text-sm text-gray-400">tickets RiderMex calculados automaticamente</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                  <p className="text-sm text-gray-400 mb-1">Inversion Total</p>
                  <p className="text-xl font-bold text-white">{formatCurrency(totalInvestment, 'MXN')}</p>
                </div>
                <div className="bg-red-950/30 rounded-xl p-4 border border-red-800/30">
                  <p className="text-sm text-red-400 mb-1">Retorno Anual Estimado</p>
                  <p className="text-xl font-bold text-red-500">{formatCurrency(estimatedAnnualReturn, 'MXN')}</p>
                </div>
                <div className="bg-red-950/30 rounded-xl p-4 border border-red-800/30">
                  <p className="text-sm text-red-400 mb-1">Ingreso Mensual Estimado</p>
                  <p className="text-xl font-bold text-red-500">{formatCurrency(estimatedMonthlyReturn, 'MXN')}</p>
                </div>
              </div>

              {goalReached && (
                <div className="mt-6 p-6 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl text-white shadow-lg">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Target className="w-8 h-8" />
                    <h3 className="text-2xl font-bold">Meta Alcanzada!</h3>
                  </div>
                  <div className="text-center">
                    <p className="text-lg mb-2">
                      Llegaras a tu meta de <strong>{formatCurrency(monthlyGoal, 'MXN')}</strong> mensuales
                    </p>
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl">
                      <Clock className="w-6 h-6" />
                      <span className="text-3xl font-bold">Ano {goalReachedYear}</span>
                    </div>
                    <p className="text-sm mt-3 opacity-90">
                      Con {goalProjection?.totalCertificates || 0} tickets generando {formatCurrency(goalProjection?.monthlyIncome || 0, 'MXN')} mensuales
                    </p>
                  </div>
                </div>
              )}

              {!goalReached && (
                <div className="mt-6 p-6 bg-gray-900/50 border border-gray-700 rounded-2xl">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                    <h3 className="text-xl font-bold text-white">Ajusta tu estrategia</h3>
                  </div>
                  <p className="text-center text-gray-300">
                    Con esta configuracion alcanzaras <strong className="text-white">{formatCurrency(finalProjection?.monthlyIncome || 0, 'MXN')}</strong> mensuales en {timeframe} anos.
                    <br />
                    <span className="text-sm text-gray-400">Necesitas {requiredCertificates > 0 ? 'mas tickets o mas tiempo' : 'ajustar los valores'} para llegar a tu meta de {formatCurrency(monthlyGoal, 'MXN')}</span>
                  </p>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-gray-700">
                <h4 className="font-bold text-white mb-4 text-center">Proyeccion al ano {timeframe}</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Tickets</p>
                    <p className="text-2xl font-bold text-red-500">{finalProjection?.totalCertificates || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Ingreso Mensual</p>
                    <p className="text-2xl font-bold text-red-500">{formatCurrency(finalProjection?.monthlyIncome || 0, 'MXN')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Patrimonio</p>
                    <p className="text-2xl font-bold text-red-400">{formatCurrency(finalProjection?.patrimony || 0, 'MXN')}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-600/20 hover:shadow-xl inline-flex items-center gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              Ver proyeccion completa
            </button>
          </motion.div>
        </div>
      </section>

      <section id="como-funciona" className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Tres Pasos hacia <span className="text-red-500">tus Suenos</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Simple, interactivo y personalizado para ti
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                icon: Target,
                title: 'Elige tu Sueno',
                description: 'Selecciona entre 6 suenos predefinidos o personaliza tu meta de ingreso mensual',
                color: 'from-red-600 to-red-800'
              },
              {
                step: 2,
                icon: Sliders,
                title: 'Ajusta los Valores',
                description: 'Mueve los controles de meta mensual y plazo para encontrar tu escenario ideal',
                color: 'from-red-700 to-red-900'
              },
              {
                step: 3,
                icon: BarChart3,
                title: 'Ve tu Proyeccion',
                description: 'Visualiza graficas completas de crecimiento, patrimonio y tickets en el tiempo',
                color: 'from-red-600 to-red-700'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="relative bg-gray-900/50 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all p-8"
              >
                <div className="absolute -top-4 left-8">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                    {item.step}
                  </div>
                </div>

                <div className="mt-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="beneficios" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Por que el <span className="text-red-500">Simulador RiderMex</span> es diferente
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: 'Interactiva',
                description: 'Ajustes en tiempo real sin recargar'
              },
              {
                icon: Target,
                title: 'Orientada a Suenos',
                description: 'Conecta numeros con objetivos de vida'
              },
              {
                icon: BarChart3,
                title: 'Proyecciones Completas',
                description: 'Graficas detalladas de tu futuro'
              },
              {
                icon: Award,
                title: 'Calculo Automatico',
                description: 'El sistema optimiza los tickets'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-gray-900/50 rounded-xl p-6 text-center border border-gray-800"
              >
                <benefit.icon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
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
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-gray-900/80 rounded-xl border border-gray-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                >
                  <span className="font-semibold text-white pr-4">{faq.question}</span>
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
              href="https://wa.me/529982024327?text=Tengo%20preguntas%20sobre%20el%20Simulador%20de%20Suenos%20RiderMex"
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

      <section id="cta-final" className="py-20 bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Empieza a planificar tus suenos con RiderMex
            </h2>
            <p className="text-xl mb-10 opacity-90">
              El unico simulador que conecta tus numeros con tus suenos reales
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                onClick={onGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-white text-red-700 rounded-xl font-bold text-xl hover:bg-gray-100 transition-all shadow-xl inline-flex items-center justify-center gap-3"
              >
                <PlayCircle className="w-6 h-6" />
                Calcular mis suenos ahora
                <ArrowRight className="w-6 h-6" />
              </motion.button>
              <a
                href="https://wa.me/529982024327?text=Quiero%20informacion%20sobre%20el%20Simulador%20de%20Suenos%20RiderMex"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-red-700 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Hablar por WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-black text-white py-12 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Bike className="w-8 h-8 text-red-500" />
            <span className="font-bold text-xl">RiderMex</span>
          </div>
          <div className="text-center text-gray-600 text-sm">
            <p>&copy; {new Date().getFullYear()} RiderMex. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DreamSimulatorLandingPage;
