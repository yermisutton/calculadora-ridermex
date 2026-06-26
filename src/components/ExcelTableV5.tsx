import React, { useState, useEffect } from 'react';
import { useCalculator } from '../context/CalculatorContext';
import { formatCurrency, convertFromMXN } from '../utils/formatters';
import AnimatedNumberDisplay from './ui/AnimatedNumberDisplay';
import { getLanguageContent, getLanguageFromCurrency } from '../data/languages';
import { Download, Eye, EyeOff, Settings, ChevronDown, ChevronUp, BarChart3, DollarSign, Calendar, Target, TrendingUp, Activity, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { RIDERMEX_CONFIG } from '../data/ridermexConfig';

interface ExcelTableV5Props {
  initialCertificates?: number;
  years?: number;
  hideAdditionalOptions?: boolean;
}

const ExcelTableV5: React.FC<ExcelTableV5Props> = ({
  initialCertificates,
  years,
  hideAdditionalOptions = false
}) => {
  const { investment, results, updateInvestment } = useCalculator();

  // Trigger calculation on mount if results not available
  React.useEffect(() => {
    if (investment && !results) {
      updateInvestment({});
    }
  }, []);

  // Guard clause: ensure investment and results are defined
  if (!investment || !results) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-green/30 border-t-neon-green rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-300 font-medium">Cargando datos de inversión...</p>
        </div>
      </div>
    );
  }

  // Get current language content
  const currentLanguage = investment.language || getLanguageFromCurrency(investment.currencyFormat);
  const content = getLanguageContent(currentLanguage);
  
  const [showAllColumns, setShowAllColumns] = useState(false);
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState({
    year: true,
    date: true,
    certificatePrice: true,
    totalCertificatesValue: true,
    certificates: true,
    totalUtility: true,
    reinvestmentFund: true,
    availableForReinvestment: true,
    events: true,
    paymentAmount: false,
    payments: false,
    totalCertificates: false,
    certificatesFromReinvestment: false,
    citrusPatrimony: false,
    citrusIncome: false,
    yearlyCashOutAmount: false,
    cumulativeCashOutAmount: false,
    yearlyReinvestmentContribution: false,
    cumulativeReinvestmentContribution: false,
    cumulativeTotalUtility: false,
    paymentBoostActive: false,
    paymentBoostAmount: false
  });

  // Use results from context to ensure consistency with summary
  // This prevents discrepancies between table and summary calculations
  const certificateEvolution = results?.certificateEvolution || [];
  const effectiveInitialCertificates = investment.initialCertificates;
  const effectiveYears = investment.years;

  // Function to convert MXN values to display currency
  const convertToDisplayCurrency = (mxnValue: number): number => {
    return convertFromMXN(mxnValue, investment.currencyFormat, investment.exchangeRate, investment.exchangeRateEUR);
  };

  // Dynamic growth factor (inflation + motorcycle price growth)
  const inflation = investment.inflationRate ?? 3.5;
  const increment = investment.lemonPriceIncrease ?? 1.5;
  const increaseLemonPrice = investment.increaseLemonPrice !== false;
  const growthRate = (increaseLemonPrice ? increment : 0) + inflation;
  const growthFactor = 1 + growthRate / 100;

  // Calculate certificate yield with discount
  const calculateCertificateYield = (reservedYear: number, currentYear: number, maturationYear?: number) => {
    const scenario = investment.ridermexScenario || 'moderate';
    const scenarioConfig = RIDERMEX_CONFIG.SCENARIOS[scenario];
    const baseYield = scenarioConfig.annualReturnPerTicket;

    // Apply 2% discount per year of purchase
    const yearsFromFirstPurchase = reservedYear - 1;
    const discountPercentage = yearsFromFirstPurchase * 2;
    const yieldMultiplier = Math.max(0, 1 - (discountPercentage / 100));
    const discountedYield = baseYield * yieldMultiplier;

    // Apply annual growth if producing
    let finalYield = discountedYield;
    if (maturationYear && currentYear >= maturationYear) {
      const yearsOfGrowth = currentYear - maturationYear;
      if (yearsOfGrowth > 0) {
        finalYield = discountedYield * Math.pow(growthFactor, yearsOfGrowth);
      }
    }

    return {
      baseYield,
      discountPercentage,
      discountedYield,
      finalYield,
      yieldMultiplier
    };
  };

  const toggleColumn = (column: keyof typeof selectedColumns) => {
    setSelectedColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const toggleAllColumns = () => {
    const newValue = !showAllColumns;
    setShowAllColumns(newValue);
    
    if (newValue) {
      // Show all columns
      setSelectedColumns(Object.keys(selectedColumns).reduce((acc, key) => ({
        ...acc,
        [key]: true
      }), {} as typeof selectedColumns));
    } else {
      // Show only essential columns
      setSelectedColumns({
        year: true,
        date: true,
        certificatePrice: true,
        totalCertificatesValue: true,
        certificates: true,
        totalUtility: true,
        reinvestmentFund: true,
        availableForReinvestment: true,
        events: true,
        paymentAmount: false,
        payments: false,
        totalCertificates: false,
        certificatesFromReinvestment: false,
        citrusPatrimony: false,
        citrusIncome: false,
        yearlyCashOutAmount: false,
        cumulativeCashOutAmount: false,
        yearlyReinvestmentContribution: false,
        cumulativeReinvestmentContribution: false,
        cumulativeTotalUtility: false,
        paymentBoostActive: false,
        paymentBoostAmount: false
      });
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <img
              src="/rider_inversiones.png"
              alt="Ridermex Inversiones"
              className="h-12 w-auto drop-shadow-md"
            />
          </div>
          <h2 className="text-2xl font-semibold text-green-800 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            {content.excel.title}
          </h2>
          <p className="text-neutral-300 mt-1">
            {content.excel.subtitle
              .replace('{certificates}', effectiveInitialCertificates.toString())
              .replace('{years}', effectiveYears.toString())}
          </p>
        </div>
      </div>

      {/* Configuration Panel */}
      {(
        <div className="bg-dark-card rounded-lg shadow-sm border border-dark-border">
          <button
            onClick={() => setIsConfigExpanded(!isConfigExpanded)}
            className="w-full flex items-center justify-between p-4 bg-dark-surface rounded-t-lg hover:bg-dark-surface transition-colors"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-green-600" />
              <span className="font-medium text-neutral-200">{content.excel.configTitle}</span>
            </div>
            {isConfigExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {isConfigExpanded && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-neutral-200">{content.excel.showAllColumns}</span>
                <button
                  onClick={toggleAllColumns}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    showAllColumns ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-dark-card transition-transform ${
                      showAllColumns ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries({
                  year: content.excel.columns.year,
                  date: content.excel.columns.date,
                  certificatePrice: content.excel.columns.certificatePrice,
                  totalCertificatesValue: content.excel.columns.totalCertificatesValue,
                  certificates: content.excel.columns.certificates,
                  totalUtility: content.excel.columns.totalUtility,
                  reinvestmentFund: content.excel.columns.reinvestmentFund,
                  availableForReinvestment: content.excel.columns.availableForReinvestment,
                  events: content.excel.columns.events,
                  paymentAmount: content.excel.columns.paymentAmount,
                  payments: content.excel.columns.payments,
                  totalCertificates: content.excel.columns.totalCertificates,
                  certificatesFromReinvestment: content.excel.columns.certificatesFromReinvestment,
                  citrusPatrimony: content.excel.columns.citrusPatrimony,
                  citrusIncome: content.excel.columns.citrusIncome,
                  yearlyCashOutAmount: content.excel.columns.yearlyCashOutAmount,
                  cumulativeCashOutAmount: content.excel.columns.cumulativeCashOutAmount,
                  yearlyReinvestmentContribution: content.excel.columns.yearlyReinvestmentContribution,
                  cumulativeReinvestmentContribution: content.excel.columns.cumulativeReinvestmentContribution,
                  cumulativeTotalUtility: content.excel.columns.cumulativeTotalUtility,
                  paymentBoostActive: content.excel.columns.paymentBoostActive,
                  paymentBoostAmount: content.excel.columns.paymentBoostAmount
                }).map(([key, label]) => (
                  <label key={key} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedColumns[key as keyof typeof selectedColumns]}
                      onChange={() => toggleColumn(key as keyof typeof selectedColumns)}
                      className="rounded border-dark-border text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-neutral-200">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/20 border border-neon-green/30 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-green-600" />
            <h3 className="font-medium text-green-800">Certificados Iniciales</h3>
          </div>
          <p className="text-2xl font-bold text-green-700 relative overflow-hidden">
            <AnimatedNumberDisplay
              value={effectiveInitialCertificates}
              currencyFormat="MXN"
              duration={1.2}
              staggerDelay={0.08}
              isCurrency={false}
            />
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border border-blue-400/30 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-blue-800">Certificados Finales Estimados</h3>
          </div>
          <p className="text-2xl font-bold text-blue-700 relative overflow-hidden">
            <AnimatedNumberDisplay
              value={certificateEvolution && certificateEvolution.length > 0 ? certificateEvolution[certificateEvolution.length - 1]?.totalCertificates || effectiveInitialCertificates : effectiveInitialCertificates}
              currencyFormat="MXN"
              duration={1.2}
              staggerDelay={0.08}
              isCurrency={false}
            />
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-400/30 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <h3 className="font-medium text-purple-800">Por Reinversión</h3>
          </div>
          <p className="text-2xl font-bold text-purple-700 relative overflow-hidden">
            +<AnimatedNumberDisplay
              value={certificateEvolution && certificateEvolution.length > 0 ? certificateEvolution[certificateEvolution.length - 1]?.certificatesFromReinvestment || 0 : 0}
              currencyFormat="MXN"
              duration={1.2}
              staggerDelay={0.08}
              isCurrency={false}
            />
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-900/20 to-orange-800/20 border border-orange-400/30 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-orange-600" />
            <h3 className="font-medium text-orange-800">Utilidad Final (Año {investment.years})</h3>
          </div>
          <p className="text-2xl font-bold text-orange-700 relative overflow-hidden">
            <AnimatedNumberDisplay
              value={convertToDisplayCurrency(certificateEvolution && certificateEvolution.length > 0 ? certificateEvolution[certificateEvolution.length - 1]?.totalUtility || 0 : 0)}
              currencyFormat={investment.currencyFormat}
              duration={1.4}
              staggerDelay={0.1}
            />
          </p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-dark-card rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-600 sticky top-0 z-10">
              <tr>
                {selectedColumns.year && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {content.excel.columns.year}
                  </th>
                )}
                {selectedColumns.date && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {content.excel.columns.date}
                  </th>
                )}
                {selectedColumns.certificatePrice && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {content.excel.columns.certificatePrice}
                  </th>
                )}
                {selectedColumns.totalCertificatesValue && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {content.excel.columns.totalCertificatesValue}
                  </th>
                )}
                {selectedColumns.certificates && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {content.excel.columns.certificates}
                  </th>
                )}
                {selectedColumns.totalUtility && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {content.excel.columns.totalUtility}
                  </th>
                )}
                {selectedColumns.reinvestmentFund && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {content.excel.columns.reinvestmentFund}
                  </th>
                )}
                {selectedColumns.availableForReinvestment && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {content.excel.columns.availableForReinvestment}
                  </th>
                )}
                {selectedColumns.events && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {content.excel.columns.events}
                  </th>
                )}
                {selectedColumns.paymentAmount && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {content.excel.columns.paymentAmount}
                  </th>
                )}
                {selectedColumns.payments && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {content.excel.columns.payments}
                  </th>
                )}
                {selectedColumns.totalCertificates && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {content.excel.columns.totalCertificates}
                  </th>
                )}
                {selectedColumns.certificatesFromReinvestment && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {content.excel.columns.certificatesFromReinvestment}
                  </th>
                )}
                {selectedColumns.citrusPatrimony && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {content.excel.columns.citrusPatrimony}
                  </th>
                )}
                {selectedColumns.citrusIncome && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {content.excel.columns.citrusIncome}
                  </th>
                )}
                {selectedColumns.yearlyCashOutAmount && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {content.excel.columns.yearlyCashOutAmount}
                  </th>
                )}
                {selectedColumns.cumulativeCashOutAmount && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {content.excel.columns.cumulativeCashOutAmount}
                  </th>
                )}
                {selectedColumns.yearlyReinvestmentContribution && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {content.excel.columns.yearlyReinvestmentContribution}
                  </th>
                )}
                {selectedColumns.cumulativeReinvestmentContribution && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {content.excel.columns.cumulativeReinvestmentContribution}
                  </th>
                )}
                {selectedColumns.cumulativeTotalUtility && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {content.excel.columns.cumulativeTotalUtility}
                  </th>
                )}
                {selectedColumns.paymentBoostActive && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {content.excel.columns.paymentBoostActive}
                  </th>
                )}
                {selectedColumns.paymentBoostAmount && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {content.excel.columns.paymentBoostAmount}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-dark-card divide-y divide-gray-200">
              {certificateEvolution.map((row, index) => (
                <tr 
                  key={index}
                  className={`${row.newCertificateIds.length > 0 ? 'bg-green-50' : index % 2 === 0 ? 'bg-dark-card' : 'bg-dark-surface'} hover:bg-green-25 transition-colors`}
                >
                  {selectedColumns.year && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-neutral-100">
                      {row.year}
                    </td>
                  )}
                  {selectedColumns.date && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {row.date}
                    </td>
                  )}
                  {selectedColumns.certificatePrice && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-100">
                      {formatCurrency(convertToDisplayCurrency(row.certificatePrice), investment.currencyFormat)}
                    </td>
                  )}
                  {selectedColumns.totalCertificatesValue && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-green-700">
                      {formatCurrency(
                        convertToDisplayCurrency(
                          row.certificatePrice * row.certificates.filter(cert => cert.status === 'producing').length
                        ),
                        investment.currencyFormat
                      )}
                    </td>
                  )}
                  {selectedColumns.certificates && (
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-wrap gap-1 min-w-[200px]">
                        {row.certificates
                          .sort((a, b) => a.id - b.id)
                          .map(cert => {
                            const yieldInfo = calculateCertificateYield(
                              cert.reservedYear,
                              row.year,
                              cert.maturationYear
                            );

                            return (
                              <div
                                key={cert.id}
                                className="relative group"
                              >
                                {/* Certificate Badge */}
                                <div className={`inline-flex items-center justify-center w-8 h-8 text-xs font-bold rounded-lg shadow-sm border-2 transition-all duration-300 group-hover:scale-110 ${
                                  cert.status === 'reserved' ? 'bg-gradient-to-br from-cyan-400 to-cyan-600 text-white border-cyan-300' :
                                  cert.status === 'waiting' ? 'bg-gradient-to-br from-gray-400 to-gray-600 text-white border-dark-border' :
                                  cert.status === 'growing' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white border-yellow-300' :
                                  'bg-gradient-to-br from-green-400 to-green-600 text-white border-green-300'
                                }`}>
                                  {cert.id}
                                </div>

                                {/* Progress Bar for Reserved Certificates */}
                                {cert.status === 'reserved' && cert.initialPrice && (
                                  <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full transition-all duration-500"
                                      style={{
                                        width: `${Math.max(0, Math.min(100, ((cert.initialPrice - cert.remainingPayment) / cert.initialPrice) * 100))}%`
                                      }}
                                    ></div>
                                  </div>
                                )}

                                {/* Status Indicator */}
                                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                                  cert.status === 'reserved' ? 'bg-cyan-500' :
                                  cert.status === 'waiting' ? 'bg-dark-surface0' :
                                  cert.status === 'growing' ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`}></div>

                                {/* Enhanced Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 w-72">
                                  <div className="bg-gray-900 text-white rounded-lg shadow-2xl p-4 text-xs">
                                    <div className="font-bold text-sm mb-3 border-b border-gray-700 pb-2">
                                      Certificado #{cert.id}
                                    </div>

                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Año de Compra:</span>
                                        <span className="font-semibold text-blue-300">Año {cert.reservedYear}</span>
                                      </div>

                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Estado:</span>
                                        <span className={`font-semibold ${
                                          cert.status === 'reserved' ? 'text-cyan-300' :
                                          cert.status === 'waiting' ? 'text-gray-300' :
                                          cert.status === 'growing' ? 'text-yellow-300' :
                                          'text-green-300'
                                        }`}>
                                          {cert.status === 'reserved' ? 'En Pago' :
                                           cert.status === 'waiting' ? 'En Maduración' :
                                           cert.status === 'growing' ? 'Iniciando' :
                                           'Produciendo'}
                                        </span>
                                      </div>

                                      {cert.remainingPayment > 0 && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-400">Saldo Pendiente:</span>
                                          <span className="font-semibold text-orange-300">
                                            {formatCurrency(convertToDisplayCurrency(cert.remainingPayment), investment.currencyFormat)}
                                          </span>
                                        </div>
                                      )}

                                      <div className="border-t border-gray-700 pt-2 mt-2">
                                        <div className="font-semibold text-yellow-300 mb-2">Rendimiento Anual:</div>

                                        <div className="flex justify-between">
                                          <span className="text-gray-400">Base (100%):</span>
                                          <span className="font-semibold">
                                            {formatCurrency(convertToDisplayCurrency(yieldInfo.baseYield), investment.currencyFormat)}
                                          </span>
                                        </div>

                                        {yieldInfo.discountPercentage > 0 && (
                                          <>
                                            <div className="flex justify-between text-orange-300">
                                              <span>Descuento ({yieldInfo.discountPercentage}%):</span>
                                              <span className="font-semibold">
                                                -{formatCurrency(convertToDisplayCurrency(yieldInfo.baseYield - yieldInfo.discountedYield), investment.currencyFormat)}
                                              </span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-gray-400">Rendimiento ({Math.round(yieldInfo.yieldMultiplier * 100)}%):</span>
                                              <span className="font-semibold text-blue-300">
                                                {formatCurrency(convertToDisplayCurrency(yieldInfo.discountedYield), investment.currencyFormat)}
                                              </span>
                                            </div>
                                          </>
                                        )}

                                        {cert.maturationYear && row.year >= cert.maturationYear && yieldInfo.finalYield !== yieldInfo.discountedYield && (
                                          <div className="flex justify-between text-green-300 border-t border-gray-700 pt-1 mt-1">
                                            <span>Con Crecimiento {growthRate}%:</span>
                                            <span className="font-bold">
                                              {formatCurrency(convertToDisplayCurrency(yieldInfo.finalYield), investment.currencyFormat)}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Tooltip Arrow */}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </td>
                  )}
                  {selectedColumns.totalUtility && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-100">
                      {formatCurrency(convertToDisplayCurrency(row.totalUtility), investment.currencyFormat)}
                    </td>
                  )}
                  {selectedColumns.reinvestmentFund && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-100">
                      {formatCurrency(convertToDisplayCurrency(row.reinvestmentFund), investment.currencyFormat)}
                    </td>
                  )}
                  {selectedColumns.availableForReinvestment && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-100">
                      {formatCurrency(convertToDisplayCurrency(row.availableForReinvestment), investment.currencyFormat)}
                    </td>
                  )}
                  {selectedColumns.events && (
                    <td className="px-4 py-3 text-sm">
                      <div className="space-y-1">
                        {row.newCertificateIds.map(id => (
                          <div key={`new-${id}`} className="text-green-600 font-medium text-xs">
                            ¡Certificado {id} liquidado completamente!
                          </div>
                        ))}
                        {row.reservedCertificateIds.map(id => (
                          <div key={`reserved-${id}`} className="text-teal-600 font-medium text-xs">
                            Apartado certificado {id}
                          </div>
                        ))}
                        {row.payments.length > 0 && (
                          <div className="text-gray-500 text-xs">
                            Pagos realizados: {row.payments.length}
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                  {selectedColumns.paymentAmount && (
                    <td className="px-4 py-3 text-sm">
                      <div className="space-y-1">
                        {row.payments.length > 0 && (
                          <>
                            <div className="text-xs font-medium text-green-600">
                              Subtotal: {formatCurrency(convertToDisplayCurrency(row.payments.reduce((sum, p) => sum + p.amount, 0)), investment.currencyFormat)}
                            </div>
                            <div className="text-xs text-neutral-300">
                              ({row.payments.length} pagos)
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                  {selectedColumns.payments && (
                    <td className="px-4 py-3 text-sm">
                      <div className="space-y-1">
                        {row.payments.map((payment, paymentIndex) => (
                          <div key={paymentIndex} className="text-xs text-neutral-300">
                            Cert. {payment.id}: {formatCurrency(convertToDisplayCurrency(payment.amount), investment.currencyFormat)}
                          </div>
                        ))}
                      </div>
                    </td>
                  )}
                  {selectedColumns.totalCertificates && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-100">
                      {row.totalCertificates}
                    </td>
                  )}
                  {selectedColumns.certificatesFromReinvestment && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-100">
                      {row.certificatesFromReinvestment}
                    </td>
                  )}
                  {selectedColumns.citrusPatrimony && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-100">
                      {formatCurrency(convertToDisplayCurrency(row.citrusPatrimony), investment.currencyFormat)}
                    </td>
                  )}
                  {selectedColumns.citrusIncome && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-100">
                      {formatCurrency(convertToDisplayCurrency(row.citrusIncome), investment.currencyFormat)}
                    </td>
                  )}
                  {selectedColumns.yearlyCashOutAmount && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-100">
                      {formatCurrency(convertToDisplayCurrency(row.yearlyCashOutAmount), investment.currencyFormat)}
                    </td>
                  )}
                  {selectedColumns.cumulativeCashOutAmount && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-100">
                      {formatCurrency(convertToDisplayCurrency(row.cumulativeCashOutAmount), investment.currencyFormat)}
                    </td>
                  )}
                  {selectedColumns.yearlyReinvestmentContribution && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-100">
                      {formatCurrency(convertToDisplayCurrency(row.yearlyReinvestmentContribution), investment.currencyFormat)}
                    </td>
                  )}
                  {selectedColumns.cumulativeReinvestmentContribution && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-100">
                      {formatCurrency(convertToDisplayCurrency(row.cumulativeReinvestmentContribution), investment.currencyFormat)}
                    </td>
                  )}
                  {selectedColumns.cumulativeTotalUtility && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-100">
                      {formatCurrency(convertToDisplayCurrency(row.cumulativeTotalUtility), investment.currencyFormat)}
                    </td>
                  )}
                  {selectedColumns.paymentBoostActive && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-100">
                      {row.paymentBoostActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {currentLanguage === 'es' ? 'Sí' : currentLanguage === 'en' ? 'Yes' : 'Oui'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-dark-surface text-neutral-50">
                          {currentLanguage === 'es' ? 'No' : currentLanguage === 'en' ? 'No' : 'Non'}
                        </span>
                      )}
                    </td>
                  )}
                  {selectedColumns.paymentBoostAmount && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-100">
                      {row.paymentBoostAmount > 0 ? 
                        formatCurrency(convertToDisplayCurrency(row.paymentBoostAmount), investment.currencyFormat) : 
                        '-'
                      }
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            {selectedColumns.paymentAmount && (
              <tfoot className="bg-dark-surface border-t border-gray-200">
                <tr>
                  <td colSpan={Object.values(selectedColumns).filter(v => v).length} className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-4">
                      <div className="text-sm font-medium text-neutral-200">
                        Total Pagado: <span className="text-green-500 font-bold text-lg">{formatCurrency(convertToDisplayCurrency(certificateEvolution.reduce((sum, row) => sum + (row.payments?.reduce((s, p) => s + p.amount, 0) || 0), 0)), investment.currencyFormat)}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-dark-surface rounded-lg p-6">
        <h3 className="text-lg font-semibold text-neutral-50 mb-4">{content.excel.legend.title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="inline-flex items-center justify-center w-8 h-8 text-xs font-bold rounded-lg shadow-sm border-2 bg-gradient-to-br from-cyan-400 to-cyan-600 text-white border-cyan-300">
                1
              </div>
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm bg-cyan-500"></div>
            </div>
            <div>
              <div className="font-medium text-neutral-50">{content.excel.legend.reserved}</div>
              <div className="text-sm text-neutral-300">{content.excel.legend.reservedDesc}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="inline-flex items-center justify-center w-8 h-8 text-xs font-bold rounded-lg shadow-sm border-2 bg-gradient-to-br from-gray-400 to-gray-600 text-white border-dark-border">
                2
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm bg-dark-surface0"></div>
            </div>
            <div>
              <div className="font-medium text-neutral-50">{content.excel.legend.waiting}</div>
              <div className="text-sm text-neutral-300">{content.excel.legend.waitingDesc}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="inline-flex items-center justify-center w-8 h-8 text-xs font-bold rounded-lg shadow-sm border-2 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white border-yellow-300">
                3
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm bg-yellow-500"></div>
            </div>
            <div>
              <div className="font-medium text-neutral-50">{content.excel.legend.growing}</div>
              <div className="text-sm text-neutral-300">{content.excel.legend.growingDesc}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="inline-flex items-center justify-center w-8 h-8 text-xs font-bold rounded-lg shadow-sm border-2 bg-gradient-to-br from-green-400 to-green-600 text-white border-green-300">
                4
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm bg-green-500"></div>
            </div>
            <div>
              <div className="font-medium text-neutral-50">{content.excel.legend.producing}</div>
              <div className="text-sm text-neutral-300">{content.excel.legend.producingDesc}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-neutral-100 mb-4">{content.excel.notes.title}</h3>
        <ul className="list-disc pl-5 space-y-2 text-neutral-300">
          {investment.ridermex ? (
            <>
              {/* RiderMex Specific Notes */}
              <li>Los primeros 18 meses corresponden al período de maduración (12 meses construcción + 6 meses aclientado).</li>
              <li>A partir del mes 19 se comienzan a generar utilidades por la operación (pagos trimestrales).</li>
              <li>Cada ticket genera ${RIDERMEX_CONFIG.QUARTERLY_PAYMENT.toLocaleString()} MXN trimestrales. Rendimiento anual base: ${RIDERMEX_CONFIG.SCENARIOS[investment.ridermexScenario || 'moderate'].annualReturnPerTicket.toLocaleString()} MXN por ticket según escenario.</li>
              <li>El precio del ticket se aprecia un 50% anual durante el primer año, luego 5% anual compuesto.</li>
              <li>Descuento del 2% anual en rendimiento para tickets adquiridos después del año 1.</li>
              <li>Los rendimientos de tickets en producción crecen un 5% anual compuesto.</li>
              {investment.reinvestProfits ? (
                <li>En el mes 49, puedes elegir destinar las utilidades para adquirir nuevos tickets.</li>
              ) : (
                <li>Las utilidades se reciben como ingreso sin reinversión.</li>
              )}
              {investment.partialCashOut && (
                <li>Se realiza un retiro del {investment.cashOutPercentage}% de las utilidades generadas.</li>
              )}
            </>
          ) : (
            <>
              {/* Traditional Citrus Notes */}
              <li>{content.excel.notes.maturationPeriod}</li>
              <li>{content.excel.notes.incomeStart}</li>
              <li>{content.excel.notes.appreciation}</li>
              <li>{content.excel.notes.lemonPriceIncrease}</li>
              <li>{content.excel.notes.utilityCalculation}</li>
              {investment.reinvestProfits ? (
                <li>{content.excel.notes.reinvestmentActive}</li>
              ) : (
                <li>{content.excel.notes.reinvestmentInactive}</li>
              )}
              {investment.partialCashOut && (
                <li>{content.excel.notes.partialCashOut.replace('{percentage}', investment.cashOutPercentage.toString())}</li>
              )}
              {investment.enablePaymentBoost && (
                <li>{content.excel.notes.paymentBoost}</li>
              )}
            </>
          )}
          <li>{content.excel.notes.currency.replace('{currency}', investment.currencyFormat)}</li>
          {investment.currencyFormat !== 'MXN' && (
            <li>{content.excel.notes.exchangeRate
              .replace('{rate}', (investment.currencyFormat === 'USD' ? investment.exchangeRate : investment.exchangeRateEUR).toString())
              .replace('{currency}', investment.currencyFormat)}</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ExcelTableV5;