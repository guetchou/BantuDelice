
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Restaurant } from "@/types/restaurant";

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

      // Transform the data to match our Restaurant type
      const restaurant: Restaurant = {
        id: data.id || '',
        name: data.name || '',
        description: data.description || '',
        address: data.address || '',
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        status: (data.status as Restaurant['status']) || 'closed',
        phone: data.phone || '',
        email: data.email || '',
        website: data.website || '',
        logo_url: data.logo_url || '',
        banner_image_url: data.banner_image_url || '',
        cuisine_type: data.cuisine_type || '',
        price_range: data.price_range || 1,
        rating: data.rating || 0,
        average_rating: data.average_rating || 0,
        total_ratings: data.total_ratings || 0,
        minimum_order: data.minimum_order || 0,
        delivery_fee: data.delivery_fee || 0,
        business_hours: data.business_hours || {
          regular: {
            monday: { open: '09:00', close: '21:00', is_closed: false },
            tuesday: { open: '09:00', close: '21:00', is_closed: false },
            wednesday: { open: '09:00', close: '21:00', is_closed: false },
            thursday: { open: '09:00', close: '21:00', is_closed: false },
            friday: { open: '09:00', close: '21:00', is_closed: false },
            saturday: { open: '09:00', close: '21:00', is_closed: false },
            sunday: { open: '09:00', close: '21:00', is_closed: false }
          }
        },
        special_days: data.special_days || [],
        average_prep_time: data.average_prep_time || 30,
        trending: data.trending || false,
        is_open: data.is_open || false
      };

      console.log('Restaurant data transformed:', restaurant);
      return restaurant;
    },
    enabled: !!restaurantId
  });
};

export default useRestaurant;
