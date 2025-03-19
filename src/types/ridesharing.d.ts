
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
  // Organization-related fields
  organization_id?: string;
  organization_sponsored?: boolean;
  organization_subsidy_amount?: number;
  organization_subsidy_type?: 'fixed' | 'percentage';
  is_organization_trip?: boolean;
  organization_route_id?: string;
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
  // Organization-related fields
  organization_id?: string;
  subsidy_applied?: number;
  employee_payment_amount?: number;
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
  // Organization-related fields
  organization_id?: string;
  employee_id?: string;
  department?: string;
  role?: string;
  is_organization_driver?: boolean;
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
  organizationId?: string;
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
  // Organization-related fields
  organization_id?: string;
  is_subsidized?: boolean;
  subsidy_amount?: number;
}

// New interfaces for organization-related carpooling

export interface Organization {
  id: string;
  name: string;
  type: 'company' | 'school' | 'university' | 'government' | 'other';
  address: string;
  logo_url?: string;
  contact_email: string;
  contact_phone?: string;
  created_at: string;
  updated_at?: string;
  subsidy_policy?: OrganizationSubsidyPolicy;
  routes?: OrganizationRoute[];
}

export interface OrganizationSubsidyPolicy {
  subsidy_type: 'fixed' | 'percentage' | 'full';
  subsidy_amount: number; // Amount in FCFA or percentage (0-100)
  subsidy_cap?: number; // Maximum subsidy amount per trip in FCFA
  min_riders_required?: number; // Minimum riders required for subsidy to apply
  active: boolean;
  applies_to_recurring_only?: boolean;
}

export interface OrganizationRoute {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  destination_address: string;
  destination_latitude: number;
  destination_longitude: number;
  schedule: OrganizationRouteSchedule[];
  active: boolean;
  created_at: string;
  updated_at?: string;
  intermediate_stops?: OrganizationRouteStop[];
}

export interface OrganizationRouteSchedule {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  arrival_time: string; // HH:MM format
  departure_time: string; // HH:MM format
}

export interface OrganizationRouteStop {
  address: string;
  latitude: number;
  longitude: number;
  order: number;
  name?: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  employee_id?: string;
  member_role: 'admin' | 'manager' | 'driver' | 'regular';
  department?: string;
  status: 'active' | 'inactive';
  join_date: string;
  created_at: string;
  updated_at?: string;
}

export interface OrganizationTripAssignment {
  id: string;
  organization_id: string;
  route_id: string;
  trip_id?: string;
  driver_id: string;
  capacity: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  recurrence_pattern?: RecurrencePattern;
  created_at: string;
  updated_at?: string;
}
