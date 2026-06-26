import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Zap, DollarSign, TrendingUp, Shield, Users, Award, BarChart3, Target, Leaf } from 'lucide-react';
import { valuePropositionItems, impactMetrics } from '../data/valuePropositionContent';
import { useCalculator } from '../context/CalculatorContext';
import { formatCurrency } from '../utils/formatters';

interface InvestmentAdvantagesProps {
  onNext: () => void;
  onPrevious: () => void;
}

const InvestmentAdvantages: React.FC<InvestmentAdvantagesProps> = ({ onNext, onPrevious }) => {
  const { investment, results } = useCalculator();
  
  // Scale impact metrics based on certificates
  const scaleFactor = investment.initialCertificates;
  
  const environmentalImpact = {
    co2Reduction: Math.round(impactMetrics.environmental.co2Reduction * scaleFactor * 10) / 10,
    waterSaved: Math.round(impactMetrics.environmental.waterSaved * scaleFactor),
    landPreserved: Math.round(impactMetrics.environmental.landPreserved * scaleFactor)
  };
  
  const socialImpact = {
    jobsCreated: Math.round(impactMetrics.social.jobsCreated * scaleFactor * 10) / 10,
    familiesSupported: Math.round(impactMetrics.social.familiesSupported * scaleFactor),
    communityProjects: Math.round(impactMetrics.social.communityProjects * scaleFactor * 10) / 10
  };
  
  const economicImpact = {
    localEconomyBoost: Math.round(impactMetrics.economic.localEconomyBoost * scaleFactor * 10) / 10,
    taxContribution: Math.round(impactMetrics.economic.taxContribution * scaleFactor),
    sustainableGrowth: Math.round(impactMetrics.economic.sustainableGrowth * scaleFactor * 10) / 10
  };
  
  // Get icon component based on string name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-6 h-6" />;
      case 'DollarSign': return <DollarSign className="w-6 h-6" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6" />;
      case 'Shield': return <Shield className="w-6 h-6" />;
      case 'Users': return <Users className="w-6 h-6" />;
      case 'Award': return <Award className="w-6 h-6" />;
      default: return <Target className="w-6 h-6" />;
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Target className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">¿Por qué Cosecha Capital?</h2>
              <p className="text-orange-100">Descubre las ventajas únicas de esta inversión y su impacto positivo</p>
            </div>
          </div>
        </div>
        
        <div className="p-8 space-y-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            {/* Value Proposition */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-600" />
                <span>Propuesta de Valor Única</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {valuePropositionItems.map((item, index) => (
                  <div key={index} className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center">
                        {getIconComponent(item.icon)}
                      </div>
                      <h4 className="font-medium text-orange-800">{item.title}</h4>
                    </div>
                    <p className="text-sm text-orange-700">{item.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* Performance Metrics */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span>Métricas de Rendimiento</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-700" />
                    </div>
                    <h4 className="font-medium text-blue-800">Multiplicador de Capital</h4>
                  </div>
                  <p className="text-3xl font-bold text-blue-700 mb-1">
                    {results ? results.capitalMultiplier.toFixed(1) : '0.0'}x
                  </p>
                  <p className="text-sm text-blue-600">crecimiento de tu inversión</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-green-700" />
                    </div>
                    <h4 className="font-medium text-green-800">CAGR</h4>
                  </div>
                  <p className="text-3xl font-bold text-green-700 mb-1">
                    {results ? (results.cagr).toFixed(1) : '0.0'}%
                  </p>
                  <p className="text-sm text-green-600">rendimiento anual compuesto</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-purple-700" />
                    </div>
                    <h4 className="font-medium text-purple-800">Ingreso Mensual</h4>
                  </div>
                  <p className="text-3xl font-bold text-purple-700 mb-1">
                    {formatCurrency(results ? results.finalMonthlyIncome : 0, investment.currencyFormat)}
                  </p>
                  <p className="text-sm text-purple-600">al final del período</p>
                </div>
              </div>
            </motion.div>
            
            {/* Environmental Impact */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                <span>Impacto Ambiental y Social</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <h4 className="font-medium text-green-800 mb-2">Captura de CO₂</h4>
                  <p className="text-2xl font-bold text-green-700 mb-1">{environmentalImpact.co2Reduction}</p>
                  <p className="text-sm text-green-600">toneladas por año</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <h4 className="font-medium text-blue-800 mb-2">Empleos Generados</h4>
                  <p className="text-2xl font-bold text-blue-700 mb-1">{socialImpact.jobsCreated}</p>
                  <p className="text-sm text-blue-600">empleos directos e indirectos</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                  <h4 className="font-medium text-purple-800 mb-2">Impulso Económico</h4>
                  <p className="text-2xl font-bold text-purple-700 mb-1">{economicImpact.localEconomyBoost}%</p>
                  <p className="text-sm text-purple-600">incremento en economía local</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPrevious}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Anterior</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <span>Continuar</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InvestmentAdvantages;
