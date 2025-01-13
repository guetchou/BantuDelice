import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Restaurant {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export const useRestaurant = (restaurantId: string | undefined) => {
  return useQuery({
    queryKey: ['restaurant', restaurantId],
    queryFn: async () => {
      if (!restaurantId) throw new Error('Restaurant ID is required');
      
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', restaurantId)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error('Restaurant not found');
      return data as Restaurant;
    },
    enabled: !!restaurantId
  });
};