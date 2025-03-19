
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { RidesharingTrip, RidesharingBooking, RidesharingSearchFilters, RidesharingRecurringBooking } from '@/types/ridesharing';
import { useUser } from '@/hooks/useUser';
import { useRecurringRides } from '@/hooks/useRecurringRides';

export function useRidesharing() {
  const { user } = useUser();
  const recurringRides = useRecurringRides();
  const [isLoading, setIsLoading] = useState(false);
  const [trips, setTrips] = useState<RidesharingTrip[]>([]);
  const [myTrips, setMyTrips] = useState<RidesharingTrip[]>([]);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  
  // Rechercher des trajets
  const searchTrips = useCallback(async (filters: RidesharingSearchFilters) => {
    setIsLoading(true);
    
    try {
      // Dans une vraie implémentation, ceci serait une API
      // Pour l'exemple, nous utiliserons des données fictives
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Si on recherche des trajets récurrents
      if (filters.recurringTrip) {
        await recurringRides.findRecurringTripMatches(filters);
        return;
      }
      
      // Données fictives pour la démo
      const results: RidesharingTrip[] = [
        {
          id: 'trip1',
          driver_id: 'd1',
          origin_address: filters.origin || 'Brazzaville',
          origin_latitude: 4.2634,
          origin_longitude: 15.2429,
          destination_address: filters.destination || 'Pointe-Noire',
          destination_latitude: 4.7889,
          destination_longitude: 11.8653,
          departure_date: filters.date ? filters.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          departure_time: '08:00',
          estimated_arrival_time: '14:00',
          available_seats: 3,
          price_per_seat: 8000,
          status: 'active',
          vehicle_model: 'Toyota Land Cruiser',
          vehicle_color: 'Noir',
          license_plate: 'AB 123 CD',
          created_at: new Date().toISOString(),
          preferences: {
            smoking_allowed: false,
            pets_allowed: false,
            music_allowed: true,
            air_conditioning: true,
            luggage_allowed: true,
            max_luggage_size: 'large'
          }
        },
        {
          id: 'trip2',
          driver_id: 'd2',
          origin_address: filters.origin || 'Brazzaville',
          origin_latitude: 4.2634,
          origin_longitude: 15.2429,
          destination_address: filters.destination || 'Pointe-Noire',
          destination_latitude: 4.7889,
          destination_longitude: 11.8653,
          departure_date: filters.date ? filters.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          departure_time: '10:30',
          estimated_arrival_time: '16:30',
          available_seats: 2,
          price_per_seat: 7500,
          status: 'active',
          vehicle_model: 'Hyundai Tucson',
          vehicle_color: 'Blanc',
          license_plate: 'XY 456 ZW',
          created_at: new Date().toISOString(),
          preferences: {
            smoking_allowed: false,
            pets_allowed: true,
            music_allowed: true,
            air_conditioning: true,
            luggage_allowed: true,
            max_luggage_size: 'medium'
          }
        },
        {
          id: 'trip3',
          driver_id: 'd3',
          origin_address: filters.origin || 'Brazzaville',
          origin_latitude: 4.2634,
          origin_longitude: 15.2429,
          destination_address: filters.destination || 'Dolisie',
          destination_latitude: 4.2,
          destination_longitude: 12.6,
          departure_date: filters.date ? filters.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          departure_time: '09:15',
          estimated_arrival_time: '13:45',
          available_seats: 4,
          price_per_seat: 6000,
          status: 'active',
          vehicle_model: 'Mitsubishi Pajero',
          vehicle_color: 'Gris',
          license_plate: 'PQ 789 RS',
          created_at: new Date().toISOString(),
          preferences: {
            smoking_allowed: true,
            pets_allowed: false,
            music_allowed: true,
            air_conditioning: false,
            luggage_allowed: true,
            max_luggage_size: 'medium'
          }
        },
        {
          id: 'trip4',
          driver_id: 'd4',
          origin_address: filters.origin || 'Brazzaville',
          origin_latitude: 4.2634,
          origin_longitude: 15.2429,
          destination_address: filters.destination || 'Oyo',
          destination_latitude: 1.1,
          destination_longitude: 15.9,
          departure_date: filters.date ? filters.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          departure_time: '07:45',
          estimated_arrival_time: '11:15',
          available_seats: 1,
          price_per_seat: 5000,
          status: 'active',
          vehicle_model: 'Kia Sportage',
          vehicle_color: 'Rouge',
          license_plate: 'TU 012 VW',
          created_at: new Date().toISOString(),
          preferences: {
            smoking_allowed: false,
            pets_allowed: false,
            music_allowed: false,
            air_conditioning: true,
            luggage_allowed: false
          }
        }
      ];
      
      // Filtrer les résultats selon les filtres
      let filteredResults = results;
      
      if (filters.minSeats) {
        filteredResults = filteredResults.filter(trip => trip.available_seats >= (filters.minSeats || 1));
      }
      
      if (filters.maxPrice) {
        filteredResults = filteredResults.filter(trip => trip.price_per_seat <= (filters.maxPrice || 10000));
      }
      
      if (filters.preferenceFilters?.smoking_allowed === true) {
        filteredResults = filteredResults.filter(trip => trip.preferences.smoking_allowed === true);
      }
      
      if (filters.preferenceFilters?.smoking_allowed === false) {
        filteredResults = filteredResults.filter(trip => trip.preferences.smoking_allowed === false);
      }
      
      if (filters.preferenceFilters?.pets_allowed === true) {
        filteredResults = filteredResults.filter(trip => trip.preferences.pets_allowed === true);
      }
      
      if (filters.preferenceFilters?.air_conditioning === true) {
        filteredResults = filteredResults.filter(trip => trip.preferences.air_conditioning === true);
      }
      
      if (filters.preferenceFilters?.luggage_allowed === true) {
        filteredResults = filteredResults.filter(trip => trip.preferences.luggage_allowed === true);
      }
      
      setTrips(filteredResults);
    } catch (error) {
      console.error('Error searching trips:', error);
      toast.error("Erreur lors de la recherche de trajets");
    } finally {
      setIsLoading(false);
    }
  }, [recurringRides]);
  
  // Créer un trajet
  const createTrip = useCallback(async (tripData: Partial<RidesharingTrip>) => {
    if (!user) {
      toast.error("Vous devez être connecté pour créer un trajet");
      return null;
    }
    
    setIsLoading(true);
    
    try {
      if (tripData.is_recurring) {
        // Utiliser la logique de trajets récurrents
        return await recurringRides.createRecurringTrip(tripData);
      }
      
      // Dans une vraie implémentation, ceci serait une API
      const newTrip: RidesharingTrip = {
        id: `trip-${Date.now()}`,
        driver_id: user.id,
        origin_address: tripData.origin_address || '',
        origin_latitude: tripData.origin_latitude || 0,
        origin_longitude: tripData.origin_longitude || 0,
        destination_address: tripData.destination_address || '',
        destination_latitude: tripData.destination_latitude || 0,
        destination_longitude: tripData.destination_longitude || 0,
        departure_date: tripData.departure_date || new Date().toISOString().split('T')[0],
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
        }
      };
      
      // Simuler le délai de l'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMyTrips(prev => [...prev, newTrip]);
      toast.success("Trajet créé avec succès");
      
      return newTrip;
    } catch (error) {
      console.error('Error creating trip:', error);
      toast.error("Erreur lors de la création du trajet");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, recurringRides]);
  
  // Réserver un trajet
  const bookTrip = useCallback(async (tripId: string, seatsCount: number, specialRequests?: string) => {
    if (!user) {
      toast.error("Vous devez être connecté pour réserver un trajet");
      return null;
    }
    
    setIsLoading(true);
    
    try {
      // Dans une vraie implémentation, ceci serait une API
      const trip = trips.find(t => t.id === tripId);
      if (!trip) {
        throw new Error("Trajet non trouvé");
      }
      
      if (trip.available_seats < seatsCount) {
        throw new Error("Pas assez de places disponibles");
      }
      
      const booking: RidesharingBooking = {
        id: `booking-${Date.now()}`,
        trip_id: tripId,
        passenger_id: user.id,
        seats_booked: seatsCount,
        booking_status: 'confirmed',
        payment_status: 'pending',
        total_price: trip.price_per_seat * seatsCount,
        created_at: new Date().toISOString(),
        special_requests: specialRequests
      };
      
      // Simuler le délai de l'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Réduire les places disponibles
      const updatedTrip = { ...trip, available_seats: trip.available_seats - seatsCount };
      setTrips(prev => prev.map(t => t.id === tripId ? updatedTrip : t));
      
      setMyBookings(prev => [...prev, { ...booking, trip: updatedTrip }]);
      toast.success("Trajet réservé avec succès");
      
      return booking;
    } catch (error) {
      console.error('Error booking trip:', error);
      toast.error("Erreur lors de la réservation du trajet");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, trips]);
  
  // Récupérer les trajets de l'utilisateur
  const fetchMyTrips = useCallback(async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour voir vos trajets");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Récupérer les trajets récurrents
      await recurringRides.fetchUserRecurringTrips();
      
      // Simuler l'API pour les trajets uniques
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockTrips: RidesharingTrip[] = [
        {
          id: 'mytrip1',
          driver_id: user.id,
          origin_address: 'Brazzaville Centre',
          origin_latitude: 4.2634,
          origin_longitude: 15.2429,
          destination_address: 'Pointe-Noire',
          destination_latitude: 4.7889,
          destination_longitude: 11.8653,
          departure_date: new Date().toISOString().split('T')[0],
          departure_time: '08:00',
          estimated_arrival_time: '14:00',
          available_seats: 3,
          price_per_seat: 8000,
          status: 'active',
          vehicle_model: 'Toyota Corolla',
          vehicle_color: 'Blanc',
          license_plate: 'AB 123 CD',
          created_at: new Date().toISOString(),
          preferences: {
            smoking_allowed: false,
            pets_allowed: false,
            music_allowed: true,
            air_conditioning: true,
            luggage_allowed: true
          }
        }
      ];
      
      // Fusionner avec les trajets récurrents
      const allTrips = [...mockTrips, ...recurringRides.recurringTrips.filter(trip => trip.driver_id === user.id)];
      setMyTrips(allTrips);
    } catch (error) {
      console.error('Error fetching my trips:', error);
      toast.error("Erreur lors de la récupération de vos trajets");
    } finally {
      setIsLoading(false);
    }
  }, [user, recurringRides]);
  
  // Récupérer les réservations de l'utilisateur
  const fetchMyBookings = useCallback(async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour voir vos réservations");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Récupérer les réservations récurrentes
      await recurringRides.fetchUserRecurringBookings();
      
      // Simuler l'API pour les réservations uniques
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockTrip: RidesharingTrip = {
        id: 'bookedtrip1',
        driver_id: 'd1',
        origin_address: 'Brazzaville Centre',
        origin_latitude: 4.2634,
        origin_longitude: 15.2429,
        destination_address: 'Pointe-Noire',
        destination_latitude: 4.7889,
        destination_longitude: 11.8653,
        departure_date: new Date().toISOString().split('T')[0],
        departure_time: '08:00',
        estimated_arrival_time: '14:00',
        available_seats: 2,
        price_per_seat: 8000,
        status: 'active',
        vehicle_model: 'Toyota Land Cruiser',
        vehicle_color: 'Noir',
        license_plate: 'AB 123 CD',
        created_at: new Date().toISOString(),
        preferences: {
          smoking_allowed: false,
          pets_allowed: false,
          music_allowed: true,
          air_conditioning: true,
          luggage_allowed: true
        }
      };
      
      const mockBooking: RidesharingBooking = {
        id: 'mybooking1',
        trip_id: 'bookedtrip1',
        passenger_id: user.id,
        seats_booked: 1,
        booking_status: 'confirmed',
        payment_status: 'completed',
        total_price: 8000,
        created_at: new Date().toISOString(),
        payment_method: 'mobile_money'
      };
      
      const bookingWithTrip = { ...mockBooking, trip: mockTrip };
      
      // Fusionner avec les réservations récurrentes
      const allBookings = [bookingWithTrip];
      
      // Ajouter les réservations récurrentes
      recurringRides.recurringBookings.forEach(booking => {
        const trip = recurringRides.recurringTrips.find(t => t.id === booking.trip_id);
        if (trip) {
          allBookings.push({ ...booking, trip });
        }
      });
      
      setMyBookings(allBookings);
    } catch (error) {
      console.error('Error fetching my bookings:', error);
      toast.error("Erreur lors de la récupération de vos réservations");
    } finally {
      setIsLoading(false);
    }
  }, [user, recurringRides]);
  
  // Annuler un trajet
  const cancelTrip = useCallback(async (tripId: string) => {
    if (!user) return false;
    
    setIsLoading(true);
    
    try {
      // Vérifier si c'est un trajet récurrent
      const isRecurringTrip = recurringRides.recurringTrips.some(t => t.id === tripId);
      
      if (isRecurringTrip) {
        return await recurringRides.cancelRecurringTrip(tripId);
      }
      
      // Pour un trajet normal
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMyTrips(prev => 
        prev.map(trip => 
          trip.id === tripId ? { ...trip, status: 'cancelled', updated_at: new Date().toISOString() } : trip
        )
      );
      
      toast.success("Trajet annulé avec succès");
      return true;
    } catch (error) {
      console.error('Error cancelling trip:', error);
      toast.error("Erreur lors de l'annulation du trajet");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, recurringRides]);
  
  // Annuler une réservation
  const cancelBooking = useCallback(async (bookingId: string) => {
    if (!user) return false;
    
    setIsLoading(true);
    
    try {
      // Vérifier si c'est une réservation récurrente
      const isRecurringBooking = recurringRides.recurringBookings.some(b => b.id === bookingId);
      
      if (isRecurringBooking) {
        return await recurringRides.cancelRecurringTrip(bookingId);
      }
      
      // Pour une réservation normale
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMyBookings(prev => 
        prev.map(booking => {
          if (booking.id === bookingId) {
            return { 
              ...booking, 
              booking_status: 'cancelled', 
              updated_at: new Date().toISOString(),
              trip: { ...booking.trip, available_seats: booking.trip.available_seats + booking.seats_booked }
            };
          }
          return booking;
        })
      );
      
      toast.success("Réservation annulée avec succès");
      return true;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error("Erreur lors de l'annulation de la réservation");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, recurringRides]);

  return {
    isLoading,
    trips,
    myTrips,
    myBookings,
    searchTrips,
    createTrip,
    bookTrip,
    fetchMyTrips,
    fetchMyBookings,
    cancelTrip,
    cancelBooking,
    
    // Fonctionnalités trajets récurrents
    recurringTrips: recurringRides.recurringTrips,
    recurringBookings: recurringRides.recurringBookings,
    tripMatches: recurringRides.tripMatches,
    pauseRecurringTrip: recurringRides.pauseRecurringTrip,
    resumeRecurringTrip: recurringRides.resumeRecurringTrip,
    bookRecurringTrip: recurringRides.bookRecurringTrip,
    updateRecurringTrip: recurringRides.updateRecurringTrip
  };
}
