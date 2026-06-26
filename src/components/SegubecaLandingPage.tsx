import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator, Shield, TrendingUp, Award, CheckCircle, ArrowRight, Star,
  ChevronDown, Zap, Phone, Calendar, Users, BadgeCheck, DollarSign,
  Send, Home, LineChart as LineChartIcon, FileText, Building2, Lock, RefreshCw, BarChart3,
  Coins, Target, Heart, Baby, GraduationCap, Bike, Store
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { calculateResults as calcResults } from '../utils/calculations';
import { RIDERMEX_CONFIG } from '../data/ridermexConfig';
import { Investment } from '../types';

interface SegubecaLandingPageProps {
  onGetStarted?: () => void;
  onBack?: () => void;
}

const buildInvestment = (tickets: number, years: number, reinvestPercent: number): Investment => {
  const ticketPrice = RIDERMEX_CONFIG.TICKET_PRICE;
  return {
    initialCertificates: tickets,
    certificateBasePrice: ticketPrice,
    initialPayment: ticketPrice,
    years,
    annualProfit: 20.44,
    increaseLemonPrice: false,
    lemonPriceIncrease: 0,
    enableMarketGrowth: true,
    marketGrowthRate: 5,
    usePresentValue: false,
    reinvestProfits: reinvestPercent > 0,
    additionalContributions: false,
    monthlyContribution: 0,
    currencyFormat: 'MXN',
    exchangeRate: 20,
    exchangeRateEUR: 21.70,
    inflationRate: RIDERMEX_CONFIG.INFLATION_RATE,
    applyTaxes: false,
    taxRate: 30,
    partialCashOut: reinvestPercent < 100,
    cashOutPercentage: 100 - reinvestPercent,
    yearlyCashOutPercentages: Array(30).fill(100 - reinvestPercent),
    appreciationRate: RIDERMEX_CONFIG.ANNUAL_APPRECIATION,
    cetesRate: 7.5,
    savingsRate: 4.0,
    realEstateRate: 8.0,
    realEstateAppreciation: 8,
    realEstateRent: 6,
    ebitdaFactor: 10,
    averageProductionPerHectare: 24500,
    averageSalePricePerKg: 30,
    isLongTermCalculator: false,
    firstYearUtilityToUser: false,
    commissionRate: 0.05,
    citrusReinvestment: true,
    citrusReinvestmentPercentages: Array(30).fill(reinvestPercent),
    enablePaymentBoost: false,
    paymentBoostGrowthRate: 0,
    investorFactor: 65,
    investorName: '',
    investorPhone: '',
    investorEmail: '',
    executiveName: '',
    executivePhone: '',
    executiveEmail: '',
    downPaymentPercentage: 100,
    enableCustomPayments: false,
    customPaymentSchedule: [],
    financingInterestRate: 0,
    enableCustomDownPaymentSchedule: false,
    customDownPaymentSchedule: [],
    downPaymentInstallments: 1,
    customInvestmentRate: 8,
    customInvestmentName: 'Mi Inversion',
    investorAnnualReturn: 20,
    investorPriceAppreciation: RIDERMEX_CONFIG.ANNUAL_APPRECIATION,
    financingDownPaymentPercent: 100,
    financingAnnualInterestRate: 0,
    ridermexProductType: 'B',
    ridermexFirstMonthlyIncome: 7,
    ridermexScenario: 'moderate',
    ridermexEscalon: 1,
    ridermexEntryPrice: ticketPrice,
    ridermexDownPaymentAmount: ticketPrice,
    ridermexFinancingMonths: 0
  };
};

