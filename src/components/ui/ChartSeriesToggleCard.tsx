import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ChartSeriesToggleCardProps {
  label: string;
  icon: LucideIcon;
  color: string;
  checked: boolean;
  onClick: () => void;
  value?: string;
  className?: string;
}

const ChartSeriesToggleCard: React.FC<ChartSeriesToggleCardProps> = ({
  label,
  icon: Icon,
  color,
  checked,
  onClick,
  value,
  className = ''
}) => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      className={`flex items-center justify-between ${isMobile ? 'p-1.5' : 'p-2'} rounded-lg border transition-all duration-200 ${className}`}
      style={{ 
        borderColor: checked ? color : '#e5e7eb',
        backgroundColor: checked ? `${hexToRgba(color, 0.1)}` : '#ffffff'
      }}
    >
      <div className={`flex items-center gap-${isMobile ? '1.5' : '2'}`}>
        <div 
          className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'} rounded-md flex items-center justify-center`}
          style={{ backgroundColor: color }}
        >
          <Icon className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'} text-white`} />
        </div>
        <span className={`font-medium text-gray-800 ${isMobile ? 'text-xxs' : 'text-xs'} truncate`}>
          {isMobile ? label.split(' ')[0] : label}
        </span>
      </div>
      
      {value && (
        <span className={`${isMobile ? 'text-xxs' : 'text-xs'} font-semibold`} style={{ color }}>
          {value}
        </span>
      )}
      
      <label className="cursor-pointer">
        <input 
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onClick}
        />
        <div 
          className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} rounded-full border-2 flex items-center justify-center ${isMobile ? 'ml-0.5' : 'ml-1'}`}
          style={{ borderColor: color }}
        >
          {checked && (
            <div 
              className={`${isMobile ? 'w-1 h-1' : 'w-1.5 h-1.5'} rounded-full`}
              style={{ backgroundColor: color }}
            ></div>
          )}
        </div>
      </label>
    </div>
  );
};

// Helper function to convert hex color to rgba
function hexToRgba(hex: string, alpha: number = 1): string {
  // Remove the hash if it exists
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Return the rgba value
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default ChartSeriesToggleCard;