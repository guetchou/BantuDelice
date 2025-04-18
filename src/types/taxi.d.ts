
export type VehicleType = 'standard' | 'comfort' | 'premium' | 'van' | 'electric';
export type TaxiVehicleType = VehicleType; // For backward compatibility

export type PaymentMethod = 'cash' | 'mobile' | 'card' | 'wallet';
export type TaxiRideStatus = 'pending' | 'assigned' | 'accepted' | 'picked_up' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'completed';

export interface TaxiDriver {
  id: string;
  user_id: string;
  name: string;
  license_number: string;
  phone: string;
  email?: string;
  status: 'available' | 'busy' | 'offline' | 'on_trip';
  verified: boolean;
  rating?: number;
  registration_date?: string;
  vehicle_type: VehicleType;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_color?: string;
  license_plate: string;
  current_latitude: number;
  current_longitude: number;
  created_at?: string;
  updated_at?: string;
  last_active?: string;
  total_deliveries?: number;
  profile_picture?: string;
  profile_image?: string;
  current_location?: {
    latitude: number;
    longitude: number;
  };
  vehicle_info?: {
    model: string;
    plate: string;
    color: string;
    make?: string;
  };
  languages?: string[];
  years_experience?: number;
  total_rides?: number;
}

export interface TaxiRide {
  id: string;
  user_id: string;
  driver_id: string | null;
  pickup_address: string;
  destination_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
  pickup_time: string;
  status: TaxiRideStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  vehicle_type: VehicleType;
  estimated_price: number;
  actual_price?: number;
  distance_km: number;
  duration_min: number;
  rating?: number;
  rating_comment?: string;
  created_at: string;
  updated_at: string;
  pickup_time_type?: 'now' | 'scheduled';
  route_polyline?: string;
  is_shared_ride?: boolean;
  max_passengers?: number;
}

export interface TaxiRideRequest {
  id: string;
  ride_id: string;
  driver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  requested_at?: string;
}

export interface RideShareRequest {
  id: string;
  ride_id: string;
  requestor_id: string;
  requester_id?: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  requested_at?: string;
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
  base_fare: number;
  distance_fare: number;
  time_fare: number;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  peak_hours_multiplier?: number;
}

export interface TaxiInvoice {
  id: string;
  ride_id: string;
  user_id: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: 'pending' | 'paid' | 'overdue';
  issue_date: string;
  due_date: string;
  paid_date?: string;
  invoice_number: string;
}

export interface TaxiSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'suspended';
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  payment_method: PaymentMethod;
}

export interface TaxiPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  features: string[];
  discount_percentage: number;
  ride_limit?: number;
  vehicle_types: VehicleType[];
}
