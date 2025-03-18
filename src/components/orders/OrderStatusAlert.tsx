
import { Clock } from 'lucide-react';

interface OrderStatusAlertProps {
  status: string;
  isRestaurantOpen: boolean;
}

const OrderStatusAlert = ({ status, isRestaurantOpen }: OrderStatusAlertProps) => {
  if (status === 'cancelled') {
    return (
      <div className="mt-4 bg-red-50 text-red-700 p-2 rounded-md text-sm text-center">
        Cette commande a été annulée
      </div>
    );
  }
  
  if (status === 'pending' && !isRestaurantOpen) {
    return (
      <div className="mt-4 bg-amber-50 text-amber-700 p-2 rounded-md text-sm text-center">
        Le restaurant traitera votre commande lors de sa réouverture
      </div>
    );
  }

  if (!isRestaurantOpen) {
    return (
      <div className="bg-amber-50 text-amber-800 p-3 rounded-md mb-4 text-sm flex items-center">
        <Clock className="h-4 w-4 mr-2" />
        <span>Le restaurant est actuellement fermé. Votre commande sera traitée dès leur réouverture.</span>
      </div>
    );
  }

  return null;
};

export default OrderStatusAlert;
