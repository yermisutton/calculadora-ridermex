import React, { useState } from 'react';
import { useCalculator } from '../context/CalculatorContext';
import { motion } from 'framer-motion';
import { ChevronRight, DollarSign, Plus, Minus, Edit, Check, X, Info, Globe, CreditCard, Banknote, Languages } from 'lucide-react';
import { Language } from '../types';
import { getLanguageContent, getLanguageFromCurrency } from '../data/languages';
import EditableCard from './ui/EditableCard';

interface CurrencySelectorProps {
  onNext: () => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ onNext }) => {
  const { investment, updateInvestment } = useCalculator();
  
  // Get current language content
  const currentLanguage = investment.language || getLanguageFromCurrency(investment.currencyFormat);
  const content = getLanguageContent(currentLanguage);

  const handleCurrencyChange = (currency: 'MXN' | 'USD' | 'EUR') => {
    const newLanguage = getLanguageFromCurrency(currency);
    updateInvestment({ 
      currencyFormat: currency,
      language: newLanguage as Language
    });
  };

  const handleLanguageChange = (language: Language) => {
    updateInvestment({ language });
  };

  // Handlers for increment/decrement buttons for USD
  const handleIncrementExchangeRateUSD = () => {
    if (investment.exchangeRate < 30) {
      updateInvestment({ exchangeRate: Math.round((investment.exchangeRate + 0.1) * 10) / 10 });
    }
  };

  const handleDecrementExchangeRateUSD = () => {
    if (investment.exchangeRate > 1) {
      updateInvestment({ exchangeRate: Math.round((investment.exchangeRate - 0.1) * 10) / 10 });
    }
  };

  // Handlers for increment/decrement buttons for EUR
  const handleIncrementExchangeRateEUR = () => {
    if ((investment.exchangeRateEUR || 21.70) < 35) {
      updateInvestment({ exchangeRateEUR: Math.round(((investment.exchangeRateEUR || 21.70) + 0.1) * 10) / 10 });
    }
  };

  const handleDecrementExchangeRateEUR = () => {
    if ((investment.exchangeRateEUR || 21.70) > 15) {
      updateInvestment({ exchangeRateEUR: Math.round(((investment.exchangeRateEUR || 21.70) - 0.1) * 10) / 10 });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Globe className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Selección de Moneda e Idioma</h2>
              <p className="text-blue-100">Elige tu moneda e idioma de preferencia para toda la experiencia</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Language Selection */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center">
                  <Languages className="w-6 h-6 text-purple-700" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-purple-800">
                    Selecciona tu Idioma
                  </h3>
                  <p className="text-purple-600">
                    Toda la interfaz y reportes se mostrarán en este idioma
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`py-6 px-6 rounded-xl text-lg font-medium transition-all duration-200 ${
                  currentLanguage === 'es'
                    ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg border-2 border-green-400'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-green-300'
                }`}
                onClick={() => handleLanguageChange('es')}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">🇪🇸</div>
                  <div className="text-xl font-bold mb-2">Español</div>
                  <div className={`text-sm ${currentLanguage === 'es' ? 'text-green-100' : 'text-gray-600'}`}>
                    Idioma nativo
                  </div>
                  {currentLanguage === 'es' && (
                    <div className="mt-2 text-xs text-green-200">✓ Seleccionado</div>
                  )}
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`py-6 px-6 rounded-xl text-lg font-medium transition-all duration-200 ${
                  currentLanguage === 'en'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg border-2 border-blue-400'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleLanguageChange('en')}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">🇺🇸</div>
                  <div className="text-xl font-bold mb-2">English</div>
                  <div className={`text-sm ${currentLanguage === 'en' ? 'text-blue-100' : 'text-gray-600'}`}>
                    International
                  </div>
                  {currentLanguage === 'en' && (
                    <div className="mt-2 text-xs text-blue-200">✓ Selected</div>
                  )}
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`py-6 px-6 rounded-xl text-lg font-medium transition-all duration-200 ${
                  currentLanguage === 'fr'
                    ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg border-2 border-purple-400'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => handleLanguageChange('fr')}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">🇫🇷</div>
                  <div className="text-xl font-bold mb-2">Français</div>
                  <div className={`text-sm ${currentLanguage === 'fr' ? 'text-purple-100' : 'text-gray-600'}`}>
                    Européen
                  </div>
                  {currentLanguage === 'fr' && (
                    <div className="mt-2 text-xs text-purple-200">✓ Sélectionné</div>
                  )}
                </div>
              </motion.button>
            </div>
          </div>

          {/* Currency Selection */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-800">
                    {content.currencySelector.title}
                  </h3>
                  <p className="text-blue-600">
                    {content.currencySelector.subtitle}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`py-6 px-6 rounded-xl text-lg font-medium transition-all duration-200 ${
                  investment.currencyFormat === 'MXN'
                    ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg border-2 border-green-400'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-green-300'
                }`}
                onClick={() => handleCurrencyChange('MXN')}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">🇲🇽</div>
                  <div className="text-xl font-bold mb-2">MXN</div>
                  <div className={`text-sm ${investment.currencyFormat === 'MXN' ? 'text-green-100' : 'text-gray-600'}`}>
                    {content.currencySelector.currencyInfo.MXN.name}
                  </div>
                  {investment.currencyFormat === 'MXN' && (
                    <div className="mt-2 text-xs text-green-200">✓ Seleccionada</div>
                  )}
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`py-6 px-6 rounded-xl text-lg font-medium transition-all duration-200 ${
                  investment.currencyFormat === 'USD'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg border-2 border-blue-400'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleCurrencyChange('USD')}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">🇺🇸</div>
                  <div className="text-xl font-bold mb-2">USD</div>
                  <div className={`text-sm ${investment.currencyFormat === 'USD' ? 'text-blue-100' : 'text-gray-600'}`}>
                    {content.currencySelector.currencyInfo.USD.name}
                  </div>
                  {investment.currencyFormat === 'USD' && (
                    <div className="mt-2 text-xs text-blue-200">✓ Seleccionada</div>
                  )}
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`py-6 px-6 rounded-xl text-lg font-medium transition-all duration-200 ${
                  investment.currencyFormat === 'EUR'
                    ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg border-2 border-purple-400'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => handleCurrencyChange('EUR')}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">🇪🇺</div>
                  <div className="text-xl font-bold mb-2">EUR</div>
                  <div className={`text-sm ${investment.currencyFormat === 'EUR' ? 'text-purple-100' : 'text-gray-600'}`}>
                    {content.currencySelector.currencyInfo.EUR.name}
                  </div>
                  {investment.currencyFormat === 'EUR' && (
                    <div className="mt-2 text-xs text-purple-200">✓ Seleccionada</div>
                  )}
                </div>
              </motion.button>
            </div>
          </div>

          {/* Exchange Rate for USD */}
          {investment.currencyFormat === 'USD' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-200 rounded-xl flex items-center justify-center">
                    <Banknote className="w-5 h-5 text-green-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-800">{content.currencySelector.exchangeRateLabels.USD}</h3>
                </div>
                
                <EditableCard
                  title="Tipo de Cambio"
                  value={investment.exchangeRate}
                  unit="MXN por USD"
                  color="#16a34a"
                  min={15}
                  max={25}
                  step={0.1}
                  presets={[
                    { label: '18.0', value: 18.0 },
                    { label: '20.0', value: 20.0 },
                    { label: '22.0', value: 22.0 },
                    { label: '24.0', value: 24.0 }
                  ]}
                  onChange={(value) => updateInvestment({ exchangeRate: value })}
                  formatValue={(v) => v.toFixed(1)}
                />
              </div>
            </div>
          )}

          {/* Exchange Rate for EUR */}
          {investment.currencyFormat === 'EUR' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-200 rounded-xl flex items-center justify-center">
                    <Banknote className="w-5 h-5 text-purple-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-purple-800">{content.currencySelector.exchangeRateLabels.EUR}</h3>
                </div>
                
                <EditableCard
                  title="Tipo de Cambio"
                  value={investment.exchangeRateEUR || 21.70}
                  unit="MXN por EUR"
                  color="#8b5cf6"
                  min={18}
                  max={25}
                  step={0.1}
                  presets={[
                    { label: '20.0', value: 20.0 },
                    { label: '21.7', value: 21.7 },
                    { label: '23.0', value: 23.0 },
                    { label: '24.0', value: 24.0 }
                  ]}
                  onChange={(value) => updateInvestment({ exchangeRateEUR: value })}
                  formatValue={(v) => v.toFixed(1)}
                />
              </div>
            </div>
          )}

          {/* Information about currency selection */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl p-6 border border-indigo-200">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-5 h-5 text-indigo-600" />
              <h4 className="font-semibold text-indigo-800">
                {currentLanguage === 'es' ? 'Información sobre la Moneda e Idioma Seleccionados' :
                 currentLanguage === 'en' ? 'Information about Selected Currency and Language' :
                 'Informations sur la Devise et la Langue Sélectionnées'}
              </h4>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4">
              <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                <h5 className="font-medium text-purple-800 mb-2">
                  {currentLanguage === 'es' ? 'Idioma Seleccionado:' :
                   currentLanguage === 'en' ? 'Selected Language:' :
                   'Langue Sélectionnée:'}
                </h5>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {currentLanguage === 'es' ? '🇪🇸' : currentLanguage === 'en' ? '🇺🇸' : '🇫🇷'}
                  </span>
                  <span className="font-medium text-purple-700">
                    {currentLanguage === 'es' ? 'Español' : currentLanguage === 'en' ? 'English' : 'Français'}
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-sm text-indigo-700">
                {content.currencySelector.currencyInfo[investment.currencyFormat].description.map((desc, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{desc.replace('{exchangeRate}', investment.exchangeRate.toString()).replace('{exchangeRateEUR}', (investment.exchangeRateEUR || 21.70).toFixed(1))}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Benefits of Currency Selection */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-800 mb-4">
              {currentLanguage === 'es' ? 'Beneficios de tu Selección' :
               currentLanguage === 'en' ? 'Benefits of your Selection' :
               'Avantages de votre Sélection'}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.currencySelector.currencyInfo[investment.currencyFormat].description.map((desc, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-700">
                    {desc.replace('{exchangeRate}', investment.exchangeRate.toString()).replace('{exchangeRateEUR}', (investment.exchangeRateEUR || 21.70).toFixed(1))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="px-12 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 text-lg"
            >
              <span>{content.common.buttons.continue}</span>
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CurrencySelector;