
export interface DeliveryDriver {
  id: string;
  user_id: string;
  status: 'available' | 'busy' | 'offline';
  current_latitude: number;
  current_longitude: number;
  last_location_update: string;
  current_order_id?: string;
  total_deliveries: number;
  average_rating: number;
  created_at: string;
  updated_at: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  coordinates: any; // Type géométrique
  active: boolean;
  base_delivery_fee: number;
  estimated_delivery_time: number;
  created_at: string;
  updated_at: string;
}

export interface DeliveryMessage {
  id: string;
  order_id: string;
  sender_type: 'driver' | 'customer';
  sender_id: string;
  message: string;
  read: boolean;
  created_at: string;
}
