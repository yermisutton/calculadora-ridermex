import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Users,
  Bike,
  Calculator,
  Percent,
  Calendar,
  Sparkles,
  Info,
  ChevronRight,
  Target,
  Zap,
  PieChart,
  BarChart3,
  Plus,
  Minus,
  RotateCcw,
} from 'lucide-react';
import EscalonSelector, { ScenarioType } from './ui/EscalonSelector';
import { ESCALONES, RIDERMEX_CONFIG, type EscalonData, getPriceForTicketNumber } from '../data/ridermexConfig';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import UnitEconomicsDownloadButtons from './ui/UnitEconomicsDownloadButtons';

interface UnitEconomicsCalculatorProps {
  onBack?: () => void;
}

interface EconomicsData {
  capitalInvertido: number;
  motosVendidasAnual: number;
  utilidadPorMoto: number;
  escalon: number;
  scenario: ScenarioType;
  numTickets: number;
  reinvestmentEnabled: boolean;
  projectionYears: number;
  partialCashOut: boolean;
  cashOutPercentage: number;
  yearlyCashOutPercentages: number[];
  financingMonths: 0 | 12;
}

const getFinancingConfig = (financingMonths: 0 | 12) => {
  return {
    numInvestors: RIDERMEX_CONFIG.TICKETS_PER_STORE,
    capitalPerTicket: RIDERMEX_CONFIG.TICKET_PRICE,
    motosAnuales: RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR,
  };
};

