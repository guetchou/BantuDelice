
import { CheckCircle, Circle, Clock, ChefHat, Truck, Package } from 'lucide-react';
import { OrderStatus } from '@/types/order';

interface OrderProgressProps {
  status: OrderStatus;
}

const OrderProgress = ({ status }: OrderProgressProps) => {
  const steps = [
    {
      key: 'pending',
      label: 'Commande reçue',
      icon: Clock,
      completedStatuses: ['accepted', 'preparing', 'prepared', 'delivering', 'delivered', 'completed'],
      currentStatus: 'pending',
    },
    {
      key: 'preparing',
      label: 'En préparation',
      icon: ChefHat,
      completedStatuses: ['prepared', 'delivering', 'delivered', 'completed'],
      currentStatus: 'preparing',
      previousStatuses: ['accepted']
    },
    {
      key: 'delivering',
      label: 'En livraison',
      icon: Truck,
      completedStatuses: ['delivered', 'completed'],
      currentStatus: 'delivering',
      previousStatuses: ['prepared']
    },
    {
      key: 'delivered',
      label: 'Livré',
      icon: Package,
      completedStatuses: ['completed'],
      currentStatus: 'delivered',
      previousStatuses: []
    }
  ];

  const getStepStatus = (step: typeof steps[0]) => {
    if (status === 'cancelled') {
      return 'inactive';
    }
    
    if (step.completedStatuses.includes(status) || status === step.currentStatus) {
      return 'completed';
    }
    
    if (status === step.currentStatus || (step.previousStatuses && step.previousStatuses.includes(status))) {
      return 'current';
    }
    
    return 'waiting';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center relative">
        {/* Connecting line */}
        <div className="absolute h-1 bg-gray-200 left-0 right-0 top-4 -z-10"></div>
        
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(step);
          return (
            <div key={step.key} className="flex flex-col items-center space-y-2">
              {/* Circle */}
              <div className="relative">
                {stepStatus === 'completed' ? (
                  <CheckCircle className="h-8 w-8 text-primary" />
                ) : stepStatus === 'current' ? (
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                    <step.icon className="h-5 w-5" />
                  </div>
                ) : (
                  <Circle className={`h-8 w-8 ${status === 'cancelled' ? 'text-gray-300' : 'text-gray-400'}`} />
                )}
                
                {/* Active line before this step */}
                {index > 0 && (stepStatus === 'completed' || stepStatus === 'current') && (
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderProgress;
