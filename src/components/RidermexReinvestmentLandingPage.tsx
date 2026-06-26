import React from 'react';
import { motion } from 'framer-motion';
import { Bike, TrendingUp, DollarSign, Award, Shield, Repeat, ArrowRight, Check, BarChart3, Zap, Target, ArrowLeft, Sparkles } from 'lucide-react';
import { ESCALONES, RIDERMEX_CONFIG } from '../data/ridermexConfig';

interface RidermexReinvestmentLandingPageProps {
  onStart: () => void;
  onBack?: () => void;
}

const RidermexReinvestmentLandingPage: React.FC<RidermexReinvestmentLandingPageProps> = ({ onStart, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {onBack && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 rounded-lg hover:shadow-lg transition-all font-medium border-2 border-orange-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver a Inicio</span>
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-6"
          >
            <img src="/rider_inversiones.png" alt="Ridermex Inversiones" className="h-24 w-auto" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Repeat className="w-6 h-6 text-white" />
            </motion.div>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Calculadora de Reinversión
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              Ridermex
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Sistema profesional de análisis para inversiones en tiendas de motocicletas con rendimientos estimados del 18-22% anual
          </p>

          <div className="flex items-center justify-center gap-2 mb-8">
            <Sparkles className="w-5 h-5 text-orange-600" />
            <p className="text-lg font-semibold text-orange-600">
              Modelo Fintech Retail: {RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR} Motos/Año por Tienda | ${RIDERMEX_CONFIG.PROFIT_PER_MOTORCYCLE} Utilidad Estimada/Moto
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all"
          >
            <span>Iniciar Análisis Completo</span>
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-200"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">${ESCALONES[0].entryPrice.toLocaleString()} MXN</h3>
            <p className="text-gray-600 font-medium mb-1">Inversión por Ticket</p>
            <p className="text-sm text-gray-500">Desde $10,000 de enganche disponible</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-200"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">20%+ Anual Estimado</h3>
            <p className="text-gray-600 font-medium mb-1">Rendimiento Compuesto Estimado</p>
            <p className="text-sm text-gray-500">Con reinversión de utilidades estimadas</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-200"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Bike className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">480 Motos/Año</h3>
            <p className="text-gray-600 font-medium mb-1">Negocio Establecido</p>
            <p className="text-sm text-gray-500">Ventas comprobadas y consistentes</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-8 mb-16 shadow-2xl border-2 border-orange-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">¿Cómo Funciona la Reinversión?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  1
                </div>
                <h3 className="font-bold text-lg text-gray-900">Compra Tu Ticket</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Invierte en tickets desde ${ESCALONES[0].entryPrice.toLocaleString()} MXN. Cada ticket representa una participación en la bolsa de utilidades generada por la venta de {RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR} motocicletas al año por tienda.
              </p>
            </div>

            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  2
                </div>
                <h3 className="font-bold text-lg text-gray-900">Genera Utilidades</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Cada moto genera una utilidad estimada de ${RIDERMEX_CONFIG.PROFIT_PER_MOTORCYCLE.toLocaleString()} MXN. Con {RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR} motos al año, se estima una bolsa de ${RIDERMEX_CONFIG.ANNUAL_PROFIT_POOL.toLocaleString()} MXN que se reparte entre {RIDERMEX_CONFIG.TICKETS_PER_STORE} tickets. Tu ticket recibiría un estimado de ${RIDERMEX_CONFIG.ANNUAL_RETURN_PER_TICKET.toLocaleString()} anuales (${RIDERMEX_CONFIG.QUARTERLY_PAYMENT.toLocaleString()} trimestrales).
              </p>
            </div>

            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  3
                </div>
                <h3 className="font-bold text-lg text-gray-900">Reinvierte y Multiplica</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Las utilidades estimadas trimestrales se reinvierten automáticamente comprando nuevos tickets. Tu ticket se aprecia un estimado de 5% anual más los escalones de precio. El efecto compuesto multiplica tu patrimonio exponencialmente.
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200">
            <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-600" />
              Proyección Estimada de Ejemplo:
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600 mb-1">Inversión Inicial</p>
                <p className="text-2xl font-bold text-orange-600">${ESCALONES[0].entryPrice.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Después de 10 Años</p>
                <p className="text-2xl font-bold text-green-600">$431,582</p>
                <p className="text-xs text-gray-500">Con reinversión completa</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Después de 20 Años</p>
                <p className="text-2xl font-bold text-blue-600">$2,717,548</p>
                <p className="text-xs text-gray-500">Con reinversión completa</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Ventajas vs Inversiones Tradicionales
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Ridermex con Reinversión</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Rendimiento estimado 20%+ anual compuesto</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Apreciación estimada del ticket: 5% anual + escalones</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Pagos trimestrales estimados de ${RIDERMEX_CONFIG.QUARTERLY_PAYMENT.toLocaleString()} MXN por ticket</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Negocio físico establecido y verificable</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Efecto multiplicador exponencial</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Patrimonio comercial heredable</span>
                </li>
              </ul>
            </motion.div>

            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl p-5 border-2 border-gray-200"
              >
                <h4 className="font-bold text-gray-900 mb-2">Ahorro Bancario</h4>
                <p className="text-gray-600 text-sm mb-2">Rendimiento: 2% - 4% anual</p>
                <p className="text-red-600 text-sm font-medium">No cubre inflación, pérdida de poder adquisitivo</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl p-5 border-2 border-gray-200"
              >
                <h4 className="font-bold text-gray-900 mb-2">CETES</h4>
                <p className="text-gray-600 text-sm mb-2">Rendimiento: 8% - 12% anual</p>
                <p className="text-orange-600 text-sm font-medium">Apenas supera inflación, sin apreciación de activos</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl p-5 border-2 border-gray-200"
              >
                <h4 className="font-bold text-gray-900 mb-2">Fondos de Inversión</h4>
                <p className="text-gray-600 text-sm mb-2">Rendimiento: 10% - 15% anual</p>
                <p className="text-yellow-600 text-sm font-medium">Mayor rendimiento pero sin control directo del negocio</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-12 text-center shadow-2xl"
        >
          <Target className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">
            Calcula Tu Proyección Personalizada
          </h2>
          <p className="text-xl text-orange-50 mb-8 max-w-2xl mx-auto">
            Descubre cuánto podrías generar con tu inversión en tickets de motocicletas. Compara con CETES, ahorro bancario y bienes raíces.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-orange-600 text-xl font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all"
          >
            <BarChart3 className="w-7 h-7" />
            <span>Iniciar Calculadora</span>
            <ArrowRight className="w-7 h-7" />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 text-center text-sm text-gray-500"
        >
          <p className="mb-2">
            Las proyecciones son estimadas, ilustrativas y basadas en datos históricos del negocio.
          </p>
          <p>
            Los rendimientos pasados no garantizan rendimientos futuros. Consulta con un asesor financiero.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RidermexReinvestmentLandingPage;
