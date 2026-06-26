import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatter: (value: number) => string;
  tooltip?: string;
}

const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatter,
  tooltip
}) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };

  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="space-y-1" title={tooltip}>
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="text-sm font-medium text-green-700">{formatter(value)}</div>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #16a34a 0%, #16a34a ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
          title={tooltip}
        />
        
        <div
          className="absolute h-4 w-4 bg-white border-2 border-green-500 rounded-full -mt-1 transform -translate-y-1/2 transition-transform pointer-events-none"
          style={{
            top: '50%',
            left: `calc(${percentage}% - 8px)`,
          }}
        ></div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatter(min)}</span>
        <span>{formatter(max)}</span>
      </div>
    </div>
  );
};

export default Slider;