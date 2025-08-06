
import { useQuery } from '@tanstack/react-query';
import apiService from '@/services/api';
import { RestaurantDetails, BusinessHours } from '@/types/restaurant';

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

      // Extraire et convertir les données nécessaires
      let businessHours: BusinessHours;
      try {
        businessHours = data.business_hours as unknown as BusinessHours;
      } catch (e) {
        // Créer une structure par défaut si les données sont invalides
        businessHours = {
          regular: {
            monday: { open: '09:00', close: '21:00', is_closed: false },
            tuesday: { open: '09:00', close: '21:00', is_closed: false },
            wednesday: { open: '09:00', close: '21:00', is_closed: false },
            thursday: { open: '09:00', close: '21:00', is_closed: false },
            friday: { open: '09:00', close: '21:00', is_closed: false },
            saturday: { open: '09:00', close: '21:00', is_closed: false },
            sunday: { open: '09:00', close: '21:00', is_closed: false }
          }
        };
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        phone: data.phone || data.contact_phone || '',
        website: data.website,
        email: data.email || data.contact_email || '',
        logo_url: data.logo_url,
        banner_image_url: data.banner_image_url,
        cuisine_type: data.cuisine_type,
        price_range: data.price_range || 1,
        average_rating: data.average_rating || 0,
        total_ratings: data.total_ratings || 0,
        featured: data.featured || false,
        user_id: data.user_id,
        created_at: data.created_at,
        updated_at: data.updated_at || data.created_at,
        status: data.status || 'active',
        business_hours: businessHours,
        delivery_radius: data.delivery_radius,
        minimum_order: data.minimum_order || 0,
        payment_methods: data.payment_methods || [],
        tags: data.tags || [],
        opening_date: data.opening_date || '',
        special_features: data.special_features || [],
        delivery_fee: data.delivery_fee || 0,
        free_delivery_min: data.free_delivery_min,
        special_days: data.special_days || [],
        contact_phone: data.contact_phone || data.phone || '',
        contact_email: data.contact_email || data.email || '',
        is_open: data.is_open || data.status === 'open',
        estimated_delivery_time: data.estimated_delivery_time || 30
      };
    },
    meta: {
      errorMessage: "Impossible de charger les détails du restaurant"
    }
  });
};
