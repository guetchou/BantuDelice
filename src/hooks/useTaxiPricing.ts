
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
  isRoundTrip?: boolean;
  hasLongDistanceSurcharge?: boolean;
  hasChildSeat?: boolean;
  hasPetTransport?: boolean;
  hasWheelchairAccess?: boolean;
  hasVipService?: boolean;
  useExpressLane?: boolean;
  destination?: string;
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
    roundTripDiscount?: number;
    expressLaneFee?: number;
    longDistanceFee?: number;
    childSeatFee?: number;
    petTransportFee?: number;
    wheelchairAccessFee?: number;
    vipServiceFee?: number;
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

  // Tarifs pour les services spéciaux
  const SPECIAL_RATES = {
    airport_fee: 1000,
    extra_waiting_time: 25, // par minute au-delà du temps d'attente standard
    extra_baggage: 500,
    premium_service: 1500,
    recurring_client_discount: 0.05, // 5% de réduction
    round_trip_discount: 0.10, // 10% de réduction
    express_lane_fee: 2000,
    long_distance_surcharge: 0.08, // 8% de supplément pour les longues distances (>25km)
    child_seat_fee: 800,
    pet_transport_fee: 1200,
    wheelchair_access_fee: 0, // Gratuit - service social
    vip_service_fee: 3500,
    destination_surcharge: {
      'Aéroport Maya-Maya': 1500,
      'Centre ville': 0,
      'Zone industrielle': 800,
      'Quartier de Bacongo': 500,
      'Quartier de Poto-Poto': 500
    }
  };

  // Calcule le prix en fonction des facteurs
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
      let childSeatFee = 0;
      let petTransportFee = 0;
      let wheelchairAccessFee = 0;
      let vipServiceFee = 0;
      let expressLaneFee = 0;
      let longDistanceFee = 0;
      let roundTripDiscount = 0;
      
      // Frais d'aéroport
      if (factors.isAirportRide) {
        airportFee = SPECIAL_RATES.airport_fee;
        additionalFees.push({ name: 'Frais d\'aéroport', amount: airportFee });
      }
      
      // Frais de temps d'attente supplémentaire
      if (factors.extraWaitingTime && factors.extraWaitingTime > 0) {
        waitingTimeFee = SPECIAL_RATES.extra_waiting_time * factors.extraWaitingTime;
        additionalFees.push({ name: 'Temps d\'attente supplémentaire', amount: waitingTimeFee });
      }
      
      // Frais de bagages supplémentaires
      if (factors.hasExtraBaggage) {
        extraBaggageFee = SPECIAL_RATES.extra_baggage;
        additionalFees.push({ name: 'Bagages supplémentaires', amount: extraBaggageFee });
      }
      
      // Frais de siège enfant
      if (factors.hasChildSeat) {
        childSeatFee = SPECIAL_RATES.child_seat_fee;
        additionalFees.push({ name: 'Siège enfant', amount: childSeatFee });
      }
      
      // Frais de transport d'animaux
      if (factors.hasPetTransport) {
        petTransportFee = SPECIAL_RATES.pet_transport_fee;
        additionalFees.push({ name: 'Transport d\'animaux', amount: petTransportFee });
      }
      
      // Frais d'accès pour fauteuil roulant
      if (factors.hasWheelchairAccess) {
        wheelchairAccessFee = SPECIAL_RATES.wheelchair_access_fee;
        if (wheelchairAccessFee > 0) {
          additionalFees.push({ name: 'Accès fauteuil roulant', amount: wheelchairAccessFee });
        }
      }
      
      // Frais de service VIP
      if (factors.hasVipService) {
        vipServiceFee = SPECIAL_RATES.vip_service_fee;
        additionalFees.push({ name: 'Service VIP', amount: vipServiceFee });
      }
      
      // Frais de voie express
      if (factors.useExpressLane) {
        expressLaneFee = SPECIAL_RATES.express_lane_fee;
        additionalFees.push({ name: 'Voie express', amount: expressLaneFee });
      }
      
      // Supplément pour longue distance
      if (factors.hasLongDistanceSurcharge && factors.distance > 25) {
        longDistanceFee = (basePrice + distancePrice) * SPECIAL_RATES.long_distance_surcharge;
        additionalFees.push({ name: 'Supplément longue distance', amount: longDistanceFee });
      }
      
      // Supplément destination spécifique
      let destinationSurcharge = 0;
      if (factors.destination && SPECIAL_RATES.destination_surcharge[factors.destination as keyof typeof SPECIAL_RATES.destination_surcharge]) {
        destinationSurcharge = SPECIAL_RATES.destination_surcharge[factors.destination as keyof typeof SPECIAL_RATES.destination_surcharge];
        if (destinationSurcharge > 0) {
          additionalFees.push({ name: `Supplément destination: ${factors.destination}`, amount: destinationSurcharge });
        }
      }
      
      // Sous-total avant remise
      const subtotal = (basePrice + distancePrice + durationPrice) * timeFactor + 
                      airportFee + waitingTimeFee + extraBaggageFee + childSeatFee + 
                      petTransportFee + wheelchairAccessFee + vipServiceFee + expressLaneFee + 
                      longDistanceFee + destinationSurcharge;
      
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
      
      // Remise pour les trajets aller-retour
      if (factors.isRoundTrip) {
        const roundTripDiscountAmount = subtotal * SPECIAL_RATES.round_trip_discount;
        totalDiscount += roundTripDiscountAmount;
        roundTripDiscount = roundTripDiscountAmount;
        additionalFees.push({ name: 'Remise aller-retour', amount: -roundTripDiscountAmount });
      }
      
      // Total final
      const total = subtotal - totalDiscount;
      
      // Estimation du temps d'arrivée (en minutes)
      // Temps de base + ajustement pour le trafic et la distance
      let estimatedArrival = Math.max(5, Math.ceil(factors.distance * 2));
      
      if (factors.isRushHour) {
        estimatedArrival = Math.ceil(estimatedArrival * 1.3); // 30% plus long pendant les heures de pointe
      }
      
      if (factors.distance > 15) {
        estimatedArrival += 5; // +5 minutes pour les longues distances
      }
      
      if (factors.timeOfDay === 'night') {
        estimatedArrival = Math.ceil(estimatedArrival * 0.85); // 15% plus rapide la nuit
      }
      
      if (factors.useExpressLane) {
        estimatedArrival = Math.ceil(estimatedArrival * 0.8); // 20% plus rapide en voie express
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
        extraBaggageFee: extraBaggageFee > 0 ? extraBaggageFee : undefined,
        roundTripDiscount: roundTripDiscount > 0 ? roundTripDiscount : undefined,
        expressLaneFee: expressLaneFee > 0 ? expressLaneFee : undefined,
        longDistanceFee: longDistanceFee > 0 ? longDistanceFee : undefined,
        childSeatFee: childSeatFee > 0 ? childSeatFee : undefined,
        petTransportFee: petTransportFee > 0 ? petTransportFee : undefined,
        wheelchairAccessFee: wheelchairAccessFee > 0 ? wheelchairAccessFee : undefined,
        vipServiceFee: vipServiceFee > 0 ? vipServiceFee : undefined
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

  // Calcule le temps estimé en minutes basé sur la distance et les conditions
  const estimateTime = (distance: number, isRushHour = false, timeOfDay: 'day' | 'night' = 'day', useExpressLane = false): number => {
    // Vitesse moyenne en ville: ~30 km/h (0.5 km/min)
    let baseTime = Math.ceil(distance / 0.5);
    
    // Ajustements pour les conditions
    if (isRushHour) {
      baseTime = Math.ceil(baseTime * 1.4); // 40% plus lent pendant les heures de pointe
    }
    
    if (timeOfDay === 'night') {
      baseTime = Math.ceil(baseTime * 0.8); // 20% plus rapide la nuit (moins de trafic)
    }
    
    if (useExpressLane) {
      baseTime = Math.ceil(baseTime * 0.75); // 25% plus rapide en utilisant les voies express
    }
    
    if (distance > 20) {
      // Pour les longues distances, la vitesse moyenne augmente
      baseTime = Math.ceil(baseTime * 0.9); // 10% plus rapide sur les longues distances
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
      hasExtraBaggage?: boolean;
      isRecurringClient?: boolean;
      isRoundTrip?: boolean;
      useExpressLane?: boolean;
      destination?: string;
      numberOfPassengers?: number;
    } = {}
  ): PriceEstimate => {
    const duration = estimateTime(
      distance, 
      options.isRushHour || false, 
      options.timeOfDay || 'day',
      options.useExpressLane || false
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
      hasExtraBaggage: options.hasExtraBaggage || false,
      isRecurringClient: options.isRecurringClient || false,
      isRoundTrip: options.isRoundTrip || false,
      useExpressLane: options.useExpressLane || false,
      destination: options.destination,
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
          'FAMILY': 12,
          'SPECIAL': 30,
          'BUSINESS': 18,
          'EXPRESS': 10,
          'NIGHT': 15,
          'TOURISTIQUE': 20
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
    vehicleType: 'standard' | 'comfort' | 'premium' | 'van',
    options: {
      isRushHour?: boolean;
      timeOfDay?: 'day' | 'night';
      isWeekend?: boolean;
    } = {}
  ): { min: number; max: number; formattedRange: string } => {
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
  };

  // Calculer le prix pour des réservations récurrentes (abonnements)
  const calculateSubscriptionDiscount = (
    singleRidePrice: number,
    frequency: 'daily' | 'weekly' | 'monthly',
    numberOfRides: number
  ): number => {
    let discountPercentage = 0;
    
    // Plus la fréquence et le nombre de trajets sont élevés, plus la réduction est importante
    switch (frequency) {
      case 'daily':
        discountPercentage = 0.25; // 25% de réduction
        break;
      case 'weekly':
        discountPercentage = 0.15; // 15% de réduction
        break;
      case 'monthly':
        discountPercentage = 0.10; // 10% de réduction
        break;
    }
    
    // Bonus pour un grand nombre de trajets
    if (numberOfRides > 20) {
      discountPercentage += 0.05; // +5%
    } else if (numberOfRides > 10) {
      discountPercentage += 0.03; // +3%
    }
    
    // Plafond à 35% de réduction
    discountPercentage = Math.min(discountPercentage, 0.35);
    
    return Math.round(singleRidePrice * numberOfRides * (1 - discountPercentage));
  };

  // Facturation pour les entreprises
  const calculateBusinessRateEstimate = (
    distance: number,
    vehicleType: 'standard' | 'comfort' | 'premium' | 'van',
    numberOfEmployees: number,
    estimatedMonthlyRides: number
  ): {
    monthlyEstimate: number;
    perRideDiscount: number;
    formattedTotal: string;
  } => {
    const baseRideEstimate = getDetailedEstimate(distance, vehicleType).total;
    
    // Calculer la réduction en fonction du volume
    let volumeDiscount = 0.05; // 5% de base
    
    if (estimatedMonthlyRides > 100) {
      volumeDiscount = 0.20; // 20% pour plus de 100 trajets par mois
    } else if (estimatedMonthlyRides > 50) {
      volumeDiscount = 0.15; // 15% pour plus de 50 trajets par mois
    } else if (estimatedMonthlyRides > 20) {
      volumeDiscount = 0.10; // 10% pour plus de 20 trajets par mois
    }
    
    // Bonus pour les entreprises avec beaucoup d'employés
    if (numberOfEmployees > 100) {
      volumeDiscount += 0.05; // +5%
    }
    
    // Calculer le prix total mensuel estimé
    const discountedRidePrice = baseRideEstimate * (1 - volumeDiscount);
    const monthlyTotal = Math.round(discountedRidePrice * estimatedMonthlyRides);
    
    return {
      monthlyEstimate: monthlyTotal,
      perRideDiscount: volumeDiscount * 100, // Convertir en pourcentage
      formattedTotal: `${monthlyTotal.toLocaleString()} FCFA / mois`
    };
  };

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
