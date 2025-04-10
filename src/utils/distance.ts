
/**
 * Calcule la distance entre deux points géographiques en utilisant la formule haversine
 * @param point1 [latitude, longitude] du premier point
 * @param point2 [latitude, longitude] du deuxième point
 * @param unit 'km' pour kilomètres ou 'mi' pour miles
 * @param round Arrondir le résultat (true/false)
 * @returns Distance en km ou miles
 */
export const calculateDistance = (
  point1: [number, number],
  point2: [number, number],
  unit: 'km' | 'mi' = 'km',
  round: boolean = false
): number => {
  const [lat1, lon1] = point1;
  const [lat2, lon2] = point2;
  const R = unit === 'km' ? 6371 : 3958.8; // Rayon de la Terre en km ou en miles
  
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return round ? Math.round(distance * 10) / 10 : distance;
};

// Convertit les degrés en radians
const toRad = (value: number): number => {
  return value * Math.PI / 180;
};

/**
 * Estime le temps de livraison basé sur la distance
 * @param distance Distance en km
 * @param vehicleType Type de véhicule
 * @returns Temps estimé en secondes
 */
export const estimateDeliveryTime = (
  distance: number,
  vehicleType: string = 'bike'
): number => {
  // Vitesses moyennes en km/h
  const speeds: Record<string, number> = {
    'bike': 15,
    'scooter': 30,
    'car': 40,
    'van': 35
  };
  
  // Utiliser la vitesse du véhicule ou celle du vélo par défaut
  const speed = speeds[vehicleType] || speeds.bike;
  
  // Convertir en m/s 
  const speedMps = speed * 1000 / 3600;
  
  // Temps en secondes = distance (en km) * 1000 / vitesse (en m/s)
  const timeInSeconds = (distance * 1000) / speedMps;
  
  // Ajouter un temps supplémentaire pour les arrêts, feux rouges, etc.
  const additionalTime = 300; // 5 minutes en secondes
  
  return timeInSeconds + additionalTime;
};
