import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, CreditCard as Edit3, Check, X, ChevronLeft, ChevronRight, TrendingUp, Calendar, DollarSign, Percent, Zap, Calculator, Award, BarChart3 } from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';
import { calculateResults } from '../../utils/calculations';
import { formatCurrency, convertFromMXN } from '../../utils/formatters';
import { compoundMultiplierContent } from '../../data/compoundMultiplierContent';
import { RIDERMEX_CONFIG } from '../../data/ridermexConfig';

interface EditableMetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ComponentType<any>;
  color: string;
  min: number;
  max: number;
  step?: number;
  presets?: { label: string; value: number }[];
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
}

const EditableMetricCard: React.FC<EditableMetricCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  color,
  min,
  max,
  step = 1,
  presets = [],
  onChange,
  formatValue = (v) => v.toString()
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={`bg-gradient-to-br from-${color}-50 to-${color}-100 p-4 rounded-xl border border-${color}-200`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 text-${color}-600`} />
          <h4 className={`font-medium text-${color}-800`}>{title}</h4>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className={`p-1 rounded-md hover:bg-${color}-200 transition-colors`}
          >
            <Edit3 className={`w-4 h-4 text-${color}-600`} />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTempValue(Math.max(min, tempValue - step))}
              className={`p-1 rounded-md bg-${color}-200 hover:bg-${color}-300 transition-colors`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={tempValue}
              onChange={(e) => setTempValue(Number(e.target.value))}
              onKeyPress={handleKeyPress}
              min={min}
              max={max}
              step={step}
              className="flex-1 px-3 py-2 border border-slate-600/50 rounded-lg text-center focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={() => setTempValue(Math.min(max, tempValue + step))}
              className={`p-1 rounded-md bg-${color}-200 hover:bg-${color}-300 transition-colors`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {presets.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setTempValue(preset.value)}
                  className={`px-2 py-1 text-xs rounded-md bg-${color}-200 hover:bg-${color}-300 transition-colors`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              Guardar
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className={`text-2xl font-bold text-${color}-700 mb-1`}>
            {formatValue(value)}
          </div>
          <div className={`text-sm text-${color}-600`}>{unit}</div>
        </div>
      )}
    </div>
  );
};

interface ReinvestmentInvestorGoalsProps {
  onNext: () => void;
  onPrevious: () => void;
}

const ReinvestmentInvestorGoals: React.FC<ReinvestmentInvestorGoalsProps> = ({ onNext, onPrevious }) => {
  const { 
    investment,
    updateInvestment,
    results
  } = useCalculator();

  // Calculate required certificates for monthly goal
  const calculateRequiredCertificates = (monthlyGoal: number) => {
    const annualGoal = monthlyGoal * 12;
    
    // Test different certificate amounts to find the minimum needed
    // Use current reinvestment setting from investment state
    for (let testCertificates = 1; testCertificates <= 50; testCertificates++) {
      // Create a test investment with the current parameters INCLUDING reinvestment setting
      const testInvestment = {
        ...investment,
        initialCertificates: testCertificates,
        years: investment.investorTimeframe || investment.years,
        reinvestProfits: investment.reinvestProfits // Use current reinvestment setting
      };
      
      try {
        // Use the same calculation logic as the main results
        const testResults = calculateResults(testInvestment);
        
        // Check if this amount of certificates meets or exceeds the goal
        if (testResults.finalMonthlyIncome >= monthlyGoal) {
          return testCertificates;
        }
      } catch (error) {
        // If calculation fails, fall back to simple calculation without reinvestment
        console.warn('Error in test calculation, using fallback');
        const scenario = investment.ridermexScenario || 'moderate';
        const scenarioConfig = RIDERMEX_CONFIG.SCENARIOS[scenario];
        const utilityPerCertificate = scenarioConfig ? scenarioConfig.annualReturnPerTicket : 14400;
        return Math.ceil(annualGoal / utilityPerCertificate);
      }
    }
    
    // Fallback if no solution found within 50 certificates
    return 50;
  };

  // Calculate monthly income from current certificates using current reinvestment setting
  const calculateMonthlyIncome = () => {
    // Always recalculate to ensure consistency with current reinvestment setting
    try {
      const testInvestment = {
        ...investment,
        reinvestProfits: investment.reinvestProfits // Use current reinvestment setting
      };
      const testResults = calculateResults(testInvestment);
      return testResults.finalMonthlyIncome;
    } catch (error) {
      // Fallback calculation
      const scenario = investment.ridermexScenario || 'moderate';
      const scenarioConfig = RIDERMEX_CONFIG.SCENARIOS[scenario];
      const utilityPerCertificate = scenarioConfig ? scenarioConfig.annualReturnPerTicket : 14400;
      const baseMonthlyIncome = (investment.initialCertificates * utilityPerCertificate) / 12;
      
      // If reinvestment is off, use base calculation
      // If reinvestment is on, apply a rough multiplier based on years
      if (!investment.reinvestProfits) {
        return baseMonthlyIncome;
      } else {
        const years = investment.investorTimeframe || investment.years;
        const multiplier = years <= 10 ? 1.5 : years <= 15 ? 2.5 : years <= 20 ? 4 : years <= 25 ? 6 : 8;
        return baseMonthlyIncome * multiplier;
      }
    }
  };

  // Recalculate certificates when reinvestment setting changes
  React.useEffect(() => {
    if (investment.investorMonthlyGoal) {
      const requiredCerts = calculateRequiredCertificates(investment.investorMonthlyGoal);
      if (requiredCerts !== investment.initialCertificates) {
        updateInvestment({ initialCertificates: requiredCerts });
      }
    }
  }, [investment.reinvestProfits, investment.investorMonthlyGoal, investment.investorTimeframe, investment.averageProductionPerHectare, investment.averageSalePricePerKg]); // Trigger on multiple changes

  // Force re-render when key values change
  const [forceUpdate, setForceUpdate] = useState(0);
  React.useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [investment.initialCertificates, investment.reinvestProfits, investment.investorMonthlyGoal, investment.investorTimeframe]);

  // State for editing production scenarios
  // Based on RIDERMEX_CONFIG.SCENARIOS
  const [editingScenario, setEditingScenario] = useState<string | null>(null);
  const [scenarioValues, setScenarioValues] = useState({
    conservador: {
      motos_mes: 30,
      utilidad: 900,
      tickets: 30,
      annualReturn: 10800 // 30×12×$900÷30 = $10,800/ticket/año
    },
    moderado: {
      motos_mes: 40,
      utilidad: 900,
      tickets: 30,
      annualReturn: 14400 // 40×12×$900÷30 = $14,400/ticket/año
    },
    optimista: {
      motos_mes: 55,
      utilidad: 900,
      tickets: 30,
      annualReturn: 19800 // 55×12×$900÷30 = $19,800/ticket/año
    }
  });


  const handleUpdateScenarioValue = (scenario: string, field: string, value: number) => {
    setScenarioValues(prev => ({
      ...prev,
      [scenario]: {
        ...prev[scenario as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSaveScenario = (scenario: string) => {
    const values = scenarioValues[scenario as keyof typeof scenarioValues];
    const annualUtilityTotal = values.motos_mes * 12 * values.utilidad;
    const utilityPerTicket = annualUtilityTotal / values.tickets;

    // Map scenario keys to ridermexScenario values
    const scenarioMap: { [key: string]: 'conservative' | 'moderate' | 'optimistic' } = {
      'conservador': 'conservative',
      'moderado': 'moderate',
      'optimista': 'optimistic'
    };

    updateInvestment({
      averageProductionPerHectare: values.motos_mes * 12,
      averageSalePricePerKg: values.utilidad,
      annualProfit: (utilityPerTicket / (investment.certificateBasePrice || 70000)) * 100,
      ridermexScenario: scenarioMap[scenario] || 'moderate'
    });
    setEditingScenario(null);
  };

  // Preset monthly goals
  const monthlyGoalPresets = [
    { label: '$10K', value: convertFromMXN(10000, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR) },
    { label: '$25K', value: convertFromMXN(25000, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR) },
    { label: '$50K', value: convertFromMXN(50000, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR) },
    { label: '$100K', value: convertFromMXN(100000, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR) },
    { label: '$250K', value: convertFromMXN(250000, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR) }
  ];

  // Preset timeframes
  const timeframePresets = [
    { label: '1 año', value: 1 },
    { label: '3 años', value: 3 },
    { label: '5 años', value: 5 },
    { label: '10 años', value: 10 },
    { label: '15 años', value: 15 },
    { label: '20 años', value: 20 },
    { label: '25 años', value: 25 }
  ];

  // Production scenarios - Ridermex (based on RIDERMEX_CONFIG)
  const productionScenarios = [
    {
      key: 'conservador',
      label: 'Conservador',
      motos_mes: 30,
      utilidad: 900,
      tickets: 30,
      color: 'orange',
      description: '360 motos/año × $900/moto',
      annualReturnPerTicket: 10800 // $324,000 ÷ 30 = $10,800/ticket
    },
    {
      key: 'moderado',
      label: 'Moderado',
      motos_mes: 40,
      utilidad: 900,
      tickets: 30,
      color: 'blue',
      description: '480 motos/año × $900/moto',
      annualReturnPerTicket: 14400 // $432,000 ÷ 30 = $14,400/ticket
    },
    {
      key: 'optimista',
      label: 'Optimista',
      motos_mes: 55,
      utilidad: 900,
      tickets: 30,
      color: 'green',
      description: '660 motos/año × $900/moto',
      annualReturnPerTicket: 19800 // $594,000 ÷ 30 = $19,800/ticket
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-slate-700/50 rounded-3xl border border-slate-600/50 overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Monthly Income Goal */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-neon-green/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-neon-green" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-50">¿Cuánto Ingreso Mensual Pasivo Deseas?</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {monthlyGoalPresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    updateInvestment({ investorMonthlyGoal: preset.value });
                    const requiredCerts = calculateRequiredCertificates(preset.value);
                    updateInvestment({ initialCertificates: requiredCerts });
                  }}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                    Math.abs((investment.investorMonthlyGoal || 0) - preset.value) < 100
                      ? 'bg-gradient-to-br from-neon-green to-emerald-600 text-white shadow-neon-green'
                      : 'bg-dark-surface text-neutral-200 hover:bg-dark-border border border-slate-600/50 hover:border-neon-green/50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="bg-gradient-to-br from-neon-green/10 to-emerald-600/10 border border-neon-green/30 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neon-green mb-2">Meta Mensual Personalizada</label>
                  <input
                    type="text"
                    value={(investment.investorMonthlyGoal || 0).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    onChange={(e) => {
                      const cleanValue = e.target.value.replace(/,/g, '');
                      const monthlyGoal = parseFloat(cleanValue) || 0;
                      updateInvestment({ investorMonthlyGoal: monthlyGoal });
                      const requiredCerts = calculateRequiredCertificates(monthlyGoal);
                      updateInvestment({ initialCertificates: requiredCerts });
                    }}
                    className="w-full px-4 py-3 bg-dark-surface border border-slate-600/50 text-neutral-100 rounded-lg focus:ring-2 focus:ring-neon-green placeholder:text-neutral-500"
                    placeholder="Ingreso mensual deseado"
                  />
                </div>
                <div className="text-center">
                  <div className="text-sm text-neutral-300 mb-1">Certificados Necesarios</div>
                  <div className="text-3xl font-bold text-neon-green">
                    {investment.investorMonthlyGoal ? calculateRequiredCertificates(investment.investorMonthlyGoal) : investment.initialCertificates}
                  </div>
                  <div className="text-sm text-neutral-300">para tu meta</div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeframe Goal */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-neon-red/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-neon-red" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-50">¿En Cuánto Tiempo Quieres Lograrlo?</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {timeframePresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => updateInvestment({
                    investorTimeframe: preset.value,
                    years: preset.value
                  })}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                    (investment.investorTimeframe || investment.years) === preset.value
                      ? 'bg-gradient-to-br from-neon-red to-rose-600 text-white shadow-neon-red'
                      : 'bg-dark-surface text-neutral-200 hover:bg-dark-border border border-slate-600/50 hover:border-neon-red/50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="bg-gradient-to-br from-neon-red/10 to-rose-600/10 border border-neon-red/30 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neon-red mb-2">Plazo Personalizado</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={investment.investorTimeframe || investment.years}
                    onChange={(e) => {
                      const timeframe = parseInt(e.target.value) || 25;
                      updateInvestment({
                        investorTimeframe: timeframe,
                        years: timeframe
                      });
                    }}
                    className="w-full px-4 py-3 bg-dark-surface border border-slate-600/50 text-neutral-100 rounded-lg focus:ring-2 focus:ring-neon-red placeholder:text-neutral-500"
                    placeholder="Años para alcanzar tu meta"
                  />
                </div>
                <div className="text-center">
                  <div className="text-sm text-neutral-300 mb-1">Plazo Seleccionado</div>
                  <div className="text-3xl font-bold text-neon-red">
                    {investment.investorTimeframe || investment.years}
                  </div>
                  <div className="text-sm text-neutral-300">años de inversión</div>
                </div>
              </div>
            </div>
          </div>

          {/* Production Scenarios */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-50">Presets de Producción Rápidos</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {productionScenarios.map((scenario) => {
                const roi = (((scenario.motos_mes * 12 * scenario.utilidad) / scenario.tickets) / (investment.certificateBasePrice || 70000)) * 100;
                const isSelected = investment.annualProfit === scenario.annualReturn;
                const isEditing = editingScenario === scenario.key;
                const currentValues = scenarioValues[scenario.key as keyof typeof scenarioValues];

                return (
                  <motion.div
                    key={scenario.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <button
                      onClick={() => {
                        if (!isEditing) {
                          handleSaveScenario(scenario.key);
                        }
                      }}
                      className={`w-full p-6 rounded-xl text-left transition-all duration-200 border-2 ${
                        isSelected
                          ? `bg-gradient-to-br from-${scenario.color}-500 to-${scenario.color}-600 text-white shadow-neon-red border-${scenario.color}-400`
                          : `bg-dark-surface text-neutral-200 hover:bg-dark-border border-slate-600/50 hover:border-${scenario.color}-500/50`
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isSelected
                              ? 'bg-slate-700/50/20'
                              : `bg-${scenario.color}-100`
                          }`}>
                            <TrendingUp className={`w-4 h-4 ${
                              isSelected
                                ? 'text-white'
                                : `text-${scenario.color}-600`
                            }`} />
                          </div>
                          <h4 className="font-semibold text-lg">{scenario.label}</h4>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingScenario(isEditing ? null : scenario.key);
                          }}
                          className={`p-2 rounded-lg transition-all ${
                            isSelected
                              ? 'hover:bg-slate-700/50/20'
                              : 'hover:bg-dark-bg'
                          }`}
                        >
                          <Edit3 className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-neon-red'}`} />
                        </button>
                      </div>
                      <p className={`text-sm mb-3 ${
                        isSelected
                          ? 'text-white/90'
                          : 'text-neutral-300'
                      }`}>
                        {Math.round(currentValues.motos_mes * 12)} motos/año × ${currentValues.utilidad.toLocaleString()}/moto
                      </p>
                      {isSelected && (
                        <div className="space-y-1 text-sm">
                          <div className={`${
                            isSelected
                              ? 'text-white/80'
                              : 'text-neutral-400'
                          }`}>
                            • {Math.round(currentValues.motos_mes * 12)} motos/año
                          </div>
                          <div className={`${
                            isSelected
                              ? 'text-white/80'
                              : 'text-neutral-400'
                          }`}>
                            • ${currentValues.utilidad.toLocaleString()} utilidad/moto
                          </div>
                          <div className={`font-medium ${
                            isSelected
                              ? 'text-white'
                              : `text-${scenario.color}-600`
                          }`}>
                            • {(() => {
                              const motosAnual = Math.round(currentValues.motos_mes * 12);
                              const utilidadTotal = motosAnual * currentValues.utilidad;
                              const utilidadPorTicket = utilidadTotal / currentValues.tickets;
                              return `$${Math.round(utilidadPorTicket).toLocaleString()} por ticket/año`;
                            })()}
                          </div>
                        </div>
                      )}
                    </button>

                    {isEditing && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-gradient-to-br from-neon-green/10 to-yellow-50 rounded-lg p-4 space-y-3 border-2 border-orange-200"
                      >
                        <div>
                          <label className="text-xs font-medium text-neutral-200 block mb-1">Motos/mes</label>
                          <input
                            type="number"
                            value={currentValues.motos_mes}
                            onChange={(e) => handleUpdateScenarioValue(scenario.key, 'motos_mes', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-slate-600/50 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-neutral-200 block mb-1">Utilidad/moto ($)</label>
                          <input
                            type="number"
                            value={currentValues.utilidad}
                            onChange={(e) => handleUpdateScenarioValue(scenario.key, 'utilidad', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-slate-600/50 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-neutral-200 block mb-1">Tickets/agencia</label>
                          <input
                            type="number"
                            value={currentValues.tickets}
                            onChange={(e) => handleUpdateScenarioValue(scenario.key, 'tickets', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-slate-600/50 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                        <div className="pt-2 border-t border-orange-200 text-xs space-y-1">
                          <div className="text-neutral-300">
                            Motos/año: <span className="font-medium text-orange-700">{currentValues.motos_mes * 12}</span>
                          </div>
                          <div className="text-neutral-300">
                            Utilidad total: <span className="font-medium text-orange-700">${(currentValues.motos_mes * 12 * currentValues.utilidad).toLocaleString()}</span>
                          </div>
                          <div className="text-neutral-300">
                            Utilidad/ticket: <span className="font-medium text-orange-700">${((currentValues.motos_mes * 12 * currentValues.utilidad) / currentValues.tickets).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleSaveScenario(scenario.key)}
                            className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition flex items-center justify-center gap-1"
                          >
                            <Check className="w-4 h-4" />
                            Guardar
                          </button>
                          <button
                            onClick={() => {
                              setEditingScenario(null);
                              setScenarioValues(prev => ({
                                ...prev,
                                [scenario.key]: scenario
                              }));
                            }}
                            className="flex-1 px-3 py-2 bg-gray-300 hover:bg-gray-400 text-neutral-50 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1"
                          >
                            <X className="w-4 h-4" />
                            Cancelar
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Compound Multiplier Button */}
          <div className="bg-gradient-to-br from-purple-500/100/10 to-indigo-600/10 rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-50">{compoundMultiplierContent.title}</h3>
                <p className="text-purple-300">{compoundMultiplierContent.tagline}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-dark-surface p-4 rounded-xl border border-slate-600/50 text-center">
                <div className="text-sm text-neutral-400 mb-1">Certificados Iniciales</div>
                <div className="text-2xl font-bold text-neon-green">{investment.initialCertificates}</div>
                <div className="text-xs text-neutral-300">que compras</div>
              </div>
              <div className="bg-dark-surface p-4 rounded-xl border border-slate-600/50 text-center">
                <div className="text-sm text-neutral-400 mb-1">Certificados Proyectados</div>
                <div className="text-2xl font-bold text-blue-400">
                  {React.useMemo(() =>
                    results ? results.certificatesSummary.totalCertificates : Math.ceil(investment.initialCertificates * 2.5),
                    [results, investment.initialCertificates, forceUpdate]
                  )}
                </div>
                <div className="text-xs text-neutral-300">que tendrás</div>
              </div>
              <div className="bg-dark-surface p-4 rounded-xl border border-slate-600/50 text-center">
                <div className="text-sm text-neutral-400 mb-1">Certificados Estimados por Reinversión</div>
                <div className="text-2xl font-bold text-purple-400">
                  +{React.useMemo(() =>
                    results ? results.certificatesSummary.fromReinvestment : Math.ceil(investment.initialCertificates * 1.5),
                    [results, investment.initialCertificates, forceUpdate]
                  )}
                </div>
                <div className="text-xs text-neutral-300">por reinversión</div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => updateInvestment({ reinvestProfits: !investment.reinvestProfits })}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  investment.reinvestProfits
                    ? 'bg-gradient-to-r from-purple-500/100 to-indigo-600 text-white shadow-lg shadow-purple-500/50'
                    : 'bg-dark-surface text-neutral-300 hover:bg-dark-border border border-slate-600/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5" />
                  <span>
                    {investment.reinvestProfits ? '✅ Multiplicador ACTIVADO' : '❌ Multiplicador DESACTIVADO'}
                  </span>
                </div>
              </button>
              <p className="text-sm text-purple-300 mt-2">
                {investment.reinvestProfits
                  ? "Las utilidades se reinvierten automáticamente para multiplicar tus activos"
                  : "Las utilidades se reciben como ingreso mensual sin reinversión"
                }
              </p>
            </div>
          </div>

          {/* Current Configuration Summary */}
          <div className="bg-gradient-to-br from-neon-red/10 to-neon-green/10 rounded-2xl p-6 border border-neon-red/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-neon-red/20 rounded-xl flex items-center justify-center">
                <Calculator className="w-5 h-5 text-neon-red" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-50">Resumen de tu Configuración</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-dark-surface p-4 rounded-xl border border-slate-600/50 text-center">
                <div className="text-sm text-neutral-400 mb-1">Certificados Proyectados</div>
                <div className="text-xl font-bold text-neon-green">{investment.initialCertificates}</div>
              </div>
              <div className="bg-dark-surface p-4 rounded-xl border border-slate-600/50 text-center">
                <div className="text-sm text-neutral-400 mb-1">Plazo</div>
                <div className="text-xl font-bold text-neon-red">{investment.investorTimeframe || investment.years} años</div>
              </div>
              <div className="bg-dark-surface p-4 rounded-xl border border-slate-600/50 text-center">
                <div className="text-sm text-neutral-400 mb-1">Ingreso Mensual Proyectado</div>
                <div className="text-xl font-bold text-purple-400">
                  {formatCurrency(calculateMonthlyIncome(), investment.currencyFormat)}
                </div>
              </div>
              <div className="bg-dark-surface p-4 rounded-xl border border-slate-600/50 text-center flex flex-col justify-center items-center">
                <div className="text-sm text-neutral-400 mb-1">Utilidad Anual Proyectada por Ticket</div>
                <div className="text-xl font-bold text-orange-400 w-full">
                  {(() => {
                    // For RiderMex: Calculate from production scenario
                    if (investment.ridermexProductType) {
                      const baseUtility = investment.averageProductionPerHectare / 30; // 30 tickets per store
                      const years = investment.investorTimeframe || investment.years;
                      const finalUtility = baseUtility * Math.pow(1 + (investment.marketGrowthRate || 5) / 100, years);
                      return (
                        <div className="flex flex-col items-center">
                          <span className="text-sm text-neutral-300 font-semibold">{formatCurrency(baseUtility, investment.currencyFormat)} <span className="text-xs text-neutral-400 font-normal">(Año 1)</span></span>
                          <span className="text-xl font-bold text-orange-400 mt-0.5">{formatCurrency(finalUtility, investment.currencyFormat)} <span className="text-xs text-neutral-400 font-normal">(Año {years} Proyectado)</span></span>
                        </div>
                      );
                    }
                    // For Cosecha: Calculate ROI percentage
                    const baseRoi = (investment.averageProductionPerHectare * investment.averageSalePricePerKg * 0.1 * 0.65 / investment.certificateBasePrice) * 100;
                    return `${baseRoi.toFixed(1)}% Proyectado`;
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPrevious}
              className="px-8 py-4 bg-dark-surface text-neutral-200 font-semibold rounded-2xl hover:bg-dark-border border border-slate-600/50 transition-all duration-300 flex items-center gap-3"
            >
              <ChevronLeft className="w-6 h-6" />
              <span>Anterior</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="px-12 py-4 bg-gradient-to-r from-neon-green to-emerald-600 text-white font-semibold rounded-2xl shadow-neon-green hover:shadow-neon-green transition-all duration-300 flex items-center gap-3 text-lg"
            >
              <span>Continuar</span>
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReinvestmentInvestorGoals;