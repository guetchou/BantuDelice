import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { 
  Restaurant, 
  DeliveryZone, 
  RestaurantEvent, 
  RestaurantPromotion, 
  RestaurantPeakHours,
  RestaurantStatus,
  PaymentMethod,
  RestaurantService,
  MenuCategory,
  SocialMedia,
  BusinessHours
} from "@/types/restaurant";

export const useRestaurant = (restaurantId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: restaurant, isLoading, error } = useQuery({
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

      // Parser et convertir social_media
      let socialMediaData = {};
      try {
        socialMediaData = typeof data.social_media === 'string' 
          ? JSON.parse(data.social_media) 
          : data.social_media || {};
      } catch (e) {
        console.error('Error parsing social_media:', e);
      }

      const socialMedia: SocialMedia = {
        facebook: (socialMediaData as any)?.facebook || undefined,
        instagram: (socialMediaData as any)?.instagram || undefined,
        twitter: (socialMediaData as any)?.twitter || undefined,
        linkedin: (socialMediaData as any)?.linkedin || undefined,
        youtube: (socialMediaData as any)?.youtube || undefined
      };

      // Parser et convertir business_hours
      let businessHours: BusinessHours = { regular: {} };
      try {
        const parsedHours = typeof data.business_hours === 'string'
          ? JSON.parse(data.business_hours)
          : data.business_hours || { regular: {} };
        
        businessHours = {
          regular: parsedHours.regular || {},
          special: parsedHours.special || []
        };
      } catch (e) {
        console.error('Error parsing business_hours:', e);
      }

      // Convertir les menu_categories
      const menuCategories: MenuCategory[] = Array.isArray(data.menu_categories) 
        ? data.menu_categories.map((cat: any) => ({
            id: cat.id || '',
            name: cat.name || '',
            description: cat.description,
            image_url: cat.image_url,
            order: cat.order || 0
          }))
        : [];

      // Transformer les données pour correspondre au type Restaurant
      const transformedData: Restaurant = {
        id: data.id,
        user_id: data.user_id,
        name: data.name,
        description: data.description || undefined,
        banner_image_url: data.banner_image_url || undefined,
        logo_url: data.logo_url || undefined,
        cuisine_type: data.cuisine_type || undefined,
        address: data.address,
        location: data.location ? {
          type: "Point",
          coordinates: [
            data.location.coordinates?.[0] || 0,
            data.location.coordinates?.[1] || 0
          ]
        } : undefined,
        phone: data.phone || undefined,
        email: data.email || undefined,
        website: data.website || undefined,
        social_media: socialMedia,
        capacity: data.capacity || undefined,
        delivery_radius: data.delivery_radius || undefined,
        minimum_order: data.minimum_order || undefined,
        delivery_fee: data.delivery_fee || undefined,
        tax_rate: data.tax_rate || undefined,
        payment_methods: data.payment_methods || [],
        services: data.services || [],
        status: data.status as RestaurantStatus || 'active',
        business_hours: businessHours,
        special_hours: data.special_hours || undefined,
        holidays: data.holidays || [],
        tags: data.tags || [],
        features: data.features || [],
        certifications: data.certifications || [],
        average_prep_time: data.average_prep_time || undefined,
        menu_categories: menuCategories,
        order_count: data.order_count || 0,
        total_revenue: data.total_revenue || 0,
        average_ticket: data.average_ticket || undefined,
        rating: data.rating || undefined,
        review_count: data.review_count || 0,
        ambiance: data.ambiance || [],
        dress_code: data.dress_code || undefined,
        parking_options: data.parking_options || [],
        accessibility_features: data.accessibility_features || [],
        created_at: data.created_at,
        updated_at: data.updated_at || data.created_at
      };

      return transformedData;
    },
    enabled: !!restaurantId
  });

  const { data: deliveryZones } = useQuery({
    queryKey: ['restaurant', restaurantId, 'delivery-zones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('delivery_zones')
        .select('*')
        .eq('restaurant_id', restaurantId);

      if (error) throw error;

      return (data || []).map(zone => {
        let estimatedTime;
        try {
          const timeRange = typeof zone.estimated_time_range === 'string'
            ? JSON.parse(zone.estimated_time_range)
            : zone.estimated_time_range;
          estimatedTime = timeRange?.average;
        } catch (e) {
          console.error('Error parsing estimated_time_range:', e);
        }

        return {
          id: zone.id,
          restaurant_id: restaurantId,
          zone_name: zone.name,
          delivery_fee: zone.base_delivery_fee,
          minimum_order: zone.minimum_order,
          estimated_time: estimatedTime,
          area: zone.polygon,
          created_at: zone.created_at,
          updated_at: zone.created_at
        };
      }) as DeliveryZone[];
    },
    enabled: !!restaurantId
  });

  const { data: events } = useQuery({
    queryKey: ['restaurant', restaurantId, 'events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurant_events')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .gte('end_date', new Date().toISOString());

      if (error) throw error;
      return data as RestaurantEvent[];
    },
    enabled: !!restaurantId
  });

  const { data: promotions } = useQuery({
    queryKey: ['restaurant', restaurantId, 'promotions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurant_promotions')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('active', true)
        .gte('end_date', new Date().toISOString());

      if (error) throw error;

      return (data || []).map(promo => ({
        id: promo.id,
        restaurant_id: promo.restaurant_id,
        title: promo.title,
        description: promo.description || undefined,
        discount_type: promo.discount_type as RestaurantPromotion['discount_type'],
        discount_value: promo.discount_value || 0,
        start_date: promo.start_date || new Date().toISOString(),
        end_date: promo.end_date || new Date().toISOString(),
        conditions: promo.conditions?.[0] || '',
        usage_limit: undefined,
        usage_count: 0,
        minimum_order: promo.min_order_amount,
        applicable_items: [],
        excluded_items: [],
        customer_type: ['all'],
        status: promo.active ? 'active' : 'inactive',
        created_at: promo.created_at,
        updated_at: promo.created_at
      })) as RestaurantPromotion[];
    },
    enabled: !!restaurantId
  });

  const { data: peakHours } = useQuery({
    queryKey: ['restaurant', restaurantId, 'peak-hours'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurant_peak_hours')
        .select('*')
        .eq('restaurant_id', restaurantId);

      if (error) throw error;
      return data as RestaurantPeakHours[];
    },
    enabled: !!restaurantId
  });

  const updateRestaurant = useMutation({
    mutationFn: async (updates: Partial<Restaurant>) => {
      const updateData = Object.entries(updates).reduce((acc, [key, value]) => {
        if (key === 'business_hours' || key === 'social_media' || key === 'menu_categories') {
          acc[key] = JSON.stringify(value);
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      const { data, error } = await supabase
        .from('restaurants')
        .update(updateData)
        .eq('id', restaurantId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant', restaurantId] });
      toast({
        title: "Restaurant mis à jour",
        description: "Les modifications ont été enregistrées avec succès",
      });
    },
    onError: (error) => {
      console.error('Error updating restaurant:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le restaurant",
        variant: "destructive",
      });
    }
  });

  const checkAvailability = async (date: Date): Promise<boolean> => {
    const { data: available } = await supabase
      .rpc('check_restaurant_availability', { 
        restaurant_id: restaurantId,
        check_time: date.toISOString()
      });
    return !!available;
  };

  return {
    restaurant,
    deliveryZones,
    events,
    promotions,
    peakHours,
    isLoading,
    error,
    updateRestaurant,
    checkAvailability
  };
};
