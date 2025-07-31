
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Clock, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface NearbyRestaurantsSectionProps {
  restaurants: any[];
}

const NearbyRestaurantsSection: React.FC<NearbyRestaurantsSectionProps> = ({ restaurants }) => {
  const navigate = useNavigate();

  if (restaurants.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <MapPin className="mr-2 h-6 w-6 text-orange-400" />
              À proximité de vous
            </h2>
            <Button 
              variant="link" 
              className="text-orange-400 hover:text-orange-300 flex items-center group"
              onClick={() => navigate("/restaurants")}
            >
              Voir plus 
              <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {restaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div 
                  className="overflow-hidden rounded-xl bg-black/40 backdrop-blur-md border border-white/10 
                          hover:shadow-lg hover:shadow-orange-500/20 transition-all cursor-pointer h-full"
                  onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                >
                  <div className="h-48 w-full relative overflow-hidden">
                    <motion.img 
                      src={restaurant.banner_image_url} 
                      alt={restaurant.name} 
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    />
                    <div className="absolute top-2 right-2 bg-black/60 text-white p-1 px-2 rounded-full flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 mr-1" />
                      <span className="text-xs">{restaurant.average_rating?.toFixed(1) || "Nouveau"}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-white text-xl">{restaurant.name}</h3>
                    <p className="text-gray-300 text-sm">{restaurant.cuisine_type || "Restaurant local"}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{restaurant.average_prep_time ? `${restaurant.average_prep_time} min` : "~30 min"}</span>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <Badge className={restaurant.delivery_fee === 0 
                        ? "bg-green-600 hover:bg-green-700" 
                        : "bg-blue-600 hover:bg-blue-700"}>
                        {restaurant.delivery_fee === 0 ? "Livraison gratuite" : `${restaurant.delivery_fee} XAF`}
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-400 hover:bg-orange-500/10">
                        Commander <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NearbyRestaurantsSection;
