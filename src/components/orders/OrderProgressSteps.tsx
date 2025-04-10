
import { OrderStatus } from '@/types/order';
import { DeliveryStatus } from '@/types/delivery';
import { CheckCircle, ShoppingCart, ChefHat, Truck, Home } from 'lucide-react';

interface OrderProgressStepsProps {
  status: OrderStatus;
  deliveryStatus: DeliveryStatus | null;
  orderId: string;
}

const OrderProgressSteps = ({ status, deliveryStatus, orderId }: OrderProgressStepsProps) => {
  // Define the steps for the order progress
  const steps = [
    {
      key: 'pending',
      label: 'Commande',
      icon: ShoppingCart,
      completedStatuses: ['accepted', 'preparing', 'prepared', 'delivering', 'delivered'],
      currentStatus: 'pending',
    },
    {
      key: 'accepted',
      label: 'Acceptée',
      icon: CheckCircle,
      completedStatuses: ['preparing', 'prepared', 'delivering', 'delivered'],
      currentStatus: 'accepted',
    },
    {
      key: 'preparing',
      label: 'Préparation',
      icon: ChefHat,
      completedStatuses: ['prepared', 'delivering', 'delivered'],
      currentStatus: 'preparing',
    },
    {
      key: 'delivering',
      label: 'Livraison',
      icon: Truck,
      completedStatuses: ['delivered'],
      currentStatus: 'delivering',
    },
    {
      key: 'delivered',
      label: 'Livrée',
      icon: Home,
      completedStatuses: [],
      currentStatus: 'delivered',
    },
  ];

  // Determine which step is active based on current status
  const getStepStatus = (step: typeof steps[0]) => {
    if (status === 'cancelled') {
      return 'inactive';
    }
    
    if (step.completedStatuses.includes(status)) {
      return 'completed';
    }
    
    if (status === step.currentStatus) {
      return 'current';
    }
    
    if (step.key === 'delivering' && deliveryStatus === 'delivering') {
      return 'current';
    }
    
    if (step.key === 'delivered' && deliveryStatus === 'delivered') {
      return 'completed';
    }
    
    return 'waiting';
  };

  return (
    <div className="flex justify-between w-full">
      {steps.map((step, index) => (
        <div key={step.key} className="flex flex-col items-center space-y-2 relative">
          {/* Circle */}
          <div className="relative">
            {getStepStatus(step) === 'completed' ? (
              <CheckCircle className="h-8 w-8 text-primary" />
            ) : getStepStatus(step) === 'current' ? (
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                <step.icon className="h-5 w-5" />
              </div>
            ) : (
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${status === 'cancelled' ? 'bg-gray-300' : 'border-2 border-gray-400'}`}>
                <step.icon className="h-5 w-5 text-gray-500" />
              </div>
            )}
            
            {/* Active line before this step */}
            {index > 0 && (getStepStatus(step) === 'completed' || getStepStatus(step) === 'current') && (
              <div className="absolute h-1 bg-primary right-4 w-full top-4 -z-10" style={{ left: '-100%' }}></div>
            )}
            
            {/* Inactive line before this step */}
            {index > 0 && getStepStatus(step) !== 'completed' && getStepStatus(step) !== 'current' && (
              <div className="absolute h-1 bg-gray-300 right-4 w-full top-4 -z-10" style={{ left: '-100%' }}></div>
            )}
          </div>
          
          {/* Label */}
          <span className={`text-xs text-center ${
            status === 'cancelled' ? 'text-gray-400' :
            getStepStatus(step) === 'completed' ? 'text-primary font-medium' :
            getStepStatus(step) === 'current' ? 'text-primary font-medium' :
            'text-gray-500'
          }`}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default OrderProgressSteps;
