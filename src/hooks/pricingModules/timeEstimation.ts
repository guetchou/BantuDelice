
/**
 * Estime le temps nécessaire pour un trajet en taxi
 * @param distance Distance en kilomètres
 * @param trafficLevel Niveau de trafic ('light', 'moderate', 'heavy', 'severe')
 * @param vehicleType Type de véhicule ('standard', 'comfort', 'premium', 'van')
 * @returns Temps estimé en minutes
 */
export function estimateTime(
  distance: number, 
  trafficLevel: 'light' | 'moderate' | 'heavy' | 'severe' = 'moderate',
  vehicleType: 'standard' | 'comfort' | 'premium' | 'van' = 'standard'
): number {
  // Vitesse moyenne en km/h selon le niveau de trafic
  const avgSpeedByTraffic = {
    light: 45,
    moderate: 30,
    heavy: 20,
    severe: 12
  };
  
  // Ajustement de la vitesse selon le type de véhicule
  const vehicleSpeedFactor = {
    standard: 1,
    comfort: 1.05,
    premium: 1.1,
    van: 0.95
  };
  
  // Calcul de la vitesse ajustée
  const adjustedSpeed = avgSpeedByTraffic[trafficLevel] * vehicleSpeedFactor[vehicleType];
  
  // Conversion en minutes (vitesse en km/h -> minutes)
  const timeInMinutes = (distance / adjustedSpeed) * 60;
  
  // Arrondi à la minute supérieure avec un minimum de 5 minutes
  return Math.max(5, Math.ceil(timeInMinutes));
}
