
/**
 * Calcule la distance en kilomètres entre deux points géographiques
 * en utilisant la formule de Haversine
 * 
 * @param lat1 Latitude du point 1
 * @param lon1 Longitude du point 1
 * @param lat2 Latitude du point 2
 * @param lon2 Longitude du point 2
 * @returns Distance en kilomètres
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
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
}

/**
 * Convertit des degrés en radians
 */
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Récupère la position actuelle de l'utilisateur via l'API Geolocation
 * avec une précision améliorée
 * @returns Promise contenant les coordonnées {latitude, longitude}
 */
export function getCurrentPosition(): Promise<{latitude: number, longitude: number}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('La géolocalisation n\'est pas supportée par votre navigateur'));
      return;
    }
    
    // Options pour une meilleure précision
    const options = {
      enableHighAccuracy: true, 
      timeout: 15000,  // Extended timeout for better accuracy
      maximumAge: 0    // Always get a fresh position
    };
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.error("Geolocation error:", error.code, error.message);
        reject(error);
      },
      options
    );
  });
}

/**
 * Convertit des coordonnées en adresse lisible (géocodage inverse)
 * Amélioré avec une précision pour Brazzaville
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  try {
    // Vérifier si les coordonnées sont dans la région de Brazzaville
    const isBrazzavilleArea = 
      latitude > -4.35 && latitude < -4.20 && 
      longitude > 15.15 && longitude < 15.35;
    
    if (!isBrazzavilleArea) {
      console.warn("Coordinates outside Brazzaville area, using approximation");
    }
    
    // Simulation d'un appel API pour cette démo
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Liste d'adresses précises à Brazzaville basées sur la position
    const northAddresses = [
      "Talangaï, Brazzaville",
      "Djiri, Brazzaville",
      "Poto-Poto, Brazzaville"
    ];
    
    const centralAddresses = [
      "Centre-ville, Brazzaville",
      "Plateau des 15 ans, Brazzaville",
      "La Plaine, Brazzaville"
    ];
    
    const southAddresses = [
      "Bacongo, Brazzaville",
      "Makélékélé, Brazzaville",
      "Madibou, Brazzaville"
    ];
    
    let addressPool;
    
    // Sélection basée sur latitude
    if (latitude > -4.25) {
      addressPool = northAddresses;
    } else if (latitude > -4.29) {
      addressPool = centralAddresses;
    } else {
      addressPool = southAddresses;
    }
    
    // Retourne une adresse aléatoire du groupe correspondant
    return addressPool[Math.floor(Math.random() * addressPool.length)];
  } catch (error) {
    console.error('Erreur de géocodage inverse:', error);
    return 'Adresse non trouvée';
  }
}

/**
 * Geocode an address to coordinates
 * @param address The address to geocode
 * @returns Promise with the coordinates
 */
export async function geocodeAddress(address: string): Promise<{latitude: number, longitude: number}> {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate coordinates for Brazzaville area
    const baseLatitude = -4.2634;
    const baseLongitude = 15.2429;
    
    // Add some randomness to the coordinates
    const randomOffset = () => (Math.random() - 0.5) * 0.05;
    
    return {
      latitude: baseLatitude + randomOffset(),
      longitude: baseLongitude + randomOffset()
    };
  } catch (error) {
    console.error('Error geocoding address:', error);
    throw new Error('Failed to geocode address');
  }
}
