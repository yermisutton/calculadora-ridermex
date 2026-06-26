import { ESCALONES, RIDERMEX_CONFIG } from './ridermexConfig';

export const RIDERMEX_EDUCATIONAL_CONTENT = {
  globalContext: {
    title: 'Contexto Global del Mercado de Motocicletas y Gig Economy',
    subtitle: 'Comprende el panorama global que respalda tu inversión y las ventajas competitivas únicas que ofrece México en este sector estratégico.',
    marketOverview: {
      globalMarket: {
        label: 'Mercado Global',
        value: '$125B',
        unit: 'USD anuales',
        description: 'Gig Economy & Delivery'
      },
      growth: {
        label: 'Crecimiento',
        value: '18%',
        unit: 'anual',
        description: 'Proyectado 2024-2030'
      },
      mexicoParticipation: {
        label: 'Participación MX',
        value: '8.5%',
        unit: 'del mercado',
        description: 'Emergente en LATAM'
      },
      economicImpact: {
        label: 'Impacto Económico',
        value: '$4.2B',
        unit: 'USD anuales',
        description: 'Movilidad & Entregas'
      }
    }
  },

  productiveAsset: {
    question: '¿Cuál es el activo productivo de RiderMex?',
    answer: 'Las motocicletas nuevas y seminuevas',
    details: [
      {
        title: 'Activo Central',
        description: 'Las motocicletas son herramientas de trabajo esencial para la Gig Economy (repartidores de Rappi, Uber Eats, Didi Food, etc.)',
        icon: 'Bike'
      },
      {
        title: 'No es Flota de Riders',
        description: 'No inviertes en una "flota de riders" ni en personal. Inviertes en el inventario físico de motos que se venden a través de las tiendas RiderMex.',
        icon: 'Users'
      },
      {
        title: 'Demanda Inelástica',
        description: 'Las motocicletas tienen una demanda garantizada porque son herramientas de trabajo, no productos de lujo. Usuarios independientes las necesitan para generar ingresos.',
        icon: 'TrendingUp'
      },
      {
        title: 'Herramienta de Independencia',
        description: 'Para muchos trabajadores rechazados por la banca tradicional, la moto es la puerta de entrada a la independencia financiera y generación de ingresos.',
        icon: 'Zap'
      }
    ]
  },

  investmentMechanic: {
    question: '¿Cómo funciona el producto de inversión de RiderMex?',
    answer: 'A través de un Fideicomiso de Administración (Patrimonio Autónomo)',
    mechanism: {
      title: 'Estructura de Inversión',
      steps: [
        {
          number: 1,
          title: 'Fideicomiso de Activos',
          description: 'Tu capital adquiere participación en una "bolsa" que compra inventario de motocicletas a precio de flotilla (mayoreo).'
        },
        {
          number: 2,
          title: 'Operación de Tienda',
          description: 'El fideicomiso opera tiendas RiderMex que venden motos a clientes finales (repartidores independientes).'
        },
        {
          number: 3,
          title: 'Cobro de Contado',
          description: 'RiderMex cobra en 24-48 horas gracias a alianzas con financieras (Galgo, Maxikash, Atrato). El cliente financia con ellas, no contigo.'
        },
        {
          number: 4,
          title: 'Reparto de Utilidades',
          description: 'Las utilidades se distribuyen trimestralmente entre los accionistas según su participación en tickets adquiridos.'
        }
      ]
    },
    trustStructure: {
      title: 'Estructura de Fideicomisos',
      trusts: [
        {
          name: 'Fideicomiso de Activos y Contratos',
          purpose: 'Mantiene la propiedad legal de la tienda, inventario y contratos de operación',
          benefit: 'Garantiza la protección del patrimonio'
        },
        {
          name: 'Fideicomiso Operativo',
          purpose: 'Administra la operación diaria de la tienda: ventas, gestión de personal, logística',
          benefit: 'Asegura operación profesional y transparencia'
        },
        {
          name: 'Fideicomiso de Cobro y Reparto',
          purpose: 'Recibe los ingresos de ventas y distribuye utilidades a inversores',
          benefit: 'Elimina riesgo de cobranza para el inversionista'
        }
      ]
    }
  },

  keyIndicators: {
    question: '¿Cuáles son los conceptos clave que definen el éxito de RiderMex?',
    indicators: [
      {
        title: 'Rotación de Inventario',
        value: '21-30 días',
        description: 'El dinero se mueve rápido. Las motos se venden en promedio cada 21 a 30 días, garantizando liquidez constante.',
        icon: 'Repeat'
      },
      {
        title: 'Volumen de Ventas',
        value: `${RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR} motos/año`,
        description: `Escenario moderado: una tienda vende ${RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR} motocicletas al año (${RIDERMEX_CONFIG.MOTORCYCLES_PER_MONTH} mensuales). Esto genera un flujo predecible de ingresos.`,
        icon: 'BarChart3'
      },
      {
        title: 'Utilidad por Unidad',
        value: `$${RIDERMEX_CONFIG.PROFIT_PER_MOTORCYCLE} MXN`,
        description: 'Margen de ganancia promedio neto por cada moto vendida. A mayor volumen, mayor utilidad agregada.',
        icon: 'DollarSign'
      },
      {
        title: 'Pool de Utilidades Anual',
        value: `$${RIDERMEX_CONFIG.ANNUAL_PROFIT_POOL.toLocaleString()} MXN`,
        description: `Generado por tienda: ${RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR} motos × $${RIDERMEX_CONFIG.PROFIT_PER_MOTORCYCLE} MXN = $${RIDERMEX_CONFIG.ANNUAL_PROFIT_POOL.toLocaleString()} en utilidades estimadas que se distribuyen entre accionistas.`,
        icon: 'Wallet'
      },
      {
        title: 'Cobro Rápido',
        value: '24-48 horas',
        description: 'Gracias a alianzas con financieras (Maxikash, Galgo, Atrato), RiderMex cobra de contado. Tú nunca cobraš al cliente final.',
        icon: 'Clock'
      },
      {
        title: 'Arsenal de Ventas',
        value: 'Psicología Aplicada',
        description: 'Muro de las Llaves, Campana de Libertad, y otras técnicas probadas aseguran cierres masivos y rotación acelerada.',
        icon: 'Target'
      }
    ],
    importantNote: 'Los ingresos vienen del MARGEN DE VENTA y COMISIONES FINANCIERAS, no de ingresos por viajes de riders. Tú no participas en la operación de entregas, solo en las ganancias de venta.'
  },

  growthMultiples: {
    question: '¿Cuáles son los múltiplos de crecimiento en RiderMex?',
    importantClarity: 'La cifra de "12 certificados en 25 años" corresponde a modelos agrícolas (Citrus/CosechaCAPITAL). Para RiderMex, el crecimiento se mide así:',
    metrics: [
      {
        title: 'Escala de Precios (8 Escalones)',
        description: `Existen ${RIDERMEX_CONFIG.TOTAL_ESCALONES} niveles de inversión. El precio del ticket inicia en $${ESCALONES[0].entryPrice.toLocaleString()} MXN (${ESCALONES[0].name}) y escala progresivamente hasta $${RIDERMEX_CONFIG.BASE_CALCULATION_PRICE.toLocaleString()} MXN (${ESCALONES[ESCALONES.length - 1].name}).`,
        details: ESCALONES.map(e => `Escalón ${e.number} - ${e.name}: $${e.entryPrice.toLocaleString()} MXN (Tickets ${e.ticketStart}-${e.ticketEnd})`),
        implication: 'Inversores tempranos acceden a precios más bajos con mayor ROI. Conforme crece la demanda, los nuevos inversores pagan más, creando plusvalía.'
      },
      {
        title: 'Rendimiento Anual Estimado',
        description: `Objetivo de retorno: ${RIDERMEX_CONFIG.TARGET_ROI_MIN}% a ${RIDERMEX_CONFIG.TARGET_ROI_MAX}% anual (estimado ${ESCALONES[ESCALONES.length - 1].roi}% a ${ESCALONES[0].roi}% segun escalon)`,
        details: [
          `Retorno anual estimado por ticket: $${RIDERMEX_CONFIG.ANNUAL_RETURN_PER_TICKET.toLocaleString()} MXN`,
          `Retorno trimestral estimado: $${RIDERMEX_CONFIG.QUARTERLY_PAYMENT.toLocaleString()} MXN`,
          `ROI estimado sobre inversión inicial: ${ESCALONES[ESCALONES.length - 1].roi}% (Escalón ${RIDERMEX_CONFIG.TOTAL_ESCALONES}) a ${ESCALONES[0].roi}% (Escalón 1)`
        ],
        implication: 'Superior a inversiones tradicionales (CETES, ahorros bancarios, inflación).'
      },
      {
        title: 'Apreciación Estimada de Tickets (5% anual)',
        description: 'Además del rendimiento estimado, tu ticket se aprecia en valor a medida que crece la empresa.',
        details: [
          `Año 1: Tu ticket de $${ESCALONES[0].entryPrice.toLocaleString()} (${ESCALONES[0].name}) vale $${Math.round(ESCALONES[0].entryPrice * 1.05).toLocaleString()}`,
          'Año 5: Vale $89,337',
          'Año 10: Vale $114,022',
          'Año 25: Vale $237,217'
        ],
        implication: 'Efecto exponencial estimado: rendimiento + apreciación + reinversión compuesta.'
      },
      {
        title: 'Efecto Bola de Nieve (Reinversión)',
        description: 'Al reinvertir utilidades trimestrales estimadas, tu capital crece exponencialmente.',
        details: [
          `Inversión inicial: 1 ticket ($${ESCALONES[0].entryPrice.toLocaleString()} - ${ESCALONES[0].name})`,
          'Año 1: ~1.05 tickets (rendimiento estimado ~20% + apreciación 5%)',
          'Año 5: ~2.6 tickets (estimado)',
          'Año 10: ~6.7 tickets (estimado)',
          'Año 25: ~100+ tickets (estimado con reinversión compuesta)'
        ],
        implication: 'De 1 ticket a una cartera estimada de decenas de tickets en 25 años.'
      }
    ]
  },

  socialEnvironmentalImpact: {
    question: '¿Cuál es el impacto social y ambiental de RiderMex?',
    socialImpact: {
      title: 'Impacto Social: Democratización del Acceso',
      description: 'RiderMex dice "SÍ" cuando otros dicen "NO"',
      aspects: [
        {
          title: 'Acceso a Herramientas de Trabajo',
          description: 'Proporciona motocicletas a personas rechazadas por la banca tradicional, permitiéndoles generar ingresos independientes.',
          metrics: ['Personas capacitadas', 'Motocicletas distribuidas', 'Ingresos generados']
        },
        {
          title: 'Independencia Financiera',
          description: 'Empodera a trabajadores para ser sus propios jefes en la economía de plataformas (Rappi, Uber Eats, Didi, etc.).',
          metrics: ['Ingresos promedio mensual', 'Tasa de retención', 'Satisfacción de usuarios']
        },
        {
          title: 'Inclusión Financiera',
          description: 'Crea rutas de acceso a crédito y activos para poblaciones sin historial crediticio.',
          metrics: ['Nuevos emprendedores', 'Acceso a crédito post-RiderMex', 'Mejora en score crediticio']
        }
      ]
    },
    environmentalImpact: {
      title: 'Impacto Ambiental: Movilidad Eficiente',
      description: 'Las motocicletas como solución sostenible',
      aspects: [
        {
          title: 'Eficiencia de Combustible',
          description: 'Las motos consumen 60-70% menos combustible que automóviles. Una moto recorre 50-60 km/litro vs. auto que recorre 12-15 km/litro.',
          metrics: ['Km por litro', 'Reducción de emisiones', 'Ahorro anual en combustible']
        },
        {
          title: 'Reducción de Congestión',
          description: 'Las entregas por moto son más rápidas y ocupan menos espacio vial que camionetas o autos.',
          metrics: ['Tiempo de entrega reducido', 'Ocupación de vía reducida', 'Eficiencia urbana']
        },
        {
          title: 'Motos Eléctricas (Futuro)',
          description: 'Aunque actualmente se enfoca en motos a gasolina, existe potencial para transición a motos eléctricas a medida que el mercado lo permita.',
          metrics: ['Motos eléctricas disponibles', 'Plan de transición', 'Reducción de emisiones proyectada']
        }
      ]
    },
    combined: {
      title: 'Impacto Integrado',
      description: 'RiderMex crea un ecosistema donde inversión financiera, empleo, movilidad y sostenibilidad convergen.',
      outcomes: [
        'Personas con mejor calidad de vida',
        'Ciudades con movilidad más eficiente',
        'Inversores con retornos estimados superiores',
        'Ecosistema de emprendimiento robusto'
      ]
    }
  },

  comparisonWithTraditional: {
    title: 'RiderMex vs. Inversiones Tradicionales',
    comparisons: [
      {
        category: 'Ahorros Bancarios (3% anual)',
        ridermex: {
          rate: '19-20% (estimado)',
          advantage: '6.3x superior (estimado)'
        },
        details: 'En 25 años: Banco = 2.1x capital. RiderMex = 65x capital estimado (con reinversión).'
      },
      {
        category: 'CETES (10% anual)',
        ridermex: {
          rate: '19-20% (estimado)',
          advantage: '2x superior (estimado)'
        },
        details: 'En 25 años: CETES = 11x capital. RiderMex = 65x capital estimado (con reinversión).'
      },
      {
        category: 'Bolsa de Valores (12% anual, volátil)',
        ridermex: {
          rate: '19-20% (estimado)',
          advantage: 'Más estable + mayor retorno estimado'
        },
        details: 'RiderMex: modelo de negocio demostrado, riesgo diversificado, activo físico tangible.'
      }
    ]
  },

  riskFactors: {
    title: 'Factores de Riesgo y Mitigación',
    risks: [
      {
        risk: 'Dependencia del sector automotriz',
        mitigation: 'Alianzas de financiamiento garantizan demanda constante'
      },
      {
        risk: 'Liquidez no inmediata',
        mitigation: 'Plazos de 18-25 años; mercado secundario en desarrollo'
      },
      {
        risk: 'Operación de tienda',
        mitigation: 'Fideicomiso operativo con equipo profesional, no depende del inversor'
      },
      {
        risk: 'Regulación de Gig Economy',
        mitigation: 'RiderMex enfatiza compliance y relaciones con plataformas'
      }
    ]
  }
};

