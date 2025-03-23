
import { PRICING_RATES } from './constants';
import { calculatePrice } from './basicPricing';
import { estimateTime } from './timeEstimation';
import { PriceEstimate } from './types';

// Estimation rapide pour l'affichage immédiat
export function getQuickEstimate(distance: number, vehicleType: 'standard' | 'comfort' | 'premium' | 'van'): string {
  const basePrice = PRICING_RATES.BASE_RATES[vehicleType];
  const distancePrice = PRICING_RATES.DISTANCE_RATES[vehicleType] * distance;
  const total = basePrice + distancePrice;
  
  return `${Math.ceil(total)} FCFA`;
}

// Estimation avancée qui tient compte de plus de facteurs
export function getDetailedEstimate(
  distance: number, 
  vehicleType: 'standard' | 'comfort' | 'premium' | 'van',
  options: {
    isRushHour?: boolean;
    timeOfDay?: 'day' | 'night';
    isWeekend?: boolean;
    isAirportRide?: boolean;
    hasExtraBaggage?: boolean;
    isRecurringClient?: boolean;
    isRoundTrip?: boolean;
    useExpressLane?: boolean;
    destination?: string;
    numberOfPassengers?: number;
  } = {}
): PriceEstimate {
  const duration = estimateTime(
    distance, 
    options.isRushHour || false, 
    options.timeOfDay || 'day',
    options.useExpressLane || false
  );
  
  return calculatePrice({
    distance,
    duration,
    vehicleType,
    timeOfDay: options.timeOfDay || 'day',
    isRushHour: options.isRushHour || false,
    isWeekend: options.isWeekend || false,
    isPromoCodeApplied: false,
    promoDiscount: 0,
    isAirportRide: options.isAirportRide || false,
    hasExtraBaggage: options.hasExtraBaggage || false,
    isRecurringClient: options.isRecurringClient || false,
    isRoundTrip: options.isRoundTrip || false,
    useExpressLane: options.useExpressLane || false,
    destination: options.destination,
    numberOfPassengers: options.numberOfPassengers
  });
}
