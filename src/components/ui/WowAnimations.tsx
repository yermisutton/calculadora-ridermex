import React from 'react';
import { motion, useAnimation } from 'framer-motion';

export const FireworksBurst: React.FC<{
  trigger: boolean;
  count?: number;
  className?: string;
}> = ({ trigger, count = 40, className = '' }) => {
  const [bursts, setBursts] = React.useState<Array<{
    id: number;
    x: number;
    y: number;
    particles: Array<{ angle: number; distance: number; color: string; delay: number }>;
  }>>([]);

  React.useEffect(() => {
    if (trigger) {
      const newBursts = Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: 15 + (i * 15),
        y: 20 + Math.random() * 40,
        particles: Array.from({ length: count / 6 }, (_, j) => ({
          angle: (j / (count / 6)) * Math.PI * 2,
          distance: 80 + Math.random() * 120,
          color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#FF00FF'][Math.floor(Math.random() * 6)],
          delay: i * 0.15
        }))
      }));
      setBursts(newBursts);
    }
  }, [trigger, count]);

  if (!trigger) return null;

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden z-50 ${className}`}>
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="absolute"
          style={{ left: `${burst.x}%`, top: `${burst.y}%` }}
        >
          {burst.particles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{ backgroundColor: particle.color, boxShadow: `0 0 10px ${particle.color}` }}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{
                x: Math.cos(particle.angle) * particle.distance,
                y: Math.sin(particle.angle) * particle.distance,
                scale: 0,
                opacity: 0
              }}
              transition={{
                duration: 1.8,
                delay: particle.delay,
                ease: [0.22, 1, 0.36, 1]
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const ScreenShake: React.FC<{
  children: React.ReactNode;
  trigger: boolean;
  intensity?: number;
  className?: string;
}> = ({ children, trigger, intensity = 25, className = '' }) => {
  const controls = useAnimation();

  React.useEffect(() => {
    if (trigger) {
      controls.start({
        x: [0, -intensity, intensity, -intensity, intensity, -intensity, intensity, 0],
        y: [0, intensity, -intensity, intensity, -intensity, intensity, -intensity, 0],
        transition: { duration: 0.5, ease: "easeInOut" }
      });
    }
  }, [trigger, intensity, controls]);

  return (
    <motion.div className={className} animate={controls}>
      {children}
    </motion.div>
  );
};

export const NumberFlip3D: React.FC<{
  value: number;
  duration?: number;
  isCurrency?: boolean;
  currencySymbol?: string;
  className?: string;
}> = ({ value, duration = 2, isCurrency = true, currencySymbol = '$', className = '' }) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const steps = 60;
    const increment = (value - displayValue) / steps;
    let current = 0;

    const interval = setInterval(() => {
      current++;
      if (current <= steps) {
        setDisplayValue(prev => Math.min(value, prev + Math.abs(increment)));
      } else {
        setDisplayValue(value);
        clearInterval(interval);
      }
    }, (duration * 1000) / steps);

    return () => clearInterval(interval);
  }, [value, duration]);

  const formatted = isCurrency
    ? `${currencySymbol}${Math.round(displayValue).toLocaleString()}`
    : Math.round(displayValue).toLocaleString();

  return (
    <div className={`relative ${className}`} style={{ perspective: '2000px' }}>
      <motion.div
        animate={{ rotateX: [0, 360, 720, 1080], scale: [1, 1.2, 1] }}
        transition={{
          duration: duration,
          ease: [0.34, 1.56, 0.64, 1],
          repeat: Infinity,
          repeatDelay: 2
        }}
        style={{
          transformStyle: 'preserve-3d',
          textShadow: '0 0 30px rgba(0,255,0,0.8)'
        }}
        className="font-mono font-extrabold"
      >
        {formatted}
      </motion.div>
    </div>
  );
};

export const NeonText: React.FC<{
  children: React.ReactNode;
  color?: string;
  intensity?: number;
  className?: string;
}> = ({ children, color = '#00ff00', intensity = 30, className = '' }) => {
  return (
    <motion.div
      className={className}
      style={{
        color,
        fontWeight: 900,
        textShadow: `
          0 0 ${intensity}px ${color},
          0 0 ${intensity * 2}px ${color},
          0 0 ${intensity * 3}px ${color},
          0 0 ${intensity * 4}px ${color}
        `
      }}
      animate={{
        textShadow: [
          `0 0 ${intensity}px ${color}, 0 0 ${intensity * 2}px ${color}, 0 0 ${intensity * 3}px ${color}, 0 0 ${intensity * 4}px ${color}`,
          `0 0 ${intensity * 2}px ${color}, 0 0 ${intensity * 3}px ${color}, 0 0 ${intensity * 4}px ${color}, 0 0 ${intensity * 6}px ${color}`,
          `0 0 ${intensity}px ${color}, 0 0 ${intensity * 2}px ${color}, 0 0 ${intensity * 3}px ${color}, 0 0 ${intensity * 4}px ${color}`
        ]
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export const LaserScan: React.FC<{
  children: React.ReactNode;
  duration?: number;
  color?: string;
  className?: string;
}> = ({ children, duration = 2, color = '#00ff00', className = '' }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <motion.div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${color} 50%, transparent 100%)`,
          height: '6px',
          opacity: 0.9,
          boxShadow: `0 0 30px ${color}, 0 0 60px ${color}`
        }}
        animate={{
          top: ['-10%', '110%']
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

export const GlitchEffect: React.FC<{
  children: React.ReactNode;
  trigger: boolean;
  className?: string;
}> = ({ children, trigger, className = '' }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={trigger ? {
        x: [0, -5, 5, -5, 5, 0],
        skew: [0, -2, 2, -2, 2, 0],
        opacity: [1, 0.8, 1, 0.8, 1]
      } : {}}
      transition={{
        duration: 0.3,
        ease: "easeInOut"
      }}
    >
      {children}
      {trigger && (
        <>
          <motion.div
            className="absolute inset-0 mix-blend-screen"
            style={{ color: '#00ffff', left: '-2px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0] }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
          <motion.div
            className="absolute inset-0 mix-blend-screen"
            style={{ color: '#ff00ff', left: '2px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0] }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export const ElectricBorder: React.FC<{
  children: React.ReactNode;
  color?: string;
  className?: string;
}> = ({ children, color = '#00ffff', className = '' }) => {
  return (
    <div className={`relative p-1 ${className}`}>
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `linear-gradient(90deg, ${color}, transparent, ${color})`,
          opacity: 0.8
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <div className="relative bg-gray-900 rounded-2xl">
        {children}
      </div>
    </div>
  );
};

export const HologramEffect: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        background: 'linear-gradient(180deg, rgba(0,255,255,0.1), rgba(255,0,255,0.1))',
        backdropFilter: 'blur(2px)'
      }}
      animate={{
        boxShadow: [
          '0 0 20px rgba(0,255,255,0.5), inset 0 0 20px rgba(255,0,255,0.3)',
          '0 0 40px rgba(255,0,255,0.5), inset 0 0 40px rgba(0,255,255,0.3)',
          '0 0 20px rgba(0,255,255,0.5), inset 0 0 20px rgba(255,0,255,0.3)'
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.1) 2px, rgba(0,255,255,0.1) 4px)'
        }}
        animate={{
          y: [0, 8]
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </motion.div>
  );
};

export const NumberPulseExplosion: React.FC<{
  value: number;
  isCurrency?: boolean;
  currencySymbol?: string;
  trigger: boolean;
  className?: string;
}> = ({ value, isCurrency = true, currencySymbol = '$', trigger, className = '' }) => {
  const formatted = isCurrency
    ? `${currencySymbol}${Math.round(value).toLocaleString()}`
    : Math.round(value).toLocaleString();

  return (
    <motion.div
      className={`relative w-full overflow-hidden ${className}`}
      animate={trigger ? {
        scale: [1, 1.1, 1.05, 1.1, 1],
        rotate: [0, -2, 2, -2, 0]
      } : {}}
      transition={{
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1]
      }}
    >
      <motion.div
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black whitespace-nowrap px-2"
        style={{
          textShadow: '0 0 40px #00ff00, 0 0 80px #00ff00',
          color: '#00ff00',
          textAlign: 'center',
          display: 'block',
          width: '100%'
        }}
        animate={{
          textShadow: [
            '0 0 40px #00ff00, 0 0 80px #00ff00',
            '0 0 60px #ffff00, 0 0 120px #ffff00',
            '0 0 40px #00ff00, 0 0 80px #00ff00'
          ]
        }}
        transition={{
          duration: 1,
          repeat: Infinity
        }}
      >
        {formatted}
      </motion.div>

      {trigger && Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-4 h-4 bg-yellow-400 rounded-full"
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{
              x: Math.cos(angle) * 200,
              y: Math.sin(angle) * 200,
              scale: 0,
              opacity: 0
            }}
            transition={{
              duration: 1,
              ease: "easeOut"
            }}
          />
        );
      })}
    </motion.div>
  );
};

export const MatrixRain: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  const columns = 20;
  const chars = '01';

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: columns }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-green-500 font-mono text-sm opacity-30"
          style={{
            left: `${(i / columns) * 100}%`,
            top: `-${Math.random() * 100}%`
          }}
          animate={{
            y: ['0vh', '120vh']
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 2
          }}
        >
          {Array.from({ length: 15 }).map((_, j) => (
            <div key={j}>
              {chars[Math.floor(Math.random() * chars.length)]}
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};
