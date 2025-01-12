import { MapPin } from "lucide-react";
import DeliveryMap from "@/components/DeliveryMap";

interface RestaurantHeaderProps {
  name: string;
  address: string;
  coordinates: [number, number];
}

const RestaurantHeader = ({ name, address, coordinates }: RestaurantHeaderProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{name}</h1>
        <div className="flex items-center text-gray-600">
          <MapPin className="w-5 h-5 mr-2" />
          <span>{address}</span>
        </div>
      </div>
      <DeliveryMap 
        latitude={coordinates[1]}
        longitude={coordinates[0]}
        zoom={14}
      />
    </div>
  );
};

export default RestaurantHeader;