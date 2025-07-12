import { supabase } from '@/integrations/supabase/client';

export interface LocationData {
  id?: string;
  user_id?: string;
  name: string;
  address: string;
  coordinates: [number, number];
  type: 'home' | 'work' | 'favorite' | 'recent';
  created_at?: string;
}

export interface GeocodeResult {
  coordinates: [number, number];
  address: string;
  formatted_address?: string;
  place_id?: string;
  accuracy?: number;
}

export interface ReverseGeocodeResult {
  address: string;
  formatted_address: string;
  city?: string;
  country?: string;
  postal_code?: string;
  coordinates: [number, number];
}

export class GeolocationService {
  // Géocodage d'une adresse vers des coordonnées
  static async geocodeAddress(address: string): Promise<GeocodeResult | null> {
    try {
      // Utiliser l'API Mapbox pour le géocodage
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}&country=CG&limit=1`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const [lng, lat] = feature.center;
        
        return {
          coordinates: [lng, lat],
          address: feature.place_name,
          formatted_address: feature.place_name,
          place_id: feature.id,
          accuracy: feature.relevance
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }

  // Géocodage inverse (coordonnées vers adresse)
  static async reverseGeocode(coordinates: [number, number]): Promise<ReverseGeocodeResult | null> {
    try {
      const [lng, lat] = coordinates;
      
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}&country=CG&limit=1`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const context = feature.context || [];
        
        return {
          address: feature.place_name,
          formatted_address: feature.place_name,
          city: context.find((c: any) => c.id.startsWith('place'))?.text,
          country: context.find((c: any) => c.id.startsWith('country'))?.text,
          postal_code: context.find((c: any) => c.id.startsWith('postcode'))?.text,
          coordinates: [lng, lat]
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }

  // Sauvegarder une localisation
  static async saveLocation(location: Omit<LocationData, 'id' | 'created_at'>): Promise<LocationData> {
    const { data, error } = await supabase
      .from('user_locations')
      .insert({
        user_id: location.user_id,
        name: location.name,
        address: location.address,
        latitude: location.coordinates[1],
        longitude: location.coordinates[0],
        type: location.type,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur lors de la sauvegarde de la localisation: ${error.message}`);
    }

    return {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      address: data.address,
      coordinates: [data.longitude, data.latitude],
      type: data.type,
      created_at: data.created_at
    };
  }

  // Récupérer les localisations d'un utilisateur
  static async getUserLocations(userId: string): Promise<LocationData[]> {
    const { data, error } = await supabase
      .from('user_locations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erreur lors de la récupération des localisations: ${error.message}`);
    }

    return (data || []).map(location => ({
      id: location.id,
      user_id: location.user_id,
      name: location.name,
      address: location.address,
      coordinates: [location.longitude, location.latitude],
      type: location.type,
      created_at: location.created_at
    }));
  }

  // Supprimer une localisation
  static async deleteLocation(locationId: string): Promise<void> {
    const { error } = await supabase
      .from('user_locations')
      .delete()
      .eq('id', locationId);

    if (error) {
      throw new Error(`Erreur lors de la suppression de la localisation: ${error.message}`);
    }
  }

  // Calculer la distance entre deux points (formule de Haversine)
  static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Rayon de la Terre en kilomètres
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance en kilomètres
  }

  // Formater la distance pour l'affichage
  static formatDistance(distance: number): string {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    } else {
      return `${distance.toFixed(1)}km`;
    }
  }

  // Trouver les restaurants à proximité
  static async findNearbyRestaurants(lat: number, lon: number, radius: number = 5): Promise<any[]> {
    try {
      const { data: restaurants, error } = await supabase
        .from('restaurants')
        .select('*');

      if (error) {
        throw new Error(`Erreur lors de la récupération des restaurants: ${error.message}`);
      }

      // Filtrer les restaurants dans le rayon spécifié
      const nearbyRestaurants = restaurants?.filter(restaurant => {
        if (!restaurant.latitude || !restaurant.longitude) return false;
        
        const distance = this.calculateDistance(
          lat, lon, 
          restaurant.latitude, restaurant.longitude
        );
        
        return distance <= radius;
      }) || [];

      // Trier par distance
      return nearbyRestaurants.sort((a, b) => {
        const distanceA = this.calculateDistance(lat, lon, a.latitude, a.longitude);
        const distanceB = this.calculateDistance(lat, lon, b.latitude, b.longitude);
        return distanceA - distanceB;
      });
    } catch (error) {
      console.error('Error finding nearby restaurants:', error);
      return [];
    }
  }

  // Obtenir l'itinéraire entre deux points
  static async getRoute(from: [number, number], to: [number, number]): Promise<any> {
    try {
      const [fromLng, fromLat] = from;
      const [toLng, toLat] = to;
      
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${fromLng},${fromLat};${toLng},${toLat}?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}&geometries=geojson&overview=full`
      );
      
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        return {
          route: data.routes[0],
          distance: data.routes[0].distance / 1000, // en kilomètres
          duration: data.routes[0].duration / 60, // en minutes
          geometry: data.routes[0].geometry
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting route:', error);
      return null;
    }
  }

  // Obtenir la position actuelle avec géocodage inverse
  static async getCurrentLocation(): Promise<ReverseGeocodeResult | null> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('La géolocalisation n\'est pas supportée'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const coordinates: [number, number] = [longitude, latitude];
          
          try {
            const result = await this.reverseGeocode(coordinates);
            resolve(result);
          } catch (error) {
            // Si le géocodage inverse échoue, retourner les coordonnées
            resolve({
              address: 'Position actuelle',
              formatted_address: 'Position actuelle',
              coordinates: coordinates
            });
          }
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000
        }
      );
    });
  }

  // Vérifier si une adresse est dans la zone de livraison
  static async isInDeliveryZone(coordinates: [number, number]): Promise<boolean> {
    // Coordonnées du centre de Brazzaville
    const centerLat = -4.2634;
    const centerLon = 15.2429;
    
    // Rayon de livraison (en kilomètres)
    const deliveryRadius = 20;
    
    const distance = this.calculateDistance(
      centerLat, centerLon,
      coordinates[1], coordinates[0]
    );
    
    return distance <= deliveryRadius;
  }

  // Obtenir les zones de livraison
  static async getDeliveryZones(): Promise<any[]> {
    // Zones de livraison prédéfinies pour Brazzaville
    return [
      {
        id: 'central',
        name: 'Centre-ville',
        center: [15.2429, -4.2634],
        radius: 5,
        delivery_fee: 500
      },
      {
        id: 'north',
        name: 'Nord Brazzaville',
        center: [15.2429, -4.2134],
        radius: 8,
        delivery_fee: 1000
      },
      {
        id: 'south',
        name: 'Sud Brazzaville',
        center: [15.2429, -4.3134],
        radius: 8,
        delivery_fee: 1000
      },
      {
        id: 'east',
        name: 'Est Brazzaville',
        center: [15.2929, -4.2634],
        radius: 8,
        delivery_fee: 1000
      },
      {
        id: 'west',
        name: 'Ouest Brazzaville',
        center: [15.1929, -4.2634],
        radius: 8,
        delivery_fee: 1000
      }
    ];
  }

  // Calculer les frais de livraison selon la distance
  static calculateDeliveryFee(distance: number): number {
    if (distance <= 2) return 500;
    if (distance <= 5) return 1000;
    if (distance <= 10) return 1500;
    if (distance <= 15) return 2000;
    return 2500; // Distance > 15km
  }
} 