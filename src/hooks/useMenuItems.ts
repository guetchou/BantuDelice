
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
        // Create a properly typed MenuItem with default values for missing fields
        const menuItem: MenuItem = {
          id: item.id,
          name: item.name,
          description: item.description || "",
          price: item.price,
          image_url: item.image_url || "",
          category: item.category,
          restaurant_id: item.restaurant_id,
          available: item.available !== false, // Default to available if not specified
          created_at: item.created_at,
          // Add missing properties with default values
          updated_at: new Date().toISOString(),
          ingredients: [],
          rating: 4.5,
          preparation_time: 30,
          dietary_preferences: item.dietary_preferences || [],
          customization_options: item.customization_options ? 
            (typeof item.customization_options === 'string' ? 
              JSON.parse(item.customization_options) : 
              item.customization_options) : 
            {},
          nutritional_info: {
            calories: null,
            protein: null,
            carbs: null,
            fat: null,
            fiber: null
          },
          allergens: []
        };
        
        return menuItem;
      });
    },
    meta: {
      errorMessage: "Impossible de charger le menu"
    }
  });
};
