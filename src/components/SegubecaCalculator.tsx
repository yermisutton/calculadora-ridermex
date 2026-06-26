import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Calendar, DollarSign, TrendingUp, BarChart3, Zap, Play, Pause, RotateCcw, Settings, Target, Award, GraduationCap, Home, School, TrendingDown, AlertCircle, ChevronDown, ChevronUp, Hash, Percent, Building2, Shield, Baby, Heart, LineChart, BookOpen, CheckCircle, Plus, Minus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useCalculator } from '../context/CalculatorContext';
import { formatCurrency } from '../utils/formatters';
import { DisclaimerBanner } from './ui/DisclaimerBanner';
import AnimatedNumberDisplay from './ui/AnimatedNumberDisplay';
import RidermexReportButton from './ui/RidermexReportButton';
import EscalonSelector from './ui/EscalonSelector';
import { ESCALONES, RIDERMEX_CONFIG, type EscalonData } from '../data/ridermexConfig';

interface SegubecaCalculatorProps {
  onBack?: () => void;
}

interface ComparisonOption {
  name: string;
  color: string;
  rate: number;
  description: string;
  icon: typeof GraduationCap;
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

const SegubecaCalculator: React.FC<SegubecaCalculatorProps> = ({ onBack }) => {
  const { investment, updateInvestment, results } = useCalculator();

  const [childAge, setChildAge] = useState(5);
  const [universityAge, setUniversityAge] = useState(18);
  const [numberOfCertificates, setNumberOfCertificates] = useState(1);
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [inflationRate, setInflationRate] = useState(4.5);
  const [showRealValues, setShowRealValues] = useState(false);
  const [reinvestmentPercentage, setReinvestmentPercentage] = useState(100);
  const [animationYear, setAnimationYear] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showDetailedTable, setShowDetailedTable] = useState(false);
  const [continueAfterGoal, setContinueAfterGoal] = useState(false);
  const [maxYears, setMaxYears] = useState(25);
  const [selectedEscalon, setSelectedEscalon] = useState(investment.ridermexEscalon || 1);

  const currentEscalonData = ESCALONES.find(e => e.number === selectedEscalon) || ESCALONES[0];

  const handleEscalonChange = (escalon: EscalonData) => {
    setSelectedEscalon(escalon.number);
    updateInvestment({ ridermexEscalon: escalon.number, ridermexEntryPrice: escalon.entryPrice });
  };

  const currentProduct = productInfo[investment.ridermexProductType as 'A' | 'B' | 'C'] || productInfo.B;
  const ticketPrice = currentEscalonData.entryPrice;
  const initialInvestment = numberOfCertificates * ticketPrice;
  const yearsToUniversity = universityAge - childAge;
  const effectiveYears = continueAfterGoal ? maxYears : yearsToUniversity;
  const annualContribution = monthlyContribution * 12;

