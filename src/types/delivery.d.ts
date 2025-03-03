
export interface DeliveryDriver {
  id: string;
  user_id: string;
  status: string;
  current_latitude: number;
  current_longitude: number;
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
  sender_id: string;
  sender_type: "driver" | "customer";
  message: string;
  created_at: string;
  read: boolean;
}

export interface OrderTrackingDetails {
  id: string;
  order_id: string;
  status: string;
  handled_by: string;
  notes: string;
  timestamp: string;
  updated_at: string;
  estimated_completion_time: string;
  location_data: any;
}
