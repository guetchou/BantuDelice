
export interface DeliveryDriver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  status: 'available' | 'busy' | 'offline';
  current_latitude: number;
  current_longitude: number;
  current_location?: {
    latitude: number;
    longitude: number;
  };
  last_location_update: string;
  current_order_id?: string;
  total_deliveries: number;
  average_rating: number;
  commission_rate: number;
  total_earnings: number;
  is_available: boolean;
  updated_at: string;
  created_at: string;
  distance?: number;
  estimated_time?: number;
  vehicle_type?: 'bike' | 'car' | 'scooter' | 'walk';
  profile_picture?: string;
  is_external?: boolean;
  service_id?: string;
}

export interface DeliveryRequest {
  id: string;
  order_id: string;
  restaurant_id: string;
  customer_id: string;
  pickup_address: string;
  delivery_address: string;
  status: 'pending' | 'assigned' | 'picked_up' | 'delivered' | 'cancelled';
  assigned_driver_id?: string;
  pickup_time?: string;
  delivery_time?: string;
  distance?: number;
  estimated_duration?: number;
  delivery_fee: number;
  special_instructions?: string;
  is_priority: boolean;
  external_service_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DeliveryTracking {
  id: string;
  delivery_request_id: string;
  order_id: string;
  driver_id: string;
  status: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  updated_at: string;
  picked_up_at?: string;
  delivered_at?: string;
  notes?: string;
}

export interface DeliveryMessage {
  id: string;
  delivery_request_id: string;
  order_id?: string;
  sender_id?: string;
  sender_type: 'driver' | 'customer';
  message: string;
  read?: boolean;
  created_at?: string;
}

export interface DeliverySettings {
  id: string;
  restaurant_id: string;
  allow_restaurant_delivery: boolean;
  allow_external_delivery: boolean;
  default_delivery_radius: number;
  base_delivery_fee: number;
  fee_per_km: number;
  min_order_amount_for_delivery: number;
  free_delivery_min_amount: number;
  estimated_preparation_time: number;
  priority_delivery_fee: number;
  active_external_services: string[];
  created_at: string;
  updated_at: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  description?: string;
  polygon: any;
  active: boolean;
  minimum_order: number;
  base_delivery_fee: number;
  estimated_delivery_time: {
    min: number;
    max: number;
  };
  created_at: string;
  updated_at?: string;
}

export interface DeliveryRating {
  id: string;
  driver_id: string;
  user_id: string;
  order_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface ExternalDeliveryService {
  id: string;
  name: string;
  logo_url?: string;
  base_fee: number;
  fee_per_km?: number;
  estimated_time: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
