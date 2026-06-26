import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Award, CheckCircle, ArrowRight, Phone, Star, ChevronDown,
  Calculator, Shield, Target, DollarSign, AlertCircle, Sliders,
  Play, RefreshCw, Users, Building2, FileText,
  ArrowLeft, Home, Clock, Repeat, BarChart3, LineChart, Plus, Check, X,
  Eye, Lock, ChevronUp, PlayCircle, Send, Mail, Zap, PiggyBank, MapPin,
  Scale, Coins, TrendingDown, BadgeCheck, Bike, Store
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart as RechartsLineChart, Line, Cell } from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { useCalculator } from '../context/CalculatorContext';
import { RIDERMEX_CONFIG } from '../data/ridermexConfig';

interface VitaminadaLandingPageProps {
  onGetStarted?: () => void;
  onBack?: () => void;
}

const VitaminadaLandingPage: React.FC<VitaminadaLandingPageProps> = ({ onGetStarted, onBack }) => {
  const { updateInvestment, results } = useCalculator();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const [tickets, setTickets] = useState(1);
  const [years, setYears] = useState(25);
  const [reinvestmentRate, setReinvestmentRate] = useState(100);

  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    tickets: '',
    horizon: '',
    acceptTerms: false
  });

  const ticketPrice = RIDERMEX_CONFIG.TICKET_PRICE;
  const initialInvestment = tickets * ticketPrice;

  useEffect(() => {
    updateInvestment({
      initialCertificates: tickets,
      certificateBasePrice: ticketPrice,
      initialPayment: ticketPrice * tickets,
      years: years,
      reinvestProfits: true,
      reinvestmentPercentages: Array(years).fill(reinvestmentRate),
      increaseLemonPrice: false,
      lemonPriceIncrease: 0,
      partialCashOut: false,
      cashOutPercentage: 0,
      yearlyCashOutPercentages: Array(years).fill(0),
      inflationRate: RIDERMEX_CONFIG.INFLATION_RATE,
      monthlyContribution: 0,
      ridermexProductType: 'B',
      ridermexFirstMonthlyIncome: 7,
      ridermexScenario: 'moderate',
      enableMarketGrowth: true,
      marketGrowthRate: 5,
      appreciationRate: RIDERMEX_CONFIG.ANNUAL_APPRECIATION,
    });
  }, [tickets, years, reinvestmentRate, updateInvestment]);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const calculateProjection = (option: { id: string; rate: number }) => {
    const yearlyData = [];

    if (option.id === 'icm') {
      if (results && results.yearlyData && results.yearlyData.length > 0) {
        results.yearlyData.forEach((yearData, index) => {
          if (index < years) {
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
      let patrimony = initialInvestment;

      for (let year = 1; year <= years; year++) {
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

  const ahorroResult = { finalAmount: ahorroData[ahorroData.length - 1]?.patrimony || initialInvestment, yearlyData: [] };
  const bienRaizResult = { finalAmount: bienRaizData[bienRaizData.length - 1]?.patrimony || initialInvestment, yearlyData: [] };
  const cetesResult = { finalAmount: cetesData[cetesData.length - 1]?.patrimony || initialInvestment, yearlyData: [] };
  const icmResult = { finalAmount: icmData[icmData.length - 1]?.patrimony || initialInvestment, yearlyData: [] };

  const combinedTraditional = ahorroResult.finalAmount + bienRaizResult.finalAmount + cetesResult.finalAmount;

  const generateComparisonChartData = () => {
    return [
      { name: 'Ahorro', value: ahorroResult.finalAmount, fill: '#60a5fa' },
      { name: 'Bien Raiz', value: bienRaizResult.finalAmount, fill: '#f59e0b' },
      { name: 'CETES', value: cetesResult.finalAmount, fill: '#8b5cf6' },
      { name: 'RiderMex', value: icmResult.finalAmount, fill: '#ef4444' }
    ];
  };

  const generateLineChartData = () => {
    return Array.from({ length: years + 1 }, (_, i) => {
      const ahorroValue = i === 0 ? initialInvestment : (ahorroData[i - 1]?.patrimony || initialInvestment);
      const bienRaizValue = i === 0 ? initialInvestment : (bienRaizData[i - 1]?.patrimony || initialInvestment);
      const cetesValue = i === 0 ? initialInvestment : (cetesData[i - 1]?.patrimony || initialInvestment);
      const icmValue = i === 0 ? initialInvestment : (icmData[i - 1]?.patrimony || initialInvestment);
      const combined = ahorroValue + bienRaizValue + cetesValue;

      return {
        year: i,
        Ahorro: ahorroValue,
        'Bien Raiz': bienRaizValue,
        CETES: cetesValue,
        'Combinadas': combined,
        RiderMex: icmValue
      };
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hola! Me interesa ser socio de RiderMex.\n\nDatos:\n- Nombre: ${formData.name}\n- Tickets: ${formData.tickets}\n- Horizonte: ${formData.horizon} anos`;
    window.open(`https://wa.me/529982024327?text=${encodeURIComponent(message)}`, '_blank');
  };

  const faqs = [
    {
      question: 'Que es un ticket RiderMex?',
      answer: 'Un ticket es tu participacion como socio en una tienda RiderMex de motocicletas. Cada ticket tiene un precio de entrada y te da derecho a recibir rendimientos trimestrales de las utilidades generadas por la venta de motos.'
    },
    {
      question: 'Cuando empiezo a recibir rendimientos?',
      answer: 'Con el modelo de pago de contado (Tipo B), los rendimientos comienzan a partir del mes 7. La tienda necesita un periodo de construccion y aclientado antes de generar utilidades.'
    },
    {
      question: 'Cuanto puedo ganar por ticket?',
      answer: `Cada ticket genera aproximadamente ${formatCurrency(RIDERMEX_CONFIG.ANNUAL_RETURN_PER_TICKET, 'MXN')} anuales, pagados trimestralmente en ${formatCurrency(RIDERMEX_CONFIG.QUARTERLY_PAYMENT, 'MXN')} por trimestre. Esto representa un ROI estimado de ${RIDERMEX_CONFIG.ESTIMATED_ROI}%.`
    },
    {
      question: 'Como esta protegida mi inversion?',
      answer: `Tu inversion esta respaldada por 3 fideicomisos en ${RIDERMEX_CONFIG.BANK}: ${RIDERMEX_CONFIG.TRUSTS.ASSETS}, ${RIDERMEX_CONFIG.TRUSTS.OPERATIONS} y ${RIDERMEX_CONFIG.TRUSTS.COLLECTION}. Ademas cuentas con seguros de cobertura amplia para el inventario.`
    },
    {
      question: 'Puedo reinvertir mis ganancias?',
      answer: 'Si. El modelo de Interes Compuesto Multiplicador (ICM) reinvierte tus utilidades para adquirir mas tickets, generando un ciclo de crecimiento exponencial de tu patrimonio.'
    },
    {
      question: 'Cuantos tickets necesito para una tienda completa?',
      answer: `Una tienda completa se compone de ${RIDERMEX_CONFIG.TICKETS_PER_STORE} tickets. Sin embargo, puedes iniciar desde 1 solo ticket y crecer gradualmente.`
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-md border-b border-gray-800 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Bike className="w-8 h-8 text-red-500" />
              <span className="text-xl font-bold text-white">RiderMex</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#comparativa" className="text-sm text-gray-400 hover:text-red-500 transition-colors">
                Comparativa
              </a>
              <a href="#simulador" className="text-sm text-gray-400 hover:text-red-500 transition-colors">
                Simulador
              </a>
              <a href="#seguridad" className="text-sm text-gray-400 hover:text-red-500 transition-colors">
                Seguridad
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
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors"
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
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-red-600 to-red-900 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-red-800 to-gray-900 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-950/50 border border-red-800/30 rounded-full mb-6"
            >
              <Star className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-400">+500 socios ya comprobaron que el ICM vence a todos los modelos tradicionales</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Una sola inversion.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                Tres veces mas poderosa.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl lg:text-2xl text-gray-400 mb-10 max-w-4xl mx-auto"
            >
              Descubre como el <strong className="text-white">Interes Compuesto Multiplicador (ICM)</strong> de RiderMex vence al Ahorro, al Bien Raiz y a los CETES... juntos.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative mb-12"
            >
              <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl p-8 max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-8 mb-6">
                  <div className="flex flex-col items-center">
                    <div className="flex gap-3 mb-3">
                      <div className="w-16 h-16 rounded-2xl bg-blue-950/50 border border-blue-800/30 flex items-center justify-center">
                        <PiggyBank className="w-8 h-8 text-blue-400" />
                      </div>
                      <div className="w-16 h-16 rounded-2xl bg-amber-950/50 border border-amber-800/30 flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-amber-400" />
                      </div>
                      <div className="w-16 h-16 rounded-2xl bg-gray-800/50 border border-gray-700/30 flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Ahorro + Bien Raiz + CETES</p>
                  </div>

                  <div className="relative">
                    <Scale className="w-12 h-12 text-gray-600" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center mb-3 shadow-lg shadow-red-900/30">
                      <Bike className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-sm font-bold text-red-500">RiderMex las supera</p>
                  </div>
                </div>
                <p className="text-gray-400 text-center">
                  El modelo que <strong className="text-red-500">multiplica activos reales</strong> con el negocio de motocicletas
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.a
                href="#comparativa"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-900/30 flex items-center justify-center gap-2"
              >
                Ver la comparacion completa
                <ArrowRight className="w-5 h-5" />
              </motion.a>
              <motion.button
                onClick={onGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gray-900 text-red-500 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all border-2 border-red-600 flex items-center justify-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                Simular mi inversion
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="problema" className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Tres caminos conocidos, un mismo destino:{' '}
              <span className="text-red-500">rendimientos limitados</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              La mayoria de los inversionistas reparte su dinero entre ahorro, bienes raices o CETES...
              creyendo que diversifican, pero en realidad estan <strong className="text-white">limitando su crecimiento</strong>.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-900 border border-gray-800 rounded-3xl p-8 lg:p-12"
          >
            <div className="text-center mb-8">
              <p className="text-2xl text-gray-300 font-medium">
                Mientras los demas esperan que el tiempo haga su magia,{' '}
                <strong className="text-red-500">el ICM la acelera</strong>.
              </p>
            </div>

            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={generateLineChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="year" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value, 'MXN')}
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#f3f4f6' }}
                  />
                  <Line type="monotone" dataKey="Ahorro" stroke="#60a5fa" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Bien Raiz" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="CETES" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Combinadas" stroke="#6b7280" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  <Line type="monotone" dataKey="RiderMex" stroke="#ef4444" strokeWidth={3} dot={false} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 text-center">
              <motion.a
                href="#comparativa"
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 text-red-500 font-semibold hover:text-red-400 transition-colors"
              >
                Descubre por que RiderMex las supera a todas
                <ArrowRight className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="comparativa" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Y si una inversion pudiera{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                vencer a las tres?
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden mb-12"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Concepto</th>
                    <th className="px-6 py-4 text-center font-semibold">
                      <div className="flex flex-col items-center gap-1">
                        <PiggyBank className="w-5 h-5" />
                        <span>Ahorro</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center font-semibold">
                      <div className="flex flex-col items-center gap-1">
                        <Building2 className="w-5 h-5" />
                        <span>Bien Raiz</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center font-semibold">
                      <div className="flex flex-col items-center gap-1">
                        <TrendingUp className="w-5 h-5" />
                        <span>CETES</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center font-semibold bg-gradient-to-r from-red-600 to-red-700">
                      <div className="flex flex-col items-center gap-1">
                        <Bike className="w-5 h-5" />
                        <span>RiderMex ICM</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  <tr className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-200">Rendimiento promedio anual</td>
                    <td className="px-6 py-4 text-center text-gray-400">5%</td>
                    <td className="px-6 py-4 text-center text-gray-400">8%</td>
                    <td className="px-6 py-4 text-center text-gray-400">10%</td>
                    <td className="px-6 py-4 text-center font-bold text-red-400 bg-red-950/30">{RIDERMEX_CONFIG.ESTIMATED_ROI}%+ proyectado</td>
                  </tr>
                  <tr className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-200">Liquidez</td>
                    <td className="px-6 py-4 text-center text-gray-400">Alta pero sin ganancia</td>
                    <td className="px-6 py-4 text-center text-gray-400">Muy baja</td>
                    <td className="px-6 py-4 text-center text-gray-400">Media</td>
                    <td className="px-6 py-4 text-center font-bold text-red-400 bg-red-950/30">Pago trimestral constante</td>
                  </tr>
                  <tr className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-200">Plusvalia</td>
                    <td className="px-6 py-4 text-center text-gray-400">No</td>
                    <td className="px-6 py-4 text-center text-gray-400">3-5% anual</td>
                    <td className="px-6 py-4 text-center text-gray-400">No</td>
                    <td className="px-6 py-4 text-center font-bold text-red-400 bg-red-950/30">Ticket + negocio: {RIDERMEX_CONFIG.ANNUAL_APPRECIATION}% apreciacion anual</td>
                  </tr>
                  <tr className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-200">Respaldo</td>
                    <td className="px-6 py-4 text-center text-gray-400">IPAB limitado</td>
                    <td className="px-6 py-4 text-center text-gray-400">Escrituras</td>
                    <td className="px-6 py-4 text-center text-gray-400">Gobierno Federal</td>
                    <td className="px-6 py-4 text-center font-bold text-red-400 bg-red-950/30">3 Fideicomisos + Seguros</td>
                  </tr>
                  <tr className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-200">Requiere administracion</td>
                    <td className="px-6 py-4 text-center text-gray-400">No</td>
                    <td className="px-6 py-4 text-center text-gray-400">Alta</td>
                    <td className="px-6 py-4 text-center text-gray-400">No</td>
                    <td className="px-6 py-4 text-center font-bold text-red-400 bg-red-950/30">Nula (operacion pasiva)</td>
                  </tr>
                  <tr className="bg-gray-800/50">
                    <td className="px-6 py-4 font-bold text-white">Crecimiento a {years} anos</td>
                    <td className="px-6 py-4 text-center font-bold text-blue-400">{formatCurrency(ahorroResult.finalAmount, 'MXN')}</td>
                    <td className="px-6 py-4 text-center font-bold text-amber-400">{formatCurrency(bienRaizResult.finalAmount, 'MXN')}</td>
                    <td className="px-6 py-4 text-center font-bold text-gray-300">{formatCurrency(cetesResult.finalAmount, 'MXN')}</td>
                    <td className="px-6 py-4 text-center font-bold text-red-400 bg-red-950/40 text-xl">{formatCurrency(icmResult.finalAmount, 'MXN')}</td>
                  </tr>
                  <tr className="bg-gray-800">
                    <td className="px-6 py-4 font-bold text-white">Combinadas</td>
                    <td colSpan={3} className="px-6 py-4 text-center font-bold text-gray-300 text-xl">
                      {formatCurrency(combinedTraditional, 'MXN')}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-red-400 text-xl bg-red-950/40">
                      RiderMex las supera con una sola inversion
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-900 border border-gray-800 rounded-3xl shadow-xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Comparacion Visual</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={generateComparisonChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value, 'MXN')}
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#f3f4f6' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {generateComparisonChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-8 text-center">
              <motion.a
                href="#simulador"
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-900/30"
              >
                <Calculator className="w-5 h-5" />
                Calcular mi ejemplo personalizado
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="icm" className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              El Interes Compuesto Multiplicador (ICM):{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                la evolucion natural del dinero
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              A diferencia del interes compuesto tradicional, el ICM no solo reinvierte tus ganancias:{' '}
              <strong className="text-white">las convierte en nuevos tickets</strong>.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid lg:grid-cols-2 gap-12 items-center mb-12"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                Cada rendimiento se usa para adquirir <strong className="text-red-500">mas tickets</strong>,
                lo que crea un ciclo infinito de crecimiento real.
              </p>
              <p className="text-2xl font-bold text-red-500 mb-6">
                Es como tener motos que generan mas motos.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-950/50 border border-red-800/30 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-red-500" />
                  </div>
                  <p className="text-gray-300">Activos reales que producen riqueza</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-950/50 border border-red-800/30 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-red-500" />
                  </div>
                  <p className="text-gray-300">Pago trimestral constante y creciente</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-950/50 border border-red-800/30 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-red-500" />
                  </div>
                  <p className="text-gray-300">Reinversion automatica en mas tickets</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex gap-2">
                    <PiggyBank className="w-8 h-8 text-blue-400" />
                    <Building2 className="w-8 h-8 text-amber-400" />
                    <TrendingUp className="w-8 h-8 text-gray-400" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-600" />
                  <Coins className="w-8 h-8 text-yellow-500" />
                </div>
                <p className="text-gray-300 font-medium">
                  Tres opciones juntas (Ahorro, Bien Raiz, CETES) dan rendimientos limitados
                </p>
              </div>

              <div className="bg-gray-900 border-2 border-red-800/50 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Bike className="w-10 h-10 text-red-500" />
                  <ArrowRight className="w-6 h-6 text-red-500" />
                  <Store className="w-12 h-12 text-red-400" />
                </div>
                <p className="text-white font-bold text-lg">
                  Un solo ticket RiderMex multiplica una red de tiendas entera
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <motion.a
              href="#como-funciona"
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 text-red-500 font-semibold text-lg hover:text-red-400 transition-colors"
            >
              Ver como funciona el ciclo
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      <section id="como-funciona" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Asi el ICM gana{' '}
              <span className="text-red-500">incluso cuando los demas se detienen</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              {
                number: '1',
                icon: Coins,
                title: 'Adquieres un Ticket',
                description: 'Compras tu participacion en una tienda RiderMex de motocicletas',
                color: 'from-red-600 to-red-700'
              },
              {
                number: '2',
                icon: Store,
                title: 'La Tienda Opera',
                description: 'RiderMex vende motocicletas y genera utilidades cada trimestre',
                color: 'from-red-600 to-red-700'
              },
              {
                number: '3',
                icon: DollarSign,
                title: 'Utilidades Trimestrales',
                description: `Recibes ${formatCurrency(RIDERMEX_CONFIG.QUARTERLY_PAYMENT, 'MXN')} por ticket cada trimestre`,
                color: 'from-red-600 to-red-700'
              },
              {
                number: '4',
                icon: Repeat,
                title: 'Reinversion Automatica',
                description: 'Tus utilidades compran mas tickets y mas tiendas',
                color: 'from-red-600 to-red-700'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-red-800/50 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-xl mb-4`}>
                  {step.number}
                </div>
                <step.icon className="w-10 h-10 mb-4 text-red-500" />
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-900 border border-gray-800 rounded-3xl p-8"
          >
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <Store className="w-8 h-8 text-red-500" />
                <span className="text-gray-300 font-medium">Tienda Opera</span>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-600" />
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-yellow-500" />
                <span className="text-gray-300 font-medium">Ganancia</span>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-600" />
              <div className="flex items-center gap-3">
                <Repeat className="w-8 h-8 text-red-500" />
                <span className="text-gray-300 font-medium">Reinversion</span>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-600" />
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-red-400" />
                <span className="text-gray-300 font-medium">Expansion</span>
              </div>
              <RefreshCw className="w-10 h-10 text-red-500" />
            </div>
            <p className="text-center text-gray-400 mt-6">
              <strong className="text-red-500">Ciclo infinito</strong> de multiplicacion de activos reales
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12"
          >
            <div className="bg-gradient-to-br from-red-950/80 to-gray-900 border border-red-800/30 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-center text-white">Datos Reales de la Operacion</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                  <Bike className="w-8 h-8 mb-3 text-red-400" />
                  <p className="text-sm text-gray-400 mb-1">Motos Vendidas por Tienda</p>
                  <p className="text-3xl font-bold text-white">{RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">motocicletas/ano</p>
                </div>
                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                  <DollarSign className="w-8 h-8 mb-3 text-red-400" />
                  <p className="text-sm text-gray-400 mb-1">Utilidad por Moto</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(RIDERMEX_CONFIG.PROFIT_PER_MOTORCYCLE, 'MXN')}</p>
                  <p className="text-sm text-gray-500 mt-1">MXN por unidad</p>
                </div>
                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                  <TrendingUp className="w-8 h-8 mb-3 text-red-400" />
                  <p className="text-sm text-gray-400 mb-1">Pool de Utilidad Anual</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(RIDERMEX_CONFIG.ANNUAL_PROFIT_POOL, 'MXN')}</p>
                  <p className="text-sm text-gray-500 mt-1">por tienda/ano</p>
                </div>
                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                  <Store className="w-8 h-8 mb-3 text-red-400" />
                  <p className="text-sm text-gray-400 mb-1">Tickets por Tienda</p>
                  <p className="text-3xl font-bold text-white">{RIDERMEX_CONFIG.TICKETS_PER_STORE}</p>
                  <p className="text-sm text-gray-500 mt-1">socios maximo</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-gray-800 text-center">
                <p className="text-sm text-gray-400 mb-1">Inversion por Ticket</p>
                <p className="text-4xl font-bold text-white">{formatCurrency(ticketPrice, 'MXN')}</p>
                <p className="text-sm text-gray-500 mt-1">Participacion en tienda de motocicletas RiderMex</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <motion.a
              href="#simulador"
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-900/30"
            >
              Simular mis rendimientos
              <Calculator className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      <section id="simulador" className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Mira como RiderMex le gana a todas{' '}
              <span className="text-red-500">(incluso sumadas)</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-900 border border-gray-800 rounded-3xl p-8 lg:p-12 shadow-xl"
          >
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Tickets: {tickets} ({formatCurrency(initialInvestment, 'MXN')})
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={tickets}
                    onChange={(e) => setTickets(Number(e.target.value))}
                    className="w-full h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 ticket</span>
                    <span>30 tickets</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Horizonte: {years} anos
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5 anos</span>
                    <span>30 anos</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    % de Reinversion: {reinvestmentRate}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={reinvestmentRate}
                    onChange={(e) => setReinvestmentRate(Number(e.target.value))}
                    className="w-full h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-950 rounded-2xl p-6 border border-blue-900/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <PiggyBank className="w-6 h-6 text-blue-400" />
                      <span className="font-semibold text-gray-200">Ahorro</span>
                    </div>
                    <span className="text-sm text-gray-500">5% anual</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-400">{formatCurrency(ahorroResult.finalAmount, 'MXN')}</p>
                </div>

                <div className="bg-gray-950 rounded-2xl p-6 border border-amber-900/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-6 h-6 text-amber-400" />
                      <span className="font-semibold text-gray-200">Bien Raiz</span>
                    </div>
                    <span className="text-sm text-gray-500">8% anual</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-400">{formatCurrency(bienRaizResult.finalAmount, 'MXN')}</p>
                </div>

                <div className="bg-gray-950 rounded-2xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-gray-400" />
                      <span className="font-semibold text-gray-200">CETES</span>
                    </div>
                    <span className="text-sm text-gray-500">10% anual</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-300">{formatCurrency(cetesResult.finalAmount, 'MXN')}</p>
                </div>

                <div className="bg-gray-950 rounded-2xl p-6 border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-200">Suma de las 3 tradicionales</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-400">{formatCurrency(combinedTraditional, 'MXN')}</p>
                </div>

                <div className="bg-gradient-to-br from-red-950/80 to-red-900/40 rounded-2xl p-6 shadow-2xl border-2 border-red-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Bike className="w-6 h-6 text-white" />
                      <span className="font-bold text-white">RiderMex ICM</span>
                    </div>
                    <span className="text-sm text-red-300">{RIDERMEX_CONFIG.ESTIMATED_ROI}%+ ICM</span>
                  </div>
                  <p className="text-4xl font-bold text-white mb-2">{formatCurrency(icmResult.finalAmount, 'MXN')}</p>
                  <div className="flex items-center gap-2 pt-2 border-t border-red-800">
                    <Award className="w-5 h-5 text-yellow-400" />
                    <span className="text-red-200 text-sm font-medium">
                      Supera la suma total en {formatCurrency(icmResult.finalAmount - combinedTraditional, 'MXN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <motion.button
                onClick={() => setShowForm(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-900/30"
              >
                <Phone className="w-5 h-5" />
                Recibir mi simulacion personalizada por WhatsApp
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="social" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Cientos ya dejaron de{' '}
              <span className="text-gray-500">dividir</span> su dinero...{' '}
              <span className="text-red-500">y empezaron a multiplicarlo</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                name: 'Carlos R.',
                role: 'Empresario',
                result: 'Patrimonio multiplicado 3.8x en 10 anos',
                quote: 'Deje de repartir mi dinero entre varias opciones. Ahora tengo 4 tickets RiderMex y los rendimientos trimestrales son reales.'
              },
              {
                name: 'Maria Elena P.',
                role: 'Profesionista',
                result: `Ingreso pasivo de $${RIDERMEX_CONFIG.ANNUAL_RETURN_PER_TICKET.toLocaleString()} anuales por ticket`,
                quote: 'Compare CETES, bienes raices y ahorro. RiderMex no solo gano, los supero juntos. Es matematica pura con motos.'
              },
              {
                name: 'Jorge L.',
                role: 'Inversionista',
                result: 'De 2 a 18 tickets en 8 anos con ICM',
                quote: 'El poder del ICM es real. Mientras mis amigos siguen sumando, yo multiplico automaticamente con RiderMex.'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-red-800/50 transition-colors"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="bg-red-950/30 border border-red-800/20 rounded-lg p-3 mb-4">
                  <p className="text-sm font-semibold text-red-400">{testimonial.result}</p>
                </div>
                <p className="text-gray-400 italic">"{testimonial.quote}"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gray-900 border border-gray-800 rounded-3xl p-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="flex-shrink-0 flex items-center gap-3">
                <Bike className="w-12 h-12 text-red-500" />
                <span className="text-2xl font-bold text-white">RiderMex</span>
              </div>
              <div className="text-center md:text-left">
                <p className="text-gray-400 mb-2">Respaldado por:</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-6 h-6 text-red-500" />
                    <span className="text-gray-300 font-medium">RiderMex</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-blue-400" />
                    <span className="text-gray-300 font-medium">3 Fideicomisos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-6 h-6 text-gray-400" />
                    <span className="text-gray-300 font-medium">{RIDERMEX_CONFIG.BANK}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="seguridad" className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              <span className="text-red-500">Blindaje real.</span>{' '}
              <span className="text-gray-300">Rendimiento real.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              {
                icon: Shield,
                title: '3 Fideicomisos',
                description: RIDERMEX_CONFIG.TRUSTS.ASSETS + ', Operativo y de Cobro',
                color: 'from-red-600 to-red-700'
              },
              {
                icon: BadgeCheck,
                title: 'Seguros Integrales',
                description: RIDERMEX_CONFIG.INSURANCE.ASSETS.coverage,
                color: 'from-red-600 to-red-700'
              },
              {
                icon: FileText,
                title: RIDERMEX_CONFIG.BANK,
                description: 'Fideicomisario y custodio de los fondos',
                color: 'from-red-600 to-red-700'
              },
              {
                icon: MapPin,
                title: 'Aliados Financieros',
                description: RIDERMEX_CONFIG.FINANCIAL_PARTNERS.join(', '),
                color: 'from-red-600 to-red-700'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-red-800/50 transition-colors"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center"
          >
            <Store className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">Operacion de Tiendas RiderMex</h3>
            <p className="text-gray-400 max-w-2xl mx-auto mb-6">
              Nuestras tiendas operan con un modelo probado de venta de motocicletas,
              con rotacion de inventario de {RIDERMEX_CONFIG.INVENTORY_ROTATION_DAYS_MIN}-{RIDERMEX_CONFIG.INVENTORY_ROTATION_DAYS_MAX} dias y cobranza en {RIDERMEX_CONFIG.CASH_COLLECTION_HOURS} horas.
              Aliados financieros como {RIDERMEX_CONFIG.FINANCIAL_PARTNERS.join(', ')} respaldan las operaciones.
            </p>
            <motion.button
              onClick={() => setShowForm(true)}
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-colors"
            >
              <FileText className="w-5 h-5" />
              Solicitar informacion completa
            </motion.button>
          </motion.div>
        </div>
      </section>

      <section id="faq" className="py-20 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Preguntas Frecuentes</h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-semibold text-gray-200">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-4"
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

      <section id="cta-final" className="py-20 bg-gradient-to-br from-red-950 via-red-900 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              RiderMex no compite con otras inversiones.{' '}
              <span className="block mt-2">Las supera.</span>
            </h2>
            <p className="text-xl lg:text-2xl mb-10 max-w-3xl mx-auto opacity-90">
              Una sola decision puede rendir mas que tres estrategias combinadas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <motion.button
                onClick={() => setShowForm(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-white text-red-600 rounded-xl font-bold text-xl hover:bg-gray-100 transition-all shadow-2xl flex items-center justify-center gap-3"
              >
                <Zap className="w-6 h-6" />
                Multiplicar mi dinero con RiderMex
              </motion.button>
              <motion.a
                href="https://wa.me/529982024327?text=Hola%2C%20me%20interesa%20ser%20socio%20de%20RiderMex"
                target="_blank"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-red-800 text-white rounded-xl font-bold text-xl hover:bg-red-700 transition-all border-2 border-white/20 flex items-center justify-center gap-3"
              >
                <Phone className="w-6 h-6" />
                Hablar con un asesor hoy mismo
              </motion.a>
            </div>

            <p className="text-sm opacity-75">
              Asesoria gratuita en menos de 24 horas
            </p>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Hazte socio de RiderMex</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nombre</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-600"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-600"
                    placeholder="55 1234 5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Numero de tickets</label>
                  <input
                    type="number"
                    required
                    value={formData.tickets}
                    onChange={(e) => setFormData({ ...formData, tickets: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-600"
                    placeholder="Ej: 3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Horizonte (anos)</label>
                  <input
                    type="number"
                    required
                    value={formData.horizon}
                    onChange={(e) => setFormData({ ...formData, horizon: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-600"
                    placeholder="Ej: 20"
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    required
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                    className="mt-1 w-4 h-4 text-red-600 border-gray-600 rounded focus:ring-red-500 bg-gray-950"
                  />
                  <label className="text-sm text-gray-400">
                    Quiero ver como RiderMex supera todas las inversiones juntas
                  </label>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Recibir simulacion personalizada
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-red-900 to-red-800 text-white py-4 px-4 shadow-2xl z-40 border-t border-red-700"
          >
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Bike className="w-6 h-6" />
                <span className="font-bold">Comprobado: RiderMex gana</span>
              </div>
              <div className="flex gap-3">
                <motion.button
                  onClick={() => setShowForm(true)}
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-2 bg-white text-red-600 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  Comenzar ahora
                </motion.button>
                <motion.a
                  href="https://wa.me/529982024327?text=Hola%2C%20me%20interesa%20ser%20socio%20de%20RiderMex"
                  target="_blank"
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-2 bg-red-700 text-white rounded-full font-semibold hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  WhatsApp
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-gray-950 text-gray-300 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bike className="w-8 h-8 text-red-500" />
                <span className="text-xl font-bold text-white">RiderMex</span>
              </div>
              <p className="text-sm text-gray-500">
                Inversion en tiendas de motocicletas con el poder del ICM
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Enlaces</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#comparativa" className="hover:text-red-500 transition-colors">Comparativa</a></li>
                <li><a href="#simulador" className="hover:text-red-500 transition-colors">Simulador</a></li>
                <li><a href="#seguridad" className="hover:text-red-500 transition-colors">Seguridad</a></li>
                <li><a href="#faq" className="hover:text-red-500 transition-colors">Preguntas Frecuentes</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-red-500 transition-colors">Aviso de privacidad</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Contratos</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Fideicomisos</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+52 998 202 4327</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>contacto@ridermex.com</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-gray-600 text-center">
            <p className="mb-4">
              Proyecciones informativas; no constituyen oferta publica ni garantia de rendimiento.
              Sujeto a contrato, operacion y condiciones de mercado.
            </p>
            <p>&copy; 2025 RiderMex. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VitaminadaLandingPage;
