
import { PricingFactors, PriceEstimate } from './types';
import { 
  BASE_PRICES, 
  PRICE_PER_KM, 
  PRICE_PER_MINUTE, 
  TIME_MULTIPLIERS,
  DEMAND_LEVELS,
  TRAFFIC_LEVELS,
  SHARED_RIDE_DISCOUNT,
  LOYALTY_DISCOUNTS,
  DEFAULT_CURRENCY
} from './constants';

/**
 * Détermine le multiplicateur selon l'heure de la journée
 */
function getTimeMultiplier(time: Date | string): number {
  const date = typeof time === 'string' ? new Date(time) : time;
  const hour = date.getHours();
  
  if (hour >= 0 && hour < 5) {
    return TIME_MULTIPLIERS.night;
  } else if ((hour >= 5 && hour < 7) || (hour >= 19 && hour < 22)) {
    return TIME_MULTIPLIERS.peak;
  } else if (hour >= 7 && hour < 19) {
    return TIME_MULTIPLIERS.standard;
  } else {
    return TIME_MULTIPLIERS.offPeak;
  }
}

/**
 * Calcule le prix d'une course selon les facteurs fournis
 */
export function calculatePrice(factors: PricingFactors): PriceEstimate {
  const { 
    distance, 
    duration, 
    vehicleType, 
    time,
    isSharedRide = false,
    loyaltyLevel = 0,
    trafficMultiplier = 1,
    demandMultiplier = 1,
    basePrice
  } = factors;
  
  // Prix de base selon le type de véhicule (ou prix personnalisé si fourni)
  const basePriceValue = basePrice || BASE_PRICES[vehicleType];
  
  // Prix selon la distance
  const distancePrice = distance * PRICE_PER_KM[vehicleType];
  
  // Prix selon la durée
  const durationPrice = duration * PRICE_PER_MINUTE[vehicleType];
  
  // Multiplicateur selon l'heure
  const timeMultiplier = getTimeMultiplier(time);
  const timeSurcharge = (basePriceValue + distancePrice + durationPrice) * (timeMultiplier - 1);
  
  // Prix avant réductions
  let subtotal = basePriceValue + distancePrice + durationPrice + timeSurcharge;
  
  // Ajout des surcharges de trafic et de demande
  const trafficSurcharge = subtotal * (trafficMultiplier - 1);
  const demandSurcharge = subtotal * (demandMultiplier - 1);
  
  subtotal += trafficSurcharge + demandSurcharge;
  
  // Application des réductions
  const sharedDiscount = isSharedRide ? subtotal * SHARED_RIDE_DISCOUNT : 0;
  const loyaltyDiscount = LOYALTY_DISCOUNTS[loyaltyLevel] ? subtotal * LOYALTY_DISCOUNTS[loyaltyLevel] : 0;
  
  // Prix final
  const totalPrice = Math.max(0, Math.round(subtotal - sharedDiscount - loyaltyDiscount));
  
  // Détails pour l'affichage
  const breakdown = [
    `Prix de base: ${basePriceValue} ${DEFAULT_CURRENCY}`,
    `Distance (${distance} km): ${Math.round(distancePrice)} ${DEFAULT_CURRENCY}`,
    `Durée (${duration} min): ${Math.round(durationPrice)} ${DEFAULT_CURRENCY}`
  ];
  
  if (timeMultiplier !== 1) {
    breakdown.push(`Supplément horaire: ${Math.round(timeSurcharge)} ${DEFAULT_CURRENCY}`);
  }
  
  if (trafficMultiplier !== 1) {
    breakdown.push(`Supplément trafic: ${Math.round(trafficSurcharge)} ${DEFAULT_CURRENCY}`);
  }
  
  if (demandMultiplier !== 1) {
    breakdown.push(`Supplément demande: ${Math.round(demandSurcharge)} ${DEFAULT_CURRENCY}`);
  }
  
  if (isSharedRide) {
    breakdown.push(`Réduction trajet partagé: -${Math.round(sharedDiscount)} ${DEFAULT_CURRENCY}`);
  }
  
  if (loyaltyDiscount > 0) {
    breakdown.push(`Réduction fidélité (niveau ${loyaltyLevel}): -${Math.round(loyaltyDiscount)} ${DEFAULT_CURRENCY}`);
  }
  
  breakdown.push(`Prix total: ${totalPrice} ${DEFAULT_CURRENCY}`);
  
  return {
    basePrice: basePriceValue,
    distancePrice,
    durationPrice,
    surcharges: {
      timeOfDay: timeSurcharge,
      demand: demandSurcharge,
      traffic: trafficSurcharge
    },
    discounts: {
      shared: sharedDiscount,
      loyalty: loyaltyDiscount
    },
    totalPrice,
    currency: DEFAULT_CURRENCY,
    breakdown
  };
}