export const getRidermexFacts = () => [
  `${RIDERMEX_CONFIG.MOTORCYCLES_PER_YEAR} motocicletas se venden por tienda al año`,
  `Utilidad promedio de $${RIDERMEX_CONFIG.PROFIT_PER_MOTORCYCLE} MXN por moto`,
  `Rotación de inventario cada ${RIDERMEX_CONFIG.INVENTORY_ROTATION_DAYS_MIN}-${RIDERMEX_CONFIG.INVENTORY_ROTATION_DAYS_MAX} días`,
  `Cobro ágil en ${RIDERMEX_CONFIG.CASH_COLLECTION_HOURS} horas`,
  `${RIDERMEX_CONFIG.TOTAL_ESCALONES} escalones de precios: desde $${ESCALONES[0].entryPrice.toLocaleString()} (${ESCALONES[0].name}) hasta $${RIDERMEX_CONFIG.BASE_CALCULATION_PRICE.toLocaleString()} (${ESCALONES[ESCALONES.length - 1].name})`,
  `Rendimiento anual estimado: ${RIDERMEX_CONFIG.TARGET_ROI_MIN}-${RIDERMEX_CONFIG.TARGET_ROI_MAX}%`,
  `Retorno trimestral estimado: $${RIDERMEX_CONFIG.QUARTERLY_PAYMENT.toLocaleString()} MXN por ticket`,
  'En 25 años: de 1 ticket a 100+ tickets estimados (con reinversión)',
  '3 fideicomisos protegen tu inversión',
  'Activo tangible: motocicletas reales, no virtuales'
];
