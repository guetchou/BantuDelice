
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from '@/integrations/supabase/client';
import { Star, ArrowRight, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCart from '@/hooks/useCart';
import { useSmartRecommendations } from '@/hooks/useSmartRecommendations';

interface PersonalizedRecommendationsProps {
  userId: string;
  showTitle?: boolean;
  limit?: number;
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({ 
  userId, 
  showTitle = true,
  limit = 6 
}) => {
  const { recommendations, loading } = useSmartRecommendations({ 
    userId, 
    limit 
  });
  const { addToCart } = useCart();

  if (loading) {
    return <RecommendationsSkeleton count={limit} showTitle={showTitle} />;
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="space-y-4">
        {showTitle && <h2 className="text-2xl font-bold">Recommendations</h2>}
        <Card className="overflow-hidden">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Utensils className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">No recommendations yet</h3>
              <p className="text-muted-foreground mt-2">
                Keep exploring and ordering to get personalized recommendations
              </p>
              <Button className="mt-4" asChild>
                <Link to="/restaurants">Browse Restaurants</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showTitle && (
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Recommended for You</h2>
          <Button variant="link" asChild>
            <Link to="/restaurants" className="flex items-center">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recommendations.map((item) => (
          <Card key={item.id} className="overflow-hidden flex flex-col">
            <Link to={`/restaurant/${item.restaurant_id}`}>
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image_url || `https://source.unsplash.com/random/400x300/?food,${item.name}`}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
                {item.discount_percentage > 0 && (
                  <Badge className="absolute top-2 right-2 bg-red-500">
                    {item.discount_percentage}% OFF
                  </Badge>
                )}
              </div>
            </Link>
            
            <CardContent className="pt-4 flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-sm">{item.average_rating?.toFixed(1) || "N/A"}</span>
                </div>
              </div>
              
              <div className="mt-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {item.discount_percentage > 0 ? (
                      <>
                        <span className="line-through text-muted-foreground mr-2">
                          ${item.price}
                        </span>
                        ${(item.price * (1 - item.discount_percentage / 100)).toFixed(2)}
                      </>
                    ) : (
                      `$${item.price}`
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.category}
                  </span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-0">
              <Button 
                className="w-full" 
                onClick={() => {
                  addToCart({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    restaurant_id: item.restaurant_id,
                    image_url: item.image_url,
                    description: item.description
                  });
                }}
              >
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

const RecommendationsSkeleton = ({ count = 6, showTitle = true }) => {
  return (
    <div className="space-y-4">
      {showTitle && <Skeleton className="h-8 w-64" />}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array(count).fill(null).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="pt-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3 mb-3" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;
