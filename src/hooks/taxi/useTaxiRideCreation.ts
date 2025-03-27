
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaxiRide, TaxiDriver } from '@/types/taxi';
import { taxiRideService, taxiRideRequestService } from '@/services/apiService';
import { toast } from 'sonner';

/**
 * Hook pour la création et la gestion des courses de taxi
 */
export function useTaxiRideCreation() {
  const [loading, setLoading] = useState(false);
  const [createdRideId, setCreatedRideId] = useState<string | null>(null);
  const [currentRide, setCurrentRide] = useState<TaxiRide | null>(null);
  const navigate = useNavigate();

  /**
   * Crée une nouvelle course de taxi
   */
  const createRide = async (rideData: Partial<TaxiRide>): Promise<string | null> => {
    setLoading(true);
    
    try {
      // S'assurer que les champs obligatoires sont présents
      if (!rideData.pickup_address || !rideData.destination_address) {
        throw new Error('Adresse de départ et de destination requises');
      }
      
      // Créer l'objet de course complet avec les valeurs par défaut
      const completeRideData: Partial<TaxiRide> = {
        status: 'pending',
        pickup_time_type: rideData.pickup_time_type || 'now',
        created_at: new Date().toISOString(),
        payment_status: 'pending',
        ...rideData
      };
      
      // Envoyer la requête de création
      const response = await taxiRideService.create(completeRideData);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      if (!response.data) {
        throw new Error('Données de la course non reçues');
      }
      
      // Stocker l'ID de la course créée
      const rideId = response.data.id;
      setCreatedRideId(rideId);
      setCurrentRide(response.data as TaxiRide);
      
      toast.success('Course créée avec succès', {
        description: `Votre course #${rideId.substring(0, 8)} a été enregistrée`
      });
      
      return rideId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de création de la course';
      toast.error('Impossible de créer la course', {
        description: errorMessage
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Demande un chauffeur spécifique pour une course
   */
  const requestDriver = async (rideId: string, driver: TaxiDriver) => {
    setLoading(true);
    
    try {
      // Créer une demande de chauffeur
      const requestData = {
        ride_id: rideId,
        driver_id: driver.id,
        status: 'pending',
        requested_at: new Date().toISOString()
      };
      
      const response = await taxiRideRequestService.create(requestData);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      // Mettre à jour le statut de la course
      await taxiRideService.update(rideId, {
        status: 'pending',
        updated_at: new Date().toISOString()
      });
      
      toast.success('Demande envoyée au chauffeur', {
        description: `${driver.name} a été notifié de votre demande`
      });
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de demande de chauffeur';
      toast.error('Impossible de demander ce chauffeur', {
        description: errorMessage
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Annule une course
   */
  const cancelRide = async (rideId: string) => {
    setLoading(true);
    
    try {
      // Mettre à jour le statut de la course
      const response = await taxiRideService.update(rideId, {
        status: 'cancelled',
        updated_at: new Date().toISOString()
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      toast.success('Course annulée', {
        description: 'Votre course a été annulée avec succès'
      });
      
      setCurrentRide(null);
      setCreatedRideId(null);
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur d\'annulation de la course';
      toast.error('Impossible d\'annuler la course', {
        description: errorMessage
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Récupère les détails d'une course
   */
  const getRideDetails = async (rideId: string) => {
    setLoading(true);
    
    try {
      const response = await taxiRideService.getById(rideId);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      if (!response.data) {
        throw new Error('Course non trouvée');
      }
      
      setCurrentRide(response.data as TaxiRide);
      setCreatedRideId(rideId);
      
      return response.data as TaxiRide;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de récupération de la course';
      toast.error('Impossible de récupérer les détails de la course', {
        description: errorMessage
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Finalise une course et redirige vers la page de suivi
   */
  const finalizeRide = async (rideId: string, selectedDriver?: TaxiDriver) => {
    if (!rideId) {
      toast.error('ID de course invalide');
      return false;
    }
    
    try {
      setLoading(true);
      
      // Si un chauffeur est sélectionné, le demander
      if (selectedDriver) {
        await requestDriver(rideId, selectedDriver);
      } else {
        // Mettre à jour le statut pour recherche automatique de chauffeur
        await taxiRideService.update(rideId, {
          status: 'pending',
          updated_at: new Date().toISOString()
        });
      }
      
      toast.success('Réservation confirmée', {
        description: selectedDriver 
          ? `${selectedDriver.name} a été notifié de votre demande` 
          : 'Recherche d\'un chauffeur en cours...'
      });
      
      // Rediriger vers la page de suivi de course
      navigate(`/taxi/ride/${rideId}`);
      return true;
    } catch (error) {
      console.error('Erreur lors de la finalisation de la réservation:', error);
      toast.error('Une erreur est survenue lors de la finalisation de la réservation');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createdRideId,
    currentRide,
    createRide,
    requestDriver,
    cancelRide,
    getRideDetails,
    finalizeRide
  };
}
