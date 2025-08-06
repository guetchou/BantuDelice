
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiService from "@/services/api";
import { toast } from "@/hooks/use-toast";
import type { Table, Reservation } from "@/types/restaurant";
import { useRestaurantTables } from "./useRestaurantTables";

export const useRestaurantReservations = (restaurantId: string | undefined) => {
  const queryClient = useQueryClient();
  const { tables } = useRestaurantTables(restaurantId);

  const { data: reservations, isLoading, error } = useQuery({
    queryKey: ['restaurant', restaurantId, 'reservations'],
    queryFn: async () => {
      if (!restaurantId) throw new Error('Restaurant ID is required');

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

  const checkTableAvailability = async (date: Date, partySize: number): Promise<{available: boolean; suggestedTables: Table[]}> => {
    if (!tables) return { available: false, suggestedTables: [] };

    const { data: existingReservations } = await supabase
      .from('restaurant_reservations')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .gte('reservation_date', date.toISOString())
      .lt('reservation_date', new Date(date.getTime() + 2 * 60 * 60 * 1000).toISOString());

    const availableTables = tables.filter(table => {
      if (table.capacity < partySize) return false;

      const isReserved = existingReservations?.some(
        reservation => reservation.table_id === table.id
      );

      return !isReserved;
    });

    return {
      available: availableTables.length > 0,
      suggestedTables: availableTables.sort((a, b) => a.capacity - b.capacity)
    };
  };

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

  return {
    reservations,
    isLoading,
    error,
    checkTableAvailability,
    createReservation,
    updateReservation
  };
};
