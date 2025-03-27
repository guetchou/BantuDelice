
import { PricingFactors, BusinessRateEstimate } from './types';
import { calculatePrice } from './basicPricing';
import { DEFAULT_CURRENCY } from './constants';

// Types d'abonnements et leurs réductions
const SUBSCRIPTION_DISCOUNTS = {
  basic: 0.05,      // 5% de réduction
  standard: 0.1,    // 10% de réduction
  premium: 0.15,    // 15% de réduction
  business: 0.2,    // 20% de réduction
  enterprise: 0.25  // 25% de réduction
};

/**
 * Calcule la réduction applicable selon l'abonnement
 */
export function calculateSubscriptionDiscount(
  factors: PricingFactors,
  subscriptionType: keyof typeof SUBSCRIPTION_DISCOUNTS
): number {
  if (!subscriptionType || !SUBSCRIPTION_DISCOUNTS[subscriptionType]) {
    return 0;
  }
  
  const estimate = calculatePrice(factors);
  const discountRate = SUBSCRIPTION_DISCOUNTS[subscriptionType];
  
  return estimate.totalPrice * discountRate;
}

/**
 * Calcule une estimation pour les comptes business/entreprise
 */
export function calculateBusinessRateEstimate(
  factors: PricingFactors,
  subscriptionType: keyof typeof SUBSCRIPTION_DISCOUNTS,
  numberOfEmployees: number = 1,
  estimatedRidesPerMonth: number = 22 // jours ouvrables par mois
): BusinessRateEstimate {
  const singleRide = calculatePrice(factors);
  const discountRate = SUBSCRIPTION_DISCOUNTS[subscriptionType] || 0;
  
  const singleRideWithDiscount = singleRide.totalPrice * (1 - discountRate);
  const estimatedMonthlyRides = numberOfEmployees * estimatedRidesPerMonth;
  const totalMonthlyWithoutDiscount = singleRide.totalPrice * estimatedMonthlyRides;
  const totalMonthlyWithDiscount = singleRideWithDiscount * estimatedMonthlyRides;
  const totalDiscount = totalMonthlyWithoutDiscount - totalMonthlyWithDiscount;
  
  return {
    totalPrice: Math.round(totalMonthlyWithDiscount),
    costPerEmployee: Math.round(totalMonthlyWithDiscount / numberOfEmployees),
    monthlyCost: Math.round(totalMonthlyWithDiscount),
    discount: Math.round(totalDiscount),
    currency: DEFAULT_CURRENCY
  };
}
