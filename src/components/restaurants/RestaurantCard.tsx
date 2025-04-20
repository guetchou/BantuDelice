
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Star, Clock, MapPin, TrendingUp, Bike, ShoppingBag } from "lucide-react";
import type { Restaurant } from '@/types/restaurant';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: (restaurantId: string) => void;
}

export default function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  const isOpen = () => {
    if (!restaurant.business_hours) return false;
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    // Support both formats of business_hours
    if (restaurant.business_hours.regular && restaurant.business_hours.regular[day]) {
      const hours = restaurant.business_hours.regular[day];
      if (!hours) return false;

      const currentTime = now.getHours() * 100 + now.getMinutes();
      const [openHour, openMin] = hours.open.split(':').map(Number);
      const [closeHour, closeMin] = hours.close.split(':').map(Number);
      
      const openTime = openHour * 100 + openMin;
      const closeTime = closeHour * 100 + closeMin;
      
      return currentTime >= openTime && currentTime <= closeTime;
    } else if (restaurant.business_hours[day]) {
      const hours = restaurant.business_hours[day];
      if (!hours) return false;

      const currentTime = now.getHours() * 100 + now.getMinutes();
      const [openHour, openMin] = hours.open.split(':').map(Number);
      const [closeHour, closeMin] = hours.close.split(':').map(Number);
      
      const openTime = openHour * 100 + openMin;
      const closeTime = closeHour * 100 + closeMin;
      
      return currentTime >= openTime && currentTime <= closeTime;
    }
    
    return false;
  };

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
            src={restaurant.banner_image_url || '/placeholder-restaurant.jpg'}
            alt={restaurant.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/75 to-transparent" />
          
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {restaurant.cuisine_type && (
              <Badge variant="secondary" className="bg-black/75 backdrop-blur-sm">
                {restaurant.cuisine_type}
              </Badge>
            )}
            {restaurant.is_open !== undefined ? (
              <Badge variant="secondary" className={restaurant.is_open ? "bg-green-500" : "bg-red-500"}>
                {restaurant.is_open ? "Ouvert" : "Fermé"}
              </Badge>
            ) : isOpen() ? (
              <Badge variant="secondary" className="bg-green-500">
                Ouvert
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-red-500">
                Fermé
              </Badge>
            )}
          </div>

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
          
          <p className="text-sm text-gray-300 mb-4 line-clamp-2">
            {restaurant.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
            {restaurant.rating !== undefined && (
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="ml-1 font-medium">{restaurant.rating.toFixed(1)}</span>
                <span className="ml-1 text-gray-400">({restaurant.total_ratings || 0})</span>
              </div>
            )}
            <div className="flex items-center">
              <Clock className="w-4 h-4" />
              <span className="ml-1">{restaurant.average_prep_time || 30} min</span>
            </div>
          </div>
          
          <div className="mt-auto space-y-2">
            <div className="flex items-center text-sm text-gray-400">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{restaurant.address}</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-400">
              {restaurant.delivery_fee !== null && (
                <div className="flex items-center">
                  <Bike className="w-4 h-4 mr-1" />
                  <span>
                    {restaurant.delivery_fee === 0 ? 'Livraison gratuite' : `${restaurant.delivery_fee?.toLocaleString()} XAF`}
                  </span>
                </div>
              )}
              {(restaurant.minimum_order || restaurant.min_order) > 0 && (
                <div className="flex items-center">
                  <ShoppingBag className="w-4 h-4 mr-1" />
                  <span>Min. {(restaurant.minimum_order || restaurant.min_order)?.toLocaleString()} XAF</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
