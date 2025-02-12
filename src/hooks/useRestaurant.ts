
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
  SocialMedia
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
        .single();
      
      if (error) {
        console.error('Error fetching restaurant:', error);
        throw error;
      }
      
      if (!data) {
        console.error('Restaurant not found');
        throw new Error('Restaurant not found');
      }

      // Vérifier et convertir le statut
      const status: RestaurantStatus = data.status as RestaurantStatus || 'active';

      // Convertir les payment_methods
      const paymentMethods: PaymentMethod[] = (data.payment_methods || []).filter((method): method is PaymentMethod => 
        ['cash', 'credit_card', 'debit_card', 'mobile_money', 'bank_transfer'].includes(method)
      );

      // Convertir les services
      const services: RestaurantService[] = (data.services || []).filter((service): service is RestaurantService =>
        ['dine_in', 'takeaway', 'delivery', 'catering', 'private_events'].includes(service)
      );

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

      // Convertir social_media
      const socialMedia: SocialMedia = {
        facebook: data.social_media?.facebook || undefined,
        instagram: data.social_media?.instagram || undefined,
        twitter: data.social_media?.twitter || undefined,
        linkedin: data.social_media?.linkedin || undefined,
        youtube: data.social_media?.youtube || undefined
      };

      // Transformer les données pour correspondre au type Restaurant
      const transformedData: Restaurant = {
        ...data,
        certifications: data.certification || [],
        updated_at: data.created_at,
        business_hours: data.business_hours || { regular: {} },
        status,
        payment_methods: paymentMethods,
        services,
        tags: data.tags || [],
        features: data.features || [],
        menu_categories: menuCategories,
        social_media: socialMedia,
        order_count: data.order_count || 0,
        total_revenue: data.total_revenue || 0,
        review_count: data.review_count || 0
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

      return (data || []).map(zone => ({
        id: zone.id,
        restaurant_id: restaurantId,
        zone_name: zone.name,
        delivery_fee: zone.base_delivery_fee,
        minimum_order: zone.minimum_order,
        estimated_time: zone.estimated_time_range?.average || undefined,
        area: zone.polygon,
        created_at: zone.created_at,
        updated_at: zone.created_at
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
      // Préparer les données pour la mise à jour
      const updateData = {
        ...updates,
        business_hours: updates.business_hours ? JSON.stringify(updates.business_hours) : undefined,
        menu_categories: updates.menu_categories ? JSON.stringify(updates.menu_categories) : undefined,
        social_media: updates.social_media ? JSON.stringify(updates.social_media) : undefined
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
