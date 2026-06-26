import React from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, Users, Target, DollarSign, AlertCircle } from 'lucide-react';

const RiderMexExplanation: React.FC = () => {
  const sections = [
    {
      icon: DollarSign,
      title: 'Fee Base por Motocicleta',
      description: 'Cada motocicleta vendida genera un pago de 900 MXN (base).',
      details: [
        'Este fee se divide entre los 300 tickets del fondo',
        'Solo se aplica si la agencia alcanza el mínimo mensual',
        'Crece anualmente con inflación + 1.5%'
      ],
      color: 'from-green-600 to-green-700'
    },
    {
      icon: Target,
      title: 'Mínimos por Modelo de Agencia',
      description: 'Cada modelo tiene un mínimo de ventas mensuales.',
      details: [
        'Modelo A: mínimo 32 motos/mes',
        'Modelo B: mínimo 40 motos/mes',
        'Modelo C: mínimo 48 motos/mes',
        'Sin mínimo = sin fee para esa agencia ese mes'
      ],
      color: 'from-blue-600 to-blue-700'
    },
    {
      icon: Zap,
      title: 'Sistema de Bonos',
      description: 'Bonos por desempeño superior (solo en motos excedentes).',
      details: [
        'Bono 1: ventas ≥ 120% del mínimo = +15% sobre excedente',
        'Bono 2: ventas ≥ 135% del mínimo = +25% sobre excedente',
        'Bono 3: ventas ≥ 150% del mínimo = +35% sobre excedente',
        'Los bonos se aplican SOLO al excedente, no a todas las motos'
      ],
      color: 'from-yellow-600 to-yellow-700'
    },
    {
      icon: Users,
      title: 'Portafolio de Agencias',
      description: 'El fondo invierte en múltiples agencias diversificadas.',
      details: [
        '10 agencias en total: 3 Modelo A, 4 Modelo B, 3 Modelo C',
        'Diversificación reduce riesgo operativo',
        'Cada agencia es independiente en ventas',
        'El rendimiento es la suma de todas las agencias'
      ],
      color: 'from-purple-600 to-purple-700'
    },
    {
      icon: TrendingUp,
      title: 'Ajuste Anual del Fee',
      description: 'El fee crece automáticamente cada año.',
      details: [
        'Fórmula: inflación anual + 1.5% spread',
        'Ejemplo: 3.5% inflación + 1.5% = 5% ajuste anual',
        'Nuevo fee = 900 × 1.05 = 945 MXN',
        'Protege tu inversión contra la inflación'
      ],
      color: 'from-red-600 to-red-700'
    },
    {
      icon: AlertCircle,
      title: 'Importante: Solo Motos',
      description: 'El modelo SOLO genera ingresos por motocicletas vendidas.',
      details: [
        'No incluyen accesorios, refacciones o créditos',
        'No incluyen intereses, seguros o comisiones',
        'No incluyen servicios adicionales',
        'Base: volumen de motos vendidas por agencia'
      ],
      color: 'from-orange-600 to-orange-700'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-b from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-gradient-to-br ${section.color} p-0.5 rounded-xl`}
            >
              <div className="bg-slate-900 rounded-[10px] p-6 h-full">
                <div className="flex items-start gap-4 mb-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${section.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                    <p className="text-sm text-slate-400 mt-1">{section.description}</p>
                  </div>
                </div>

                <ul className="space-y-2 mt-4">
                  {section.details.map((detail, detailIdx) => (
                    <li key={detailIdx} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-red-400 font-bold">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Key Formula Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 bg-gradient-to-r from-red-600/20 to-red-700/20 border border-red-500/30 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-red-300 mb-4">Fórmula de Cálculo</h3>
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-slate-300 mb-2">
              <span className="font-semibold">Rendimiento Mensual por Ticket:</span>
            </p>
            <div className="bg-slate-900/50 rounded-lg p-3 font-mono text-xs text-green-400">
              (Total Motos × Fee/Moto + Bonos) ÷ 300 Tickets
            </div>
          </div>
          <div>
            <p className="text-slate-300 mb-2">
              <span className="font-semibold">Tu Rendimiento Mensual (como inversionista):</span>
            </p>
            <div className="bg-slate-900/50 rounded-lg p-3 font-mono text-xs text-blue-400">
              (Rendimiento/Ticket) × Tus Tickets
            </div>
          </div>
          <div>
            <p className="text-slate-300 mb-2">
              <span className="font-semibold">ROI Anual:</span>
            </p>
            <div className="bg-slate-900/50 rounded-lg p-3 font-mono text-xs text-purple-400">
              (Rendimiento Anual ÷ Inversión Inicial) × 100
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RiderMexExplanation;
