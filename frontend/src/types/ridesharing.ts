
export interface RidesharingTrip {
  id: string;
  driver_id: string;
  origin_address: string;
  destination_address: string;
  departure_time: string;
  estimated_arrival_time?: string;
  available_seats: number;
  price_per_seat: number;
  status: 'active' | 'completed' | 'cancelled';
  vehicle_model?: string;
  vehicle_color?: string;
  license_plate?: string;
  description?: string;
  is_recurring?: boolean;
  preferences: {
    smoking_allowed: boolean;
    pets_allowed: boolean;
    music_allowed: boolean;
    air_conditioning: boolean;
    luggage_allowed: boolean;
    chatty_driver?: boolean;
  };
  recurrence_pattern?: RecurrencePattern;
  created_at: string;
  updated_at?: string;
}

export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'weekdays' | 'custom';
  days_of_week?: Array<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'>;
  start_date: string;
  end_date?: string;
  auto_accept_riders?: boolean;
}

export interface RidesharingSearchFilters {
  origin?: string;
  destination?: string;
  departure_time?: string;
  passenger_count?: number;
  price_range?: [number, number];
  preferences?: {
    smoking_allowed?: boolean;
    pets_allowed?: boolean;
    music_allowed?: boolean;
    air_conditioning?: boolean;
    luggage_allowed?: boolean;
  };
}

export interface RecurringTripMatch {
  id: string;
  trip_id: string;
  rider_id: string;
  status: 'pending' | 'accepted' | 'declined';
  match_score: number;
  estimated_savings: number;
  created_at: string;
}

export interface RidesharingRecurringBooking {
  id: string;
  trip_id: string;
  rider_id: string;
  status: 'active' | 'paused' | 'cancelled';
  start_date: string;
  end_date?: string;
  days_of_week: string[];
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  description?: string;
  email: string;
  phone?: string;
  address?: string;
  admin_user_id: string;
  created_at: string;
  updated_at?: string;
}

export interface OrganizationRoute {
  id: string;
  organization_id: string;
  name: string;
  origin_address: string;
  destination_address: string;
  departure_times: string[];
  active: boolean;
  created_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: 'admin' | 'member';
  status: 'active' | 'pending' | 'inactive';
  joined_at: string;
}

export interface OrganizationTripAssignment {
  id: string;
  organization_id: string;
  route_id: string;
  driver_id: string;
  trip_id: string;
  assigned_date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}
