
import { useQuery } from '@tanstack/react-query';
import apiService from '@/services/api';
import type { Restaurant, BusinessHours } from '@/types/restaurant';

export const useRestaurant = (restaurantId: string) => {
  return useQuery<Restaurant>({
    queryKey: ['restaurant', restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', restaurantId)
        .single();

      if (error) {
        console.error("Error fetching restaurant:", error);
        throw error;
      }

      if (!data) {
        throw new Error("Restaurant not found");
      }

      // Parse business hours or use default
      let businessHours: BusinessHours;
      try {
        if (data.business_hours) {
          businessHours = typeof data.business_hours === 'string' 
            ? JSON.parse(data.business_hours)
            : data.business_hours as unknown as BusinessHours;
        } else {
          businessHours = {
            regular: {
              monday: { open: '08:00', close: '22:00', is_closed: false },
              tuesday: { open: '08:00', close: '22:00', is_closed: false },
              wednesday: { open: '08:00', close: '22:00', is_closed: false },
              thursday: { open: '08:00', close: '22:00', is_closed: false },
              friday: { open: '08:00', close: '22:00', is_closed: false },
              saturday: { open: '08:00', close: '22:00', is_closed: false },
              sunday: { open: '08:00', close: '22:00', is_closed: false }
            }
          };
        }
      } catch (e) {
        console.error("Error parsing business hours:", e);
        businessHours = {
          regular: {
            monday: { open: '08:00', close: '22:00', is_closed: false },
            tuesday: { open: '08:00', close: '22:00', is_closed: false },
            wednesday: { open: '08:00', close: '22:00', is_closed: false },
            thursday: { open: '08:00', close: '22:00', is_closed: false },
            friday: { open: '08:00', close: '22:00', is_closed: false },
            saturday: { open: '08:00', close: '22:00', is_closed: false },
            sunday: { open: '08:00', close: '22:00', is_closed: false }
          }
        };
      }

      // Transform the database response into our Restaurant type
      const restaurant: Restaurant = {
        id: data.id,
        name: data.name || 'Unknown Restaurant',
        description: data.description || '',
        address: data.address || '',
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        status: (data.status as "open" | "closed" | "busy") || 'closed',
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
        business_hours: businessHours,
        special_days: data.special_days as string[] || [],
        average_prep_time: data.average_prep_time || 30,
        trending: data.trending || false,
        is_open: data.is_open || false
      };

      return restaurant;
    },
    meta: {
      errorMessage: "Impossible de charger les détails du restaurant"
    }
  });
};
