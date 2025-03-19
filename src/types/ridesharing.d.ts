
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
  is_recurring?: boolean;
  recurrence_pattern?: RecurrencePattern;
}

export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'weekdays' | 'custom';
  days_of_week?: Array<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'>;
  start_date: string;
  end_date?: string;
  auto_accept_riders?: boolean;
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
  is_recurring?: boolean;
  recurrence_id?: string;
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
  recurringTrip?: boolean;
}

export interface RecurringTripMatch {
  trip_id: string;
  driver_id: string;
  driver_name: string;
  driver_rating: number;
  similarity_score: number;
  matched_route: boolean;
  matched_schedule: boolean;
  matched_preferences: boolean;
  previous_trips_together: number;
}

export interface RidesharingRecurringBooking {
  id: string;
  passenger_id: string;
  trip_id: string;
  status: 'active' | 'paused' | 'cancelled';
  booking_days: Array<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'>;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at?: string;
  auto_confirm: boolean;
  payment_method: string;
  seats_booked: number;
  special_requests?: string;
}
