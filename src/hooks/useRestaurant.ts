
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Restaurant } from '@/types/restaurant';

export const useRestaurant = (restaurantId: string) => {
  return useQuery<Restaurant>({
    queryKey: ['restaurant', restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', restaurantId)
        .single();

      if (error) throw error;

      // Cast the response to match the Restaurant type
      const restaurant: Restaurant = {
        ...data,
        contact_phone: data.phone || '',
        contact_email: data.email || '',
        is_open: data.status === 'open',
        estimated_delivery_time: data.average_prep_time || 30
      };

      return restaurant;
    },
    meta: {
      errorMessage: "Impossible de charger les détails du restaurant"
    }
  });
};
