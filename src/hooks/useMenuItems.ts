
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { CartItem } from '@/types/cart';

export const useMenuItems = (restaurantId: string) => {
  return useQuery({
    queryKey: ['menuItems', restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('is_available', true);

      if (error) throw error;
      return data || [];
    },
    meta: {
      errorMessage: "Impossible de charger le menu"
    }
  });
};
