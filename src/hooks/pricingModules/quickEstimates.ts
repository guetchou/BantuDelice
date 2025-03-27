
import { BASE_PRICES, PRICE_PER_KM, PRICE_PER_MINUTE } from './constants';
import { estimateTime } from './timeEstimation';

/**
 * Fournit une estimation rapide et simplifiée du prix d'une course
 * @param distance Distance en kilomètres
 * @param vehicleType Type de véhicule
 * @returns Prix estimé formaté
 */
export function getQuickEstimate(
  distance: number,
  vehicleType: 'standard' | 'comfort' | 'premium' | 'van' = 'standard'
): string {
  if (!distance || distance <= 0) {
    return "Prix indisponible";
  }
  
  const basePrice = BASE_PRICES[vehicleType];
  const pricePerKm = PRICE_PER_KM[vehicleType];
  
  // Estimation du temps en fonction de la distance (trafic modéré par défaut)
  const estimatedTime = estimateTime(distance, 'moderate', vehicleType);
  const timePrice = estimatedTime * PRICE_PER_MINUTE[vehicleType];
  
  // Calcul simplifié
  const estimatedPrice = basePrice + (distance * pricePerKm) + timePrice;
  
  // Ajouter une marge d'incertitude pour créer une fourchette
  const minPrice = Math.round(estimatedPrice * 0.9);
  const maxPrice = Math.round(estimatedPrice * 1.1);
  
  // Formater le résultat
  if (maxPrice - minPrice < 500) {
    // Si la fourchette est petite, montrer un prix unique arrondi
    return `${Math.round(estimatedPrice)} FCFA`;
  } else {
    // Sinon montrer une fourchette
    return `${minPrice} - ${maxPrice} FCFA`;
  }
}

/**
 * Fournit une estimation détaillée avec une fourchette de prix
 */
export function getDetailedEstimate(
  distance: number,
  vehicleType: 'standard' | 'comfort' | 'premium' | 'van' = 'standard',
  trafficLevel: 'light' | 'moderate' | 'heavy' | 'severe' = 'moderate',
  time: Date = new Date()
): { minPrice: number, maxPrice: number, estimatedTime: number, breakdown: string[] } {
  if (!distance || distance <= 0) {
    return {
      minPrice: 0,
      maxPrice: 0,
      estimatedTime: 0,
      breakdown: ["Distance invalide"]
    };
  }
  
  const basePrice = BASE_PRICES[vehicleType];
  const pricePerKm = PRICE_PER_KM[vehicleType];
  
  // Estimation du temps en fonction de la distance et du trafic
  const estimatedTime = estimateTime(distance, trafficLevel, vehicleType);
  const timePrice = estimatedTime * PRICE_PER_MINUTE[vehicleType];
  
  // Calcul de base
  let estimatedPrice = basePrice + (distance * pricePerKm) + timePrice;
  
  // Ajustements selon l'heure
  const hour = time.getHours();
  let timeMultiplier = 1;
  let timeMultiplierExplanation = "";
  
  if (hour >= 0 && hour < 5) {
    timeMultiplier = 1.2;
    timeMultiplierExplanation = "Tarif de nuit (+20%)";
  } else if ((hour >= 5 && hour < 7) || (hour >= 19 && hour < 22)) {
    timeMultiplier = 1.15;
    timeMultiplierExplanation = "Tarif heure de pointe (+15%)";
  } else if (hour >= 22) {
    timeMultiplier = 0.9;
    timeMultiplierExplanation = "Tarif heure creuse (-10%)";
  }
  
  estimatedPrice = estimatedPrice * timeMultiplier;
  
  // Calcul de la fourchette
  const minPrice = Math.round(estimatedPrice * 0.9);
  const maxPrice = Math.round(estimatedPrice * 1.1);
  
  // Détails pour explication
  const breakdown = [
    `Prix de base: ${basePrice} FCFA`,
    `Distance (${distance} km): ${Math.round(distance * pricePerKm)} FCFA`,
    `Durée estimée: ${estimatedTime} min (${Math.round(timePrice)} FCFA)`,
  ];
  
  if (timeMultiplier !== 1) {
    breakdown.push(timeMultiplierExplanation);
  }
  
  breakdown.push(`Fourchette de prix: ${minPrice} - ${maxPrice} FCFA`);
  
  return {
    minPrice,
    maxPrice,
    estimatedTime,
    breakdown
  };
}
