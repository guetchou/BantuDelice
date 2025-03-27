
import { useState } from 'react';
import { 
  PricingFactors, 
  PriceEstimate, 
  PriceRange, 
  BusinessRateEstimate 
} from './pricingModules/types';
import { calculatePrice, estimatePrice, comparePrices } from './pricingModules/basicPricing';
import { estimateTime, calculateETA, estimateTrafficLevel, updateETADynamically } from './pricingModules/timeEstimation';
import { getQuickEstimate, getDetailedEstimate, getPriceRange } from './pricingModules/quickEstimates';
import { validatePromoCode } from './pricingModules/promoCodeValidation';
import { 
  calculateSubscriptionDiscount, 
  calculateBusinessRateEstimate 
} from './pricingModules/subscriptionPricing';

export function useTaxiPricing() {
  const [isCalculating, setIsCalculating] = useState(false);

  return {
    calculatePrice,
    estimatePrice,
    comparePrices,
    estimateTime,
    calculateETA,
    estimateTrafficLevel,
    updateETADynamically,
    getQuickEstimate,
    getDetailedEstimate,
    validatePromoCode,
    getPriceRange,
    calculateSubscriptionDiscount,
    calculateBusinessRateEstimate,
    isCalculating
  };
}
