
export interface OrderTrackingDetails {
  id: string;
  order_id: string;
  status: 'preparing' | 'ready' | 'picked_up' | 'delivering' | 'delivered';
  timestamp: string;
  updated_at: string;
  estimated_delivery_time?: string;
  estimated_completion_time?: string;
  notes?: string;
  handled_by?: string;
  location_data?: any;
}
