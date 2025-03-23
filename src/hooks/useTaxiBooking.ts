
import { useState } from 'react';
import { TaxiRide } from '@/types/taxi';
import { toast } from 'sonner';

// Mock taxi booking functionality
export const useTaxiBooking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentRide, setCurrentRide] = useState<TaxiRide | null>(null);

  const drivers = {
    findDrivers: async () => {
      console.log('Finding available drivers...');
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [];
    },
    requestDriver: async () => {
      console.log('Requesting driver...');
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return null;
    },
    getDriverDetails: async () => {
      console.log('Getting driver details...');
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return null;
    },
  };

  const rides = {
    createRide: async (rideData: Partial<TaxiRide>) => {
      setIsLoading(true);
      console.log('Creating ride...', rideData);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        const rideId = 'ride-' + Math.random().toString(36).substring(2, 9);
        return { id: rideId };
      } catch (error) {
        console.error('Error creating ride:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    getRideDetails: async (rideId: string) => {
      setIsLoading(true);
      console.log('Getting ride details for ride:', rideId);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        const rideDetails: TaxiRide = {
          id: rideId,
          user_id: 'user-' + Math.random().toString(36).substring(2, 9),
          driver_id: null,
          status: 'pending',
          pickup_address: 'Centre-ville, Brazzaville',
          pickup_latitude: -4.2634,
          pickup_longitude: 15.2429,
          destination_address: 'Aéroport Maya-Maya, Brazzaville',
          destination_latitude: -4.2515,
          destination_longitude: 15.2534,
          pickup_time: new Date().toISOString(),
          pickup_time_type: 'now',
          vehicle_type: 'standard',
          payment_method: 'cash',
          estimated_price: 5000,
          actual_price: null,
          created_at: new Date().toISOString(),
          special_instructions: '',
        };
        setCurrentRide(rideDetails);
        return rideDetails;
      } catch (error) {
        console.error('Error getting ride details:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    cancelRide: async (rideId: string) => {
      setIsLoading(true);
      console.log('Cancelling ride:', rideId);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCurrentRide(null);
        toast.success('Course annulée avec succès');
        return { success: true };
      } catch (error) {
        console.error('Error cancelling ride:', error);
        toast.error('Erreur lors de l\'annulation de la course');
        return { success: false };
      } finally {
        setIsLoading(false);
      }
    },
    getAllRides: async () => {
      setIsLoading(true);
      console.log('Getting all rides...');
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return [];
      } catch (error) {
        console.error('Error getting rides:', error);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    createBooking: async (bookingData: any) => {
      setIsLoading(true);
      console.log('Creating booking with data:', bookingData);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        const bookingId = 'booking-' + Math.random().toString(36).substring(2, 9);
        toast.success('Réservation effectuée avec succès');
        return { id: bookingId };
      } catch (error) {
        console.error('Error creating booking:', error);
        toast.error('Erreur lors de la réservation');
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    isLoading,
  };

  return {
    drivers,
    rides,
    currentRide,
    isLoading,
  };
};
