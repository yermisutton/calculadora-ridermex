import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calculator, Info, ArrowRight, BarChart3, ArrowLeft, Eye } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { DisclaimerBanner } from './ui/DisclaimerBanner';

interface ScenarioData {
  year: number;
  simple: number;
  compuesto: number;
  multiplicador: number;
}

export default function ThreeScenarioComparator() {
  const navigate = useNavigate();
  const [capitalInicial, setCapitalInicial] = useState(100000);
  const [tasaSimple, setTasaSimple] = useState(5);
  const [tasaCompuesto, setTasaCompuesto] = useState(8);
  const [tasaMultiplicador, setTasaMultiplicador] = useState(12);
  const [anos, setAnos] = useState(10);
  const [activosMultiplicador, setActivosMultiplicador] = useState(3);

  const calcularEscenarios = useMemo((): ScenarioData[] => {
    const data: ScenarioData[] = [];

    for (let year = 0; year <= anos; year++) {
      const simple = capitalInicial + (capitalInicial * (tasaSimple / 100) * year);

      const compuesto = capitalInicial * Math.pow(1 + tasaCompuesto / 100, year);

      const multiplicador = capitalInicial * Math.pow(1 + tasaMultiplicador / 100, year) * Math.pow(1 + (activosMultiplicador - 1) * 0.05, year);

      data.push({
        year,
        simple: Math.round(simple),
        compuesto: Math.round(compuesto),
        multiplicador: Math.round(multiplicador)
      });
    }

    return data;
  }, [capitalInicial, tasaSimple, tasaCompuesto, tasaMultiplicador, anos, activosMultiplicador]);

  const resultadosFinales = useMemo(() => {
    const ultimo = calcularEscenarios[calcularEscenarios.length - 1];
    return {
      simple: ultimo.simple,
      compuesto: ultimo.compuesto,
      multiplicador: ultimo.multiplicador,
      gananciasSimple: ultimo.simple - capitalInicial,
      gananciasCompuesto: ultimo.compuesto - capitalInicial,
      gananciasMultiplicador: ultimo.multiplicador - capitalInicial
    };
  }, [calcularEscenarios, capitalInicial]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with Logo and Navigation */}
      <div className="bg-white shadow-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/rider_inversiones.png"
                alt="Ridermex Inversiones"
                className="h-12 w-auto"
              />
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Volver</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-semibold text-slate-900">Vista de Águila</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Comparador de Escenarios de Inversión
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Compara a vista de águila tres estrategias de inversión: Interés Simple, Interés Compuesto e Interés Compuesto Multiplicador
          </p>
        </div>

        <DisclaimerBanner variant="compact" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-amber-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Interés Simple</h3>
                <p className="text-sm text-slate-500">Lineal y predecible</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tasa Anual (%)
                </label>
                <input
                  type="number"
                  value={tasaSimple}
                  onChange={(e) => setTasaSimple(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  step="0.5"
                />
                <p className="text-xs text-slate-500 mt-1">CETES, inflación, etc.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Interés Compuesto</h3>
                <p className="text-sm text-slate-500">Exponencial tradicional</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tasa Anual (%)
                </label>
                <input
                  type="number"
                  value={tasaCompuesto}
                  onChange={(e) => setTasaCompuesto(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  step="0.5"
                />
                <p className="text-xs text-slate-500 mt-1">A = P(1+r)^n</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Compuesto Multiplicador</h3>
                <p className="text-sm text-slate-500">Activos productivos múltiples</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tasa Anual (%)
                </label>
                <input
                  type="number"
                  value={tasaMultiplicador}
                  onChange={(e) => setTasaMultiplicador(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  step="0.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Número de Activos
                </label>
                <input
                  type="number"
                  value={activosMultiplicador}
                  onChange={(e) => setActivosMultiplicador(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  min="1"
                  max="10"
                />
                <p className="text-xs text-slate-500 mt-1">Activos productivos trabajando</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Capital Inicial
            </label>
            <input
              type="number"
              value={capitalInicial}
              onChange={(e) => setCapitalInicial(Number(e.target.value))}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
              step="10000"
            />
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Período (Años)
            </label>
            <input
              type="number"
              value={anos}
              onChange={(e) => setAnos(Number(e.target.value))}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
              min="1"
              max="50"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Comparativa Visual</h2>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={calcularEscenarios}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                label={{ value: 'Años', position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                label={{ value: 'Valor', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Año ${label}`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="simple"
                stackId="1"
                stroke="#f59e0b"
                fill="#fef3c7"
                name="Interés Simple"
              />
              <Area
                type="monotone"
                dataKey="compuesto"
                stackId="2"
                stroke="#3b82f6"
                fill="#dbeafe"
                name="Interés Compuesto"
              />
              <Area
                type="monotone"
                dataKey="multiplicador"
                stackId="3"
                stroke="#10b981"
                fill="#d1fae5"
                name="Compuesto Multiplicador"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-lg p-6 border-2 border-amber-300">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-amber-700" />
              <h3 className="font-bold text-amber-900">Interés Simple</h3>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-amber-700">Valor Final</p>
                <p className="text-2xl font-bold text-amber-900">{formatCurrency(resultadosFinales.simple)}</p>
              </div>
              <div>
                <p className="text-sm text-amber-700">Ganancias</p>
                <p className="text-xl font-semibold text-amber-800">{formatCurrency(resultadosFinales.gananciasSimple)}</p>
              </div>
              <div>
                <p className="text-sm text-amber-700">ROI</p>
                <p className="text-lg font-medium text-amber-700">
                  {((resultadosFinales.gananciasSimple / capitalInicial) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 border-2 border-blue-300">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-blue-700" />
              <h3 className="font-bold text-blue-900">Interés Compuesto</h3>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-blue-700">Valor Final</p>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(resultadosFinales.compuesto)}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700">Ganancias</p>
                <p className="text-xl font-semibold text-blue-800">{formatCurrency(resultadosFinales.gananciasCompuesto)}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700">ROI</p>
                <p className="text-lg font-medium text-blue-700">
                  {((resultadosFinales.gananciasCompuesto / capitalInicial) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="pt-2 border-t border-blue-200">
                <p className="text-xs text-blue-600">
                  vs Simple: +{formatCurrency(resultadosFinales.compuesto - resultadosFinales.simple)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 border-2 border-green-300">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-5 h-5 text-green-700" />
              <h3 className="font-bold text-green-900">Compuesto Multiplicador</h3>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-green-700">Valor Final</p>
                <p className="text-2xl font-bold text-green-900">{formatCurrency(resultadosFinales.multiplicador)}</p>
              </div>
              <div>
                <p className="text-sm text-green-700">Ganancias</p>
                <p className="text-xl font-semibold text-green-800">{formatCurrency(resultadosFinales.gananciasMultiplicador)}</p>
              </div>
              <div>
                <p className="text-sm text-green-700">ROI</p>
                <p className="text-lg font-medium text-green-700">
                  {((resultadosFinales.gananciasMultiplicador / capitalInicial) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="pt-2 border-t border-green-200">
                <p className="text-xs text-green-600">
                  vs Compuesto: +{formatCurrency(resultadosFinales.multiplicador - resultadosFinales.compuesto)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-slate-900">Interés Simple</h3>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Ventajas
              </h4>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>• Fácil de calcular y predecir</li>
                <li>• Flujos constantes y predecibles</li>
                <li>• Ideal para necesidades a corto plazo</li>
                <li>• Sin sorpresas ni volatilidad</li>
                <li>• Perfecto para CETES o bonos</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" /> Desventajas
              </h4>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>• Crecimiento lento y lineal</li>
                <li>• No aprovecha el efecto bola de nieve</li>
                <li>• Puede perder contra la inflación</li>
                <li>• Menor rentabilidad a largo plazo</li>
                <li>• No multiplica tu riqueza</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900">Interés Compuesto</h3>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Ventajas
              </h4>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>• Crecimiento exponencial</li>
                <li>• Efecto bola de nieve</li>
                <li>• Los intereses generan más intereses</li>
                <li>• Excelente para largo plazo</li>
                <li>• Fórmula: A = P(1+r)^n</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" /> Desventajas
              </h4>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>• Requiere paciencia y tiempo</li>
                <li>• Tentación de retirar ganancias</li>
                <li>• Trabaja con un solo activo</li>
                <li>• Menos liquidez inmediata</li>
                <li>• No maximiza el potencial</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-slate-900">Compuesto Multiplicador</h3>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Ventajas
              </h4>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>• Múltiples activos trabajando</li>
                <li>• Crecimiento exponencial acelerado</li>
                <li>• Diversificación automática</li>
                <li>• Efecto avalancha de riqueza</li>
                <li>• Maximiza el potencial de inversión</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" /> Desventajas
              </h4>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>• Requiere capital inicial mayor</li>
                <li>• Más complejo de gestionar</li>
                <li>• Necesita estrategia clara</li>
                <li>• Mayor compromiso temporal</li>
                <li>• Requiere disciplina de reinversión</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl shadow-lg p-8 text-white">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Conclusión</h2>
            <p className="text-lg mb-6">
              El Interés Compuesto Multiplicador demuestra el poder de reinvertir tus ganancias en múltiples activos productivos.
              Mientras el interés simple te da un crecimiento lineal y el compuesto tradicional crece exponencialmente,
              el multiplicador acelera ese crecimiento al tener varios activos generando rendimientos simultáneamente.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <p className="text-sm opacity-90">Diferencia vs Simple</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(resultadosFinales.multiplicador - resultadosFinales.simple)}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <p className="text-sm opacity-90">Diferencia vs Compuesto</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(resultadosFinales.multiplicador - resultadosFinales.compuesto)}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <p className="text-sm opacity-90">Multiplicador Total</p>
                <p className="text-2xl font-bold">
                  {(resultadosFinales.multiplicador / capitalInicial).toFixed(2)}x
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-slate-100 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-slate-600 mt-0.5" />
            <div className="text-sm text-slate-600">
              <p className="font-medium mb-2">Nota Importante:</p>
              <p>
                Esta calculadora es una herramienta educativa para comparar diferentes estrategias de inversión.
                Los resultados son ilustrativos y no constituyen asesoría financiera. El modelo del Compuesto Multiplicador
                asume que reinviertes tus ganancias para adquirir activos adicionales que generen rendimientos de forma simultánea.
                Consulta con un asesor financiero antes de tomar decisiones de inversión.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
