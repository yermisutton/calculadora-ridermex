import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, Calculator, Zap, Info, AlertCircle, Check, ChevronDown, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { calculateICMCompoundGrowth, calculateSimpleCompoundGrowth } from '../utils/calculations/compoundGrowth';

interface RetirementICTvsICMProps {
  onBack: () => void;
}

interface YearlyData {
  year: number;
  age: number;
  patrimonyICT: number;
  patrimonyICM: number;
  monthlyIncomeICT: number;
  monthlyIncomeICM: number;
  certificatesICM: number;
  contributionsICT: number;
  contributionsICM: number;
}

type RetirementProfile = 'conservador' | 'moderado' | 'optimista';

const RetirementICTvsICM: React.FC<RetirementICTvsICMProps> = ({ onBack }) => {
  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(65);
  const [initialCertificates, setInitialCertificates] = useState(1);
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [inflationRate, setInflationRate] = useState(4.5);
  const [selectedProfile, setSelectedProfile] = useState<RetirementProfile>('moderado');
  const [reinvestmentPercentage, setReinvestmentPercentage] = useState(100);
  const [showDetailedTable, setShowDetailedTable] = useState(false);

  const certificatePrice = 266000;
  const hectarePerCertificate = 0.1;
  const investorFactor = 0.65;
  const certificateAppreciation = 12;
  const traditionalRate = 18;

  const profiles = {
    conservador: {
      production: 25000,
      pricePerKg: 13,
      lemonIncrease: 3,
      name: 'Conservador',
      icon: '📝'
    },
    moderado: {
      production: 35000,
      pricePerKg: 38,
      lemonIncrease: 5,
      name: 'Moderado',
      icon: '✏️'
    },
    optimista: {
      production: 38000,
      pricePerKg: 50,
      lemonIncrease: 7,
      name: 'Optimista',
      icon: '🎯'
    },
  };

  const currentProfile = profiles[selectedProfile];

  const yearsToRetirement = retirementAge - currentAge;
  const initialInvestment = initialCertificates * certificatePrice;

  const calculateRetirement = () => {
    const years = yearsToRetirement;
    const yearlyData: YearlyData[] = [];
    const waitingPeriod = 4;

    // ICT calculation (simple compound interest)
    let capitalICT = initialInvestment;

    // ICM calculation (siguiendo calculateICMCompoundGrowth)
    let totalCertificatesICM = initialCertificates;
    let totalInvestedInCertificates = initialInvestment;

    for (let year = 1; year <= years; year++) {
      // ICT: Interés compuesto tradicional 18% anual
      capitalICT = initialInvestment * Math.pow(1 + traditionalRate / 100, year);
      const incomeICT = capitalICT * (traditionalRate / 100);

      // ICM: Producción real de limón + reinversión
      let patrimonyICM = totalInvestedInCertificates;
      let monthlyIncomeICM = 0;

      // Solo genera utilidad después del período de espera
      if (year > waitingPeriod) {
        // Precio del limón (aumenta después del año 5)
        let currentLemonPrice = currentProfile.pricePerKg;
        if (year > 5) {
          currentLemonPrice = currentProfile.pricePerKg * Math.pow(1 + currentProfile.lemonIncrease / 100, year - 5);
        }

        // Utilidad por certificado
        const utilityPerCertificate = currentProfile.production * currentLemonPrice * hectarePerCertificate * investorFactor;

        // Utilidad total del año
        const yearlyUtility = totalCertificatesICM * utilityPerCertificate;

        // Precio actual del certificado (aprecia 12% primeros 5 años)
        const currentCertPrice = certificatePrice * Math.pow(1 + certificateAppreciation / 100, Math.min(year, 5));

        // Reinversión (compra más certificados)
        if (reinvestmentPercentage === 100) {
          const newCertificates = yearlyUtility / currentCertPrice;
          totalCertificatesICM += newCertificates;
          totalInvestedInCertificates += yearlyUtility;
        }

        patrimonyICM = totalInvestedInCertificates;
        monthlyIncomeICM = yearlyUtility / 12;
      }

      yearlyData.push({
        year,
        age: currentAge + year,
        patrimonyICT: capitalICT,
        patrimonyICM,
        monthlyIncomeICT: incomeICT / 12,
        monthlyIncomeICM,
        certificatesICM: totalCertificatesICM
      });
    }

    return yearlyData;
  };

  const retirementData = calculateRetirement();
  const finalData = retirementData[retirementData.length - 1];
  const multiplierFactor = (finalData.patrimonyICM / finalData.patrimonyICT).toFixed(2);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const pieChartData = [
    { name: 'ICM', value: finalData.patrimonyICM, color: '#22c55e' },
    { name: 'ICT', value: finalData.patrimonyICT, color: '#3b82f6' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      <div className="sticky top-0 z-50 bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver al inicio</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-green-600" />
            </div>
            <h1 className="text-lg font-bold">Plan de Retiro ICM</h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-green-100">ICT vs ICM</p>
            <p className="text-sm font-bold">Compara ahora</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-green-900 mb-1">¿Tu AFORE es Suficiente?</h3>
              <p className="text-sm text-green-800">
                Mientras los AFORE apuestan a que la inflación desaparezca, CosechaCAPITAL te ofrece un modelo patrimonial
                basado en agronegocios reales que genera rendimientos reales y crecimiento exponencial.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200"
            >
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                <Calculator className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-bold text-gray-900">Configuración de tu Retiro</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <span className="text-purple-600">📅</span>
                    Edad Actual
                  </label>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <p className="text-3xl font-bold text-purple-600">{currentAge} años</p>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="60"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600 mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>18</span>
                    <span>60</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <span className="text-green-600">🎯</span>
                    Edad de Retiro
                  </label>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-3xl font-bold text-green-600">{retirementAge} años</p>
                  </div>
                  <input
                    type="range"
                    min={currentAge + 10}
                    max="75"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600 mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{currentAge + 10}</span>
                    <span>75</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <span className="text-blue-600">💰</span>
                    Número de Certificados
                  </label>
                  <input
                    type="number"
                    value={initialCertificates}
                    onChange={(e) => setInitialCertificates(Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold text-lg"
                    min="1"
                    step="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Inversión: {formatCurrency(initialCertificates * certificatePrice)}
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <span className="text-yellow-600">💵</span>
                    Precio por Certificado
                  </label>
                  <div className="bg-yellow-50 rounded-lg p-3 text-center border-2 border-yellow-200">
                    <p className="text-2xl font-bold text-yellow-600">{formatCurrency(certificatePrice)}</p>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <span className="text-orange-600">📊</span>
                    Aportación Mensual (Opcional)
                  </label>
                  <div className="bg-orange-50 rounded-lg p-3 mb-2">
                    <p className="text-sm text-gray-600">{monthlyContribution === 0 ? 'Sin aportación' : 'Con aportación'}</p>
                    <p className="text-xl font-bold text-orange-600">{formatCurrency(monthlyContribution)}</p>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20000"
                    step="1000"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$0</span>
                    <span>$20k</span>
                  </div>
                </div>

              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200"
            >
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-bold text-gray-900">Escenario de Rendimiento</h2>
              </div>

              <div className="space-y-3">
                {(['conservador', 'moderado', 'optimista'] as RetirementProfile[]).map((profile) => (
                  <button
                    key={profile}
                    onClick={() => setSelectedProfile(profile)}
                    className={`w-full p-4 rounded-xl transition-all text-left ${
                      selectedProfile === profile
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {profiles[profile].icon}
                        </div>
                        <div>
                          <p className="font-bold capitalize">{profiles[profile].name}</p>
                          <p className={`text-xs ${selectedProfile === profile ? 'text-green-100' : 'text-gray-500'}`}>
                            Producción: {profiles[profile].production.toLocaleString()} kg/ha
                          </p>
                        </div>
                      </div>
                      {selectedProfile === profile && (
                        <Check className="w-5 h-5" />
                      )}
                    </div>
                    <div className={`text-xs ${selectedProfile === profile ? 'text-white' : 'text-gray-600'}`}>
                      <p>Precio inicial: {formatCurrency(profiles[profile].pricePerKg)}/kg</p>
                      <p>Incremento anual: {profiles[profile].lemonIncrease}% (después año 5)</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200"
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-600" />
                <h2 className="text-lg font-bold text-gray-900">Reinversión Automática</h2>
              </div>

              <div className="mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reinvestmentPercentage === 100}
                    onChange={(e) => setReinvestmentPercentage(e.target.checked ? 100 : 0)}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Activar Reinversión</p>
                    <p className="text-xs text-gray-500">100% de tus rendimientos se reinvierten automáticamente</p>
                  </div>
                </label>
              </div>

              {reinvestmentPercentage === 100 && (
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="flex items-center gap-2 justify-center mb-2">
                    <p className="text-3xl font-bold text-green-600">{reinvestmentPercentage}%</p>
                  </div>
                  <p className="text-xs text-gray-600 text-center">
                    Todos tus rendimientos compran más certificados, generando efecto multiplicador exponencial.
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl shadow-2xl p-8 text-white"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-6 h-6" />
                    <h2 className="text-2xl font-bold">Tu Plan de Retiro</h2>
                  </div>
                  <p className="text-purple-200 text-sm">Proyección a {yearsToRetirement} años</p>
                </div>
                <div className="text-right">
                  <p className="text-purple-200 text-sm">{initialCertificates} × {formatCurrency(certificatePrice)}</p>
                  <p className="text-3xl font-bold">{formatCurrency(initialInvestment)}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-purple-200 text-xs mb-1">Inversión Inicial</p>
                  <p className="text-2xl font-bold">{formatCurrency(initialInvestment)}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-purple-200 text-xs mb-1">Años hasta Retiro</p>
                  <p className="text-2xl font-bold">{yearsToRetirement}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-purple-200 text-xs mb-1">Aportación Mensual</p>
                  <p className="text-2xl font-bold">{monthlyContribution === 0 ? '$0' : formatCurrency(monthlyContribution)}</p>
                </div>
              </div>

              <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm mb-1">Reinversión Automática</p>
                    <p className="text-3xl font-bold">{reinvestmentPercentage}%</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-yellow-900" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Evolución de tu Patrimonio</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={retirementData}>
                    <defs>
                      <linearGradient id="colorAFORE" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPPR" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorICM" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="age"
                      label={{ value: 'Edad', position: 'insideBottom', offset: -5 }}
                      stroke="#6b7280"
                    />
                    <YAxis
                      tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                      stroke="#6b7280"
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) => `Edad: ${label} años`}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="patrimonyAFORE"
                      name="AFORE (6.5%)"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#colorAFORE)"
                    />
                    <Area
                      type="monotone"
                      dataKey="patrimonyPPR"
                      name="PPR (8%)"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      fill="url(#colorPPR)"
                    />
                    <Area
                      type="monotone"
                      dataKey="patrimonyICM"
                      name="CosechaCAPITAL"
                      stroke="#22c55e"
                      strokeWidth={3}
                      fill="url(#colorICM)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">AFORE</h3>
                    <p className="text-xs opacity-80">Referencia para el Retiro</p>
                  </div>
                </div>
                <p className="text-sm opacity-90 mb-1">Patrimonio final</p>
                <p className="text-2xl font-bold mb-3">{formatCurrency(finalData.patrimonyAFORE)}</p>
                <div className="border-t border-white/20 pt-3">
                  <p className="text-xs opacity-90">Ingreso Mensual</p>
                  <p className="text-lg font-bold">{formatCurrency(finalData.monthlyIncomeAFORE)}</p>
                  <p className="text-xs opacity-75 mt-1">Rendimiento: 6.5% anual</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">PPR</h3>
                    <p className="text-xs opacity-80">Plan Personal de Retiro</p>
                  </div>
                </div>
                <p className="text-sm opacity-90 mb-1">Patrimonio final</p>
                <p className="text-2xl font-bold mb-3">{formatCurrency(finalData.patrimonyPPR)}</p>
                <div className="border-t border-white/20 pt-3">
                  <p className="text-xs opacity-90">Ingreso Mensual</p>
                  <p className="text-lg font-bold">{formatCurrency(finalData.monthlyIncomePPR)}</p>
                  <p className="text-xs opacity-75 mt-1">Rendimiento: 8% anual</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden"
              >
                <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                  {((finalData.patrimonyICM / finalData.patrimonyAFORE) - 1).toFixed(0)}% más
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">CosechaCAPITAL</h3>
                    <p className="text-xs opacity-80">Inversión en Certificados ICM</p>
                  </div>
                </div>
                <p className="text-sm opacity-90 mb-1">Patrimonio final</p>
                <p className="text-2xl font-bold mb-3">{formatCurrency(finalData.patrimonyICM)}</p>
                <div className="border-t border-white/20 pt-3">
                  <p className="text-xs opacity-90">Ingreso Mensual</p>
                  <p className="text-lg font-bold">{formatCurrency(finalData.monthlyIncomeICM)}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {formatNumber(finalData.certificatesICM)} certificados • {currentProfile.utilityRate}% anual
                  </p>
                </div>
              </motion.div>
            </div>

            {showDetailedTable && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl p-6 overflow-x-auto"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Tabla Detallada Año por Año</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-2 px-3">Año</th>
                      <th className="text-left py-2 px-3">Edad</th>
                      <th className="text-right py-2 px-3">AFORE</th>
                      <th className="text-right py-2 px-3">PPR</th>
                      <th className="text-right py-2 px-3">ICM</th>
                      <th className="text-right py-2 px-3">Certificados</th>
                    </tr>
                  </thead>
                  <tbody>
                    {retirementData.map((data, index) => (
                      <tr
                        key={index}
                        className={`border-b border-gray-100 hover:bg-gray-50 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="py-2 px-3 font-medium">{data.year}</td>
                        <td className="py-2 px-3">{data.age}</td>
                        <td className="py-2 px-3 text-right text-blue-600">
                          {formatCurrency(data.patrimonyAFORE)}
                        </td>
                        <td className="py-2 px-3 text-right text-orange-600">
                          {formatCurrency(data.patrimonyPPR)}
                        </td>
                        <td className="py-2 px-3 text-right text-green-600 font-semibold">
                          {formatCurrency(data.patrimonyICM)}
                        </td>
                        <td className="py-2 px-3 text-right text-gray-700">
                          {formatNumber(data.certificatesICM)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Distribución Final del Patrimonio</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${((entry.value / (finalData.patrimonyICM + finalData.patrimonyAFORE + finalData.patrimonyPPR)) * 100).toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col justify-center space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="font-medium text-gray-900">CosechaCAPITAL</span>
                    </div>
                    <span className="font-bold text-green-600">{formatCurrency(finalData.patrimonyICM)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="font-medium text-gray-900">AFORE</span>
                    </div>
                    <span className="font-bold text-blue-600">{formatCurrency(finalData.patrimonyAFORE)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-500 rounded"></div>
                      <span className="font-medium text-gray-900">PPR</span>
                    </div>
                    <span className="font-bold text-orange-600">{formatCurrency(finalData.patrimonyPPR)}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-2xl shadow-2xl p-8 text-white"
            >
              <div className="flex items-start gap-4 mb-6">
                <AlertCircle className="w-8 h-8 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold mb-2">La Diferencia es Clara</h3>
                  <p className="text-white/90 text-lg">Ventaja AFORE vs CosechaCAPITAL</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                  <p className="text-sm mb-2">Ventaja sobre AFORE</p>
                  <p className="text-3xl font-bold">{formatCurrency(finalData.patrimonyICM - finalData.patrimonyAFORE)}</p>
                  <p className="text-sm mt-2 opacity-90">+{((finalData.patrimonyICM / finalData.patrimonyAFORE - 1) * 100).toFixed(1)}% más patrimonio</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                  <p className="text-sm mb-2">Ventaja sobre PPR</p>
                  <p className="text-3xl font-bold">{formatCurrency(finalData.patrimonyICM - finalData.patrimonyPPR)}</p>
                  <p className="text-sm mt-2 opacity-90">+{((finalData.patrimonyICM / finalData.patrimonyPPR - 1) * 100).toFixed(1)}% más patrimonio</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  ¿Por qué CosechaCAPITAL?
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✓</span>
                    <span><strong>Reinversión automática:</strong> Multiplica tu patrimonio sin esfuerzo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✓</span>
                    <span><strong>Producción real:</strong> Ingresos basados en agronegocios productivos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✓</span>
                    <span><strong>Apreciación del certificado:</strong> Tu capital crece mientras produces</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✓</span>
                    <span><strong>Incremento real contra inflación:</strong> Rentabilidad real no ficticia</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-2xl p-8 text-white text-center"
            >
              <h3 className="text-2xl font-bold mb-3">
                No te conformes con un retiro que apenas cubre la inflación
              </h3>
              <p className="text-lg mb-6 text-white/90">
                CosechaCAPITAL te ofrece un retiro basado en activos productivos que generan rendimientos reales.
                No apuestes que la inflación desaparezca, construye un patrimonio real basado en agronegocios que generan valor.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition-colors shadow-lg">
                  Quiero un Retiro Financiero
                </button>
                <button className="bg-orange-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-800 transition-colors border-2 border-white/50">
                  Hablar con un Especialista
                </button>
              </div>
            </motion.div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setShowDetailedTable(!showDetailedTable)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition-colors"
              >
                <PieChart className="w-5 h-5" />
                {showDetailedTable ? 'Ocultar' : 'Ver'} Tabla Detallada
                <ChevronDown className={`w-4 h-4 transition-transform ${showDetailedTable ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetirementICTvsICM;
