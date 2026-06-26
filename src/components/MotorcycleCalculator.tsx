import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, DollarSign, TrendingUp, BarChart3, Zap, Play, Pause, RotateCcw, Settings, Target, Award, PiggyBank, Home, Building2, TrendingDown, AlertCircle, ChevronDown, ChevronUp, Percent, Bike } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { calculateMotorcycleCompoundGrowth, calculateSimpleCompoundGrowth } from '../utils/calculations/compoundGrowth';
import EscalonSelector from './ui/EscalonSelector';
import { DisclaimerBanner } from './ui/DisclaimerBanner';
import { getEscalonByNumber, RIDERMEX_CONFIG, type EscalonData } from '../data/ridermexConfig';

interface MotorcycleCalculatorProps {
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

const MotorcycleCalculator: React.FC<MotorcycleCalculatorProps> = ({ onBack }) => {
  const [initialInvestment, setInitialInvestment] = useState(70000);
  const [years, setYears] = useState(20);
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [inflationRate, setInflationRate] = useState(4.5);
  const [showRealValues, setShowRealValues] = useState(false);
  const [animationYear, setAnimationYear] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showDetailedTable, setShowDetailedTable] = useState(false);
  const [selectedEscalon, setSelectedEscalon] = useState(1);
  const currentEscalonData = getEscalonByNumber(selectedEscalon);

  const handleEscalonChange = (escalon: EscalonData) => {
    setSelectedEscalon(escalon.number);
  };

  const ticketPrice = RIDERMEX_CONFIG.BASE_CALCULATION_PRICE;
  const averageSalesPerYear = RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR;
  const averageUtilityPerMotorcycle = RIDERMEX_CONFIG.PROFIT_PER_MOTORCYCLE;
  const motorcyclePriceIncrease = 5;
  const ticketAppreciation = 50;
  const investorFactor = 0.70;
  const totalTicketsPerStore = 30;

