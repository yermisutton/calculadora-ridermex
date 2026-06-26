import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Users, Calendar, DollarSign, TrendingUp, BarChart3, Zap, Play, Pause,
  RotateCcw, Trees, Sprout, ChevronDown, ChevronUp, Eye
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, LineChart, Line
} from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { getDetailedCertificateEvolution } from '../utils/calculations/certificateEvolution';
import type { Investment } from '../types';

interface ICMRetirementCalculatorProps {
  onBack?: () => void;
}

const ICMRetirementCalculator: React.FC<ICMRetirementCalculatorProps> = ({ onBack }) => {
  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(60);
  const [numberOfCertificates, setNumberOfCertificates] = useState(1);
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [reinvestmentPercentage, setReinvestmentPercentage] = useState(100);
  const [inflationRate, setInflationRate] = useState(4.5);
  const [selectedProfile, setSelectedProfile] = useState<'conservador' | 'moderado' | 'optimista'>('optimista');

  const [showRealValues, setShowRealValues] = useState(false);
  const [selectedView, setSelectedView] = useState<'comparison' | 'details' | 'cashflow'>('comparison');
  const [animationYear, setAnimationYear] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDetailedTable, setShowDetailedTable] = useState(false);

  const certificatePrice = 266000;
  const certificateAppreciation = 12;
  const investorFactor = 0.65;
  const hectarePerCertificate = 0.1;

  const profiles = {
    conservador: {
      production: 25000,
      pricePerKg: 13,
      lemonIncrease: 3,
      name: 'Conservador',
      icon: '📝'
    },
    moderado: {
      production: 35000,
      pricePerKg: 38,
      lemonIncrease: 5,
      name: 'Moderado',
      icon: '✏️'
    },
    optimista: {
      production: 38000,
      pricePerKg: 38,
      lemonIncrease: 5,
      name: 'Optimista',
      icon: '🎯'
    },
  };

  const currentProfile = profiles[selectedProfile];
  const yearsToRetirement = retirementAge - currentAge;
  const initialInvestment = numberOfCertificates * certificatePrice;

  const createInvestmentObject = (): Investment => {
    return {
      initialCertificates: numberOfCertificates,
      certificateBasePrice: certificatePrice,
      initialPayment: initialInvestment,
      years: yearsToRetirement,
      annualProfit: 0,
      increaseLemonPrice: true,
      lemonPriceIncrease: currentProfile.lemonIncrease,
      reinvestProfits: reinvestmentPercentage > 0,
      additionalContributions: monthlyContribution > 0,
      monthlyContribution,
      currencyFormat: 'MXN',
      exchangeRate: 1,
      exchangeRateEUR: 1,
      inflationRate: 0,
      applyTaxes: false,
      taxRate: 0,
      partialCashOut: reinvestmentPercentage < 100,
      cashOutPercentage: 100 - reinvestmentPercentage,
      yearlyCashOutPercentages: Array(yearsToRetirement).fill(100 - reinvestmentPercentage),
      appreciationRate: certificateAppreciation,
      cetesRate: 0,
      savingsRate: 0,
      realEstateRate: 0,
      realEstateAppreciation: 0,
      realEstateRent: 0,
      ebitdaFactor: 0,
      averageProductionPerHectare: currentProfile.production,
      averageSalePricePerKg: currentProfile.pricePerKg,
      isLongTermCalculator: false,
      firstYearUtilityToUser: false,
      commissionRate: 0,
      citrusReinvestment: false,
      citrusReinvestmentPercentages: [],
      enablePaymentBoost: false,
      paymentBoostGrowthRate: 0,
      investorFactor,
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
      customInvestmentName: ''
    };
  };

  const calculateTraditionalRetirement = () => {
    // ICT: Same production logic as ICM but WITHOUT reinvestment (0%)
    const investment = createInvestmentObject();
    investment.reinvestProfits = false;
    investment.partialCashOut = true;
    investment.cashOutPercentage = 100;
    investment.yearlyCashOutPercentages = Array(yearsToRetirement).fill(100);

    const evolutionData = getDetailedCertificateEvolution(investment);
    const yearlyData = [];

    for (let year = 1; year <= yearsToRetirement; year++) {
      const yearData = evolutionData[year - 1];
      const inflationFactor = Math.pow(1 + inflationRate / 100, year);
      const realValue = yearData.citrusPatrimony / inflationFactor;

      yearlyData.push({
        year,
        age: currentAge + year,
        patrimony: yearData.citrusPatrimony,
        realPatrimony: realValue,
        annualReturn: yearData.citrusIncome,
        monthlyIncome: yearData.citrusIncome / 12,
        totalContributed: initialInvestment
      });
    }

    return yearlyData;
  };

  const calculateICMRetirement = () => {
    const investment = createInvestmentObject();
    const evolutionData = getDetailedCertificateEvolution(investment);

    return evolutionData.map((yearData, index) => {
      const year = index + 1;
      const inflationFactor = Math.pow(1 + inflationRate / 100, year);
      const realPatrimony = yearData.citrusPatrimony / inflationFactor;
      const realMonthlyIncome = (yearData.citrusIncome / 12) / inflationFactor;

      return {
        year,
        age: currentAge + year,
        patrimony: yearData.citrusPatrimony,
        realPatrimony,
        annualIncome: yearData.citrusIncome,
        monthlyIncome: yearData.citrusIncome / 12,
        realMonthlyIncome,
        totalCertificates: yearData.totalCertificates,
        producingCertificates: yearData.certificates.filter(c => c.status === 'producing').length,
        certificatesAdded: yearData.newCertificateIds.length,
        reinvestedAmount: yearData.yearlyReinvestmentContribution,
        cashWithdrawn: yearData.yearlyCashOutAmount,
        totalContributed: initialInvestment + (monthlyContribution * 12 * year)
      };
    });
  };

  const traditionalData = calculateTraditionalRetirement();
  const icmData = calculateICMRetirement();

  const finalTraditional = traditionalData[traditionalData.length - 1];
  const finalICM = icmData[icmData.length - 1];

  const multiplierFactor = (finalICM.patrimony / finalTraditional.patrimony).toFixed(2);

  const generateChartData = () => {
    return traditionalData.map((trad, index) => {
      const icm = icmData[index];
      return {
        year: trad.year,
        age: trad.age,
        'Tradicional': showRealValues ? trad.realPatrimony : trad.patrimony,
        'ICM': showRealValues ? icm.realPatrimony : icm.patrimony,
        'Ingreso Mensual Tradicional': trad.monthlyIncome,
        'Ingreso Mensual ICM': icm.monthlyIncome
      };
    });
  };

  const chartData = generateChartData();
  const visibleData = chartData.slice(0, animationYear + 1);

  useEffect(() => {
    if (isPlaying && animationYear < yearsToRetirement - 1) {
      const timer = setTimeout(() => {
        setAnimationYear(prev => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    } else if (animationYear >= yearsToRetirement - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, animationYear, yearsToRetirement]);

  const handlePlayPause = () => {
    if (animationYear >= yearsToRetirement - 1) {
      setAnimationYear(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setAnimationYear(0);
    setIsPlaying(false);
  };

  const COLORS = {
    traditional: '#3b82f6',
    icm: '#10b981',
    accent: '#f59e0b'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
              )}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Trees className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Potencia tu Futuro con ICM</h1>
                  <p className="text-sm text-gray-600">CosechaCAPITAL: combina el poder del interés compuesto tradicional con la reinversión automática en producción real de limón</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-sm text-gray-500">Años hasta retiro</div>
                <div className="text-xl font-bold text-green-600">{yearsToRetirement} años</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Configuración</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center justify-between">
                    <span>Edad Actual</span>
                    <span className="text-purple-600 font-bold text-lg">{currentAge} años</span>
                  </label>
                  <input
                    type="range"
                    min="25"
                    max="60"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center justify-between">
                    <span>Edad Objetivo</span>
                    <span className="text-green-600 font-bold text-lg">{retirementAge} años</span>
                  </label>
                  <input
                    type="range"
                    min="55"
                    max="75"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Número de Certificados</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Certificados Iniciales: {numberOfCertificates}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={numberOfCertificates}
                    onChange={(e) => setNumberOfCertificates(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Inversión: {formatCurrency(initialInvestment)}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Precio por Certificado
                  </label>
                  <div className="text-2xl font-bold text-amber-600">
                    {formatCurrency(certificatePrice)}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Aportación Mensual</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Aportación: {formatCurrency(monthlyContribution)}
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
                  <div className="text-xs text-gray-500 mt-1">
                    Anual: {formatCurrency(monthlyContribution * 12)}
                  </div>
                  {monthlyContribution === 0 && (
                    <div className="text-xs text-orange-500 mt-1">
                      💡 Sin aportación mensual
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Trees className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Escenario de Producción</h2>
              </div>

              <div className="space-y-2">
                {(Object.keys(profiles) as Array<keyof typeof profiles>).map((key) => {
                  const profile = profiles[key];
                  const isSelected = selectedProfile === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedProfile(key)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{profile.icon}</span>
                        <div className="flex-1">
                          <div className={`font-semibold ${isSelected ? 'text-green-700' : 'text-gray-900'}`}>
                            {profile.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {profile.production.toLocaleString()} kg/ha
                          </div>
                          <div className="text-xs text-gray-600">
                            Precio ${profile.pricePerKg}/kg | Inc. {profile.lemonIncrease}%
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <RotateCcw className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Reinversión Automática</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Porcentaje: {reinvestmentPercentage}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={reinvestmentPercentage}
                    onChange={(e) => setReinvestmentPercentage(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Retiro inmediato: {100 - reinvestmentPercentage}%
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Opciones</h2>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showRealValues}
                    onChange={(e) => setShowRealValues(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Valores Reales</div>
                    <div className="text-xs text-gray-500">Ajustado por inflación {inflationRate}%</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDetailedTable}
                    onChange={(e) => setShowDetailedTable(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Tabla Detallada</div>
                    <div className="text-xs text-gray-500">Ver año por año</div>
                  </div>
                </label>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Sprout className="w-8 h-8" />
                    <h3 className="text-xl font-bold">Interés Compuesto Tradicional</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-blue-200 text-sm mb-1">Patrimonio a los {retirementAge} años</div>
                    <div className="text-3xl font-bold">
                      {formatCurrency(showRealValues ? finalTraditional.realPatrimony : finalTraditional.patrimony)}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-blue-400">
                    <div className="text-blue-200 text-sm mb-1">Ingreso Mensual Estimado</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(finalTraditional.monthlyIncome)}
                    </div>
                    <div className="text-xs text-blue-200 mt-1">Rendimiento constante</div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-blue-100">
                    <TrendingUp className="w-4 h-4" />
                    <span>18% anual fijo</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  {multiplierFactor}x más
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Trees className="w-8 h-8" />
                    <h3 className="text-xl font-bold">ICM Multiplicador Estimado</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-green-200 text-sm mb-1">Patrimonio a los {retirementAge} años</div>
                    <div className="text-3xl font-bold">
                      {formatCurrency(showRealValues ? finalICM.realPatrimony : finalICM.patrimony)}
                    </div>
                    <div className="text-sm text-green-200 mt-1">
                      {finalICM.totalCertificates.toFixed(2)} certificados • Producción real de limón
                    </div>
                  </div>

                  <div className="pt-4 border-t border-green-400">
                    <div className="text-green-200 text-sm mb-1">Ingreso Mensual Estimado</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(finalICM.monthlyIncome)}
                    </div>
                    <div className="text-xs text-green-200 mt-1">
                      {finalICM.producingCertificates.toFixed(1)} certificados produciendo
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-green-100">
                    <Zap className="w-4 h-4" />
                    <span>38.00 certificados • Producción real</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setSelectedView('comparison')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedView === 'comparison'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Comparativa
                </button>
                <button
                  onClick={() => setSelectedView('details')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedView === 'details'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Detalles ICM
                </button>
                <button
                  onClick={() => setSelectedView('cashflow')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedView === 'cashflow'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Flujo Mensual
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <button
                  onClick={handlePlayPause}
                  className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleReset}
                  className="p-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max={yearsToRetirement - 1}
                    value={animationYear}
                    onChange={(e) => setAnimationYear(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="text-sm font-medium text-gray-700">
                  Año {animationYear + 1} / {yearsToRetirement}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {selectedView === 'comparison' && (
                  <motion.div
                    key="comparison"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Evolución Patrimonial: ICT vs ICM
                    </h3>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={visibleData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis
                            dataKey="age"
                            label={{ value: 'Edad', position: 'insideBottom', offset: -5 }}
                          />
                          <YAxis
                            tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                          />
                          <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="Tradicional"
                            stroke={COLORS.traditional}
                            fill={COLORS.traditional}
                            fillOpacity={0.3}
                            strokeWidth={2}
                          />
                          <Area
                            type="monotone"
                            dataKey="ICM"
                            stroke={COLORS.icm}
                            fill={COLORS.icm}
                            fillOpacity={0.3}
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                )}

                {selectedView === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Evolución de Certificados ICM
                    </h3>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={icmData.slice(0, animationYear + 1)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis
                            dataKey="age"
                            label={{ value: 'Edad', position: 'insideBottom', offset: -5 }}
                          />
                          <YAxis
                            yAxisId="left"
                            tickFormatter={(value) => value.toFixed(0)}
                            label={{ value: 'Certificados', angle: -90, position: 'insideLeft' }}
                          />
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                            label={{ value: 'Patrimonio', angle: 90, position: 'insideRight' }}
                          />
                          <Tooltip
                            formatter={(value: number, name: string) => {
                              if (name === 'Certificados') return value.toFixed(2);
                              return formatCurrency(value);
                            }}
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="totalCertificates"
                            name="Certificados"
                            stroke={COLORS.icm}
                            strokeWidth={3}
                            dot={{ fill: COLORS.icm, r: 4 }}
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="patrimony"
                            name="Patrimonio"
                            stroke={COLORS.accent}
                            strokeWidth={2}
                            strokeDasharray="5 5"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                )}

                {selectedView === 'cashflow' && (
                  <motion.div
                    key="cashflow"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Ingreso Mensual al Retiro
                    </h3>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={visibleData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis
                            dataKey="age"
                            label={{ value: 'Edad', position: 'insideBottom', offset: -5 }}
                          />
                          <YAxis
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                          />
                          <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend />
                          <Bar
                            dataKey="Ingreso Mensual Tradicional"
                            fill={COLORS.traditional}
                          />
                          <Bar
                            dataKey="Ingreso Mensual ICM"
                            fill={COLORS.icm}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Diferencia</div>
                    <div className="text-xl font-bold text-green-600">
                      {formatCurrency(finalICM.patrimony - finalTraditional.patrimony)}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Trees className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Certificados Finales Estimados</div>
                    <div className="text-xl font-bold text-blue-600">
                      {finalICM.totalCertificates.toFixed(1)}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">El Efecto Multiplicador Estimado</div>
                    <div className="text-xl font-bold text-purple-600">
                      {multiplierFactor}x
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Falso multiplicador 0.02x</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {showDetailedTable && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Proyección Año por Año</h3>
                </div>
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Año
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Edad
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tradicional
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ICM
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Certificados
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Diferencia
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {icmData.map((icm, index) => {
                        const trad = traditionalData[index];
                        const difference = icm.patrimony - trad.patrimony;
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {icm.year}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {icm.age}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-600">
                              {formatCurrency(trad.patrimony)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-semibold">
                              {formatCurrency(icm.patrimony)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                              {icm.totalCertificates.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-emerald-600">
                              +{formatCurrency(difference)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 rounded-2xl shadow-xl p-8 text-white"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">El Efecto Multiplicador Estimado</h3>
                  <p className="text-orange-100">Multiplica tu patrimonio con ICM</p>
                </div>
              </div>

              <div className="space-y-4 text-lg">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">✅</div>
                  <div>
                    <strong>Cómo funciona el ICM?</strong> Combina el poder del interés compuesto tradicional con la reinversión automática en producción real de limón. No solo crece, se multiplica con activos tangibles.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💰</div>
                  <div>
                    <strong>Rentabilidad sostenible:</strong> Mientras ICT mantiene sus rendimientos, ICM optimiza beneficios comprando certificados adicionales con las utilidades generadas y disminuyendo tu periodo de maduración cada 5 años.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🌱</div>
                  <div>
                    <strong>Crecimiento exponencial:</strong> Los límites de adquisición se duplican cada 5 años (1 después del año 10, 2, 4, 8, ...), maximizando potencial de crecimiento sin comprometer liquidez ni producción.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📈</div>
                  <div>
                    <strong>Apreciación del certificado:</strong> 12% anual durante los primeros 5 años, reflejando el valor creciente de los activos agrícolas.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <strong>Maduración estratégica:</strong> Certificados producen desde el año 5, permitiendo capitalización temprana mientras creces tu patrimonio.
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-2xl shadow-xl p-8 text-white"
            >
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold mb-2">Multiplica tu Patrimonio con ICM</h3>
                <p className="text-green-100 text-lg">
                  CosechaCAPITAL: combina el poder del interés compuesto tradicional con la reinversión automática en producción real de limón
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <div className="text-sm text-green-200 mb-1">¿Quiero Multiplicar mi?</div>
                  <div className="text-2xl font-bold">Patrimonio</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <div className="text-sm text-green-200 mb-1">Hablar con un Especialista</div>
                  <div className="text-2xl font-bold">Hoy</div>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 bg-white text-green-600 py-4 px-6 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors shadow-lg">
                  Quiero Multiplicar mi Patrimonio
                </button>
                <button className="flex-1 bg-green-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg">
                  Hablar con un Especialista
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
        Ver Tabla Detallada muestra la proyección completa año por año
      </div>
    </div>
  );
};

export default ICMRetirementCalculator;
