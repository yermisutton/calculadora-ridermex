import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon, Check, X } from 'lucide-react';

interface ChartSeriesToggleCardProps {
  label: string;
  icon: LucideIcon;
  color: string;
  checked: boolean;
  onClick: () => void;
  value?: string;
  className?: string;
}

const ChartSeriesToggleCard2: React.FC<ChartSeriesToggleCardProps> = ({
  label,
  icon: Icon,
  color,
  checked,
  onClick,
  value,
  className = ''
}) => {
  return (
    <div
      className={`flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 ${className}`}
      style={{ 
        borderColor: checked ? color : '#e5e7eb',
        backgroundColor: checked ? `${hexToRgba(color, 0.1)}` : '#f9fafb'
      }}
    >
      <div 
        className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: color }}
      >
        <Icon className="w-3 h-3 text-white" />
      </div>
      
      <div className="flex-1 text-left">
        <div className="font-medium text-gray-800 text-xs truncate">{label}</div>
        {value && (
          <div className="text-xxs font-semibold mt-0.5" style={{ color }}>
            {value}
          </div>
        )}
      </div>
      
      <label className="cursor-pointer">
        <input 
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onClick}
        />
        <div 
          className={`w-4 h-4 rounded-full flex items-center justify-center ${
            checked ? 'bg-green-500' : 'bg-gray-300'
          }`}
        >
          {checked ? (
            <Check className="w-2 h-2 text-white" />
          ) : (
            <X className="w-2 h-2 text-white" />
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

export default ChartSeriesToggleCard2;