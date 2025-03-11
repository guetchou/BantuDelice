
import { Card } from "@/components/ui/card";
import { Star, Clock, MapPin, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { Restaurant } from '@/types/restaurant';

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
        className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col bg-white/5 backdrop-blur-lg border-gray-800"
        onClick={() => onClick(restaurant.id)}
      >
        <div className="relative h-48">
          <img
            src={restaurant.banner_image_url || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop'}
            alt={restaurant.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop';
            }}
          />
          {restaurant.cuisine_type && (
            <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-white">
                {restaurant.cuisine_type}
              </span>
            </div>
          )}
          {restaurant.trending && (
            <Badge className="absolute top-4 right-4 bg-orange-500">
              <TrendingUp className="w-4 h-4 mr-1" />
              Tendance
            </Badge>
          )}
        </div>
        
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-white mb-2">
            {restaurant.name}
          </h3>
          
          <div className="flex items-center text-sm text-gray-300 mb-4 gap-4">
            {restaurant.rating && (
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="ml-1 font-medium">{restaurant.rating}</span>
              </div>
            )}
            <div className="flex items-center">
              <Clock className="w-4 h-4" />
              <span className="ml-1">{restaurant.average_prep_time} min</span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-400 mt-auto">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{restaurant.address}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default RestaurantCard;
