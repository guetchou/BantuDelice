
import { useState, useEffect } from 'react';
import { TaxiRide } from '@/types/taxi';
import { useApiAuth } from '@/contexts/ApiAuthContext';

export function useTaxiHistory() {
  const [pastRides, setPastRides] = useState<TaxiRide[]>([]);
  const [upcomingRides, setUpcomingRides] = useState<TaxiRide[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useApiAuth();

  useEffect(() => {
    if (user) {
      fetchRideHistory();
    }
  }, [user]);

  const fetchRideHistory = async () => {
    setIsLoading(true);
    try {
      // Dans un vrai environnement, nous interrogerions Supabase
      // Mais pour la démo, nous utilisons des données simulées
      
      // Courses terminées
      const mockPastRides: TaxiRide[] = [
        {
          id: '1',
          user_id: user?.id || 'user-123',
          driver_id: 'driver-123',
          pickup_address: 'Centre ville, Brazzaville',
          pickup_latitude: -4.2634,
          pickup_longitude: 15.2429,
          destination_address: 'Aéroport Maya-Maya, Brazzaville',
          destination_latitude: -4.2515,
          destination_longitude: 15.2534,
          pickup_time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          pickup_time_type: 'scheduled',
          status: 'completed',
          vehicle_type: 'standard',
          payment_method: 'cash',
          estimated_price: 5000,
          actual_price: 5200,
          created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          special_instructions: '',
          distance_km: 12.5,
          estimated_arrival_time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
          actual_arrival_time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 50 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          user_id: user?.id || 'user-123',
          driver_id: 'driver-456',
          pickup_address: 'Marché Bacongo, Brazzaville',
          pickup_latitude: -4.2867,
          pickup_longitude: 15.2446,
          destination_address: 'Hôpital CHU, Brazzaville',
          destination_latitude: -4.2733,
          destination_longitude: 15.2464,
          pickup_time: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          pickup_time_type: 'now',
          status: 'completed',
          vehicle_type: 'comfort',
          payment_method: 'mobile_money',
          estimated_price: 3500,
          actual_price: 3500,
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          special_instructions: 'Appeler à l\'arrivée',
          distance_km: 8.7,
          estimated_arrival_time: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
          actual_arrival_time: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 28 * 60 * 1000).toISOString()
        }
      ];
      
      // Courses à venir
      const mockUpcomingRides: TaxiRide[] = [
        {
          id: '3',
          user_id: user?.id || 'user-123',
          driver_id: null,
          pickup_address: '123 Boulevard de la Liberté, Brazzaville',
          pickup_latitude: -4.2634,
          pickup_longitude: 15.2429,
          destination_address: 'Université Marien Ngouabi, Brazzaville',
          destination_latitude: -4.2867,
          destination_longitude: 15.2446,
          pickup_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          pickup_time_type: 'scheduled',
          status: 'pending',
          vehicle_type: 'standard',
          payment_method: 'cash',
          estimated_price: 4200,
          actual_price: null,
          created_at: new Date().toISOString(),
          special_instructions: 'Course programmée pour l\'université',
          distance_km: 10.2,
          estimated_arrival_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 40 * 60 * 1000).toISOString()
        }
      ];
      
      setPastRides(mockPastRides);
      setUpcomingRides(mockUpcomingRides);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique des courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelUpcomingRide = async (rideId: string) => {
    try {
      // Dans un vrai environnement, nous mettrions à jour Supabase
      setUpcomingRides(prev => prev.filter(ride => ride.id !== rideId));
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la course:', error);
      return false;
    }
  };

  return {
    pastRides,
    upcomingRides,
    isLoading,
    fetchRideHistory,
    cancelUpcomingRide
  };
}
