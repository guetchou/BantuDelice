
import { Clock, ChefHat, Truck, Package } from 'lucide-react';
import OrderProgressStep from './OrderProgressStep';

interface OrderProgressStepsProps {
  status: string;
  deliveryStatus: string | null;
}

const OrderProgressSteps = ({ status, deliveryStatus }: OrderProgressStepsProps) => {
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

  return (
    <div className="flex justify-between items-center relative mb-2">
      {/* Connecting line */}
      <div className="absolute h-1 bg-gray-200 left-0 right-0 top-4 -z-10"></div>
      
      {steps.map((step, index) => (
        <OrderProgressStep
          key={step.key}
          step={step}
          status={status}
          deliveryStatus={deliveryStatus}
          isFirst={index === 0}
          isLast={index === steps.length - 1}
        />
      ))}
    </div>
  );
};

export default OrderProgressSteps;
