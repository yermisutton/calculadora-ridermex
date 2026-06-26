import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Calendar, TrendingUp, Percent, Zap, Hash, BarChart3, Receipt, Save, Check, Award, Target, FileText, Download, X, TrendingDown, Activity, Waves, ChevronDown, ChevronUp, Settings, Star } from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';
import AnimatedNumberDisplay from '../ui/AnimatedNumberDisplay';
import AlternativeInvestmentsCard from '../ui/AlternativeInvestmentsCard';
import AmortizationTable from '../ui/AmortizationTable';
import { AreaChart, Area, LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateResults } from '../../utils/calculations';
import { generateExpressPDF, generateExpressHTML, ReportType } from '../../utils/pdfGenerator';
import EscalonSelector from '../ui/EscalonSelector';
import { getEscalonByNumber, type EscalonData } from '../../data/ridermexConfig';

interface AdvisorInfo {
  name: string;
  email: string;
  phone: string;
  company: string;
}

const InteractiveDashboard: React.FC = () => {
  const { investment, updateInvestment, results, setDefaultYearlyCashOutPercentage, updateYearlyCashOutPercentage, updateCashOutPercentage, toggleReinvest } = useCalculator();
  const [customCertificates, setCustomCertificates] = useState(investment.initialCertificates);
  const [localCertificatePrice, setLocalCertificatePrice] = useState(investment.certificateBasePrice);
  const [scenarioSaved, setScenarioSaved] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'html' | null>(null);
  const [selectedReport, setSelectedReport] = useState<ReportType>('ridermex');
  const [isGenerating, setIsGenerating] = useState(false);
  const [advisorInfo, setAdvisorInfo] = useState<AdvisorInfo>({
    name: '',
    email: '',
    phone: '',
    company: ''
  });
  const [isInvestorGoalsExpanded, setIsInvestorGoalsExpanded] = useState(false);
  const [isGeneralSectionExpanded, setIsGeneralSectionExpanded] = useState(true);
  const [selectedInvestmentDetail, setSelectedInvestmentDetail] = useState<string | null>(null);
  const [selectedEscalon, setSelectedEscalon] = useState(investment.ridermexEscalon || 1);

  const handleEscalonChange = (escalon: EscalonData) => {
    setSelectedEscalon(escalon.number);
    updateInvestment({
      ridermexEscalon: escalon.number,
      ridermexEntryPrice: escalon.entryPrice,
      investorAnnualReturn: escalon.roi
    });
  };

  const criteriaScores = {
    cosecha: {
      returns: { score: 9, label: 'Rendimiento Potencial' },
      risk: { score: 8, label: 'Nivel de Riesgo' },
      liquidity: { score: 6, label: 'Liquidez' },
      diversification: { score: 9, label: 'Diversificación' },
      inflation: { score: 9, label: 'Protección Inflación' },
      tangible: { score: 10, label: 'Activo Tangible' },
      income: { score: 9, label: 'Generación Ingresos' },
      impact: { score: 10, label: 'Impacto Social' },
      sustainability: { score: 10, label: 'Sostenibilidad' }
    },
    cetes: {
      returns: { score: 6, label: 'Rendimiento Potencial' },
      risk: { score: 9, label: 'Nivel de Riesgo' },
      liquidity: { score: 10, label: 'Liquidez' },
      diversification: { score: 3, label: 'Diversificación' },
      inflation: { score: 5, label: 'Protección Inflación' },
      tangible: { score: 2, label: 'Activo Tangible' },
      income: { score: 6, label: 'Generación Ingresos' },
      impact: { score: 3, label: 'Impacto Social' },
      sustainability: { score: 3, label: 'Sostenibilidad' }
    },
    realEstate: {
      returns: { score: 7, label: 'Rendimiento Potencial' },
      risk: { score: 6, label: 'Nivel de Riesgo' },
      liquidity: { score: 4, label: 'Liquidez' },
      diversification: { score: 5, label: 'Diversificación' },
      inflation: { score: 8, label: 'Protección Inflación' },
      tangible: { score: 9, label: 'Activo Tangible' },
      income: { score: 7, label: 'Generación Ingresos' },
      impact: { score: 5, label: 'Impacto Social' },
      sustainability: { score: 4, label: 'Sostenibilidad' }
    },
    savings: {
      returns: { score: 3, label: 'Rendimiento Potencial' },
      risk: { score: 10, label: 'Nivel de Riesgo' },
      liquidity: { score: 10, label: 'Liquidez' },
      diversification: { score: 2, label: 'Diversificación' },
      inflation: { score: 2, label: 'Protección Inflación' },
      tangible: { score: 1, label: 'Activo Tangible' },
      income: { score: 3, label: 'Generación Ingresos' },
      impact: { score: 2, label: 'Impacto Social' },
      sustainability: { score: 2, label: 'Sostenibilidad' }
    },
    custom: {
      returns: { score: 7, label: 'Rendimiento Potencial' },
      risk: { score: 7, label: 'Nivel de Riesgo' },
      liquidity: { score: 7, label: 'Liquidez' },
      diversification: { score: 6, label: 'Diversificación' },
      inflation: { score: 6, label: 'Protección Inflación' },
      tangible: { score: 5, label: 'Activo Tangible' },
      income: { score: 6, label: 'Generación Ingresos' },
      impact: { score: 5, label: 'Impacto Social' },
      sustainability: { score: 5, label: 'Sostenibilidad' }
    }
  };

  const calculateOverallScore = (investmentKey: string) => {
    const scores = criteriaScores[investmentKey as keyof typeof criteriaScores];
    const values = Object.values(scores).map(s => s.score);
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    return average.toFixed(1);
  };

  // Investment label is always Ridermex now
  const investmentLabel = 'Ridermex';

  const investmentDetails = {
    cosecha: {
      title: investmentLabel,
      color: 'green',
      advantages: [
        'Rendimientos superiores: Retorno Estimado entre 15-25% anual',
        'Diversificación real: Inversión en activos tangibles (cítricos)',
        'Protección contra inflación: Los productos agrícolas mantienen valor',
        'Impacto sostenible: Contribución positiva al medio ambiente',
        'Flexibilidad en retiros: Plan personalizable de utilidades',
        'Respaldo profesional: Equipo experto en agricultura',
        'Transparencia total: Reportes detallados y acceso a información',
        'Beneficios fiscales: Posibles deducciones en inversiones productivas'
      ],
      disadvantages: [
        'Inversión a mediano/largo plazo: Mejores resultados en 5+ años',
        'Riesgos climáticos: Aunque mitigados, existen variables meteorológicas',
        'Liquidez limitada: No es instantáneo como una cuenta bancaria',
        'Conocimiento sectorial: Requiere confianza en el sector agrícola',
        'Monto mínimo: Inversión inicial puede ser mayor que otras opciones'
      ]
    },
    cetes: {
      title: 'CETES',
      color: 'blue',
      advantages: [
        'Alta liquidez: Acceso inmediato a tu dinero',
        'Seguridad gubernamental: Respaldo del gobierno mexicano',
        'Sin comisiones: No hay cargos por manejo',
        'Acceso fácil: Plataforma digital simple',
        'Inversión mínima baja: Desde $100 pesos',
        'Sin riesgo de pérdida de capital: Garantizado por el gobierno'
      ],
      disadvantages: [
        'Rendimientos limitados: 8-11% anual aproximadamente',
        'No protege contra inflación: Rendimiento real cercano a 0%',
        'Sin crecimiento exponencial: Interés simple, no compuesto',
        'Oportunidad perdida: Menor potencial vs otras inversiones',
        'Erosión del poder adquisitivo: La inflación reduce el valor real',
        'No genera riqueza: Solo preserva capital a corto plazo'
      ]
    },
    realEstate: {
      title: 'Bienes Raíces',
      color: 'orange',
      advantages: [
        'Activo tangible: Propiedad física con valor intrínseco',
        'Apreciación a largo plazo: Valor tiende a incrementar',
        'Ingresos pasivos: Rentas mensuales potenciales',
        'Protección contra inflación: Los inmuebles mantienen valor',
        'Apalancamiento: Posibilidad de financiamiento',
        'Diversificación: Complemento en portafolio de inversiones'
      ],
      disadvantages: [
        'Alta inversión inicial: Requiere capital significativo',
        'Baja liquidez: Venta puede tardar meses',
        'Costos de mantenimiento: Gastos continuos significativos',
        'Impuestos elevados: Predial, plusvalía, etc.',
        'Gestión activa: Requiere tiempo y administración',
        'Riesgo de vacancia: Periodos sin renta',
        'Trámites legales complejos: Procesos burocráticos largos',
        'Rendimientos variables: Dependiente de ubicación y mercado'
      ]
    },
    savings: {
      title: 'Ahorro Tradicional',
      color: 'purple',
      advantages: [
        'Liquidez inmediata: Acceso instantáneo a tu dinero',
        'Sin riesgo: Capital totalmente seguro',
        'Sin complicaciones: Muy simple de gestionar',
        'Flexibilidad total: Retira cuando quieras sin penalizaciones',
        'No requiere conocimientos: Accesible para todos'
      ],
      disadvantages: [
        'Rendimiento cero: No genera intereses',
        'Pérdida de valor real: La inflación reduce poder adquisitivo',
        'Oportunidad perdida: Tu dinero no trabaja para ti',
        'No hay crecimiento: Tu patrimonio no aumenta',
        'Riesgo inflacionario: Pierdes poder de compra año tras año',
        'No alcanzas metas financieras: Imposible crear riqueza',
        'Mentalidad limitante: No aprovechas el potencial de tu dinero'
      ]
    },
    custom: {
      title: investment.customInvestmentName || 'Mi Inversión',
      color: 'pink',
      advantages: [
        'Personalizable: Ajustado a tus necesidades específicas',
        'Flexibilidad: Puedes modificar parámetros según tu estrategia',
        'Comparación directa: Evalúa contra otras opciones',
        'Control total: Tú defines los términos',
        'Análisis detallado: Visualiza proyecciones personalizadas'
      ],
      disadvantages: [
        'Rendimientos variables: Depende de los parámetros configurados',
        'Requiere investigación: Debes validar tasas y condiciones reales',
        'Riesgos específicos: Cada inversión tiene sus propios riesgos',
        'Sin garantías: Los resultados pueden variar',
        'Gestión necesaria: Requiere seguimiento y ajustes'
      ]
    }
  };

  const scenarioPresets = [
    {
      label: 'Conservador',
      motos_mes: 50,
      utilidad: 900,
      color: 'orange',
      bgColor: 'from-orange-900/20 to-amber-900/20',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-600',
      buttonColor: 'bg-orange-600'
    },
    {
      label: 'Moderado',
      motos_mes: 60,
      utilidad: 800,
      color: 'blue',
      bgColor: 'from-blue-900/20 to-cyan-900/20',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-600',
      buttonColor: 'bg-blue-600'
    },
    {
      label: 'Optimista',
      motos_mes: 70,
      utilidad: 900,
      color: 'green',
      bgColor: 'from-green-900/20 to-emerald-900/20',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-600',
      buttonColor: 'bg-green-600'
    }
  ];

  useEffect(() => {
    setLocalCertificatePrice(investment.certificateBasePrice);
  }, [investment.certificateBasePrice]);

  const handleSliderChange = (field: keyof typeof investment, value: number) => {
    updateInvestment({ [field]: value });
  };

  const handleCertificatesChange = (certificates: number) => {
    setCustomCertificates(certificates);
    const initialPayment = certificates * investment.certificateBasePrice;
    updateInvestment({
      initialCertificates: certificates,
      initialPayment: initialPayment
    });
  };

  const handleScenarioPreset = (motos_mes: number, utilidad: number) => {
    // Map motos_mes to ridermexScenario
    let scenario: 'conservative' | 'moderate' | 'optimistic' = 'moderate';
    if (motos_mes <= 50) {
      scenario = 'conservative';
    } else if (motos_mes <= 60) {
      scenario = 'moderate';
    } else {
      scenario = 'optimistic';
    }

    updateInvestment({
      ridermexMotosMonth: motos_mes,
      ridermexUtilityPerMoto: utilidad,
      ridermexScenario: scenario
    });
  };

  const handleCertificatePriceChange = useCallback((newPrice: number) => {
    setLocalCertificatePrice(newPrice);
  }, []);

  const handleCertificatePriceCommit = useCallback((newPrice: number) => {
    const validPrice = Math.max(250000, Math.min(350000, newPrice));
    updateInvestment({
      certificateBasePrice: validPrice,
      initialPayment: customCertificates * validPrice
    });
  }, [customCertificates, updateInvestment]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: investment.currencyFormat,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleSaveScenario = () => {
    setScenarioSaved(true);
    setTimeout(() => setScenarioSaved(false), 2000);
  };

  const handleCreateIncreasingPattern = () => {
    const maxYears = Math.min(investment.years, 30);
    const step = (80 - 0) / (maxYears - 1);

    for (let year = 1; year <= maxYears; year++) {
      const percentage = Math.round((year - 1) * step);
      updateYearlyCashOutPercentage(year, percentage);
    }

    updateCashOutPercentage(40);
    if (!investment.partialCashOut) {
      updateInvestment({ partialCashOut: true });
    }
  };

  const handleCreateDecreasingPattern = () => {
    const maxYears = Math.min(investment.years, 30);
    const step = (80 - 0) / (maxYears - 1);

    for (let year = 1; year <= maxYears; year++) {
      const percentage = Math.round(80 - (year - 1) * step);
      updateYearlyCashOutPercentage(year, percentage);
    }

    updateCashOutPercentage(40);
    if (!investment.partialCashOut) {
      updateInvestment({ partialCashOut: true });
    }
  };

  const handleCreateBellCurvePattern = () => {
    const maxYears = Math.min(investment.years, 30);
    const midPoint = Math.ceil(maxYears / 2);

    for (let year = 1; year <= maxYears; year++) {
      let percentage;
      if (year <= midPoint) {
        percentage = Math.round((year - 1) * (80 / (midPoint - 1)));
      } else {
        percentage = Math.round(80 - ((year - midPoint) * (80 / (maxYears - midPoint))));
      }
      updateYearlyCashOutPercentage(year, percentage);
    }

    updateCashOutPercentage(40);
    if (!investment.partialCashOut) {
      updateInvestment({ partialCashOut: true });
    }
  };

  const handleCreateRetirementPattern = () => {
    const maxYears = Math.min(investment.years, 30);

    for (let year = 1; year <= maxYears; year++) {
      let percentage;
      if (year <= 5) {
        percentage = 0;
      } else if (year <= 15) {
        percentage = Math.round((year - 5) * (30 / 10));
      } else {
        percentage = Math.round(30 + ((year - 15) * (70 - 30) / (maxYears - 15)));
      }
      updateYearlyCashOutPercentage(year, percentage);
    }

    updateCashOutPercentage(30);
    if (!investment.partialCashOut) {
      updateInvestment({ partialCashOut: true });
    }
  };

  const calculateRequiredCertificates = useCallback((monthlyGoal: number): number => {
    if (!monthlyGoal || monthlyGoal <= 0) return investment.initialCertificates;

    const annualGoal = monthlyGoal * 12;
    const timeframe = investment.investorTimeframe || investment.years;

    // Mayor tiempo = menos tickets necesarios (efecto compuesto)
    // A menor tiempo = más tickets necesarios
    // Máximo dinámico: con menos años necesitas más tickets
    const maxTestCertificates = Math.max(50, Math.ceil(300 / Math.max(timeframe, 1)));

    for (let testCertificates = 1; testCertificates <= maxTestCertificates; testCertificates++) {
      const testInvestment = {
        ...investment,
        initialCertificates: testCertificates,
        years: timeframe
      };

      try {
        const testResults = calculateResults(testInvestment);

        if (testResults.finalMonthlyIncome >= monthlyGoal) {
          return testCertificates;
        }
      } catch (error) {
        const utilityPerCertificate = investment.averageProductionPerHectare * investment.averageSalePricePerKg * 0.1 * 0.65;
        return Math.ceil(annualGoal / utilityPerCertificate);
      }
    }

    return maxTestCertificates;
  }, [investment]);

  useEffect(() => {
    if (investment.investorMonthlyGoal && investment.investorMonthlyGoal > 0) {
      const requiredCerts = calculateRequiredCertificates(investment.investorMonthlyGoal);
      if (requiredCerts !== customCertificates) {
        setCustomCertificates(requiredCerts);
        updateInvestment({
          initialCertificates: requiredCerts,
          initialPayment: requiredCerts * investment.certificateBasePrice
        });
      }
    }
  }, [investment.investorMonthlyGoal, investment.investorTimeframe, investment.years, investment.ridermexMotosMonth, investment.ridermexUtilityPerMoto, investment.appreciationRate]);

  const handleExportClick = (format: 'pdf' | 'html') => {
    setExportFormat(format);
    setShowExportModal(true);
  };

  const generateHTMLReport = () => {
    if (!results) {
      throw new Error('No hay resultados disponibles para generar el HTML');
    }

    generateExpressHTML(investment, results, advisorInfo, selectedReport);
  };

  const generatePDFReport = async () => {
    if (!results) {
      throw new Error('No hay resultados disponibles para generar el PDF');
    }

    await generateExpressPDF(investment, results, advisorInfo, selectedReport);
  };

  const handleGenerateReport = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (advisorInfo.name && advisorInfo.email && advisorInfo.phone && advisorInfo.company) {
      setIsGenerating(true);

      await new Promise(resolve => setTimeout(resolve, 100));

      try {
        if (exportFormat === 'html') {
          await new Promise<void>((resolve, reject) => {
            try {
              generateHTMLReport();
              resolve();
            } catch (err) {
              reject(err);
            }
          });
        } else if (exportFormat === 'pdf') {
          await generatePDFReport();
        }

        await new Promise(resolve => setTimeout(resolve, 800));

        setShowExportModal(false);
        setAdvisorInfo({ name: '', email: '', phone: '', company: '' });
        setIsGenerating(false);
      } catch (error) {
        console.error('Error generating report:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        alert(`Hubo un error al generar el reporte: ${errorMessage}\n\nPor favor intenta de nuevo.`);
        setIsGenerating(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end gap-3"
      >
        <motion.button
          onClick={() => handleExportClick('html')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-xl font-semibold flex items-center gap-3 shadow-lg transition-all duration-300 bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:shadow-xl"
          disabled={!results}
        >
          <FileText className="w-5 h-5" />
          <span>Exportar HTML</span>
        </motion.button>

        <motion.button
          onClick={() => handleExportClick('pdf')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-xl font-semibold flex items-center gap-3 shadow-lg transition-all duration-300 bg-gradient-to-r from-red-600 to-pink-600 text-white hover:shadow-xl"
          disabled={!results}
        >
          <Download className="w-5 h-5" />
          <span>Exportar PDF</span>
        </motion.button>

        <motion.button
          onClick={handleSaveScenario}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-3 shadow-lg transition-all duration-300 ${
            scenarioSaved
              ? 'bg-green-600 text-white'
              : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-xl'
          }`}
        >
          {scenarioSaved ? (
            <>
              <Check className="w-5 h-5" />
              <span>Escenario Guardado</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Agregar Escenario</span>
            </>
          )}
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          className="md:col-span-2 bg-dark-card rounded-2xl shadow-lg border-2 border-dark-border overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
        <div className="p-6 flex items-center justify-between">
          <button
            onClick={() => setIsGeneralSectionExpanded(!isGeneralSectionExpanded)}
            className="flex items-center gap-4 hover:opacity-80 transition-opacity"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-neutral-100">Generales</h3>
              <p className="text-sm text-neutral-400">Configuración principal de tu inversión</p>
            </div>
            {isGeneralSectionExpanded ? (
              <ChevronUp className="w-6 h-6 text-neutral-400" />
            ) : (
              <ChevronDown className="w-6 h-6 text-neutral-400" />
            )}
          </button>

          {/* Reinvestment Toggle */}
          <motion.button
            onClick={toggleReinvest}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              investment.reinvestProfits
                ? 'bg-gradient-to-r from-neon-green to-emerald-600 text-white border-2 border-neon-green/50 shadow-lg'
                : 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-2 border-red-500/50 shadow-lg'
            }`}
          >
            <TrendingUp className={`w-5 h-5 ${investment.reinvestProfits ? 'animate-pulse' : ''}`} />
            <div className="text-left">
              <div className="text-sm leading-tight">
                {investment.reinvestProfits ? 'ICM Activado' : 'ICM Desactivado'}
              </div>
              <div className="text-xs opacity-90">
                {investment.reinvestProfits ? 'Con reinversión' : 'Sin reinversión'}
              </div>
            </div>
          </motion.button>
        </div>

        <AnimatePresence>
          {isGeneralSectionExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="px-6 pb-6"
            >
              <div className="space-y-6">
                {/* Product Type Selector */}
                <div className="bg-dark-surface rounded-2xl p-6 shadow-lg border-2 border-dark-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-600 rounded-xl">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-100">Tipo de Inversión</h3>
                      <p className="text-sm text-neutral-400">Selecciona el producto de inversión</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Ridermex A */}
                    <motion.button
                      onClick={() => {
                        const esc = getEscalonByNumber(selectedEscalon);
                        updateInvestment({
                          ridermexProductType: 'A',
                          certificateBasePrice: 70000,
                          initialPayment: 10000,
                          ridermexDownPaymentAmount: 10000,
                          ridermexFinancingMonths: 12,
                          ridermexFirstMonthlyIncome: 18,
                          annualProfit: esc.roi,
                          investorAnnualReturn: esc.roi
                        });
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-xl text-center transition-all ${
                        investment.ridermexProductType === 'A'
                          ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400'
                          : 'bg-dark-card text-neutral-200 hover:bg-dark-surface border-2 border-dark-border'
                      }`}
                    >
                      <div className="font-bold text-sm mb-1">Ridermex A</div>
                      <div className="text-xs opacity-80">Financiado</div>
                    </motion.button>

                    {/* Ridermex B */}
                    <motion.button
                      onClick={() => {
                        const escB = getEscalonByNumber(selectedEscalon);
                        updateInvestment({
                          ridermexProductType: 'B',
                          certificateBasePrice: 70000,
                          initialPayment: 70000,
                          ridermexDownPaymentAmount: 70000,
                          ridermexFinancingMonths: 0,
                          ridermexFirstMonthlyIncome: 7,
                          annualProfit: escB.roi,
                          investorAnnualReturn: escB.roi
                        });
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-xl text-center transition-all ${
                        investment.ridermexProductType === 'B'
                          ? 'bg-green-600 text-white shadow-lg ring-2 ring-green-400'
                          : 'bg-dark-card text-neutral-200 hover:bg-dark-surface border-2 border-dark-border'
                      }`}
                    >
                      <div className="font-bold text-sm mb-1">Ridermex B</div>
                      <div className="text-xs opacity-80">Contado</div>
                    </motion.button>

                    {/* Ridermex C */}
                    <motion.button
                      onClick={() => {
                        updateInvestment({
                          ridermexProductType: 'C',
                          certificateBasePrice: 100000,
                          initialPayment: 100000,
                          ridermexDownPaymentAmount: 100000,
                          ridermexFinancingMonths: 0,
                          ridermexFirstMonthlyIncome: 1,
                          annualProfit: 12,
                          investorAnnualReturn: 12
                        });
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-xl text-center transition-all ${
                        investment.ridermexProductType === 'C'
                          ? 'bg-amber-600 text-white shadow-lg ring-2 ring-amber-400'
                          : 'bg-dark-card text-neutral-200 hover:bg-amber-50 border-2 border-dark-border'
                      }`}
                    >
                      <div className="font-bold text-sm mb-1">Ridermex C</div>
                      <div className="text-xs opacity-80">Agencia</div>
                    </motion.button>
                  </div>
                </div>

                <div className="mt-4">
                  <EscalonSelector
                    selectedEscalon={selectedEscalon}
                    onEscalonChange={handleEscalonChange}
                    compact={true}
                    theme="dark"
                  />
                </div>

                {/* Rest of general section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    className="bg-dark-surface rounded-2xl p-6 shadow-lg border-2 border-dark-border"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-600 rounded-xl">
                        <Hash className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-neutral-100">Número de Tickets de Inversión</h3>
                        <p className="text-sm text-neutral-400">Ajusta la cantidad de Tickets de Inversión</p>
                      </div>
                    </div>
        <div className="mb-4">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {customCertificates} Tickets de Inversión
          </div>
          <div className="text-lg text-neutral-400">
            {formatCurrency(customCertificates * investment.certificateBasePrice)}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {[1, 3, 5, 10, 15, 20].map((preset) => (
            <motion.button
              key={preset}
              onClick={() => handleCertificatesChange(preset)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                customCertificates === preset
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
              }`}
            >
              {preset}
            </motion.button>
          ))}
        </div>

        <input
          type="range"
          min="1"
          max="50"
          step="1"
          value={customCertificates}
          onChange={(e) => handleCertificatesChange(Number(e.target.value))}
          className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer slider-thumb-blue"
        />
        <div className="flex justify-between text-xs text-neutral-400 mt-2">
          <span>1</span>
          <span>50</span>
        </div>
        <div className="mt-4">
          <input
            type="number"
            min="1"
            max="100"
            value={customCertificates}
            onChange={(e) => handleCertificatesChange(Number(e.target.value))}
            className="w-full px-4 py-2 border-2 border-blue-500 rounded-lg text-center text-xl font-semibold text-blue-400 focus:border-blue-500 focus:outline-none"
            placeholder="Cantidad personalizada"
          />
        </div>
      </motion.div>

      <motion.div
        className="bg-dark-surface rounded-2xl p-6 shadow-lg border-2 border-dark-border"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-green-600 rounded-xl">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-100">Plazo de Inversión</h3>
            <p className="text-sm text-neutral-400">Periodo en años</p>
          </div>
        </div>
        <div className="mb-4">
          <div className="text-4xl font-bold text-green-600 mb-2">
            {investment.years} años
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {[5, 10, 15, 20, 25].map((preset) => (
            <motion.button
              key={preset}
              onClick={() => handleSliderChange('years', preset)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                investment.years === preset
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {preset}
            </motion.button>
          ))}
        </div>

        <input
          type="range"
          min="5"
          max="30"
          step="1"
          value={investment.years}
          onChange={(e) => handleSliderChange('years', Number(e.target.value))}
          className="w-full h-3 bg-green-200 rounded-lg appearance-none cursor-pointer slider-thumb-green"
        />
        <div className="flex justify-between text-xs text-neutral-400 mt-2">
          <span>5 años</span>
          <span>30 años</span>
        </div>
      </motion.div>

      <motion.div
        className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl p-6 shadow-lg border-2 border-purple-500/30"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-purple-600 rounded-xl">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-100">Escenario de Producción</h3>
            <p className="text-sm text-neutral-400">Selecciona un escenario</p>
          </div>
        </div>
        <div className="space-y-3">
          {scenarioPresets.map((preset) => {
            const isSelected =
              investment.ridermexMotosMonth === preset.motos_mes &&
              investment.ridermexUtilityPerMoto === preset.utilidad;

            return (
              <motion.button
                key={preset.label}
                onClick={() => handleScenarioPreset(preset.motos_mes, preset.utilidad)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? `${preset.buttonColor} text-white border-transparent shadow-lg scale-105`
                    : `bg-dark-card ${preset.textColor} ${preset.borderColor} hover:scale-102`
                }`}
                whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="font-bold text-lg mb-1">{preset.label}</div>
                <div className={`text-sm ${isSelected ? 'text-white/90' : 'text-neutral-400'}`}>
                  {preset.motos_mes} motos/mes
                </div>
                <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-neutral-400'}`}>
                  ${preset.utilidad}/moto
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        className="bg-dark-surface rounded-2xl p-6 shadow-lg border-2 border-dark-border"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-orange-600 rounded-xl">
            <Percent className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-100">Retiro de Utilidades</h3>
            <p className="text-sm text-neutral-400">Porcentaje a retirar</p>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl font-bold text-orange-600">
              {investment.cashOutPercentage}%
            </div>
            {investment.partialCashOut && investment.cashOutPercentage > 0 && (
              <div className="px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded-full animate-pulse">
                ACTIVO
              </div>
            )}
            {!investment.partialCashOut && (
              <div className="px-3 py-1 bg-gray-400 text-white text-xs font-bold rounded-full">
                INACTIVO
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-neutral-200 mb-2">Porcentaje Fijo:</p>
            <div className="flex flex-wrap gap-2">
              {[0, 10, 20, 30, 50, 75, 100].map((preset) => (
                <motion.button
                  key={preset}
                  onClick={() => {
                    setDefaultYearlyCashOutPercentage(preset);
                    if (preset > 0 && !investment.partialCashOut) {
                      updateInvestment({ partialCashOut: true });
                    } else if (preset === 0 && investment.partialCashOut) {
                      updateInvestment({ partialCashOut: false });
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    investment.cashOutPercentage === preset
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  }`}
                >
                  {preset}%
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-neutral-200 mb-2">Patrones Predefinidos:</p>
            <div className="grid grid-cols-2 gap-2">
              <motion.button
                onClick={handleCreateIncreasingPattern}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 text-green-800 rounded-lg text-xs font-semibold transition-all shadow-sm"
              >
                <TrendingUp className="w-4 h-4" />
                Creciente
              </motion.button>

              <motion.button
                onClick={handleCreateDecreasingPattern}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 text-red-800 rounded-lg text-xs font-semibold transition-all shadow-sm"
              >
                <TrendingDown className="w-4 h-4" />
                Decreciente
              </motion.button>

              <motion.button
                onClick={handleCreateBellCurvePattern}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-800 rounded-lg text-xs font-semibold transition-all shadow-sm"
              >
                <Waves className="w-4 h-4" />
                Campana
              </motion.button>

              <motion.button
                onClick={handleCreateRetirementPattern}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-800 rounded-lg text-xs font-semibold transition-all shadow-sm"
              >
                <Activity className="w-4 h-4" />
                Retiro
              </motion.button>
            </div>
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={investment.cashOutPercentage}
          onChange={(e) => {
            const newPercentage = Number(e.target.value);
            setDefaultYearlyCashOutPercentage(newPercentage);

            if (newPercentage > 0 && !investment.partialCashOut) {
              updateInvestment({ partialCashOut: true });
            } else if (newPercentage === 0 && investment.partialCashOut) {
              updateInvestment({ partialCashOut: false });
            }
          }}
          className="w-full h-3 bg-orange-200 rounded-lg appearance-none cursor-pointer slider-thumb-orange"
        />
        <div className="flex justify-between text-xs text-neutral-400 mt-2">
          <span>0%</span>
          <span>100%</span>
        </div>
      </motion.div>

      <motion.div
        className="md:col-span-2 bg-dark-surface rounded-2xl p-6 shadow-lg border-2 border-dark-border"
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-cyan-600 rounded-xl">
            <Receipt className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-100">Costo del Ticket de Inversión</h3>
            <p className="text-sm text-neutral-400">Ajusta el precio base por Ticket de Inversión</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <div className="text-4xl font-bold text-cyan-600 mb-2">
                {formatCurrency(localCertificatePrice)}
              </div>
              <div className="text-sm text-neutral-400">
                Total: {formatCurrency(customCertificates * localCertificatePrice)} para {customCertificates} Ticket de Inversión{customCertificates !== 1 ? 's' : ''}
              </div>
            </div>
            <input
              type="range"
              min="250000"
              max="350000"
              step="5000"
              value={localCertificatePrice}
              onChange={(e) => {
                const newPrice = Number(e.target.value);
                handleCertificatePriceChange(newPrice);
              }}
              onMouseUp={(e) => {
                handleCertificatePriceCommit(Number((e.target as HTMLInputElement).value));
              }}
              onTouchEnd={(e) => {
                handleCertificatePriceCommit(Number((e.target as HTMLInputElement).value));
              }}
              className="w-full h-3 bg-cyan-200 rounded-lg appearance-none cursor-pointer slider-thumb-cyan"
            />
            <div className="flex justify-between text-xs text-neutral-400 mt-2">
              <span>$250,000</span>
              <span>$350,000</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-full">
              <label className="block text-sm font-semibold text-neutral-200 mb-2">
                Precio personalizado:
              </label>
              <input
                type="number"
                min="250000"
                max="350000"
                step="1000"
                value={localCertificatePrice}
                onChange={(e) => {
                  const newPrice = Number(e.target.value);
                  handleCertificatePriceChange(newPrice);
                }}
                onBlur={(e) => {
                  const newPrice = Number(e.target.value);
                  handleCertificatePriceCommit(newPrice);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const newPrice = Number((e.target as HTMLInputElement).value);
                    handleCertificatePriceCommit(newPrice);
                    (e.target as HTMLInputElement).blur();
                  }
                }}
                className="w-full px-4 py-3 border-2 border-cyan-300 rounded-lg text-xl font-semibold text-cyan-700 focus:border-cyan-500 focus:outline-none text-center"
                placeholder="Ingresa el precio"
              />
              <div className="mt-2 text-xs text-neutral-400 text-center">
                Rango: $250,000 - $350,000 • Presiona Enter para aplicar
              </div>
            </div>
          </div>
        </div>
      </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="md:col-span-2 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-2xl shadow-lg border-2 border-indigo-500/30 overflow-hidden"
        whileHover={{ scale: 1.01 }}
      >
        <button
          onClick={() => setIsInvestorGoalsExpanded(!isInvestorGoalsExpanded)}
          className="w-full p-6 flex items-center justify-between hover:bg-indigo-100/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-xl">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-neutral-100">Meta del Inversionista</h3>
              <p className="text-sm text-neutral-400">Define tu objetivo de ingresos y plazo</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isInvestorGoalsExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-6 h-6 text-indigo-600" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isInvestorGoalsExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t-2 border-indigo-500/30"
            >
              <div className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-dark-card/70 p-4 rounded-xl border border-indigo-500/30">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-semibold text-neutral-100">Ingreso Mensual Meta</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="text-3xl font-bold text-indigo-600">
                        {formatCurrency(investment.investorMonthlyGoal || 0)}
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="500000"
                        step="10000"
                        value={investment.investorMonthlyGoal || 0}
                        onChange={(e) => updateInvestment({ investorMonthlyGoal: Number(e.target.value) })}
                        className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-neutral-400">
                        <span>$0</span>
                        <span>$500K</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[25000, 50000, 100000, 250000].map((preset) => (
                          <button
                            key={preset}
                            onClick={() => updateInvestment({ investorMonthlyGoal: preset })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              investment.investorMonthlyGoal === preset
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                            }`}
                          >
                            ${(preset / 1000).toFixed(0)}K
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-dark-card/70 p-4 rounded-xl border border-indigo-500/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-semibold text-neutral-100">Plazo de Inversión</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="text-3xl font-bold text-indigo-600">
                        {investment.investorTimeframe || investment.years} años
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="30"
                        step="1"
                        value={investment.investorTimeframe || investment.years}
                        onChange={(e) => {
                          const years = Number(e.target.value);
                          updateInvestment({
                            investorTimeframe: years,
                            years: years
                          });
                        }}
                        className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-neutral-400">
                        <span>5 años</span>
                        <span>30 años</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[10, 15, 20, 25].map((preset) => (
                          <button
                            key={preset}
                            onClick={() => updateInvestment({
                              investorTimeframe: preset,
                              years: preset
                            })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              (investment.investorTimeframe || investment.years) === preset
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                            }`}
                          >
                            {preset} años
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {investment.investorMonthlyGoal && investment.investorMonthlyGoal > 0 && results && (
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-xl text-white">
                    <div className="flex items-start gap-3">
                      <Award className="w-6 h-6 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-bold mb-2">Análisis de Meta</h4>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-indigo-200 mb-1">Ingreso Actual</p>
                            <p className="text-xl font-bold">{formatCurrency(results.finalMonthlyIncome)}</p>
                          </div>
                          <div>
                            <p className="text-indigo-200 mb-1">Tu Meta</p>
                            <p className="text-xl font-bold">{formatCurrency(investment.investorMonthlyGoal)}</p>
                          </div>
                          <div>
                            <p className="text-indigo-200 mb-1">Estado</p>
                            <div className="flex items-center gap-2">
                              {results.finalMonthlyIncome >= investment.investorMonthlyGoal ? (
                                <>
                                  <Check className="w-5 h-5 text-green-300" />
                                  <span className="text-xl font-bold text-green-300">¡Meta Alcanzada!</span>
                                </>
                              ) : (
                                <>
                                  <TrendingUp className="w-5 h-5 text-yellow-300" />
                                  <span className="text-xl font-bold text-yellow-300">
                                    {((results.finalMonthlyIncome / investment.investorMonthlyGoal) * 100).toFixed(0)}% de tu meta
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {investment.investorMonthlyGoal && investment.investorMonthlyGoal > 0 && (
                  <div className="bg-dark-card/70 p-4 rounded-xl border border-indigo-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-semibold text-neutral-100">Tickets de Inversión Requeridos</h4>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-indigo-600 mb-1">
                        {calculateRequiredCertificates(investment.investorMonthlyGoal)}
                      </div>
                      <div className="text-sm text-neutral-400">
                        Tickets de Inversión necesarios para alcanzar tu meta
                      </div>
                      <div className="mt-3 text-sm text-neutral-200">
                        <strong>Inversión total:</strong> {formatCurrency(calculateRequiredCertificates(investment.investorMonthlyGoal) * investment.certificateBasePrice)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="md:col-span-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <AlternativeInvestmentsCard />
      </motion.div>

      {investment.ridermexProductType === 'A' && (
        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <AmortizationTable />
        </motion.div>
      )}
      </div>

      {results && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="md:col-span-2 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl p-8 shadow-2xl text-white"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-4 bg-dark-card/20 rounded-xl backdrop-blur">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Proyección Final</h3>
              <p className="text-emerald-100">Patrimonio al final del periodo</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-dark-card/10 backdrop-blur rounded-xl p-6">
              <div className="text-sm text-emerald-100 mb-3 font-medium">Tickets de Inversión Iniciales</div>
              <div className="text-4xl font-bold mb-2">
                {results.certificatesSummary.initialCertificates.toLocaleString('es-MX')}
              </div>
              <div className="text-xs text-emerald-200">
                Inversión inicial
              </div>
            </div>
            <div className="bg-dark-card/10 backdrop-blur rounded-xl p-6">
              <div className="text-sm text-emerald-100 mb-3 font-medium">Tickets de Inversión Finales</div>
              <div className="text-4xl font-bold mb-2">
                {results.certificatesSummary.totalCertificates.toLocaleString('es-MX')}
              </div>
              <div className="text-xs text-emerald-200">
                {results.certificatesSummary.fromReinvestment} por reinversión
              </div>
            </div>
            <div className="bg-dark-card/10 backdrop-blur rounded-xl p-6">
              <div className="text-sm text-emerald-100 mb-3 font-medium">Ingreso Mensual</div>
              <div className="text-4xl font-bold mb-2">
                ${results.finalMonthlyIncome.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs text-emerald-200">
                Al final del periodo
              </div>
            </div>
            <div className="bg-dark-card/10 backdrop-blur rounded-xl p-6">
              <div className="text-sm text-emerald-100 mb-3 font-medium">Patrimonio Total</div>
              <div className="text-4xl font-bold mb-2">
                ${results.finalPatrimony.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs text-emerald-200">
                Valor acumulado
              </div>
            </div>
            <div className="bg-dark-card/10 backdrop-blur rounded-xl p-6">
              <div className="text-sm text-emerald-100 mb-3 font-medium">Utilidades Totales</div>
              <div className="text-4xl font-bold mb-2">
                ${results.totalProfit.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs text-emerald-200">
                Ganancias generadas
              </div>
            </div>
            <div className="bg-dark-card/10 backdrop-blur rounded-xl p-6">
              <div className="text-sm text-emerald-100 mb-3 font-medium">Retorno Estimado Total</div>
              <div className="text-4xl font-bold mb-2">
                {results.roi.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}%
              </div>
              <div className="text-xs text-emerald-200">
                Retorno de inversión
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {results && (
        <>
          {/* Comparación Final */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-2xl p-8 shadow-lg border-2 border-blue-500/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-100 whitespace-nowrap">Comparación Final - Año {investment.years}</h3>
                <p className="text-sm sm:text-base text-neutral-400">Patrimonio acumulado al final del periodo</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Mi Inversión */}
              <motion.div
                className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedInvestmentDetail('cosecha')}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5" />
                  <h4 className="font-bold text-lg">{investmentLabel}</h4>
                </div>
                <div className="text-3xl font-bold mb-2">
                  ${results.yearlyData[results.yearlyData.length - 1].citrusPatrimony.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </div>
                <div className="text-sm opacity-90">
                  Retorno Estimado: {results.roi.toFixed(1)}%
                </div>
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="text-xs opacity-75">Click para ver detalles</div>
                </div>
              </motion.div>

              {/* CETES */}
              <motion.div
                className="bg-dark-card rounded-xl p-6 border-2 border-blue-500/30 shadow-lg cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedInvestmentDetail('cetes')}
              >
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <h4 className="font-bold text-lg text-neutral-50">CETES</h4>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ${results.yearlyData[results.yearlyData.length - 1].cetesPatrimony.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-neutral-400">
                  Retorno Estimado: {((results.yearlyData[results.yearlyData.length - 1].cetesPatrimony / investment.initialPayment - 1) * 100).toFixed(1)}%
                </div>
                <div className="mt-3 pt-3 border-t border-dark-border">
                  <div className="text-xs text-blue-600 font-semibold">
                    Click para ver detalles
                  </div>
                </div>
              </motion.div>

              {/* Bienes Raíces */}
              <motion.div
                className="bg-dark-card rounded-xl p-6 border-2 border-orange-500/30 shadow-lg cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedInvestmentDetail('realEstate')}
              >
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                  <h4 className="font-bold text-lg text-neutral-50">Bienes Raíces</h4>
                </div>
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  ${results.yearlyData[results.yearlyData.length - 1].realEstatePatrimony.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-neutral-400">
                  Retorno Estimado: {((results.yearlyData[results.yearlyData.length - 1].realEstatePatrimony / investment.initialPayment - 1) * 100).toFixed(1)}%
                </div>
                <div className="mt-3 pt-3 border-t border-dark-border">
                  <div className="text-xs text-orange-600 font-semibold">
                    Click para ver detalles
                  </div>
                </div>
              </motion.div>

              {/* Ahorro */}
              <motion.div
                className="bg-dark-card rounded-xl p-6 border-2 border-purple-500/30 shadow-lg cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedInvestmentDetail('savings')}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Receipt className="w-5 h-5 text-purple-600" />
                  <h4 className="font-bold text-lg text-neutral-50">Ahorro</h4>
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  ${results.yearlyData[results.yearlyData.length - 1].savingsPatrimony.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-neutral-400">
                  Retorno Estimado: 0%
                </div>
                <div className="mt-3 pt-3 border-t border-dark-border">
                  <div className="text-xs text-purple-600 font-semibold">
                    Click para ver detalles
                  </div>
                </div>
              </motion.div>

              {/* Inversión Personalizada */}
              <motion.div
                className="bg-dark-card rounded-xl p-6 border-2 border-pink-500/30 shadow-lg cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedInvestmentDetail('custom')}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-pink-600" />
                  <h4 className="font-bold text-lg text-neutral-50">{investment.customInvestmentName || 'Mi Inversión'}</h4>
                </div>
                <div className="text-3xl font-bold text-pink-600 mb-2">
                  ${results.yearlyData[results.yearlyData.length - 1].customInvestmentPatrimony.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-neutral-400">
                  Retorno Estimado: {((results.yearlyData[results.yearlyData.length - 1].customInvestmentPatrimony / investment.initialPayment - 1) * 100).toFixed(1)}%
                </div>
                <div className="mt-3 pt-3 border-t border-dark-border">
                  <div className="text-xs text-pink-600 font-semibold">
                    Click para ver detalles
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Diferencia en dinero */}
            <div className="mt-6 bg-dark-card rounded-xl p-6 border-2 border-green-500/30">
              <h4 className="font-bold text-lg text-neutral-50 mb-4 text-center">
                Ventaja de {investmentLabel} sobre otras inversiones
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-sm text-neutral-400 mb-1">vs CETES</div>
                  <div className="text-2xl font-bold text-green-600">
                    +${(results.yearlyData[results.yearlyData.length - 1].citrusPatrimony - results.yearlyData[results.yearlyData.length - 1].cetesPatrimony).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-neutral-400 mb-1">vs Bienes Raíces</div>
                  <div className="text-2xl font-bold text-green-600">
                    +${(results.yearlyData[results.yearlyData.length - 1].citrusPatrimony - results.yearlyData[results.yearlyData.length - 1].realEstatePatrimony).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-neutral-400 mb-1">vs Ahorro</div>
                  <div className="text-2xl font-bold text-green-600">
                    +${(results.yearlyData[results.yearlyData.length - 1].citrusPatrimony - results.yearlyData[results.yearlyData.length - 1].savingsPatrimony).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-neutral-400 mb-1">vs {investment.customInvestmentName || 'Mi Inversión'}</div>
                  <div className="text-2xl font-bold text-green-600">
                    +${(results.yearlyData[results.yearlyData.length - 1].citrusPatrimony - results.yearlyData[results.yearlyData.length - 1].customInvestmentPatrimony).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Gráfica Comparativa de Patrimonio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 bg-dark-card rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-600/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-neutral-100">Evolución del Patrimonio</h3>
                <p className="text-neutral-400">Comparación de inversiones durante {investment.years} años</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={results.yearlyData}>
                <defs>
                  <linearGradient id="colorCitrus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorCetes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorRealEstate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorCustom" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="year"
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  label={{ value: 'Años', position: 'insideBottom', offset: -5, fill: '#6b7280' }}
                />
                <YAxis
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                  label={{ value: 'Patrimonio', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
                />
                <Tooltip
                  formatter={(value: number) => `$${value.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="citrusPatrimony"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCitrus)"
                  name={investmentLabel}
                />
                <Area
                  type="monotone"
                  dataKey="cetesPatrimony"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCetes)"
                  name="CETES"
                />
                <Area
                  type="monotone"
                  dataKey="realEstatePatrimony"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRealEstate)"
                  name="Bienes Raíces"
                />
                <Area
                  type="monotone"
                  dataKey="savingsPatrimony"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSavings)"
                  name="Ahorro"
                />
                <Area
                  type="monotone"
                  dataKey="customInvestmentPatrimony"
                  stroke="#ec4899"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCustom)"
                  name={investment.customInvestmentName || 'Mi Inversión'}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </>
      )}

      {/* Modal para información del asesor */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowExportModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-card rounded-2xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-600/20 rounded-xl">
                    {exportFormat === 'pdf' ? (
                      <Download className="w-6 h-6 text-blue-600" />
                    ) : (
                      <FileText className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-100">
                      Información del Asesor
                    </h3>
                    <p className="text-sm text-neutral-400">
                      Exportar como {exportFormat?.toUpperCase()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="p-2 hover:bg-dark-surface rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-200 mb-2">
                    Tipo de Reporte *
                  </label>
                  <select
                    value={selectedReport}
                    onChange={(e) => setSelectedReport(e.target.value as ReportType)}
                    className="w-full px-4 py-3 border-2 border-dark-border rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-dark-card"
                  >
                    <option value="ridermex">Reporte RiderMex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-200 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={advisorInfo.name}
                    onChange={(e) => setAdvisorInfo({ ...advisorInfo, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-dark-border rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-200 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={advisorInfo.email}
                    onChange={(e) => setAdvisorInfo({ ...advisorInfo, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-dark-border rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="juan@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-200 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={advisorInfo.phone}
                    onChange={(e) => setAdvisorInfo({ ...advisorInfo, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-dark-border rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="+52 123 456 7890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-200 mb-2">
                    Empresa *
                  </label>
                  <input
                    type="text"
                    value={advisorInfo.company}
                    onChange={(e) => setAdvisorInfo({ ...advisorInfo, company: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-dark-border rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Cosecha Capital"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowExportModal(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isGenerating}
                  className="flex-1 px-6 py-3 border-2 border-dark-border text-neutral-200 font-semibold rounded-xl hover:bg-dark-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  onClick={(e) => handleGenerateReport(e as any)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!advisorInfo.name || !advisorInfo.email || !advisorInfo.phone || !advisorInfo.company || isGenerating}
                  type="button"
                  className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                    advisorInfo.name && advisorInfo.email && advisorInfo.phone && advisorInfo.company && !isGenerating
                      ? exportFormat === 'pdf'
                        ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:shadow-lg'
                        : 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:shadow-lg'
                      : 'bg-dark-border text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generando...</span>
                    </>
                  ) : (
                    'Generar Reporte'
                  )}
                </motion.button>
              </div>

              <p className="mt-4 text-xs text-neutral-400 text-center">
                * Todos los campos son obligatorios
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Detalles de Inversión */}
      <AnimatePresence>
        {selectedInvestmentDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedInvestmentDetail(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className={`bg-gradient-to-r ${
                investmentDetails[selectedInvestmentDetail as keyof typeof investmentDetails].color === 'green' ? 'from-green-500 to-emerald-600' :
                investmentDetails[selectedInvestmentDetail as keyof typeof investmentDetails].color === 'blue' ? 'from-blue-500 to-cyan-600' :
                investmentDetails[selectedInvestmentDetail as keyof typeof investmentDetails].color === 'orange' ? 'from-orange-500 to-amber-600' :
                investmentDetails[selectedInvestmentDetail as keyof typeof investmentDetails].color === 'purple' ? 'from-purple-500 to-pink-600' :
                'from-pink-500 to-rose-600'
              } text-white p-8 rounded-t-2xl relative`}>
                <button
                  onClick={() => setSelectedInvestmentDetail(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-dark-card/20 hover:bg-dark-card/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <h2 className="text-3xl font-bold mb-2">
                  {investmentDetails[selectedInvestmentDetail as keyof typeof investmentDetails].title}
                </h2>
                <p className="text-white/90">Análisis completo de ventajas y desventajas</p>
              </div>

              <div className="p-8">
                {/* Calificación Total */}
                <div className="mb-8 bg-gradient-to-br from-amber-900/20 to-yellow-900/20 rounded-2xl p-6 border-2 border-amber-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-100 mb-2">Calificación Total Objetiva</h3>
                      <p className="text-sm text-neutral-400">Promedio de 9 criterios fundamentales</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="#e5e7eb"
                            strokeWidth="8"
                            fill="none"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="#f59e0b"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${(parseFloat(calculateOverallScore(selectedInvestmentDetail)) / 10) * 251.2} 251.2`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-amber-600">
                              {calculateOverallScore(selectedInvestmentDetail)}
                            </div>
                            <div className="text-xs text-neutral-400">/ 10</div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs font-semibold text-amber-600">
                        {parseFloat(calculateOverallScore(selectedInvestmentDetail)) >= 8.5 ? 'EXCELENTE' :
                         parseFloat(calculateOverallScore(selectedInvestmentDetail)) >= 7 ? 'MUY BUENO' :
                         parseFloat(calculateOverallScore(selectedInvestmentDetail)) >= 6 ? 'BUENO' :
                         parseFloat(calculateOverallScore(selectedInvestmentDetail)) >= 5 ? 'ACEPTABLE' :
                         'BAJO'}
                      </div>
                    </div>
                  </div>

                  {/* Calificaciones por Criterio */}
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {Object.entries(criteriaScores[selectedInvestmentDetail as keyof typeof criteriaScores]).map(([key, value]) => (
                      <div key={key} className="bg-dark-card rounded-lg p-3 border border-dark-border">
                        <div className="text-xs text-neutral-400 mb-1">{value.label}</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full transition-all"
                              style={{ width: `${(value.score / 10) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-sm font-bold text-amber-600 w-6">{value.score}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-neutral-400">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span>Estas calificaciones se basan en análisis objetivo del mercado y características de cada inversión</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Ventajas */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Check className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-neutral-100">Ventajas</h3>
                    </div>
                    <div className="space-y-3">
                      {investmentDetails[selectedInvestmentDetail as keyof typeof investmentDetails].advantages.map((advantage, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start gap-3 p-4 bg-green-900/20 rounded-lg border border-green-500/30"
                        >
                          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-neutral-200 text-sm leading-relaxed">{advantage}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Desventajas */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                        <X className="w-6 h-6 text-red-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-neutral-100">Desventajas</h3>
                    </div>
                    <div className="space-y-3">
                      {investmentDetails[selectedInvestmentDetail as keyof typeof investmentDetails].disadvantages.map((disadvantage, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start gap-3 p-4 bg-red-900/20 rounded-lg border border-red-500/30"
                        >
                          <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <X className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-neutral-200 text-sm leading-relaxed">{disadvantage}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-dark-border">
                  <motion.button
                    onClick={() => setSelectedInvestmentDetail(null)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                  >
                    Cerrar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveDashboard;
