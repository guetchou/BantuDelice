
import { TaxiPricingParams, TaxiFare } from '@/types/taxi';
import { formatCurrency } from '@/utils/formatters';

/**
 * Calcule le prix d'une course de taxi
 * @param params Paramètres de tarification
 * @returns Détails du tarif
 */
export function calculatePrice(params: TaxiPricingParams): TaxiFare {
  // Prix de base par type de véhicule
  const baseFares = {
    standard: 1000,
    comfort: 1500,
    premium: 2500,
    van: 2000
  };

  // Tarif par kilomètre par type de véhicule
  const perKmRates = {
    standard: 300,
    comfort: 400,
    premium: 600,
    van: 500
  };

  // Tarif par minute par type de véhicule
  const perMinuteRates = {
    standard: 15,
    comfort: 20,
    premium: 30,
    van: 25
  };

  // Calculer le prix de base
  const baseFare = baseFares[params.vehicle_type];
  
  // Calculer le prix basé sur la distance
  const distanceFare = params.distance_km * perKmRates[params.vehicle_type];
  
  // Calculer le prix basé sur le temps
  const timeFare = params.duration_min * perMinuteRates[params.vehicle_type];
  
  // Déterminer s'il s'agit d'une heure de pointe
  let peakHoursMultiplier = 1.0;
  if (params.time_of_day) {
    const hour = new Date(params.time_of_day).getHours();
    // Heures de pointe : 7h-9h et 17h-19h en semaine
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      peakHoursMultiplier = 1.25; // +25% en heure de pointe
    }
  }
  
  // Appliquer les remises
  let subscriptionDiscount = 0;
  if (params.subscription_discount && params.subscription_discount > 0) {
    subscriptionDiscount = (baseFare + distanceFare + timeFare) * (params.subscription_discount / 100);
  }
  
  let promoDiscount = 0;
  if (params.promo_code) {
    // Exemple simple : 10% de remise avec un code promo
    promoDiscount = (baseFare + distanceFare + timeFare) * 0.1;
  }
  
  // Calculer les taxes (TVA à 18%)
  const subtotal = (baseFare + distanceFare + timeFare) * peakHoursMultiplier - subscriptionDiscount - promoDiscount;
  const taxes = subtotal * 0.18;
  
  // Calculer le total
  const total = subtotal + taxes;
  
  // Arrondir à l'entier
  const roundedTotal = Math.round(total);
  
  return {
    base_fare: baseFare,
    distance_fare: distanceFare,
    time_fare: timeFare,
    peak_hours_multiplier: peakHoursMultiplier,
    subscription_discount: subscriptionDiscount,
    promo_discount: promoDiscount,
    taxes: taxes,
    total: roundedTotal,
    currency: 'XAF'
  };
}

/**
 * Estime le prix d'une course de taxi de manière simple
 * @param distance Distance en kilomètres
 * @param vehicleType Type de véhicule
 * @returns Prix estimé
 */
export function estimatePrice(
  distance: number,
  vehicleType: 'standard' | 'comfort' | 'premium' | 'van' = 'standard'
): { amount: number; formatted: string } {
  const result = calculatePrice({
    distance_km: distance,
    duration_min: distance * 3, // Estimation : 3 minutes par km
    vehicle_type: vehicleType
  });
  
  return {
    amount: result.total,
    formatted: formatCurrency(result.total)
  };
}

/**
 * Compare les prix entre différents types de véhicules
 * @param distance Distance en kilomètres
 * @returns Comparaison des prix
 */
export function comparePrices(distance: number): Record<string, { amount: number; formatted: string }> {
  return {
    standard: estimatePrice(distance, 'standard'),
    comfort: estimatePrice(distance, 'comfort'),
    premium: estimatePrice(distance, 'premium'),
    van: estimatePrice(distance, 'van')
  };
}
