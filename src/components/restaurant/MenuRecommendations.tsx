
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { useMenuEnhanced } from '@/hooks/useMenuEnhanced';
import { MenuItem } from '@/types/menu';
import RecommendationTabs from './recommendation/RecommendationTabs';

interface MenuRecommendationsProps {
  restaurantId: string;
  selectedItem?: MenuItem | null;
}

const MenuRecommendations: React.FC<MenuRecommendationsProps> = ({ restaurantId, selectedItem }) => {
  const { toast } = useToast();
  const { 
    allItems, 
    recommendedItems, 
    selectItem 
  } = useMenuEnhanced(restaurantId);
  
  // Intelligence 1: Recommandations basées sur la popularité
  const popularItems = useMemo(() => {
    if (!allItems) return [];
    
    return [...allItems]
      .sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0))
      .slice(0, 3);
  }, [allItems]);
  
  // Intelligence 2: Recommandations basées sur la valeur nutritionnelle
  const healthyItems = useMemo(() => {
    if (!allItems) return [];
    
    return [...allItems]
      .filter(item => item.is_vegetarian || item.is_vegan)
      .sort((a, b) => (b.nutritional_score || 0) - (a.nutritional_score || 0))
      .slice(0, 3);
  }, [allItems]);
  
  // Intelligence 3: Recommandations basées sur le temps de préparation
  const quickItems = useMemo(() => {
    if (!allItems) return [];
    
    return [...allItems]
      .filter(item => item.preparation_time && item.preparation_time < 20)
      .sort((a, b) => (a.preparation_time || 0) - (b.preparation_time || 0))
      .slice(0, 3);
  }, [allItems]);
  
  const handleAddToCart = (item: MenuItem) => {
    toast({
      title: "Ajouté au panier",
      description: `${item.name} a été ajouté à votre panier`
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Recommandations intelligentes</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <RecommendationTabs
          selectedItem={selectedItem || null}
          recommendedItems={recommendedItems}
          popularItems={popularItems}
          healthyItems={healthyItems}
          quickItems={quickItems}
          onAddToCart={handleAddToCart}
        />
      </CardContent>
    </Card>
  );
};

export default MenuRecommendations;
