
import { useState } from 'react';
import { TaxiDriver } from '@/types/taxi';
import { toast } from 'sonner';

interface DriverScore {
  driver: TaxiDriver;
  score: number;
  distance: number;
  estimatedArrivalTime: number;
}

/**
 * Hook pour l'attribution intelligente de chauffeurs
 */
export function useDriverMatching() {
  const [isLoading, setIsLoading] = useState(false);
  const [matchedDrivers, setMatchedDrivers] = useState<DriverScore[]>([]);
  const [currentDriverIndex, setCurrentDriverIndex] = useState(0);
  const [responseTimeout, setResponseTimeout] = useState<NodeJS.Timeout | null>(null);

  /**
   * Calcule un score pour chaque chauffeur en fonction de différents critères
   */
  const calculateDriverScores = (
    drivers: TaxiDriver[],
    pickupLatitude: number,
    pickupLongitude: number
  ): DriverScore[] => {
    // Calculer la distance et le score pour chaque chauffeur
    return drivers.map(driver => {
      // Distance en kilomètres (formule de Haversine simplifiée)
      const distance = calculateDistance(
        pickupLatitude, 
        pickupLongitude, 
        driver.current_latitude, 
        driver.current_longitude
      );
      
      // Taux d'acceptation (simulé pour le moment - à remplacer par des données réelles)
      const acceptanceRate = driver.rating ? driver.rating / 5 : 0.8;
      
      // Temps d'arrivée estimé en minutes (approximation)
      const estimatedArrivalTime = Math.ceil((distance / 30) * 60); // 30 km/h en moyenne
      
      // Calcul du score: 60% basé sur la distance, 40% sur le taux d'acceptation
      // Plus le score est élevé, plus le chauffeur est prioritaire
      const distanceScore = distance === 0 ? 1 : (1 / distance);
      const score = (distanceScore * 0.6) + (acceptanceRate * 0.4);
      
      return { 
        driver, 
        score, 
        distance, 
        estimatedArrivalTime 
      };
    })
    .sort((a, b) => b.score - a.score); // Tri par score décroissant
  };

  /**
   * Calcule la distance en km entre deux points géographiques
   */
  const calculateDistance = (
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return parseFloat(distance.toFixed(2));
  };

  const toRad = (value: number): number => {
    return value * Math.PI / 180;
  };

  /**
   * Recherche les chauffeurs optimaux basés sur l'algorithme de matching intelligent
   */
  const findOptimalDrivers = async (
    pickupLatitude: number,
    pickupLongitude: number,
    vehicleType?: string,
    isSharedRide: boolean = false
  ): Promise<DriverScore[]> => {
    setIsLoading(true);
    try {
      // Simulation d'une API call pour récupérer les chauffeurs disponibles
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dans une implémentation réelle, ces données viendraient de la base de données
      const mockDrivers: TaxiDriver[] = [
        {
          id: '1',
          user_id: 'user-123',
          name: 'Jean Dupont',
          phone: '+242 06 123 4567',
          vehicle_type: 'standard',
          license_plate: 'BZV 1234',
          rating: 4.8,
          is_available: true,
          current_latitude: pickupLatitude + 0.01,
          current_longitude: pickupLongitude - 0.01,
          photo_url: 'https://randomuser.me/api/portraits/men/32.jpg',
          vehicle_model: 'Toyota Corolla',
          languages: ['Français', 'Lingala'],
          years_experience: 5,
          total_rides: 342,
          verified: true,
          location: [pickupLatitude + 0.01, pickupLongitude - 0.01],
          status: 'available',
          average_rating: 4.8
        },
        {
          id: '2',
          user_id: 'user-456',
          name: 'Marie Okemba',
          phone: '+242 05 234 5678',
          vehicle_type: 'standard',
          license_plate: 'BZV 5678',
          rating: 4.6,
          is_available: true,
          current_latitude: pickupLatitude - 0.005,
          current_longitude: pickupLongitude + 0.007,
          photo_url: 'https://randomuser.me/api/portraits/women/44.jpg',
          vehicle_model: 'Hyundai Accent',
          languages: ['Français', 'Anglais'],
          years_experience: 3,
          total_rides: 187,
          verified: true,
          location: [pickupLatitude - 0.005, pickupLongitude + 0.007],
          status: 'available',
          average_rating: 4.6
        },
        {
          id: '3',
          user_id: 'user-789',
          name: 'Pascal Moukala',
          phone: '+242 06 345 6789',
          vehicle_type: 'comfort',
          license_plate: 'BZV 9012',
          rating: 4.9,
          is_available: true,
          current_latitude: pickupLatitude + 0.008,
          current_longitude: pickupLongitude + 0.002,
          photo_url: 'https://randomuser.me/api/portraits/men/67.jpg',
          vehicle_model: 'Honda Civic',
          languages: ['Français', 'Kituba'],
          years_experience: 7,
          total_rides: 520,
          verified: true,
          location: [pickupLatitude + 0.008, pickupLongitude + 0.002],
          status: 'available',
          average_rating: 4.9
        }
      ];
      
      // Filtrer par type de véhicule si spécifié
      let filteredDrivers = vehicleType 
        ? mockDrivers.filter(d => d.vehicle_type === vehicleType && d.is_available)
        : mockDrivers.filter(d => d.is_available);
      
      // Pour les courses partagées, ajoutez ici une logique additionnelle
      if (isSharedRide) {
        // Prioritiser les chauffeurs qui ont déjà une course partagée en cours
        // et qui vont dans la même direction (logique simplifiée ici)
        filteredDrivers = filteredDrivers.sort((a, b) => {
          const aIsSharing = a.status === 'in_shared_ride' ? 1 : 0;
          const bIsSharing = b.status === 'in_shared_ride' ? 1 : 0;
          return bIsSharing - aIsSharing;
        });
      }
      
      // Calculer les scores et trier les chauffeurs
      const scoredDrivers = calculateDriverScores(filteredDrivers, pickupLatitude, pickupLongitude);
      setMatchedDrivers(scoredDrivers);
      setCurrentDriverIndex(0);
      
      return scoredDrivers;
    } catch (error) {
      console.error('Erreur lors de la recherche de chauffeurs:', error);
      toast.error('Impossible de trouver des chauffeurs disponibles');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Demande au chauffeur sélectionné
   */
  const requestCurrentDriver = async (rideId: string): Promise<boolean> => {
    if (matchedDrivers.length === 0 || currentDriverIndex >= matchedDrivers.length) {
      toast.error('Aucun chauffeur disponible pour le moment');
      return false;
    }
    
    setIsLoading(true);
    try {
      const selectedDriver = matchedDrivers[currentDriverIndex];
      
      // Simulation de la demande au chauffeur
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Configurer un timeout pour passer au chauffeur suivant si pas de réponse
      if (responseTimeout) {
        clearTimeout(responseTimeout);
      }
      
      const timeout = setTimeout(() => {
        findNextDriver(rideId);
      }, 20000); // 20 secondes d'attente max
      
      setResponseTimeout(timeout);
      
      toast.success(`Demande envoyée à ${selectedDriver.driver.name}`, {
        description: `Temps d'arrivée estimé: ${selectedDriver.estimatedArrivalTime} min`
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la demande au chauffeur:', error);
      toast.error('Erreur lors de la demande au chauffeur');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Passe au chauffeur suivant si le chauffeur actuel n'a pas répondu ou a refusé
   */
  const findNextDriver = async (rideId: string): Promise<boolean> => {
    if (currentDriverIndex + 1 >= matchedDrivers.length) {
      toast.error('Aucun autre chauffeur disponible');
      return false;
    }
    
    setCurrentDriverIndex(prevIndex => prevIndex + 1);
    return requestCurrentDriver(rideId);
  };

  /**
   * Annule la recherche de chauffeur et nettoie les timeouts
   */
  const cancelDriverSearch = () => {
    if (responseTimeout) {
      clearTimeout(responseTimeout);
      setResponseTimeout(null);
    }
    
    setMatchedDrivers([]);
    setCurrentDriverIndex(0);
    toast.info('Recherche de chauffeur annulée');
  };

  /**
   * Confirme que le chauffeur a accepté la course
   */
  const confirmDriverAccepted = (driverId: string) => {
    if (responseTimeout) {
      clearTimeout(responseTimeout);
      setResponseTimeout(null);
    }
    
    const driver = matchedDrivers.find(d => d.driver.id === driverId);
    if (driver) {
      toast.success(`${driver.driver.name} a accepté votre course`, {
        description: `Arrivée estimée dans ${driver.estimatedArrivalTime} minutes`
      });
      return true;
    }
    
    return false;
  };

  return {
    isLoading,
    matchedDrivers,
    currentDriver: matchedDrivers[currentDriverIndex]?.driver || null,
    estimatedArrivalTime: matchedDrivers[currentDriverIndex]?.estimatedArrivalTime || 0,
    findOptimalDrivers,
    requestCurrentDriver,
    findNextDriver,
    cancelDriverSearch,
    confirmDriverAccepted
  };
}
