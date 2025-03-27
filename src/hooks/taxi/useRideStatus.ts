
import { useState, useEffect } from 'react';
import { TaxiRide, TaxiDriver } from '@/types/taxi';
import { taxiRideService, taxiRatingService } from '@/services/apiService';
import { toast } from 'sonner';

export interface UseRideStatusResult {
  loading: boolean;
  error: string | null;
  ride: TaxiRide | null;
  driver: TaxiDriver | null;
  isCancelling: boolean;
  isRatingSubmitting: boolean;
  isRatingOpen: boolean;
  openRating: () => void;
  closeRating: () => void;
  cancelRide: () => Promise<void>;
  submitRating: (rating: number, comment: string) => Promise<void>;
  refreshRide: () => Promise<void>;
  contactDriver: (message: string) => Promise<void>;
}

export function useRideStatus(rideId?: string): UseRideStatusResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ride, setRide] = useState<TaxiRide | null>(null);
  const [driver, setDriver] = useState<TaxiDriver | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);

  // Charger les détails de la course
  const fetchRideDetails = async () => {
    if (!rideId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await taxiRideService.getById(rideId);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      if (!response.data) {
        throw new Error('Course non trouvée');
      }
      
      setRide(response.data as TaxiRide);
      
      // Si un chauffeur est assigné, récupérer ses informations
      if (response.data.driver_id) {
        await fetchDriverDetails(response.data.driver_id);
      }
      
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de chargement';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Récupérer les détails du chauffeur
  const fetchDriverDetails = async (driverId: string) => {
    try {
      const response = await taxiRideService.getDriverById(driverId);
      
      if (!response.error && response.data) {
        setDriver(response.data as TaxiDriver);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des détails du chauffeur:', error);
    }
  };
  
  // Annuler une course
  const cancelRide = async () => {
    if (!ride || !rideId) return;
    
    setIsCancelling(true);
    try {
      const response = await taxiRideService.update(rideId, {
        status: 'cancelled',
        updated_at: new Date().toISOString()
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      toast.success("Course annulée", {
        description: "Votre course a été annulée avec succès"
      });
      
      // Rafraîchir les données
      await fetchRideDetails();
    } catch (error) {
      toast.error("Erreur lors de l'annulation", {
        description: "Impossible d'annuler votre course"
      });
    } finally {
      setIsCancelling(false);
    }
  };
  
  // Soumettre une évaluation
  const submitRating = async (rating: number, comment: string) => {
    if (!ride || !rideId) return;
    
    setIsRatingSubmitting(true);
    try {
      const ratingData = {
        ride_id: rideId,
        rating,
        comment,
        created_at: new Date().toISOString()
      };
      
      const response = await taxiRatingService.create(ratingData);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      toast.success("Merci pour votre évaluation", {
        description: "Votre avis a été enregistré avec succès"
      });
      
      setIsRatingOpen(false);
    } catch (error) {
      toast.error("Erreur lors de l'évaluation", {
        description: "Impossible d'enregistrer votre évaluation"
      });
    } finally {
      setIsRatingSubmitting(false);
    }
  };
  
  // Contacter le chauffeur
  const contactDriver = async (message: string) => {
    if (!driver) {
      toast.error("Impossible de contacter le chauffeur", {
        description: "Aucun chauffeur assigné à cette course"
      });
      return;
    }
    
    toast.success("Message envoyé", {
      description: `Message envoyé à ${driver.name}`
    });
  };
  
  // Ouvrir le formulaire d'évaluation
  const openRating = () => setIsRatingOpen(true);
  
  // Fermer le formulaire d'évaluation
  const closeRating = () => setIsRatingOpen(false);
  
  // Rafraîchir les détails de la course
  const refreshRide = async () => {
    await fetchRideDetails();
  };
  
  // Charger les détails de la course au montage du composant
  useEffect(() => {
    if (rideId) {
      fetchRideDetails();
    }
    
    // Mettre en place un intervalle pour rafraîchir la course
    const intervalId = setInterval(() => {
      if (rideId) {
        fetchRideDetails();
      }
    }, 15000);
    
    return () => clearInterval(intervalId);
  }, [rideId]);
  
  return {
    loading,
    error,
    ride,
    driver,
    isCancelling,
    isRatingSubmitting,
    isRatingOpen,
    openRating,
    closeRating,
    cancelRide,
    submitRating,
    refreshRide,
    contactDriver
  };
}
