
import { PRICING_RATES } from './constants';

// Calculer le prix pour des réservations récurrentes (abonnements)
export function calculateSubscriptionDiscount(
  singleRidePrice: number,
  frequency: 'daily' | 'weekly' | 'monthly',
  numberOfRides: number
): number {
  let discountPercentage = 0;
  
  // Plus la fréquence et le nombre de trajets sont élevés, plus la réduction est importante
  switch (frequency) {
    case 'daily':
      discountPercentage = 0.25; // 25% de réduction
      break;
    case 'weekly':
      discountPercentage = 0.15; // 15% de réduction
      break;
    case 'monthly':
      discountPercentage = 0.10; // 10% de réduction
      break;
  }
  
  // Bonus pour un grand nombre de trajets
  if (numberOfRides > 20) {
    discountPercentage += 0.05; // +5%
  } else if (numberOfRides > 10) {
    discountPercentage += 0.03; // +3%
  }
  
  // Plafond à 35% de réduction
  discountPercentage = Math.min(discountPercentage, 0.35);
  
  return Math.round(singleRidePrice * numberOfRides * (1 - discountPercentage));
}

// Facturation pour les entreprises
export function calculateBusinessRateEstimate(
  distance: number,
  vehicleType: 'standard' | 'comfort' | 'premium' | 'van',
  numberOfEmployees: number,
  estimatedMonthlyRides: number
): {
  monthlyEstimate: number;
  perRideDiscount: number;
  formattedTotal: string;
} {
  // Base price calculation
  const basePrice = PRICING_RATES.BASE_RATES[vehicleType];
  const distancePrice = PRICING_RATES.DISTANCE_RATES[vehicleType] * distance;
  const baseRideEstimate = basePrice + distancePrice;
  
  // Calculer la réduction en fonction du volume
  let volumeDiscount = 0.05; // 5% de base
  
  if (estimatedMonthlyRides > 100) {
    volumeDiscount = 0.20; // 20% pour plus de 100 trajets par mois
  } else if (estimatedMonthlyRides > 50) {
    volumeDiscount = 0.15; // 15% pour plus de 50 trajets par mois
  } else if (estimatedMonthlyRides > 20) {
    volumeDiscount = 0.10; // 10% pour plus de 20 trajets par mois
  }
  
  // Bonus pour les entreprises avec beaucoup d'employés
  if (numberOfEmployees > 100) {
    volumeDiscount += 0.05; // +5%
  }
  
  // Calculer le prix total mensuel estimé
  const discountedRidePrice = baseRideEstimate * (1 - volumeDiscount);
  const monthlyTotal = Math.round(discountedRidePrice * estimatedMonthlyRides);
  
  return {
    monthlyEstimate: monthlyTotal,
    perRideDiscount: volumeDiscount * 100, // Convertir en pourcentage
    formattedTotal: `${monthlyTotal.toLocaleString()} FCFA / mois`
  };
}
