
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

export const useRestaurantDetails = (restaurantId: string) => {
  const fetchRestaurantDetails = async () => {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', restaurantId)
      .single();

    if (error) throw error;

    // Ensure business_hours is properly typed
    const businessHours = data?.business_hours as unknown as BusinessHours;
    const specialDays = data?.special_days as unknown as string[];

    return {
      ...data,
      business_hours: businessHours,
      special_days: specialDays
    };
  };

  return useQuery({
    queryKey: ['restaurant', restaurantId],
    queryFn: fetchRestaurantDetails,
    meta: {
      errorMessage: "Impossible de charger les détails du restaurant"
    }
  });
};
