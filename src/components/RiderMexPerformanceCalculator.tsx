import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bike, TrendingUp, DollarSign, Users, Zap, ChevronDown, ChevronUp, RotateCcw, Repeat, ArrowRight } from 'lucide-react';
import {
  calculateRiderMexResults,
  DEFAULT_AGENCIES,
  SCENARIOS,
  AgencyData,
  RiderMexParams
} from '../utils/ridermexCalculations';
import { ESCALONES, RIDERMEX_CONFIG, type EscalonData, getDiscountByEscalon } from '../data/ridermexConfig';
import EscalonSelector from './ui/EscalonSelector';
import RiderMexKPIs from './ridermexComponents/RiderMexKPIs';
import RiderMexAgencyTable from './ridermexComponents/RiderMexAgencyTable';
import RiderMexCharts from './ridermexComponents/RiderMexCharts';
import RiderMexExplanation from './ridermexComponents/RiderMexExplanation';
import MonthlyFlowChart from './ridermexComponents/MonthlyFlowChart';

type ScenarioType = 'conservative' | 'base' | 'aggressive' | 'manual';

interface RiderMexPerformanceCalculatorProps {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

const RiderMexPerformanceCalculator: React.FC<RiderMexPerformanceCalculatorProps> = ({ onBack, onNavigate }) => {
  const [scenario, setScenario] = useState<ScenarioType>('base');
  const [selectedEscalon, setSelectedEscalon] = useState(1);
  const [businessScenario, setBusinessScenario] = useState<'conservative' | 'moderate' | 'optimistic'>('moderate');
  const [investmentAmount, setInvestmentAmount] = useState(100000);
  const [pricePerTicket, setPricePerTicket] = useState(100000);
  const [totalTickets, setTotalTickets] = useState(300);
  const [feePerMoto, setFeePerMoto] = useState(RIDERMEX_CONFIG.PROFIT_PER_MOTORCYCLE);
  const [annualInflation, setAnnualInflation] = useState(3.5);
  const [additionalSpread, setAdditionalSpread] = useState(1.5);
  const [years, setYears] = useState(20);
  const [agencies, setAgencies] = useState<AgencyData[]>(DEFAULT_AGENCIES.map((a, i) => ({
    ...a,
    monthlyFee: 0,
    monthlyBonus: 0,
    status: 'inactive' as const
  })));
  const [expandedSections, setExpandedSections] = useState({
    inputs: false,
    explanation: false,
    agencies: true
  });
  const [discount, setDiscount] = useState(getDiscountByEscalon(1));

  const applyScenario = (scenarioType: ScenarioType) => {
    setScenario(scenarioType);
    if (scenarioType !== 'manual') {
      const scenarioData = SCENARIOS[scenarioType];
      const updatedAgencies = agencies.map(agency => {
        const scenarioUpdate = scenarioData.find(s => s.id === agency.id);
        return {
          ...agency,
          monthlySales: scenarioUpdate?.monthlySales ?? agency.monthlySales
        };
      });
      setAgencies(updatedAgencies);
    }
  };

  const handleAgencySalesChange = (agencyId: string, sales: number) => {
    setScenario('manual');
    setAgencies(agencies.map(a =>
      a.id === agencyId ? { ...a, monthlySales: Math.max(0, sales) } : a
    ));
  };

  const handleEscalonChange = (escalon: EscalonData) => {
    setSelectedEscalon(escalon.number);
    setInvestmentAmount(escalon.entryPrice);
    setPricePerTicket(escalon.entryPrice);
    setDiscount(getDiscountByEscalon(escalon.number));
  };

  const handleBusinessScenarioChange = (newScenario: 'conservative' | 'moderate' | 'optimistic') => {
    setBusinessScenario(newScenario);
  };

  const resetValues = () => {
    setSelectedEscalon(1);
    setBusinessScenario('moderate');
    setInvestmentAmount(100000);
    setPricePerTicket(100000);
    setTotalTickets(300);
    setFeePerMoto(RIDERMEX_CONFIG.PROFIT_PER_MOTORCYCLE);
    setAnnualInflation(3.5);
    setAdditionalSpread(1.5);
    setDiscount(getDiscountByEscalon(1));
    setYears(20);
    setAgencies(DEFAULT_AGENCIES.map((a, i) => ({
      ...a,
      monthlyFee: 0,
      monthlyBonus: 0,
      status: 'inactive' as const
    })));
    setScenario('base');
    applyScenario('base');
  };

  const params: RiderMexParams = {
    investmentAmount,
    pricePerTicket,
    totalTickets,
    feePerMoto,
    annualInflation,
    additionalSpread,
    years,
    agencies
  };

  const results = useMemo(() => calculateRiderMexResults(params), [params]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-red-950">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-slate-950 to-red-950 border-b border-red-500/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  ← Volver
                </button>
              )}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                  <Bike className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">RiderMex</h1>
                  <p className="text-xs text-red-400">Calculadora de Rendimiento</p>
                </div>
              </div>
            </div>
            <button
              onClick={resetValues}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Restablecer
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Scenario Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-red-400" />
              Escenarios de Proyección
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { key: 'conservative', label: 'Conservador', desc: 'Ventas bajas' },
                { key: 'base', label: 'Base', desc: 'Ventas normales' },
                { key: 'aggressive', label: 'Agresivo', desc: 'Ventas altas' },
                { key: 'manual', label: 'Manual', desc: 'Personalizado' }
              ].map((s) => (
                <motion.button
                  key={s.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => applyScenario(s.key as ScenarioType)}
                  className={`p-4 rounded-xl transition-all border-2 ${
                    scenario === s.key
                      ? 'bg-gradient-to-br from-red-600 to-red-700 border-red-400 text-white shadow-lg shadow-red-500/50'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="font-semibold">{s.label}</div>
                  <div className="text-xs opacity-70">{s.desc}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Escalon Selector Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <EscalonSelector
            selectedEscalon={selectedEscalon}
            onEscalonChange={handleEscalonChange}
            selectedScenario={businessScenario}
            onScenarioChange={handleBusinessScenarioChange}
            theme="dark"
            showScenarioSelector={false}
          />
        </motion.div>

        {/* Discounts by Escalon Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Descuentos por Escalón
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2">
              {ESCALONES.map((escalon) => {
                const discountValue = getDiscountByEscalon(escalon.number);
                const isSelected = escalon.number === selectedEscalon;
                return (
                  <motion.div
                    key={escalon.number}
                    whileHover={{ scale: 1.05 }}
                    className={`p-3 rounded-lg text-center transition-all border-2 ${
                      isSelected
                        ? 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-cyan-500 shadow-lg shadow-cyan-500/20'
                        : discountValue > 0
                        ? 'bg-slate-800/50 border-slate-700 hover:border-cyan-500/50'
                        : 'bg-slate-800/30 border-slate-700/50'
                    }`}
                  >
                    <div className={`text-xs font-bold uppercase tracking-wide ${isSelected ? 'text-cyan-300' : 'text-slate-400'} mb-1`}>
                      E{escalon.number}
                    </div>
                    <div className={`text-sm font-bold ${
                      discountValue > 0
                        ? isSelected ? 'text-cyan-300' : 'text-cyan-400'
                        : 'text-slate-500'
                    }`}>
                      {discountValue}%
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Additional Inputs Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <button
            onClick={() => setExpandedSections({ ...expandedSections, inputs: !expandedSections.inputs })}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl hover:border-slate-600/50 transition-all"
          >
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-red-400" />
              <h2 className="text-lg font-semibold text-white">Parámetros Avanzados</h2>
            </div>
            {expandedSections.inputs ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {expandedSections.inputs && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
            >
              {[
                { label: 'Inversión Total', value: investmentAmount, onChange: setInvestmentAmount, step: 1000 },
                { label: 'Total Tickets Fondo', value: totalTickets, onChange: setTotalTickets, step: 10 },
                { label: 'Fee Base/Moto (MXN)', value: feePerMoto, onChange: setFeePerMoto, step: 50 },
                { label: 'Inflación Anual (%)', value: annualInflation, onChange: setAnnualInflation, step: 0.1 },
                { label: 'Spread Adicional (%)', value: additionalSpread, onChange: setAdditionalSpread, step: 0.1 },
                { label: 'Años Proyección', value: years, onChange: setYears, step: 1 }
              ].map((input, idx) => (
                <div key={idx} className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">{input.label}</label>
                  <input
                    type="number"
                    value={input.value}
                    onChange={(e) => input.onChange(parseFloat(e.target.value))}
                    step={input.step}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50"
                  />
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Results */}
        <RiderMexKPIs results={results} investmentAmount={investmentAmount} />

        {/* Agency Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <button
            onClick={() => setExpandedSections({ ...expandedSections, agencies: !expandedSections.agencies })}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl hover:border-slate-600/50 transition-all"
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-red-400" />
              <h2 className="text-lg font-semibold text-white">Portafolio de Agencias ({agencies.length})</h2>
            </div>
            {expandedSections.agencies ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {expandedSections.agencies && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <RiderMexAgencyTable
                agencies={agencies}
                onSalesChange={handleAgencySalesChange}
                feePerMoto={feePerMoto}
              />
            </motion.div>
          )}
        </motion.div>

        {/* Charts */}
        <RiderMexCharts results={results} agencies={agencies} />

        {/* Monthly Flow Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <MonthlyFlowChart
            monthlyProjection={results.monthlyProjection}
            investmentAmount={investmentAmount}
          />
        </motion.div>

        {/* ICM Multiplicador CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-slate-800/60 to-green-900/30 border border-green-700/40 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                <Repeat className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">ICM Multiplicador: ICT vs ICM</h3>
                <p className="text-slate-400 text-sm">Compara ambos modelos con escalones RiderMex y perfiles de retiro personalizados</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate?.('icm-multiplicador')}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-all duration-200 whitespace-nowrap flex-shrink-0 shadow-lg shadow-green-900/30"
            >
              Ver comparador
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <button
            onClick={() => setExpandedSections({ ...expandedSections, explanation: !expandedSections.explanation })}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl hover:border-slate-600/50 transition-all"
          >
            <h2 className="text-lg font-semibold text-white">Cómo Funciona el Modelo RiderMex</h2>
            {expandedSections.explanation ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {expandedSections.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <RiderMexExplanation />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RiderMexPerformanceCalculator;
