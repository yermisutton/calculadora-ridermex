import React from 'react';
import { motion } from 'framer-motion';
import { Target, ChevronRight, ChevronLeft } from 'lucide-react';
import ReinvestmentInvestorGoals from '../reinvestmentCalculator/ReinvestmentInvestorGoals';

interface Step03InvestorGoalsProps {
  onNext: () => void;
  onPrevious: () => void;
  onStepChange?: (step: number) => void;
}

const Step03InvestorGoals: React.FC<Step03InvestorGoalsProps> = ({ onNext, onPrevious }) => {
  return (
    <div className="min-h-screen bg-dark-bg p-md">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 overflow-hidden shadow-lg">
          {/* Header with RiderMex Branding */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-blue-900/30 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-blue-200">RM</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">Meta del Inversionista RiderMex</h2>
                <p className="text-white/80">Define tus objetivos financieros con tus tickets de inversión RiderMex y retornos trimestrales estimados</p>
              </div>
            </div>
          </div>

          {/* Goals Content - Component handles its own layout */}
          <ReinvestmentInvestorGoals onNext={onNext} onPrevious={onPrevious} />
        </div>
      </div>
    </div>
  );
};

export default Step03InvestorGoals;