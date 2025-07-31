import React from 'react';

interface StepperProps {
    currentStep: number;
    steps: string[];
}

const Stepper: React.FC<StepperProps> = ({ currentStep, steps }) => (
    <div className="flex justify-between items-center mb-8">
        {steps.map((step, index) => (
            <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index + 1 <= currentStep ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {index + 1}
                    </div>
                    <p className={`mt-2 text-xs text-center ${index + 1 <= currentStep ? 'font-semibold text-orange-600' : 'text-gray-500'}`}>{step}</p>
                </div>
                {index < steps.length - 1 && <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>}
            </React.Fragment>
        ))}
    </div>
);

export default Stepper; 