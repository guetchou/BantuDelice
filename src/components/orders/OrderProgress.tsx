
import { useOrderProgress } from './useOrderProgress';
import { OrderStatus } from '@/types/order';
import OrderStatusAlert from './OrderStatusAlert';
import OrderProgressSteps from './OrderProgressSteps';

interface OrderProgressProps {
  status: OrderStatus;
  orderId: string;
}

const OrderProgress = ({ status: initialStatus, orderId }: OrderProgressProps) => {
  const {
    status,
    deliveryStatus,
    estimatedTime,
    isRestaurantOpen
  } = useOrderProgress(initialStatus, orderId);

  return (
    <div className="w-full">
      <OrderStatusAlert 
        status={status} 
        isRestaurantOpen={isRestaurantOpen} 
      />
    
      <div className="flex justify-between items-center relative mb-2">
        {estimatedTime && (
          <div className="absolute -top-6 right-0 text-sm text-gray-500">
            Livraison estimée: {estimatedTime}
          </div>
        )}
        
        <OrderProgressSteps 
          status={status} 
          deliveryStatus={deliveryStatus} 
        />
      </div>
    </div>
  );
};

export default OrderProgress;
