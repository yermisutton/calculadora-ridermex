import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator, Sliders, ArrowLeft, TrendingUp, AlertCircle, CheckCircle, ChevronDown,
  ArrowRight, Briefcase, Shield, Home, Star, Phone, Target, Award, Zap,
  PiggyBank, TrendingDown, Clock, DollarSign, Users, Globe, Play,
  Send, Check, X, Calendar, ShieldCheck, Bike, Store
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { getDetailedCertificateEvolution } from '../utils/calculations/certificateEvolution';
import { RIDERMEX_CONFIG } from '../data/ridermexConfig';
import type { Investment } from '../types';

interface RetirementFutureLandingPageProps {
  onGetStarted?: () => void;
  onBack?: () => void;
}

const RetirementFutureLandingPage: React.FC<RetirementFutureLandingPageProps> = ({ onGetStarted, onBack }) => {
  const ticketPrice = RIDERMEX_CONFIG.TICKET_PRICE;

  const [activeSegment, setActiveSegment] = useState<'beginner' | 'income' | 'maximize'>('beginner');
  const [totalInitialInvestment, setTotalInitialInvestment] = useState(ticketPrice);
  const [years, setYears] = useState(25);
  const [reinvestmentRate, setReinvestmentRate] = useState(100);
  const [showCalculator, setShowCalculator] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    amount: '',
    horizon: ''
  });
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const calculateRiderMex = (totalInitial: number, years: number, scenario: 'conservative' | 'moderate' | 'optimistic') => {
    const numberOfTickets = Math.max(1, Math.floor(totalInitial / ticketPrice));

    const investment: Partial<Investment> = {
      initialCertificates: numberOfTickets,
      certificateBasePrice: ticketPrice,
      initialPayment: ticketPrice * numberOfTickets,
      years: years,
      reinvestProfits: true,
      reinvestmentPercentages: Array(years).fill(100),
      increaseLemonPrice: false,
      lemonPriceIncrease: 0,
      partialCashOut: false,
      cashOutPercentage: 0,
      yearlyCashOutPercentages: Array(years).fill(0),
      inflationRate: RIDERMEX_CONFIG.INFLATION_RATE,
      monthlyContribution: 0,
      additionalContributions: false,
      appreciationRate: RIDERMEX_CONFIG.ANNUAL_APPRECIATION,
      ridermexProductType: 'B',
      ridermexFirstMonthlyIncome: 7,
      ridermexScenario: scenario,
      enableMarketGrowth: true,
      marketGrowthRate: 5,
    };

    const evolution = getDetailedCertificateEvolution(investment as Investment);
    const finalYear = evolution[evolution.length - 1];

    if (!finalYear) {
      return { futureValue: ticketPrice, totalInvested: ticketPrice, monthlyPension: 0, tickets: numberOfTickets };
    }

    const totalTickets = finalYear.totalCertificates;
    const totalPatrimony = finalYear.citrusPatrimony;
    const annualUtility = finalYear.citrusIncome;
    const monthlyPension = annualUtility / 12;
    const totalInvested = totalInitial;

    return {
      futureValue: totalPatrimony,
      totalInvested,
      monthlyPension,
      tickets: totalTickets
    };
  };

  const calculateTraditional = (totalAmount: number, annualRate: number, years: number) => {
    const monthlyAmount = totalAmount / (years * 12);
    if (monthlyAmount === 0) {
      const futureValue = totalAmount * Math.pow(1 + annualRate / 100, years);
      const monthlyPension = (futureValue * (annualRate / 100)) / 12;
      return { futureValue, totalInvested: totalAmount, monthlyPension };
    }
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;
    const futureValue = monthlyAmount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const totalInvested = monthlyAmount * months;
    const monthlyPension = (futureValue * (annualRate / 100)) / 12;
    return { futureValue, totalInvested, monthlyPension };
  };

  const conservador = useMemo(() => {
    return calculateRiderMex(totalInitialInvestment, years, 'conservative');
  }, [totalInitialInvestment, years]);

  const moderado = useMemo(() => {
    return calculateRiderMex(totalInitialInvestment, years, 'moderate');
  }, [totalInitialInvestment, years]);

  const optimista = useMemo(() => {
    return calculateRiderMex(totalInitialInvestment, years, 'optimistic');
  }, [totalInitialInvestment, years]);

  const afore = useMemo(() => calculateTraditional(totalInitialInvestment, 6.5, years), [totalInitialInvestment, years]);
  const ppr = useMemo(() => calculateTraditional(totalInitialInvestment, 9, years), [totalInitialInvestment, years]);
  const cetes = useMemo(() => calculateTraditional(totalInitialInvestment, 7.5, years), [totalInitialInvestment, years]);

  const segments = [
    {
      id: 'beginner' as const,
      label: 'Soy principiante',
      icon: Target,
      benefit: 'Plan simple, operado 100% por RiderMex',
      color: 'from-red-600 to-red-700'
    },
    {
      id: 'income' as const,
      label: 'Busco ingreso trimestral',
      icon: DollarSign,
      benefit: 'Flujo trimestral desde el mes 7 de operacion',
      color: 'from-red-700 to-red-800'
    },
    {
      id: 'maximize' as const,
      label: 'Quiero maximizar patrimonio',
      icon: TrendingUp,
      benefit: 'Reinversion automatica para crecimiento exponencial',
      color: 'from-red-800 to-red-900'
    }
  ];

  const comparisonData = [
    {
      aspect: 'Rendimiento anual',
      ridermex: `${RIDERMEX_CONFIG.TARGET_ROI_MIN}-${RIDERMEX_CONFIG.TARGET_ROI_MAX}%`,
      afore: '5-8%',
      ppr: '8-10%',
      cetes: '7.5%'
    },
    {
      aspect: `Crecimiento a 25 anos (con ${formatCurrency(ticketPrice, 'MXN')})`,
      ridermex: `${formatCurrency(conservador.futureValue, 'MXN')} - ${formatCurrency(optimista.futureValue, 'MXN')}`,
      afore: formatCurrency(afore.futureValue, 'MXN'),
      ppr: formatCurrency(ppr.futureValue, 'MXN'),
      cetes: formatCurrency(cetes.futureValue, 'MXN')
    },
    {
      aspect: 'Flujo periodico',
      ridermex: 'Si (trimestral)',
      afore: 'No',
      ppr: 'No',
      cetes: 'No'
    },
    {
      aspect: 'Respaldo',
      ridermex: 'Tiendas + inventario + fideicomisos',
      afore: 'Instrumentos',
      ppr: 'Instrumentos',
      cetes: 'Gobierno'
    },
    {
      aspect: 'Crecimiento',
      ridermex: 'Reinversion compuesta',
      afore: 'Lineal',
      ppr: 'Lineal',
      cetes: 'Lineal'
    }
  ];

  const pillars = [
    {
      icon: CheckCircle,
      title: 'Simple',
      description: '100% operado por RiderMex; tu solo cobras y decides reinvertir'
    },
    {
      icon: TrendingUp,
      title: 'Rentable',
      description: `ROI estimado ${RIDERMEX_CONFIG.TARGET_ROI_MIN}-${RIDERMEX_CONFIG.TARGET_ROI_MAX}% anual con tiendas de motos`
    },
    {
      icon: Shield,
      title: 'Seguro',
      description: '3 fideicomisos + seguros de inventario + banco BX+'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Adquieres tu ticket RiderMex',
      description: 'Define tu inversion inicial y horizonte de retiro'
    },
    {
      number: '2',
      title: 'RiderMex opera la tienda',
      description: 'Compra, venta y financiamiento de motocicletas, gestionado profesionalmente'
    },
    {
      number: '3',
      title: 'Recibes rendimientos trimestrales',
      description: `${formatCurrency(RIDERMEX_CONFIG.QUARTERLY_PAYMENT, 'MXN')} por ticket cada trimestre via fideicomiso`
    },
    {
      number: '4',
      title: 'Reinversion opcional',
      description: 'Decides cuanto reinvertir para acelerar tu patrimonio exponencialmente'
    }
  ];

  const security = [
    {
      icon: Shield,
      title: RIDERMEX_CONFIG.TRUSTS.ASSETS,
      description: 'Proteccion de activos, inventario y contratos de la tienda'
    },
    {
      icon: CheckCircle,
      title: RIDERMEX_CONFIG.TRUSTS.OPERATIONS,
      description: 'Operacion transparente de compra-venta de motocicletas'
    },
    {
      icon: Award,
      title: RIDERMEX_CONFIG.TRUSTS.COLLECTION,
      description: 'Cobro y reparto de rendimientos a socios via banco BX+'
    },
    {
      icon: Globe,
      title: 'Seguros completos',
      description: 'Seguro de inventario completo (piso y transito) + proteccion patrimonial'
    }
  ];

  const testimonials = [
    {
      name: 'Carlos M.',
      city: 'Cancun',
      age: 40,
      photo: '',
      text: 'Con 2 tickets RiderMex genero mas rendimiento trimestral que mi AFORE en todo un ano. La operacion es totalmente transparente.',
      rating: 5
    },
    {
      name: 'Laura S.',
      city: 'CDMX',
      age: 35,
      photo: '',
      text: 'Como socia RiderMex recibo mis rendimientos puntuales cada trimestre. Es el mejor complemento para mi plan de retiro.',
      rating: 5
    },
    {
      name: 'Miguel A.',
      city: 'Monterrey',
      age: 45,
      photo: '',
      text: 'La reinversion automatica es impresionante. En 5 anos mis tickets se han multiplicado y mi patrimonio crece exponencialmente.',
      rating: 5
    }
  ];

  const faqs = [
    {
      question: 'Por que RiderMex supera a las AFORES y PPR?',
      answer: `Las AFORES promedian 6.5% anual y los PPR hasta 9%, apenas cubriendo inflacion. RiderMex ofrece rendimientos estimados de ${RIDERMEX_CONFIG.TARGET_ROI_MIN}-${RIDERMEX_CONFIG.TARGET_ROI_MAX}% anuales respaldados por tiendas de motocicletas reales con demanda comprobada. Ademas, las AFORES cobran comisiones que erosionan tus rendimientos.`
    },
    {
      question: 'Como funciona como plan de retiro?',
      answer: `Adquieres tickets de participacion en tiendas RiderMex. Cada ticket genera ${formatCurrency(RIDERMEX_CONFIG.QUARTERLY_PAYMENT, 'MXN')} trimestrales. Los rendimientos se pueden reinvertir automaticamente (efecto compuesto), multiplicando tu patrimonio. Al retiro, pausas reinversion y recibes pension de los rendimientos.`
    },
    {
      question: 'Que protecciones tiene mi inversion?',
      answer: `(1) 3 fideicomisos independientes con ${RIDERMEX_CONFIG.BANK}, (2) Seguro de inventario completo, (3) Seguro de proteccion patrimonial, (4) Operacion auditada de tiendas de motocicletas, (5) Aliados financieros: ${RIDERMEX_CONFIG.FINANCIAL_PARTNERS.join(', ')}.`
    },
    {
      question: 'Cual es la diferencia real en mi pension?',
      answer: `Con ${formatCurrency(ticketPrice, 'MXN')} invertidos por 25 anos: AFORE te daria ${formatCurrency(afore.futureValue, 'MXN')}, pero RiderMex genera entre ${formatCurrency(conservador.futureValue, 'MXN')} y ${formatCurrency(optimista.futureValue, 'MXN')}. Significativamente mas pension mensual.`
    },
    {
      question: 'Puedo combinar esto con mi AFORE actual?',
      answer: 'Si, RiderMex es el complemento perfecto. Tu AFORE obligatorio sigue operando mientras RiderMex se convierte en tu plan de retiro premium que multiplica tu patrimonio futuro con rendimientos superiores.'
    },
    {
      question: 'Que pasa si necesito el dinero antes del retiro?',
      answer: 'Total flexibilidad: (1) Pausas reinversion y recibes rendimientos trimestrales, (2) Vendes tus tickets con apreciacion del 5% anual por escalon, (3) Los heredas con proteccion patrimonial. No estas atado como con AFORES.'
    }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hola, me interesa disenar mi plan de retiro con RiderMex.\n\nNombre: ${formData.name}\nWhatsApp: ${formData.whatsapp}\nEmail: ${formData.email}\nMonto estimado: ${formData.amount}\nHorizonte: ${formData.horizon} anos`;
    const whatsappUrl = `https://wa.me/529982024327?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const scrollToForm = () => {
    const formElement = document.getElementById('form');
    formElement?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSimulator = () => {
    const simulatorElement = document.getElementById('simulador');
    simulatorElement?.scrollIntoView({ behavior: 'smooth' });
  };

  const scenarioConfig = RIDERMEX_CONFIG.SCENARIOS;

  return (
    <div className="min-h-screen bg-black">
      {showStickyBar && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-700 to-red-900 text-white py-3 px-4 shadow-lg"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="font-semibold flex items-center gap-2">
              <Bike className="w-5 h-5" />
              Disena tu retiro con RiderMex
            </span>
            <div className="flex gap-3">
              <button
                onClick={scrollToSimulator}
                className="px-4 py-2 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
              >
                Simular ahora
              </button>
              <button
                onClick={scrollToForm}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-400 hover:to-red-500 transition-colors text-sm border border-red-400"
              >
                Disenar mi retiro
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="bg-gray-950 shadow-sm border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <Bike className="w-10 h-10 text-red-500" />
              <span className="text-2xl font-bold text-white">RiderMex</span>
            </div>
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                <Home className="w-5 h-5" />
                <span>Inicio</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <section id="hero" className="bg-gradient-to-br from-gray-950 via-black to-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Construye tu retiro con <span className="text-red-500">rendimientos trimestrales</span>, sin ser experto
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                Socios RiderMex generan rendimientos con tiendas de motocicletas reales y fideicomisos
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <span className="text-lg text-gray-300">Rendimientos estimados {RIDERMEX_CONFIG.TARGET_ROI_MIN}-{RIDERMEX_CONFIG.TARGET_ROI_MAX}% anual</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <span className="text-lg text-gray-300">Pagos trimestrales de {formatCurrency(RIDERMEX_CONFIG.QUARTERLY_PAYMENT, 'MXN')} por ticket</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <span className="text-lg text-gray-300">Respaldo en tiendas reales y 3 fideicomisos</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={scrollToForm}
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-lg hover:from-red-500 hover:to-red-600 transform hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  Quiero ser socio RiderMex
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    const element = document.getElementById('como-funciona');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 bg-gray-900 text-red-500 border-2 border-red-600 rounded-xl font-bold text-lg hover:bg-gray-800 transform hover:scale-105 transition-all shadow-lg"
                >
                  Ver como funciona
                </button>
              </div>
              <div className="mt-8 flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-gray-400">3 Fideicomisos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-gray-400">{RIDERMEX_CONFIG.BANK}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-gray-400">Tiendas reales</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-red-900/50 rounded-xl">
                    <Calculator className="w-8 h-8 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Vista rapida</h3>
                    <p className="text-gray-400">Con {formatCurrency(ticketPrice, 'MXN')} por 25 anos</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-sm text-gray-400 mb-2 font-medium">Escenarios de negocio:</div>

                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-200">Conservador</p>
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">{scenarioConfig.conservative.motorcyclesPerYear} motos/ano</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Patrimonio</p>
                        <p className="text-lg font-bold text-red-500">{formatCurrency(conservador.futureValue, 'MXN')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Pension mensual</p>
                        <p className="text-lg font-bold text-red-500">{formatCurrency(conservador.monthlyPension, 'MXN')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-4 border border-red-800/50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-200">Moderado</p>
                      <span className="text-xs bg-red-900/50 text-red-400 px-2 py-1 rounded">{scenarioConfig.moderate.motorcyclesPerYear} motos/ano</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Patrimonio</p>
                        <p className="text-lg font-bold text-red-500">{formatCurrency(moderado.futureValue, 'MXN')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Pension mensual</p>
                        <p className="text-lg font-bold text-red-500">{formatCurrency(moderado.monthlyPension, 'MXN')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-200">Optimista</p>
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">{scenarioConfig.optimistic.motorcyclesPerYear} motos/ano</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Patrimonio</p>
                        <p className="text-lg font-bold text-red-500">{formatCurrency(optimista.futureValue, 'MXN')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Pension mensual</p>
                        <p className="text-lg font-bold text-red-500">{formatCurrency(optimista.monthlyPension, 'MXN')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-sm text-gray-400 mb-1">vs. AFORE tradicional</p>
                    <p className="text-2xl font-bold text-white">{afore.monthlyPension > 0 ? (moderado.monthlyPension / afore.monthlyPension).toFixed(1) : '0'}X mas pension</p>
                  </div>
                </div>
                <button
                  onClick={scrollToSimulator}
                  className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-500 hover:to-red-600 transition-colors"
                >
                  Calcular mi escenario personalizado
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="segmentos" className="py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Disena tu retiro segun tu objetivo
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12">
            Elige el enfoque que mejor se adapte a tu situacion
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {segments.map((segment) => (
              <motion.button
                key={segment.id}
                onClick={() => setActiveSegment(segment.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-6 rounded-2xl border-2 transition-all text-left ${
                  activeSegment === segment.id
                    ? `bg-gradient-to-br ${segment.color} text-white border-transparent shadow-xl`
                    : 'bg-gray-900 border-gray-800 hover:border-red-800 hover:shadow-lg'
                }`}
              >
                <segment.icon className={`w-10 h-10 mb-4 ${activeSegment === segment.id ? 'text-white' : 'text-red-500'}`} />
                <h3 className={`text-xl font-bold mb-2 ${activeSegment === segment.id ? 'text-white' : 'text-white'}`}>
                  {segment.label}
                </h3>
                <p className={activeSegment === segment.id ? 'text-white/90' : 'text-gray-400'}>
                  {segment.benefit}
                </p>
                {activeSegment === segment.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    <button
                      onClick={scrollToSimulator}
                      className="w-full px-4 py-2 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Calcular mi escenario
                    </button>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          {activeSegment && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-12 bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-800"
            >
              {activeSegment === 'beginner' && (
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-white mb-2">
                    Soy principiante - Plan Simple
                  </h3>
                  <p className="text-lg text-gray-400 mb-4">
                    Plan operado 100% por RiderMex. Tu solo inviertes y nosotros hacemos todo el trabajo.
                  </p>
                  <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl p-6 shadow-lg mb-6 border border-gray-700">
                    <div className="grid md:grid-cols-3 gap-4 text-left">
                      <div>
                        <CheckCircle className="w-6 h-6 text-red-500 mb-2" />
                        <h4 className="font-bold text-white mb-1">Cero experiencia necesaria</h4>
                        <p className="text-sm text-gray-400">No necesitas saber de motocicletas, ventas o gestion de tiendas</p>
                      </div>
                      <div>
                        <CheckCircle className="w-6 h-6 text-red-500 mb-2" />
                        <h4 className="font-bold text-white mb-1">Todo incluido</h4>
                        <p className="text-sm text-gray-400">Tienda, inventario, ventas, financiamiento y distribucion de rendimientos</p>
                      </div>
                      <div>
                        <CheckCircle className="w-6 h-6 text-red-500 mb-2" />
                        <h4 className="font-bold text-white mb-1">Transparencia total</h4>
                        <p className="text-sm text-gray-400">Reportes trimestrales, 3 fideicomisos y acceso a informacion cuando quieras</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-lg text-gray-300 font-semibold">
                    Con {formatCurrency(ticketPrice, 'MXN')} hoy, en 25 anos tendras entre <span className="text-red-500">{formatCurrency(conservador.futureValue, 'MXN')} y {formatCurrency(optimista.futureValue, 'MXN')}</span> de patrimonio
                  </p>
                </div>
              )}

              {activeSegment === 'income' && (
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-white mb-2">
                    Busco ingreso trimestral constante
                  </h3>
                  <p className="text-lg text-gray-400 mb-4">
                    Recibe flujo de efectivo trimestral desde el mes 7 cuando la tienda entra en operacion. Perfecto para complementar tu sueldo o jubilacion.
                  </p>
                  <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl p-6 shadow-lg mb-6 border border-gray-700">
                    <div className="grid md:grid-cols-3 gap-4 text-left">
                      <div>
                        <DollarSign className="w-6 h-6 text-red-500 mb-2" />
                        <h4 className="font-bold text-white mb-1">Flujo desde mes 7</h4>
                        <p className="text-sm text-gray-400">Tu ticket genera {formatCurrency(RIDERMEX_CONFIG.QUARTERLY_PAYMENT, 'MXN')} trimestrales al entrar en operacion</p>
                      </div>
                      <div>
                        <TrendingUp className="w-6 h-6 text-red-500 mb-2" />
                        <h4 className="font-bold text-white mb-1">Apreciacion del ticket</h4>
                        <p className="text-sm text-gray-400">Tu ticket se aprecia {RIDERMEX_CONFIG.ANNUAL_APPRECIATION}% anual por sistema de escalones</p>
                      </div>
                      <div>
                        <Calendar className="w-6 h-6 text-red-500 mb-2" />
                        <h4 className="font-bold text-white mb-1">Pago trimestral puntual</h4>
                        <p className="text-sm text-gray-400">Rendimientos distribuidos via fideicomiso de cobro y reparto</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-lg text-gray-300 font-semibold">
                    Estrategia: Pausas reinversion y recibes <span className="text-red-500">ingreso trimestral</span> de por vida
                  </p>
                </div>
              )}

              {activeSegment === 'maximize' && (
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-white mb-2">
                    Quiero maximizar mi patrimonio
                  </h3>
                  <p className="text-lg text-gray-400 mb-4">
                    Reinversion automatica: tus rendimientos compran mas tickets que generan mas rendimientos. Crecimiento exponencial.
                  </p>
                  <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl p-6 shadow-lg mb-6 border border-gray-700">
                    <div className="grid md:grid-cols-3 gap-4 text-left">
                      <div>
                        <Zap className="w-6 h-6 text-red-500 mb-2" />
                        <h4 className="font-bold text-white mb-1">Efecto exponencial</h4>
                        <p className="text-sm text-gray-400">Cada rendimiento se reinvierte automaticamente, comprando mas tickets que generan mas rendimientos</p>
                      </div>
                      <div>
                        <TrendingUp className="w-6 h-6 text-red-500 mb-2" />
                        <h4 className="font-bold text-white mb-1">Multiplicacion acelerada</h4>
                        <p className="text-sm text-gray-400">Tus tickets crecen ano con ano, cada uno generando {formatCurrency(RIDERMEX_CONFIG.ANNUAL_RETURN_PER_TICKET, 'MXN')} anuales</p>
                      </div>
                      <div>
                        <ShieldCheck className="w-6 h-6 text-red-500 mb-2" />
                        <h4 className="font-bold text-white mb-1">Control total</h4>
                        <p className="text-sm text-gray-400">Puedes pausar reinversion en cualquier momento y empezar a recibir flujo trimestral</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-lg text-gray-300 font-semibold">
                    Con {formatCurrency(ticketPrice, 'MXN')} hoy + reinversion, en 25 anos: <span className="text-red-500">{formatCurrency(optimista.futureValue, 'MXN')} patrimonio</span> y <span className="text-red-500">{formatCurrency(optimista.monthlyPension, 'MXN')}/mes</span> de pension
                  </p>
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-white">Conservador</h4>
                    <span className="text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded-full font-semibold">{scenarioConfig.conservative.motorcyclesPerYear} motos</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-xs bg-gray-700 text-gray-400 px-2 py-1 rounded">{formatCurrency(scenarioConfig.conservative.annualReturnPerTicket, 'MXN')}/ticket/ano</span>
                    <p className="text-xs text-gray-500 mt-2">{formatCurrency(scenarioConfig.conservative.annualReturnPerTicket / 4, 'MXN')}/trimestre</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Patrimonio final</p>
                      <p className="text-2xl font-bold text-red-500">{formatCurrency(conservador.futureValue, 'MXN')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Flujo mensual total</p>
                      <p className="text-2xl font-bold text-red-500">{formatCurrency(conservador.monthlyPension, 'MXN')}</p>
                      <p className="text-xs text-gray-500 mt-1">De todos tus tickets</p>
                    </div>
                    <div className="pt-4 border-t border-gray-700">
                      <p className="text-xs text-gray-500 mb-1">vs. AFORE tradicional</p>
                      <p className="text-xl font-bold text-red-400">{afore.monthlyPension > 0 ? (conservador.monthlyPension / afore.monthlyPension).toFixed(1) : '0'}X mas pension</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-red-700">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-white">Moderado</h4>
                    <span className="text-xs bg-red-900/50 text-red-400 px-3 py-1 rounded-full font-semibold">{scenarioConfig.moderate.motorcyclesPerYear} motos</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-xs bg-gray-700 text-gray-400 px-2 py-1 rounded">{formatCurrency(scenarioConfig.moderate.annualReturnPerTicket, 'MXN')}/ticket/ano</span>
                    <p className="text-xs text-gray-500 mt-2">{formatCurrency(scenarioConfig.moderate.annualReturnPerTicket / 4, 'MXN')}/trimestre</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Patrimonio final</p>
                      <p className="text-2xl font-bold text-red-500">{formatCurrency(moderado.futureValue, 'MXN')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Flujo mensual total</p>
                      <p className="text-2xl font-bold text-red-500">{formatCurrency(moderado.monthlyPension, 'MXN')}</p>
                      <p className="text-xs text-gray-500 mt-1">De todos tus tickets</p>
                    </div>
                    <div className="pt-4 border-t border-gray-700">
                      <p className="text-xs text-gray-500 mb-1">vs. AFORE tradicional</p>
                      <p className="text-xl font-bold text-red-400">{afore.monthlyPension > 0 ? (moderado.monthlyPension / afore.monthlyPension).toFixed(1) : '0'}X mas pension</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-white">Optimista</h4>
                    <span className="text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded-full font-semibold">{scenarioConfig.optimistic.motorcyclesPerYear} motos</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-xs bg-gray-700 text-gray-400 px-2 py-1 rounded">{formatCurrency(scenarioConfig.optimistic.annualReturnPerTicket, 'MXN')}/ticket/ano</span>
                    <p className="text-xs text-gray-500 mt-2">{formatCurrency(scenarioConfig.optimistic.annualReturnPerTicket / 4, 'MXN')}/trimestre</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Patrimonio final</p>
                      <p className="text-2xl font-bold text-red-500">{formatCurrency(optimista.futureValue, 'MXN')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Flujo mensual total</p>
                      <p className="text-2xl font-bold text-red-500">{formatCurrency(optimista.monthlyPension, 'MXN')}</p>
                      <p className="text-xs text-gray-500 mt-1">De todos tus tickets</p>
                    </div>
                    <div className="pt-4 border-t border-gray-700">
                      <p className="text-xs text-gray-500 mb-1">vs. AFORE tradicional</p>
                      <p className="text-xl font-bold text-red-400">{afore.monthlyPension > 0 ? (optimista.monthlyPension / afore.monthlyPension).toFixed(1) : '0'}X mas pension</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={scrollToSimulator}
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-lg hover:from-red-500 hover:to-red-600 transform hover:scale-105 transition-all shadow-xl inline-flex items-center gap-2"
                >
                  Calcular mi escenario personalizado
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <section id="problema" className="py-16 bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6">
            La inflacion se come tu pension si solo ahorras
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            AFORE y PPR rinden 5-8% promedio anual. Tu costo de vida sube 4-6%/ano.
            Estas apenas manteniendo tu poder adquisitivo, no multiplicandolo.
          </p>
          <div className="bg-gray-900 rounded-2xl p-8 shadow-xl mb-8 max-w-2xl mx-auto border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="text-left">
                <p className="text-sm text-gray-400">Poder adquisitivo hoy</p>
                <p className="text-3xl font-bold text-white">$15,000</p>
              </div>
              <ArrowRight className="w-8 h-8 text-gray-600" />
              <div className="text-right">
                <p className="text-sm text-gray-400">En 15 anos (inflacion 5%)</p>
                <p className="text-3xl font-bold text-red-500">$6,800</p>
              </div>
            </div>
            <div className="bg-red-900/30 border border-red-800 rounded-lg p-4">
              <p className="text-red-400 font-semibold">
                Pierdes mas del 50% de tu poder adquisitivo
              </p>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-6">
            Ahorrar no alcanza. Hay que multiplicar.
          </h3>
          <button
            onClick={() => {
              const element = document.getElementById('comparativa');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-lg hover:from-red-500 hover:to-red-600 transform hover:scale-105 transition-all shadow-xl inline-flex items-center gap-2"
          >
            Comparar mi retiro actual vs. RiderMex
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <section id="propuesta" className="py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            El retiro que crece contigo
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12">
            3 pilares que hacen la diferencia
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:shadow-xl hover:border-red-800 transition-all"
              >
                <div className="p-4 bg-red-900/30 rounded-xl inline-block mb-4">
                  <pillar.icon className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{pillar.title}</h3>
                <p className="text-gray-400 text-lg">{pillar.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => {
                const element = document.getElementById('como-funciona');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-lg hover:from-red-500 hover:to-red-600 transform hover:scale-105 transition-all shadow-xl inline-flex items-center gap-2"
            >
              Descubrir el mecanismo
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="py-16 bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            De capital a pension trimestral, en 4 pasos
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12">
            Tu camino hacia la libertad financiera con RiderMex
          </p>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-800 flex items-start gap-6"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-lg">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button
              onClick={scrollToForm}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-lg hover:from-red-500 hover:to-red-600 transform hover:scale-105 transition-all shadow-xl inline-flex items-center gap-2"
            >
              Hablar con un asesor RiderMex
              <Phone className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <section id="comparativa" className="py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Tu retiro con RiderMex vs. alternativas tradicionales
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12">
            La diferencia es exponencial
          </p>
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-800">
              <thead>
                <tr className="bg-gradient-to-r from-red-700 to-red-800 text-white">
                  <th className="px-6 py-4 text-left font-bold">Aspecto</th>
                  <th className="px-6 py-4 text-left font-bold">RiderMex</th>
                  <th className="px-6 py-4 text-left font-bold">AFORE / PPR</th>
                  <th className="px-6 py-4 text-left font-bold">CETES</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}>
                    <td className="px-6 py-4 font-semibold text-white">{row.aspect}</td>
                    <td className="px-6 py-4 text-red-500 font-bold">{row.ridermex}</td>
                    <td className="px-6 py-4 text-gray-400">{row.afore}</td>
                    <td className="px-6 py-4 text-gray-400">{row.cetes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-400">
              <strong className="text-gray-300">Nota legal:</strong> Proyecciones informativas; sujeto a contrato y operacion real
            </p>
          </div>
          <div className="text-center mt-12">
            <button
              onClick={scrollToSimulator}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-lg hover:from-red-500 hover:to-red-600 transform hover:scale-105 transition-all shadow-xl inline-flex items-center gap-2"
            >
              Ver cuanto mas puedo obtener
              <Calculator className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <section id="simulador" className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Proyecta tu pension: hoy, a 10, 20 y 25 anos
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12">
            Simulador interactivo personalizado
          </p>
          <div className="bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-800">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Monto inicial
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={ticketPrice}
                    max="5000000"
                    step={ticketPrice}
                    value={totalInitialInvestment}
                    onChange={(e) => {
                      const total = parseInt(e.target.value);
                      setTotalInitialInvestment(total);
                    }}
                    className="flex-1"
                  />
                  <span className="text-sm font-bold text-white min-w-[120px]">
                    {formatCurrency(totalInitialInvestment, 'MXN')}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{Math.floor(totalInitialInvestment / ticketPrice)} ticket(s)</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Horizonte (anos)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="10"
                    max="35"
                    step="5"
                    value={years}
                    onChange={(e) => setYears(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm font-bold text-white min-w-[120px]">{years} anos</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-bold text-gray-200 mb-4">Escenarios con reinversion 100%</h3>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-200">Conservador</h4>
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">{scenarioConfig.conservative.motorcyclesPerYear} motos</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Patrimonio</p>
                      <p className="text-xl font-bold text-red-500">{formatCurrency(conservador.futureValue, 'MXN')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Pension mensual</p>
                      <p className="text-lg font-bold text-red-400">{formatCurrency(conservador.monthlyPension, 'MXN')}</p>
                    </div>
                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-700">
                      {formatCurrency(scenarioConfig.conservative.annualReturnPerTicket, 'MXN')}/ticket/ano
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-5 border-2 border-red-700">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-200">Moderado</h4>
                    <span className="text-xs bg-red-900/50 text-red-400 px-2 py-1 rounded">{scenarioConfig.moderate.motorcyclesPerYear} motos</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Patrimonio</p>
                      <p className="text-xl font-bold text-red-500">{formatCurrency(moderado.futureValue, 'MXN')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Pension mensual</p>
                      <p className="text-lg font-bold text-red-400">{formatCurrency(moderado.monthlyPension, 'MXN')}</p>
                    </div>
                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-700">
                      {formatCurrency(scenarioConfig.moderate.annualReturnPerTicket, 'MXN')}/ticket/ano
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-200">Optimista</h4>
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">{scenarioConfig.optimistic.motorcyclesPerYear} motos</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Patrimonio</p>
                      <p className="text-xl font-bold text-red-500">{formatCurrency(optimista.futureValue, 'MXN')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Pension mensual</p>
                      <p className="text-lg font-bold text-red-400">{formatCurrency(optimista.monthlyPension, 'MXN')}</p>
                    </div>
                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-700">
                      {formatCurrency(scenarioConfig.optimistic.annualReturnPerTicket, 'MXN')}/ticket/ano
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <p className="text-sm text-gray-400">Ventaja vs. AFORE tradicional (6.5% anual)</p>
                <p className="text-2xl font-bold text-white">{afore.monthlyPension > 0 ? (moderado.monthlyPension / afore.monthlyPension).toFixed(1) : '0'}X mas pension mensual</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  const message = `Hola, quiero recibir mi simulacion personalizada de RiderMex:\n\nMonto: ${formatCurrency(totalInitialInvestment, 'MXN')} (${Math.floor(totalInitialInvestment / ticketPrice)} tickets)\nHorizonte: ${years} anos\n\nEscenarios:\n- Conservador: ${formatCurrency(conservador.futureValue, 'MXN')} (${formatCurrency(conservador.monthlyPension, 'MXN')}/mes)\n- Moderado: ${formatCurrency(moderado.futureValue, 'MXN')} (${formatCurrency(moderado.monthlyPension, 'MXN')}/mes)\n- Optimista: ${formatCurrency(optimista.futureValue, 'MXN')} (${formatCurrency(optimista.monthlyPension, 'MXN')}/mes)`;
                  window.open(`https://wa.me/529982024327?text=${encodeURIComponent(message)}`, '_blank');
                }}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-500 hover:to-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Recibir mi simulacion por WhatsApp
              </button>
              <button
                onClick={scrollToForm}
                className="px-6 py-4 bg-gray-800 border-2 border-red-600 text-red-500 rounded-xl font-bold hover:bg-gray-700 transition-colors"
              >
                Descargar ficha tecnica
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="video" className="py-16 bg-gray-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Historias reales de socios RiderMex
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Socios reales compartiendo su experiencia
          </p>
          <div className="bg-gray-900 rounded-2xl aspect-video flex items-center justify-center border border-gray-800">
            <div className="text-center">
              <Play className="w-20 h-20 text-red-500 mx-auto mb-4" />
              <p className="text-gray-500">Video proximamente</p>
            </div>
          </div>
        </div>
      </section>

      <section id="social" className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Lo que dicen nuestros socios
          </h2>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-gray-900 px-6 py-3 rounded-full border border-gray-800">
              <Users className="w-6 h-6 text-red-500" />
              <span className="text-lg font-bold text-white">Socios activos RiderMex</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:shadow-xl hover:border-red-800 transition-all"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-red-500 text-red-500" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3 border-t border-gray-800 pt-4">
                  <div className="w-10 h-10 rounded-full bg-red-900/50 flex items-center justify-center">
                    <Bike className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.city}</p>
                    <p className="text-sm text-red-500 font-semibold">{testimonial.age} anos</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button
              onClick={scrollToForm}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-lg hover:from-red-500 hover:to-red-600 transform hover:scale-105 transition-all shadow-xl inline-flex items-center gap-2"
            >
              Quiero ser socio
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <section id="seguridad" className="py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Tu inversion, blindada de punta a punta
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12">
            4 capas de proteccion para tu patrimonio
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {security.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-800 hover:shadow-xl hover:border-red-800 transition-all"
              >
                <div className="p-4 bg-red-900/30 rounded-xl inline-block mb-4">
                  <item.icon className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button
              onClick={scrollToForm}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-lg hover:from-red-500 hover:to-red-600 transform hover:scale-105 transition-all shadow-xl inline-flex items-center gap-2"
            >
              Solicitar carpeta legal y de riesgos
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <section id="cta-final" className="py-20 bg-gradient-to-r from-red-800 to-red-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Bike className="w-20 h-20 text-white mx-auto mb-6" />
          <h2 className="text-5xl font-bold mb-6">
            Manana agradeceras lo que decidas hoy
          </h2>
          <p className="text-2xl text-red-100 mb-12">
            Convierte tus ahorros en un retiro con rendimientos trimestrales y plusvalia
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button
              onClick={scrollToForm}
              className="px-10 py-5 bg-white text-red-700 rounded-xl font-bold text-xl hover:bg-gray-100 transform hover:scale-105 transition-all shadow-2xl flex items-center gap-2"
            >
              Disenar mi plan de retiro
              <ArrowRight className="w-6 h-6" />
            </button>
            <a
              href="https://wa.me/529982024327?text=Hola,%20quiero%20informacion%20sobre%20el%20plan%20de%20retiro%20RiderMex"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-gray-900 text-white rounded-xl font-bold text-xl hover:bg-gray-800 transform hover:scale-105 transition-all shadow-2xl flex items-center gap-2 border border-gray-700"
            >
              <Phone className="w-6 h-6" />
              Hablar por WhatsApp
            </a>
          </div>
          <p className="text-red-200 text-sm">
            Respuesta en menos de 24 horas habiles. Sin compromiso.
          </p>
        </div>
      </section>

      <section id="form" className="py-16 bg-black">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Recibe tu estrategia personalizada de retiro
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12">
            Completa el formulario y un asesor RiderMex te contactara
          </p>
          <form onSubmit={handleFormSubmit} className="bg-gray-900 rounded-3xl p-8 border border-gray-800 shadow-xl">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-colors placeholder-gray-500"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-colors placeholder-gray-500"
                  placeholder="+52 999 123 4567"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Email (opcional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-colors placeholder-gray-500"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Monto estimado *
                </label>
                <select
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-colors"
                >
                  <option value="">Selecciona un rango</option>
                  <option value={`${formatCurrency(ticketPrice, 'MXN')} (1 ticket)`}>{formatCurrency(ticketPrice, 'MXN')} (1 ticket)</option>
                  <option value={`${formatCurrency(ticketPrice * 2, 'MXN')} (2 tickets)`}>{formatCurrency(ticketPrice * 2, 'MXN')} (2 tickets)</option>
                  <option value="$500k - $1M">$500k - $1M</option>
                  <option value="$1M - $3M">$1M - $3M</option>
                  <option value="Mas de $3M">Mas de $3M</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Horizonte (anos) *
                </label>
                <select
                  required
                  value={formData.horizon}
                  onChange={(e) => setFormData({ ...formData, horizon: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-colors"
                >
                  <option value="">Selecciona tu horizonte</option>
                  <option value="10">10 anos</option>
                  <option value="15">15 anos</option>
                  <option value="20">20 anos</option>
                  <option value="25">25 anos</option>
                  <option value="30+">30+ anos</option>
                </select>
              </div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  id="consent"
                  className="mt-1 w-5 h-5 text-red-600 border-gray-600 rounded focus:ring-red-500 bg-gray-800"
                />
                <label htmlFor="consent" className="text-sm text-gray-400">
                  Si, quiero entender como generar rendimientos trimestrales para mi retiro con RiderMex
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-lg hover:from-red-500 hover:to-red-600 transform hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Enviar y recibir simulacion
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Al enviar aceptas nuestra{' '}
              <a href="#" className="text-red-500 hover:underline">
                Politica de Privacidad
              </a>
            </p>
          </form>
        </div>
      </section>

      <section className="py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Preguntas Frecuentes
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-800 transition-colors text-left"
                >
                  <span className="font-semibold text-white text-lg pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-6 h-6 text-red-500 transition-transform flex-shrink-0 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-5"
                    >
                      <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="footer" className="bg-black text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Bike className="w-8 h-8 text-red-500" />
                <span className="text-xl font-bold text-white">RiderMex</span>
              </div>
              <p className="text-gray-500">
                Construyendo retiros con rendimientos reales respaldados por tiendas de motocicletas
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Enlaces</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-500 hover:text-white transition-colors">
                    Aviso de Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-white transition-colors">
                    Terminos y Condiciones
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-white transition-colors">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contacto</h3>
              <div className="space-y-2 text-gray-500">
                <p>+52 998 202 4327</p>
                <p>contacto@ridermex.com</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-gray-500 text-sm">
              2025 RiderMex. Todos los derechos reservados.
            </p>
            <p className="text-center text-gray-600 text-xs mt-4">
              <strong>Nota legal:</strong> Proyecciones informativas; no constituyen oferta publica ni garantia de rendimiento.
              Sujeto a contrato, desempeno operativo y condiciones de mercado.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RetirementFutureLandingPage;
