
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
        .eq('restaurant_id', restaurantId)
        .eq('available', true);

      if (error) throw error;

      return (data || []).map(item => ({
        ...item,
        is_available: item.available,
        updated_at: item.created_at, // Fallback if updated_at is not available
      })) as MenuItem[];
    },
    meta: {
      errorMessage: "Impossible de charger le menu"
    }
  });
};