const UnitEconomicsCalculator: React.FC<UnitEconomicsCalculatorProps> = ({ onBack }) => {
  const [data, setData] = useState<EconomicsData>({
    capitalInvertido: ESCALONES[0].entryPrice,
    motosVendidasAnual: RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR,
    utilidadPorMoto: RIDERMEX_CONFIG.PROFIT_PER_MOTORCYCLE,
    escalon: 1,
    scenario: 'moderate',
    numTickets: 1,
    reinvestmentEnabled: true,
    projectionYears: 10,
    partialCashOut: false,
    cashOutPercentage: 0,
    yearlyCashOutPercentages: Array(30).fill(0),
    financingMonths: 12,
  });

  const financingConfig = getFinancingConfig(data.financingMonths as 0 | 12);
  const NUMERO_INVERSIONISTAS = financingConfig.numInvestors;

  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');

  const handleEscalonChange = (escalon: EscalonData) => {
    setData(prev => ({
      ...prev,
      capitalInvertido: escalon.entryPrice,
      escalon: escalon.number,
    }));
  };

  const handleScenarioChange = (scenario: ScenarioType) => {
    const scenarioConfig = RIDERMEX_CONFIG.SCENARIOS[scenario];
    setData(prev => ({
      ...prev,
      scenario,
      motosVendidasAnual: scenarioConfig.motorcyclesPerYear,
    }));
  };

  const calcularMetricas = () => {
    const utilidadTotalAnual = data.motosVendidasAnual * data.utilidadPorMoto;
    const utilidadPorTicket = utilidadTotalAnual / NUMERO_INVERSIONISTAS;
    const capitalPorTicket = data.capitalInvertido;
    const capitalTotal = capitalPorTicket * data.numTickets;
    const utilidadPorInversionista = utilidadPorTicket * data.numTickets;

    const roi = (utilidadPorTicket / capitalPorTicket) * 100;
    const roiMensual = roi / 12;
    const gananciasMensual = utilidadPorInversionista / 12;
    const gananciasDiaria = utilidadPorInversionista / 365;
    const motosVendidasMensual = data.motosVendidasAnual / 12;
    const motosVendidasDiaria = data.motosVendidasAnual / 365;
    const multiplicadorCapital = utilidadPorTicket / capitalPorTicket;

    return {
      utilidadTotalAnual,
      utilidadPorTicket,
      utilidadPorInversionista,
      capitalTotal,
      roi,
      roiMensual,
      gananciasMensual,
      gananciasDiaria,
      motosVendidasMensual,
      motosVendidasDiaria,
      capitalPorInversionista: capitalPorTicket,
      multiplicadorCapital,
    };
  };

  const calcularProyeccionMultianual = () => {
    const metricas = calcularMetricas();
    const proyeccion = [];

    const MARKET_GROWTH_RATE = 5;
    const CAPITAL_APPRECIATION_YEAR_1 = 1.50;
    const CAPITAL_APPRECIATION_ANNUAL = 1.05;
    const YIELD_DISCOUNT_PER_YEAR = 2;

    let ticketsAcumulados = data.numTickets;
    let ticketsDeReinversion = 0;
    let capitalInicial = metricas.capitalTotal;
    let capitalDeReinversion = 0;
    let gananciasRetiradasAcumuladas = 0;
    let utilidadPorTicketBase = metricas.utilidadPorTicket;
    let precioTicketBase = metricas.capitalPorInversionista;
    let fondoAcumulado = 0; // Fondo de liquidez que acumula ganancias

    const ticketsPorAno: { year: number; tickets: number; costoUnitario: number; escalonNumber: number }[] = [
      {
        year: 0,
        tickets: data.numTickets,
        costoUnitario: precioTicketBase,
        escalonNumber: data.escalon
      }
    ];

    // Array para rastrear tickets APARTADOS (precio amarrado pero aún en proceso de pago)
    const ticketsApartados: {
      yearApartado: number;
      precioAmarrado: number;
      montoPagado: number;
      montoPendiente: number;
    }[] = [];

    // Límite de tickets en pago simultáneo (igual que certificateEvolution.ts)
    const MAX_CONCURRENT_PAYMENTS = 5;

    for (let year = 1; year <= data.projectionYears; year++) {
      // CALCULAR UTILIDAD ANUAL (con market growth y descuento por año)
      let gananciaAnual = 0;

      for (const grupo of ticketsPorAno) {
        // Aplicar descuento del 2% por cada AÑO desde la compra inicial (año 0)
        const yearsFromFirstPurchase = grupo.year; // año 0 = sin descuento, año 1 = 2%, etc.
        const discountPercentage = yearsFromFirstPurchase * YIELD_DISCOUNT_PER_YEAR;
        const yieldMultiplier = Math.max(0, 1 - (discountPercentage / 100));

        // Calcular utilidad con descuento
        let utilidadPorTicket = utilidadPorTicketBase * yieldMultiplier;

        // Aplicar market growth del 5% desde el año de compra
        const yearsOfGrowth = year - grupo.year;
        if (yearsOfGrowth > 0) {
          utilidadPorTicket = utilidadPorTicket * Math.pow(1 + MARKET_GROWTH_RATE / 100, yearsOfGrowth);
        }

        gananciaAnual += grupo.tickets * utilidadPorTicket;
      }

      const nextTicketNum = ticketsAcumulados + 1;
      const precioTicketCompra = getPriceForTicketNumber(Math.min(nextTicketNum, RIDERMEX_CONFIG.TOTAL_TICKETS));

      if (year === 1 || year === 2) {
        console.log(`=== AÑO ${year} - PRECIO DE COMPRA ===`);
        console.log(`Precio base inicial: $${precioTicketBase.toLocaleString()}`);
        console.log(`Multiplicador (año ${year}): ${Math.pow(CAPITAL_APPRECIATION_ANNUAL, year - 1).toFixed(4)}`);
        console.log(`Precio ticket compra: $${precioTicketCompra.toLocaleString()}`);
      }

      // CALCULAR PLUSVALÍA (50% año 1, luego 5% anual desde el costo de compra)
      let plusvaliaTotalTickets = 0;
      let capitalTotalInvertido = 0;

      for (const grupo of ticketsPorAno) {
        const yearsHeld = year - grupo.year;
        let valorActualPorTicket: number;

        if (yearsHeld === 0) {
          // En el año de compra: 50% de apreciación inmediata
          valorActualPorTicket = grupo.costoUnitario * CAPITAL_APPRECIATION_YEAR_1;
        } else {
          // Años siguientes: 50% en año 1, luego 5% compuesto
          const yearOneValue = grupo.costoUnitario * CAPITAL_APPRECIATION_YEAR_1;
          valorActualPorTicket = yearOneValue * Math.pow(CAPITAL_APPRECIATION_ANNUAL, yearsHeld);
        }

        plusvaliaTotalTickets += grupo.tickets * valorActualPorTicket;
        capitalTotalInvertido += grupo.tickets * grupo.costoUnitario;
      }

      let ticketsComprados = 0;
      let gananciaRetirableEsteAno = 0;
      let costoTicketsComprados = 0;
      let montoRetirado = 0;
      const ticketsCompletadosEsteAno: number[] = []; // Precios amarrados de tickets completados

      if (data.reinvestmentEnabled) {
        let mesInicioRendimientos: number;
        if (data.financingMonths === 0) {
          mesInicioRendimientos = RIDERMEX_CONFIG.FIRST_INCOME_CONTADO_MONTH;
        } else {
          mesInicioRendimientos = RIDERMEX_CONFIG.FIRST_INCOME_CREDITO_MONTH;
        }

        // Ajustar gananciaAnual según los meses que realmente generan utilidades en este año
        const primerMesDelAno = (year - 1) * 12 + 1;
        const ultimoMesDelAno = year * 12;

        let mesesConUtilidades = 0;
        if (mesInicioRendimientos <= ultimoMesDelAno) {
          // Hay utilidades en este año
          const mesInicioEnEsteAno = Math.max(mesInicioRendimientos, primerMesDelAno);
          mesesConUtilidades = ultimoMesDelAno - mesInicioEnEsteAno + 1;
        }

        // Ajustar gananciaAnual proporcionalmente
        const gananciaAnualOriginal = gananciaAnual;
        gananciaAnual = gananciaAnualOriginal * (mesesConUtilidades / 12);

        // Calcular ganancias mes a mes durante este año
        const gananciaMensual = gananciaAnualOriginal / 12;

        for (let mes = 1; mes <= 12; mes++) {
          const mesAbsoluto = (year - 1) * 12 + mes;

          // Solo se generan utilidades después del mes de inicio de rendimientos
          if (mesAbsoluto >= mesInicioRendimientos) {
            fondoAcumulado += gananciaMensual;

            // PASO 1: Pagar tickets apartados (distribuir fondos entre todos)
            let fondoRestante = fondoAcumulado;

            // Procesar pagos de tickets apartados
            let i = 0;
            while (i < ticketsApartados.length && fondoRestante > 0) {
              const ticketApartado = ticketsApartados[i];

              if (fondoRestante >= ticketApartado.montoPendiente) {
                // Se completa el pago de este ticket
                const pagoFinal = ticketApartado.montoPendiente;
                fondoRestante -= pagoFinal;
                costoTicketsComprados += pagoFinal;

                // Ticket completamente pagado: ahora genera rendimientos
                ticketsAcumulados += 1;
                ticketsDeReinversion += 1;
                capitalDeReinversion += ticketApartado.precioAmarrado;

                const nuevoEscalonData = getPriceForTicketNumber(ticketsAcumulados);
                const nuevoEscalon = data.escalon;

                ticketsPorAno.push({
                  year: year,
                  tickets: 1,
                  costoUnitario: ticketApartado.precioAmarrado,
                  escalonNumber: nuevoEscalon
                });

                ticketsCompletadosEsteAno.push(ticketApartado.precioAmarrado);
                ticketsComprados++;

                console.log(`=== AÑO ${year}, MES ${mes} - TICKET COMPLETADO ===`);
                console.log(`Precio amarrado: $${ticketApartado.precioAmarrado.toLocaleString()}`);

                // Remover de apartados
                ticketsApartados.splice(i, 1);

                // PASO 2: Apartar el siguiente ticket si hay espacio disponible (máximo 5 simultáneos)
                if (ticketsApartados.length < MAX_CONCURRENT_PAYMENTS) {
                  ticketsApartados.push({
                    yearApartado: year,
                    precioAmarrado: precioTicketCompra,
                    montoPagado: 0,
                    montoPendiente: precioTicketCompra
                  });

                  console.log(`=== AÑO ${year}, MES ${mes} - NUEVO TICKET APARTADO ===`);
                  console.log(`Precio amarrado: $${precioTicketCompra.toLocaleString()}`);
                }
                // No incrementar i porque removimos un elemento
              } else {
                // Abono parcial: distribuir proporcionalmente entre todos los tickets apartados
                const totalPendiente = ticketsApartados.reduce((sum, t) => sum + t.montoPendiente, 0);
                const proporcionPago = ticketApartado.montoPendiente / totalPendiente;
                const abono = fondoRestante * proporcionPago;

                ticketApartado.montoPagado += abono;
                ticketApartado.montoPendiente -= abono;
                costoTicketsComprados += abono;
                fondoRestante -= abono;

                i++; // Avanzar al siguiente ticket
              }
            }

            fondoAcumulado = fondoRestante;

            // Si no hay tickets apartados, apartar uno nuevo (si no se ha alcanzado el límite)
            if (ticketsApartados.length === 0 && ticketsApartados.length < MAX_CONCURRENT_PAYMENTS) {
              ticketsApartados.push({
                yearApartado: year,
                precioAmarrado: precioTicketCompra,
                montoPagado: 0,
                montoPendiente: precioTicketCompra
              });

              console.log(`=== AÑO ${year}, MES ${mes} - PRIMER TICKET APARTADO ===`);
              console.log(`Precio amarrado: $${precioTicketCompra.toLocaleString()}`);
            }
          }
        }

        // Aplicar retiros si están habilitados (al final del año)
        if (data.partialCashOut && data.yearlyCashOutPercentages[year - 1] > 0) {
          const porcentajeRetiro = data.yearlyCashOutPercentages[year - 1] / 100;
          montoRetirado = gananciaAnual * porcentajeRetiro;
          fondoAcumulado -= montoRetirado;
          gananciasRetiradasAcumuladas += montoRetirado;
        }

        gananciaRetirableEsteAno = 0;

        // Calcular el valor del fondo acumulado (incluye tickets apartados)
        let valorTicketsApartados = 0;
        for (const apartado of ticketsApartados) {
          valorTicketsApartados += apartado.montoPagado;
        }
        gananciasRetiradasAcumuladas = fondoAcumulado + valorTicketsApartados;
      } else {
        // Sin reinversión, se retira todo
        gananciaRetirableEsteAno = gananciaAnual;
        gananciasRetiradasAcumuladas += gananciaAnual;
      }

      const capitalTotalAcumulado = capitalInicial + capitalDeReinversion;

      // ROI debe considerar el retorno TOTAL (ganancias + plusvalía)
      const valorActualTickets = plusvaliaTotalTickets; // Valor actual de todos los tickets
      const gananciasTotales = data.reinvestmentEnabled
        ? (valorActualTickets - capitalTotalAcumulado) // Durante reinversión: plusvalía
        : gananciasRetiradasAcumuladas; // Sin reinversión: ganancias acumuladas

      const retornoTotal = gananciasTotales;
      const roiPorcentaje = capitalTotalAcumulado > 0
        ? (retornoTotal / capitalTotalAcumulado) * 100
        : 0;
      const recuperoInversion = retornoTotal >= capitalInicial;

      // Calcular patrimonio total correctamente
      const patrimonioTotal = data.reinvestmentEnabled
        ? plusvaliaTotalTickets + gananciasRetiradasAcumuladas // Valor tickets + fondo disponible
        : plusvaliaTotalTickets + gananciasRetiradasAcumuladas;

      // Calcular el costo total real basado en precios amarrados
      const costoTotalPreciosAmarrados = ticketsCompletadosEsteAno.reduce((sum, precio) => sum + precio, 0);
      const precioPromedioAmarrado = ticketsComprados > 0
        ? costoTotalPreciosAmarrados / ticketsComprados
        : 0;

      // Calcular precio promedio de venta del ticket (plusvalía / tickets totales)
      const precioVentaPromedioTicket = ticketsAcumulados > 0
        ? plusvaliaTotalTickets / ticketsAcumulados
        : 0;

      proyeccion.push({
        year,
        tickets: ticketsAcumulados,
        ticketsIniciales: data.numTickets,
        ticketsDeReinversion,
        ticketsComprados,
        costoTicketsComprados, // Lo que se pagó este año (puede ser parcial)
        costoTotalPreciosAmarrados, // Costo total real de los tickets completados (precio amarrado)
        precioPromedioAmarrado, // Precio promedio amarrado de tickets completados
        precioVentaPromedioTicket, // Precio promedio de venta en el mercado
        gananciaAnual,
        gananciaRetirableEsteAno,
        gananciasRetiradasAcumuladas, // Incluye tickets apartados + fondo libre
        capitalInicial,
        capitalDeReinversion,
        capitalTotalAcumulado,
        plusvaliaTotalTickets,
        utilidadPorTicket: gananciaAnual / ticketsAcumulados, // Promedio
        precioTicketActual: precioTicketCompra,
        patrimonioTotal,
        retornoTotal,
        roiPorcentaje,
        recuperoInversion,
        montoRetirado, // Agregar el monto retirado este año
      });
    }

    return proyeccion;
  };

  const metricas = calcularMetricas();
  const proyeccionMultianual = calcularProyeccionMultianual();

  const calcularROI = () => {
    const yearRecuperacion = proyeccionMultianual.find(y => y.recuperoInversion);
    const lastYear = proyeccionMultianual[proyeccionMultianual.length - 1];

    return {
      yearRecuperacion: yearRecuperacion?.year || null,
      roiFinal: lastYear?.roiPorcentaje || 0,
      retornoFinal: lastYear?.retornoTotal || 0,
      recuperoCompleto: !!yearRecuperacion,
    };
  };

  const roiData = calcularROI();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const InputSlider: React.FC<{
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step: number;
    prefix?: string;
    suffix?: string;
    icon: React.ReactNode;
    color: string;
    tooltip?: string;
  }> = ({ label, value, onChange, min, max, step, prefix = '', suffix = '', icon, color, tooltip }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-green-300 transition-all duration-300"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
              {icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-800">{label}</h3>
              {tooltip && (
                <button
                  onMouseEnter={() => setShowTooltip(label)}
                  onMouseLeave={() => setShowTooltip(null)}
                  className="text-xs text-gray-500 hover:text-green-600 flex items-center gap-1 mt-1"
                >
                  <Info className="w-3 h-3" />
                  <span>Info</span>
                </button>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {prefix}
              {value.toLocaleString('es-MX')}
              {suffix}
            </div>
          </div>
        </div>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
          style={{
            background: `linear-gradient(to right, #10b981 0%, #10b981 ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`,
          }}
        />

        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>
            {prefix}
            {min.toLocaleString('es-MX')}
            {suffix}
          </span>
          <span>
            {prefix}
            {max.toLocaleString('es-MX')}
            {suffix}
          </span>
        </div>

        <AnimatePresence>
          {showTooltip === label && tooltip && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200"
            >
              <p className="text-sm text-gray-700">{tooltip}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const MetricCard: React.FC<{
    title: string;
    value: string;
    subtitle?: string;
    icon: React.ReactNode;
    color: string;
    trend?: 'up' | 'down';
    highlight?: boolean;
  }> = ({ title, value, subtitle, icon, color, trend, highlight = false }) => {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        className={`${
          highlight
            ? 'bg-gradient-to-br from-red-600 to-red-800 text-white shadow-2xl shadow-red-500/30'
            : 'bg-gradient-to-br from-gray-900 to-black border border-gray-800'
        } rounded-2xl p-6 relative overflow-hidden`}
      >
        {highlight && (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 rounded-full -mr-16 -mt-16"
          />
        )}

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className={`w-12 h-12 ${
              highlight
                ? 'bg-yellow-500/20 shadow-lg shadow-yellow-500/30'
                : 'bg-gradient-to-br from-red-600/30 to-red-800/30'
            } rounded-xl flex items-center justify-center`}>
              {React.cloneElement(icon as React.ReactElement, {
                className: `w-6 h-6 ${highlight ? 'text-yellow-400' : 'text-red-400'}`,
              })}
            </div>
            {trend && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                highlight ? 'bg-yellow-500/20' : 'bg-green-500/20'
              }`}>
                <TrendingUp className={`w-4 h-4 ${highlight ? 'text-yellow-400' : 'text-green-400'}`} />
              </div>
            )}
          </div>

          <h3 className={`text-sm font-medium ${highlight ? 'text-yellow-100' : 'text-gray-400'} mb-2`}>
            {title}
          </h3>

          <div className={`text-3xl font-bold ${highlight ? 'text-white' : 'text-red-400'} mb-1`}>
            {value}
          </div>

          {subtitle && (
            <p className={`text-sm ${highlight ? 'text-yellow-100' : 'text-gray-500'}`}>
              {subtitle}
            </p>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <style>
        {`
          .slider-thumb::-webkit-slider-thumb {
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #10b981;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
            transition: all 0.2s;
          }

          .slider-thumb::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.6);
          }

          .slider-thumb::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #10b981;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
            transition: all 0.2s;
          }

          .slider-thumb::-moz-range-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.6);
          }
        `}
      </style>

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-red-950 to-black shadow-2xl border-b border-red-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <motion.button
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBack}
                  className="p-3 bg-red-600/20 hover:bg-red-600/30 rounded-xl backdrop-blur-sm transition-all border border-red-700/30"
                >
                  <ArrowLeft className="w-6 h-6 text-red-500" />
                </motion.button>
              )}

              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-600 flex items-center gap-3">
                  <Calculator className="w-8 h-8 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  Unit Economics
                </h1>
                <p className="text-gray-400 mt-1">
                  Simulador Interactivo de Matemática Transparente
                </p>
              </div>
            </div>

            <motion.div
              animate={{
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="hidden md:block"
            >
              <Bike className="w-16 h-16 text-red-500/30 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]" />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Disclaimer Legal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-gradient-to-r from-yellow-950/30 to-orange-900/20 border border-yellow-700/30 rounded-2xl p-6 backdrop-blur-sm"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-500/30">
              <Info className="w-6 h-6 text-black" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-yellow-400 mb-2">Aviso Legal Importante</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Todas las cifras mostradas en esta calculadora son <strong className="text-yellow-300">proyecciones estimadas con fines ilustrativos y educativos únicamente</strong>.
                Los rendimientos, utilidades y retornos presentados son estimaciones basadas en escenarios hipotéticos y no constituyen garantías de
                resultados futuros. Los resultados reales pueden variar significativamente. Esta herramienta no constituye asesoría financiera,
                legal o de inversión. Consulte con un profesional calificado antes de tomar decisiones de inversión.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Selector de Escalones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-600 mb-6 flex items-center gap-3">
            <Target className="w-8 h-8 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            Selecciona tu Ticket de Inversión
          </h2>
          <p className="text-gray-400 mb-6 text-lg">
            El precio de entrada y el escenario de ventas determinan tu ROI. A menor precio de entrada, mayor tu retorno porcentual.
          </p>
          <EscalonSelector
            selectedEscalon={data.escalon}
            onEscalonChange={handleEscalonChange}
            selectedScenario={data.scenario}
            onScenarioChange={handleScenarioChange}
            theme="dark"
          />
        </motion.div>

        {/* Explicación del Modelo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-950/50 to-gray-900/50 border border-red-800/30 rounded-3xl p-8 mb-12 relative overflow-hidden backdrop-blur-sm"
        >
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <Sparkles className="w-full h-full text-red-500" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-600">
              <Target className="w-8 h-8 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              Modelo de Negocio Transparente
            </h2>
            <p className="text-gray-300 text-lg mb-6">
              Un modelo simple pero poderoso: Compramos motos a precio mayorista, las vendemos a distribuidores,
              y las utilidades se reparten entre todos los inversionistas proporcionalmente.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Bike className="w-6 h-6 text-red-400" />
                  <h3 className="font-bold text-red-400">Paso 1: Compra</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Adquirimos motos a precio de mayoreo para maximizar el margen
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6 text-yellow-400" />
                  <h3 className="font-bold text-yellow-400">Paso 2: Venta</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Vendemos a distribuidores autorizados con margen garantizado
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-green-400" />
                  <h3 className="font-bold text-green-400">Paso 3: Reparto</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Las utilidades se dividen equitativamente entre inversionistas
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Controles Interactivos */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-600 mb-6 flex items-center gap-3">
            <Sliders className="w-8 h-8 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            Ajusta los Parámetros
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Mueve los controles para ver cómo cambian tus ganancias en tiempo real
          </p>

          <div className="mb-8 bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-red-800/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/30">
                <Info className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-red-400 mb-2">Configuración del Modelo</h3>
                <p className="text-gray-400 text-sm">
                  El <strong className="text-yellow-400">capital invertido</strong> está determinado por el escalón que elijas arriba ({data.escalon}: {ESCALONES.find(e => e.number === data.escalon)?.name}).
                  Puedes ajustar el <strong className="text-yellow-400">volumen de ventas</strong> usando el escenario de negocio o manualmente con el slider.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-red-800/30">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/30">
                  <Bike className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-red-400 mb-2">Ventas Anuales de Motos</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Número de motos vendidas por año (100-1000)
                  </p>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setData({ ...data, motosVendidasAnual: Math.max(100, data.motosVendidasAnual - 10) })}
                      className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-red-500/30"
                    >
                      <Minus className="w-5 h-5" />
                    </button>

                    <div className="flex-1">
                      <input
                        type="range"
                        min="100"
                        max="1000"
                        step="10"
                        value={data.motosVendidasAnual}
                        onChange={(e) => setData({ ...data, motosVendidasAnual: parseInt(e.target.value) })}
                        className="w-full h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer slider-thumb"
                      />
                      <div className="mt-2 text-center">
                        <span className="text-4xl font-bold text-red-400">{data.motosVendidasAnual}</span>
                        <span className="text-gray-400 ml-2">motos/año</span>
                      </div>
                      <div className="mt-2 text-center text-sm text-gray-500">
                        Promedio Mensual: <strong className="text-yellow-400">{Math.round(data.motosVendidasAnual / 12)}</strong> motos
                      </div>
                    </div>

                    <button
                      onClick={() => setData({ ...data, motosVendidasAnual: Math.min(1000, data.motosVendidasAnual + 10) })}
                      className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-red-500/30"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-4 flex gap-2 flex-wrap">
                    <button
                      onClick={() => setData({ ...data, motosVendidasAnual: RIDERMEX_CONFIG.SCENARIOS.conservative.motorcyclesPerYear })}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        data.motosVendidasAnual === RIDERMEX_CONFIG.SCENARIOS.conservative.motorcyclesPerYear
                          ? 'bg-gradient-to-br from-red-600 to-red-800 text-white shadow-lg shadow-red-500/30'
                          : 'bg-gray-800 text-red-400 border border-red-700/30 hover:bg-gray-700'
                      }`}
                    >
                      Conservador ({RIDERMEX_CONFIG.SCENARIOS.conservative.motorcyclesPerYear})
                    </button>
                    <button
                      onClick={() => setData({ ...data, motosVendidasAnual: RIDERMEX_CONFIG.SCENARIOS.moderate.motorcyclesPerYear })}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        data.motosVendidasAnual === RIDERMEX_CONFIG.SCENARIOS.moderate.motorcyclesPerYear
                          ? 'bg-gradient-to-br from-red-600 to-red-800 text-white shadow-lg shadow-red-500/30'
                          : 'bg-gray-800 text-red-400 border border-red-700/30 hover:bg-gray-700'
                      }`}
                    >
                      Moderado ({RIDERMEX_CONFIG.SCENARIOS.moderate.motorcyclesPerYear})
                    </button>
                    <button
                      onClick={() => setData({ ...data, motosVendidasAnual: RIDERMEX_CONFIG.SCENARIOS.optimistic.motorcyclesPerYear })}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        data.motosVendidasAnual === RIDERMEX_CONFIG.SCENARIOS.optimistic.motorcyclesPerYear
                          ? 'bg-gradient-to-br from-red-600 to-red-800 text-white shadow-lg shadow-red-500/30'
                          : 'bg-gray-800 text-red-400 border border-red-700/30 hover:bg-gray-700'
                      }`}
                    >
                      Optimista ({RIDERMEX_CONFIG.SCENARIOS.optimistic.motorcyclesPerYear})
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-amber-800/30">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/30">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-white font-semibold">Utilidad Estimada por Moto</h3>
                    <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded border border-amber-500/50">
                      FIJO
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">Ganancia neta estimada después de costos por cada moto vendida. Cifras proyectadas con fines ilustrativos.</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-amber-300">$900</div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-cyan-800/30">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/30">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-cyan-400 mb-2">Cantidad de Tickets a Invertir</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Selecciona cuántos tickets deseas comprar (1-50)
                  </p>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setData({ ...data, numTickets: Math.max(1, data.numTickets - 1) })}
                      className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-cyan-800 hover:from-cyan-700 hover:to-cyan-900 text-white rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-cyan-500/30"
                    >
                      <Minus className="w-5 h-5" />
                    </button>

                    <div className="flex-1">
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={data.numTickets}
                        onChange={(e) => setData({ ...data, numTickets: parseInt(e.target.value) })}
                        className="w-full h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer slider-thumb"
                      />
                      <div className="mt-4 text-center">
                        <span className="text-5xl font-bold text-cyan-400">{data.numTickets}</span>
                        <span className="text-gray-400 ml-2 text-xl">ticket{data.numTickets !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="mt-3 text-center text-base text-gray-400">
                        Inversión Total: <strong className="text-yellow-400 text-lg">{formatCurrency(metricas.capitalTotal)}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => setData({ ...data, numTickets: Math.min(50, data.numTickets + 1) })}
                      className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-cyan-800 hover:from-cyan-700 hover:to-cyan-900 text-white rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-cyan-500/30"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-red-900/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/30">
                    <RotateCcw className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-white">Reinversión Automática</h3>
                      <button
                        onClick={() => setData({ ...data, reinvestmentEnabled: !data.reinvestmentEnabled })}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                          data.reinvestmentEnabled ? 'bg-red-600' : 'bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                            data.reinvestmentEnabled ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {data.reinvestmentEnabled
                        ? '✅ Las ganancias se reinvierten automáticamente en nuevos tickets'
                        : '❌ Las ganancias se retiran cada año sin reinvertir'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-950/50 to-purple-900/30 rounded-2xl p-6 border border-purple-700/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-4">Plan de Financiamiento del Ticket Inicial</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setData({ ...data, financingMonths: 0, capitalInvertido: ESCALONES[0].entryPrice, motosVendidasAnual: RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR })}
                        className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                          data.financingMonths === 0
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        <div className="text-lg">Contado</div>
                        <div className="text-xs mt-1 opacity-80">Rendimientos mes {RIDERMEX_CONFIG.FIRST_INCOME_CONTADO_MONTH}</div>
                      </button>
                      <button
                        onClick={() => setData({ ...data, financingMonths: 12, capitalInvertido: ESCALONES[0].entryPrice, motosVendidasAnual: RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR })}
                        className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                          data.financingMonths === 12
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        <div className="text-lg">Crédito (12 Meses)</div>
                        <div className="text-xs mt-1 opacity-80">Rendimientos mes {RIDERMEX_CONFIG.FIRST_INCOME_CREDITO_MONTH}</div>
                      </button>
                    </div>
                    <p className="text-gray-300 text-sm mt-3">
                      <strong className="text-purple-400">Contado:</strong> Pagas todo de inmediato, rendimientos desde el mes {RIDERMEX_CONFIG.FIRST_INCOME_CONTADO_MONTH}.<br/>
                      <strong className="text-purple-400">Crédito (12 Meses):</strong> Pagas en parcialidades durante 12 meses y 6 meses después del último pago empiezas a recibir utilidades (mes {RIDERMEX_CONFIG.FIRST_INCOME_CREDITO_MONTH}).
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-cyan-900/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/30">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-2">Años de Proyección</h3>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setData({ ...data, projectionYears: Math.max(1, data.projectionYears - 1) })}
                        className="w-10 h-10 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <div className="flex-1 text-center">
                        <span className="text-3xl font-bold text-cyan-400">{data.projectionYears}</span>
                        <span className="text-gray-400 ml-2">años</span>
                      </div>
                      <button
                        onClick={() => setData({ ...data, projectionYears: Math.min(30, data.projectionYears + 1) })}
                        className="w-10 h-10 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Control de Retiros Parciales */}
            {data.reinvestmentEnabled && (
              <div className="bg-gradient-to-br from-yellow-950/50 to-orange-900/30 rounded-2xl p-6 border border-yellow-700/30 backdrop-blur-sm">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-500/30">
                    <DollarSign className="w-6 h-6 text-black" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-yellow-400">Plan de Retiros Parciales</h3>
                      <button
                        onClick={() => setData({ ...data, partialCashOut: !data.partialCashOut })}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                          data.partialCashOut ? 'bg-yellow-500' : 'bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                            data.partialCashOut ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">
                      {data.partialCashOut
                        ? '✅ Configura retiros anuales mientras continúas reinvirtiendo el resto'
                        : 'Activa para retirar un porcentaje de ganancias cada año'}
                    </p>

                    {data.partialCashOut && (
                      <div className="space-y-3 mt-4">
                        <div className="flex items-center gap-3">
                          <label className="text-gray-300 text-sm font-medium w-32">Retiro Anual:</label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={data.cashOutPercentage}
                            onChange={(e) => {
                              const percentage = Number(e.target.value);
                              setData({
                                ...data,
                                cashOutPercentage: percentage,
                                yearlyCashOutPercentages: Array(30).fill(percentage)
                              });
                            }}
                            className="flex-1 h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer slider-thumb"
                            style={{
                              background: `linear-gradient(to right, #eab308 0%, #eab308 ${data.cashOutPercentage}%, #1f2937 ${data.cashOutPercentage}%, #1f2937 100%)`,
                            }}
                          />
                          <span className="text-yellow-400 font-bold w-16 text-right">{data.cashOutPercentage}%</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Se retirará el {data.cashOutPercentage}% de las ganancias anuales, reinvirtiendo el resto.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">Número de Inversionistas</h3>
                  <p className="text-gray-700 mb-2">
                    Fijo en <strong>{NUMERO_INVERSIONISTAS} inversionistas</strong> por tienda (modelo estándar de 30 tickets por sucursal).
                  </p>
                  <div className="text-3xl font-bold text-purple-600">
                    {NUMERO_INVERSIONISTAS} personas
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resultados Destacados */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-600 mb-6 flex items-center gap-3">
            <Zap className="w-8 h-8 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            Tus Resultados Al Primer Año
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="ROI Anual"
              value={`${metricas.roi.toFixed(2)}%`}
              subtitle="Retorno sobre inversión"
              icon={<Percent />}
              color="bg-gradient-to-br from-green-100 to-emerald-100"
              trend="up"
              highlight={true}
            />

            <MetricCard
              title="Ganancia Anual Estimada"
              value={formatCurrency(metricas.utilidadPorInversionista)}
              subtitle={`${formatCurrency(metricas.gananciasMensual)}/mes est.`}
              icon={<DollarSign />}
              color="bg-gradient-to-br from-blue-100 to-cyan-100"
            />

            <MetricCard
              title="ROI Mensual Proyectado"
              value={`${metricas.roiMensual.toFixed(2)}%`}
              subtitle="Rendimiento estimado por mes"
              icon={<Calendar />}
              color="bg-gradient-to-br from-purple-100 to-pink-100"
            />

            <MetricCard
              title="Ganancia Diaria Estimada"
              value={formatCurrency(metricas.gananciasDiaria)}
              subtitle="Ingreso pasivo diario est."
              icon={<Sparkles />}
              color="bg-gradient-to-br from-amber-100 to-orange-100"
            />
          </div>

          {/* Desglose Matemático */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl p-8 border border-red-800/30"
          >
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-600 mb-6 flex items-center gap-3">
              <BarChart3 className="w-7 h-7 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              Desglose Matemático Transparente
            </h3>

            <div className="space-y-6">
              {/* Paso 1 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/30">
                  <span className="text-white font-bold">1</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-red-400 mb-2">Ventas Totales Anuales Estimadas</h4>
                  <div className="bg-black/50 border border-red-900/30 rounded-xl p-4">
                    <p className="text-gray-300 mb-2">
                      {data.motosVendidasAnual.toLocaleString()} motos × {formatCurrency(data.utilidadPorMoto)} utilidad est.
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      Escenario proyectado: {data.scenario === 'conservative' ? 'Conservador' : data.scenario === 'moderate' ? 'Moderado' : 'Optimista'}
                    </p>
                    <div className="text-2xl font-bold text-red-400">
                      = {formatCurrency(metricas.utilidadTotalAnual)} (est.)
                    </div>
                  </div>
                </div>
              </div>

              <ChevronRight className="w-6 h-6 text-gray-600 mx-auto" />

              {/* Paso 2 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/30">
                  <span className="text-white font-bold">2</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-cyan-400 mb-2">División Entre Inversionistas</h4>
                  <div className="bg-black/50 border border-cyan-900/30 rounded-xl p-4">
                    <p className="text-gray-300 mb-2">
                      {formatCurrency(metricas.utilidadTotalAnual)} ÷ {NUMERO_INVERSIONISTAS} inversionistas
                    </p>
                    <div className="text-2xl font-bold text-cyan-400">
                      = {formatCurrency(metricas.utilidadPorInversionista)} por persona
                    </div>
                  </div>
                </div>
              </div>

              <ChevronRight className="w-6 h-6 text-gray-600 mx-auto" />

              {/* Paso 3 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-500/30">
                  <span className="text-black font-bold">3</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-yellow-400 mb-2">Tu Retorno de Inversión</h4>
                  <div className="bg-gradient-to-br from-yellow-950/30 to-orange-900/20 border border-yellow-700/30 rounded-xl p-4">
                    <p className="text-gray-300 mb-2">
                      {formatCurrency(metricas.utilidadPorInversionista)} ÷ {formatCurrency(data.capitalInvertido)} inversión
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      Escalón {data.escalon}: {ESCALONES.find(e => e.number === data.escalon)?.name} • ${data.capitalInvertido.toLocaleString()} MXN
                    </p>
                    <div className="text-3xl font-bold text-yellow-400">
                      = {metricas.roi.toFixed(2)}% ROI Anual
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Métricas Adicionales */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-600 mb-6 flex items-center gap-3">
            <PieChart className="w-8 h-8 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            Análisis Detallado
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 shadow-lg border border-cyan-800/30">
              <h4 className="font-bold text-cyan-400 mb-3 flex items-center gap-2">
                <Bike className="w-5 h-5 text-cyan-500" />
                Volumen de Ventas
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Por mes:</span>
                  <span className="font-bold text-white">{metricas.motosVendidasMensual.toFixed(0)} motos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Por día:</span>
                  <span className="font-bold text-white">{metricas.motosVendidasDiaria.toFixed(1)} motos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total año:</span>
                  <span className="font-bold text-cyan-400">{data.motosVendidasAnual} motos</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 shadow-lg border border-red-800/30">
              <h4 className="font-bold text-red-400 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-500" />
                Utilidad Estimada por Moto
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Utilidad neta est.:</span>
                  <span className="font-bold text-white">{formatCurrency(data.utilidadPorMoto)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Motos/año:</span>
                  <span className="font-bold text-white">{data.motosVendidasAnual.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Inversionistas:</span>
                  <span className="font-bold text-yellow-400">{NUMERO_INVERSIONISTAS}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 shadow-lg border border-yellow-700/30">
              <h4 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-yellow-500" />
                Tu Participación Proyectada
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center gap-4 pointer-events-auto">
                  <span className="text-gray-400">Capital base:</span>
                  <input
                    type="number"
                    value={data.capitalInvertido}
                    onChange={(e) => setData({ ...data, capitalInvertido: Math.max(0, parseInt(e.target.value) || 0) })}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    className="pointer-events-auto font-bold text-white bg-gray-800 border-2 border-yellow-600/50 rounded-lg px-3 py-2 w-32 text-right hover:border-yellow-400 focus:border-yellow-400 focus:outline-none transition-all cursor-text"
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Multiplicador est.:</span>
                  <span className="font-bold text-white">{metricas.multiplicadorCapital.toFixed(2)}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ganancia total est.:</span>
                  <span className="font-bold text-yellow-400">{formatCurrency(metricas.utilidadPorInversionista)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Proyección Multianual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 mb-12 border border-red-800/30"
        >
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-600 mb-6 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            Proyección Estimada a {data.projectionYears} Años
          </h2>

          <div className="mb-6 bg-gradient-to-br from-cyan-950/30 to-blue-900/20 rounded-2xl p-6 border border-cyan-700/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/30">
                <Info className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-cyan-400 mb-2">Conceptos Clave de la Proyección (Estimados)</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p><strong className="text-yellow-400">Plusvalía Estimada:</strong> Valor proyectado de tus tickets considerando 50% en año 1, luego 5% anual</p>
                  <p><strong className="text-white">Utilidad Anual Estimada:</strong> Ganancia operativa proyectada con market growth del 5% anual</p>
                  <p><strong className="text-green-400">Ganancia Retirable Est.:</strong> Dinero que podrías retirar (utilidad menos lo reinvertido)</p>
                  <p><strong className="text-red-400">Retorno Acumulado Est.:</strong> Suma proyectada de ganancias retirables</p>
                  <p><strong className="text-green-400">ROI (%) Proyectado:</strong> Porcentaje estimado del retorno sobre inversión inicial</p>
                  <p><strong className="text-cyan-400">Patrimonio Total Est.:</strong> Suma proyectada de plusvalía + ganancias acumuladas</p>
                  <p className="text-yellow-400 font-semibold mt-3">⚠️ Estas son proyecciones con fines ilustrativos. Los resultados reales pueden variar.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de Precios de Compra por Año */}
          {data.reinvestmentEnabled && proyeccionMultianual.filter(y => y.ticketsComprados > 0).length > 0 && (
            <div className="mb-8 bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-green-800/30">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/30">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">Precio de Compra de Tickets por Año (Estimado)</h3>
                  <p className="text-gray-300 text-sm">
                    Los precios aumentan según el escalón. Cada escalón tiene 30 tickets y aumenta $1,000 MXN.
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-green-800/50">
                      <th className="text-left py-2 px-3 text-gray-300 font-bold">Año</th>
                      <th className="text-right py-2 px-3 text-gray-300 font-bold">Tickets Comprados</th>
                      <th className="text-right py-2 px-3 text-gray-300 font-bold">Precio Promedio</th>
                      <th className="text-right py-2 px-3 text-gray-300 font-bold">Costo Total</th>
                      <th className="text-right py-2 px-3 text-gray-300 font-bold">Escalón</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proyeccionMultianual
                      .filter(y => y.ticketsComprados > 0)
                      .map((year) => {
                        // Usar el precio promedio amarrado (precio real del ticket al momento de apartarlo)
                        const precioPromedio = year.precioPromedioAmarrado || 0;
                        // El costo total es el precio amarrado completo (no lo que se ha pagado parcialmente)
                        const costoTotal = year.costoTotalPreciosAmarrados || 0;

                        // Calcular el escalón donde EMPEZÓ la compra (antes de comprar los nuevos tickets)
                        const ticketsAntesDeCompra = year.tickets - year.ticketsComprados;
                        const escalonInicial = Math.floor(ticketsAntesDeCompra / 30);
                        const escalonFinal = Math.floor((year.tickets - 1) / 30);

                        // Mostrar rango si compró tickets en múltiples escalones
                        const escalonDisplay = escalonInicial === escalonFinal
                          ? `Escalón ${escalonInicial}`
                          : `Escalones ${escalonInicial}-${escalonFinal}`;

                        return (
                          <tr key={year.year} className="border-b border-green-800/30 hover:bg-gray-800/50 transition-colors">
                            <td className="py-2 px-3 font-semibold text-green-400">Año {year.year}</td>
                            <td className="text-right py-2 px-3 text-white">{year.ticketsComprados}</td>
                            <td className="text-right py-2 px-3 font-semibold text-white">{formatCurrency(precioPromedio)}</td>
                            <td className="text-right py-2 px-3 font-semibold text-green-400">{formatCurrency(costoTotal)}</td>
                            <td className="text-right py-2 px-3 text-gray-300">{escalonDisplay}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mb-8 bg-gradient-to-br from-purple-950/50 to-violet-950/50 rounded-2xl p-6 border-2 border-purple-800/30">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Tickets Iniciales</div>
                <div className="text-3xl font-bold text-cyan-400">{data.numTickets}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Tickets por Reinversión</div>
                <div className="text-3xl font-bold text-purple-400">
                  +{proyeccionMultianual[proyeccionMultianual.length - 1]?.ticketsDeReinversion || 0}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Tickets Totales</div>
                <div className="text-3xl font-bold text-purple-300">
                  {proyeccionMultianual[proyeccionMultianual.length - 1]?.tickets || data.numTickets}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Plusvalía Tickets</div>
                <div className="text-2xl font-bold text-amber-400">
                  {formatCurrency(proyeccionMultianual[proyeccionMultianual.length - 1]?.plusvaliaTotalTickets || metricas.capitalTotal)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Ganancias Retirables</div>
                <div className="text-2xl font-bold text-green-400">
                  {formatCurrency(proyeccionMultianual[proyeccionMultianual.length - 1]?.gananciasRetiradasAcumuladas || 0)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Patrimonio Total</div>
                <div className="text-3xl font-bold text-cyan-400">
                  {formatCurrency(proyeccionMultianual[proyeccionMultianual.length - 1]?.patrimonioTotal || 0)}
                </div>
              </div>
            </div>
          </div>

          {/* ROI Card - Destacada */}
          <div className={`mb-6 rounded-2xl p-6 border-2 ${
            roiData.recuperoCompleto
              ? 'bg-gradient-to-br from-green-950/50 to-emerald-950/50 border-green-800/30'
              : 'bg-gradient-to-br from-orange-950/50 to-yellow-950/50 border-orange-800/30'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                roiData.recuperoCompleto ? 'bg-green-600 shadow-green-500/30' : 'bg-orange-600 shadow-orange-500/30'
              }`}>
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white mb-3 text-xl">
                  {roiData.recuperoCompleto ? '✓ Retorno de Inversión Alcanzado' : '⏳ Proyección de Retorno'}
                </h3>
                {roiData.recuperoCompleto ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-4 shadow-sm">
                      <div className="text-sm text-gray-400 mb-1">Recuperación en Año</div>
                      <div className="text-4xl font-bold text-green-400">{roiData.yearRecuperacion}</div>
                      <div className="text-xs text-gray-500 mt-1">de {data.projectionYears} años proyectados</div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-4 shadow-sm">
                      <div className="text-sm text-gray-400 mb-1">ROI al Año {data.projectionYears}</div>
                      <div className="text-3xl font-bold text-cyan-400">{roiData.roiFinal.toFixed(1)}%</div>
                      <div className="text-xs text-gray-500 mt-1">Retorno sobre inversión inicial</div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-4 shadow-sm">
                      <div className="text-sm text-gray-400 mb-1">Ganancias Totales</div>
                      <div className="text-2xl font-bold text-green-400">{formatCurrency(roiData.retornoFinal)}</div>
                      <div className="text-xs text-gray-500 mt-1">vs {formatCurrency(metricas.capitalTotal)} invertidos</div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-4 shadow-sm">
                    <p className="text-gray-300 mb-2">
                      En {data.projectionYears} años proyectados, habrás acumulado{' '}
                      <strong className="text-orange-400">{formatCurrency(roiData.retornoFinal)}</strong>{' '}
                      en ganancias retirables, lo que representa un{' '}
                      <strong className="text-orange-400">{roiData.roiFinal.toFixed(1)}%</strong> de tu inversión inicial.
                    </p>
                    <p className="text-sm text-gray-400">
                      💡 Extiende el período de proyección o activa la reinversión para ver cuándo recuperas completamente tu inversión inicial de {formatCurrency(metricas.capitalTotal)}.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {data.reinvestmentEnabled && proyeccionMultianual[proyeccionMultianual.length - 1]?.ticketsDeReinversion === 0 && (
            <div className="mb-6 bg-gradient-to-br from-blue-950/50 to-cyan-950/50 rounded-2xl p-6 border-2 border-blue-800/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-2">Acumulando para Reinversión</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Con {data.numTickets} ticket{data.numTickets > 1 ? 's' : ''} inicial{data.numTickets > 1 ? 'es' : ''}, las ganancias se están <strong>acumulando año tras año</strong>. En el año {proyeccionMultianual.length}, has acumulado {formatCurrency(proyeccionMultianual[proyeccionMultianual.length - 1]?.gananciasRetiradasAcumuladas || 0)} en el fondo.
                  </p>
                  <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg p-4 mb-3">
                    <p className="text-sm font-semibold text-white mb-2">Proyección:</p>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Necesitas acumular {formatCurrency(metricas.capitalPorInversionista)} para comprar el primer ticket de reinversión</li>
                      <li>• Precio ticket actual: {formatCurrency(metricas.capitalPorInversionista)}</li>
                      <li>• Ganancia anual actual: ~{formatCurrency(metricas.utilidadPorTicket * data.numTickets)}</li>
                      <li>• Años estimados para primer ticket: ~{Math.ceil(metricas.capitalPorInversionista / (metricas.utilidadPorTicket * data.numTickets))} años</li>
                    </ul>
                  </div>
                  <p className="text-xs text-gray-400">
                    <strong>La reinversión está funcionando correctamente</strong> - Las ganancias se acumulan hasta alcanzar el precio de un ticket nuevo
                  </p>
                </div>
              </div>
            </div>
          )}

          {data.reinvestmentEnabled && proyeccionMultianual[proyeccionMultianual.length - 1]?.ticketsDeReinversion > 0 && (
            <>
              <div className="mb-6 bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-green-800/30">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Desglose de Capital Invertido
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-400 mb-2">Capital Inicial</div>
                    <div className="text-2xl font-bold text-cyan-400">
                      {formatCurrency(metricas.capitalTotal)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {data.numTickets} tickets iniciales
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-400 mb-2">Capital de Reinversión</div>
                    <div className="text-2xl font-bold text-purple-400">
                      {formatCurrency(proyeccionMultianual[proyeccionMultianual.length - 1]?.capitalDeReinversion || 0)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {proyeccionMultianual[proyeccionMultianual.length - 1]?.ticketsDeReinversion || 0} tickets adquiridos
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-green-600 rounded-xl p-4 shadow-sm shadow-green-500/20">
                    <div className="text-sm text-gray-400 mb-2">Capital Total Acumulado</div>
                    <div className="text-2xl font-bold text-green-400">
                      {formatCurrency(proyeccionMultianual[proyeccionMultianual.length - 1]?.capitalTotalAcumulado || metricas.capitalTotal)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {proyeccionMultianual[proyeccionMultianual.length - 1]?.tickets || data.numTickets} tickets totales
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6 bg-gradient-to-br from-blue-950/50 to-cyan-950/50 rounded-2xl p-6 border-2 border-blue-800/30">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  Crecimiento de Tickets por Reinversión
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <div className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-lg">
                    {data.numTickets} tickets
                  </div>
                  <span className="text-2xl">→</span>
                  {proyeccionMultianual.filter(y => y.ticketsComprados > 0).slice(0, 5).map((year, idx) => (
                    <React.Fragment key={year.year}>
                      <div className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-semibold border border-emerald-300">
                        +{year.ticketsComprados} año {year.year}
                      </div>
                      {idx < 4 && <span className="text-xl">→</span>}
                    </React.Fragment>
                  ))}
                  {proyeccionMultianual.filter(y => y.ticketsComprados > 0).length > 5 && (
                    <span className="text-gray-500">... +{proyeccionMultianual.filter(y => y.ticketsComprados > 0).length - 5} años más</span>
                  )}
                  <span className="text-2xl font-bold mx-2">=</span>
                  <div className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-xl">
                    {proyeccionMultianual[proyeccionMultianual.length - 1]?.tickets} tickets
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  ¡Multiplicaste tus tickets {(proyeccionMultianual[proyeccionMultianual.length - 1]?.tickets / data.numTickets).toFixed(1)}x en {data.projectionYears} años gracias a la reinversión!
                </p>
              </div>
            </>
          )}

          {/* Gráfico de Proyección */}
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 mb-6 border border-red-900/30">
            <h3 className="font-bold text-gray-900 mb-4 text-center">
              {data.reinvestmentEnabled ? 'Crecimiento con Reinversión' : 'Crecimiento de Patrimonio'}
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={proyeccionMultianual}>
                <defs>
                  <linearGradient id="colorPlusvalia" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorGanancias" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPatrimonio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  label={{ value: 'Años', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  label={{ value: 'Valor ($MXN)', angle: -90, position: 'insideLeft' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `Año ${label}`}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="plusvaliaTotalTickets"
                  stroke="#f59e0b"
                  fillOpacity={1}
                  fill="url(#colorPlusvalia)"
                  name="Plusvalía Tickets"
                />
                <Area
                  type="monotone"
                  dataKey="gananciasRetiradasAcumuladas"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorGanancias)"
                  name="Ganancias Acumuladas"
                />
                <Area
                  type="monotone"
                  dataKey="patrimonioTotal"
                  stroke="#3b82f6"
                  fillOpacity={0.3}
                  fill="url(#colorPatrimonio)"
                  name="Patrimonio Total"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Tabla de Proyección */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-900/50 border-b border-red-800/30">
                  <th className="p-3 text-left font-bold text-white">Año</th>
                  <th className="p-3 text-right font-bold text-orange-400">Precio del Ticket</th>
                  <th className="p-3 text-center font-bold text-white">Tickets Totales</th>
                  {data.reinvestmentEnabled && (
                    <>
                      <th className="p-3 text-center font-bold text-white">Tickets Nuevos</th>
                      <th className="p-3 text-right font-bold text-white">Precio Promedio</th>
                      <th className="p-3 text-right font-bold text-white">Costo Total</th>
                      <th className="p-3 text-right font-bold text-white">Precio de Venta</th>
                    </>
                  )}
                  <th className="p-3 text-right font-bold text-white">Utilidad Anual</th>
                  {data.partialCashOut && data.reinvestmentEnabled && (
                    <th className="p-3 text-right font-bold text-yellow-400">Retiro del Año</th>
                  )}
                  <th className="p-3 text-right font-bold text-white">Plusvalía Tickets</th>
                  {data.reinvestmentEnabled && (
                    <th className="p-3 text-right font-bold text-white">Fondo Acumulado</th>
                  )}
                  {!data.reinvestmentEnabled && (
                    <th className="p-3 text-right font-bold text-white">Retorno Acumulado</th>
                  )}
                  <th className="p-3 text-center font-bold text-white">ROI %</th>
                  <th className="p-3 text-right font-bold text-white">Patrimonio Total</th>
                </tr>
              </thead>
              <tbody>
                {proyeccionMultianual.map((year, index) => (
                  <tr
                    key={year.year}
                    className={index % 2 === 0 ? 'bg-gray-900/30' : 'bg-black/50'}
                  >
                    <td className="p-3 font-semibold text-white">{year.year}</td>
                    <td className="p-3 text-right text-orange-400 font-bold">
                      {formatCurrency(year.precioTicketActual)}
                    </td>
                    <td className="p-3 text-center text-red-400 font-bold">{year.tickets}</td>
                    {data.reinvestmentEnabled && (
                      <>
                        <td className="p-3 text-center text-green-400 font-semibold">
                          {year.ticketsComprados > 0 ? `+${year.ticketsComprados}` : '-'}
                        </td>
                        <td className="p-3 text-right text-cyan-400 font-semibold">
                          {year.ticketsComprados > 0 ? formatCurrency(year.precioPromedioAmarrado) : '-'}
                        </td>
                        <td className="p-3 text-right text-green-400 font-bold">
                          {year.ticketsComprados > 0 ? formatCurrency(year.costoTotalPreciosAmarrados) : '-'}
                        </td>
                        <td className="p-3 text-right text-purple-400 font-bold">
                          {formatCurrency(year.precioVentaPromedioTicket)}
                        </td>
                      </>
                    )}
                    <td className="p-3 text-right font-semibold text-gray-300">
                      {formatCurrency(year.gananciaAnual)}
                    </td>
                    {data.partialCashOut && data.reinvestmentEnabled && (
                      <td className="p-3 text-right text-yellow-400 font-bold">
                        {year.montoRetirado > 0 ? formatCurrency(year.montoRetirado) : '-'}
                      </td>
                    )}
                    <td className="p-3 text-right text-yellow-500 font-semibold">
                      {formatCurrency(year.plusvaliaTotalTickets)}
                    </td>
                    {data.reinvestmentEnabled && (
                      <td className="p-3 text-right text-cyan-400 font-semibold">
                        {formatCurrency(year.gananciasRetiradasAcumuladas)}
                      </td>
                    )}
                    {!data.reinvestmentEnabled && (
                      <td className="p-3 text-right text-green-400 font-semibold">
                        {formatCurrency(year.gananciasRetiradasAcumuladas)}
                      </td>
                    )}
                    <td className={`p-3 text-center font-bold ${
                      year.recuperoInversion ? 'text-green-400 text-lg' : 'text-orange-400'
                    }`}>
                      {year.recuperoInversion && '✓ '}
                      {year.roiPorcentaje.toFixed(1)}%
                    </td>
                    <td className="p-3 text-right text-red-400 font-bold">
                      {formatCurrency(year.patrimonioTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gradient-to-r from-red-900/30 to-red-800/20 border-t border-red-700/30">
                <tr>
                  <td colSpan={data.reinvestmentEnabled ? 3 : 2} className="p-3 text-right font-bold text-gray-900">
                    Año Final:
                  </td>
                  <td className="p-3 text-right font-bold text-gray-900">
                    {formatCurrency(proyeccionMultianual[proyeccionMultianual.length - 1]?.gananciaAnual || 0)}
                  </td>
                  <td className="p-3 text-right font-bold text-amber-600">
                    {formatCurrency(proyeccionMultianual[proyeccionMultianual.length - 1]?.plusvaliaTotalTickets || 0)}
                  </td>
                  <td className="p-3 text-right font-bold text-green-600">
                    {formatCurrency(proyeccionMultianual[proyeccionMultianual.length - 1]?.gananciasRetiradasAcumuladas || 0)}
                  </td>
                  <td className="p-3 text-right font-bold text-gray-900">
                    {formatCurrency(proyeccionMultianual[proyeccionMultianual.length - 1]?.retornoTotal || 0)}
                  </td>
                  <td className={`p-3 text-center font-bold text-lg ${
                    roiData.recuperoCompleto ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {roiData.recuperoCompleto && '✓ '}
                    {roiData.roiFinal.toFixed(1)}%
                  </td>
                  <td className="p-3 text-right font-bold text-blue-600 text-lg">
                    {formatCurrency(proyeccionMultianual[proyeccionMultianual.length - 1]?.patrimonioTotal || 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </motion.div>

        <UnitEconomicsDownloadButtons
          data={{
            ...data,
            metricas,
            proyeccionMultianual,
            roiData,
          }}
        />

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 text-center text-white relative overflow-hidden"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="absolute inset-0 bg-white"
          />

          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4">
              Matemática Transparente, Resultados Reales
            </h2>
            <p className="text-green-100 text-xl mb-8 max-w-3xl mx-auto">
              Este es el poder de un modelo de negocio simple pero efectivo: comprar bien, vender mejor,
              y compartir las ganancias equitativamente.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-green-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Solicitar Información
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-green-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Ver Documentación Legal
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Sliders: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

const Receipt: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
  </svg>
);

const Tag: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

export default UnitEconomicsCalculator;
