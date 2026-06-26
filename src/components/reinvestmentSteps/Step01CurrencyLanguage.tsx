import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Languages, DollarSign, Banknote, Info, Check } from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';
import { Language } from '../../types';
import { getLanguageContent, getLanguageFromCurrency } from '../../data/languages';
import EditableCard from '../ui/EditableCard';
import { Heading, Text, StepIndicator, Button, Card } from '../ui/DesignSystem';

interface Step01CurrencyLanguageProps {
  onNext: () => void;
  currentStep?: number;
  totalSteps?: number;
}

const Step01CurrencyLanguage: React.FC<Step01CurrencyLanguageProps> = ({
  onNext,
  currentStep = 1,
  totalSteps = 14
}) => {
  const { investment, updateInvestment } = useCalculator();

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

  return (
    <div className="min-h-screen bg-dark-bg p-md">
      <div className="max-w-4xl mx-auto">
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

        <div className="mt-lg mb-lg">
          <Heading level="lg">Selecciona tu Moneda e Idioma</Heading>
          <Text size="base" className="mt-2xs text-neutral-400">
            Configura tus preferencias de localización
          </Text>
        </div>

        <div className="space-y-lg">
          <Card>
            <div className="flex items-center gap-2xs mb-md">
              <Languages className="w-6 h-6 text-neon-red flex-shrink-0" />
              <Heading level="sm">Selecciona tu Idioma</Heading>
            </div>
            <Text size="sm" className="mb-md text-neutral-400">
              Toda la interfaz y reportes se mostrarán en este idioma
            </Text>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              {['es', 'en', 'fr'].map((lang) => (
                <motion.button
                  key={lang}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLanguageChange(lang as Language)}
                  className={`p-md rounded-xl text-center transition-all duration-200 border-2 shadow-lg ${
                    currentLanguage === lang
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white border-transparent'
                      : 'bg-slate-800/50 border-slate-600/50 text-slate-200 hover:border-slate-500'
                  }`}
                >
                  <div className="text-3xl mb-2xs">
                    {lang === 'es' ? '🇪🇸' : lang === 'en' ? '🇺🇸' : '🇫🇷'}
                  </div>
                  <h4 className="font-montserrat font-bold text-lg">
                    {lang === 'es' ? 'Español' : lang === 'en' ? 'English' : 'Français'}
                  </h4>
                  <Text size="sm" className={currentLanguage === lang ? 'text-white/90' : 'text-slate-400'}>
                    {lang === 'es' ? 'Nativo' : lang === 'en' ? 'Internacional' : 'Europeo'}
                  </Text>
                  {currentLanguage === lang && (
                    <div className="mt-2xs text-sm font-semibold text-white">✓ Seleccionado</div>
                  )}
                </motion.button>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2xs mb-md">
              <DollarSign className="w-6 h-6 text-neon-green flex-shrink-0" />
              <Heading level="sm">Selecciona tu Moneda</Heading>
            </div>
            <Text size="sm" className="mb-md text-neutral-400">
              {content.currencySelector.subtitle}
            </Text>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              {['MXN', 'USD', 'EUR'].map((currency) => {
                const colorMap = {
                  MXN: 'from-emerald-600 to-emerald-700',
                  USD: 'from-blue-600 to-blue-700',
                  EUR: 'from-amber-600 to-amber-700'
                };
                return (
                  <motion.button
                    key={currency}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCurrencyChange(currency as any)}
                    className={`p-md rounded-xl text-center transition-all duration-200 border-2 shadow-lg ${
                      investment.currencyFormat === currency
                        ? `bg-gradient-to-br ${colorMap[currency as keyof typeof colorMap]} text-white border-transparent`
                        : 'bg-slate-800/50 border-slate-600/50 text-slate-200 hover:border-slate-500'
                    }`}
                  >
                    <div className="text-3xl mb-2xs">
                      {currency === 'MXN' ? '🇲🇽' : currency === 'USD' ? '🇺🇸' : '🇪🇺'}
                    </div>
                    <h4 className="font-montserrat font-bold text-lg">{currency}</h4>
                    <Text size="sm" className={investment.currencyFormat === currency ? 'text-white/90' : 'text-slate-400'}>
                      {content.currencySelector.currencyInfo[currency as any].name}
                    </Text>
                    {investment.currencyFormat === currency && (
                      <div className="mt-2xs text-sm font-semibold text-white">✓ Seleccionada</div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </Card>

          {investment.currencyFormat === 'USD' && (
            <Card>
              <div className="flex items-center gap-2xs mb-md">
                <Banknote className="w-6 h-6 text-neon-green flex-shrink-0" />
                <Heading level="sm">Tipo de Cambio USD</Heading>
              </div>
              <EditableCard
                title="Tipo de Cambio"
                value={investment.exchangeRate}
                unit="MXN por USD"
                color="#00FF00"
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
            </Card>
          )}

          {investment.currencyFormat === 'EUR' && (
            <Card>
              <div className="flex items-center gap-2xs mb-md">
                <Banknote className="w-6 h-6 text-neon-green flex-shrink-0" />
                <Heading level="sm">Tipo de Cambio EUR</Heading>
              </div>
              <EditableCard
                title="Tipo de Cambio"
                value={investment.exchangeRateEUR || 21.70}
                unit="MXN por EUR"
                color="#00FF00"
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
            </Card>
          )}

          <Card>
            <div className="flex items-center gap-2xs mb-md">
              <Info className="w-6 h-6 text-neon-red flex-shrink-0" />
              <Heading level="sm">Configuración Activa</Heading>
            </div>
            <div className="space-y-2xs">
              <div className="flex items-center justify-between p-2xs bg-dark-border rounded">
                <Text size="sm" className="text-neutral-400">Idioma:</Text>
                <span className="text-2xl">
                  {currentLanguage === 'es' ? '🇪🇸' : currentLanguage === 'en' ? '🇺🇸' : '🇫🇷'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2xs bg-dark-border rounded">
                <Text size="sm" className="text-neutral-400">Moneda:</Text>
                <span className="text-2xl">
                  {investment.currencyFormat === 'MXN' ? '🇲🇽' : investment.currencyFormat === 'USD' ? '🇺🇸' : '🇪🇺'}
                </span>
              </div>
            </div>
          </Card>

          <div className="flex gap-md justify-center">
            <Button variant="primary" onClick={onNext} className="flex items-center gap-2xs">
              <span>{content.common.buttons.continue}</span>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step01CurrencyLanguage;