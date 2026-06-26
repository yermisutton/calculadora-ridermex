import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Calendar, DollarSign, TrendingUp, BarChart3, Zap, Play, Pause, RotateCcw, Target, Award, Briefcase, Home, TrendingDown, AlertCircle, ChevronDown, ChevronUp, Hash, Percent, Plus, Minus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useCalculator } from '../context/CalculatorContext';
import { formatCurrency } from '../utils/formatters';
import { DisclaimerBanner } from './ui/DisclaimerBanner';
import AnimatedNumberDisplay from './ui/AnimatedNumberDisplay';
import RidermexReportButton from './ui/RidermexReportButton';
import EscalonSelector, { type ScenarioType } from './ui/EscalonSelector';
import { RIDERMEX_CONFIG, ESCALONES, getEscalonByNumber, type EscalonData } from '../data/ridermexConfig';

interface RetirementCalculatorProps {
  onBack?: () => void;
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

const RetirementCalculator: React.FC<RetirementCalculatorProps> = ({ onBack }) => {
  const { investment, updateInvestment, results } = useCalculator();

  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(65);
  const [numberOfCertificates, setNumberOfCertificates] = useState(1);
  const [showRealValues, setShowRealValues] = useState(false);
  const [inflationRate, setInflationRate] = useState(4.5);
  const [animationYear, setAnimationYear] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showDetailedTable, setShowDetailedTable] = useState(false);
  const [reinvestmentPercentage, setReinvestmentPercentage] = useState(50);
  const [selectedEscalon, setSelectedEscalon] = useState(1);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType>('moderate');

  const yearsToRetirement = retirementAge - currentAge;
  const currentProduct = productInfo[investment.ridermexProductType as 'A' | 'B' | 'C'] || productInfo.B;
  const scenarioData = RIDERMEX_CONFIG.SCENARIOS[selectedScenario];
  const escalonPrice = getEscalonByNumber(selectedEscalon).entryPrice;
  const ticketPrice = escalonPrice;
  const scenarioAnnualReturn = scenarioData.annualReturnPerTicket;
  const scenarioROI = parseFloat(((scenarioAnnualReturn / ticketPrice) * 100).toFixed(2));
  const initialInvestment = numberOfCertificates * ticketPrice;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const cashOutPercentage = 100 - reinvestmentPercentage;
    updateInvestment({
      initialCertificates: numberOfCertificates,
      certificateBasePrice: ticketPrice,
      initialPayment: ticketPrice * numberOfCertificates,
      years: yearsToRetirement,
      reinvestProfits: reinvestmentPercentage > 0,
      partialCashOut: reinvestmentPercentage < 100,
      cashOutPercentage: cashOutPercentage,
      yearlyCashOutPercentages: Array(30).fill(cashOutPercentage),
      inflationRate: inflationRate
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numberOfCertificates, ticketPrice, yearsToRetirement, reinvestmentPercentage, inflationRate]);

