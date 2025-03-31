
export type TaxiVehicleType = 'standard' | 'premium' | 'comfort' | 'van';
export type TaxiRideStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

export interface TaxiDriver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email?: string;
  license_number: string;
  vehicle_type: TaxiVehicleType;
  vehicle_info: {
    make: string;
    model: string;
    year: number;
    color: string;
    license_plate: string;
  };
  status: 'offline' | 'available' | 'busy';
  rating: number;
  total_rides: number;
  is_available?: boolean;
  photo_url?: string;
  current_latitude?: number;
  current_longitude?: number;
  current_location?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
  languages?: string[];
}

export interface TaxiRide {
  id: string;
  user_id: string;
  driver_id: string | null;
  status: TaxiRideStatus;
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  destination_address: string;
  destination_latitude: number;
  destination_longitude: number;
  pickup_time_type: 'now' | 'scheduled';
  pickup_time: string;
  scheduled_time?: string;
  distance_km: number;
  duration_min: number;
  estimated_price: number;
  actual_price?: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
  vehicle_type: TaxiVehicleType;
  special_instructions?: string;
  is_shared_ride?: boolean;
  max_passengers?: number;
  route_polyline?: string;
}

export interface TaxiRideRequest {
  id: string;
  ride_id: string;
  driver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  requested_at: string;
  created_at: string;
  response_at?: string;
}

export interface TaxiPricingParams {
  distance_km: number;
  duration_min: number;
  vehicle_type: TaxiVehicleType;
  time_of_day: string;
}

export interface TaxiFare {
  base_fare: number;
  distance_fare: number;
  time_fare: number;
  service_fee: number;
  surge_multiplier?: number;
  total?: number;
  peak_hours_multiplier?: number;
}

export interface TaxiPriceEstimate {
  min: number;
  max: number;
  currency: string;
}

export interface BusinessRateEstimate {
  standardRate: number;
  businessRate: number;
  potentialSavings: number;
  discountPercentage: number;
  currency: string;
}

export interface PricingFactors {
  baseFare: number;
  perKmRate: number;
  perMinRate: number;
  serviceFee: number;
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}
