import React, { useState, useEffect } from 'react';
import { useCalculator } from '../../context/CalculatorContext';
import { formatCurrency } from '../../utils/formatters';
import { Percent, ChevronRight, ChevronLeft, DollarSign, RefreshCw, Calendar, Settings, ArrowRight, Sliders, ChevronDown, ChevronUp, BarChart3, TrendingUp, Activity, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';
// import DynamicChartSystem from '../charts/DynamicChartSystem';
import { Toggle } from '../ui/Toggle';
import EditableCard from '../ui/EditableCard';
import { getLanguageContent, getLanguageFromCurrency } from '../../data/languages';

interface ReinvestmentWithdrawalPlanProps {
  onNext: () => void;
  onPrevious: () => void;
}

const ReinvestmentWithdrawalPlan: React.FC<ReinvestmentWithdrawalPlanProps> = ({ onNext, onPrevious }) => {
  const { 
    investment, 
    updateInvestment,
    updateCashOutPercentage, 
    updateYearlyCashOutPercentage, 
    resetYearlyCashOutPercentages, 
    setDefaultYearlyCashOutPercentage,
    results,
    withdrawalPlanChartVisibility,
    toggleWithdrawalPlanChartElement,
    resetWithdrawalPlanChartVisibility
  } = useCalculator();
  
  // Get current language content
  const currentLanguage = investment.language || getLanguageFromCurrency(investment.currencyFormat);
  const content = getLanguageContent(currentLanguage);
  
  const [defaultPercentage, setDefaultPercentage] = useState(investment.cashOutPercentage);
  const [showAllYears, setShowAllYears] = useState(false);
  const [activePhase, setActivePhase] = useState<'early' | 'mid' | 'late'>('early');
  const [isContentExpanded, setIsContentExpanded] = useState(true);
  
  // Define year ranges for phases
  const phases = {
    early: { start: 1, end: 10, label: 'Fase Inicial (Años 1-10)' },
    mid: { start: 11, end: 20, label: 'Fase Media (Años 11-20)' },
    late: { start: 21, end: 30, label: 'Fase Final (Años 21-30)' }
  };
  
  // Apply default percentage to all years
  const handleApplyDefaultToAll = () => {
    setDefaultYearlyCashOutPercentage(defaultPercentage);
  };
  
  // Apply default percentage to a specific phase
  const handleApplyToPhase = (phase: 'early' | 'mid' | 'late') => {
    const { start, end } = phases[phase];
    
    for (let year = start; year <= end; year++) {
      if (year <= investment.years) {
        updateYearlyCashOutPercentage(year, defaultPercentage);
      }
    }
  };
  
  // Reset all percentages to the global default
  const handleReset = () => {
    resetYearlyCashOutPercentages();
    setDefaultPercentage(investment.cashOutPercentage);
  };
  
  // Create a pattern of increasing percentages
  const handleCreateIncreasingPattern = () => {
    const maxYears = Math.min(investment.years, 30);
    const step = (80 - 0) / (maxYears - 1); // From 0% to 80%
    
    for (let year = 1; year <= maxYears; year++) {
      const percentage = Math.round((year - 1) * step);
      updateYearlyCashOutPercentage(year, percentage);
    }
    
    // Update the global percentage to the average
    updateCashOutPercentage(40);
    setDefaultPercentage(40);
  };
  
  // Create a pattern of decreasing percentages
  const handleCreateDecreasingPattern = () => {
    const maxYears = Math.min(investment.years, 30);
    const step = (80 - 0) / (maxYears - 1); // From 80% to 0%
    
    for (let year = 1; year <= maxYears; year++) {
      const percentage = Math.round(80 - (year - 1) * step);
      updateYearlyCashOutPercentage(year, percentage);
    }
    
    // Update the global percentage to the average
    updateCashOutPercentage(40);
    setDefaultPercentage(40);
  };
  
  // Create a bell curve pattern
  const handleCreateBellCurvePattern = () => {
    const maxYears = Math.min(investment.years, 30);
    const midPoint = Math.ceil(maxYears / 2);
    
    for (let year = 1; year <= maxYears; year++) {
      let percentage;
      if (year <= midPoint) {
        // Increasing phase
        percentage = Math.round((year - 1) * (80 / (midPoint - 1)));
      } else {
        // Decreasing phase
        percentage = Math.round(80 - ((year - midPoint) * (80 / (maxYears - midPoint))));
      }
      updateYearlyCashOutPercentage(year, percentage);
    }
    
    // Update the global percentage to the average
    updateCashOutPercentage(40);
    setDefaultPercentage(40);
  };
  
  // Create a retirement-focused pattern (low early, high late)
  const handleCreateRetirementPattern = () => {
    const maxYears = Math.min(investment.years, 30);
    
    for (let year = 1; year <= maxYears; year++) {
      let percentage;
      if (year <= 5) {
        // Initial phase - minimal withdrawals
        percentage = 0;
      } else if (year <= 15) {
        // Middle phase - gradual increase
        percentage = Math.round((year - 5) * (30 / 10));
      } else {
        // Final phase - high withdrawals for retirement
        percentage = Math.round(30 + ((year - 15) * (70 - 30) / (maxYears - 15)));
      }
      updateYearlyCashOutPercentage(year, percentage);
    }
    
    // Update the global percentage to the average
    updateCashOutPercentage(30);
    setDefaultPercentage(30);
  };
  
  // Get years to display based on active phase or showAllYears
  const getYearsToDisplay = () => {
    if (showAllYears) {
      return Array.from({ length: investment.years }, (_, i) => i + 1);
    }
    
    const { start, end } = phases[activePhase];
    return Array.from(
      { length: Math.min(end, investment.years) - start + 1 }, 
      (_, i) => start + i
    ).filter(year => year <= investment.years);
  };
  
  const yearsToDisplay = getYearsToDisplay();

  // Prepare data for charts
  const prepareChartData = () => {
    if (!results) return null;

    // Prepare data for percentage chart - CORREGIDO
    const percentageData = results.yearlyData.map(data => ({
      year: data.year,
      'Porcentaje de Retiro': investment.partialCashOut ? (data.yearCashOutPercentage || investment.cashOutPercentage) : 0,
      'Porcentaje de Reinversión': investment.partialCashOut ? (100 - (data.yearCashOutPercentage || investment.cashOutPercentage)) : 100
    }));

    // Prepare data for amounts chart
    const amountsData = results.yearlyData.map(data => ({
      year: data.year,
      'Monto de Retiro': data.partialCashOutAmount || 0,
      'Monto de Reinversión': data.yearlyReinvestmentContribution || 0,
      'Utilidad Total': data.citrusIncome || 0
    }));

    // Prepare data for comparison chart
    const comparisonData = results.yearlyData.map(data => ({
      year: data.year,
      'Patrimonio': data.citrusPatrimony,
      'Patrimonio CETES': data.cetesPatrimony,
      'Patrimonio Ahorro': data.savingsPatrimony,
      'Patrimonio Bienes Raíces': data.realEstatePatrimony
    }));

    // Prepare data for cumulative retirement chart
    let cumulativeRetirement = 0;
    const cumulativeRetirementData = results.yearlyData.map(data => {
      if (data.partialCashOutAmount) {
        cumulativeRetirement += data.partialCashOutAmount;
      }
      return {
        year: data.year,
        'Retiro Acumulado': cumulativeRetirement,
        'Retiro Anual': data.partialCashOutAmount || 0
      };
    });

    // Prepare data for cumulative reinvestment chart
    const cumulativeReinvestmentData = results.yearlyData.map(data => ({
      year: data.year,
      'Reinversión Acumulada': data.cumulativeReinvestmentContribution || 0,
      'Reinversión Anual': data.yearlyReinvestmentContribution || 0,
      'Utilidad Total Acumulada': data.cumulativeTotalUtility || 0
    }));

    return {
      percentageData,
      amountsData,
      comparisonData,
      cumulativeRetirementData,
      cumulativeReinvestmentData
    };
  };

  const chartData = prepareChartData();

  // Prepare chart categories
  const chartCategories = [
    {
      id: 'percentages',
      title: 'Porcentajes de Retiro y Reinversión',
      description: 'Distribución porcentual entre retiro y reinversión por año',
      icon: <Percent className="w-5 h-5" />,
      color: 'from-purple-500/100 to-amber-600',
      availableTypes: ['bar', 'line', 'area'] as const
    },
    {
      id: 'amounts',
      title: 'Montos de Retiro y Reinversión',
      description: 'Valores monetarios de retiro y reinversión por año',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'from-neon-green/100 to-green-600',
      availableTypes: ['bar', 'line', 'area'] as const
    },
    {
      id: 'comparison',
      title: 'Comparación de Patrimonio',
      description: 'Comparación del patrimonio entre diferentes inversiones',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'from-neon-red/100 to-blue-600',
      availableTypes: ['line', 'bar', 'area'] as const
    },
    {
      id: 'cumulativeRetirement',
      title: 'Retiro Acumulado',
      description: 'Evolución del retiro acumulado a lo largo del tiempo',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'from-neon-green/100 to-orange-600',
      availableTypes: ['line', 'bar', 'area'] as const,
      yLabelFormatter: (value: number) => formatCurrency(value, investment.currencyFormat)
    },
    {
      id: 'cumulativeReinvestment',
      title: 'Reinversión Acumulada',
      description: 'Evolución de la reinversión acumulada a lo largo del tiempo',
      icon: <Activity className="w-5 h-5" />,
      availableTypes: ['line', 'bar', 'area'] as const,
      yLabelFormatter: (value: number) => formatCurrency(value, investment.currencyFormat)
    }
  ];

  // Prepare chart elements
  const chartElements = {
    percentages: [
      {
        dataKey: 'Porcentaje de Retiro',
        name: 'Retiro',
        color: '#f59e0b',
        strokeWidth: 3,
        fillOpacity: 0.6
      },
      {
        dataKey: 'Porcentaje de Reinversión',
        name: 'Reinversión',
        color: '#16a34a',
        strokeWidth: 3,
        fillOpacity: 0.4
      }
    ],
    amounts: [
      {
        dataKey: 'Monto de Retiro',
        name: 'Retiro',
        color: '#f59e0b',
        strokeWidth: 3,
        fillOpacity: 0.6
      },
      {
        dataKey: 'Monto de Reinversión',
        name: 'Reinversión',
        color: '#16a34a',
        strokeWidth: 3,
        fillOpacity: 0.4
      },
      {
        dataKey: 'Utilidad Total',
        name: 'Utilidad Total',
        color: '#6366f1',
        strokeWidth: 2,
        fillOpacity: 0.3,
        strokeDasharray: '5 5'
      }
    ],
    comparison: [
      {
        dataKey: 'Patrimonio',
        name: 'RiderMex',
        color: '#16a34a',
        strokeWidth: 3,
        fillOpacity: 0.6
      },
      {
        dataKey: 'Patrimonio CETES',
        name: 'CETES',
        color: '#0284c7',
        strokeWidth: 2,
        fillOpacity: 0.4
      },
      {
        dataKey: 'Patrimonio Ahorro',
        name: 'Ahorro',
        color: '#7c3aed',
        strokeWidth: 2,
        fillOpacity: 0.4
      },
      {
        dataKey: 'Patrimonio Bienes Raíces',
        name: 'Bienes Raíces',
        color: '#ea580c',
        strokeWidth: 2,
        fillOpacity: 0.4
      }
    ],
    cumulativeRetirement: [
      {
        dataKey: 'Retiro Acumulado',
        name: 'Retiro Acumulado',
        color: '#f59e0b',
        strokeWidth: 3,
        fillOpacity: 0.6
      },
      {
        dataKey: 'Retiro Anual',
        name: 'Retiro Anual',
        color: '#dc2626',
        strokeWidth: 2,
        fillOpacity: 0.4,
        strokeDasharray: '5 5'
      }
    ],
    cumulativeReinvestment: [
      {
        dataKey: 'Reinversión Acumulada',
        name: 'Reinversión Acumulada',
        color: '#16a34a',
        strokeWidth: 3,
        fillOpacity: 0.6
      },
      {
        dataKey: 'Reinversión Anual',
        name: 'Reinversión Anual',
        color: '#0284c7',
        strokeWidth: 2,
        fillOpacity: 0.4,
        strokeDasharray: '5 5'
      },
      {
        dataKey: 'Utilidad Total Acumulada',
        name: 'Utilidad Total Acumulada',
        color: '#6366f1',
        strokeWidth: 2,
        fillOpacity: 0.3,
        strokeDasharray: '3 3'
      }
    ]
  };

  // Prepare summary data
  const prepareSummaryData = () => {
    if (!results) return {};

    const lastYearData = results.yearlyData[results.yearlyData.length - 1];
    const totalCashOut = results.totalCashOut || 0;
    const totalReinvestment = lastYearData.cumulativeReinvestmentContribution || 0;
    const totalUtility = lastYearData.cumulativeTotalUtility || 0;

    return {
      percentages: [
        {
          label: 'Retiro Promedio',
          value: investment.partialCashOut ? `${investment.cashOutPercentage}%` : '0%',
          color: 'text-amber-600 bg-amber-50'
        },
        {
          label: 'Reinversión Promedio',
          value: investment.partialCashOut ? `${100 - investment.cashOutPercentage}%` : '100%',
          color: 'text-green-600 bg-green-50'
        }
      ],
      amounts: [
        {
          label: 'Retiro Total',
          value: formatCurrency(totalCashOut, investment.currencyFormat),
          color: 'text-amber-600 bg-amber-50'
        },
        {
          label: 'Reinversión Total',
          value: formatCurrency(totalReinvestment, investment.currencyFormat),
          color: 'text-green-600 bg-green-50'
        },
        {
          label: 'Utilidad Total',
          value: formatCurrency(totalUtility, investment.currencyFormat),
          color: 'text-blue-600 bg-blue-50'
        }
      ],
      comparison: [
        {
          label: 'RiderMex',
          value: formatCurrency(lastYearData.citrusPatrimony, investment.currencyFormat),
          color: 'text-green-600 bg-green-50'
        },
        {
          label: 'CETES',
          value: formatCurrency(lastYearData.cetesPatrimony, investment.currencyFormat),
          color: 'text-blue-600 bg-blue-50'
        },
        {
          label: 'Ahorro',
          value: formatCurrency(lastYearData.savingsPatrimony, investment.currencyFormat),
          color: 'text-purple-600 bg-purple-50'
        },
        {
          label: 'Bienes Raíces',
          value: formatCurrency(lastYearData.realEstatePatrimony, investment.currencyFormat),
          color: 'text-orange-600 bg-orange-50'
        }
      ],
      cumulativeRetirement: [
        {
          label: 'Retiro Total',
          value: formatCurrency(totalCashOut, investment.currencyFormat),
          color: 'text-amber-600 bg-amber-50'
        },
        {
          label: 'Retiro Mensual Final',
          value: formatCurrency((lastYearData.partialCashOutAmount || 0) / 12, investment.currencyFormat),
          color: 'text-red-600 bg-red-50'
        },
        {
          label: '% de Utilidad Total',
          value: `${totalUtility > 0 ? (totalCashOut / totalUtility * 100).toFixed(1) : '0.0'}%`,
          color: 'text-blue-600 bg-blue-50'
        }
      ],
      cumulativeReinvestment: [
        {
          label: 'Reinversión Total',
          value: formatCurrency(totalReinvestment, investment.currencyFormat),
          color: 'text-green-600 bg-green-50'
        },
        {
          label: 'Reinversión Anual Final',
          value: formatCurrency(lastYearData.yearlyReinvestmentContribution || 0, investment.currencyFormat),
          color: 'text-blue-600 bg-blue-50'
        },
        {
          label: '% de Utilidad Total',
          value: `${totalUtility > 0 ? (totalReinvestment / totalUtility * 100).toFixed(1) : '0.0'}%`,
          color: 'text-purple-600 bg-purple-50'
        }
      ]
    };
  };

  const summaryData = prepareSummaryData();

  // Prepare visibility controls
  const visibilityControls = {
    withdrawal: {
      visibility: withdrawalPlanChartVisibility,
      toggle: toggleWithdrawalPlanChartElement
    }
  };

  // Prepare reset functions
  const resetVisibilityFunctions = {
    withdrawal: resetWithdrawalPlanChartVisibility
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto"
    >
      <div className="bg-slate-700/50 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Quick Edit Header */}
          <div className="bg-gradient-to-br from-purple-500/10 to-neon-green/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-200 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-amber-800">Plan de Retiros - Edición Directa</h3>
                <p className="text-amber-600">Configura tu estrategia de retiros personalizada</p>
              </div>
            </div>
          </div>

          {/* Quick Configuration Cards */}
          {investment.partialCashOut && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableCard
                  title="Porcentaje de Retiro"
                  value={defaultPercentage}
                  unit="% de utilidades"
                  color="#f59e0b"
                  min={0}
                  max={100}
                  step={5}
                  presets={[
                    { label: '0%', value: 0 },
                    { label: '10%', value: 10 },
                    { label: '20%', value: 20 },
                    { label: '30%', value: 30 },
                    { label: '50%', value: 50 },
                    { label: '75%', value: 75 },
                    { label: '100%', value: 100 }
                  ]}
                  onChange={(value) => {
                    setDefaultPercentage(value);
                    updateCashOutPercentage(value);
                  }}
                  formatValue={(v) => `${v}%`}
                />

                <div className="bg-slate-700/50 rounded-xl shadow-sm border border-slate-600/50 p-4">
                  <h4 className="font-medium text-neutral-200 mb-4">Aplicar Configuración</h4>
                  <div className="space-y-3">
                    <button
                      onClick={handleApplyDefaultToAll}
                      className="w-full py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                    >
                      {content.withdrawalPlan.applyToAllYears}
                    </button>
                    <button
                      onClick={handleReset}
                      className="w-full py-3 bg-dark-border text-neutral-200 rounded-lg hover:bg-dark-border transition-colors font-medium"
                    >
                      {content.withdrawalPlan.reset}
                    </button>
                  </div>
                </div>
              </div>

              {/* Real-time Impact Visualization */}
              {results && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-neon-green/10 to-purple-500/10 rounded-2xl p-6 border-2 border-neon-green/30"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-neon-green rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-dark-bg" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-neon-green">Impacto de tu Decisión</h3>
                      <p className="text-neutral-300 text-sm">Resultados con {investment.cashOutPercentage}% de retiro</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-700/50 rounded-xl p-4 border border-amber-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-amber-500" />
                        <span className="text-sm text-neutral-400">Retiro Total</span>
                      </div>
                      <p className="text-2xl font-bold text-amber-500">
                        {formatCurrency(results.totalCashOut, investment.currencyFormat)}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        Durante {investment.years} años
                      </p>
                    </div>

                    <div className="bg-slate-700/50 rounded-xl p-4 border border-neon-green/30">
                      <div className="flex items-center gap-2 mb-2">
                        <RefreshCw className="w-5 h-5 text-neon-green" />
                        <span className="text-sm text-neutral-400">Patrimonio Final Estimado</span>
                      </div>
                      <p className="text-2xl font-bold text-neon-green">
                        {formatCurrency(results.finalPatrimony, investment.currencyFormat)}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        Después de retiros
                      </p>
                    </div>

                    <div className="bg-slate-700/50 rounded-xl p-4 border border-purple-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <PieChart className="w-5 h-5 text-purple-500" />
                        <span className="text-sm text-neutral-400">Ingreso Mensual</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-500">
                        {formatCurrency(results.finalMonthlyIncome, investment.currencyFormat)}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        Al final del periodo
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-600/50">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-400">Balance de Estrategia:</span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                          <span className="text-neutral-300">Retiro {investment.cashOutPercentage}%</span>
                        </div>
                        <span className="text-neutral-500">|</span>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-neon-green"></div>
                          <span className="text-neutral-300">Reinversión {100 - investment.cashOutPercentage}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}

          {/* Collapsible Header */}
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsContentExpanded(!isContentExpanded)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="text-lg font-semibold text-amber-800">{content.withdrawalPlan.configuration}</h3>
            </div>
            {isContentExpanded ? (
              <ChevronUp className="w-5 h-5 text-amber-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-amber-600" />
            )}
          </div>
          
          {/* Collapsible Content */}
          {isContentExpanded && (
            <div className="space-y-8 animate-fadeIn">
              {/* Introduction and Global Settings */}
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/20 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-200 rounded-xl flex items-center justify-center">
                    <Settings className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-amber-800">Configuración de Retiros</h3>
                    <p className="text-sm text-amber-700">{content.withdrawalPlan.configurationDesc}</p>
                  </div>
                </div>
                
                {/* Retiro Parcial Toggle */}
                <div className="mb-6">
                  <Toggle
                    label={content.withdrawalPlan.activatePartialWithdrawal}
                    checked={investment.partialCashOut}
                    onChange={() => updateInvestment({ partialCashOut: !investment.partialCashOut })}
                    tooltip="Activa esta opción para retirar un porcentaje de las utilidades generadas"
                  />
                  
                  <p className="text-sm text-amber-700 mt-2">
                    {investment.partialCashOut 
                      ? (currentLanguage === 'es' ? "Con el retiro parcial activado, podrás disfrutar de un ingreso mensual mientras sigues reinvirtiendo para el crecimiento a largo plazo." :
                         currentLanguage === 'en' ? "With partial withdrawal activated, you can enjoy monthly income while continuing to reinvest for long-term growth." :
                         "Avec le retrait partiel activé, vous pouvez profiter d'un revenu mensuel tout en continuant à réinvestir pour la croissance à long terme.")
                      : (currentLanguage === 'es' ? "Con el retiro parcial desactivado, todas las utilidades se reinvertirán para maximizar el crecimiento patrimonial." :
                         currentLanguage === 'en' ? "With partial withdrawal disabled, all profits will be reinvested to maximize wealth growth." :
                         "Avec le retrait partiel désactivé, tous les profits seront réinvestis pour maximiser la croissance du patrimoine.")}
                  </p>
                </div>
                
                {investment.partialCashOut && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Default Percentage Setting */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-amber-800">{content.withdrawalPlan.defaultPercentage}</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={defaultPercentage}
                          onChange={(e) => setDefaultPercentage(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                          className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                        <span className="text-amber-800 font-medium">%</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleApplyDefaultToAll}
                          className="flex-1 py-2 px-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
                        >
                          {content.withdrawalPlan.applyToAllYears}
                        </button>
                        <button
                          onClick={handleReset}
                          className="py-2 px-3 bg-dark-border text-neutral-200 rounded-lg hover:bg-dark-border transition-colors text-sm"
                        >
                          {content.withdrawalPlan.reset}
                        </button>
                      </div>
                    </div>
                    
                    {/* Apply to Phase Buttons */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-amber-800">{content.withdrawalPlan.applyToSpecificPhases}</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleApplyToPhase('early')}
                          className="py-2 px-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          {content.withdrawalPlan.earlyPhase}
                        </button>
                        <button
                          onClick={() => handleApplyToPhase('mid')}
                          className="py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          {content.withdrawalPlan.midPhase}
                        </button>
                        <button
                          onClick={() => handleApplyToPhase('late')}
                          className="py-2 px-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                        >
                          {content.withdrawalPlan.latePhase}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {investment.partialCashOut && (
                <>
                  {/* Predefined Patterns */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-50 flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-amber-600" />
                      <span>{content.withdrawalPlan.predefinedPatterns}</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <button
                        onClick={handleCreateIncreasingPattern}
                        className="p-4 bg-gradient-to-br from-neon-green/10 to-neon-green/20 rounded-xl hover:shadow-md transition-all duration-300 text-left"
                      >
                        <h4 className="font-medium text-green-800 mb-2">{content.withdrawalPlan.increasingPattern}</h4>
                        <p className="text-sm text-green-600">{content.withdrawalPlan.increasingDesc}</p>
                        <div className="mt-2 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-green-200 via-green-400 to-green-600 w-full"></div>
                        </div>
                      </button>
                      
                      <button
                        onClick={handleCreateDecreasingPattern}
                        className="p-4 bg-gradient-to-br from-neon-red/10 to-neon-red/20 rounded-xl hover:shadow-md transition-all duration-300 text-left"
                      >
                        <h4 className="font-medium text-blue-800 mb-2">{content.withdrawalPlan.decreasingPattern}</h4>
                        <p className="text-sm text-blue-600">{content.withdrawalPlan.decreasingDesc}</p>
                        <div className="mt-2 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 w-full"></div>
                        </div>
                      </button>
                      
                      <button
                        onClick={handleCreateBellCurvePattern}
                        className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/20 rounded-xl hover:shadow-md transition-all duration-300 text-left"
                      >
                        <h4 className="font-medium text-purple-800 mb-2">{content.withdrawalPlan.bellCurvePattern}</h4>
                        <p className="text-sm text-purple-600">{content.withdrawalPlan.bellCurveDesc}</p>
                        <div className="mt-2 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-200 via-purple-600 to-purple-200 w-full"></div>
                        </div>
                      </button>
                      
                      <button
                        onClick={handleCreateRetirementPattern}
                        className="p-4 bg-gradient-to-br from-neon-green/10 to-neon-green/20 rounded-xl hover:shadow-md transition-all duration-300 text-left"
                      >
                        <h4 className="font-medium text-orange-800 mb-2">{content.withdrawalPlan.retirementPattern}</h4>
                        <p className="text-sm text-orange-600">{content.withdrawalPlan.retirementDesc}</p>
                        <div className="mt-2 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-orange-200 via-orange-300 to-orange-600 w-full"></div>
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  {/* Phase Navigation */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-neutral-50 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-amber-600" />
                      <span>{content.withdrawalPlan.yearByYearConfig}</span>
                    </h3>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowAllYears(!showAllYears)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          showAllYears 
                            ? 'bg-amber-600 text-white' 
                            : 'bg-dark-surface text-neutral-200 hover:bg-dark-border'
                        }`}
                      >
                        {showAllYears ? content.withdrawalPlan.showByPhases : content.withdrawalPlan.showAllYears}
                      </button>
                      
                      {!showAllYears && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => setActivePhase('early')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              activePhase === 'early' 
                                ? 'bg-green-600 text-white' 
                                : 'bg-dark-surface text-neutral-200 hover:bg-dark-border'
                            }`}
                          >
                            1-10
                          </button>
                          <button
                            onClick={() => setActivePhase('mid')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              activePhase === 'mid' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-dark-surface text-neutral-200 hover:bg-dark-border'
                            }`}
                          >
                            11-20
                          </button>
                          <button
                            onClick={() => setActivePhase('late')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              activePhase === 'late' 
                                ? 'bg-purple-600 text-white' 
                                : 'bg-dark-surface text-neutral-200 hover:bg-dark-border'
                            }`}
                          >
                            21-30
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Year-by-Year Configuration Table */}
                  <div className="bg-slate-700/50 border border-slate-600/50 rounded-xl overflow-hidden">
                    {!showAllYears && (
                      <div className="bg-gradient-to-r from-amber-100 to-amber-200 p-4">
                        <h4 className="font-medium text-amber-800">{phases[activePhase].label}</h4>
                      </div>
                    )}
                    
                    <div className="max-h-[400px] overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-dark-surface sticky top-0 z-10">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                              {content.withdrawalPlan.year}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                              {content.withdrawalPlan.withdrawalPercentage}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                              {content.withdrawalPlan.reinvestment}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                              {content.withdrawalPlan.phase}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-slate-700/50 divide-y divide-gray-200">
                          {yearsToDisplay.map((year) => {
                            const percentage = investment.yearlyCashOutPercentages[year - 1];
                            let phaseColor;
                            
                            if (year <= 10) {
                              phaseColor = 'bg-green-100 text-green-800';
                            } else if (year <= 20) {
                              phaseColor = 'bg-blue-100 text-blue-800';
                            } else {
                              phaseColor = 'bg-purple-100 text-purple-800';
                            }
                            
                            return (
                              <tr key={year} className="hover:bg-dark-surface">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-100">
                                  {year}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="range"
                                      min="0"
                                      max="100"
                                      value={percentage}
                                      onChange={(e) => updateYearlyCashOutPercentage(year, parseInt(e.target.value))}
                                      className="w-full h-2 bg-gradient-to-r from-amber-200 to-amber-300 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex items-center gap-1 min-w-[80px]">
                                      <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={percentage}
                                        onChange={(e) => updateYearlyCashOutPercentage(year, Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                                        className="w-16 px-2 py-1 border border-slate-600/50 rounded-lg text-center text-sm"
                                      />
                                      <span className="text-neutral-300">%</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                  {100 - percentage}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs ${phaseColor}`}>
                                    {year <= 10 ? content.withdrawalPlan.initial : year <= 20 ? content.withdrawalPlan.middle : content.withdrawalPlan.final}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Explanation */}
                  <div className="bg-dark-surface p-6 rounded-xl">
                    <h4 className="font-medium text-neutral-50 mb-3">{content.withdrawalPlan.howItWorks}</h4>
                    <div className="space-y-3 text-sm text-neutral-300">
                      <p>
                        <span className="font-medium text-amber-700">{content.withdrawalPlan.partialWithdrawal}</span> {content.withdrawalPlan.partialWithdrawalDesc}
                      </p>
                      <p>
                        <span className="font-medium text-amber-700">{content.withdrawalPlan.personalizedStrategy}</span> {content.withdrawalPlan.personalizedStrategyDesc}
                      </p>
                      <p>
                        <span className="font-medium text-amber-700">{content.withdrawalPlan.usageExamples}</span>
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>{content.withdrawalPlan.example1}</li>
                        <li>{content.withdrawalPlan.example2}</li>
                        <li>{content.withdrawalPlan.example3}</li>
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          
          {/* Charts Section */}
          {/* TODO: DynamicChartSystem component is missing - needs to be implemented or replaced */}
          {/* {chartData && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-neutral-50 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-amber-600" />
                <span>{content.withdrawalPlan.visualization}</span>
              </h3>

              <DynamicChartSystem
                categories={chartCategories}
                chartData={{
                  percentages: chartData.percentageData,
                  amounts: chartData.amountsData,
                  comparison: chartData.comparisonData,
                  cumulativeRetirement: chartData.cumulativeRetirementData,
                  cumulativeReinvestment: chartData.cumulativeReinvestmentData
                }}
                chartElements={chartElements}
                formatters={{
                  yLabel: (value) => typeof value === 'number' && value > 100 ?
                    formatCurrency(value, investment.currencyFormat) :
                    `${value}${typeof value === 'number' && value <= 100 ? '%' : ''}`,
                  tooltip: (value) => typeof value === 'number' && value > 100 ?
                    formatCurrency(value, investment.currencyFormat) :
                    `${value}${typeof value === 'number' && value <= 100 ? '%' : ''}`
                }}
                summaryData={summaryData}
                investment={investment}
                visibilityControls={visibilityControls}
                resetVisibilityFunctions={resetVisibilityFunctions}
              />
            </div>
          )} */}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPrevious}
              className="px-8 py-4 bg-dark-surface text-neutral-200 font-semibold rounded-2xl hover:bg-dark-border transition-all duration-300 flex items-center gap-3"
            >
              <ChevronLeft className="w-6 h-6" />
              <span>{content.common.buttons.previous}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="px-12 py-4 bg-gradient-to-r from-purple-500/100 to-orange-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 text-lg"
            >
              <span>{content.common.buttons.continue}</span>
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReinvestmentWithdrawalPlan;