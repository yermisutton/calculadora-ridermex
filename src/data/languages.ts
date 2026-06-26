export type Language = 'es' | 'en' | 'fr';

export interface LanguageContent {
  common: {
    buttons: {
      continue: string;
      previous: string;
      save: string;
      reset: string;
      download: string;
    };
    units: {
      years: string;
      months: string;
      certificates: string;
      percentage: string;
    };
  };
  currencySelector: {
    title: string;
    subtitle: string;
    exchangeRateLabels: {
      USD: string;
      EUR: string;
    };
    currencyInfo: {
      MXN: {
        name: string;
        description: string[];
      };
      USD: {
        name: string;
        description: string[];
      };
      EUR: {
        name: string;
        description: string[];
      };
    };
  };
  traditional: {
    title: string;
    subtitle: string;
    steps: {
      currency: string;
      centralData: string;
      specificData: string;
      results: string;
      advantages: string;
      impact: string;
    };
    centralData: {
      title: string;
      subtitle: string;
      certificates: {
        title: string;
        label: string;
      };
      price: {
        title: string;
        label: string;
      };
      horizon: {
        title: string;
      };
      production: {
        title: string;
        productionLabel: string;
        priceLabel: string;
        calculatedProfit: string;
        scenarios: {
          conservative: string;
          moderate: string;
          optimistic: string;
        };
      };
    };
    specificData: {
      title: string;
      subtitle: string;
      inflationRate: {
        title: string;
        label: string;
      };
      lemonPriceIncrease: {
        title: string;
        label: string;
      };
      taxes: {
        title: string;
        taxRate: string;
      };
      comparativeRates: {
        title: string;
        cetes: string;
        savings: string;
        realEstate: string;
      };
    };
    results: {
      title: string;
      subtitle: string;
      initialCertificates: string;
      fromReinvestment: string;
      producingCertificates: string;
      reserved: string;
      waiting: string;
      monthlyIncome: string;
      totalCertificates: string;
      finalPatrimony: string;
      charts: {
        patrimonyEvolution: string;
        incomeEvolution: string;
        cashFlow: string;
        combinedAnalysis: string;
      };
    };
  };
  reinvestment: {
    title: string;
    subtitle: string;
    steps: {
      currency: string;
      centralData: string;
      specificData: string;
      withdrawalPlan: string;
      results: string;
      impact: string;
      advantages: string;
    };
    centralData?: {
      title: string;
      subtitle: string;
    };
  };
  boost: {
    title: string;
    subtitle: string;
    enabled: string;
    disabled: string;
    whatIs: string;
    explanation: string;
    withoutBoost: string;
    withBoost: string;
    certificate2Timeline: string;
    activated: string;
    accelerated: string;
    amountConfiguration: string;
    annualAmount: string;
    useOriginalPayment: string;
    originalPayment: string;
    annualGrowth: string;
    linearGrowth: string;
    growthExample: string;
    example: string;
    monthlyEquivalent: string;
    durationTitle: string;
    applicationYears: string;
    yearsPlaceholder: string;
    indefinite: string;
    makeIndefinite: string;
    quickPresets: string;
    projectedImpact: string;
    acceleration: string;
    fasterForCert2: string;
    totalBoost: string;
    tipActivation: string;
    howItWorks: string;
    automaticActivation: string;
    activationDesc: string;
    additionalContribution: string;
    contributionDesc: string;
    acceleration2: string;
    accelerationDesc: string;
    totalCustomization: string;
    customizationDesc: string;
  };
  withdrawalPlan: {
    title: string;
    subtitle: string;
    configuration: string;
    configurationDesc: string;
    activatePartialWithdrawal: string;
    defaultPercentage: string;
    applyToAllYears: string;
    reset: string;
    applyToSpecificPhases: string;
    earlyPhase: string;
    midPhase: string;
    latePhase: string;
    predefinedPatterns: string;
    increasingPattern: string;
    increasingDesc: string;
    decreasingPattern: string;
    decreasingDesc: string;
    bellCurvePattern: string;
    bellCurveDesc: string;
    retirementPattern: string;
    retirementDesc: string;
    yearByYearConfig: string;
    showAllYears: string;
    showByPhases: string;
    year: string;
    withdrawalPercentage: string;
    reinvestment: string;
    phase: string;
    initial: string;
    middle: string;
    final: string;
    howItWorks: string;
    partialWithdrawal: string;
    partialWithdrawalDesc: string;
    personalizedStrategy: string;
    personalizedStrategyDesc: string;
    usageExamples: string;
    example1: string;
    example2: string;
    example3: string;
    visualization: string;
  };
  excel: {
    title: string;
    subtitle: string;
    configTitle: string;
    showAllColumns: string;
    columns: {
      year: string;
      date: string;
      certificatePrice: string;
      certificates: string;
      totalUtility: string;
      reinvestmentFund: string;
      availableForReinvestment: string;
      events: string;
      paymentAmount: string;
      payments: string;
      totalCertificates: string;
      certificatesFromReinvestment: string;
      citrusPatrimony: string;
      citrusIncome: string;
      yearlyCashOutAmount: string;
      cumulativeCashOutAmount: string;
      yearlyReinvestmentContribution: string;
      cumulativeReinvestmentContribution: string;
      cumulativeTotalUtility: string;
      paymentBoostActive: string;
      paymentBoostAmount: string;
    };
    legend: {
      title: string;
      reserved: string;
      reservedDesc: string;
      waiting: string;
      waitingDesc: string;
      growing: string;
      growingDesc: string;
      producing: string;
      producingDesc: string;
    };
    notes: {
      title: string;
      maturationPeriod: string;
      incomeStart: string;
      appreciation: string;
      lemonPriceIncrease: string;
      noLemonIncrease: string;
      utilityCalculation: string;
      reinvestmentActive: string;
      reinvestmentInactive: string;
      partialCashOut: string;
      paymentBoost: string;
      currency: string;
      exchangeRate: string;
      yieldDiscount?: string;
      yieldGrowth?: string;
      ridermexPayment?: string;
    };
  };
}

