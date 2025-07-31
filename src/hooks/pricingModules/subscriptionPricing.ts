
import { 
  BusinessRateEstimate, 
  SubscriptionDiscount 
} from './types';
import { formatCurrency } from '@/utils/formatters';

export const calculateSubscriptionDiscount = (
  originalPrice: number,
  subscriptionId: string | null
): number => {
  if (!subscriptionId) return originalPrice;
  
  // Mock subscription discounts based on subscription ID
  const discounts: Record<string, number> = {
    'basic': 0.1, // 10% discount
    'premium': 0.2, // 20% discount
    'business': 0.3, // 30% discount
  };
  
  const discountKey = Object.keys(discounts).find(key => 
    subscriptionId.includes(key)
  );
  
  if (!discountKey) return originalPrice;
  
  const discountRate = discounts[discountKey];
  return originalPrice * (1 - discountRate);
};

export const getSubscriptionDiscount = (
  subscriptionId: string | null
): SubscriptionDiscount | null => {
  if (!subscriptionId) return null;
  
  // Mock subscription data
  const subscriptions: Record<string, SubscriptionDiscount> = {
    'basic': {
      discountPercentage: 10,
      monthlyLimit: 10,
      remainingRides: 7,
      applicableVehicleTypes: ['standard']
    },
    'premium': {
      discountPercentage: 20,
      monthlyLimit: 30,
      remainingRides: 22,
      applicableVehicleTypes: ['standard', 'comfort', 'premium']
    },
    'business': {
      discountPercentage: 30,
      monthlyLimit: 100,
      remainingRides: 85,
      applicableVehicleTypes: ['standard', 'comfort', 'premium', 'van']
    }
  };
  
  const subscriptionKey = Object.keys(subscriptions).find(key => 
    subscriptionId.includes(key)
  );
  
  if (!subscriptionKey) return null;
  
  return subscriptions[subscriptionKey];
};

export const calculateBusinessRateEstimate = (
  monthlyRides: number,
  averageRideDistance: number,
  vehicleType: 'standard' | 'comfort' | 'premium' | 'van'
): BusinessRateEstimate => {
  // Prix moyens par kilomètre selon le type de véhicule
  const pricesPerKm: Record<string, number> = {
    'standard': 500,
    'comfort': 800,
    'premium': 1200,
    'van': 1500
  };
  
  // Taux de réduction basé sur le volume mensuel
  const getDiscountRate = (rides: number) => {
    if (rides >= 100) return 0.35; // 35% discount
    if (rides >= 50) return 0.25; // 25% discount
    if (rides >= 20) return 0.15; // 15% discount
    if (rides >= 10) return 0.10; // 10% discount
    return 0.05; // 5% discount
  };
  
  const pricePerKm = pricesPerKm[vehicleType] || pricesPerKm.standard;
  const baseMonthlyTotal = monthlyRides * pricePerKm * averageRideDistance;
  const discountRate = getDiscountRate(monthlyRides);
  const discountedTotal = baseMonthlyTotal * (1 - discountRate);
  const savings = baseMonthlyTotal - discountedTotal;
  
  return {
    monthlyTotal: Math.round(discountedTotal),
    perRideDiscount: Math.round(discountRate * 100),
    estimatedSavings: Math.round(savings),
    formattedTotal: formatCurrency(discountedTotal),
    formattedSavings: formatCurrency(savings),
    minimumRidesForDiscount: 10
  };
};
