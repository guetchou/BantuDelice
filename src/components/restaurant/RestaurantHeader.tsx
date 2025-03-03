
import { MapPin, Clock, Star, Phone, Globe, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DeliveryMap from "@/components/DeliveryMap";
import { motion } from "framer-motion";
import { Restaurant } from "@/types/restaurant";

interface RestaurantHeaderProps {
  restaurant: Restaurant;
}

const RestaurantHeader = ({ restaurant }: RestaurantHeaderProps) => {
  const isCurrentlyOpen = () => {
    try {
      if (!restaurant.business_hours?.regular) return true;
      
      const now = new Date();
      const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const hours = restaurant.business_hours.regular[day];
      
      if (!hours) return true;
      
      const currentTime = now.getHours() * 100 + now.getMinutes();
      const [openHour, openMin] = hours.open.split(':').map(Number);
      const [closeHour, closeMin] = hours.close.split(':').map(Number);
      
      const openTime = openHour * 100 + openMin;
      const closeTime = closeHour * 100 + closeMin;
      
      return currentTime >= openTime && currentTime <= closeTime;
    } catch (e) {
      console.error("Error determining open status:", e);
      return true;
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative h-64 rounded-xl overflow-hidden">
        <img
          src={restaurant.banner_image_url || "https://images.unsplash.com/photo-1514933651103-005eec06c04b"}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{restaurant.address}</span>
              </div>
              {restaurant.cuisine_type && (
                <Badge variant="secondary">
                  {restaurant.cuisine_type}
                </Badge>
              )}
              {restaurant.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{restaurant.rating.toFixed(1)}</span>
                </div>
              )}
              <Badge 
                variant={isCurrentlyOpen() ? "secondary" : "destructive"}
                className="capitalize"
              >
                {isCurrentlyOpen() ? "Ouvert" : "Fermé"}
              </Badge>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 text-gray-300">
            {restaurant.average_prep_time && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{restaurant.average_prep_time} min de préparation</span>
              </div>
            )}
            {restaurant.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <a href={`tel:${restaurant.phone}`} className="hover:underline">
                  {restaurant.phone}
                </a>
              </div>
            )}
          </div>

          {(restaurant.minimum_order || restaurant.delivery_fee) && (
            <div className="bg-orange-950/30 p-4 rounded-lg border border-orange-900/50">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  {restaurant.minimum_order > 0 && (
                    <p>Commande minimale : {restaurant.minimum_order.toLocaleString()} XAF</p>
                  )}
                  {restaurant.delivery_fee > 0 && (
                    <p>Frais de livraison : {restaurant.delivery_fee.toLocaleString()} XAF</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-[200px] rounded-lg overflow-hidden shadow-lg">
          <DeliveryMap 
            latitude={restaurant.latitude}
            longitude={restaurant.longitude}
          />
        </div>
      </div>
    </div>
  );
};

export default RestaurantHeader;
