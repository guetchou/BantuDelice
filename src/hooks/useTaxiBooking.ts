import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TaxiRide } from "@/types/taxi";

export function useTaxiBooking() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createBooking = async (bookingData: Omit<TaxiRide, 'id' | 'user_id' | 'status'>) => {
    try {
      setIsLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Vous devez être connecté pour réserver un taxi');
      }

      const { data, error } = await supabase
        .from('taxi_rides')
        .insert([
          {
            ...bookingData,
            user_id: user.id,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Réservation confirmée",
        description: "Votre taxi a été réservé avec succès",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la réservation",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelBooking = async (rideId: string) => {
    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('taxi_rides')
        .update({ status: 'cancelled' })
        .eq('id', rideId);

      if (error) throw error;

      toast({
        title: "Réservation annulée",
        description: "Votre réservation a été annulée avec succès",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'annulation",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createBooking,
    cancelBooking
  };
}