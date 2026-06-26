import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowLeft, TrendingUp, DollarSign, Hash, Calendar, Percent, Target, BarChart3, Plus, Minus, Download } from 'lucide-react';
import { useCalculator } from '../context/CalculatorContext';
import { formatCurrency } from '../utils/formatters';
import { DisclaimerBanner } from './ui/DisclaimerBanner';
import AnimatedNumberDisplay from './ui/AnimatedNumberDisplay';
import RidermexReportButton from './ui/RidermexReportButton';
import EscalonSelector from './ui/EscalonSelector';
import RidermexCompoundMultiplier from './RidermexCompoundMultiplier';
import RidermexReinvestmentStrategy from './RidermexReinvestmentStrategy';
import { ESCALONES, getEscalonByNumber, RIDERMEX_CONFIG, type EscalonData } from '../data/ridermexConfig';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RidermexExpressCalculatorProps {
  onBack?: () => void;
}

const RidermexExpressCalculator: React.FC<RidermexExpressCalculatorProps> = ({ onBack }) => {
  const { investment, updateInvestment, results, updateCashOutPercentage } = useCalculator();
  const [customCertificates, setCustomCertificates] = useState(investment.initialCertificates);
  const [customYears, setCustomYears] = useState(investment.years);
  const [reinvestmentMode, setReinvestmentMode] = useState<'scenario' | 'custom'>('scenario');
  // Initialize with current reinvestment percentage (100 - cashOut)
  const [customReinvestmentPercentage, setCustomReinvestmentPercentage] = useState(
    100 - (investment.cashOutPercentage || 0)
  );
  const [selectedEscalon, setSelectedEscalon] = useState(investment.ridermexEscalon || 1);
  const currentEscalonData = getEscalonByNumber(selectedEscalon);

  const handleEscalonChange = (escalon: EscalonData) => {
    setSelectedEscalon(escalon.number);
    updateInvestment({
      ridermexEscalon: escalon.number,
      ridermexEntryPrice: escalon.entryPrice,
      investorAnnualReturn: escalon.roi
    });
  };

  const productInfo = {
    A: {
      title: 'Modelo A: Con Financiamiento',
      price: currentEscalonData.entryPrice,
      downPayment: RIDERMEX_CONFIG.DOWN_PAYMENT_MODEL_A,
      firstIncome: RIDERMEX_CONFIG.FIRST_INCOME_CREDITO_MONTH,
      roi: currentEscalonData.roi,
      color: 'from-blue-500 to-cyan-600',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-600'
    },
    B: {
      title: 'Modelo B: Pago de Contado',
      price: currentEscalonData.entryPrice,
      downPayment: currentEscalonData.entryPrice,
      firstIncome: RIDERMEX_CONFIG.FIRST_INCOME_CONTADO_MONTH,
      roi: currentEscalonData.roi,
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

  // Initialize RiderMex product type if not set - run only once
  useEffect(() => {
    if (!investment.ridermexProductType) {
      const defaultProduct = productInfo.B;
      updateInvestment({
        ridermexProductType: 'B',
        certificateBasePrice: defaultProduct.price,
        initialPayment: defaultProduct.downPayment,
        ridermexDownPaymentAmount: defaultProduct.downPayment,
        ridermexFinancingMonths: 0,
        ridermexFirstMonthlyIncome: defaultProduct.firstIncome,
        annualProfit: defaultProduct.roi,
        investorAnnualReturn: defaultProduct.roi
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentProduct = productInfo[investment.ridermexProductType as 'A' | 'B' | 'C'] || productInfo.B;

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

  const handleCertificatesChange = (value: number) => {
    setCustomCertificates(value);
    updateInvestment({ initialCertificates: value });
  };

  const handleYearsChange = (value: number) => {
    setCustomYears(value);
    updateInvestment({ years: value });
  };

  const incrementCertificates = () => {
    if (customCertificates < 20) handleCertificatesChange(customCertificates + 1);
  };

  const decrementCertificates = () => {
    if (customCertificates > 1) handleCertificatesChange(customCertificates - 1);
  };

  const incrementYears = () => {
    if (customYears < 30) handleYearsChange(customYears + 1);
  };

  const decrementYears = () => {
    if (customYears > 1) handleYearsChange(customYears - 1);
  };

  const handleReinvestmentScenario = (scenario: 'conservative' | 'moderate' | 'optimistic') => {
    const percentages: { [key: string]: number } = {
      conservative: 30,
      moderate: 50,
      optimistic: 70
    };
    const reinvestmentPercentage = percentages[scenario];
    const cashOutPercentage = 100 - reinvestmentPercentage; // Convert to cash-out percentage

    // Update cash-out percentage (this is what controls the results)
    const yearlyCashOutPercentages = new Array(30).fill(cashOutPercentage);
    updateInvestment({
      partialCashOut: true,
      cashOutPercentage: cashOutPercentage,
      yearlyCashOutPercentages: yearlyCashOutPercentages
    });

    // Sync custom percentage state
    setCustomReinvestmentPercentage(reinvestmentPercentage);
  };

  const handleCustomReinvestmentPercentage = (reinvestmentPercentage: number) => {
    setCustomReinvestmentPercentage(reinvestmentPercentage);
    const cashOutPercentage = 100 - reinvestmentPercentage; // Convert to cash-out percentage

    // Update cash-out percentage (this is what controls the results)
    const yearlyCashOutPercentages = new Array(30).fill(cashOutPercentage);
    updateInvestment({
      partialCashOut: true,
      cashOutPercentage: cashOutPercentage,
      yearlyCashOutPercentages: yearlyCashOutPercentages
    });
  };

  const handleToggleReinvest = () => {
    const newReinvestState = !investment.reinvestProfits;

    if (newReinvestState) {
      // Activating reinvestment - enable partial cash out with default percentage
      const cashOutPercentage = 100 - customReinvestmentPercentage;
      const yearlyCashOutPercentages = new Array(30).fill(cashOutPercentage);
      updateInvestment({
        reinvestProfits: true,
        partialCashOut: true,
        cashOutPercentage: cashOutPercentage,
        yearlyCashOutPercentages: yearlyCashOutPercentages
      });
    } else {
      // Deactivating reinvestment - disable partial cash out (100% withdrawal)
      const yearlyCashOutPercentages = new Array(30).fill(100);
      updateInvestment({
        reinvestProfits: false,
        partialCashOut: false,
        cashOutPercentage: 100,
        yearlyCashOutPercentages: yearlyCashOutPercentages
      });
    }
  };

  // Trigger calculations on mount
  useEffect(() => {
    updateInvestment({ years: investment.years });
  }, []);

  // Prepare chart data
  const chartData = results?.yearlyData?.map(year => ({
    year: year.year,
    patrimonio: year.citrusPatrimony / 1000000, // Convert to millions
    ingresos: (year.citrusIncome * 12) / 1000
  })) || [];

  if (!results) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-100 font-medium">Calculando resultados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {onBack && (
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mb-6 px-6 py-3 bg-dark-card text-neutral-100 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 border-2 border-dark-border hover:border-neon-red"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver al Menú</span>
            </motion.button>
          )}

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <img src="/rider_inversiones.png" alt="Ridermex Inversiones" className="h-16 w-auto" />
              <div>
                <h1 className="text-4xl font-bold text-neutral-100">Calculadora Express RiderMex</h1>
                <p className="text-neutral-400 mt-1">Configura y visualiza resultados instantáneos</p>
              </div>
            </div>
          </div>
        </motion.div>

        <DisclaimerBanner variant="compact" />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            {/* Product Type Selector */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-dark-card rounded-2xl p-6 border-2 border-dark-border shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-neon-red rounded-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-100">Tipo de Producto</h3>
                  <p className="text-sm text-neutral-400">Selecciona tu modelo de inversión</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {(['A', 'B', 'C'] as const).map((type) => {
                  const product = productInfo[type];
                  const isSelected = investment.ridermexProductType === type;
                  return (
                    <motion.button
                      key={type}
                      onClick={() => handleProductChange(type)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl text-left transition-all border-2 ${
                        isSelected
                          ? `bg-gradient-to-r ${product.color} text-white ${product.borderColor} shadow-lg`
                          : 'bg-dark-surface text-neutral-200 border-dark-border hover:border-neon-red/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-lg mb-1">{product.title}</div>
                          <div className={`text-sm ${isSelected ? 'text-white/90' : 'text-neutral-400'}`}>
                            Ticket: ${product.price.toLocaleString()} | ROI Estimado: {product.roi}%
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <div className="w-4 h-4 bg-neon-green rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Escalon Selector */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
            >
              <EscalonSelector
                selectedEscalon={selectedEscalon}
                onEscalonChange={handleEscalonChange}
                compact={true}
                theme="dark"
              />
            </motion.div>

            {/* ICM Toggle */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-dark-card rounded-2xl p-6 border-2 border-dark-border shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${investment.reinvestProfits ? 'bg-neon-green' : 'bg-red-500'}`}>
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-100">Interés Compuesto Multiplicador</h3>
                    <p className="text-sm text-neutral-400">Activa la reinversión automática</p>
                  </div>
                </div>
              </div>

              <motion.button
                onClick={handleToggleReinvest}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                  investment.reinvestProfits
                    ? 'bg-gradient-to-r from-neon-green to-emerald-600 text-white border-2 border-neon-green/50 shadow-lg'
                    : 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-2 border-red-500/50 shadow-lg'
                }`}
              >
                <TrendingUp className={`w-6 h-6 ${investment.reinvestProfits ? 'animate-pulse' : ''}`} />
                <div>
                  <div>{investment.reinvestProfits ? 'ICM Activado' : 'ICM Desactivado'}</div>
                  <div className="text-sm opacity-90">
                    {investment.reinvestProfits ? 'Reinvirtiendo utilidades' : 'Sin reinversión'}
                  </div>
                </div>
              </motion.button>
            </motion.div>

            {/* Reinvestment Configuration */}
            {investment.reinvestProfits && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-dark-card rounded-2xl p-6 border-2 border-neon-green/30 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-neon-green rounded-xl">
                    <Percent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-100">¿Cuánto Quieres Reinvertir?</h3>
                    <p className="text-sm text-neutral-400">Elige un escenario o porcentaje personalizado</p>
                  </div>
                </div>

                {/* Mode Toggle */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <motion.button
                    onClick={() => setReinvestmentMode('scenario')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                      reinvestmentMode === 'scenario'
                        ? 'bg-neon-green text-white shadow-md'
                        : 'bg-dark-surface text-neutral-400 hover:bg-dark-surface/80 border border-dark-border'
                    }`}
                  >
                    Escenarios
                  </motion.button>
                  <motion.button
                    onClick={() => setReinvestmentMode('custom')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                      reinvestmentMode === 'custom'
                        ? 'bg-neon-green text-white shadow-md'
                        : 'bg-dark-surface text-neutral-400 hover:bg-dark-surface/80 border border-dark-border'
                    }`}
                  >
                    Personalizado
                  </motion.button>
                </div>

                {/* Scenarios */}
                {reinvestmentMode === 'scenario' && (
                  <div className="space-y-3">
                    <motion.button
                      onClick={() => handleReinvestmentScenario('conservative')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-yellow-600 to-amber-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span>Conservador</span>
                        <span className="text-2xl font-bold">30%</span>
                      </div>
                      <div className="text-sm opacity-90 text-left mt-1">
                        Mayor liquidez, menor crecimiento
                      </div>
                    </motion.button>

                    <motion.button
                      onClick={() => handleReinvestmentScenario('moderate')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span>Moderado</span>
                        <span className="text-2xl font-bold">50%</span>
                      </div>
                      <div className="text-sm opacity-90 text-left mt-1">
                        Balance entre liquidez y crecimiento
                      </div>
                    </motion.button>

                    <motion.button
                      onClick={() => handleReinvestmentScenario('optimistic')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span>Optimista</span>
                        <span className="text-2xl font-bold">70%</span>
                      </div>
                      <div className="text-sm opacity-90 text-left mt-1">
                        Máximo crecimiento exponencial
                      </div>
                    </motion.button>
                  </div>
                )}

                {/* Custom Percentage */}
                {reinvestmentMode === 'custom' && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-neon-green mb-2">{customReinvestmentPercentage}%</div>
                      <div className="text-sm text-neutral-400">Porcentaje de reinversión</div>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={customReinvestmentPercentage}
                      onChange={(e) => handleCustomReinvestmentPercentage(Number(e.target.value))}
                      className="w-full h-3 bg-dark-surface rounded-lg appearance-none cursor-pointer slider"
                    />

                    <div className="flex flex-wrap gap-2">
                      {[0, 25, 50, 75, 100].map((preset) => (
                        <motion.button
                          key={preset}
                          onClick={() => handleCustomReinvestmentPercentage(preset)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            customReinvestmentPercentage === preset
                              ? 'bg-neon-green text-white shadow-md'
                              : 'bg-dark-surface text-emerald-400 hover:bg-emerald-900/30 border border-dark-border'
                          }`}
                        >
                          {preset}%
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Real-time Impact Preview */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-gradient-to-br from-purple-500/10 to-neon-green/10 rounded-xl p-4 border border-neon-green/30"
                >
                  <div className="text-center mb-3">
                    <div className="text-sm text-neutral-400 mb-1">Balance de Estrategia</div>
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-neon-green"></div>
                        <span className="text-neutral-200 font-semibold">Reinversión {customReinvestmentPercentage}%</span>
                      </div>
                      <span className="text-neutral-500">|</span>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-neutral-200 font-semibold">Retiro {100 - customReinvestmentPercentage}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-dark-card rounded-lg p-3">
                      <div className="text-xs text-neutral-500 mb-1">Retiro Total</div>
                      <div className="text-lg font-bold text-amber-500">
                        {formatCurrency(results.totalCashOut, 'MXN')}
                      </div>
                    </div>
                    <div className="bg-dark-card rounded-lg p-3">
                      <div className="text-xs text-neutral-500 mb-1">Patrimonio</div>
                      <div className="text-lg font-bold text-neon-green">
                        {formatCurrency(results.finalPatrimony, 'MXN')}
                      </div>
                    </div>
                    <div className="bg-dark-card rounded-lg p-3">
                      <div className="text-xs text-neutral-500 mb-1">ROI Estimado</div>
                      <div className="text-lg font-bold text-purple-400">
                        {results.roi.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Number of Certificates */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-dark-card rounded-2xl p-6 border-2 border-dark-border shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <Hash className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-100">Tickets de Inversión</h3>
                  <p className="text-sm text-neutral-400">Cantidad de tickets a adquirir</p>
                </div>
              </div>

              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-blue-500 mb-2">{customCertificates}</div>
                <div className="text-lg text-neutral-400">
                  Total: {formatCurrency(customCertificates * investment.certificateBasePrice)}
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <motion.button
                  onClick={decrementCertificates}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg"
                >
                  <Minus className="w-6 h-6" />
                </motion.button>

                <input
                  type="range"
                  min="1"
                  max="20"
                  value={customCertificates}
                  onChange={(e) => handleCertificatesChange(Number(e.target.value))}
                  className="flex-1 h-3 bg-dark-surface rounded-lg appearance-none cursor-pointer slider"
                />

                <motion.button
                  onClick={incrementCertificates}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-neon-green hover:bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg"
                >
                  <Plus className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="flex flex-wrap gap-2">
                {[1, 3, 5, 10, 15, 20].map((preset) => (
                  <motion.button
                    key={preset}
                    onClick={() => handleCertificatesChange(preset)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      customCertificates === preset
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-dark-surface text-blue-400 hover:bg-blue-900/30 border border-dark-border'
                    }`}
                  >
                    {preset}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Investment Period */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-dark-card rounded-2xl p-6 border-2 border-dark-border shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-600 rounded-xl">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-100">Plazo de Inversión</h3>
                  <p className="text-sm text-neutral-400">Años de proyección</p>
                </div>
              </div>

              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-purple-500 mb-2">{customYears}</div>
                <div className="text-lg text-neutral-400">Años</div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <motion.button
                  onClick={decrementYears}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg"
                >
                  <Minus className="w-6 h-6" />
                </motion.button>

                <input
                  type="range"
                  min="1"
                  max="30"
                  value={customYears}
                  onChange={(e) => handleYearsChange(Number(e.target.value))}
                  className="flex-1 h-3 bg-dark-surface rounded-lg appearance-none cursor-pointer slider"
                />

                <motion.button
                  onClick={incrementYears}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-neon-green hover:bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg"
                >
                  <Plus className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="flex flex-wrap gap-2">
                {[1, 3, 5, 10, 15, 20, 25, 30].map((preset) => (
                  <motion.button
                    key={preset}
                    onClick={() => handleYearsChange(preset)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      customYears === preset
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-dark-surface text-purple-400 hover:bg-purple-900/30 border border-dark-border'
                    }`}
                  >
                    {preset}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* Key Results */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-neon-green to-emerald-600 rounded-2xl p-8 border-2 border-neon-green/50 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Resultados al Año {customYears}</h3>
              </div>

              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-white/80 text-sm mb-2">Patrimonio Total</div>
                  <AnimatedNumberDisplay
                    value={results.finalPatrimony}
                    prefix="$"
                    className="text-4xl font-bold text-white"
                    duration={1000}
                  />
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-white/80 text-sm mb-2">Ingreso Mensual</div>
                  <AnimatedNumberDisplay
                    value={results.finalMonthlyIncome}
                    prefix="$"
                    className="text-4xl font-bold text-white"
                    duration={1000}
                  />
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-white/80 text-sm mb-3">Tickets de Inversión</div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/90 text-sm">Iniciales:</span>
                      <AnimatedNumberDisplay
                        value={results.certificatesSummary.initialCertificates}
                        isCurrency={false}
                        className="text-2xl font-bold text-white"
                        duration={800}
                      />
                    </div>
                    {investment.reinvestProfits && results.certificatesSummary.fromReinvestment > 0 && (
                      <div className="flex items-center justify-between border-t border-white/20 pt-3">
                        <span className="text-neon-green text-sm font-semibold flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          Por Reinversión:
                        </span>
                        <AnimatedNumberDisplay
                          value={results.certificatesSummary.fromReinvestment}
                          isCurrency={false}
                          className="text-2xl font-bold text-neon-green"
                          duration={800}
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t border-white/20 pt-3">
                      <span className="text-white font-semibold">Total:</span>
                      <AnimatedNumberDisplay
                        value={results.certificatesSummary.totalCertificates}
                        isCurrency={false}
                        className="text-4xl font-bold text-white"
                        duration={1000}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-white/80 text-sm mb-2">ROI Total Estimado</div>
                  <AnimatedNumberDisplay
                    value={results.roi}
                    suffix="%"
                    isCurrency={false}
                    className="text-4xl font-bold text-white"
                    duration={1000}
                  />
                </div>
              </div>
            </motion.div>

            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-dark-card rounded-2xl p-6 border-2 border-dark-border shadow-lg"
            >
              <h3 className="text-xl font-bold text-neutral-100 mb-4">Evolución del Patrimonio</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorPatrimonio" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="year"
                      stroke="#9ca3af"
                      label={{ value: 'Años', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      label={{ value: 'Patrimonio (Millones)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#f3f4f6'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="patrimonio"
                      stroke="#10b981"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorPatrimonio)"
                      name="Patrimonio (M)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Reinvestment Strategy */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <RidermexReinvestmentStrategy
                initialInvestment={customCertificates * investment.certificateBasePrice}
                annualReturn={results.finalMonthlyIncome * 12}
                reinvestPercentage={customReinvestmentPercentage}
                onReinvestPercentageChange={handleCustomReinvestmentPercentage}
                theme="dark"
              />
            </motion.div>

            {/* Compound Interest Multiplier */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <RidermexCompoundMultiplier
                initialTickets={customCertificates}
                ticketPrice={investment.certificateBasePrice}
                annualReturnPercentage={(investment.investorAnnualReturn || ESCALONES[0].roi) / 100}
                years={customYears}
                reinvestPercentage={customReinvestmentPercentage}
                onReinvestmentStrategyChange={handleCustomReinvestmentPercentage}
                theme="dark"
              />
            </motion.div>

            {/* Download Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-dark-card rounded-2xl p-6 border-2 border-dark-border shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-100">Descargar Reporte RiderMex</h3>
                  <p className="text-sm text-neutral-400">Exporta tu análisis de inversión en PDF o HTML</p>
                </div>
              </div>

              <div className="flex justify-center">
                <RidermexReportButton
                  variant="primary"
                  size="lg"
                  className="w-full max-w-md"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }

        .slider::-webkit-slider-thumb:hover {
          background: #059669;
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.8);
        }

        .slider::-moz-range-thumb:hover {
          background: #059669;
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.8);
        }
      `}</style>
    </div>
  );
};

export default RidermexExpressCalculator;
