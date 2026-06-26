import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, ChevronLeft, ChevronRight, TrendingUp, Calendar, DollarSign, Zap, Calculator, Award, BarChart3 } from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';
import { calculateResults } from '../../utils/calculations';
import { formatCurrency, convertFromMXN } from '../../utils/formatters';
import { compoundMultiplierContent } from '../../data/compoundMultiplierContent';

interface SimplifiedStep2InvestorGoalsProps {
  onNext: () => void;
  onPrevious: () => void;
}

const SimplifiedStep2InvestorGoals: React.FC<SimplifiedStep2InvestorGoalsProps> = ({ onNext, onPrevious }) => {
  const { 
    investment,
    updateInvestment,
    results
  } = useCalculator();

  const calculateRequiredCertificates = (monthlyGoal: number) => {
    const annualGoal = monthlyGoal * 12;
    
    // Test different certificate amounts to find the minimum needed
    for (let testCertificates = 1; testCertificates <= 50; testCertificates++) {
      const testInvestment = {
        ...investment,
        initialCertificates: testCertificates,
        years: investment.investorTimeframe || investment.years,
        reinvestProfits: investment.reinvestProfits
      };
      
      try {
        const testResults = calculateResults(testInvestment);
        if (testResults.finalMonthlyIncome >= monthlyGoal) {
          return testCertificates;
        }
      } catch (error) {
        console.warn('Error in test calculation, using fallback');
        const utilityPerCertificate = investment.averageProductionPerHectare * investment.averageSalePricePerKg * 0.1 * 0.65;
        return Math.ceil(annualGoal / utilityPerCertificate);
      }
    }
    
    return 50;
  };

  const calculateMonthlyIncome = () => {
    try {
      const testInvestment = {
        ...investment,
        reinvestProfits: investment.reinvestProfits
      };
      const testResults = calculateResults(testInvestment);
      return testResults.finalMonthlyIncome;
    } catch (error) {
      const utilityPerCertificate = investment.averageProductionPerHectare * investment.averageSalePricePerKg * 0.1 * 0.65;
      const baseMonthlyIncome = (investment.initialCertificates * utilityPerCertificate) / 12;
      
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
  }, [investment.reinvestProfits]);

  // Preset monthly goals
  const monthlyGoalPresets = [
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-dark-card rounded-3xl shadow-xl overflow-hidden border border-dark-border">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-8 text-white border-b border-purple-400/30">
          <div className="flex items-center gap-6">
            <img
              src="/rider_inversiones.png"
              alt="Ridermex Inversiones"
              className="h-20 w-auto drop-shadow-lg"
            />
            <div className="w-16 h-16 bg-purple-400/20 rounded-2xl flex items-center justify-center">
              <Target className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-neutral-50">Meta del Inversionista</h2>
              <p className="text-neutral-300 text-lg">Define tus objetivos financieros</p>
            </div>
          </div>
        </div>
        
        <div className="p-8 space-y-8">
          {/* Monthly Income Goal */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-100">¿Cuánto Ingreso Pasivo Deseas?</h3>
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
                      ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg'
                      : 'bg-dark-surface text-neutral-300 hover:bg-gray-50 border border-gray-200 hover:border-green-300'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            
            <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/20 border border-neon-green/30 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Meta Mensual Personalizada</label>
                  <input
                    type="number"
                    value={investment.investorMonthlyGoal || 0}
                    onChange={(e) => {
                      const monthlyGoal = parseFloat(e.target.value) || 0;
                      updateInvestment({ investorMonthlyGoal: monthlyGoal });
                      const requiredCerts = calculateRequiredCertificates(monthlyGoal);
                      updateInvestment({ initialCertificates: requiredCerts });
                    }}
                    className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Ingreso mensual deseado"
                  />
                </div>
                <div className="text-center">
                  <div className="text-sm text-green-600 mb-1">Certificados Necesarios</div>
                  <div className="text-3xl font-bold text-green-700">
                    {investment.investorMonthlyGoal ? calculateRequiredCertificates(investment.investorMonthlyGoal) : investment.initialCertificates}
                  </div>
                  <div className="text-sm text-green-600">para tu meta</div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeframe Goal */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-100">¿En Cuánto Tiempo Quieres Lograrlo?</h3>
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
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg'
                      : 'bg-dark-surface text-neutral-300 hover:bg-gray-50 border border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">Plazo Personalizado</label>
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
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Años para alcanzar tu meta"
                  />
                </div>
                <div className="text-center">
                  <div className="text-sm text-blue-600 mb-1">Plazo Seleccionado</div>
                  <div className="text-3xl font-bold text-blue-700">
                    {investment.investorTimeframe || investment.years}
                  </div>
                  <div className="text-sm text-blue-600">años de inversión</div>
                </div>
              </div>
            </div>
          </div>

          {/* Compound Multiplier Button */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-700" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-800">{compoundMultiplierContent.title}</h3>
                <p className="text-purple-600">{compoundMultiplierContent.tagline}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-dark-surface p-4 rounded-xl shadow-sm text-center">
                <div className="text-sm text-gray-600 mb-1">Certificados Iniciales</div>
                <div className="text-2xl font-bold text-green-700">{investment.initialCertificates}</div>
                <div className="text-xs text-green-600">que compras</div>
              </div>
              <div className="bg-dark-surface p-4 rounded-xl shadow-sm text-center">
                <div className="text-sm text-gray-600 mb-1">Certificados Proyectados</div>
                <div className="text-2xl font-bold text-blue-700">
                  {results ? results.certificatesSummary.totalCertificates : '~8'}
                </div>
                <div className="text-xs text-blue-600">que tendrás</div>
              </div>
              <div className="bg-dark-surface p-4 rounded-xl shadow-sm text-center">
                <div className="text-sm text-gray-600 mb-1">Certificados Estimados por Reinversión</div>
                <div className="text-2xl font-bold text-purple-700">
                  +{results ? results.certificatesSummary.fromReinvestment : '~7'}
                </div>
                <div className="text-xs text-purple-600">por reinversión</div>
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => updateInvestment({ reinvestProfits: !investment.reinvestProfits })}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  investment.reinvestProfits
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                    : 'bg-gray-200 text-neutral-300 hover:bg-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5" />
                  <span>
                    {investment.reinvestProfits ? '✅ Multiplicador ACTIVADO' : '❌ Multiplicador DESACTIVADO'}
                  </span>
                </div>
              </button>
              <p className="text-sm text-purple-600 mt-2">
                {investment.reinvestProfits 
                  ? "Las utilidades se reinvierten automáticamente para multiplicar tus activos"
                  : "Las utilidades se reciben como ingreso mensual sin reinversión"
                }
              </p>
            </div>
          </div>

          {/* Current Configuration Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center">
                <Calculator className="w-5 h-5 text-blue-700" />
              </div>
              <h3 className="text-lg font-semibold text-blue-800">Resumen de tu Configuración</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-dark-surface p-4 rounded-xl shadow-sm text-center">
                <div className="text-sm text-gray-600 mb-1">Certificados</div>
                <div className="text-xl font-bold text-green-700">{investment.initialCertificates}</div>
              </div>
              <div className="bg-dark-surface p-4 rounded-xl shadow-sm text-center">
                <div className="text-sm text-gray-600 mb-1">Plazo</div>
                <div className="text-xl font-bold text-blue-700">{investment.investorTimeframe || investment.years} años</div>
              </div>
              <div className="bg-dark-surface p-4 rounded-xl shadow-sm text-center">
                <div className="text-sm text-gray-600 mb-1">Ingreso Proyectado</div>
                <div className="text-xl font-bold text-purple-700">
                  {formatCurrency(calculateMonthlyIncome(), investment.currencyFormat)}
                </div>
              </div>
              <div className="bg-dark-surface p-4 rounded-xl shadow-sm text-center">
                <div className="text-sm text-gray-600 mb-1">Utilidad Anual</div>
                <div className="text-xl font-bold text-orange-700">
                  {((investment.averageProductionPerHectare * investment.averageSalePricePerKg * 0.1 * 0.65 / investment.certificateBasePrice) * 100).toFixed(1)}%
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
              className="px-8 py-4 bg-gray-100 text-neutral-300 font-semibold rounded-2xl hover:bg-gray-200 transition-all duration-300 flex items-center gap-3"
            >
              <ChevronLeft className="w-6 h-6" />
              <span>Anterior</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="px-12 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 text-lg"
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

export default SimplifiedStep2InvestorGoals;