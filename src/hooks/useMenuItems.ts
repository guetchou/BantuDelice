
import { useQuery } from "@tanstack/react-query";
import { MenuItem } from "@/types/menu";
import { restaurantApi } from "@/integrations/api/restaurants";
import { useToast } from "@/hooks/use-toast";

export const useMenuItems = (restaurantId: string | undefined) => {
  const { toast } = useToast();
  
  const {
    data: items = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['menuItems', restaurantId],
    queryFn: async () => {
      if (!restaurantId) {
        throw new Error('Restaurant ID is required');
      }
      
      try {
        const data = await restaurantApi.getMenu(restaurantId);
        return data as MenuItem[];
      } catch (error) {
        console.error('Error fetching menu items:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le menu du restaurant",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!restaurantId
  });
  
  // Extraire les catégories uniques à partir des éléments du menu
  const categories = Array.from(new Set(items.map(item => item.category)));
  
  // Obtenir les éléments populaires
  const popular = items
    .filter(item => item.popularity_score && item.popularity_score > 0.7)
    .sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0))
    .slice(0, 4);
  
  return {
    items,
    categories,
    isLoading,
    error,
    popular
  };
};
