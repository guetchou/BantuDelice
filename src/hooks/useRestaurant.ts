
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Restaurant, DeliveryZone, RestaurantEvent, RestaurantPromotion, RestaurantPeakHours } from "@/types/restaurant";

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
        .single();
      
      if (error) {
        console.error('Error fetching restaurant:', error);
        throw error;
      }
      
      if (!data) {
        console.error('Restaurant not found');
        throw new Error('Restaurant not found');
      }

      // Transformer les données pour correspondre au type Restaurant
      const transformedData: Restaurant = {
        ...data,
        certifications: data.certification || [],
        updated_at: data.created_at, // Utiliser created_at comme fallback pour updated_at
        business_hours: data.business_hours ? JSON.parse(JSON.stringify(data.business_hours)) : { regular: {} },
        status: data.status || 'active',
        payment_methods: data.payment_methods || [],
        services: data.services || [],
        tags: data.tags || [],
        features: data.features || [],
        menu_categories: data.menu_categories || [],
        social_media: data.social_media || {},
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

      // Transformer les données pour correspondre au type DeliveryZone
      return (data || []).map(zone => ({
        ...zone,
        restaurant_id: restaurantId,
        zone_name: zone.name,
        area: zone.polygon,
        updated_at: zone.created_at,
        estimated_time: zone.estimated_time_range ? 
          JSON.parse(JSON.stringify(zone.estimated_time_range)).average : undefined
      })) as DeliveryZone[];
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

      // Transformer les données pour correspondre au type RestaurantPromotion
      return (data || []).map(promo => ({
        ...promo,
        usage_count: 0,
        customer_type: ['all'],
        status: promo.active ? 'active' : 'inactive',
        updated_at: promo.created_at,
        applicable_items: [],
        excluded_items: []
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
      const updateData = {
        ...updates,
        business_hours: updates.business_hours ? 
          JSON.stringify(updates.business_hours) : undefined
      };

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
