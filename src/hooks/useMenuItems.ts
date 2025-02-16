
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { MenuItem } from '@/types/menu';

export const useMenuItems = (restaurantId: string) => {
  return useQuery<MenuItem[]>({
    queryKey: ['menuItems', restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('available', true);

      if (error) throw error;

      return (data || []).map(item => ({
        ...item,
        is_available: item.available,
        created_at: item.created_at,
        updated_at: item.created_at,
        ingredients: [],
        rating: 0,
        preparation_time: 30
      })) as MenuItem[];
    },
    meta: {
      errorMessage: "Impossible de charger le menu"
    }
  });
};
