
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

      return (data || []).map(item => ({
        ...item,
        available: item.available !== false, // Default to available if not specified
        created_at: item.created_at || new Date().toISOString(),
        updated_at: item.created_at || new Date().toISOString(),
        ingredients: item.ingredients || [],
        rating: item.rating || 4.5,
        preparation_time: item.preparation_time || 30,
        dietary_preferences: item.dietary_preferences || [],
        customization_options: item.customization_options || {}
      })) as MenuItem[];
    },
    meta: {
      errorMessage: "Impossible de charger le menu"
    }
  });
};
