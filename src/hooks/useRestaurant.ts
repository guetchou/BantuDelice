
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

      return {
        ...data,
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        status: data.status || 'closed',
        phone: data.phone || '',
        email: data.email || '',
        average_prep_time: data.average_prep_time || 30,
        total_ratings: data.total_ratings || 0,
        minimum_order: data.minimum_order || 0,
        delivery_fee: data.delivery_fee || 0,
        business_hours: data.business_hours,
        special_days: data.special_days || []
      } as Restaurant;
    },
    meta: {
      errorMessage: "Impossible de charger les détails du restaurant"
    }
  });
};
