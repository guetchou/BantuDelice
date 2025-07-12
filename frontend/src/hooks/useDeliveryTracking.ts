
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { pbService } from '@/services/pocketbaseService';

interface DeliveryLocation {
  latitude: number;
  longitude: number;
}

interface DeliveryDriver {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  vehicle_type: 'motorcycle' | 'car' | 'bicycle';
  rating: number;
}

interface DeliveryStatus {
  status: 'pending' | 'preparing' | 'picking_up' | 'in_transit' | 'delivered' | 'cancelled';
  timestamp: string;
  location?: DeliveryLocation;
  note?: string;
}

interface DeliveryTrackingState {
  orderId: string | null;
  driver: DeliveryDriver | null;
  status: DeliveryStatus | null;
  estimatedDeliveryTime: string | null;
  route: DeliveryLocation[];
  currentLocation: DeliveryLocation | null;
  loading: boolean;
  error: string | null;
}

export const useDeliveryTracking = (orderId: string | null) => {
  const [state, setState] = useState<DeliveryTrackingState>({
    orderId,
    driver: null,
    status: null,
    estimatedDeliveryTime: null,
    route: [],
    currentLocation: null,
    loading: false,
    error: null
  });

  // Fonction pour charger les données de suivi
  const loadTrackingData = async () => {
    if (!orderId) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Récupérer les informations de suivi
      const trackingResult = await pbService.delivery.getOrderDeliveryStatus(orderId);
      
      if (trackingResult.error) {
        throw new Error("Impossible de récupérer les données de suivi");
      }
      
      // Données simulées pour la démo
      const mockDriver: DeliveryDriver = {
        id: "driver_123",
        name: "Mamadou Diop",
        phone: "+242 123 456 789",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        vehicle_type: "motorcycle",
        rating: 4.8
      };
      
      const mockStatus: DeliveryStatus = {
        status: "in_transit",
        timestamp: new Date().toISOString(),
        location: { latitude: -4.325, longitude: 15.322 }
      };
      
      // Mise à jour de l'état avec les données
      setState(prev => ({
        ...prev,
        driver: mockDriver,
        status: mockStatus,
        estimatedDeliveryTime: "10-15 min",
        currentLocation: mockStatus.location,
        loading: false
      }));
      
      // Simuler la mise à jour de la position en temps réel
      startLocationSimulation();
      
    } catch (error) {
      console.error("Erreur de suivi de livraison:", error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : "Une erreur s'est produite" 
      }));
      
      toast.error("Erreur de suivi", {
        description: "Impossible de charger les données de suivi"
      });
    }
  };
  
  // Fonction pour simuler les mises à jour de position en temps réel
  const startLocationSimulation = () => {
    // Point de départ
    const startLat = -4.325;
    const startLng = 15.322;
    
    // Point d'arrivée (destination)
    const endLat = -4.338;
    const endLng = 15.349;
    
    // Calculer la distance totale
    const totalSteps = 20;
    const latStep = (endLat - startLat) / totalSteps;
    const lngStep = (endLng - startLng) / totalSteps;
    
    let currentStep = 0;
    
    const interval = setInterval(() => {
      if (currentStep >= totalSteps) {
        clearInterval(interval);
        
        // Arrivée à destination
        setState(prev => ({
          ...prev,
          status: {
            status: "delivered",
            timestamp: new Date().toISOString(),
            location: { latitude: endLat, longitude: endLng }
          }
        }));
        
        toast.success("Livraison effectuée", {
          description: "Votre commande a été livrée avec succès"
        });
        
        return;
      }
      
      // Calculer la nouvelle position
      const newLat = startLat + latStep * currentStep;
      const newLng = startLng + lngStep * currentStep;
      
      // Mettre à jour l'état
      setState(prev => {
        const newRoute = [...prev.route, { latitude: newLat, longitude: newLng }];
        
        return {
          ...prev,
          route: newRoute,
          currentLocation: { latitude: newLat, longitude: newLng },
          status: {
            status: "in_transit",
            timestamp: new Date().toISOString(),
            location: { latitude: newLat, longitude: newLng }
          }
        };
      });
      
      currentStep++;
    }, 3000);
    
    // Nettoyer l'intervalle lors du démontage du hook
    return () => clearInterval(interval);
  };
  
  // Charger les données initiales
  useEffect(() => {
    if (orderId) {
      loadTrackingData();
    }
    
    return () => {
      // Nettoyage lors du démontage
    };
  }, [orderId]);
  
  // Rafraîchir manuellement les données
  const refreshTracking = () => {
    loadTrackingData();
  };
  
  // Contacter le livreur
  const contactDriver = () => {
    if (!state.driver) {
      toast.error("Impossible de contacter le livreur", {
        description: "Aucun livreur n'est actuellement assigné à votre commande"
      });
      return;
    }
    
    // Simuler l'action d'appeler le livreur
    toast.info("Appel au livreur", {
      description: `Vous allez être mis en relation avec ${state.driver.name}`
    });
  };
  
  return {
    ...state,
    refreshTracking,
    contactDriver
  };
};
