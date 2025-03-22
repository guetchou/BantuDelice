
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, TrendingUp, Leaf, Award, Clock } from 'lucide-react';
import { MenuItem } from '@/types/menu';
import RecommendedItem from './RecommendedItem';

interface RecommendationTabsProps {
  selectedItem: MenuItem | null;
  recommendedItems: MenuItem[];
  popularItems: MenuItem[];
  healthyItems: MenuItem[];
  quickItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

const RecommendationTabs: React.FC<RecommendationTabsProps> = ({ 
  selectedItem, 
  recommendedItems, 
  popularItems, 
  healthyItems, 
  quickItems, 
  onAddToCart 
}) => {
  return (
    <Tabs defaultValue="related" className="w-full">
      <TabsList className="w-full mb-4">
        <TabsTrigger value="related" className="flex-1">
          <Award className="w-4 h-4 mr-2" />
          Pour vous
        </TabsTrigger>
        <TabsTrigger value="popular" className="flex-1">
          <TrendingUp className="w-4 h-4 mr-2" />
          Populaires
        </TabsTrigger>
        <TabsTrigger value="healthy" className="flex-1">
          <Leaf className="w-4 h-4 mr-2" />
          Santé
        </TabsTrigger>
        <TabsTrigger value="quick" className="flex-1">
          <Clock className="w-4 h-4 mr-2" />
          Rapides
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="related" className="space-y-3 pt-2">
        {selectedItem ? (
          recommendedItems.length > 0 ? (
            recommendedItems.map((item, index) => (
              <RecommendedItem key={index} item={item} onAddToCart={onAddToCart} />
            ))
          ) : (
            <div className="text-center py-4 text-sm text-muted-foreground">
              Sélectionnez un plat pour voir des recommandations associées
            </div>
          )
        ) : (
          <div className="text-center py-4 text-sm text-muted-foreground">
            Sélectionnez un plat pour voir des recommandations associées
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="popular" className="space-y-3 pt-2">
        {popularItems.map((item, index) => (
          <RecommendedItem 
            key={index} 
            item={item} 
            badge={{ icon: <Star className="w-3 h-3" />, text: "Populaire" }}
            onAddToCart={onAddToCart} 
          />
        ))}
      </TabsContent>
      
      <TabsContent value="healthy" className="space-y-3 pt-2">
        {healthyItems.map((item, index) => (
          <RecommendedItem 
            key={index} 
            item={item} 
            badge={{ icon: <Leaf className="w-3 h-3" />, text: item.is_vegan ? "Vegan" : "Végétarien" }}
            onAddToCart={onAddToCart} 
          />
        ))}
      </TabsContent>
      
      <TabsContent value="quick" className="space-y-3 pt-2">
        {quickItems.map((item, index) => (
          <RecommendedItem 
            key={index} 
            item={item} 
            badge={{ icon: <Clock className="w-3 h-3" />, text: `${item.preparation_time} min` }}
            onAddToCart={onAddToCart} 
          />
        ))}
      </TabsContent>
    </Tabs>
  );
};

export default RecommendationTabs;
