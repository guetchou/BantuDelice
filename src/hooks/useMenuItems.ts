
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { MenuItem } from '@/components/menu/types';

export const useMenuItems = (restaurantId: string) => {
  return useQuery<MenuItem[]>({
    queryKey: ['menuItems', restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId);

      if (error) throw error;

      return (data || []).map(item => {
        // Parse customization options
        const customizationOptions = item.customization_options ? 
          (typeof item.customization_options === 'string' ? 
            JSON.parse(item.customization_options) : 
            item.customization_options) : 
          {};

        // Create properly typed MenuItem with all required fields
        const menuItem: MenuItem = {
          id: item.id,
          name: item.name,
          description: item.description || "",
          price: item.price,
          image_url: item.image_url || "",
          category: item.category,
          restaurant_id: item.restaurant_id,
          available: item.available !== false,
          created_at: item.created_at,
          updated_at: item.updated_at || new Date().toISOString(),
          ingredients: item.ingredients || [],
          rating: item.rating || 4.5,
          preparation_time: item.preparation_time || 30,
          dietary_preferences: item.dietary_preferences || [],
          customization_options: customizationOptions,
          nutritional_info: item.nutritional_info || {
            calories: null,
            protein: null,
            carbs: null,
            fat: null,
            fiber: null
          },
          allergens: item.allergens || [],
          popularity_score: item.popularity_score
        };
        
        return menuItem;
      });
    },
    meta: {
      errorMessage: "Impossible de charger le menu"
    }
  });
};
