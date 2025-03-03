
import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  activeStep: number
}

export interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  completed?: boolean
  active?: boolean
}

const Steps = React.forwardRef<HTMLDivElement, StepsProps>(
  ({ className, activeStep = 0, children, ...props }, ref) => {
    const childrenArray = React.Children.toArray(children)
    const steps = childrenArray.map((step, index) => {
      if (React.isValidElement(step)) {
        return React.cloneElement(step, {
          completed: index < activeStep,
          active: index === activeStep,
        })
      }
      return step
    })

    return (
      <div
        ref={ref}
        className={cn("flex w-full", className)}
        {...props}
      >
        {steps}
      </div>
    )
  }
)
Steps.displayName = "Steps"

const Step = React.forwardRef<HTMLDivElement, StepProps>(
  ({ className, icon: Icon, completed, active, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex flex-1 flex-col items-center justify-center gap-1 text-center",
          active && "text-primary",
          completed && "text-primary",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-center">
          {completed ? (
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <svg
                className="h-5 w-5"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          ) : active ? (
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary text-primary">
              {Icon && <Icon className="h-5 w-5" />}
            </div>
          ) : (
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-muted text-muted-foreground">
              {Icon && <Icon className="h-5 w-5" />}
            </div>
          )}
        </div>
        <div
          className={cn(
            "absolute left-0 right-0 -top-6 text-xs",
            active ? "text-primary" : "text-muted-foreground"
          )}
        >
          {children}
        </div>
        <div
          className={cn(
            "absolute top-0 left-1/2 h-px w-full -translate-y-1/2",
            completed ? "bg-primary" : "bg-muted-foreground"
          )}
          style={{
            transform: "translateX(50%)",
          }}
        />
      </div>
    )
  }
)
Step.displayName = "Step"

export { Steps, Step }
