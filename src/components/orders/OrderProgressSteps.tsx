
import React from 'react';
import { OrderStatus } from '@/types/order';
import { Check, Clock, X, Utensils, ShoppingBag, Truck, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderProgressStepsProps {
  status: OrderStatus;
  deliveryStatus?: string;
  orderId: string;
}

const OrderProgressSteps = ({ status, deliveryStatus, orderId }: OrderProgressStepsProps) => {
  const isComplete = status === 'delivered' || status === 'cancelled';
  
  // Define step states based on order status
  const steps = [
    {
      id: 'pending',
      name: 'Commandé',
      icon: ShoppingBag,
      status: status === 'pending' ? 'current' : 
              status === 'cancelled' ? 'error' :
              ['accepted', 'preparing', 'prepared', 'delivering', 'delivered'].includes(status) ? 'complete' : 'upcoming'
    },
    {
      id: 'accepted',
      name: 'Confirmé',
      icon: Check,
      status: status === 'accepted' ? 'current' : 
              status === 'cancelled' ? 'error' :
              ['preparing', 'prepared', 'delivering', 'delivered'].includes(status) ? 'complete' : 'upcoming'
    },
    {
      id: 'preparing',
      name: 'Préparation',
      icon: Utensils,
      status: status === 'preparing' ? 'current' : 
              status === 'cancelled' ? 'error' :
              ['prepared', 'delivering', 'delivered'].includes(status) ? 'complete' : 'upcoming'
    },
    {
      id: 'delivering',
      name: 'Livraison',
      icon: Truck,
      status: status === 'delivering' ? 'current' : 
              status === 'cancelled' ? 'error' :
              ['delivered'].includes(status) ? 'complete' : 'upcoming'
    },
    {
      id: 'delivered',
      name: 'Livré',
      icon: Home,
      status: status === 'delivered' ? 'complete' : 
              status === 'cancelled' ? 'error' : 'upcoming'
    }
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between w-full my-6">
        {steps.map((step, stepIdx) => (
          <React.Fragment key={step.id}>
            {/* Step circle */}
            <div className="relative flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-full z-10",
                  {
                    'bg-primary text-primary-foreground': step.status === 'complete',
                    'bg-primary text-primary-foreground ring-2 ring-offset-2 ring-primary': step.status === 'current',
                    'bg-muted text-muted-foreground': step.status === 'upcoming',
                    'bg-destructive text-destructive-foreground': step.status === 'error',
                  }
                )}
              >
                {step.status === 'complete' ? (
                  <Check className="h-5 w-5" />
                ) : step.status === 'error' ? (
                  <X className="h-5 w-5" />
                ) : step.status === 'current' ? (
                  <Clock className="h-5 w-5 animate-pulse" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <div className="text-xs font-medium mt-2 text-center max-w-[70px]">
                {step.name}
              </div>
            </div>
            
            {/* Connecting line */}
            {stepIdx < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2", 
                  {
                    'bg-primary': steps[stepIdx + 1].status === 'complete' || steps[stepIdx + 1].status === 'current',
                    'bg-muted': steps[stepIdx + 1].status === 'upcoming',
                    'bg-destructive': steps[stepIdx + 1].status === 'error'
                  }
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default OrderProgressSteps;
