
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RidesharingTrip, RidesharingBooking, RidesharingSearchFilters } from '@/types/ridesharing';
import { calculateDistance } from '@/utils/deliveryOptimization';
import { useUser } from './useUser';

export function useRidesharing() {
  const [trips, setTrips] = useState<RidesharingTrip[]>([]);
  const [myTrips, setMyTrips] = useState<RidesharingTrip[]>([]);
  const [myBookings, setMyBookings] = useState<(RidesharingBooking & { trip: RidesharingTrip })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  // Rechercher des trajets
  const searchTrips = async (filters: RidesharingSearchFilters) => {
    try {
      setIsLoading(true);
      
      // Dans une application réelle, nous effectuerions une requête à la base de données
      // Pour cette démo, nous utiliserons des données fictives temporaires
      // avec un délai pour simuler une API
      
      const mockTrips: RidesharingTrip[] = [
        {
          id: "1",
          driver_id: "d1",
          origin_address: "Brazzaville, Centre-ville",
          origin_latitude: 4.2634,
          origin_longitude: 15.2429,
          destination_address: "Pointe-Noire",
          destination_latitude: 4.7889,
          destination_longitude: 11.8653,
          departure_date: "2023-07-15",
          departure_time: "08:00",
          estimated_arrival_time: "14:30",
          available_seats: 3,
          price_per_seat: 15000,
          status: "active",
          vehicle_model: "Toyota Corolla",
          vehicle_color: "Noir",
          license_plate: "AB-123-CD",
          created_at: new Date().toISOString(),
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
          origin_address: "Brazzaville, Bacongo",
          origin_latitude: 4.2734,
          origin_longitude: 15.2329,
          destination_address: "Dolisie",
          destination_latitude: 4.1958,
          destination_longitude: 12.6658,
          departure_date: "2023-07-16",
          departure_time: "09:30",
          estimated_arrival_time: "17:00",
          available_seats: 2,
          price_per_seat: 18000,
          status: "active",
          vehicle_model: "Hyundai Tucson",
          vehicle_color: "Bleu",
          license_plate: "EF-456-GH",
          created_at: new Date().toISOString(),
          preferences: {
            smoking_allowed: false,
            pets_allowed: false,
            music_allowed: true,
            air_conditioning: true,
            luggage_allowed: true
          }
        },
        {
          id: "3",
          driver_id: "d3",
          origin_address: "Pointe-Noire",
          origin_latitude: 4.7889,
          origin_longitude: 11.8653,
          destination_address: "Brazzaville",
          destination_latitude: 4.2634,
          destination_longitude: 15.2429,
          departure_date: "2023-07-17",
          departure_time: "07:00",
          estimated_arrival_time: "13:30",
          available_seats: 4,
          price_per_seat: 14000,
          status: "active",
          vehicle_model: "Nissan Patrol",
          vehicle_color: "Blanc",
          license_plate: "IJ-789-KL",
          created_at: new Date().toISOString(),
          preferences: {
            smoking_allowed: false,
            pets_allowed: true,
            music_allowed: true,
            air_conditioning: true,
            luggage_allowed: true,
            max_luggage_size: "large"
          }
        },
        {
          id: "4",
          driver_id: "d4",
          origin_address: "Brazzaville, Poto-Poto",
          origin_latitude: 4.2834,
          origin_longitude: 15.2529,
          destination_address: "Oyo",
          destination_latitude: 1.1644,
          destination_longitude: 15.9253,
          departure_date: "2023-07-18",
          departure_time: "10:00",
          estimated_arrival_time: "15:45",
          available_seats: 1,
          price_per_seat: 12000,
          status: "active",
          vehicle_model: "Renault Duster",
          vehicle_color: "Rouge",
          license_plate: "MN-012-OP",
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
      
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filtrer les voyages basés sur les critères
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
      
      if (filters.date) {
        const filterDate = filters.date.toISOString().split('T')[0];
        filteredTrips = filteredTrips.filter(trip => trip.departure_date === filterDate);
      }
      
      if (filters.minSeats) {
        filteredTrips = filteredTrips.filter(trip => trip.available_seats >= filters.minSeats!);
      }
      
      if (filters.maxPrice) {
        filteredTrips = filteredTrips.filter(trip => trip.price_per_seat <= filters.maxPrice!);
      }
      
      setTrips(filteredTrips);
      return filteredTrips;
      
    } catch (error) {
      console.error('Error searching trips:', error);
      toast.error("Erreur lors de la recherche des trajets");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Créer un nouveau trajet
  const createTrip = async (tripData: Omit<RidesharingTrip, 'id' | 'driver_id' | 'status' | 'created_at'>) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error('Vous devez être connecté pour créer un trajet');
      }
      
      // Simuler la création d'un trajet
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTrip: RidesharingTrip = {
        ...tripData,
        id: `trip-${Date.now()}`,
        driver_id: user.id,
        status: 'active',
        created_at: new Date().toISOString()
      };
      
      toast.success("Trajet créé avec succès", {
        description: "Les passagers peuvent maintenant réserver des places"
      });
      
      return newTrip;
      
    } catch (error: any) {
      console.error('Error creating trip:', error);
      toast.error("Erreur lors de la création du trajet", {
        description: error.message
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Réserver un trajet
  const bookTrip = async (tripId: string, seatsCount: number, specialRequests?: string) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error('Vous devez être connecté pour réserver un trajet');
      }
      
      const trip = trips.find(t => t.id === tripId);
      if (!trip) {
        throw new Error('Trajet non trouvé');
      }
      
      if (trip.available_seats < seatsCount) {
        throw new Error(`Seulement ${trip.available_seats} places disponibles`);
      }
      
      // Simuler la réservation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const booking: RidesharingBooking = {
        id: `booking-${Date.now()}`,
        trip_id: tripId,
        passenger_id: user.id,
        seats_booked: seatsCount,
        booking_status: 'confirmed', // Auto-confirmation pour la démo
        payment_status: 'pending',
        total_price: trip.price_per_seat * seatsCount,
        created_at: new Date().toISOString(),
        special_requests: specialRequests
      };
      
      toast.success("Réservation confirmée", {
        description: `Vous avez réservé ${seatsCount} place(s) pour ${trip.origin_address} → ${trip.destination_address}`
      });
      
      return booking;
      
    } catch (error: any) {
      console.error('Error booking trip:', error);
      toast.error("Erreur lors de la réservation", {
        description: error.message
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer mes trajets (en tant que conducteur)
  const fetchMyTrips = async () => {
    try {
      setIsLoading(true);
      
      if (!user) {
        return [];
      }
      
      // Simuler la récupération des trajets
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données fictives pour la démo
      const mockMyTrips: RidesharingTrip[] = [
        {
          id: "my-1",
          driver_id: user.id,
          origin_address: "Brazzaville, Mon Quartier",
          origin_latitude: 4.2734,
          origin_longitude: 15.2529,
          destination_address: "Pointe-Noire, Centre",
          destination_latitude: 4.7889,
          destination_longitude: 11.8653,
          departure_date: "2023-07-20",
          departure_time: "08:00",
          estimated_arrival_time: "14:30",
          available_seats: 3,
          price_per_seat: 15000,
          status: "active",
          vehicle_model: "Ma Voiture",
          license_plate: "XX-123-YY",
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
      
      setMyTrips(mockMyTrips);
      return mockMyTrips;
      
    } catch (error) {
      console.error('Error fetching my trips:', error);
      toast.error("Erreur lors de la récupération de vos trajets");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer mes réservations (en tant que passager)
  const fetchMyBookings = async () => {
    try {
      setIsLoading(true);
      
      if (!user) {
        return [];
      }
      
      // Simuler la récupération des réservations
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données fictives pour la démo
      const mockMyBookings: (RidesharingBooking & { trip: RidesharingTrip })[] = [
        {
          id: "book-1",
          trip_id: "3",
          passenger_id: user.id,
          seats_booked: 1,
          booking_status: "confirmed",
          payment_status: "completed",
          total_price: 14000,
          created_at: new Date().toISOString(),
          trip: {
            id: "3",
            driver_id: "d3",
            origin_address: "Pointe-Noire",
            origin_latitude: 4.7889, 
            origin_longitude: 11.8653,
            destination_address: "Brazzaville",
            destination_latitude: 4.2634,
            destination_longitude: 15.2429,
            departure_date: "2023-07-17",
            departure_time: "07:00",
            estimated_arrival_time: "13:30",
            available_seats: 4,
            price_per_seat: 14000,
            status: "active",
            vehicle_model: "Nissan Patrol",
            license_plate: "IJ-789-KL",
            created_at: new Date().toISOString(),
            preferences: {
              smoking_allowed: false,
              pets_allowed: true,
              music_allowed: true,
              air_conditioning: true,
              luggage_allowed: true,
              max_luggage_size: "large"
            }
          }
        }
      ];
      
      setMyBookings(mockMyBookings);
      return mockMyBookings;
      
    } catch (error) {
      console.error('Error fetching my bookings:', error);
      toast.error("Erreur lors de la récupération de vos réservations");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Annuler un trajet
  const cancelTrip = async (tripId: string, reason?: string) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error('Vous devez être connecté pour annuler un trajet');
      }
      
      // Vérifier si le trajet existe et appartient à l'utilisateur
      const trip = myTrips.find(t => t.id === tripId);
      if (!trip) {
        throw new Error('Trajet non trouvé ou vous n\'êtes pas le propriétaire');
      }
      
      // Simuler l'annulation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour l'état local
      setMyTrips(prevTrips => 
        prevTrips.map(t => 
          t.id === tripId ? { ...t, status: 'cancelled' } : t
        )
      );
      
      toast.success("Trajet annulé avec succès", {
        description: "Les passagers seront notifiés de l'annulation"
      });
      
      return true;
      
    } catch (error: any) {
      console.error('Error cancelling trip:', error);
      toast.error("Erreur lors de l'annulation du trajet", {
        description: error.message
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Annuler une réservation
  const cancelBooking = async (bookingId: string, reason?: string) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error('Vous devez être connecté pour annuler une réservation');
      }
      
      // Vérifier si la réservation existe et appartient à l'utilisateur
      const booking = myBookings.find(b => b.id === bookingId);
      if (!booking) {
        throw new Error('Réservation non trouvée');
      }
      
      // Simuler l'annulation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour l'état local
      setMyBookings(prevBookings => 
        prevBookings.map(b => 
          b.id === bookingId ? { ...b, booking_status: 'cancelled', cancellation_reason: reason } : b
        )
      );
      
      toast.success("Réservation annulée avec succès", {
        description: "Le conducteur sera notifié de l'annulation"
      });
      
      return true;
      
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      toast.error("Erreur lors de l'annulation de la réservation", {
        description: error.message
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer les détails d'un trajet
  const getTripDetails = async (tripId: string) => {
    try {
      setIsLoading(true);
      
      // Vérifier dans les trajets déjà chargés
      let trip = [...trips, ...myTrips].find(t => t.id === tripId);
      
      if (!trip) {
        // Simuler la récupération des détails
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Pour la démo, on utilise un trajet fictif si non trouvé
        trip = {
          id: tripId,
          driver_id: "sample-driver",
          origin_address: "Brazzaville",
          origin_latitude: 4.2634,
          origin_longitude: 15.2429,
          destination_address: "Pointe-Noire",
          destination_latitude: 4.7889,
          destination_longitude: 11.8653,
          departure_date: "2023-07-15",
          departure_time: "08:00",
          estimated_arrival_time: "14:30",
          available_seats: 3,
          price_per_seat: 15000,
          status: "active",
          vehicle_model: "Toyota Corolla",
          created_at: new Date().toISOString(),
          preferences: {
            smoking_allowed: false,
            pets_allowed: false,
            music_allowed: true,
            air_conditioning: true,
            luggage_allowed: true
          }
        };
      }
      
      return trip;
      
    } catch (error) {
      console.error('Error getting trip details:', error);
      toast.error("Erreur lors de la récupération des détails du trajet");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Calculer les statistiques d'économie de CO2
  const calculateCO2Savings = (distance: number, passengersCount: number) => {
    // Moyenne d'émission CO2 par km par voiture en g/km
    const averageCarEmission = 120;
    
    // Calculer les émissions évitées (on considère que sans covoiturage, 
    // chaque passager aurait pris sa propre voiture)
    const savedEmissions = averageCarEmission * distance * (passengersCount - 1);
    
    return {
      savedCO2: savedEmissions / 1000, // en kg
      equivalentTrees: Math.round(savedEmissions / 20000), // approximation: un arbre absorbe ~20kg de CO2 par an
      savedFuel: Math.round((distance * (passengersCount - 1) * 7) / 100) // approximation: 7L/100km
    };
  };

  // Estimer le prix d'un trajet
  const estimateTripPrice = (originLat: number, originLng: number, destLat: number, destLng: number) => {
    // Calculer la distance
    const distance = calculateDistance(originLat, originLng, destLat, destLng);
    
    // Prix de base
    const baseFare = 2000; // FCFA
    
    // Prix par km
    const farePerKm = 300; // FCFA/km
    
    // Calcul du prix total
    let estimatedPrice = baseFare + (distance * farePerKm);
    
    // Arrondir au 500 FCFA supérieur
    estimatedPrice = Math.ceil(estimatedPrice / 500) * 500;
    
    return {
      distance,
      estimatedPrice,
      pricePerPassenger: [
        { passengers: 1, price: estimatedPrice },
        { passengers: 2, price: Math.round(estimatedPrice / 2) },
        { passengers: 3, price: Math.round(estimatedPrice / 3) },
        { passengers: 4, price: Math.round(estimatedPrice / 4) }
      ]
    };
  };

  return {
    trips,
    myTrips,
    myBookings,
    isLoading,
    searchTrips,
    createTrip,
    bookTrip,
    fetchMyTrips,
    fetchMyBookings,
    cancelTrip,
    cancelBooking,
    getTripDetails,
    calculateCO2Savings,
    estimateTripPrice
  };
}
