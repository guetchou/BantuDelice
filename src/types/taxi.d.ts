
export interface TaxiRide {
  id: string;
  user_id: string;
  pickup_address: string;
  destination_address: string;
  pickup_time: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  driver_id?: string;
  estimated_price?: number;
  actual_price?: number;
  payment_status: string;
  vehicle_type: string;
  payment_method: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  destination_latitude?: number;
  destination_longitude?: number;
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
}

export interface TaxiRating {
  id: string;
  ride_id: string;
  rating: number;
  cleanliness?: number;
  punctuality?: number;
  driving_quality?: number;
  communication?: number;
  comment?: string;
}

export interface TaxiPayment {
  id: string;
  ride_id: string;
  amount: number;
  payment_method?: string;
  payment_status: string;
  payment_details?: any;
}

export interface TaxiDriver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  vehicle_type: string;
  vehicle_model: string;
  license_plate: string;
  photo_url?: string;
  rating: number;
  is_available: boolean;
  current_location?: string;
  current_latitude?: number;
  current_longitude?: number;
  total_rides?: number;
  total_earnings?: number;
  years_experience?: number;
  languages?: string[];
  verified?: boolean;
  background_check_passed?: boolean;
  vehicle_inspection_date?: string;
  insurance_verified?: boolean;
}

export interface TaxiPromoCode {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  valid_from: string;
  valid_until: string;
  max_uses: number;
  current_uses: number;
  min_ride_value?: number;
  max_discount?: number;
  applies_to_vehicle_types?: string[];
  description?: string;
  is_active: boolean;
}

export interface RideShareRequest {
  id: string;
  ride_id: string;
  requester_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  pickup_address: string;
  destination_address: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  destination_latitude?: number;
  destination_longitude?: number;
  created_at: string;
}
