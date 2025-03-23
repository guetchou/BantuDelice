
import { PriceRange } from './types';
import { getDetailedEstimate } from './quickEstimates';

// Calcul d'une estimation de fourchette de prix
export function getPriceRange(
  distance: number, 
  vehicleType: 'standard' | 'comfort' | 'premium' | 'van',
  options: {
    isRushHour?: boolean;
    timeOfDay?: 'day' | 'night';
    isWeekend?: boolean;
  } = {}
): PriceRange {
  const baseEstimate = getDetailedEstimate(distance, vehicleType, options);
  
  // Fourchette basse: -10% du prix estimé
  const minPrice = Math.ceil(baseEstimate.total * 0.9);
  
  // Fourchette haute: +15% du prix estimé (pour tenir compte des variations possibles)
  const maxPrice = Math.ceil(baseEstimate.total * 1.15);
  
  return {
    min: minPrice,
    max: maxPrice,
    formattedRange: `${minPrice} - ${maxPrice} FCFA`
  };
}
