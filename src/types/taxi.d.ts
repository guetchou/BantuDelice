
export interface TaxiLocation {
  latitude: number;
  longitude: number;
  address?: string;
  name?: string;
}

export type PaymentMethod = 'cash' | 'card' | 'mobile_money' | 'wallet';

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

export interface TaxiDriver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email?: string;
  profile_image?: string;
  vehicle_type: TaxiVehicleType;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_color?: string;
  vehicle_year?: number;
  license_plate: string;
  rating: number;
  total_rides: number;
  is_available: boolean;
  current_location?: TaxiLocation;
}

export interface TaxiRide {
  id: string;
  user_id: string;
  driver_id?: string;
  pickup_address: string;
  destination_address: string;
  pickup_time: string;
  pickup_time_type: 'now' | 'scheduled';
  status: TaxiRideStatus;
  estimated_price: number;
  actual_price?: number;
  distance_km: number;
  duration_min: number;
  payment_method?: PaymentMethod;
  payment_status?: 'pending' | 'paid' | 'failed';
  created_at: string;
  pickup_latitude: number;
  pickup_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
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
  payment_method: string;
  currency: string;
  issued_at: string;
  due_at?: string;
  paid_at?: string;
  status: 'draft' | 'issued' | 'paid' | 'cancelled';
  invoice_url?: string;
  pdf_url?: string;
  reference_number: string;
}

export interface TaxiSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  payment_method: PaymentMethod;
  monthly_price: number;
  discount_applied: number;
  features: Array<{name: string; value: string | number | boolean}>;
}

export interface TaxiPricingParams {
  distance_km: number;
  duration_min: number;
  vehicle_type: TaxiVehicleType;
  time_of_day?: string;
  is_premium?: boolean;
  promo_code?: string;
  subscription_discount?: number;
}

export interface TaxiFare {
  base_fare: number;
  distance_fare: number;
  time_fare: number;
  peak_hours_multiplier: number;
  subscription_discount: number;
  promo_discount: number;
  taxes: number;
  total: number;
  currency: string;
}
