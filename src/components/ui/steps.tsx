
import * as React from "react";
import { cn } from "@/lib/utils";

interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  activeStep: number;
  children: React.ReactNode;
}

export function Steps({ activeStep = 0, children, className, ...props }: StepsProps) {
  const steps = React.Children.toArray(children);
  
  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <div className="relative flex items-center justify-between w-full">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="relative flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center relative z-10 transition-all duration-300",
                  index <= activeStep 
                    ? "border-primary bg-primary text-primary-foreground" 
                    : "border-gray-300 bg-gray-100 text-gray-500"
                )}
              >
                {React.isValidElement(step) && step.props.icon ? (
                  <step.props.icon className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <div className="text-xs mt-2 text-center">
                {React.isValidElement(step) ? step.props.children : step}
              </div>
            </div>
            
            {/* Line connecting steps */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-1">
                <div
                  className={cn(
                    "h-0.5 w-full", 
                    index < activeStep 
                      ? "bg-primary" 
                      : "bg-gray-300"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

interface StepProps {
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}

export function Step({ children, icon }: StepProps) {
  return <>{children}</>;
}
