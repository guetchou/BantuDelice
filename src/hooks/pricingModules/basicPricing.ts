
import { PricingFactors, PriceEstimate } from './types';
import { PRICING_RATES } from './constants';

export function calculatePrice(factors: PricingFactors): PriceEstimate {
  // Prix de base selon le type de véhicule
  const basePrice = PRICING_RATES.BASE_RATES[factors.vehicleType];
  
  // Prix basé sur la distance
  const distancePrice = PRICING_RATES.DISTANCE_RATES[factors.vehicleType] * factors.distance;
  
  // Prix basé sur la durée estimée
  const durationPrice = PRICING_RATES.TIME_RATES[factors.vehicleType] * factors.duration;
  
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
    airportFee = PRICING_RATES.SPECIAL_RATES.airport_fee;
    additionalFees.push({ name: 'Frais d\'aéroport', amount: airportFee });
  }
  
  // Frais de temps d'attente supplémentaire
  if (factors.extraWaitingTime && factors.extraWaitingTime > 0) {
    waitingTimeFee = PRICING_RATES.SPECIAL_RATES.extra_waiting_time * factors.extraWaitingTime;
    additionalFees.push({ name: 'Temps d\'attente supplémentaire', amount: waitingTimeFee });
  }
  
  // Frais de bagages supplémentaires
  if (factors.hasExtraBaggage) {
    extraBaggageFee = PRICING_RATES.SPECIAL_RATES.extra_baggage;
    additionalFees.push({ name: 'Bagages supplémentaires', amount: extraBaggageFee });
  }
  
  // Frais de siège enfant
  if (factors.hasChildSeat) {
    childSeatFee = PRICING_RATES.SPECIAL_RATES.child_seat_fee;
    additionalFees.push({ name: 'Siège enfant', amount: childSeatFee });
  }
  
  // Frais de transport d'animaux
  if (factors.hasPetTransport) {
    petTransportFee = PRICING_RATES.SPECIAL_RATES.pet_transport_fee;
    additionalFees.push({ name: 'Transport d\'animaux', amount: petTransportFee });
  }
  
  // Frais d'accès pour fauteuil roulant
  if (factors.hasWheelchairAccess) {
    wheelchairAccessFee = PRICING_RATES.SPECIAL_RATES.wheelchair_access_fee;
    if (wheelchairAccessFee > 0) {
      additionalFees.push({ name: 'Accès fauteuil roulant', amount: wheelchairAccessFee });
    }
  }
  
  // Frais de service VIP
  if (factors.hasVipService) {
    vipServiceFee = PRICING_RATES.SPECIAL_RATES.vip_service_fee;
    additionalFees.push({ name: 'Service VIP', amount: vipServiceFee });
  }
  
  // Frais de voie express
  if (factors.useExpressLane) {
    expressLaneFee = PRICING_RATES.SPECIAL_RATES.express_lane_fee;
    additionalFees.push({ name: 'Voie express', amount: expressLaneFee });
  }
  
  // Supplément pour longue distance
  if (factors.hasLongDistanceSurcharge && factors.distance > 25) {
    longDistanceFee = (basePrice + distancePrice) * PRICING_RATES.SPECIAL_RATES.long_distance_surcharge;
    additionalFees.push({ name: 'Supplément longue distance', amount: longDistanceFee });
  }
  
  // Supplément destination spécifique
  let destinationSurcharge = 0;
  if (factors.destination && PRICING_RATES.SPECIAL_RATES.destination_surcharge[factors.destination]) {
    destinationSurcharge = PRICING_RATES.SPECIAL_RATES.destination_surcharge[factors.destination];
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
    const loyaltyDiscount = subtotal * PRICING_RATES.SPECIAL_RATES.recurring_client_discount;
    totalDiscount += loyaltyDiscount;
    additionalFees.push({ name: 'Remise client fidèle', amount: -loyaltyDiscount });
  }
  
  // Remise pour les trajets aller-retour
  if (factors.isRoundTrip) {
    const roundTripDiscountAmount = subtotal * PRICING_RATES.SPECIAL_RATES.round_trip_discount;
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
}
