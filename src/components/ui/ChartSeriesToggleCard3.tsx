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

const ChartSeriesToggleCard3: React.FC<ChartSeriesToggleCardProps> = ({
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
      className={`relative overflow-hidden p-2 rounded-lg border transition-all duration-200 ${className}`}
      style={{ 
        borderColor: checked ? color : '#e5e7eb'
      }}
    >
      {/* Background with opacity based on checked state */}
      <div 
        className="absolute inset-0 transition-opacity duration-300"
        style={{ 
          backgroundColor: color,
          opacity: checked ? 0.1 : 0
        }}
      ></div>
      
      {/* Status badge */}
      <div 
        className="absolute top-0 right-0 text-xxs font-bold px-1 py-0.5 rounded-bl-md"
        style={{ 
          backgroundColor: checked ? color : '#e5e7eb',
          color: checked ? 'white' : '#6b7280'
        }}
      >
        {checked ? 'ON' : 'OFF'}
      </div>
      
      <div className="flex items-center gap-2 mt-3">
        <div 
          className="w-6 h-6 rounded-md flex items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <Icon className="w-3 h-3 text-white" />
        </div>
        
        <div className="flex-1">
          <div className="font-medium text-gray-800 text-xs truncate">{label}</div>
          {value && (
            <div className="text-xxs font-semibold mt-0.5" style={{ color }}>
              {value}
            </div>
          )}
        </div>
      </div>
      
      {/* Toggle switch */}
      <div className="mt-1 flex items-center justify-end">
        <label className="cursor-pointer">
          <input 
            type="checkbox"
            className="sr-only"
            checked={checked}
            onChange={onClick}
          />
          <div className="relative inline-block w-8 h-4 rounded-full transition-colors duration-200"
               style={{ backgroundColor: checked ? color : '#d1d5db' }}>
            <div 
              className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform duration-200"
              style={{ 
                transform: checked ? 'translateX(4px)' : 'translateX(1px)',
                left: checked ? '50%' : '0%'
              }}
            ></div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default ChartSeriesToggleCard3;