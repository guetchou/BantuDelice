
export type TaxiVehicleType = 'standard' | 'premium' | 'comfort' | 'van' | 'electric';
export type TaxiRideStatus = 'pending' | 'accepted' | 'driver_assigned' | 'driver_en_route' | 'driver_arrived' | 'ride_in_progress' | 'arrived_at_destination' | 'completed' | 'cancelled' | 'rejected';
export type PaymentMethod = 'cash' | 'card' | 'wallet' | 'mobile_money' | 'business_account';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface TaxiDriver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email?: string;
  license_number?: string;
  vehicle_type: TaxiVehicleType;
  vehicle_info?: {
    make: string;
    model: string;
    year: number;
    color: string;
    license_plate: string;
  };
  status: 'offline' | 'available' | 'busy' | 'in_shared_ride';
  rating: number;
  total_rides: number;
  is_available?: boolean;
  photo_url?: string;
  profile_image?: string;
  current_latitude?: number;
  current_longitude?: number;
  current_location?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
  languages?: string[];
  years_experience?: number;
  verified?: boolean;
  location?: [number, number];
  license_plate?: string;
  vehicle_model?: string;
  profile_picture?: string;
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
  current_passengers?: number;
  estimated_arrival_time?: string;
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
  subscription_discount?: number;
  promo_code?: string;
  is_premium?: boolean;
}

export interface TaxiFare {
  base_fare: number;
  distance_fare: number;
  time_fare: number;
  service_fee: number;
  surge_multiplier?: number;
  total?: number;
  peak_hours_multiplier?: number;
  subscription_discount?: number;
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
  vehicle_type?: TaxiVehicleType;
  distance_km?: number;
  duration_min?: number;
  time_of_day?: string;
  subscription_discount?: number;
  promo_code?: string;
  is_premium?: boolean;
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface TaxiLocation {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp?: number;
}

export interface RideShareRequest {
  id: string;
  ride_id: string;
  requester_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  created_at: string;
}

export interface TaxiSubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billing_cycle: 'monthly' | 'quarterly' | 'annual';
  features: string[];
  discount_percentage: number;
  max_rides_per_month: number | null;
  priority_booking: boolean;
  cancellation_fee_waiver: boolean;
  status: 'active' | 'inactive';
}

export interface TaxiInvoice {
  id: string;
  ride_id: string;
  user_id: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  issue_date: string;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  payment_method?: PaymentMethod;
  payment_date?: string;
  invoice_number: string;
}

export type RideStatus = 
  | 'pending' 
  | 'driver_assigned' 
  | 'driver_en_route' 
  | 'driver_arrived' 
  | 'ride_in_progress' 
  | 'arrived_at_destination' 
  | 'completed' 
  | 'cancelled' 
  | 'rejected';
