
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
 * @returns Promise contenant les coordonnées {latitude, longitude}
 */
export function getCurrentPosition(): Promise<{latitude: number, longitude: number}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('La géolocalisation n\'est pas supportée par votre navigateur'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

/**
 * Convertit des coordonnées en adresse lisible (géocodage inverse)
 * Utilise une API fictive pour cette démonstration
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  try {
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Adresses fictives pour la démo
    const addresses = [
      'Avenue Félix Eboué, Brazzaville',
      'Boulevard Denis Sassou Nguesso, Brazzaville',
      'Rue Sergent Malamine, Brazzaville',
      'Avenue de la Paix, Brazzaville',
      'Boulevard Alfred Raoul, Brazzaville'
    ];
    
    return addresses[Math.floor(Math.random() * addresses.length)];
  } catch (error) {
    console.error('Erreur de géocodage inverse:', error);
    return 'Adresse non trouvée';
  }
}
