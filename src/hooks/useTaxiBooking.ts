
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { TaxiRide } from "@/types/taxi";

export function useTaxiBooking() {
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

  // Get user's rides
  const getUserRides = async () => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      const { data, error } = await supabase
        .from('taxi_rides')
        .select('*')
        .eq('user_id', user.id)
        .order('pickup_time', { ascending: false });

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Error fetching user rides:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Get ride details
  const getRideDetails = async (rideId: string) => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('taxi_rides')
        .select('*')
        .eq('id', rideId)
        .single();

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Error fetching ride details:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createBooking,
    cancelBooking,
    getUserRides,
    getRideDetails
  };
}
