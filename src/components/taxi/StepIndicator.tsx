
import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  const steps = ['Adresse', 'Véhicule', 'Détails', 'Chauffeur'];

  return (
    <div className="w-full mt-4">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <span 
            key={index} 
            className={`text-xs ${currentStep >= index + 1 ? 'text-primary' : 'text-gray-400'}`}
          >
            {step}
          </span>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StepIndicator;
