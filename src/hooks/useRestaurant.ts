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
  BusinessHours,
  Table,
  Reservation
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

      // Valider et convertir payment_methods
      const paymentMethods = (data.payment_methods || [])
        .filter((method): method is PaymentMethod => 
          ['cash', 'credit_card', 'debit_card', 'mobile_money', 'bank_transfer'].includes(method)
        );

      // Valider et convertir services
      const services = (data.services || [])
        .filter((service): service is RestaurantService => 
          ['dine_in', 'takeaway', 'delivery', 'catering', 'private_events'].includes(service)
        );

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
            (data.location as any)?.coordinates?.[0] || 0,
            (data.location as any)?.coordinates?.[1] || 0
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
        payment_methods: paymentMethods,
        services: services,
        status: (data.status as RestaurantStatus) || 'active',
        business_hours: businessHours,
        special_hours: data.special_hours as BusinessHours | undefined,
        holidays: (data.holidays || []) as string[],
        tags: (data.tags || []) as string[],
        features: (data.features || []) as string[],
        certifications: (data.certifications || []) as string[],
        average_prep_time: data.average_prep_time || undefined,
        menu_categories: menuCategories,
        order_count: data.order_count || 0,
        total_revenue: data.total_revenue || 0,
        average_ticket: data.average_ticket || undefined,
        rating: data.rating || undefined,
        review_count: data.review_count || 0,
        ambiance: (data.ambiance || []) as string[],
        dress_code: data.dress_code || undefined,
        parking_options: (data.parking_options || []) as string[],
        accessibility_features: (data.accessibility_features || []) as string[],
        created_at: data.created_at,
        updated_at: data.updated_at || data.created_at
      };

      return transformedData;
    },
    enabled: !!restaurantId
  });

  // Ajout de la gestion des tables
  const { data: tables } = useQuery({
    queryKey: ['restaurant', restaurantId, 'tables'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurant_tables')
        .select('*')
        .eq('restaurant_id', restaurantId);

      if (error) throw error;
      return data as Table[];
    },
    enabled: !!restaurantId
  });

  // Gestion des réservations
  const { data: reservations } = useQuery({
    queryKey: ['restaurant', restaurantId, 'reservations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurant_reservations')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .gte('reservation_date', new Date().toISOString());

      if (error) throw error;
      return data as Reservation[];
    },
    enabled: !!restaurantId
  });

  // Calcul de la disponibilité des tables
  const checkTableAvailability = async (date: Date, partySize: number): Promise<{available: boolean; suggestedTables: Table[]}> => {
    // Récupérer les réservations pour cette date
    const { data: existingReservations } = await supabase
      .from('restaurant_reservations')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .gte('reservation_date', date.toISOString())
      .lt('reservation_date', new Date(date.getTime() + 2 * 60 * 60 * 1000).toISOString());

    // Filtrer les tables disponibles
    const availableTables = tables?.filter(table => {
      // Vérifier si la table peut accueillir le groupe
      if (table.capacity < partySize) return false;

      // Vérifier si la table n'est pas déjà réservée
      const isReserved = existingReservations?.some(
        reservation => reservation.table_id === table.id
      );

      return !isReserved;
    }) || [];

    return {
      available: availableTables.length > 0,
      suggestedTables: availableTables.sort((a, b) => a.capacity - b.capacity)
    };
  };

  // Création d'une réservation
  const createReservation = useMutation({
    mutationFn: async ({ 
      tableId, 
      date, 
      partySize, 
      customerName, 
      customerEmail, 
      customerPhone,
      specialRequests 
    }: {
      tableId: string;
      date: Date;
      partySize: number;
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      specialRequests?: string;
    }) => {
      // Vérifier la disponibilité une dernière fois
      const { available } = await checkTableAvailability(date, partySize);
      if (!available) {
        throw new Error('Cette table n\'est plus disponible');
      }

      const { data, error } = await supabase
        .from('restaurant_reservations')
        .insert({
          restaurant_id: restaurantId,
          table_id: tableId,
          reservation_date: date.toISOString(),
          party_size: partySize,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          special_requests: specialRequests,
          status: 'confirmed'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant', restaurantId, 'reservations'] });
      toast({
        title: "Réservation confirmée",
        description: "Votre réservation a été enregistrée avec succès",
      });
    },
    onError: (error) => {
      console.error('Error creating reservation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la réservation",
        variant: "destructive",
      });
    }
  });

  // Mise à jour d'une réservation
  const updateReservation = useMutation({
    mutationFn: async ({ 
      reservationId,
      updates 
    }: {
      reservationId: string;
      updates: Partial<Reservation>;
    }) => {
      const { data, error } = await supabase
        .from('restaurant_reservations')
        .update(updates)
        .eq('id', reservationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant', restaurantId, 'reservations'] });
      toast({
        title: "Réservation mise à jour",
        description: "Les modifications ont été enregistrées avec succès",
      });
    },
    onError: (error) => {
      console.error('Error updating reservation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la réservation",
        variant: "destructive",
      });
    }
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
      // Valider les données avant l'envoi
      const updateData = Object.entries(updates).reduce((acc, [key, value]) => {
        // Convertir en JSON string les objets complexes
        if (key === 'business_hours' || key === 'social_media' || key === 'menu_categories' || key === 'location') {
          acc[key] = JSON.stringify(value);
        } else if (Array.isArray(value)) {
          // S'assurer que les tableaux sont valides
          acc[key] = value.filter(item => item !== null && item !== undefined);
        } else if (value === undefined) {
          // Ignorer les valeurs undefined
          return acc;
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
    tables,
    reservations,
    deliveryZones,
    events,
    promotions,
    peakHours,
    isLoading,
    error,
    updateRestaurant,
    checkAvailability,
    checkTableAvailability,
    createReservation,
    updateReservation
  };
};
