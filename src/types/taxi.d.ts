export type VehicleType = 'standard' | 'comfort' | 'premium' | 'van';
export type TaxiRideStatus = 'pending' | 'accepted' | 'driver_assigned' | 'driver_en_route' | 'driver_arrived' | 'ride_in_progress' | 'arrived_at_destination' | 'completed' | 'cancelled' | 'rejected';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'completed';
export type PaymentMethod = 'cash' | 'card' | 'wallet' | 'mobile_money';

export interface TaxiRide {
  id: string;
  user_id: string;
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  destination_address: string;
  destination_latitude: number;
  destination_longitude: number;
  pickup_time: string;
  status: TaxiRideStatus;
  driver_id: string | null;
  estimated_price: number;
  actual_price: number | null;
  payment_status: PaymentStatus;
  vehicle_type: VehicleType;
  payment_method: string;
  created_at: string;
  updated_at: string;
  pickup_time_type?: 'now' | 'scheduled';
  distance_km: number;
  duration_min: number;
  rating?: number;
  rating_comment?: string;
  special_instructions?: string;
  promo_code_applied?: string;
  is_shared_ride?: boolean;
  max_passengers?: number;
  current_passengers?: number;
  route_polyline?: string;
  estimated_arrival_time?: string;
  actual_arrival_time?: string;
}

export interface TaxiDriver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  vehicle_type: VehicleType;
  vehicle_model: string;
  license_plate: string;
  rating: number;
  is_available: boolean;
  current_latitude: number;
  current_longitude: number;
  profile_image?: string;
  vehicle_make?: string;
  vehicle_color?: string;
  photo_url?: string;
  profile_picture?: string;
  languages?: string[];
  years_experience?: number;
  total_rides?: number;
  verified?: boolean;
  license_number?: string;
  status: string;
  // Other properties
  vehicle_info?: {
    model: string;
    plate: string;
    color: string;
  };
  average_rating?: number;
  current_location?: {
    latitude: number;
    longitude: number;
  };
}

export interface TaxiRideRequest {
  id: string;
  ride_id: string;
  driver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  requested_at?: string;
}

export interface TaxiFare {
  base_fare: number;
  distance_rate: number;
  time_rate: number;
  total: number;
  currency: string;
  subscription_discount?: number;
  promo_discount?: number;
  peak_hours_multiplier?: number;
}

export interface TaxiPricingParams {
  distance_km: number;
  duration_min: number;
  vehicle_type: VehicleType;
  time_of_day: string;
  subscription_discount?: number;
  promo_code?: string;
  is_premium?: boolean;
}

export interface PricingFactors {
  vehicle_type?: VehicleType;
  distance?: number;
  distance_km?: number;
  duration_min?: number;
  is_premium?: boolean;
  subscription_discount?: number;
  promo_code?: string;
}

export interface TaxiInvoice {
  id: string;
  ride_id: string;
  user_id: string;
  amount: number;
  issue_date: string;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  payment_method: PaymentMethod;
  issued_at?: string;
  total?: number;
  subtotal?: number;
  tax?: number;
  discount?: number;
}

export interface BusinessRateEstimate {
  monthly_savings: number;
  discount_percentage: number;
  price_per_ride: number;
  plan_name: string;
}

export interface BookingFormState {
  pickup_address: string;
  pickup_latitude: number | null;
  pickup_longitude: number | null;
  destination_address: string;
  destination_latitude: number | null;
  destination_longitude: number | null;
  pickup_time: string;
  pickup_time_type: 'now' | 'scheduled';
  vehicle_type: VehicleType;
  payment_method: string;
  special_instructions: string;
  isSharingEnabled?: boolean;
  maxPassengers?: number;
}

export interface TaxiSubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  discount_percentage: number;
  maximum_rides: number;
  duration: string;
  popular?: boolean;
  max_rides?: number;
}

export interface RideShareRequest {
  id: string;
  ride_id: string;
  requester_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  pickup_address?: string;
  destination_address?: string;
  user_id?: string;
  requested_at?: string;
}
