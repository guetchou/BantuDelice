
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from '@/integrations/supabase/client';
import { Star, ArrowRight, Plus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import type { MenuItem } from '@/types/menu';

interface RecommendationSectionProps {
  restaurantId: string;
  title?: string;
  limit?: number;
}

const RecommendationSection: React.FC<RecommendationSectionProps> = ({ 
  restaurantId, 
  title = "Recommended for You", 
  limit = 4
}) => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .eq('is_recommended', true)
          .limit(limit);
          
        if (error) throw error;
        
        setItems(data || []);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [restaurantId, limit]);

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
      description: item.description || '',
      restaurant_id: restaurantId,
      quantity: 1
    });
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart`,
    });
  };

  if (loading) {
    return <RecommendationSectionSkeleton />;
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{title}</h2>
        <Button variant="ghost" size="sm" className="gap-1">
          View All <ArrowRight size={16} />
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <RecommendationCard 
            key={item.id} 
            item={item} 
            onAddToCart={() => handleAddToCart(item)} 
          />
        ))}
      </div>
    </div>
  );
};

// Extracted RecommendationCard component
interface RecommendationCardProps {
  item: MenuItem;
  onAddToCart: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ item, onAddToCart }) => {
  return (
    <Card key={item.id} className="overflow-hidden">
      <div className="relative h-40">
        <img
          src={item.image_url || `https://source.unsplash.com/random/300x200/?food,${item.name}`}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {item.is_vegetarian && (
          <Badge className="absolute top-2 right-2 bg-green-500">
            Veg
          </Badge>
        )}
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium line-clamp-1">{item.name}</h3>
        <div className="flex justify-between items-center mt-1">
          <span className="font-medium">${item.price}</span>
          <div className="flex items-center text-yellow-500">
            <Star size={14} className="fill-yellow-500" />
            <span className="text-xs ml-1">{item.average_rating || 4.5}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button 
          size="sm" 
          className="w-full"
          onClick={onAddToCart}
        >
          <Plus size={16} className="mr-1" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

// Skeleton component for loading state
const RecommendationSectionSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array(4).fill(null).map((_, i) => (
          <Card key={i}>
            <Skeleton className="h-40 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecommendationSection;
