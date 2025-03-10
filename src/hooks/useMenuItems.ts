
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
        let customizationOptions = {};
        try {
          if (item.customization_options) {
            customizationOptions = typeof item.customization_options === 'string' 
              ? JSON.parse(item.customization_options)
              : item.customization_options;
          }
        } catch (e) {
          console.error("Error parsing customization options:", e);
        }

        return {
          id: item.id,
          name: item.name,
          description: item.description || "",
          price: item.price,
          image_url: item.image_url || "",
          category: item.category,
          restaurant_id: item.restaurant_id,
          available: item.available !== false,
          created_at: item.created_at,
          updated_at: item.created_at,
          ingredients: [],
          rating: 4.5,
          preparation_time: 30,
          dietary_preferences: [],
          customization_options: customizationOptions,
          nutritional_info: {
            calories: null,
            protein: null,
            carbs: null,
            fat: null,
            fiber: null
          },
          allergens: [],
          popularity_score: 0
        };
      });
    },
    meta: {
      errorMessage: "Impossible de charger le menu"
    }
  });
};
