import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ChevronLeft, TrendingUp, DollarSign, Target, BarChart3, Download, FileText, Zap, Calculator, X, Globe, PieChart, FileDown, Crown } from 'lucide-react';
import { LineChart, Line, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useCalculator } from '../../context/CalculatorContext';
import { formatCurrency, convertFromMXN, formatPaybackPeriod } from '../../utils/formatters';
import AnimatedNumberDisplay from '../ui/AnimatedNumberDisplay';
import ExcelTableV5 from '../ExcelTableV5';
import { DisclaimerBanner } from '../ui/DisclaimerBanner';
import { generateSpecializedHTMLReport, generateSpecializedPDFReport, ReportType } from '../../utils/htmlReportGenerator';
import { calculateCompoundInterestComparison } from '../../utils/compoundInterestUtils';

interface SimplifiedStep7ResultsProps {
  onPrevious: () => void;
}

const SimplifiedStep7Results: React.FC<SimplifiedStep7ResultsProps> = ({ onPrevious }) => {
  const { investment, results } = useCalculator();
  const [activeTab, setActiveTab] = useState<'summary' | 'multiplier' | 'charts' | 'table' | 'roi'>('summary');
  const [showAvalanche, setShowAvalanche] = useState(false);
  const [showReportSelector, setShowReportSelector] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'html' | 'pdf'>('html');
  const [advisorInfo, setAdvisorInfo] = useState({
    advisorName: investment.executiveName || '',
    advisorPhone: investment.executivePhone || '+52 55 1000 0615',
    advisorEmail: investment.executiveEmail || 'inversiones@ridernation.mx'
  });

  if (!results) {
    console.log('SimplifiedStep7Results: No results available', { investment });
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-8">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg mb-2">Calculando resultados...</p>
          <p className="text-gray-500 text-sm">Si este mensaje persiste, verifica los datos ingresados</p>
          <button
            onClick={onPrevious}
            className="mt-6 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Volver a revisar datos
          </button>
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
      alert('Error al generar el reporte. Por favor intenta de nuevo.');
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
        <div className="bg-dark-surface border border-neon-green/30 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-neon-green/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-neon-green" />
            </div>
            <h4 className="font-medium text-neutral-200">Certificados Finales Estimados</h4>
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
          <p className="text-sm text-neutral-400">
            +{results.certificatesSummary.fromReinvestment} estimados por reinversión
          </p>
        </div>

        <div className="bg-dark-surface border border-neon-red/30 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-neon-red/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-neon-red" />
            </div>
            <h4 className="font-medium text-neutral-200">Ingreso Mensual Estimado</h4>
          </div>
          <p className="text-3xl font-bold text-neon-red mb-1">
            <AnimatedNumberDisplay
              value={convertFromMXN(results.finalMonthlyIncome, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR)}
              currencyFormat={investment.currencyFormat}
              duration={1.4}
              staggerDelay={0.1}
            />
          </p>
          <p className="text-sm text-neutral-400">estimado al año {investment.years}</p>
        </div>

        <div className="bg-dark-surface border border-purple-400/30 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-400/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <h4 className="font-medium text-neutral-200">Patrimonio Final Estimado</h4>
          </div>
          <p className="text-3xl font-bold text-purple-400 mb-1">
            <AnimatedNumberDisplay
              value={convertFromMXN(results.finalPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR)}
              currencyFormat={investment.currencyFormat}
              duration={1.6}
              staggerDelay={0.12}
            />
          </p>
          <p className="text-sm text-neutral-400">valor total estimado</p>
        </div>

        <div className="bg-dark-surface border border-orange-400/30 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-400/20 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-400" />
            </div>
            <h4 className="font-medium text-neutral-200">Multiplicador Estimado</h4>
          </div>
          <p className="text-3xl font-bold text-orange-400 mb-1">
            <AnimatedNumberDisplay
              value={results.capitalMultiplier}
              currencyFormat="MXN"
              duration={1.2}
              staggerDelay={0.08}
              isCurrency={false}
            />x
          </p>
          <p className="text-sm text-neutral-400">crecimiento estimado</p>
        </div>
      </div>

      {/* Investment Comparison Cards */}
      <div className="bg-dark-card rounded-2xl p-6 shadow-lg border border-dark-border">
        <h3 className="text-lg font-semibold text-neutral-100 mb-4 text-center">
          Comparación Estimada de Valor Final (Año {investment.years})
        </h3>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {/* RiderNation */}
          <div className="bg-gradient-to-br from-neon-green/20 to-emerald-600/20 border border-neon-green/40 rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform">
            <div className="text-sm font-medium mb-2 text-neutral-200">RiderNation</div>
            <div className="text-2xl font-bold mb-1 text-neon-green">
              {formatCurrency(
                convertFromMXN(results.finalPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR),
                investment.currencyFormat
              )}
            </div>
            <div className="text-xs text-neutral-400">Valor Estimado</div>
          </div>

          <div className="bg-dark-surface rounded-xl p-4 border border-red-900/30">
            <div className="text-sm font-medium mb-2 text-neutral-300">CETES</div>
            <div className="text-2xl font-bold mb-1 text-red-400">
              {formatCurrency(
                convertFromMXN(results.cetesPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR),
                investment.currencyFormat
              )}
            </div>
            <div className="text-xs text-neutral-500">Valor Estimado</div>
          </div>

          <div className="bg-dark-surface rounded-xl p-4 border border-purple-900/30">
            <div className="text-sm font-medium mb-2 text-neutral-300">Ahorro Tradicional</div>
            <div className="text-2xl font-bold mb-1 text-purple-400">
              {formatCurrency(
                convertFromMXN(results.savingsPatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR),
                investment.currencyFormat
              )}
            </div>
            <div className="text-xs text-neutral-500">Valor Estimado</div>
          </div>

          <div className="bg-dark-surface rounded-xl p-4 border border-orange-900/30">
            <div className="text-sm font-medium mb-2 text-neutral-300">Bienes Raíces</div>
            <div className="text-2xl font-bold mb-1 text-orange-400">
              {formatCurrency(
                convertFromMXN(results.realEstatePatrimony, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR),
                investment.currencyFormat
              )}
            </div>
            <div className="text-xs text-neutral-500">Valor Estimado</div>
          </div>
        </div>

        {/* Ventaja de RiderNation */}
        <div className="mt-4 bg-neon-green/10 border border-neon-green/30 rounded-lg p-4">
          <DisclaimerBanner variant="compact" />
          <div className="flex items-center justify-center gap-2 text-neon-green">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold">
              Ventaja RiderNation: {' '}
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
      <div className="bg-gradient-to-r from-slate-700 to-slate-600 border border-purple-400/30 rounded-2xl p-8 text-white text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Zap className="w-8 h-8 text-purple-400" />
          <h3 className="text-2xl font-bold text-neutral-50">Poder Estimado del Multiplicador</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-4xl font-bold mb-2 text-purple-400">
              <AnimatedNumberDisplay
                value={results.certificatesSummary.totalCertificates / investment.initialCertificates}
                currencyFormat="MXN"
                duration={1.2}
                staggerDelay={0.08}
                isCurrency={false}
              />x
            </div>
            <div className="text-neutral-200">Multiplicador Estimado de Activos</div>
            <div className="text-sm text-neutral-400 mt-1">
              De {investment.initialCertificates} a {results.certificatesSummary.totalCertificates} certificados estimados
            </div>
          </div>

          <div>
            <div className="text-4xl font-bold mb-2 text-purple-400">
              <AnimatedNumberDisplay
                value={results.capitalMultiplier}
                currencyFormat="MXN"
                duration={1.2}
                staggerDelay={0.08}
                isCurrency={false}
              />x
            </div>
            <div className="text-neutral-200">Multiplicador Estimado de Patrimonio</div>
            <div className="text-sm text-neutral-400 mt-1">
              Crecimiento total estimado de tu inversión
            </div>
          </div>

          <div>
            <div className="text-4xl font-bold mb-2 text-purple-400">
              +{results.certificatesSummary.fromReinvestment}
            </div>
            <div className="text-neutral-200">Certificados Estimados por Reinversión</div>
            <div className="text-sm text-neutral-400 mt-1">
              Adquiridos estimados por reinversión
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-dark-card rounded-2xl shadow-lg p-6 border border-dark-border">
        <h4 className="text-xl font-semibold text-neutral-100 mb-6 text-center">Métricas Estimadas de Rendimiento</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-dark-surface border border-red-900/30 rounded-xl">
            <div className="text-sm text-neutral-300 mb-1">CAGR Estimado</div>
            <div className="text-2xl font-bold text-red-400 mb-1">
              {(results.cagr).toFixed(1)}%
            </div>
            <div className="text-xs text-neutral-400">Crecimiento anual compuesto estimado</div>
          </div>

          <div className="text-center p-4 bg-dark-surface border border-neon-green/30 rounded-xl">
            <div className="text-sm text-neutral-300 mb-1">TIR Estimada</div>
            <div className="text-2xl font-bold text-neon-green mb-1">
              {(results.irr).toFixed(1)}%
            </div>
            <div className="text-xs text-neutral-400">Tasa interna de retorno estimada</div>
          </div>

          <div className="text-center p-4 bg-dark-surface border border-purple-400/30 rounded-xl">
            <div className="text-sm text-neutral-300 mb-1">Payback Estimado</div>
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {formatPaybackPeriod(results.paybackYear)}
            </div>
            <div className="text-xs text-neutral-400">Año estimado de recuperación</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMultiplierTab = () => (
    <div className="space-y-8">
      <div className="bg-dark-card rounded-2xl p-8 shadow-lg border border-dark-border">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-neon-green mb-2">Efecto Avalancha</h3>
          <p className="text-neutral-400">Visualiza cómo tus certificados generan rendimientos compuestos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-neon-green/10 to-emerald-600/10 border border-neon-green/30 rounded-xl p-6">
            <div className="text-sm font-medium text-neutral-400 mb-2">Multiplicador Total</div>
            <div className="text-4xl font-bold text-neon-green">
              {results.capitalMultiplier.toFixed(2)}x
            </div>
            <div className="text-xs text-neutral-500 mt-2">Capital invertido se multiplica</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border border-blue-400/30 rounded-xl p-6">
            <div className="text-sm font-medium text-neutral-400 mb-2">CAGR</div>
            <div className="text-4xl font-bold text-blue-400">
              {(results.cagr).toFixed(1)}%
            </div>
            <div className="text-xs text-neutral-500 mt-2">Crecimiento anual compuesto</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-400/30 rounded-xl p-6">
            <div className="text-sm font-medium text-neutral-400 mb-2">ROI</div>
            <div className="text-4xl font-bold text-purple-400">
              {(results.roi * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-neutral-500 mt-2">Retorno total sobre inversión</div>
          </div>
        </div>

        <button
          onClick={() => setShowAvalanche(true)}
          className="w-full bg-gradient-to-r from-neon-green to-emerald-600 text-black font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-neon-green/50 transition-all"
        >
          <Zap className="w-4 h-4 inline mr-2" />
          Ver Detalles del Avalancha
        </button>
      </div>
    </div>
  );

  const renderChartsTab = () => {
    const finalYear = results.yearlyData[results.yearlyData.length - 1];

    // Calculate total patrimony including all investments
    const calculateTotalPatrimony = (year: typeof results.yearlyData[0]) => {
      return year.citrusPatrimony +
             year.cetesPatrimony +
             year.savingsPatrimony +
             year.realEstatePatrimony +
             (year.customInvestmentPatrimony || 0);
    };

    // Calculate total income from all sources
    const calculateTotalIncome = (year: typeof results.yearlyData[0]) => {
      return year.citrusIncome +
             year.cetesIncome +
             year.savingsIncome +
             year.realEstateIncome +
             (year.customInvestmentIncome || 0);
    };

    const patrimonyChartData = results.yearlyData.map(year => ({
      year: year.year,
      patrimonio: calculateTotalPatrimony(year),
      citricos: year.citrusPatrimony,
      cetes: year.cetesPatrimony
    }));

    const incomeChartData = results.yearlyData.map(year => ({
      year: year.year,
      ingreso: calculateTotalIncome(year),
      citricos: year.citrusIncome,
      retiros: year.partialCashOutAmount
    }));

    // Calculate cumulative cash out per year
    let cumulativeCashOut = 0;
    const cashFlowChartData = results.yearlyData.map(year => {
      cumulativeCashOut += year.partialCashOutAmount;
      return {
        year: year.year,
        efectivoAcumulado: cumulativeCashOut,
        fondoReinversion: year.reinvestmentFund
      };
    });

    return (
      <div className="space-y-8">
        <div className="bg-dark-card rounded-2xl shadow-lg p-6 border border-dark-border">
          <h4 className="text-xl font-semibold text-neutral-100 mb-6 text-center">Evolución del Patrimonio</h4>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={patrimonyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="year" stroke="#888" />
              <YAxis stroke="#888" tickFormatter={(value) => formatCurrency(value, investment.currency)} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                labelStyle={{ color: '#fff' }}
                formatter={(value: any) => formatCurrency(value, investment.currency)}
              />
              <Legend />
              <Line type="monotone" dataKey="patrimonio" stroke="#10b981" strokeWidth={3} name="Patrimonio Total" />
              <Line type="monotone" dataKey="citricos" stroke="#3b82f6" strokeWidth={2} name="Patrimonio" dot={false} />
              <Line type="monotone" dataKey="cetes" stroke="#f59e0b" strokeWidth={2} name="CETES" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-dark-card rounded-2xl shadow-lg p-6 border border-dark-border">
          <h4 className="text-xl font-semibold text-neutral-100 mb-6 text-center">Evolución del Ingreso</h4>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={incomeChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="year" stroke="#888" />
              <YAxis stroke="#888" tickFormatter={(value) => formatCurrency(value, investment.currency)} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                labelStyle={{ color: '#fff' }}
                formatter={(value: any) => formatCurrency(value, investment.currency)}
              />
              <Legend />
              <Line type="monotone" dataKey="ingreso" stroke="#3b82f6" strokeWidth={3} name="Ingreso Total" />
              <Line type="monotone" dataKey="citricos" stroke="#10b981" strokeWidth={2} name="Ingreso Anual" dot={false} />
              <Line type="monotone" dataKey="retiros" stroke="#f59e0b" strokeWidth={2} name="Retiros" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-dark-card rounded-2xl shadow-lg p-6 border border-dark-border">
          <h4 className="text-xl font-semibold text-neutral-100 mb-6 text-center">Flujo de Efectivo</h4>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={cashFlowChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="year" stroke="#888" />
              <YAxis stroke="#888" tickFormatter={(value) => formatCurrency(value, investment.currency)} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                labelStyle={{ color: '#fff' }}
                formatter={(value: any) => formatCurrency(value, investment.currency)}
              />
              <Legend />
              <Line type="monotone" dataKey="efectivoAcumulado" stroke="#f59e0b" strokeWidth={2} name="Efectivo Acumulado" />
              <Line type="monotone" dataKey="fondoReinversion" stroke="#3b82f6" strokeWidth={2} name="Fondo Reinversión" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderTableTab = () => (
    <div className="bg-dark-card rounded-2xl shadow-lg p-6 border border-dark-border">
      <ExcelTableV5 />
    </div>
  );

  const renderROITab = () => (
    <div className="bg-dark-card rounded-2xl shadow-lg p-6 border border-dark-border">
      <p className="text-center text-neutral-300">Módulo ROI Calculator en desarrollo</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto"
    >
      <div className="bg-dark-card rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-8 text-white border-b border-neon-green/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <img
                src="/rider_inversiones.png"
                alt="RiderNation"
                className="h-24 w-auto drop-shadow-2xl"
              />
              <div className="w-16 h-16 bg-neon-green/20 rounded-2xl flex items-center justify-center">
                <Award className="w-8 h-8 text-neon-green" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-neutral-50">Resultados de tu Inversión</h2>
                <p className="text-neutral-300 text-lg">Proyecciones del Certificado de Crecimiento Exponencial</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowReportSelector(true)}
                className="flex items-center gap-2 px-6 py-3 bg-neon-green/20 text-neon-green rounded-lg hover:bg-neon-green/30 transition-colors border-2 border-neon-green/50 font-semibold"
              >
                <Globe className="w-5 h-5" />
                <span>Generar Reportes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-dark-card border-b border-dark-border">
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
                        ? 'bg-dark-card shadow-sm border border-neon-green/30'
                        : 'hover:bg-dark-card/50'
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
        <div className="p-8 bg-dark-surface border-t border-dark-border">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPrevious}
              className="px-8 py-4 bg-dark-card text-neutral-200 font-semibold rounded-2xl hover:bg-dark-border transition-all duration-300 flex items-center gap-3 border border-dark-border"
            >
              <ChevronLeft className="w-6 h-6" />
              <span>Anterior</span>
            </motion.button>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setShowReportSelector(true)}
                className="flex items-center gap-2 px-6 py-3 bg-neon-green/20 text-neon-green rounded-lg hover:bg-neon-green/30 transition-colors font-semibold border-2 border-neon-green/50"
              >
                <Globe className="w-5 h-5" />
                <span>Seleccionar Reporte</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Selector Modal */}
      {showReportSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-dark-border">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-8 text-white border-b border-neon-green/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-neon-green/20 rounded-2xl flex items-center justify-center">
                    <Globe className="w-8 h-8 text-neon-green" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-50">Selecciona tu Reporte</h3>
                    <p className="text-neutral-300">Elige el tipo de reporte que mejor se adapte a tus necesidades</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReportSelector(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Advisor Info */}
              <div className="bg-dark-surface rounded-2xl p-6 border border-dark-border">
                <h4 className="text-lg font-semibold text-neutral-100 mb-4">Información del Asesor</h4>

                {/* Format Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-200 mb-3">Formato del Reporte</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setSelectedFormat('html')}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedFormat === 'html'
                          ? 'border-neon-green bg-neon-green/10 text-neon-green shadow-md'
                          : 'border-dark-border hover:border-neutral-500 text-neutral-300'
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
                          ? 'border-neon-red bg-neon-red/10 text-neon-red shadow-md'
                          : 'border-dark-border hover:border-neutral-500 text-neutral-300'
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
                      className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg focus:ring-2 focus:ring-neon-green text-neutral-100 placeholder-neutral-500"
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-200 mb-2">Teléfono</label>
                    <input
                      type="tel"
                      value={advisorInfo.advisorPhone}
                      onChange={(e) => setAdvisorInfo(prev => ({ ...prev, advisorPhone: e.target.value }))}
                      className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg focus:ring-2 focus:ring-neon-green text-neutral-100 placeholder-neutral-500"
                      placeholder="+52 55 1000 0615"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-200 mb-2">Email</label>
                    <input
                      type="email"
                      value={advisorInfo.advisorEmail}
                      onChange={(e) => setAdvisorInfo(prev => ({ ...prev, advisorEmail: e.target.value }))}
                      className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg focus:ring-2 focus:ring-neon-green text-neutral-100 placeholder-neutral-500"
                      placeholder="asesor@ridernation.mx"
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
                      className="bg-dark-card rounded-2xl shadow-lg border-2 border-dark-border hover:border-neon-green/50 transition-all duration-300 overflow-hidden"
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
                        <h5 className="font-semibold text-neutral-100 mb-3">Incluye:</h5>
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
              <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-neutral-100 mb-4">Acciones Rápidas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleGenerateReport('existing-complete', selectedFormat)}
                    className="flex items-center gap-3 p-4 bg-dark-card border border-neon-green/30 rounded-xl hover:border-neon-green/50 hover:shadow-md transition-all duration-300"
                  >
                    <Crown className="w-8 h-8 text-neon-green" />
                    <div className="text-left">
                      <div className="font-semibold text-neutral-100">Reporte Recomendado</div>
                      <div className="text-sm text-neutral-400">Reporte completo original</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      reportTypes.forEach(report => {
                        setTimeout(() => handleGenerateReport(report.id, selectedFormat), Math.random() * 1000);
                      });
                    }}
                    className="flex items-center gap-3 p-4 bg-dark-card border border-purple-400/30 rounded-xl hover:border-purple-400/50 hover:shadow-md transition-all duration-300"
                  >
                    <PieChart className="w-8 h-8 text-purple-400" />
                    <div className="text-left">
                      <div className="font-semibold text-neutral-100">Todos los Reportes</div>
                      <div className="text-sm text-neutral-400">Descargar los 5 reportes en {selectedFormat.toUpperCase()}</div>
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
          <div className="h-full w-full bg-white">
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
    </motion.div>
  );
};

export default SimplifiedStep7Results;