  useEffect(() => {
    if (isPlaying && animationYear < yearsToRetirement - 1) {
      const timer = setTimeout(() => {
        setAnimationYear(prev => prev + 1);
      }, animationSpeed);
      return () => clearTimeout(timer);
    } else if (animationYear >= yearsToRetirement - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, animationYear, yearsToRetirement, animationSpeed]);

  const handleEscalonChange = (escalon: EscalonData) => {
    setSelectedEscalon(escalon.number);
    updateInvestment({
      certificateBasePrice: escalon.entryPrice,
      initialPayment: escalon.entryPrice * numberOfCertificates,
    });
  };

  const handleScenarioChange = (scenario: ScenarioType) => {
    setSelectedScenario(scenario);
    const newReturn = RIDERMEX_CONFIG.SCENARIOS[scenario].annualReturnPerTicket;
    const newROI = parseFloat(((newReturn / ticketPrice) * 100).toFixed(2));
    updateInvestment({
      annualProfit: newROI,
      investorAnnualReturn: newROI
    });
  };

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

  if (!results || !results.yearlyData || results.yearlyData.length === 0 || results.yearlyData.length < yearsToRetirement) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-red/30 border-t-neon-red rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-300 font-medium">Calculando proyección de retiro estimada...</p>
          <p className="text-neutral-500 text-sm mt-2">Años calculados: {results?.yearlyData?.length || 0} / {yearsToRetirement}</p>
        </div>
      </div>
    );
  }

  const comparisonOptions = [
    { name: 'AFORE', color: '#3b82f6', rate: 6.5, description: 'Sistema de Ahorro para el Retiro', icon: Briefcase,
      features: ['Rendimientos estimados: 4.5% - 8% anual', 'Regulado por CONSAR', 'Comisiones por administración'],
      risks: ['Rendimientos apenas cubren inflación', 'Pensión promedio insuficiente'] },
    { name: 'PPR', color: '#f59e0b', rate: 9, description: 'Plan Personal de Retiro', icon: Home,
      features: ['Rendimientos estimados: 8% - 10% anual', 'Beneficios fiscales', 'Mayor flexibilidad'],
      risks: ['Comisiones de administración', 'Rendimientos variables'] },
    { name: 'RiderMex', color: '#10b981', rate: scenarioROI, description: 'Inversión en Activos Productivos', icon: TrendingUp,
      features: [`ROI estimado: ${scenarioROI}% anual`, 'Protección patrimonial (3 fideicomisos)', 'Seguro de cobertura amplia', 'Activos físicos (tiendas + inventario)', 'Patrimonio heredable'],
      risks: ['Inversión a mediano/largo plazo', 'Liquidez no inmediata'] }
  ];

  const calculateProjection = (rate: number, isRidermex: boolean = false) => {
    const yearlyData = [];
    if (isRidermex && results?.yearlyData?.length > 0) {
      results.yearlyData.forEach((yearData, index) => {
        if (index < yearsToRetirement) {
          const inflationFactor = Math.pow(1 + inflationRate / 100, index + 1);
          yearlyData.push({
            year: index + 1,
            age: currentAge + (index + 1),
            patrimony: Math.round(yearData.citrusPatrimony),
            realPatrimony: Math.round(yearData.citrusPatrimony / inflationFactor),
            monthlyIncome: Math.round(yearData.citrusIncome / 12),
            realMonthlyIncome: Math.round((yearData.citrusIncome / 12) / inflationFactor),
            totalCertificates: yearData.totalCertificates
          });
        }
      });
    } else {
      let patrimony = initialInvestment;
      for (let year = 1; year <= yearsToRetirement; year++) {
        const yearlyReturn = patrimony * (rate / 100);
        const reinvested = yearlyReturn * (reinvestmentPercentage / 100);
        patrimony += reinvested;
        const inflationFactor = Math.pow(1 + inflationRate / 100, year);
        yearlyData.push({
          year,
          age: currentAge + year,
          patrimony: Math.round(patrimony),
          realPatrimony: Math.round(patrimony / inflationFactor),
          monthlyIncome: Math.round(yearlyReturn / 12),
          realMonthlyIncome: Math.round((yearlyReturn / 12) / inflationFactor),
          totalCertificates: 0
        });
      }
    }
    return yearlyData;
  };

  const aforeData = calculateProjection(6.5);
  const pprData = calculateProjection(9);
  const ridermexData = calculateProjection(scenarioROI, true);

  if (!aforeData.length || !pprData.length || !ridermexData.length) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-neon-red/30 border-t-neon-red rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  const combinedData = aforeData.map((_, i) => ({
    year: aforeData[i].year,
    age: aforeData[i].age,
    AFORE: showRealValues ? aforeData[i].realPatrimony : aforeData[i].patrimony,
    PPR: showRealValues ? pprData[i].realPatrimony : pprData[i].patrimony,
    RiderMex: showRealValues ? ridermexData[i].realPatrimony : ridermexData[i].patrimony,
  }));

  const animatedData = isPlaying ? combinedData.slice(0, animationYear + 1) : combinedData;
  const finalAfore = aforeData[aforeData.length - 1]?.patrimony || 0;
  const finalPpr = pprData[pprData.length - 1]?.patrimony || 0;
  const finalRidermex = ridermexData[ridermexData.length - 1]?.patrimony || 0;

  const pieData = [
    { name: 'AFORE', value: finalAfore, color: '#3b82f6' },
    { name: 'PPR', value: finalPpr, color: '#f59e0b' },
    { name: 'RiderMex', value: finalRidermex, color: '#10b981' }
  ];

  const presets = [
    { label: 'Joven', age: 25, retAge: 55, tickets: 1 },
    { label: 'Profesional', age: 35, retAge: 60, tickets: 3 },
    { label: 'Maduro', age: 45, retAge: 65, tickets: 2 },
    { label: 'Emprendedor', age: 30, retAge: 55, tickets: 5 }
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          {onBack && (
            <motion.button onClick={onBack} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="mb-6 px-6 py-3 bg-dark-card text-neutral-100 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 border-2 border-dark-border hover:border-neon-red">
              <ArrowLeft className="w-5 h-5" /><span>Volver al Menú</span>
            </motion.button>
          )}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-neon-red to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-neutral-100">Calculadora de Retiro RiderMex</h1>
              <p className="text-neutral-400 mt-1">AFORE vs PPR vs RiderMex: Compara y decide tu futuro (valores estimados)</p>
            </div>
          </div>

          <DisclaimerBanner variant="compact" />

          <div className="bg-gradient-to-r from-neon-red to-red-700 text-white rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-8 h-8" />
              <h2 className="text-2xl font-bold">¿Tu AFORE es Suficiente?</h2>
            </div>
            <p className="text-red-100 text-lg">
              La inflación no perdona. Mientras las AFOREs apenas cubren la inflación, RiderMex te ofrece un modelo patrimonial basado en tiendas de motocicletas con rendimientos estimados desde el {scenarioROI}% anual.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 bg-dark-card rounded-2xl shadow-xl p-6 border border-dark-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-neon-red rounded-xl"><Zap className="w-6 h-6 text-white" /></div>
              <div>
                <h3 className="text-2xl font-bold text-neutral-100">Configuración de tu Retiro</h3>
                <p className="text-neutral-400">Ajusta los parámetros según tu situación</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Product Type */}
              <div className="bg-dark-surface rounded-xl p-4 border border-dark-border">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-neon-red" />
                  <label className="font-semibold text-neutral-100">Tipo de Producto RiderMex</label>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {(['A', 'B', 'C'] as const).map((type) => {
                    const product = productInfo[type];
                    const isSelected = investment.ridermexProductType === type;
                    return (
                      <motion.button key={type} onClick={() => handleProductChange(type)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        className={`p-3 rounded-lg text-left transition-all border-2 ${isSelected ? `bg-gradient-to-r ${product.color} text-white ${product.borderColor}` : 'bg-dark-bg text-neutral-300 border-dark-border hover:border-neon-red/50'}`}>
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
                onScenarioChange={handleScenarioChange}
                selectedScenario={selectedScenario}
                compact={false}
                theme="dark"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-dark-surface rounded-xl p-4 border border-dark-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-blue-500" />
                    <label className="font-semibold text-neutral-100">Edad Actual</label>
                  </div>
                  <div className="text-3xl font-bold text-blue-500 mb-2">{currentAge} años</div>
                  <input type="range" min="25" max="60" value={currentAge} onChange={(e) => { setCurrentAge(Number(e.target.value)); setAnimationYear(0); setIsPlaying(false); }}
                    className="w-full h-2 bg-dark-bg rounded-lg appearance-none cursor-pointer slider" />
                  <div className="flex justify-between text-xs text-neutral-500 mt-1"><span>25</span><span>60</span></div>
                </div>

                <div className="bg-dark-surface rounded-xl p-4 border border-dark-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-neon-green" />
                    <label className="font-semibold text-neutral-100">Edad de Retiro</label>
                  </div>
                  <div className="text-3xl font-bold text-neon-green mb-2">{retirementAge} años</div>
                  <input type="range" min="55" max="70" value={retirementAge} onChange={(e) => { setRetirementAge(Number(e.target.value)); setAnimationYear(0); setIsPlaying(false); }}
                    className="w-full h-2 bg-dark-bg rounded-lg appearance-none cursor-pointer slider" />
                  <div className="flex justify-between text-xs text-neutral-500 mt-1"><span>55</span><span>70</span></div>
                </div>

                <div className="bg-dark-surface rounded-xl p-4 border border-dark-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Hash className="w-5 h-5 text-neon-red" />
                    <label className="font-semibold text-neutral-100">Tickets de Inversión</label>
                  </div>
                  <div className="text-3xl font-bold text-neon-red mb-2">{numberOfCertificates}</div>
                  <div className="flex items-center gap-3 mb-2">
                    <motion.button onClick={() => numberOfCertificates > 1 && setNumberOfCertificates(numberOfCertificates - 1)} whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 bg-red-500 text-white rounded-lg flex items-center justify-center"><Minus className="w-5 h-5" /></motion.button>
                    <input type="range" min="1" max="20" value={numberOfCertificates} onChange={(e) => setNumberOfCertificates(Number(e.target.value))}
                      className="flex-1 h-2 bg-dark-bg rounded-lg appearance-none cursor-pointer slider" />
                    <motion.button onClick={() => numberOfCertificates < 20 && setNumberOfCertificates(numberOfCertificates + 1)} whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 bg-neon-green text-white rounded-lg flex items-center justify-center"><Plus className="w-5 h-5" /></motion.button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {[1, 3, 5, 10, 15, 20].map((p) => (
                      <motion.button key={p} onClick={() => setNumberOfCertificates(p)} whileTap={{ scale: 0.95 }}
                        className={`px-3 py-1 rounded-lg text-sm font-semibold ${numberOfCertificates === p ? 'bg-neon-red text-white' : 'bg-dark-bg text-neutral-400 border border-dark-border'}`}>{p}</motion.button>
                    ))}
                  </div>
                </div>

                <div className="bg-dark-surface rounded-xl p-4 border border-dark-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Percent className="w-5 h-5 text-amber-500" />
                    <label className="font-semibold text-neutral-100">Reinversión ICM</label>
                  </div>
                  <div className="text-3xl font-bold text-amber-500 mb-2">{reinvestmentPercentage}%</div>
                  <input type="range" min="0" max="100" step="5" value={reinvestmentPercentage} onChange={(e) => setReinvestmentPercentage(Number(e.target.value))}
                    className="w-full h-2 bg-dark-bg rounded-lg appearance-none cursor-pointer slider" />
                  <div className="flex justify-between text-xs text-neutral-500 mt-1"><span>0% (Todo retirado)</span><span>100% (Todo reinvertido)</span></div>
                </div>
              </div>

              <div className="bg-dark-surface rounded-xl p-4 border border-dark-border">
                <h4 className="font-semibold text-neutral-100 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-neon-red" /> Perfiles Predefinidos
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {presets.map((p, i) => (
                    <motion.button key={i} onClick={() => { setCurrentAge(p.age); setRetirementAge(p.retAge); setNumberOfCertificates(p.tickets); setAnimationYear(0); setIsPlaying(false); }}
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-dark-bg border border-dark-border hover:border-neon-red rounded-lg text-sm font-semibold text-neutral-300 transition-all">{p.label}</motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-neon-red to-red-800 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4"><Award className="w-8 h-8" /><h3 className="text-2xl font-bold">Tu Plan Estimado de Retiro</h3></div>
            <div className="space-y-3">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-sm text-red-200 mb-1">Escalon / Escenario</div>
                <div className="text-lg font-bold">Escalon {selectedEscalon} | {selectedScenario === 'conservative' ? 'Conservador' : selectedScenario === 'moderate' ? 'Moderado' : 'Optimista'}</div>
                <div className="text-sm text-red-200 mt-1">ROI Est. {scenarioROI}% | Retorno ${scenarioAnnualReturn.toLocaleString()}/año</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-sm text-red-200 mb-1">Tickets RiderMex</div>
                <div className="text-2xl font-bold">{numberOfCertificates} x ${ticketPrice.toLocaleString()}</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-sm text-red-200 mb-1">Inversión Inicial Estimada</div>
                <div className="text-2xl font-bold">${initialInvestment.toLocaleString()}</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-sm text-red-200 mb-1">Años hasta el Retiro</div>
                <div className="text-2xl font-bold">{yearsToRetirement} años</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-sm text-red-200 mb-1">Patrimonio Estimado al Retiro</div>
                <div className="text-2xl font-bold text-neon-green">${finalRidermex.toLocaleString()}</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-sm text-red-200 mb-1">Ingreso Mensual Estimado</div>
                <div className="text-2xl font-bold text-neon-green">${ridermexData[ridermexData.length - 1]?.monthlyIncome.toLocaleString()}</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-sm text-red-200 mb-1">Reinversión ICM</div>
                <div className="text-2xl font-bold">{reinvestmentPercentage}%</div>
              </div>
              <div className="bg-neon-green/20 border border-neon-green/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1"><AlertCircle className="w-5 h-5" /><span className="font-bold text-sm">Ventaja Estimada vs AFORE</span></div>
                <div className="text-2xl font-bold text-neon-green">+${(finalRidermex - finalAfore).toLocaleString()}</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-dark-card rounded-2xl shadow-xl p-6 mb-8 border border-dark-border">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-neon-green/20 rounded-xl"><BarChart3 className="w-6 h-6 text-neon-green" /></div>
              <div>
                <h3 className="text-2xl font-bold text-neutral-100">Evolución Estimada de tu Patrimonio</h3>
                <p className="text-neutral-400">Animación año por año del crecimiento estimado</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <motion.button onClick={() => setShowRealValues(!showRealValues)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 font-semibold ${showRealValues ? 'bg-neon-red text-white' : 'bg-blue-600 text-white'}`}>
                <Percent className="w-4 h-4" />{showRealValues ? 'Valores Reales' : 'Valores Nominales'}
              </motion.button>
              <motion.button onClick={() => { setIsPlaying(false); setAnimationYear(0); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-dark-surface text-neutral-300 rounded-lg flex items-center gap-2 border border-dark-border"><RotateCcw className="w-4 h-4" />Reiniciar</motion.button>
              <motion.button onClick={() => { if (animationYear >= yearsToRetirement - 1) setAnimationYear(0); setIsPlaying(!isPlaying); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-neon-green text-white rounded-lg flex items-center gap-2">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}{isPlaying ? 'Pausar' : 'Reproducir'}
              </motion.button>
              <select value={animationSpeed} onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                className="px-3 py-2 bg-dark-surface border border-dark-border rounded-lg text-sm text-neutral-300 focus:border-neon-green focus:outline-none">
                <option value="2000">Lento</option><option value="1000">Normal</option><option value="500">Rápido</option>
              </select>
            </div>
          </div>

          {isPlaying && (
            <div className="mb-4 bg-neon-green/10 border border-neon-green/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div><span className="text-sm text-neutral-400">Año:</span><span className="ml-2 text-2xl font-bold text-neon-green">{animationYear + 1}</span><span className="ml-2 text-sm text-neutral-400">/ {yearsToRetirement}</span></div>
                <div><span className="text-sm text-neutral-400">Edad:</span><span className="ml-2 text-2xl font-bold text-blue-400">{currentAge + animationYear + 1}</span></div>
              </div>
            </div>
          )}

          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={animatedData}>
              <defs>
                <linearGradient id="colorAFORE" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/></linearGradient>
                <linearGradient id="colorPPR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/></linearGradient>
                <linearGradient id="colorRM" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/><stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="year" stroke="#9ca3af" label={{ value: 'Años', position: 'insideBottom', offset: -5, fill: '#9ca3af' }} />
              <YAxis stroke="#9ca3af" tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f3f4f6' }}
                formatter={(value: number) => `$${value.toLocaleString('es-MX')}`} />
              <Legend />
              <Area type="monotone" dataKey="AFORE" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorAFORE)" />
              <Area type="monotone" dataKey="PPR" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorPPR)" />
              <Area type="monotone" dataKey="RiderMex" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRM)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {comparisonOptions.map((option, index) => {
            const data = [aforeData, pprData, ridermexData][index];
            const finalValue = data[data.length - 1];
            const isSelected = selectedOption === option.name;
            return (
              <motion.div key={option.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.1 }}
                className={`bg-dark-card rounded-2xl shadow-xl overflow-hidden cursor-pointer transition-all border ${isSelected ? 'ring-2 ring-neon-green scale-105 border-neon-green' : 'border-dark-border'}`}
                onClick={() => setSelectedOption(isSelected ? null : option.name)} whileHover={{ scale: 1.02 }}>
                <div className="p-6" style={{ backgroundColor: `${option.color}15` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: option.color }}>
                      <option.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-neutral-100">{option.name}</h4>
                      <p className="text-sm text-neutral-400">{option.description}</p>
                    </div>
                  </div>
                  <div className="bg-dark-bg rounded-lg p-4 mb-3">
                    <div className="text-sm text-neutral-400 mb-1">Patrimonio Final Estimado</div>
                    <div className="text-3xl font-bold" style={{ color: option.color }}>
                      ${(showRealValues ? finalValue.realPatrimony : finalValue.patrimony).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-dark-bg rounded-lg p-4 mb-3">
                    <div className="text-sm text-neutral-400 mb-1">Ingreso Mensual Estimado</div>
                    <div className="text-2xl font-bold" style={{ color: option.color }}>
                      ${(showRealValues ? finalValue.realMonthlyIncome : finalValue.monthlyIncome).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-dark-bg rounded-lg p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-400">Rendimiento Estimado:</span>
                      <span className="font-bold" style={{ color: option.color }}>{option.rate}% anual</span>
                    </div>
                  </div>
                </div>
                <AnimatePresence>
                  {isSelected && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="p-6 bg-dark-surface border-t border-dark-border">
                        <div className="mb-4">
                          <h5 className="font-bold text-neutral-100 mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-neon-green" />Ventajas</h5>
                          <ul className="space-y-1">
                            {option.features.map((f, i) => (<li key={i} className="text-sm text-neutral-300 flex items-start gap-2"><span className="text-neon-green mt-0.5">&#10003;</span>{f}</li>))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-bold text-neutral-100 mb-2 flex items-center gap-2"><TrendingDown className="w-4 h-4 text-neon-red" />Consideraciones</h5>
                          <ul className="space-y-1">
                            {option.risks.map((r, i) => (<li key={i} className="text-sm text-neutral-300 flex items-start gap-2"><span className="text-neon-red mt-0.5">!</span>{r}</li>))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-dark-card rounded-2xl shadow-xl p-6 mb-8 border border-dark-border">
          <button onClick={() => setShowDetailedTable(!showDetailedTable)} className="w-full flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-neon-red/20 rounded-xl"><BarChart3 className="w-6 h-6 text-neon-red" /></div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-neutral-100">Tabla Estimada Año por Año</h3>
                <p className="text-neutral-400">Evolución completa estimada de cada opción</p>
              </div>
            </div>
            {showDetailedTable ? <ChevronUp className="w-6 h-6 text-neutral-400" /> : <ChevronDown className="w-6 h-6 text-neutral-400" />}
          </button>
          <AnimatePresence>
            {showDetailedTable && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-dark-surface">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold text-neutral-300">Año</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-neutral-300">Edad</th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-blue-400">AFORE Estimado</th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-amber-400">PPR Estimado</th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-neon-green">RiderMex Estimado</th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-neon-red">Ventaja Estimada</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border">
                    {combinedData.map((d, i) => (
                      <tr key={i} className="hover:bg-dark-surface/50 transition-colors">
                        <td className="px-4 py-3 text-sm font-semibold text-neutral-200">{d.year}</td>
                        <td className="px-4 py-3 text-sm text-neutral-400">{d.age}</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-blue-400">${d.AFORE.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-amber-400">${d.PPR.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-neon-green">${d.RiderMex.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-right font-bold text-neon-red">+${(d.RiderMex - d.AFORE).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Pie + Advantage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="bg-dark-card rounded-2xl shadow-xl p-6 border border-dark-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-neon-green/20 rounded-xl"><Award className="w-6 h-6 text-neon-green" /></div>
              <div>
                <h3 className="text-2xl font-bold text-neutral-100">Distribución Estimada Final</h3>
                <p className="text-neutral-400">Comparación visual estimada del patrimonio</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={100} dataKey="value">
                  {pieData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f3f4f6' }}
                  formatter={(value: number) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-neon-green to-emerald-700 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-6"><Target className="w-8 h-8" /><h3 className="text-2xl font-bold">La Diferencia Estimada es Clara</h3></div>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-sm text-green-100 mb-1">Ventaja Estimada sobre AFORE</div>
                <div className="text-3xl font-bold">${(finalRidermex - finalAfore).toLocaleString()}</div>
                <div className="text-sm text-green-200 mt-1">{finalAfore > 0 ? `${(((finalRidermex - finalAfore) / finalAfore) * 100).toFixed(0)}% más` : ''}</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-sm text-green-100 mb-1">Ventaja Estimada sobre PPR</div>
                <div className="text-3xl font-bold">${(finalRidermex - finalPpr).toLocaleString()}</div>
                <div className="text-sm text-green-200 mt-1">{finalPpr > 0 ? `${(((finalRidermex - finalPpr) / finalPpr) * 100).toFixed(0)}% más` : ''}</div>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <div className="font-bold mb-2 flex items-center gap-2"><Zap className="w-5 h-5" />¿Por qué RiderMex?</div>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start gap-2"><span>&#10003;</span>Activos reales productivos (tiendas de motocicletas)</li>
                  <li className="flex items-start gap-2"><span>&#10003;</span>Protección patrimonial con 3 fideicomisos</li>
                  <li className="flex items-start gap-2"><span>&#10003;</span>Patrimonio heredable y tangible</li>
                  <li className="flex items-start gap-2"><span>&#10003;</span>Seguro de cobertura amplia incluido</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Report */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
          className="bg-dark-card rounded-2xl p-6 border border-dark-border mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-neon-red to-orange-500 rounded-xl"><DollarSign className="w-6 h-6 text-white" /></div>
            <div>
              <h3 className="text-xl font-bold text-neutral-100">Descargar Reporte RiderMex</h3>
              <p className="text-sm text-neutral-400">Exporta tu análisis estimado de retiro</p>
            </div>
          </div>
          <div className="flex justify-center">
            <RidermexReportButton variant="primary" size="lg" className="w-full max-w-md" />
          </div>
        </motion.div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #10b981; cursor: pointer; box-shadow: 0 0 10px rgba(16, 185, 129, 0.5); }
        .slider::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: #10b981; cursor: pointer; border: none; box-shadow: 0 0 10px rgba(16, 185, 129, 0.5); }
      `}</style>
    </div>
  );
};

export default RetirementCalculator;
