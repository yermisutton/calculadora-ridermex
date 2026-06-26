import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Bike, Wallet, TrendingUp, Leaf, Users, ChevronDown, ChevronUp, AlertCircle, CheckCircle } from 'lucide-react';
import { RIDERMEX_EDUCATIONAL_CONTENT } from '../data/ridermexEducationalContent';

interface RidermexEducationalPanelProps {
  activeTab?: string;
}

const RidermexEducationalPanel: React.FC<RidermexEducationalPanelProps> = ({ activeTab = 'overview' }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState(activeTab);

  const tabs = [
    { id: 'overview', label: 'Panorama Global', icon: Globe },
    { id: 'asset', label: 'Activo Productivo', icon: Bike },
    { id: 'mechanism', label: 'Cómo Funciona', icon: Wallet },
    { id: 'growth', label: 'Múltiplos de Crecimiento', icon: TrendingUp },
    { id: 'impact', label: 'Impacto Social', icon: Leaf }
  ];

  const renderOverviewTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {RIDERMEX_EDUCATIONAL_CONTENT.globalContext.title}
        </h2>
        <p className="text-gray-600">
          {RIDERMEX_EDUCATIONAL_CONTENT.globalContext.subtitle}
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-200 rounded-2xl">
              <Globe className="w-8 h-8 text-blue-700" />
            </div>
            <div>
              <div className="text-sm font-semibold text-blue-700">Mercado Global</div>
              <div className="text-3xl font-bold text-blue-900">$125B</div>
              <div className="text-sm text-blue-700">USD anuales</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-200 rounded-2xl">
              <TrendingUp className="w-8 h-8 text-green-700" />
            </div>
            <div>
              <div className="text-sm font-semibold text-green-700">Crecimiento</div>
              <div className="text-3xl font-bold text-green-900">18%</div>
              <div className="text-sm text-green-700">anual 2024-2030</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-4 bg-purple-200 rounded-2xl">
              <Bike className="w-8 h-8 text-purple-700" />
            </div>
            <div>
              <div className="text-sm font-semibold text-purple-700">Participación MX</div>
              <div className="text-3xl font-bold text-purple-900">8.5%</div>
              <div className="text-sm text-purple-700">del mercado emergente</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-4 bg-orange-200 rounded-2xl">
              <Wallet className="w-8 h-8 text-orange-700" />
            </div>
            <div>
              <div className="text-sm font-semibold text-orange-700">Impacto Económico</div>
              <div className="text-3xl font-bold text-orange-900">$4.2B</div>
              <div className="text-sm text-orange-700">USD anuales</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderAssetTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {RIDERMEX_EDUCATIONAL_CONTENT.productiveAsset.question}
        </h2>
        <p className="text-xl text-orange-600 font-semibold">
          {RIDERMEX_EDUCATIONAL_CONTENT.productiveAsset.answer}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {RIDERMEX_EDUCATIONAL_CONTENT.productiveAsset.details.map((detail, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-orange-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-200 rounded-lg">
                <Bike className="w-6 h-6 text-orange-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">{detail.title}</h3>
                <p className="text-sm text-gray-700">{detail.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderMechanismTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {RIDERMEX_EDUCATIONAL_CONTENT.investmentMechanic.question}
        </h2>
        <p className="text-xl text-blue-600 font-semibold">
          {RIDERMEX_EDUCATIONAL_CONTENT.investmentMechanic.answer}
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Estructura de Inversión</h3>
        {RIDERMEX_EDUCATIONAL_CONTENT.investmentMechanic.mechanism.steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-xl p-6 border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold">
                  {step.number}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">{step.title}</h4>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-8 border-2 border-cyan-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Estructura de Fideicomisos</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {RIDERMEX_EDUCATIONAL_CONTENT.investmentMechanic.trustStructure.trusts.map((trust, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl p-6 border-2 border-cyan-300"
            >
              <h4 className="font-bold text-gray-900 mb-3">{trust.name}</h4>
              <p className="text-sm text-gray-700 mb-3">{trust.purpose}</p>
              <div className="flex items-start gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{trust.benefit}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-300 flex gap-4">
        <AlertCircle className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-amber-900 mb-1">Clave del Modelo</h4>
          <p className="text-sm text-amber-800">
            {RIDERMEX_EDUCATIONAL_CONTENT.keyIndicators.importantNote}
          </p>
        </div>
      </div>
    </motion.div>
  );

  const renderGrowthTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {RIDERMEX_EDUCATIONAL_CONTENT.growthMultiples.question}
        </h2>
        <p className="text-lg text-gray-700 italic">
          {RIDERMEX_EDUCATIONAL_CONTENT.growthMultiples.importantClarity}
        </p>
      </div>

      <div className="space-y-4">
        {RIDERMEX_EDUCATIONAL_CONTENT.growthMultiples.metrics.map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <button
              onClick={() => setExpandedSection(expandedSection === `growth-${idx}` ? null : `growth-${idx}`)}
              className="w-full p-6 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-gray-900">{metric.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{metric.description}</p>
              </div>
              {expandedSection === `growth-${idx}` ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            <AnimatePresence>
              {expandedSection === `growth-${idx}` && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-200 bg-gray-50 p-6 space-y-3"
                >
                  {metric.details.map((detail, didx) => (
                    <div key={didx} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{detail}</span>
                    </div>
                  ))}
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-4 rounded">
                    <p className="text-sm font-semibold text-green-900">{metric.implication}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderImpactTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {RIDERMEX_EDUCATIONAL_CONTENT.socialEnvironmentalImpact.question}
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 border-2 border-blue-300">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-blue-700" />
              <h3 className="text-xl font-bold text-blue-900">
                {RIDERMEX_EDUCATIONAL_CONTENT.socialEnvironmentalImpact.socialImpact.title}
              </h3>
            </div>
            <p className="text-sm text-blue-900 mb-6 font-semibold">
              {RIDERMEX_EDUCATIONAL_CONTENT.socialEnvironmentalImpact.socialImpact.description}
            </p>
            <div className="space-y-4">
              {RIDERMEX_EDUCATIONAL_CONTENT.socialEnvironmentalImpact.socialImpact.aspects.map((aspect, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4">
                  <h4 className="font-bold text-blue-900 mb-2">{aspect.title}</h4>
                  <p className="text-sm text-gray-700 mb-2">{aspect.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8 border-2 border-green-300">
            <div className="flex items-center gap-3 mb-6">
              <Leaf className="w-8 h-8 text-green-700" />
              <h3 className="text-xl font-bold text-green-900">
                {RIDERMEX_EDUCATIONAL_CONTENT.socialEnvironmentalImpact.environmentalImpact.title}
              </h3>
            </div>
            <p className="text-sm text-green-900 mb-6 font-semibold">
              {RIDERMEX_EDUCATIONAL_CONTENT.socialEnvironmentalImpact.environmentalImpact.description}
            </p>
            <div className="space-y-4">
              {RIDERMEX_EDUCATIONAL_CONTENT.socialEnvironmentalImpact.environmentalImpact.aspects.map((aspect, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4">
                  <h4 className="font-bold text-green-900 mb-2">{aspect.title}</h4>
                  <p className="text-sm text-gray-700 mb-2">{aspect.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 rounded-3xl p-8 border-2 border-purple-300">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {RIDERMEX_EDUCATIONAL_CONTENT.socialEnvironmentalImpact.combined.title}
        </h3>
        <p className="text-gray-700 mb-6">
          {RIDERMEX_EDUCATIONAL_CONTENT.socialEnvironmentalImpact.combined.description}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {RIDERMEX_EDUCATIONAL_CONTENT.socialEnvironmentalImpact.combined.outcomes.map((outcome, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-white rounded-lg p-4">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm font-semibold text-gray-900">{outcome}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-1">
          <div className="bg-white p-6">
            <div className="flex flex-wrap gap-2 md:gap-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                      selectedTab === tab.id
                        ? 'bg-orange-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            {selectedTab === 'overview' && renderOverviewTab()}
            {selectedTab === 'asset' && renderAssetTab()}
            {selectedTab === 'mechanism' && renderMechanismTab()}
            {selectedTab === 'growth' && renderGrowthTab()}
            {selectedTab === 'impact' && renderImpactTab()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RidermexEducationalPanel;
