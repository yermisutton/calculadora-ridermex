import { LucideIcon } from 'lucide-react';

export type DreamCategory =
  | 'retirement'
  | 'education'
  | 'travel'
  | 'home'
  | 'business'
  | 'family'
  | 'health'
  | 'legacy'
  | 'custom';

export type DreamDifficulty = 'easy' | 'medium' | 'hard' | 'very-hard';

export type DreamTimeline = 'short' | 'medium' | 'long' | 'very-long';

export interface Dream {
  id: string;
  name: string;
  description: string;
  category: DreamCategory;
  icon: LucideIcon;
  difficulty: DreamDifficulty;
  timeline: DreamTimeline;
  monthlyGoal: number;
  timeframe: number;
  certificatesNeeded: number;
  impactMetrics: ImpactMetrics;
  details: string[];
  isCustom?: boolean;
}

export interface DreamConfig {
  id: string;
  monthlyGoal: number;
  timeframe: number;
  certificatesNeeded: number;
  isCustom: boolean;
  reinvestProfits?: boolean;
  name?: string;
  description?: string;
}

export interface DreamProjection {
  year: number;
  certificatePrice: number;
  totalCertificates: number;
  producingCertificates: number;
  waitingCertificates: number;
  yearlyUtility: number;
  monthlyIncome: number;
  patrimony: number;
  progressToGoal: number;
  realPatrimony: number;
  realMonthlyIncome: number;
}

export interface ImpactMetrics {
  environmentalImpact: {
    co2Reduction: number;
    waterSaved: number;
    landPreserved: number;
  };
  socialImpact: {
    jobsCreated: number;
    familiesSupported: number;
    communityProjects: number;
  };
  economicImpact: {
    localEconomyBoost: number;
    taxContribution: number;
    sustainableGrowth: number;
  };
}

export interface PortfolioComparisonData {
  currentPortfolio: {
    stocks: number;
    bonds: number;
    realEstate: number;
    savings: number;
    other: number;
  };
  proposedPortfolio: {
    stocks: number;
    bonds: number;
    realEstate: number;
    savings: number;
    ridermex: number;
    other: number;
  };
  riskProfile: {
    currentRisk: number;
    proposedRisk: number;
    volatility: {
      current: number;
      proposed: number;
    };
    diversification: {
      current: number;
      proposed: number;
    };
  };
  returnProjections: {
    current: {
      fiveYear: number;
      tenYear: number;
      twentyYear: number;
    };
    proposed: {
      fiveYear: number;
      tenYear: number;
      twentyYear: number;
    };
  };
}

export interface DreamSimulatorState {
  selectedDream: Dream | null;
  dreamConfig: DreamConfig | null;
  dreamProjections: DreamProjection[];
  portfolioComparison: PortfolioComparisonData | null;
  activeView: 'selection' | 'configuration' | 'impact' | 'portfolio' | 'results' | 'createCustomDream' | 'animations' | 'compoundInterest';
}
