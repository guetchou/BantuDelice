
import { TaxiVehicleType } from '@/types/taxi';
import { formatCurrency } from '@/utils/formatters';
import { PriceEstimate, PriceRange } from './types';

/**
 * Calcule une estimation rapide de prix basée sur quelques facteurs clés
 * @param distance Distance en kilomètres
 * @param vehicleType Type de véhicule
 * @param isPeakHour Indique si la course est en heure de pointe (optionnel)
 * @returns Estimation rapide du prix
 */
export function getQuickEstimate(
  distance: number,
  vehicleType: TaxiVehicleType,
  isPeakHour: boolean = false
): number {
  const basePrice = 1000; // Prix de base en XAF
  
  // Prix par km en fonction du type de véhicule
  const pricePerKm: Record<TaxiVehicleType, number> = {
    standard: 300,
    comfort: 400,
    premium: 600,
    van: 500
  };
  
  // Calculer le prix en fonction de la distance et du type de véhicule
  let price = basePrice + (distance * pricePerKm[vehicleType]);
  
  // Appliquer un supplément en heure de pointe
  if (isPeakHour) {
    price *= 1.25; // +25% en heure de pointe
  }
  
  // Arrondir à la centaine près
  return Math.ceil(price / 100) * 100;
}

/**
 * Calcule une estimation détaillée du prix
 * @param distance Distance en kilomètres
 * @param duration Durée estimée en minutes
 * @param vehicleType Type de véhicule
 * @param options Options supplémentaires (heure de pointe, météo, promo)
 * @returns Estimation détaillée du prix
 */
export function getDetailedEstimate(
  distance: number,
  duration: number,
  vehicleType: TaxiVehicleType,
  options?: {
    isPeakHour?: boolean;
    weather?: 'normal' | 'rain' | 'storm';
    promoCode?: string;
    subscriptionId?: string | null;
  }
): PriceEstimate {
  const basePrice = 1000; // Prix de base en XAF
  
  // Prix par km en fonction du type de véhicule
  const pricePerKm: Record<TaxiVehicleType, number> = {
    standard: 300,
    comfort: 400,
    premium: 600,
    van: 500
  };
  
  // Prix par minute d'attente
  const pricePerMinute: Record<TaxiVehicleType, number> = {
    standard: 15,
    comfort: 20,
    premium: 30,
    van: 25
  };
  
  // Calculer les composantes du prix
  const distanceFare = distance * pricePerKm[vehicleType];
  const timeFare = duration * pricePerMinute[vehicleType];
  
  // Prix total avant ajustements
  let totalBeforeTax = basePrice + distanceFare + timeFare;
  
  // Facteurs d'ajustement
  const peakHourFactor = options?.isPeakHour ? 1.25 : 1.0;
  
  let weatherFactor = 1.0;
  if (options?.weather === 'rain') {
    weatherFactor = 1.15; // +15% par temps de pluie
  } else if (options?.weather === 'storm') {
    weatherFactor = 1.3; // +30% par temps d'orage
  }
  
  // Appliquer les facteurs
  let finalPrice = totalBeforeTax * peakHourFactor * weatherFactor;
  
  // Appliquer les remises (promo, abonnement)
  let discountAmount = 0;
  if (options?.promoCode) {
    // Exemple simpliste de remise promo
    discountAmount = finalPrice * 0.1; // 10% de remise
  }
  
  if (options?.subscriptionId) {
    // Remise supplémentaire pour les abonnés
    // On suppose ici que les abonnés ont une remise de 5%
    discountAmount += (finalPrice - discountAmount) * 0.05;
  }
  
  finalPrice -= discountAmount;
  
  // Appliquer la TVA (18%)
  const taxRate = 0.18;
  const taxAmount = finalPrice * taxRate;
  const totalWithTax = finalPrice + taxAmount;
  
  // Arrondir à la centaine près
  const roundedTotal = Math.ceil(totalWithTax / 100) * 100;
  
  return {
    baseFare: basePrice,
    distanceFare: Math.round(distanceFare),
    timeFare: Math.round(timeFare),
    totalBeforeTax: Math.round(totalBeforeTax),
    tax: Math.round(taxAmount),
    total: roundedTotal,
    currency: 'XAF',
    breakdown: {
      base: basePrice,
      distance: Math.round(distanceFare),
      time: Math.round(timeFare),
      vehicleType: vehicleType === 'standard' ? 1.0 : vehicleType === 'comfort' ? 1.2 : vehicleType === 'premium' ? 1.5 : 1.3,
      timeOfDay: peakHourFactor,
      weather: weatherFactor,
      discount: discountAmount > 0 ? discountAmount : 0,
      tax: taxRate
    },
    formattedTotal: formatCurrency(roundedTotal)
  };
}

/**
 * Calcule une fourchette de prix
 * @param distance Distance en kilomètres
 * @param vehicleType Type de véhicule
 * @returns Fourchette de prix
 */
export function getPriceRange(
  distance: number,
  vehicleType: TaxiVehicleType
): PriceRange {
  // Obtenir l'estimation typique
  const typical = getQuickEstimate(distance, vehicleType, false);
  
  // Calculer les variations
  const min = Math.round(typical * 0.85); // -15%
  const max = Math.round(typical * 1.2); // +20%
  
  return {
    min,
    max,
    typical,
    formattedRange: `${formatCurrency(min)} - ${formatCurrency(max)}`,
    formattedTypical: formatCurrency(typical)
  };
}
