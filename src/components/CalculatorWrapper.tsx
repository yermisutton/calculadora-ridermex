import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ui/ThemeToggle';

interface CalculatorWrapperProps {
  children: ReactNode;
}

export const CalculatorWrapper: React.FC<CalculatorWrapperProps> = ({ children }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {React.cloneElement(children as React.ReactElement, { onBack: () => navigate('/') })}
    </>
  );
};

export default CalculatorWrapper;
