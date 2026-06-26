import React, { useState } from 'react';
import { HelpCircle, BookOpen, X, TrendingUp, DollarSign, Target, BarChart3, Calculator, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EducationalTooltipProps {
  concept: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const educationalContent = {
  cagr: {
    title: "CAGR - Tasa de Crecimiento Anual Compuesta",
    definition: "Mide el rendimiento promedio anual considerando el efecto del interés compuesto.",
    example: "Si inviertes $100,000 y en 5 años tienes $200,000, tu CAGR es 14.87% anual.",
    formula: "CAGR = (Valor Final / Valor Inicial)^(1/años) - 1",
    icon: TrendingUp,
    color: "blue"
  },
  tir: {
    title: "TIR - Tasa Interna de Retorno",
    definition: "Tasa que hace que el valor presente neto de una inversión sea igual a cero.",
    example: "Una TIR del 20% significa que la inversión genera 20% anual considerando todos los flujos.",
    formula: "VPN = 0 cuando se usa la TIR como tasa de descuento",
    icon: Calculator,
    color: "green"
  },
  roi: {
    title: "ROI - Retorno sobre la Inversión",
    definition: "Mide la eficiencia comparando la ganancia obtenida con el costo de la inversión.",
    example: "Si inviertes $100,000 y obtienes $150,000, tu ROI es 50%.",
    formula: "ROI = (Ganancia - Inversión) / Inversión × 100",
    icon: DollarSign,
    color: "purple"
  },
  yield: {
    title: "Yield - Rendimiento",
    definition: "Ingreso anual generado como porcentaje del valor de la inversión.",
    example: "Un certificado que genera $20,000 anuales sobre $250,000 tiene yield del 8%.",
    formula: "Yield = Ingreso Anual / Valor de la Inversión × 100",
    icon: Target,
    color: "orange"
  },
  diversification: {
    title: "Diversificación",
    definition: "Distribuir inversiones entre diferentes activos para reducir el riesgo total.",
    example: "En lugar de 1 certificado de $1M, tener 4 de $250K reduce el riesgo.",
    formula: "Riesgo Total = √(Σ(peso² × riesgo²) + correlaciones)",
    icon: BarChart3,
    color: "indigo"
  },
  compoundInterest: {
    title: "Interés Compuesto",
    definition: "Interés calculado sobre el capital inicial más todos los intereses acumulados.",
    example: "$100K al 10%: Año 1: $110K, Año 2: $121K, Año 3: $133.1K",
    formula: "Valor Final = Capital × (1 + tasa)^tiempo",
    icon: Lightbulb,
    color: "amber"
  }
};

const EducationalTooltip: React.FC<EducationalTooltipProps> = ({ 
  concept, 
  children, 
  position = 'bottom' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const content = educationalContent[concept as keyof typeof educationalContent];
  
  if (!content) return <>{children}</>;

  const Icon = content.icon;

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          border: 'border-blue-500',
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          icon: 'bg-blue-500'
        };
      case 'green':
        return {
          border: 'border-green-500',
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: 'bg-green-500'
        };
      case 'purple':
        return {
          border: 'border-purple-500',
          bg: 'bg-purple-100',
          text: 'text-purple-800',
          icon: 'bg-purple-500'
        };
      case 'orange':
        return {
          border: 'border-orange-500',
          bg: 'bg-orange-100',
          text: 'text-orange-800',
          icon: 'bg-orange-500'
        };
      case 'indigo':
        return {
          border: 'border-indigo-500',
          bg: 'bg-indigo-100',
          text: 'text-indigo-800',
          icon: 'bg-indigo-500'
        };
      case 'amber':
        return {
          border: 'border-amber-500',
          bg: 'bg-amber-100',
          text: 'text-amber-800',
          icon: 'bg-amber-500'
        };
      default:
        return {
          border: 'border-gray-500',
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: 'bg-gray-500'
        };
    }
  };

  const colorClasses = getColorClasses(content.color);

  return (
    <div className="relative inline-block">
      <div 
        className="cursor-help"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`fixed z-[10000] w-80 p-4 bg-white rounded-xl shadow-2xl ${colorClasses.border} border-2 pointer-events-auto`}
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10000
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
            
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 ${colorClasses.icon} rounded-xl flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h4 className={`font-bold ${colorClasses.text} text-sm`}>{content.title}</h4>
            </div>
            
            <div className="space-y-3 text-xs">
              <p className="text-gray-700 font-medium">{content.definition}</p>
              
              <div className={`${colorClasses.bg} p-3 rounded-lg`}>
                <p className={`${colorClasses.text} mb-2`}><strong>Ejemplo:</strong></p>
                <p className="text-gray-700">{content.example}</p>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-600 mb-2"><strong>Fórmula:</strong></p>
                <code className="text-blue-800 font-mono text-xs">{content.formula}</code>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EducationalTooltip;