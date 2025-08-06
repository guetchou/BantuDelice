
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  RidesharingTrip, 
  RidesharingRecurringBooking, 
  RecurringTripMatch 
} from '@/types/ridesharing';
import { useUser } from '@/hooks/useUser';

// Ce hook gère la logique des trajets récurrents
export function useRecurringRides() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [recurringTrips, setRecurringTrips] = useState<RidesharingTrip[]>([]);
  const [recurringBookings, setRecurringBookings] = useState<RidesharingRecurringBooking[]>([]);
  const [tripMatches, setTripMatches] = useState<RecurringTripMatch[]>([]);
  
  // Créer un trajet récurrent
  const createRecurringTrip = useCallback(async (tripData: Partial<RidesharingTrip>) => {
    if (!user) {
      toast.error("Vous devez être connecté pour créer un trajet");
      return null;
    }
    
    setIsLoading(true);
    
    try {
      // Dans une véritable implémentation, ceci serait une API ou Supabase
      // Simulation de l'API
      const newTrip: RidesharingTrip = {
        id: `trip-${Date.now()}`,
        driver_id: user.id,
        origin_address: tripData.origin_address || '',
        origin_latitude: tripData.origin_latitude || 0,
        origin_longitude: tripData.origin_longitude || 0,
        destination_address: tripData.destination_address || '',
        destination_latitude: tripData.destination_latitude || 0,
        destination_longitude: tripData.destination_longitude || 0,
        departure_date: new Date().toISOString().split('T')[0],
        departure_time: tripData.departure_time || '08:00',
        estimated_arrival_time: tripData.estimated_arrival_time || '09:00',
        available_seats: tripData.available_seats || 3,
        price_per_seat: tripData.price_per_seat || 1500,
        status: 'active',
        vehicle_model: tripData.vehicle_model,
        vehicle_color: tripData.vehicle_color,
        license_plate: tripData.license_plate,
        created_at: new Date().toISOString(),
        preferences: tripData.preferences || {
          smoking_allowed: false,
          pets_allowed: false,
          music_allowed: true,
          air_conditioning: true,
          luggage_allowed: true
        },
        is_recurring: true,
        recurrence_pattern: tripData.recurrence_pattern || {
          frequency: 'weekdays',
          days_of_week: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          start_date: new Date().toISOString().split('T')[0],
          auto_accept_riders: true
        }
      };
      
      // Simuler le délai de l'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRecurringTrips(prev => [...prev, newTrip]);
      toast.success("Trajet récurrent créé avec succès");
      
      return newTrip;
    } catch (error) {
      console.error('Error creating recurring trip:', error);
      toast.error("Erreur lors de la création du trajet récurrent");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Récupérer les trajets récurrents d'un utilisateur
  const fetchUserRecurringTrips = useCallback(async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour afficher vos trajets");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simuler l'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données fictives pour la démo
      const mockTrips: RidesharingTrip[] = [
        {
          id: 'trip-001',
          driver_id: user.id,
          origin_address: 'Avenue de la Paix, Brazzaville',
          origin_latitude: 4.2699,
          origin_longitude: 15.2809,
          destination_address: 'Université Marien Ngouabi, Brazzaville',
          destination_latitude: 4.2787,
          destination_longitude: 15.2662,
          departure_date: new Date().toISOString().split('T')[0],
          departure_time: '08:00',
          estimated_arrival_time: '08:30',
          available_seats: 3,
          price_per_seat: 1500,
          status: 'active',
          vehicle_model: 'Toyota Corolla',
          vehicle_color: 'Bleu',
          license_plate: 'ABC-123',
          created_at: new Date().toISOString(),
          preferences: {
            smoking_allowed: false,
            pets_allowed: false,
            music_allowed: true,
            air_conditioning: true,
            luggage_allowed: true,
            chatty_driver: true
          },
          is_recurring: true,
          recurrence_pattern: {
            frequency: 'weekdays',
            days_of_week: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
            start_date: new Date().toISOString().split('T')[0],
            auto_accept_riders: true
          }
        },
        {
          id: 'trip-002',
          driver_id: user.id,
          origin_address: 'Avenue de la Paix, Brazzaville',
          origin_latitude: 4.2699,
          origin_longitude: 15.2809,
          destination_address: 'Aéroport de Maya-Maya, Brazzaville',
          destination_latitude: 4.2519,
          destination_longitude: 15.2492,
          departure_date: new Date().toISOString().split('T')[0],
          departure_time: '17:30',
          estimated_arrival_time: '18:15',
          available_seats: 2,
          price_per_seat: 2000,
          status: 'active',
          vehicle_model: 'Toyota Corolla',
          vehicle_color: 'Bleu',
          license_plate: 'ABC-123',
          created_at: new Date().toISOString(),
          preferences: {
            smoking_allowed: false,
            pets_allowed: false,
            music_allowed: true,
            air_conditioning: true,
            luggage_allowed: true,
            chatty_driver: true
          },
          is_recurring: true,
          recurrence_pattern: {
            frequency: 'custom',
            days_of_week: ['monday', 'wednesday', 'friday'],
            start_date: new Date().toISOString().split('T')[0],
            auto_accept_riders: false
          }
        }
      ];
      
      setRecurringTrips(mockTrips);
    } catch (error) {
      console.error('Error fetching user recurring trips:', error);
      toast.error("Erreur lors de la récupération des trajets récurrents");
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Récupérer les réservations récurrentes d'un utilisateur
  const fetchUserRecurringBookings = useCallback(async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour afficher vos réservations");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simuler l'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données fictives pour la démo
      const mockBookings: RidesharingRecurringBooking[] = [
        {
          id: 'booking-001',
          passenger_id: user.id,
          trip_id: 'trip-003', // Un trajet créé par un autre utilisateur
          status: 'active',
          booking_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          start_date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
          auto_confirm: true,
          payment_method: 'mobile_money',
          seats_booked: 1,
          special_requests: 'Je préfère être déposé devant la porte principale'
        }
      ];
      
      // Ajouter un voyage fictif pour la réservation
      const mockTrip: RidesharingTrip = {
        id: 'trip-003',
        driver_id: 'driver-001', // Un autre utilisateur
        origin_address: 'Quartier Bacongo, Brazzaville',
        origin_latitude: 4.2762,
        origin_longitude: 15.2596,
        destination_address: 'Centre-ville, Brazzaville',
        destination_latitude: 4.2634,
        destination_longitude: 15.2429,
        departure_date: new Date().toISOString().split('T')[0],
        departure_time: '07:30',
        estimated_arrival_time: '08:15',
        available_seats: 2,
        price_per_seat: 1800,
        status: 'active',
        vehicle_model: 'Honda Civic',
        vehicle_color: 'Noir',
        license_plate: 'XYZ-789',
        created_at: new Date().toISOString(),
        preferences: {
          smoking_allowed: false,
          pets_allowed: false,
          music_allowed: true,
          air_conditioning: true,
          luggage_allowed: true
        },
        is_recurring: true,
        recurrence_pattern: {
          frequency: 'weekdays',
          days_of_week: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          start_date: new Date().toISOString().split('T')[0],
          auto_accept_riders: true
        }
      };
      
      setRecurringBookings(mockBookings);
      setRecurringTrips(prev => [...prev, mockTrip]);
    } catch (error) {
      console.error('Error fetching user recurring bookings:', error);
      toast.error("Erreur lors de la récupération des réservations récurrentes");
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Rechercher des correspondances pour les trajets récurrents
  const findRecurringTripMatches = useCallback(async (searchParams: unknown) => {
    setIsLoading(true);
    
    try {
      // Simuler l'API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Données fictives pour la démo
      const matches: RecurringTripMatch[] = [
        {
          trip_id: 'match-001',
          driver_id: 'driver-001',
          driver_name: 'Thomas Mbengue',
          driver_rating: 4.8,
          similarity_score: 0.95,
          matched_route: true,
          matched_schedule: true,
          matched_preferences: true,
          previous_trips_together: 3
        },
        {
          trip_id: 'match-002',
          driver_id: 'driver-002',
          driver_name: 'Marie Loemba',
          driver_rating: 4.7,
          similarity_score: 0.82,
          matched_route: true,
          matched_schedule: true,
          matched_preferences: false,
          previous_trips_together: 0
        },
        {
          trip_id: 'match-003',
          driver_id: 'driver-003',
          driver_name: 'Paul Moukala',
          driver_rating: 4.9,
          similarity_score: 0.75,
          matched_route: true,
          matched_schedule: false,
          matched_preferences: true,
          previous_trips_together: 1
        }
      ];
      
      setTripMatches(matches);
    } catch (error) {
      console.error('Error finding recurring trip matches:', error);
      toast.error("Erreur lors de la recherche de trajets correspondants");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Réserver un trajet récurrent
  const bookRecurringTrip = useCallback(async (tripId: string, bookingData: unknown) => {
    if (!user) {
      toast.error("Vous devez être connecté pour réserver un trajet");
      return null;
    }
    
    setIsLoading(true);
    
    try {
      // Simuler l'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const trip = recurringTrips.find(t => t.id === tripId);
      if (!trip) {
        throw new Error("Trajet non trouvé");
      }
      
      const newBooking: RidesharingRecurringBooking = {
        id: `booking-${Date.now()}`,
        passenger_id: user.id,
        trip_id: tripId,
        status: 'active',
        booking_days: bookingData.booking_days || trip.recurrence_pattern?.days_of_week || [],
        start_date: bookingData.start_date || new Date().toISOString().split('T')[0],
        end_date: bookingData.end_date,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        auto_confirm: bookingData.auto_confirm || false,
        payment_method: bookingData.payment_method || 'mobile_money',
        seats_booked: bookingData.seats_booked || 1,
        special_requests: bookingData.special_requests
      };
      
      setRecurringBookings(prev => [...prev, newBooking]);
      toast.success("Réservation récurrente créée avec succès");
      
      return newBooking;
    } catch (error) {
      console.error('Error booking recurring trip:', error);
      toast.error("Erreur lors de la réservation du trajet récurrent");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, recurringTrips]);
  
  // Mettre à jour un trajet récurrent
  const updateRecurringTrip = useCallback(async (tripId: string, updateData: Partial<RidesharingTrip>) => {
    if (!user) {
      toast.error("Vous devez être connecté pour modifier un trajet");
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Simuler l'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRecurringTrips(prev => 
        prev.map(trip => 
          trip.id === tripId ? { ...trip, ...updateData, updated_at: new Date().toISOString() } : trip
        )
      );
      
      toast.success("Trajet récurrent mis à jour avec succès");
      return true;
    } catch (error) {
      console.error('Error updating recurring trip:', error);
      toast.error("Erreur lors de la mise à jour du trajet récurrent");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Suspendre un trajet récurrent
  const pauseRecurringTrip = useCallback(async (tripId: string) => {
    if (!user) {
      toast.error("Vous devez être connecté pour suspendre un trajet");
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Simuler l'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Vérifier si c'est un trajet ou une réservation
      const tripIndex = recurringTrips.findIndex(t => t.id === tripId);
      const bookingIndex = recurringBookings.findIndex(b => b.id === tripId);
      
      if (tripIndex >= 0) {
        setRecurringTrips(prev => 
          prev.map((trip, idx) => 
            idx === tripIndex ? { ...trip, status: 'cancelled' as any, updated_at: new Date().toISOString() } : trip
          )
        );
      } else if (bookingIndex >= 0) {
        setRecurringBookings(prev => 
          prev.map((booking, idx) => 
            idx === bookingIndex ? { ...booking, status: 'paused', updated_at: new Date().toISOString() } : booking
          )
        );
      } else {
        throw new Error("Trajet ou réservation non trouvé");
      }
      
      toast.success("Trajet récurrent suspendu avec succès");
      return true;
    } catch (error) {
      console.error('Error pausing recurring trip:', error);
      toast.error("Erreur lors de la suspension du trajet récurrent");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, recurringTrips, recurringBookings]);
  
  // Reprendre un trajet récurrent
  const resumeRecurringTrip = useCallback(async (tripId: string) => {
    if (!user) {
      toast.error("Vous devez être connecté pour reprendre un trajet");
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Simuler l'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Vérifier si c'est un trajet ou une réservation
      const tripIndex = recurringTrips.findIndex(t => t.id === tripId);
      const bookingIndex = recurringBookings.findIndex(b => b.id === tripId);
      
      if (tripIndex >= 0) {
        setRecurringTrips(prev => 
          prev.map((trip, idx) => 
            idx === tripIndex ? { ...trip, status: 'active', updated_at: new Date().toISOString() } : trip
          )
        );
      } else if (bookingIndex >= 0) {
        setRecurringBookings(prev => 
          prev.map((booking, idx) => 
            idx === bookingIndex ? { ...booking, status: 'active', updated_at: new Date().toISOString() } : booking
          )
        );
      } else {
        throw new Error("Trajet ou réservation non trouvé");
      }
      
      toast.success("Trajet récurrent repris avec succès");
      return true;
    } catch (error) {
      console.error('Error resuming recurring trip:', error);
      toast.error("Erreur lors de la reprise du trajet récurrent");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, recurringTrips, recurringBookings]);
  
  // Annuler un trajet récurrent
  const cancelRecurringTrip = useCallback(async (tripId: string) => {
    if (!user) {
      toast.error("Vous devez être connecté pour annuler un trajet");
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Simuler l'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Vérifier si c'est un trajet ou une réservation
      const tripIndex = recurringTrips.findIndex(t => t.id === tripId);
      const bookingIndex = recurringBookings.findIndex(b => b.id === tripId);
      
      if (tripIndex >= 0) {
        setRecurringTrips(prev => 
          prev.map((trip, idx) => 
            idx === tripIndex ? { ...trip, status: 'cancelled', updated_at: new Date().toISOString() } : trip
          )
        );
      } else if (bookingIndex >= 0) {
        setRecurringBookings(prev => 
          prev.map((booking, idx) => 
            idx === bookingIndex ? { ...booking, status: 'cancelled', updated_at: new Date().toISOString() } : booking
          )
        );
      } else {
        throw new Error("Trajet ou réservation non trouvé");
      }
      
      toast.success("Trajet récurrent annulé avec succès");
      return true;
    } catch (error) {
      console.error('Error cancelling recurring trip:', error);
      toast.error("Erreur lors de l'annulation du trajet récurrent");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, recurringTrips, recurringBookings]);

  return {
    isLoading,
    recurringTrips,
    recurringBookings,
    tripMatches,
    createRecurringTrip,
    fetchUserRecurringTrips,
    fetchUserRecurringBookings,
    findRecurringTripMatches,
    bookRecurringTrip,
    updateRecurringTrip,
    pauseRecurringTrip,
    resumeRecurringTrip,
    cancelRecurringTrip
  };
}
