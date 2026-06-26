import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, DollarSign, TrendingUp, BarChart3, Play, Pause, RotateCcw, Settings, Award, PiggyBank, Building2, ChevronDown, ChevronUp, Percent, Bike } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { useCalculator } from '../context/CalculatorContext';
import AnimatedNumberDisplay from './ui/AnimatedNumberDisplay';
import RidermexReportButton from './ui/RidermexReportButton';
import EscalonSelector from './ui/EscalonSelector';
import { DisclaimerBanner } from './ui/DisclaimerBanner';
import { ESCALONES, getEscalonByNumber, RIDERMEX_CONFIG, type EscalonData } from '../data/ridermexConfig';

interface ICMCalculatorProps {
  onBack?: () => void;
}

interface ComparisonOption {
  name: string;
  color: string;
  rate: number;
  description: string;
  icon: typeof PiggyBank;
  features: string[];
  risks: string[];
}

const productInfo = {
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

const ICMCalculator: React.FC<ICMCalculatorProps> = ({ onBack }) => {
  const { investment, updateInvestment, results } = useCalculator();
  const [initialInvestment, setInitialInvestment] = useState(ESCALONES[0].entryPrice);
  const [years, setYears] = useState(20);
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [inflationRate, setInflationRate] = useState(4.5);
  const [showRealValues, setShowRealValues] = useState(false);
  const [animationYear, setAnimationYear] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showDetailedTable, setShowDetailedTable] = useState(false);
  const [selectedEscalon, setSelectedEscalon] = useState(investment.ridermexEscalon || 1);

  const currentEscalonData = getEscalonByNumber(selectedEscalon);
  const escalonROI = currentEscalonData.roi;

  const currentProduct = productInfo[investment.ridermexProductType as 'A' | 'B' | 'C'] || productInfo.B;
  const ticketPrice = RIDERMEX_CONFIG.BASE_CALCULATION_PRICE;

  const handleEscalonChange = (escalon: EscalonData) => {
    setSelectedEscalon(escalon.number);
    updateInvestment({
      ridermexEscalon: escalon.number,
      ridermexEntryPrice: escalon.entryPrice,
      investorAnnualReturn: escalon.roi
    });
  };

  useEffect(() => {
    if (!investment.ridermexProductType) {
      updateInvestment({
        ridermexProductType: 'B',
        certificateBasePrice: ESCALONES[0].entryPrice,
        initialPayment: ESCALONES[0].entryPrice,
        ridermexDownPaymentAmount: ESCALONES[0].entryPrice,
        ridermexFinancingMonths: 0,
        ridermexFirstMonthlyIncome: 7,
        annualProfit: ESCALONES[0].roi,
        investorAnnualReturn: ESCALONES[0].roi
      });
    }
  }, [investment.ridermexProductType, updateInvestment]);

  useEffect(() => {
    const numberOfTickets = Math.floor(initialInvestment / ticketPrice);
    updateInvestment({
      initialCertificates: numberOfTickets,
      certificateBasePrice: ticketPrice,
      initialPayment: initialInvestment,
      years: years,
      reinvestProfits: true,
      partialCashOut: false,
      cashOutPercentage: 0,
      inflationRate: inflationRate
    });
  }, [initialInvestment, ticketPrice, years, inflationRate, updateInvestment]);

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

  const handleProductChange = (type: 'A' | 'B' | 'C') => {
    const product = productInfo[type];
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

  const comparisonOptions: ComparisonOption[] = [
    {
      name: 'Ahorro Tradicional',
      color: '#6b7280',
      rate: 3,
      description: 'Cuenta de ahorro bancaria',
      icon: PiggyBank,
      features: [
        'Rendimientos Estimados: 2% - 4% anual',
        'Alta liquidez inmediata',
        'Protegido hasta 400k UDIs',
        'Sin comisiones (generalmente)',
        'Fácil acceso'
      ],
      risks: [
        'Rendimientos no cubren inflación',
        'Pérdida de poder adquisitivo',
        'Sin crecimiento real del capital',
        'Oportunidad perdida de inversión'
      ]
    },
    {
      name: 'CETES',
      color: '#3b82f6',
      rate: 10,
      description: 'Certificados de la Tesorería',
      icon: Building2,
      features: [
        'Rendimientos Estimados: 8% - 12% anual',
        'Respaldados por gobierno',
        'Liquidez alta (28, 91, 182 días)',
        'Inversión mínima baja',
        'Seguridad alta'
      ],
      risks: [
        'Rendimientos apenas superan inflación',
        'Crecimiento real limitado',
        'No hay apreciación de activos',
        'Dependiente de tasas gubernamentales'
      ]
    },
    {
      name: 'RiderMex (Sin Reinversión)',
      color: '#f59e0b',
      rate: escalonROI,
      description: `Escalón ${currentEscalonData.name} sin reinvertir`,
      icon: Bike,
      features: [
        `ROI Estimado: ${escalonROI}% anual`,
        `Escalón: ${currentEscalonData.name} ($${currentEscalonData.entryPrice.toLocaleString()})`,
        'Activos físicos (tiendas de motocicletas)',
        'Protección patrimonial (3 fideicomisos)',
        'Seguro de cobertura amplia',
        'Ingreso anual disponible',
        'Patrimonio heredable'
      ],
      risks: [
        'Menor crecimiento que con reinversión',
        'Liquidez no inmediata',
        'Requiere confianza en modelo RiderMex'
      ]
    },
    {
      name: 'RiderMex (Con Reinversión)',
      color: '#10b981',
      rate: escalonROI,
      description: `Escalón ${currentEscalonData.name} reinvirtiendo`,
      icon: TrendingUp,
      features: [
        `Rendimientos Estimados: ${escalonROI}% anual compuesto`,
        `Escalón: ${currentEscalonData.name} ($${currentEscalonData.entryPrice.toLocaleString()})`,
        'Activos físicos (tiendas de motocicletas)',
        'Protección patrimonial (3 fideicomisos)',
        'Seguro de cobertura amplia',
        'Efecto multiplicador exponencial',
        'Protección contra inflación: Alta',
        'Patrimonio heredable y escalable'
      ],
      risks: [
        'Inversión a mediano/largo plazo',
        'Liquidez no inmediata',
        'Requiere disciplina de reinversión',
        'Requiere confianza en modelo RiderMex'
      ]
    }
  ];

  const calculateProjection = (option: ComparisonOption, withReinvestment: boolean = false) => {
    const yearlyData = [];
    const annualContribution = monthlyContribution * 12;
    let currentValue = initialInvestment;
    let totalContributed = initialInvestment;
    let totalProfit = 0;

    const isRidermex = option.name.includes('RiderMex');

    for (let year = 1; year <= years; year++) {
      if (isRidermex && withReinvestment && results?.yearlyData && results.yearlyData[year - 1]) {
        const yearData = results.yearlyData[year - 1];
        currentValue = yearData.citrusPatrimony;
        totalProfit = yearData.cumulativeTotalUtility;
      } else {
        const annualReturn = currentValue * (option.rate / 100);
        totalProfit += annualReturn;

        if (isRidermex && !withReinvestment) {
          currentValue += annualContribution;
        } else {
          currentValue += annualReturn + annualContribution;
        }

        totalContributed += annualContribution;
      }

      const inflationAdjusted = currentValue / Math.pow(1 + inflationRate / 100, year);

      yearlyData.push({
        year: year,
        patrimony: currentValue,
        patrimonyReal: inflationAdjusted,
        totalContributed,
        totalProfit,
        annualReturn: currentValue - (yearlyData[year - 2]?.patrimony || initialInvestment)
      });
    }

    const finalYear = yearlyData[yearlyData.length - 1];
    const roi = isRidermex 
      ? (finalYear.totalProfit / totalContributed) * 100
      : ((finalYear.patrimony - totalContributed) / totalContributed) * 100;

    return {
      yearlyData,
      finalPatrimony: finalYear.patrimony,
      finalPatrimonyReal: finalYear.patrimonyReal,
      totalContributed,
      totalProfit,
      roi
    };
  };

  const projections = comparisonOptions.map((option, idx) => {
    const withReinvestment = idx === 3;
    return {
      option,
      ...calculateProjection(option, withReinvestment)
    };
  });

  const chartData = Array.from({ length: animationYear + 1 }, (_, i) => {
    const dataPoint: any = {
      year: i + 1,
      yearNumber: i + 1
    };

    projections.forEach(proj => {
      const yearData = proj.yearlyData[i];
      if (yearData) {
        dataPoint[proj.option.name] = showRealValues ? yearData.patrimonyReal : yearData.patrimony;
      }
    });

    return dataPoint;
  });

  const resetAnimation = () => {
    setAnimationYear(0);
    setIsPlaying(false);
  };

  const toggleAnimation = () => {
    if (animationYear >= years - 1) {
      resetAnimation();
      setTimeout(() => setIsPlaying(true), 100);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  if (!results || !results.yearlyData || results.yearlyData.length < years) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-red/30 border-t-neon-red rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-300 font-medium">Calculando proyección estimada...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-dark-card text-neutral-100 rounded-lg hover:shadow-lg transition-all font-medium border-2 border-dark-border hover:border-neon-red"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Volver</span>
              </button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-neutral-100 flex items-center gap-3">
                <Bike className="w-8 h-8 text-neon-red" />
                Comparativa RiderMex vs Inversiones Tradicionales
              </h1>
              <p className="text-neutral-400 mt-1">
                Descubre el poder de la reinversión en activos productivos (valores estimados)
              </p>
            </div>
          </div>
        </div>

        <DisclaimerBanner variant="compact" />

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 bg-dark-card rounded-xl shadow-lg p-6 border border-dark-border"
          >
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-neon-red" />
              <h3 className="font-bold text-neutral-100">Configuración</h3>
            </div>

            <div className="space-y-6">
              <div className="bg-dark-surface rounded-xl p-4 border border-dark-border">
                <div className="flex items-center gap-2 mb-3">
                  <Bike className="w-5 h-5 text-neon-red" />
                  <label className="font-semibold text-neutral-100">Tipo de Producto RiderMex</label>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {(['A', 'B', 'C'] as const).map((type) => {
                    const product = productInfo[type];
                    const isSelected = investment.ridermexProductType === type;
                    return (
                      <motion.button
                        key={type}
                        onClick={() => handleProductChange(type)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={`p-3 rounded-lg text-left transition-all border-2 ${
                          isSelected
                            ? `bg-gradient-to-r ${product.color} text-white ${product.borderColor}`
                            : 'bg-dark-bg text-neutral-300 border-dark-border hover:border-neon-red/50'
                        }`}
                      >
                        <div className="font-bold">{product.title}</div>
                        <div className={`text-sm ${isSelected ? 'text-white/80' : 'text-neutral-500'}`}>
                          Ticket: ${product.price.toLocaleString()} | ROI Estimado: {product.roi}%
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <EscalonSelector
                selectedEscalon={selectedEscalon}
                onEscalonChange={handleEscalonChange}
                compact={true}
                theme="dark"
              />

              <div>
                <label className="text-sm font-semibold text-neutral-300 mb-2 block">
                  Inversión Inicial Estimada: <span className="text-neon-red">{formatCurrency(initialInvestment, 'MXN')}</span>
                </label>
                <input
                  type="number"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-dark-border bg-dark-surface rounded-xl focus:border-neon-red focus:outline-none font-semibold text-neutral-100"
                  step="10000"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-300 mb-2 block">
                  Plazo de Inversión: <span className="text-neon-green">{years} años</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-2 bg-dark-surface rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-300 mb-2 block">
                  Aportación Mensual Estimada: <span className="text-neon-green">{formatCurrency(monthlyContribution, 'MXN')}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="20000"
                  step="1000"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="w-full h-2 bg-dark-surface rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-neutral-500 mt-1">
                  <span>$0</span>
                  <span>$20k</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-300 mb-2 block">
                  Tasa de Inflación: <span className="text-orange-500">{inflationRate}%</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  step="0.5"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="w-full h-2 bg-dark-surface rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div className="bg-gradient-to-r from-neon-red to-red-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-red-100">Total a Invertir Estimado</div>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(initialInvestment + (monthlyContribution * years * 12), 'MXN')}
                </div>
                <div className="text-xs text-red-100 mt-1">
                  Durante {years} años
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-dark-surface rounded-xl border border-dark-border">
                <div>
                  <div className="font-semibold text-neutral-100">Valores Reales</div>
                  <div className="text-xs text-neutral-500">Ajustados por inflación</div>
                </div>
                <button
                  onClick={() => setShowRealValues(!showRealValues)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    showRealValues ? 'bg-neon-green' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showRealValues ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-dark-card rounded-2xl shadow-xl p-6 border border-dark-border"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-neon-red/20 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-neon-red" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-100">Evolución Comparativa Estimada</h2>
                  <p className="text-sm text-neutral-400">
                    Año {animationYear + 1} de {years} | {showRealValues ? 'Valores Reales' : 'Valores Nominales'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetAnimation}
                  className="p-2 bg-dark-surface rounded-lg hover:bg-dark-surface/80 transition-colors border border-dark-border"
                  title="Reiniciar"
                >
                  <RotateCcw className="w-5 h-5 text-neutral-300" />
                </button>
                <button
                  onClick={toggleAnimation}
                  className="p-2 bg-neon-red rounded-lg hover:bg-neon-red/80 transition-colors"
                  title={isPlaying ? 'Pausar' : 'Reproducir'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            </div>

            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    {comparisonOptions.map((option, idx) => (
                      <linearGradient key={idx} id={`gradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={option.color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={option.color} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="yearNumber"
                    stroke="#9ca3af"
                    label={{ value: 'Años', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                    label={{ value: 'Patrimonio Estimado (MXN)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f3f4f6' }}
                    formatter={(value: number) => formatCurrency(value, 'MXN')}
                    labelFormatter={(label) => `Año ${label}`}
                  />
                  <Legend />
                  {comparisonOptions.map((option, idx) => (
                    <Area
                      key={idx}
                      type="monotone"
                      dataKey={option.name}
                      stroke={option.color}
                      strokeWidth={2}
                      fill={`url(#gradient-${idx})`}
                      name={option.name}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4">
              <input
                type="range"
                min="0"
                max={years - 1}
                value={animationYear}
                onChange={(e) => {
                  setAnimationYear(Number(e.target.value));
                  setIsPlaying(false);
                }}
                className="w-full h-2 bg-dark-surface rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {projections.map((proj, idx) => {
            const Icon = proj.option.icon;
            const finalData = proj.yearlyData[animationYear];

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="bg-dark-card rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow cursor-pointer border border-dark-border"
                onClick={() => setSelectedOption(selectedOption === proj.option.name ? null : proj.option.name)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl`} style={{ backgroundColor: `${proj.option.color}20` }}>
                    <Icon className="w-6 h-6" style={{ color: proj.option.color }} />
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-400 transition-transform ${
                      selectedOption === proj.option.name ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                <h3 className="font-bold text-neutral-100 mb-1">{proj.option.name}</h3>
                <p className="text-xs text-neutral-500 mb-4">{proj.option.description}</p>

                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-neutral-400">Patrimonio Final Estimado</div>
                    <div className="text-2xl font-bold" style={{ color: proj.option.color }}>
                      {formatCurrency(finalData?.patrimony || 0, 'MXN')}
                    </div>
                    {showRealValues && (
                      <div className="text-xs text-neutral-500">
                        Real: {formatCurrency(finalData?.patrimonyReal || 0, 'MXN')}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dark-border">
                    <div>
                      <div className="text-xs text-neutral-400">ROI Estimado</div>
                      <div className="text-sm font-bold text-neon-green">
                        {proj.roi.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-neutral-400">Ganancia Estimada</div>
                      <div className="text-sm font-bold text-blue-500">
                        {formatCurrency(proj.totalProfit, 'MXN')}
                      </div>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {selectedOption === proj.option.name && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 pt-4 border-t border-dark-border"
                    >
                      <div className="mb-3">
                        <div className="text-xs font-semibold text-neutral-300 mb-2">Características:</div>
                        <ul className="space-y-1">
                          {proj.option.features.map((feature, i) => (
                            <li key={i} className="text-xs text-neutral-400 flex items-start gap-2">
                              <span className="text-neon-green mt-0.5">✓</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-neutral-300 mb-2">Consideraciones:</div>
                        <ul className="space-y-1">
                          {proj.option.risks.map((risk, i) => (
                            <li key={i} className="text-xs text-neutral-400 flex items-start gap-2">
                              <span className="text-orange-500 mt-0.5">⚠</span>
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-neon-red to-red-700 rounded-2xl shadow-xl p-8 text-white mb-8"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8" />
                <h2 className="text-2xl font-bold">El Poder de la Reinversión</h2>
              </div>
              <p className="text-red-100 mb-6 max-w-3xl">
                La diferencia entre RiderMex con y sin reinversión demuestra cómo el efecto multiplicador
                acelera exponencialmente el crecimiento estimado de tu patrimonio. Mientras que las inversiones
                tradicionales ofrecen retornos lineales y limitados, RiderMex con reinversión aprovecha el
                crecimiento compuesto de activos productivos reales: tiendas de motocicletas con 3 fideicomisos
                y seguro de cobertura amplia.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-3xl font-bold mb-1">
                    {formatCurrency(projections[3].finalPatrimony - projections[2].finalPatrimony, 'MXN')}
                  </div>
                  <div className="text-sm text-red-100">
                    Diferencia Estimada: RiderMex Con vs Sin Reinversión
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-3xl font-bold mb-1">
                    {((projections[3].finalPatrimony / projections[1].finalPatrimony) || 1).toFixed(1)}x
                  </div>
                  <div className="text-sm text-red-100">
                    Superior Estimado a CETES
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-3xl font-bold mb-1">
                    {((projections[3].finalPatrimony / projections[0].finalPatrimony) || 1).toFixed(1)}x
                  </div>
                  <div className="text-sm text-red-100">
                    Superior Estimado a Ahorro Tradicional
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center mb-8"
        >
          <button
            onClick={() => setShowDetailedTable(!showDetailedTable)}
            className="px-6 py-3 bg-dark-card text-neon-red font-semibold rounded-xl hover:shadow-lg transition-all border-2 border-dark-border hover:border-neon-red flex items-center gap-2 mx-auto"
          >
            {showDetailedTable ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            {showDetailedTable ? 'Ocultar' : 'Ver'} Tabla Detallada Estimada
          </button>
        </motion.div>

        <AnimatePresence>
          {showDetailedTable && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 bg-dark-card rounded-2xl shadow-xl overflow-hidden border border-dark-border mb-8"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-neon-red to-red-700 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Año</th>
                      {comparisonOptions.map((option, idx) => (
                        <th key={idx} className="px-4 py-3 text-right text-sm font-semibold">
                          {option.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border">
                    {Array.from({ length: Math.min(animationYear + 1, years) }, (_, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-dark-surface/50' : 'bg-dark-card'}>
                        <td className="px-4 py-3 text-sm font-semibold text-neutral-100">
                          {i + 1}
                        </td>
                        {projections.map((proj, idx) => {
                          const yearData = proj.yearlyData[i];
                          return (
                            <td key={idx} className="px-4 py-3 text-right text-sm text-neutral-300">
                              {formatCurrency(
                                showRealValues ? yearData?.patrimonyReal || 0 : yearData?.patrimony || 0,
                                'MXN'
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-dark-card rounded-2xl p-6 border border-dark-border"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-neon-red to-orange-500 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-100">Descargar Reporte RiderMex</h3>
              <p className="text-sm text-neutral-400">Exporta tu análisis comparativo estimado</p>
            </div>
          </div>
          <div className="flex justify-center">
            <RidermexReportButton variant="primary" size="lg" className="w-full max-w-md" />
          </div>
        </motion.div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
        }
      `}</style>
    </div>
  );
};

export default ICMCalculator;
