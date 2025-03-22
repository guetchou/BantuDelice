import { useState, useCallback } from 'react';
import { 
  RidesharingTrip, 
  RidesharingSearchFilters, 
  RidesharingBooking,
  RecurringTripMatch,
  RidesharingRecurringBooking
} from '@/types/ridesharing';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export function useRidesharing() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [trips, setTrips] = useState<RidesharingTrip[]>([]);
  const [myTrips, setMyTrips] = useState<RidesharingTrip[]>([]);
  const [myBookings, setMyBookings] = useState<RidesharingBooking[]>([]);
  const [recurringTrips, setRecurringTrips] = useState<RidesharingTrip[]>([]);
  const [recurringBookings, setRecurringBookings] = useState<RidesharingRecurringBooking[]>([]);
  const [tripMatches, setTripMatches] = useState<RecurringTripMatch[]>([]);
  
  // Search for trips based on filters
  const searchTrips = async (filters: RidesharingSearchFilters) => {
    try {
      setIsLoading(true);
      
      // This would be a database query in a real implementation
      // Mock implementation for development
      const mockTrips: RidesharingTrip[] = [
        {
          id: "trip-1",
          driver_id: "d1",
          origin_address: filters.origin || "Brazzaville, Centre-ville",
          origin_latitude: 4.2634,
          origin_longitude: 15.2429,
          destination_address: filters.destination || "Pointe-Noire, Centre-ville",
          destination_latitude: -4.7889,
          destination_longitude: 11.8653,
          departure_date: filters.date?.toISOString() || new Date().toISOString(),
          departure_time: "08:00",
          estimated_arrival_time: "14:00",
          available_seats: filters.minSeats || 2,
          price_per_seat: 5000,
          status: "active",
          created_at: new Date().toISOString(),
          preferences: {
            smoking_allowed: false,
            pets_allowed: true,
            music_allowed: true,
            air_conditioning: true,
            luggage_allowed: true,
            chatty_driver: true
          },
          vehicle_model: "Toyota Corolla",
          vehicle_color: "Blanc",
          license_plate: "BZV 1234"
        },
        {
          id: "trip-2",
          driver_id: "d2",
          origin_address: filters.origin || "Pointe-Noire, Centre-ville",
          origin_latitude: -4.7889,
          origin_longitude: 11.8653,
          destination_address: filters.destination || "Brazzaville, Centre-ville",
          destination_latitude: 4.2634,
          destination_longitude: 15.2429,
          departure_date: filters.date?.toISOString() || new Date().toISOString(),
          departure_time: "09:30",
          estimated_arrival_time: "15:30",
          available_seats: 3,
          price_per_seat: 4500,
          status: "active",
          created_at: new Date().toISOString(),
          preferences: {
            smoking_allowed: false,
            pets_allowed: false,
            music_allowed: true,
            air_conditioning: true,
            luggage_allowed: true,
            chatty_driver: false
          },
          vehicle_model: "Hyundai Tucson",
          vehicle_color: "Gris",
          license_plate: "PLN 5678"
        },
        {
          id: "trip-3",
          driver_id: "d3",
          origin_address: filters.origin || "Brazzaville, Bacongo",
          origin_latitude: 4.2634,
          origin_longitude: 15.2429,
          destination_address: filters.destination || "Dolisie, Centre-ville",
          destination_latitude: -4.1992,
          destination_longitude: 12.6701,
          departure_date: filters.date?.toISOString() || new Date().toISOString(),
          departure_time: "10:15",
          estimated_arrival_time: "13:45",
          available_seats: 2,
          price_per_seat: 3500,
          status: "active",
          created_at: new Date().toISOString(),
          preferences: {
            smoking_allowed: true,
            pets_allowed: false,
            music_allowed: true,
            air_conditioning: false,
            luggage_allowed: true,
            chatty_driver: true
          },
          vehicle_model: "Renault Duster",
          vehicle_color: "Rouge",
          license_plate: "BZV 9012"
        }
      ];
      
      // Filter trips based on criteria
      const filteredTrips = mockTrips.filter(trip => {
        // Skip recurring trips when searching for one-time rides
        if (!filters.recurringTrip && trip.is_recurring) {
          return false;
        }
        
        // Skip one-time trips when searching for recurring rides
        if (filters.recurringTrip && !trip.is_recurring) {
          return false;
        }
        
        // Filter by minimum seats available
        if (filters.minSeats && trip.available_seats < filters.minSeats) {
          return false;
        }
        
        // Filter by maximum price
        if (filters.maxPrice && trip.price_per_seat > filters.maxPrice) {
          return false;
        }
        
        // Simple search based on containing the search terms
        const originMatch = !filters.origin || 
          trip.origin_address.toLowerCase().includes(filters.origin.toLowerCase());
        
        const destinationMatch = !filters.destination || 
          trip.destination_address.toLowerCase().includes(filters.destination.toLowerCase());
        
        return originMatch && destinationMatch;
      });
      
      setTrips(filteredTrips);
      
      // If we're searching for recurring trips, navigate to that tab instead
      if (filters.recurringTrip) {
        findRecurringTripMatches(filters);
      }
      
      return filteredTrips;
    } catch (error) {
      console.error("Error searching trips:", error);
      toast.error("Erreur lors de la recherche de trajets");
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch trips created by the current user
  const fetchMyTrips = async () => {
    try {
      setIsLoading(true);
      
      if (!user) {
        toast.error("Vous devez être connecté pour accéder à vos trajets");
        return [];
      }
      
      // Mock implementation for development
      const mockMyTrips: RidesharingTrip[] = [
        {
          id: "my-trip-1",
          driver_id: user.id,
          origin_address: "Brazzaville, Bacongo",
          origin_latitude: 4.2634,
          origin_longitude: 15.2429,
          destination_address: "Brazzaville, Plateau des 15 ans",
          destination_latitude: 4.2734,
          destination_longitude: 15.2529,
          departure_date: new Date().toISOString(),
          departure_time: "07:30",
          estimated_arrival_time: "08:15",
          available_seats: 3,
          price_per_seat: 1500,
          status: "active",
          created_at: new Date().toISOString(),
          preferences: {
            smoking_allowed: false,
            pets_allowed: false,
            music_allowed: true,
            air_conditioning: true,
            luggage_allowed: true
          },
          vehicle_model: "Toyota Corolla",
          vehicle_color: "Blanc",
          license_plate: "BZV 1234",
          is_recurring: true,
          recurrence_pattern: {
            frequency: 'weekdays',
            days_of_week: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
            start_date: new Date().toISOString(),
            auto_accept_riders: true
          }
        }
      ];
      
      setMyTrips(mockMyTrips);
      return mockMyTrips;
    } catch (error) {
      console.error("Error fetching my trips:", error);
      toast.error("Erreur lors du chargement de vos trajets");
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch bookings made by the current user
  const fetchMyBookings = async () => {
    try {
      setIsLoading(true);
      
      if (!user) {
        toast.error("Vous devez être connecté pour accéder à vos réservations");
        return [];
      }
      
      // Mock implementation for development
      const mockMyBookings: RidesharingBooking[] = [
        {
          id: "booking-1",
          trip_id: "trip-1",
          passenger_id: user.id,
          seats_booked: 1,
          booking_status: "confirmed",
          payment_status: "completed",
          total_price: 5000,
          created_at: new Date().toISOString(),
          payment_method: "mobile_money",
          trip: {
            id: "trip-1",
            driver_id: "d1",
            origin_address: "Brazzaville, Centre-ville",
            origin_latitude: 4.2634,
            origin_longitude: 15.2429,
            destination_address: "Pointe-Noire, Centre-ville",
            destination_latitude: -4.7889,
            destination_longitude: 11.8653,
            departure_date: new Date().toISOString(),
            departure_time: "08:00",
            estimated_arrival_time: "14:00",
            available_seats: 2,
            price_per_seat: 5000,
            status: "active",
            created_at: new Date().toISOString(),
            preferences: {
              smoking_allowed: false,
              pets_allowed: true,
              music_allowed: true,
              air_conditioning: true,
              luggage_allowed: true,
              chatty_driver: true
            }
          }
        }
      ];
      
      // Add recurring bookings too
      const mockRecurringBookings: RidesharingRecurringBooking[] = [
        {
          id: "recurring-booking-1",
          passenger_id: user.id,
          trip_id: "my-trip-1",
          status: "active",
          booking_days: ['monday', 'wednesday', 'friday'],
          start_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          auto_confirm: true,
          payment_method: "mobile_money",
          seats_booked: 1,
          special_requests: "Je pars toujours à 7h25 exactement"
        }
      ];
      
      setMyBookings(mockMyBookings);
      setRecurringBookings(mockRecurringBookings);
      return mockMyBookings;
    } catch (error) {
      console.error("Error fetching my bookings:", error);
      toast.error("Erreur lors du chargement de vos réservations");
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  // Book a trip
  const bookTrip = async (tripId: string, seatsCount: number, specialRequests?: string) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        toast.error("Vous devez être connecté pour réserver un trajet");
        return null;
      }
      
      // Find the trip to book
      const tripToBook = trips.find(trip => trip.id === tripId);
      
      if (!tripToBook) {
        toast.error("Trajet non trouvé");
        return null;
      }
      
      if (tripToBook.available_seats < seatsCount) {
        toast.error(`Il n'y a que ${tripToBook.available_seats} places disponibles`);
        return null;
      }
      
      // Mock implementation for development
      const bookingId = `booking-${Date.now()}`;
      const newBooking: RidesharingBooking = {
        id: bookingId,
        trip_id: tripId,
        passenger_id: user.id,
        seats_booked: seatsCount,
        booking_status: "confirmed",
        payment_status: "pending",
        total_price: tripToBook.price_per_seat * seatsCount,
        created_at: new Date().toISOString(),
        payment_method: "mobile_money",
        special_requests: specialRequests,
        trip: tripToBook
      };
      
      // Add to bookings
      setMyBookings(prev => [...prev, newBooking]);
      
      // Update available seats
      setTrips(prev => prev.map(trip => {
        if (trip.id === tripId) {
          return {
            ...trip,
            available_seats: trip.available_seats - seatsCount
          };
        }
        return trip;
      }));
      
      toast.success("Réservation confirmée", {
        description: `Votre place pour le trajet vers ${tripToBook.destination_address.split(',')[0]} a été réservée.`
      });
      
      return newBooking;
    } catch (error) {
      console.error("Error booking trip:", error);
      toast.error("Erreur lors de la réservation du trajet");
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create a trip
  const createTrip = async (tripData: Omit<RidesharingTrip, 'id' | 'driver_id' | 'status' | 'created_at'>) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        toast.error("Vous devez être connecté pour créer un trajet");
        return null;
      }
      
      // Mock implementation for development
      const tripId = `trip-${Date.now()}`;
      const newTrip: RidesharingTrip = {
        ...tripData,
        id: tripId,
        driver_id: user.id,
        status: 'active',
        created_at: new Date().toISOString()
      };
      
      // Add to trips
      if (newTrip.is_recurring) {
        setRecurringTrips(prev => [...prev, newTrip]);
      } else {
        setMyTrips(prev => [...prev, newTrip]);
      }
      
      toast.success("Trajet créé avec succès", {
        description: newTrip.is_recurring 
          ? "Votre trajet récurrent a été créé et publié." 
          : "Votre trajet a été créé et publié."
      });
      
      return newTrip;
    } catch (error) {
      console.error("Error creating trip:", error);
      toast.error("Erreur lors de la création du trajet");
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cancel a trip
  const cancelTrip = async (tripId: string) => {
    try {
      setIsLoading(true);
      
      // Update trip status
      setMyTrips(prev => prev.map(trip => {
        if (trip.id === tripId) {
          return {
            ...trip,
            status: 'cancelled'
          };
        }
        return trip;
      }));
      
      // Also update in recurring trips if it exists there
      setRecurringTrips(prev => prev.map(trip => {
        if (trip.id === tripId) {
          return {
            ...trip,
            status: 'cancelled'
          };
        }
        return trip;
      }));
      
      toast.success("Trajet annulé");
      return true;
    } catch (error) {
      console.error("Error cancelling trip:", error);
      toast.error("Erreur lors de l'annulation du trajet");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cancel a booking
  const cancelBooking = async (bookingId: string) => {
    try {
      setIsLoading(true);
      
      // Update booking status
      setMyBookings(prev => prev.map(booking => {
        if (booking.id === bookingId) {
          return {
            ...booking,
            booking_status: 'cancelled'
          };
        }
        return booking;
      }));
      
      toast.success("Réservation annulée");
      return true;
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Erreur lors de l'annulation de la réservation");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Find recurring trip matches based on filters
  const findRecurringTripMatches = async (filters: RidesharingSearchFilters) => {
    try {
      setIsLoading(true);
      
      // Mock implementation for development
      const mockRecurringTrips: RidesharingTrip[] = [
        {
          id: "rec-trip-1",
          driver_id: "d1",
          origin_address: "Brazzaville, Centre-ville",
          origin_latitude: 4.2634,
          origin_longitude: 15.2429,
          destination_address: "Brazzaville, Université Marien Ngouabi",
          destination_latitude: 4.2834,
          destination_longitude: 15.2629,
          departure_date: "2023-01-01",
          departure_time: "07:30",
          estimated_arrival_time: "08:00",
          available_seats: 3,
          price_per_seat: 1000,
          status: "active",
          created_at: "2023-01-01",
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
            start_date: "2023-01-01",
            auto_accept_riders: true
          },
          vehicle_model: "Toyota Corolla",
          vehicle_color: "Bleu",
          license_plate: "BZV 5555"
        },
        {
          id: "rec-trip-2",
          driver_id: "d2",
          origin_address: "Brazzaville, Moungali",
          origin_latitude: 4.2734,
          origin_longitude: 15.2529,
          destination_address: "Brazzaville, Centre-ville",
          destination_latitude: 4.2634,
          destination_longitude: 15.2429,
          departure_date: "2023-01-01",
          departure_time: "08:00",
          estimated_arrival_time: "08:30",
          available_seats: 2,
          price_per_seat: 1200,
          status: "active",
          created_at: "2023-01-01",
          preferences: {
            smoking_allowed: false,
            pets_allowed: true,
            music_allowed: true,
            air_conditioning: true,
            luggage_allowed: true,
            chatty_driver: false
          },
          is_recurring: true,
          recurrence_pattern: {
            frequency: 'weekly',
            days_of_week: ['monday', 'wednesday', 'friday'],
            start_date: "2023-01-01",
            auto_accept_riders: false
          },
          vehicle_model: "Honda Civic",
          vehicle_color: "Noir",
          license_plate: "BZV 7777"
        },
        {
          id: "rec-trip-3",
          driver_id: "d3",
          origin_address: "Brazzaville, Bacongo",
          origin_latitude: 4.2634,
          origin_longitude: 15.2429,
          destination_address: "Brazzaville, Poto-Poto",
          destination_latitude: 4.2734,
          destination_longitude: 15.2529,
          departure_date: "2023-01-01",
          departure_time: "17:30",
          estimated_arrival_time: "18:00",
          available_seats: 4,
          price_per_seat: 800,
          status: "active",
          created_at: "2023-01-01",
          preferences: {
            smoking_allowed: true,
            pets_allowed: false,
            music_allowed: true,
            air_conditioning: false,
            luggage_allowed: true,
            chatty_driver: true
          },
          is_recurring: true,
          recurrence_pattern: {
            frequency: 'custom',
            days_of_week: ['tuesday', 'thursday'],
            start_date: "2023-01-01",
            auto_accept_riders: true
          },
          vehicle_model: "Kia Sportage",
          vehicle_color: "Gris",
          license_plate: "BZV 9999"
        }
      ];
      
      // Mock matches with drivers
      const mockMatches: RecurringTripMatch[] = [
        {
          trip_id: "rec-trip-1",
          driver_id: "d1",
          driver_name: "Thomas Mbengue",
          driver_rating: 4.8,
          similarity_score: 92,
          matched_route: true,
          matched_schedule: true,
          matched_preferences: true,
          previous_trips_together: 3
        },
        {
          trip_id: "rec-trip-2",
          driver_id: "d2",
          driver_name: "Marie Loemba",
          driver_rating: 4.9,
          similarity_score: 85,
          matched_route: true,
          matched_schedule: false,
          matched_preferences: true,
          previous_trips_together: 0
        },
        {
          trip_id: "rec-trip-3",
          driver_id: "d3",
          driver_name: "Paul Moukala",
          driver_rating: 4.7,
          similarity_score: 78,
          matched_route: false,
          matched_schedule: true,
          matched_preferences: false,
          previous_trips_together: 1
        }
      ];
      
      setRecurringTrips(mockRecurringTrips);
      setTripMatches(mockMatches);
      
      return { trips: mockRecurringTrips, matches: mockMatches };
    } catch (error) {
      console.error("Error finding recurring trip matches:", error);
      toast.error("Erreur lors de la recherche de trajets récurrents");
      return { trips: [], matches: [] };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Book a recurring trip
  const bookRecurringTrip = async (tripId: string, bookingData: any) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        toast.error("Vous devez être connecté pour réserver un trajet récurrent");
        return null;
      }
      
      // Find the trip to book
      const tripToBook = recurringTrips.find(trip => trip.id === tripId);
      
      if (!tripToBook) {
        toast.error("Trajet non trouvé");
        return null;
      }
      
      if (tripToBook.available_seats < bookingData.seats) {
        toast.error(`Il n'y a que ${tripToBook.available_seats} places disponibles`);
        return null;
      }
      
      // Mock implementation for development
      const bookingId = `recurring-booking-${Date.now()}`;
      const newBooking: RidesharingRecurringBooking = {
        id: bookingId,
        passenger_id: user.id,
        trip_id: tripId,
        status: 'active',
        booking_days: bookingData.days || [],
        start_date: bookingData.startDate || new Date().toISOString(),
        end_date: bookingData.endDate,
        created_at: new Date().toISOString(),
        auto_confirm: bookingData.autoConfirm || false,
        payment_method: bookingData.paymentMethod || "mobile_money",
        seats_booked: bookingData.seats || 1,
        special_requests: bookingData.specialRequests
      };
      
      // Add to bookings
      setRecurringBookings(prev => [...prev, newBooking]);
      
      // Update available seats
      setRecurringTrips(prev => prev.map(trip => {
        if (trip.id === tripId) {
          return {
            ...trip,
            available_seats: trip.available_seats - bookingData.seats
          };
        }
        return trip;
      }));
      
      toast.success("Réservation récurrente confirmée", {
        description: `Votre place pour le trajet régulier a été réservée.`
      });
      
      return newBooking;
    } catch (error) {
      console.error("Error booking recurring trip:", error);
      toast.error("Erreur lors de la réservation du trajet récurrent");
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Pause a recurring trip
  const pauseRecurringTrip = async (tripId: string) => {
    try {
      setIsLoading(true);
      
      // Update booking status
      setRecurringBookings(prev => prev.map(booking => {
        if (booking.id === tripId) {
          return {
            ...booking,
            status: 'paused'
          };
        }
        return booking;
      }));
      
      toast.success("Trajet récurrent suspendu");
      return true;
    } catch (error) {
      console.error("Error pausing recurring trip:", error);
      toast.error("Erreur lors de la suspension du trajet récurrent");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Resume a recurring trip
  const resumeRecurringTrip = async (tripId: string) => {
    try {
      setIsLoading(true);
      
      // Update booking status
      setRecurringBookings(prev => prev.map(booking => {
        if (booking.id === tripId) {
          return {
            ...booking,
            status: 'active'
          };
        }
        return booking;
      }));
      
      toast.success("Trajet récurrent repris");
      return true;
    } catch (error) {
      console.error("Error resuming recurring trip:", error);
      toast.error("Erreur lors de la reprise du trajet récurrent");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    trips,
    myTrips,
    myBookings,
    recurringTrips,
    recurringBookings,
    tripMatches,
    searchTrips,
    fetchMyTrips,
    fetchMyBookings,
    bookTrip,
    createTrip,
    cancelTrip,
    cancelBooking,
    findRecurringTripMatches,
    bookRecurringTrip,
    pauseRecurringTrip,
    resumeRecurringTrip
  };
}
