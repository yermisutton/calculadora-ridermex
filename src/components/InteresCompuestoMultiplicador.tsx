import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, Calculator, Zap, AlertCircle, Check, ChevronDown, Sparkles, Info, DollarSign, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { DisclaimerBanner } from './ui/DisclaimerBanner';
import { getDetailedCertificateEvolution } from '../utils/calculations/certificateEvolution';
import type { Investment } from '../types';
import EscalonSelector from './ui/EscalonSelector';
import { ESCALONES, getEscalonByNumber, RIDERMEX_CONFIG, type EscalonData } from '../data/ridermexConfig';

interface InteresCompuestoMultiplicadorProps {
  onBack: () => void;
}

interface YearlyData {
  year: number;
  age: number;
  patrimonyICT: number;
  patrimonyICM: number;
  monthlyIncomeICT: number;
  monthlyIncomeICM: number;
  certificatesICM: number;
}

type RetirementProfile = 'conservador' | 'moderado' | 'optimista';

const InteresCompuestoMultiplicador: React.FC<InteresCompuestoMultiplicadorProps> = ({ onBack }) => {
  const [monthlyIncomeGoal, setMonthlyIncomeGoal] = useState(50000);
  const [investmentTimeframe, setInvestmentTimeframe] = useState(20);
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState<RetirementProfile>('optimista');
  const [reinvestmentPercentage, setReinvestmentPercentage] = useState(100);
  const [showDetailedTable, setShowDetailedTable] = useState(false);
  const [selectedEscalon, setSelectedEscalon] = useState(1);
  const currentEscalonData = getEscalonByNumber(selectedEscalon);

  const handleEscalonChange = (escalon: EscalonData) => {
    setSelectedEscalon(escalon.number);
  };

  const ticketPrice = currentEscalonData.entryPrice;
  const annualReturnPerTicket = RIDERMEX_CONFIG.ANNUAL_RETURN_PER_TICKET;
  const quarterlyPayment = RIDERMEX_CONFIG.QUARTERLY_PAYMENT;
  const ticketAppreciation = 5;

  const profiles = {
    conservador: {
      motorcyclesPerYear: RIDERMEX_CONFIG.SCENARIOS.conservative.motorcyclesPerYear,
      annualReturnPerTicket: RIDERMEX_CONFIG.SCENARIOS.conservative.annualReturnPerTicket,
      priceGrowth: 5,
      name: 'Conservador',
      icon: '🏍️',
      roiPercentage: parseFloat(((RIDERMEX_CONFIG.SCENARIOS.conservative.annualReturnPerTicket / ticketPrice) * 100).toFixed(2))
    },
    moderado: {
      motorcyclesPerYear: RIDERMEX_CONFIG.SCENARIOS.moderate.motorcyclesPerYear,
      annualReturnPerTicket: RIDERMEX_CONFIG.SCENARIOS.moderate.annualReturnPerTicket,
      priceGrowth: 5,
      name: 'Moderado',
      icon: '🏍️',
      roiPercentage: currentEscalonData.roi
    },
    optimista: {
      motorcyclesPerYear: RIDERMEX_CONFIG.SCENARIOS.optimistic.motorcyclesPerYear,
      annualReturnPerTicket: RIDERMEX_CONFIG.SCENARIOS.optimistic.annualReturnPerTicket,
      priceGrowth: 5,
      name: 'Optimista',
      icon: '🏍️',
      roiPercentage: parseFloat(((RIDERMEX_CONFIG.SCENARIOS.optimistic.annualReturnPerTicket / ticketPrice) * 100).toFixed(2))
    },
  };

  const currentProfile = profiles[selectedProfile];
  const yearsToRetirement = investmentTimeframe;

  const calculateRequiredTickets = (): number => {
    const annualIncomeNeeded = monthlyIncomeGoal * 12;
    const roiDecimal = currentProfile.roiPercentage / 100;
    const growthDecimal = currentProfile.priceGrowth / 100;

    if (reinvestmentPercentage === 100 && yearsToRetirement > 1) {
      const totalGrowthRate = roiDecimal + growthDecimal;
      const compoundFactor = Math.pow(1 + totalGrowthRate, yearsToRetirement);
      const futureReturnPerTicket = currentProfile.annualReturnPerTicket * compoundFactor;
      const required = Math.ceil(annualIncomeNeeded / futureReturnPerTicket);
      return Math.max(1, required);
    }

    if (monthlyContribution > 0 && yearsToRetirement > 1) {
      const annualContribution = monthlyContribution * 12;
      const ticketsFromContributions = Math.floor((annualContribution * yearsToRetirement) / ticketPrice);
      const remainingIncome = annualIncomeNeeded;
      const returnPerTicket = currentProfile.annualReturnPerTicket;
      const required = Math.ceil(remainingIncome / returnPerTicket) - ticketsFromContributions;
      return Math.max(1, required);
    }

    const returnPerTicket = currentProfile.annualReturnPerTicket;
    const required = Math.ceil(annualIncomeNeeded / returnPerTicket);
    return Math.max(1, required);
  };

  const calculatedCertificates = calculateRequiredTickets();
  const initialInvestment = calculatedCertificates * ticketPrice;

  const createInvestmentObject = (withReinvestment: boolean): Investment => {
    return {
      initialCertificates: calculatedCertificates,
      certificateBasePrice: ticketPrice,
      initialPayment: initialInvestment,
      years: yearsToRetirement,
      annualProfit: currentProfile.roiPercentage,
      increaseLemonPrice: true,
      lemonPriceIncrease: currentProfile.priceGrowth,
      reinvestProfits: withReinvestment,
      additionalContributions: monthlyContribution > 0,
      monthlyContribution,
      currencyFormat: 'MXN',
      exchangeRate: 1,
      exchangeRateEUR: 1,
      inflationRate: 0,
      applyTaxes: false,
      taxRate: 0,
      partialCashOut: !withReinvestment,
      cashOutPercentage: withReinvestment ? (100 - reinvestmentPercentage) : 100,
      yearlyCashOutPercentages: Array(yearsToRetirement).fill(
        withReinvestment ? (100 - reinvestmentPercentage) : 100
      ),
      appreciationRate: ticketAppreciation,
      cetesRate: 0,
      savingsRate: 0,
      realEstateRate: 0,
      realEstateAppreciation: 0,
      realEstateRent: 0,
      ebitdaFactor: 0,
      averageProductionPerHectare: currentProfile.motorcyclesPerYear,
      averageSalePricePerKg: currentProfile.annualReturnPerTicket,
      isLongTermCalculator: false,
      firstYearUtilityToUser: false,
      commissionRate: 0,
      citrusReinvestment: false,
      citrusReinvestmentPercentages: [],
      enablePaymentBoost: false,
      paymentBoostGrowthRate: 0,
      investorFactor: 0.70,
      ridermexProductType: 'B',
      ridermexEscalon: selectedEscalon,
      ridermexEntryPrice: currentEscalonData.entryPrice,
      ridermexScenario: selectedProfile === 'conservador' ? 'conservative' : selectedProfile === 'optimista' ? 'optimistic' : 'moderate',
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

  const calculateRetirement = () => {
    const yearlyData: YearlyData[] = [];

    // Calculate ICT: Same production logic but WITHOUT reinvestment (0%)
    const investmentICT = createInvestmentObject(false);
    const ictEvolution = getDetailedCertificateEvolution(investmentICT);

    // Calculate ICM: With reinvestment based on percentage
    const investmentICM = createInvestmentObject(reinvestmentPercentage > 0);
    const icmEvolution = getDetailedCertificateEvolution(investmentICM);

    for (let year = 1; year <= yearsToRetirement; year++) {
      const ictData = ictEvolution[year - 1];
      const icmData = icmEvolution[year - 1];

      yearlyData.push({
        year,
        age: year,
        patrimonyICT: ictData.citrusPatrimony,
        patrimonyICM: icmData.citrusPatrimony,
        monthlyIncomeICT: ictData.citrusIncome / 12,
        monthlyIncomeICM: icmData.citrusIncome / 12,
        certificatesICM: icmData.totalCertificates
      });
    }

    return yearlyData;
  };

  const retirementData = calculateRetirement();
  const finalData = retirementData[retirementData.length - 1];
  const multiplierFactor = (finalData.patrimonyICM / finalData.patrimonyICT).toFixed(2);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const pieChartData = [
    { name: 'ICM', value: finalData.patrimonyICM, color: '#ef4444' },
    { name: 'ICT', value: finalData.patrimonyICT, color: '#3b82f6' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="sticky top-0 z-50 bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver</span>
          </button>
          <div className="flex items-center gap-3">
            <img src="/rider_inversiones.png" alt="Ridermex" className="h-8 w-auto" />
            <h1 className="text-lg font-bold">ICM RiderMex</h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-orange-100">ICT vs ICM</p>
            <p className="text-sm font-bold">Compara ahora</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-900 mb-1">Potencia tu Futuro con ICM RiderMex</h3>
              <p className="text-sm text-red-800">
                Ridermex Inversiones combina el poder del interés compuesto tradicional con la reinversión automática en
                nuestro negocio de motocicletas, generando un efecto multiplicador exponencial para tu patrimonio.
              </p>
            </div>
          </div>
        </div>

        <DisclaimerBanner variant="compact" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200"
            >
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                <Calculator className="w-5 h-5 text-red-600" />
                <h2 className="text-lg font-bold text-gray-900">Configuración RiderMex</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-5 h-5 text-red-600" />
                    Ingreso Pasivo Mensual Deseado
                  </label>
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <p className="text-3xl font-bold text-red-600">{formatCurrency(monthlyIncomeGoal)}</p>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="5000"
                    value={monthlyIncomeGoal}
                    onChange={(e) => setMonthlyIncomeGoal(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600 mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$10K</span>
                    <span>$500K</span>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {[25000, 50000, 100000, 250000].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setMonthlyIncomeGoal(preset)}
                        className="px-3 py-1 text-xs rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
                      >
                        {formatCurrency(preset)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Target className="w-5 h-5 text-green-600" />
                    Plazo de Inversión
                  </label>
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <p className="text-3xl font-bold text-orange-600">{investmentTimeframe} años</p>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={investmentTimeframe}
                    onChange={(e) => setInvestmentTimeframe(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600 mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5</span>
                    <span>40</span>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {[10, 15, 20, 25, 30].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setInvestmentTimeframe(preset)}
                        className="px-3 py-1 text-xs rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-700 transition-colors"
                      >
                        {preset} años
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <span className="text-blue-600">💰</span>
                    Tickets Necesarios (Calculado)
                  </label>
                  <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
                    <p className="text-4xl font-bold text-red-600 text-center">{calculatedCertificates}</p>
                    <p className="text-xs text-gray-600 mt-2 text-center">
                      Inversión Inicial: {formatCurrency(calculatedCertificates * ticketPrice)}
                    </p>
                  </div>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      Este número se calcula automáticamente según tu meta de ingreso pasivo y plazo de inversión
                    </p>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <span className="text-yellow-600">💵</span>
                    Precio por Ticket
                  </label>
                  <div className="bg-yellow-50 rounded-lg p-3 text-center border-2 border-yellow-200">
                    <p className="text-2xl font-bold text-yellow-600">{formatCurrency(ticketPrice)}</p>
                    <p className="text-xs text-gray-500 mt-1">Escalón {currentEscalonData.name} | ROI Estimado {currentEscalonData.roi}%</p>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <span className="text-orange-600">📊</span>
                    Aportación Mensual
                  </label>
                  <div className="bg-orange-50 rounded-lg p-3 mb-2">
                    <p className="text-sm text-gray-600">{monthlyContribution === 0 ? 'Sin aportación' : 'Con aportación'}</p>
                    <p className="text-xl font-bold text-orange-600">{formatCurrency(monthlyContribution)}</p>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20000"
                    step="1000"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$0</span>
                    <span>$20k</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <EscalonSelector
                selectedEscalon={selectedEscalon}
                onEscalonChange={handleEscalonChange}
                compact={false}
                theme="light"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200"
            >
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                <TrendingUp className="w-5 h-5 text-red-600" />
                <h2 className="text-lg font-bold text-gray-900">Modelo de Inversión RiderMex</h2>
              </div>

              <div className="space-y-3">
                {(['conservador', 'moderado', 'optimista'] as RetirementProfile[]).map((profile) => (
                  <button
                    key={profile}
                    onClick={() => setSelectedProfile(profile)}
                    className={`w-full p-4 rounded-xl transition-all text-left ${
                      selectedProfile === profile
                        ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg scale-105'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {profiles[profile].icon}
                        </div>
                        <div>
                          <p className="font-bold capitalize">{profiles[profile].name}</p>
                          <p className={`text-xs ${selectedProfile === profile ? 'text-orange-100' : 'text-gray-500'}`}>
                            {profiles[profile].motorcyclesPerYear.toLocaleString()} motos/año
                          </p>
                        </div>
                      </div>
                      {selectedProfile === profile && (
                        <Check className="w-5 h-5" />
                      )}
                    </div>
                    <div className={`text-xs ${selectedProfile === profile ? 'text-white' : 'text-gray-600'}`}>
                      <p>Retorno: {formatCurrency(profiles[profile].annualReturnPerTicket)}/ticket/año</p>
                      <p>ROI Estimado: +{profiles[profile].roiPercentage}% anual</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200"
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-600" />
                <h2 className="text-lg font-bold text-gray-900">Reinversión Automática</h2>
              </div>

              <div className="mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reinvestmentPercentage === 100}
                    onChange={(e) => setReinvestmentPercentage(e.target.checked ? 100 : 0)}
                    className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Activar Reinversión</p>
                    <p className="text-xs text-gray-500">100% de rendimientos se reinvierten</p>
                  </div>
                </label>
              </div>

              {reinvestmentPercentage === 100 && (
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="flex items-center gap-2 justify-center mb-2">
                    <p className="text-3xl font-bold text-green-600">{reinvestmentPercentage}%</p>
                  </div>
                  <p className="text-xs text-gray-600 text-center">
                    Todos tus rendimientos compran más tickets automáticamente, multiplicando tu patrimonio exponencialmente.
                  </p>
                </div>
              )}
            </motion.div>

          </div>

          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-red-600 to-orange-700 rounded-2xl shadow-2xl p-8 text-white"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-6 h-6" />
                    <h2 className="text-2xl font-bold">Tu Proyección Patrimonial</h2>
                  </div>
                  <p className="text-red-200 text-sm">Horizonte: {yearsToRetirement} años | Escalón: {currentEscalonData.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-red-200 text-sm">{calculatedCertificates} ticket{calculatedCertificates > 1 ? 's' : ''}</p>
                  <p className="text-3xl font-bold">{formatCurrency(initialInvestment)}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-red-200 text-xs mb-1">Inversión Inicial</p>
                  <p className="text-2xl font-bold">{formatCurrency(initialInvestment)}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-red-200 text-xs mb-1">Años</p>
                  <p className="text-2xl font-bold">{yearsToRetirement}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-red-200 text-xs mb-1">Aportación/mes</p>
                  <p className="text-2xl font-bold">{monthlyContribution === 0 ? '$0' : formatCurrency(monthlyContribution)}</p>
                </div>
              </div>

              <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-200 text-sm mb-1">Reinversión Automática</p>
                    <p className="text-3xl font-bold">{reinvestmentPercentage}%</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-yellow-900" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Evolución Patrimonial: ICT vs ICM</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={retirementData}>
                    <defs>
                      <linearGradient id="colorICT" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorICM" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="age"
                      label={{ value: 'Edad', position: 'insideBottom', offset: -5 }}
                      stroke="#6b7280"
                    />
                    <YAxis
                      tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                      stroke="#6b7280"
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) => `Edad: ${label} años`}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="patrimonyICT"
                      name="ICT (18% anual)"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#colorICT)"
                    />
                    <Area
                      type="monotone"
                      dataKey="patrimonyICM"
                      name="ICM Multiplicador"
                      stroke="#22c55e"
                      strokeWidth={3}
                      fill="url(#colorICM)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Interés Compuesto Tradicional</h3>
                    <p className="text-xs opacity-80">18% anual fijo</p>
                  </div>
                </div>
                <p className="text-sm opacity-90 mb-1">Patrimonio en {investmentTimeframe} años</p>
                <p className="text-3xl font-bold mb-3">{formatCurrency(finalData.patrimonyICT)}</p>
                <div className="border-t border-white/20 pt-3">
                  <p className="text-xs opacity-90">Ingreso Mensual Potencial</p>
                  <p className="text-xl font-bold">{formatCurrency(finalData.monthlyIncomeICT)}</p>
                  <p className="text-xs opacity-75 mt-1">Rendimiento constante</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-red-500 to-orange-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden"
              >
                <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                  {multiplierFactor}x más
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">ICM Multiplicador</h3>
                    <p className="text-xs opacity-80">Tickets RiderMex Inversiones</p>
                  </div>
                </div>
                <p className="text-sm opacity-90 mb-1">Patrimonio en {investmentTimeframe} años</p>
                <p className="text-3xl font-bold mb-3">{formatCurrency(finalData.patrimonyICM)}</p>
                <div className="border-t border-white/20 pt-3">
                  <p className="text-xs opacity-90">Ingreso Mensual Potencial</p>
                  <p className="text-xl font-bold">{formatCurrency(finalData.monthlyIncomeICM)}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {formatNumber(finalData.certificatesICM)} tickets • Producción real
                  </p>
                </div>
              </motion.div>
            </div>

            {showDetailedTable && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl p-6 overflow-x-auto"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Proyección Año por Año</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-2 px-3">Año</th>
                      <th className="text-left py-2 px-3">Edad</th>
                      <th className="text-right py-2 px-3">ICT</th>
                      <th className="text-right py-2 px-3">ICM</th>
                      <th className="text-right py-2 px-3">Certificados</th>
                      <th className="text-right py-2 px-3">Diferencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {retirementData.map((data, index) => (
                      <tr
                        key={index}
                        className={`border-b border-gray-100 hover:bg-gray-50 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="py-2 px-3 font-medium">{data.year}</td>
                        <td className="py-2 px-3">{data.age}</td>
                        <td className="py-2 px-3 text-right text-blue-600">
                          {formatCurrency(data.patrimonyICT)}
                        </td>
                        <td className="py-2 px-3 text-right text-red-600 font-semibold">
                          {formatCurrency(data.patrimonyICM)}
                        </td>
                        <td className="py-2 px-3 text-right text-gray-700">
                          {formatNumber(data.certificatesICM)}
                        </td>
                        <td className="py-2 px-3 text-right text-emerald-700 font-bold">
                          {formatCurrency(data.patrimonyICM - data.patrimonyICT)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Distribución Final del Patrimonio</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${((entry.value / (finalData.patrimonyICM + finalData.patrimonyICT)) * 100).toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col justify-center space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="font-medium text-gray-900">ICM Multiplicador</span>
                    </div>
                    <span className="font-bold text-green-600">{formatCurrency(finalData.patrimonyICM)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="font-medium text-gray-900">ICT Tradicional</span>
                    </div>
                    <span className="font-bold text-blue-600">{formatCurrency(finalData.patrimonyICT)}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-2xl shadow-2xl p-8 text-white"
            >
              <div className="flex items-start gap-4 mb-6">
                <AlertCircle className="w-8 h-8 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold mb-2">El Efecto Multiplicador</h3>
                  <p className="text-white/90 text-lg">ICM supera al ICT tradicional</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
                <p className="text-sm mb-2">Ventaja del ICM sobre ICT</p>
                <p className="text-4xl font-bold mb-2">{formatCurrency(finalData.patrimonyICM - finalData.patrimonyICT)}</p>
                <p className="text-lg opacity-90">
                  Factor multiplicador: <span className="font-bold text-2xl">{multiplierFactor}x</span>
                </p>
                <p className="text-sm mt-2 opacity-90">
                  +{((finalData.patrimonyICM / finalData.patrimonyICT - 1) * 100).toFixed(1)}% más patrimonio
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  ¿Cómo funciona el ICM?
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✓</span>
                    <span><strong>Reinversión automática:</strong> Compra más tickets sin esfuerzo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✓</span>
                    <span><strong>Negocio real:</strong> Ventas de {currentProfile.motorcyclesPerYear.toLocaleString()} motocicletas/año</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✓</span>
                    <span><strong>Apreciación del ticket:</strong> 5% anual durante toda la inversión</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✓</span>
                    <span><strong>ROI Estimado del modelo:</strong> {selectedProfile === 'conservador' ? '18%' : selectedProfile === 'moderado' ? `${ESCALONES[0].roi}%` : '20%'} anual</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✓</span>
                    <span><strong>Factor inversionista:</strong> Recibes el 70% de ingresos netos</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-2xl p-8 text-white text-center"
            >
              <h3 className="text-2xl font-bold mb-3">
                Multiplica tu Patrimonio con Ridermex Inversiones
              </h3>
              <p className="text-lg mb-6 text-white/90">
                Ridermex Inversiones combina el poder del interés compuesto con un negocio de motocicletas real y tangible.
                No solo creces con un porcentaje fijo, multiplicas tu patrimonio con ventas reales de motocicletas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition-colors shadow-lg">
                  Quiero Multiplicar mi Patrimonio
                </button>
                <button className="bg-orange-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-800 transition-colors border-2 border-white/50">
                  Hablar con un Especialista
                </button>
              </div>
            </motion.div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setShowDetailedTable(!showDetailedTable)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition-colors"
              >
                <Info className="w-5 h-5" />
                {showDetailedTable ? 'Ocultar' : 'Ver'} Tabla Detallada
                <ChevronDown className={`w-4 h-4 transition-transform ${showDetailedTable ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteresCompuestoMultiplicador;
