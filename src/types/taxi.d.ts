
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
  pickup_time: Date | string;
  pickup_time_type: 'now' | 'scheduled';
  status: TaxiRideStatus;
  vehicle_type: TaxiVehicleType;
  payment_method: PaymentMethod;
  estimated_price: number;
  actual_price: number | null;
  created_at: string;
  special_instructions?: string;
  is_shared_ride?: boolean;
  max_passengers?: number;
  current_passengers?: number;
  estimated_arrival_time?: string;
  actual_arrival_time?: string;
  distance_km?: number;
  route_polyline?: string;
  promo_code_applied?: string;
  promo_discount?: number;
  payment_status?: 'pending' | 'pre_authorized' | 'paid' | 'failed' | 'refunded';
  payment_transaction_id?: string;
  payment_authorization_id?: string;
  eta_minutes?: number;
  weather_condition?: 'clear' | 'rain' | 'snow' | 'fog';
  traffic_condition?: 'light' | 'moderate' | 'heavy' | 'severe';
  invoice_id?: string;
  invoice_url?: string;
  rating?: number;
  rating_comment?: string;
  cancellation_reason?: string;
  cancelled_by?: 'user' | 'driver' | 'system';
  cancelled_at?: string;
}

export type TaxiRideStatus = 
  | 'pending'
  | 'driver_assigned'
  | 'driver_en_route'
  | 'driver_arrived'
  | 'ride_in_progress'
  | 'arrived_at_destination'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export type TaxiVehicleType = 'standard' | 'comfort' | 'premium' | 'van';
export type PaymentMethod = 'cash' | 'card' | 'mobile_money' | 'wallet';

export interface TaxiDriver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  vehicle_type: TaxiVehicleType;
  vehicle_model: string;
  license_plate: string;
  photo_url: string;
  rating: number;
  is_available: boolean;
  current_latitude: number;
  current_longitude: number;
  total_rides: number;
  years_experience: number;
  languages: string[];
  verified: boolean;
  location?: [number, number];
  status?: string;
  profile_picture?: string;
  average_rating?: number;
  acceptance_rate?: number;
  completion_rate?: number;
  current_ride_id?: string;
  vehicle_color?: string;
  vehicle_year?: number;
  can_handle_shared_rides?: boolean;
  specialties?: string[];
  preferred_payment_methods?: PaymentMethod[];
}

export interface TaxiRideRequest {
  id: string;
  ride_id: string;
  driver_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'timeout';
  requested_at: string;
  responded_at?: string;
  timeout_at?: string;
  rejection_reason?: string;
}

export interface TaxiRating {
  id: string;
  ride_id: string;
  rating: number;
  comment?: string;
  cleanliness?: number;
  punctuality?: number;
  communication?: number;
  driving_quality?: number;
  created_at: string;
}

export interface TaxiMessage {
  id: string;
  ride_id: string;
  sender_id: string;
  sender_type: 'driver' | 'passenger' | 'system';
  message: string;
  created_at: string;
  read: boolean;
}

export interface TaxiSubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in days
  features: string[];
  discount_percentage: number;
  max_rides: number | null;
  type: 'individual' | 'family' | 'business';
  popular: boolean;
}

export interface RideShareRequest {
  id: string;
  ride_id: string;
  user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  requested_at: string;
  responded_at?: string;
  pickup_address?: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
}

export interface TaxiInvoice {
  id: string;
  ride_id: string;
  user_id: string;
  driver_id: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  payment_method: PaymentMethod;
  currency: string;
  issued_at: string;
  due_at?: string;
  paid_at?: string;
  status: 'draft' | 'issued' | 'paid' | 'cancelled';
  invoice_url?: string;
  pdf_url?: string;
  reference_number: string;
}

export interface TaxiPromoCode {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed_amount' | 'free_ride';
  discount_value: number;
  min_ride_value?: number;
  max_uses?: number;
  current_uses?: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  restricted_to_users?: string[];
  restricted_to_vehicle_types?: TaxiVehicleType[];
}

export interface TaxiLocation {
  id: string;
  user_id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'home' | 'work' | 'favorite' | 'recent';
  icon?: string;
  use_count: number;
  last_used: string;
}

export interface TaxiRideHistory {
  ride_id: string;
  date: string;
  pickup_address: string;
  destination_address: string;
  amount: number;
  status: TaxiRideStatus;
  vehicle_type: TaxiVehicleType;
  driver_name?: string;
  driver_rating?: number;
  ride_rating?: number;
}
