export interface ValuePropositionItem {
  title: string;
  description: string;
  icon: string;
}

export interface ImpactMetrics {
  environmental: {
    co2Reduction: number;
    waterSaved: number;
    landPreserved: number;
  };
  social: {
    jobsCreated: number;
    familiesSupported: number;
    communityProjects: number;
  };
  economic: {
    localEconomyBoost: number;
    taxContribution: number;
    sustainableGrowth: number;
  };
}

export const valuePropositionItems: ValuePropositionItem[] = [
  {
    title: "Activo Real y Productivo",
    description: "Inversión respaldada por árboles de limón en producción, un activo tangible que genera ingresos reales y sostenibles.",
    icon: "Zap"
  },
  {
    title: "Ingresos Dolarizados",
    description: "Protección natural contra la devaluación al generar ingresos en dólares por exportación, blindando tu patrimonio.",
    icon: "DollarSign"
  },
  {
    title: "Doble Beneficio y Alta Rentabilidad",
    description: "Combina la apreciación del certificado con rendimientos operativos superiores al mercado, maximizando tu retorno.",
    icon: "TrendingUp"
  },
  {
    title: "Diversificación y Bajo Riesgo",
    description: "Invierte en el sector agroindustrial, con baja correlación al mercado tradicional y demanda estable, reduciendo tu exposición al riesgo.",
    icon: "Shield"
  },
  {
    title: "Impacto Social y Sostenibilidad",
    description: "Contribuye al desarrollo económico local y a prácticas agrícolas responsables con el medio ambiente.",
    icon: "Users"
  },
  {
    title: "Gestión Profesional y Transparencia",
    description: "Operación a cargo de expertos, con certificaciones y reportes claros, sin preocupaciones para el inversionista.",
    icon: "Award"
  }
];

export const impactMetrics: ImpactMetrics = {
  environmental: {
    co2Reduction: 2.5, // toneladas por hectárea/año
    waterSaved: 25000, // litros por año
    landPreserved: 4000 // metros cuadrados
  },
  social: {
    jobsCreated: 0.5, // empleos por certificado
    familiesSupported: 1, // familias por certificado
    communityProjects: 0.15 // proyectos por certificado
  },
  economic: {
    localEconomyBoost: 0.1, // % incremento en economía local por certificado
    taxContribution: 15000, // MXN en impuestos por certificado
    sustainableGrowth: 0.2 // % de crecimiento sostenible por certificado
  }
};

export const marketData = {
  destinations: [
    { name: "Estados Unidos", percentage: 65 },
    { name: "Canadá", percentage: 20 },
    { name: "Europa", percentage: 10 },
    { name: "Otros", percentage: 5 }
  ],
  prices: {
    current: 26.00, // USD/kg
    annualGrowth: 5.2 // %
  },
  production: {
    annual: 26000, // kg/ha
    area: 1000, // m² por certificado
    cycle: "4-5 años" // Hasta producción plena
  },
  advantages: [
    "Ubicación geográfica estratégica",
    "Clima ideal para cultivo de cítricos",
    "Certificaciones internacionales",
    "Tecnología de punta en producción",
    "Contratos de venta anticipada"
  ]
};

export const sustainabilityPractices = [
  "Sistema de riego por goteo tecnificado",
  "Uso de fertilizantes orgánicos certificados",
  "Control biológico de plagas",
  "Conservación de suelos mediante cobertura vegetal",
  "Reciclaje de residuos orgánicos",
  "Energía solar para operaciones"
];

export const communityDevelopment = [
  "Programas de capacitación técnica",
  "Apoyo a productores locales",
  "Becas educativas para jóvenes",
  "Infraestructura rural mejorada",
  "Centros de salud comunitarios"
];

export const economicBenefits = [
  "Salarios competitivos y prestaciones",
  "Desarrollo de proveedores locales",
  "Transferencia de tecnología",
  "Fortalecimiento de cadenas productivas",
  "Impulso al comercio regional"
];

export const certifications = [
  {
    name: "Certificación Orgánica",
    issuer: "SENASICA - México",
    type: "environmental"
  },
  {
    name: "Uso Eficiente del Agua",
    issuer: "CONAGUA",
    type: "environmental"
  },
  {
    name: "Empresa Socialmente Responsable",
    issuer: "CEMEFI 2023",
    type: "social"
  },
  {
    name: "Mejor Empleador Rural",
    issuer: "SAGARPA 2023",
    type: "social"
  }
];

export const financialConcepts = [
  {
    title: "CAGR (Tasa de Crecimiento Anual Compuesta)",
    description: "Mide el rendimiento promedio anual de una inversión durante un período específico, considerando el efecto del interés compuesto."
  },
  {
    title: "TIR (Tasa Interna de Retorno)",
    description: "Es la tasa de descuento que hace que el valor presente neto de una inversión sea igual a cero. Indica la rentabilidad del proyecto."
  },
  {
    title: "Diversificación",
    description: "Estrategia que consiste en distribuir las inversiones entre diferentes activos para reducir el riesgo total del portafolio."
  },
  {
    title: "Inflación",
    description: "Incremento generalizado de precios que reduce el poder adquisitivo del dinero. Es importante considerar su impacto en las inversiones."
  },
  {
    title: "Riesgo vs Rendimiento",
    description: "Principio fundamental que establece que a mayor riesgo, mayor debe ser el rendimiento esperado de una inversión."
  },
  {
    title: "Horizonte de Inversión",
    description: "Período de tiempo durante el cual planeas mantener una inversión antes de necesitar el dinero."
  }
];

export const investmentStrategies = [
  {
    name: "Conservadora",
    description: [
      "Bajo riesgo",
      "Rendimientos estables",
      "Ideal para preservar capital",
      "Horizonte corto-mediano"
    ]
  },
  {
    name: "Moderada",
    description: [
      "Riesgo equilibrado",
      "Diversificación",
      "Crecimiento sostenido",
      "Horizonte mediano-largo"
    ]
  },
  {
    name: "Agresiva",
    description: [
      "Mayor riesgo",
      "Alto potencial de crecimiento",
      "Volatilidad elevada",
      "Horizonte largo plazo"
    ]
  }
];