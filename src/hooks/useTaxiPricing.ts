
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
  numberOfPassengers?: number;
  isAirportRide?: boolean;
  extraWaitingTime?: number; // en minutes
  hasExtraBaggage?: boolean;
  isRecurringClient?: boolean;
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
  priceBreakdown?: {
    baseFee: number;
    distanceFee: number;
    timeFee: number;
    rushHourFee?: number;
    nightFee?: number;
    weekendFee?: number;
    airportFee?: number;
    waitingTimeFee?: number;
    extraBaggageFee?: number;
    specialServicesFee?: number;
  };
  additionalFees?: {
    name: string;
    amount: number;
  }[];
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

  // Nouveaux tarifs pour les services spéciaux
  const SPECIAL_RATES = {
    airport_fee: 1000,
    extra_waiting_time: 25, // par minute au-delà du temps d'attente standard
    extra_baggage: 500,
    premium_service: 1500,
    recurring_client_discount: 0.05, // 5% de réduction
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
      let nightFee = 0;
      let rushHourFee = 0;
      let weekendFee = 0;
      
      if (factors.timeOfDay === 'night') {
        timeFactor *= 1.25;
        nightFee = (basePrice + distancePrice) * 0.25;
      }
      
      if (factors.isRushHour) {
        timeFactor *= 1.15;
        rushHourFee = (basePrice + distancePrice) * 0.15;
      }
      
      if (factors.isWeekend) {
        timeFactor *= 1.1;
        weekendFee = (basePrice + distancePrice) * 0.1;
      }
      
      // Frais supplémentaires
      let additionalFees: { name: string; amount: number }[] = [];
      let airportFee = 0;
      let waitingTimeFee = 0;
      let extraBaggageFee = 0;
      
      if (factors.isAirportRide) {
        airportFee = SPECIAL_RATES.airport_fee;
        additionalFees.push({ name: 'Frais d\'aéroport', amount: airportFee });
      }
      
      if (factors.extraWaitingTime && factors.extraWaitingTime > 0) {
        waitingTimeFee = SPECIAL_RATES.extra_waiting_time * factors.extraWaitingTime;
        additionalFees.push({ name: 'Temps d\'attente supplémentaire', amount: waitingTimeFee });
      }
      
      if (factors.hasExtraBaggage) {
        extraBaggageFee = SPECIAL_RATES.extra_baggage;
        additionalFees.push({ name: 'Bagages supplémentaires', amount: extraBaggageFee });
      }
      
      // Sous-total avant remise
      const subtotal = (basePrice + distancePrice + durationPrice) * timeFactor + 
                      airportFee + waitingTimeFee + extraBaggageFee;
      
      // Remises
      let totalDiscount = 0;
      
      // Remise si un code promo est appliqué
      if (factors.isPromoCodeApplied) {
        const promoDiscount = subtotal * (factors.promoDiscount / 100);
        totalDiscount += promoDiscount;
        additionalFees.push({ name: 'Remise code promo', amount: -promoDiscount });
      }
      
      // Remise pour les clients récurrents
      if (factors.isRecurringClient) {
        const loyaltyDiscount = subtotal * SPECIAL_RATES.recurring_client_discount;
        totalDiscount += loyaltyDiscount;
        additionalFees.push({ name: 'Remise client fidèle', amount: -loyaltyDiscount });
      }
      
      // Total final
      const total = subtotal - totalDiscount;
      
      // Estimation du temps d'arrivée (en minutes)
      // Temps de base + ajustement pour le trafic
      let estimatedArrival = Math.max(5, Math.ceil(factors.distance * 2.5));
      
      if (factors.isRushHour) {
        estimatedArrival = Math.ceil(estimatedArrival * 1.3); // 30% plus long pendant les heures de pointe
      }
      
      // Détails de la décomposition des prix
      const priceBreakdown = {
        baseFee: basePrice,
        distanceFee: distancePrice,
        timeFee: durationPrice,
        rushHourFee: rushHourFee > 0 ? rushHourFee : undefined,
        nightFee: nightFee > 0 ? nightFee : undefined,
        weekendFee: weekendFee > 0 ? weekendFee : undefined,
        airportFee: airportFee > 0 ? airportFee : undefined,
        waitingTimeFee: waitingTimeFee > 0 ? waitingTimeFee : undefined,
        extraBaggageFee: extraBaggageFee > 0 ? extraBaggageFee : undefined
      };
      
      return {
        basePrice,
        distancePrice,
        durationPrice,
        vehicleFactor,
        timeFactor,
        subtotal,
        discount: totalDiscount,
        total,
        formattedTotal: `${Math.ceil(total)} FCFA`,
        estimatedArrival,
        priceBreakdown,
        additionalFees: additionalFees.length > 0 ? additionalFees : undefined
      };
    } finally {
      setIsCalculating(false);
    }
  };

  // Calcul du temps estimé en minutes basé sur la distance et les conditions
  const estimateTime = (distance: number, isRushHour = false, timeOfDay: 'day' | 'night' = 'day'): number => {
    // Vitesse moyenne en ville: ~30 km/h (0.5 km/min)
    let baseTime = Math.ceil(distance / 0.5);
    
    // Ajustements pour les conditions
    if (isRushHour) {
      baseTime = Math.ceil(baseTime * 1.4); // 40% plus lent pendant les heures de pointe
    }
    
    if (timeOfDay === 'night') {
      baseTime = Math.ceil(baseTime * 0.8); // 20% plus rapide la nuit (moins de trafic)
    }
    
    return baseTime;
  };

  // Estimation rapide pour l'affichage immédiat
  const getQuickEstimate = (distance: number, vehicleType: 'standard' | 'comfort' | 'premium' | 'van'): string => {
    const basePrice = BASE_RATES[vehicleType];
    const distancePrice = DISTANCE_RATES[vehicleType] * distance;
    const total = basePrice + distancePrice;
    
    return `${Math.ceil(total)} FCFA`;
  };
  
  // Estimation avancée qui tient compte de plus de facteurs
  const getDetailedEstimate = (
    distance: number, 
    vehicleType: 'standard' | 'comfort' | 'premium' | 'van',
    options: {
      isRushHour?: boolean;
      timeOfDay?: 'day' | 'night';
      isWeekend?: boolean;
      isAirportRide?: boolean;
      numberOfPassengers?: number;
    } = {}
  ): PriceEstimate => {
    const duration = estimateTime(
      distance, 
      options.isRushHour || false, 
      options.timeOfDay || 'day'
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
      numberOfPassengers: options.numberOfPassengers
    });
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
          'FIDELE': 20,
          'AIRPORT': 25,
          'PREMIUM': 15,
          'FAMILY': 12
        };
        
        const discount = validCodes[code as keyof typeof validCodes] || 0;
        resolve({
          valid: discount > 0,
          discount
        });
      }, 500);
    });
  };
  
  // Calcul d'une estimation de fourchette de prix
  const getPriceRange = (
    distance: number, 
    vehicleType: 'standard' | 'comfort' | 'premium' | 'van'
  ): { min: number; max: number; formattedRange: string } => {
    const baseEstimate = getDetailedEstimate(distance, vehicleType);
    
    // Fourchette basse: -10% du prix estimé
    const minPrice = Math.ceil(baseEstimate.total * 0.9);
    
    // Fourchette haute: +15% du prix estimé (pour tenir compte des variations possibles)
    const maxPrice = Math.ceil(baseEstimate.total * 1.15);
    
    return {
      min: minPrice,
      max: maxPrice,
      formattedRange: `${minPrice} - ${maxPrice} FCFA`
    };
  };

  return {
    calculatePrice,
    estimateTime,
    getQuickEstimate,
    getDetailedEstimate,
    validatePromoCode,
    getPriceRange,
    isCalculating
  };
}
