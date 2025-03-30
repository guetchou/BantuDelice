
export type TaxiVehicleType = 'standard' | 'premium' | 'suv' | 'van' | 'motorcycle' | 'bicycle' | 'scooter' | 'car' | 'comfort' | 'bike' | 'walk' | 'electric';

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
  | 'rejected'
  | 'in_progress';

export type TaxiDriverStatus = 'available' | 'busy' | 'offline' | 'in_shared_ride';

export type PaymentMethod = 'cash' | 'card' | 'mobile' | 'wallet' | 'mobile_money';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'overdue' | 'completed';

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
  status: TaxiRideStatus;
  estimated_price: number;
  actual_price: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  vehicle_type: TaxiVehicleType;
  distance_km: number;
  duration_min: number;
  notes?: string;
  created_at: string;
  
  // Optional fields
  special_instructions?: string;
  is_shared_ride?: boolean;
  max_passengers?: number;
  current_passengers?: number;
  estimated_arrival_time?: string;
  actual_arrival_time?: string;
  route_polyline?: string;
  promo_code_applied?: string;
  promo_discount?: number;
  rating?: number;
  rating_comment?: string;
}

export interface TaxiDriver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email?: string;
  vehicle_type: TaxiVehicleType;
  vehicle_color?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  license_plate?: string;
  current_latitude: number;
  current_longitude: number;
  status: TaxiDriverStatus;
  average_rating: number;
  total_rides?: number;
  is_available: boolean;
  created_at: string;
  last_location_update: string;
  profile_image?: string;
  languages?: string[];
  years_experience?: number;
  profile_picture?: string;
  photo_url?: string;
  rating?: number;
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
  responded_at?: string;
  requested_at?: string;
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface TaxiFare {
  basePrice: number;
  perKmPrice: number;
  perMinutePrice: number;
  serviceFee: number;
  total: number;
  currency: string;
  base_fare?: number;
}

export interface PricingFactors {
  time_of_day: 'morning' | 'afternoon' | 'evening' | 'night' | 'peak';
  day_of_week: 'weekday' | 'weekend';
  distance_km: number;
  duration_min: number;
  demand_level: 'low' | 'medium' | 'high' | 'surge';
  location_zone?: string;
  vehicle_type?: TaxiVehicleType;
  is_premium?: boolean;
  subscription_discount?: number;
  promo_code?: string;
  distance?: number;
}

export interface TaxiInvoice {
  id: string;
  ride_id: string;
  user_id: string;
  amount: number;
  payment_method: PaymentMethod;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled' | 'draft' | 'issued';
  created_at: string;
  paid_at?: string;
  due_date: string;
  invoice_number: string;
  issued_at?: string;
  total?: number;
  subtotal?: number;
  tax?: number;
  discount?: number;
}

export interface BusinessRateEstimate {
  monthlyDiscount: number;
  standardRate: number;
  businessRate: number;
  annualSavings: number;
}

export interface SavedLocation {
  id?: string;
  user_id?: string;
  address: string;
  latitude: number;
  longitude: number;
  is_favorite?: boolean;
  is_current_location?: boolean;
  last_used?: string;
  created_at?: string;
}

export interface TaxiLocation {
  latitude: number;
  longitude: number;
  timestamp?: string;
  accuracy?: number;
  speed?: number;
  heading?: number;
}

export interface RideShareRequest {
  id: string;
  user_id: string;
  ride_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  seats_requested: number;
}

export interface TaxiSubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  discount_percentage: number;
  max_rides_per_month: number;
  is_popular: boolean;
}

export interface TaxiPricingParams {
  distance_km: number;
  duration_min: number;
  vehicle_type: TaxiVehicleType;
  time_of_day: 'morning' | 'afternoon' | 'evening' | 'night';
  is_premium?: boolean;
  subscription_type?: string;
}
