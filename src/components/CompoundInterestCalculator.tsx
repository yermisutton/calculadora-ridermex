import { useState, useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Check, X, ChevronDown, ChevronUp, Info, Layers } from 'lucide-react';
import { DisclaimerBanner } from './ui/DisclaimerBanner';
import Slider from './ui/Slider';

interface CompoundData {
  year: number;
  simple: number;
  compounded: number;
  multiplier: number;
}

interface InvestmentType {
  id: 'simple' | 'compounded' | 'multiplier';
  name: string;
  description: string;
  color: string;
  advantages: string[];
  disadvantages: string[];
  icon: React.ReactNode;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const CompoundInterestCalculator = () => {
  const [initialAmount, setInitialAmount] = useState(70000);
  const [annualRate, setAnnualRate] = useState(18);
  const [years, setYears] = useState(20);
  const [chartType, setChartType] = useState<'area' | 'bar' | 'line'>('area');
  const [expandedComparison, setExpandedComparison] = useState(true);
  const [selectedType, setSelectedType] = useState<'simple' | 'compounded' | 'multiplier' | null>(null);
  const [numberOfAssets, setNumberOfAssets] = useState(5);

  const investmentTypes: InvestmentType[] = useMemo(() => [
    {
      id: 'simple',
      name: 'Interés Simple',
      description: 'Los intereses NO se reinvierten. Solo ganas sobre el capital inicial.',
      color: 'bg-slate-500',
      icon: <TrendingUp className="w-6 h-6" />,
      advantages: [
        'Fácil de calcular',
        'Predecible y constante',
        'Liquidez inmediata de intereses',
        'Sin complejidad administrativa',
      ],
      disadvantages: [
        'NO aprovecha el efecto avalancha',
        'Crecimiento lineal lento',
        'Desperdicia oportunidades de reinversión',
        'Menor patrimonio a largo plazo',
        'Vulnerable a la inflación',
      ],
    },
    {
      id: 'compounded',
      name: 'Interés Compuesto Tradicional',
      description: 'Los intereses se reinvierten en EL MISMO instrumento. Un solo vehículo de inversión.',
      color: 'bg-blue-500',
      icon: <TrendingUp className="w-6 h-6" />,
      advantages: [
        'Efecto avalancha: crece exponencialmente',
        'Capitalización automática',
        'Mayor patrimonio que interés simple',
        'Ventaja significativa en largo plazo',
      ],
      disadvantages: [
        'Un solo instrumento = concentración de riesgo',
        'Si el instrumento falla, pierdes todo',
        'Menos diversificación',
        'Dependes de UN solo activo',
        'Límite en el rendimiento del instrumento',
      ],
    },
    {
      id: 'multiplier',
      name: 'Interés Compuesto Multiplicador (ICM)',
      description: 'Los intereses compran NUEVOS activos/certificados. Múltiples instrumentos generando rendimientos.',
      color: 'bg-green-500',
      icon: <Layers className="w-6 h-6" />,
      advantages: [
        'Efecto avalancha EXPONENCIAL con múltiples activos',
        'Diversificación automática al comprar nuevos instrumentos',
        'Cada activo genera su propio rendimiento',
        'Riesgo distribuido en múltiples certificados',
        'Escalabilidad: más activos = más rendimiento',
        'Patrimonio crece en CANTIDAD de instrumentos',
        'Si un activo falla, los demás siguen generando',
      ],
      disadvantages: [
        'Requiere gestión de múltiples activos',
        'Mayor complejidad administrativa',
        'Costos de transacción al comprar nuevos activos',
        'Requiere liquidez de instrumentos',
      ],
    },
  ], []);

  const calculations = useMemo(() => {
    const data: CompoundData[] = [];
    const multiplierBoost = 1 + (numberOfAssets - 1) * 0.05;

    for (let year = 0; year <= years; year++) {
      const simple = initialAmount * (1 + (annualRate / 100) * year);
      const compounded = initialAmount * Math.pow(1 + annualRate / 100, year);
      const multiplier = compounded * Math.pow(multiplierBoost, year);

      data.push({
        year,
        simple: Math.round(simple),
        compounded: Math.round(compounded),
        multiplier: Math.round(multiplier),
      });
    }

    const finalSimple = data[years].simple;
    const finalCompounded = data[years].compounded;
    const finalMultiplier = data[years].multiplier;

    return {
      data,
      finalSimple,
      finalCompounded,
      finalMultiplier,
      gainSimple: finalSimple - initialAmount,
      gainCompounded: finalCompounded - initialAmount,
      gainMultiplier: finalMultiplier - initialAmount,
      multiplierSimple: finalSimple / initialAmount,
      multiplierCompounded: finalCompounded / initialAmount,
      multiplierICM: finalMultiplier / initialAmount,
      avalancheVsSimple: finalCompounded - finalSimple,
      avalancheVsCompounded: finalMultiplier - finalCompounded,
    };
  }, [initialAmount, annualRate, years, numberOfAssets]);

  const chartData = useMemo(() => {
    if (years <= 25) return calculations.data;
    const step = Math.ceil(years / 25);
    return calculations.data.filter((_, i) => i % step === 0 || i === years);
  }, [calculations.data, years]);

  const tableData = useMemo(() => {
    return calculations.data.filter((_, i) => i === 0 || i % Math.ceil(years / 10) === 0 || i === years);
  }, [calculations.data, years]);

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    };

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="year" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              />
              <Legend />
              <Bar dataKey="simple" fill="#64748b" name="Simple" radius={[8, 8, 0, 0]} />
              <Bar dataKey="compounded" fill="#3b82f6" name="Compuesto" radius={[8, 8, 0, 0]} />
              <Bar dataKey="multiplier" fill="#10b981" name="Multiplicador (ICM)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="year" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              />
              <Legend />
              <Line type="monotone" dataKey="simple" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" name="Simple" dot={false} />
              <Line type="monotone" dataKey="compounded" stroke="#3b82f6" strokeWidth={2} name="Compuesto" dot={false} />
              <Line type="monotone" dataKey="multiplier" stroke="#10b981" strokeWidth={3} name="Multiplicador (ICM)" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart {...commonProps}>
              <defs>
                <linearGradient id="colorSimple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCompounded" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMultiplier" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="year" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              />
              <Legend />
              <Area type="monotone" dataKey="simple" stroke="#64748b" fillOpacity={1} fill="url(#colorSimple)" name="Simple" />
              <Area type="monotone" dataKey="compounded" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCompounded)" name="Compuesto" />
              <Area type="monotone" dataKey="multiplier" stroke="#10b981" fillOpacity={1} fill="url(#colorMultiplier)" name="Multiplicador (ICM)" />
            </AreaChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8 bg-slate-900 min-h-screen">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Comparador de Intereses</h1>
            <p className="text-neutral-400">Simple vs Compuesto vs Multiplicador (ICM)</p>
          </div>
        </div>
      </div>

      <DisclaimerBanner variant="compact" />

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
          <label className="text-neutral-400 text-sm font-medium">Inversión Inicial</label>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-2xl font-bold text-green-500">$</span>
            <input
              type="number"
              value={initialAmount}
              onChange={(e) => setInitialAmount(Math.max(0, Number(e.target.value)))}
              className="text-3xl font-bold bg-transparent text-white outline-none w-full"
            />
          </div>
          <Slider
            value={initialAmount}
            onChange={setInitialAmount}
            min={1000}
            max={1000000}
            step={5000}
            label=""
            formatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
          <label className="text-neutral-400 text-sm font-medium">Tasa Anual</label>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-3xl font-bold text-blue-500">{annualRate.toFixed(1)}%</span>
          </div>
          <Slider
            value={annualRate}
            onChange={setAnnualRate}
            min={1}
            max={50}
            step={0.5}
            label=""
            formatter={(v) => `${v.toFixed(1)}%`}
          />
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
          <label className="text-neutral-400 text-sm font-medium">Plazo (Años)</label>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-3xl font-bold text-purple-500">{years}</span>
            <span className="text-neutral-400">años</span>
          </div>
          <Slider
            value={years}
            onChange={setYears}
            min={1}
            max={50}
            step={1}
            label=""
            formatter={(v) => `${v} años`}
          />
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
          <label className="text-neutral-400 text-sm font-medium flex items-center gap-2">
            Activos en ICM
            <Info className="w-4 h-4 text-blue-400" title="Número de instrumentos/certificados que compras con las ganancias" />
          </label>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-3xl font-bold text-emerald-500">{numberOfAssets}</span>
            <span className="text-neutral-400">activos</span>
          </div>
          <Slider
            value={numberOfAssets}
            onChange={setNumberOfAssets}
            min={1}
            max={20}
            step={1}
            label=""
            formatter={(v) => `${v} activos`}
          />
        </div>
      </motion.div>

      <motion.div
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <button
          onClick={() => setExpandedComparison(!expandedComparison)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-700/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <Info className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Comparación Detallada: Ventajas y Desventajas</h2>
              <p className="text-sm text-neutral-400">Click para ver el análisis completo</p>
            </div>
          </div>
          {expandedComparison ? <ChevronUp className="w-6 h-6 text-neutral-400" /> : <ChevronDown className="w-6 h-6 text-neutral-400" />}
        </button>

        <AnimatePresence>
          {expandedComparison && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-slate-700"
            >
              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {investmentTypes.map((type) => (
                  <motion.div
                    key={type.id}
                    className={`relative rounded-xl p-6 border-2 cursor-pointer transition-all ${
                      selectedType === type.id
                        ? `${type.color} border-opacity-50 shadow-lg`
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                    }`}
                    onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`${type.color} p-3 rounded-lg text-white`}>
                        {type.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">{type.name}</h3>
                        <p className="text-xs text-neutral-400 mt-1">{type.description}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Check className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-semibold text-green-400">Ventajas</span>
                        </div>
                        <ul className="space-y-1">
                          {type.advantages.map((adv, i) => (
                            <li key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                              <span className="text-green-400 mt-0.5">•</span>
                              <span>{adv}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <X className="w-4 h-4 text-red-400" />
                          <span className="text-sm font-semibold text-red-400">Desventajas</span>
                        </div>
                        <ul className="space-y-1">
                          {type.disadvantages.map((dis, i) => (
                            <li key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                              <span className="text-red-400 mt-0.5">•</span>
                              <span>{dis}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-gradient-to-br from-slate-500/10 to-slate-600/5 rounded-xl p-6 border border-slate-500/30">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-slate-500"></div>
            <p className="text-neutral-400 text-sm font-semibold">Interés Simple</p>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-neutral-500">Monto Final</p>
              <div className="text-2xl font-bold text-slate-400">
                {formatCurrency(calculations.finalSimple)}
              </div>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Multiplicador</p>
              <p className="text-xl font-bold text-slate-400">{calculations.multiplierSimple.toFixed(1)}x</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <p className="text-neutral-400 text-sm font-semibold">Interés Compuesto</p>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-neutral-500">Monto Final</p>
              <div className="text-2xl font-bold text-blue-400">
                {formatCurrency(calculations.finalCompounded)}
              </div>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Multiplicador</p>
              <p className="text-xl font-bold text-blue-400">{calculations.multiplierCompounded.toFixed(1)}x</p>
            </div>
            <div className="pt-2 border-t border-blue-500/20">
              <p className="text-xs text-blue-300">+{formatCurrency(calculations.avalancheVsSimple)} vs Simple</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl p-6 border-2 border-green-500/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            MEJOR
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <p className="text-neutral-400 text-sm font-semibold">Multiplicador (ICM)</p>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-neutral-500">Monto Final</p>
              <div className="text-2xl font-bold text-green-400">
                {formatCurrency(calculations.finalMultiplier)}
              </div>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Multiplicador</p>
              <p className="text-xl font-bold text-green-400">{calculations.multiplierICM.toFixed(1)}x</p>
            </div>
            <div className="pt-2 border-t border-green-500/20 space-y-1">
              <p className="text-xs text-green-300">+{formatCurrency(calculations.avalancheVsSimple)} vs Simple</p>
              <p className="text-xs text-green-300 font-semibold">+{formatCurrency(calculations.avalancheVsCompounded)} vs Compuesto</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Comparación Visual</h2>
          <div className="flex gap-2">
            {(['area', 'bar', 'line'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  chartType === type
                    ? 'bg-green-500 text-black'
                    : 'bg-slate-700 text-neutral-300 hover:bg-slate-600'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {renderChart()}
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 overflow-x-auto">
        <h2 className="text-xl font-bold text-white mb-4">Tabla Comparativa por Año</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-600">
              <th className="text-left py-3 px-4 text-neutral-400">Año</th>
              <th className="text-right py-3 px-4 text-slate-400">Simple</th>
              <th className="text-right py-3 px-4 text-blue-400">Compuesto</th>
              <th className="text-right py-3 px-4 text-green-400">Multiplicador (ICM)</th>
              <th className="text-right py-3 px-4 text-orange-400">Diferencia ICM vs Simple</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.year} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                <td className="py-3 px-4 text-white font-medium">{row.year}</td>
                <td className="text-right py-3 px-4 text-slate-400">{formatCurrency(row.simple)}</td>
                <td className="text-right py-3 px-4 text-blue-400 font-semibold">{formatCurrency(row.compounded)}</td>
                <td className="text-right py-3 px-4 text-green-400 font-bold">{formatCurrency(row.multiplier)}</td>
                <td className="text-right py-3 px-4 text-orange-500 font-semibold">+{formatCurrency(row.multiplier - row.simple)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <motion.div
        className="bg-gradient-to-br from-green-500/20 to-emerald-600/10 rounded-xl p-8 border border-green-500/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-start gap-4">
          <div className="bg-green-500 p-3 rounded-xl">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-green-400 mb-3">La Diferencia del ICM: Múltiples Activos</h3>
            <div className="space-y-3 text-neutral-200">
              <p className="leading-relaxed">
                <span className="font-bold text-white">Interés Simple:</span> Ganas {formatCurrency(calculations.gainSimple)} manteniendo 1 solo instrumento.
              </p>
              <p className="leading-relaxed">
                <span className="font-bold text-blue-400">Interés Compuesto Tradicional:</span> Ganas {formatCurrency(calculations.gainCompounded)} reinvirtiendo en el MISMO instrumento.
              </p>
              <p className="leading-relaxed bg-green-500/10 p-4 rounded-lg border border-green-500/30">
                <span className="font-bold text-green-400">Interés Compuesto Multiplicador (ICM):</span> Ganas {formatCurrency(calculations.gainMultiplier)} porque compras <span className="text-green-300 font-bold">{numberOfAssets} NUEVOS activos/certificados</span> con tus ganancias.
                Cada activo genera su propio rendimiento. No dependes de 1 solo instrumento, tienes <span className="text-green-300 font-bold">{numberOfAssets} fuentes de ingreso</span>.
              </p>
              <div className="pt-4 border-t border-green-500/30">
                <p className="text-orange-400 font-bold text-lg">
                  Efecto Avalancha Total: {formatCurrency(calculations.avalancheVsCompounded)} más que el compuesto tradicional
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CompoundInterestCalculator;
