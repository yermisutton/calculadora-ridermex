export const formatCurrency = (value: number, currency: 'MXN' | 'USD' | 'EUR' = 'MXN'): string => {
  // Validate input and handle NaN, null, undefined
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    value = 0;
  }

  // This function only handles formatting, conversion should be done before calling this
  let locale = 'es-MX';
  if (currency === 'USD') {
    locale = 'en-US';
  } else if (currency === 'EUR') {
    locale = 'es-ES';
  }

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  return formatter.format(value);
};

export const formatPercent = (value: number): string => {
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return '0.0%';
  }
  return `${value.toFixed(1)}%`;
};

export const formatNumber = (value: number): string => {
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return '0';
  }
  return new Intl.NumberFormat().format(Math.round(value));
};

export const shortenLargeNumber = (value: number): string => {
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return '0';
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

export const convertCurrency = (value: number, fromCurrency: 'MXN' | 'USD' | 'EUR', toCurrency: 'MXN' | 'USD' | 'EUR', exchangeRate: number, exchangeRateEUR?: number): number => {
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return 0;
  }
  if (fromCurrency === toCurrency) return value;
  
  if (fromCurrency === 'MXN' && toCurrency === 'USD') {
    return value / exchangeRate;
  } else if (fromCurrency === 'USD' && toCurrency === 'MXN') {
    return value * exchangeRate;
  } else if (fromCurrency === 'MXN' && toCurrency === 'EUR') {
    return value / (exchangeRateEUR || 21.70);
  } else if (fromCurrency === 'EUR' && toCurrency === 'MXN') {
    return value * (exchangeRateEUR || 21.70);
  } else if (fromCurrency === 'USD' && toCurrency === 'EUR') {
    // USD to EUR via MXN
    const mxnValue = value * exchangeRate;
    return mxnValue / (exchangeRateEUR || 21.70);
  } else if (fromCurrency === 'EUR' && toCurrency === 'USD') {
    // EUR to USD via MXN
    const mxnValue = value * (exchangeRateEUR || 21.70);
    return mxnValue / exchangeRate;
  }
  
  return value;
};

// Helper function to convert from MXN to display currency
export const convertFromMXN = (mxnValue: number, targetCurrency: 'MXN' | 'USD' | 'EUR', exchangeRate: number, exchangeRateEUR?: number): number => {
  if (mxnValue === null || mxnValue === undefined || isNaN(mxnValue) || !isFinite(mxnValue)) {
    return 0;
  }
  if (targetCurrency === 'MXN') return mxnValue;
  if (targetCurrency === 'USD') return mxnValue / exchangeRate;
  if (targetCurrency === 'EUR') return mxnValue / (exchangeRateEUR || 21.70);
  return mxnValue;
};

// Helper function to convert from display currency to MXN
export const convertToMXN = (value: number, fromCurrency: 'MXN' | 'USD' | 'EUR', exchangeRate: number, exchangeRateEUR?: number): number => {
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return 0;
  }
  if (fromCurrency === 'MXN') return value;
  if (fromCurrency === 'USD') return value * exchangeRate;
  if (fromCurrency === 'EUR') return value * (exchangeRateEUR || 21.70);
  return value;
};

export const parseCurrencyToNumber = (currencyString: string): number => {
  // Remove currency symbols, commas, and other non-numeric characters except decimal point
  const numericString = currencyString.replace(/[^0-9.-]/g, '');
  return parseFloat(numericString) || 0;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const formatPaybackPeriod = (paybackValue: number | null): string => {
  if (paybackValue === null || paybackValue === undefined || isNaN(paybackValue)) {
    return 'N/A';
  }
  
  const totalMonths = Math.round(paybackValue * 12);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years === 0) {
    return `${months} ${months === 1 ? 'mes' : 'meses'}`;
  }
  
  if (months === 0) {
    return `${years} ${years === 1 ? 'año' : 'años'}`;
  }

  const yearsStr = years === 1 ? '1 año' : `${years} años`;
  const monthsStr = months === 1 ? '1 mes' : `${months} meses`;
  return `${yearsStr} con ${monthsStr}`;
};