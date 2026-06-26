import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, ChevronRight, ChevronLeft } from 'lucide-react';
import ReinvestmentSpecificData from '../reinvestmentCalculator/ReinvestmentSpecificData';

interface Step07SpecificDataProps {
  onNext: () => void;
  onPrevious: () => void;
  onStepChange?: (step: number) => void;
}

const Step07SpecificData: React.FC<Step07SpecificDataProps> = ({ onNext, onPrevious }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">
        {/* Header with RiderMex Branding */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-emerald-900/30 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-emerald-200">RM</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">Datos Específicos de Operación</h2>
              <p className="text-white/80">Parámetros de tiendas RiderMex: 480 motos/año por tienda, 30 tickets por tienda, 10 escalones</p>
            </div>
          </div>
        </div>

        {/* Specific Data Content - Component handles its own layout */}
        <ReinvestmentSpecificData onNext={onNext} onPrevious={onPrevious} />
      </div>
    </div>
  );
};

export default Step07SpecificData;