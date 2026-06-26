import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../../utils/formatters';
import { ShineEffect } from './TikTokAnimations';

interface AnimatedNumberDisplayProps {
  value: number;
  currencyFormat?: 'MXN' | 'USD' | 'EUR';
  className?: string;
  duration?: number;
  staggerDelay?: number;
  isCurrency?: boolean; // New prop to control currency formatting
  prefix?: string; // Custom prefix (e.g., "$")
  suffix?: string; // Custom suffix (e.g., "%")
  decimals?: number; // Optional number of decimal places
}

const AnimatedNumberDisplay: React.FC<AnimatedNumberDisplayProps> = ({
  value,
  currencyFormat,
  className = '',
  duration = 1.2,
  staggerDelay = 0.08,
  isCurrency = false, // Default to false, only format as currency if explicitly requested
  prefix = '',
  suffix = '',
  decimals
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true);

      // Animate the number change with a slight delay to create the train station effect
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setTimeout(() => setIsAnimating(false), duration * 1000);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [value, displayValue, duration]);

  // Format the value based on props
  let formattedValue: string;
  if (prefix || suffix) {
    // Use prefix/suffix format
    const numberString = decimals !== undefined 
      ? Number(displayValue.toFixed(decimals)).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : Math.round(displayValue).toLocaleString();
    formattedValue = `${prefix}${numberString}${suffix}`;
  } else if (isCurrency && currencyFormat) {
    // Use currency format
    formattedValue = formatCurrency(displayValue, currencyFormat);
  } else {
    // Plain number format
    formattedValue = decimals !== undefined
      ? Number(displayValue.toFixed(decimals)).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : Math.round(displayValue).toLocaleString();
  }

  const characters = formattedValue.split('');

  return (
    <ShineEffect duration={isAnimating ? 1.2 : 3} delay={0.2}>
      <div className={`inline-flex items-center ${className}`}>
        <AnimatePresence mode="wait">
          {characters.map((char, index) => {
            const isDigit = /\d/.test(char);

            return (
              <motion.span
                key={`${displayValue}-${index}-${char}`}
                className={`inline-block ${isDigit ? 'font-mono font-bold' : ''}`}
                initial={{
                  y: isDigit ? -30 : 0,
                  opacity: isDigit ? 0 : 1,
                  rotateX: isDigit ? -90 : 0,
                  scale: isDigit ? 0.5 : 1
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                  rotateX: 0,
                  scale: [0.5, 1.1, 1]
                }}
                exit={{
                  y: isDigit ? 30 : 0,
                  opacity: isDigit ? 0 : 1,
                  rotateX: isDigit ? 90 : 0,
                  scale: isDigit ? 0.5 : 1
                }}
                transition={{
                  duration: duration * 0.8,
                  delay: isDigit ? index * staggerDelay : 0,
                  ease: [0.34, 1.56, 0.64, 1],
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                style={{
                  transformOrigin: 'center center',
                  transformStyle: 'preserve-3d',
                  filter: isAnimating && isDigit ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))' : 'none'
                }}
              >
                {char}
              </motion.span>
            );
          })}
        </AnimatePresence>
      </div>
    </ShineEffect>
  );
};

export default AnimatedNumberDisplay;