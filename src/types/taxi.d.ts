
export interface TaxiRide {
  id: string;
  user_id: string;
  driver_id: string | null;
  status: TaxiRideStatus;
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  destination_address: string;
  destination_latitude: number;
  destination_longitude: number;
  pickup_time: string;
  pickup_time_type: 'now' | 'scheduled';
  estimated_price: number;
  actual_price: number | null;
  payment_status: PaymentStatus;
  payment_method: string;
  distance_km: number;
  duration_min: number;
  rating?: number;
  rating_comment?: string;
  vehicle_type: VehicleType;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
  
  // Extended properties
  actual_arrival_time?: string;
  estimated_arrival_time?: string;
  current_passengers?: number;
  is_shared_ride?: boolean;
  max_passengers?: number;
  route_polyline?: string;
}

export type TaxiRideStatus = 
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'cancelled'
  | 'driver_assigned'
  | 'driver_en_route'
  | 'driver_arrived'
  | 'ride_in_progress'
  | 'arrived_at_destination'
  | 'completed'
  | 'in_progress'; // Add this to support current code

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'completed' | 'overdue';

export type PaymentMethod = 'cash' | 'card' | 'wallet' | 'mobile_money';

export type VehicleType = 'standard' | 'comfort' | 'premium' | 'van';

export interface TaxiDriver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  vehicle_type: VehicleType;
  vehicle_model: string;
  license_plate: string;
  photo_url?: string;
  rating: number;
  is_available: boolean;
  current_latitude: number;
  current_longitude: number;
  last_location_update: string;
  status: string;
  
  // Extended properties
  average_rating?: number;
  vehicle_make?: string;
  profile_image?: string;
  profile_picture?: string;
  vehicle_info?: any;
  languages?: string[];
  years_experience?: number;
  total_rides?: number;
  current_location?: {
    latitude: number;
    longitude: number;
  };
}

export interface TaxiRideRequest {
  id: string;
  ride_id: string;
  driver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  requested_at: string;
  created_at: string;
}

export interface TaxiFare {
  base_fare: number;
  distance_fare: number;
  time_fare: number;
  surge_multiplier: number;
  total: number;
  currency: string;
  breakdown: {
    base: number;
    distance: number;
    time: number;
    surge: number;
    tax: number;
    promo_discount?: number;
  };
  peak_hours_multiplier?: number;
}

export interface TaxiPricingParams {
  distance_km: number;
  duration_min: number;
  vehicle_type: VehicleType;
  time_of_day: string;
  day_of_week?: string;
  surge_factor?: number;
  subscription_discount?: number;
  promo_code?: string;
  is_premium?: boolean;
}

export interface PricingFactors {
  time_of_day: string;
  day_of_week: string;
  surge_factor: number;
  distance?: number;
  vehicle_type?: VehicleType;
  distance_km?: number;
  duration_min?: number;
  is_premium?: boolean;
  subscription_discount?: number;
  promo_code?: string;
}

export interface BookingFormState {
  pickup_address: string;
  pickup_latitude: number | null;
  pickup_longitude: number | null;
  destination_address: string;
  destination_latitude: number | null;
  destination_longitude: number | null;
  vehicle_type: VehicleType;
  pickup_time_type: 'now' | 'scheduled';
  pickup_time: string;
  contact_phone: string;
  payment_method: string;
  special_instructions: string;
  isSharingEnabled?: boolean;
  maxPassengers?: number;
}

export interface BookingFormContextType {
  currentStep: number;
  formState: BookingFormState;
  loading: boolean;
  bookingSuccess: boolean;
  createdRideId: string;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  handleBookNow: () => Promise<void>;
  resetForm: () => void;
  nearbyDrivers: TaxiDriver[];
  updateFormField: <K extends keyof BookingFormState>(field: K, value: BookingFormState[K]) => void;
  selectedDriver?: TaxiDriver;
  estimatedPrice?: number;
  getDistanceEstimate?: () => number;
}

export interface TaxiLocation {
  id: string;
  user_id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'home' | 'work' | 'favorite' | 'custom';
  icon?: string;
  created_at: string;
}

export interface TaxiSubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billing_cycle: 'monthly' | 'quarterly' | 'yearly';
  features: string[];
  active: boolean;
  discount_percentage: number;
  
  // Extended properties
  duration?: string;
  max_rides?: number;
  popular?: boolean;
}

export interface BusinessRateEstimate {
  base_rate: number;
  monthly_cost: number;
  per_ride_discount: number;
  recommended_plan: string;
  annual_savings: number;
}

export interface TaxiInvoice {
  id: string;
  user_id: string;
  amount: number;
  issue_date: string;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  payment_method: PaymentMethod;
  rides: string[];
  
  // Extended properties
  issued_at?: string;
  total?: number;
  subtotal?: number;
  tax?: number;
  discount?: number;
}

export interface TaxiRideLocation {
  type: 'pickup' | 'destination' | 'waypoint';
  address: string;
  latitude: number;
  longitude: number;
  arrival_time?: string;
  departure_time?: string;
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface RideShareRequest {
  id: string;
  user_id: string;
  ride_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  created_at: string;
  
  // Extended properties
  destination_address?: string;
  requested_at?: string;
  requester_id?: string;
}

export interface RidesharingTrip {
  id: string;
  driver_id: string;
  start_location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  end_location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  departure_time: string;
  seats_available: number;
  seats_taken: number;
  price_per_seat: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  recurring: boolean;
  recurring_days?: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  created_at: string;
  description?: string;
}

export interface RidesharingBooking {
  id: string;
  trip_id: string;
  user_id: string;
  seats_booked: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: PaymentStatus;
  created_at: string;
  
  // Extended properties
  trip?: RidesharingTrip;
}
