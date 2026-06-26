import React, { useState } from 'react';
import { Globe, ChevronRight, ChevronLeft, TrendingUp, MapPin, DollarSign, Award, Bike, ShoppingCart, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import MarketInsightsPanel from '../MarketInsightsPanel';

interface ReinvestmentMarketContextProps {
  onNext: () => void;
  onPrevious: () => void;
}

const ReinvestmentMarketContext: React.FC<ReinvestmentMarketContextProps> = ({ onNext, onPrevious }) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'clients'>('overview');
  const [isMarketPanelOpen, setIsMarketPanelOpen] = useState(true);

  const sections = ['overview', 'clients'] as const;
  const currentSectionIndex = sections.indexOf(activeSection);
  
  const handleNextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
      setActiveSection(sections[currentSectionIndex + 1]);
    } else {
      onNext(); // Si es la última sección, ir al siguiente paso
    }
  };
  
  const handlePreviousSection = () => {
    if (currentSectionIndex > 0) {
      setActiveSection(sections[currentSectionIndex - 1]);
    } else {
      onPrevious(); // Si es la primera sección, ir al paso anterior
    }
  };

  const renderOverviewSection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-neon-green/100 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Globe className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-neutral-100 mb-4">Contexto Global del Mercado de Motocicletas y Gig Economy</h3>
        <p className="text-neutral-300 max-w-2xl mx-auto">
          Comprende el panorama global que respalda tu inversión en RiderMex y las ventajas competitivas
          únicas que ofrece México en este sector de movilidad estratégico.
        </p>
      </div>

      <MarketInsightsPanel isOpen={isMarketPanelOpen} onToggle={() => setIsMarketPanelOpen(!isMarketPanelOpen)} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-dark-surface border border-blue-500/30 p-6 rounded-xl text-center">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Globe className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-300 mb-1">$125B</div>
          <div className="text-sm text-neutral-400">Mercado Global USD</div>
        </div>

        <div className="bg-dark-surface border border-neon-green/30 p-6 rounded-xl text-center">
          <div className="w-12 h-12 bg-neon-green/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-neon-green" />
          </div>
          <div className="text-2xl font-bold text-neon-green mb-1">18%</div>
          <div className="text-sm text-neutral-400">Crecimiento Anual</div>
        </div>

        <div className="bg-dark-surface border border-amber-500/30 p-6 rounded-xl text-center">
          <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Award className="w-6 h-6 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300 mb-1">6to</div>
          <div className="text-sm text-neutral-400">Lugar Mundial MX</div>
        </div>

        <div className="bg-dark-surface border border-cyan-500/30 p-6 rounded-xl text-center">
          <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-6 h-6 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-300 mb-1">8.5%</div>
          <div className="text-sm text-neutral-400">Participación México</div>
        </div>

        <div className="bg-dark-surface border border-orange-500/30 p-6 rounded-xl text-center">
          <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-6 h-6 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-orange-300 mb-1">$4.2B</div>
          <div className="text-sm text-neutral-400">Impacto Económico MX</div>
        </div>
      </div>
    </div>
  );


  const renderClientsSection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-neutral-100 mb-4">Nuestros Clientes Típicos</h3>
        <p className="text-neutral-300 max-w-2xl mx-auto">
          Conoce los 3 perfiles principales de clientes que se benefician de RiderMex y cómo les presentamos la oportunidad.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-700/50 rounded-xl p-6 border-2 border-green-300 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-center w-14 h-14 bg-green-100 rounded-xl mb-4">
            <Bike className="w-7 h-7 text-green-600" />
          </div>
          <h4 className="font-bold text-neutral-100 mb-3 text-lg">Primerisos</h4>
          <p className="text-sm text-neutral-200 mb-4">Personas que compran su primera motocicleta</p>

          <div className="bg-neon-green/10 border border-neon-green/30 p-4 rounded-lg mb-4">
            <p className="text-xs font-semibold text-neon-green mb-2">PROPUESTA DE VALOR:</p>
            <ul className="text-sm text-neutral-200 space-y-2">
              <li>✓ Lo que gastas en pasajes a la semana</li>
              <li>✓ = Costo de tu moto mensual</li>
              <li>✓ Libertad de movimiento</li>
              <li>✓ Más horas de sueño</li>
              <li>✓ Mayor seguridad personal</li>
            </ul>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg">
            <p className="text-xs font-semibold text-blue-400 mb-1">NO ES GASTO</p>
            <p className="text-sm font-bold text-blue-300">ES INVERSIÓN EN TI</p>
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-xl p-6 border-2 border-orange-300 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-center w-14 h-14 bg-orange-100 rounded-xl mb-4">
            <ShoppingCart className="w-7 h-7 text-orange-600" />
          </div>
          <h4 className="font-bold text-neutral-100 mb-3 text-lg">Repartidores (Delivery)</h4>
          <p className="text-sm text-neutral-200 mb-4">Personas que trabajan en plataformas de delivery</p>

          <div className="bg-neon-red/10 border border-neon-red/30 p-4 rounded-lg mb-4">
            <p className="text-xs font-semibold text-neon-red mb-2">PROPUESTA DE VALOR:</p>
            <ul className="text-sm text-neutral-200 space-y-2">
              <li>✓ Ganancias: $500+ diarios</li>
              <li>✓ Costo moto: $50/día</li>
              <li>✓ 1 hora de trabajo = paga tu moto</li>
              <li>✓ 9 horas de ganancia pura</li>
              <li>✓ Independencia laboral</li>
            </ul>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg">
            <p className="text-xs font-semibold text-blue-400 mb-1">NO ES GASTO</p>
            <p className="text-sm font-bold text-blue-300">ES HERRAMIENTA DE TRABAJO</p>
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-xl p-6 border-2 border-purple-300 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-center w-14 h-14 bg-purple-100 rounded-xl mb-4">
            <Briefcase className="w-7 h-7 text-purple-600" />
          </div>
          <h4 className="font-bold text-neutral-100 mb-3 text-lg">Trabajadores (Lado a Lado)</h4>
          <p className="text-sm text-neutral-200 mb-4">Personas que trabajan en diferentes ubicaciones</p>

          <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-lg mb-4">
            <p className="text-xs font-semibold text-purple-400 mb-2">PROPUESTA DE VALOR:</p>
            <ul className="text-sm text-neutral-200 space-y-2">
              <li>✓ Adiós transporte público</li>
              <li>✓ Viajes de 30 min → 10 min</li>
              <li>✓ Sin esperas ni aglomeración</li>
              <li>✓ Puntualidad garantizada</li>
              <li>✓ Mejor calidad de vida</li>
            </ul>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg">
            <p className="text-xs font-semibold text-blue-400 mb-1">NO ES GASTO</p>
            <p className="text-sm font-bold text-blue-300">ES INVERSIÓN EN TIEMPO</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto"
    >
      <div className="bg-slate-700/50 rounded-3xl shadow-xl overflow-hidden">
        {/* Section Navigation */}
        <div className="bg-slate-700/50 border-b">
          <div className="px-8 py-4">
            <div className="flex bg-dark-surface rounded-lg p-1">
              <button
                onClick={() => setActiveSection('overview')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeSection === 'overview' ? 'bg-slate-700/50 text-green-600 shadow-sm' : 'text-neutral-300 hover:text-neutral-50'
                }`}
              >
                Panorama Global
              </button>
              <button
                onClick={() => setActiveSection('clients')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeSection === 'clients' ? 'bg-slate-700/50 text-green-600 shadow-sm' : 'text-neutral-300 hover:text-neutral-50'
                }`}
              >
                Clientes Típicos
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-[500px]"
          >
            {activeSection === 'overview' && renderOverviewSection()}
            {activeSection === 'clients' && renderClientsSection()}
          </motion.div>
        </div>

        {/* Navigation Buttons */}
        <div className="p-8 bg-dark-surface flex justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePreviousSection}
            className="px-6 py-3 bg-dark-surface text-neutral-200 font-medium rounded-xl hover:bg-dark-border transition-all duration-300 flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>{currentSectionIndex === 0 ? 'Paso Anterior' : 'Sección Anterior'}</span>
          </motion.button>
          
          <div className="flex items-center gap-3">
            {/* Progress indicator */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-400">
                {currentSectionIndex + 1} de {sections.length}
              </span>
              <div className="flex gap-1">
                {sections.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSectionIndex ? 'bg-green-600' : 
                      index < currentSectionIndex ? 'bg-green-300' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextSection}
              className="px-8 py-3 bg-gradient-to-r from-neon-green/100 to-emerald-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <span>
                {currentSectionIndex === sections.length - 1 ? 'Siguiente Paso' : 'Siguiente Sección'}
              </span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReinvestmentMarketContext;