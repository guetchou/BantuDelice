
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { TaxiRide } from "@/types/taxi";

export function useTaxiBookingCreate() {
  const [isLoading, setIsLoading] = useState(false);

  // Create a new taxi booking
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

      toast.success("Réservation confirmée", {
        description: "Votre taxi a été réservé avec succès",
      });

      return data;
    } catch (error: any) {
      toast.error("Erreur de réservation", {
        description: error.message || "Une erreur est survenue lors de la réservation",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createBooking
  };
}
