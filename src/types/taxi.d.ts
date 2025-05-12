
export interface BusinessRateEstimate {
  baseDiscount: number;
  volumeDiscount: number;
  totalDiscount: number;
  standardRate: number;
  businessRate: number;
  monthlySavings: number;
  annualSavings: number;
}

export interface BusinessRateFormData {
  companyName: string;
  contactEmail: string;
  monthlyRides: number;
  averageDistance: number;
  vehicleType: string;
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
}

export interface TaxiSubscriptionPlan {
  id: string;
  name: string;
  price: number;
  benefits: string[];
  description: string;
  is_popular?: boolean;
}
