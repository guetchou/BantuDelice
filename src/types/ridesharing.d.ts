
export interface RidesharingTrip {
  id: string;
  driver_id: string;
  origin_address: string;
  origin_latitude: number;
  origin_longitude: number;
  destination_address: string;
  destination_latitude: number;
  destination_longitude: number;
  departure_date: string;
  departure_time: string;
  estimated_arrival_time: string;
  available_seats: number;
  price_per_seat: number;
  status: 'active' | 'completed' | 'cancelled';
  vehicle_model?: string;
  vehicle_color?: string;
  license_plate?: string;
  created_at: string;
  updated_at?: string;
  preferences: RidesharingPreferences;
}

export interface RidesharingPreferences {
  smoking_allowed: boolean;
  pets_allowed: boolean;
  music_allowed: boolean;
  air_conditioning: boolean;
  luggage_allowed: boolean;
  max_luggage_size?: 'small' | 'medium' | 'large';
  chatty_driver?: boolean;
}

export interface RidesharingBooking {
  id: string;
  trip_id: string;
  passenger_id: string;
  seats_booked: number;
  booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'partial' | 'completed' | 'refunded';
  total_price: number;
  created_at: string;
  updated_at?: string;
  special_requests?: string;
  cancellation_reason?: string;
  payment_method?: string;
}

export interface RidesharingReview {
  id: string;
  trip_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  reviewer_type: 'driver' | 'passenger';
}

export interface RidesharingUser {
  id: string;
  full_name: string;
  profile_picture?: string;
  average_rating: number;
  total_trips: number;
  is_verified: boolean;
  verified_driver: boolean;
  verified_phone: boolean;
  verified_email: boolean;
  member_since: string;
  eco_points: number;
  bio?: string;
}

export interface RidesharingVehicle {
  id: string;
  owner_id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  seats_capacity: number;
  is_verified: boolean;
  verification_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at?: string;
}

export interface RidesharingSearchFilters {
  origin?: string;
  destination?: string;
  date?: Date;
  minSeats?: number;
  maxPrice?: number;
  minDriverRating?: number;
  preferenceFilters?: Partial<RidesharingPreferences>;
}
