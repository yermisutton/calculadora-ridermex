import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, DollarSign, TrendingUp, BarChart3, Zap, Play, Pause, RotateCcw,
  Settings, Target, Award, PiggyBank, Home, Building2, AlertCircle, ChevronDown,
  ChevronUp, Percent, Calendar, Users, Scale, Shield, TrendingDown
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useCalculator } from '../context/CalculatorContext';
import { formatCurrency } from '../utils/formatters';
import { DisclaimerBanner } from './ui/DisclaimerBanner';
import AnimatedNumberDisplay from './ui/AnimatedNumberDisplay';
import RidermexReportButton from './ui/RidermexReportButton';
import EscalonSelector from './ui/EscalonSelector';
import { ESCALONES, RIDERMEX_CONFIG, type EscalonData } from '../data/ridermexConfig';

interface VitaminadaCalculatorProps {
  onBack?: () => void;
}

interface InvestmentOption {
  id: string;
  name: string;
  color: string;
  rate: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
}

interface ProductInfo {
  title: string;
  price: number;
  downPayment: number;
  firstIncome: number;
  roi: number;
  color: string;
  borderColor: string;
  bgColor: string;
}

const VitaminadaCalculator: React.FC<VitaminadaCalculatorProps> = ({ onBack }) => {
  const { investment, updateInvestment, results } = useCalculator();

  const [initialInvestment, setInitialInvestment] = useState(ESCALONES[0].entryPrice);
  const [years, setYears] = useState(20);
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [inflationRate, setInflationRate] = useState(4.5);
  const [showRealValues, setShowRealValues] = useState(false);
  const [reinvestmentPercentage, setReinvestmentPercentage] = useState(100);
  const [animationYear, setAnimationYear] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(800);
  const [showDetailedTable, setShowDetailedTable] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<'A' | 'B' | 'C'>('B');
  const [selectedEscalon, setSelectedEscalon] = useState(investment.ridermexEscalon || 1);

  const currentEscalonData = ESCALONES.find(e => e.number === selectedEscalon) || ESCALONES[0];

  const handleEscalonChange = (escalon: EscalonData) => {
    setSelectedEscalon(escalon.number);
    setInitialInvestment(escalon.entryPrice);
    updateInvestment({ ridermexEscalon: escalon.number, ridermexEntryPrice: escalon.entryPrice });
  };

  const productInfo: Record<'A' | 'B' | 'C', ProductInfo> = {
    A: {
      title: 'Modelo A: Con Financiamiento',
      price: ESCALONES[0].entryPrice,
      downPayment: 10000,
      firstIncome: 18,
      roi: ESCALONES[0].roi,
      color: 'from-blue-500 to-cyan-600',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-600'
    },
    B: {
      title: 'Modelo B: Pago de Contado',
      price: ESCALONES[0].entryPrice,
      downPayment: ESCALONES[0].entryPrice,
      firstIncome: 7,
      roi: ESCALONES[0].roi,
      color: 'from-green-500 to-emerald-600',
      borderColor: 'border-green-500',
      bgColor: 'bg-green-600'
    },
    C: {
      title: 'Modelo C: Agencia Madura',
      price: RIDERMEX_CONFIG.TICKET_PRICE_MODEL_C,
      downPayment: RIDERMEX_CONFIG.TICKET_PRICE_MODEL_C,
      firstIncome: 1,
      roi: parseFloat(((RIDERMEX_CONFIG.ANNUAL_RETURN_PER_TICKET / RIDERMEX_CONFIG.TICKET_PRICE_MODEL_C) * 100).toFixed(2)),
      color: 'from-amber-500 to-orange-600',
      borderColor: 'border-amber-500',
      bgColor: 'bg-amber-600'
    }
  };

  const currentProduct = productInfo[selectedProduct];

  const investmentOptions: InvestmentOption[] = [
    {
      id: 'ahorro',
      name: 'Ahorro',
      color: '#3b82f6',
      rate: 5,
      description: 'Cuenta de ahorro tradicional',
      icon: PiggyBank,
      features: [
        '5% rendimiento anual',
        'Alta liquidez',
        'Sin riesgo aparente',
        'Apenas cubre inflación'
      ]
    },
    {
      id: 'bienraiz',
      name: 'Bien Raíz',
      color: '#f59e0b',
      rate: 8,
      description: 'Inversión en bienes raíces',
      icon: Building2,
      features: [
        '8% apreciación anual',
        'Activo tangible',
        'Requiere administración',
        'Liquidez baja'
      ]
    },
    {
      id: 'cetes',
      name: 'CETES',
      color: '#64748b',
      rate: 10,
      description: 'Certificados de la Tesorería',
      icon: Home,
      features: [
        '10% rendimiento anual',
        'Respaldo gubernamental',
        'Liquidez media',
        'Sin crecimiento patrimonial'
      ]
    },
    {
      id: 'ridermex',
      name: 'RiderMex',
      color: '#10b981',
      rate: currentProduct.roi,
      description: 'Tiendas de motocicletas',
      icon: Target,
      features: [
        `${currentProduct.roi}% ROI estimado`,
        'Protección con 3 fideicomisos',
        'Seguro de cobertura amplia',
        'Patrimonio heredable'
      ]
    }
  ];

  const handleProductChange = (type: 'A' | 'B' | 'C') => {
    setSelectedProduct(type);
    const product = productInfo[type];
    setInitialInvestment(product.downPayment);
    updateInvestment({
      ridermexProductType: type,
      certificateBasePrice: product.price,
      initialPayment: product.downPayment,
      ridermexDownPaymentAmount: product.downPayment,
      ridermexFinancingMonths: type === 'A' ? 12 : 0,
      ridermexFirstMonthlyIncome: product.firstIncome,
      annualProfit: product.roi,
      investorAnnualReturn: product.roi
    });
  };

  React.useEffect(() => {
    const product = productInfo[selectedProduct];
    updateInvestment({
      ridermexProductType: selectedProduct,
      certificateBasePrice: product.price,
      initialPayment: product.downPayment,
      ridermexDownPaymentAmount: product.downPayment,
      ridermexFinancingMonths: selectedProduct === 'A' ? 12 : 0,
      ridermexFirstMonthlyIncome: product.firstIncome,
      annualProfit: product.roi,
      investorAnnualReturn: product.roi,
      years: years,
      reinvestProfits: true,
      reinvestmentPercentages: Array(years).fill(reinvestmentPercentage),
      monthlyContribution: monthlyContribution,
      inflationRate: inflationRate
    });
  }, [selectedProduct, years, reinvestmentPercentage, monthlyContribution, inflationRate]);

  useEffect(() => {
    if (isPlaying && animationYear < years - 1) {
      const timer = setTimeout(() => {
        setAnimationYear(prev => prev + 1);
      }, animationSpeed);
      return () => clearTimeout(timer);
    } else if (animationYear >= years - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, animationYear, years, animationSpeed]);

  if (!results || !results.yearlyData || results.yearlyData.length === 0 || results.yearlyData.length < years) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dark-border border-t-neon-red rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-100 font-medium">Calculando comparación...</p>
          <p className="text-neutral-400 text-sm mt-2">Años calculados: {results?.yearlyData?.length || 0} / {years}</p>
        </div>
      </div>
    );
  }

  const calculateProjection = (option: InvestmentOption) => {
    const yearlyData = [];
    const annualContribution = monthlyContribution * 12;

    if (option.id === 'ridermex') {
      if (results && results.yearlyData && results.yearlyData.length > 0) {
        results.yearlyData.forEach((yearData, index) => {
          if (index < years) {
            const inflationFactor = Math.pow(1 + inflationRate / 100, index + 1);
            const realPatrimony = yearData.citrusPatrimony / inflationFactor;
            const realMonthlyIncome = (yearData.citrusIncome / 12) / inflationFactor;

            yearlyData.push({
              year: index + 1,
              patrimony: Math.round(yearData.citrusPatrimony),
              realPatrimony: Math.round(realPatrimony),
              monthlyIncome: Math.round(yearData.citrusIncome / 12),
              realMonthlyIncome: Math.round(realMonthlyIncome),
              totalContributed: currentProduct.downPayment + (annualContribution * (index + 1)),
              totalCertificates: yearData.totalCertificates
            });
          }
        });
      }
    } else {
      let patrimony = initialInvestment;

      for (let year = 1; year <= years; year++) {
        patrimony += annualContribution;
        const yearlyReturn = patrimony * (option.rate / 100);

        const reinvestedAmount = yearlyReturn * (reinvestmentPercentage / 100);
        patrimony += reinvestedAmount;

        const monthlyIncome = yearlyReturn / 12;
        const inflationFactor = Math.pow(1 + inflationRate / 100, year);
        const realPatrimony = patrimony / inflationFactor;
        const realMonthlyIncome = monthlyIncome / inflationFactor;

        yearlyData.push({
          year,
          patrimony: Math.round(patrimony),
          realPatrimony: Math.round(realPatrimony),
          monthlyIncome: Math.round(monthlyIncome),
          realMonthlyIncome: Math.round(realMonthlyIncome),
          totalContributed: initialInvestment + (annualContribution * year),
          totalCertificates: 0
        });
      }
    }

    return yearlyData;
  };

  const ahorroData = calculateProjection(investmentOptions[0]);
  const bienRaizData = calculateProjection(investmentOptions[1]);
  const cetesData = calculateProjection(investmentOptions[2]);
  const ridermexData = calculateProjection(investmentOptions[3]);

  const ahorroFinal = ahorroData[ahorroData.length - 1];
  const bienRaizFinal = bienRaizData[bienRaizData.length - 1];
  const cetesFinal = cetesData[cetesData.length - 1];
  const ridermexFinal = ridermexData[ridermexData.length - 1];

  const combinedTraditional = ahorroFinal.patrimony + bienRaizFinal.patrimony + cetesFinal.patrimony;
  const combinedTraditionalReal = ahorroFinal.realPatrimony + bienRaizFinal.realPatrimony + cetesFinal.realPatrimony;
  const advantage = ridermexFinal.patrimony - combinedTraditional;
  const advantageMultiplier = (ridermexFinal.patrimony / combinedTraditional).toFixed(2);

  const generateChartData = () => {
    return Array.from({ length: Math.min(animationYear + 1, years) }, (_, i) => {
      const ahorro = ahorroData[i];
      const bienRaiz = bienRaizData[i];
      const cetes = cetesData[i];
      const ridermex = ridermexData[i];

      return {
        year: i + 1,
        Ahorro: showRealValues ? ahorro.realPatrimony : ahorro.patrimony,
        'Bien Raíz': showRealValues ? bienRaiz.realPatrimony : bienRaiz.patrimony,
        CETES: showRealValues ? cetes.realPatrimony : cetes.patrimony,
        Combinadas: showRealValues
          ? (ahorro.realPatrimony + bienRaiz.realPatrimony + cetes.realPatrimony)
          : (ahorro.patrimony + bienRaiz.patrimony + cetes.patrimony),
        RiderMex: showRealValues ? ridermex.realPatrimony : ridermex.patrimony
      };
    });
  };

  const generateBarChartData = () => {
    const lastYear = showRealValues
      ? [
          { name: 'Ahorro', value: ahorroFinal.realPatrimony, fill: '#3b82f6' },
          { name: 'Bien Raíz', value: bienRaizFinal.realPatrimony, fill: '#f59e0b' },
          { name: 'CETES', value: cetesFinal.realPatrimony, fill: '#64748b' },
          { name: 'Combinadas', value: combinedTraditionalReal, fill: '#ef4444' },
          { name: 'RiderMex', value: ridermexFinal.realPatrimony, fill: '#10b981' }
        ]
      : [
          { name: 'Ahorro', value: ahorroFinal.patrimony, fill: '#3b82f6' },
          { name: 'Bien Raíz', value: bienRaizFinal.patrimony, fill: '#f59e0b' },
          { name: 'CETES', value: cetesFinal.patrimony, fill: '#64748b' },
          { name: 'Combinadas', value: combinedTraditional, fill: '#ef4444' },
          { name: 'RiderMex', value: ridermexFinal.patrimony, fill: '#10b981' }
        ];

    return lastYear;
  };

  const handlePlayPause = () => {
    if (!isPlaying && animationYear >= years - 1) {
      setAnimationYear(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setAnimationYear(0);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <style>{`
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
        }
        input[type="range"]::-webkit-slider-track {
          background: linear-gradient(to right, #10b981, #059669);
          height: 8px;
          border-radius: 4px;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 3px solid #1f2937;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }
        input[type="range"]::-moz-range-track {
          background: linear-gradient(to right, #10b981, #059669);
          height: 8px;
          border-radius: 4px;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 3px solid #1f2937;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }
      `}</style>

      <div className="sticky top-0 z-50 bg-dark-card/95 backdrop-blur-md border-b border-dark-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-dark-surface rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-neutral-300" />
                </button>
              )}
              <div>
                <h1 className="text-xl font-bold text-neutral-100">Calculadora Vitaminada</h1>
                <p className="text-sm text-neutral-400">RiderMex vs Las 3 Juntas</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Scale className="w-6 h-6 text-neon-red" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-600 via-neon-red to-red-700 rounded-3xl p-8 text-white mb-8 shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">RiderMex no compite. Supera.</h2>
              <p className="text-red-100 text-lg">
                Una sola inversión vence a las tres tradicionales juntas
              </p>
            </div>
            <Zap className="w-16 h-16 opacity-20" />
          </div>
        </motion.div>

        <DisclaimerBanner variant="compact" />

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-dark-card rounded-2xl shadow-lg p-6 border border-dark-border"
            >
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-neon-green" />
                <h3 className="text-lg font-bold text-neutral-100">Parámetros</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-300 mb-3">
                    Selecciona tu Modelo
                  </label>
                  <div className="space-y-2">
                    {(['A', 'B', 'C'] as const).map((type) => {
                      const product = productInfo[type];
                      return (
                        <button
                          key={type}
                          onClick={() => handleProductChange(type)}
                          className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                            selectedProduct === type
                              ? `${product.borderColor} bg-dark-surface`
                              : 'border-dark-border bg-dark-bg hover:bg-dark-surface'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-bold text-neutral-100">{product.title}</div>
                              <div className="text-xs text-neutral-400 mt-1">
                                ROI Estimado: {product.roi}% | Enganche: {formatCurrency(product.downPayment, 'MXN', true)}
                              </div>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${selectedProduct === type ? product.bgColor : 'bg-neutral-600'}`} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-300 mb-2">
                    Inversión Inicial Estimada: {formatCurrency(initialInvestment, 'MXN')}
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="10000"
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(Number(e.target.value))}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-neutral-500 mt-1">
                    <span>$10k</span>
                    <span>$500k</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-300 mb-2">
                    Horizonte: {years} años
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-neutral-500 mt-1">
                    <span>5 años</span>
                    <span>30 años</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-300 mb-2">
                    Aportación Mensual Estimada: {formatCurrency(monthlyContribution, 'MXN')}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="1000"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-neutral-500 mt-1">
                    <span>$0</span>
                    <span>$50k</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-300 mb-2">
                    Reinversión Estimada: {reinvestmentPercentage}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={reinvestmentPercentage}
                    onChange={(e) => setReinvestmentPercentage(Number(e.target.value))}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-neutral-500 mt-1">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-dark-border">
                  <button
                    onClick={() => setShowRealValues(!showRealValues)}
                    className="w-full flex items-center justify-between p-3 bg-dark-surface hover:bg-dark-bg rounded-lg transition-colors"
                  >
                    <span className="text-sm font-medium text-neutral-300">
                      {showRealValues ? 'Valores Reales (ajustado inflación)' : 'Valores Nominales'}
                    </span>
                    <TrendingDown className={`w-5 h-5 ${showRealValues ? 'text-neon-green' : 'text-neutral-500'}`} />
                  </button>
                  {showRealValues && (
                    <p className="text-xs text-neutral-500 mt-2">
                      Ajustado con inflación de {inflationRate}% anual
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
            >
              <EscalonSelector
                selectedEscalon={selectedEscalon}
                onEscalonChange={handleEscalonChange}
                compact={false}
                theme="dark"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-dark-card rounded-2xl shadow-lg p-6 border border-dark-border"
            >
              <div className="flex items-center gap-2 mb-4">
                <Play className="w-5 h-5 text-neon-green" />
                <h3 className="text-lg font-bold text-neutral-100">Animación</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePlayPause}
                    className="flex-1 px-4 py-2 bg-neon-green hover:bg-green-600 text-dark-bg rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'Pausar' : 'Reproducir'}
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-dark-surface hover:bg-dark-bg text-neutral-300 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm text-neutral-400 mb-2">
                    <span>Año {animationYear + 1} de {years}</span>
                    <span>{Math.round(((animationYear + 1) / years) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-dark-surface rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neon-green to-green-600 transition-all duration-300"
                      style={{ width: `${((animationYear + 1) / years) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-card rounded-2xl shadow-lg p-6 border border-dark-border"
            >
              <h3 className="text-lg font-bold text-neutral-100 mb-6">Evolución de Patrimonio Estimado</h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={generateChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="year" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value, 'MXN')}
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f3f4f6' }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="Ahorro" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="Bien Raíz" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="CETES" stackId="1" stroke="#64748b" fill="#64748b" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="Combinadas" stroke="#ef4444" fill="none" strokeWidth={2} strokeDasharray="5 5" />
                  <Area type="monotone" dataKey="RiderMex" stroke="#10b981" fill="#10b981" fillOpacity={0.3} strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-dark-card rounded-2xl shadow-lg p-6 border border-dark-border"
            >
              <h3 className="text-lg font-bold text-neutral-100 mb-6">Comparación Final Estimada (Año {years})</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={generateBarChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value, 'MXN')}
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f3f4f6' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {generateBarChartData().map((entry, index) => (
                      <rect key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          <div className="bg-dark-card rounded-2xl p-6 border-2 border-red-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-dark-surface rounded-xl flex items-center justify-center">
                <Scale className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-100">Las 3 Tradicionales Juntas</h3>
                <p className="text-sm text-neutral-400">Ahorro + Bien Raíz + CETES</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">Patrimonio Final Estimado:</span>
                <span className="text-xl font-bold text-red-500">
                  {formatCurrency(showRealValues ? combinedTraditionalReal : combinedTraditional, 'MXN')}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-dark-border">
                <div className="text-center">
                  <div className="text-xs text-neutral-500">Ahorro</div>
                  <div className="text-sm font-bold text-blue-500">
                    {formatCurrency(showRealValues ? ahorroFinal.realPatrimony : ahorroFinal.patrimony, 'MXN', true)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-neutral-500">Bien Raíz</div>
                  <div className="text-sm font-bold text-amber-500">
                    {formatCurrency(showRealValues ? bienRaizFinal.realPatrimony : bienRaizFinal.patrimony, 'MXN', true)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-neutral-500">CETES</div>
                  <div className="text-sm font-bold text-slate-400">
                    {formatCurrency(showRealValues ? cetesFinal.realPatrimony : cetesFinal.patrimony, 'MXN', true)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-white shadow-2xl border-2 border-neon-green">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">RiderMex</h3>
                <p className="text-sm text-green-100">Una sola inversión</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-100">Patrimonio Final Estimado:</span>
                <span className="text-2xl font-bold">
                  {formatCurrency(showRealValues ? ridermexFinal.realPatrimony : ridermexFinal.patrimony, 'MXN')}
                </span>
              </div>
              <div className="pt-3 border-t border-green-400">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-green-100">Ventaja Estimada sobre las 3:</span>
                  <span className="text-xl font-bold text-yellow-300">
                    {formatCurrency(showRealValues ? (ridermexFinal.realPatrimony - combinedTraditionalReal) : advantage, 'MXN')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-100">Multiplicador:</span>
                  <span className="text-xl font-bold text-yellow-300">{advantageMultiplier}x</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-card rounded-2xl shadow-lg p-6 border border-dark-border"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-neutral-100">Tabla Detallada Año por Año (Valores Estimados)</h3>
            <button
              onClick={() => setShowDetailedTable(!showDetailedTable)}
              className="flex items-center gap-2 px-4 py-2 bg-dark-surface hover:bg-dark-bg rounded-lg transition-colors text-sm font-medium text-neutral-300"
            >
              {showDetailedTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showDetailedTable ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          <AnimatePresence>
            {showDetailedTable && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-x-auto"
              >
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b-2 border-dark-border">
                      <th className="text-left py-3 px-4 font-semibold text-neutral-300">Año</th>
                      <th className="text-right py-3 px-4 font-semibold text-blue-400">Ahorro</th>
                      <th className="text-right py-3 px-4 font-semibold text-amber-400">Bien Raíz</th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-400">CETES</th>
                      <th className="text-right py-3 px-4 font-semibold text-red-400">Combinadas</th>
                      <th className="text-right py-3 px-4 font-semibold text-green-400">RiderMex</th>
                      <th className="text-right py-3 px-4 font-semibold text-neutral-300">Ventaja</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border">
                    {Array.from({ length: years }, (_, i) => {
                      const ahorro = ahorroData[i];
                      const bienRaiz = bienRaizData[i];
                      const cetes = cetesData[i];
                      const ridermex = ridermexData[i];
                      const combined = showRealValues
                        ? (ahorro.realPatrimony + bienRaiz.realPatrimony + cetes.realPatrimony)
                        : (ahorro.patrimony + bienRaiz.patrimony + cetes.patrimony);
                      const ridermexValue = showRealValues ? ridermex.realPatrimony : ridermex.patrimony;
                      const diff = ridermexValue - combined;

                      return (
                        <tr key={i} className="hover:bg-dark-surface transition-colors">
                          <td className="py-3 px-4 font-medium text-neutral-100">{i + 1}</td>
                          <td className="py-3 px-4 text-right text-blue-400">
                            {formatCurrency(showRealValues ? ahorro.realPatrimony : ahorro.patrimony, 'MXN', true)}
                          </td>
                          <td className="py-3 px-4 text-right text-amber-400">
                            {formatCurrency(showRealValues ? bienRaiz.realPatrimony : bienRaiz.patrimony, 'MXN', true)}
                          </td>
                          <td className="py-3 px-4 text-right text-slate-400">
                            {formatCurrency(showRealValues ? cetes.realPatrimony : cetes.patrimony, 'MXN', true)}
                          </td>
                          <td className="py-3 px-4 text-right text-red-400 font-semibold">
                            {formatCurrency(combined, 'MXN', true)}
                          </td>
                          <td className="py-3 px-4 text-right text-green-400 font-bold">
                            {formatCurrency(ridermexValue, 'MXN', true)}
                          </td>
                          <td className={`py-3 px-4 text-right font-semibold ${diff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {diff > 0 ? '+' : ''}{formatCurrency(diff, 'MXN', true)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-gradient-to-r from-red-600 via-neon-red to-red-700 rounded-2xl p-8 text-white text-center shadow-xl"
        >
          <Award className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h3 className="text-2xl font-bold mb-2">
            RiderMex supera a las 3 inversiones tradicionales juntas
          </h3>
          <p className="text-red-100 text-lg mb-6">
            Una sola decisión puede rendir más que tres estrategias combinadas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-red-600 rounded-xl font-bold hover:bg-gray-50 transition-colors">
              Agendar Asesoría
            </button>
            <RidermexReportButton />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VitaminadaCalculator;
