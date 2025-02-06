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