
import { useState } from 'react';
import { toast } from 'sonner';
import { useUser } from '@/hooks/useUser';
import {
  RidesharingTrip,
  RidesharingSearchFilters,
  RecurringTripMatch,
  RidesharingRecurringBooking,
  Organization,
  OrganizationRoute,
  OrganizationMember,
  OrganizationTripAssignment
} from '@/types/ridesharing';

export function useRidesharing() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [trips, setTrips] = useState<RidesharingTrip[]>([]);
  const [myTrips, setMyTrips] = useState<RidesharingTrip[]>([]);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [tripMatches, setTripMatches] = useState<RecurringTripMatch[]>([]);
  const [recurringTrips, setRecurringTrips] = useState<RidesharingTrip[]>([]);
  const [recurringBookings, setRecurringBookings] = useState<RidesharingRecurringBooking[]>([]);
  const [userOrganizations, setUserOrganizations] = useState<Organization[]>([]);
  
  // Mock data for recurring trip matches
  const mockTripMatches: RecurringTripMatch[] = [
    {
      trip_id: "trip-001",
      driver_id: "driver-001",
      driver_name: "Thomas Mbengue",
      driver_rating: 4.8,
      similarity_score: 0.92,
      matched_route: true,
      matched_schedule: true,
      matched_preferences: true,
      previous_trips_together: 0
    },
    {
      trip_id: "trip-002",
      driver_id: "driver-002",
      driver_name: "Marie Loemba",
      driver_rating: 4.9,
      similarity_score: 0.87,
      matched_route: true,
      matched_schedule: true,
      matched_preferences: false,
      previous_trips_together: 2
    },
    {
      trip_id: "trip-003",
      driver_id: "driver-003",
      driver_name: "Paul Moukala",
      driver_rating: 4.7,
      similarity_score: 0.78,
      matched_route: true,
      matched_schedule: false,
      matched_preferences: true,
      previous_trips_together: 0
    }
  ];
  
  // Mock data for recurring trips
  const mockRecurringTrips: RidesharingTrip[] = [
    {
      id: "trip-001",
      driver_id: "driver-001",
      origin_address: "Bacongo, Brazzaville",
      origin_latitude: -4.2987,
      origin_longitude: 15.2456,
      destination_address: "Centre-ville, Brazzaville",
      destination_latitude: -4.2679,
      destination_longitude: 15.2516,
      departure_date: "2023-09-01",
      departure_time: "08:00",
      estimated_arrival_time: "08:30",
      available_seats: 3,
      price_per_seat: 1000,
      status: "active",
      created_at: "2023-08-15T10:30:00Z",
      preferences: {
        smoking_allowed: false,
        pets_allowed: false,
        music_allowed: true,
        air_conditioning: true,
        luggage_allowed: true
      },
      is_recurring: true,
      recurrence_pattern: {
        frequency: "weekdays",
        days_of_week: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        start_date: "2023-09-01"
      }
    },
    {
      id: "trip-002",
      driver_id: "driver-002",
      origin_address: "Moungali, Brazzaville",
      origin_latitude: -4.2556,
      origin_longitude: 15.2709,
      destination_address: "Université Marien Ngouabi, Brazzaville",
      destination_latitude: -4.2521,
      destination_longitude: 15.2493,
      departure_date: "2023-09-01",
      departure_time: "07:30",
      estimated_arrival_time: "08:15",
      available_seats: 2,
      price_per_seat: 800,
      status: "active",
      created_at: "2023-08-20T09:15:00Z",
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
        frequency: "custom",
        days_of_week: ["monday", "wednesday", "friday"],
        start_date: "2023-09-01"
      },
      organization_id: "org-1",
      is_organization_trip: true,
      organization_subsidy_amount: 500,
      organization_subsidy_type: "fixed"
    },
    {
      id: "trip-003",
      driver_id: "driver-003",
      origin_address: "Talangaï, Brazzaville",
      origin_latitude: -4.2211,
      origin_longitude: 15.2901,
      destination_address: "Aéroport Maya-Maya, Brazzaville",
      destination_latitude: -4.2515,
      destination_longitude: 15.2355,
      departure_date: "2023-09-01",
      departure_time: "06:45",
      estimated_arrival_time: "07:30",
      available_seats: 4,
      price_per_seat: 1200,
      status: "active",
      created_at: "2023-08-18T14:20:00Z",
      preferences: {
        smoking_allowed: false,
        pets_allowed: false,
        music_allowed: false,
        air_conditioning: true,
        luggage_allowed: true,
        max_luggage_size: "large"
      },
      is_recurring: true,
      recurrence_pattern: {
        frequency: "daily",
        start_date: "2023-09-01"
      }
    }
  ];
  
  // Mock data for recurring bookings
  const mockRecurringBookings: RidesharingRecurringBooking[] = [
    {
      id: "booking-001",
      passenger_id: "user-001",
      trip_id: "trip-001",
      status: "active",
      booking_days: ["monday", "wednesday", "friday"],
      start_date: "2023-09-01",
      created_at: "2023-08-25T10:30:00Z",
      auto_confirm: true,
      payment_method: "mobile_money",
      seats_booked: 1
    },
    {
      id: "booking-002",
      passenger_id: "user-001",
      trip_id: "trip-002",
      status: "active",
      booking_days: ["tuesday", "thursday"],
      start_date: "2023-09-01",
      created_at: "2023-08-26T15:45:00Z",
      auto_confirm: true,
      payment_method: "cash",
      seats_booked: 1,
      organization_id: "org-1",
      is_subsidized: true,
      subsidy_amount: 500
    }
  ];
  
  /**
   * Search for trips based on filters
   */
  const searchTrips = async (filters: RidesharingSearchFilters) => {
    setIsLoading(true);
    
    try {
      // Simulate an API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, let's just return some mock data
      const mockTrips: RidesharingTrip[] = [
        {
          id: "1",
          driver_id: "d1",
          origin_address: "Bacongo, Brazzaville",
          origin_latitude: -4.2987,
          origin_longitude: 15.2456,
          destination_address: "Centre-ville, Brazzaville",
          destination_latitude: -4.2679,
          destination_longitude: 15.2516,
          departure_date: "2023-09-15",
          departure_time: "08:00",
          estimated_arrival_time: "08:30",
          available_seats: 3,
          price_per_seat: 1000,
          status: "active",
          created_at: "2023-09-10T10:30:00Z",
          preferences: {
            smoking_allowed: false,
            pets_allowed: false,
            music_allowed: true,
            air_conditioning: true,
            luggage_allowed: true
          }
        },
        {
          id: "2",
          driver_id: "d2",
          origin_address: "Poto-Poto, Brazzaville",
          origin_latitude: -4.2756,
          origin_longitude: 15.2709,
          destination_address: "Aéroport Maya-Maya, Brazzaville",
          destination_latitude: -4.2515,
          destination_longitude: 15.2355,
          departure_date: "2023-09-15",
          departure_time: "09:30",
          estimated_arrival_time: "10:15",
          available_seats: 2,
          price_per_seat: 1500,
          status: "active",
          created_at: "2023-09-09T14:20:00Z",
          preferences: {
            smoking_allowed: false,
            pets_allowed: true,
            music_allowed: true,
            air_conditioning: true,
            luggage_allowed: true
          }
        },
        {
          id: "3",
          driver_id: "d3",
          origin_address: "Moungali, Brazzaville",
          origin_latitude: -4.2556,
          origin_longitude: 15.2709,
          destination_address: "Université Marien Ngouabi, Brazzaville",
          destination_latitude: -4.2521,
          destination_longitude: 15.2493,
          departure_date: "2023-09-15",
          departure_time: "07:30",
          estimated_arrival_time: "08:00",
          available_seats: 4,
          price_per_seat: 800,
          status: "active",
          created_at: "2023-09-11T09:15:00Z",
          preferences: {
            smoking_allowed: false,
            pets_allowed: false,
            music_allowed: false,
            air_conditioning: true,
            luggage_allowed: true
          }
        }
      ];
      
      // Filter trips based on filters
      let filteredTrips = [...mockTrips];
      
      if (filters.origin) {
        filteredTrips = filteredTrips.filter(trip => 
          trip.origin_address.toLowerCase().includes(filters.origin!.toLowerCase())
        );
      }
      
      if (filters.destination) {
        filteredTrips = filteredTrips.filter(trip => 
          trip.destination_address.toLowerCase().includes(filters.destination!.toLowerCase())
        );
      }
      
      if (filters.minSeats) {
        filteredTrips = filteredTrips.filter(trip => 
          trip.available_seats >= filters.minSeats!
        );
      }
      
      if (filters.maxPrice) {
        filteredTrips = filteredTrips.filter(trip => 
          trip.price_per_seat <= filters.maxPrice!
        );
      }
      
      setTrips(filteredTrips);
      
      return filteredTrips;
    } catch (error) {
      console.error("Error searching trips:", error);
      toast.error("Erreur lors de la recherche de trajets");
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Create a new trip
   */
  const createTrip = async (tripData: Omit<RidesharingTrip, 'id' | 'driver_id' | 'status' | 'created_at'>) => {
    if (!user) {
      toast.error("Vous devez être connecté pour créer un trajet");
      return null;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate an API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newTrip: RidesharingTrip = {
        ...tripData,
        id: `trip-${Date.now().toString(36)}`,
        driver_id: user.id,
        status: 'active',
        created_at: new Date().toISOString()
      };
      
      // Add to myTrips
      setMyTrips(prev => [newTrip, ...prev]);
      
      if (newTrip.is_recurring) {
        setRecurringTrips(prev => [newTrip, ...prev]);
      }
      
      toast.success("Trajet créé avec succès !");
      return newTrip;
    } catch (error) {
      console.error("Error creating trip:", error);
      toast.error("Erreur lors de la création du trajet");
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Book a trip
   */
  const bookTrip = async (tripId: string, seatsCount: number, specialRequests?: string) => {
    if (!user) {
      toast.error("Vous devez être connecté pour réserver un trajet");
      return null;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate an API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const trip = trips.find(t => t.id === tripId) || myTrips.find(t => t.id === tripId);
      
      if (!trip) {
        throw new Error("Trajet non trouvé");
      }
      
      if (trip.available_seats < seatsCount) {
        throw new Error("Pas assez de places disponibles");
      }
      
      const booking = {
        id: `booking-${Date.now().toString(36)}`,
        trip_id: tripId,
        passenger_id: user.id,
        seats_booked: seatsCount,
        booking_status: 'confirmed',
        payment_status: 'completed',
        total_price: trip.price_per_seat * seatsCount,
        created_at: new Date().toISOString(),
        special_requests: specialRequests,
        trip: trip
      };
      
      // Update myBookings
      setMyBookings(prev => [booking, ...prev]);
      
      // Update trip available seats
      const updatedTrip = { ...trip, available_seats: trip.available_seats - seatsCount };
      if (myTrips.some(t => t.id === tripId)) {
        setMyTrips(prev => prev.map(t => t.id === tripId ? updatedTrip : t));
      }
      if (trips.some(t => t.id === tripId)) {
        setTrips(prev => prev.map(t => t.id === tripId ? updatedTrip : t));
      }
      
      toast.success("Trajet réservé avec succès !");
      return booking;
    } catch (error) {
      console.error("Error booking trip:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erreur lors de la réservation du trajet");
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Cancel a booking
   */
  const cancelBooking = async (bookingId: string) => {
    setIsLoading(true);
    
    try {
      // Simulate an API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const booking = myBookings.find(b => b.id === bookingId);
      
      if (!booking) {
        throw new Error("Réservation non trouvée");
      }
      
      // Update booking status
      const updatedBooking = { ...booking, booking_status: 'cancelled' };
      setMyBookings(prev => prev.map(b => b.id === bookingId ? updatedBooking : b));
      
      // Restore trip available seats
      const tripId = booking.trip_id;
      const trip = trips.find(t => t.id === tripId) || myTrips.find(t => t.id === tripId);
      
      if (trip) {
        const updatedTrip = { ...trip, available_seats: trip.available_seats + booking.seats_booked };
        
        if (myTrips.some(t => t.id === tripId)) {
          setMyTrips(prev => prev.map(t => t.id === tripId ? updatedTrip : t));
        }
        if (trips.some(t => t.id === tripId)) {
          setTrips(prev => prev.map(t => t.id === tripId ? updatedTrip : t));
        }
      }
      
      toast.success("Réservation annulée avec succès !");
      return updatedBooking;
    } catch (error) {
      console.error("Error cancelling booking:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erreur lors de l'annulation de la réservation");
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Cancel a trip
   */
  const cancelTrip = async (tripId: string) => {
    setIsLoading(true);
    
    try {
      // Simulate an API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update trip status
      const updatedTrips = myTrips.map(trip => {
        if (trip.id === tripId) {
          return { ...trip, status: 'cancelled' };
        }
        return trip;
      });
      
      setMyTrips(updatedTrips);
      
      // Also update recurring trips if necessary
      if (recurringTrips.some(t => t.id === tripId)) {
        setRecurringTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: 'cancelled' } : t));
      }
      
      toast.success("Trajet annulé avec succès !");
      return true;
    } catch (error) {
      console.error("Error cancelling trip:", error);
      toast.error("Erreur lors de l'annulation du trajet");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Fetch my trips
   */
  const fetchMyTrips = async () => {
    if (!user) {
      return [];
    }
    
    setIsLoading(true);
    
    try {
      // Simulate an API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to get the user's trips
      // For now, let's simulate with mock data
      const mockTrips: RidesharingTrip[] = [
        {
          id: "user-trip-1",
          driver_id: user.id,
          origin_address: "Bacongo, Brazzaville",
          origin_latitude: -4.2987,
          origin_longitude: 15.2456,
          destination_address: "Centre-ville, Brazzaville",
          destination_latitude: -4.2679,
          destination_longitude: 15.2516,
          departure_date: "2023-09-15",
          departure_time: "08:00",
          estimated_arrival_time: "08:30",
          available_seats: 3,
          price_per_seat: 1000,
          status: "active",
          created_at: "2023-09-10T10:30:00Z",
          preferences: {
            smoking_allowed: false,
            pets_allowed: false,
            music_allowed: true,
            air_conditioning: true,
            luggage_allowed: true
          },
          is_recurring: true,
          recurrence_pattern: {
            frequency: "weekdays",
            days_of_week: ["monday", "tuesday", "wednesday", "thursday", "friday"],
            start_date: "2023-09-01"
          }
        }
      ];
      
      setMyTrips(mockTrips);
      
      // Also update recurring trips
      const recurring = mockTrips.filter(trip => trip.is_recurring);
      setRecurringTrips(prev => {
        // Merge existing and new recurring trips
        const existingIds = prev.map(trip => trip.id);
        const newTrips = recurring.filter(trip => !existingIds.includes(trip.id));
        return [...prev, ...newTrips];
      });
      
      return mockTrips;
    } catch (error) {
      console.error("Error fetching my trips:", error);
      toast.error("Erreur lors du chargement de vos trajets");
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Fetch my bookings
   */
  const fetchMyBookings = async () => {
    if (!user) {
      return [];
    }
    
    setIsLoading(true);
    
    try {
      // Simulate an API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to get the user's bookings
      // For now, let's simulate with mock data
      const mockBookings = [
        {
          id: "user-booking-1",
          trip_id: "trip-1",
          passenger_id: user.id,
          seats_booked: 1,
          booking_status: "confirmed",
          payment_status: "completed",
          total_price: 1000,
          created_at: "2023-09-12T15:30:00Z",
          trip: {
            id: "trip-1",
            driver_id: "d1",
            origin_address: "Bacongo, Brazzaville",
            origin_latitude: -4.2987,
            origin_longitude: 15.2456,
            destination_address: "Centre-ville, Brazzaville",
            destination_latitude: -4.2679,
            destination_longitude: 15.2516,
            departure_date: "2023-09-15",
            departure_time: "08:00",
            estimated_arrival_time: "08:30",
            available_seats: 3,
            price_per_seat: 1000,
            status: "active",
            created_at: "2023-09-10T10:30:00Z",
            preferences: {
              smoking_allowed: false,
              pets_allowed: false,
              music_allowed: true,
              air_conditioning: true,
              luggage_allowed: true
            }
          }
        }
      ];
      
      setMyBookings(mockBookings);
      return mockBookings;
    } catch (error) {
      console.error("Error fetching my bookings:", error);
      toast.error("Erreur lors du chargement de vos réservations");
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Find recurring trip matches
   */
  const findRecurringTripMatches = async (filters: RidesharingSearchFilters) => {
    setIsLoading(true);
    
    try {
      // Simulate an API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, let's just return our mock data
      setTripMatches(mockTripMatches);
      setRecurringTrips(mockRecurringTrips);
      
      return { matches: mockTripMatches, trips: mockRecurringTrips };
    } catch (error) {
      console.error("Error finding recurring trip matches:", error);
      toast.error("Erreur lors de la recherche de trajets récurrents");
      return { matches: [], trips: [] };
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Book a recurring trip
   */
  const bookRecurringTrip = async (tripId: string, bookingData: any) => {
    if (!user) {
      toast.error("Vous devez être connecté pour réserver un trajet");
      return null;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate an API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const trip = recurringTrips.find(t => t.id === tripId);
      
      if (!trip) {
        throw new Error("Trajet non trouvé");
      }
      
      if (trip.available_seats < bookingData.seats) {
        throw new Error("Pas assez de places disponibles");
      }
      
      const booking: RidesharingRecurringBooking = {
        id: `recurring-booking-${Date.now().toString(36)}`,
        passenger_id: user.id,
        trip_id: tripId,
        status: 'active',
        booking_days: bookingData.days,
        start_date: bookingData.startDate || new Date().toISOString().split('T')[0],
        end_date: bookingData.endDate,
        created_at: new Date().toISOString(),
        auto_confirm: bookingData.autoConfirm || false,
        payment_method: bookingData.paymentMethod || 'cash',
        seats_booked: bookingData.seats,
        special_requests: bookingData.specialRequests,
        organization_id: trip.organization_id,
        is_subsidized: !!trip.organization_sponsored,
        subsidy_amount: trip.organization_subsidy_amount
      };
      
      // Update recurringBookings
      setRecurringBookings(prev => [booking, ...prev]);
      
      // Update trip available seats
      const updatedTrip = { ...trip, available_seats: trip.available_seats - bookingData.seats };
      setRecurringTrips(prev => prev.map(t => t.id === tripId ? updatedTrip : t));
      
      toast.success("Abonnement au trajet régulier effectué avec succès !");
      return booking;
    } catch (error) {
      console.error("Error booking recurring trip:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erreur lors de la réservation du trajet régulier");
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Pause a recurring trip
   */
  const pauseRecurringTrip = async (tripId: string) => {
    setIsLoading(true);
    
    try {
      // Simulate an API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update recurring booking status
      const myRecurringBooking = recurringBookings.find(b => b.trip_id === tripId);
      
      if (myRecurringBooking) {
        const updatedBooking = { ...myRecurringBooking, status: 'paused' as const };
        setRecurringBookings(prev => prev.map(b => b.trip_id === tripId ? updatedBooking : b));
      } else {
        throw new Error("Réservation non trouvée");
      }
      
      toast.success("Abonnement mis en pause avec succès !");
      return true;
    } catch (error) {
      console.error("Error pausing recurring trip:", error);
      toast.error("Erreur lors de la mise en pause du trajet régulier");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Resume a recurring trip
   */
  const resumeRecurringTrip = async (tripId: string) => {
    setIsLoading(true);
    
    try {
      // Simulate an API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update recurring booking status
      const myRecurringBooking = recurringBookings.find(b => b.trip_id === tripId);
      
      if (myRecurringBooking) {
        const updatedBooking = { ...myRecurringBooking, status: 'active' as const };
        setRecurringBookings(prev => prev.map(b => b.trip_id === tripId ? updatedBooking : b));
      } else {
        throw new Error("Réservation non trouvée");
      }
      
      toast.success("Abonnement repris avec succès !");
      return true;
    } catch (error) {
      console.error("Error resuming recurring trip:", error);
      toast.error("Erreur lors de la reprise du trajet régulier");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Update a recurring trip
   */
  const updateRecurringTrip = async (tripId: string, updateData: Partial<RidesharingTrip>) => {
    setIsLoading(true);
    
    try {
      // Simulate an API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update trip
      const updatedTrips = recurringTrips.map(trip => {
        if (trip.id === tripId) {
          return { ...trip, ...updateData };
        }
        return trip;
      });
      
      setRecurringTrips(updatedTrips);
      
      // Also update in myTrips if exists
      if (myTrips.some(t => t.id === tripId)) {
        setMyTrips(prev => prev.map(t => t.id === tripId ? { ...t, ...updateData } : t));
      }
      
      toast.success("Trajet régulier mis à jour avec succès !");
      return true;
    } catch (error) {
      console.error("Error updating recurring trip:", error);
      toast.error("Erreur lors de la mise à jour du trajet régulier");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Organization-related functions
  
  /**
   * Fetch user organizations
   */
  const fetchUserOrganizations = async () => {
    if (!user) {
      return [];
    }
    
    setIsLoading(true);
    
    try {
      // Simulate an API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to get the user's organizations
      // For now, let's simulate with mock data
      const mockOrganizations: Organization[] = [
        {
          id: "org-1",
          name: "Université Marien Ngouabi",
          type: "university",
          address: "Avenue de l'Université, Brazzaville",
          logo_url: "https://randomuser.me/api/portraits/men/32.jpg",
          contact_email: "contact@umng.cg",
          contact_phone: "+242 123 456 789",
          created_at: new Date().toISOString(),
          subsidy_policy: {
            subsidy_type: "fixed",
            subsidy_amount: 500,
            subsidy_cap: 2000,
            min_riders_required: 3,
            active: true
          }
        }
      ];
      
      setUserOrganizations(mockOrganizations);
      return mockOrganizations;
    } catch (error) {
      console.error("Error fetching user organizations:", error);
      toast.error("Erreur lors du chargement des organisations");
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Fetch organization routes
   */
  const fetchOrganizationRoutes = async (organizationId: string) => {
    setIsLoading(true);
    
    try {
      // Simulate an API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to get the organization's routes
      // For now, let's simulate with mock data
      const mockRoutes: OrganizationRoute[] = [
        {
          id: "route-1",
          organization_id: organizationId,
          name: "Campus - Centre-ville",
          description: "Route quotidienne du campus au centre-ville",
          destination_address: "Université Marien Ngouabi, Brazzaville",
          destination_latitude: -4.2679,
          destination_longitude: 15.2516,
          schedule: [
            { day: "monday", arrival_time: "08:00", departure_time: "17:30" },
            { day: "tuesday", arrival_time: "08:00", departure_time: "17:30" },
            { day: "wednesday", arrival_time: "08:00", departure_time: "17:30" },
            { day: "thursday", arrival_time: "08:00", departure_time: "17:30" },
            { day: "friday", arrival_time: "08:00", departure_time: "17:30" }
          ],
          active: true,
          created_at: new Date().toISOString()
        }
      ];
      
      return mockRoutes;
    } catch (error) {
      console.error("Error fetching organization routes:", error);
      toast.error("Erreur lors du chargement des itinéraires de l'organisation");
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Create an organization route
   */
  const createOrganizationRoute = async (organizationId: string, routeData: Partial<OrganizationRoute>) => {
    if (!user) {
      toast.error("Vous devez être connecté pour créer un itinéraire");
      return null;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate an API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newRoute: OrganizationRoute = {
        id: `route-${Date.now().toString(36)}`,
        organization_id: organizationId,
        name: routeData.name || "Nouvel itinéraire",
        description: routeData.description,
        destination_address: routeData.destination_address || "",
        destination_latitude: routeData.destination_latitude || 0,
        destination_longitude: routeData.destination_longitude || 0,
        schedule: routeData.schedule || [],
        active: true,
        created_at: new Date().toISOString(),
        intermediate_stops: routeData.intermediate_stops || []
      };
      
      toast.success("Itinéraire créé avec succès !");
      return newRoute;
    } catch (error) {
      console.error("Error creating organization route:", error);
      toast.error("Erreur lors de la création de l'itinéraire");
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Create an organization trip assignment
   */
  const createOrganizationTripAssignment = async (assignmentData: Partial<OrganizationTripAssignment>) => {
    if (!user) {
      toast.error("Vous devez être connecté pour créer une assignation");
      return null;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate an API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a new trip first
      const newTripId = `trip-${Date.now().toString(36)}`;
      
      const newAssignment: OrganizationTripAssignment = {
        id: `assignment-${Date.now().toString(36)}`,
        organization_id: assignmentData.organization_id || "",
        route_id: assignmentData.route_id || "",
        trip_id: newTripId,
        driver_id: assignmentData.driver_id || user.id,
        capacity: assignmentData.capacity || 4,
        status: 'scheduled',
        recurrence_pattern: assignmentData.recurrence_pattern,
        created_at: new Date().toISOString()
      };
      
      toast.success("Covoiturage programmé avec succès !");
      return newAssignment;
    } catch (error) {
      console.error("Error creating organization trip assignment:", error);
      toast.error("Erreur lors de la programmation du covoiturage");
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    trips,
    myTrips,
    myBookings,
    tripMatches,
    recurringTrips,
    recurringBookings,
    searchTrips,
    createTrip,
    bookTrip,
    cancelBooking,
    cancelTrip,
    fetchMyTrips,
    fetchMyBookings,
    findRecurringTripMatches,
    bookRecurringTrip,
    pauseRecurringTrip,
    resumeRecurringTrip,
    updateRecurringTrip,
    // Organization-related functions
    userOrganizations,
    fetchUserOrganizations,
    fetchOrganizationRoutes,
    createOrganizationRoute,
    createOrganizationTripAssignment
  };
}
