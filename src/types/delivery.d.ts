
// Types pour les livraisons
export interface DeliveryDriver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  current_latitude: number | null;
  current_longitude: number | null;
  current_location?: string;
  is_available: boolean;
  status: 'online' | 'offline' | 'delivering' | 'available' | 'busy' | 'on_break' | string;
  vehicle_type?: 'bike' | 'car' | 'scooter' | 'walk' | string;
  total_deliveries: number;
  average_rating: number;
  profile_picture?: string;
  restaurant_id?: string;
  commission_rate: number;
  total_earnings: number;
  created_at: string;
  updated_at: string;
  last_location_update?: string;
}

export interface DeliveryRequest {
  id: string;
  order_id: string;
  restaurant_id: string;
  status: DeliveryStatus | string;
  pickup_address: string;
  pickup_latitude: number | null;
  pickup_longitude: number | null;
  delivery_address: string;
  delivery_latitude: number | null;
  delivery_longitude: number | null;
  assigned_driver_id?: string;
  requested_at: string;
  accepted_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  delivery_fee: number;
  is_external: boolean;
  external_service_id?: string;
  notes?: string;
  priority: 'normal' | 'high' | 'urgent' | string;
  estimated_distance: number | null;
  estimated_duration: number | null;
  delivery_time?: string;
  delivery_instructions?: string;
  pickup_time?: string;
  distance_km?: number;
  delivery_type?: DeliveryType; // Ajout pour la compatibilité avec le code existant
}

export interface DeliveryZone {
  id: string;
  name: string;
  description: string;
  polygon: any; // JSONB dans la base de données
  base_delivery_fee: number;
  minimum_order: number;
  estimated_time_range: {
    min: number;
    max: number;
  } | any;
  active: boolean;
  restaurant_id?: string;
  created_at: string;
}

export interface DeliveryTracking {
  id: string;
  delivery_request_id: string;
  driver_id: string;
  order_id: string;
  status: 'assigned' | 'picked_up' | 'on_the_way' | 'delivered' | 'failed' | string;
  latitude: number;
  longitude: number;
  timestamp: string;
  notes?: string;
  delivered_at?: string;
  picked_up_at?: string;
  updated_at?: string;
  delivery_user_id?: string;
}

export interface ExternalDeliveryService {
  id: string;
  name: string;
  logo_url?: string;
  base_fee: number;
  fee_per_km?: number;
  base_distance?: number; // km covered by base fee
  minimum_fee: number;
  estimated_pickup_time: number; // minutes
  contact_phone: string;
  contact_email?: string;
  api_key?: string;
  api_url?: string;
  is_active: boolean;
  service_areas: string[] | any; // JSON array of area names
  commission_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface DeliverySettings {
  restaurant_id: string;
  allow_restaurant_delivery: boolean;
  allow_external_delivery: boolean;
  default_delivery_fee: number;
  free_delivery_threshold?: number;
  max_delivery_distance: number;
  estimated_delivery_time: number;
  accepted_external_services: string[] | any;
  custom_delivery_fees?: {
    zone_id: string;
    fee: number;
  }[] | any;
  delivery_hours: {
    day: string;
    open: string;
    close: string;
  }[] | any;
  auto_accept_orders: boolean;
  auto_assign_drivers: boolean;
}

export interface DeliveryMessage {
  id: string;
  delivery_request_id: string;
  sender_id: string;
  sender_type: 'driver' | 'customer' | 'restaurant' | string;
  message: string;
  created_at: string;
  read: boolean;
  order_id?: string;
}

// Type pour la notation des livreurs
export interface DeliveryDriverRating {
  id: string;
  delivery_request_id: string;
  order_id: string;
  driver_id: string;
  user_id: string;
  speed_rating: number;
  politeness_rating: number;
  overall_rating: number;
  comment?: string;
  created_at: string;
}

// Interface pour les méthodes de paiement utilisateur
export interface UserPaymentMethod {
  id: string;
  user_id: string;
  payment_type: string;
  provider: string;
  last_four?: string;
  expiry_date?: string;
  is_default: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  last_used?: string;
}

export type DeliveryStatus = 'pending' | 'assigned' | 'picked_up' | 'delivering' | 'delivered' | 'failed' | 'completed' | 'accepted' | 'rejected' | 'cancelled' | 'on_the_way' | string;
export type DeliveryType = 'restaurant' | 'external' | 'pickup' | string;
