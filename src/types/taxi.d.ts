
export type TaxiVehicleType = 'standard' | 'premium' | 'suv' | 'van' | 'motorcycle' | 'bicycle' | 'scooter' | 'car';

export type TaxiRideStatus = 
  | 'pending'
  | 'accepted'
  | 'driver_assigned'
  | 'driver_en_route'
  | 'driver_arrived'
  | 'ride_in_progress'
  | 'arrived_at_destination'
  | 'completed'
  | 'cancelled';

export type PaymentMethod = 'cash' | 'card' | 'mobile' | 'wallet';

export interface TaxiLocation {
  address: string;
  latitude: number;
  longitude: number;
  is_favorite?: boolean;
  last_used?: string;
  name?: string;
  type?: 'home' | 'work' | 'recent' | 'other';
}

export interface TaxiDriver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  vehicle_type: TaxiVehicleType;
  status: 'available' | 'busy' | 'offline';
  rating: number;
  current_latitude?: number;
  current_longitude?: number;
  is_available: boolean;
  verification_status: 'pending' | 'verified' | 'rejected';
  profile_picture?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  license_plate?: string;
  photo_url?: string;
  average_rating?: number;
  last_location_update?: string;
  total_earnings?: number;
  total_deliveries?: number;
  commission_rate?: number;
  created_at?: string;
}

export interface TaxiRide {
  id: string;
  user_id: string;
  driver_id?: string;
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  destination_address: string;
  destination_latitude: number;
  destination_longitude: number;
  pickup_time: string;
  pickup_time_type: 'now' | 'scheduled';
  distance_km: number;
  duration_min: number;
  status: TaxiRideStatus;
  estimated_price: number;
  actual_price: number;
  payment_status: 'pending' | 'paid' | 'failed';
  payment_method: PaymentMethod;
  rating?: number;
  rating_comment?: string;
  created_at: string;
  vehicle_type: TaxiVehicleType;
  special_instructions?: string;
  is_shared_ride?: boolean;
  max_passengers?: number;
  current_passengers?: number;
  estimated_arrival_time?: string;
  actual_arrival_time?: string;
  route_polyline?: string;
  promo_code_applied?: string;
  promo_discount?: number;
}

export interface TaxiRideRequest {
  id: string;
  user_id: string;
  driver_id?: string;
  status: 'pending' | 'accepted' | 'rejected';
  pickup_location: TaxiLocation;
  destination_location: TaxiLocation;
  estimated_price: number;
  vehicle_type: TaxiVehicleType;
  requested_at: string;
  pickup_time?: string;
  comments?: string;
}

export interface TaxiFare {
  base_fare: number;
  per_km_rate: number;
  per_minute_rate: number;
  minimum_fare: number;
  cancellation_fee: number;
  service_fee: number;
  discount?: number;
  total: number;
  currency: string;
  distance_fare?: number;
}

export interface TaxiSubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_percentage?: number;
  benefits: string[];
  max_rides?: number;
  validity_days: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  popular?: boolean;
  duration?: string;
  features?: string[];
}

export interface TaxiInvoice {
  id: string;
  user_id: string;
  ride_id: string;
  amount: number;
  issue_date: string;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  payment_method?: PaymentMethod;
  payment_date?: string;
  issued_at?: string;
  subtotal?: number;
}

export interface BusinessRateEstimate {
  monthly_discount: number;
  per_ride_price: number;
  standard_price: number;
  savings_amount: number;
  savings_percentage: number;
}

export interface PricingFactors {
  vehicle_type: TaxiVehicleType;
  distance_km?: number;
  duration_min?: number;
  is_premium?: boolean;
  time_of_day?: 'day' | 'night' | 'peak';
  subscription_discount?: number;
  promo_code?: string;
}

export interface TaxiPricingParams {
  distance_km: number;
  duration_min: number;
  vehicle_type: TaxiVehicleType;
  is_premium?: boolean;
  time_of_day?: 'day' | 'night' | 'peak';
  subscription_discount?: number;
  promo_code?: string;
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}
