
import React from 'react';
import { MapPin, Car, Clock, User } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  // Icons for each step
  const stepIcons = [
    <MapPin key="location" className="h-5 w-5" />,
    <Car key="vehicle" className="h-5 w-5" />,
    <Clock key="time" className="h-5 w-5" />,
    <User key="driver" className="h-5 w-5" />
  ];

  // Labels for each step
  const stepLabels = ['Adresses', 'Véhicule', 'Horaire & Paiement', 'Chauffeur'];

  return (
    <div className="mt-6">
      {/* Progress bar */}
      <div className="relative mb-4">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
          ></div>
        </div>

        {/* Step indicators */}
        <div className="flex justify-between -mt-2">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber <= currentStep;
            const isCompleted = stepNumber < currentStep;

            return (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-full border-2 transition-colors ${
                    isActive
                      ? 'bg-primary border-primary text-white'
                      : 'bg-white border-gray-300 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    '✓'
                  ) : (
                    stepIcons[index]
                  )}
                </div>
                <span
                  className={`text-xs mt-1 transition-colors ${
                    isActive ? 'text-primary font-medium' : 'text-gray-500'
                  }`}
                >
                  {stepLabels[index]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
