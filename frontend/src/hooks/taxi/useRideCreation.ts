
import { useState } from 'react';
import apiService from '@/services/api';
import { toast } from 'sonner';
import { TaxiDriver, TaxiVehicleType } from '@/types/taxi';

export function useRideCreation() {
  const [loading, setLoading] = useState(false);
  const [createdRideId, setCreatedRideId] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  // Crée un trajet initial lors de la sélection de l'emplacement
  const createInitialRide = async (formState: unknown, estimatedPrice: number): Promise<boolean> => {
    try {
      setLoading(true);
      
      const user = (await apiService.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }
      
      // Calculer la durée estimée (10 min par km pour cette démo)
      const distanceKm = calculateDistance(
        formState.pickupLatitude,
        formState.pickupLongitude,
        formState.destinationLatitude,
        formState.destinationLongitude
      );
      
      const durationMin = Math.round(distanceKm * 3); // 3 minutes par km en moyenne
      
      // Calculer le moment de création
      const now = new Date().toISOString();
      
      // Créer l'entrée initiale du trajet
      const { data, error } = await supabase
        .from('taxi_rides')
        .insert({
          user_id: user.id,
          pickup_address: formState.pickupAddress,
          destination_address: formState.destinationAddress,
          pickup_latitude: formState.pickupLatitude,
          pickup_longitude: formState.pickupLongitude,
          destination_latitude: formState.destinationLatitude,
          destination_longitude: formState.destinationLongitude,
          pickup_time: formState.pickupTime === 'now' ? now : formState.scheduledTime,
          pickup_time_type: formState.pickupTime,
          status: 'pending',
          estimated_price: estimatedPrice,
          distance_km: distanceKm,
          duration_min: durationMin,
          vehicle_type: formState.vehicleType,
          created_at: now
        })
        .select('id')
        .single();
      
      if (error) {
        throw error;
      }
      
      setCreatedRideId(data.id);
      return true;
    } catch (error) {
      console.error('Erreur lors de la création du trajet:', error);
      toast.error('Erreur lors de la création du trajet');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Soumet la réservation finale
  const handleSubmit = async (rideId: string, selectedDriver: TaxiDriver | null): Promise<boolean> => {
    try {
      setLoading(true);
      
      if (!rideId) {
        throw new Error('ID de trajet manquant');
      }
      
      // Mettre à jour le trajet avec les informations finales
      const updateData: unknown = {
        status: 'pending',
      };
      
      // Si un chauffeur a été sélectionné manuellement
      if (selectedDriver) {
        updateData.driver_id = selectedDriver.id;
        updateData.status = 'driver_assigned';
      }
      
      const { error } = await supabase
        .from('taxi_rides')
        .update(updateData)
        .eq('id', rideId);
      
      if (error) {
        throw error;
      }
      
      // Marquer la réservation comme réussie
      setBookingSuccess(true);
      
      // Créer une notification pour les chauffeurs ou simuler un appariement automatique
      if (!selectedDriver) {
        // Dans une application réelle, on enverrait des notifications aux chauffeurs disponibles
        await createDriverRequestNotifications(rideId);
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la soumission de la réservation:', error);
      toast.error('Erreur lors de la réservation du taxi');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Calculer la distance entre deux points géographiques
  const calculateDistance = (
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance en km
    
    return parseFloat(distance.toFixed(2));
  };
  
  // Convertir des degrés en radians
  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };
  
  // Simuler la création de notifications pour les chauffeurs
  const createDriverRequestNotifications = async (rideId: string): Promise<void> => {
    try {
      // Dans une application réelle, on enverrait des notifications aux chauffeurs disponibles
      // Pour cette démo, nous simulons simplement une attente
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simuler un appariement de chauffeur après un délai
      setTimeout(async () => {
        try {
          // Obtenir des informations sur le trajet
          const { data: rideData, error: rideError } = await supabase
            .from('taxi_rides')
            .select('*')
            .eq('id', rideId)
            .single();
          
          if (rideError) throw rideError;
          
          // Si le trajet est toujours en attente, simuler un appariement
          if (rideData.status === 'pending') {
            const vehicleType = rideData.vehicle_type as TaxiVehicleType;
            
            // Trouver un chauffeur disponible (pour cette démo, on en simule un)
            const { data: driversData, error: driversError } = await supabase
              .from('taxi_drivers')
              .select('*')
              .eq('is_available', true)
              .eq('vehicle_type', vehicleType)
              .limit(1);
            
            if (driversError) throw driversError;
            
            // S'il y a un chauffeur disponible, l'assigner
            if (driversData && driversData.length > 0) {
              const driverId = driversData[0].id;
              
              await supabase
                .from('taxi_rides')
                .update({
                  driver_id: driverId,
                  status: 'driver_assigned'
                })
                .eq('id', rideId);
                
              // Notifier l'utilisateur
              toast.success("Un chauffeur a accepté votre course !");
            }
          }
        } catch (error) {
          console.error('Erreur lors de l\'appariement automatique:', error);
        }
      }, 8000); // Simuler un appariement après 8 secondes
    } catch (error) {
      console.error('Erreur lors de la création des notifications:', error);
    }
  };
  
  return {
    loading,
    createdRideId,
    bookingSuccess,
    createInitialRide,
    handleSubmit
  };
}
