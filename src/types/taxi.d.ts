
export type TaxiVehicleType = 'standard' | 'comfort' | 'premium' | 'van' | 'electric' | 'scooter' | 'bike' | 'walk';
export type TaxiRideStatus = 'pending' | 'accepted' | 'arrived' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
export type PaymentMethod = 'cash' | 'card' | 'wallet' | 'mobile' | 'mobile_money';
export type TransactionType = 'deposit' | 'withdrawal' | 'payment' | 'refund' | 'bonus';

export interface TaxiDriver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email: string;
  vehicle_type: TaxiVehicleType;
  current_latitude: number;
  current_longitude: number;
  average_rating: number;
  status: 'available' | 'busy' | 'offline' | 'on_break' | 'in_shared_ride';
  vehicle_info?: {
    model: string;
    color: string;
    plate: string;
    year: number;
  };
  profile_picture?: string;
  profile_image?: string;
  is_available: boolean;
  current_location?: [number, number];
  rating?: number;
  vehicle_model?: string;
  license_plate?: string;
  years_experience?: number;
  languages?: string[];
  distance?: number;
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
  status: TaxiRideStatus;
  estimated_price: number;
  actual_price?: number;
  payment_method: PaymentMethod;
  payment_status: 'pending' | 'paid' | 'failed';
  vehicle_type: TaxiVehicleType;
  rating?: number;
  rating_comment?: string;
  distance_km: number;
  duration_min: number;
  special_instructions?: string;
  is_shared_ride?: boolean;
  max_passengers?: number;
  current_passengers?: number;
  estimated_arrival_time?: string;
  actual_arrival_time?: string;
  route_polyline?: string;
  promo_code_applied?: string;
  promo_discount?: number;
  created_at: string;
}

export interface TaxiFare {
  base_fare: number;
  per_km_rate: number;
  per_minute_rate: number;
  minimum_fare: number;
  cancellation_fee: number;
  service_fee: number;
  total: number;
  currency: string;
}

export interface TaxiLocation {
  id?: string;
  user_id: string;
  address: string;
  latitude: number;
  longitude: number;
  is_favorite: boolean;
  is_home: boolean;
  is_work: boolean;
  is_current_location?: boolean;
  name?: string;
  last_used?: string;
  created_at?: string;
}

export interface TaxiRideRequest {
  id: string;
  user_id: string;
  status: 'pending' | 'accepted' | 'cancelled';
  pickup_location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  destination_location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  requested_at: string;
  vehicle_type: TaxiVehicleType;
  estimated_price: number;
  driver_id?: string;
  expires_at: string;
  ride_id?: string;
}

export interface RideShareRequest {
  id: string;
  ride_id: string;
  user_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  pickup_location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  drop_location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  requested_at: string;
  expires_at: string;
  pickup_address?: string;
  requester_id?: string;
}

export interface PricingFactors {
  distance_km?: number;
  duration_min?: number;
  vehicle_type?: TaxiVehicleType;
  time_of_day?: 'day' | 'night' | 'peak';
  is_premium?: boolean;
  subscription_discount?: number;
  promo_code?: string;
}

export interface TaxiPricingParams {
  distance_km: number;
  duration_min: number;
  vehicle_type: TaxiVehicleType;
  time_of_day?: 'day' | 'night' | 'peak';
  is_premium?: boolean;
  subscription_discount?: number;
  promo_code?: string;
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface BusinessRateEstimate {
  baseRate: number;
  discountPercentage: number;
  estimatedSavings: number;
  requiredRidesPerMonth: number;
  totalMonthlySpend: number;
}

export interface TaxiInvoice {
  id: string;
  ride_id: string;
  amount: number;
  issue_date: string;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  payment_method: PaymentMethod;
  user_id: string;
  items: Array<{
    description: string;
    amount: number;
  }>;
  tax: number;
  discount: number;
  total: number;
}

export interface TaxiSubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  benefits: string[];
  duration_days: number;
  discount_percentage: number;
  ride_credits: number;
  is_popular: boolean;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
  total_earnings: number;
  commission_rate: number;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  amount: number;
  type: TransactionType;
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  reference_number?: string;
  created_at: string;
}
