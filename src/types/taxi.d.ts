
export interface TaxiRide {
  id: string;
  user_id: string;
  pickup_address: string;
  destination_address: string;
  pickup_time: string;
  status: TaxiRideStatus;
  driver_id?: string | null;
  estimated_price?: number;
  actual_price?: number;
  payment_status: 'pending' | 'paid' | 'failed';
  vehicle_type?: VehicleType;
  payment_method?: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  destination_latitude?: number;
  destination_longitude?: number;
  rating?: number;
  rating_comment?: string;
  distance_km: number;
  duration_min: number;
  created_at: string;
  updated_at: string;
  is_shared_ride?: boolean;
  max_passengers?: number;
  current_passengers?: number;
  pickup_time_type?: 'now' | 'scheduled';
  route_polyline?: string;
  actual_arrival_time?: string;
  estimated_arrival_time?: string;
}

export type TaxiRideStatus = 
  | 'pending'
  | 'accepted'
  | 'driver_assigned'
  | 'driver_en_route'
  | 'driver_arrived'
  | 'ride_in_progress'
  | 'arrived_at_destination'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export type VehicleType = 'standard' | 'premium' | 'comfort' | 'van' | 'electric';
export type PaymentMethod = 'cash' | 'card' | 'wallet' | 'mobile_money';

export interface TaxiDriver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  vehicle_type: VehicleType;
  status: string;
  current_latitude: number;
  current_longitude: number;
  is_available: boolean;
  rating?: number;
  vehicle_model?: string;
  license_plate?: string;
  photo_url?: string;
  profile_image?: string;
  profile_picture?: string;
  verified?: boolean;
  vehicle_info?: {
    model: string;
    plate: string;
    color: string;
    make?: string;
  };
  years_experience?: number;
  total_rides?: number;
  languages?: string[];
  location?: {
    latitude: number;
    longitude: number;
  };
  current_location?: {
    latitude: number;
    longitude: number;
  };
  last_active?: string;
}

export interface TaxiRideRequest {
  id: string;
  ride_id: string;
  driver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  requested_at: string;
  created_at: string;
  response_time?: string;
}

export interface TaxiLocation {
  latitude: number;
  longitude: number;
  address: string;
  name?: string;
  type?: 'home' | 'work' | 'favorite' | 'recent';
  added_at?: string;
}

export interface TaxiPricingParams {
  distance_km: number;
  duration_min: number;
  vehicle_type: VehicleType;
  time_of_day: string;
  is_premium?: boolean;
  subscription_discount?: number;
  promo_code?: string;
}

export interface TaxiFare {
  base_rate: number;
  distance_rate: number;
  time_rate: number;
  total: number;
  currency: string;
  breakdown?: {
    base: number;
    distance: number;
    time: number;
    premium?: number;
    discount?: number;
  };
  distance_fare?: number;
  peak_hours_multiplier?: number;
  promo_discount?: number;
}

export interface TaxiSubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  price_per_ride: number;
  benefits: string[];
  popular?: boolean;
  max_rides?: number;
  discount_percentage: number;
  duration: string;
}

export interface TaxiInvoice {
  id: string;
  user_id: string;
  ride_id: string;
  amount: number;
  payment_method: PaymentMethod;
  status: 'pending' | 'paid' | 'overdue';
  issue_date: string;
  due_date: string;
  paid_date?: string;
  invoice_number: string;
  issued_at?: string;
  total?: number;
  subtotal?: number;
  tax?: number;
  discount?: number;
}

export interface RideShareRequest {
  id: string;
  ride_id: string;
  user_id: string;
  requester_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  requested_at?: string;
  response_at?: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  pickup_address?: string;
  destination_latitude?: number;
  destination_longitude?: number;
  destination_address?: string;
}

export interface BusinessRateEstimate {
  base_price: number;
  monthly_discount: number;
  annual_savings: number;
  price_per_km: number;
  special_benefits: string[];
}

export interface PricingFactors {
  distance: number;
  vehicle_type?: VehicleType;
  time_of_day?: string;
  is_premium?: boolean;
  subscription_discount?: number;
  promo_code?: string;
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}
