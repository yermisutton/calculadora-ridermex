interface ColorScheme {
  gradient: string;
  bg: string;
  text: string;
  accent: string;
  border: string;
  lightBg: string;
  icon: string;
}

const colorSchemes: Record<string, ColorScheme> = {
  orange: {
    gradient: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-500',
    text: 'text-orange-600',
    accent: 'text-orange-500',
    border: 'border-orange-200',
    lightBg: 'bg-orange-50',
    icon: 'text-orange-600',
  },
  red: {
    gradient: 'from-red-500 to-red-600',
    bg: 'bg-red-500',
    text: 'text-red-600',
    accent: 'text-red-500',
    border: 'border-red-200',
    lightBg: 'bg-red-50',
    icon: 'text-red-600',
  },
  green: {
    gradient: 'from-green-500 to-green-600',
    bg: 'bg-green-500',
    text: 'text-green-600',
    accent: 'text-green-500',
    border: 'border-green-200',
    lightBg: 'bg-green-50',
    icon: 'text-green-600',
  },
  blue: {
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-500',
    text: 'text-blue-600',
    accent: 'text-blue-500',
    border: 'border-blue-200',
    lightBg: 'bg-blue-50',
    icon: 'text-blue-600',
  },
  purple: {
    gradient: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-500',
    text: 'text-purple-600',
    accent: 'text-purple-500',
    border: 'border-purple-200',
    lightBg: 'bg-purple-50',
    icon: 'text-purple-600',
  },
  cyan: {
    gradient: 'from-cyan-500 to-cyan-600',
    bg: 'bg-cyan-500',
    text: 'text-cyan-600',
    accent: 'text-cyan-500',
    border: 'border-cyan-200',
    lightBg: 'bg-cyan-50',
    icon: 'text-cyan-600',
  },
  amber: {
    gradient: 'from-amber-500 to-amber-600',
    bg: 'bg-amber-500',
    text: 'text-amber-600',
    accent: 'text-amber-500',
    border: 'border-amber-200',
    lightBg: 'bg-amber-50',
    icon: 'text-amber-600',
  },
};

export interface Calculator {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  color: keyof typeof colorSchemes;
  action: () => void;
}

const colorOrder = [
  'orange',
  'red',
  'green',
  'blue',
  'purple',
  'cyan',
  'amber',
];

export const getColorForCalculator = (index: number): ColorScheme => {
  const colorKey = colorOrder[index % colorOrder.length];
  return colorSchemes[colorKey];
};

export const getColorKeyForCalculator = (index: number): keyof typeof colorSchemes => {
  return colorOrder[index % colorOrder.length] as keyof typeof colorSchemes;
};

export const getColorScheme = (colorKey: string): ColorScheme => {
  return colorSchemes[colorKey as keyof typeof colorSchemes] || colorSchemes.orange;
};

export default colorSchemes;
