
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { MenuItem } from '@/types/restaurant';

export const useMenuItems = (restaurantId: string) => {
  return useQuery<MenuItem[]>({
    queryKey: ['menuItems', restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId);

      if (error) {
        console.error("Error fetching menu items:", error);
        throw error;
      }

      return (data || []).map(item => {
        // Parse customization options
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
          category: item.category || "General",
          restaurant_id: item.restaurant_id,
          available: item.available !== false,
          created_at: item.created_at,
          updated_at: item.created_at, // Fallback if updated_at is missing
          ingredients: Array.isArray(item.dietary_preferences) ? item.dietary_preferences : [],
          rating: item.rating || 4.5,
          preparation_time: item.average_prep_time || 30,
          dietary_preferences: Array.isArray(item.dietary_preferences) ? item.dietary_preferences : [],
          customization_options: customizationOptions as Record<string, any>,
          nutritional_info: {
            calories: null,
            protein: null,
            carbs: null,
            fat: null,
            fiber: null
          },
          allergens: [],
          popularity_score: item.popularity_score || 0
        };
      });
    },
    meta: {
      errorMessage: "Impossible de charger le menu"
    }
  });
};
