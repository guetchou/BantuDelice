
import { useState } from 'react';
import { TaxiDriver } from '@/types/taxi';
import { taxiDriverService } from '@/services/apiService';
import { toast } from 'sonner';

/**
 * Hook pour trouver les chauffeurs de taxi disponibles
 */
export function useDriverFinder() {
  const [loading, setLoading] = useState(false);
  const [nearbyDrivers, setNearbyDrivers] = useState<TaxiDriver[]>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * Recherche des chauffeurs disponibles à proximité
   */
  const findNearbyDrivers = async (
    pickupLatitude: number,
    pickupLongitude: number,
    vehicleType?: string,
    maxDistance: number = 5 // en kilomètres
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simuler un délai de requête API pour la démo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En production, cela serait une requête API réelle
      const response = await taxiDriverService.getAll({
        is_available: true,
        ...(vehicleType && { vehicle_type: vehicleType })
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      // Filtrer les chauffeurs par distance (serait fait côté serveur en production)
      let drivers = response.data || [];
      
      // Calculer la distance pour chaque chauffeur
      drivers = drivers.map(driver => {
        const distance = calculateDistance(
          pickupLatitude,
          pickupLongitude,
          driver.current_latitude,
          driver.current_longitude
        );
        
        return {
          ...driver,
          distance, // Ajouter la distance au chauffeur
          estimated_arrival_minutes: Math.ceil(distance * 2) // Estimation grossière: 2 min/km
        };
      });
      
      // Filtrer par distance maximale et trier par proximité
      drivers = drivers
        .filter(driver => driver.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance);
      
      setNearbyDrivers(drivers);
      
      return drivers;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de recherche des chauffeurs';
      setError(errorMessage);
      toast.error('Impossible de trouver des chauffeurs', {
        description: errorMessage
      });
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Obtenir les détails d'un chauffeur spécifique
   */
  const getDriverDetails = async (driverId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await taxiDriverService.getById(driverId);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de récupération du chauffeur';
      setError(errorMessage);
      toast.error('Impossible de récupérer les détails du chauffeur', {
        description: errorMessage
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    nearbyDrivers,
    error,
    findNearbyDrivers,
    getDriverDetails
  };
}

/**
 * Calcule la distance entre deux points géographiques en kilomètres
 * Formule de Haversine
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
