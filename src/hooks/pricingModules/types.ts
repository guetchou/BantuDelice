
export interface PricingFactors {
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

export interface PriceEstimate {
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

export interface PricingRates {
  BASE_RATES: {
    standard: number;
    comfort: number;
    premium: number;
    van: number;
  };
  DISTANCE_RATES: {
    standard: number;
    comfort: number;
    premium: number;
    van: number;
  };
  TIME_RATES: {
    standard: number;
    comfort: number;
    premium: number;
    van: number;
  };
  SPECIAL_RATES: {
    airport_fee: number;
    extra_waiting_time: number;
    extra_baggage: number;
    premium_service: number;
    recurring_client_discount: number;
    round_trip_discount: number;
    express_lane_fee: number;
    long_distance_surcharge: number;
    child_seat_fee: number;
    pet_transport_fee: number;
    wheelchair_access_fee: number;
    vip_service_fee: number;
    destination_surcharge: {
      [key: string]: number;
    };
  };
}

export interface PromoCodeValidation {
  valid: boolean;
  discount: number;
}

export interface PriceRange {
  min: number;
  max: number;
  formattedRange: string;
}

export interface BusinessRateEstimate {
  monthlyEstimate: number;
  perRideDiscount: number;
  formattedTotal: string;
}
