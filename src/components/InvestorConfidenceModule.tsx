import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Shield,
  DollarSign,
  Target,
  Globe,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lock,
  Eye,
  Zap,
  Award,
  MapPin,
  Building2,
  FileCheck,
  AlertCircle,
  CheckCircle2,
  Home,
  TrendingDown,
  Flame,
  Bike
} from 'lucide-react';
import { ESCALONES, RIDERMEX_CONFIG } from '../data/ridermexConfig';

interface InvestorConfidenceModuleProps {
  variant?: 'full' | 'compact';
  showTitle?: boolean;
}

export default function InvestorConfidenceModule({
  variant = 'full',
  showTitle = true
}: InvestorConfidenceModuleProps) {
  const [expandedArgument, setExpandedArgument] = useState<number | null>(null);
  const [expandedConfidence, setExpandedConfidence] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'arguments' | 'confidence'>('arguments');

  const investmentArguments = [
    {
      id: 1,
      icon: TrendingUp,
      color: 'green',
      title: 'Alto Rendimiento y Flujo Constante',
      subtitle: `${ESCALONES[0].roi}% ROI Estimado anual con pagos trimestrales`,
      points: [
        {
          title: `ROI Estimado: ${ESCALONES[0].roi}% Anual`,
          desc: `Rendimiento estable basado en ventas de motocicletas. Un ticket de $${ESCALONES[0].entryPrice.toLocaleString()} genera $${RIDERMEX_CONFIG.ANNUAL_RETURN_PER_TICKET.toLocaleString()} anuales en dividendos`,
          icon: Target
        },
        {
          title: 'Interés Compuesto Multiplicador',
          desc: `Una inversión de $${ESCALONES[0].entryPrice.toLocaleString()} puede multiplicarse 100x en 25 años reinvirtiendo los dividendos trimestrales`,
          icon: Sparkles
        },
        {
          title: 'Pagos Trimestrales Programados',
          desc: `Un ticket genera $${RIDERMEX_CONFIG.QUARTERLY_PAYMENT.toLocaleString()} por trimestre. ${RIDERMEX_CONFIG.TICKETS_PER_STORE} tickets generan $${RIDERMEX_CONFIG.ANNUAL_PROFIT_POOL.toLocaleString()} anuales para jubilación`,
          icon: DollarSign
        }
      ],
      highlight: `${ESCALONES[0].roi}% ROI Estimado anual en el mercado de motocicletas: movilidad esencial`,
      stats: [
        { label: 'ROI Anual Estimado', value: `${ESCALONES[0].roi}%`, color: 'green' },
        { label: 'Pago Trimestral', value: '$3.6K', color: 'blue' },
        { label: 'Por Ticket/Año', value: '$14.4K', color: 'purple' }
      ]
    },
    {
      id: 2,
      icon: Shield,
      color: 'blue',
      title: 'Seguridad Patrimonial y Protección de Activos',
      subtitle: 'Inversión protegida contra riesgos económicos',
      points: [
        {
          title: 'Plusvalía del Ticket',
          desc: `Los tickets aumentan ${RIDERMEX_CONFIG.ANNUAL_APPRECIATION}% anual en valor. El precio de entrada crece por escalones desde $${ESCALONES[0].entryPrice.toLocaleString()} hasta $${RIDERMEX_CONFIG.BASE_CALCULATION_PRICE.toLocaleString()}`,
          icon: Home
        },
        {
          title: 'Negocio Probado y Rentable',
          desc: 'Modelo de negocio de venta de motos con historial comprobado. Ganancias estables en mercado de movilidad',
          icon: DollarSign
        },
        {
          title: 'Activo Tangible',
          desc: 'Tu inversión está respaldada por tiendas físicas, inventario de motos y contratos comerciales reales',
          icon: TrendingUp
        },
        {
          title: 'Resiliencia en Crisis',
          desc: 'La movilidad es esencial. Las motos son transporte accesible que mantiene demanda en cualquier economía',
          icon: Shield
        }
      ],
      highlight: 'Inversión respaldada por activos tangibles y necesidad de movilidad',
      stats: [
        { label: 'Apreciación Anual', value: '5%', color: 'blue' },
        { label: 'Motos/Año', value: '480', color: 'green' },
        { label: 'Ganancia/Moto', value: '$900', color: 'purple' }
      ]
    },
    {
      id: 3,
      icon: Zap,
      color: 'purple',
      title: 'Modelo 100% Pasivo y Profesional',
      subtitle: 'Invierte sin operar el negocio',
      points: [
        {
          title: 'Inversión Totalmente Pasiva',
          desc: 'No necesitas experiencia en motos ni operar tiendas. El equipo profesional maneja todo: compra, inventario, ventas y cobranza',
          icon: Check
        },
        {
          title: 'Equipo Experto en Ventas',
          desc: 'Inviertes en un equipo con experiencia comprobada en venta de motocicletas y gestión de tiendas exitosas',
          icon: Award
        },
        {
          title: 'Demanda de Movilidad Constante',
          desc: 'Las motocicletas son el transporte más accesible en México. Alta demanda garantizada en el mercado local',
          icon: Globe
        }
      ],
      highlight: 'Inversión 100% pasiva en movilidad: necesidad básica de transporte',
      stats: [
        { label: 'Esfuerzo Requerido', value: '0%', color: 'green' },
        { label: 'Rotación Inventario', value: '21-30 días', color: 'blue' },
        { label: 'Demanda', value: 'Alta', color: 'purple' }
      ]
    }
  ];

  const confidencePoints = [
    {
      id: 1,
      icon: Lock,
      color: 'green',
      title: 'Seguridad Jurídica y Estructura de Fideicomisos',
      subtitle: 'Patrimonio protegido legalmente',
      points: [
        {
          title: 'Fideicomiso de Activos y Contratos',
          desc: 'Protege la propiedad legal de tiendas, inventario y contratos. Los activos están resguardados en fideicomiso',
          icon: Building2
        },
        {
          title: 'Fideicomiso Operativo',
          desc: 'Gestiona la operación diaria: ventas, personal y logística. Garantiza operación profesional y eficiente',
          icon: FileCheck
        },
        {
          title: 'Fideicomiso de Cobro y Reparto',
          desc: 'Recibe los ingresos por ventas y distribuye utilidades automáticamente a inversionistas. Elimina riesgo de cobranza',
          icon: DollarSign
        }
      ],
      highlight: 'Triple fideicomiso que protege activos, operación y distribución de ganancias',
      verification: 'Estructura legal verificada y supervisada por institución fiduciaria'
    },
    {
      id: 2,
      icon: Shield,
      color: 'blue',
      title: 'Protección del Patrimonio del Inversionista',
      subtitle: 'Tu inversión está protegida',
      points: [
        {
          title: 'Activos Reales Respaldados',
          desc: 'Tu inversión está respaldada por tiendas físicas, inventario de motocicletas y contratos comerciales verificables',
          icon: Check
        },
        {
          title: 'Separación Patrimonial',
          desc: 'Los activos del fideicomiso están separados de la empresa operadora. Tu patrimonio está protegido legalmente',
          icon: Shield
        }
      ],
      highlight: 'Estructura que protege el patrimonio del inversionista de riesgos operacionales',
      verification: 'Activos verificables y separación patrimonial legal'
    },
    {
      id: 3,
      icon: Bike,
      color: 'purple',
      title: 'Modelo de Negocio Comprobado',
      subtitle: 'Negocio de motos con resultados reales',
      points: [
        {
          title: 'Mercado de Movilidad Esencial',
          desc: 'Las motocicletas son transporte accesible y necesario. Demanda constante en el mercado mexicano',
          icon: Lock
        },
        {
          title: 'Rotación Rápida de Inventario',
          desc: 'Inventario se vende en 21-30 días. Flujo constante de ventas y recuperación rápida de capital',
          icon: AlertCircle
        },
        {
          title: 'Márgenes Atractivos',
          desc: `$${RIDERMEX_CONFIG.PROFIT_PER_MOTORCYCLE.toLocaleString()} de ganancia por moto vendida. ${RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR} motos al año por tienda generan $${RIDERMEX_CONFIG.ANNUAL_PROFIT_POOL.toLocaleString()} en utilidades`,
          icon: Award
        }
      ],
      highlight: 'Negocio con historial de ventas, márgenes y flujo de efectivo comprobados',
      verification: 'Resultados operativos verificables y modelo replicable'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, any> = {
      green: {
        bg: 'bg-neon-green/10',
        border: 'border-neon-green/30',
        text: 'text-neon-green',
        icon: 'bg-neon-green/20 text-neon-green',
        gradient: 'from-neon-green to-emerald-600',
        hover: 'hover:border-neon-green/50'
      },
      blue: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        icon: 'bg-blue-500/20 text-blue-400',
        gradient: 'from-blue-500 to-cyan-500',
        hover: 'hover:border-blue-500/50'
      },
      purple: {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
        icon: 'bg-purple-500/20 text-purple-400',
        gradient: 'from-purple-500 to-pink-500',
        hover: 'hover:border-purple-500/50'
      }
    };
    return colors[color];
  };

  return (
    <div className="space-y-6">
      {showTitle && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-neon-green to-cyan-500 rounded-full mb-4 shadow-lg"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-4xl font-bold text-neutral-50 mb-3">
            ¿Por Qué Invertir con RiderMex?
          </h2>
          <p className="text-lg text-neutral-300 max-w-3xl mx-auto">
            Descubre los argumentos clave y las medidas de seguridad que generan confianza
            en inversionistas de movilidad
          </p>
        </motion.div>
      )}

      {/* Tab Selector */}
      <div className="flex gap-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('arguments')}
          className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all ${
            activeTab === 'arguments'
              ? 'bg-gradient-to-r from-neon-green to-cyan-500 text-white shadow-lg'
              : 'bg-dark-surface text-neutral-300 hover:bg-dark-border'
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            <TrendingUp className="w-5 h-5" />
            <span>Argumentos de Inversión</span>
          </div>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('confidence')}
          className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all ${
            activeTab === 'confidence'
              ? 'bg-gradient-to-r from-neon-green to-cyan-500 text-white shadow-lg'
              : 'bg-dark-surface text-neutral-300 hover:bg-dark-border'
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            <Shield className="w-5 h-5" />
            <span>Generadores de Confianza</span>
          </div>
        </motion.button>
      </div>

      {/* Arguments Tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'arguments' && (
          <motion.div
            key="arguments"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {investmentArguments.map((arg, index) => {
              const colors = getColorClasses(arg.color);
              const Icon = arg.icon;
              const isExpanded = expandedArgument === index;

              return (
                <motion.div
                  key={arg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -3 }}
                  className={`bg-dark-card border-2 ${colors.border} rounded-xl p-6 ${colors.hover} transition-all shadow-lg cursor-pointer`}
                  onClick={() => setExpandedArgument(isExpanded ? null : index)}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 ${colors.icon} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-neutral-50 mb-1">
                        {arg.title}
                      </h3>
                      <p className="text-sm text-neutral-300">{arg.subtitle}</p>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-6 h-6 text-neutral-400" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-neutral-400" />
                      )}
                    </motion.div>
                  </div>

                  {/* Stats Preview */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {arg.stats.map((stat, i) => (
                      <div key={i} className={`${colors.bg} border ${colors.border} rounded-lg p-3 text-center`}>
                        <div className={`text-2xl font-bold ${colors.text}`}>
                          {stat.value}
                        </div>
                        <div className="text-xs text-neutral-400 mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Highlight */}
                  <div className={`${colors.bg} border ${colors.border} rounded-lg p-4 mb-4`}>
                    <p className={`text-sm font-semibold ${colors.text} flex items-center gap-2`}>
                      <Flame className="w-4 h-4" />
                      {arg.highlight}
                    </p>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pt-4 border-t border-dark-border space-y-4"
                      >
                        {arg.points.map((point, i) => {
                          const PointIcon = point.icon;
                          return (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-start gap-3"
                            >
                              <div className={`w-10 h-10 ${colors.icon} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <PointIcon className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-neutral-50 mb-1">
                                  {point.title}
                                </h4>
                                <p className="text-sm text-neutral-300">{point.desc}</p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Confidence Tab */}
        {activeTab === 'confidence' && (
          <motion.div
            key="confidence"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {confidencePoints.map((conf, index) => {
              const colors = getColorClasses(conf.color);
              const Icon = conf.icon;
              const isExpanded = expandedConfidence === index;

              return (
                <motion.div
                  key={conf.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -3 }}
                  className={`bg-dark-card border-2 ${colors.border} rounded-xl p-6 ${colors.hover} transition-all shadow-lg cursor-pointer`}
                  onClick={() => setExpandedConfidence(isExpanded ? null : index)}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 ${colors.icon} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-neutral-50 mb-1">
                        {conf.title}
                      </h3>
                      <p className="text-sm text-neutral-300">{conf.subtitle}</p>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-6 h-6 text-neutral-400" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-neutral-400" />
                      )}
                    </motion.div>
                  </div>

                  {/* Highlight */}
                  <div className={`${colors.bg} border ${colors.border} rounded-lg p-4 mb-3`}>
                    <p className={`text-sm font-semibold ${colors.text} flex items-center gap-2`}>
                      <CheckCircle2 className="w-4 h-4" />
                      {conf.highlight}
                    </p>
                  </div>

                  {/* Verification Badge */}
                  <div className="bg-neon-green/10 border border-neon-green/30 rounded-lg px-3 py-2 mb-4">
                    <p className="text-xs font-semibold text-neon-green flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      {conf.verification}
                    </p>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pt-4 border-t border-dark-border space-y-4"
                      >
                        {conf.points.map((point, i) => {
                          const PointIcon = point.icon;
                          return (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-start gap-3"
                            >
                              <div className={`w-10 h-10 ${colors.icon} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <PointIcon className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-neutral-50 mb-1">
                                  {point.title}
                                </h4>
                                <p className="text-sm text-neutral-300">{point.desc}</p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-gradient-to-br from-neon-green to-cyan-600 rounded-xl p-8 text-white shadow-xl mt-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <Award className="w-12 h-12 flex-shrink-0" />
          <div>
            <h3 className="text-2xl font-bold mb-2">
              Inversión Respaldada por Activos Reales
            </h3>
            <p className="text-neutral-100">
              Invierte en el negocio de movilidad con RiderMex. Rendimientos comprobados,
              seguridad jurídica con fideicomisos y protección total de tu patrimonio.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-3xl font-bold mb-1">19%</div>
            <div className="text-xs text-neutral-100">ROI Anual Estimado</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-3xl font-bold mb-1">100%</div>
            <div className="text-xs text-neutral-100">Pasivo</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-3xl font-bold mb-1">480</div>
            <div className="text-xs text-neutral-100">Motos/Año</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-3xl font-bold mb-1">3</div>
            <div className="text-xs text-neutral-100">Fideicomisos</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
