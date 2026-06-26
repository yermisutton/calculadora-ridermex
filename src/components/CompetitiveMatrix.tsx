import React, { useState } from 'react';
import { BarChart3, Award, Shield, TrendingUp, DollarSign, Target, Users, Leaf, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface CompetitiveMatrixProps {
  className?: string;
}

const criteria = [
  { id: 'returns', name: 'Rendimiento Potencial', weight: 20, icon: TrendingUp, color: 'green' },
  { id: 'risk', name: 'Nivel de Riesgo', weight: 15, icon: Shield, color: 'blue' },
  { id: 'liquidity', name: 'Liquidez', weight: 10, icon: Clock, color: 'purple' },
  { id: 'diversification', name: 'Diversificación', weight: 15, icon: Target, color: 'indigo' },
  { id: 'inflation', name: 'Protección Inflación', weight: 10, icon: TrendingUp, color: 'orange' },
  { id: 'tangible', name: 'Activo Tangible', weight: 10, icon: Award, color: 'amber' },
  { id: 'income', name: 'Generación Ingresos', weight: 10, icon: DollarSign, color: 'emerald' },
  { id: 'impact', name: 'Impacto Social', weight: 5, icon: Users, color: 'pink' },
  { id: 'sustainability', name: 'Sostenibilidad', weight: 5, icon: Leaf, color: 'teal' }
];

const investments = {
  cosechaCapital: {
    name: 'Cosecha Capital',
    scores: { returns: 9, risk: 8, liquidity: 6, diversification: 9, inflation: 9, tangible: 10, income: 9, impact: 10, sustainability: 10 },
    color: 'green',
    icon: Leaf
  },
  cetes: {
    name: 'CETES',
    scores: { returns: 6, risk: 9, liquidity: 10, diversification: 3, inflation: 5, tangible: 2, income: 6, impact: 3, sustainability: 3 },
    color: 'blue',
    icon: Shield
  },
  savings: {
    name: 'Ahorro Tradicional',
    scores: { returns: 3, risk: 10, liquidity: 10, diversification: 2, inflation: 2, tangible: 1, income: 3, impact: 2, sustainability: 2 },
    color: 'purple',
    icon: DollarSign
  },
  realEstate: {
    name: 'Bienes Raíces',
    scores: { returns: 7, risk: 6, liquidity: 4, diversification: 5, inflation: 8, tangible: 9, income: 7, impact: 5, sustainability: 4 },
    color: 'orange',
    icon: Target
  },
  stocks: {
    name: 'Acciones',
    scores: { returns: 8, risk: 4, liquidity: 9, diversification: 7, inflation: 6, tangible: 2, income: 5, impact: 4, sustainability: 5 },
    color: 'red',
    icon: BarChart3
  }
};

const CompetitiveMatrix: React.FC<CompetitiveMatrixProps> = ({ className = '' }) => {
  const [selectedInvestment, setSelectedInvestment] = useState<string | null>(null);
  const [showWeights, setShowWeights] = useState(false);

  // Calculate weighted scores
  const calculateWeightedScore = (investmentKey: string) => {
    const investment = investments[investmentKey as keyof typeof investments];
    let totalScore = 0;
    
    criteria.forEach(criterion => {
      const score = investment.scores[criterion.id as keyof typeof investment.scores];
      totalScore += (score * criterion.weight) / 100;
    });
    
    return totalScore;
  };

  // Get rankings
  const rankings = Object.keys(investments)
    .map(key => ({
      key,
      ...investments[key as keyof typeof investments],
      weightedScore: calculateWeightedScore(key)
    }))
    .sort((a, b) => b.weightedScore - a.weightedScore);

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Matriz Competitiva</h3>
            <p className="text-sm text-gray-600">Análisis objetivo de opciones de inversión</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowWeights(!showWeights)}
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          {showWeights ? 'Ocultar Pesos' : 'Mostrar Pesos'}
        </button>
      </div>

      {/* Rankings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
        {rankings.map((investment, index) => {
          const Icon = investment.icon;
          const isWinner = index === 0;
          
          return (
            <motion.div
              key={investment.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                isWinner 
                  ? 'border-green-500 bg-green-50 shadow-lg transform scale-105' 
                  : selectedInvestment === investment.key
                    ? `border-${investment.color}-500 bg-${investment.color}-50`
                    : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedInvestment(selectedInvestment === investment.key ? null : investment.key)}
            >
              <div className="text-center">
                {isWinner && (
                  <div className="flex justify-center mb-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </div>
                )}
                <div className={`w-8 h-8 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                  isWinner ? 'bg-green-500' : `bg-${investment.color}-500`
                }`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="font-semibold text-sm text-gray-800">{investment.name}</div>
                <div className={`text-lg font-bold ${
                  isWinner ? 'text-green-700' : `text-${investment.color}-700`
                }`}>
                  {investment.weightedScore.toFixed(1)}/10
                </div>
                <div className="text-xs text-gray-500">#{index + 1}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Matrix */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-800">Criterio</th>
              {showWeights && (
                <th className="text-center py-3 px-2 font-semibold text-gray-600 text-sm">Peso</th>
              )}
              {Object.entries(investments).map(([key, investment]) => (
                <th key={key} className="text-center py-3 px-2">
                  <div className={`w-6 h-6 mx-auto rounded-lg flex items-center justify-center bg-${investment.color}-500`}>
                    <investment.icon className="w-3 h-3 text-white" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {criteria.map((criterion, index) => {
              const Icon = criterion.icon;
              
              return (
                <tr key={criterion.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center bg-${criterion.color}-100`}>
                        <Icon className={`w-3 h-3 text-${criterion.color}-600`} />
                      </div>
                      <span className="font-medium text-gray-800 text-sm">{criterion.name}</span>
                    </div>
                  </td>
                  {showWeights && (
                    <td className="text-center py-3 px-2 text-sm text-gray-600">
                      {criterion.weight}%
                    </td>
                  )}
                  {Object.entries(investments).map(([key, investment]) => {
                    const score = investment.scores[criterion.id as keyof typeof investment.scores];
                    
                    return (
                      <td key={key} className="text-center py-3 px-2">
                        <div className="flex items-center justify-center">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                            score >= 8 ? 'bg-green-100 text-green-700' :
                            score >= 6 ? 'bg-yellow-100 text-yellow-700' :
                            score >= 4 ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {score}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            
            {/* Total Row */}
            <tr className="border-t-2 border-gray-300 bg-gray-50">
              <td className="py-4 px-4 font-bold text-gray-800">
                PUNTUACIÓN TOTAL
              </td>
              {showWeights && (
                <td className="text-center py-4 px-2 font-bold text-gray-600">
                  100%
                </td>
              )}
              {rankings.map((investment, index) => (
                <td key={investment.key} className="text-center py-4 px-2">
                  <div className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center font-bold text-lg ${
                    index === 0 ? 'bg-green-500 text-white shadow-lg' :
                    index === 1 ? 'bg-blue-500 text-white' :
                    index === 2 ? 'bg-purple-500 text-white' :
                    'bg-gray-400 text-white'
                  }`}>
                    {investment.weightedScore.toFixed(1)}
                  </div>
                  {index === 0 && (
                    <div className="text-xs text-green-600 font-semibold mt-1">GANADOR</div>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Key Insights */}
      <div className="mt-6 p-4 bg-green-50 rounded-xl">
        <h4 className="font-semibold text-green-800 mb-2">🏆 Insights Clave:</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• <strong>Cosecha Capital</strong> lidera con 8.2/10 por su combinación única de alto rendimiento y activo tangible</li>
          <li>• <strong>Diversificación automática</strong> a través de múltiples certificados reduce significativamente el riesgo</li>
          <li>• <strong>Doble motor de crecimiento:</strong> apreciación del activo + rendimiento operativo</li>
          <li>• <strong>Impacto positivo medible</strong> en aspectos ambientales y sociales</li>
        </ul>
      </div>
    </div>
  );
};

export default CompetitiveMatrix;