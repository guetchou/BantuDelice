
export interface PricingFactors {
  distance: number; // en kilomètres
  duration: number; // en minutes
  vehicleType: 'standard' | 'comfort' | 'premium' | 'van';
  time: Date | string; // heure de la journée
  isSharedRide?: boolean;
  numberOfPassengers?: number;
  promoCode?: string;
  hasSubscription?: boolean;
  subscriptionType?: string;
  loyaltyLevel?: number;
  cityZone?: string;
  trafficMultiplier?: number;
  demandMultiplier?: number;
  basePrice?: number;
}

export interface PriceEstimate {
  basePrice: number;
  distancePrice: number;
  durationPrice: number;
  surcharges: {
    timeOfDay?: number;
    vehicleType?: number;
    demand?: number;
    traffic?: number;
  };
  discounts: {
    promo?: number;
    loyalty?: number;
    subscription?: number;
    shared?: number;
  };
  totalPrice: number;
  currency: string;
  breakdown: string[];
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface BusinessRateEstimate {
  totalPrice: number;
  costPerEmployee: number;
  monthlyCost: number;
  discount: number;
  currency: string;
}

export interface PromoCodeValidation {
  valid: boolean;
  discount: number;
  message?: string;
  expiresAt?: string;
}

export type TimeOfDayMultiplier = 'standard' | 'offPeak' | 'peak' | 'night';
