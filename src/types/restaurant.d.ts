
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  logo_url?: string;
  banner_image_url?: string;
  cuisine_type?: string;
  min_order?: number;
  delivery_fee?: number;
  business_hours?: BusinessHours;
  rating?: number;
  average_rating?: number;
  status?: string;
  is_open?: boolean;
  services?: string[];
  features?: string[];
  special_features?: string[];
  opening_hours?: BusinessHours;
  price_range?: any;
  estimated_delivery_time?: number | string;
  trending?: boolean;
  restaurant_id?: string;
  user_id?: string;
  created_at?: string;
}
