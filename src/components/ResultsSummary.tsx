import React, { useState } from 'react';
import { useCalculator } from '../context/CalculatorContext';
import { formatCurrency, formatPercent } from '../utils/formatters';
import AnimatedNumberDisplay from './ui/AnimatedNumberDisplay';
import { TrendingUp, DollarSign, Target, ChevronDown, ChevronUp, ArrowUpRight, ArrowDownRight, Activity, RefreshCw, Zap, Shield, Award, Plus, Minus, Calendar, BarChart3, Settings, CreditCard as Edit3, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCertificatePhasesSummary } from '../utils/calculations/certificateEvolution';
import { getDetailedCertificateEvolution } from '../utils/calculations/certificateEvolution';
import { SlideUp, PulseGlow, ProgressBar, ScaleIn } from './ui/TikTokAnimations';

const ResultsSummary: React.FC = () => {
  const { investment, results, patrimonyChartVisibility, updateInvestment } = useCalculator();
  const [showPerCertificate, setShowPerCertificate] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['summary', 'comparison']);
  
  // Estados para edición directa
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<Record<string, number>>({});

  if (!results) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Calculando resultados...</p>
          <p className="text-gray-500 text-sm mt-2">Por favor espera mientras procesamos los datos</p>
        </div>
      </div>
    );
  }

  // Debug: Log custom investment values
  console.log('Custom Investment Debug:', {
    name: investment.customInvestmentName,
    rate: investment.customInvestmentRate,
    patrimony: results.customInvestmentPatrimony,
    realPatrimony: results.realCustomInvestmentPatrimony
  });

  // Get detailed certificate evolution and phases
  const certificateEvolution = getDetailedCertificateEvolution(investment);
  const phases = getCertificatePhasesSummary(certificateEvolution, investment.years);

  const { 
    finalMonthlyIncome, 
    finalPatrimony, 
    capitalMultiplier, 
    cagr, 
    certificatesSummary,
    passiveIncomeEfficiency,
    paybackYear,
    irr,
  } = results;

  // Calculate per certificate values
  const totalCertificates = certificatesSummary.totalCertificates;
  const perCertificateValues = {
    monthlyIncome: finalMonthlyIncome / totalCertificates,
    patrimony: finalPatrimony / totalCertificates,
  };

  // Get the last year data for cash out summary
  const lastYearData = results.yearlyData[results.yearlyData.length - 1];
  const monthlyPartialCashOut = investment.partialCashOut ? 
    (lastYearData.partialCashOutAmount || 0) / 12 : 0;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      if (prev.includes(section)) {
        return prev.filter(s => s !== section);
      } else {
        return [...prev, section];
      }
    });
  };

  // Funciones para edición directa
  const startEditing = (field: string, currentValue: number) => {
    setEditingField(field);
    setTempValues({ [field]: currentValue });
  };

  const saveEdit = (field: string) => {
    const value = tempValues[field];
    if (value !== undefined) {
      updateInvestment({ [field]: value });
    }
    setEditingField(null);
    setTempValues({});
  };

  const cancelEdit = () => {
    setEditingField(null);
    setTempValues({});
  };

  const handleKeyPress = (e: React.KeyboardEvent, field: string) => {
    if (e.key === 'Enter') {
      saveEdit(field);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  // Componente para tarjetas editables
  const EditableCard: React.FC<{
    title: string;
    field: string;
    value: number;
    unit: string;
    icon: React.ComponentType<any>;
    color: string;
    min?: number;
    max?: number;
    step?: number;
    presets?: { label: string; value: number }[];
    formatValue?: (value: number) => string;
  }> = ({ 
    title, 
    field, 
    value, 
    unit, 
    icon: Icon, 
    color, 
    min = 0, 
    max = 100, 
    step = 1, 
    presets = [],
    formatValue = (v) => v.toString()
  }) => {
    const isEditing = editingField === field;
    const tempValue = tempValues[field] ?? value;

    return (
      <div className={`bg-gradient-to-br from-${color}-50 to-${color}-100 p-4 rounded-xl shadow-sm border border-${color}-200`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 bg-${color}-200 rounded-lg flex items-center justify-center`}>
              <Icon className={`w-4 h-4 text-${color}-700`} />
            </div>
            <h4 className={`font-medium text-${color}-800 text-sm`}>{title}</h4>
          </div>
          {!isEditing && (
            <button
              onClick={() => startEditing(field, value)}
              className={`p-1 rounded-md hover:bg-${color}-200 transition-colors`}
              title="Editar valor"
            >
              <Edit3 className={`w-4 h-4 text-${color}-600`} />
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={tempValue}
                onChange={(e) => setTempValues(prev => ({ ...prev, [field]: Number(e.target.value) }))}
                onKeyPress={(e) => handleKeyPress(e, field)}
                min={min}
                max={max}
                step={step}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <span className={`text-${color}-700 font-medium text-sm`}>{unit}</span>
            </div>

            {presets.length > 0 && (
              <div className="grid grid-cols-2 gap-1">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setTempValues(prev => ({ ...prev, [field]: preset.value }))}
                    className={`py-1 px-2 text-xs rounded-md transition-colors ${
                      tempValue === preset.value
                        ? `bg-${color}-600 text-white`
                        : `bg-${color}-200 text-${color}-700 hover:bg-${color}-300`
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => saveEdit(field)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Check className="w-4 h-4" />
                <span className="text-xs">Guardar</span>
              </button>
              <button
                onClick={cancelEdit}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="text-xs">Cancelar</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center cursor-pointer" onClick={() => startEditing(field, value)}>
            <div className={`text-2xl font-bold text-${color}-700 mb-1`}>
              {formatValue(value)}
            </div>
            <div className={`text-sm text-${color}-600`}>{unit}</div>
            <div className="text-xs text-gray-500 mt-1">Clic para editar</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Datos Rápidos - Edición Directa */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Edit3 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-800">Datos Rápidos - Edición Directa</h3>
            <p className="text-sm text-blue-600">Haz clic en cualquier valor para editarlo directamente</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <EditableCard
            title="Certificados"
            field="initialCertificates"
            value={investment.initialCertificates}
            unit="certificados iniciales"
            icon={Target}
            color="blue"
            min={1}
            max={20}
            step={1}
            presets={[
              { label: '1', value: 1 },
              { label: '3', value: 3 },
              { label: '5', value: 5 },
              { label: '10', value: 10 }
            ]}
          />
          
          <EditableCard
            title="Precio Base"
            field="certificateBasePrice"
            value={investment.certificateBasePrice}
            unit="por certificado"
            icon={DollarSign}
            color="green"
            min={200000}
            max={300000}
            step={1000}
            presets={[
              { label: '250K', value: 250000 },
              { label: '263K', value: 263000 },
              { label: '275K', value: 275000 }
            ]}
            formatValue={(v) => `$${(v / 1000).toFixed(0)}K`}
          />
          
          <EditableCard
            title="Horizonte"
            field="years"
            value={investment.years}
            unit="años"
            icon={Calendar}
            color="purple"
            min={5}
            max={30}
            step={1}
            presets={[
              { label: '15', value: 15 },
              { label: '20', value: 20 },
              { label: '25', value: 25 },
              { label: '30', value: 30 }
            ]}
          />
          
          <EditableCard
            title="Producción"
            field="averageProductionPerHectare"
            value={investment.averageProductionPerHectare}
            unit="kg/hectárea"
            icon={BarChart3}
            color="orange"
            min={15000}
            max={40000}
            step={1000}
            presets={[
              { label: '25K', value: 25000 },
              { label: '30K', value: 30000 },
              { label: '35K', value: 35000 }
            ]}
            formatValue={(v) => `${(v / 1000).toFixed(0)}K`}
          />
          
          <EditableCard
            title="Precio/Kg"
            field="averageSalePricePerKg"
            value={investment.averageSalePricePerKg}
            unit="MXN/kg"
            icon={TrendingUp}
            color="teal"
            min={20}
            max={50}
            step={1}
            presets={[
              { label: '30', value: 30 },
              { label: '35', value: 35 },
              { label: '38', value: 38 }
            ]}
          />
        </div>
        
        {/* Escenarios de Producción */}
        <div className="space-y-4">
          <h4 className="text-base font-semibold text-blue-800">Escenarios de Producción</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => updateInvestment({ 
                averageProductionPerHectare: 25000,
                averageSalePricePerKg: 30
              })}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                investment.averageProductionPerHectare === 25000 && investment.averageSalePricePerKg === 30
                  ? 'bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-md transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Conservador
            </button>
            
            <button
              onClick={() => updateInvestment({ 
                averageProductionPerHectare: 30000,
                averageSalePricePerKg: 35
              })}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                investment.averageProductionPerHectare === 30000 && investment.averageSalePricePerKg === 35
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Moderado
            </button>
            
            <button
              onClick={() => updateInvestment({ 
                averageProductionPerHectare: 35000,
                averageSalePricePerKg: 38
              })}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                investment.averageProductionPerHectare === 35000 && investment.averageSalePricePerKg === 38
                  ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Optimista
            </button>
          </div>
        </div>
        
        {/* Inversión Total Actualizada */}
        <div className="mt-6 text-center">
          <h4 className="text-base font-semibold text-gray-700 mb-2">Inversión Total Actualizada</h4>
          <div className="text-4xl font-bold text-blue-700 mb-2">
            <AnimatedNumberDisplay
              value={investment.initialCertificates * investment.certificateBasePrice}
              currencyFormat={investment.currencyFormat}
              duration={1.2}
              staggerDelay={0.08}
            />
          </div>
          <div className="text-blue-600 mb-2">
            Utilidad anual calculada: <span className="font-bold">
              {((investment.averageProductionPerHectare * investment.averageSalePricePerKg * 0.1 * 0.65 / investment.certificateBasePrice) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="text-sm text-gray-600">
            {investment.averageProductionPerHectare.toLocaleString()} kg/ha × ${investment.averageSalePricePerKg}/kg × 0.1 × 0.65
          </div>
        </div>
      </div>

      {/* Expandable Sections */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection('summary')}
          className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-green-600" />
            <h3 className="font-medium text-gray-800">Métricas Detalladas</h3>
          </div>
          {expandedSections.includes('summary') ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            expandedSections.includes('summary') ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-6 space-y-8">
            {/* Returns */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-green-600" />
                <h4 className="text-lg font-medium text-gray-800">Rendimientos</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <SlideUp delay={0.2} duration={0.7}>
                  <PulseGlow color="green" intensity="medium">
                    <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <motion.div
                        className="flex items-center gap-3 mb-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <motion.div
                          className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <DollarSign className="w-6 h-6 text-green-600" />
                        </motion.div>
                        <h4 className="font-bold text-green-800 text-lg">Ingreso Mensual Estimado</h4>
                      </motion.div>

                      <motion.div
                        className="flex items-baseline gap-2"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4, type: "spring" }}
                      >
                        <div className="text-3xl font-extrabold text-green-800">
                          <AnimatedNumberDisplay
                            value={showPerCertificate ? perCertificateValues.monthlyIncome : finalMonthlyIncome}
                            currencyFormat={investment.currencyFormat}
                            duration={1.5}
                            staggerDelay={0.1}
                          />
                        </div>
                        <motion.span
                          className="text-sm text-green-600 font-medium"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {showPerCertificate ? '/certificado' : 'total'}
                        </motion.span>
                      </motion.div>

                      <div className="mt-4">
                        <ProgressBar
                          progress={Math.min((finalMonthlyIncome / (finalPatrimony * 0.02)) * 100, 100)}
                          duration={1.5}
                          delay={0.5}
                          color="bg-gradient-to-r from-green-400 to-green-600"
                          height="h-3"
                          showPercentage={false}
                        />
                      </div>

                      {investment.partialCashOut && (
                        <motion.div
                          className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-amber-700 font-medium">Retiro Parcial ({investment.cashOutPercentage}%):</span>
                            <span className="font-bold text-amber-800">
                              {formatCurrency(monthlyPartialCashOut, investment.currencyFormat)}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </PulseGlow>
                </SlideUp>

                <SlideUp delay={0.4} duration={0.7}>
                  <PulseGlow color="blue" intensity="medium">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <motion.div
                        className="flex items-center gap-3 mb-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <motion.div
                          className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"
                          animate={{ rotate: [0, -5, 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <TrendingUp className="w-6 h-6 text-blue-600" />
                        </motion.div>
                        <h4 className="font-bold text-blue-800 text-lg">Patrimonio Final Estimado</h4>
                      </motion.div>

                      <motion.div
                        className="flex items-baseline gap-2"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6, type: "spring" }}
                      >
                        <div className="text-3xl font-extrabold text-blue-800">
                          <AnimatedNumberDisplay
                            value={showPerCertificate ? perCertificateValues.patrimony : finalPatrimony}
                            currencyFormat={investment.currencyFormat}
                            duration={1.5}
                            staggerDelay={0.1}
                          />
                        </div>
                        <motion.span
                          className="text-sm text-blue-600 font-medium"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {showPerCertificate ? '/certificado' : 'total'}
                        </motion.span>
                      </motion.div>

                      <div className="mt-4">
                        <ProgressBar
                          progress={Math.min((capitalMultiplier / 10) * 100, 100)}
                          duration={1.5}
                          delay={0.7}
                          color="bg-gradient-to-r from-blue-400 to-blue-600"
                          height="h-3"
                          showPercentage={false}
                        />
                      </div>
                    </div>
                  </PulseGlow>
                </SlideUp>
              </div>

              <div className="flex justify-end">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPerCertificate}
                    onChange={() => setShowPerCertificate(!showPerCertificate)}
                    className="form-checkbox h-4 w-4 text-green-600 rounded transition-colors duration-200"
                  />
                  <span className="ml-2 text-sm text-gray-600">Mostrar por Certificado</span>
                </label>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h4 className="text-lg font-medium text-gray-800">Métricas Estimadas de Rendimiento</h4>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScaleIn delay={0.2} duration={0.6}>
                  <motion.div
                    className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl shadow-lg border-2 border-transparent hover:border-green-300"
                    whileHover={{ scale: 1.08, rotate: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <motion.div
                        className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Award className="w-5 h-5 text-green-600" />
                      </motion.div>
                      <h4 className="text-sm font-bold text-green-700">Multiplicador Estimado</h4>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl font-extrabold text-green-800">
                        <AnimatedNumberDisplay
                          value={capitalMultiplier}
                          currencyFormat="MXN"
                          duration={1.5}
                          staggerDelay={0.08}
                          isCurrency={false}
                        />x
                      </div>
                      <motion.div
                        animate={{ y: [-2, 2, -2], rotate: [0, 15, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowUpRight className="w-5 h-5 text-green-600" />
                      </motion.div>
                    </div>
                  </motion.div>
                </ScaleIn>

                <ScaleIn delay={0.3} duration={0.6}>
                  <motion.div
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl shadow-lg border-2 border-transparent hover:border-blue-300"
                    whileHover={{ scale: 1.08, rotate: -1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <motion.div
                        className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                      >
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                      </motion.div>
                      <h4 className="text-sm font-bold text-blue-700">CAGR Estimado</h4>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl font-extrabold text-blue-800">
                        <AnimatedNumberDisplay
                          value={cagr * 100}
                          currencyFormat="MXN"
                          duration={1.5}
                          staggerDelay={0.08}
                          isCurrency={false}
                        />%
                      </div>
                      <motion.div
                        animate={{ y: [-2, 2, -2], rotate: [0, 15, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowUpRight className="w-5 h-5 text-blue-600" />
                      </motion.div>
                    </div>
                  </motion.div>
                </ScaleIn>

                <ScaleIn delay={0.4} duration={0.6}>
                  <motion.div
                    className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl shadow-lg border-2 border-transparent hover:border-purple-300"
                    whileHover={{ scale: 1.08, rotate: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <motion.div
                        className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                      >
                        <Zap className="w-5 h-5 text-purple-600" />
                      </motion.div>
                      <h4 className="text-sm font-bold text-purple-700">TIR Estimada</h4>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl font-extrabold text-purple-800">
                        <AnimatedNumberDisplay
                          value={irr * 100}
                          currencyFormat="MXN"
                          duration={1.5}
                          staggerDelay={0.08}
                          isCurrency={false}
                        />%
                      </div>
                      <motion.div
                        animate={{ y: [-2, 2, -2], rotate: [0, 15, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowUpRight className="w-5 h-5 text-purple-600" />
                      </motion.div>
                    </div>
                  </motion.div>
                </ScaleIn>

                <ScaleIn delay={0.5} duration={0.6}>
                  <motion.div
                    className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-xl shadow-lg border-2 border-transparent hover:border-amber-300"
                    whileHover={{ scale: 1.08, rotate: -1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <motion.div
                        className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                      >
                        <Shield className="w-5 h-5 text-amber-600" />
                      </motion.div>
                      <h4 className="text-sm font-bold text-amber-700">Recuperación Estimada</h4>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl font-extrabold text-amber-800">
                        {paybackYear ? (
                          <>
                            Año <AnimatedNumberDisplay
                              value={paybackYear}
                              currencyFormat="MXN"
                              duration={1.5}
                              staggerDelay={0.08}
                              isCurrency={false}
                            />
                          </>
                        ) : 'N/A'}
                      </div>
                      {paybackYear && (
                        <motion.div
                          animate={{ y: [2, -2, 2], rotate: [0, -15, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowDownRight className="w-5 h-5 text-amber-600" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </ScaleIn>
              </div>
            </div>
            
            {/* Reinvestment Status */}
            {investment.reinvestProfits && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h4 className="font-medium text-indigo-800">Estado de Reinversión</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-indigo-600 mb-1">Fondo de Reinversión:</div>
                    <div className="text-xl font-bold text-indigo-800 relative overflow-hidden">
                      <AnimatedNumberDisplay
                        value={lastYearData.reinvestmentFund || 0}
                        currencyFormat={investment.currencyFormat}
                        duration={1.2}
                        staggerDelay={0.08}
                      />
                    </div>
                    <div className="text-xs text-indigo-500 mt-1">
                      Acumulado para próximos certificados
                    </div>
                  </div>
                  
                  {investment.partialCashOut && (
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-sm text-amber-600 mb-1">Retiro Parcial ({investment.cashOutPercentage}%):</div>
                      <div className="text-xl font-bold text-amber-800 relative overflow-hidden">
                        <AnimatedNumberDisplay
                          value={monthlyPartialCashOut}
                          currencyFormat={investment.currencyFormat}
                          duration={1.2}
                          staggerDelay={0.08}
                        />
                      </div>
                      <div className="text-xs text-amber-500 mt-1">
                        Mensual / {formatCurrency(monthlyPartialCashOut * 12, investment.currencyFormat)} anual
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection('comparison')}
          className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="font-medium text-gray-800">Comparativa de Inversiones</h3>
          </div>
          {expandedSections.includes('comparison') ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            expandedSections.includes('comparison') ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <SlideUp delay={0.1}>
                <motion.div
                  className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl shadow-lg border-l-4 border-green-500"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <motion.div
                      className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </motion.div>
                    <h4 className="text-sm font-bold text-green-700">Cosecha Capital{patrimonyChartVisibility.showReal ? ' (Real)' : ''}</h4>
                  </div>
                  <div className="text-3xl font-extrabold text-green-800 mb-2">
                    <AnimatedNumberDisplay
                      value={patrimonyChartVisibility.showReal ? results.realFinalPatrimony : finalPatrimony}
                      currencyFormat={investment.currencyFormat}
                      duration={1.8}
                      staggerDelay={0.12}
                    />
                  </div>
                  <div className="text-sm font-semibold text-green-600 flex items-center gap-1">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                    100% (referencia)
                  </div>
                </motion.div>
              </SlideUp>

              <SlideUp delay={0.2}>
                <motion.div
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl shadow-lg border-l-4 border-blue-500"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <motion.div
                      className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                    >
                      <Activity className="w-5 h-5 text-blue-600" />
                    </motion.div>
                    <h4 className="text-sm font-bold text-blue-700">CETES{patrimonyChartVisibility.showReal ? ' (Real)' : ''}</h4>
                  </div>
                  <div className="text-3xl font-extrabold text-blue-800 mb-2">
                    <AnimatedNumberDisplay
                      value={patrimonyChartVisibility.showReal ? results.realCetesPatrimony : results.cetesPatrimony}
                      currencyFormat={investment.currencyFormat}
                      duration={1.8}
                      staggerDelay={0.12}
                    />
                  </div>
                  <div className="text-sm font-semibold text-blue-600 flex items-center gap-1">
                    <span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
                    {formatPercent(patrimonyChartVisibility.showReal ?
                      (results.realCetesPatrimony / results.realFinalPatrimony) * 100 :
                      (results.cetesPatrimony / finalPatrimony) * 100)}
                  </div>
                </motion.div>
              </SlideUp>

              <SlideUp delay={0.3}>
                <motion.div
                  className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl shadow-lg border-l-4 border-purple-500"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <motion.div
                      className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center"
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                    >
                      <DollarSign className="w-5 h-5 text-purple-600" />
                    </motion.div>
                    <h4 className="text-sm font-bold text-purple-700">Ahorro Tradicional{patrimonyChartVisibility.showReal ? ' (Real)' : ''}</h4>
                  </div>
                  <div className="text-3xl font-extrabold text-purple-800 mb-2">
                    <AnimatedNumberDisplay
                      value={patrimonyChartVisibility.showReal ? results.realSavingsPatrimony : results.savingsPatrimony}
                      currencyFormat={investment.currencyFormat}
                      duration={1.8}
                      staggerDelay={0.12}
                    />
                  </div>
                  <div className="text-sm font-semibold text-purple-600 flex items-center gap-1">
                    <span className="inline-block w-3 h-3 bg-purple-500 rounded-full"></span>
                    {formatPercent(patrimonyChartVisibility.showReal ?
                      (results.realSavingsPatrimony / results.realFinalPatrimony) * 100 :
                      (results.savingsPatrimony / finalPatrimony) * 100)}
                  </div>
                </motion.div>
              </SlideUp>

              <SlideUp delay={0.4}>
                <motion.div
                  className="bg-gradient-to-br from-orange-50 to-red-50 p-5 rounded-xl shadow-lg border-l-4 border-orange-500"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <motion.div
                      className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center"
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    >
                      <Target className="w-5 h-5 text-orange-600" />
                    </motion.div>
                    <h4 className="text-sm font-bold text-orange-700">Bienes Raíces{patrimonyChartVisibility.showReal ? ' (Real)' : ''}</h4>
                  </div>
                  <div className="text-3xl font-extrabold text-orange-800 mb-2">
                    <AnimatedNumberDisplay
                      value={patrimonyChartVisibility.showReal ? results.realRealEstatePatrimony : results.realEstatePatrimony}
                      currencyFormat={investment.currencyFormat}
                      duration={1.8}
                      staggerDelay={0.12}
                    />
                  </div>
                  <div className="text-sm font-semibold text-orange-600 flex items-center gap-1">
                    <span className="inline-block w-3 h-3 bg-orange-500 rounded-full"></span>
                    {formatPercent(patrimonyChartVisibility.showReal ?
                      (results.realRealEstatePatrimony / results.realFinalPatrimony) * 100 :
                      (results.realEstatePatrimony / finalPatrimony) * 100)}
                  </div>
                </motion.div>
              </SlideUp>

              <SlideUp delay={0.5}>
                <motion.div
                  className="bg-gradient-to-br from-pink-50 to-rose-50 p-5 rounded-xl shadow-lg border-l-4 border-pink-500"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <motion.div
                      className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center"
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
                    >
                      <Target className="w-5 h-5 text-pink-600" />
                    </motion.div>
                    <h4 className="text-sm font-bold text-pink-700">{investment.customInvestmentName || 'Valor Estimado'}{patrimonyChartVisibility.showReal ? ' (Real)' : ''}</h4>
                  </div>
                  <div className="text-3xl font-extrabold text-pink-800 mb-2">
                    {results.customInvestmentPatrimony ? (
                      <AnimatedNumberDisplay
                        value={patrimonyChartVisibility.showReal ? results.realCustomInvestmentPatrimony : results.customInvestmentPatrimony}
                        currencyFormat={investment.currencyFormat}
                        duration={1.8}
                        staggerDelay={0.12}
                      />
                    ) : (
                      <div className="text-red-600">No data</div>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-pink-600 flex items-center gap-1">
                    <span className="inline-block w-3 h-3 bg-pink-500 rounded-full"></span>
                    {results.customInvestmentPatrimony ? formatPercent(patrimonyChartVisibility.showReal ?
                      (results.realCustomInvestmentPatrimony / results.realFinalPatrimony) * 100 :
                      (results.customInvestmentPatrimony / finalPatrimony) * 100) : 'ROI: 0%'}
                  </div>
                </motion.div>
              </SlideUp>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Notas sobre la Comparación:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>Todas las comparaciones asumen la misma inversión inicial</li>
                <li>CETES: Rendimiento anual del {investment.cetesRate}%</li>
                <li>Ahorro Tradicional: Rendimiento anual del {investment.savingsRate}%</li>
                <li>Bienes Raíces: Apreciación anual del {investment.realEstateAppreciation}% + Renta del {investment.realEstateRent}%</li>
                <li>{investment.customInvestmentName || 'Valor Estimado'}: Rendimiento anual del {investment.customInvestmentRate}%</li>
                {investment.applyTaxes && (
                  <li>Se aplican impuestos del {investment.taxRate}% a los rendimientos de inversiones tradicionales</li>
                )}
                {patrimonyChartVisibility.showReal && (
                  <li>Los valores mostrados están ajustados por inflación (valores reales) para todas las inversiones</li>
                )}
                <li>El valor EBITDA se calcula multiplicando las utilidades anuales por un factor de {investment.ebitdaFactor}x</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Configuration Controls */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection('quickConfig')}
          className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-green-600" />
            <h3 className="font-medium text-gray-800">Configuración Rápida</h3>
          </div>
          {expandedSections.includes('quickConfig') ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            expandedSections.includes('quickConfig') ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-6 space-y-6">
            {/* Certificados Iniciales */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-blue-600" />
                </div>
                <h4 className="text-lg font-medium text-gray-800">Certificados Iniciales</h4>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={() => {
                    if (investment.initialCertificates > 1) {
                      updateInvestment({ initialCertificates: investment.initialCertificates - 1 });
                    }
                  }}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  disabled={investment.initialCertificates <= 1}
                >
                  <Minus className="w-5 h-5 text-gray-700" />
                </button>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {investment.initialCertificates}
                  </div>
                  <div className="text-sm text-blue-600">certificados</div>
                </div>
                <button 
                  onClick={() => {
                    if (investment.initialCertificates < 20) {
                      updateInvestment({ initialCertificates: investment.initialCertificates + 1 });
                    }
                  }}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  disabled={investment.initialCertificates >= 20}
                >
                  <Plus className="w-5 h-5 text-gray-700" />
                </button>
              </div>
              
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={investment.initialCertificates}
                onChange={(e) => updateInvestment({ initialCertificates: parseInt(e.target.value) })}
                className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Horizonte de Inversión */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                <h4 className="text-lg font-medium text-gray-800">Horizonte de Inversión</h4>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={() => {
                    if (investment.years > 5) {
                      updateInvestment({ years: investment.years - 1 });
                    }
                  }}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  disabled={investment.years <= 5}
                >
                  <Minus className="w-5 h-5 text-gray-700" />
                </button>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {investment.years}
                  </div>
                  <div className="text-sm text-purple-600">años</div>
                </div>
                <button 
                  onClick={() => {
                    if (investment.years < 30) {
                      updateInvestment({ years: investment.years + 1 });
                    }
                  }}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  disabled={investment.years >= 30}
                >
                  <Plus className="w-5 h-5 text-gray-700" />
                </button>
              </div>
              
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={investment.years}
                onChange={(e) => updateInvestment({ years: parseInt(e.target.value) })}
                className="w-full h-2 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Utilidad Anual */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-green-600" />
                </div>
                <h4 className="text-lg font-medium text-gray-800">Utilidad Anual</h4>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={() => {
                    if (investment.annualProfit > 10) {
                      updateInvestment({ annualProfit: investment.annualProfit - 1 });
                    }
                  }}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  disabled={investment.annualProfit <= 10}
                >
                  <Minus className="w-5 h-5 text-gray-700" />
                </button>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {investment.annualProfit}%
                  </div>
                  <div className="text-sm text-green-600">anual</div>
                </div>
                <button 
                  onClick={() => {
                    if (investment.annualProfit < 30) {
                      updateInvestment({ annualProfit: investment.annualProfit + 1 });
                    }
                  }}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  disabled={investment.annualProfit >= 30}
                >
                  <Plus className="w-5 h-5 text-gray-700" />
                </button>
              </div>
              
              <input
                type="range"
                min="10"
                max="30"
                step="1"
                value={investment.annualProfit}
                onChange={(e) => updateInvestment({ annualProfit: parseInt(e.target.value) })}
                className="w-full h-2 bg-gradient-to-r from-green-200 to-green-300 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Incremento Precio Limón */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-yellow-600" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-800">Incremento Precio Limón</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Activado:</span>
                  <button
                    onClick={() => updateInvestment({ increaseLemonPrice: !investment.increaseLemonPrice })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      investment.increaseLemonPrice ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        investment.increaseLemonPrice ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
              
              {investment.increaseLemonPrice && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <button 
                      onClick={() => {
                        if (investment.lemonPriceIncrease > 0) {
                          updateInvestment({ lemonPriceIncrease: Math.round((investment.lemonPriceIncrease - 0.5) * 10) / 10 });
                        }
                      }}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      disabled={investment.lemonPriceIncrease <= 0}
                    >
                      <Minus className="w-5 h-5 text-gray-700" />
                    </button>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {investment.lemonPriceIncrease}%
                      </div>
                      <div className="text-sm text-yellow-600">incremento anual</div>
                    </div>
                    <button 
                      onClick={() => {
                        if (investment.lemonPriceIncrease < 10) {
                          updateInvestment({ lemonPriceIncrease: Math.round((investment.lemonPriceIncrease + 0.5) * 10) / 10 });
                        }
                      }}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      disabled={investment.lemonPriceIncrease >= 10}
                    >
                      <Plus className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                  
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={investment.lemonPriceIncrease}
                    onChange={(e) => updateInvestment({ lemonPriceIncrease: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gradient-to-r from-yellow-200 to-yellow-300 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Impuestos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-red-600" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-800">Aplicar Impuestos</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Activado:</span>
                  <button
                    onClick={() => updateInvestment({ applyTaxes: !investment.applyTaxes })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      investment.applyTaxes ? 'bg-red-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        investment.applyTaxes ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
              
              {investment.applyTaxes && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <button 
                      onClick={() => {
                        if (investment.taxRate > 0) {
                          updateInvestment({ taxRate: investment.taxRate - 1 });
                        }
                      }}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      disabled={investment.taxRate <= 0}
                    >
                      <Minus className="w-5 h-5 text-gray-700" />
                    </button>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {investment.taxRate}%
                      </div>
                      <div className="text-sm text-red-600">tasa de impuestos</div>
                    </div>
                    <button 
                      onClick={() => {
                        if (investment.taxRate < 50) {
                          updateInvestment({ taxRate: investment.taxRate + 1 });
                        }
                      }}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      disabled={investment.taxRate >= 50}
                    >
                      <Plus className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                  
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={investment.taxRate}
                    onChange={(e) => updateInvestment({ taxRate: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gradient-to-r from-red-200 to-red-300 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Boost de Pago */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-purple-600" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-800">Boost de Pago</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Activado:</span>
                  <button
                    onClick={() => updateInvestment({ enablePaymentBoost: !investment.enablePaymentBoost })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      investment.enablePaymentBoost ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        investment.enablePaymentBoost ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
              
              {investment.enablePaymentBoost && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-700">
                    ⚡ <strong>Boost Activado:</strong> Una vez que los certificados iniciales estén 100% pagados, 
                    continuarás aportando para acelerar la adquisición de nuevos certificados.
                  </p>
                  <div className="mt-2 text-xs text-purple-600">
                    Boost anual estimado: {formatCurrency(
                      (investment.initialCertificates * investment.certificateBasePrice * 0.7) / 4,
                      investment.currencyFormat
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Retiro Parcial */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-amber-600" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-800">Retiro Parcial</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Activado:</span>
                  <button
                    onClick={() => updateInvestment({ partialCashOut: !investment.partialCashOut })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      investment.partialCashOut ? 'bg-amber-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        investment.partialCashOut ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
              
              {investment.partialCashOut && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <button 
                      onClick={() => {
                        if (investment.cashOutPercentage > 0) {
                          updateInvestment({ cashOutPercentage: investment.cashOutPercentage - 5 });
                        }
                      }}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      disabled={investment.cashOutPercentage <= 0}
                    >
                      <Minus className="w-5 h-5 text-gray-700" />
                    </button>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {investment.cashOutPercentage}%
                      </div>
                      <div className="text-sm text-amber-600">retiro anual</div>
                    </div>
                    <button 
                      onClick={() => {
                        if (investment.cashOutPercentage < 100) {
                          updateInvestment({ cashOutPercentage: investment.cashOutPercentage + 5 });
                        }
                      }}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      disabled={investment.cashOutPercentage >= 100}
                    >
                      <Plus className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                  
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={investment.cashOutPercentage}
                    onChange={(e) => updateInvestment({ cashOutPercentage: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gradient-to-r from-amber-200 to-amber-300 rounded-lg appearance-none cursor-pointer"
                  />
                  
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <p className="text-sm text-amber-700">
                      💰 <strong>Retiro Mensual:</strong> {formatCurrency(
                        (results?.finalMonthlyIncome || 0) * (investment.cashOutPercentage / 100),
                        investment.currencyFormat
                      )}
                    </p>
                    <p className="text-xs text-amber-600 mt-1">
                      Reinversión: {100 - investment.cashOutPercentage}% para seguir creciendo
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsSummary;