
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  business_hours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  special_days?: string[];
  banner_image_url?: string;
  logo_url?: string;
  cuisine_type: string;
  average_rating: number;
  total_ratings: number;
  contact_phone: string;
  contact_email: string;
  is_open: boolean;
  minimum_order: number;
  delivery_fee: number;
  estimated_delivery_time: number;
}

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
      return data;
    },
    meta: {
      errorMessage: "Impossible de charger les détails du restaurant"
    }
  });
};
