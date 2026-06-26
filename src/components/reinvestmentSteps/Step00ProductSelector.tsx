import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bike, TrendingUp, Clock, DollarSign, ChevronRight, ChevronLeft, AlertCircle, X } from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';
import { Card, Button, Heading, Text, StepIndicator } from '../ui/DesignSystem';
import EscalonSelector from '../ui/EscalonSelector';
import { getEscalonByNumber, RIDERMEX_CONFIG, ESCALONES, type EscalonData } from '../../data/ridermexConfig';

interface Step00ProductSelectorProps {
  onNext: () => void;
  onPrevious: () => void;
}

type ProductType = 'A' | 'B' | 'C' | 'D';

const fase1 = ESCALONES[0];
const fase1ROI = fase1.roi;

const ProductData = {
  A: {
    title: 'Modelo A: Contado Tradicional',
    description: 'Pago de contado con descuento del 30% inicial. Cosecha a partir del mes 7.',
    ticketPrice: 100000,
    downPayment: 70000,
    financingMonths: 0,
    firstIncome: 7,
    annualROI: 20.57,
    portfolio: '~10 agencias',
    advantages: [
      'Descuento inicial del 30% por pago de contado',
      'Sin penalización por mensualidades ni recargos',
      'Comienza a recibir rendimientos a los 6 meses (Mes 7)',
      'Rentabilidad anual estimada de 20.57% sobre lo invertido'
    ],
    monthlyPayment: 0
  },
  B: {
    title: 'Modelo B: Financiado 12m',
    description: 'Enganche de $10,000 pesos y diferencia a 12 meses. Penalización de 5% en descuento. Cosecha a partir del mes 19.',
    ticketPrice: 100000,
    downPayment: 10000,
    financingMonths: 12,
    firstIncome: 19,
    annualROI: 18.29,
    portfolio: '~10 agencias',
    advantages: [
      'Bajo enganche inicial de $10,000 pesos',
      'Diferencia a pagar en 12 mensualidades fijas',
      'Descuento máximo del 25% (con penalización del 5%)',
      'Rendimiento en el mes 19 (12m liquidación + 6m maduración)'
    ],
    monthlyPayment: 5729
  },
  C: {
    title: 'Modelo C: Agencia Madura',
    description: 'Ticket en agencia operativa y madura, pago de contado sin descuentos. Rendimiento en Mes 2.',
    ticketPrice: 120000,
    downPayment: 120000,
    financingMonths: 0,
    firstIncome: 2,
    annualROI: 12.00,
    portfolio: '1 agencia operativa',
    advantages: [
      'Rendimientos inmediatos a partir del mes 2',
      'Inversión en una sucursal madura ya operativa',
      'Sin periodos de maduración prolongados',
      'Flujo de caja pasivo inmediato'
    ],
    monthlyPayment: 0
  },
  D: {
    title: 'Modelo D: Financiado Flexible 48m',
    description: 'Enganche de $10,000 pesos y saldo hasta 48 meses. Descuento reducido 5% por año de plazo. Cosecha a partir de liquidación + 6 meses.',
    ticketPrice: 100000,
    downPayment: 10000,
    financingMonths: 48,
    firstIncome: 55,
    annualROI: 13.33,
    portfolio: '~10 agencias',
    advantages: [
      'Máxima flexibilidad de pago hasta en 48 meses',
      'Enganche mínimo de solo $10,000 pesos',
      'Descuento castigado un 5% por cada año de plazo',
      'Rendimiento empieza 6 meses después de la liquidación total'
    ],
    monthlyPayment: 2042
  }
};

