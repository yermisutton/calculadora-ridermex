import React from 'react';
import { ArrowRight, TrendingUp, TrendingDown, BarChart3, Eye, DollarSign, Target, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CALCULATOR_ROUTES } from '../utils/calculatorRoutes';

export default function ThreeScenarioLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Eye className="w-12 h-12 text-blue-400" />
            <h1 className="text-5xl font-bold text-white">
              Vista de Águila
            </h1>
          </div>
          <p className="text-2xl text-blue-200 mb-4">
            Comparador de Escenarios de Inversión
          </p>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Descubre la diferencia entre tres estrategias de inversión y entiende por qué
            el interés compuesto multiplicador puede cambiar tu futuro financiero
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8 text-white transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-4">
              <TrendingDown className="w-10 h-10" />
              <h3 className="text-2xl font-bold">Interés Simple</h3>
            </div>
            <div className="space-y-4">
              <p className="text-amber-50">
                Crecimiento lineal y predecible. Los intereses no se reinvierten.
              </p>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <p className="font-mono text-sm mb-2">Fórmula:</p>
                <p className="font-bold text-lg">A = P + (P × r × n)</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  <p className="text-sm">Ideal para CETES, bonos</p>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <p className="text-sm">Flujos constantes</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 text-white transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-10 h-10" />
              <h3 className="text-2xl font-bold">Interés Compuesto</h3>
            </div>
            <div className="space-y-4">
              <p className="text-blue-50">
                Crecimiento exponencial. Los intereses generan más intereses.
              </p>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <p className="font-mono text-sm mb-2">Fórmula:</p>
                <p className="font-bold text-lg">A = P(1 + r)^n</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  <p className="text-sm">Efecto bola de nieve</p>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <p className="text-sm">Largo plazo potente</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl p-8 text-white transform hover:scale-105 transition-transform duration-300 ring-4 ring-yellow-400">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-10 h-10" />
              <h3 className="text-2xl font-bold">Compuesto Multiplicador</h3>
            </div>
            <div className="space-y-4">
              <p className="text-green-50">
                Múltiples activos trabajando. Crecimiento exponencial acelerado.
              </p>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <p className="font-mono text-sm mb-2">Concepto:</p>
                <p className="font-bold text-lg">Reinversión → Más Activos</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-300" />
                  <p className="text-sm font-semibold">Efecto avalancha</p>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <p className="text-sm">Diversificación automática</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-12 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            ¿Por qué el Compuesto Multiplicador es Diferente?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-300 mb-3">Interés Compuesto Tradicional</h3>
              <p className="text-slate-200 mb-4">
                Reinviertes las ganancias en el mismo activo. Tienes un certificado que crece exponencialmente.
              </p>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-slate-300 text-sm">Ejemplo:</p>
                <p className="text-white font-semibold">1 certificado → crece a $100,000</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-800/50 to-emerald-800/50 rounded-xl p-6 ring-2 ring-green-400">
              <h3 className="text-xl font-bold text-green-300 mb-3">Compuesto Multiplicador</h3>
              <p className="text-slate-200 mb-4">
                Reinviertes para comprar MÁS certificados. Cada uno crece exponencialmente y trabaja en paralelo.
              </p>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-slate-300 text-sm">Ejemplo:</p>
                <p className="text-white font-semibold">3 certificados → cada uno crece → efecto multiplicado</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-10 text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Visualiza el Poder de Cada Estrategia
          </h2>
          <p className="text-xl text-blue-50 mb-8 max-w-3xl mx-auto">
            Ingresa tus números y compara en tiempo real cómo cada estrategia afecta tu patrimonio
            a lo largo del tiempo. Los gráficos y comparativas te darán una vista de águila sobre tu futuro financiero.
          </p>
          <button
            onClick={() => navigate(CALCULATOR_ROUTES.COMPARADOR_3_ESCENARIOS)}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors inline-flex items-center gap-3 shadow-xl"
          >
            Comenzar Comparación
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Comparación Visual</h3>
            <p className="text-slate-300 text-sm">
              Gráficos interactivos que muestran claramente las diferencias entre las tres estrategias
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Análisis Detallado</h3>
            <p className="text-slate-300 text-sm">
              Ventajas y desventajas de cada estrategia para tomar decisiones informadas
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Números Reales</h3>
            <p className="text-slate-300 text-sm">
              Calcula con tus propios números y ve el impacto exacto en tu patrimonio
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
