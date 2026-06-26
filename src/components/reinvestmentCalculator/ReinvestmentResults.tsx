import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ChevronLeft, TrendingUp, DollarSign, Target, BarChart3, Download, FileText, Zap, Users, Calendar, Percent, Calculator, Activity, Play, ArrowRight, Sparkles, Star, Crown, Trophy, Rocket, X, Globe, PieChart, FileDown, Info } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useCalculator } from '../../context/CalculatorContext';
import { formatCurrency, convertFromMXN, formatPaybackPeriod } from '../../utils/formatters';
import AnimatedNumberDisplay from '../ui/AnimatedNumberDisplay';
import ExcelTableV5 from '../ExcelTableV5';
import { generateSpecializedHTMLReport, generateSpecializedPDFReport, ReportType } from '../../utils/htmlReportGenerator';
import { generateCompoundInterestData, generateAvalancheTimeline, calculateCompoundInterestComparison, calculateInvestmentComparison } from '../../utils/compoundInterestUtils';
import { MetricExplanationModal } from './MetricExplanationModal';

interface ReinvestmentResultsProps {
  onPrevious: () => void;
}

const ReinvestmentResults: React.FC<ReinvestmentResultsProps> = ({ onPrevious }) => {
  const { investment, results } = useCalculator();
  const [activeTab, setActiveTab] = useState<'summary' | 'multiplier' | 'charts' | 'table' | 'roi'>('summary');
  const [showAvalanche, setShowAvalanche] = useState(false);
  const [showReportSelector, setShowReportSelector] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'html' | 'pdf'>('html');
  const [advisorInfo, setAdvisorInfo] = useState({
    advisorName: investment.executiveName || '',
    advisorPhone: investment.executivePhone || '55 1000 0604',
    advisorEmail: investment.executiveEmail || 'informacion@ridermex.com'
  });
  const [activeExplanation, setActiveExplanation] = useState<string | null>(null);
  const [showRealMetrics, setShowRealMetrics] = useState(false);
  const [patrimonyChartType, setPatrimonyChartType] = useState<'line' | 'area' | 'bar' | 'pie'>('area');
  const [incomeChartType, setIncomeChartType] = useState<'line' | 'area' | 'bar' | 'pie'>('bar');
  const [wealthChartType, setWealthChartType] = useState<'line' | 'area' | 'bar' | 'pie'>('area');
  const [comparisonChartType, setComparisonChartType] = useState<'line' | 'area' | 'bar' | 'pie'>('bar');
  const [growthChartType, setGrowthChartType] = useState<'line' | 'area' | 'bar' | 'pie'>('bar');

  // Investment label is always Ridermex now
  const investmentLabel = 'Ridermex';

  if (!results) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-green/30 border-t-neon-green rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-300 font-medium">Calculando resultados...</p>
        </div>
      </div>
    );
  }

  const reportTypes = [
    {
      id: 'ridermex' as ReportType,
      title: 'Reporte RiderMex',
      description: 'Análisis completo de inversión en RiderMex con métricas clave y proyecciones',
      icon: Award,
      color: 'from-red-500 to-orange-600',
      features: ['Inversión Inicial', 'Patrimonio Final', 'Ganancia Total', 'Rentabilidad', 'Información del Escenario', 'Datos del Asesor']
    }
  ];

  const handleGenerateReport = (reportType: ReportType, format: 'html' | 'pdf' = selectedFormat) => {
    if (!advisorInfo.advisorName.trim()) {
      alert('Por favor ingresa el nombre del asesor');
      return;
    }

    try {
      if (format === 'pdf') {
        generateSpecializedPDFReport(investment, results, {
          ...advisorInfo,
          clientName: investment.investorName,
          reportType
        });
      } else {
        generateSpecializedHTMLReport(investment, results, {
          ...advisorInfo,
          clientName: investment.investorName,
          reportType
        });
      }
      
      setShowReportSelector(false);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error al generar el reporte HTML. Por favor intenta de nuevo.');
    }
  };

  const tabs = [
    { id: 'summary', title: 'Resumen', icon: Award, description: 'Resultados principales' },
    { id: 'multiplier', title: 'Multiplicador', icon: Zap, description: 'Efecto Avalancha y comparación' },
    { id: 'charts', title: 'Gráficos', icon: BarChart3, description: 'Visualizaciones' },
    { id: 'table', title: 'Evolución', icon: FileText, description: 'Tabla detallada año por año' },
    { id: 'roi', title: 'ROI Calculator', icon: Calculator, description: 'Comparación interactiva' }
  ];

  const renderSummaryTab = () => (
    <div className="space-y-8">
      {/* Key Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          className="bg-gradient-to-br from-neon-green/10 to-neon-green/20 p-6 rounded-xl border border-neon-green/30 relative cursor-pointer hover:ring-2 hover:ring-neon-green/50 transition-all"
          onClick={() => setActiveExplanation('certificados-finales')}
        >
          <Info className="w-4 h-4 text-neon-green/50 absolute top-4 right-4" />
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-neon-green/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-neon-green" />
            </div>
            <h4 className="font-medium text-neutral-50">Certificados Finales Proyectados</h4>
          </div>
          <p className="text-3xl font-bold text-neon-green mb-1">
            <AnimatedNumberDisplay
              value={results.certificatesSummary.totalCertificates}
              currencyFormat="MXN"
              duration={1.2}
              staggerDelay={0.08}
              isCurrency={false}
            />
          </p>
          <p className="text-sm text-neon-green/70">
            +{results.certificatesSummary.fromReinvestment} proyectados por reinversión
          </p>
        </div>

        <div 
          className="bg-gradient-to-br from-neon-red/10 to-neon-red/20 p-6 rounded-xl border border-neon-red/30 relative cursor-pointer hover:ring-2 hover:ring-neon-red/50 transition-all"
          onClick={() => setActiveExplanation('ingreso-mensual')}
        >
          <Info className="w-4 h-4 text-neon-red/50 absolute top-4 right-4" />
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-neon-red/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-neon-red" />
            </div>
            <h4 className="font-medium text-neutral-50">Ingreso Mensual Proyectado</h4>
          </div>
          <p className="text-3xl font-bold text-neon-red mb-1">
            <AnimatedNumberDisplay
              value={convertFromMXN(results.finalMonthlyIncome, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR)}
              currencyFormat={investment.currencyFormat}
              duration={1.4}
              staggerDelay={0.1}
            />
          </p>
          <p className="text-sm text-neon-red/70">proyectado al año {investment.years}</p>
        </div>

        <div 
          className="bg-gradient-to-br from-purple-500/10 to-purple-500/20 p-6 rounded-xl border border-purple-500/30 relative cursor-pointer hover:ring-2 hover:ring-purple-400/50 transition-all"
          onClick={() => setActiveExplanation('patrimonio-final')}
        >
          <Info className="w-4 h-4 text-purple-400/50 absolute top-4 right-4" />
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <h4 className="font-medium text-neutral-50">Patrimonio Final Proyectado</h4>
          </div>
          <p className="text-3xl font-bold text-purple-400 mb-1">
            <AnimatedNumberDisplay
              value={convertFromMXN(results.finalPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR)}
              currencyFormat={investment.currencyFormat}
              duration={1.6}
              staggerDelay={0.12}
            />
          </p>
          <p className="text-sm text-purple-400/70">valor total proyectado</p>
        </div>

        <div 
          className="bg-gradient-to-br from-neon-green/10 to-neon-green/20 p-6 rounded-xl border border-neon-green/30 relative cursor-pointer hover:ring-2 hover:ring-neon-green/50 transition-all"
          onClick={() => setActiveExplanation('multiplicador')}
        >
          <Info className="w-4 h-4 text-neon-green/50 absolute top-4 right-4" />
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-neon-green/20 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-neon-green" />
            </div>
            <h4 className="font-medium text-neutral-50">Multiplicador Proyectado</h4>
          </div>
          <p className="text-3xl font-bold text-neon-green mb-1">
            <AnimatedNumberDisplay
              value={results.capitalMultiplier}
              currencyFormat="MXN"
              duration={1.2}
              staggerDelay={0.08}
              isCurrency={false}
              decimals={1}
            />x
          </p>
          <p className="text-sm text-neon-green/70">crecimiento proyectado</p>
        </div>
      </div>

      {/* Investment Comparison Cards */}
      <div className="bg-slate-700/50 rounded-2xl p-6 shadow-lg border border-slate-600/50">
        <h3 className="text-lg font-semibold text-neutral-50 mb-4 text-center">
          Comparación Proyectada de Valor Final (Año {investment.years})
        </h3>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <div 
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-all relative cursor-pointer"
            onClick={() => setActiveExplanation('comparativa-ridermex')}
          >
            <Info className="w-4 h-4 text-white/50 absolute top-3 right-3" />
            <div className="text-sm font-medium mb-2 opacity-90">{investmentLabel}</div>
            <div className="text-2xl font-bold mb-1">
              {formatCurrency(
                convertFromMXN(results.finalPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR),
                investment.currencyFormat
              )}
            </div>
            <div className="text-xs opacity-80">Valor Proyectado</div>
            
            {investment.reinvestProfits && results.yearlyData?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/20">
                <div className="text-[10px] opacity-90 mb-0.5">Total pagado desde rendimientos</div>
                <div className="text-sm font-bold">
                  +{formatCurrency(
                    convertFromMXN(results.yearlyData[results.yearlyData.length - 1].cumulativeReinvestmentContribution, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR),
                    investment.currencyFormat
                  )}
                </div>
              </div>
            )}

            {!investment.reinvestProfits && results.yearlyData?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/20">
                <div className="text-[10px] opacity-90 mb-0.5">Rendimiento Acumulado</div>
                <div className="text-sm font-bold">
                  +{formatCurrency(
                    convertFromMXN(results.yearlyData[results.yearlyData.length - 1].cumulativeTotalUtility, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR),
                    investment.currencyFormat
                  )}
                </div>
              </div>
            )}
          </div>

          <div 
            className="bg-gradient-to-br from-neon-red/10 to-neon-red/20 rounded-xl p-4 border border-neon-red/30 flex flex-col justify-between relative cursor-pointer hover:ring-2 hover:ring-neon-red/50 transition-all"
            onClick={() => setActiveExplanation('comparativa-cetes')}
          >
            <Info className="w-4 h-4 text-neon-red/50 absolute top-3 right-3" />
            <div>
              <div className="text-sm font-medium mb-2 text-neon-red">CETES</div>
              <div className="text-2xl font-bold mb-1 text-neon-red/80">
                {formatCurrency(
                  convertFromMXN(
                    !investment.reinvestProfits ? (investment.ridermexProductType === 'B' || investment.ridermexProductType === 'D' ? investment.initialCertificates * investment.certificateBasePrice : investment.initialPayment) : results.cetesPatrimony, 
                    investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR
                  ),
                  investment.currencyFormat
                )}
              </div>
              <div className="text-xs text-neon-red/60">{!investment.reinvestProfits ? 'Valor de Inversión' : 'Valor Proyectado'}</div>
            </div>
            
            {!investment.reinvestProfits && (
              <div className="mt-3 pt-3 border-t border-neon-red/20">
                <div className="text-[10px] text-neon-red/70 mb-0.5">Rendimiento Acumulado</div>
                <div className="text-sm font-bold text-neon-red/90">
                  +{formatCurrency(
                    convertFromMXN(results.cetesPatrimony - (investment.ridermexProductType === 'B' || investment.ridermexProductType === 'D' ? investment.initialCertificates * investment.certificateBasePrice : investment.initialPayment), investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR),
                    investment.currencyFormat
                  )}
                </div>
              </div>
            )}
          </div>

          <div 
            className="bg-gradient-to-br from-purple-500/10 to-purple-500/20 rounded-xl p-4 border border-purple-500/30 flex flex-col justify-between relative cursor-pointer hover:ring-2 hover:ring-purple-400/50 transition-all"
            onClick={() => setActiveExplanation('comparativa-ahorro')}
          >
            <Info className="w-4 h-4 text-purple-400/50 absolute top-3 right-3" />
            <div>
              <div className="text-sm font-medium mb-2 text-purple-400">Ahorro Tradicional</div>
              <div className="text-2xl font-bold mb-1 text-purple-400/80">
                {formatCurrency(
                  convertFromMXN(
                    !investment.reinvestProfits ? (investment.ridermexProductType === 'B' || investment.ridermexProductType === 'D' ? investment.initialCertificates * investment.certificateBasePrice : investment.initialPayment) : results.savingsPatrimony, 
                    investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR
                  ),
                  investment.currencyFormat
                )}
              </div>
              <div className="text-xs text-purple-400/60">{!investment.reinvestProfits ? 'Valor de Inversión' : 'Valor Proyectado'}</div>
            </div>

            {!investment.reinvestProfits && (
              <div className="mt-3 pt-3 border-t border-purple-500/20">
                <div className="text-[10px] text-purple-400/70 mb-0.5">Rendimiento Acumulado</div>
                <div className="text-sm font-bold text-purple-400/90">
                  +{formatCurrency(
                    convertFromMXN(results.savingsPatrimony - (investment.ridermexProductType === 'B' || investment.ridermexProductType === 'D' ? investment.initialCertificates * investment.certificateBasePrice : investment.initialPayment), investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR),
                    investment.currencyFormat
                  )}
                </div>
              </div>
            )}
          </div>

          <div 
            className="bg-gradient-to-br from-neon-green/10 to-neon-green/20 rounded-xl p-4 border border-neon-green/30 flex flex-col justify-between relative cursor-pointer hover:ring-2 hover:ring-neon-green/50 transition-all"
            onClick={() => setActiveExplanation('comparativa-bienes-raices')}
          >
            <Info className="w-4 h-4 text-neon-green/50 absolute top-3 right-3" />
            <div>
              <div className="text-sm font-medium mb-2 text-neon-green">Bienes Raíces</div>
              <div className="text-2xl font-bold mb-1 text-neon-green/80">
                {formatCurrency(
                  convertFromMXN(
                    !investment.reinvestProfits ? (investment.ridermexProductType === 'B' || investment.ridermexProductType === 'D' ? investment.initialCertificates * investment.certificateBasePrice : investment.initialPayment) : results.realEstatePatrimony, 
                    investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR
                  ),
                  investment.currencyFormat
                )}
              </div>
              <div className="text-xs text-neon-green/60">{!investment.reinvestProfits ? 'Valor de Inversión' : 'Valor Proyectado'}</div>
            </div>

            {!investment.reinvestProfits && (
              <div className="mt-3 pt-3 border-t border-neon-green/20">
                <div className="text-[10px] text-neon-green/70 mb-0.5">Rendimiento Acumulado</div>
                <div className="text-sm font-bold text-neon-green/90">
                  +{formatCurrency(
                    convertFromMXN(results.realEstatePatrimony - (investment.ridermexProductType === 'B' || investment.ridermexProductType === 'D' ? investment.initialCertificates * investment.certificateBasePrice : investment.initialPayment), investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR),
                    investment.currencyFormat
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ventaja de Mi Inversión */}
        <div className="mt-4 bg-neon-green/10 border border-neon-green/30 rounded-lg p-4">
          <div className="flex items-center justify-center gap-2 text-neon-green">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold">
              Ventaja {investmentLabel}: {' '}
              {formatCurrency(
                convertFromMXN(
                  results.finalPatrimony - Math.max(results.cetesPatrimony, results.savingsPatrimony, results.realEstatePatrimony),
                  investment.currencyFormat,
                  investment.exchangeRate,
                  investment.exchangeRateEUR
                ),
                investment.currencyFormat
              )}
              {' '}más que la mejor alternativa
            </span>
          </div>
        </div>
      </div>

      {/* Multiplicador Impact */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-8 text-white text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Zap className="w-8 h-8" />
          <h3 className="text-2xl font-bold">Poder Proyectado del Multiplicador</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            className="relative cursor-pointer hover:bg-white/5 p-4 rounded-xl transition-colors"
            onClick={() => setActiveExplanation('multiplicador')}
          >
            <Info className="w-4 h-4 text-purple-200/50 absolute top-2 right-2" />
            <div className="text-4xl font-bold mb-2">
              <AnimatedNumberDisplay
                value={results.certificatesSummary.totalCertificates / investment.initialCertificates}
                currencyFormat="MXN"
                duration={1.2}
                staggerDelay={0.08}
                isCurrency={false}
                decimals={1}
              />x
            </div>
            <div className="text-purple-100">Multiplicador Proyectado de Activos</div>
            <div className="text-sm text-purple-200 mt-1">
              De {investment.initialCertificates} a {results.certificatesSummary.totalCertificates} certificados proyectados
            </div>
          </div>

          <div>
            <div className="text-4xl font-bold mb-2">
              <AnimatedNumberDisplay
                value={results.capitalMultiplier}
                currencyFormat="MXN"
                duration={1.2}
                staggerDelay={0.08}
                isCurrency={false}
                decimals={1}
              />x
            </div>
            <div className="text-purple-100">Multiplicador Proyectado de Patrimonio</div>
            <div className="text-sm text-purple-200 mt-1">
              Crecimiento total proyectado de tu inversión
            </div>
          </div>

          <div>
            <div className="text-4xl font-bold mb-2">
              +{results.certificatesSummary.fromReinvestment}
            </div>
            <div className="text-purple-100">Certificados Proyectados por Reinversión</div>
            <div className="text-sm text-purple-200 mt-1">
              Adquiridos proyectados por reinversión
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-slate-700/50 rounded-2xl shadow-lg p-6 border border-slate-600/50">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h4 className="text-xl font-semibold text-neutral-50 mb-2 sm:mb-0">Métricas Proyectadas de Rendimiento</h4>
          <button
            onClick={() => setShowRealMetrics(!showRealMetrics)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${
              showRealMetrics 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                : 'bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700'
            }`}
          >
            {showRealMetrics ? <Sparkles className="w-3 h-3" /> : null}
            {showRealMetrics ? 'Mostrando Valor Presente' : 'A Valor Presente'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            className="text-center p-4 bg-neon-red/10 rounded-xl border border-neon-red/30 relative cursor-pointer hover:ring-2 hover:ring-neon-red/50 transition-all"
            onClick={() => setActiveExplanation('cagr')}
          >
            <Info className="w-4 h-4 text-neon-red/50 absolute top-3 right-3" />
            <div className="text-sm text-neon-red mb-1">CAGR Proyectado</div>
            <div className="text-2xl font-bold text-neon-red/80 mb-1">
              {(showRealMetrics ? (((1 + results.cagr / 100) / (1 + investment.inflationRate / 100) - 1) * 100) : results.cagr).toFixed(1)}%
            </div>
            <div className="text-xs text-neon-red/60">Crecimiento anual compuesto {showRealMetrics ? 'real' : 'proyectado'}</div>
          </div>

          <div 
            className="text-center p-4 bg-neon-green/10 rounded-xl border border-neon-green/30 relative cursor-pointer hover:ring-2 hover:ring-neon-green/50 transition-all"
            onClick={() => setActiveExplanation('tir')}
          >
            <Info className="w-4 h-4 text-neon-green/50 absolute top-3 right-3" />
            <div className="text-sm text-neon-green mb-1">TIR Proyectada</div>
            <div className="text-2xl font-bold text-neon-green/80 mb-1">
              {(showRealMetrics ? (((1 + results.irr / 100) / (1 + investment.inflationRate / 100) - 1) * 100) : results.irr).toFixed(1)}%
            </div>
            <div className="text-xs text-neon-green/60">Tasa interna de retorno {showRealMetrics ? 'real' : 'proyectada'}</div>
          </div>

          <div 
            className="text-center p-4 bg-purple-500/10 rounded-xl border border-purple-500/30 relative cursor-pointer hover:ring-2 hover:ring-purple-400/50 transition-all"
            onClick={() => setActiveExplanation('payback')}
          >
            <Info className="w-4 h-4 text-purple-400/50 absolute top-3 right-3" />
            <div className="text-sm text-purple-400 mb-1">Payback Proyectado</div>
            <div className="text-2xl font-bold text-purple-400/80 mb-1">
              {formatPaybackPeriod(results.paybackYear)}
            </div>
            <div className="text-xs text-purple-400/60">Año proyectado de recuperación</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMultiplierTab = () => {
    const comparisonData = calculateCompoundInterestComparison(
      investment,
      results
    );

    // Calculate initial investment for comparison
    const initialInvestment = investment.initialCertificates * investment.certificateBasePrice;
    const withReinvestmentGains = comparisonData.withReinvestment.patrimony - initialInvestment;
    const withoutReinvestmentGains = comparisonData.withoutReinvestment.patrimony - initialInvestment;

    return (
      <div className="space-y-8">
        <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-neutral-100 mb-4 text-center">Efecto Multiplicador</h3>
          <p className="text-neutral-400 text-center mb-8">
            Comparación del crecimiento con y sin reinversión
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              onClick={() => setActiveExplanation('sin-reinversion')}
              className="bg-gradient-to-br from-red-500/10 to-red-500/20 p-6 rounded-xl border border-red-500/30 cursor-pointer hover:from-red-500/15 hover:to-red-500/25 transition-all select-none hover:border-red-500/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-lg font-semibold text-neutral-100">Sin Reinversión</h4>
                <div className="p-1 rounded-full text-slate-400" title="¿Cómo se calcula esto?">
                  <Info className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-bold text-red-400">
                {formatCurrency(comparisonData.withoutReinvestment.patrimony, investment.currencyFormat)}
              </p>
              <p className="text-sm text-neutral-400 mt-2">
                Ganancias: {formatCurrency(withoutReinvestmentGains, investment.currencyFormat)}
              </p>
            </div>

            <div 
              onClick={() => setActiveExplanation('con-reinversion')}
              className="bg-gradient-to-br from-neon-green/10 to-neon-green/20 p-6 rounded-xl border border-neon-green/30 cursor-pointer hover:from-neon-green/15 hover:to-neon-green/25 transition-all select-none hover:border-neon-green/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-lg font-semibold text-neutral-100">Con Reinversión (Ridermex)</h4>
                <div className="p-1 rounded-full text-slate-400" title="¿Cómo se calcula esto?">
                  <Info className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-bold text-neon-green">
                {formatCurrency(comparisonData.withReinvestment.patrimony, investment.currencyFormat)}
              </p>
              <p className="text-sm text-neutral-400 mt-2">
                Ganancias: {formatCurrency(withReinvestmentGains, investment.currencyFormat)}
              </p>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-br from-blue-500/10 to-blue-500/20 p-6 rounded-xl border border-blue-500/30">
            <div className="text-center">
              <p className="text-neutral-300 mb-2">Multiplicador de Valor</p>
              <p className="text-5xl font-bold text-blue-400">
                {comparisonData.withReinvestment.multiplier.toFixed(2)}x
              </p>
              <p className="text-neutral-400 mt-2">
                Tu inversión crece {comparisonData.withReinvestment.multiplier.toFixed(2)} veces con reinversión
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderChartsTab = () => {
    const finalYear = results.yearlyData[results.yearlyData.length - 1];

    const initialInvestment = investment.ridermexProductType === 'B' || investment.ridermexProductType === 'D'
      ? investment.initialCertificates * investment.certificateBasePrice
      : investment.initialPayment;

    const convertValue = (val: number) => {
      return convertFromMXN(val, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR);
    };

    const barChartData = [
      {
        name: 'Costo Inicial del Ticket',
        value: convertValue(initialInvestment),
        color: '#007aff'
      },
      {
        name: 'Plusvalía Final',
        value: convertValue(Math.max(0, finalYear.citrusPatrimony - initialInvestment)),
        color: '#0dfc7b'
      },
      {
        name: 'Ingresos Acumulados',
        value: convertValue(finalYear.cumulativeTotalUtility),
        color: '#ff9f0a'
      }
    ];

    const twoBarChartData = [
      {
        name: 'Inversión Inicial',
        costo: convertValue(initialInvestment),
        plusvalia: 0,
        ingresos: 0
      },
      {
        name: 'Resultado Proyectado',
        costo: convertValue(initialInvestment),
        plusvalia: convertValue(Math.max(0, finalYear.citrusPatrimony - initialInvestment)),
        ingresos: convertValue(finalYear.cumulativeTotalUtility)
      }
    ];

    const isReinvest = investment.reinvestProfits;

    const patrimonyChartData = [
      {
        year: 'Año 0',
        ridermex: convertValue(initialInvestment),
        cetes: convertValue(initialInvestment),
        ahorro: convertValue(initialInvestment),
        bienesRaices: convertValue(initialInvestment)
      },
      ...results.yearlyData.map(year => {
        return {
          year: `Año ${year.year}`,
          ridermex: convertValue(year.citrusPatrimony),
          cetes: convertValue(isReinvest ? year.cetesPatrimony : initialInvestment),
          ahorro: convertValue(isReinvest ? year.savingsPatrimony : initialInvestment),
          bienesRaices: convertValue(isReinvest ? year.realEstatePatrimony : initialInvestment * Math.pow(1.05, year.year))
        };
      })
    ];

    const incomeChartData = results.yearlyData.map(year => ({
      year: `Año ${year.year}`,
      ridermex: convertValue(year.citrusIncome),
      cetes: convertValue(year.cetesIncome),
      ahorro: convertValue(year.savingsIncome),
      bienesRaices: convertValue(year.realEstateIncome),
      retiros: convertValue(year.partialCashOutAmount)
    }));

    // Calculate cumulative wealth (Asset + Accumulated yields)
    let cumulativeCashOut = 0;
    let cumulativeCetesIncome = 0;
    let cumulativeSavingsIncome = 0;
    let cumulativeRealEstateIncome = 0;

    const accumulatedWealthChartData = [
      {
        year: 'Año 0',
        ridermex: convertValue(initialInvestment),
        cetes: convertValue(initialInvestment),
        ahorro: convertValue(initialInvestment),
        bienesRaices: convertValue(initialInvestment)
      },
      ...results.yearlyData.map(year => {
        cumulativeCashOut += year.partialCashOutAmount;
        cumulativeCetesIncome += year.cetesIncome;
        cumulativeSavingsIncome += year.savingsIncome;
        cumulativeRealEstateIncome += year.realEstateIncome;

        const ridermexWealth = year.citrusPatrimony + year.availableCashFlow + cumulativeCashOut;
        
        const cetesWealth = isReinvest 
          ? year.cetesPatrimony 
          : initialInvestment + cumulativeCetesIncome;

        const savingsWealth = isReinvest 
          ? year.savingsPatrimony 
          : initialInvestment + cumulativeSavingsIncome;

        const bienesRaicesWealth = isReinvest 
          ? year.realEstatePatrimony 
          : (initialInvestment * Math.pow(1.05, year.year)) + cumulativeRealEstateIncome;

        return {
          year: `Año ${year.year}`,
          ridermex: convertValue(ridermexWealth),
          cetes: convertValue(cetesWealth),
          ahorro: convertValue(savingsWealth),
          bienesRaices: convertValue(isReinvest ? year.realEstatePatrimony : (initialInvestment * Math.pow(1.05, year.year)) + cumulativeRealEstateIncome)
        };
      })
    ];

    const currencyKey = investment.currencyFormat || 'MXN';
    const gridColor = '#475569';
    const axisColor = '#94a3b8';
    const textColor = '#cbd5e1';

    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-slate-955/85 border border-[#0dfc7b]/40 p-4 rounded-xl shadow-2xl backdrop-blur-xl transition-all duration-300">
            <p className="text-neutral-400 font-bold text-xs mb-2 border-b border-slate-800 pb-1.5">{label}</p>
            <div className="space-y-2">
              {payload.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-6 justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(13,252,123,0.3)]" style={{ backgroundColor: item.color || item.fill }} />
                    <span className="text-neutral-200 text-xs font-semibold">{item.name}</span>
                  </div>
                  <span className="text-neutral-50 text-xs font-bold" style={{ color: item.color || item.fill }}>
                    {formatCurrency(item.value, currencyKey)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      }
      return null;
    };

    const renderDynamicChart = (
      data: any[],
      keys: Array<{ key: string; name: string; color: string; gradientId: string; thickness?: number }>,
      chartType: 'line' | 'area' | 'bar' | 'pie'
    ) => {
      const gradients = (
        <defs>
          {/* Neon Glow Filter */}
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <linearGradient id="colorRidermex" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0dfc7b" stopOpacity={0.65}/>
            <stop offset="95%" stopColor="#0dfc7b" stopOpacity={0.05}/>
          </linearGradient>
          <linearGradient id="colorCetes" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff453a" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#ff453a" stopOpacity={0.0}/>
          </linearGradient>
          <linearGradient id="colorAhorro" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#bf5af2" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#bf5af2" stopOpacity={0.0}/>
          </linearGradient>
          <linearGradient id="colorBienesRaices" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#00e5ff" stopOpacity={0.0}/>
          </linearGradient>
          <linearGradient id="colorRetiros" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff9f0a" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#ff9f0a" stopOpacity={0.0}/>
          </linearGradient>
        </defs>
      );

      if (chartType === 'pie') {
        const lastPoint = data[data.length - 1];
        const pieData = keys.map(k => ({
          name: k.name,
          value: lastPoint[k.key] || 0,
          color: k.color
        })).filter(item => item.value > 0);

        return (
          <RechartsPieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={115}
              paddingAngle={4}
              dataKey="value"
              nameKey="name"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} content={() => (
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-xs font-semibold text-neutral-300">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span>{entry.name}</span>
                  </div>
                ))}
              </div>
            )} />
          </RechartsPieChart>
        );
      }

      if (chartType === 'area') {
        return (
          <AreaChart data={data} margin={{ top: 15, right: 15, left: 65, bottom: 15 }}>
            {gradients}
            <CartesianGrid strokeDasharray="4 4" stroke={gridColor} opacity={0.15} />
            <XAxis dataKey="year" stroke={axisColor} tick={{ fill: textColor, fontSize: 11 }} />
            <YAxis stroke={axisColor} tick={{ fill: textColor, fontSize: 11 }} tickFormatter={(value) => formatCurrency(value, currencyKey)} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Legend verticalAlign="bottom" height={36} content={({ payload }) => (
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-xs font-semibold text-neutral-300">
                {payload?.map((entry: any, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span>{entry.value}</span>
                  </div>
                ))}
              </div>
            )} />
            {keys.map(k => (
              <Area
                key={k.key}
                type="monotone"
                dataKey={k.key}
                stroke={k.color}
                strokeWidth={k.key === 'ridermex' ? 3.5 : 2}
                fill={`url(#${k.gradientId})`}
                name={k.name}
                {...(k.key === 'ridermex' ? { filter: 'url(#neonGlow)' } : {})}
              />
            ))}
          </AreaChart>
        );
      }

      if (chartType === 'bar') {
        return (
          <RechartsBarChart data={data} margin={{ top: 15, right: 15, left: 65, bottom: 15 }}>
            <CartesianGrid strokeDasharray="4 4" stroke={gridColor} opacity={0.15} />
            <XAxis dataKey="year" stroke={axisColor} tick={{ fill: textColor, fontSize: 11 }} />
            <YAxis stroke={axisColor} tick={{ fill: textColor, fontSize: 11 }} tickFormatter={(value) => formatCurrency(value, currencyKey)} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Legend verticalAlign="bottom" height={36} content={({ payload }) => (
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-xs font-semibold text-neutral-300">
                {payload?.map((entry: any, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span>{entry.value}</span>
                  </div>
                ))}
              </div>
            )} />
            {keys.map(k => (
              <Bar
                key={k.key}
                dataKey={k.key}
                fill={k.color}
                name={k.name}
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            ))}
          </RechartsBarChart>
        );
      }

      return (
        <LineChart data={data} margin={{ top: 15, right: 15, left: 65, bottom: 15 }}>
          {gradients}
          <CartesianGrid strokeDasharray="4 4" stroke={gridColor} opacity={0.15} />
          <XAxis dataKey="year" stroke={axisColor} tick={{ fill: textColor, fontSize: 11 }} />
          <YAxis stroke={axisColor} tick={{ fill: textColor, fontSize: 11 }} tickFormatter={(value) => formatCurrency(value, currencyKey)} />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Legend verticalAlign="bottom" height={36} content={({ payload }) => (
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-xs font-semibold text-neutral-300">
              {payload?.map((entry: any, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span>{entry.value}</span>
                </div>
              ))}
            </div>
          )} />
          {keys.map(k => (
            <Line
              key={k.key}
              type="monotone"
              dataKey={k.key}
              stroke={k.color}
              strokeWidth={k.key === 'ridermex' ? 3.5 : 2}
              name={k.name}
              dot={{ stroke: k.color, strokeWidth: k.key === 'ridermex' ? 2 : 1.5, r: k.key === 'ridermex' ? 4 : 3.5, fill: '#0f172a' }}
              activeDot={{ r: 6.5, strokeWidth: 0, fill: k.color }}
              {...(k.key === 'ridermex' ? { filter: 'url(#neonGlow)' } : {})}
            />
          ))}
        </LineChart>
      );
    };

    const patrimonyKeys = [
      { key: 'ridermex', name: 'Valor de Tickets + Plusvalía (Ridermex)', color: '#0dfc7b', gradientId: 'colorRidermex', thickness: 3 },
      { key: 'cetes', name: 'CETES', color: '#ff453a', gradientId: 'colorCetes' },
      { key: 'ahorro', name: 'Ahorro Bancario', color: '#bf5af2', gradientId: 'colorAhorro' },
      { key: 'bienesRaices', name: 'Bienes Raíces', color: '#00e5ff', gradientId: 'colorBienesRaices' }
    ];

    const incomeKeys = [
      { key: 'ridermex', name: 'Ingreso Anual (Ridermex)', color: '#0dfc7b', gradientId: 'colorRidermex', thickness: 3 },
      ...(!investment.reinvestProfits ? [
        { key: 'cetes', name: 'Rendimiento Anual CETES', color: '#ff453a', gradientId: 'colorCetes' },
        { key: 'ahorro', name: 'Rendimiento Anual Ahorro', color: '#bf5af2', gradientId: 'colorAhorro' },
        { key: 'bienesRaices', name: 'Rendimiento Anual Bienes Raíces', color: '#00e5ff', gradientId: 'colorBienesRaices' }
      ] : []),
      { key: 'retiros', name: 'Retiros Recibidos (Ridermex)', color: '#ff9f0a', gradientId: 'colorRetiros' }
    ];

    const wealthKeys = [
      { key: 'ridermex', name: 'Retorno Total (Ridermex)', color: '#0dfc7b', gradientId: 'colorRidermex', thickness: 3 },
      { key: 'cetes', name: 'Retorno Total CETES', color: '#ff453a', gradientId: 'colorCetes' },
      { key: 'ahorro', name: 'Retorno Total Ahorro', color: '#bf5af2', gradientId: 'colorAhorro' },
      { key: 'bienesRaices', name: 'Retorno Total Bienes Raíces', color: '#00e5ff', gradientId: 'colorBienesRaices' }
    ];

    const renderChartSwitcher = <T extends string>(
      currentType: T,
      setter: (type: T) => void,
      options: readonly T[] = ['line', 'area', 'bar'] as any
    ) => (
      <div className="flex bg-slate-955 p-1 rounded-xl border border-slate-800/60">
        {options.map((type) => (
          <button
            key={type}
            onClick={() => setter(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentType === type
                ? 'bg-slate-800 text-neon-green shadow-sm border border-slate-700/50'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {type === 'line' && <TrendingUp className="w-3.5 h-3.5" />}
            {type === 'area' && <Sparkles className="w-3.5 h-3.5" />}
            {type === 'bar' && <BarChart3 className="w-3.5 h-3.5" />}
            {type === 'pie' && <PieChart className="w-3.5 h-3.5" />}
            <span className="capitalize">
              {type === 'line' ? 'Línea' : type === 'area' ? 'Área' : type === 'bar' ? 'Barras' : 'Pastel'}
            </span>
          </button>
        ))}
      </div>
    );

    return (
      <div className="space-y-8 relative overflow-hidden">
        
        {/* Card 1 */}
        <div className="border border-slate-800/80 rounded-2xl shadow-2xl p-6 transition-all duration-500 hover:border-[#0dfc7b]/60 hover:shadow-[0_0_40px_rgba(13,252,123,0.18)] bg-black relative overflow-hidden z-10 group">
          {/* Background Image with Zoom on Hover */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none select-none transition-transform duration-1000 ease-out group-hover:scale-110"
            style={{ 
              backgroundImage: "url('/moto_bg_sport.png')", 
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
              opacity: 0.35
            }}
          />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h4 className="text-xl font-bold text-neutral-50 drop-shadow-sm">Evolución del Valor de Inversión + Plusvalía</h4>
              <p className="text-xs text-neutral-400">Proyección del valor patrimonial neto acumulado por año</p>
            </div>
            {renderChartSwitcher(patrimonyChartType, setPatrimonyChartType, ['line', 'area', 'bar', 'pie'] as const)}
          </div>
          <div className="relative z-10">
            <ResponsiveContainer width="100%" height={400}>
              {renderDynamicChart(patrimonyChartData, patrimonyKeys, patrimonyChartType)}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2 */}
        <div className="border border-slate-800/80 rounded-2xl shadow-2xl p-6 transition-all duration-500 hover:border-[#0dfc7b]/60 hover:shadow-[0_0_40px_rgba(13,252,123,0.18)] bg-black relative overflow-hidden z-10 group">
          {/* Background Image with Zoom on Hover */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none select-none transition-transform duration-1000 ease-out group-hover:scale-110"
            style={{ 
              backgroundImage: "url('/moto_bg_delivery.png')", 
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
              opacity: 0.35
            }}
          />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h4 className="text-xl font-bold text-neutral-50 drop-shadow-sm">Evolución del Ingreso</h4>
              <p className="text-xs text-neutral-400">Proyección del flujo de ingresos y retiros recibidos por año</p>
            </div>
            {renderChartSwitcher(incomeChartType, setIncomeChartType, ['line', 'area', 'bar', 'pie'] as const)}
          </div>
          <div className="relative z-10">
            <ResponsiveContainer width="100%" height={400}>
              {renderDynamicChart(incomeChartData, incomeKeys, incomeChartType)}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 3 */}
        <div className="border border-slate-800/80 rounded-2xl shadow-2xl p-6 transition-all duration-500 hover:border-[#0dfc7b]/60 hover:shadow-[0_0_40px_rgba(13,252,123,0.18)] bg-black relative overflow-hidden z-10 group">
          {/* Background Image with Zoom on Hover */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none select-none transition-transform duration-1000 ease-out group-hover:scale-110"
            style={{ 
              backgroundImage: "url('/moto_bg_dashboard.png')", 
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
              opacity: 0.35
            }}
          />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h4 className="text-xl font-bold text-neutral-50 drop-shadow-sm">Retorno Total Acumulado (Activo + Ingreso Acumulado)</h4>
              <p className="text-xs text-neutral-400">Suma total de valor de inversión e ingresos acumulados año con año</p>
            </div>
            {renderChartSwitcher(wealthChartType, setWealthChartType, ['line', 'area', 'bar', 'pie'] as const)}
          </div>
          <div className="relative z-10">
            <ResponsiveContainer width="100%" height={400}>
              {renderDynamicChart(accumulatedWealthChartData, wealthKeys, wealthChartType)}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 4 */}
        <div className="border border-slate-800/80 rounded-2xl shadow-2xl p-6 transition-all duration-500 hover:border-[#0dfc7b]/60 hover:shadow-[0_0_40px_rgba(13,252,123,0.18)] bg-black relative overflow-hidden z-10 group">
          {/* Background Image with Zoom on Hover */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none select-none transition-transform duration-1000 ease-out group-hover:scale-110"
            style={{ 
              backgroundImage: "url('/moto_bg_sport.png')", 
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
              opacity: 0.35
            }}
          />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h4 className="text-xl font-bold text-neutral-50 drop-shadow-sm">Comparativa de Resultados Finales</h4>
              <p className="text-xs text-neutral-400">Comparación de las métricas principales al final del período</p>
            </div>
            {renderChartSwitcher(comparisonChartType, setComparisonChartType, ['line', 'area', 'bar', 'pie'] as const)}
          </div>
          <div className="relative z-10">
            <ResponsiveContainer width="100%" height={400}>
              {comparisonChartType === 'pie' ? (
                <RechartsPieChart>
                  <Pie
                    data={barChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={115}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey="name"
                  >
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Legend verticalAlign="bottom" height={36} content={() => (
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-xs font-semibold text-neutral-300">
                      {barChartData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span>{entry.name}</span>
                        </div>
                      ))}
                    </div>
                  )} />
                </RechartsPieChart>
              ) : comparisonChartType === 'bar' ? (
                <RechartsBarChart data={barChartData} margin={{ top: 15, right: 15, left: 65, bottom: 15 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke={gridColor} opacity={0.15} />
                  <XAxis dataKey="name" stroke={axisColor} tick={{ fill: textColor, fontSize: 11 }} />
                  <YAxis stroke={axisColor} tick={{ fill: textColor, fontSize: 11 }} tickFormatter={(value) => formatCurrency(value, currencyKey)} />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              ) : comparisonChartType === 'area' ? (
                <AreaChart data={barChartData} margin={{ top: 15, right: 15, left: 65, bottom: 15 }}>
                  <defs>
                    <filter id="neonGlowComparison" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#007aff" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#007aff" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke={gridColor} opacity={0.15} />
                  <XAxis dataKey="name" stroke={axisColor} tick={{ fill: textColor, fontSize: 11 }} />
                  <YAxis stroke={axisColor} tick={{ fill: textColor, fontSize: 11 }} tickFormatter={(value) => formatCurrency(value, currencyKey)} />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Area type="monotone" dataKey="value" stroke="#007aff" strokeWidth={3.5} fill="url(#colorValue)" name="Monto" filter="url(#neonGlowComparison)" />
                </AreaChart>
              ) : (
                <LineChart data={barChartData} margin={{ top: 15, right: 15, left: 65, bottom: 15 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke={gridColor} opacity={0.15} />
                  <XAxis dataKey="name" stroke={axisColor} tick={{ fill: textColor, fontSize: 11 }} />
                  <YAxis stroke={axisColor} tick={{ fill: textColor, fontSize: 11 }} tickFormatter={(value) => formatCurrency(value, currencyKey)} />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Line type="monotone" dataKey="value" stroke="#007aff" strokeWidth={3.5} name="Monto" dot={{ stroke: '#007aff', strokeWidth: 2, r: 4, fill: '#0f172a' }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 5 */}
        <div className="border border-slate-800/80 rounded-2xl shadow-2xl p-6 transition-all duration-500 hover:border-[#0dfc7b]/60 hover:shadow-[0_0_40px_rgba(13,252,123,0.18)] bg-black relative overflow-hidden z-10 group">
          {/* Background Image with Zoom on Hover */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none select-none transition-transform duration-1000 ease-out group-hover:scale-110"
            style={{ 
              backgroundImage: "url('/moto_bg_dashboard.png')", 
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
              opacity: 0.35
            }}
          />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h4 className="text-xl font-bold text-neutral-50 drop-shadow-sm">Crecimiento de tu Capital (Inversión vs Retorno Total a {investment.years} Años)</h4>
              <p className="text-xs text-neutral-400">Comparativa de la inversión original frente al desglose de tu capital final acumulado durante un periodo de {investment.years} años</p>
            </div>
            {renderChartSwitcher(growthChartType, setGrowthChartType, ['line', 'area', 'bar', 'pie'] as const)}
          </div>
          <div className="relative z-10">
            <ResponsiveContainer width="100%" height={400}>
              {growthChartType === 'pie' ? (
                <RechartsPieChart>
                  <Pie
                    data={[
                      { name: 'Costo Inicial del Ticket', value: twoBarChartData[1].costo, color: '#007aff' },
                      { name: 'Plusvalía Final', value: twoBarChartData[1].plusvalia, color: '#0dfc7b' },
                      { name: 'Ingresos Acumulados', value: twoBarChartData[1].ingresos, color: '#ff9f0a' }
                    ].filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={115}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey="name"
                  >
                    {[
                      { name: 'Costo Inicial del Ticket', value: twoBarChartData[1].costo, color: '#007aff' },
                      { name: 'Plusvalía Final', value: twoBarChartData[1].plusvalia, color: '#0dfc7b' },
                      { name: 'Ingresos Acumulados', value: twoBarChartData[1].ingresos, color: '#ff9f0a' }
                    ].filter(item => item.value > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Legend verticalAlign="bottom" height={36} content={() => (
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-xs font-semibold text-neutral-300">
                      {[
                        { name: 'Costo Inicial del Ticket', value: twoBarChartData[1].costo, color: '#007aff' },
                        { name: 'Plusvalía Final', value: twoBarChartData[1].plusvalia, color: '#0dfc7b' },
                        { name: 'Ingresos Acumulados', value: twoBarChartData[1].ingresos, color: '#ff9f0a' }
                      ].filter(item => item.value > 0).map((entry, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span>{entry.name}</span>
                        </div>
                      ))}
                    </div>
                  )} />
                </RechartsPieChart>
              ) : growthChartType === 'bar' ? (
                <RechartsBarChart data={twoBarChartData} margin={{ top: 15, right: 15, left: 65, bottom: 15 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke={gridColor} opacity={0.15} />
                  <XAxis dataKey="name" stroke={axisColor} tick={{ fill: textColor, fontSize: 11 }} />
                  <YAxis stroke={axisColor} tick={{ fill: textColor, fontSize: 11 }} tickFormatter={(value) => formatCurrency(value, currencyKey)} />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Legend verticalAlign="bottom" height={36} content={({ payload }) => (
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-xs font-semibold text-neutral-300">
                      {payload?.map((entry: any, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span>{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  )} />
                  <Bar dataKey="costo" stackId="a" fill="#007aff" name="Costo Inicial del Ticket" radius={[0, 0, 0, 0]} barSize={50} />
                  <Bar dataKey="plusvalia" stackId="a" fill="#0dfc7b" name="Plusvalía Final" radius={[0, 0, 0, 0]} barSize={50} />
                  <Bar dataKey="ingresos" stackId="a" fill="#ff9f0a" name="Ingresos Acumulados" radius={[6, 6, 0, 0]} barSize={50} />
                </RechartsBarChart>
              ) : growthChartType === 'area' ? (
                <AreaChart data={twoBarChartData} margin={{ top: 15, right: 15, left: 65, bottom: 15 }}>
                  <defs>
                    <filter id="neonGlowGrowth" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <linearGradient id="colorCosto" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#007aff" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#007aff" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="colorPlusvalia" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0dfc7b" stopOpacity={0.65}/>
                      <stop offset="95%" stopColor="#0dfc7b" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff9f0a" stopOpacity={0.65}/>
                      <stop offset="95%" stopColor="#ff9f0a" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke={gridColor} opacity={0.15} />
                  <XAxis dataKey="name" stroke={axisColor} tick={{ fill: textColor, fontSize: 11 }} />
                  <YAxis stroke={axisColor} tick={{ fill: textColor, fontSize: 11 }} tickFormatter={(value) => formatCurrency(value, currencyKey)} />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Legend verticalAlign="bottom" height={36} content={({ payload }) => (
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-xs font-semibold text-neutral-300">
                      {payload?.map((entry: any, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span>{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  )} />
                  <Area type="monotone" dataKey="costo" stackId="a" stroke="#007aff" strokeWidth={2} fill="url(#colorCosto)" name="Costo Inicial del Ticket" />
                  <Area type="monotone" dataKey="plusvalia" stackId="a" stroke="#0dfc7b" strokeWidth={3.5} fill="url(#colorPlusvalia)" name="Plusvalía Final" filter="url(#neonGlowGrowth)" />
                  <Area type="monotone" dataKey="ingresos" stackId="a" stroke="#ff9f0a" strokeWidth={3.5} fill="url(#colorIngresos)" name="Ingresos Acumulados" filter="url(#neonGlowGrowth)" />
                </AreaChart>
              ) : (
                <LineChart data={twoBarChartData} margin={{ top: 15, right: 15, left: 65, bottom: 15 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke={gridColor} opacity={0.15} />
                  <XAxis dataKey="name" stroke={axisColor} tick={{ fill: textColor, fontSize: 11 }} />
                  <YAxis stroke={axisColor} tick={{ fill: textColor, fontSize: 11 }} tickFormatter={(value) => formatCurrency(value, currencyKey)} />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Legend verticalAlign="bottom" height={36} content={({ payload }) => (
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-xs font-semibold text-neutral-300">
                      {payload?.map((entry: any, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span>{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  )} />
                  <Line type="monotone" dataKey="costo" stroke="#007aff" strokeWidth={2.5} name="Costo Inicial del Ticket" dot={{ stroke: '#007aff', strokeWidth: 1.5, r: 3.5, fill: '#0f172a' }} />
                  <Line type="monotone" dataKey="plusvalia" stroke="#0dfc7b" strokeWidth={3.5} name="Plusvalía Final" dot={{ stroke: '#0dfc7b', strokeWidth: 2, r: 4, fill: '#0f172a' }} />
                  <Line type="monotone" dataKey="ingresos" stroke="#ff9f0a" strokeWidth={3.5} name="Ingresos Acumulados" dot={{ stroke: '#ff9f0a', strokeWidth: 2, r: 4, fill: '#0f172a' }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderTableTab = () => (
    <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl shadow-lg p-6">
      <ExcelTableV5 />
    </div>
  );

  const renderROITab = () => {
    const initialInvestment = investment.initialCertificates * investment.certificateBasePrice;
    const finalPatrimony = results.finalPatrimony;
    const totalGain = finalPatrimony - initialInvestment;
    const roiPercentage = results.roi;

    // Calculate comparative investments
    const finalYearData = results.yearlyData[results.yearlyData.length - 1];
    const cetesGain = finalYearData.cetesPatrimony - initialInvestment;
    const cetesROI = (cetesGain / initialInvestment) * 100;
    const savingsGain = finalYearData.savingsPatrimony - initialInvestment;
    const savingsROI = (savingsGain / initialInvestment) * 100;
    const realEstateGain = finalYearData.realEstatePatrimony - initialInvestment;
    const realEstateROI = (realEstateGain / initialInvestment) * 100;

    return (
      <div className="space-y-6">
        {/* Header con métricas principales */}
        <div className="bg-gradient-to-br from-neon-green/10 to-emerald-600/10 border border-neon-green/30 rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-neutral-100 mb-6 text-center">
            Retorno de Inversión Proyectado (ROI)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ROI Principal */}
            <div 
              className="bg-slate-700/50 rounded-xl p-6 text-center border border-neon-green/20 relative cursor-pointer hover:ring-2 hover:ring-neon-green/50 transition-all animate-fade-in"
              onClick={() => setActiveExplanation('roi')}
            >
              <Info className="w-4 h-4 text-neon-green/50 absolute top-4 right-4" />
              <div className="text-sm text-neutral-400 mb-2">ROI Total Proyectado</div>
              <div className="text-4xl font-bold text-neon-green mb-2">
                {roiPercentage.toFixed(2)}%
              </div>
              <div className="text-xs text-neutral-500">
                Retorno sobre inversión inicial
              </div>
            </div>

            {/* CAGR */}
            <div 
              className="bg-slate-700/50 rounded-xl p-6 text-center border border-blue-500/20 relative cursor-pointer hover:ring-2 hover:ring-blue-500/50 transition-all"
              onClick={() => setActiveExplanation('cagr')}
            >
              <Info className="w-4 h-4 text-blue-500/50 absolute top-4 right-4" />
              <div className="text-sm text-neutral-400 mb-2">CAGR</div>
              <div className="text-4xl font-bold text-blue-400 mb-2">
                {results.cagr.toFixed(2)}%
              </div>
              <div className="text-xs text-neutral-500">
                Tasa de crecimiento anual compuesto
              </div>
            </div>

            {/* Multiplicador */}
            <div 
              className="bg-slate-700/50 rounded-xl p-6 text-center border border-purple-500/20 relative cursor-pointer hover:ring-2 hover:ring-purple-500/50 transition-all"
              onClick={() => setActiveExplanation('multiplicador')}
            >
              <Info className="w-4 h-4 text-purple-500/50 absolute top-4 right-4" />
              <div className="text-sm text-neutral-400 mb-2">Multiplicador</div>
              <div className="text-4xl font-bold text-purple-400 mb-2">
                {results.capitalMultiplier.toFixed(2)}x
              </div>
              <div className="text-xs text-neutral-500">
                Tu capital se multiplica por
              </div>
            </div>
          </div>

          {/* Métricas adicionales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* IRR */}
            <div 
              className="bg-slate-700/50 rounded-xl p-6 border border-amber-500/20 relative cursor-pointer hover:ring-2 hover:ring-amber-500/50 transition-all"
              onClick={() => setActiveExplanation('tir')}
            >
              <div className="flex items-center justify-between mb-3 pr-6">
                <div className="text-sm text-neutral-400">Tasa Interna de Retorno (IRR)</div>
                <TrendingUp className="w-5 h-5 text-amber-400" />
              </div>
              <Info className="w-4 h-4 text-amber-500/50 absolute top-4 right-4" />
              <div className="text-3xl font-bold text-amber-400">
                {results.irr.toFixed(2)}%
              </div>
              <div className="text-xs text-neutral-500 mt-2">
                Tasa efectiva de retorno considerando flujos de efectivo
              </div>
            </div>

            {/* Payback Period */}
            <div 
              className="bg-slate-700/50 rounded-xl p-6 border border-rose-500/20 relative cursor-pointer hover:ring-2 hover:ring-rose-500/50 transition-all"
              onClick={() => setActiveExplanation('payback')}
            >
              <div className="flex items-center justify-between mb-3 pr-6">
                <div className="text-sm text-neutral-400">Periodo de Recuperación</div>
                <Calendar className="w-5 h-5 text-rose-400" />
              </div>
              <Info className="w-4 h-4 text-rose-500/50 absolute top-4 right-4" />
              <div className="text-3xl font-bold text-rose-400">
                {formatPaybackPeriod(results.paybackYear)}
              </div>
              <div className="text-xs text-neutral-500 mt-2">
                Tiempo para recuperar tu inversión inicial
              </div>
            </div>
          </div>
        </div>

        {/* Desglose de Inversión */}
        <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl p-6">
          <h4 className="text-xl font-semibold text-neutral-100 mb-6">Desglose Financiero</h4>

          <div className="space-y-4">
            {/* Inversión Inicial */}
            <div 
              className="flex justify-between items-center p-4 bg-dark-surface rounded-lg cursor-pointer hover:ring-2 hover:ring-neutral-500/50 transition-all relative group"
              onClick={() => setActiveExplanation('inversion-inicial')}
            >
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-neutral-400" />
                <span className="text-neutral-300">Inversión Inicial</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-neutral-100">
                  {formatCurrency(initialInvestment, investment.currencyFormat)}
                </span>
                <Info className="w-4 h-4 text-neutral-500/30 group-hover:text-neutral-400 transition-colors" />
              </div>
            </div>

            {/* Patrimonio Final */}
            <div 
              className="flex justify-between items-center p-4 bg-dark-surface rounded-lg cursor-pointer hover:ring-2 hover:ring-neon-green/50 transition-all relative group"
              onClick={() => setActiveExplanation('patrimonio-final')}
            >
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-neon-green" />
                <span className="text-neutral-300">Patrimonio Final</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-neon-green">
                  {formatCurrency(finalPatrimony, investment.currencyFormat)}
                </span>
                <Info className="w-4 h-4 text-neon-green/30 group-hover:text-neon-green/70 transition-colors" />
              </div>
            </div>

            {/* Ganancia Total */}
            <div 
              className="flex justify-between items-center p-4 bg-gradient-to-r from-neon-green/10 to-emerald-600/10 rounded-lg border border-neon-green/30 cursor-pointer hover:ring-2 hover:ring-neon-green/50 transition-all relative group"
              onClick={() => setActiveExplanation('ganancia-total')}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-neon-green" />
                <span className="text-neutral-100 font-semibold">Ganancia Total</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-neon-green">
                  {formatCurrency(totalGain, investment.currencyFormat)}
                </span>
                <Info className="w-4 h-4 text-neon-green/30 group-hover:text-neon-green/70 transition-colors" />
              </div>
            </div>

            {/* Ingreso Mensual Final */}
            <div 
              className="flex justify-between items-center p-4 bg-dark-surface rounded-lg cursor-pointer hover:ring-2 hover:ring-blue-500/50 transition-all relative group"
              onClick={() => setActiveExplanation('ingreso-mensual')}
            >
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-blue-400" />
                <span className="text-neutral-300">Ingreso Mensual Final</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-blue-400">
                  {formatCurrency(results.finalMonthlyIncome, investment.currencyFormat)}
                </span>
                <Info className="w-4 h-4 text-blue-400/30 group-hover:text-blue-400/70 transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Comparación con otras inversiones */}
        <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl p-6">
          <h4 className="text-xl font-semibold text-neutral-100 mb-6">Comparación de ROI Proyectado</h4>
          <p className="text-neutral-400 mb-6 text-sm">
            Compara el ROI Proyectado de Ridermex con otras opciones de inversión tradicionales
          </p>

          <div className="space-y-4">
            {/* Ridermex */}
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-neutral-300 font-medium">Ridermex (Reinversión)</span>
                <span className="text-neon-green font-bold">{roiPercentage.toFixed(2)}%</span>
              </div>
              <div className="h-8 bg-dark-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-neon-green to-emerald-600 rounded-full flex items-center justify-end pr-3"
                  style={{ width: '100%' }}
                >
                  <Rocket className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* CETES */}
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-neutral-300">CETES</span>
                <span className="text-blue-400 font-bold">{cetesROI.toFixed(2)}%</span>
              </div>
              <div className="h-8 bg-dark-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${Math.min((cetesROI / roiPercentage) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Ahorro Bancario */}
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-neutral-300">Ahorro Bancario</span>
                <span className="text-amber-400 font-bold">{savingsROI.toFixed(2)}%</span>
              </div>
              <div className="h-8 bg-dark-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${Math.min((savingsROI / roiPercentage) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Bienes Raíces */}
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-neutral-300">Bienes Raíces</span>
                <span className="text-purple-400 font-bold">{realEstateROI.toFixed(2)}%</span>
              </div>
              <div className="h-8 bg-dark-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${Math.min((realEstateROI / roiPercentage) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Ventaja Comparativa */}
          <div className="mt-6 p-4 bg-gradient-to-r from-neon-green/10 to-emerald-600/10 rounded-xl border border-neon-green/30">
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-neon-green mt-1 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold text-neutral-100 mb-1">Ventaja Competitiva</div>
                <div className="text-xs text-neutral-400">
                  Tu ROI Proyectado con Ridermex es <span className="text-neon-green font-bold">{(roiPercentage / cetesROI).toFixed(2)}x mayor</span> que CETES
                  y <span className="text-neon-green font-bold">{(roiPercentage / savingsROI).toFixed(2)}x mayor</span> que un ahorro bancario tradicional.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto"
    >
      <div className="bg-slate-700/50 rounded-3xl border border-slate-600/50 overflow-hidden">
        <div className="bg-gradient-to-r from-neon-green to-emerald-600 p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <img
                src="/rider_inversiones.png"
                alt={investmentLabel}
                className="h-24 w-auto drop-shadow-2xl"
              />
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Resultados de tu Inversión</h2>
                <p className="text-white/80 text-lg">Proyecciones del Certificado de Crecimiento Exponencial</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowReportSelector(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors border-2 border-white font-semibold"
              >
                <Globe className="w-5 h-5" />
                <span>Generar Reportes HTML</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-dark-surface border-b border-slate-600/50">
          <div className="px-8 py-4">
            <div className="flex bg-dark-surface rounded-lg p-1 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center justify-center gap-3 py-3 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-slate-700/50 shadow-sm border border-neon-green/30'
                        : 'hover:bg-slate-700/50/50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-neon-green' : 'text-neutral-400'}`} />
                    <div className="text-left">
                      <div className={activeTab === tab.id ? 'text-neutral-100' : 'text-neutral-400'}>{tab.title}</div>
                      <div className={`text-xs ${activeTab === tab.id ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        {tab.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'summary' && renderSummaryTab()}
            {activeTab === 'multiplier' && renderMultiplierTab()}
            {activeTab === 'charts' && renderChartsTab()}
            {activeTab === 'table' && renderTableTab()}
            {activeTab === 'roi' && renderROITab()}
          </motion.div>
        </div>

        {/* Navigation Footer */}
        <div className="p-8 bg-dark-surface border-t border-slate-600/50">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPrevious}
              className="px-8 py-4 bg-dark-border text-neutral-200 font-semibold rounded-2xl hover:bg-dark-border/50 transition-all duration-300 flex items-center gap-3"
            >
              <ChevronLeft className="w-6 h-6" />
              <span>Anterior</span>
            </motion.button>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setShowReportSelector(true)}
                className="flex items-center gap-2 px-6 py-3 bg-neon-red text-white rounded-lg hover:bg-neon-red/90 transition-colors font-semibold"
              >
                <Globe className="w-5 h-5" />
                <span>Seleccionar Reporte HTML</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Selector Modal */}
      {showReportSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-700/50 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-slate-600/50">
            <div className="bg-gradient-to-r from-neon-red to-rose-600 p-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Globe className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Selecciona tu Reporte HTML</h3>
                    <p className="text-white/80">Elige el tipo de reporte que mejor se adapte a tus necesidades</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReportSelector(false)}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Advisor Info */}
              <div className="bg-dark-surface rounded-2xl p-6 border border-slate-600/50">
                <h4 className="text-lg font-semibold text-neutral-50 mb-4">Información del Asesor</h4>

                {/* Format Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-200 mb-3">Formato del Reporte</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setSelectedFormat('html')}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedFormat === 'html'
                          ? 'border-neon-red bg-neon-red/10 text-neon-red shadow-md'
                          : 'border-slate-600/50 hover:border-neutral-400 text-neutral-400'
                      }`}
                    >
                      <Globe className="w-6 h-6" />
                      <div className="text-left">
                        <div className="font-semibold">HTML</div>
                        <div className="text-sm opacity-75">Archivo web interactivo</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setSelectedFormat('pdf')}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedFormat === 'pdf'
                          ? 'border-neon-green bg-neon-green/10 text-neon-green shadow-md'
                          : 'border-slate-600/50 hover:border-neutral-400 text-neutral-400'
                      }`}
                    >
                      <FileDown className="w-6 h-6" />
                      <div className="text-left">
                        <div className="font-semibold">PDF</div>
                        <div className="text-sm opacity-75">Documento imprimible</div>
                      </div>
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-200 mb-2">Nombre del Asesor</label>
                    <input
                      type="text"
                      value={advisorInfo.advisorName}
                      onChange={(e) => setAdvisorInfo(prev => ({ ...prev, advisorName: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-600/50 bg-dark-bg text-neutral-50 rounded-lg focus:ring-2 focus:ring-neon-red"
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-200 mb-2">Teléfono</label>
                    <input
                      type="tel"
                      value={advisorInfo.advisorPhone}
                      onChange={(e) => setAdvisorInfo(prev => ({ ...prev, advisorPhone: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-600/50 bg-dark-bg text-neutral-50 rounded-lg focus:ring-2 focus:ring-neon-red"
                      placeholder="55 1000 0604"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-200 mb-2">Email</label>
                    <input
                      type="email"
                      value={advisorInfo.advisorEmail}
                      onChange={(e) => setAdvisorInfo(prev => ({ ...prev, advisorEmail: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-600/50 bg-dark-bg text-neutral-50 rounded-lg focus:ring-2 focus:ring-neon-red"
                      placeholder="informacion@ridermex.com"
                    />
                  </div>
                </div>
              </div>

              {/* Report Types Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reportTypes.map((report) => {
                  const Icon = report.icon;
                  
                  return (
                    <motion.div
                      key={report.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-dark-surface rounded-2xl shadow-lg border-2 border-slate-600/50 hover:border-neon-red transition-all duration-300 overflow-hidden"
                    >
                      <div className={`bg-gradient-to-r ${report.color} p-6 text-white`}>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold">{report.title}</h4>
                            <p className="text-sm opacity-90">{report.description}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <h5 className="font-semibold text-neutral-50 mb-3">✨ Incluye:</h5>
                        <ul className="space-y-2 mb-6">
                          {report.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-neutral-300">
                              <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <button
                          onClick={() => handleGenerateReport(report.id, selectedFormat)}
                          className={`w-full py-3 px-4 bg-gradient-to-r ${report.color} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}
                        >
                          <Download className="w-5 h-5" />
                          <span>Generar {selectedFormat.toUpperCase()}</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-neon-red/10 to-neon-green/10 rounded-2xl p-6 border border-neon-red/30">
                <h4 className="text-lg font-semibold text-neutral-50 mb-4">🚀 Acciones Rápidas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleGenerateReport('existing-complete', selectedFormat)}
                    className="flex items-center gap-3 p-4 bg-dark-surface rounded-xl hover:shadow-md hover:border-neon-green border border-slate-600/50 transition-all duration-300"
                  >
                    <Crown className="w-8 h-8 text-neon-green" />
                    <div className="text-left">
                      <div className="font-semibold text-neutral-50">Reporte Recomendado</div>
                      <div className="text-sm text-neutral-300">Reporte completo original (más popular)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      reportTypes.forEach(report => {
                        setTimeout(() => handleGenerateReport(report.id, selectedFormat), Math.random() * 1000);
                      });
                    }}
                    className="flex items-center gap-3 p-4 bg-dark-surface rounded-xl hover:shadow-md hover:border-neon-red border border-slate-600/50 transition-all duration-300"
                  >
                    <PieChart className="w-8 h-8 text-neon-red" />
                    <div className="text-left">
                      <div className="font-semibold text-neutral-50">Todos los Reportes</div>
                      <div className="text-sm text-neutral-300">Descargar los 5 reportes en {selectedFormat.toUpperCase()}</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Avalanche Modal Fullscreen */}
      {showAvalanche && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50">
          <div className="h-full w-full bg-dark-bg">
            <AvalancheVisualizationCompact />
            <button
              onClick={() => setShowAvalanche(false)}
              className="fixed top-4 right-4 p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-xl z-50 flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              <span className="text-sm font-semibold">Cerrar</span>
            </button>
          </div>
        </div>
      )}

      {/* Metric Explanation Modal */}
      <MetricExplanationModal 
        isOpen={activeExplanation !== null}
        onClose={() => setActiveExplanation(null)}
        metricId={activeExplanation}
        investment={investment}
        results={results}
      />
    </motion.div>
  );
};

export default ReinvestmentResults;