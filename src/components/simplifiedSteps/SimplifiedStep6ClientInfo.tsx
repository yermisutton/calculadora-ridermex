import React from 'react';
import { motion } from 'framer-motion';
import { Users, ChevronRight, ChevronLeft } from 'lucide-react';
import ReinvestmentClientInfo from '../reinvestmentCalculator/ReinvestmentClientInfo';

interface SimplifiedStep6ClientInfoProps {
  onNext: () => void;
  onPrevious: () => void;
}

const SimplifiedStep6ClientInfo: React.FC<SimplifiedStep6ClientInfoProps> = ({ onNext, onPrevious }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-dark-card rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-blue-400/30 p-8 text-white">
          <div className="flex items-center gap-6">
            <img
              src="/rider_inversiones.png"
              alt="Ridermex Inversiones"
              className="h-20 w-auto drop-shadow-lg"
            />
            <div className="w-16 h-16 bg-dark-card/20 rounded-2xl flex items-center justify-center">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Información del Cliente</h2>
              <p className="text-blue-100 text-lg">Datos personales y de contacto para tu inversión</p>
            </div>
          </div>
        </div>

        {/* Client Info Content - Component handles its own layout */}
        <ReinvestmentClientInfo onNext={onNext} onPrevious={onPrevious} />
      </div>
    </motion.div>
  );
};

export default SimplifiedStep6ClientInfo;