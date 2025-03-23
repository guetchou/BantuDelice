
import { useState } from 'react';
import { PricingFactors, PriceEstimate, PriceRange, BusinessRateEstimate } from './pricingModules/types';
import { calculatePrice } from './pricingModules/basicPricing';
import { estimateTime } from './pricingModules/timeEstimation';
import { getQuickEstimate, getDetailedEstimate } from './pricingModules/quickEstimates';
import { validatePromoCode } from './pricingModules/promoCodeValidation';
import { getPriceRange } from './pricingModules/priceRange';
import { calculateSubscriptionDiscount, calculateBusinessRateEstimate } from './pricingModules/subscriptionPricing';

export function useTaxiPricing() {
  const [isCalculating, setIsCalculating] = useState(false);

  return {
    calculatePrice,
    estimateTime,
    getQuickEstimate,
    getDetailedEstimate,
    validatePromoCode,
    getPriceRange,
    calculateSubscriptionDiscount,
    calculateBusinessRateEstimate,
    isCalculating
  };
}
