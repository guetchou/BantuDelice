
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  is_available: boolean;
  restaurant_id: string;
  created_at: string;
  updated_at: string;
}

export const useMenuItems = (restaurantId: string) => {
  return useQuery<MenuItem[]>({
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
