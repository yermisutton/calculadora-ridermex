import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`ds-card ${className}`}>{children}</div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  const variantClass = variant === 'primary' ? 'ds-button-primary' : 'ds-button-secondary';
  const sizeClass = {
    sm: 'text-sm px-3xs py-1',
    md: 'text-base px-md py-2xs',
    lg: 'text-lg px-lg py-3xs',
  }[size];

  return (
    <button
      className={`${variantClass} ${sizeClass} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, helper, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="ds-label">{label}</label>}
    <input className={`ds-input ${className}`} {...props} />
    {error && <p className="text-neon-red text-sm mt-1">{error}</p>}
    {helper && !error && <p className="text-neutral-500 text-sm mt-1">{helper}</p>}
  </div>
);

interface HeadingProps {
  level?: 'xl' | 'lg' | 'md' | 'sm';
  children: React.ReactNode;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({ level = 'lg', children, className = '' }) => {
  const classes = {
    xl: 'ds-heading-xl',
    lg: 'ds-heading-lg',
    md: 'ds-heading-md',
    sm: 'ds-heading-sm',
  }[level];

  const Tag = `h${level === 'xl' ? 1 : level === 'lg' ? 2 : level === 'md' ? 3 : 4}` as keyof JSX.IntrinsicElements;

  return React.createElement(Tag, { className: `${classes} ${className}` }, children);
};

interface TextProps {
  size?: 'base' | 'sm';
  accent?: 'red' | 'green' | 'default';
  className?: string;
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({ size = 'base', accent = 'default', className = '', children }) => {
  const sizeClass = size === 'base' ? 'ds-text-base' : 'ds-text-sm';
  const accentClass =
    accent === 'red' ? 'ds-accent-red' : accent === 'green' ? 'ds-accent-green' : '';

  return <p className={`${sizeClass} ${accentClass} ${className}`}>{children}</p>;
};

interface ProgressBarProps {
  percentage: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, className = '' }) => (
  <div className={`ds-progress-bar ${className}`}>
    <div className="ds-progress-bar-fill" style={{ width: `${Math.min(percentage, 100)}%` }} />
  </div>
);

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepLabels = [],
}) => (
  <div className="w-full">
    <div className="flex items-center justify-between mb-md gap-2">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`flex-1 h-2 rounded-full transition-all duration-300 ${
            i < currentStep
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg'
              : i === currentStep
                ? 'bg-gradient-to-r from-blue-500 to-emerald-500 shadow-md'
                : 'bg-slate-700/50 border border-slate-600/50'
          }`}
        />
      ))}
    </div>
    {stepLabels.length > 0 && (
      <div className="text-center text-sm text-slate-400">
        Paso {currentStep + 1} de {totalSteps}
      </div>
    )}
  </div>
);
