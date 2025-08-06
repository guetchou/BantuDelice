
import { useQuery } from "@tanstack/react-query";
import apiService from "@/services/api";

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
      
      console.log('Fetching restaurant with ID:', restaurantId);
      
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', restaurantId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching restaurant:', error);
        throw error;
      }
      
      if (!data) {
        console.error('Restaurant not found');
        throw new Error('Restaurant not found');
      }

      console.log('Restaurant data:', data);
      return data as Restaurant;
    },
    enabled: !!restaurantId
  });
};
