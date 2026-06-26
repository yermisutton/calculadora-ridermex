export interface CompoundMultiplierContent {
  title: string;
  subtitle: string;
  tagline: string;

  // Core concept explanation
  whatMakesDifferent: {
    title: string;
    traditional: {
      title: string;
      points: string[];
    };
    multiplier: {
      title: string;
      points: string[];
    };
  };

  // The 4 pillars
  pillars: {
    title: string;
    items: Array<{
      number: number;
      title: string;
      description: string;
      examples: string[];
    }>;
  };

  // Sales phrases
  salesPhrases: {
    opening: string[];
    explanation: string[];
    closing: string[];
  };

  // Visual examples
  visualExamples: {
    directComparison: {
      traditional: string;
      multiplier: string;
    };
    avalancheEffect: string[];
  };

  // Unique benefits
  uniqueBenefits: Array<{
    title: string;
    description: string;
  }>;

  // Common objections and responses
  objections: Array<{
    objection: string;
    response: string;
  }>;

  // Call to action
  callToAction: string;

  // Positioning
  positioning: string[];
}

export const compoundMultiplierContent: CompoundMultiplierContent = {
  title: "INTERÉS COMPUESTO MULTIPLICADOR RIDERMEX",
  subtitle: "La Nueva Era de Inversión en Motocicletas",
  tagline: "No solo multiplica dinero, multiplica tiendas y utilidades de venta de motocicletas",

  whatMakesDifferent: {
    title: "¿Qué lo hace diferente del interés compuesto tradicional?",
    traditional: {
      title: "Interés Compuesto Tradicional:",
      points: [
        "Reinvierte dinero que genera más dinero",
        "Crecimiento en una sola dimensión (valor monetario)",
        "Dependiente de tasas de mercado volátiles",
        "Activos intangibles (números en pantalla)"
      ]
    },
    multiplier: {
      title: "RiderMex Multiplicador:",
      points: [
        "Reinvierte utilidades que adquieren más tickets y tiendas productivas",
        "Crecimiento en múltiples dimensiones (cantidad de tickets + valor + motos vendidas)",
        "Doble motor de crecimiento: apreciación de ticket + utilidades operativas",
        "Activos tangibles (motocicletas y tiendas que generan ventas reales)"
      ]
    }
  },

  pillars: {
    title: "Los 4 Pilares del RiderMex Multiplicador",
    items: [
      {
        number: 1,
        title: "MULTIPLICACIÓN DE TICKETS",
        description: "No solo crece el dinero, crece tu cartera de tickets en tiendas RiderMex",
        examples: [
          "Año 1: 1 ticket → Participación en 480 motos vendidas/año",
          "Año 10: 5 tickets → Participación en 2,400 motos vendidas/año",
          "Año 20: 18 tickets → Participación en 8,640 motos vendidas/año",
          "Año 25: 30+ tickets → Participación en 14,400+ motos vendidas/año"
        ]
      },
      {
        number: 2,
        title: "MULTIPLICACIÓN DE INGRESOS",
        description: "Cada nuevo ticket es una nueva fuente de ingresos trimestral permanente",
        examples: [
          "Tradicional: $100K → $200K (2x en dinero)",
          "RiderMex: 1 ticket ($70,000) → 30+ tickets (30x en ingresos trimestrales a 25 años)",
          "Cada ticket = $14,400 anuales ($3,600 trimestrales) de utilidades"
        ]
      },
      {
        number: 3,
        title: "MULTIPLICACIÓN DE VALOR",
        description: "Triple motor de crecimiento simultáneo en tiendas RiderMex",
        examples: [
          "Apreciación del ticket: 5% anual + sistema de escalones progresivos",
          "Incremento de utilidades: Proporcional al crecimiento de motos vendidas",
          "Efecto red: Más tiendas abiertas = más motos vendidas = mayores utilidades",
          "Diversificación automática: Múltiples tiendas en diferentes regiones"
        ]
      },
      {
        number: 4,
        title: "MULTIPLICACIÓN DE IMPACTO",
        description: "Tu impacto económico y laboral crece exponencialmente",
        examples: [
          "Laboral: Cada tienda genera 5 empleos directos y unos 15 indirectos",
          "Económico: Mayor movimiento de motos en el mercado",
          "Comunitario: Presencia RiderMex en nuevas ciudades y regiones"
        ]
      }
    ]
  },

  salesPhrases: {
    opening: [
      "¿Has escuchado sobre el modelo de inversión en motos de RiderMex? Es una nueva forma de invertir donde en lugar de solo multiplicar dinero, multiplicas tiendas, ventas y fuentes de ingresos.",
      "Te voy a mostrar algo que va a cambiar tu perspectiva sobre las inversiones: RiderMex Multiplicador, donde no solo crece tu dinero, sino que se multiplican tus fuentes de ingresos trimestrales."
    ],
    explanation: [
      "Mientras el interés compuesto tradicional te da más dinero, RiderMex te da más FUENTES de dinero. Es como la diferencia entre tener una tienda que vende motos, versus tener múltiples tiendas operando en diferentes ciudades.",
      "Imagínate que en lugar de que tu dinero solo crezca, cada año adquieres nuevos tickets que te hacen propietario de más tiendas RiderMex que venden 480 motos anuales. Eso es el RiderMex Multiplicador."
    ],
    closing: [
      "Con RiderMex Multiplicador, no solo estás invirtiendo en tu futuro financiero, estás construyendo un imperio de tiendas de motocicletas que trabajarán para ti las 24 horas del día, los 365 días del año.",
      "RiderMex no es solo una inversión, es una revolución en el sector de venta de motocicletas. Mientras otros siguen jugando con números en pantallas, tú estarás construyendo un imperio real de tiendas que puedes ver, verificar y que generan utilidades reales."
    ]
  },

  visualExamples: {
    directComparison: {
      traditional: "INTERÉS COMPUESTO TRADICIONAL:\n$100,000 → $200,000 → $400,000 → $800,000\n(Solo números que crecen)",
      multiplier: "RIDERMEX MULTIPLICADOR:\n1 ticket → 3 tickets → 8 tickets → 25+ tickets\n(Tiendas reales que venden 480 motos/año y producen ingresos)"
    },
    avalancheEffect: [
      "Año 5: Tu primer ticket genera $14,400 anuales en utilidades",
      "Año 6: Las utilidades compran parte del ticket 2",
      "Año 8: Segundo ticket completo generando $28,800 anuales",
      "Año 9: Tickets 1 y 2 compran el ticket 3",
      "Año 11: Tickets 1, 2 y 3 compran los tickets 4 y 5",
      "Año 20: ¡Tienes un imperio de tiendas RiderMex trabajando para ti!"
    ]
  },

  uniqueBenefits: [
    {
      title: "DIVERSIFICACIÓN AUTOMÁTICA",
      description: "Cada nuevo ticket te hace propietario de múltiples tiendas en diferentes regiones"
    },
    {
      title: "ESCALABILIDAD EXPONENCIAL",
      description: "No hay límite en cuántos tickets puedes llegar a tener - el sistema se auto-alimenta con las utilidades"
    },
    {
      title: "PROTECCIÓN INFLACIONARIA",
      description: "Mientras la inflación devora el dinero tradicional, tus tickets se aprecian 5% anual + sistema de escalones"
    },
    {
      title: "HERENCIA TANGIBLE",
      description: "Dejas a tus hijos participación en tiendas reales y rentables, no solo números en una cuenta"
    }
  ],

  objections: [
    {
      objection: "¿No es lo mismo que cualquier inversión que reinvierte?",
      response: "No. Las inversiones tradicionales reinvierten en el mismo activo. RiderMex multiplica la CANTIDAD de tickets (tiendas). Es como la diferencia entre tener una tienda vendiendo motos versus tener múltiples tiendas."
    },
    {
      objection: "¿Qué pasa si quiero liquidez?",
      response: "RiderMex te permite retiros trimestrales flexibles. Recibe $3,600 por ticket cada trimestre mientras sigues multiplicando tu patrimonio en nuevas tiendas."
    },
    {
      objection: "¿Es muy riesgoso?",
      response: "Al contrario, es menos riesgoso porque diversificas automáticamente. En lugar de depender de una sola tienda, tienes múltiples tiendas en diferentes ciudades que se respaldan mutuamente."
    }
  ],

  callToAction: "RiderMex no es solo una inversión, es una revolución en inversiones respaldadas por activos reales de venta de motocicletas. Mientras otros siguen jugando con números en pantallas, tú estarás construyendo un imperio real de tiendas que puedes verificar y que generan utilidades reales trimestrales. ¿Estás listo para ser pionero de tu propia revolución financiera?",

  positioning: [
    "Una innovación financiera exclusiva de RiderMex",
    "La evolución natural del interés compuesto aplicado a venta de motocicletas",
    "Una ventaja competitiva que solo tus clientes tendrán acceso",
    "El futuro de las inversiones respaldadas por activos reales de retail de motocicletas"
  ]
};

// Re-export utility functions
export { getCompoundMultiplierExplanation, generateAvalancheTimeline } from '../utils/compoundInterestUtils';
