
import { Database } from "@/integrations/supabase/database.types";

export interface OpeningHours {
  [key: string]: {
    open: string;
    close: string;
  };
}

export interface BusinessHours {
  regular: OpeningHours;
  special?: {
    date: string;
    hours: {
      open: string;
      close: string;
    };
  }[];
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  order: number;
}

export type PaymentMethod = 
  | 'cash'
  | 'credit_card'
  | 'debit_card'
  | 'mobile_money'
  | 'bank_transfer';

export type RestaurantService = 
  | 'dine_in'
  | 'takeaway'
  | 'delivery'
  | 'catering'
  | 'private_events';

export type RestaurantStatus = 
  | 'active'
  | 'inactive'
  | 'temporarily_closed'
  | 'coming_soon'
  | 'closed';

export interface Restaurant {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  banner_image_url?: string;
  logo_url?: string;
  cuisine_type?: string;
  address: string;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  phone?: string;
  email?: string;
  website?: string;
  social_media: SocialMedia;
  capacity?: number;
  delivery_radius?: number;
  minimum_order?: number;
  delivery_fee?: number;
  tax_rate?: number;
  payment_methods: PaymentMethod[];
  services: RestaurantService[];
  status: RestaurantStatus;
  business_hours: BusinessHours;
  special_hours?: BusinessHours;
  holidays?: string[];
  tags: string[];
  features: string[];
  certifications: string[];
  average_prep_time?: number;
  menu_categories: MenuCategory[];
  order_count: number;
  total_revenue: number;
  average_ticket?: number;
  rating?: number;
  review_count: number;
  ambiance: string[];
  dress_code?: string;
  parking_options: string[];
  accessibility_features: string[];
  created_at: string;
  updated_at: string;
}

export interface DeliveryZone {
  id: string;
  restaurant_id: string;
  zone_name: string;
  delivery_fee?: number;
  minimum_order?: number;
  estimated_time?: number;
  area: any; // Geometry type from PostGIS
  created_at: string;
  updated_at: string;
}

export interface RestaurantPeakHours {
  id: string;
  restaurant_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  peak_level: 1 | 2 | 3 | 4 | 5;
  created_at: string;
  updated_at: string;
}

export interface RestaurantEvent {
  id: string;
  restaurant_id: string;
  event_name: string;
  description?: string;
  start_date: string;
  end_date: string;
  capacity?: number;
  price_per_person?: number;
  booking_required: boolean;
  event_type?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface RestaurantPromotion {
  id: string;
  restaurant_id: string;
  title: string;
  description?: string;
  discount_type: 'percentage' | 'fixed_amount' | 'free_delivery';
  discount_value: number;
  start_date: string;
  end_date: string;
  conditions?: string;
  usage_limit?: number;
  usage_count: number;
  minimum_order?: number;
  applicable_items?: string[];
  excluded_items?: string[];
  customer_type: string[];
  status: 'active' | 'inactive' | 'expired';
  created_at: string;
  updated_at: string;
}
