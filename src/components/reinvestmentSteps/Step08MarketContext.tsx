import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ChevronRight, ChevronLeft } from 'lucide-react';
import ReinvestmentMarketContext from '../reinvestmentCalculator/ReinvestmentMarketContext';

interface Step08MarketContextProps {
  onNext: () => void;
  onPrevious: () => void;
  onStepChange?: (step: number) => void;
}

const Step08MarketContext: React.FC<Step08MarketContextProps> = ({ onNext, onPrevious }) => {
  return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">
        {/* Header with RiderMex Branding */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-amber-900/30 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-amber-200">RM</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">Contexto de Mercado - Sector Motos</h2>
              <p className="text-white/80">Análisis del mercado de motocicletas: 480 motos/tienda/año, aprovisionamiento de Maxikash, Galgo, Atrato</p>
            </div>
          </div>
        </div>

        {/* Market Context Content - Component handles its own layout */}
        <ReinvestmentMarketContext onNext={onNext} onPrevious={onPrevious} />
      </div>
    </div>
  );
};

export default Step08MarketContext;