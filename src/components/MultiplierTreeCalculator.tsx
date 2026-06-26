import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Sprout, TreeDeciduous, Trees, Calculator, Sparkles, Zap, Eye, ArrowLeft } from 'lucide-react';
import { DisclaimerBanner } from './ui/DisclaimerBanner';

interface InvestmentScenario {
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
}

interface MultiplierTreeCalculatorProps {
  onBack?: () => void;
}

const MultiplierTreeCalculator: React.FC<MultiplierTreeCalculatorProps> = ({ onBack }) => {
  const [numberOfCertificates, setNumberOfCertificates] = useState(10);
  const [certificatePrice] = useState(266000);
  const [years, setYears] = useState(10);
  const [annualRate, setAnnualRate] = useState(12);
  const [hoveredScenario, setHoveredScenario] = useState<string | null>(null);
  const [showSparkles, setShowSparkles] = useState(false);

  const initialInvestment = numberOfCertificates * certificatePrice;

  const scenarios: InvestmentScenario[] = [
    {
      name: 'Ahorro',
      icon: <Sprout className="w-6 h-6" />,
      color: '#64748b',
      bgColor: '#f1f5f9',
      description: 'Solo guardas la semilla'
    },
    {
      name: 'ICT',
      icon: <TreeDeciduous className="w-6 h-6" />,
      color: '#0ea5e9',
      bgColor: '#e0f2fe',
      description: 'Fortaleces un solo árbol'
    },
    {
      name: 'ICM',
      icon: <Trees className="w-6 h-6" />,
      color: '#10b981',
      bgColor: '#d1fae5',
      description: 'Multiplicas el bosque'
    }
  ];

  const calculateResults = useMemo(() => {
    const totalYears = years;
    const yearlyRate = annualRate / 100;

    const ahorro = initialInvestment;

    let capitalICT = initialInvestment;
    let interestAccumulatedICT = 0;
    for (let i = 0; i < totalYears; i++) {
      const yearlyInterest = capitalICT * yearlyRate;
      interestAccumulatedICT += yearlyInterest;
    }
    const ict = capitalICT + interestAccumulatedICT;

    let icm = initialInvestment;
    for (let i = 0; i < totalYears; i++) {
      icm = icm * (1 + yearlyRate);
    }

    return [
      { scenario: 'Ahorro', value: ahorro, percentage: 100 },
      { scenario: 'ICT', value: ict, percentage: (ict / ahorro) * 100 },
      { scenario: 'ICM', value: icm, percentage: (icm / ahorro) * 100 }
    ];
  }, [initialInvestment, years, annualRate]);

  const maxValue = Math.max(...calculateResults.map(r => r.value));

  const getTreeStage = (value: number, scenario: string) => {
    if (scenario === 'Ahorro') return 'semilla';
    if (scenario === 'ICT') return 'arbol';
    return 'bosque';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getMultiplier = (current: number, base: number) => {
    return (current / base).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 py-12 px-4 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-30 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
          ]
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {onBack && (
          <motion.button
            onClick={onBack}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all font-medium"
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Regresar al inicio
          </motion.button>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-4"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)" }}
          >
            <Eye className="w-4 h-4" />
            Vista de Águila: Educa sin fricción
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            Entiende el ICM con una historia sencilla
          </motion.h2>

          <motion.div
            className="max-w-3xl mx-auto mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.h3
              className="text-2xl md:text-3xl font-semibold text-emerald-700 mb-4 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <motion.span
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                El árbol del dinero multiplicador
              </motion.span>
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                <Trees className="w-8 h-8" />
              </motion.div>
            </motion.h3>

            <motion.p
              className="text-lg text-gray-700 leading-relaxed mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              El ahorro solo guarda la semilla sin hacerla crecer. El ICT hace crecer un árbol con intereses, pero
              no reinviertes los rendimientos. El ICM reinvierte el 100% de los rendimientos automáticamente,
              plantando nuevos árboles multiplicadores. Cada árbol nuevo genera más frutos que se reinvierten,
              creando un bosque exponencial que multiplica tu patrimonio.
            </motion.p>

            <motion.h4
              className="text-xl font-semibold text-emerald-600 italic mb-6 relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, type: "spring" }}
            >
              <motion.span
                animate={{
                  textShadow: [
                    "0 0 0px rgba(16, 185, 129, 0)",
                    "0 0 10px rgba(16, 185, 129, 0.5)",
                    "0 0 0px rgba(16, 185, 129, 0)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                "El ICM hace que cada árbol nuevo multiplique el bosque."
              </motion.span>
              <motion.div
                className="absolute -right-8 top-1/2 -translate-y-1/2"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
              >
                <Sparkles className="w-6 h-6 text-amber-500" />
              </motion.div>
            </motion.h4>
          </motion.div>
        </motion.div>

        <DisclaimerBanner variant="compact" />

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            className="bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent hover:border-emerald-200 transition-all"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="p-3 bg-sky-100 rounded-xl"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Calculator className="w-6 h-6 text-sky-600" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900">Configura tu inversión</h3>
            </div>

            <div className="space-y-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  Número de Certificados
                </label>
                <motion.input
                  type="number"
                  value={numberOfCertificates}
                  onChange={(e) => {
                    setNumberOfCertificates(Number(e.target.value));
                    setShowSparkles(true);
                    setTimeout(() => setShowSparkles(false), 500);
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none text-lg font-semibold transition-all hover:border-emerald-300"
                  step="1"
                  min="1"
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.1)" }}
                />
                <motion.p
                  className="text-sm text-gray-500 mt-1"
                  animate={showSparkles ? { scale: [1, 1.1, 1], color: ['#6b7280', '#10b981', '#6b7280'] } : {}}
                >
                  {numberOfCertificates} certificado{numberOfCertificates !== 1 ? 's' : ''} × {formatCurrency(certificatePrice)} = {formatCurrency(initialInvestment)}
                </motion.p>
              </motion.div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plazo (años)
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>1 año</span>
                  <span className="font-bold text-emerald-600 text-lg">{years} años</span>
                  <span>30 años</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tasa Anual (%)
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.5"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>1%</span>
                  <span className="font-bold text-sky-600 text-lg">{annualRate}%</span>
                  <span>20%</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-lg p-8 text-white"
          >
            <h3 className="text-2xl font-bold mb-6">Etapas del Crecimiento</h3>

            <div className="space-y-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-white/20"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Sprout className="w-8 h-8" />
                  <div>
                    <h4 className="font-bold text-lg">Semilla - Ahorro</h4>
                    <p className="text-emerald-100 text-sm">Solo guardas dinero</p>
                  </div>
                </div>
                <p className="text-white/90 text-sm leading-relaxed">
                  Solo guardas dinero mes a mes. No hay intereses, no hay crecimiento. Es simplemente acumulación sin multiplicación.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-white/20"
              >
                <div className="flex items-center gap-3 mb-3">
                  <TreeDeciduous className="w-8 h-8" />
                  <div>
                    <h4 className="font-bold text-lg">Árbol - ICT</h4>
                    <p className="text-emerald-100 text-sm">Un árbol fuerte</p>
                  </div>
                </div>
                <p className="text-white/90 text-sm leading-relaxed">
                  Tu inversión genera intereses sobre el capital, pero NO reinviertes los rendimientos. El árbol crece moderadamente.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-white/20"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Trees className="w-8 h-8" />
                  <div>
                    <h4 className="font-bold text-lg">Bosque - ICM</h4>
                    <p className="text-emerald-100 text-sm">Multiplicación exponencial</p>
                  </div>
                </div>
                <p className="text-white/90 text-sm leading-relaxed">
                  Reinviertes el 100% de los rendimientos automáticamente. Cada peso de interés se multiplica plantando nuevos árboles que generan más intereses.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Comparación Visual del Crecimiento
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {calculateResults.map((result, index) => {
              const scenario = scenarios[index];
              const heightPercentage = (result.value / maxValue) * 100;
              const multiplier = getMultiplier(result.value, calculateResults[0].value);
              const isHovered = hoveredScenario === scenario.name;

              return (
                <motion.div
                  key={scenario.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="relative"
                  onMouseEnter={() => setHoveredScenario(scenario.name)}
                  onMouseLeave={() => setHoveredScenario(null)}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                >
                  <div className="text-center mb-4">
                    <motion.div
                      className="inline-flex p-4 rounded-2xl mb-3 relative"
                      style={{ backgroundColor: scenario.bgColor, color: scenario.color }}
                      animate={isHovered ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      {scenario.icon}
                      {isHovered && index === 2 && (
                        <motion.div
                          className="absolute -top-1 -right-1"
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1.2, 1], rotate: [0, 180, 360] }}
                          transition={{ duration: 0.5 }}
                        >
                          <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                        </motion.div>
                      )}
                    </motion.div>
                    <h4 className="font-bold text-lg text-gray-900">{scenario.name}</h4>
                    <p className="text-sm text-gray-600">{scenario.description}</p>
                  </div>

                  <div className="relative h-64 mb-4 bg-gray-100 rounded-2xl overflow-hidden">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercentage}%` }}
                      transition={{ duration: 1, delay: 0.6 + index * 0.1, type: "spring", stiffness: 100 }}
                      className="absolute bottom-0 left-0 right-0 rounded-t-2xl relative overflow-hidden"
                      style={{ backgroundColor: scenario.color }}
                    >
                      <motion.div
                        className="absolute inset-0 opacity-20"
                        animate={{
                          backgroundPosition: ['0% 0%', '100% 100%'],
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        style={{
                          backgroundImage: 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.3) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.3) 75%)',
                          backgroundSize: '20px 20px'
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: isHovered ? 1.2 : 1 }}
                          transition={{ delay: 1.2 + index * 0.1, type: "spring", stiffness: 200 }}
                        >
                          {index === 0 && <Sprout className="w-12 h-12 text-white drop-shadow-lg" />}
                          {index === 1 && <TreeDeciduous className="w-16 h-16 text-white drop-shadow-lg" />}
                          {index === 2 && (
                            <motion.div
                              animate={isHovered ? { rotate: [0, -5, 5, -5, 0] } : {}}
                              transition={{ duration: 0.5 }}
                            >
                              <Trees className="w-20 h-20 text-white drop-shadow-lg" />
                            </motion.div>
                          )}
                        </motion.div>
                      </div>
                      {isHovered && (
                        <motion.div
                          className="absolute inset-0 bg-white opacity-20"
                          initial={{ y: "100%" }}
                          animate={{ y: "-100%" }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                  </div>

                  <motion.div
                    className="rounded-xl p-4 text-center relative overflow-hidden"
                    style={{ backgroundColor: scenario.bgColor }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {isHovered && index === 2 && (
                      <>
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute"
                            initial={{ opacity: 0, scale: 0, x: "50%", y: "50%" }}
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0, 1.5, 0],
                              x: `${50 + Math.cos((i * 2 * Math.PI) / 5) * 100}%`,
                              y: `${50 + Math.sin((i * 2 * Math.PI) / 5) * 100}%`,
                            }}
                            transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
                          >
                            <Sparkles className="w-4 h-4 text-emerald-500" />
                          </motion.div>
                        ))}
                      </>
                    )}
                    <motion.div
                      className="text-2xl font-bold mb-1"
                      style={{ color: scenario.color }}
                      animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
                    >
                      {formatCurrency(result.value)}
                    </motion.div>
                    <div className="text-sm font-semibold text-gray-600">
                      {multiplier}x el ahorro
                    </div>
                    {index === 2 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-700"
                      >
                        <TrendingUp className="w-4 h-4" />
                        +{((result.value / calculateResults[1].value - 1) * 100).toFixed(0)}% vs ICT
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-sky-600 rounded-2xl shadow-xl p-8 text-center text-white relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              backgroundImage: [
                'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)',
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <div className="relative z-10">
            <motion.h3
              className="text-2xl font-bold mb-4 flex items-center justify-center gap-2"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Eye className="w-6 h-6" />
              La diferencia es exponencial
            </motion.h3>
            <p className="text-lg text-white/90 mb-6 max-w-3xl mx-auto">
              Con ICM, obtienes{' '}
              <motion.span
                className="font-bold text-3xl inline-block"
                animate={{ scale: [1, 1.1, 1], color: ['#ffffff', '#fbbf24', '#ffffff'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {formatCurrency(calculateResults[2].value - calculateResults[0].value)}
              </motion.span>{' '}
              más que con ahorro simple en {years} años. El poder del interés compuesto multiplicador trabaja 24/7 para ti.
            </p>
            <motion.button
              className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg relative overflow-hidden group"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-sky-400 opacity-0 group-hover:opacity-20"
                initial={false}
              />
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" />
                Quiero multiplicar mi inversión
                <TrendingUp className="w-5 h-5" />
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MultiplierTreeCalculator;
