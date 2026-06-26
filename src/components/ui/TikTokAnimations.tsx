import React from 'react';
import { motion } from 'framer-motion';

export const CountUpNumber: React.FC<{
  value: number;
  duration?: number;
  delay?: number;
  isCurrency?: boolean;
  currencySymbol?: string;
  suffix?: string;
  className?: string;
}> = ({
  value,
  duration = 1.5,
  delay = 0,
  isCurrency = false,
  currencySymbol = '$',
  suffix = '',
  className = ''
}) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = value * easeOutQuart;

      setDisplayValue(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    const timeout = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate);
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrame);
    };
  }, [value, duration, delay]);

  const formatted = isCurrency
    ? `${currencySymbol}${Math.round(displayValue).toLocaleString()}`
    : Math.round(displayValue).toLocaleString();

  return (
    <motion.span
      className={className}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      {formatted}{suffix}
    </motion.span>
  );
};

export const PulseGlow: React.FC<{
  children: React.ReactNode;
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}> = ({ children, color = 'green', intensity = 'medium', className = '' }) => {
  const glowIntensity = {
    low: 0.3,
    medium: 0.6,
    high: 1
  };

  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        boxShadow: [
          `0 0 0px rgba(${color === 'green' ? '16, 185, 129' : '59, 130, 246'}, 0)`,
          `0 0 ${20 * glowIntensity[intensity]}px rgba(${color === 'green' ? '16, 185, 129' : '59, 130, 246'}, ${glowIntensity[intensity]})`,
          `0 0 0px rgba(${color === 'green' ? '16, 185, 129' : '59, 130, 246'}, 0)`
        ]
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: [0.4, 0, 0.6, 1]
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerReveal: React.FC<{
  children: React.ReactNode[];
  delayBetween?: number;
  className?: string;
}> = ({ children, delayBetween = 0.1, className = '' }) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.5,
            delay: index * delayBetween,
            ease: "easeOut"
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};

export const FlipCard: React.FC<{
  front: React.ReactNode;
  back: React.ReactNode;
  isFlipped: boolean;
  duration?: number;
  className?: string;
}> = ({ front, back, isFlipped, duration = 0.6, className = '' }) => {
  return (
    <div className={`relative ${className}`} style={{ perspective: '1000px' }}>
      <motion.div
        className="w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration, ease: "easeInOut" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="absolute w-full h-full backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
        </div>
        <div
          className="absolute w-full h-full backface-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
};

export const SlideUp: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}> = ({ children, delay = 0, duration = 0.5, className = '' }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.34, 1.56, 0.64, 1],
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
    >
      {children}
    </motion.div>
  );
};

export const ScaleIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}> = ({ children, delay = 0, duration = 0.5, className = '' }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration,
        delay,
        type: "spring",
        stiffness: 120,
        damping: 18
      }}
    >
      {children}
    </motion.div>
  );
};

export const ShineEffect: React.FC<{
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}> = ({ children, duration = 1.5, delay = 0, className = '' }) => {
  return (
    <span className={`relative overflow-hidden inline-block ${className}`}>
      {children}
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 pointer-events-none"
        initial={{ x: '-100%', skewX: -20 }}
        animate={{ x: '200%' }}
        transition={{
          duration,
          delay,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 3
        }}
      />
    </span>
  );
};

export const BeforeAfterSlide: React.FC<{
  before: React.ReactNode;
  after: React.ReactNode;
  showAfter: boolean;
  duration?: number;
  className?: string;
}> = ({ before, after, showAfter, duration = 0.7, className = '' }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={false}
        animate={{ x: showAfter ? '-100%' : '0%' }}
        transition={{ duration, ease: [0.32, 0.72, 0, 1] }}
        className="flex w-[200%]"
      >
        <div className="w-1/2 flex-shrink-0">{before}</div>
        <div className="w-1/2 flex-shrink-0">{after}</div>
      </motion.div>
    </div>
  );
};

export const ProgressBar: React.FC<{
  progress: number;
  duration?: number;
  delay?: number;
  color?: string;
  height?: string;
  showPercentage?: boolean;
  className?: string;
}> = ({
  progress,
  duration = 1.5,
  delay = 0,
  color = 'bg-green-500',
  height = 'h-4',
  showPercentage = true,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className={`w-full ${height} bg-gray-200 rounded-full overflow-hidden`}>
        <motion.div
          className={`${height} ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            duration,
            delay,
            ease: [0.25, 0.1, 0.25, 1]
          }}
        />
      </div>
      {showPercentage && (
        <motion.div
          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-full ml-2 font-bold text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + duration * 0.5 }}
        >
          {Math.round(progress)}%
        </motion.div>
      )}
    </div>
  );
};

export const PulseScale: React.FC<{
  children: React.ReactNode;
  scale?: number;
  duration?: number;
  className?: string;
}> = ({ children, scale = 1.05, duration = 1, className = '' }) => {
  return (
    <motion.div
      className={className}
      animate={{ scale: [1, scale, 1] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export const TypeWriter: React.FC<{
  text: string;
  duration?: number;
  delay?: number;
  className?: string;
}> = ({ text, duration = 2, delay = 0, className = '' }) => {
  const [displayText, setDisplayText] = React.useState('');

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      const chars = text.split('');
      const timePerChar = (duration * 1000) / chars.length;
      let currentIndex = 0;

      const interval = setInterval(() => {
        if (currentIndex < chars.length) {
          setDisplayText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, timePerChar);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [text, duration, delay]);

  return <span className={className}>{displayText}</span>;
};

export const PopIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = '' }) => {
  return (
    <motion.div
      className={className}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.1, 1], opacity: 1 }}
      transition={{
        duration: 0.5,
        delay,
        times: [0, 0.6, 1],
        ease: [0.34, 1.56, 0.64, 1],
        type: "spring",
        stiffness: 150,
        damping: 12
      }}
    >
      {children}
    </motion.div>
  );
};