const spanishContent: LanguageContent = {
  common: {
    buttons: {
      continue: 'Continuar',
      previous: 'Anterior',
      save: 'Guardar',
      reset: 'Restablecer',
      download: 'Descargar'
    },
    units: {
      years: 'años',
      months: 'meses',
      certificates: 'certificados',
      percentage: '%'
    }
  },
  currencySelector: {
    title: 'Selección de Moneda',
    subtitle: 'Elige la moneda en la que deseas ver todos los resultados',
    exchangeRateLabels: {
      USD: 'Tipo de Cambio (MXN/USD)',
      EUR: 'Tipo de Cambio (MXN/EUR)'
    },
    currencyInfo: {
      MXN: {
        name: 'Pesos Mexicanos',
        description: [
          'Moneda base de los certificados',
          'No requiere conversión de tipo de cambio',
          'Ideal para inversionistas mexicanos',
          'Los ingresos se generan naturalmente en MXN'
        ]
      },
      USD: {
        name: 'Dólares Americanos',
        description: [
          'Ideal para inversionistas internacionales',
          'Los ingresos son naturalmente dolarizados por exportación',
          'Tipo de cambio actual: {exchangeRate} MXN por USD',
          'Protección natural contra devaluación del peso'
        ]
      },
      EUR: {
        name: 'Euros',
        description: [
          'Para inversionistas europeos',
          'Conversión automática de todos los valores',
          'Tipo de cambio actual: {exchangeRateEUR} MXN por EUR',
          'Los ingresos mantienen protección cambiaria'
        ]
      }
    }
  },
  traditional: {
    title: 'Ticket de Inversión Rider Fija',
    subtitle: 'Calculadora básica sin reinversión de utilidades',
    steps: {
      currency: 'Moneda',
      centralData: 'Datos Centrales',
      specificData: 'Datos Específicos',
      results: 'Resultados',
      advantages: 'Ventajas',
      impact: 'Impacto'
    },
    centralData: {
      title: 'Datos Centrales de Inversión',
      subtitle: 'Configura los parámetros principales de tu inversión en RiderMex',
      certificates: {
        title: 'Tickets de Inversión Iniciales',
        label: 'certificados'
      },
      price: {
        title: 'Precio del Ticket de Inversión',
        label: 'por certificado'
      },
      horizon: {
        title: 'Horizonte de Inversión'
      },
      production: {
        title: 'Parámetros de Producción',
        productionLabel: 'Producción Promedio por Hectárea',
        priceLabel: 'Precio Promedio de Venta por Kg',
        calculatedProfit: 'Utilidad anual calculada:',
        scenarios: {
          conservative: 'Conservador',
          moderate: 'Moderado',
          optimistic: 'Optimista'
        }
      }
    },
    specificData: {
      title: 'Configuración Específica',
      subtitle: 'Ajusta parámetros específicos para tu análisis de inversión',
      inflationRate: {
        title: 'Tasa de Inflación',
        label: 'inflación anual'
      },
      lemonPriceIncrease: {
        title: 'Incremento Precio de Motocicletas',
        label: 'incremento anual'
      },
      taxes: {
        title: 'Aplicar Impuestos',
        taxRate: 'tasa de impuestos'
      },
      comparativeRates: {
        title: 'Tasas de Inversiones Comparativas',
        cetes: 'CETES',
        savings: 'Ahorro Tradicional',
        realEstate: 'Bienes Raíces - Apreciación'
      }
    },
    results: {
      title: 'Resultados Finales - Ticket de Inversión Tradicional',
      subtitle: 'Al año {years}',
      initialCertificates: 'Tickets de Inversión iniciales',
      fromReinvestment: 'Por reinversión',
      producingCertificates: 'Tickets de Inversión produciendo',
      reserved: 'Reservados',
      waiting: 'En maduración',
      monthlyIncome: 'Ingreso mensual futuro',
      totalCertificates: 'Total de Tickets de Inversión',
      finalPatrimony: 'Patrimonio final',
      charts: {
        patrimonyEvolution: 'Evolución del Patrimonio',
        incomeEvolution: 'Evolución de Ingresos',
        cashFlow: 'Flujo de Efectivo',
        combinedAnalysis: 'Análisis Combinado'
      }
    }
  },
  reinvestment: {
    title: 'Ticket de Inversión de Crecimiento Exponencial',
    subtitle: 'Con reinversión automática de utilidades',
    steps: {
      currency: 'Moneda',
      centralData: 'Datos Centrales',
      specificData: 'Configuración',
      withdrawalPlan: 'Plan de Retiros',
      results: 'Resultados',
      impact: 'Impacto',
      advantages: 'Ventajas'
    },
    centralData: {
      title: 'Datos Centrales de Inversión',
      subtitle: 'Configura los parámetros principales de tu inversión con reinversión automática'
    }
  },
  boost: {
    title: 'Boost de Pago',
    subtitle: 'Acelera tu crecimiento patrimonial',
    enabled: 'Activado',
    disabled: 'Desactivado',
    whatIs: '¿Qué es el Boost de Pago?',
    explanation: 'Una vez que termines de pagar tus certificados iniciales, puedes continuar aportando para acelerar dramáticamente la adquisición de nuevos certificados.',
    withoutBoost: 'Sin Boost',
    withBoost: 'Con Boost',
    certificate2Timeline: 'Ticket de Inversión 2 en año',
    activated: '¡Boost de Pago Activado!',
    accelerated: 'Tu inversión se acelerará significativamente',
    amountConfiguration: 'Configuración del Monto',
    annualAmount: 'Monto Anual del Boost',
    useOriginalPayment: 'Usar mensualidad original calculada',
    originalPayment: 'Mensualidad original:',
    annualGrowth: 'Crecimiento Anual del Boost',
    linearGrowth: 'Crecimiento lineal:',
    growthExample: 'El monto del boost aumentará {rate}% cada año.',
    example: 'Ejemplo:',
    monthlyEquivalent: 'Boost Mensual Equivalente:',
    durationTitle: 'Duración del Boost',
    applicationYears: 'Años de Aplicación',
    yearsPlaceholder: 'Años (vacío = ∞)',
    indefinite: 'Boost indefinido ∞',
    makeIndefinite: 'Hacer indefinido',
    quickPresets: 'Presets Rápidos',
    projectedImpact: 'Impacto Proyectado',
    acceleration: 'Aceleración:',
    fasterForCert2: 'más rápido para certificado 2',
    totalBoost: 'Boost Total:',
    tipActivation: 'El boost se activa automáticamente cuando termines de pagar tus certificados iniciales (año 5) y acelera significativamente tu crecimiento patrimonial.',
    howItWorks: '¿Cómo Funciona el Boost?',
    automaticActivation: 'Activación Automática',
    activationDesc: 'Se activa cuando tus certificados iniciales están 100% pagados',
    additionalContribution: 'Aporte Adicional',
    contributionDesc: 'Añade fondos extra al fondo de reinversión cada año',
    acceleration2: 'Aceleración',
    accelerationDesc: 'Acelera significativamente la adquisición de nuevos certificados',
    totalCustomization: 'Personalización Total',
    customizationDesc: 'Controla el monto y la duración según tus posibilidades'
  },
  withdrawalPlan: {
    title: 'Plan de Retiros Personalizado',
    subtitle: 'Diseña tu estrategia de retiros año por año',
    configuration: 'Configuración de Retiros',
    configurationDesc: 'Define qué porcentaje de utilidades retirar como ingreso mensual y qué porcentaje reinvertir',
    activatePartialWithdrawal: 'Activar Retiro Parcial de Utilidades',
    defaultPercentage: 'Porcentaje por Defecto',
    applyToAllYears: 'Aplicar a Todos los Años',
    reset: 'Restablecer',
    applyToSpecificPhases: 'Aplicar a Fases Específicas',
    earlyPhase: 'Inicial',
    midPhase: 'Media',
    latePhase: 'Final',
    predefinedPatterns: 'Patrones Predefinidos',
    increasingPattern: 'Patrón Creciente',
    increasingDesc: 'Retiros bajos al inicio, altos al final',
    decreasingPattern: 'Patrón Decreciente',
    decreasingDesc: 'Retiros altos al inicio, bajos al final',
    bellCurvePattern: 'Patrón Campana',
    bellCurveDesc: 'Retiros moderados, altos en el medio',
    retirementPattern: 'Patrón de Retiro',
    retirementDesc: 'Optimizado para jubilación',
    yearByYearConfig: 'Configuración Año por Año',
    showAllYears: 'Mostrar Todos los Años',
    showByPhases: 'Mostrar por Fases',
    year: 'Año',
    withdrawalPercentage: '% Retiro',
    reinvestment: 'Reinversión',
    phase: 'Fase',
    initial: 'Inicial',
    middle: 'Media',
    final: 'Final',
    howItWorks: '¿Cómo Funciona?',
    partialWithdrawal: 'Retiro Parcial:',
    partialWithdrawalDesc: 'Puedes retirar un porcentaje de las utilidades generadas cada año como ingreso mensual.',
    personalizedStrategy: 'Estrategia Personalizada:',
    personalizedStrategyDesc: 'Configura diferentes porcentajes para cada año según tus necesidades financieras.',
    usageExamples: 'Ejemplos de Uso:',
    example1: 'Años 1-10: 0% retiro (máximo crecimiento)',
    example2: 'Años 11-20: 30% retiro (ingreso moderado)',
    example3: 'Años 21-30: 70% retiro (preparación para retiro)',
    visualization: 'Visualización de Estrategia'
  },
  excel: {
    title: 'Evolución Detallada de Tickets de Inversión',
    subtitle: 'Análisis detallado de la evolución de certificados durante {years} años de inversión con {certificates} certificados iniciales',
    configTitle: 'Configuración de Columnas',
    showAllColumns: 'Mostrar Todas las Columnas',
    columns: {
      year: 'Año',
      date: 'Fecha',
      certificatePrice: 'Precio Cert.',
      totalCertificatesValue: 'Valor Total Certs.',
      certificates: 'Tickets de Inversión',
      totalUtility: 'Utilidad Total',
      reinvestmentFund: 'Fondo Reinversión',
      availableForReinvestment: 'Saldo Disponible',
      events: 'Eventos',
      paymentAmount: 'Pago x Cert.',
      payments: 'Pagos',
      totalCertificates: 'Total Tickets de Inversión',
      certificatesFromReinvestment: 'Por Reinversión',
      citrusPatrimony: 'Patrimonio',
      citrusIncome: 'Ingreso Anual',
      yearlyCashOutAmount: 'Retiro Anual',
      cumulativeCashOutAmount: 'Retiro Acumulado',
      yearlyReinvestmentContribution: 'Reinversión Anual',
      cumulativeReinvestmentContribution: 'Reinversión Acumulada',
      cumulativeTotalUtility: 'Utilidad Acumulada',
      paymentBoostActive: 'Boost Activo',
      paymentBoostAmount: 'Monto Boost'
    },
    legend: {
      title: 'Leyenda de Estados',
      reserved: 'En proceso de pago',
      reservedDesc: 'Muestra el monto pagado y pendiente',
      waiting: 'En maduración',
      waitingDesc: 'Indica años restantes para producción',
      growing: 'Iniciando producción',
      growingDesc: 'Primer año de utilidades',
      producing: 'Generando utilidades',
      producingDesc: 'Muestra años en producción y utilidad actual'
    },
    notes: {
      title: 'Notas Importantes',
      maturationPeriod: 'Los primeros 5 años corresponden al período de maduración de los certificados.',
      incomeStart: 'A partir del año 5 se comienzan a generar utilidades por la operación.',
      appreciation: 'El precio del certificado se aprecia un 12% anual durante los primeros 5 años.',
      lemonPriceIncrease: 'Se considera un incremento anual del 5% en el precio del limón a partir del año 6.',
      noLemonIncrease: 'No se considera incremento en el precio del limón.',
      utilityCalculation: 'La utilidad anual se calcula con base en 24,500 kg/ha × $30/kg × 0.1 × 0.65',
      reinvestmentActive: 'En el mes 49, puedes elegir destinar las utilidades para adquirir nuevos certificados.',
      reinvestmentInactive: 'Las utilidades se reciben como ingreso mensual sin reinversión.',
      partialCashOut: 'Se realiza un retiro parcial del {percentage}% de las utilidades generadas.',
      paymentBoost: 'El boost de pago está activado para acelerar la adquisición de certificados.',
      currency: 'Todos los valores están expresados en {currency}.',
      exchangeRate: 'Tipo de cambio utilizado: {rate} MXN por 1 {currency}.',
      yieldDiscount: 'Los tickets adquiridos después del año 1 tienen un descuento estimado del 2% en su rendimiento anual por cada año de diferencia. Incentiva la inversión temprana.',
      yieldGrowth: 'Los rendimientos estimados de tickets en producción crecen un 5% anual compuesto. Los tickets del año 1 mantienen 100% del rendimiento base estimado.',
      ridermexPayment: 'Los pagos estimados se realizan trimestralmente ($3,600 MXN por ticket). Periodo de maduración: 18 meses (construcción + aclientado). Primera utilidad estimada: mes 19.'
    }
  }
};

