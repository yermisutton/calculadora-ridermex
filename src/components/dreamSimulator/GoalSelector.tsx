import React from 'react';
import { motion } from 'framer-motion';
import { Dream } from '../../types/dreamSimulator';
import { formatCurrency } from '../../utils/formatters';
import { compoundMultiplierContent } from '../../data/compoundMultiplierContent';
import { Plus } from 'lucide-react';

interface GoalSelectorProps {
  dreams: Dream[];
  onDreamSelect: (dream: Dream) => void;
  onCreateCustomDream: () => void;
}

const GoalSelector: React.FC<GoalSelectorProps> = ({ dreams, onDreamSelect, onCreateCustomDream }) => {
  const dreamsByCategory = dreams.reduce((acc, dream) => {
    if (!acc[dream.category]) {
      acc[dream.category] = [];
    }
    acc[dream.category].push(dream);
    return acc;
  }, {} as Record<string, Dream[]>);

  const categoryLabels: Record<string, string> = {
    retirement: 'Retiro',
    education: 'Educación',
    travel: 'Viajes',
    home: 'Hogar',
    business: 'Negocios',
    family: 'Familia',
    health: 'Salud',
    legacy: 'Legado'
  };

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
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-red-800 mb-4">¿Cuál es tu sueño con Ridermex?</h2>
        <div className="mb-6 p-4 bg-gradient-to-br from-red-50 to-orange-100 rounded-xl border border-red-200">
          <h3 className="text-xl font-semibold text-red-800 mb-2">Ridermex Inversiones</h3>
          <p className="text-red-700">{compoundMultiplierContent.tagline}</p>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Selecciona el sueño que deseas alcanzar con Ridermex Inversiones y te mostraremos cómo multiplicar tu patrimonio a través de nuestro negocio de motocicletas para hacerlo realidad.
        </p>
      </div>

      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
        onClick={onCreateCustomDream}
      >
        <div className="p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Crear Sueño Personalizado con Ridermex</h3>
              <p className="text-orange-100 text-sm">Define tu propio sueño y descubre cómo Ridermex puede multiplicar tu patrimonio para hacerlo realidad</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              ¿Tienes un sueño específico? Crea tu propio escenario personalizado y descubre cómo Ridermex puede multiplicar tu patrimonio a través de nuestro negocio de motocicletas para alcanzarlo.
            </p>
            <button className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              <span>Crear Sueño con Ridermex</span>
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-12"
      >
        {Object.entries(dreamsByCategory).map(([category, dreams]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-2xl font-semibold text-red-700 border-b border-red-100 pb-2">
              {categoryLabels[category] || category}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dreams.map((dream) => {
                const Icon = dream.icon;

                const difficultyColor =
                  dream.difficulty === 'easy' ? 'bg-green-100 text-red-700' :
                  dream.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  dream.difficulty === 'hard' ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700';

                const timelineText =
                  dream.timeline === 'short' ? '< 5 años' :
                  dream.timeline === 'medium' ? '5-10 años' :
                  dream.timeline === 'long' ? '10-20 años' :
                  '> 20 años';

                return (
                  <motion.div
                    key={dream.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
                    onClick={() => onDreamSelect(dream)}
                  >
                    <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{dream.name}</h3>
                          <p className="text-orange-100 text-sm">{dream.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <p className="text-sm text-red-600 mb-1">Meta Mensual</p>
                          <p className="text-lg font-bold text-red-700">
                            {formatCurrency(dream.monthlyGoal, 'MXN')}
                          </p>
                        </div>

                        <div className="text-center p-3 bg-emerald-50 rounded-lg">
                          <p className="text-sm text-emerald-600 mb-1">Tickets</p>
                          <p className="text-lg font-bold text-emerald-700">
                            {dream.certificatesNeeded}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between text-sm mb-4">
                        <span className={`px-2 py-1 rounded-full ${difficultyColor}`}>
                          {dream.difficulty === 'easy' ? 'Fácil' :
                           dream.difficulty === 'medium' ? 'Moderado' :
                           dream.difficulty === 'hard' ? 'Desafiante' : 'Muy Desafiante'}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {timelineText}
                        </span>
                      </div>

                      <button className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2">
                        <span>Seleccionar</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default GoalSelector;
