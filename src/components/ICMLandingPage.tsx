import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Zap, Award, CheckCircle, ArrowRight, Phone, Star, ChevronDown,
  Calculator, Leaf, Shield, Target, DollarSign, AlertCircle, Sliders,
  Play, RefreshCw, TreeDeciduous, Sprout, Trees, Users, Building2, FileText,
  ArrowLeft, Home, Clock, Repeat, BarChart3, LineChart, Plus, Check, X,
  Eye, Lock, ChevronUp, PlayCircle, Send, Mail, Bike, Store
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart as RechartsLineChart, Line } from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { getDetailedCertificateEvolution } from '../utils/calculations/certificateEvolution';
import { ESCALONES, RIDERMEX_CONFIG } from '../data/ridermexConfig';
import type { Investment } from '../types';

interface ICMLandingPageProps {
  onGetStarted?: () => void;
  onBack?: () => void;
}

const ICMLandingPage: React.FC<ICMLandingPageProps> = ({ onGetStarted, onBack }) => {
  const [selectedSegment, setSelectedSegment] = useState<'grow' | 'multiply' | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isSimulatorVisible, setIsSimulatorVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const ticketPrice = RIDERMEX_CONFIG.TICKET_PRICE;

  const [initialInvestment, setInitialInvestment] = useState(ticketPrice);
  const [years, setYears] = useState(25);
  const [reinvestmentRate, setReinvestmentRate] = useState(100);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    amount: '',
    horizon: '',
    reinvestmentPercent: '',
    acceptTerms: false
  });

  const initialTickets = Math.max(1, Math.floor(initialInvestment / ticketPrice));

  const createInvestmentObject = (withReinvestment: boolean): Investment => {
    return {
      initialCertificates: initialTickets,
      certificateBasePrice: ticketPrice,
      initialPayment: initialTickets * ticketPrice,
      years,
      annualProfit: 0,
      increaseLemonPrice: false,
      lemonPriceIncrease: 0,
      enableMarketGrowth: true,
      marketGrowthRate: 5,
      usePresentValue: false,
      reinvestProfits: withReinvestment,
      additionalContributions: false,
      monthlyContribution: 0,
      currencyFormat: 'MXN',
      exchangeRate: 1,
      exchangeRateEUR: 1,
      inflationRate: RIDERMEX_CONFIG.INFLATION_RATE,
      applyTaxes: false,
      taxRate: 0,
      partialCashOut: !withReinvestment,
      cashOutPercentage: withReinvestment ? (100 - reinvestmentRate) : 100,
      yearlyCashOutPercentages: Array(years).fill(
        withReinvestment ? (100 - reinvestmentRate) : 100
      ),
      appreciationRate: RIDERMEX_CONFIG.ANNUAL_APPRECIATION,
      cetesRate: 0,
      savingsRate: 0,
      realEstateRate: 0,
      realEstateAppreciation: 0,
      realEstateRent: 0,
      ebitdaFactor: 0,
      averageProductionPerHectare: 35000,
      averageSalePricePerKg: 38,
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
      downPaymentPercentage: 0,
      enableCustomPayments: false,
      customPaymentSchedule: [],
      financingInterestRate: 0,
      enableCustomDownPaymentSchedule: false,
      customDownPaymentSchedule: [],
      downPaymentInstallments: 0,
      customInvestmentRate: 0,
      customInvestmentName: '',
      ridermexProductType: 'B',
      ridermexFirstMonthlyIncome: 7,
      ridermexScenario: 'moderate'
    };
  };

  const investmentICT = createInvestmentObject(false);
  const ictEvolution = getDetailedCertificateEvolution(investmentICT);
  const ictFinalData = ictEvolution[years - 1] || ictEvolution[ictEvolution.length - 1];

  const investmentICM = createInvestmentObject(true);
  const icmEvolution = getDetailedCertificateEvolution(investmentICM);
  const icmFinalData = icmEvolution[years - 1] || icmEvolution[icmEvolution.length - 1];

  const ictResult = {
    finalValue: ictFinalData?.citrusPatrimony || 0,
    growthRate: ictFinalData ? ((ictFinalData.citrusPatrimony / (initialTickets * ticketPrice) - 1) * 100) : 0
  };

  const icmResult = {
    totalPatrimony: icmFinalData?.citrusPatrimony || 0,
    certificates: icmFinalData?.totalCertificates || initialTickets,
    monthlyIncome: icmFinalData ? icmFinalData.citrusIncome / 12 : 0,
    multiplier: icmFinalData && ictFinalData ? (icmFinalData.citrusPatrimony / ictFinalData.citrusPatrimony) : 1
  };

  const generateChartData = () => {
    return Array.from({ length: years + 1 }, (_, i) => {
      if (i === 0) {
        return { year: 0, ICT: 0, ICM: 0 };
      }
      const ictYearData = ictEvolution[i - 1];
      const icmYearData = icmEvolution[i - 1];
      return {
        year: i,
        ICT: ictYearData ? Math.min(ictYearData.citrusPatrimony, ictYearData.citrusPatrimony * (animationProgress / 100)) : 0,
        ICM: icmYearData ? Math.min(icmYearData.citrusPatrimony, icmYearData.citrusPatrimony * (animationProgress / 100)) : 0
      };
    });
  };

  useEffect(() => {
    if (isAnimating && animationProgress < 100) {
      const timer = setTimeout(() => {
        setAnimationProgress(prev => Math.min(prev + 2, 100));
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, animationProgress]);

  const handleSimulate = () => {
    setIsAnimating(true);
    setAnimationProgress(0);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hola! Me interesa multiplicar mi inversion con RiderMex ICM.\n\nDatos:\n- Nombre: ${formData.name}\n- Monto: $${formData.amount}\n- Horizonte: ${formData.horizon} anos\n- Reinversion: ${formData.reinvestmentPercent}%`;
    window.open(`https://wa.me/529982024327?text=${encodeURIComponent(message)}`, '_blank');
  };

  const multiplierFactor = (icmResult.totalPatrimony / ictResult.finalValue).toFixed(1);

  const faqItems = [
    {
      question: 'Que es un ticket RiderMex?',
      answer: `Un ticket RiderMex es una participacion en una tienda de motocicletas. Cada ticket cuesta $${ESCALONES[0].entryPrice.toLocaleString()} MXN (Escalon ${ESCALONES[0].name}) y te da derecho a recibir rendimientos trimestrales derivados de la venta de motocicletas en tu tienda asignada.`
    },
    {
      question: 'Como se protege mi inversion?',
      answer: 'Tu inversion esta protegida por un triple fideicomiso con Banco BX+ (Ve por Mas): Fideicomiso de Activos y Contratos, Fideicomiso Operativo y Fideicomiso de Cobro y Reparto. Ademas cuentas con seguro de cobertura amplia sobre inventario completo.'
    },
    {
      question: 'Cuando recibo mis primeros rendimientos?',
      answer: 'Con el Producto B (contado), recibes tu primer rendimiento trimestral a partir del mes 7. Esto incluye el periodo de construccion y aclientado de la tienda.'
    },
    {
      question: 'Que es el Interes Compuesto Multiplicador (ICM)?',
      answer: 'El ICM es una estrategia donde reinviertes automaticamente tus rendimientos en nuevos tickets, generando mas tiendas, mas ventas de motocicletas y mas flujo. Es el efecto exponencial aplicado al negocio de motocicletas.'
    },
    {
      question: 'Cuantas motos vende una tienda al ano?',
      answer: `En el escenario moderado, cada tienda vende aproximadamente ${RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR} motocicletas al ano, generando una utilidad de $${RIDERMEX_CONFIG.PROFIT_PER_MOTORCYCLE} MXN por moto, lo que representa un pool anual de $${RIDERMEX_CONFIG.ANNUAL_PROFIT_POOL.toLocaleString()} MXN por tienda de ${RIDERMEX_CONFIG.TICKETS_PER_STORE} tickets.`
    },
    {
      question: 'Puedo retirar mis rendimientos en vez de reinvertir?',
      answer: 'Si. Puedes elegir que porcentaje de tus rendimientos reinvertir y que porcentaje retirar. El simulador te muestra la diferencia entre reinvertir al 100% (ICM) y retirar al 100% (ICT).'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-gray-800 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Bike className="w-8 h-8 text-red-500" />
              <span className="text-xl font-bold text-white">RiderMex</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#simulador" className="text-sm text-gray-400 hover:text-red-500 transition-colors">
                Simulador
              </a>
              <a href="#comparativa" className="text-sm text-gray-400 hover:text-red-500 transition-colors">
                Comparativa
              </a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full text-sm font-medium hover:from-red-700 hover:to-red-800 transition-colors"
              >
                Comenzar
              </motion.button>
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-900 rounded-lg transition-colors"
                  title="Volver al Home"
                >
                  <Home className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300 font-medium">Inicio</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-black via-gray-950 to-gray-900 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-900/30 border border-red-800/50 rounded-full mb-6">
                <Star className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-red-400">Negocio real de motocicletas en Mexico</span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                El Interes Compuesto es poderoso.{' '}
                <span className="text-red-500">Pero el Multiplicador cambia las reglas.</span>
              </h1>

              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Descubre como un modelo de tiendas de motocicletas con tecnologia financiera convierte el poder del ICT
                en una herramienta de crecimiento exponencial real.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <motion.a
                  href="#icm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Descubre como funciona el ICM
                  <ArrowRight className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href="#simulador"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gray-900 text-red-500 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all border-2 border-red-600 flex items-center justify-center gap-2"
                >
                  <Calculator className="w-5 h-5" />
                  Simular mi crecimiento
                </motion.a>
              </div>

              <div className="text-sm text-gray-500">
                Tiendas de motocicletas respaldadas por triple fideicomiso con Banco BX+
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Inversion Inicial (1 Ticket)</div>
                      <div className="text-2xl font-bold text-white">{formatCurrency(ticketPrice, 'MXN')}</div>
                    </div>
                    <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-red-500" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                      <div>
                        <div className="text-xs text-gray-400 font-medium mb-1">ICT a 25 anos</div>
                        <div className="text-lg font-bold text-gray-300">{formatCurrency(ictResult.finalValue)}</div>
                      </div>
                      <BarChart3 className="w-6 h-6 text-gray-500" />
                    </div>

                    <div className="flex items-center justify-center py-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-gray-600"
                      >
                        <ChevronDown className="w-6 h-6" />
                      </motion.div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-red-900/20 rounded-xl border-2 border-red-800/50">
                      <div>
                        <div className="text-xs text-red-400 font-medium mb-1">ICM a 25 anos</div>
                        <div className="text-xl font-bold text-red-500">{formatCurrency(icmResult.totalPatrimony)}</div>
                      </div>
                      <Zap className="w-6 h-6 text-red-500" />
                    </div>

                    <div className="pt-4 border-t border-gray-800">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Factor Multiplicador</span>
                        <span className="text-2xl font-bold text-red-500">{multiplierFactor}x</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                  className="absolute -top-6 -right-6 w-24 h-24 bg-red-900/30 rounded-full flex items-center justify-center shadow-xl border border-red-800/50"
                >
                  <Bike className="w-12 h-12 text-red-500" />
                </motion.div>

                <motion.div
                  animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center shadow-lg border border-gray-700"
                >
                  <TrendingUp className="w-10 h-10 text-red-500" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="segmentos" className="py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Que quieres lograr con tu inversion?
            </h2>
            <p className="text-xl text-gray-400">
              Elige tu objetivo y descubre como alcanzarlo
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.03 }}
              onClick={() => setSelectedSegment(selectedSegment === 'grow' ? null : 'grow')}
              className={`p-8 rounded-2xl cursor-pointer transition-all ${
                selectedSegment === 'grow'
                  ? 'bg-gradient-to-br from-gray-700 to-gray-800 text-white shadow-2xl border border-gray-600'
                  : 'bg-gray-900/50 hover:bg-gray-900 text-white border border-gray-800'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                  selectedSegment === 'grow' ? 'bg-white/10' : 'bg-gray-800'
                }`}>
                  <Store className={`w-8 h-8 ${selectedSegment === 'grow' ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <h3 className="text-2xl font-bold">Crecer mi dinero a largo plazo</h3>
              </div>
              <p className={`mb-2 ${selectedSegment === 'grow' ? 'text-gray-300' : 'text-gray-500'}`}>
                Interes Compuesto Tradicional (ICT)
              </p>
              {!selectedSegment && (
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                  <ChevronDown className="w-4 h-4" />
                  <span>Click para mas info</span>
                </div>
              )}

              <AnimatePresence>
                {selectedSegment === 'grow' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-white/20"
                  >
                    <div className="space-y-3 text-white">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>Crecimiento constante y predecible</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>Reinversion manual de ganancias</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>Requiere tiempo y disciplina</span>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-white/10 rounded-xl">
                      <div className="text-sm mb-1">Ejemplo: {formatCurrency(ticketPrice, 'MXN')} a 25 anos</div>
                      <div className="text-3xl font-bold">{formatCurrency(ictResult.finalValue)}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              onClick={() => setSelectedSegment(selectedSegment === 'multiply' ? null : 'multiply')}
              className={`p-8 rounded-2xl cursor-pointer transition-all ${
                selectedSegment === 'multiply'
                  ? 'bg-gradient-to-br from-red-700 to-red-900 text-white shadow-2xl border border-red-600'
                  : 'bg-gray-900/50 hover:bg-gray-900 text-white border border-gray-800'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                  selectedSegment === 'multiply' ? 'bg-white/20' : 'bg-gray-800'
                }`}>
                  <Bike className={`w-8 h-8 ${selectedSegment === 'multiply' ? 'text-white' : 'text-red-500'}`} />
                </div>
                <h3 className="text-2xl font-bold">Multiplicarlo de forma acelerada</h3>
              </div>
              <p className={`mb-2 ${selectedSegment === 'multiply' ? 'text-red-200' : 'text-gray-500'}`}>
                Interes Compuesto Multiplicador (ICM)
              </p>
              {!selectedSegment && (
                <div className="flex items-center gap-2 text-sm text-red-500 font-medium">
                  <ChevronDown className="w-4 h-4" />
                  <span>Click para mas info</span>
                </div>
              )}

              <AnimatePresence>
                {selectedSegment === 'multiply' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-white/20"
                  >
                    <div className="space-y-3 text-white">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>Reinversion automatica y optimizada</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>Expansion continua (mas tickets = mas tiendas = mas flujo)</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>Crecimiento exponencial desde el inicio</span>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-white/10 rounded-xl">
                      <div className="text-sm mb-1">Mismo ejemplo: {formatCurrency(ticketPrice, 'MXN')} a 25 anos</div>
                      <div className="text-3xl font-bold">{formatCurrency(icmResult.totalPatrimony)}</div>
                      <div className="text-sm mt-2 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        <span>{multiplierFactor}x mas que ICT</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="introduccion" className="py-20 bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center"
            >
              <Clock className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              El Interes Compuesto: el motor mas poderoso del crecimiento financiero
            </h2>

            <div className="bg-gray-900 rounded-2xl p-8 lg:p-12 shadow-xl border border-gray-800 mb-8">
              <blockquote className="text-xl lg:text-2xl text-gray-300 leading-relaxed space-y-4">
                <p className="italic">
                  Albert Einstein lo llamo <span className="font-bold text-red-500">"la octava maravilla del mundo"</span>.
                </p>
                <p>
                  Porque el dinero que genera dinero, a su vez genera mas dinero.
                </p>
                <p className="text-red-500 font-semibold">
                  Pero el problema es que la mayoria nunca ve su verdadero potencial.
                </p>
                <p className="font-medium">
                  Por que? Porque <span className="text-red-500">detienen el ciclo</span>: retiran, pagan impuestos o reinvierten tarde.
                </p>
              </blockquote>
            </div>

            <motion.a
              href="#icm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
            >
              Ver como el ICM elimina ese freno
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      <section id="ict" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full mb-6 border border-gray-700">
                <Store className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-300">Interes Compuesto Tradicional</span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                El Interes Compuesto Tradicional (ICT): una joya que pocos aprovechan
              </h2>

              <div className="prose prose-lg text-gray-400 mb-8">
                <p>
                  Cuando reinviertes tus ganancias, creas un <strong className="text-white">ciclo virtuoso</strong>.
                  A lo largo del tiempo, las ganancias producen mas ganancias.
                </p>
                <p>
                  Pero su poder depende de tres cosas:
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  { icon: Clock, label: 'Tiempo', desc: 'Decadas de disciplina financiera' },
                  { icon: Target, label: 'Disciplina', desc: 'No tocar el capital acumulado' },
                  { icon: Repeat, label: 'Constancia', desc: 'Reinvertir cada rendimiento manualmente' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-gray-900/50 rounded-xl border border-gray-800"
                  >
                    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white mb-1">{item.label}</div>
                      <div className="text-sm text-gray-500">{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.a
                href="#simulador"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all border border-gray-700"
              >
                <Calculator className="w-5 h-5" />
                Simular mi crecimiento tradicional
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-900 rounded-2xl p-8 text-white shadow-2xl border border-gray-800"
            >
              <div className="text-center mb-8">
                <div className="text-sm font-medium text-gray-400 mb-2">Ejemplo Real ICT</div>
                <div className="text-5xl font-bold mb-2">{formatCurrency(ticketPrice, 'MXN')}</div>
                <div className="text-gray-500">Inversion inicial - 1 ticket RiderMex</div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 mb-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Anos de inversion:</span>
                  <span className="text-2xl font-bold">25 anos</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Reinversion:</span>
                  <span className="text-2xl font-bold">100% (por defecto)</span>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
                <div className="text-sm text-red-500 font-medium mb-2">Valor Estimado</div>
                <div className="text-4xl font-bold text-white mb-2">
                  {formatCurrency(ictResult.finalValue)}
                </div>
                <div className="text-sm text-gray-500">
                  {((ictResult.finalValue / initialInvestment - 1) * 100).toFixed(0)}% de crecimiento total
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-gray-500">
                Poderoso, pero hay una manera de multiplicar este resultado
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="icm" className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-900/30 border border-red-800/50 rounded-full mb-6">
              <Zap className="w-5 h-5 text-red-500" />
              <span className="font-semibold text-red-400">El Salto Cuantico</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              El Interes Compuesto Multiplicador (ICM)
            </h2>
            <p className="text-2xl text-gray-400 mb-8 max-w-4xl mx-auto">
              Donde cada tienda genera rendimientos que abren nuevas tiendas
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto mb-16">
            <div className="bg-gray-900 rounded-2xl p-8 lg:p-12 shadow-2xl border border-gray-800">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                  <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">ICT</h3>
                  <p className="text-gray-500">Te permite crecer</p>
                </div>
                <div className="text-center p-6 bg-red-900/20 rounded-xl border-2 border-red-800/50">
                  <Bike className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-red-500 mb-2">ICM</h3>
                  <p className="text-red-400 font-semibold">Te permite multiplicar</p>
                </div>
              </div>

              <div className="prose prose-lg max-w-none text-gray-400">
                <p className="text-xl leading-relaxed">
                  Cada rendimiento que obtienes puede convertirse en una nueva inversion
                  <strong className="text-red-500"> mas tickets, mas tiendas, mas flujo</strong>
                  sin detener el ciclo.
                </p>
                <p className="text-xl leading-relaxed">
                  Asi, mientras el ICT se apoya solo en el tiempo,
                  el ICM agrega un nuevo factor: <strong className="text-red-500 text-2xl">la expansion.</strong>
                </p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gray-900 rounded-2xl p-12 shadow-xl border border-gray-800"
          >
            <h3 className="text-2xl font-bold text-center text-white mb-8">
              Visualiza la Expansion ICM
            </h3>
            <div className="flex items-center justify-around flex-wrap gap-8">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <Store className="w-16 h-16 text-red-400 mx-auto mb-2" />
                <div className="text-sm text-gray-500">Ano 1</div>
                <div className="font-semibold text-white">{icmEvolution[0]?.totalCertificates || initialTickets} {icmEvolution[0]?.totalCertificates === 1 ? 'Ticket' : 'Tickets'}</div>
              </motion.div>

              <ArrowRight className="w-8 h-8 text-gray-600" />

              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="flex gap-2 justify-center mb-2">
                  {[...Array(Math.min(3, Math.ceil((icmEvolution[9]?.totalCertificates || initialTickets) / 3)))].map((_, i) => (
                    <Store key={i} className="w-12 h-12 text-red-500" />
                  ))}
                </div>
                <div className="text-sm text-gray-500">Ano 10</div>
                <div className="font-semibold text-white">{Math.round(icmEvolution[9]?.totalCertificates || initialTickets)} Tickets</div>
              </motion.div>

              <ArrowRight className="w-8 h-8 text-gray-600" />

              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <div className="flex gap-1 justify-center mb-2 flex-wrap max-w-[120px]">
                  {[...Array(Math.min(9, Math.ceil((icmEvolution[24]?.totalCertificates || initialTickets) / 5)))].map((_, i) => (
                    <Bike key={i} className="w-8 h-8 text-red-500" />
                  ))}
                </div>
                <div className="text-sm text-gray-500">Ano 25</div>
                <div className="font-semibold text-red-500">{Math.round(icmEvolution[24]?.totalCertificates || initialTickets)} Tickets</div>
              </motion.div>
            </div>

            <div className="mt-12 text-center">
              <motion.a
                href="#simulador"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
              >
                Comparar ICT vs ICM en mi ejemplo
                <Calculator className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="comparativa" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              El mismo dinero. Dos destinos diferentes.
            </h2>
            <p className="text-xl text-gray-400">
              Compara lado a lado y decide que modelo se ajusta a tus objetivos
            </p>
          </motion.div>

          <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Concepto
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400 bg-gray-800/80">
                      Interes Compuesto Tradicional (ICT)
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-red-400 bg-red-900/20">
                      Interes Compuesto Multiplicador (ICM)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {[
                    {
                      concept: 'Reinversion',
                      ict: 'Manual (cada periodo)',
                      icm: 'Automatica y dirigida',
                      highlight: false
                    },
                    {
                      concept: 'Crecimiento',
                      ict: 'Lineal a largo plazo',
                      icm: 'Exponencial desde el inicio',
                      highlight: true
                    },
                    {
                      concept: 'Efecto fiscal',
                      ict: 'Pagan impuestos en cada ciclo',
                      icm: 'Optimizado por reinversion automatica',
                      highlight: false
                    },
                    {
                      concept: 'Base de crecimiento',
                      ict: 'Capital inicial',
                      icm: 'Capital + nuevos tickets + nuevas tiendas',
                      highlight: true
                    },
                    {
                      concept: `Resultado a 25 anos (ej. ${formatCurrency(ticketPrice, 'MXN')})`,
                      ict: formatCurrency(ictResult.finalValue),
                      icm: formatCurrency(icmResult.totalPatrimony),
                      highlight: true
                    },
                    {
                      concept: 'Flujo trimestral',
                      ict: 'No aplica',
                      icm: 'Si (4 pagos al ano)',
                      highlight: true
                    },
                    {
                      concept: 'Control',
                      ict: 'Limitado',
                      icm: 'Personalizable (decide cuanto reinvertir)',
                      highlight: false
                    }
                  ].map((row, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className={row.highlight ? 'bg-red-900/10' : ''}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-300">
                        {row.concept}
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-gray-500 bg-gray-800/20">
                        {row.ict}
                      </td>
                      <td className="px-6 py-4 text-sm text-center font-semibold text-red-400 bg-red-900/10">
                        {row.icm}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-gradient-to-r from-red-700 to-red-900 p-6 text-center">
              <motion.a
                href="#simulador"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-red-600 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg"
              >
                <Calculator className="w-5 h-5" />
                Calcular mi ejemplo en tiempo real
              </motion.a>
            </div>
          </div>
        </div>
      </section>

      <section id="simulador" className="py-20 bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Prueba el poder de ambos modelos
            </h2>
            <p className="text-xl text-gray-400">
              Ajusta los parametros y observa la diferencia en tiempo real
            </p>
          </motion.div>

          <div className="bg-gray-900 rounded-2xl p-8 text-white border border-gray-800">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Monto inicial
                </label>
                <input
                  type="range"
                  min="100000"
                  max="5000000"
                  step="100000"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-2xl font-bold text-red-500 mt-2">
                  {formatCurrency(initialInvestment)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Anos de inversion
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-2xl font-bold text-red-500 mt-2">
                  {years} anos
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  % de reinversion (ICM)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={reinvestmentRate}
                  onChange={(e) => setReinvestmentRate(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-2xl font-bold text-red-500 mt-2">
                  {reinvestmentRate}%
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSimulate}
                disabled={isAnimating}
                className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all inline-flex items-center gap-2 disabled:opacity-50"
              >
                <Play className="w-5 h-5" />
                {isAnimating ? 'Simulando...' : 'Iniciar Simulacion'}
              </motion.button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <Store className="w-8 h-8 text-gray-400" />
                  <h3 className="text-xl font-bold text-gray-300">ICT</h3>
                </div>
                <div className="text-4xl font-bold text-gray-300 mb-2">
                  {formatCurrency(ictResult.finalValue * (animationProgress / 100))}
                </div>
                <div className="text-sm text-gray-500">
                  Crecimiento: {((ictResult.finalValue / initialInvestment - 1) * 100).toFixed(0)}%
                </div>
              </div>

              <div className="bg-red-900/20 rounded-xl p-6 border-2 border-red-800/50">
                <div className="flex items-center gap-3 mb-4">
                  <Bike className="w-8 h-8 text-red-500" />
                  <h3 className="text-xl font-bold text-red-500">ICM</h3>
                </div>
                <div className="text-4xl font-bold text-red-500 mb-2">
                  {formatCurrency(icmResult.totalPatrimony * (animationProgress / 100))}
                </div>
                <div className="text-sm text-gray-500">
                  Crecimiento: {((icmResult.totalPatrimony / initialInvestment - 1) * 100).toFixed(0)}%
                </div>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-red-900/30 rounded-full text-sm font-semibold text-red-400 border border-red-800/50">
                  <Zap className="w-4 h-4" />
                  {multiplierFactor}x mas que ICT
                </div>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={generateChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="year"
                    label={{ value: 'Anos', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
                    stroke="#6b7280"
                  />
                  <YAxis
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                    stroke="#6b7280"
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="ICT"
                    stroke="#6b7280"
                    fill="#6b7280"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="ICM"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-8 text-center bg-red-900/20 p-4 rounded-xl border border-red-800/50">
              <div className="flex items-center justify-center gap-2 text-red-400">
                <Zap className="w-5 h-5" />
                <span className="font-semibold">
                  Cada ano de reinversion multiplica tu resultado
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all inline-flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Recibir mi simulacion por WhatsApp
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      <section id="tecnica" className="py-20 bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Que hace posible el ICM?
            </h2>
            <p className="text-xl text-gray-400">
              La tecnologia detras del crecimiento exponencial
            </p>
          </motion.div>

          <div className="relative">
            <div className="flex items-center justify-center mb-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-48 h-48 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-2xl"
              >
                <Repeat className="w-24 h-24 text-white" />
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  number: '1',
                  icon: RefreshCw,
                  title: 'Reinversion automatica',
                  desc: 'A traves del triple fideicomiso con Banco BX+, sin intervencion manual'
                },
                {
                  number: '2',
                  icon: Plus,
                  title: 'Adquisicion progresiva',
                  desc: 'Nuevos tickets se agregan continuamente a tu portafolio'
                },
                {
                  number: '3',
                  icon: TrendingUp,
                  title: 'Crecimiento compuesto y diversificado',
                  desc: 'Mas tickets = mas tiendas = mas ventas de motos = mas flujo trimestral'
                },
                {
                  number: '4',
                  icon: DollarSign,
                  title: 'Sin detener el rendimiento',
                  desc: 'Todo continua generando ingresos trimestrales'
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative bg-gray-900/50 rounded-2xl p-6 border border-gray-800"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {step.number}
                  </div>
                  <div className="flex items-start gap-4 mt-4">
                    <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                      <step.icon className="w-8 h-8 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-gray-500">{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="social" className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Socios que ya viven el salto del ICT al ICM
            </h2>
            <p className="text-xl text-gray-400">
              Descubre por que eligen multiplicar en lugar de solo crecer
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {[
              { number: '30', label: 'Tickets por tienda', icon: Store },
              { number: '480', label: 'Motos vendidas por tienda al ano', icon: Bike },
              { number: '18-22%', label: 'ROI objetivo anual', icon: TrendingUp }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900 rounded-2xl p-8 text-center shadow-xl border border-gray-800"
              >
                <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-red-500" />
                </div>
                <div className="text-4xl font-bold text-red-500 mb-2">{stat.number}</div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
            {[
              {
                name: 'Carlos Rodriguez',
                role: 'Socio RiderMex desde 2023',
                text: 'Pase de esperar decadas con inversiones tradicionales a ver resultados multiplicados en pocos anos. El ICM de RiderMex cambio mi estrategia de retiro.',
                image: '👨‍💼'
              },
              {
                name: 'Maria Fernandez',
                role: 'Empresaria y socia',
                text: 'La reinversion automatica en nuevos tickets es clave. No tengo que preocuparme por tiempos ni procesos. Todo fluye y se multiplica con cada nueva tienda.',
                image: '👩‍💼'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-800"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{testimonial.image}</div>
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-400 italic">"{testimonial.text}"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg inline-flex items-center gap-2"
            >
              Convertirme en socio RiderMex
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </section>

      <section id="seguridad" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 rounded-full mb-6 border border-gray-700">
              <Shield className="w-5 h-5 text-red-500" />
              <span className="font-semibold text-gray-300">100% Respaldado</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Triple fideicomiso con Banco BX+ y seguros integrales
            </h2>
            <p className="text-xl text-gray-400">
              Tu inversion protegida en cada etapa del proceso
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: FileText,
                title: 'Fideicomiso de Activos',
                desc: 'Activos y contratos protegidos con Banco BX+'
              },
              {
                icon: Shield,
                title: 'Fideicomiso Operativo',
                desc: 'Operacion de tiendas bajo control fiduciario'
              },
              {
                icon: DollarSign,
                title: 'Fideicomiso de Cobro',
                desc: 'Cobro y reparto transparente de rendimientos'
              },
              {
                icon: Lock,
                title: 'Seguros',
                desc: 'Cobertura amplia sobre inventario completo'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/50 rounded-2xl p-6 text-center border border-gray-800"
              >
                <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="px-8 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all inline-flex items-center gap-2 border border-gray-700"
            >
              <FileText className="w-5 h-5" />
              Solicitar informacion sobre fideicomisos
            </motion.button>
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-xl text-gray-400">
              Todo lo que necesitas saber sobre RiderMex y el modelo ICM
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-semibold text-white">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 pb-6"
                    >
                      <p className="text-gray-400">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="cta-final" className="py-20 bg-gradient-to-br from-red-900 via-red-800 to-red-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10">
            <Bike className="w-32 h-32" />
          </div>
          <div className="absolute bottom-10 right-10">
            <Store className="w-40 h-40" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              El ICT crece. El ICM multiplica.
            </h2>
            <p className="text-2xl text-red-200 mb-12">
              Hoy puedes usar el poder del tiempo o sumarle el poder de la expansion con tiendas de motocicletas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="px-10 py-5 bg-white text-red-700 rounded-xl font-bold text-xl hover:bg-gray-100 transition-all shadow-2xl inline-flex items-center justify-center gap-3"
              >
                <Zap className="w-6 h-6" />
                Multiplicar mi inversion con ICM
              </motion.button>
              <motion.a
                href="https://wa.me/529982024327?text=Hola%2C%20me%20interesa%20ser%20socio%20RiderMex"
                target="_blank"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-red-800 text-white rounded-xl font-bold text-xl hover:bg-red-900 transition-all border-2 border-white inline-flex items-center justify-center gap-3"
              >
                <Phone className="w-6 h-6" />
                Hablar con un asesor
              </motion.a>
            </div>

            <div className="text-red-200 text-sm">
              Respuesta en menos de 15 minutos
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-800"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Calcula tu estrategia personalizada
                </h3>
                <p className="text-gray-400">
                  Recibe tu simulacion ICM vs ICT por WhatsApp
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500"
                    placeholder="+52 998 202 4327"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Monto de inversion (MXN)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500"
                    placeholder="100000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Horizonte (anos)
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.horizon}
                      onChange={(e) => setFormData({...formData, horizon: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500"
                      placeholder="25"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      % Reinversion
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.reinvestmentPercent}
                      onChange={(e) => setFormData({...formData, reinvestmentPercent: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500"
                      placeholder="80"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    required
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
                    className="mt-1"
                  />
                  <label className="text-sm text-gray-400">
                    Quiero aprender a multiplicar mi inversion con RiderMex y acepto recibir informacion por WhatsApp
                  </label>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all inline-flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Recibir mi simulacion personalizada
                </motion.button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="w-full px-6 py-3 text-gray-500 hover:text-gray-300 transition-colors font-medium"
                >
                  Cerrar
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-black text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bike className="w-8 h-8 text-red-500" />
                <span className="text-xl font-bold">RiderMex</span>
              </div>
              <p className="text-gray-500 text-sm">
                Invierte en tiendas de motocicletas con tecnologia ICM y multiplica tu patrimonio.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-300">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">Aviso de Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terminos y Condiciones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contratos</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-300">Fideicomisos (Banco BX+)</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Fideicomiso de Activos y Contratos</li>
                <li>Fideicomiso Operativo</li>
                <li>Fideicomiso de Cobro y Reparto</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-300">Contacto</h4>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href="https://wa.me/529982024327" target="_blank" className="hover:text-white transition-colors">+52 998 202 4327</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:contacto@ridermex.com" className="hover:text-white transition-colors">contacto@ridermex.com</a>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>Mexico</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p className="mb-2">
              Proyecciones informativas. Sujeto a contrato, operacion y condiciones de mercado.
            </p>
            <p>
              {new Date().getFullYear()} RiderMex. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ICMLandingPage;
