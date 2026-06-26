import React, { useState } from 'react';
import { CreditCard as Edit3, Check, X, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCalculator } from '../../context/CalculatorContext';

interface EditableCardProps {
  title: string;
  value: number;
  unit: string;
  color: string;
  min: number;
  max: number;
  step?: number;
  presets?: { label: string; value: number }[];
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const EditableCard: React.FC<EditableCardProps> = ({
  title,
  value,
  unit,
  color,
  min,
  max,
  step = 1,
  presets = [],
  onChange,
  formatValue = (v) => v.toLocaleString(),
  className = '',
  size = 'medium'
}) => {
  const { updateInvestment } = useCalculator();
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  // Update tempValue when value prop changes
  React.useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSave = () => {
    if (tempValue >= min && tempValue <= max) {
      onChange(tempValue);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const sizeClasses = {
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6'
  };

  const textSizes = {
    small: { title: 'text-sm', value: 'text-lg', unit: 'text-xs' },
    medium: { title: 'text-base', value: 'text-2xl', unit: 'text-sm' },
    large: { title: 'text-lg', value: 'text-3xl', unit: 'text-base' }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-dark-card rounded-xl shadow-sm border border-dark-border hover:shadow-md transition-all duration-200 ${sizeClasses[size]} ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className={`font-medium text-neutral-200 ${textSizes[size].title}`}>{title}</h4>
        {!isEditing && (
          <button
            onClick={() => {
              setIsEditing(true);
              setTempValue(value);
            }}
            className="p-1.5 rounded-lg hover:bg-dark-surface transition-colors group"
            title="Editar valor"
          >
            <Edit3 className="w-4 h-4 text-gray-400 group-hover:text-neutral-300" />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTempValue(Math.max(min, tempValue - step))}
              className="p-2 rounded-lg bg-dark-surface hover:bg-dark-border transition-colors disabled:opacity-50"
              disabled={tempValue <= min}
            >
              <Minus className="w-4 h-4 text-neutral-300" />
            </button>
            <input
              type="number"
              value={tempValue}
              onChange={(e) => setTempValue(Number(e.target.value))}
              onKeyPress={handleKeyPress}
              min={min}
              max={max}
              step={step}
              className="flex-1 px-3 py-2 bg-dark-surface border border-dark-border rounded-lg text-center text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
            <button
              onClick={() => setTempValue(Math.min(max, tempValue + step))}
              className="p-2 rounded-lg bg-dark-surface hover:bg-dark-border transition-colors disabled:opacity-50"
              disabled={tempValue >= max}
            >
              <Plus className="w-4 h-4 text-neutral-300" />
            </button>
          </div>

          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={tempValue}
            onChange={(e) => setTempValue(Number(e.target.value))}
            className="w-full h-2 bg-dark-surface rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
          />

          {presets.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setTempValue(preset.value)}
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    tempValue === preset.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-dark-surface text-neutral-200 hover:bg-dark-border'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              Guardar
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div 
          className="text-center cursor-pointer hover:bg-dark-surface rounded-lg p-2 transition-colors"
          onClick={() => {
            setIsEditing(true);
            setTempValue(value);
          }}
        >
          <div className={`font-bold mb-1 ${textSizes[size].value}`} style={{ color }}>
            {formatValue(value)}
          </div>
          <div className={`text-neutral-400 ${textSizes[size].unit}`}>{unit}</div>
        </div>
      )}
    </motion.div>
  );
};

export default EditableCard;