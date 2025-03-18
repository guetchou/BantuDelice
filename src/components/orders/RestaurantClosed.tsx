
import { AlertTriangle } from 'lucide-react';

interface RestaurantClosedProps {
  restaurantName: string;
}

const RestaurantClosed = ({ restaurantName }: RestaurantClosedProps) => {
  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md flex items-start">
      <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
      <div>
        <h3 className="font-semibold">Restaurant temporairement fermé</h3>
        <p className="text-sm">
          {restaurantName} est actuellement fermé. Votre commande sera traitée dès leur réouverture.
        </p>
      </div>
    </div>
  );
};

export default RestaurantClosed;
