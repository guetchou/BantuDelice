
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

export function useTaxiBookingManage() {
  const [isLoading, setIsLoading] = useState(false);

  // Cancel a booking
  const cancelBooking = async (rideId: string) => {
    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('taxi_rides')
        .update({ status: 'cancelled' })
        .eq('id', rideId);

      if (error) throw error;

      toast.success("Réservation annulée", {
        description: "Votre réservation a été annulée avec succès",
      });

      return true;
    } catch (error: any) {
      toast.error("Erreur d'annulation", {
        description: error.message || "Une erreur est survenue lors de l'annulation",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    cancelBooking
  };
}
