import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ui/ThemeToggle';

interface CalculatorWrapperProps {
  children: ReactNode;
}

export const CalculatorWrapper: React.FC<CalculatorWrapperProps> = ({ children }) => {
  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {children}
    </>
  );
};

export default CalculatorWrapper;
