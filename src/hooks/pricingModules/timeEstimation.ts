
/**
 * Estime le temps nécessaire pour un trajet en taxi
 * @param distance Distance en kilomètres
 * @param trafficLevel Niveau de trafic ('light', 'moderate', 'heavy', 'severe')
 * @param vehicleType Type de véhicule ('standard', 'comfort', 'premium', 'van')
 * @param timeOfDay Heure de la journée (optionnel)
 * @param weatherCondition Conditions météorologiques (optionnel)
 * @returns Temps estimé en minutes
 */
export function estimateTime(
  distance: number, 
  trafficLevel: 'light' | 'moderate' | 'heavy' | 'severe' = 'moderate',
  vehicleType: 'standard' | 'comfort' | 'premium' | 'van' = 'standard',
  timeOfDay?: Date,
  weatherCondition?: 'clear' | 'rain' | 'snow' | 'fog'
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
  let adjustedSpeed = avgSpeedByTraffic[trafficLevel] * vehicleSpeedFactor[vehicleType];
  
  // Ajustement selon l'heure de la journée
  if (timeOfDay) {
    const hour = timeOfDay.getHours();
    
    // Heures de pointe: 7h-9h et 17h-19h
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      adjustedSpeed *= 0.85; // Réduction de 15% pendant les heures de pointe
    }
    
    // Nuit: 22h-6h
    if (hour >= 22 || hour <= 6) {
      adjustedSpeed *= 1.15; // Augmentation de 15% pendant la nuit (moins de trafic)
    }
  }
  
  // Ajustement selon les conditions météorologiques
  if (weatherCondition) {
    const weatherSpeedFactor = {
      clear: 1,
      rain: 0.9,
      fog: 0.8,
      snow: 0.7
    };
    
    adjustedSpeed *= weatherSpeedFactor[weatherCondition];
  }
  
  // Conversion en minutes (vitesse en km/h -> minutes)
  const timeInMinutes = (distance / adjustedSpeed) * 60;
  
  // Arrondi à la minute supérieure avec un minimum de 5 minutes
  return Math.max(5, Math.ceil(timeInMinutes));
}

/**
 * Calcule l'heure d'arrivée estimée basée sur l'heure actuelle et le temps estimé
 * @param estimatedTimeMinutes Temps estimé en minutes
 * @param departureTime Heure de départ (par défaut: maintenant)
 * @returns Objet contenant l'heure d'arrivée et la représentation formatée
 */
export function calculateETA(
  estimatedTimeMinutes: number,
  departureTime: Date = new Date()
): { arrivalTime: Date; formattedETA: string } {
  const arrivalTime = new Date(departureTime.getTime() + estimatedTimeMinutes * 60 * 1000);
  
  // Format pour l'affichage
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
  };
  
  const formattedTime = arrivalTime.toLocaleTimeString('fr-FR', options);
  const formattedETA = `${estimatedTimeMinutes} min (arrivée à ${formattedTime})`;
  
  return {
    arrivalTime,
    formattedETA
  };
}
