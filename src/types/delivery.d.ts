
export interface DeliveryRequest {
  id: string;
  order_id: string;
  driver_id?: string;
  status: DeliveryStatus;
  created_at: string;
  updated_at: string;
  
  // Propriétés requises d'après les erreurs
  pickup_latitude?: number;
  pickup_longitude?: number;
  delivery_latitude?: number;
  delivery_longitude?: number;
  pickup_address?: string;
  delivery_address?: string;
  
  // Propriétés étendues
  restaurant_id?: string;
  customer_id?: string;
  delivery_instructions?: string;
  estimated_delivery_time?: string;
  actual_delivery_time?: string;
  distance?: number;
  estimated_duration?: number;
  is_priority?: boolean;
  is_external?: boolean;
  assigned_driver_id?: string;
  requested_at?: string;
  accepted_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  delivery_fee?: number;
  external_service_id?: string;
  
  // Informations client
  customer_name?: string;
  customer_phone?: string;
  notes?: string;
  priority?: string;
}

export type DeliveryStatus = 
  | 'pending'
  | 'assigned'
  | 'accepted'
  | 'picked_up'
  | 'delivering'
  | 'delivered'
  | 'cancelled';

export interface DeliveryDriver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  current_latitude: number;
  current_longitude: number;
  is_available: boolean;
  vehicle_type: string;
  status: string;
  
  // Propriétés additionnelles
  photo_url?: string;
  profile_picture?: string;
  profile_image?: string;
  rating?: number;
  average_rating?: number;
  vehicle_info?: {
    model: string;
    plate: string;
    color: string;
    make?: string;
  };
  languages?: string[];
  years_experience?: number;
  total_rides?: number;
  current_location?: {
    latitude: number;
    longitude: number;
  };
  last_active?: string;
  license_number?: string;
  verified?: boolean;
  
  // Propriétés étendues
  total_deliveries?: number;
  vehicle_model?: string;
  vehicle_make?: string;
  vehicle_color?: string;
  license_plate?: string;
  max_concurrent_deliveries?: number;
  current_deliveries?: number;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface DeliveryLocation {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp?: string;
  // Propriétés additionnelles
  name?: string;
  type?: 'pickup' | 'delivery' | 'driver' | 'restaurant' | 'customer' | 'dropoff';
}

export interface DeliveryRoute {
  id: string;
  driver_id: string;
  // Propriétés additionnelles
  delivery_requests: string[];
  status: string;
  estimated_duration: number;
  total_distance: number;
  waypoints?: DeliveryLocation[];
  start_time?: string;
  estimated_end_time?: string;
  actual_end_time?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DeliveryMessage {
  id: string;
  order_id: string;
  sender_id: string;
  sender_type: 'driver' | 'customer';
  message: string;
  read: boolean;
  created_at: string;
}

export interface DeliverySettings {
  id: string;
  restaurant_id: string;
  allow_restaurant_delivery: boolean;
  allow_external_delivery: boolean;
  default_delivery_fee: number;
  free_delivery_threshold: number;
  max_delivery_distance: number;
  delivery_hours?: {
    monday: { open: string; close: string; is_closed: boolean };
    tuesday: { open: string; close: string; is_closed: boolean };
    wednesday: { open: string; close: string; is_closed: boolean };
    thursday: { open: string; close: string; is_closed: boolean };
    friday: { open: string; close: string; is_closed: boolean };
    saturday: { open: string; close: string; is_closed: boolean };
    sunday: { open: string; close: string; is_closed: boolean };
  };
  min_order_value: number;
  delivery_radius: number;
  delivery_fee_base: number;
  delivery_fee_per_km: number;
  estimated_delivery_time?: number;
  auto_accept_orders?: boolean;
  auto_assign_drivers?: boolean;
  accepted_external_services?: string[];
}

export interface ExternalDeliveryService {
  id: string;
  name: string;
  logo_url: string;
  api_key: string;
  active: boolean;
  integration_type: string;
  base_fee: number;
  fee_per_km: number;
}