  const comparisonOptions: ComparisonOption[] = [
    {
      name: 'Segubeca Tradicional',
      color: '#3b82f6',
      rate: 6,
      description: 'Seguro educativo convencional',
      icon: School,
      features: [
        'Rendimientos estimados: 3% - 6% anual',
        'Garantía de pago de colegiaturas',
        'Seguro de vida incluido',
        'Termina al graduarse',
        'Ahorro en pesos o UDIS'
      ],
      risks: [
        'Rendimientos apenas cubren inflación',
        'Sin continuidad después de graduación',
        'Penalizaciones por cancelación',
        'No genera patrimonio heredable',
        'Comisiones por administración'
      ]
    },
    {
      name: 'Seguro Educativo Premium',
      color: '#8b5cf6',
      rate: 8,
      description: 'Planes educativos de alta gama',
      icon: Award,
      features: [
        'Rendimientos estimados: 6% - 9% anual',
        'Cobertura internacional',
        'Flexibilidad de uso',
        'Opciones de inversión',
        'Portabilidad'
      ],
      risks: [
        'Costos de administración elevados',
        'Liquidez limitada',
        'Dependencia de mercados financieros',
        'No protege contra devaluación',
        'Termina con la educación'
      ]
    },
    {
      name: 'Segubeca Patrimonial (RiderMex)',
      color: '#10b981',
      rate: currentProduct.roi,
      description: 'Fondo educativo que se convierte en patrimonio',
      icon: GraduationCap,
      features: [
        `Rendimientos estimados: ${currentProduct.roi}% anual`,
        'Ingreso mensual continuo post-universidad',
        'Respaldo en negocios de motocicletas',
        'Protección patrimonial (3 fideicomisos)',
        'Patrimonio heredable',
        'Flexibilidad total de uso',
        'Activos físicos productivos'
      ],
      risks: [
        'Inversión en activo empresarial',
        'Requiere horizonte mínimo 5 años',
        'Liquidez no inmediata'
      ]
    }
  ];

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
  }, []);

  useEffect(() => {
    if (results && results.yearlyData) {
      return;
    }

    const cashOutPercentage = 100 - reinvestmentPercentage;
    updateInvestment({
      initialCertificates: numberOfCertificates,
      certificateBasePrice: ticketPrice,
      initialPayment: ticketPrice * numberOfCertificates,
      years: effectiveYears,
      annualProfit: currentProduct.roi,
      reinvestProfits: reinvestmentPercentage > 0,
      partialCashOut: reinvestmentPercentage < 100,
      cashOutPercentage: cashOutPercentage,
      yearlyCashOutPercentages: Array(effectiveYears).fill(cashOutPercentage),
      inflationRate: inflationRate,
      monthlyContribution: monthlyContribution,
      investorAnnualReturn: currentProduct.roi
    });
  }, [
    numberOfCertificates,
    ticketPrice,
    effectiveYears,
    reinvestmentPercentage,
    monthlyContribution,
    currentProduct.roi
  ]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setAnimationYear((prev) => {
        if (prev >= effectiveYears - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, animationSpeed);

    return () => clearInterval(timer);
  }, [isPlaying, animationSpeed, effectiveYears]);

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

  const calculateEducationProjection = (option: ComparisonOption, isRidermex: boolean = false) => {
    const yearlyData: Array<{
      year: number;
      age: number;
      patrimony: number;
      realPatrimony: number;
      monthlyIncome: number;
      realMonthlyIncome: number;
      annualIncome: number;
      totalContributed: number;
      yearlyReturn: number;
      reinvestedAmount: number;
      withdrawnAmount: number;
      totalCertificates: number;
      certificatesAdded: number;
    }> = [];

    if (isRidermex) {
      if (results && results.yearlyData && results.yearlyData.length > 0) {
        results.yearlyData.forEach((yearData, index) => {
          if (index < effectiveYears) {
            const age = childAge + (index + 1);
            const inflationFactor = Math.pow(1 + inflationRate / 100, index + 1);
            const realPatrimony = yearData.citrusPatrimony / inflationFactor;
            const realMonthlyIncome = (yearData.citrusIncome / 12) / inflationFactor;

            yearlyData.push({
              year: index + 1,
              age,
              patrimony: Math.round(yearData.citrusPatrimony),
              realPatrimony: Math.round(realPatrimony),
              monthlyIncome: Math.round(yearData.citrusIncome / 12),
              realMonthlyIncome: Math.round(realMonthlyIncome),
              annualIncome: Math.round(yearData.citrusIncome),
              totalContributed: (ticketPrice * numberOfCertificates) + (annualContribution * (index + 1)),
              yearlyReturn: Math.round(yearData.citrusIncome),
              reinvestedAmount: Math.round(yearData.yearlyReinvestmentContribution),
              withdrawnAmount: Math.round(yearData.yearlyCashOutAmount),
              totalCertificates: yearData.totalCertificates,
              certificatesAdded: yearData.newCertificateIds?.length || 0
            });
          }
        });
      } else {
        for (let year = 1; year <= effectiveYears; year++) {
          const age = childAge + year;
          yearlyData.push({
            year,
            age,
            patrimony: 0,
            realPatrimony: 0,
            monthlyIncome: 0,
            realMonthlyIncome: 0,
            annualIncome: 0,
            totalContributed: (ticketPrice * numberOfCertificates),
            yearlyReturn: 0,
            reinvestedAmount: 0,
            withdrawnAmount: 0,
            totalCertificates: numberOfCertificates,
            certificatesAdded: 0
          });
        }
      }
    } else {
      let patrimony = initialInvestment;

      for (let year = 1; year <= yearsToUniversity; year++) {
        patrimony += annualContribution;

        const yearlyReturn = patrimony * (option.rate / 100);

        let reinvestedAmount = 0;
        let withdrawnAmount = 0;

        if (reinvestmentPercentage > 0) {
          reinvestedAmount = yearlyReturn * (reinvestmentPercentage / 100);
          withdrawnAmount = yearlyReturn - reinvestedAmount;
          patrimony += reinvestedAmount;
        } else {
          withdrawnAmount = yearlyReturn;
        }

        const monthlyIncome = yearlyReturn / 12;
        const age = childAge + year;

        const inflationFactor = Math.pow(1 + inflationRate / 100, year);
        const realPatrimony = patrimony / inflationFactor;
        const realMonthlyIncome = monthlyIncome / inflationFactor;

        yearlyData.push({
          year,
          age,
          patrimony: Math.round(patrimony),
          realPatrimony: Math.round(realPatrimony),
          monthlyIncome: Math.round(monthlyIncome),
          realMonthlyIncome: Math.round(realMonthlyIncome),
          annualIncome: Math.round(yearlyReturn),
          totalContributed: initialInvestment + (annualContribution * year),
          yearlyReturn: Math.round(yearlyReturn),
          reinvestedAmount: Math.round(reinvestedAmount),
          withdrawnAmount: Math.round(withdrawnAmount),
          totalCertificates: 0,
          certificatesAdded: 0
        });
      }
    }

    return yearlyData;
  };

  const segubecaTradicionalData = calculateEducationProjection(comparisonOptions[0]);
  const seguroPremiumData = calculateEducationProjection(comparisonOptions[1]);
  const ridermexData = calculateEducationProjection(comparisonOptions[2], true);

  if (!segubecaTradicionalData || segubecaTradicionalData.length === 0 || !seguroPremiumData || seguroPremiumData.length === 0 || !ridermexData || ridermexData.length === 0) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-red/30 border-t-neon-red rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-300 font-medium">Calculando proyección educativa estimada...</p>
        </div>
      </div>
    );
  }

  const combinedData = segubecaTradicionalData.map((_, index) => ({
    year: segubecaTradicionalData[index].year,
    age: segubecaTradicionalData[index].age,
    'Segubeca Tradicional': showRealValues ? segubecaTradicionalData[index].realPatrimony : segubecaTradicionalData[index].patrimony,
    'Seguro Premium': showRealValues ? seguroPremiumData[index].realPatrimony : seguroPremiumData[index].patrimony,
    'Segubeca Patrimonial': showRealValues ? ridermexData[index].realPatrimony : ridermexData[index].patrimony,
    tradicionalIncome: showRealValues ? segubecaTradicionalData[index].realMonthlyIncome : segubecaTradicionalData[index].monthlyIncome,
    premiumIncome: showRealValues ? seguroPremiumData[index].realMonthlyIncome : seguroPremiumData[index].monthlyIncome,
    ridermexIncome: showRealValues ? ridermexData[index].realMonthlyIncome : ridermexData[index].monthlyIncome,
    tradicionalNominal: segubecaTradicionalData[index].patrimony,
    premiumNominal: seguroPremiumData[index].patrimony,
    ridermexNominal: ridermexData[index].patrimony
  }));

  const animatedData = isPlaying ? combinedData.slice(0, animationYear + 1) : combinedData;

  const handlePlayPause = () => {
    if (animationYear >= effectiveYears - 1) {
      setAnimationYear(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setAnimationYear(0);
  };

  const finalTradicionalPatrimony = segubecaTradicionalData[segubecaTradicionalData.length - 1]?.patrimony || 0;
  const finalPremiumPatrimony = seguroPremiumData[seguroPremiumData.length - 1]?.patrimony || 0;
  const finalRidermexPatrimony = ridermexData[ridermexData.length - 1]?.patrimony || 0;

  const pieData = [
    { name: 'Segubeca Tradicional', value: finalTradicionalPatrimony, color: comparisonOptions[0].color },
    { name: 'Seguro Premium', value: finalPremiumPatrimony, color: comparisonOptions[1].color },
    { name: 'Segubeca Patrimonial', value: finalRidermexPatrimony, color: comparisonOptions[2].color }
  ];

  const totalInvested = initialInvestment + (annualContribution * effectiveYears);

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
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-neutral-100">Calculadora Segubeca Patrimonial RiderMex</h1>
              <p className="text-neutral-400 mt-1">Planifica el futuro educativo y patrimonial de tu familia (valores estimados)</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-neon-red to-red-700 text-white rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-8 h-8" />
              <h2 className="text-2xl font-bold">¿Y después de la universidad?</h2>
            </div>
            <p className="text-red-100 text-lg">
              Los seguros educativos tradicionales terminan con la graduación. Con Segubeca Patrimonial RiderMex, tu inversión educativa se convierte en patrimonio heredable con ingreso mensual continuo estimado.
            </p>
          </div>
        </motion.div>

        <DisclaimerBanner variant="compact" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 bg-dark-card rounded-2xl shadow-xl p-6 border border-dark-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-neon-red rounded-xl"><Settings className="w-6 h-6 text-white" /></div>
              <div>
                <h3 className="text-2xl font-bold text-neutral-100">Parámetros de la Simulación</h3>
                <p className="text-neutral-400">Configura el fondo educativo de tu hijo</p>
              </div>
            </div>

            <div className="space-y-6">
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

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-dark-surface rounded-xl p-4 border border-dark-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Baby className="w-5 h-5 text-blue-500" />
                    <label className="font-semibold text-neutral-100">Edad actual del hijo</label>
                  </div>
                  <div className="text-3xl font-bold text-blue-500 mb-2">{childAge} años</div>
                  <input type="range" min="0" max="15" value={childAge} onChange={(e) => setChildAge(Number(e.target.value))}
                    className="w-full h-2 bg-dark-bg rounded-lg appearance-none cursor-pointer slider" />
                  <p className="text-sm text-neutral-500 mt-2">Años hasta universidad: {yearsToUniversity}</p>
                </div>

                <div className="bg-dark-surface rounded-xl p-4 border border-dark-border">
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="w-5 h-5 text-neon-green" />
                    <label className="font-semibold text-neutral-100">Edad de universidad</label>
                  </div>
                  <div className="text-3xl font-bold text-neon-green mb-2">{universityAge} años</div>
                  <input type="range" min="16" max="25" value={universityAge} onChange={(e) => setUniversityAge(Number(e.target.value))}
                    className="w-full h-2 bg-dark-bg rounded-lg appearance-none cursor-pointer slider" />
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
                    <input type="range" min="1" max="10" value={numberOfCertificates} onChange={(e) => setNumberOfCertificates(Number(e.target.value))}
                      className="flex-1 h-2 bg-dark-bg rounded-lg appearance-none cursor-pointer slider" />
                    <motion.button onClick={() => numberOfCertificates < 10 && setNumberOfCertificates(numberOfCertificates + 1)} whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 bg-neon-green text-white rounded-lg flex items-center justify-center"><Plus className="w-5 h-5" /></motion.button>
                  </div>
                  <p className="text-sm text-neutral-500 mt-2">Inversión Estimada: {formatCurrency(initialInvestment, 'MXN')}</p>
                </div>

                <div className="bg-dark-surface rounded-xl p-4 border border-dark-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Percent className="w-5 h-5 text-amber-500" />
                    <label className="font-semibold text-neutral-100">Reinversión ICM</label>
                  </div>
                  <div className="text-3xl font-bold text-amber-500 mb-2">{reinvestmentPercentage}%</div>
                  <input type="range" min="0" max="100" step="10" value={reinvestmentPercentage} onChange={(e) => setReinvestmentPercentage(Number(e.target.value))}
                    className="w-full h-2 bg-dark-bg rounded-lg appearance-none cursor-pointer slider" />
                </div>
              </div>

              <div className="bg-dark-surface rounded-xl p-4 border border-dark-border">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={continueAfterGoal} onChange={(e) => setContinueAfterGoal(e.target.checked)}
                    className="w-5 h-5 text-neon-green rounded focus:ring-neon-green" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-neutral-100">Continuar inversión después de la meta</div>
                    <div className="text-xs text-neutral-500">
                      {continueAfterGoal ? `Se proyectará hasta ${maxYears} años en vez de ${yearsToUniversity} años` : 'Solo proyectar hasta la edad universitaria'}
                    </div>
                  </div>
                </label>
                {continueAfterGoal && (
                  <div className="mt-3 pl-8">
                    <label className="text-xs font-medium text-neutral-400 mb-2 block">Años máximos de proyección: {maxYears}</label>
                    <input type="range" min={yearsToUniversity} max="40" value={maxYears} onChange={(e) => setMaxYears(Number(e.target.value))}
                      className="w-full h-2 bg-dark-bg rounded-lg appearance-none cursor-pointer slider" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <EscalonSelector
                selectedEscalon={selectedEscalon}
                onEscalonChange={handleEscalonChange}
                compact={false}
                theme="dark"
              />
            </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-neon-red to-red-800 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4"><Award className="w-8 h-8" /><h3 className="text-2xl font-bold">Tu Plan Educativo Estimado</h3></div>
            <div className="space-y-3">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-sm text-red-200 mb-1">Tickets RiderMex</div>
                <div className="text-2xl font-bold">{numberOfCertificates} x ${ticketPrice.toLocaleString()}</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-sm text-red-200 mb-1">Inversión Inicial Estimada</div>
                <AnimatedNumberDisplay value={initialInvestment} duration={1000} prefix="$" className="text-2xl font-bold" />
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-sm text-red-200 mb-1">Años hasta Universidad</div>
                <div className="text-2xl font-bold">{yearsToUniversity} años</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-sm text-red-200 mb-1">Patrimonio Estimado a los {universityAge}</div>
                <AnimatedNumberDisplay value={finalRidermexPatrimony} duration={1000} prefix="$" className="text-2xl font-bold text-neon-green" />
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-sm text-red-200 mb-1">Ingreso Mensual Estimado</div>
                <AnimatedNumberDisplay value={ridermexData[ridermexData.length - 1]?.monthlyIncome || 0} duration={1000} prefix="$" className="text-2xl font-bold text-neon-green" />
              </div>
              <div className="bg-neon-green/20 border border-neon-green/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1"><Heart className="w-5 h-5" /><span className="font-bold text-sm">Ventaja Estimada</span></div>
                <div className="text-2xl font-bold text-neon-green">+${(finalRidermexPatrimony - finalTradicionalPatrimony).toLocaleString()}</div>
              </div>
            </div>
          </motion.div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-dark-card rounded-2xl shadow-xl p-6 mb-8 border border-dark-border">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-neon-green/20 rounded-2xl">
                <TrendingUp className="w-10 h-10 text-neon-green" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-neutral-100">Resultados Estimados al llegar a la Universidad</h2>
                <p className="text-neutral-400">Edad {universityAge} años • {effectiveYears} años de inversión{continueAfterGoal ? ' (extendido)' : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowRealValues(!showRealValues)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${showRealValues ? 'bg-neon-red text-white' : 'bg-dark-surface text-neutral-300 border border-dark-border'}`}>
                {showRealValues ? 'Valor Real' : 'Valor Nominal'}
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {comparisonOptions.map((option, index) => {
              const data = index === 0 ? segubecaTradicionalData : index === 1 ? seguroPremiumData : ridermexData;
              const finalData = data[data.length - 1];
              const patrimony = showRealValues ? finalData.realPatrimony : finalData.patrimony;
              const monthlyIncome = showRealValues ? finalData.realMonthlyIncome : finalData.monthlyIncome;

              return (
                <motion.div key={option.name} whileHover={{ scale: 1.02 }}
                  className="bg-dark-surface rounded-2xl p-6 border-2 hover:shadow-xl transition-all cursor-pointer"
                  style={{ borderColor: option.color }}
                  onClick={() => setSelectedOption(selectedOption === option.name ? null : option.name)}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: `${option.color}20` }}>
                      <option.icon className="w-6 h-6" style={{ color: option.color }} />
                    </div>
                    <h3 className="font-bold text-neutral-100">{option.name}</h3>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-neutral-400 mb-1">Patrimonio Final Estimado</p>
                    <p className="text-3xl font-bold" style={{ color: option.color }}>
                      {formatCurrency(patrimony, 'MXN')}
                    </p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-neutral-400 mb-1">Ingreso Mensual Estimado Continuo</p>
                    <p className="text-xl font-bold text-neutral-100">
                      {formatCurrency(monthlyIncome, 'MXN')}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-dark-border">
                    <p className="text-sm text-neutral-400 mb-1">Retorno Total Estimado</p>
                    <p className="text-lg font-bold" style={{ color: option.color }}>
                      {((patrimony / totalInvested - 1) * 100).toFixed(1)}%
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence>
            {selectedOption && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                {comparisonOptions.map((option) => {
                  if (option.name !== selectedOption) return null;
                  return (
                    <div key={option.name} className="bg-dark-surface rounded-2xl p-6 border-2 border-dark-border mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-neutral-100">{option.name}</h3>
                        <button onClick={() => setSelectedOption(null)} className="p-2 hover:bg-dark-bg rounded-lg transition-colors">
                          <ChevronUp className="w-5 h-5 text-neutral-400" />
                        </button>
                      </div>
                      <p className="text-neutral-400 mb-4">{option.description}</p>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-neutral-100 mb-3 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-neon-green" />Ventajas
                          </h4>
                          <ul className="space-y-2">
                            {option.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-neutral-300">
                                <span className="text-neon-green mt-1">•</span><span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-neutral-100 mb-3 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-orange-500" />Consideraciones
                          </h4>
                          <ul className="space-y-2">
                            {option.risks.map((risk, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-neutral-300">
                                <span className="text-orange-500 mt-1">•</span><span>{risk}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-dark-surface rounded-2xl border-2 border-dark-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-neon-green" />Evolución del Patrimonio Educativo Estimado
              </h3>
              <div className="flex items-center gap-2">
                <button onClick={handleReset} className="p-2 hover:bg-dark-bg rounded-lg transition-colors" title="Reiniciar">
                  <RotateCcw className="w-5 h-5 text-neutral-400" />
                </button>
                <button onClick={handlePlayPause} className="p-2 hover:bg-dark-bg rounded-lg transition-colors" title={isPlaying ? 'Pausar' : 'Reproducir'}>
                  {isPlaying ? <Pause className="w-5 h-5 text-neutral-400" /> : <Play className="w-5 h-5 text-neutral-400" />}
                </button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={animatedData}>
                <defs>
                  <linearGradient id="colorTradicional" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={comparisonOptions[0].color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={comparisonOptions[0].color} stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={comparisonOptions[1].color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={comparisonOptions[1].color} stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorRidermex" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={comparisonOptions[2].color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={comparisonOptions[2].color} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="age" stroke="#9ca3af" label={{ value: 'Edad del hijo', position: 'insideBottom', offset: -5, fill: '#9ca3af' }} />
                <YAxis stroke="#9ca3af" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} label={{ value: 'Patrimonio Estimado', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px', color: '#f3f4f6' }}
                  formatter={(value: any) => formatCurrency(value, 'MXN')} labelFormatter={(age) => `Edad: ${age} años`} />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area type="monotone" dataKey="Segubeca Tradicional" stroke={comparisonOptions[0].color} fillOpacity={1} fill="url(#colorTradicional)" strokeWidth={2} />
                <Area type="monotone" dataKey="Seguro Premium" stroke={comparisonOptions[1].color} fillOpacity={1} fill="url(#colorPremium)" strokeWidth={2} />
                <Area type="monotone" dataKey="Segubeca Patrimonial" stroke={comparisonOptions[2].color} fillOpacity={1} fill="url(#colorRidermex)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-dark-surface rounded-2xl border-2 border-dark-border p-6">
              <h3 className="text-xl font-bold text-neutral-100 mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-neon-green" />Distribución Final del Patrimonio Estimado
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatCurrency(value, 'MXN')}
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f3f4f6' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gradient-to-br from-neon-green to-emerald-700 rounded-2xl border-2 border-neon-green p-6 text-white">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Heart className="w-6 h-6" />Ventaja de Segubeca Patrimonial Estimada
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-green-100 mb-2">vs. Segubeca Tradicional</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{(finalRidermexPatrimony / finalTradicionalPatrimony).toFixed(1)}X</span>
                    <span className="text-green-100">más patrimonio estimado</span>
                  </div>
                  <div className="mt-2 bg-white/20 rounded-lg p-3">
                    <p className="text-sm font-semibold">Diferencia Estimada: {formatCurrency(finalRidermexPatrimony - finalTradicionalPatrimony, 'MXN')}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-green-100 mb-2">vs. Seguro Premium</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{(finalRidermexPatrimony / finalPremiumPatrimony).toFixed(1)}X</span>
                    <span className="text-green-100">más patrimonio estimado</span>
                  </div>
                  <div className="mt-2 bg-white/20 rounded-lg p-3">
                    <p className="text-sm font-semibold">Diferencia Estimada: {formatCurrency(finalRidermexPatrimony - finalPremiumPatrimony, 'MXN')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-neon-green/10 to-emerald-500/10 border-2 border-neon-green/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <Zap className="w-8 h-8 text-neon-green flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-bold text-neutral-100 mb-2">¿Qué significa esto para tu familia?</h4>
                <p className="text-neutral-300 mb-4">
                  Con Segubeca Patrimonial RiderMex, no solo pagas la universidad de tu hijo. Al graduarse a los {universityAge} años, seguirás recibiendo <strong className="text-neon-green">{formatCurrency(ridermexData[ridermexData.length - 1].monthlyIncome, 'MXN')}/mes estimados</strong> de forma continua. Este ingreso estimado puede:
                </p>
                <ul className="space-y-2 text-neutral-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" /><span>Financiar un posgrado o maestría</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" /><span>Ser capital semilla para su primer negocio</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" /><span>Convertirse en patrimonio heredable para sus hijos (tus nietos)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" /><span>Complementar tu propio retiro</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-dark-card rounded-2xl shadow-xl p-6 border border-dark-border mb-8">
          <button onClick={() => setShowDetailedTable(!showDetailedTable)} className="w-full flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-100 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-neon-red" />Tabla Detallada Estimada Año por Año
            </h2>
            <ChevronDown className={`w-6 h-6 text-neutral-400 transition-transform ${showDetailedTable ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showDetailedTable && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-dark-surface border-b-2 border-dark-border">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-neutral-300">Año</th>
                        <th className="px-4 py-3 text-left font-semibold text-neutral-300">Edad</th>
                        <th className="px-4 py-3 text-right font-semibold text-blue-400">Trad. Estimado</th>
                        <th className="px-4 py-3 text-right font-semibold text-purple-400">Premium Estimado</th>
                        <th className="px-4 py-3 text-right font-semibold text-neon-green">Patrimonial Estimado</th>
                        <th className="px-4 py-3 text-right font-semibold text-neon-red">Ventaja Estimada</th>
                      </tr>
                    </thead>
                    <tbody>
                      {combinedData.map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-dark-bg' : 'bg-dark-surface/50'}>
                          <td className="px-4 py-3 font-medium text-neutral-200">{row.year}</td>
                          <td className="px-4 py-3 text-neutral-300">{row.age} años</td>
                          <td className="px-4 py-3 text-right text-blue-400">{formatCurrency(row['Segubeca Tradicional'], 'MXN')}</td>
                          <td className="px-4 py-3 text-right text-purple-400">{formatCurrency(row['Seguro Premium'], 'MXN')}</td>
                          <td className="px-4 py-3 text-right font-bold text-neon-green">{formatCurrency(row['Segubeca Patrimonial'], 'MXN')}</td>
                          <td className="px-4 py-3 text-right font-semibold text-neon-red">{(row['Segubeca Patrimonial'] / row['Segubeca Tradicional']).toFixed(1)}X</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-dark-card rounded-2xl p-6 border border-dark-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-neon-red to-orange-500 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-100">Descargar Reporte RiderMex</h3>
              <p className="text-sm text-neutral-400">Exporta tu análisis educativo estimado</p>
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

export default SegubecaCalculator;
