import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Bike,
  TrendingUp,
  DollarSign,
  Users,
  Zap,
  Info,
  Sliders,
  Check,
  Calendar,
  Percent,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Shield,
  Activity,
  Award,
  BookOpen
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { calculateCalculadoraMadre, type CalculadoraMadreParams, BASE_PRICES } from '../utils/calculations/calculadoraMadre';

interface CalculadoraMadreProps {
  onBack: () => void;
}

export const CalculadoraMadre: React.FC<CalculadoraMadreProps> = ({ onBack }) => {
  const [model, setModel] = useState<'A' | 'B' | 'C' | 'D'>('B');
  const [numTickets, setNumTickets] = useState<number>(1);
  const [manualDiscount, setManualDiscount] = useState<number>(30); // base discount
  const [downPayment, setDownPayment] = useState<number>(10000); // initial payment
  const [financingMonths, setFinancingMonths] = useState<number>(48); // for Model D
  const [years, setYears] = useState<number>(20);
  const [reinvestEnabled, setReinvestEnabled] = useState<boolean>(true);

  const [activeTab, setActiveTab] = useState<'scenarios' | 'charts' | 'amortization' | 'table'>('scenarios');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  // Sync default manual discounts when model changes
  React.useEffect(() => {
    if (model === 'A') {
      setManualDiscount(30);
    } else if (model === 'B') {
      setManualDiscount(30); // B penalizes 5%, resulting in 25% net before volume
    } else if (model === 'C') {
      setManualDiscount(0);
    } else if (model === 'D') {
      setManualDiscount(30);
    }
  }, [model]);

  // Sync down payment minimum when numTickets or model changes
  React.useEffect(() => {
    const minEnganche = 10000 * numTickets;
    setDownPayment(prev => Math.max(minEnganche, prev));
  }, [numTickets, model]);

  // Calculate parameters and results
  const params: CalculadoraMadreParams = useMemo(() => ({
    model,
    numTickets,
    manualDiscount,
    downPayment,
    financingMonths: model === 'B' ? 12 : financingMonths,
    years,
    reinvestEnabled
  }), [model, numTickets, manualDiscount, downPayment, financingMonths, reinvestEnabled, years]);

  const results = useMemo(() => calculateCalculadoraMadre(params), [params]);

  const isFinanced = model === 'B' || model === 'D';

  // Reset function
  const handleReset = () => {
    setModel('B');
    setNumTickets(1);
    setManualDiscount(30);
    setDownPayment(10000);
    setFinancingMonths(48);
    setYears(20);
    setReinvestEnabled(true);
    setActiveTab('scenarios');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Model Metadata
  const modelsInfo = {
    A: {
      name: 'Modelo A',
      tag: 'Contado Tradicional',
      desc: 'Pago de contado con descuento del 30% inicial. Cosecha del rendimiento a partir del mes 7.',
      color: 'border-blue-500/30 hover:border-blue-500 bg-blue-950/20 text-blue-400',
      badge: 'bg-blue-500/20 text-blue-300'
    },
    B: {
      name: 'Modelo B',
      tag: 'Financiado 12 Meses',
      desc: 'Enganche de $10,000 pesos y diferencia a 12 meses. Penalización de 5% en descuento. Cosecha a partir del mes 19.',
      color: 'border-emerald-500/30 hover:border-emerald-500 bg-emerald-950/20 text-emerald-400',
      badge: 'bg-emerald-500/20 text-emerald-300'
    },
    C: {
      name: 'Modelo C',
      tag: 'Agencia Madura',
      desc: 'Fracción de sucursal ya madura (1/30). Costo $120,000. Sin penalizaciones. Cosecha inmediata (mes 2).',
      color: 'border-amber-500/30 hover:border-amber-500 bg-amber-950/20 text-amber-400',
      badge: 'bg-amber-500/20 text-amber-300'
    },
    D: {
      name: 'Modelo D',
      tag: 'Financiado Flexible 48m',
      desc: 'Enganche de $10,000 y saldo hasta 48 meses. Descuento se castiga 5% por año. Si neto es ≤ $100K, se aplica recargo por pago diferido.',
      color: 'border-purple-500/30 hover:border-purple-500 bg-purple-950/20 text-purple-400',
      badge: 'bg-purple-500/20 text-purple-300'
    }
  };

  // Chart Data preparation
  const chartData = useMemo(() => {
    const data: any[] = [];
    const len = results.scenarios.moderate.yearlyData.length;
    for (let i = 0; i < len; i++) {
      const yearObj = results.scenarios.moderate.yearlyData[i];
      const consObj = results.scenarios.conservative.yearlyData[i];
      const optObj = results.scenarios.optimistic.yearlyData[i];
      data.push({
        name: `Año ${yearObj.year}`,
        year: yearObj.year,
        'Patrimonio Conservador': consObj.patrimony,
        'Patrimonio Moderado': yearObj.patrimony,
        'Patrimonio Optimista': optObj.patrimony,
        'Rendimiento Conservador': consObj.annualYield,
        'Rendimiento Moderado': yearObj.annualYield,
        'Rendimiento Optimista': optObj.annualYield,
        'Tickets': yearObj.totalTickets
      });
    }
    return data;
  }, [results]);

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-inter">
      {/* Top sticky header */}
      <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-neutral-800 rounded-xl transition-all border border-neutral-800 text-neutral-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-montserrat text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500">
                Calculadora Madre
              </h1>
              <p className="text-xs text-neutral-400">
                Central de Rendimientos y Modelos de Inversión RiderMex
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg text-sm text-neutral-300 hover:text-white transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Restablecer
            </button>
            <div className="w-10 h-10 bg-red-600/10 border border-red-500/30 rounded-xl flex items-center justify-center">
              <Bike className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid container */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Model Selection */}
        <section className="mb-8">
          <h2 className="text-lg font-bold font-montserrat text-neutral-300 mb-4 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-red-500" />
            1. Selecciona tu Modelo de Inversión
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(['A', 'B', 'C', 'D'] as const).map(m => {
              const info = modelsInfo[m];
              const isSelected = model === m;
              return (
                <motion.button
                  key={m}
                  whileHover={{ y: -4 }}
                  onClick={() => setModel(m)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all flex flex-col justify-between h-full ${
                    isSelected
                      ? 'bg-neutral-800 border-red-600 shadow-lg shadow-red-600/10'
                      : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${info.badge}`}>
                        {info.tag}
                      </span>
                      {isSelected && (
                        <span className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold text-white">
                          ✓
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold font-montserrat text-white mb-2">{info.name}</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">{info.desc}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-neutral-800 w-full flex justify-between items-center text-sm">
                    <span className="text-neutral-500">Precio Base:</span>
                    <span className="font-bold text-white">{formatCurrency(BASE_PRICES[m])}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Configuration Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-neutral-950 p-6 rounded-3xl border border-neutral-800 space-y-6">
              <h3 className="text-lg font-bold font-montserrat text-neutral-300 pb-3 border-b border-neutral-800">
                Configuración de Entrada
              </h3>

              {/* Tickets Count */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400 font-medium">Número de Tickets</span>
                  <span className="font-bold text-red-500 text-lg">{numTickets} tix</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNumTickets(prev => Math.max(1, prev - 1))}
                    className="w-10 h-10 bg-neutral-900 hover:bg-neutral-800 rounded-lg flex items-center justify-center font-bold text-neutral-300 border border-neutral-800"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={numTickets}
                    onChange={e => setNumTickets(parseInt(e.target.value) || 1)}
                    className="flex-1 accent-red-600 bg-neutral-900 rounded-lg cursor-pointer h-2 my-auto"
                  />
                  <button
                    onClick={() => setNumTickets(prev => Math.min(50, prev + 1))}
                    className="w-10 h-10 bg-neutral-900 hover:bg-neutral-800 rounded-lg flex items-center justify-center font-bold text-neutral-300 border border-neutral-800"
                  >
                    +
                  </button>
                </div>
                <div className="flex gap-2 justify-between mt-1">
                  <button
                    onClick={() => setNumTickets(3)}
                    className="flex-1 py-1 bg-neutral-900 hover:bg-neutral-800 text-xs rounded border border-neutral-800 text-neutral-400"
                  >
                    3 tix (+3%)
                  </button>
                  <button
                    onClick={() => setNumTickets(5)}
                    className="flex-1 py-1 bg-neutral-900 hover:bg-neutral-800 text-xs rounded border border-neutral-800 text-neutral-400"
                  >
                    5 tix (+5%)
                  </button>
                  <button
                    onClick={() => setNumTickets(10)}
                    className="flex-1 py-1 bg-neutral-900 hover:bg-neutral-800 text-xs rounded border border-neutral-800 text-neutral-400"
                  >
                    10+ tix (+10%)
                  </button>
                </div>
              </div>

              {/* Manual Discount */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400 font-medium">Descuento del Certificado</span>
                  <span className="font-bold text-red-500 text-lg">{manualDiscount}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={manualDiscount}
                  onChange={e => setManualDiscount(parseInt(e.target.value) || 0)}
                  className="w-full accent-red-600 bg-neutral-900 rounded-lg cursor-pointer h-2"
                />
                <div className="flex justify-between text-2xs text-neutral-500">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>

              {/* Down Payment (Only for B and D) */}
              {isFinanced && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400 font-medium flex items-center gap-1">
                      Enganche Inicial
                      <HelpCircle className="w-3.5 h-3.5 text-neutral-500" title="Mínimo $10,000 pesos por ticket. Ajustable solo hacia arriba." />
                    </span>
                    <span className="font-bold text-red-500 text-lg">{formatCurrency(downPayment)}</span>
                  </div>
                  <input
                    type="range"
                    min={10000 * numTickets}
                    max={results.ticketPriceBeforeDiscount * numTickets}
                    step={5000}
                    value={downPayment}
                    onChange={e => setDownPayment(Math.max(10000 * numTickets, parseInt(e.target.value) || 0))}
                    className="w-full accent-red-600 bg-neutral-900 rounded-lg cursor-pointer h-2"
                  />
                  <div className="flex justify-between text-2xs text-neutral-500">
                    <span>Mín: {formatCurrency(10000 * numTickets)}</span>
                    <span>Máx: {formatCurrency(results.ticketPriceBeforeDiscount * numTickets)}</span>
                  </div>
                </div>
              )}

              {/* Financing Months (Only for D) */}
              {model === 'D' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400 font-medium">Plazo de Financiamiento</span>
                    <span className="font-bold text-red-500 text-lg">{financingMonths} meses</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="48"
                    step="12"
                    value={financingMonths}
                    onChange={e => setFinancingMonths(parseInt(e.target.value) || 48)}
                    className="w-full accent-red-600 bg-neutral-900 rounded-lg cursor-pointer h-2"
                  />
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>12m</span>
                    <span>24m</span>
                    <span>36m</span>
                    <span>48m</span>
                  </div>
                </div>
              )}

              {/* Timeframe Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400 font-medium">Plazo de Proyección</span>
                  <span className="font-bold text-white text-lg">{years} años</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="5"
                  value={years}
                  onChange={e => setYears(parseInt(e.target.value) || 20)}
                  className="w-full accent-red-600 bg-neutral-900 rounded-lg cursor-pointer h-2"
                />
                <div className="flex justify-between text-2xs text-neutral-500">
                  <span>5 años</span>
                  <span>20 años</span>
                  <span>30 años</span>
                </div>
              </div>

              {/* ICM Toggle Reinvestment */}
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Reinversión (ICM)
                    <span className="bg-red-500/20 text-red-300 text-3xs font-extrabold px-1.5 py-0.5 rounded-full tracking-wide">
                      RECOMENDADO
                    </span>
                  </h4>
                  <p className="text-2xs text-neutral-400 mt-1 max-w-[180px]">
                    Las utilidades compran más tickets multiplicando el patrimonio.
                  </p>
                </div>
                <button
                  onClick={() => setReinvestEnabled(!reinvestEnabled)}
                  className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${
                    reinvestEnabled ? 'bg-red-600 flex justify-end' : 'bg-neutral-800 flex justify-start'
                  }`}
                >
                  <motion.div
                    layout
                    className="w-4 h-4 rounded-full bg-white shadow-md"
                  />
                </button>
              </div>
            </div>

            {/* Calculations breakdown details panel */}
            <div className="bg-neutral-950 p-6 rounded-3xl border border-neutral-800 space-y-4 text-sm">
              <h3 className="text-base font-bold font-montserrat text-neutral-300 pb-2 border-b border-neutral-800">
                Desglose de Descuentos
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-neutral-400">
                  <span>Precio de Ticket Base:</span>
                  <span className="text-white font-semibold">{formatCurrency(results.ticketPriceBeforeDiscount)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Descuento Manual:</span>
                  <span className="text-white font-semibold">{manualDiscount}%</span>
                </div>
                {results.financingPenalty > 0 && (
                  <div className="flex justify-between text-red-400">
                    <span>Castigo por Financiamiento:</span>
                    <span>-{results.financingPenalty}%</span>
                  </div>
                )}
                {results.volumeDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Descuento por Volumen:</span>
                    <span>+{results.volumeDiscount}%</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-400 pt-2 border-t border-neutral-800">
                  <span>Descuento Neto Total:</span>
                  <span className="text-red-500 font-bold">{results.netDiscount}%</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Precio después Descuento:</span>
                  <span className="text-white font-semibold">{formatCurrency(results.priceAfterDiscount)}</span>
                </div>
                {results.surchargePercentage > 0 && (
                  <>
                    <div className="flex justify-between text-orange-400">
                      <span>Recargo por Pago Diferido:</span>
                      <span>+{results.surchargePercentage}%</span>
                    </div>
                    <div className="text-3xs text-neutral-500 italic max-w-full">
                      *Aplica por precio de descuento ≤ $100,000 pesos.
                    </div>
                  </>
                )}
                <div className="flex justify-between text-white font-bold pt-2 border-t border-neutral-800 text-base">
                  <span>Precio Final p/Ticket:</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400">
                    {formatCurrency(results.finalPricePerTicket)}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Inversión Total Inicial ({numTickets} tix):</span>
                  <span className="text-white font-bold">{formatCurrency(results.totalInitialCost)}</span>
                </div>
                {isFinanced && (
                  <>
                    <div className="flex justify-between text-neutral-400 pt-2 border-t border-neutral-800">
                      <span>Enganche Aportado:</span>
                      <span className="text-emerald-400 font-semibold">{formatCurrency(downPayment)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Saldo Pendiente Financiado:</span>
                      <span className="text-white font-semibold">{formatCurrency(results.initialDebt)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400 font-bold">
                      <span>Mensualidad ({model === 'B' ? 12 : financingMonths} meses):</span>
                      <span className="text-red-500">{formatCurrency(results.monthlyPayment)} /mes</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Results Tabs & Data */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs selector */}
            <div className="flex border-b border-neutral-800">
              <button
                onClick={() => setActiveTab('scenarios')}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'scenarios'
                    ? 'border-red-600 text-red-500'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                Escenarios Operativos
              </button>
              <button
                onClick={() => setActiveTab('charts')}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'charts'
                    ? 'border-red-600 text-red-500'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                Gráficas Proyectadas
              </button>
              {isFinanced && (
                <button
                  onClick={() => setActiveTab('amortization')}
                  className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all ${
                    activeTab === 'amortization'
                      ? 'border-red-600 text-red-500'
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  Tabla Amortización
                </button>
              )}
              <button
                onClick={() => setActiveTab('table')}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'table'
                    ? 'border-red-600 text-red-500'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                Tabla Anual Detallada
              </button>
            </div>

            {/* Tab Contents */}
            <AnimatePresence mode="wait">
              {activeTab === 'scenarios' && (
                <motion.div
                  key="scenarios"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  {[results.scenarios.conservative, results.scenarios.moderate, results.scenarios.optimistic].map(sc => {
                    const isMod = sc.scenarioName === 'Moderado';
                    return (
                      <div
                        key={sc.scenarioName}
                        className={`p-6 rounded-3xl border flex flex-col justify-between h-full relative overflow-hidden ${
                          isMod
                            ? 'bg-neutral-900 border-red-600 shadow-xl shadow-red-600/5'
                            : 'bg-neutral-950 border-neutral-800'
                        }`}
                      >
                        {isMod && (
                          <div className="absolute top-0 right-0 bg-red-600 text-white text-3xs font-extrabold px-3 py-1 rounded-bl-xl tracking-wider">
                            BASE
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-sm">
                              🏍️
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-lg">{sc.scenarioName}</h4>
                              <p className="text-3xs text-neutral-400 uppercase tracking-wide">
                                {sc.motosPerMonth} motos / mes sucursal
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4 pt-4 border-t border-neutral-800">
                            <div>
                              <p className="text-3xs text-neutral-500 uppercase font-semibold">
                                Rendimiento por Ticket (Año 1)
                              </p>
                              <p className="text-xl font-bold text-white">
                                {formatCurrency(sc.yieldBaseYear0)} <span className="text-xs text-neutral-400">/año</span>
                              </p>
                            </div>

                            <div>
                              <p className="text-3xs text-neutral-500 uppercase font-semibold">
                                Tickets Finales (Año {years})
                              </p>
                              <p className="text-xl font-bold text-white">
                                {sc.finalTickets} tix
                              </p>
                            </div>

                            <div>
                              <p className="text-3xs text-neutral-500 uppercase font-semibold">
                                Flujo de Renta Mensual (Año {years})
                              </p>
                              <p className="text-2xl font-black text-red-500">
                                {formatCurrency(sc.finalYield / 12)} <span className="text-xs text-neutral-400">/mes</span>
                              </p>
                            </div>

                            <div>
                              <p className="text-3xs text-neutral-500 uppercase font-semibold">
                                Patrimonio Neto Proyectado
                              </p>
                              <p className="text-2xl font-black text-emerald-400">
                                {formatCurrency(sc.finalPatrimony)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-between items-center text-xs">
                          <span className="text-neutral-500">ROI Final Proyectado:</span>
                          <span className="font-bold text-emerald-400">+{sc.roi.toFixed(1)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {activeTab === 'charts' && (
                <motion.div
                  key="charts"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-neutral-950 p-6 rounded-3xl border border-neutral-800">
                    <h3 className="text-base font-bold font-montserrat text-neutral-300 mb-4">
                      Evolución del Patrimonio Neto Proyectado
                    </h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorMod" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorOpt" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                          <XAxis dataKey="name" stroke="#737373" />
                          <YAxis tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} stroke="#737373" />
                          <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                          <Legend />
                          <Area type="monotone" dataKey="Patrimonio Conservador" stroke="#3b82f6" strokeWidth={2} fill="url(#colorCons)" />
                          <Area type="monotone" dataKey="Patrimonio Moderado" stroke="#10b981" strokeWidth={3} fill="url(#colorMod)" />
                          <Area type="monotone" dataKey="Patrimonio Optimista" stroke="#f59e0b" strokeWidth={2} fill="url(#colorOpt)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-neutral-950 p-6 rounded-3xl border border-neutral-800">
                    <h3 className="text-base font-bold font-montserrat text-neutral-300 mb-4">
                      Rendimiento Anual por Escenario
                    </h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                          <XAxis dataKey="name" stroke="#737373" />
                          <YAxis tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} stroke="#737373" />
                          <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                          <Legend />
                          <Bar dataKey="Rendimiento Conservador" fill="#3b82f6" />
                          <Bar dataKey="Rendimiento Moderado" fill="#10b981" />
                          <Bar dataKey="Rendimiento Optimista" fill="#f59e0b" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'amortization' && isFinanced && (
                <motion.div
                  key="amortization"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-neutral-950 p-6 rounded-3xl border border-neutral-800 space-y-4"
                >
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
                    <div>
                      <h3 className="text-base font-bold font-montserrat text-neutral-300">
                        Tabla de Amortización del Financiamiento
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1">
                        Desglose mensual del saldo financiado de tu compra inicial.
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-neutral-400 uppercase">Mensualidad Fija</p>
                      <p className="text-lg font-bold text-red-500">{formatCurrency(results.monthlyPayment)}</p>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto pr-2">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-neutral-800 text-neutral-500 font-medium">
                          <th className="text-left py-2">Mes</th>
                          <th className="text-right py-2">Monto Mensual</th>
                          <th className="text-right py-2">Capital</th>
                          <th className="text-right py-2">Saldo Restante</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.amortizationTable.map(row => (
                          <tr key={row.month} className="border-b border-neutral-900/50 hover:bg-neutral-900/20 text-neutral-300">
                            <td className="py-2.5 font-bold">Mes {row.month}</td>
                            <td className="text-right py-2.5">{formatCurrency(row.payment)}</td>
                            <td className="text-right py-2.5">{formatCurrency(row.capital)}</td>
                            <td className="text-right py-2.5 font-semibold text-white">{formatCurrency(row.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'table' && (
                <motion.div
                  key="table"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-neutral-950 p-6 rounded-3xl border border-neutral-800 space-y-4"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                    <div>
                      <h3 className="text-base font-bold font-montserrat text-neutral-300">
                        Proyección Anual Detallada (Escenario Moderado)
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1">
                        Cálculos basados en el escenario operativo de 40 motos vendidas por mes. Haz click en una fila para ver el desglose.
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-red-600/20 text-red-400 rounded-full border border-red-500/20">
                      40 motos/mes
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-neutral-800 text-neutral-500 font-medium">
                          <th className="text-left py-3 px-2">Año</th>
                          <th className="text-right py-3 px-2">Tickets Totales</th>
                          <th className="text-right py-3 px-2">Rendimiento Anual</th>
                          <th className="text-right py-3 px-2">Capital Invertido</th>
                          <th className="text-right py-3 px-2">Deuda Pendiente</th>
                          <th className="text-right py-3 px-2">Patrimonio Neto</th>
                          <th className="text-right py-3 px-2">ROI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.scenarios.moderate.yearlyData.map(y => {
                          const isExpanded = expandedRow === y.year;
                          return (
                            <React.Fragment key={y.year}>
                              <tr
                                onClick={() => setExpandedRow(isExpanded ? null : y.year)}
                                className="border-b border-neutral-900 hover:bg-neutral-900/30 cursor-pointer text-neutral-300 transition-all"
                              >
                                <td className="py-3 px-2 font-bold text-white flex items-center gap-1.5">
                                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-neutral-500" /> : <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />}
                                  Año {y.year}
                                </td>
                                <td className="text-right py-3 px-2">{y.totalTickets} ({y.producingTickets} prod)</td>
                                <td className="text-right py-3 px-2 text-red-400 font-bold">{formatCurrency(y.annualYield)}</td>
                                <td className="text-right py-3 px-2">{formatCurrency(y.totalInvested)}</td>
                                <td className="text-right py-3 px-2 text-red-500">{formatCurrency(y.remainingDebt)}</td>
                                <td className="text-right py-3 px-2 text-emerald-400 font-bold">{formatCurrency(y.patrimony)}</td>
                                <td className="text-right py-3 px-2 font-semibold text-emerald-400">+{y.roi.toFixed(0)}%</td>
                              </tr>
                              {isExpanded && (
                                <tr>
                                  <td colSpan={7} className="py-4 px-6 bg-neutral-950 border-b border-neutral-900">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-neutral-400">
                                      <div className="space-y-2">
                                        <h4 className="font-bold text-white uppercase text-2xs tracking-wide">Valorización de Activos</h4>
                                        <div className="flex justify-between">
                                          <span>Tickets en cartera:</span>
                                          <span className="text-white font-semibold">{y.totalTickets} unidades</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Valor de mercado apreciado:</span>
                                          <span className="text-white font-semibold">{formatCurrency(y.appreciatedValue)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Deuda pendiente de pago:</span>
                                          <span className="text-red-500 font-semibold">{formatCurrency(y.remainingDebt)}</span>
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <h4 className="font-bold text-white uppercase text-2xs tracking-wide">Flujos de Caja</h4>
                                        <div className="flex justify-between">
                                          <span>Rendimientos anuales:</span>
                                          <span className="text-red-400 font-semibold">{formatCurrency(y.annualYield)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Rendimientos mensuales:</span>
                                          <span className="text-red-400 font-semibold">{formatCurrency(y.annualYield / 12)} /mes</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Rendimientos acumulados:</span>
                                          <span className="text-white font-semibold">{formatCurrency(y.cumulativeYield)}</span>
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <h4 className="font-bold text-white uppercase text-2xs tracking-wide">Detalle de Liquidez</h4>
                                        <div className="flex justify-between">
                                          <span>Efectivo disponible p/reinversión:</span>
                                          <span className="text-emerald-400 font-semibold">{formatCurrency(y.liquidCash)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Efectivo retirado acumulado:</span>
                                          <span className="text-white font-semibold">{formatCurrency(y.withdrawnCash)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Patrimonio Neto Total:</span>
                                          <span className="text-emerald-400 font-bold">{formatCurrency(y.patrimony)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Informative educational section */}
        <section className="bg-gradient-to-r from-red-950/20 via-neutral-950 to-red-950/20 border border-neutral-800 rounded-3xl p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/20 text-2xl font-bold">
              🚀
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-montserrat mb-2">
                ¿Cómo multiplica tu patrimonio el Interés Compuesto Multiplicador (ICM)?
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                A diferencia del interés compuesto tradicional que solo reinvierte dinero, el **ICM de RiderMex** utiliza tus rendimientos para adquirir **nuevos tickets de copropiedad**. Cada ticket adicional que compras con utilidades se convierte en una nueva fuente de ingresos reales de por vida que te paga mensualmente, respaldada por la plusvalía real de las sucursales y la venta de motocicletas.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CalculadoraMadre;