const Step00ProductSelector: React.FC<Step00ProductSelectorProps> = ({ onNext, onPrevious }) => {
  const { investment, updateInvestment } = useCalculator();
  const [selectedProduct, setSelectedProduct] = React.useState<ProductType>(
    (investment.ridermexProductType as ProductType) || 'B'
  );
  const [selectedEscalon, setSelectedEscalon] = React.useState(investment.ridermexEscalon || 1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAmount, setEditAmount] = useState(ProductData['B'].downPayment);

  const handleEscalonChange = (escalon: EscalonData) => {
    setSelectedEscalon(escalon.number);
    updateInvestment({
      ridermexEscalon: escalon.number,
      ridermexDiscount: escalon.discount,
      ridermexEntryPrice: escalon.entryPrice,
      investorAnnualReturn: escalon.roi
    });
  };

  const handleSelectProduct = (productType: ProductType) => {
    const product = ProductData[productType];
    setSelectedProduct(productType);
    setEditAmount(product.downPayment);

    updateInvestment({
      ridermexProductType: productType,
      certificateBasePrice: product.ticketPrice,
      initialPayment: product.downPayment,
      ridermexDownPaymentAmount: product.downPayment,
      ridermexFinancingMonths: product.financingMonths,
      ridermexFirstMonthlyIncome: product.firstIncome,
      annualProfit: product.annualROI,
      investorAnnualReturn: product.annualROI,
      ridermexDiscount: productType === 'C' ? 0 : 30
    });
  };

  const handleSaveAmount = () => {
    const newAmount = Math.max(1000, editAmount);
    updateInvestment({
      initialPayment: newAmount,
      ridermexDownPaymentAmount: newAmount
    });
    setShowEditModal(false);
  };

  const currentProduct = ProductData[selectedProduct];

  return (
    <div className="min-h-screen bg-dark-bg p-md">
      <div className="max-w-5xl mx-auto">
        <StepIndicator currentStep={0} totalSteps={14} />

        <div className="mt-lg mb-lg">
          <Heading level="lg">Selecciona tu Modelo de Inversión</Heading>
          <Text size="base" className="mt-2xs text-neutral-400">
            Elige entre 4 opciones diseñadas para diferentes perfiles de inversionista
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md mb-lg">
          {(['A', 'B', 'C', 'D'] as ProductType[]).map((productType) => {
            const product = ProductData[productType];
            const isSelected = selectedProduct === productType;
            const colorMap = {
              A: { gradient: 'from-blue-600 to-blue-700', accent: 'bg-blue-600', icon: 'text-blue-400' },
              B: { gradient: 'from-emerald-600 to-emerald-700', accent: 'bg-emerald-600', icon: 'text-emerald-400' },
              C: { gradient: 'from-amber-600 to-amber-700', accent: 'bg-amber-600', icon: 'text-amber-400' },
              D: { gradient: 'from-orange-600 to-orange-700', accent: 'bg-orange-600', icon: 'text-orange-400' }
            };
            const colors = colorMap[productType as ProductType];

            return (
              <motion.button
                key={productType}
                onClick={() => handleSelectProduct(productType)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative rounded-xl overflow-hidden text-left transition-all duration-300 border-2 ${
                  isSelected
                    ? `bg-gradient-to-br ${colors.gradient} border-transparent shadow-xl`
                    : 'bg-slate-800/50 border-slate-600/50 hover:border-slate-500 shadow-lg'
                }`}
              >
                <div className={`p-md ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                  {isSelected && (
                    <div className={`absolute top-3 right-3 ${colors.accent} text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg`}>
                      ✓
                    </div>
                  )}

                  <div className="flex items-center gap-2xs mb-2xs">
                    <Bike className={`w-6 h-6 flex-shrink-0 ${isSelected ? 'text-white' : colors.icon}`} />
                    <h3 className={`font-montserrat font-bold text-xl ${isSelected ? 'text-white' : 'text-white'}`}>{product.title}</h3>
                  </div>
                  <p className={`text-sm mb-md ${isSelected ? 'text-white/90' : 'text-slate-300'}`}>{product.description}</p>

                  <div className="space-y-2xs mb-md">
                    <div className={`flex items-center gap-2xs ${isSelected ? 'text-white/90' : 'text-slate-300'}`}>
                      <DollarSign className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-white/80' : colors.icon}`} />
                      <span className="text-sm">Ticket: ${product.ticketPrice.toLocaleString()}</span>
                    </div>
                    <div className={`flex items-center gap-2xs ${isSelected ? 'text-white/90' : 'text-slate-300'}`}>
                      <DollarSign className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-white/80' : colors.icon}`} />
                      <span className="text-sm">Inicial: ${product.downPayment.toLocaleString()}</span>
                    </div>
                    <div className={`flex items-center gap-2xs ${isSelected ? 'text-white/90' : 'text-slate-400'}`}>
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">1er ingreso: Mes {product.firstIncome}</span>
                    </div>
                    <div className={`flex items-center gap-2xs ${isSelected ? 'text-white/90' : 'text-slate-300'}`}>
                      <TrendingUp className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-white/80' : colors.icon}`} />
                      <span className="text-sm">ROI Estimado: <span className={`font-semibold ${isSelected ? 'text-white' : 'text-emerald-400'}`}>{product.annualROI}%</span> anual</span>
                    </div>
                  </div>

                  {productType === 'A' && product.financingMonths > 0 && (
                    <div className={`text-xs p-2xs rounded border ${isSelected ? 'bg-white/10 border-white/20 text-white/90' : 'bg-slate-700/50 border-slate-600/30 text-slate-300'}`}>
                      ${product.monthlyPayment}/mes × {product.financingMonths} meses
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          key={selectedProduct}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="ds-card mb-lg"
        >
          <h4 className="ds-heading-sm mb-md">¿Por qué elegir {currentProduct.title}?</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {currentProduct.advantages.map((advantage, idx) => (
              <div key={idx} className="flex items-start gap-3xs">
                <div className="w-6 h-6 rounded-full bg-neon-red flex items-center justify-center flex-shrink-0 text-dark-bg text-sm font-bold mt-1">
                  ✓
                </div>
                <Text size="sm">{advantage}</Text>
              </div>
            ))}
          </div>
        </motion.div>

        {selectedProduct === 'C' && (
          <Card className="mb-lg border-l-4 border-neon-red bg-dark-surface">
            <div className="flex gap-3xs">
              <AlertCircle className="w-5 h-5 text-neon-red flex-shrink-0 mt-1" />
              <div>
                <h5 className="font-montserrat font-bold text-neutral-50 mb-1">Mayor Riesgo - Agencia Individual</h5>
                <Text size="sm">
                  Este modelo invierte en una única agencia. Si bien ofrece ingresos inmediatos, concentra todo el riesgo en una sola operación.
                  Los modelos A y B distribuyen el riesgo en ~10 agencias.
                </Text>
              </div>
            </div>
          </Card>
        )}

        <div className="mb-lg">
          <EscalonSelector
            selectedEscalon={selectedEscalon}
            onEscalonChange={handleEscalonChange}
            onScenarioChange={(scenario) => updateInvestment({ ridermexScenario: scenario })}
            theme="dark"
          />
        </div>

        <Card className="mb-lg">
          <h4 className="ds-heading-sm mb-md">Resumen de tu Selección</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
            <div>
              <Text size="sm" className="text-neutral-500 font-semibold mb-1">MODELO</Text>
              <p className="text-xl font-montserrat font-bold text-neon-red">Tipo {selectedProduct}</p>
            </div>
            <motion.button
              onClick={() => {
                setEditAmount(investment.ridermexDownPaymentAmount || currentProduct.downPayment);
                setShowEditModal(true);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-left hover:bg-dark-surface/50 p-3 rounded-lg transition-all duration-200 group"
            >
              <Text size="sm" className="text-neutral-500 font-semibold mb-1">INVERSIÓN INICIAL</Text>
              <p className="text-xl font-montserrat font-bold text-neon-red group-hover:text-neon-red/80">${(investment.ridermexDownPaymentAmount || currentProduct.downPayment).toLocaleString()}</p>
              <Text size="xs" className="text-neutral-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Haz click para editar</Text>
            </motion.button>
            <div>
              <Text size="sm" className="text-neutral-500 font-semibold mb-1">1ER INGRESO</Text>
              <p className="text-xl font-montserrat font-bold text-neutral-50">Mes {currentProduct.firstIncome}</p>
            </div>
            <div>
              <Text size="sm" className="text-neutral-500 font-semibold mb-1">ROI ANUAL ESTIMADO</Text>
              <p className="text-xl font-montserrat font-bold text-neon-green">{currentProduct.annualROI}%</p>
            </div>
          </div>
        </Card>

        <AnimatePresence>
          {showEditModal && (
            <>
              <motion.div
                key="modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowEditModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              />
              <motion.div
                key="modal-content"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
              >
                <div className="bg-gradient-to-br from-dark-surface to-dark-bg rounded-2xl p-lg border border-dark-border shadow-2xl">
                  <div className="flex items-center justify-between mb-md">
                    <h3 className="text-xl font-montserrat font-bold text-neon-red">Editar Inversión Inicial</h3>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowEditModal(false)}
                      className="text-neutral-400 hover:text-neutral-200 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  </div>

                  <div className="mb-md">
                    <label className="block text-sm font-semibold text-neutral-400 mb-2">Monto en $</label>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-montserrat font-bold text-neutral-300">$</span>
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(Math.max(0, parseInt(e.target.value) || 0))}
                        autoFocus
                        className="flex-1 bg-dark-bg border-2 border-neon-red/30 focus:border-neon-red rounded-lg px-4 py-3 text-2xl font-montserrat font-bold text-neon-red focus:outline-none transition-colors"
                        placeholder="0"
                      />
                    </div>
                    <p className="text-xs text-neutral-500 mt-2">Mínimo: $1,000</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-md">
                    {[10000, 50000, 100000].map((amount) => (
                      <motion.button
                        key={amount}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setEditAmount(amount)}
                        className="bg-dark-surface border border-neon-red/30 hover:border-neon-red rounded-lg px-3 py-2 text-sm font-montserrat font-semibold text-neon-red hover:bg-neon-red/10 transition-all"
                      >
                        ${(amount / 1000).toFixed(0)}K
                      </motion.button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSaveAmount}
                      className="flex-1"
                    >
                      Guardar
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex gap-md justify-between pt-md border-t border-dark-border">
          <Button variant="secondary" onClick={onPrevious} className="flex items-center gap-2xs">
            <ChevronLeft className="w-5 h-5" />
            Anterior
          </Button>
          <Button variant="primary" onClick={onNext} className="flex items-center gap-2xs">
            Siguiente
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step00ProductSelector;
