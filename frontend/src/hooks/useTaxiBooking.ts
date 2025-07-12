
import { useState } from 'react';
import { TaxiRide } from '@/types/taxi';
import { useToast } from '@/hooks/use-toast';

export const useTaxiBooking = () => {
  const [rides, setRides] = useState<TaxiRide[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createBooking = async (bookingData: Partial<TaxiRide>) => {
    setIsLoading(true);
    try {
      // Mock booking creation
      const newRide: TaxiRide = {
        id: Math.random().toString(36).substring(7),
        pickup_address: bookingData.pickup_address || '',
        destination_address: bookingData.destination_address || '',
        status: 'pending',
        price: bookingData.estimated_price || 5000,
        distance: 10,
        duration: 25,
        created_at: new Date().toISOString(),
        estimated_price: bookingData.estimated_price || 5000,
        payment_status: 'pending',
        vehicle_type: bookingData.vehicle_type || 'standard',
        payment_method: bookingData.payment_method || 'cash'
      };

      setRides(prev => [...prev, newRide]);
      
      toast({
        title: "Réservation confirmée",
        description: "Votre course a été réservée avec succès",
      });

      return newRide;
    } catch (error) {
      toast({
        title: "Erreur de réservation",
        description: "Impossible de créer la réservation",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelBooking = async (rideId: string) => {
    try {
      // Mock cancellation
      setRides(prev => prev.map(ride => 
        ride.id === rideId ? { ...ride, status: 'cancelled' as const } : ride
      ));
      
      toast({
        title: "Course annulée",
        description: "Votre course a été annulée avec succès",
      });

      return true;
    } catch (error) {
      toast({
        title: "Erreur d'annulation",
        description: "Impossible d'annuler la course",
        variant: "destructive",
      });
      return false;
    }
  };

  const getRideDetails = async (rideId: string) => {
    // Mock ride details fetch
    return rides.find(ride => ride.id === rideId);
  };

  return {
    rides,
    isLoading,
    createBooking,
    cancelBooking,
    getRideDetails
  };
};
