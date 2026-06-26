import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCalculator } from '../context/CalculatorContext';
import { formatCurrency } from '../utils/formatters';
import { TrendingUp, DollarSign, Award, Zap, ArrowRight, Sparkles, Target, FileText, MapPin } from 'lucide-react';
import {
  CountUpNumber,
  PulseGlow,
  SlideUp,
  ScaleIn,
  ShineEffect,
  PopIn,
  BeforeAfterSlide,
  ProgressBar
} from './ui/TikTokAnimations';

const TikTokResultsShowcase: React.FC = () => {
  const { investment, results } = useCalculator();
  const [showComparison, setShowComparison] = useState(false);

  if (!results) return null;

  const { finalMonthlyIncome, finalPatrimony, capitalMultiplier, cagr } = results;
  const totalInvestment = investment.initialCertificates * investment.certificateBasePrice;

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 rounded-3xl p-8 text-white overflow-hidden relative">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20"
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div className="relative z-10 space-y-8">
        <ScaleIn delay={0.1} duration={3}>
          <div className="text-center">
            <motion.div
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-4"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(16, 185, 129, 0.3)',
                  '0 0 40px rgba(16, 185, 129, 0.6)',
                  '0 0 20px rgba(16, 185, 129, 0.3)'
                ]
              }}
              transition={{ duration: 12, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <span className="text-xl font-bold">Visualiza el Crecimiento de tu Patrimonio Año con Año</span>
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </motion.div>
          </div>
        </ScaleIn>

        {/* Inversión Inicial - Tarjeta Destacada */}
        <SlideUp delay={0.2} duration={2.4}>
          <PulseGlow color="purple" intensity="high">
            <motion.div
              className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-400/50 max-w-2xl mx-auto"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <motion.div
                  className="w-16 h-16 bg-purple-500/30 rounded-full flex items-center justify-center"
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 12, repeat: Infinity }}
                >
                  <Target className="w-10 h-10 text-purple-300" />
                </motion.div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-purple-300">Inversión Inicial</h3>
                  <p className="text-sm text-purple-200">Tu capital inicial</p>
                </div>
              </div>

              <ShineEffect duration={4} delay={0.3}>
                <div className="text-6xl font-extrabold mb-3 text-center">
                  <CountUpNumber
                    value={totalInvestment}
                    duration={4}
                    delay={0.3}
                    isCurrency={true}
                    currencySymbol={investment.currencyFormat === 'MXN' ? '$' : investment.currencyFormat === 'USD' ? '$' : '€'}
                  />
                </div>
              </ShineEffect>

              <motion.p
                className="text-purple-200 text-center text-base"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 12, repeat: Infinity }}
              >
                punto de partida
              </motion.p>
            </motion.div>
          </PulseGlow>
        </SlideUp>

        {/* Título de Sección */}
        <motion.div
          className="text-center mt-8 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-white mb-2">Utilidades y Crecimiento Pasivo</h2>
          <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SlideUp delay={0.5} duration={2.4}>
            <PulseGlow color="green" intensity="high">
              <motion.div
                className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-400/50"
                whileHover={{ scale: 1.05, rotate: 1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    className="w-14 h-14 bg-green-500/30 rounded-full flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <DollarSign className="w-8 h-8 text-green-300" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-bold text-green-300">Ingreso Mensual</h3>
                    <p className="text-sm text-green-200">Flujo de efectivo pasivo</p>
                  </div>
                </div>

                <ShineEffect duration={investment.years} delay={0.5}>
                  <div className="text-5xl font-extrabold mb-2">
                    <CountUpNumber
                      value={finalMonthlyIncome}
                      duration={investment.years}
                      delay={0.5}
                      isCurrency={true}
                      currencySymbol={investment.currencyFormat === 'MXN' ? '$' : investment.currencyFormat === 'USD' ? '$' : '€'}
                    />
                  </div>
                </ShineEffect>

                <motion.p
                  className="text-green-200 text-sm"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 12, repeat: Infinity }}
                >
                  por mes, cada mes
                </motion.p>
              </motion.div>
            </PulseGlow>
          </SlideUp>

          <SlideUp delay={0.5} duration={2.4}>
            <PulseGlow color="blue" intensity="high">
              <motion.div
                className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-400/50"
                whileHover={{ scale: 1.05, rotate: -1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    className="w-14 h-14 bg-blue-500/30 rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 12, repeat: Infinity }}
                  >
                    <TrendingUp className="w-8 h-8 text-blue-300" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-300">Patrimonio Total</h3>
                    <p className="text-sm text-blue-200">Valor acumulado</p>
                  </div>
                </div>

                <ShineEffect duration={investment.years} delay={0.5}>
                  <div className="text-5xl font-extrabold mb-2">
                    <CountUpNumber
                      value={finalPatrimony}
                      duration={investment.years}
                      delay={0.5}
                      isCurrency={true}
                      currencySymbol={investment.currencyFormat === 'MXN' ? '$' : investment.currencyFormat === 'USD' ? '$' : '€'}
                    />
                  </div>
                </ShineEffect>

                <motion.p
                  className="text-blue-200 text-sm"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 12, repeat: Infinity, delay: 0.5 }}
                >
                  en {investment.years} años
                </motion.p>
              </motion.div>
            </PulseGlow>
          </SlideUp>

          <SlideUp delay={0.7} duration={2.4}>
            <PulseGlow color="orange" intensity="medium">
              <motion.div
                className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-400/50"
                whileHover={{ scale: 1.05, rotate: 1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    className="w-14 h-14 bg-orange-500/30 rounded-full flex items-center justify-center"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 12, repeat: Infinity }}
                  >
                    <FileText className="w-8 h-8 text-orange-300" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-bold text-orange-300">Certificados Totales</h3>
                    <p className="text-sm text-orange-200">Acumulados por reinversión</p>
                  </div>
                </div>

                <ShineEffect duration={investment.years} delay={0.5}>
                  <div className="text-5xl font-extrabold mb-2">
                    <CountUpNumber
                      value={results.certificatesSummary.totalCertificates}
                      duration={investment.years}
                      delay={0.5}
                      isCurrency={false}
                    />
                  </div>
                </ShineEffect>

                <motion.p
                  className="text-orange-200 text-sm"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 12, repeat: Infinity, delay: 0.7 }}
                >
                  {results.certificatesSummary.fromReinvestment} por reinversión
                </motion.p>
              </motion.div>
            </PulseGlow>
          </SlideUp>


        </div>

        <div className="grid grid-cols-3 gap-4">
          <PopIn delay={0.9}>
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20"
              whileHover={{ scale: 1.1, y: -5 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 12, repeat: Infinity }}
              >
                <Award className="w-10 h-10 text-yellow-400 mx-auto mb-2" />
              </motion.div>
              <div className="text-3xl font-bold">
                <CountUpNumber
                  value={capitalMultiplier}
                  duration={investment.years}
                  delay={0.5}
                  suffix="x"
                />
              </div>
              <p className="text-xs text-gray-300 mt-1">Multiplicador</p>
            </motion.div>
          </PopIn>

          <PopIn delay={1.1}>
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20"
              whileHover={{ scale: 1.1, y: -5 }}
            >
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 12, repeat: Infinity }}
              >
                <Zap className="w-10 h-10 text-purple-400 mx-auto mb-2" />
              </motion.div>
              <div className="text-3xl font-bold">
                <CountUpNumber
                  value={cagr * 100}
                  duration={investment.years}
                  delay={0.5}
                  suffix="%"
                />
              </div>
              <p className="text-xs text-gray-300 mt-1">CAGR</p>
            </motion.div>
          </PopIn>

          <PopIn delay={1.3}>
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20"
              whileHover={{ scale: 1.1, y: -5 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 12, repeat: Infinity }}
              >
                <Target className="w-10 h-10 text-green-400 mx-auto mb-2" />
              </motion.div>
              <div className="text-3xl font-bold">
                <CountUpNumber
                  value={investment.years}
                  duration={investment.years}
                  delay={0.5}
                  suffix=""
                />
              </div>
              <p className="text-xs text-gray-300 mt-1">Años</p>
            </motion.div>
          </PopIn>
        </div>

        <div className="relative">
          <motion.button
            onClick={() => setShowComparison(!showComparison)}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {showComparison ? 'Ocultar' : 'Ver'} Comparación vs Otras Inversiones
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          {showComparison && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 space-y-4"
            >
              <SlideUp delay={0.1}>
                <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm rounded-xl p-4 border-2 border-emerald-400/50">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-bold text-emerald-300">RiderMex (Tu inversión)</span>
                      <p className="text-xs text-emerald-200 mt-1">
                        Patrimonio: {formatCurrency(finalPatrimony, investment.currencyFormat)}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-emerald-300">
                      100% (Referencia)
                    </span>
                  </div>
                  <ProgressBar
                    progress={100}
                    duration={8}
                    delay={0.2}
                    color="bg-emerald-400"
                    height="h-4"
                  />
                </div>
              </SlideUp>

              <SlideUp delay={0.2}>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-semibold">vs CETES</span>
                      <p className="text-xs text-gray-400 mt-1">
                        Patrimonio: {formatCurrency(results.cetesPatrimony, investment.currencyFormat)}
                      </p>
                    </div>
                    <span className="text-sm text-gray-300">
                      {((results.cetesPatrimony / finalPatrimony) * 100).toFixed(1)}% vs RiderMex
                    </span>
                  </div>
                  <ProgressBar
                    progress={(results.cetesPatrimony / finalPatrimony) * 100}
                    duration={8}
                    delay={0.3}
                    color="bg-green-500"
                    height="h-3"
                  />
                </div>
              </SlideUp>

              <SlideUp delay={0.4}>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-semibold">vs Ahorro Tradicional</span>
                      <p className="text-xs text-gray-400 mt-1">
                        Patrimonio: {formatCurrency(results.savingsPatrimony, investment.currencyFormat)}
                      </p>
                    </div>
                    <span className="text-sm text-gray-300">
                      {((results.savingsPatrimony / finalPatrimony) * 100).toFixed(1)}% vs RiderMex
                    </span>
                  </div>
                  <ProgressBar
                    progress={(results.savingsPatrimony / finalPatrimony) * 100}
                    duration={8}
                    delay={0.5}
                    color="bg-blue-500"
                    height="h-3"
                  />
                </div>
              </SlideUp>

              <SlideUp delay={0.6}>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-semibold">vs Bienes Raíces</span>
                      <p className="text-xs text-gray-400 mt-1">
                        Patrimonio: {formatCurrency(results.realEstatePatrimony, investment.currencyFormat)}
                      </p>
                    </div>
                    <span className="text-sm text-gray-300">
                      {((results.realEstatePatrimony / finalPatrimony) * 100).toFixed(1)}% vs RiderMex
                    </span>
                  </div>
                  <ProgressBar
                    progress={(results.realEstatePatrimony / finalPatrimony) * 100}
                    duration={8}
                    delay={0.7}
                    color="bg-purple-500"
                    height="h-3"
                  />
                </div>
              </SlideUp>
            </motion.div>
          )}
        </div>

        <motion.div
          className="text-center pt-4 border-t border-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <p className="text-sm text-gray-300">
            Inversión inicial: <span className="font-bold text-white">{formatCurrency(totalInvestment, investment.currencyFormat)}</span>
          </p>
          <motion.p
            className="text-xs text-gray-400 mt-1"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 12, repeat: Infinity }}
          >
            Resultados proyectados a {investment.years} años
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default TikTokResultsShowcase;
