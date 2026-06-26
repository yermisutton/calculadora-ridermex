import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalculator } from '../context/CalculatorContext';
import { formatCurrency } from '../utils/formatters';
import { TrendingUp, Zap, ArrowRight, Sparkles, Target } from 'lucide-react';

const AvalancheEffect: React.FC = () => {
  const { investment, results } = useCalculator();
  const [currentYear, setCurrentYear] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const yearRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  if (!results || !results.yearlyData || results.yearlyData.length === 0) {
    return (
      <div className="w-full bg-gradient-to-br from-blue-900 via-cyan-900 to-blue-900 rounded-3xl p-8 text-white text-center">
        <p className="text-xl">No hay datos de proyecciones disponibles. Por favor, completa los pasos anteriores.</p>
      </div>
    );
  }

  const years = Array.from({ length: investment.years }, (_, i) => i + 1);
  const totalInvestment = investment.initialCertificates * investment.certificateBasePrice;

  const startAnimation = () => {
    setIsAnimating(true);
    setCurrentYear(0);

    let year = 0;
    const interval = setInterval(() => {
      year++;
      setCurrentYear(year);

      // Auto-scroll to current year card
      if (yearRefs.current[year - 1]) {
        yearRefs.current[year - 1]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }

      if (year >= investment.years) {
        clearInterval(interval);
        setTimeout(() => setIsAnimating(false), 2000);
      }
    }, 800);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    const cleanup = startAnimation();
    return cleanup;
  }, [investment.years]);

  return (
    <div className="w-full bg-gradient-to-br from-blue-900 via-cyan-900 to-blue-900 rounded-3xl p-8 text-white overflow-hidden relative">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20"
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-4">
            <Zap className="w-6 h-6 text-cyan-400" />
            <span className="font-bold text-xl">Efecto Avalancha</span>
          </div>
          <p className="text-cyan-200 text-lg">
            Observa cómo crece tu patrimonio año tras año
          </p>
        </motion.div>

        {/* Years Progress */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {years.map((year) => {
            const yearData = results.yearlyData[year - 1];
            const isActive = year <= currentYear;
            const patrimonyGrowth = yearData ?
              ((yearData.citrusPatrimony - totalInvestment) / totalInvestment * 100).toFixed(1) : 0;

            return (
              <motion.div
                key={year}
                ref={(el) => (yearRefs.current[year - 1] = el)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: isActive ? 1 : 0.3,
                  scale: isActive ? 1 : 0.9,
                  y: isActive ? 0 : 10
                }}
                transition={{ duration: 0.5 }}
                className={`relative overflow-hidden rounded-2xl p-4 ${
                  isActive
                    ? 'bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border-2 border-cyan-400'
                    : 'bg-white/5 border-2 border-white/10'
                }`}
              >
                <AnimatePresence>
                  {isActive && year === currentYear && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 3, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      className="absolute inset-0 bg-cyan-400 rounded-full"
                    />
                  )}
                </AnimatePresence>

                <div className="relative z-10">
                  <div className="text-center mb-2">
                    <span className="text-cyan-300 text-sm font-medium">Año {year}</span>
                  </div>

                  {yearData && isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-2"
                    >
                      <div className="text-center">
                        <div className="text-xs text-cyan-200 mb-1">Patrimonio</div>
                        <div className="text-lg font-bold">
                          {formatCurrency(yearData.citrusPatrimony, investment.currencyFormat)}
                        </div>
                      </div>

                      {year >= (investment.isLongTermCalculator ? 6 : 5) && (
                        <div className="text-center">
                          <div className="text-xs text-green-300 mb-1">Ingreso Mensual</div>
                          <div className="text-sm font-semibold text-green-400">
                            {formatCurrency(yearData.citrusIncome / 12, investment.currencyFormat)}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-center gap-1 text-xs text-cyan-300">
                        <TrendingUp className="w-3 h-3" />
                        <span>+{patrimonyGrowth}%</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Summary Cards */}
        {currentYear >= investment.years && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid md:grid-cols-3 gap-6"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-cyan-400">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-cyan-500/30 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <div className="text-sm text-cyan-200">Inversión Inicial</div>
                  <div className="text-xl font-bold">
                    {formatCurrency(totalInvestment, investment.currencyFormat)}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-400">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <div className="text-sm text-green-200">Patrimonio Final Estimado</div>
                  <div className="text-xl font-bold">
                    {formatCurrency(results.finalPatrimony, investment.currencyFormat)}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-yellow-400">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-yellow-500/30 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <div className="text-sm text-yellow-200">Multiplicador</div>
                  <div className="text-xl font-bold">
                    {results.capitalMultiplier.toFixed(2)}x
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Replay Button */}
        <div className="text-center">
          <motion.button
            onClick={startAnimation}
            disabled={isAnimating}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-2xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Zap className="w-5 h-5" />
            {isAnimating ? 'Animando...' : 'Ver Efecto Avalancha'}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AvalancheEffect;
