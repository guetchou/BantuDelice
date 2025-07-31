// Service de livraison avec calculs automatiques
export interface DeliveryLocation {
  lat: number;
  lng: number;
  address: string;
  timestamp: number;
}

export interface DeliveryEstimate {
  distance: number; // en km
  duration: number; // en minutes
  deliveryFee: number; // en centimes
  totalTime: number; // temps total en minutes
}

// Configuration des frais de livraison
const DELIVERY_CONFIG = {
  baseFee: 200, // 2FCFA de base
  perKmFee: 50, // 0.50FCFA par km
  maxFee: 800, // 8FCFA maximum
  freeDeliveryThreshold: 2500, // Livraison gratuite à partir de 25FCFA
  minDeliveryTime: 20, // 20 minutes minimum
  maxDeliveryTime: 60, // 60 minutes maximum
  averageSpeed: 15, // 15 km/h en ville
};

// Adresse du restaurant (à configurer selon votre restaurant)
const RESTAURANT_LOCATION = {
  lat: 48.8566,
  lng: 2.3522,
  address: "Restaurant Bantu Delice, Paris"
};

// Calcul de la distance entre deux points (formule de Haversine)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Calcul des frais de livraison
export function calculateDeliveryFee(distance: number, cartTotal: number): number {
  if (cartTotal >= DELIVERY_CONFIG.freeDeliveryThreshold) {
    return 0; // Livraison gratuite
  }
  
  const baseFee = DELIVERY_CONFIG.baseFee;
  const distanceFee = Math.round(distance * DELIVERY_CONFIG.perKmFee);
  const totalFee = baseFee + distanceFee;
  
  return Math.min(totalFee, DELIVERY_CONFIG.maxFee);
}

// Estimation du temps de livraison
export function estimateDeliveryTime(distance: number): number {
  const travelTime = (distance / DELIVERY_CONFIG.averageSpeed) * 60; // en minutes
  const preparationTime = 10; // 10 minutes de préparation
  const totalTime = Math.round(travelTime + preparationTime);
  
  return Math.max(DELIVERY_CONFIG.minDeliveryTime, Math.min(totalTime, DELIVERY_CONFIG.maxDeliveryTime));
}

// Calcul complet de l'estimation de livraison
export function calculateDeliveryEstimate(
  destination: { lat: number; lng: number },
  cartTotal: number
): DeliveryEstimate {
  const distance = calculateDistance(
    RESTAURANT_LOCATION.lat,
    RESTAURANT_LOCATION.lng,
    destination.lat,
    destination.lng
  );
  
  const duration = estimateDeliveryTime(distance);
  const deliveryFee = calculateDeliveryFee(distance, cartTotal);
  
  return {
    distance: Math.round(distance * 10) / 10, // Arrondi à 1 décimale
    duration,
    deliveryFee,
    totalTime: duration
  };
}

// Gestion de l'historique des adresses
export class DeliveryHistoryService {
  private static STORAGE_KEY = 'delivery_history';
  
  static getHistory(): DeliveryLocation[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
  
  static addToHistory(location: Omit<DeliveryLocation, 'timestamp'>): void {
    try {
      const history = this.getHistory();
      const newLocation: DeliveryLocation = {
        ...location,
        timestamp: Date.now()
      };
      
      // Éviter les doublons
      const exists = history.some(item => 
        item.address === location.address
      );
      
      if (!exists) {
        history.unshift(newLocation);
        // Garder seulement les 10 dernières adresses
        const limitedHistory = history.slice(0, 10);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedHistory));
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'historique:', error);
    }
  }
  
  static clearHistory(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'historique:', error);
    }
  }
}

// Géolocalisation automatique
export class GeolocationService {
  static async getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }
  
  static async getAddressFromCoords(lat: number, lng: number): Promise<string> {
    try {
      const token = import.meta.env.VITE_MAPBOX_TOKEN;
      if (!token) return 'Adresse non trouvée';
      
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${token}&language=fr`
      );
      const data = await response.json();
      
      return data.features[0]?.place_name || 'Adresse non trouvée';
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'adresse:', error);
      return 'Adresse non trouvée';
    }
  }
} 