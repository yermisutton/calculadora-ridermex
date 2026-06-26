import React from 'react';
import { motion } from 'framer-motion';
import { Settings, ChevronRight, Target, DollarSign, Calendar, BarChart3, Zap, TrendingUp } from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';
import { formatCurrency, convertFromMXN, convertToMXN } from '../../utils/formatters';
import EditableCard from '../ui/EditableCard';
import { Toggle } from '../ui/Toggle';

interface SimplifiedStep1ConfigProps {
  onNext: () => void;
}

const SimplifiedStep1Config: React.FC<SimplifiedStep1ConfigProps> = ({ onNext }) => {
  const { investment, updateInvestment } = useCalculator();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-dark-card rounded-3xl shadow-xl overflow-hidden border border-dark-border">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-8 text-white border-b border-neon-green/30">
          <div className="flex items-center gap-6">
            <img
              src="/rider_inversiones.png"
              alt="Ridermex Inversiones"
              className="h-20 w-auto drop-shadow-lg"
            />
            <div className="w-16 h-16 bg-neon-green/20 rounded-2xl flex items-center justify-center">
              <Settings className="w-8 h-8 text-neon-green" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-neutral-50">Configuración Rápida</h2>
              <p className="text-neutral-300 text-lg">Solo los datos esenciales para tu análisis</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Moneda */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-neon-green" />
              <span>Moneda de Análisis</span>
            </h3>

            <div className="grid grid-cols-3 gap-4">
              {[
                { code: 'MXN', flag: '🇲🇽', name: 'Pesos Mexicanos' },
                { code: 'USD', flag: '🇺🇸', name: 'Dólares' },
                { code: 'EUR', flag: '🇪🇺', name: 'Euros' }
              ].map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => updateInvestment({ currencyFormat: currency.code as any })}
                  className={`py-4 px-4 rounded-xl text-center transition-all duration-200 ${
                    investment.currencyFormat === currency.code
                      ? 'bg-gradient-to-br from-neon-green/30 to-emerald-600/30 text-neon-green shadow-lg border-2 border-neon-green'
                      : 'bg-dark-surface text-neutral-300 hover:bg-dark-border border-2 border-dark-border'
                  }`}
                >
                  <div className="text-3xl mb-2">{currency.flag}</div>
                  <div className="font-semibold">{currency.code}</div>
                  <div className={`text-sm ${investment.currencyFormat === currency.code ? 'text-neon-green/80' : 'text-neutral-500'}`}>
                    {currency.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Configuración Básica */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              <span>Configuración Básica</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fila 1: Precio del Ticket de Inversión + Número de Tickets de Inversión */}
              <EditableCard
                title="Costo del Ticket de Inversión"
                value={convertFromMXN(investment.certificateBasePrice, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR)}
                unit="por Ticket de Inversión"
                color="#0ea5e9"
                min={convertFromMXN(200000, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR)}
                max={convertFromMXN(300000, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR)}
                step={convertFromMXN(5000, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR)}
                presets={[
                  { label: '250K', value: convertFromMXN(250000, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR) },
                  { label: '263K', value: convertFromMXN(263000, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR) },
                  { label: '280K', value: convertFromMXN(280000, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR) }
                ]}
                onChange={(value) => {
                  const mxnValue = convertToMXN(value, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR);
                  updateInvestment({ certificateBasePrice: mxnValue });
                }}
                formatValue={(v) => Math.round(v).toLocaleString()}
              />

              <EditableCard
                title="Número de Tickets de Inversión"
                value={investment.initialCertificates}
                unit="Tickets de Inversión"
                color="#3b82f6"
                min={1}
                max={50}
                step={1}
                presets={[
                  { label: '1', value: 1 },
                  { label: '3', value: 3 },
                  { label: '5', value: 5 },
                  { label: '10', value: 10 },
                  { label: '15', value: 15 },
                  { label: '20', value: 20 }
                ]}
                onChange={(value) => updateInvestment({ initialCertificates: value })}
              />

              {/* Fila 2: Escenario de Producción + Plazo de Inversión */}
              <EditableCard
                title="Escenario de Producción"
                value={investment.averageProductionPerHectare}
                unit="kg/ha"
                color="#8b5cf6"
                min={20000}
                max={40000}
                step={1000}
                presets={[
                  { label: 'Conservador', value: 25000 },
                  { label: 'Moderado', value: 30000 },
                  { label: 'Optimista', value: 35000 }
                ]}
                onChange={(value) => updateInvestment({ averageProductionPerHectare: value })}
                formatValue={(v) => {
                  if (v === 25000) return 'Conservador';
                  if (v === 30000) return 'Moderado';
                  if (v === 35000) return 'Optimista';
                  return v.toLocaleString();
                }}
              />

              <EditableCard
                title="Plazo de Inversión"
                value={investment.years}
                unit="años"
                color="#16a34a"
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

              {/* Fila 3: Retiro de Utilidades + Utilidad Anual Esperada */}
              <EditableCard
                title="Retiro de Utilidades"
                value={investment.partialCashOut ? investment.cashOutPercentage : 0}
                unit={investment.partialCashOut ? '% ACTIVO' : 'INACTIVO'}
                color={investment.partialCashOut ? "#ea580c" : "#6b7280"}
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
                  if (value === 0) {
                    updateInvestment({ partialCashOut: false, cashOutPercentage: 0 });
                  } else {
                    updateInvestment({ partialCashOut: true, cashOutPercentage: value });
                  }
                }}
                formatValue={(v) => v === 0 ? 'INACTIVO' : `${v}%`}
              />

              <EditableCard
                title="Utilidad Anual Esperada"
                value={((investment.averageProductionPerHectare * investment.averageSalePricePerKg * 0.1 * 0.65 / investment.certificateBasePrice) * 100)}
                unit="% anual"
                color="#10b981"
                min={15}
                max={30}
                step={0.5}
                presets={[
                  { label: '18%', value: 18 },
                  { label: '20%', value: 20 },
                  { label: '22%', value: 22 },
                  { label: '25%', value: 25 }
                ]}
                onChange={(value) => {
                  // Reverse calculate production and price to achieve target utility
                  const targetUtility = value / 100;
                  const targetAnnualUtility = targetUtility * investment.certificateBasePrice;
                  const targetProductionValue = targetAnnualUtility / (0.1 * 0.65);

                  // Keep price constant, adjust production
                  const newProduction = targetProductionValue / investment.averageSalePricePerKg;
                  updateInvestment({ averageProductionPerHectare: Math.round(newProduction) });
                }}
                formatValue={(v) => `${v.toFixed(1)}%`}
              />
            </div>
          </div>

          {/* Multiplicador */}
          <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-400/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-400/20 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-100">Interés Compuesto Multiplicador</h3>
                <p className="text-neutral-300">Activa la reinversión automática para multiplicar tus activos</p>
              </div>
            </div>

            <div className="text-center mb-6">
              <button
                onClick={() => updateInvestment({ reinvestProfits: !investment.reinvestProfits })}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  investment.reinvestProfits
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                    : 'bg-dark-surface text-neutral-300 hover:bg-dark-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5" />
                  <span>
                    {investment.reinvestProfits ? '✅ Multiplicador ACTIVADO' : '❌ Multiplicador DESACTIVADO'}
                  </span>
                </div>
              </button>
              <p className="text-sm text-neutral-300 mt-2">
                {investment.reinvestProfits
                  ? "Las utilidades se reinvierten automáticamente para adquirir más Tickets de Inversión"
                  : "Las utilidades se reciben como ingreso mensual sin reinversión"
                }
              </p>
            </div>
          </div>

          {/* Resumen de Inversión */}
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border border-blue-400/30 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-neutral-100 mb-6 text-center">Resumen de tu Inversión</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-dark-surface border border-dark-border p-4 rounded-xl shadow-sm text-center">
                <div className="text-sm text-neutral-400 mb-1">Inversión Total</div>
                <div className="text-xl font-bold text-blue-400">
                  {formatCurrency(convertFromMXN(investment.initialCertificates * investment.certificateBasePrice, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR), investment.currencyFormat)}
                </div>
              </div>

              <div className="bg-dark-surface border border-dark-border p-4 rounded-xl shadow-sm text-center">
                <div className="text-sm text-neutral-400 mb-1">Tickets de Inversión</div>
                <div className="text-xl font-bold text-neon-green">{investment.initialCertificates}</div>
              </div>

              <div className="bg-dark-surface border border-dark-border p-4 rounded-xl shadow-sm text-center">
                <div className="text-sm text-neutral-400 mb-1">Plazo</div>
                <div className="text-xl font-bold text-purple-400">{investment.years} años</div>
              </div>

              <div className="bg-dark-surface border border-dark-border p-4 rounded-xl shadow-sm text-center">
                <div className="text-sm text-neutral-400 mb-1">Utilidad Anual</div>
                <div className="text-xl font-bold text-orange-400">
                  {((investment.averageProductionPerHectare * investment.averageSalePricePerKg * 0.1 * 0.65 / investment.certificateBasePrice) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="px-12 py-4 bg-gradient-to-r from-neon-green to-emerald-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 text-lg"
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

export default SimplifiedStep1Config;