  const comparisonOptions: ComparisonOption[] = [
    {
      name: 'Ahorro Tradicional',
      color: '#6b7280',
      rate: 3,
      description: 'Cuenta de ahorro bancaria',
      icon: PiggyBank,
      features: [
        'Rendimientos: 2% - 4% anual',
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
        'Rendimientos: 8% - 12% anual',
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
      name: 'Tickets Moto (Sin Reinversión)',
      color: '#f59e0b',
      rate: currentEscalonData.roi,
      description: `Escalón ${currentEscalonData.name} sin reinvertir`,
      icon: Bike,
      features: [
        `ROI Estimado: ${currentEscalonData.roi}% anual`,
        `Escalón: ${currentEscalonData.name} ($${currentEscalonData.entryPrice.toLocaleString()})`,
        'Apreciación: 50% año 1',
        'Incremento utilidad moto: 5% año 2+',
        'Negocio establecido (480 motos/año)',
        'Ingreso anual disponible',
        'Patrimonio comercial heredable'
      ],
      risks: [
        'Menor crecimiento que con reinversión',
        'Liquidez no inmediata',
        'Dependiente del sector automotriz'
      ]
    },
    {
      name: 'Tickets Moto (Con Reinversión)',
      color: '#10b981',
      rate: currentEscalonData.roi * 1.45,
      description: `Escalón ${currentEscalonData.name} reinvirtiendo`,
      icon: TrendingUp,
      features: [
        `ROI Estimado: ${currentEscalonData.roi}%+ anual compuesto`,
        `Escalón: ${currentEscalonData.name} ($${currentEscalonData.entryPrice.toLocaleString()})`,
        'Apreciación: 50% año 1',
        'Incremento utilidad: 5% año 2+',
        'Negocio físico establecido',
        'Efecto multiplicador exponencial',
        'Protección contra inflación: Alta',
        'Patrimonio comercial escalable'
      ],
      risks: [
        'Inversión a mediano/largo plazo',
        'Liquidez no inmediata',
        'Requiere disciplina de reinversión',
        'Dependiente del sector automotriz'
      ]
    }
  ];

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

  const calculateProjection = (option: ComparisonOption, isMotorcycle: boolean = false) => {
    const yearlyData = [];
    const annualContribution = monthlyContribution * 12;
    let currentValue = initialInvestment;
    let totalContributed = initialInvestment;
    let totalProfit = 0;

    for (let year = 1; year <= years; year++) {
      if (isMotorcycle) {
        const result = calculateMotorcycleCompoundGrowth(
          initialInvestment + (annualContribution * year),
          year,
          ticketPrice,
          averageSalesPerYear,
          averageUtilityPerMotorcycle,
          motorcyclePriceIncrease,
          investorFactor,
          totalTicketsPerStore,
          ticketAppreciation,
          inflationRate,
          2
        );
        currentValue = result.finalAmount;
        totalProfit = currentValue - (initialInvestment + (annualContribution * year));
        totalContributed = initialInvestment + (annualContribution * year);
      } else {
        const annualReturn = currentValue * (option.rate / 100);
        totalProfit += annualReturn;
        currentValue += annualReturn + annualContribution;
        totalContributed += annualContribution;
      }

      const inflationAdjusted = currentValue / Math.pow(1 + inflationRate / 100, year);

      yearlyData.push({
        year: currentAge + year,
        yearNumber: year,
        patrimony: currentValue,
        patrimonyReal: inflationAdjusted,
        totalContributed,
        totalProfit,
        annualReturn: currentValue - (yearlyData[year - 2]?.patrimony || initialInvestment)
      });
    }

    const finalYear = yearlyData[yearlyData.length - 1];
    const roi = ((finalYear.patrimony - totalContributed) / totalContributed) * 100;

    return {
      yearlyData,
      finalPatrimony: finalYear.patrimony,
      finalPatrimonyReal: finalYear.patrimonyReal,
      totalContributed,
      totalProfit,
      roi
    };
  };

  const currentAge = new Date().getFullYear() - 1990;
  const projections = comparisonOptions.map(option => {
    const isMotorcycle = option.name.includes('Tickets Moto');
    return {
      option,
      ...calculateProjection(option, isMotorcycle)
    };
  });

  const animatedData = projections.map(proj => ({
    option: proj.option,
    yearlyData: proj.yearlyData.slice(0, animationYear + 1)
  }));

  const currentYearData = projections.map(proj => ({
    name: proj.option.name,
    value: showRealValues
      ? proj.yearlyData[animationYear]?.patrimonyReal || 0
      : proj.yearlyData[animationYear]?.patrimony || 0,
    color: proj.option.color
  }));

  const chartData = Array.from({ length: animationYear + 1 }, (_, i) => {
    const dataPoint: any = {
      year: currentAge + i + 1,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 rounded-lg hover:shadow-lg transition-all font-medium border-2 border-orange-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Volver</span>
              </button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Bike className="w-8 h-8 text-orange-600" />
                Comparativa Tickets Moto vs Inversiones Tradicionales
              </h1>
              <p className="text-gray-600 mt-1">
                Descubre el poder de invertir en un negocio real de motocicletas
              </p>
            </div>
          </div>
        </div>

        <DisclaimerBanner variant="compact" />

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-orange-600" />
              <h3 className="font-bold text-gray-900">Configuración</h3>
            </div>

            <div className="space-y-6">
              <EscalonSelector
                selectedEscalon={selectedEscalon}
                onEscalonChange={handleEscalonChange}
                compact={true}
                theme="light"
              />

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Inversión Inicial: <span className="text-orange-600">{formatCurrency(initialInvestment, 'MXN')}</span>
                </label>
                <input
                  type="number"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none font-semibold"
                  step="10000"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Plazo de Inversión: <span className="text-orange-600">{years} años</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Aportación Mensual: <span className="text-orange-600">{formatCurrency(monthlyContribution, 'MXN')}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="20000"
                  step="1000"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$0</span>
                  <span>$20k</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Tasa de Inflación: <span className="text-red-600">{inflationRate}%</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  step="0.5"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-sm font-semibold text-orange-800">Total a Invertir</div>
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(initialInvestment + (monthlyContribution * years * 12), 'MXN')}
                </div>
                <div className="text-xs text-orange-600 mt-1">
                  Durante {years} años
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-semibold text-gray-900">Valores Reales</div>
                  <div className="text-xs text-gray-500">Ajustados por inflación</div>
                </div>
                <button
                  onClick={() => setShowRealValues(!showRealValues)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    showRealValues ? 'bg-orange-600' : 'bg-gray-300'
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
            className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Evolución Comparativa</h2>
                  <p className="text-sm text-gray-600">
                    Año {animationYear + 1} de {years} | {showRealValues ? 'Valores Reales' : 'Valores Nominales'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetAnimation}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Reiniciar"
                >
                  <RotateCcw className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={toggleAnimation}
                  className="p-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="yearNumber"
                    stroke="#6b7280"
                    label={{ value: 'Años', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                    label={{ value: 'Patrimonio (MXN)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip
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
                className="w-full"
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
                className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow cursor-pointer"
                onClick={() => setSelectedOption(selectedOption === proj.option.name ? null : proj.option.name)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl`} style={{ backgroundColor: `${proj.option.color}20` }}>
                    <Icon className="w-6 h-6" style={{ color: proj.option.color }} />
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      selectedOption === proj.option.name ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                <h3 className="font-bold text-gray-900 mb-1">{proj.option.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{proj.option.description}</p>

                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-gray-500">Patrimonio Final</div>
                    <div className="text-2xl font-bold" style={{ color: proj.option.color }}>
                      {formatCurrency(finalData?.patrimony || 0, 'MXN')}
                    </div>
                    {showRealValues && (
                      <div className="text-xs text-gray-500">
                        Real: {formatCurrency(finalData?.patrimonyReal || 0, 'MXN')}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                    <div>
                      <div className="text-xs text-gray-500">ROI Estimado</div>
                      <div className="text-sm font-bold text-green-600">
                        {proj.roi.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Ganancia</div>
                      <div className="text-sm font-bold text-blue-600">
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
                      className="mt-4 pt-4 border-t border-gray-200"
                    >
                      <div className="mb-3">
                        <div className="text-xs font-semibold text-gray-700 mb-2">Características:</div>
                        <ul className="space-y-1">
                          {proj.option.features.map((feature, i) => (
                            <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                              <span className="text-green-500 mt-0.5">✓</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-700 mb-2">Consideraciones:</div>
                        <ul className="space-y-1">
                          {proj.option.risks.map((risk, i) => (
                            <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
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
          className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl shadow-xl p-8 text-white"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8" />
                <h2 className="text-2xl font-bold">El Poder de la Reinversión en Negocios Reales</h2>
              </div>
              <p className="text-orange-50 mb-6 max-w-3xl">
                La diferencia entre invertir en tickets de motocicletas con y sin reinversión demuestra cómo el efecto
                multiplicador acelera exponencialmente el crecimiento de tu patrimonio. Mientras que las inversiones
                tradicionales ofrecen retornos lineales y limitados, invertir en un negocio establecido con reinversión
                aprovecha el crecimiento compuesto de un activo comercial real.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-3xl font-bold mb-1">
                    {formatCurrency(projections[3].finalPatrimony - projections[2].finalPatrimony, 'MXN')}
                  </div>
                  <div className="text-sm text-orange-50">
                    Diferencia Con vs Sin Reinversión
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-3xl font-bold mb-1">
                    {((projections[3].finalPatrimony / projections[1].finalPatrimony) || 1).toFixed(1)}x
                  </div>
                  <div className="text-sm text-orange-50">
                    Superior a CETES
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-3xl font-bold mb-1">
                    {((projections[3].finalPatrimony / projections[0].finalPatrimony) || 1).toFixed(1)}x
                  </div>
                  <div className="text-sm text-orange-50">
                    Superior a Ahorro Tradicional
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
          className="mt-8 text-center"
        >
          <button
            onClick={() => setShowDetailedTable(!showDetailedTable)}
            className="px-6 py-3 bg-white text-orange-600 font-semibold rounded-xl hover:shadow-lg transition-all border-2 border-orange-200 flex items-center gap-2 mx-auto"
          >
            {showDetailedTable ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            {showDetailedTable ? 'Ocultar' : 'Ver'} Tabla Detallada
          </button>
        </motion.div>

        <AnimatePresence>
          {showDetailedTable && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-orange-500 to-amber-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Año</th>
                      {comparisonOptions.map((option, idx) => (
                        <th key={idx} className="px-4 py-3 text-right text-sm font-semibold">
                          {option.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Array.from({ length: Math.min(animationYear + 1, years) }, (_, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                          {i + 1}
                        </td>
                        {projections.map((proj, idx) => {
                          const yearData = proj.yearlyData[i];
                          return (
                            <td key={idx} className="px-4 py-3 text-right text-sm text-gray-700">
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
      </div>
    </div>
  );
};

export default MotorcycleCalculator;
