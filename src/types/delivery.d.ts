
export interface DeliveryDriver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  current_latitude: number;
  current_longitude: number;
  is_available: boolean;
  status: string;
  average_rating: number;
  total_deliveries: number;
  total_earnings: number;
  commission_rate: number;
  created_at: string;
  updated_at: string;
  last_location_update: string;
}

export interface DeliveryMessage {
  id: string;
  order_id: string;
  sender_type: "driver" | "customer";
  sender_id: string;
  message: string;
  created_at: string;
}

export interface DeliveryRequest {
  id: string;
  order_id: string;
  driver_id: string | null;
  status: "pending" | "accepted" | "completed" | "cancelled" | "in_progress";
  pickup_latitude: number;
  pickup_longitude: number;
  dropoff_latitude: number;
  dropoff_longitude: number;
  created_at: string;
  accepted_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  notes?: string;
}

export type DeliveryDriverStatus = 
  | "online" 
  | "offline" 
  | "busy" 
  | "on_break";

export type DeliveryStatus = 
  | "pending" 
  | "accepted" 
  | "in_progress" 
  | "completed" 
  | "cancelled";

export interface DeliveryDriverRating {
  id: string;
  driver_id: string;
  user_id: string;
  order_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}
