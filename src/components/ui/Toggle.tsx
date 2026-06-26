import React from 'react';

interface ToggleProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between">
      {label && <span className="text-sm text-gray-600">{label}</span>}
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative inline-flex h-8 w-14 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        aria-pressed={checked}
      >
        <span className="sr-only">{checked ? 'Activado' : 'Desactivado'}</span>
        <span
          className={`${
            checked ? 'bg-green-500' : 'bg-gray-300'
          } absolute h-8 w-14 mx-auto rounded-full transition-colors duration-300 ease-in-out`}
        ></span>
        <span
          className={`${
            checked ? 'translate-x-6' : 'translate-x-1'
          } absolute left-1 top-1 h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out flex items-center justify-center text-xs font-semibold`}
        >
          {checked ? 'ON' : 'OFF'}
        </span>
      </button>
    </div>
  );
};