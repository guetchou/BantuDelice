import { MapPin } from "lucide-react";
import DeliveryMap from "@/components/DeliveryMap";

interface Restaurant {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface RestaurantHeaderProps {
  restaurant: Restaurant;
}

const RestaurantHeader = ({ restaurant }: RestaurantHeaderProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
        <div className="flex items-center text-gray-600">
          <MapPin className="w-5 h-5 mr-2" />
          <span>{restaurant.address}</span>
        </div>
      </div>
      <DeliveryMap 
        latitude={restaurant.latitude}
        longitude={restaurant.longitude}
      />
    </div>
  );
};

export default RestaurantHeader;