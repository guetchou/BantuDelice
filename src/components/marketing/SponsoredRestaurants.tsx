
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, DollarSign, Megaphone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { PremiumBadge } from "@/components/subscription/PremiumBadge";
import { SubscriptionTier } from "@/types/subscription";

export function SponsoredRestaurants() {
  const navigate = useNavigate();
  
  const { data: featuredRestaurants, isLoading } = useQuery({
    queryKey: ['featuredRestaurants'],
    queryFn: async () => {
      // In a real app, this would fetch featured restaurants from the database
      // For now, we'll use dummy data
      return [
        {
          id: '1',
          name: 'Le Gourmet Africain',
          cuisine_type: 'Cuisine traditionnelle',
          rating: 4.8,
          image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
          sponsorship_level: 'premium',
          subscription_tier: 'elite' as SubscriptionTier
        },
        {
          id: '2',
          name: 'Saveurs d\'Afrique',
          cuisine_type: 'Fusion africaine',
          rating: 4.5,
          image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
          sponsorship_level: 'standard',
          subscription_tier: 'premium' as SubscriptionTier
        },
        {
          id: '3',
          name: 'Le Palais Gourmand',
          cuisine_type: 'Cuisine camerounaise',
          rating: 4.7,
          image_url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
          sponsorship_level: 'premium',
          subscription_tier: 'premium' as SubscriptionTier
        },
        {
          id: '4',
          name: 'Délices du Cameroun',
          cuisine_type: 'Cuisine locale',
          rating: 4.9,
          image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
          sponsorship_level: 'premium',
          subscription_tier: 'elite' as SubscriptionTier
        }
      ];
    }
  });
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            Restaurants en vedette
          </CardTitle>
          <CardDescription>
            Découvrez nos restaurants partenaires mis en avant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-primary" />
          Restaurants en vedette
        </CardTitle>
        <CardDescription>
          Découvrez nos restaurants partenaires mis en avant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredRestaurants?.map((restaurant) => (
            <div 
              key={restaurant.id} 
              className="group relative overflow-hidden rounded-lg cursor-pointer"
              onClick={() => navigate(`/restaurant/${restaurant.id}`)}
            >
              <div 
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${restaurant.image_url})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity group-hover:opacity-90" />
              </div>
              
              <div className="absolute top-2 right-2 flex gap-2">
                <PremiumBadge tier={restaurant.subscription_tier} size="sm" />
                
                {restaurant.sponsorship_level === 'premium' && (
                  <Badge 
                    variant="outline"
                    className="bg-black/40 text-white border-white/20 backdrop-blur-sm text-xs"
                  >
                    En vedette
                  </Badge>
                )}
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div>
                  <h3 className="font-bold text-lg group-hover:text-primary-foreground transition-colors">
                    {restaurant.name}
                  </h3>
                  <p className="text-sm text-gray-200">{restaurant.cuisine_type}</p>
                </div>
                <div className="flex items-center mt-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 text-sm">{restaurant.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default SponsoredRestaurants;
