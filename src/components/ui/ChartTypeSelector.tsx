import React from 'react';
import { BarChart3, LineChart, AreaChart, PieChart, ChevronDown } from 'lucide-react';
import { ChartDisplayType } from '../../types';

interface ChartTypeSelectorProps {
  selectedType: ChartDisplayType;
  onTypeChange: (type: ChartDisplayType) => void;
  availableTypes?: ChartDisplayType[];
  className?: string;
}

const chartTypeOptions = {
  line: {
    icon: LineChart,
    label: 'Líneas',
    description: 'Evolución temporal'
  },
  bar: {
    icon: BarChart3,
    label: 'Barras',
    description: 'Comparación directa'
  },
  area: {
    icon: AreaChart,
    label: 'Área',
    description: 'Crecimiento acumulado'
  },
  pie: {
    icon: PieChart,
    label: 'Donut',
    description: 'Composición porcentual'
  }
};

const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
  availableTypes = ['line', 'bar', 'area', 'pie'],
  className = ''
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const selectedOption = chartTypeOptions[selectedType];
  const SelectedIcon = selectedOption.icon;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-${isMobile ? '1' : '2'} ${isMobile ? 'px-2 py-1.5' : 'px-3 py-2'} bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors`}
        title="Cambiar tipo de gráfico"
      >
        <SelectedIcon className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-gray-600`} />
        {!isMobile && (
          <span className="text-sm font-medium text-gray-700">{selectedOption.label}</span>
        )}
        <ChevronDown className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute top-full left-0 mt-1 ${isMobile ? 'w-32' : 'w-48'} bg-white border border-gray-200 rounded-lg shadow-lg z-20`}>
            {availableTypes.map((type) => {
              const option = chartTypeOptions[type];
              const Icon = option.icon;
              
              return (
                <button
                  key={type}
                  onClick={() => {
                    onTypeChange(type);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-${isMobile ? '2' : '3'} ${isMobile ? 'px-2 py-1.5' : 'px-3 py-2'} text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    selectedType === type ? 'bg-green-50 text-green-700' : 'text-gray-700'
                  }`}
                  title={option.description}
                >
                  <Icon className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                  <div className="flex-1">
                    <div className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>{option.label}</div>
                    {!isMobile && (
                      <div className="text-xs text-gray-500">{option.description}</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ChartTypeSelector;