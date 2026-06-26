import React from 'react';
import { BookOpen } from 'lucide-react';
import ReinvestmentEducation from '../reinvestmentCalculator/ReinvestmentEducation';
import { Heading, Text, StepIndicator } from '../ui/DesignSystem';

interface Step02EducationProps {
  onNext: () => void;
  onPrevious: () => void;
  onStepChange?: (step: number) => void;
}

const Step02Education: React.FC<Step02EducationProps> = ({ onNext, onPrevious }) => {
  return (
    <div className="min-h-screen bg-dark-bg p-md">
      <div className="max-w-5xl mx-auto">
        <StepIndicator currentStep={2} totalSteps={14} />

        <div className="mt-lg mb-lg">
          <div className="flex items-center gap-2xs">
            <BookOpen className="w-8 h-8 text-neon-red flex-shrink-0" />
            <Heading level="lg">Educación Financiera RiderMex</Heading>
          </div>
          <Text size="base" className="mt-2xs text-neutral-400">
            Comprende cómo funciona tu inversión en tiendas RiderMex y venta de motocicletas
          </Text>
        </div>

        <ReinvestmentEducation onNext={onNext} onPrevious={onPrevious} />
      </div>
    </div>
  );
};

export default Step02Education;