const englishContent: LanguageContent = {
  common: {
    buttons: {
      continue: 'Continue',
      previous: 'Previous',
      save: 'Save',
      reset: 'Reset',
      download: 'Download'
    },
    units: {
      years: 'years',
      months: 'months',
      certificates: 'certificates',
      percentage: '%'
    }
  },
  currencySelector: {
    title: 'Currency Selection',
    subtitle: 'Choose the currency in which you want to see all results',
    exchangeRateLabels: {
      USD: 'Exchange Rate (MXN/USD)',
      EUR: 'Exchange Rate (MXN/EUR)'
    },
    currencyInfo: {
      MXN: {
        name: 'Mexican Pesos',
        description: [
          'Base currency of certificates',
          'No exchange rate conversion required',
          'Ideal for Mexican investors',
          'Income is naturally generated in MXN'
        ]
      },
      USD: {
        name: 'US Dollars',
        description: [
          'Ideal for international investors',
          'Income is naturally dollarized through exports',
          'Current exchange rate: {exchangeRate} MXN per USD',
          'Natural protection against peso devaluation'
        ]
      },
      EUR: {
        name: 'Euros',
        description: [
          'For European investors',
          'Automatic conversion of all values',
          'Current exchange rate: {exchangeRateEUR} MXN per EUR',
          'Income maintains currency protection'
        ]
      }
    }
  },
  traditional: {
    title: 'Fixed Harvest Certificate',
    subtitle: 'Basic calculator without profit reinvestment',
    steps: {
      currency: 'Currency',
      centralData: 'Central Data',
      specificData: 'Specific Data',
      results: 'Results',
      advantages: 'Advantages',
      impact: 'Impact'
    },
    centralData: {
      title: 'Investment Central Data',
      subtitle: 'Configure the main parameters of your RiderMex investment',
      certificates: {
        title: 'Initial Certificates',
        label: 'certificates'
      },
      price: {
        title: 'Certificate Price',
        label: 'per certificate'
      },
      horizon: {
        title: 'Investment Horizon'
      },
      production: {
        title: 'Production Parameters',
        productionLabel: 'Average Production per Hectare',
        priceLabel: 'Average Sale Price per Kg',
        calculatedProfit: 'Calculated annual profit:',
        scenarios: {
          conservative: 'Conservative',
          moderate: 'Moderate',
          optimistic: 'Optimistic'
        }
      }
    },
    specificData: {
      title: 'Specific Configuration',
      subtitle: 'Adjust specific parameters for your investment analysis',
      inflationRate: {
        title: 'Inflation Rate',
        label: 'annual inflation'
      },
      lemonPriceIncrease: {
        title: 'Lemon Price Increase',
        label: 'annual increase'
      },
      taxes: {
        title: 'Apply Taxes',
        taxRate: 'tax rate'
      },
      comparativeRates: {
        title: 'Comparative Investment Rates',
        cetes: 'CETES',
        savings: 'Traditional Savings',
        realEstate: 'Real Estate - Appreciation'
      }
    },
    results: {
      title: 'Final Results - Traditional Certificate',
      subtitle: 'At year {years}',
      initialCertificates: 'Initial certificates',
      fromReinvestment: 'From reinvestment',
      producingCertificates: 'Producing certificates',
      reserved: 'Reserved',
      waiting: 'Maturing',
      monthlyIncome: 'Future monthly income',
      totalCertificates: 'Total Certificates',
      finalPatrimony: 'Final patrimony',
      charts: {
        patrimonyEvolution: 'Patrimony Evolution',
        incomeEvolution: 'Income Evolution',
        cashFlow: 'Cash Flow',
        combinedAnalysis: 'Combined Analysis'
      }
    }
  },
  reinvestment: {
    title: 'Exponential Growth Certificate',
    subtitle: 'With automatic profit reinvestment',
    steps: {
      currency: 'Currency',
      centralData: 'Central Data',
      specificData: 'Configuration',
      withdrawalPlan: 'Withdrawal Plan',
      results: 'Results',
      impact: 'Impact',
      advantages: 'Advantages'
    },
    centralData: {
      title: 'Investment Central Data',
      subtitle: 'Configure the main parameters of your investment with automatic reinvestment'
    }
  },
  boost: {
    title: 'Payment Boost',
    subtitle: 'Accelerate your wealth growth',
    enabled: 'Enabled',
    disabled: 'Disabled',
    whatIs: 'What is Payment Boost?',
    explanation: 'Once you finish paying for your initial certificates, you can continue contributing to dramatically accelerate the acquisition of new certificates.',
    withoutBoost: 'Without Boost',
    withBoost: 'With Boost',
    certificate2Timeline: 'Certificate 2 in year',
    activated: 'Payment Boost Activated!',
    accelerated: 'Your investment will accelerate significantly',
    amountConfiguration: 'Amount Configuration',
    annualAmount: 'Annual Boost Amount',
    useOriginalPayment: 'Use calculated original payment',
    originalPayment: 'Original payment:',
    annualGrowth: 'Annual Boost Growth',
    linearGrowth: 'Linear growth:',
    growthExample: 'The boost amount will increase {rate}% each year.',
    example: 'Example:',
    monthlyEquivalent: 'Monthly Equivalent Boost:',
    durationTitle: 'Boost Duration',
    applicationYears: 'Application Years',
    yearsPlaceholder: 'Years (empty = ∞)',
    indefinite: 'Indefinite boost ∞',
    makeIndefinite: 'Make indefinite',
    quickPresets: 'Quick Presets',
    projectedImpact: 'Projected Impact',
    acceleration: 'Acceleration:',
    fasterForCert2: 'faster for certificate 2',
    totalBoost: 'Total Boost:',
    tipActivation: 'The boost activates automatically when you finish paying your initial certificates (year 5) and significantly accelerates your wealth growth.',
    howItWorks: 'How Does the Boost Work?',
    automaticActivation: 'Automatic Activation',
    activationDesc: 'Activates when your initial certificates are 100% paid',
    additionalContribution: 'Additional Contribution',
    contributionDesc: 'Adds extra funds to the reinvestment fund each year',
    acceleration2: 'Acceleration',
    accelerationDesc: 'Significantly accelerates the acquisition of new certificates',
    totalCustomization: 'Total Customization',
    customizationDesc: 'Control the amount and duration according to your possibilities'
  },
  withdrawalPlan: {
    title: 'Personalized Withdrawal Plan',
    subtitle: 'Design your year-by-year withdrawal strategy',
    configuration: 'Withdrawal Configuration',
    configurationDesc: 'Define what percentage of profits to withdraw as monthly income and what percentage to reinvest',
    activatePartialWithdrawal: 'Activate Partial Profit Withdrawal',
    defaultPercentage: 'Default Percentage',
    applyToAllYears: 'Apply to All Years',
    reset: 'Reset',
    applyToSpecificPhases: 'Apply to Specific Phases',
    earlyPhase: 'Early',
    midPhase: 'Mid',
    latePhase: 'Late',
    predefinedPatterns: 'Predefined Patterns',
    increasingPattern: 'Increasing Pattern',
    increasingDesc: 'Low withdrawals at start, high at end',
    decreasingPattern: 'Decreasing Pattern',
    decreasingDesc: 'High withdrawals at start, low at end',
    bellCurvePattern: 'Bell Curve Pattern',
    bellCurveDesc: 'Moderate withdrawals, high in the middle',
    retirementPattern: 'Retirement Pattern',
    retirementDesc: 'Optimized for retirement',
    yearByYearConfig: 'Year-by-Year Configuration',
    showAllYears: 'Show All Years',
    showByPhases: 'Show by Phases',
    year: 'Year',
    withdrawalPercentage: '% Withdrawal',
    reinvestment: 'Reinvestment',
    phase: 'Phase',
    initial: 'Initial',
    middle: 'Middle',
    final: 'Final',
    howItWorks: 'How It Works?',
    partialWithdrawal: 'Partial Withdrawal:',
    partialWithdrawalDesc: 'You can withdraw a percentage of the profits generated each year as monthly income.',
    personalizedStrategy: 'Personalized Strategy:',
    personalizedStrategyDesc: 'Configure different percentages for each year according to your financial needs.',
    usageExamples: 'Usage Examples:',
    example1: 'Years 1-10: 0% withdrawal (maximum growth)',
    example2: 'Years 11-20: 30% withdrawal (moderate income)',
    example3: 'Years 21-30: 70% withdrawal (retirement preparation)',
    visualization: 'Strategy Visualization'
  },
  excel: {
    title: 'Detailed Certificate Evolution',
    subtitle: 'Detailed analysis of certificate evolution during {years} years of investment with {certificates} initial certificates',
    configTitle: 'Column Configuration',
    showAllColumns: 'Show All Columns',
    columns: {
      year: 'Year',
      date: 'Date',
      certificatePrice: 'Cert. Price',
      totalCertificatesValue: 'Total Certs. Value',
      certificates: 'Certificates',
      totalUtility: 'Total Utility',
      reinvestmentFund: 'Reinvestment Fund',
      availableForReinvestment: 'Available Balance',
      events: 'Events',
      paymentAmount: 'Payment/Cert.',
      payments: 'Payments',
      totalCertificates: 'Total Certificates',
      certificatesFromReinvestment: 'From Reinvestment',
      citrusPatrimony: 'Patrimony',
      citrusIncome: 'Annual Income',
      yearlyCashOutAmount: 'Annual Withdrawal',
      cumulativeCashOutAmount: 'Cumulative Withdrawal',
      yearlyReinvestmentContribution: 'Annual Reinvestment',
      cumulativeReinvestmentContribution: 'Cumulative Reinvestment',
      cumulativeTotalUtility: 'Cumulative Utility',
      paymentBoostActive: 'Boost Active',
      paymentBoostAmount: 'Boost Amount'
    },
    legend: {
      title: 'Status Legend',
      reserved: 'In payment process',
      reservedDesc: 'Shows paid and pending amount',
      waiting: 'Maturing',
      waitingDesc: 'Indicates remaining years for production',
      growing: 'Starting production',
      growingDesc: 'First year of profits',
      producing: 'Generating profits',
      producingDesc: 'Shows years in production and current profit'
    },
    notes: {
      title: 'Important Notes',
      maturationPeriod: 'The first {period} years correspond to the certificate maturation period.',
      incomeStart: 'Starting from year {year}, profits from operations begin to be generated.',
      appreciation: 'The certificate price appreciates {rate}% annually during the first 5 years.',
      lemonPriceIncrease: 'An annual increase of {rate}% in lemon price is considered starting from year 6.',
      noLemonIncrease: 'No increase in lemon price is considered.',
      utilityCalculation: 'Annual profit is calculated based on {production} kg/ha × ${price}/kg × 0.1 × 0.65',
      reinvestmentActive: 'In month 49, you can choose to allocate profits to acquire new certificates.',
      reinvestmentInactive: 'Profits are received as monthly income without reinvestment.',
      partialCashOut: 'A partial withdrawal of {percentage}% of generated profits is made.',
      paymentBoost: 'Payment boost is activated to accelerate certificate acquisition.',
      currency: 'All values are expressed in {currency}.',
      exchangeRate: 'Exchange rate used: {rate} MXN per 1 {currency}.',
      yieldDiscount: 'Tickets acquired after year 1 have a 2% discount on their annual yield for each year difference. This incentivizes early investment.',
      yieldGrowth: 'Yields from producing tickets grow 5% annually compounded. Year 1 tickets maintain 100% of base yield.',
      ridermexPayment: 'Estimated payments are made quarterly ($3,600 MXN per ticket). Maturation period: 18 months (construction + customer acquisition). First estimated profit: month 19.'
    }
  }
};

