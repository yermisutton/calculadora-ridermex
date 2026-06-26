import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ChevronLeft, Video, Zap, Sparkles, TrendingUp } from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';
import ReinvestmentResults from '../reinvestmentCalculator/ReinvestmentResults';
import TikTokResultsShowcase from '../TikTokResultsShowcase';
import AvalancheEffect from '../AvalancheEffect';
import InvestorConfidenceModule from '../InvestorConfidenceModule';

interface Step11ResultsProps {
  onPrevious: () => void;
}

const Step11Results: React.FC<Step11ResultsProps> = ({ onPrevious }) => {
  const [viewMode, setViewMode] = useState<'complete' | 'tiktok' | 'avalanche' | 'confidence'>('complete');
  const { investment, toggleReinvest } = useCalculator();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Reinvestment Toggle - Positioned at top */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center"
      >
        <motion.button
          onClick={toggleReinvest}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl ${
            investment.reinvestProfits
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-2 border-emerald-400/50'
              : 'bg-gradient-to-r from-slate-700 to-slate-800 text-slate-300 border-2 border-slate-600/50'
          }`}
        >
          <TrendingUp className={`w-6 h-6 ${investment.reinvestProfits ? 'animate-pulse' : ''}`} />
          <div className="text-left">
            <div className="text-base leading-tight">
              {investment.reinvestProfits ? 'ICM Activado' : 'ICM Desactivado'}
            </div>
            <div className="text-xs opacity-90">
              {investment.reinvestProfits ? 'Con reinversión automática' : 'Sin reinversión automática'}
            </div>
          </div>
        </motion.button>
      </motion.div>

      <div className="grid md:grid-cols-4 gap-4">
        <motion.button
          onClick={() => setViewMode('complete')}
          className={`py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all ${
            viewMode === 'complete'
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white scale-105 shadow-lg'
              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700/70 border border-slate-600/50'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Award className="w-6 h-6" />
          Análisis Completo
        </motion.button>

        <motion.button
          onClick={() => setViewMode('confidence')}
          className={`py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all ${
            viewMode === 'confidence'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white scale-105 shadow-lg'
              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700/70 border border-slate-600/50'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Sparkles className="w-6 h-6" />
          Por Qué Invertir
        </motion.button>

        <motion.button
          onClick={() => setViewMode('avalanche')}
          className={`py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all ${
            viewMode === 'avalanche'
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white scale-105 shadow-lg'
              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700/70 border border-slate-600/50'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Zap className="w-6 h-6" />
          Efecto Avalancha
        </motion.button>

        <motion.button
          onClick={() => setViewMode('tiktok')}
          className={`py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all ${
            viewMode === 'tiktok'
              ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white scale-105 shadow-lg'
              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700/70 border border-slate-600/50'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Video className="w-6 h-6" />
          Vista TikTok
        </motion.button>
      </div>

      {viewMode === 'tiktok' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <TikTokResultsShowcase />
        </motion.div>
      ) : viewMode === 'avalanche' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AvalancheEffect />
        </motion.div>
      ) : viewMode === 'confidence' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <InvestorConfidenceModule variant="full" showTitle={true} />
        </motion.div>
      ) : (
        <ReinvestmentResults onPrevious={onPrevious} />
      )}
    </motion.div>
  );
};

export default Step11Results;