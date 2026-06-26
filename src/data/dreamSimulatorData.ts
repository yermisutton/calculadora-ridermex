import { Dream } from '../types/dreamSimulator';
import { GraduationCap, Home, Briefcase, Heart, PiggyBank, Building2, Plane, Baby, Stethoscope, Landmark, Leaf, Palmtree } from 'lucide-react';

export const predefinedDreams: Dream[] = [
  {
    id: 'retirement',
    name: 'Retiro Digno',
    description: 'Asegura un retiro cómodo y sin preocupaciones',
    category: 'retirement',
    icon: PiggyBank,
    difficulty: 'medium',
    timeline: 'long',
    monthlyGoal: 80000,
    timeframe: 20,
    certificatesNeeded: 8,
    impactMetrics: {
      environmentalImpact: {
        co2Reduction: 20,
        waterSaved: 50000,
        landPreserved: 8000
      },
      socialImpact: {
        jobsCreated: 4,
        familiesSupported: 8,
        communityProjects: 1.2
      },
      economicImpact: {
        localEconomyBoost: 0.8,
        taxContribution: 120000,
        sustainableGrowth: 1.5
      }
    },
    details: [
      'Ingreso mensual para mantener tu estilo de vida',
      'Cobertura de gastos médicos y emergencias',
      'Fondo para viajes y actividades recreativas',
      'Patrimonio heredable para la siguiente generación'
    ]
  },
  {
    id: 'early-retirement',
    name: 'Retiro Anticipado',
    description: 'Libertad financiera antes de los 50 años',
    category: 'retirement',
    icon: Landmark,
    difficulty: 'hard',
    timeline: 'medium',
    monthlyGoal: 120000,
    timeframe: 15,
    certificatesNeeded: 15,
    impactMetrics: {
      environmentalImpact: {
        co2Reduction: 37.5,
        waterSaved: 93750,
        landPreserved: 15000
      },
      socialImpact: {
        jobsCreated: 7.5,
        familiesSupported: 15,
        communityProjects: 2.25
      },
      economicImpact: {
        localEconomyBoost: 1.5,
        taxContribution: 225000,
        sustainableGrowth: 2.8
      }
    },
    details: [
      'Independencia financiera completa',
      'Libertad para dedicarte a tus pasiones',
      'Ingresos pasivos superiores a tus gastos',
      'Capacidad para reinvertir y seguir creciendo'
    ]
  },
  {
    id: 'education',
    name: 'Educación Universitaria',
    description: 'Asegura la educación superior de tus hijos',
    category: 'education',
    icon: GraduationCap,
    difficulty: 'medium',
    timeline: 'medium',
    monthlyGoal: 50000,
    timeframe: 15,
    certificatesNeeded: 5,
    impactMetrics: {
      environmentalImpact: {
        co2Reduction: 12.5,
        waterSaved: 31250,
        landPreserved: 5000
      },
      socialImpact: {
        jobsCreated: 2.5,
        familiesSupported: 5,
        communityProjects: 0.75
      },
      economicImpact: {
        localEconomyBoost: 0.5,
        taxContribution: 75000,
        sustainableGrowth: 0.9
      }
    },
    details: [
      'Cubre costos de matrícula y gastos universitarios',
      'Incluye posibilidad de estudios en el extranjero',
      'Fondo para maestría o especialización',
      'Reinversión de utilidades para maximizar rendimientos'
    ]
  },
  {
    id: 'dream-home',
    name: 'Casa de Ensueño',
    description: 'Adquiere la casa que siempre has soñado',
    category: 'home',
    icon: Home,
    difficulty: 'hard',
    timeline: 'medium',
    monthlyGoal: 70000,
    timeframe: 10,
    certificatesNeeded: 7,
    impactMetrics: {
      environmentalImpact: {
        co2Reduction: 17.5,
        waterSaved: 43750,
        landPreserved: 7000
      },
      socialImpact: {
        jobsCreated: 3.5,
        familiesSupported: 7,
        communityProjects: 1.05
      },
      economicImpact: {
        localEconomyBoost: 0.7,
        taxContribution: 105000,
        sustainableGrowth: 1.3
      }
    },
    details: [
      'Enganche para casa en zona residencial premium',
      'Fondo para remodelaciones y personalización',
      'Cobertura de gastos notariales y trámites',
      'Protección contra incrementos en el mercado inmobiliario'
    ]
  },
  {
    id: 'business',
    name: 'Negocio Propio',
    description: 'Emprende tu propio negocio',
    category: 'business',
    icon: Briefcase,
    difficulty: 'medium',
    timeline: 'short',
    monthlyGoal: 60000,
    timeframe: 8,
    certificatesNeeded: 6,
    impactMetrics: {
      environmentalImpact: {
        co2Reduction: 15,
        waterSaved: 37500,
        landPreserved: 6000
      },
      socialImpact: {
        jobsCreated: 3,
        familiesSupported: 6,
        communityProjects: 0.9
      },
      economicImpact: {
        localEconomyBoost: 0.6,
        taxContribution: 90000,
        sustainableGrowth: 1.1
      }
    },
    details: [
      'Capital inicial para emprendimiento',
      'Fondo de operación para los primeros meses',
      'Inversión en equipo y mobiliario',
      'Presupuesto para marketing y publicidad'
    ]
  },
  {
    id: 'world-travel',
    name: 'Vuelta al Mundo',
    description: 'Viaja por el mundo sin preocupaciones financieras',
    category: 'travel',
    icon: Plane,
    difficulty: 'easy',
    timeline: 'short',
    monthlyGoal: 30000,
    timeframe: 7,
    certificatesNeeded: 3,
    impactMetrics: {
      environmentalImpact: {
        co2Reduction: 7.5,
        waterSaved: 18750,
        landPreserved: 3000
      },
      socialImpact: {
        jobsCreated: 1.5,
        familiesSupported: 3,
        communityProjects: 0.45
      },
      economicImpact: {
        localEconomyBoost: 0.3,
        taxContribution: 45000,
        sustainableGrowth: 0.6
      }
    },
    details: [
      'Fondo para viajes internacionales',
      'Experiencias de lujo y aventura',
      'Flexibilidad para aprovechar oportunidades',
      'Ingresos en dólares para gastos internacionales'
    ]
  }
];
