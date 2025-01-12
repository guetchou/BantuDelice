import { MapPin } from "lucide-react";
import DeliveryMap from "../DeliveryMap";

interface RestaurantHeaderProps {
  name: string;
  address: string;
  coordinates: [number, number];
}

const RestaurantHeader = ({ name, address, coordinates }: RestaurantHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-6">{name}</h1>
      <div className="flex items-center text-gray-600 mb-4">
        <MapPin className="w-5 h-5 mr-2" />
        <span>{address}</span>
      </div>
      <DeliveryMap restaurantLocation={coordinates} />
    </div>
  );
};

export default RestaurantHeader;