import React from 'react';
import { useCalculator } from '../../context/CalculatorContext';
import { formatCurrency, convertFromMXN, convertToMXN } from '../../utils/formatters';
import { DollarSign, Target, Calendar, Percent, ChevronRight, ChevronLeft, Plus, Minus, BarChart3, Settings, TrendingUp, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import EditableCard from '../ui/EditableCard';
import { getLanguageContent, getLanguageFromCurrency } from '../../data/languages';

interface ReinvestmentCentralDataProps {
  onNext: () => void;
  onPrevious?: () => void;
}

interface ScenarioData {
  conservador: { motos_mes: number; utilidad: number; tickets: number };
  moderado: { motos_mes: number; utilidad: number; tickets: number };
  optimista: { motos_mes: number; utilidad: number; tickets: number };
}

const ReinvestmentCentralData: React.FC<ReinvestmentCentralDataProps> = ({ onNext, onPrevious }) => {
  const { investment, updateInvestment } = useCalculator();

  const getDefaultScenarioValues = () => {
    return {
      conservador: { motos_mes: 30, utilidad: 900, tickets: 30 },
      moderado: { motos_mes: 40, utilidad: 900, tickets: 30 },
      optimista: { motos_mes: 55, utilidad: 900, tickets: 30 }
    };
  };

  const [scenarioData, setScenarioData] = React.useState<ScenarioData>(getDefaultScenarioValues());
  const [editingScenario, setEditingScenario] = React.useState<string | null>(null);

  React.useEffect(() => {
    const model = investment.ridermexProductType || 'B';
    const numTickets = investment.initialCertificates || 1;
    const manualDiscount = investment.ridermexDiscount !== undefined ? investment.ridermexDiscount : (model === 'C' ? 0 : 30);
    const financingMonths = model === 'B' ? 12 : (model === 'D' ? (investment.ridermexFinancingMonths || 48) : 0);

    const basePrice = model === 'C' ? 120000 : 100000;

    let volumeDiscount = 0;
    if (numTickets >= 10) volumeDiscount = 10;
    else if (numTickets >= 5) volumeDiscount = 5;
    else if (numTickets >= 3) volumeDiscount = 3;

    let financingFactor = 1.0;
    if (model === 'B') {
      financingFactor = 0.83;
    } else if (model === 'D') {
      const months = financingMonths || 48;
      if (months <= 12) {
        financingFactor = 0.83;
      } else if (months >= 48) {
        financingFactor = 1 / 3;
      } else {
        financingFactor = 0.83 - ((months - 12) * (0.496667 / 36));
      }
    }

    const phaseDiscountPercent = manualDiscount * financingFactor;
    const priceAfterDiscount = basePrice * (1 - phaseDiscountPercent / 100) * (1 - volumeDiscount / 100);

    let surchargePercentage = 0;
    const finalPricePerTicket = priceAfterDiscount;

    const isFinanced = model === 'B' || model === 'D';
    const initialPayment = isFinanced ? 10000 * numTickets : finalPricePerTicket * numTickets;

    const newScenarioData = getDefaultScenarioValues();
    setScenarioData(newScenarioData);

    const currentScenario = investment.ridermexScenario || 'moderate';
    const mappedScenarioKey = currentScenario === 'conservative' ? 'conservador' : currentScenario === 'optimistic' ? 'optimista' : 'moderado';
    const scenarioDataValue = newScenarioData[mappedScenarioKey];
    const motos_anual = scenarioDataValue.motos_mes * 12;
    const utilidad_total = motos_anual * scenarioDataValue.utilidad;
    const utilidad_por_ticket = utilidad_total / scenarioDataValue.tickets;
    const roi = (utilidad_por_ticket / finalPricePerTicket) * 100;

    updateInvestment({
      certificateBasePrice: finalPricePerTicket,
      initialPayment: initialPayment,
      ridermexEntryPrice: finalPricePerTicket,
      averageProductionPerHectare: utilidad_total,
      averageSalePricePerKg: roi
    });
  }, [
    investment.ridermexProductType,
    investment.initialCertificates,
    investment.ridermexDiscount,
    investment.ridermexFinancingMonths,
    investment.ridermexScenario
  ]);

  // Get current language content
  const currentLanguage = investment.language || getLanguageFromCurrency(investment.currencyFormat);
  const content = getLanguageContent(currentLanguage);

  // Handlers for increment/decrement buttons
  const handleIncrementTickets = () => {
    if (investment.initialCertificates < 20) {
      updateInvestment({ initialCertificates: investment.initialCertificates + 1 });
    }
  };

  const handleDecrementTickets = () => {
    if (investment.initialCertificates > 1) {
      updateInvestment({ initialCertificates: investment.initialCertificates - 1 });
    }
  };

  const handleIncrementPrice = () => {
    const increment = convertToMXN(500, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR);
    const maxPrice = convertToMXN(100000, 'MXN', investment.exchangeRate, investment.exchangeRateEUR);

    if (investment.certificateBasePrice < maxPrice) {
      updateInvestment({ certificateBasePrice: investment.certificateBasePrice + increment });
    }
  };

  const handleDecrementPrice = () => {
    const decrement = convertToMXN(500, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR);
    const minPrice = convertToMXN(50000, 'MXN', investment.exchangeRate, investment.exchangeRateEUR);

    if (investment.certificateBasePrice > minPrice) {
      updateInvestment({ certificateBasePrice: investment.certificateBasePrice - decrement });
    }
  };

  const handleIncrementYears = () => {
    if (investment.years < 30) {
      updateInvestment({ years: investment.years + 1 });
    }
  };

  const handleDecrementYears = () => {
    if (investment.years > 5) {
      updateInvestment({ years: investment.years - 1 });
    }
  };

  const handleIncrementProfit = () => {
    if (investment.annualProfit < 30) {
      updateInvestment({ annualProfit: investment.annualProfit + 1 });
    }
  };

  const handleDecrementProfit = () => {
    if (investment.annualProfit > 10) {
      updateInvestment({ annualProfit: investment.annualProfit - 1 });
    }
  };

  const handleUpdateScenario = (scenario: keyof ScenarioData, field: 'motos_mes' | 'utilidad' | 'tickets', value: number) => {
    setScenarioData(prev => ({
      ...prev,
      [scenario]: {
        ...prev[scenario],
        [field]: value
      }
    }));
  };

  const calculateROI = (motos_mes: number, utilidad: number, tickets: number) => {
    const motos_anual = motos_mes * 12;
    const utilidad_total = motos_anual * utilidad;
    const utilidad_por_ticket = utilidad_total / tickets;
    const certificatePrice = investment.certificateBasePrice || 70000;
    return (utilidad_por_ticket / certificatePrice) * 100;
  };

  const applyScenario = (scenario: keyof ScenarioData) => {
    const data = scenarioData[scenario];
    const roi = calculateROI(data.motos_mes, data.utilidad, data.tickets);
    
    const scenarioMap: { [key: string]: 'conservative' | 'moderate' | 'optimistic' } = {
      conservador: 'conservative',
      moderado: 'moderate',
      optimista: 'optimistic'
    };

    updateInvestment({
      averageProductionPerHectare: data.motos_mes * 12 * data.utilidad,
      averageSalePricePerKg: roi,
      ridermexScenario: scenarioMap[scenario] || 'moderate'
    });
  };

  React.useEffect(() => {
    const currentScenario = investment.ridermexScenario || 'moderate';
    const mappedScenarioKey = currentScenario === 'conservative' ? 'conservador' : currentScenario === 'optimistic' ? 'optimista' : 'moderado';
    applyScenario(mappedScenarioKey);
  }, []);

  const model = investment.ridermexProductType || 'B';
  const isFinanced = model === 'B' || model === 'D';
  const discountValue = investment.ridermexDiscount !== undefined ? investment.ridermexDiscount : (model === 'C' ? 0 : 30);
  const financingMonths = model === 'B' ? 12 : (investment.ridermexFinancingMonths || 48);

  // Dynamic growth factor (inflation + motorcycle price growth)
  const inflation = investment.inflationRate ?? 3.5;
  const increment = investment.lemonPriceIncrease ?? 1.5;
  const increaseLemonPrice = investment.increaseLemonPrice !== false;
  const growthRate = (increaseLemonPrice ? increment : 0) + inflation;
  const growthFactor = 1 + growthRate / 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-700/50">
        <div className="p-8 space-y-8">
          {/* Header - Clean and Professional */}
          <div className="border-b border-slate-700/50 pb-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Configuración de Inversión</h2>
                <p className="text-slate-400 mt-1">Ajusta los parámetros clave de tu inversión</p>
              </div>
            </div>
          </div>

          {/* Configuration Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Card 1: Tickets (Editable) */}
            <EditableCard
              title="Tickets"
              value={investment.initialCertificates}
              unit="tickets"
              color="#f97316"
              min={1}
              max={30}
              step={1}
              presets={[
                { label: '1', value: 1 },
                { label: '3', value: 3 },
                { label: '5', value: 5 },
                { label: '10', value: 10 },
                { label: '15', value: 15 },
                { label: '20', value: 20 },
                { label: '30', value: 30 }
              ]}
              onChange={(value) => updateInvestment({ initialCertificates: value })}
            />

            {/* Card 2: Descuento Manual (Editable) */}
            <EditableCard
              title="Descuento"
              value={discountValue}
              unit="% manual"
              color="#f97316"
              min={0}
              max={model === 'C' ? 0 : 50}
              step={5}
              presets={model === 'C' ? [{ label: '0%', value: 0 }] : [
                { label: '10%', value: 10 },
                { label: '20%', value: 20 },
                { label: '25%', value: 25 },
                { label: '30%', value: 30 },
                { label: '40%', value: 40 }
              ]}
              onChange={(value) => updateInvestment({ ridermexDiscount: value })}
            />

            {/* Card 3: Precio Final (Read-only calculated value) */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-4 transition-all duration-200"
            >
              <h4 className="font-medium text-neutral-200 text-base mb-2">Precio Final</h4>
              <div className="text-center p-2">
                <div className="font-bold text-2xl mb-1 text-emerald-400">
                  {formatCurrency(convertFromMXN(investment.certificateBasePrice, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR))}
                </div>
                <div className="text-neutral-400 text-sm">por ticket (neto)</div>
              </div>
            </motion.div>

            {/* Card 4: Horizonte (Editable) */}
            <EditableCard
              title="Horizonte"
              value={investment.years}
              unit="años"
              color="#8b5cf6"
              min={5}
              max={30}
              step={1}
              presets={[
                { label: '5', value: 5 },
                { label: '10', value: 10 },
                { label: '15', value: 15 },
                { label: '20', value: 20 },
                { label: '25', value: 25 }
              ]}
              onChange={(value) => updateInvestment({ years: value })}
            />

            {/* Card 5: Plazo Financiamiento (Editable for D, Read-only for B) OR ROI (Read-only for A, C) */}
            {model === 'D' ? (
              <EditableCard
                title="Plazo"
                value={financingMonths}
                unit="meses de financiamiento"
                color="#8b5cf6"
                min={12}
                max={48}
                step={12}
                presets={[
                  { label: '12m', value: 12 },
                  { label: '24m', value: 24 },
                  { label: '36m', value: 36 },
                  { label: '48m', value: 48 }
                ]}
                onChange={(value) => updateInvestment({ ridermexFinancingMonths: value })}
              />
            ) : model === 'B' ? (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-4 transition-all duration-200"
              >
                <h4 className="font-medium text-neutral-200 text-base mb-2">Plazo</h4>
                <div className="text-center p-2">
                  <div className="font-bold text-2xl mb-1 text-purple-400">12 meses</div>
                  <div className="text-neutral-400 text-sm">fijo (Modelo B)</div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-4 transition-all duration-200"
              >
                <h4 className="font-medium text-neutral-200 text-base mb-2">% Rentabilidad</h4>
                <div className="text-center p-2">
                  <div className="font-bold text-base mb-1 text-orange-400 leading-snug">
                    {(investment.averageSalePricePerKg || 0).toFixed(2)}% <span className="text-xs font-normal text-slate-400">ini</span>
                    <br />
                    {(parseFloat((investment.averageSalePricePerKg || 0).toFixed(2)) * Math.pow(growthFactor, investment.years)).toFixed(2)}% <span className="text-xs font-normal text-slate-400">fin</span>
                  </div>
                  <div className="text-neutral-400 text-sm">ROI anual proyectado</div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Escenarios de Rentabilidad */}
          <div className="space-y-4 pt-6 border-t border-slate-700/50">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Escenarios de Rentabilidad</h3>
              <button
                onClick={() => setEditingScenario(editingScenario ? null : 'edit')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors"
              >
                <Settings className="w-4 h-4" />
                {editingScenario ? 'Listo' : 'Editar'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['conservador', 'moderado', 'optimista'] as const).map((scenarioKey) => {
                const data = scenarioData[scenarioKey];
                const roi = calculateROI(data.motos_mes, data.utilidad, data.tickets);
                const scenarioLabels = { conservador: 'Conservador', moderado: 'Moderado', optimista: 'Optimista' };
                const colors = {
                  conservador: 'from-blue-600 to-blue-700',
                  moderado: 'from-emerald-600 to-emerald-700',
                  optimista: 'from-amber-600 to-amber-700'
                };
                const isSelected = investment.ridermexScenario === (scenarioKey === 'conservador' ? 'conservative' : scenarioKey === 'optimista' ? 'optimistic' : 'moderate');

                return (
                  <div key={scenarioKey} className="space-y-3">
                    <motion.div
                      onClick={() => applyScenario(scenarioKey)}
                      whileHover={{ scale: 1.02 }}
                      className={`p-6 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${
                        isSelected
                          ? `bg-gradient-to-br ${colors[scenarioKey]} text-white shadow-xl border-transparent`
                          : 'bg-slate-700/50 text-slate-200 hover:bg-slate-700 border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <div className="font-bold text-center mb-2 text-lg">{scenarioLabels[scenarioKey]}</div>
                      <div className="text-center space-y-1">
                        <div className="text-2xl font-bold">{roi.toFixed(2)}% <span className="text-xs font-normal opacity-85">inicial</span></div>
                        <div className="text-sm opacity-85 leading-none">↓</div>
                        <div className="text-2xl font-bold">{(parseFloat(roi.toFixed(2)) * Math.pow(growthFactor, investment.years)).toFixed(2)}% <span className="text-xs font-normal opacity-85">año {investment.years}</span></div>
                        <div className="text-sm opacity-90 mt-1">ROI Proyectado</div>
                      </div>
                    </motion.div>

                    {editingScenario && (
                      <div className="bg-slate-700/50 rounded-xl p-3 space-y-3 border border-slate-600/50">
                        <div>
                          <label className="text-xs font-medium text-slate-300 block mb-1">Motos/mes</label>
                          <input
                            type="number"
                            value={data.motos_mes}
                            onChange={(e) => handleUpdateScenario(scenarioKey, 'motos_mes', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-slate-600/50 rounded-lg text-sm text-white bg-slate-800/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-300 block mb-1">Utilidad/moto ($)</label>
                          <input
                            type="number"
                            value={data.utilidad}
                            onChange={(e) => handleUpdateScenario(scenarioKey, 'utilidad', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-slate-600/50 rounded-lg text-sm text-white bg-slate-800/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-300 block mb-1">Tickets/agencia</label>
                          <input
                            type="number"
                            value={data.tickets}
                            onChange={(e) => handleUpdateScenario(scenarioKey, 'tickets', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-slate-600/50 rounded-lg text-sm text-white bg-slate-800/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="pt-2 border-t border-slate-600/50 text-xs text-slate-300">
                          <div>Motos/año: {data.motos_mes * 12}</div>
                          <div>Utilidad total: ${(data.motos_mes * 12 * data.utilidad).toLocaleString()}</div>
                          <div>Utilidad/ticket: ${((data.motos_mes * 12 * data.utilidad) / data.tickets).toLocaleString()}</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Investment Summary */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700/50 rounded-2xl p-8 border border-slate-600/50 pt-8 border-t">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Resumen de Inversión</h3>

            {/* Total Investment */}
            <div className="bg-gradient-to-r from-blue-900/40 to-blue-800/40 rounded-xl p-6 mb-6 border border-blue-700/30">
              <div className="text-center">
                <div className="text-sm text-blue-200 mb-2 font-medium">Inversión Total Proyectada en Tickets</div>
                <div className="text-4xl font-bold text-blue-300 mb-3">
                  {formatCurrency(convertFromMXN(investment.initialCertificates * investment.certificateBasePrice, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-3">
                  <span className="text-slate-300">Rentabilidad anual proyectada:</span>
                  <span className="text-2xl font-bold text-emerald-400">
                    {(investment.averageSalePricePerKg).toFixed(2)}% <span className="text-sm font-normal text-slate-300">(inicial)</span> a {(parseFloat((investment.averageSalePricePerKg).toFixed(2)) * Math.pow(growthFactor, investment.years)).toFixed(2)}% <span className="text-sm font-normal text-slate-300">(año {investment.years})</span>
                  </span>
                </div>
                <div className="text-sm text-slate-400">
                  {investment.initialCertificates} ticket{investment.initialCertificates !== 1 ? 's' : ''} × {formatCurrency(convertFromMXN(investment.certificateBasePrice, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)} por ticket
                </div>
              </div>
            </div>

            {(() => {
              const productType = (investment.ridermexProductType as 'A' | 'B' | 'C' | 'D') || 'B';
              const isFinancedModel = productType === 'B' || productType === 'D';
              const totalInvestment = investment.initialCertificates * investment.certificateBasePrice;
              const engancheAmount = isFinancedModel ? 10000 * investment.initialCertificates : totalInvestment;
              const remainingAmount = isFinancedModel ? totalInvestment - engancheAmount : 0;
              const finMonths = productType === 'B' ? 12 : (investment.ridermexFinancingMonths || 48);
              const monthlyPayment = isFinancedModel ? remainingAmount / finMonths : 0;

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Down Payment */}
                  <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/30 rounded-xl p-6 border border-emerald-700/30">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-emerald-600/30 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                      </div>
                      <h4 className="font-semibold text-white">Enganche Inicial</h4>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-300 mb-2">
                        {formatCurrency(convertFromMXN(
                          engancheAmount,
                          investment.currencyFormat,
                          investment.exchangeRate,
                          investment.exchangeRateEUR
                        ), investment.currencyFormat)}
                      </div>
                      {isFinancedModel ? (
                        <>
                          <div className="text-sm text-emerald-200">
                            $10,000 por ticket
                          </div>
                          <div className="text-xs text-slate-400 mt-2">
                            {((engancheAmount / totalInvestment) * 100).toFixed(1)}% de la inversión total
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-emerald-200">Pago de Contado</div>
                      )}
                    </div>
                  </div>

                  {/* Monthly Payments */}
                  <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/30 rounded-xl p-6 border border-amber-700/30">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-amber-600/30 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-amber-400" />
                      </div>
                      <h4 className="font-semibold text-white">
                        {isFinancedModel ? 'Pagos Mensuales' : 'Pago Único'}
                      </h4>
                    </div>
                    <div className="text-center">
                      {isFinancedModel ? (
                        <div>
                          <div className="text-3xl font-bold text-amber-300 mb-2">
                            {formatCurrency(convertFromMXN(
                              monthlyPayment,
                              investment.currencyFormat,
                              investment.exchangeRate,
                              investment.exchangeRateEUR
                            ), investment.currencyFormat)}
                          </div>
                          <div className="text-sm text-amber-200">por {finMonths} meses</div>
                          <div className="text-xs text-slate-400 mt-2">
                            Total financiado: {formatCurrency(convertFromMXN(
                              remainingAmount,
                              investment.currencyFormat,
                              investment.exchangeRate,
                              investment.exchangeRateEUR
                            ), investment.currencyFormat)}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-3xl font-bold text-amber-300 mb-2">
                            {formatCurrency(convertFromMXN(
                              totalInvestment,
                              investment.currencyFormat,
                              investment.exchangeRate,
                              investment.exchangeRateEUR
                            ), investment.currencyFormat)}
                          </div>
                          <div className="text-sm text-amber-200">Pago al inicio</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Custom Payment Schedule Info */}
            {investment.enableCustomPayments && (
              <div className="mt-4 p-4 bg-orange-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span className="font-medium text-orange-800">Cronograma Personalizado Activo</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {investment.enableCustomDownPaymentSchedule && investment.customDownPaymentSchedule.length > 0 && (
                    <div>
                      <div className="font-medium text-orange-700 mb-1">Pagos de Enganche:</div>
                      {investment.customDownPaymentSchedule.map((payment, index) => (
                        <div key={payment.id} className="text-orange-600">
                          • {formatCurrency(convertFromMXN(payment.amount, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)} - {new Date(payment.date).toLocaleDateString('es-MX')}
                        </div>
                      ))}
                    </div>
                  )}
                  {investment.customPaymentSchedule.length > 0 && (
                    <div>
                      <div className="font-medium text-orange-700 mb-1">Primer Pago Mensual:</div>
                      <div className="text-orange-600">
                        {new Date(investment.customPaymentSchedule[0].date).toLocaleDateString('es-MX')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4 pt-6 border-t border-slate-700/50">
            {onPrevious && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onPrevious}
                className="px-8 py-4 bg-slate-700/50 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-3 border border-slate-600/50"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Anterior</span>
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNext}
              className={`px-12 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 text-lg ${!onPrevious ? 'ml-auto' : ''}`}
            >
              <span>Continuar</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReinvestmentCentralData;