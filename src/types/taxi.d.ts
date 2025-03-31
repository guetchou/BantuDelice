
export type TaxiVehicleType = 'standard' | 'premium' | 'van' | 'comfort' | 'motorcycle' | 'bicycle' | 'scooter' | 'car' | 'bike' | 'walk';
export type TaxiRideStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'preparing' | 'ready' | 'in_transit' | 'delivered';
export type PaymentMethod = 'cash' | 'card' | 'mobile' | 'wallet' | 'company' | 'subscription';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'completed';
export type RideStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night' | 'peak';

export interface TaxiPricingParams {
  distance_km: number;
  duration_min: number;
  vehicle_type: TaxiVehicleType;
  time_of_day: TimeOfDay;
  surge_factor?: number;
  promo_code?: string;
  subscription_discount?: number;
}

export interface TaxiFare {
  base_fare: number;
  distance_fare?: number;
  time_fare: number;
  total_fare: number;
  currency: string;
  surge_applied?: number;
  discount_applied?: number;
  breakdown?: {
    base: number;
    distance: number;
    time: number;
    surge?: number;
    discount?: number;
    tax?: number;
  };
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface TaxiDriver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  profile_image: string;
  vehicle_type: TaxiVehicleType;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_color: string;
  license_plate: string;
  rating: number;
  total_rides: number;
  latitude?: number;
  longitude?: number;
  years_experience: number;
  status: 'available' | 'busy' | 'offline';
  verified?: boolean;
  average_rating: number;
  created_at: string;
  last_location_update: string;
}

export interface TaxiRide {
  id: string;
  user_id: string;
  driver_id: string | null;
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  destination_address: string;
  destination_latitude: number;
  destination_longitude: number;
  pickup_time: string;
  pickup_time_type: 'now' | 'scheduled';
  status: TaxiRideStatus;
  payment_method?: PaymentMethod;
  payment_status: PaymentStatus;
  estimated_price: number;
  actual_price?: number;
  distance_km: number;
  duration_min: number;
  vehicle_type?: TaxiVehicleType;
  notes?: string;
  created_at: string;
  accepted_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  special_instructions?: string;
  promo_code?: string;
  promo_discount?: number;
  current_passengers?: number;
  estimated_arrival_time?: string;
  actual_arrival_time?: string;
}

export interface TaxiRideRequest {
  id: string;
  ride_id: string;
  driver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  requested_at: string;
  responded_at?: string;
  created_at: string;
}

export interface TaxiSubscriptionPlan {
  id: string;
  name: string;
  description: string;
  features: string[];
  price?: number;
  billing_cycle: 'monthly' | 'quarterly' | 'yearly';
  max_rides?: number;
  discount_percentage: number;
  popular?: boolean;
  duration?: string;
}

export interface BusinessRateEstimate {
  standardRate: number;
  discountedRate: number;
  savingsPercentage: number;
  monthlySavings: number;
  yearlySavings: number;
}

export interface RideShareRequest {
  id: string;
  ride_id: string;
  requester_id?: string;
  status: 'pending' | 'accepted' | 'rejected';
  requested_at?: string;
  created_at: string;
}
