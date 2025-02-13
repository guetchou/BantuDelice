
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { 
  Restaurant,
  RestaurantStatus,
  PaymentMethod,
  RestaurantService,
  MenuCategory,
  SocialMedia,
  BusinessHours
} from "@/types/restaurant";

export const useRestaurantDetails = (restaurantId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: restaurant, isLoading, error } = useQuery({
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

      // Parser social_media
      let socialMedia: SocialMedia = {};
      try {
        const socialMediaData = typeof data.social_media === 'string' 
          ? JSON.parse(data.social_media) 
          : data.social_media || {};
        
        socialMedia = {
          facebook: socialMediaData.facebook,
          instagram: socialMediaData.instagram,
          twitter: socialMediaData.twitter,
          linkedin: socialMediaData.linkedin,
          youtube: socialMediaData.youtube
        };
      } catch (e) {
        console.error('Error parsing social_media:', e);
      }

      // Parser business_hours
      let businessHours: BusinessHours = { regular: {} };
      try {
        const parsedHours = typeof data.business_hours === 'string'
          ? JSON.parse(data.business_hours)
          : data.business_hours || { regular: {} };
        
        businessHours = {
          regular: parsedHours.regular || {},
          special: parsedHours.special
        };
      } catch (e) {
        console.error('Error parsing business_hours:', e);
      }

      // Convertir menu_categories
      const menuCategories: MenuCategory[] = Array.isArray(data.menu_categories) 
        ? data.menu_categories.map((cat: any) => ({
            id: cat.id || '',
            name: cat.name || '',
            description: cat.description,
            image_url: cat.image_url,
            order: cat.order || 0
          }))
        : [];

      const transformedData: Restaurant = {
        id: data.id,
        user_id: data.user_id,
        name: data.name,
        description: data.description,
        banner_image_url: data.banner_image_url,
        logo_url: data.logo_url,
        cuisine_type: data.cuisine_type,
        address: data.address,
        location: data.location ? {
          type: "Point",
          coordinates: [data.location.coordinates[0], data.location.coordinates[1]]
        } : undefined,
        phone: data.phone,
        email: data.email,
        website: data.website,
        social_media: socialMedia,
        capacity: data.capacity,
        delivery_radius: data.delivery_radius,
        minimum_order: data.minimum_order,
        delivery_fee: data.delivery_fee,
        tax_rate: data.tax_rate,
        payment_methods: (data.payment_methods || []) as PaymentMethod[],
        services: (data.services || []) as RestaurantService[],
        status: (data.status as RestaurantStatus) || 'active',
        business_hours: businessHours,
        special_hours: data.special_hours as BusinessHours | undefined,
        holidays: data.holidays || [],
        tags: data.tags || [],
        features: data.features || [],
        certifications: data.certification || [],
        average_prep_time: data.average_prep_time,
        menu_categories: menuCategories,
        order_count: data.order_count || 0,
        total_revenue: data.total_revenue || 0,
        average_ticket: data.average_ticket,
        rating: data.rating,
        review_count: data.review_count || 0,
        ambiance: data.ambiance || [],
        dress_code: data.dress_code,
        parking_options: data.parking_options || [],
        accessibility_features: data.accessibility_features || [],
        created_at: data.created_at,
        updated_at: data.created_at
      };

      return transformedData;
    },
    enabled: !!restaurantId
  });

  const updateRestaurant = useMutation({
    mutationFn: async (updates: Partial<Restaurant>) => {
      const updateData = Object.entries(updates).reduce((acc, [key, value]) => {
        if (key === 'business_hours' || key === 'social_media' || 
            key === 'menu_categories' || key === 'location') {
          acc[key] = JSON.stringify(value);
        } else if (Array.isArray(value)) {
          acc[key] = value.filter(item => item !== null && item !== undefined);
        } else if (value !== undefined) {
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

  return {
    restaurant,
    isLoading,
    error,
    updateRestaurant
  };
};
