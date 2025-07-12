
export interface BusinessRateEstimate {
  baseDiscount: number;
  volumeDiscount: number;
  totalDiscount: number;
  standardRate: number;
  businessRate: number;
  monthlySavings: number;
  annualSavings: number;
  formattedTotal?: string;
  perRideDiscount?: number;
  monthlyRides?: number;
  vehicleType?: string;
}

export interface BusinessRateFormData {
  companyName: string;
  contactEmail: string;
  monthlyRides: number;
  averageDistance: number;
  vehicleType: string;
  employeeCount?: number;
  estimatedMonthlyRides?: number;
  contactPerson?: string;
  contactPhone?: string;
}

export type TaxiVehicleType = 'standard' | 'comfort' | 'premium' | 'suv' | 'van';

export type PaymentMethod = 'cash' | 'credit_card' | 'mobile_money' | 'wallet';

export interface TaxiDriver {
  id: string;
  name: string;
  rating: number;
  profile_image?: string;
  photo_url?: string;
  vehicle_model?: string;
  license_plate?: string;
  vehicle_info?: {
    model: string;
    license_plate: string;
  };
  years_experience?: number;
  languages?: string[];
  current_latitude?: number;
  current_longitude?: number;
}

export interface TaxiRide {
  id: string;
  pickup_address: string;
  destination_address: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  driver?: TaxiDriver;
  price: number;
  distance: number;
  duration: number;
  created_at: string;
  scheduled_time?: string;
  user_id?: string;
  driver_id?: string;
  pickup_time?: string;
  estimated_price?: number;
  actual_price?: number;
  payment_status?: 'pending' | 'paid' | 'failed';
  vehicle_type?: string;
  payment_method?: PaymentMethod;
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

export interface TaxiSubscriptionPlan {
  id: string;
  name: string;
  price: number;
  benefits: string[];
  description: string;
  is_popular?: boolean;
  duration: string;
  features?: string[];
  discount_percentage?: number;
  max_rides?: number;
  popular?: boolean;
  type?: 'individual' | 'family' | 'business';
}
