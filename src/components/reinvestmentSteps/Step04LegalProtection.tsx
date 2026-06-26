import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, FileText, CheckCircle, TrendingUp, ChevronDown, ChevronUp, Lock, Users, Eye, RefreshCw, Info, X, Building2, Percent, Clock, AlertCircle } from 'lucide-react';
import { RIDERMEX_CONFIG } from '../../data/ridermexConfig';

interface Step04LegalProtectionProps {
  onPrevious: () => void;
  onNext: () => void;
  onStepChange?: (step: number) => void;
}

export default function Step04LegalProtection({ onPrevious, onNext, onStepChange }: Step04LegalProtectionProps) {
  const [expandedFideicomiso, setExpandedFideicomiso] = useState<number | null>(null);
  const [expandedSeguro, setExpandedSeguro] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [highlightedFeature, setHighlightedFeature] = useState<string | null>(null);

  const toggleFideicomiso = (index: number) => {
    setExpandedFideicomiso(expandedFideicomiso === index ? null : index);
  };

  const toggleSeguro = (index: number) => {
    setExpandedSeguro(expandedSeguro === index ? null : index);
  };

  const fideicomisos = [
    {
      id: 1,
      title: 'Fideicomiso de Activos y Contratos',
      color: 'blue',
      icon: Building2,
      shortDesc: 'Protege los activos de las tiendas RiderMex y el inventario de motocicletas',
      benefits: [
        { text: 'RiderMex no puede hipotecar las tiendas', icon: Lock },
        { text: 'No se pueden vender sin autorización', icon: Shield },
        { text: 'Los tickets están respaldados por tiendas e inventario', icon: FileText },
        { text: 'Seguridad jurídica total del activo', icon: CheckCircle }
      ],
      detailedInfo: {
        objetivo: 'Proporcionar seguridad al inversionista respecto a los activos físicos de las tiendas',
        mecanismo: 'La emisión de tickets de inversión se respalda en este fideicomiso. RiderMex no puede hipotecar las tiendas ni venderlas ni hacer nada que no esté estipulado en el fideicomiso.',
        impact: '100% de seguridad sobre los activos de tiendas e inventario'
      }
    },
    {
      id: 2,
      title: 'Fideicomiso Operativo (Banco BX+)',
      color: 'green',
      icon: TrendingUp,
      shortDesc: 'Controla todo el flujo monetario de operaciones y retornos estimados',
      banco: 'Banco BX+ (Ve por Más)',
      benefits: [
        { text: 'Tu dinero nunca entra a cuentas de RiderMex', icon: Lock },
        { text: 'Control independiente del capital', icon: Shield },
        { text: 'Elimina riesgo de "caja negra"', icon: Eye },
        { text: 'Retornos trimestrales estimados automáticos', icon: CheckCircle }
      ],
      detailedInfo: {
        objetivo: 'Separar el control del dinero y garantizar retornos trimestrales estimados automáticos',
        mecanismo: `El dinero de la inversión no entra en una cuenta directa de RiderMex. Todos los pagos de ventas caen en el fideicomiso operativo. Los retornos estimados de $${RIDERMEX_CONFIG.QUARTERLY_PAYMENT.toLocaleString()} por ticket cada trimestre son distribuidos automáticamente.`,
        impact: '100% control independiente de tu capital con retornos estimados'
      }
    },
    {
      id: 3,
      title: 'Fideicomiso de Cobro y Reparto',
      color: 'purple',
      icon: Percent,
      shortDesc: 'Garantiza el reparto justo de utilidades trimestrales estimadas',
      benefits: [
        { text: 'Reparte ganancias donde si tu ganas más nosotros también ganamos', icon: Percent },
        { text: 'Publica reportes de ventas de motos reales', icon: FileText },
        { text: 'Exige auditorías periódicas a RiderMex', icon: Eye },
        { text: 'Seguimiento notarial cada trimestre', icon: Clock }
      ],
      detailedInfo: {
        objetivo: 'Asegurar el flujo trimestral de ingresos y la transparencia de operaciones',
        mecanismo: 'El fideicomiso recibe el dinero de las ventas de motocicletas y es el encargado de repartirlo. También publica los reportes de ventas y exige auditorías a RiderMex. Cada trimestre se realiza un proceso de distribución con verificación notarial.',
        impact: 'Reparto automático trimestral estimado y transparencia'
      }
    }
  ];

  const seguros = [
    {
      id: 1,
      title: 'Seguro de Cobertura Amplia de Inventario',
      emoji: '🏍️',
      cobertura: 'Inventario Completo',
      color: 'blue',
      periodo: 'Desde el inicio hasta la venta de cada motocicleta',
      cubre: [
        'Robo o daño del inventario en piso',
        'Daños en tránsito entre tiendas',
        'Daño por eventos naturales',
        'Cobertura de piso y tránsito'
      ],
      nota: 'Este seguro viene anexado a tu ticket de inversión',
      detailedInfo: 'Asegura la cobertura amplia del inventario de motocicletas en piso y en tránsito. En caso de robo, daño o destrucción de motos, la aseguradora cubre el 100% del valor del inventario afectado.'
    },
    {
      id: 2,
      title: 'Seguro de Protección Patrimonial',
      emoji: '🛡️',
      cobertura: 'Adquisición de Tickets Adicionales',
      color: 'green',
      periodo: 'Durante toda la vigencia de tu inversión',
      cubre: [
        'Cobertura en caso de fallecimiento del socio',
        'Adquisición de tickets adicionales automática',
        'Protección patrimonial de herederos',
        'Continuidad de ingresos familiares'
      ],
      nota: 'Protege tu inversión y a tu familia en caso de cualquier evento',
      detailedInfo: 'Si ocurre el fallecimiento del inversionista, la póliza de seguro paga automáticamente la adquisición de tickets adicionales en el fideicomiso, garantizando que la familia continúe recibiendo los retornos trimestrales estimados y preservando el patrimonio.'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { border: string; bg: string; text: string; hover: string; icon: string }> = {
      blue: {
        border: 'border-blue-200',
        bg: 'bg-blue-50',
        text: 'text-blue-900',
        hover: 'hover:border-blue-400 hover:shadow-blue-100',
        icon: 'bg-blue-100 text-blue-600'
      },
      green: {
        border: 'border-green-200',
        bg: 'bg-green-50',
        text: 'text-green-900',
        hover: 'hover:border-green-400 hover:shadow-green-100',
        icon: 'bg-green-100 text-green-600'
      },
      purple: {
        border: 'border-purple-200',
        bg: 'bg-purple-50',
        text: 'text-purple-900',
        hover: 'hover:border-purple-400 hover:shadow-purple-100',
        icon: 'bg-purple-100 text-purple-600'
      }
    };
    return colors[color];
  };

  return (
    <div className="min-h-screen bg-dark-bg p-md">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-full mb-4 shadow-xl"
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-4xl font-bold text-white mb-3">
            Protección Legal y Seguros
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Tu inversión está respaldada por una estructura legal robusta con 3 fideicomisos independientes
            y 2 seguros especializados que garantizan la seguridad de tu capital.
          </p>

          {/* Interactive Info Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowComparison(!showComparison)}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2 mx-auto"
          >
            <Eye className="w-5 h-5" />
            {showComparison ? 'Ocultar Comparación' : 'Ver Por Qué es Único'}
          </motion.button>
        </motion.div>

      {/* Interactive Comparison Section */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="ds-card bg-gradient-to-r from-neon-red/20 to-neon-green/20 border-neon-red">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-neutral-50">¿Por qué esta estructura es única?</h3>
                <button
                  onClick={() => setShowComparison(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-neutral-200" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-neon-red/20 backdrop-blur-sm rounded-lg p-6 border border-neon-red/30"
                >
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-neutral-50">
                    <X className="w-5 h-5 text-neon-red" /> Sin Fideicomisos:
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-neon-red flex-shrink-0">❌</span>
                      <span className="text-neutral-200">Tu dinero entra directo a la empresa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-neon-red flex-shrink-0">❌</span>
                      <span className="text-neutral-200">Sin control sobre la distribución</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-neon-red flex-shrink-0">❌</span>
                      <span className="text-neutral-200">La empresa puede usar tu dinero libremente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-neon-red flex-shrink-0">❌</span>
                      <span className="text-neutral-200">No hay transparencia obligatoria</span>
                    </li>
                  </ul>
                </motion.div>
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-neon-green/20 backdrop-blur-sm rounded-lg p-6 border border-neon-green/30"
                >
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-neutral-50">
                    <CheckCircle className="w-5 h-5 text-neon-green" /> Con RiderMex:
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-neon-green flex-shrink-0">✅</span>
                      <span className="text-white font-medium">3 Fideicomisos controlan tu dinero</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-neon-green flex-shrink-0">✅</span>
                      <span className="text-white font-medium">Retornos trimestrales estimados de ${RIDERMEX_CONFIG.QUARTERLY_PAYMENT.toLocaleString()} MXN por ticket</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-neon-green flex-shrink-0">✅</span>
                      <span className="text-white font-medium">Separación total tienda-inversión</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-neon-green flex-shrink-0">✅</span>
                      <span className="text-white font-medium">Auditorías y seguimiento trimestral</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-neon-green flex-shrink-0">✅</span>
                      <span className="text-white font-medium">Tu cobras primero por contrato, después cobramos nosotros</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Triple Protection Alert */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="ds-card bg-gradient-to-r from-neon-green/10 to-neon-red/10 border-neon-green relative overflow-hidden"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -right-8 -top-8 w-32 h-32 bg-neon-green/10 rounded-full"
          />
          <div className="flex items-start gap-4 relative z-10">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex-shrink-0"
            >
              <CheckCircle className="w-8 h-8 text-neon-green" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-neutral-50 mb-2">
                Estructura Triple de Protección
              </h3>
              <p className="text-neutral-300">
                A diferencia de otras inversiones, tu dinero nunca entra directamente a las cuentas de RiderMex.
                Todo está controlado por 3 fideicomisos independientes que separan: los activos de tiendas, el dinero y la distribución de utilidades trimestrales.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Interactive Fideicomisos Cards */}
        <div className="mb-8">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold text-neutral-50 mb-6 flex items-center gap-3"
          >
            <FileText className="w-7 h-7 text-neon-red" />
            Los 3 Fideicomisos
            <span className="text-sm font-normal text-neutral-400">(Haz clic para ver detalles)</span>
          </motion.h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {fideicomisos.map((fidei, index) => {
            const colors = getColorClasses(fidei.color);
            const Icon = fidei.icon;
            const isExpanded = expandedFideicomiso === index;

            return (
              <motion.div
                key={fidei.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`ds-card border-2 ${colors.border} rounded-xl p-6 ${colors.hover} transition-all duration-300 shadow-md cursor-pointer relative hover:shadow-neon-red`}
                onClick={() => toggleFideicomiso(index)}
                onMouseEnter={() => setHighlightedFeature(`fidei-${index}`)}
                onMouseLeave={() => setHighlightedFeature(null)}
              >
                {highlightedFeature === `fidei-${index}` && (
                  <motion.div
                    layoutId="highlight"
                    className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-green-400/10 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${colors.icon} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className={`w-8 h-8 bg-gradient-to-br from-${fidei.color}-500 to-${fidei.color}-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg`}>
                        {fidei.id}
                      </div>
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

                  <h4 className="text-xl font-bold text-neutral-50 mb-3">
                    {fidei.title}
                  </h4>

                  {fidei.banco && (
                    <div className={`${colors.bg} border ${colors.border} rounded-lg px-3 py-2 mb-3`}>
                      <p className="text-xs font-semibold text-gray-800">{fidei.banco}</p>
                      {fidei.clabe && (
                        <p className="text-xs text-gray-700 mt-1">CLABE: {fidei.clabe}</p>
                      )}
                    </div>
                  )}

                  <p className="text-neutral-300 mb-4 leading-relaxed">
                    {fidei.shortDesc}
                  </p>

                  <div className="space-y-2">
                    {fidei.benefits.map((benefit, i) => {
                      const BenefitIcon = benefit.icon;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-start gap-2"
                        >
                          <BenefitIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-neutral-300">{benefit.text}</span>
                        </motion.div>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-gray-200 space-y-3"
                      >
                        <div className={`${colors.bg} rounded-lg p-4`}>
                          <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            Objetivo:
                          </h5>
                          <p className="text-sm text-gray-700">{fidei.detailedInfo.objetivo}</p>
                        </div>
                        <div className={`${colors.bg} rounded-lg p-4`}>
                          <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Mecanismo:
                          </h5>
                          <p className="text-sm text-gray-700">{fidei.detailedInfo.mecanismo}</p>
                        </div>
                        <div className="bg-green-50 border border-green-300 rounded-lg p-3">
                          <p className="text-xs font-semibold text-green-900 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            {fidei.detailedInfo.impact}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Interactive Seguros Section */}
      <div className="bg-gradient-to-r from-neon-red/10 to-neon-green/10 border-2 border-neon-red/30 rounded-xl p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            className="w-12 h-12 bg-neon-red rounded-lg flex items-center justify-center"
          >
            <Shield className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold text-neutral-50">
              Seguros Especializados
            </h3>
            <p className="text-sm text-neutral-300">(Haz clic para expandir)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {seguros.map((seguro, index) => {
            const isExpanded = expandedSeguro === index;
            const colorClass = seguro.color === 'blue' ? 'border-neon-red/30 bg-neon-red/10' : 'border-neon-green/30 bg-neon-green/10';

            return (
              <motion.div
                key={seguro.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className={`bg-dark-surface rounded-xl p-6 border-2 ${colorClass} shadow-lg cursor-pointer`}
                onClick={() => toggleSeguro(index)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                    className={`w-12 h-12 ${seguro.color === 'blue' ? 'bg-neon-red/20' : 'bg-neon-green/20'} rounded-lg flex items-center justify-center text-3xl`}
                  >
                    {seguro.emoji}
                  </motion.div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-neutral-50">
                      {seguro.title}
                    </h4>
                    <p className={`text-sm font-semibold ${seguro.color === 'blue' ? 'text-neon-red' : 'text-neon-green'}`}>
                      {seguro.cobertura}
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-6 h-6 text-neutral-300" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-neutral-300" />
                    )}
                  </motion.div>
                </div>

                <div className={`${seguro.color === 'blue' ? 'bg-neon-red/10 border-neon-red/30' : 'bg-neon-green/10 border-neon-green/30'} border rounded-lg p-4 mb-4`}>
                  <p className="text-sm font-semibold text-neutral-100 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Periodo de Cobertura:
                  </p>
                  <p className="text-sm text-neutral-300">{seguro.periodo}</p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-neutral-100 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    ¿Qué cubre?
                  </p>
                  <div className="space-y-1.5">
                    {seguro.cubre.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-2"
                      >
                        <CheckCircle className="w-4 h-4 text-neon-green flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-300">{item}</span>
                      </motion.div>
                    ))}
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pt-3 border-t border-neutral-600"
                      >
                        <div className={`${seguro.color === 'blue' ? 'bg-neon-red/10 border-neon-red/30' : 'bg-neon-green/10 border-neon-green/30'} border rounded-lg p-4 mb-3`}>
                          <p className="text-sm text-neutral-300 italic">{seguro.detailedInfo}</p>
                        </div>
                        <div className={`${seguro.color === 'blue' ? 'bg-neon-red/10 border-neon-red/30' : 'bg-neon-green/10 border-neon-green/30'} border rounded-lg p-3`}>
                          <p className="text-xs font-semibold text-neutral-100 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            {seguro.nota}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Interactive Summary with Tooltips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-gradient-to-br from-neon-green/20 to-neon-red/20 rounded-xl p-8 border border-neon-green/30 text-neutral-50 shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <Shield className="w-8 h-8 text-neon-green" />
            Resumen de Protección Total
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-neon-red/10 backdrop-blur-sm rounded-lg p-6 border border-neon-red/30"
          >
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2 text-neutral-50">
              <FileText className="w-5 h-5 text-neon-red" />
              3 Fideicomisos Activos
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-red rounded-full" />
                <span className="text-sm text-neutral-300">Tiendas y activos protegidos legalmente</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-green rounded-full" />
                <span className="text-sm text-neutral-300">Dinero bajo control independiente</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span className="text-sm text-neutral-300">Retornos trimestrales estimados</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-neon-green/10 backdrop-blur-sm rounded-lg p-6 border border-neon-green/30"
          >
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2 text-neutral-50">
              <Shield className="w-5 h-5 text-neon-green" />
              2 Seguros Especializados
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-red rounded-full" />
                <span className="text-sm text-neutral-300">100% cobertura de inventario en piso y tránsito</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-green rounded-full" />
                <span className="text-sm text-neutral-300">Protección patrimonial a herederos</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span className="text-sm text-neutral-300">Continuidad de retornos trimestrales estimados</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-6 bg-neon-green/20 backdrop-blur-sm rounded-lg p-6 border-2 border-neon-green/50"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 flex-shrink-0 text-neon-green" />
            <p className="text-lg font-semibold text-neutral-50">
              Tu inversión en RiderMex está respaldada por una estructura de primer nivel con 3 fideicomisos y 2 seguros especializados,
              con retornos trimestrales estimados de ${RIDERMEX_CONFIG.QUARTERLY_PAYMENT.toLocaleString()}, transparencia total y seguridad completa de tu capital.
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="space-y-4 pt-6"
      >
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onPrevious}
            className="flex-1 px-6 py-3 border-2 border-dark-border rounded-lg text-neutral-200 font-semibold hover:bg-dark-border transition-colors"
          >
            ← Atrás
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              console.log('🔵 Step04: Continuar button clicked');
              console.log('🔵 Event:', e);
              console.log('🔵 Calling onNext function...');
              onNext();
              console.log('🔵 onNext called successfully');
            }}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-neon-green to-emerald-600 text-white rounded-lg font-bold text-lg hover:from-neon-green hover:to-emerald-700 transition-all duration-300 shadow-neon-green flex items-center justify-center gap-2"
          >
            Continuar al Paso 5 →
          </motion.button>
        </div>

        {/* Botón alternativo para ir directamente al paso 5 */}
        {onStepChange && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              console.log('🟢 Step04: Direct button clicked');
              console.log('🟢 Calling onStepChange(4) to go to Step 5...');
              onStepChange(4);
              console.log('🟢 onStepChange(4) called successfully');
            }}
            className="w-full px-6 py-4 bg-gradient-to-r from-neon-red to-rose-600 text-white rounded-lg font-bold text-lg hover:from-neon-red hover:to-rose-700 transition-all duration-300 shadow-neon-red flex items-center justify-center gap-2"
          >
            <Users className="w-5 h-5" />
            Ir Directamente a Información del Cliente
          </motion.button>
        )}
      </motion.div>
      </div>
    </div>
  );
}
