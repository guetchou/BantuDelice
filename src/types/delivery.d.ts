
export interface DeliveryDriver {
  id: string;
  name: string;
  phone: string;
  current_latitude?: number;
  current_longitude?: number;
  is_available: boolean;
  status: string;
  average_rating: number;
  total_deliveries: number;
  total_earnings: number;
  last_location_update?: string;
  vehicle_type?: string;
  profile_picture?: string;
  commission_rate?: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  current_location?: {
    latitude: number;
    longitude: number;
  };
}

export interface DeliveryRequest {
  id: string;
  order_id: string;
  restaurant_id: string;
  assigned_driver_id?: string;
  status: 'pending' | 'assigned' | 'picked_up' | 'delivering' | 'delivered' | 'cancelled';
  delivery_address: string;
  delivery_latitude?: number;
  delivery_longitude?: number;
  delivery_instructions?: string;
  priority: 'high' | 'medium' | 'low';
  delivery_fee: number;
  estimated_delivery_time?: string;
  actual_delivery_time?: string;
  created_at: string;
  updated_at?: string;
  assigned_at?: string;
  picked_up_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  contact_phone?: string;
  contact_name?: string;
  delivery_type: 'standard' | 'express' | 'scheduled';
  estimated_distance_km?: number;
  is_contactless_delivery?: boolean;
  verification_code?: string;
  payment_method?: string;
  tip_amount?: number;
  total_amount: number;
  accepted_at?: string;
}

export interface DeliveryVerification {
  id: string;
  driver_id: string;
  identity_document_url?: string;
  license_url?: string;
  document_type?: string;
  document_url?: string;
  document_number?: string;
  verification_status?: 'pending' | 'approved' | 'rejected';
  notes?: string;
  created_at: string;
  updated_at?: string;
  reviewer_id?: string;
  reviewed_at?: string;
}

export interface DeliverySettings {
  id: string;
  restaurant_id: string;
  enable_delivery: boolean;
  delivery_radius: number;
  minimum_order_amount: number;
  base_delivery_fee: number;
  use_own_drivers: boolean;
  use_external_drivers: boolean;
  active_external_services: string[];
  auto_assign_orders: boolean;
  delivery_time_estimate_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface DeliveryRoute {
  id: string;
  driver_id: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  start_time?: string;
  estimated_end_time?: string;
  actual_end_time?: string;
  total_distance_km?: number;
  total_time_minutes?: number;
  waypoints?: {
    latitude: number;
    longitude: number;
    type: 'pickup' | 'delivery';
    request_id: string;
    is_priority?: boolean;
  }[];
  delivery_requests?: string[];
  created_at: string;
  updated_at?: string;
}

export type DeliveryDriverStatus = 'available' | 'busy' | 'offline' | 'on_break';
export type DeliveryVehicleType = 'bike' | 'scooter' | 'car' | 'walk';
export type DeliveryStatus = 'pending' | 'assigned' | 'picked_up' | 'delivering' | 'delivered' | 'cancelled';
export type DeliveryPriority = 'high' | 'medium' | 'low';
export type DeliveryType = 'standard' | 'express' | 'scheduled';
