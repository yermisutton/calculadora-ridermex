import React, { useState } from 'react';
import { BookOpen, ChevronRight, ChevronLeft, Lightbulb, Calculator, TrendingUp, Award, Target, DollarSign, BarChart3, Zap, Users, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { compoundMultiplierContent } from '../../data/compoundMultiplierContent';
import EducationalTooltip from '../EducationalTooltips';
import YieldDiscountInfo from '../ui/YieldDiscountInfo';
import { RIDERMEX_CONFIG } from '../../data/ridermexConfig';
import { Card, Button, Heading, Text } from '../ui/DesignSystem';

interface ReinvestmentEducationProps {
  onNext: () => void;
  onPrevious: () => void;
}

const ReinvestmentEducation: React.FC<ReinvestmentEducationProps> = ({ onNext, onPrevious }) => {
  const [activeSection, setActiveSection] = useState<'intro' | 'concepts' | 'multiplier'>('intro');

  const sections = ['intro', 'concepts', 'multiplier'] as const;
  const currentSectionIndex = sections.indexOf(activeSection);
  
  // Function to scroll to section navigation
  const scrollToSectionNav = () => {
    const sectionNavElement = document.querySelector('[data-section-nav]');
    if (sectionNavElement) {
      sectionNavElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };
  
  const handleNextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
      setActiveSection(sections[currentSectionIndex + 1]);
      // Scroll to section navigation after state update
      setTimeout(scrollToSectionNav, 100);
    } else {
      onNext(); // Si es la última sección, ir al siguiente paso
    }
  };
  
  const handlePreviousSection = () => {
    if (currentSectionIndex > 0) {
      setActiveSection(sections[currentSectionIndex - 1]);
      // Scroll to section navigation after state update
      setTimeout(scrollToSectionNav, 100);
    } else {
      onPrevious(); // Si es la primera sección, ir al paso anterior
    }
  };

  const handleSectionClick = (section: typeof activeSection) => {
    setActiveSection(section);
    // Scroll to section navigation after state update
    setTimeout(scrollToSectionNav, 100);
  };
  const renderIntroSection = () => (
    <div className="space-y-lg">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-neon-red to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-md shadow-neon-red">
          <BookOpen className="w-10 h-10 text-white" />
        </div>
        <Heading level="lg" className="mb-sm">Bienvenido a tu Educación Financiera</Heading>
        <Text size="base" className="text-neutral-300 max-w-2xl mx-auto">
          Antes de configurar tu inversión, es importante que comprendas los conceptos fundamentales
          que harán de esta experiencia algo transformador para tu futuro financiero.
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <motion.button
          onClick={() => handleSectionClick('concepts')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-slate-700/50 p-lg rounded-xl text-center transition-all duration-300 cursor-pointer border border-slate-600/50 hover:border-emerald-500 hover:shadow-lg"
        >
          <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center mx-auto mb-sm">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
          <h4 className="font-semibold text-neutral-100 mb-2xs">Conceptos Básicos</h4>
          <Text size="sm" className="text-neutral-400">
            CAGR, TIR, ROI y otros conceptos que necesitas dominar
          </Text>
        </motion.button>

        <motion.button
          onClick={() => handleSectionClick('multiplier')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-slate-700/50 p-lg rounded-xl text-center transition-all duration-300 cursor-pointer border border-slate-600/50 hover:border-blue-500 hover:shadow-lg"
        >
          <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-sm">
            <Zap className="w-6 h-6 text-blue-400" />
          </div>
          <h4 className="font-semibold text-neutral-100 mb-2xs">Multiplicador</h4>
          <Text size="sm" className="text-neutral-400">
            La innovación que diferencia a RiderMex
          </Text>
        </motion.button>
      </div>
    </div>
  );

  const renderConceptsSection = () => {
    const concepts = [
      { concept: 'cagr', title: 'CAGR', description: 'Tasa de Crecimiento Anual Compuesta', icon: TrendingUp, color: 'neon-green' },
      { concept: 'tir', title: 'TIR', description: 'Tasa Interna de Retorno', icon: Calculator, color: 'neon-green' },
      { concept: 'roi', title: 'ROI', description: 'Retorno sobre la Inversión', icon: DollarSign, color: 'neon-red' },
      { concept: 'yield', title: 'Yield', description: 'Rendimiento Anual', icon: Target, color: 'neon-red' },
      { concept: 'diversification', title: 'Diversificación', description: 'Distribución de Riesgo', icon: BarChart3, color: 'neon-green' },
      { concept: 'compoundInterest', title: 'Interés Compuesto', description: 'Crecimiento Exponencial', icon: Lightbulb, color: 'neon-red' }
    ];

    return (
      <div className="space-y-lg">
        <Heading level="md" className="text-center">Conceptos Financieros Fundamentales</Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-sm auto-rows-fr">
          {concepts.map((item) => {
            const Icon = item.icon;
            const isGreen = item.color === 'neon-green';
            return (
              <div key={item.concept} className="tooltip-container">
                <EducationalTooltip concept={item.concept} position="bottom">
                  <div
                    className={`p-md bg-slate-700/50 rounded-xl transition-all duration-300 cursor-help transform hover:scale-105 h-full flex flex-col justify-between border ${
                      isGreen ? 'border-slate-600/50 hover:border-emerald-500 hover:shadow-lg' : 'border-slate-600/50 hover:border-blue-500 hover:shadow-lg'
                    }`}
                    style={{ minHeight: '200px', height: '200px' }}
                  >
                    <div className={`w-10 h-10 ${isGreen ? 'bg-emerald-600/20' : 'bg-blue-600/20'} rounded-xl flex items-center justify-center mx-auto mb-sm`}>
                      <Icon className={`w-5 h-5 ${isGreen ? 'text-emerald-400' : 'text-blue-400'}`} />
                    </div>
                    <h4 className="font-semibold text-neutral-100 mb-2xs text-center text-lg">
                      {item.title}
                    </h4>
                    <Text size="sm" className="text-neutral-300 text-center flex-grow flex items-center justify-center">
                      {item.description}
                    </Text>
                    <div className="text-center mt-sm">
                      <span className="text-xs text-neutral-500 bg-slate-900 px-2 py-1 rounded-full">
                        Hover para aprender
                      </span>
                    </div>
                  </div>
                </EducationalTooltip>
              </div>
            );
          })}
        </div>

      </div>
    );
  };

  const renderMultiplierSection = () => (
    <div className="space-y-lg">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-neon-green to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-md shadow-neon-green">
          <Zap className="w-10 h-10 text-white" />
        </div>
        <Heading level="lg" className="mb-sm">{compoundMultiplierContent.title}</Heading>
        <Text size="lg" className="text-emerald-400">{compoundMultiplierContent.tagline}</Text>
      </div>

      <div className="bg-slate-700/50 rounded-2xl p-lg border border-slate-600/50">
        <Heading level="md" className="text-center mb-md">
          {compoundMultiplierContent.whatMakesDifferent.title}
        </Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div className="bg-slate-900 p-md rounded-xl border border-slate-600/50">
            <h5 className="font-semibold text-neutral-200 mb-sm">{compoundMultiplierContent.whatMakesDifferent.traditional.title}</h5>
            <ul className="space-y-2xs">
              {compoundMultiplierContent.whatMakesDifferent.traditional.points.map((point, index) => (
                <li key={index} className="flex items-start gap-2xs text-sm text-neutral-400">
                  <span className="text-neutral-600 mt-1">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-neon-green/10 to-emerald-900/20 p-md rounded-xl border-2 border-neon-green">
            <h5 className="font-semibold text-emerald-400 mb-sm">{compoundMultiplierContent.whatMakesDifferent.multiplier.title}</h5>
            <ul className="space-y-2xs">
              {compoundMultiplierContent.whatMakesDifferent.multiplier.points.map((point, index) => (
                <li key={index} className="flex items-start gap-2xs text-sm text-neutral-200">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {compoundMultiplierContent.pillars.items.slice(0, 4).map((pillar, index) => (
          <div key={index} className="bg-slate-700/50 rounded-xl p-md border-l-4 border-neon-green">
            <div className="flex items-center gap-sm mb-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-green to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-neon-green">
                {pillar.number}
              </div>
              <h4 className="text-lg font-semibold text-neutral-100">{pillar.title}</h4>
            </div>
            <Text size="base" className="text-neutral-300 mb-sm">{pillar.description}</Text>
            <ul className="space-y-1">
              {pillar.examples.slice(0, 2).map((example, exampleIndex) => (
                <li key={exampleIndex} className="flex items-start gap-2xs text-sm text-neutral-400">
                  <span className="text-emerald-400 mt-1">→</span>
                  <span>{example}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );


  return (
    <div className="space-y-md">
      {/* Section Navigation */}
      <div className="bg-slate-700/50 rounded-xl border border-slate-600/50 overflow-hidden" data-section-nav>
        <div className="p-sm">
          <div className="flex bg-slate-900 rounded-lg p-1 gap-1">
            <button
              onClick={() => handleSectionClick('intro')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                activeSection === 'intro'
                  ? 'bg-neon-red text-white shadow-neon-red'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-slate-700/50'
              }`}
            >
              Introducción
            </button>
            <button
              onClick={() => handleSectionClick('concepts')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                activeSection === 'concepts'
                  ? 'bg-neon-green text-white shadow-neon-green'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-slate-700/50'
              }`}
            >
              Conceptos
            </button>
            <button
              onClick={() => handleSectionClick('multiplier')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                activeSection === 'multiplier'
                  ? 'bg-neon-green text-white shadow-neon-green'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-slate-700/50'
              }`}
            >
              Multiplicador
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-slate-700/50 rounded-xl p-lg border border-slate-600/50">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-[400px]"
        >
          {activeSection === 'intro' && renderIntroSection()}
          {activeSection === 'concepts' && renderConceptsSection()}
          {activeSection === 'multiplier' && renderMultiplierSection()}
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <div className="bg-slate-700/50 rounded-xl p-md border border-slate-600/50 flex justify-between items-center">
        <Button
          variant="secondary"
          onClick={handlePreviousSection}
          className="flex items-center gap-2xs"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>{currentSectionIndex === 0 ? 'Paso Anterior' : 'Sección Anterior'}</span>
        </Button>

        <div className="flex items-center gap-sm">
          <div className="flex items-center gap-2xs">
            <Text size="sm" className="text-neutral-500">
              {currentSectionIndex + 1} de {sections.length}
            </Text>
            <div className="flex gap-1">
              {sections.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSectionIndex
                      ? 'bg-neon-green shadow-neon-green'
                      : index < currentSectionIndex
                      ? 'bg-neon-green/50'
                      : 'bg-neutral-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <Button
            variant="primary"
            onClick={handleNextSection}
            className="flex items-center gap-2xs"
          >
            <span>
              {currentSectionIndex === sections.length - 1 ? 'Siguiente Paso' : 'Siguiente Sección'}
            </span>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReinvestmentEducation;