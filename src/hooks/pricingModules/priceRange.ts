
import { estimatePrice } from './quickEstimates';
import { TaxiVehicleType, PricingFactors, PriceRange, TaxiPricingParams } from '@/types/taxi';

/**
 * Get a price range for a given route and vehicle type
 */
export const getPriceRange = (factors: PricingFactors): PriceRange => {
  if (!factors.vehicle_type || !factors.distance_km) {
    return { min: 0, max: 0, currency: 'FCFA' };
  }
  
  // Convert the pricing factors to the required params format
  const params: TaxiPricingParams = {
    distance_km: factors.distance_km || 0,
    duration_min: factors.duration_min || 0,
    vehicle_type: factors.vehicle_type,
    is_premium: factors.is_premium,
    time_of_day: factors.time_of_day,
    subscription_discount: factors.subscription_discount,
    promo_code: factors.promo_code
  };
  
  // Calculate the base price
  const basePrice = estimatePrice(params.distance_km, params.vehicle_type);
  
  // Calculate the price range
  const min = Math.floor((basePrice * 0.85) / 100) * 100;
  const max = Math.ceil((basePrice * 1.15) / 100) * 100;
  
  return { min, max, currency: 'FCFA' };
};

/**
 * Format a price range as a string
 * e.g. "2,500 - 3,000 FCFA"
 */
export const formatPriceRange = (range: PriceRange): string => {
  const formatter = new Intl.NumberFormat('fr-FR');
  return `${formatter.format(range.min)} - ${formatter.format(range.max)} ${range.currency}`;
};

/**
 * Get an average price from a price range
 */
export const getAveragePrice = (range: PriceRange): number => {
  return Math.round((range.min + range.max) / 2);
};
