
import { CheckCircle, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OrderProgressStepProps {
  step: {
    key: string;
    label: string;
    icon: React.ElementType;
    completedStatuses: string[];
    currentStatus: string;
    previousStatuses?: string[];
  };
  status: string;
  deliveryStatus: string | null;
  isFirst: boolean;
  isLast: boolean;
}

const OrderProgressStep = ({ 
  step, 
  status, 
  deliveryStatus, 
  isFirst, 
  isLast 
}: OrderProgressStepProps) => {
  const getStepStatus = () => {
    if (status === 'cancelled') {
      return 'inactive';
    }
    
    if (step.completedStatuses.includes(status) || status === step.currentStatus) {
      return 'completed';
    }
    
    if (status === step.currentStatus || (step.previousStatuses && step.previousStatuses.includes(status))) {
      return 'current';
    }
    
    // Special case for delivery status
    if (step.key === 'delivering' && deliveryStatus === 'delivering') {
      return 'current';
    }
    
    if (step.key === 'delivered' && deliveryStatus === 'delivered') {
      return 'completed';
    }
    
    return 'waiting';
  };

  const stepStatus = getStepStatus();
  const Icon = step.icon;

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Circle */}
      <div className="relative">
        {stepStatus === 'completed' ? (
          <CheckCircle className="h-8 w-8 text-primary" />
        ) : stepStatus === 'current' ? (
          <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
            <Icon className="h-5 w-5" />
          </div>
        ) : (
          <Circle className={`h-8 w-8 ${status === 'cancelled' ? 'text-gray-300' : 'text-gray-400'}`} />
        )}
        
        {/* Active line before this step */}
        {!isFirst && (stepStatus === 'completed' || stepStatus === 'current') && (
          <div className="absolute h-1 bg-primary right-4 w-full top-4 -z-10" style={{ left: '-100%' }}></div>
        )}
      </div>
      
      {/* Label */}
      <span className={`text-xs text-center ${
        status === 'cancelled' ? 'text-gray-400' :
        stepStatus === 'completed' ? 'text-primary font-medium' :
        stepStatus === 'current' ? 'text-primary font-medium' :
        'text-gray-500'
      }`}>
        {step.label}
      </span>

      {/* Current status indicator */}
      {stepStatus === 'current' && (
        <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
          En cours
        </Badge>
      )}
    </div>
  );
};

export default OrderProgressStep;
