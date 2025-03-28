
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin, Award } from "lucide-react";

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    address: string;
    cuisine_type?: string;
    rating?: number;
    estimated_preparation_time?: number;
    image_url?: string;
    banner_image_url?: string;
    logo_url?: string;
    distance?: number;
    trending?: boolean;
    featured?: boolean;
  };
  onClick: (id: string) => void;
}

const ImprovedRestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick }) => {
  const {
    id,
    name,
    address,
    cuisine_type,
    rating,
    estimated_preparation_time,
    banner_image_url,
    logo_url,
    trending,
    featured
  } = restaurant;
  
  const imageUrl = banner_image_url || logo_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop';
  
  // Format rating to 1 decimal place if available
  const formattedRating = rating ? rating.toFixed(1) : '-';
  
  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-md cursor-pointer border border-gray-200 h-full flex flex-col bg-white"
      onClick={() => onClick(id)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        {trending && (
          <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600">
            Populaire
          </Badge>
        )}
        {featured && (
          <Badge className="absolute top-2 left-2 bg-indigo-500 hover:bg-indigo-600">
            <Award className="w-3 h-3 mr-1" /> Recommandé
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{name}</h3>
          {rating !== undefined && (
            <span className="flex items-center text-sm font-medium gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded">
              <Star className="h-3 w-3 fill-current" />
              {formattedRating}
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-2 pt-0 flex-grow">
        {cuisine_type && (
          <Badge variant="outline" className="mb-2 bg-gray-50 text-gray-700 hover:bg-gray-100 font-normal">
            {cuisine_type}
          </Badge>
        )}
        
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          <span className="truncate">{address}</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 text-sm text-gray-500 border-t border-gray-100 mt-2">
        {estimated_preparation_time && (
          <div className="flex items-center w-full justify-between">
            <span className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>{estimated_preparation_time} min</span>
            </span>
            <span className="text-primary font-medium">Commander</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ImprovedRestaurantCard;
