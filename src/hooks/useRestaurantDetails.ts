
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface BusinessHours {
  regular: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  special?: {
    date: string;
    open: string;
    close: string;
  }[];
}

interface RestaurantDetails {
  id: string;
  name: string;
  description: string;
  address: string;
  business_hours: BusinessHours;
  special_days: string[];
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

export const useRestaurantDetails = (restaurantId: string) => {
  return useQuery<RestaurantDetails>({
    queryKey: ['restaurantDetails', restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', restaurantId)
        .single();

      if (error) throw error;

      return {
        ...data,
        business_hours: data.business_hours as BusinessHours,
        special_days: data.special_days || []
      };
    },
    meta: {
      errorMessage: "Impossible de charger les détails du restaurant"
    }
  });
};
