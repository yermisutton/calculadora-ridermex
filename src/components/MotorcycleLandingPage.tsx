import React from 'react';
import { motion } from 'framer-motion';
import { Bike, TrendingUp, DollarSign, Award, Shield, Users, ArrowRight, Check, BarChart3, Zap, Target, ArrowLeft, Home } from 'lucide-react';
import { ESCALONES, RIDERMEX_CONFIG } from '../data/ridermexConfig';

interface MotorcycleLandingPageProps {
  onStart: () => void;
  onBack?: () => void;
}

const MotorcycleLandingPage: React.FC<MotorcycleLandingPageProps> = ({ onStart, onBack }) => {
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
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl mb-6 shadow-2xl"
          >
            <Bike className="w-12 h-12 text-white" />
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Invierte en un Negocio
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              Establecido de Motocicletas
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Participa en un negocio real que vende {RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR} motocicletas al año con rendimientos superiores
            a cualquier inversión tradicional
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all"
          >
            <span>Calcular Mi Inversión</span>
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <DollarSign className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">${ESCALONES[0].entryPrice.toLocaleString()} MXN</h3>
            <p className="text-gray-600">Inversión por ticket desde solo $10,000 de enganche</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">20%+ Anual</h3>
            <p className="text-gray-600">Rendimiento promedio con reinversión exponencial</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <Bike className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR} Motos/Año</h3>
            <p className="text-gray-600">Negocio establecido con ventas comprobadas</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">¿Cómo Funciona?</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Compras un Ticket de Participación</h4>
                  <p className="text-gray-600">
                    Inviertes en un ticket por ${ESCALONES[0].entryPrice.toLocaleString()} MXN (o desde ${RIDERMEX_CONFIG.DOWN_PAYMENT_MODEL_A.toLocaleString()} de enganche). Este ticket te da
                    participación en una agencia establecida que vende {RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR} motocicletas al año.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Generas Utilidades Mensuales</h4>
                  <p className="text-gray-600">
                    Por cada moto vendida, obtienes el 70% de la utilidad. Con {RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR} motos al año y {RIDERMEX_CONFIG.TICKETS_PER_STORE} tickets
                    totales, cada ticket genera aproximadamente ${RIDERMEX_CONFIG.ANNUAL_RETURN_PER_TICKET.toLocaleString()} MXN anuales ({ESCALONES[0].roi}% de rendimiento).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Reinviertes y Multiplicas</h4>
                  <p className="text-gray-600">
                    Las utilidades se reinvierten automáticamente en más tickets. Tu ticket se aprecia 50% el
                    primer año, y las utilidades por moto crecen 5% anual. El efecto compuesto multiplica tu
                    patrimonio exponencialmente.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6">
              <h4 className="font-bold text-gray-900 mb-4">Proyección de Ejemplo:</h4>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Inversión Inicial</div>
                  <div className="text-2xl font-bold text-gray-900">${ESCALONES[0].entryPrice.toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Después de 10 años</div>
                  <div className="text-2xl font-bold text-orange-600">$431,582</div>
                  <div className="text-xs text-gray-500">Con reinversión completa</div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Después de 20 años</div>
                  <div className="text-2xl font-bold text-orange-600">$2,717,548</div>
                  <div className="text-xs text-gray-500">Con reinversión completa</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Ventajas vs Inversiones Tradicionales
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Negocio Real</h4>
              <p className="text-gray-600 text-sm">
                No es un fondo o CETES. Inviertes en un negocio establecido con ventas comprobadas y activos físicos.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Rendimiento Superior</h4>
              <p className="text-gray-600 text-sm">
                20%+ anual vs 3% ahorro, 10% CETES. Con reinversión, el crecimiento es exponencial.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Protección Inflación</h4>
              <p className="text-gray-600 text-sm">
                Las utilidades por moto crecen 5% anual, protegiendo tu inversión contra la inflación.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Patrimonio Heredable</h4>
              <p className="text-gray-600 text-sm">
                Tus tickets son patrimonio real que puedes heredar, vender o seguir generando ingresos.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl shadow-2xl p-8 md:p-12 text-white text-center"
        >
          <Zap className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Calcula Tu Proyección Personalizada
          </h2>
          <p className="text-xl text-orange-50 mb-8 max-w-2xl mx-auto">
            Descubre cuánto podrías generar con tu inversión en tickets de motocicletas.
            Compara con CETES, ahorro bancario y bienes raíces.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-orange-600 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all"
          >
            <BarChart3 className="w-6 h-6" />
            <span>Iniciar Calculadora</span>
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center text-sm text-gray-500"
        >
          <p className="mb-2">
            Las proyecciones son ilustrativas y basadas en datos históricos del negocio.
          </p>
          <p>
            Los rendimientos pasados no garantizan rendimientos futuros. Consulta con un asesor financiero.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default MotorcycleLandingPage;
