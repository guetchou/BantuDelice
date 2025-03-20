
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin } from "lucide-react";
import type { Restaurant } from '@/types/restaurant';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-all hover:scale-[1.01]">
        <div className="relative h-36">
          {restaurant.banner_image_url ? (
            <img 
              src={restaurant.banner_image_url} 
              alt={restaurant.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center">
              <span className="text-xl font-semibold text-primary">{restaurant.name}</span>
            </div>
          )}
          
          {restaurant.logo_url && (
            <div className="absolute bottom-0 left-4 transform translate-y-1/2 w-16 h-16 rounded-full overflow-hidden border-2 border-white bg-white">
              <img 
                src={restaurant.logo_url} 
                alt={`Logo de ${restaurant.name}`} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="absolute top-2 right-2 flex flex-col items-end space-y-1">
            <Badge variant={restaurant.is_open ? "success" : "destructive"} className="text-xs">
              {restaurant.is_open ? 'Ouvert' : 'Fermé'}
            </Badge>
            
            {restaurant.trending && (
              <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 hover:bg-amber-100">
                Populaire
              </Badge>
            )}
          </div>
        </div>
        
        <CardContent className="p-4 pt-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">{restaurant.name}</h3>
              
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="line-clamp-1">{restaurant.address}</span>
              </div>
            </div>
            
            {restaurant.average_rating > 0 && (
              <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                <Star className="h-3 w-3 text-yellow-500 mr-1" />
                <span className="text-sm font-medium">{restaurant.average_rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap items-center mt-3 text-sm text-gray-500 gap-3">
            {Array.isArray(restaurant.cuisine_type) ? (
              <span>{restaurant.cuisine_type.join(', ')}</span>
            ) : (
              <span>{restaurant.cuisine_type}</span>
            )}
            
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{restaurant.average_prep_time} min</span>
            </div>
            
            <div>
              {Array(restaurant.price_range)
                .fill(0)
                .map((_, i) => "₣")
                .join("")}
            </div>
          </div>
          
          {restaurant.delivery_fee !== undefined && (
            <div className="mt-2 text-sm">
              <span className="text-gray-600">
                {restaurant.delivery_fee === 0 
                  ? 'Livraison gratuite' 
                  : `Frais de livraison: ${restaurant.delivery_fee.toLocaleString('fr-FR')} XAF`}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default RestaurantCard;
