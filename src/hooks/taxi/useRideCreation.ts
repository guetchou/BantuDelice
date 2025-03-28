
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useRideCreation() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [createdRideId, setCreatedRideId] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const createInitialRide = async (formState: any, estimatedPrice: number) => {
    try {
      setLoading(true);
      
      // Create the ride
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour réserver un taxi");
        return false;
      }
      
      const newRideData = {
        user_id: user.id,
        pickup_address: formState.pickupAddress,
        destination_address: formState.destinationAddress,
        pickup_latitude: formState.pickupLatitude,
        pickup_longitude: formState.pickupLongitude,
        destination_latitude: formState.destinationLatitude,
        destination_longitude: formState.destinationLongitude,
        pickup_time: formState.pickupTime === 'now' 
          ? new Date().toISOString() 
          : formState.scheduledTime,
        status: 'pending',
        vehicle_type: formState.vehicleType,
        payment_method: formState.paymentMethod,
        estimated_price: estimatedPrice,
        payment_status: 'pending',
        is_shared_ride: formState.isSharedRide,
        max_passengers: formState.maxPassengers,
        special_instructions: formState.specialInstructions
      };
      
      const { data, error } = await supabase
        .from('taxi_rides')
        .insert(newRideData)
        .select()
        .single();
        
      if (error) throw error;
      
      setCreatedRideId(data.id);
      
      toast.success("Votre réservation a été créée");
      return true;
    } catch (error) {
      console.error('Error creating ride:', error);
      toast.error("Une erreur est survenue lors de la création de la réservation");
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (createdRideId: string | null, selectedDriver: any) => {
    if (!createdRideId) {
      toast.error("Erreur: identifiant de course manquant");
      return;
    }
    
    try {
      setLoading(true);
      
      // If a driver was selected, request that driver
      if (selectedDriver) {
        const { error } = await supabase
          .from('taxi_ride_requests')
          .insert({
            ride_id: createdRideId,
            driver_id: selectedDriver.id,
            status: 'pending',
            requested_at: new Date().toISOString()
          });
          
        if (error) throw error;
      }
      
      // Set booking success state to true
      setBookingSuccess(true);
      
      toast.success("Réservation confirmée", {
        description: selectedDriver 
          ? "Le chauffeur a été notifié de votre demande" 
          : "Recherche d'un chauffeur en cours..."
      });
      
      // We'll delay the navigation to show the confirmation first
      setTimeout(() => {
        navigate(`/taxi/ride/${createdRideId}`);
      }, 5000);
    } catch (error) {
      console.error('Error finalizing booking:', error);
      toast.error("Une erreur est survenue lors de la finalisation de la réservation");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createdRideId,
    bookingSuccess,
    createInitialRide,
    handleSubmit
  };
}
