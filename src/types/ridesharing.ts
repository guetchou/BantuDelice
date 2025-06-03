
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
  preferences: {
    smoking_allowed: boolean;
    pets_allowed: boolean;
    music_allowed: boolean;
    air_conditioning: boolean;
    luggage_allowed: boolean;
    chatty_driver?: boolean;
  };
  recurrence_pattern?: {
    frequency: 'daily' | 'weekly' | 'weekdays' | 'custom';
    days_of_week?: Array<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'>;
    start_date: string;
    end_date?: string;
    auto_accept_riders?: boolean;
  };
  created_at: string;
  updated_at?: string;
}
