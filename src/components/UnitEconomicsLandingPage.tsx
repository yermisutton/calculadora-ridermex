import React from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  TrendingUp,
  Eye,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  DollarSign,
  Bike,
  Users,
  BarChart3,
  Lightbulb,
  Target,
  Sparkles,
} from 'lucide-react';
import { ESCALONES, RIDERMEX_CONFIG } from '../data/ridermexConfig';

interface UnitEconomicsLandingPageProps {
  onGetStarted?: () => void;
  onBack?: () => void;
}

const UnitEconomicsLandingPage: React.FC<UnitEconomicsLandingPageProps> = ({
  onGetStarted,
  onBack,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
            className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-block mb-8"
            >
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto">
                <Calculator className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Unit Economics Transparente
            </h1>

            <p className="text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              Descubre la matemática clara detrás del modelo de motos.
              Cero opacidad, 100% transparencia.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="px-10 py-5 bg-white text-green-600 font-bold rounded-2xl text-xl shadow-2xl hover:shadow-3xl transition-all inline-flex items-center gap-3"
            >
              <Zap className="w-6 h-6" />
              Calcular Mi ROI Ahora
              <ArrowRight className="w-6 h-6" />
            </motion.button>

            <p className="mt-6 text-green-100 text-sm">
              Simulador interactivo • Resultados instantáneos • Sin registro
            </p>
          </motion.div>
        </div>
      </div>

      {/* Problema vs Solución */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Problema */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-red-50 rounded-3xl p-8 border-2 border-red-200"
          >
            <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mb-6">
              <Eye className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-red-900 mb-4">
              El Problema Actual
            </h2>

            <ul className="space-y-4">
              {[
                'Inversiones opacas donde no sabes en qué se usa tu dinero',
                'Promesas de rendimientos sin fundamento matemático',
                'Imposibilidad de validar los números por tu cuenta',
                'Falta de claridad sobre cómo se generan las ganancias',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">✕</span>
                  </div>
                  <span className="text-red-900">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Solución */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-green-50 rounded-3xl p-8 border-2 border-green-200"
          >
            <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-green-900 mb-4">
              Nuestra Solución
            </h2>

            <ul className="space-y-4">
              {[
                'Matemática 100% transparente y verificable',
                'Modelo de negocio simple: comprar y vender motos',
                'Calculadora interactiva para validar los números',
                'Desglose detallado de cada peso generado',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-green-900 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Cómo Funciona */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Modelo de Negocio en 3 Pasos
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Un modelo tan simple que cualquier persona puede entenderlo
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                icon: <Bike className="w-8 h-8" />,
                title: 'Compra Mayorista',
                description: 'Adquirimos motos directamente de fabricantes a precio de mayoreo, maximizando el margen desde el inicio.',
                color: 'from-blue-500 to-cyan-600',
              },
              {
                step: '2',
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Venta a Distribuidores',
                description: 'Las motos se venden a distribuidores autorizados con un margen garantizado por cada unidad.',
                color: 'from-green-500 to-emerald-600',
              },
              {
                step: '3',
                icon: <Users className="w-8 h-8" />,
                title: 'Reparto de Utilidades',
                description: 'Las ganancias se dividen equitativamente entre todos los inversionistas según su participación.',
                color: 'from-purple-500 to-pink-600',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="relative"
              >
                <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100 hover:border-green-300 transition-all h-full">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-6 text-white`}>
                    {item.icon}
                  </div>

                  <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-600">{item.step}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Beneficios */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Por Qué Esta Calculadora Cambia Todo
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            No solo proyecciones, sino claridad matemática instantánea
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Calculator className="w-6 h-6" />,
              title: 'Interactivo',
              description: 'Ajusta cada parámetro y ve los resultados en tiempo real',
              color: 'bg-blue-100 text-blue-600',
            },
            {
              icon: <Eye className="w-6 h-6" />,
              title: 'Transparente',
              description: 'Cada cálculo visible, cada paso explicado claramente',
              color: 'bg-green-100 text-green-600',
            },
            {
              icon: <Lightbulb className="w-6 h-6" />,
              title: 'Educativo',
              description: 'Aprende cómo funciona el modelo mientras calculas',
              color: 'bg-amber-100 text-amber-600',
            },
            {
              icon: <Target className="w-6 h-6" />,
              title: 'Personalizado',
              description: 'Usa TU capital para ver TUS resultados específicos',
              color: 'bg-purple-100 text-purple-600',
            },
          ].map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100"
            >
              <div className={`w-14 h-14 ${benefit.color} rounded-xl flex items-center justify-center mb-4`}>
                {benefit.icon}
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {benefit.title}
              </h3>

              <p className="text-gray-600 text-sm">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Ejemplo de Cálculo */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ejemplo Real de Cálculo
            </h2>
            <p className="text-xl text-gray-300">
              Con ${RIDERMEX_CONFIG.BASE_CALCULATION_PRICE.toLocaleString()} MXN de inversión inicial
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                label: 'Datos del Modelo',
                items: [
                  `${RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR} motos vendidas/año`,
                  `$${RIDERMEX_CONFIG.PROFIT_PER_MOTORCYCLE} MXN utilidad/moto`,
                  `${RIDERMEX_CONFIG.TICKETS_PER_STORE} inversionistas`,
                ],
                icon: <BarChart3 className="w-6 h-6" />,
              },
              {
                label: 'Cálculo',
                items: [
                  `${RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR} × $${RIDERMEX_CONFIG.PROFIT_PER_MOTORCYCLE} = $${RIDERMEX_CONFIG.ANNUAL_PROFIT_POOL.toLocaleString()}`,
                  `$${RIDERMEX_CONFIG.ANNUAL_PROFIT_POOL.toLocaleString()} ÷ ${RIDERMEX_CONFIG.TICKETS_PER_STORE} = $${RIDERMEX_CONFIG.ANNUAL_RETURN_PER_TICKET.toLocaleString()}`,
                  `$${RIDERMEX_CONFIG.ANNUAL_RETURN_PER_TICKET.toLocaleString()} ÷ $${RIDERMEX_CONFIG.BASE_CALCULATION_PRICE.toLocaleString()} = ${RIDERMEX_CONFIG.ESTIMATED_ROI}%`,
                ],
                icon: <Calculator className="w-6 h-6" />,
              },
              {
                label: 'Tu Resultado',
                items: [
                  `ROI: ${RIDERMEX_CONFIG.ESTIMATED_ROI}% anual`,
                  `Ganancia: $${RIDERMEX_CONFIG.ANNUAL_RETURN_PER_TICKET.toLocaleString()} MXN`,
                  `Mensual: $${Math.round(RIDERMEX_CONFIG.ANNUAL_RETURN_PER_TICKET / 12).toLocaleString()} MXN`,
                ],
                icon: <DollarSign className="w-6 h-6" />,
                highlight: true,
              },
            ].map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className={`${
                  section.highlight
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                    : 'bg-white/10 backdrop-blur-sm'
                } rounded-2xl p-8 border-2 ${
                  section.highlight ? 'border-green-400' : 'border-white/20'
                }`}
              >
                <div className={`w-12 h-12 ${
                  section.highlight ? 'bg-white/20' : 'bg-green-500'
                } rounded-xl flex items-center justify-center mb-4`}>
                  <div className={section.highlight ? 'text-white' : 'text-white'}>
                    {section.icon}
                  </div>
                </div>

                <h3 className={`text-xl font-bold mb-4 ${
                  section.highlight ? 'text-white' : 'text-white'
                }`}>
                  {section.label}
                </h3>

                <ul className="space-y-3">
                  {section.items.map((item, itemIdx) => (
                    <li
                      key={itemIdx}
                      className={`flex items-center gap-2 ${
                        section.highlight ? 'text-green-50' : 'text-gray-300'
                      }`}
                    >
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 ${
                        section.highlight ? 'text-white' : 'text-green-400'
                      }`} />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 text-center text-white relative overflow-hidden"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-0 right-0 w-96 h-96 opacity-10"
          >
            <Sparkles className="w-full h-full" />
          </motion.div>

          <div className="relative z-10">
            <h2 className="text-5xl font-bold mb-6">
              Descubre Tu ROI Real
            </h2>

            <p className="text-2xl text-green-100 mb-10 max-w-3xl mx-auto">
              Ingresa tu capital y observa cómo se transforma en ganancias pasivas
              con matemática cristalina
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="px-12 py-6 bg-white text-green-600 font-bold rounded-2xl text-xl shadow-2xl hover:shadow-3xl transition-all inline-flex items-center gap-4"
            >
              <Calculator className="w-7 h-7" />
              Empezar a Calcular
              <ArrowRight className="w-7 h-7" />
            </motion.button>

            <p className="mt-8 text-green-100">
              No se requiere registro • Resultados instantáneos • 100% gratis
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UnitEconomicsLandingPage;
