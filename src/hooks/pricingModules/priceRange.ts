
import { PricingFactors, PriceRange } from './types';
import { calculatePrice } from './basicPricing';
import { DEFAULT_CURRENCY } from './constants';

/**
 * Calcule une fourchette de prix pour un trajet
 */
export function getPriceRange(factors: PricingFactors): PriceRange {
  // Calculer le prix de base
  const estimate = calculatePrice(factors);
  
  // Créer une fourchette avec des marges d'incertitude
  const basePrice = estimate.totalPrice;
  
  // La marge d'incertitude augmente avec la distance
  const uncertaintyFactor = Math.min(0.2, 0.1 + (factors.distance * 0.01));
  
  // Calculer les valeurs min et max
  const min = Math.round(basePrice * (1 - uncertaintyFactor));
  const max = Math.round(basePrice * (1 + uncertaintyFactor));
  
  return {
    min,
    max,
    currency: DEFAULT_CURRENCY
  };
}
