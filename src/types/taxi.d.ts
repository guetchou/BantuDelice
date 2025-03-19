
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
}

export type TaxiRideStatus = 'pending' | 'accepted' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
export type TaxiVehicleType = 'standard' | 'comfort' | 'premium' | 'van';
export type PaymentMethod = 'cash' | 'card' | 'mobile_money';

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
}

export interface TaxiRideRequest {
  id: string;
  ride_id: string;
  driver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  requested_at: string;
  responded_at?: string;
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
