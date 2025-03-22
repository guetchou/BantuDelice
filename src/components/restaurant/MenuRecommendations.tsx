
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMenuEnhanced } from '@/hooks/useMenuEnhanced';
import { Star, TrendingUp, Leaf, Award, Clock } from 'lucide-react';
import { MenuItem } from '@/types/menu';

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
  const popularItems = React.useMemo(() => {
    if (!allItems) return [];
    
    return [...allItems]
      .sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0))
      .slice(0, 3);
  }, [allItems]);
  
  // Intelligence 2: Recommandations basées sur la valeur nutritionnelle
  const healthyItems = React.useMemo(() => {
    if (!allItems) return [];
    
    return [...allItems]
      .filter(item => item.is_vegetarian || item.is_vegan)
      .sort((a, b) => (b.nutritional_score || 0) - (a.nutritional_score || 0))
      .slice(0, 3);
  }, [allItems]);
  
  // Intelligence 3: Recommandations basées sur le temps de préparation
  const quickItems = React.useMemo(() => {
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
                  <RecommendedItem key={index} item={item} onAddToCart={handleAddToCart} />
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
                onAddToCart={handleAddToCart} 
              />
            ))}
          </TabsContent>
          
          <TabsContent value="healthy" className="space-y-3 pt-2">
            {healthyItems.map((item, index) => (
              <RecommendedItem 
                key={index} 
                item={item} 
                badge={{ icon: <Leaf className="w-3 h-3" />, text: item.is_vegan ? "Vegan" : "Végétarien" }}
                onAddToCart={handleAddToCart} 
              />
            ))}
          </TabsContent>
          
          <TabsContent value="quick" className="space-y-3 pt-2">
            {quickItems.map((item, index) => (
              <RecommendedItem 
                key={index} 
                item={item} 
                badge={{ icon: <Clock className="w-3 h-3" />, text: `${item.preparation_time} min` }}
                onAddToCart={handleAddToCart} 
              />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface RecommendedItemProps {
  item: MenuItem;
  badge?: {
    icon: React.ReactNode;
    text: string;
  };
  onAddToCart: (item: MenuItem) => void;
}

const RecommendedItem: React.FC<RecommendedItemProps> = ({ item, badge, onAddToCart }) => {
  return (
    <div className="flex items-center justify-between gap-3 p-2 rounded-md hover:bg-accent transition-colors">
      <div className="flex gap-3 flex-1 min-w-0">
        {item.image_url ? (
          <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
            <img 
              src={item.image_url} 
              alt={item.name} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
            <span className="text-xs text-muted-foreground">Image</span>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm truncate">{item.name}</h4>
            {badge && (
              <Badge variant="secondary" className="ml-1 flex items-center gap-1 text-xs">
                {badge.icon}
                <span>{badge.text}</span>
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {item.description || item.category}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium whitespace-nowrap">
          {item.price.toLocaleString('fr-FR')} FCFA
        </span>
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-8 w-8 p-0 rounded-full" 
          onClick={() => onAddToCart(item)}
        >
          <span className="sr-only">Ajouter au panier</span>
          <TrendingUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MenuRecommendations;