const SegubecaLandingPage: React.FC<SegubecaLandingPageProps> = ({ onGetStarted, onBack }) => {
  const [numTickets, setNumTickets] = useState(1);
  const [timeHorizon, setTimeHorizon] = useState(15);
  const [reinvestmentScenario, setReinvestmentScenario] = useState(50);
  const [showResults, setShowResults] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    whatsapp: '',
    correo: '',
    cantidadTickets: 1,
    escenarioReinversion: 50,
    plazo: 15
  });

  const ticketPrice = RIDERMEX_CONFIG.TICKET_PRICE;

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const computeResults = () => {
    const inv100 = buildInvestment(numTickets, timeHorizon, 100);
    const inv50 = buildInvestment(numTickets, timeHorizon, 50);
    const inv0 = buildInvestment(numTickets, timeHorizon, 0);

    let full, partial, none;
    try { full = calcResults(inv100); } catch { full = null; }
    try { partial = calcResults(inv50); } catch { partial = null; }
    try { none = calcResults(inv0); } catch { none = null; }

    const fallback = { finalPatrimony: numTickets * ticketPrice, finalMonthlyIncome: numTickets * RIDERMEX_CONFIG.QUARTERLY_PAYMENT / 3, capitalMultiplier: 1, certificatesSummary: { totalCertificates: numTickets, initialCertificates: numTickets, fromReinvestment: 0 } };

    const current = reinvestmentScenario === 100 ? (full || fallback) : reinvestmentScenario === 50 ? (partial || fallback) : (none || fallback);

    return {
      fullReinvestment: full || fallback,
      partialReinvestment: partial || fallback,
      noReinvestment: none || fallback,
      currentScenario: current
    };
  };

  const results = showResults ? computeResults() : null;

  const generateMultiYearProjection = () => {
    const projections = [];
    for (const years of [5, 10, 15, 20, 25]) {
      let full, partial, none;
      try { full = calcResults(buildInvestment(numTickets, years, 100)); } catch { full = null; }
      try { partial = calcResults(buildInvestment(numTickets, years, 50)); } catch { partial = null; }
      try { none = calcResults(buildInvestment(numTickets, years, 0)); } catch { none = null; }

      projections.push({
        years,
        reinvierteHall: full?.finalPatrimony || numTickets * ticketPrice,
        reinvierteMitad: partial?.finalPatrimony || numTickets * ticketPrice,
        cobraTodo: none?.finalPatrimony || numTickets * ticketPrice,
        ingresoFull: full?.finalMonthlyIncome || 0,
        ingresoPartial: partial?.finalMonthlyIncome || 0,
        ingresoNone: none?.finalMonthlyIncome || 0
      });
    }
    return projections;
  };

  const handleExecuteCalculator = () => {
    setShowResults(true);
    setTimeout(() => {
      document.getElementById('resultados')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleClearData = () => {
    setNumTickets(1);
    setTimeHorizon(15);
    setReinvestmentScenario(50);
    setShowResults(false);
  };

  const handleSendWhatsApp = () => {
    const message = `Hola, quiero informacion sobre mi simulacion Segubeca RiderMex:\n\n` +
      `Tickets: ${numTickets}\n` +
      `Plazo: ${timeHorizon} anos\n` +
      `Reinversion: ${reinvestmentScenario}%\n` +
      `Inversion inicial: ${formatCurrency(numTickets * ticketPrice, 'MXN')}\n\n` +
      `Quiero recibir mi proyeccion personalizada.`;
    window.open(`https://wa.me/529982024327?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        const response = await fetch(`${supabaseUrl}/rest/v1/investment_leads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            nombre_completo: formData.nombre,
            whatsapp: formData.whatsapp,
            correo: formData.correo || null,
            cantidad_certificados: formData.cantidadTickets,
            modalidad: 'ridermex-b',
            escenario_reinversion: formData.escenarioReinversion,
            plazo_anos: formData.plazo,
            requiere_financiamiento: false,
            campaign_source: 'segubeca-ridermex-2025'
          })
        });

        if (!response.ok) {
          console.error('Error guardando lead en Supabase');
        }
      }
    } catch (error) {
      console.error('Error en integracion Supabase:', error);
    }

    const whatsappMessage = `Nuevo lead - Segubeca RiderMex 2025:\n\n` +
      `Nombre: ${formData.nombre}\n` +
      `WhatsApp: ${formData.whatsapp}\n` +
      `Correo: ${formData.correo || 'No proporcionado'}\n` +
      `Tickets: ${formData.cantidadTickets}\n` +
      `Reinversion: ${formData.escenarioReinversion}%\n` +
      `Plazo: ${formData.plazo} anos`;

    window.open(`https://wa.me/529982024327?text=${encodeURIComponent(whatsappMessage)}`, '_blank');

    alert('Gracias! En breve recibiras tu proyeccion personalizada.');
    setShowFormModal(false);
    setFormData({
      nombre: '',
      whatsapp: '',
      correo: '',
      cantidadTickets: 1,
      escenarioReinversion: 50,
      plazo: 15
    });
  };

  const scrollToCalculator = () => {
    document.getElementById('calculadora')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToForm = () => {
    setShowFormModal(true);
  };

  return (
    <div className="min-h-screen bg-black">
      {showStickyBar && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-700 to-red-900 text-white py-3 px-4 shadow-lg"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="font-semibold">Segubeca RiderMex - Patrimonio educativo con rendimientos reales</span>
            <div className="flex gap-3">
              <button
                onClick={scrollToCalculator}
                className="px-4 py-2 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
              >
                Calcula tus rendimientos
              </button>
              <button
                onClick={scrollToForm}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-400 transition-colors text-sm border border-red-400"
              >
                Solicitar proyeccion
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
              <span className="text-2xl font-bold text-white tracking-tight">RiderMex</span>
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
              <div className="inline-flex items-center gap-2 bg-red-900/40 border border-red-800 px-4 py-2 rounded-full mb-6">
                <Bike className="w-5 h-5 text-red-500" />
                <span className="text-sm font-semibold text-red-400">Segubeca RiderMex</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Asegura la educacion de tus hijos con <span className="text-red-500">rendimientos reales</span>
              </h1>
              <p className="text-xl text-gray-300 mb-4">
                Con tickets de participacion en tiendas RiderMex, tu ahorro educativo crece sobre un negocio real de motocicletas, no sobre tasas financieras.
              </p>
              <p className="text-lg text-gray-400 mb-6">
                Desde <strong className="text-white">1 ticket</strong> ya generas rendimientos trimestrales
              </p>
              <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-800 inline-block">
                <p className="text-sm text-gray-400 mb-1">Cada ticket de participacion:</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-red-500">{formatCurrency(ticketPrice, 'MXN')}</span>
                  <span className="text-xs text-gray-500">Escalon Fundador</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">1 ticket de participacion en tienda RiderMex</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                  onClick={scrollToCalculator}
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-lg hover:from-red-500 hover:to-red-600 transform hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  Calcula tus rendimientos
                  <Calculator className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 bg-gray-900 text-red-500 border border-red-700 rounded-xl font-bold text-lg hover:bg-gray-800 transform hover:scale-105 transition-all shadow-lg"
                >
                  Como funciona
                </button>
              </div>
              <p className="text-sm text-red-400 font-semibold">
                Segubeca RiderMex - patrimonio educativo con negocio real
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-red-900/40 rounded-xl">
                    <TrendingUp className="w-8 h-8 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Ejemplo real</h3>
                    <p className="text-gray-400">1 ticket a 15 anos</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {(() => {
                    let ex100, ex50, ex0;
                    try { ex100 = calcResults(buildInvestment(1, 15, 100)); } catch { ex100 = null; }
                    try { ex50 = calcResults(buildInvestment(1, 15, 50)); } catch { ex50 = null; }
                    try { ex0 = calcResults(buildInvestment(1, 15, 0)); } catch { ex0 = null; }
                    return (
                      <>
                        <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 rounded-xl p-4 border border-red-800/40">
                          <p className="text-sm text-gray-400 mb-1">Reinvirtiendo 100%</p>
                          <p className="text-3xl font-bold text-red-500">{formatCurrency(ex100?.finalPatrimony || 0, 'MXN')}</p>
                          <p className="text-xs text-gray-500 mt-1">Patrimonio total</p>
                        </div>
                        <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 rounded-xl p-4 border border-gray-700/40">
                          <p className="text-sm text-gray-400 mb-1">Reinvirtiendo 50%</p>
                          <p className="text-3xl font-bold text-white">{formatCurrency(ex50?.finalPatrimony || 0, 'MXN')}</p>
                          <p className="text-xs text-gray-500 mt-1">Balance crecimiento + liquidez</p>
                        </div>
                        <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 rounded-xl p-4 border border-gray-700/40">
                          <p className="text-sm text-gray-400 mb-1">Sin reinversion (cobra todo)</p>
                          <p className="text-3xl font-bold text-gray-300">{formatCurrency(ex0?.finalMonthlyIncome || 0, 'MXN')}/mes</p>
                          <p className="text-xs text-gray-500 mt-1">Ingreso mensual constante</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <div className="mt-6 text-center">
                  <button
                    onClick={scrollToCalculator}
                    className="text-sm text-red-500 font-semibold hover:underline"
                  >
                    Personalizar con mis datos →
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="comparativo-objetivo" className="py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Segubeca Tradicional vs Segubeca RiderMex
          </h2>
          <p className="text-xl text-gray-400 text-center mb-6">
            La diferencia entre ahorrar para la universidad y construir patrimonio generacional
          </p>
          <p className="text-center text-lg font-semibold text-red-500 mb-12">
            Ejemplo con 1 ticket = {formatCurrency(ticketPrice, 'MXN')} a 25 anos
          </p>

          {(() => {
            const baseYears = 25;
            const segubecaTradicional = ticketPrice * Math.pow(1.06, baseYears);

            let res100, res50, res0;
            try { res100 = calcResults(buildInvestment(1, baseYears, 100)); } catch { res100 = null; }
            try { res50 = calcResults(buildInvestment(1, baseYears, 50)); } catch { res50 = null; }
            try { res0 = calcResults(buildInvestment(1, baseYears, 0)); } catch { res0 = null; }

            const icm100Final = res100?.finalPatrimony || ticketPrice;
            const icm100Income = res100?.finalMonthlyIncome || 0;
            const icm100Certs = res100?.certificatesSummary?.totalCertificates || 1;

            const icm50Final = res50?.finalPatrimony || ticketPrice;
            const icm50Income = res50?.finalMonthlyIncome || 0;
            const icm50Certs = res50?.certificatesSummary?.totalCertificates || 1;

            const icm0Final = res0?.finalPatrimony || ticketPrice;
            const icm0Income = res0?.finalMonthlyIncome || 0;
            const icm0Accumulated = icm0Income * 12 * 21;

            return (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-4 bg-gray-800 rounded-xl">
                        <GraduationCap className="w-8 h-8 text-gray-400" />
                      </div>
                      <span className="text-xs font-semibold text-gray-500 uppercase">Tradicional</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Segubeca Clasica</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Capital al termino</p>
                        <p className="text-3xl font-bold text-gray-300">{formatCurrency(segubecaTradicional, 'MXN')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Rendimiento anual</p>
                        <p className="text-xl font-semibold text-gray-300">6%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Despues de la graduacion</p>
                        <p className="text-lg font-bold text-red-600">$0 / mes</p>
                        <p className="text-xs text-red-500 mt-1">El capital se agota</p>
                      </div>
                      <div className="pt-4 border-t border-gray-700">
                        <p className="text-xs text-gray-500">
                          Termina cuando tu hijo se gradua. No hay ingreso residual.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gray-900 rounded-2xl p-8 shadow-xl border border-yellow-700 relative"
                  >
                    <div className="absolute -top-3 -right-3 bg-yellow-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                      FLUJO CONSTANTE
                    </div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-4 bg-yellow-900/30 rounded-xl">
                        <DollarSign className="w-8 h-8 text-yellow-500" />
                      </div>
                      <span className="text-xs font-semibold text-yellow-500 uppercase">Reinversion 0%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">RiderMex Sin Reinvertir</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Capital preservado</p>
                        <p className="text-3xl font-bold text-yellow-500">{formatCurrency(icm0Final, 'MXN')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Ingreso mensual</p>
                        <p className="text-xl font-semibold text-yellow-500">{formatCurrency(icm0Income, 'MXN')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Total cobrado en 21 anos</p>
                        <p className="text-lg font-bold text-yellow-500">{formatCurrency(icm0Accumulated, 'MXN')}</p>
                        <p className="text-xs text-green-500 mt-1">+ Capital intacto</p>
                      </div>
                      <div className="pt-4 border-t border-gray-700">
                        <p className="text-xs text-gray-300 font-semibold">
                          Pagas la universidad CON LOS RENDIMIENTOS y conservas tu capital original para siempre.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    viewport={{ once: true }}
                    className="bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-600 relative"
                  >
                    <div className="absolute -top-3 -right-3 bg-gray-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                      BALANCE OPTIMO
                    </div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-4 bg-gray-800 rounded-xl">
                        <RefreshCw className="w-8 h-8 text-gray-300" />
                      </div>
                      <span className="text-xs font-semibold text-gray-400 uppercase">Reinversion 50%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">RiderMex Reinvirtiendo 50%</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Patrimonio final</p>
                        <p className="text-3xl font-bold text-white">{formatCurrency(icm50Final, 'MXN')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Tickets totales</p>
                        <p className="text-xl font-semibold text-white">{icm50Certs.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Ingreso mensual al termino</p>
                        <p className="text-lg font-bold text-white">{formatCurrency(icm50Income, 'MXN')}</p>
                        <p className="text-xs text-gray-400 mt-1">Equilibrio perfecto</p>
                      </div>
                      <div className="pt-4 border-t border-gray-700">
                        <p className="text-xs text-gray-300 font-semibold">
                          Balance ideal: multiplicas patrimonio mientras disfrutas ingresos durante el proceso.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-red-700 to-red-900 rounded-2xl p-8 shadow-xl border border-red-600 relative text-white"
                  >
                    <div className="absolute -top-3 -right-3 bg-yellow-500 text-gray-900 px-4 py-1 rounded-full text-xs font-bold">
                      MAXIMO CRECIMIENTO
                    </div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-4 bg-white/10 rounded-xl">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-white uppercase">Reinversion 100%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">RiderMex Reinvirtiendo 100%</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-white/80 mb-1">Patrimonio final</p>
                        <p className="text-3xl font-bold text-white">{formatCurrency(icm100Final, 'MXN')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-white/80 mb-1">Tickets totales</p>
                        <p className="text-xl font-semibold text-white">{icm100Certs.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-white/80 mb-1">Ingreso mensual al termino</p>
                        <p className="text-lg font-bold text-yellow-300">{formatCurrency(icm100Income, 'MXN')}</p>
                        <p className="text-xs text-white/90 mt-1">Para siempre</p>
                      </div>
                      <div className="pt-4 border-t border-white/20">
                        <p className="text-xs text-white font-semibold">
                          Multiplicas tu patrimonio Y generas un ingreso mensual perpetuo despues de la graduacion.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-800 max-w-5xl mx-auto">
                  <div className="text-center mb-6">
                    <Target className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">
                      La Ventaja RiderMex: Tu Eliges Tu Estrategia
                    </h3>
                    <p className="text-gray-400">
                      Puedes combinar ambos enfoques: reinvertir durante la universidad y cobrar despues
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
                      <p className="text-sm text-gray-400 mb-2">Multiplicador vs Segubeca</p>
                      <p className="text-4xl font-bold text-red-500">
                        {(icm100Final / segubecaTradicional).toFixed(1)}x
                      </p>
                      <p className="text-xs text-gray-400 mt-2">Mas patrimonio con reinversion 100%</p>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
                      <p className="text-sm text-gray-400 mb-2">Ingreso mensual maximo</p>
                      <p className="text-4xl font-bold text-red-500">
                        {formatCurrency(icm100Income, 'MXN')}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">Con reinversion 100%</p>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
                      <p className="text-sm text-gray-400 mb-2">Capital protegido</p>
                      <p className="text-4xl font-bold text-red-500">
                        100%
                      </p>
                      <p className="text-xs text-gray-400 mt-2">Siempre disponible</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-xl p-6 text-white">
                    <div className="flex items-start gap-4">
                      <Zap className="w-8 h-8 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="text-xl font-bold mb-3">Estrategia Inteligente Recomendada</h4>
                        <div className="space-y-2 text-sm">
                          <p className="flex items-start gap-2">
                            <span className="text-yellow-300 font-bold">1.</span>
                            <span><strong>Meses 1-6:</strong> Periodo de construccion y aclientado de la tienda</span>
                          </p>
                          <p className="flex items-start gap-2">
                            <span className="text-yellow-300 font-bold">2.</span>
                            <span><strong>Mes 7 en adelante:</strong> Reinvierte el 100% de rendimientos para multiplicar tickets</span>
                          </p>
                          <p className="flex items-start gap-2">
                            <span className="text-yellow-300 font-bold">3.</span>
                            <span><strong>Durante la universidad:</strong> Cambia a cobrar 100% para pagar colegiaturas con los rendimientos</span>
                          </p>
                          <p className="flex items-start gap-2">
                            <span className="text-yellow-300 font-bold">4.</span>
                            <span><strong>Despues de graduarse:</strong> Tu hijo recibe un ingreso mensual de {formatCurrency(icm100Income, 'MXN')} para iniciar su vida profesional</span>
                          </p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/20">
                          <p className="font-semibold">
                            Resultado: Pagas la universidad Y le heredas un patrimonio que genera ingresos perpetuos
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </section>

      <section id="comparativa-inicial" className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            RiderMex vs Inversiones Tradicionales
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12">
            Por que un negocio real de motocicletas es superior
          </p>
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
              <thead>
                <tr className="bg-gradient-to-r from-red-700 to-red-900 text-white">
                  <th className="px-6 py-4 text-left font-bold">Aspecto</th>
                  <th className="px-6 py-4 text-left font-bold">Inversion Tradicional</th>
                  <th className="px-6 py-4 text-left font-bold">RiderMex</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-800">
                  <td className="px-6 py-4 font-semibold text-white">Rendimiento anual</td>
                  <td className="px-6 py-4 text-gray-400">5-7% simple</td>
                  <td className="px-6 py-4 text-red-500 font-bold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    ~20% sobre negocio real de motos
                  </td>
                </tr>
                <tr className="bg-gray-900">
                  <td className="px-6 py-4 font-semibold text-white">Respaldo con activo real</td>
                  <td className="px-6 py-4 text-gray-400">No (especulativo)</td>
                  <td className="px-6 py-4 text-red-500 font-bold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Si (tienda fisica + inventario)
                  </td>
                </tr>
                <tr className="bg-gray-800">
                  <td className="px-6 py-4 font-semibold text-white">Control sobre rendimientos</td>
                  <td className="px-6 py-4 text-gray-400">Nulo</td>
                  <td className="px-6 py-4 text-red-500 font-bold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Total (decides cada trimestre)
                  </td>
                </tr>
                <tr className="bg-gray-900">
                  <td className="px-6 py-4 font-semibold text-white">Accesibilidad</td>
                  <td className="px-6 py-4 text-gray-400">Inversion completa inicial</td>
                  <td className="px-6 py-4 text-red-500 font-bold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Desde {formatCurrency(ticketPrice, 'MXN')} por ticket
                  </td>
                </tr>
                <tr className="bg-gray-800">
                  <td className="px-6 py-4 font-semibold text-white">Proteccion legal</td>
                  <td className="px-6 py-4 text-gray-400">Poliza unica</td>
                  <td className="px-6 py-4 text-red-500 font-bold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Triple fideicomiso en {RIDERMEX_CONFIG.BANK}
                  </td>
                </tr>
                <tr className="bg-gray-900">
                  <td className="px-6 py-4 font-semibold text-white">Continuidad post-meta</td>
                  <td className="px-6 py-4 text-gray-400">Termina cuando se usa</td>
                  <td className="px-6 py-4 text-red-500 font-bold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Genera ingresos perpetuos
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-center mt-8">
            <p className="text-lg text-gray-300 font-semibold">
              RiderMex no se basa en intereses financieros, se basa en <span className="text-red-500">ventas reales de motocicletas</span>
            </p>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="py-16 bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Como Funciona Segubeca RiderMex
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12">
            El modelo de negocio real que multiplica tu patrimonio educativo
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                number: '1',
                icon: Coins,
                title: 'Adquieres tickets',
                description: '1 ticket = participacion en una tienda RiderMex de motocicletas',
                color: 'from-red-600 to-red-700'
              },
              {
                number: '2',
                icon: Store,
                title: 'Tienda operando',
                description: 'La tienda vende ~480 motocicletas al ano generando utilidades reales',
                color: 'from-red-700 to-red-800'
              },
              {
                number: '3',
                icon: DollarSign,
                title: 'Generas rendimientos',
                description: 'Cada trimestre recibes rendimientos de la operacion de la tienda',
                color: 'from-red-800 to-red-900'
              },
              {
                number: '4',
                icon: RefreshCw,
                title: 'Tu decides',
                description: 'Reinviertes todo, la mitad o cobras completo cada trimestre',
                color: 'from-gray-700 to-gray-800'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-800 hover:border-red-800 transition-colors"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center text-white text-2xl font-bold mb-4`}>
                  {step.number}
                </div>
                <div className="p-3 bg-red-900/30 rounded-xl inline-block mb-4">
                  <step.icon className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <div className="bg-gray-900 rounded-2xl p-8 inline-block shadow-xl border border-gray-800">
              <p className="text-2xl font-bold text-white mb-2">
                Tu dinero crece con un <span className="text-red-500">negocio real</span>
              </p>
              <p className="text-gray-400">
                Cada trimestre, tu eliges como multiplicar o disfrutar tus rendimientos
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="calculadora" className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Calculadora de Rendimientos RiderMex
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12">
            Descubre cuanto puedes generar para la educacion de tus hijos
          </p>
          <div className="bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-800">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Cantidad de tickets
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={numTickets}
                    onChange={(e) => setNumTickets(parseInt(e.target.value))}
                    className="flex-1 h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                  <span className="text-2xl font-bold text-red-500 min-w-[60px]">{numTickets}</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Inversion total: <strong className="text-white">{formatCurrency(numTickets * ticketPrice, 'MXN')}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Plazo de inversion
                </label>
                <select
                  value={timeHorizon}
                  onChange={(e) => setTimeHorizon(parseInt(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:border-red-500 focus:ring-2 focus:ring-red-900 outline-none transition-colors text-lg font-semibold"
                >
                  <option value={5}>5 anos</option>
                  <option value={10}>10 anos</option>
                  <option value={15}>15 anos</option>
                  <option value={20}>20 anos</option>
                  <option value={25}>25 anos</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Escenario de reinversion
                </label>
                <div className="flex gap-3">
                  {[
                    { value: 100, label: '100%' },
                    { value: 50, label: '50%' },
                    { value: 0, label: '0%' }
                  ].map((scenario) => (
                    <button
                      key={scenario.value}
                      onClick={() => setReinvestmentScenario(scenario.value)}
                      className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                        reinvestmentScenario === scenario.value
                          ? 'bg-red-600 text-white shadow-lg'
                          : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-red-700'
                      }`}
                    >
                      {scenario.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {reinvestmentScenario === 100 && 'Maximo crecimiento exponencial'}
                  {reinvestmentScenario === 50 && 'Balance entre crecimiento y liquidez'}
                  {reinvestmentScenario === 0 && 'Ingreso trimestral constante sin multiplicacion'}
                </p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
              <div className="flex items-start gap-3">
                <Bike className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div className="text-sm text-gray-300">
                  <p className="mb-2">
                    <strong>Cada ticket equivale a:</strong> 1 ticket de participacion en tienda RiderMex
                  </p>
                  <p>
                    <strong>Valor actual:</strong> {formatCurrency(ticketPrice, 'MXN')} | <strong>Rendimiento trimestral:</strong> {formatCurrency(RIDERMEX_CONFIG.QUARTERLY_PAYMENT, 'MXN')}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <button
                onClick={handleExecuteCalculator}
                className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-500 hover:to-red-600 transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Calculator className="w-5 h-5" />
                Ejecutar calculo
              </button>
              <button
                onClick={handleClearData}
                className="px-6 py-4 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Borrar datos
              </button>
              <button
                onClick={() => setShowFormModal(true)}
                className="px-6 py-4 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 border border-gray-700"
              >
                <Send className="w-5 h-5" />
                Por correo
              </button>
              <button
                onClick={handleSendWhatsApp}
                className="px-6 py-4 bg-green-700 text-white rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Por WhatsApp
              </button>
            </div>

            {showResults && results && (
              <motion.div
                id="resultados"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl"
              >
                <h3 className="text-2xl font-bold text-white mb-6">Tus Resultados Proyectados</h3>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-red-700 to-red-900 rounded-xl p-6 text-white">
                    <p className="text-sm opacity-90 mb-2">Patrimonio Final</p>
                    <p className="text-3xl font-bold">{formatCurrency(results.currentScenario.finalPatrimony, 'MXN')}</p>
                    <p className="text-xs opacity-80 mt-2">En {timeHorizon} anos</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-6 text-white">
                    <p className="text-sm opacity-90 mb-2">Ingreso Mensual</p>
                    <p className="text-3xl font-bold">{formatCurrency(results.currentScenario.finalMonthlyIncome, 'MXN')}</p>
                    <p className="text-xs opacity-80 mt-2">Al final del periodo</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-6 text-white">
                    <p className="text-sm opacity-90 mb-2">Tickets Totales</p>
                    <p className="text-3xl font-bold">{results.currentScenario.certificatesSummary?.totalCertificates?.toFixed(2) || numTickets}</p>
                    <p className="text-xs opacity-80 mt-2">Multiplicador: {results.currentScenario.capitalMultiplier?.toFixed(2) || '1.00'}x</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <section id="proyeccion-multianual" className="py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Proyeccion de Rendimientos Multi-Anual
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12">
            Asi crece tu inversion segun tu decision de reinversion
          </p>
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
              <thead>
                <tr className="bg-gradient-to-r from-red-700 to-red-900 text-white">
                  <th className="px-6 py-4 text-left font-bold">Plazo (anos)</th>
                  <th className="px-6 py-4 text-left font-bold">Reinvierte Todo</th>
                  <th className="px-6 py-4 text-left font-bold">Reinvierte Mitad</th>
                  <th className="px-6 py-4 text-left font-bold">Cobra Todo</th>
                </tr>
              </thead>
              <tbody>
                {generateMultiYearProjection().map((proj, index) => (
                  <tr key={proj.years} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}>
                    <td className="px-6 py-4 font-bold text-white">{proj.years} anos</td>
                    <td className="px-6 py-4">
                      <p className="text-lg font-bold text-red-500">{formatCurrency(proj.reinvierteHall, 'MXN')}</p>
                      <p className="text-sm text-gray-400">{formatCurrency(proj.ingresoFull, 'MXN')}/mes</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-lg font-bold text-white">{formatCurrency(proj.reinvierteMitad, 'MXN')}</p>
                      <p className="text-sm text-gray-400">{formatCurrency(proj.ingresoPartial, 'MXN')}/mes</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-lg font-bold text-gray-300">{formatCurrency(proj.cobraTodo, 'MXN')}</p>
                      <p className="text-sm text-gray-400">{formatCurrency(proj.ingresoNone, 'MXN')}/mes</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-8">
            <p className="text-lg text-gray-300 font-semibold">
              Tu controlas el crecimiento. <span className="text-red-500">Tu decides cada trimestre.</span>
            </p>
          </div>
        </div>
      </section>

      <section id="seguridad" className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Seguridad, Respaldo y Estructura Legal
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12">
            Tu inversion protegida bajo triple fideicomiso en {RIDERMEX_CONFIG.BANK}
          </p>

          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Estructura de Fideicomisos</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Building2,
                  title: RIDERMEX_CONFIG.TRUSTS.ASSETS,
                  description: 'Resguarda los activos fisicos y contratos de la tienda para proteccion del socio'
                },
                {
                  icon: BarChart3,
                  title: RIDERMEX_CONFIG.TRUSTS.OPERATIONS,
                  description: 'Administra la operacion del negocio y distribuye los rendimientos segun contrato'
                },
                {
                  icon: Shield,
                  title: RIDERMEX_CONFIG.TRUSTS.COLLECTION,
                  description: 'Garantiza el cobro y reparto transparente de utilidades a cada socio'
                }
              ].map((fidei, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-800"
                >
                  <div className="p-4 bg-red-900/30 rounded-xl inline-block mb-4">
                    <fidei.icon className="w-8 h-8 text-red-500" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">{fidei.title}</h4>
                  <p className="text-gray-400">{fidei.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Cobertura de Seguros</h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  icon: Shield,
                  title: RIDERMEX_CONFIG.INSURANCE.ASSETS.name,
                  description: RIDERMEX_CONFIG.INSURANCE.ASSETS.coverage
                },
                {
                  icon: Lock,
                  title: RIDERMEX_CONFIG.INSURANCE.PATRIMONIAL.name,
                  description: RIDERMEX_CONFIG.INSURANCE.PATRIMONIAL.description
                }
              ].map((seguro, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-800"
                >
                  <div className="p-4 bg-gray-800 rounded-xl inline-block mb-4">
                    <seguro.icon className="w-8 h-8 text-red-500" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">{seguro.title}</h4>
                  <p className="text-gray-400">{seguro.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Validacion Legal</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: FileText,
                  title: 'Triple fideicomiso',
                  description: `En ${RIDERMEX_CONFIG.BANK}`
                },
                {
                  icon: CheckCircle,
                  title: 'Supervision documentada',
                  description: 'Avances fisicos y financieros'
                },
                {
                  icon: BadgeCheck,
                  title: 'Aliados financieros',
                  description: RIDERMEX_CONFIG.FINANCIAL_PARTNERS.join(', ')
                },
                {
                  icon: Award,
                  title: 'Seguros completos',
                  description: 'Inventario y proteccion patrimonial'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-900 rounded-xl p-6 shadow-md border border-gray-800 text-center"
                >
                  <div className="p-3 bg-red-900/30 rounded-xl inline-block mb-3">
                    <item.icon className="w-6 h-6 text-red-500" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-gray-300 mb-6">
              Tu inversion esta protegida bajo esquemas legales y asegurada ante cualquier eventualidad
            </p>
            <button
              onClick={() => window.open('https://wa.me/529982024327?text=Quiero ver la carpeta legal completa de RiderMex', '_blank')}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-lg hover:from-red-500 hover:to-red-600 transform hover:scale-105 transition-all shadow-xl inline-flex items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Solicitar carpeta legal completa
            </button>
          </div>
        </div>
      </section>

      <section id="testimonios" className="py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Historias Reales de Socios RiderMex
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12">
            Quienes ya estan construyendo patrimonio educativo con motocicletas
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Andrea Martinez',
                city: 'Ciudad de Mexico',
                role: 'Profesionista',
                photo: 'AM',
                text: 'Compre 2 tickets pensando en la universidad de mi hija. En un ano ya estoy reinvirtiendo rendimientos y acumulando mas tickets automaticamente.',
                rating: 5,
                highlight: 'Crecimiento'
              },
              {
                name: 'Roberto Sanchez',
                city: 'Cancun',
                role: 'Empresario',
                photo: 'RS',
                text: 'Cada trimestre decido cuanto reinvierto segun mis necesidades. El negocio de motos es tangible y los rendimientos son puntuales.',
                rating: 5,
                highlight: 'Flexibilidad'
              },
              {
                name: 'Familia Gonzalez',
                city: 'Guadalajara',
                role: 'Familia inversionista',
                photo: 'FG',
                text: 'Compramos 3 tickets para la educacion de nuestros hijos. La tranquilidad de tener triple fideicomiso y seguros nos da mucha confianza.',
                rating: 5,
                highlight: 'Seguridad'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-800 hover:border-red-800 transition-colors"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="inline-block px-3 py-1 bg-red-900/30 text-red-400 text-xs font-semibold rounded-full mb-4">
                  {testimonial.highlight}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3 border-t border-gray-700 pt-4">
                  <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center text-red-500 font-bold text-sm">{testimonial.photo}</div>
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                    <p className="text-sm text-red-500 font-semibold">{testimonial.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="comparativa-final" className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Comparativa Final: Toma la Decision Correcta
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12">
            Ninguna inversion tradicional puede igualar el control y crecimiento de RiderMex
          </p>
          <div className="overflow-x-auto mb-8">
            <table className="w-full bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="px-6 py-4 text-left font-bold">Aspecto Clave</th>
                  <th className="px-6 py-4 text-center font-bold">Inversion Tradicional</th>
                  <th className="px-6 py-4 text-center font-bold bg-red-900">RiderMex</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    aspect: 'Rendimiento anual',
                    traditional: '5-7% simple',
                    ridermex: '~20% sobre negocio real',
                    traditionalIcon: false,
                    ridermexIcon: true
                  },
                  {
                    aspect: 'Activo real',
                    traditional: 'No',
                    ridermex: 'Si (tienda + inventario)',
                    traditionalIcon: false,
                    ridermexIcon: true
                  },
                  {
                    aspect: 'Control de rendimientos',
                    traditional: 'Nulo',
                    ridermex: 'Total (cada trimestre)',
                    traditionalIcon: false,
                    ridermexIcon: true
                  },
                  {
                    aspect: 'Proteccion',
                    traditional: 'Poliza unica',
                    ridermex: 'Triple fideicomiso + seguros',
                    traditionalIcon: false,
                    ridermexIcon: true
                  },
                  {
                    aspect: 'Ingreso post-graduacion',
                    traditional: 'Se acaba',
                    ridermex: 'Perpetuo',
                    traditionalIcon: false,
                    ridermexIcon: true
                  }
                ].map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-800/50' : 'bg-gray-900'}>
                    <td className="px-6 py-4 font-semibold text-white">{row.aspect}</td>
                    <td className="px-6 py-4 text-center text-gray-400">
                      <div className="flex items-center justify-center gap-2">
                        {!row.traditionalIcon && <span className="text-red-500 text-xl">&#10007;</span>}
                        <span>{row.traditional}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center bg-red-900/20">
                      <div className="flex items-center justify-center gap-2">
                        {row.ridermexIcon && <CheckCircle className="w-5 h-5 text-red-500" />}
                        <span className="font-bold text-red-400">{row.ridermex}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-6">
              Los rendimientos varian segun condiciones del mercado y desempeno de la tienda
            </p>
            <button
              onClick={scrollToForm}
              className="px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-xl hover:from-red-500 hover:to-red-600 transform hover:scale-105 transition-all shadow-2xl inline-flex items-center gap-2"
            >
              Quiero mi proyeccion personalizada
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      <section id="cierre-emocional" className="py-20 bg-gradient-to-r from-red-800 to-red-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Bike className="w-20 h-20 text-yellow-300 mx-auto mb-6" />
          <h2 className="text-5xl font-bold mb-6">
            El patrimonio educativo se construye con decisiones inteligentes
          </h2>
          <p className="text-2xl text-red-100 mb-12">
            Con Segubeca RiderMex, tu eliges como, cuando y cuanto crece la educacion de tus hijos
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToForm}
              className="px-10 py-5 bg-white text-red-700 rounded-xl font-bold text-xl hover:bg-gray-100 transform hover:scale-105 transition-all shadow-2xl flex items-center gap-2"
            >
              Quiero invertir con RiderMex
              <ArrowRight className="w-6 h-6" />
            </button>
            <a
              href="https://wa.me/529982024327?text=Hola, quiero informacion sobre Segubeca RiderMex"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-red-700 text-white border border-red-500 rounded-xl font-bold text-xl hover:bg-red-600 transform hover:scale-105 transition-all shadow-2xl flex items-center gap-2"
            >
              <Phone className="w-6 h-6" />
              Hablar con un asesor
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Preguntas Frecuentes
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {[
              {
                question: 'Que es Segubeca RiderMex?',
                answer: 'Es un modelo de ahorro educativo respaldado por un negocio real de venta de motocicletas. Adquieres tickets de participacion en tiendas RiderMex y recibes rendimientos trimestrales que puedes reinvertir para multiplicar tu patrimonio o cobrar para cubrir gastos educativos.'
              },
              {
                question: 'Cuanto cuesta un ticket y que incluye?',
                answer: `Cada ticket cuesta ${formatCurrency(ticketPrice, 'MXN')} y representa una participacion en una tienda RiderMex. Incluye tu parte proporcional de los activos, inventario y utilidades de la tienda. Tu inversion esta protegida por triple fideicomiso en ${RIDERMEX_CONFIG.BANK}.`
              },
              {
                question: 'Que pasa si no quiero reinvertir mis rendimientos?',
                answer: 'Tienes total flexibilidad. Puedes reinvertir el 100%, el 50% o cobrar todo cada trimestre. La decision es completamente tuya y puedes ajustarla segun tus necesidades en cada momento.'
              },
              {
                question: 'Que garantias legales tengo?',
                answer: `Tu inversion esta protegida por 3 fideicomisos independientes en ${RIDERMEX_CONFIG.BANK}: ${RIDERMEX_CONFIG.TRUSTS.ASSETS}, ${RIDERMEX_CONFIG.TRUSTS.OPERATIONS} y ${RIDERMEX_CONFIG.TRUSTS.COLLECTION}. Ademas cuentas con seguros de cobertura amplia y proteccion patrimonial.`
              },
              {
                question: 'Cuando empiezo a recibir rendimientos?',
                answer: 'Con el Modelo B (pago de contado), los primeros rendimientos llegan a partir del mes 7, una vez que la tienda esta construida y operando. A partir de ahi, recibes pagos trimestrales de manera consistente.'
              },
              {
                question: 'Puedo vender mi ticket antes del plazo?',
                answer: `Si, los tickets tienen mercado secundario. Ademas, con el sistema de escalones, los tickets se aprecian aproximadamente ${RIDERMEX_CONFIG.ANNUAL_APPRECIATION}% anual, por lo que puedes venderlo con plusvalia si necesitas liquidez.`
              }
            ].map((faq, index) => (
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
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bike className="w-8 h-8 text-red-500" />
                <span className="text-xl font-bold text-white">RiderMex</span>
              </div>
              <p className="text-gray-500 text-sm mb-4">
                Segubeca RiderMex - Patrimonio educativo con negocio real
              </p>
              <div className="flex items-center gap-2 text-red-400">
                <Award className="w-5 h-5" />
                <span className="text-sm font-semibold">Rendimientos respaldados por ventas reales</span>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Enlaces</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Aviso de Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Contrato Modelo
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Preguntas Frecuentes
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Terminos y Condiciones
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contacto</h3>
              <div className="space-y-3 text-sm">
                <a
                  href="https://wa.me/529982024327"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp RiderMex</span>
                </a>
                <div className="flex items-center gap-2 text-gray-400">
                  <Send className="w-4 h-4" />
                  <span>contacto@ridermex.com</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Proteccion</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-red-500" />
                  <span>Triple fideicomiso</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-red-500" />
                  <span>{RIDERMEX_CONFIG.BANK}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-red-500" />
                  <span>Seguros completos</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-gray-400 text-sm mb-4">
              2025 RiderMex. Todos los derechos reservados.
            </p>
            <p className="text-center text-gray-600 text-xs leading-relaxed max-w-5xl mx-auto">
              <strong>Disclaimer Legal:</strong> RiderMex actua como operador de tiendas de motocicletas y no como institucion financiera.
              La informacion contenida en esta pagina tiene fines informativos y no constituye una oferta publica de inversion ni una garantia de rendimiento futuro.
              Todos los proyectos estan sujetos a condiciones de mercado, disponibilidad y variaciones en el desempeno comercial de las tiendas.
              RiderMex, sus socios o afiliados no asumen responsabilidad alguna por perdidas derivadas de decisiones de inversion basadas en esta informacion.
            </p>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/529982024327?text=Hola, quiero informacion sobre Segubeca RiderMex"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-green-600 hover:bg-green-500 rounded-full shadow-2xl flex items-center justify-center transform hover:scale-110 transition-all"
      >
        <Phone className="w-8 h-8 text-white" />
      </a>

      <AnimatePresence>
        {showFormModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
            onClick={() => setShowFormModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold text-white">Recibe tu Proyeccion Personalizada</h3>
                <button
                  onClick={() => setShowFormModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <span className="text-3xl">&times;</span>
                </button>
              </div>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:border-red-500 focus:ring-2 focus:ring-red-900 outline-none transition-colors"
                    placeholder="Tu nombre completo"
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:border-red-500 focus:ring-2 focus:ring-red-900 outline-none transition-colors"
                    placeholder="+52 99 8202 4327"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Correo electronico (opcional)
                  </label>
                  <input
                    type="email"
                    value={formData.correo}
                    onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:border-red-500 focus:ring-2 focus:ring-red-900 outline-none transition-colors"
                    placeholder="tu@email.com"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Cantidad de tickets *
                    </label>
                    <select
                      required
                      value={formData.cantidadTickets}
                      onChange={(e) => setFormData({ ...formData, cantidadTickets: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:border-red-500 focus:ring-2 focus:ring-red-900 outline-none transition-colors"
                    >
                      <option value={1}>1 ticket</option>
                      <option value={2}>2 tickets</option>
                      <option value={3}>3 tickets</option>
                      <option value={5}>5 tickets</option>
                      <option value={10}>10 tickets</option>
                      <option value={15}>10+ tickets</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Escenario de reinversion *
                    </label>
                    <select
                      required
                      value={formData.escenarioReinversion}
                      onChange={(e) => setFormData({ ...formData, escenarioReinversion: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:border-red-500 focus:ring-2 focus:ring-red-900 outline-none transition-colors"
                    >
                      <option value={100}>Reinvierte todo (100%)</option>
                      <option value={50}>Reinvierte la mitad (50%)</option>
                      <option value={0}>Cobra todo (0%)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Plazo *
                  </label>
                  <select
                    required
                    value={formData.plazo}
                    onChange={(e) => setFormData({ ...formData, plazo: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:border-red-500 focus:ring-2 focus:ring-red-900 outline-none transition-colors"
                  >
                    <option value={5}>5 anos</option>
                    <option value={10}>10 anos</option>
                    <option value={15}>15 anos</option>
                    <option value={20}>20 anos</option>
                    <option value={25}>25 anos</option>
                  </select>
                </div>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    required
                    id="consent-modal"
                    className="mt-1 w-5 h-5 text-red-600 border-gray-600 rounded focus:ring-red-500 bg-gray-800"
                  />
                  <label htmlFor="consent-modal" className="text-sm text-gray-400">
                    Acepto el Aviso de Privacidad y autorizo a RiderMex para contactarme y enviarme informacion sobre inversiones.
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-lg hover:from-red-500 hover:to-red-600 transform hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Enviar mis datos
                </button>
                <p className="text-center text-xs text-gray-500">
                  Tus datos estan protegidos. No compartimos tu informacion con terceros.
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SegubecaLandingPage;
