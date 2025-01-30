import { Card } from "@/components/ui/card";
import { Star, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface Restaurant {
  id: string;
  name: string;
  address: string;
  image_url?: string;
  rating?: number;
  estimated_preparation_time: number;
  cuisine_type?: string;
  distance?: number;
  menu_items?: MenuItem[];
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: (restaurantId: string) => void;
}

const RestaurantCard = ({ restaurant, onClick }: RestaurantCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card
        className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col"
        onClick={() => onClick(restaurant.id)}
      >
        <div className="relative">
          <img
            src={restaurant.image_url || 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d'}
            alt={restaurant.name}
            className="w-full h-48 object-cover"
          />
          {restaurant.distance && (
            <div className="absolute top-4 right-4 bg-black/75 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-sm font-semibold text-white">
                {restaurant.distance} km
              </span>
            </div>
          )}
          {restaurant.cuisine_type && (
            <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-white">
                {restaurant.cuisine_type}
              </span>
            </div>
          )}
        </div>
        
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {restaurant.name}
          </h3>
          
          <div className="flex items-center text-sm text-gray-600 mb-4 gap-4">
            {restaurant.rating && (
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="ml-1 font-medium">{restaurant.rating}</span>
              </div>
            )}
            <div className="flex items-center">
              <Clock className="w-4 h-4" />
              <span className="ml-1">{restaurant.estimated_preparation_time} min</span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mt-auto">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{restaurant.address}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default RestaurantCard;