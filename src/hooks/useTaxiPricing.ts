
import { useState } from 'react';

interface PricingFactors {
  distance: number; // en km
  duration: number; // en minutes
  vehicleType: 'standard' | 'comfort' | 'premium' | 'van';
  timeOfDay: 'day' | 'night';
  isRushHour: boolean;
  isWeekend: boolean;
  isPromoCodeApplied: boolean;
  promoDiscount: number;
}

interface PriceEstimate {
  basePrice: number;
  distancePrice: number;
  durationPrice: number;
  vehicleFactor: number;
  timeFactor: number;
  subtotal: number;
  discount: number;
  total: number;
  formattedTotal: string;
  estimatedArrival: number; // minutes
}

export function useTaxiPricing() {
  const [isCalculating, setIsCalculating] = useState(false);

  // Tarifs de base (en FCFA)
  const BASE_RATES = {
    standard: 500,
    comfort: 800,
    premium: 1200,
    van: 1500
  };

  const DISTANCE_RATES = {
    standard: 100, // par km
    comfort: 150,
    premium: 200,
    van: 250
  };

  const TIME_RATES = {
    standard: 50, // par minute
    comfort: 75,
    premium: 100,
    van: 125
  };

  const calculatePrice = (factors: PricingFactors): PriceEstimate => {
    setIsCalculating(true);
    
    try {
      // Prix de base selon le type de véhicule
      const basePrice = BASE_RATES[factors.vehicleType];
      
      // Prix basé sur la distance
      const distancePrice = DISTANCE_RATES[factors.vehicleType] * factors.distance;
      
      // Prix basé sur la durée estimée
      const durationPrice = TIME_RATES[factors.vehicleType] * factors.duration;
      
      // Facteur pour le type de véhicule
      const vehicleFactor = 1.0;
      
      // Facteur pour l'heure de la journée et la demande
      let timeFactor = 1.0;
      if (factors.timeOfDay === 'night') timeFactor *= 1.25;
      if (factors.isRushHour) timeFactor *= 1.15;
      if (factors.isWeekend) timeFactor *= 1.1;
      
      // Sous-total avant remise
      const subtotal = (basePrice + distancePrice + durationPrice) * timeFactor;
      
      // Remise si un code promo est appliqué
      const discount = factors.isPromoCodeApplied ? subtotal * (factors.promoDiscount / 100) : 0;
      
      // Total final
      const total = subtotal - discount;
      
      // Estimation du temps d'arrivée (en minutes)
      const estimatedArrival = Math.max(5, Math.ceil(factors.distance * 2.5));
      
      return {
        basePrice,
        distancePrice,
        durationPrice,
        vehicleFactor,
        timeFactor,
        subtotal,
        discount,
        total,
        formattedTotal: `${Math.ceil(total)} FCFA`,
        estimatedArrival
      };
    } finally {
      setIsCalculating(false);
    }
  };

  // Calcul du temps estimé en minutes basé sur la distance
  const estimateTime = (distance: number): number => {
    // Vitesse moyenne en ville: ~30 km/h (0.5 km/min)
    return Math.ceil(distance / 0.5);
  };

  // Estimation rapide pour l'affichage immédiat
  const getQuickEstimate = (distance: number, vehicleType: 'standard' | 'comfort' | 'premium' | 'van'): string => {
    const basePrice = BASE_RATES[vehicleType];
    const distancePrice = DISTANCE_RATES[vehicleType] * distance;
    const total = basePrice + distancePrice;
    
    return `${Math.ceil(total)} FCFA`;
  };

  // Vérifie si un code promo est valide
  const validatePromoCode = async (code: string): Promise<{valid: boolean, discount: number}> => {
    // Simuler un appel API pour vérifier le code promo
    return new Promise((resolve) => {
      setTimeout(() => {
        // Dans un vrai environnement, nous vérifierions avec Supabase
        const validCodes = {
          'BIENVENUE': 15,
          'WEEKEND': 10,
          'FIDELE': 20
        };
        
        const discount = validCodes[code as keyof typeof validCodes] || 0;
        resolve({
          valid: discount > 0,
          discount
        });
      }, 500);
    });
  };

  return {
    calculatePrice,
    estimateTime,
    getQuickEstimate,
    validatePromoCode,
    isCalculating
  };
}