const frenchContent: LanguageContent = {
  common: {
    buttons: {
      continue: 'Continuer',
      previous: 'Précédent',
      save: 'Sauvegarder',
      reset: 'Réinitialiser',
      download: 'Télécharger'
    },
    units: {
      years: 'ans',
      months: 'mois',
      certificates: 'certificats',
      percentage: '%'
    }
  },
  currencySelector: {
    title: 'Sélection de Devise',
    subtitle: 'Choisissez la devise dans laquelle vous souhaitez voir tous les résultats',
    exchangeRateLabels: {
      USD: 'Taux de Change (MXN/USD)',
      EUR: 'Taux de Change (MXN/EUR)'
    },
    currencyInfo: {
      MXN: {
        name: 'Pesos Mexicains',
        description: [
          'Devise de base des certificats',
          'Aucune conversion de taux de change requise',
          'Idéal pour les investisseurs mexicains',
          'Les revenus sont naturellement générés en MXN'
        ]
      },
      USD: {
        name: 'Dollars Américains',
        description: [
          'Idéal pour les investisseurs internationaux',
          'Les revenus sont naturellement dollarisés par l\'exportation',
          'Taux de change actuel: {exchangeRate} MXN par USD',
          'Protection naturelle contre la dévaluation du peso'
        ]
      },
      EUR: {
        name: 'Euros',
        description: [
          'Pour les investisseurs européens',
          'Conversion automatique de toutes les valeurs',
          'Taux de change actuel: {exchangeRateEUR} MXN par EUR',
          'Les revenus maintiennent une protection de change'
        ]
      }
    }
  },
  traditional: {
    title: 'Certificat de Récolte Fixe',
    subtitle: 'Calculatrice de base sans réinvestissement des profits',
    steps: {
      currency: 'Devise',
      centralData: 'Données Centrales',
      specificData: 'Données Spécifiques',
      results: 'Résultats',
      advantages: 'Avantages',
      impact: 'Impact'
    },
    centralData: {
      title: 'Données Centrales d\'Investissement',
      subtitle: 'Configurez les paramètres principaux de votre investissement RiderMex',
      certificates: {
        title: 'Certificats Initiaux',
        label: 'certificats'
      },
      price: {
        title: 'Prix du Certificat',
        label: 'par certificat'
      },
      horizon: {
        title: 'Horizon d\'Investissement'
      },
      production: {
        title: 'Paramètres de Production',
        productionLabel: 'Production Moyenne par Hectare',
        priceLabel: 'Prix de Vente Moyen par Kg',
        calculatedProfit: 'Profit annuel calculé:',
        scenarios: {
          conservative: 'Conservateur',
          moderate: 'Modéré',
          optimistic: 'Optimiste'
        }
      }
    },
    specificData: {
      title: 'Configuration Spécifique',
      subtitle: 'Ajustez les paramètres spécifiques pour votre analyse d\'investissement',
      inflationRate: {
        title: 'Taux d\'Inflation',
        label: 'inflation annuelle'
      },
      lemonPriceIncrease: {
        title: 'Augmentation Prix Citron',
        label: 'augmentation annuelle'
      },
      taxes: {
        title: 'Appliquer les Impôts',
        taxRate: 'taux d\'imposition'
      },
      comparativeRates: {
        title: 'Taux d\'Investissements Comparatifs',
        cetes: 'CETES',
        savings: 'Épargne Traditionnelle',
        realEstate: 'Immobilier - Appréciation'
      }
    },
    results: {
      title: 'Résultats Finaux - Certificat Traditionnel',
      subtitle: 'À l\'année {years}',
      initialCertificates: 'Certificats initiaux',
      fromReinvestment: 'Du réinvestissement',
      producingCertificates: 'Certificats en production',
      reserved: 'Réservés',
      waiting: 'En maturation',
      monthlyIncome: 'Revenu mensuel futur',
      totalCertificates: 'Total des Certificats',
      finalPatrimony: 'Patrimoine final',
      charts: {
        patrimonyEvolution: 'Évolution du Patrimoine',
        incomeEvolution: 'Évolution des Revenus',
        cashFlow: 'Flux de Trésorerie',
        combinedAnalysis: 'Analyse Combinée'
      }
    }
  },
  reinvestment: {
    title: 'Certificat de Croissance Exponentielle',
    subtitle: 'Avec réinvestissement automatique des profits',
    steps: {
      currency: 'Devise',
      centralData: 'Données Centrales',
      specificData: 'Configuration',
      withdrawalPlan: 'Plan de Retrait',
      results: 'Résultats',
      impact: 'Impact',
      advantages: 'Avantages'
    },
    centralData: {
      title: 'Données Centrales d\'Investissement',
      subtitle: 'Configurez les paramètres principaux de votre investissement avec réinvestissement automatique'
    }
  },
  boost: {
    title: 'Boost de Paiement',
    subtitle: 'Accélérez la croissance de votre patrimoine',
    enabled: 'Activé',
    disabled: 'Désactivé',
    whatIs: 'Qu\'est-ce que le Boost de Paiement?',
    explanation: 'Une fois que vous avez fini de payer vos certificats initiaux, vous pouvez continuer à contribuer pour accélérer considérablement l\'acquisition de nouveaux certificats.',
    withoutBoost: 'Sans Boost',
    withBoost: 'Avec Boost',
    certificate2Timeline: 'Certificat 2 en année',
    activated: 'Boost de Paiement Activé!',
    accelerated: 'Votre investissement s\'accélérera considérablement',
    amountConfiguration: 'Configuration du Montant',
    annualAmount: 'Montant Annuel du Boost',
    useOriginalPayment: 'Utiliser le paiement original calculé',
    originalPayment: 'Paiement original:',
    annualGrowth: 'Croissance Annuelle du Boost',
    linearGrowth: 'Croissance linéaire:',
    growthExample: 'Le montant du boost augmentera de {rate}% chaque année.',
    example: 'Exemple:',
    monthlyEquivalent: 'Équivalent Mensuel du Boost:',
    durationTitle: 'Durée du Boost',
    applicationYears: 'Années d\'Application',
    yearsPlaceholder: 'Années (vide = ∞)',
    indefinite: 'Boost indéfini ∞',
    makeIndefinite: 'Rendre indéfini',
    quickPresets: 'Préréglages Rapides',
    projectedImpact: 'Impact Projeté',
    acceleration: 'Accélération:',
    fasterForCert2: 'plus rapide pour le certificat 2',
    totalBoost: 'Boost Total:',
    tipActivation: 'Le boost s\'active automatiquement lorsque vous terminez de payer vos certificats initiaux (année 5) et accélère considérablement la croissance de votre patrimoine.',
    howItWorks: 'Comment Fonctionne le Boost?',
    automaticActivation: 'Activation Automatique',
    activationDesc: 'S\'active lorsque vos certificats initiaux sont payés à 100%',
    additionalContribution: 'Contribution Supplémentaire',
    contributionDesc: 'Ajoute des fonds supplémentaires au fonds de réinvestissement chaque année',
    acceleration2: 'Accélération',
    accelerationDesc: 'Accélère considérablement l\'acquisition de nouveaux certificats',
    totalCustomization: 'Personnalisation Totale',
    customizationDesc: 'Contrôlez le montant et la durée selon vos possibilités'
  },
  withdrawalPlan: {
    title: 'Plan de Retrait Personnalisé',
    subtitle: 'Concevez votre stratégie de retrait année par année',
    configuration: 'Configuration des Retraits',
    configurationDesc: 'Définissez quel pourcentage des profits retirer comme revenu mensuel et quel pourcentage réinvestir',
    activatePartialWithdrawal: 'Activer le Retrait Partiel des Profits',
    defaultPercentage: 'Pourcentage par Défaut',
    applyToAllYears: 'Appliquer à Toutes les Années',
    reset: 'Réinitialiser',
    applyToSpecificPhases: 'Appliquer à des Phases Spécifiques',
    earlyPhase: 'Initiale',
    midPhase: 'Moyenne',
    latePhase: 'Finale',
    predefinedPatterns: 'Modèles Prédéfinis',
    increasingPattern: 'Modèle Croissant',
    increasingDesc: 'Retraits faibles au début, élevés à la fin',
    decreasingPattern: 'Modèle Décroissant',
    decreasingDesc: 'Retraits élevés au début, faibles à la fin',
    bellCurvePattern: 'Modèle en Cloche',
    bellCurveDesc: 'Retraits modérés, élevés au milieu',
    retirementPattern: 'Modèle de Retraite',
    retirementDesc: 'Optimisé pour la retraite',
    yearByYearConfig: 'Configuration Année par Année',
    showAllYears: 'Afficher Toutes les Années',
    showByPhases: 'Afficher par Phases',
    year: 'Année',
    withdrawalPercentage: '% Retrait',
    reinvestment: 'Réinvestissement',
    phase: 'Phase',
    initial: 'Initiale',
    middle: 'Moyenne',
    final: 'Finale',
    howItWorks: 'Comment Ça Marche?',
    partialWithdrawal: 'Retrait Partiel:',
    partialWithdrawalDesc: 'Vous pouvez retirer un pourcentage des profits générés chaque année comme revenu mensuel.',
    personalizedStrategy: 'Stratégie Personnalisée:',
    personalizedStrategyDesc: 'Configurez différents pourcentages pour chaque année selon vos besoins financiers.',
    usageExamples: 'Exemples d\'Utilisation:',
    example1: 'Années 1-10: 0% retrait (croissance maximale)',
    example2: 'Années 11-20: 30% retrait (revenu modéré)',
    example3: 'Années 21-30: 70% retrait (préparation à la retraite)',
    visualization: 'Visualisation de la Stratégie'
  },
  excel: {
    title: 'Évolution Détaillée des Certificats',
    subtitle: 'Analyse détaillée de l\'évolution des certificats pendant {years} années d\'investissement avec {certificates} certificats initiaux',
    configTitle: 'Configuration des Colonnes',
    showAllColumns: 'Afficher Toutes les Colonnes',
    columns: {
      year: 'Année',
      date: 'Date',
      certificatePrice: 'Prix Cert.',
      totalCertificatesValue: 'Valeur Totale Certs.',
      certificates: 'Certificats',
      totalUtility: 'Utilité Totale',
      reinvestmentFund: 'Fonds Réinvestissement',
      availableForReinvestment: 'Solde Disponible',
      events: 'Événements',
      payments: 'Paiements',
      totalCertificates: 'Total Certificats',
      certificatesFromReinvestment: 'Du Réinvestissement',
      citrusPatrimony: 'Patrimoine',
      citrusIncome: 'Revenu Annuel',
      yearlyCashOutAmount: 'Retrait Annuel',
      cumulativeCashOutAmount: 'Retrait Cumulé',
      yearlyReinvestmentContribution: 'Réinvestissement Annuel',
      cumulativeReinvestmentContribution: 'Réinvestissement Cumulé',
      cumulativeTotalUtility: 'Utilité Cumulée',
      paymentBoostActive: 'Boost Actif',
      paymentBoostAmount: 'Montant Boost'
    },
    legend: {
      title: 'Légende des États',
      reserved: 'En cours de paiement',
      reservedDesc: 'Affiche le montant payé et en attente',
      waiting: 'En maturation',
      waitingDesc: 'Indique les années restantes pour la production',
      growing: 'Début de production',
      growingDesc: 'Première année de profits',
      producing: 'Génération de profits',
      producingDesc: 'Affiche les années en production et le profit actuel'
    },
    notes: {
      title: 'Notes Importantes',
      maturationPeriod: 'Les {period} premières années correspondent à la période de maturation des certificats.',
      incomeStart: 'À partir de l\'année {year}, les profits des opérations commencent à être générés.',
      appreciation: 'Le prix du certificat s\'apprécie de {rate}% par an pendant les 5 premières années.',
      lemonPriceIncrease: 'Une augmentation annuelle de {rate}% du prix du citron est considérée à partir de l\'année 6.',
      noLemonIncrease: 'Aucune augmentation du prix du citron n\'est considérée.',
      utilityCalculation: 'Le profit annuel est calculé sur la base de {production} kg/ha × ${price}/kg × 0,1 × 0,65',
      reinvestmentActive: 'Au mois 49, vous pouvez choisir d\'allouer les profits pour acquérir de nouveaux certificats.',
      reinvestmentInactive: 'Les profits sont reçus comme revenu mensuel sans réinvestissement.',
      partialCashOut: 'Un retrait partiel de {percentage}% des profits générés est effectué.',
      paymentBoost: 'Le boost de paiement est activé pour accélérer l\'acquisition de certificats.',
      currency: 'Toutes les valeurs sont exprimées en {currency}.',
      exchangeRate: 'Taux de change utilisé: {rate} MXN pour 1 {currency}.',
      yieldDiscount: 'Les tickets acquis après l\'année 1 ont une réduction de 2% sur leur rendement annuel pour chaque année de différence. Cela incite à l\'investissement précoce.',
      yieldGrowth: 'Les rendements des tickets en production augmentent de 5% par an composés. Les tickets de l\'année 1 maintiennent 100% du rendement de base.',
      ridermexPayment: 'Les paiements estimés sont effectués trimestriellement (3 500 $ MXN par ticket). Période de maturation: 18 mois (construction + acquisition client). Premier profit estimé: mois 19.'
    }
  }
};

export function getLanguageContent(language: Language): LanguageContent {
  switch (language) {
    case 'en':
      return englishContent;
    case 'fr':
      return frenchContent;
    case 'es':
    default:
      return spanishContent;
  }
}

export function getLanguageFromCurrency(currency: 'MXN' | 'USD' | 'EUR'): Language {
  switch (currency) {
    case 'USD':
      return 'en';
    case 'EUR':
      return 'fr';
    case 'MXN':
    default:
      return 'es';
  }
}