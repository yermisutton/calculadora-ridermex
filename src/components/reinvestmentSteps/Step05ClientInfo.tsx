import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ChevronRight, ChevronLeft, User, Phone, Mail, Building } from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';
import { Button } from '../ui/DesignSystem';

interface Step05ClientInfoProps {
  onNext: () => void;
  onPrevious: () => void;
  onStepChange?: (step: number) => void;
}

const Step05ClientInfo: React.FC<Step05ClientInfoProps> = ({ onNext, onPrevious }) => {
  console.log('🟡 Step05ClientInfo: Component mounted/rendered');
  const { investment, updateInvestment } = useCalculator();

  useEffect(() => {
    console.log('🟡 Step05ClientInfo: useEffect - Component mounted to DOM');
    return () => {
      console.log('🟡 Step05ClientInfo: useEffect - Component will unmount');
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🟡 Step05ClientInfo: Form submitted, calling onNext');
    onNext();
  };

  console.log('🟡 Step05ClientInfo: Rendering component');

  return (
    <div className="min-h-screen bg-dark-bg p-md">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 overflow-hidden shadow-lg">
          {/* Header with RiderMex Branding */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-emerald-900/30 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-emerald-200">RM</span>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">Información del Cliente y Asesor</h2>
                <p className="text-white/80 text-lg">
                  Datos personales y de contacto para tu inversión
                </p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Sección: Información del Inversionista */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b-2 border-neon-green/30">
                <div className="w-12 h-12 bg-neon-green/20 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-neon-green" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-50">Datos del Inversionista</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={investment.investorName || ''}
                    onChange={(e) => updateInvestment({ investorName: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-surface border-2 border-dark-border text-neutral-100 rounded-xl focus:ring-2 focus:ring-neon-green focus:border-neon-green transition-colors placeholder:text-neutral-500"
                    placeholder="Ej: Juan Pérez González"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={investment.investorPhone || ''}
                    onChange={(e) => updateInvestment({ investorPhone: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-surface border-2 border-dark-border text-neutral-100 rounded-xl focus:ring-2 focus:ring-neon-green focus:border-neon-green transition-colors placeholder:text-neutral-500"
                    placeholder="+52 55 1234 5678"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    value={investment.investorEmail || ''}
                    onChange={(e) => updateInvestment({ investorEmail: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-surface border-2 border-dark-border text-neutral-100 rounded-xl focus:ring-2 focus:ring-neon-green focus:border-neon-green transition-colors placeholder:text-neutral-500"
                    placeholder="inversionista@email.com"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Sección: Información del Asesor/Ejecutivo */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b-2 border-neon-red/30">
                <div className="w-12 h-12 bg-neon-red/20 rounded-xl flex items-center justify-center">
                  <Building className="w-6 h-6 text-neon-red" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-50">Datos del Asesor/Ejecutivo</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Nombre del Asesor
                  </label>
                  <input
                    type="text"
                    value={investment.executiveName || ''}
                    onChange={(e) => updateInvestment({ executiveName: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-surface border-2 border-dark-border text-neutral-100 rounded-xl focus:ring-2 focus:ring-neon-red focus:border-neon-red transition-colors placeholder:text-neutral-500"
                    placeholder="Ej: María López Sánchez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Teléfono del Asesor
                  </label>
                  <input
                    type="tel"
                    value={investment.executivePhone || ''}
                    onChange={(e) => updateInvestment({ executivePhone: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-surface border-2 border-dark-border text-neutral-100 rounded-xl focus:ring-2 focus:ring-neon-red focus:border-neon-red transition-colors placeholder:text-neutral-500"
                    placeholder="55 1000 0604"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email del Asesor
                  </label>
                  <input
                    type="email"
                    value={investment.executiveEmail || ''}
                    onChange={(e) => updateInvestment({ executiveEmail: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-surface border-2 border-dark-border text-neutral-100 rounded-xl focus:ring-2 focus:ring-neon-red focus:border-neon-red transition-colors placeholder:text-neutral-500"
                    placeholder="informacion@ridermex.com"
                  />
                </div>
              </div>
            </div>

            {/* Tarjeta Informativa */}
            <div className="ds-card bg-gradient-to-br from-neon-red/10 to-neon-green/10 border-neon-red/30">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-neon-red rounded-lg flex items-center justify-center flex-shrink-0 shadow-neon-red">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-50 mb-2">Información Importante</h4>
                  <ul className="text-sm text-neutral-300 space-y-1">
                    <li>• Esta información se incluirá en todos los reportes y documentos generados</li>
                    <li>• Los datos del inversionista son obligatorios</li>
                    <li>• Los datos del asesor son opcionales pero recomendados para seguimiento</li>
                    <li>• Toda la información es confidencial y está protegida</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Botones de Navegación */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={onPrevious}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Anterior
              </Button>

              <Button
                type="submit"
                variant="primary"
                className="flex items-center gap-2"
              >
                Continuar
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Step05ClientInfo;
