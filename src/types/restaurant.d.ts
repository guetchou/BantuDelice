
export interface Table {
  id: string;
  restaurant_id: string;
  table_number: number;
  capacity: number;
  minimum_guests: number;
  maximum_guests: number;
  is_available: boolean;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  restaurant_id: string;
  table_id: string;
  user_id: string;
  reservation_date: string;
  party_size: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  special_requests?: string;
  contact_phone: string;
  contact_email?: string;
  estimated_duration_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface BusinessDay {
  open: string;
  close: string;
  is_closed: boolean;
}

export interface BusinessHours {
  regular: {
    monday: BusinessDay;
    tuesday: BusinessDay;
    wednesday: BusinessDay;
    thursday: BusinessDay;
    friday: BusinessDay;
    saturday: BusinessDay;
    sunday: BusinessDay;
  };
  special?: {
    date: string;
    open: string;
    close: string;
    is_closed: boolean;
  }[];
}

export interface RestaurantDetails {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  website?: string;
  email: string;
  logo_url?: string;
  banner_image_url?: string;
  cuisine_type: string[];
  price_range: number;
  average_rating: number;
  total_ratings: number;
  featured: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive' | 'pending';
  business_hours: BusinessHours;
  delivery_radius?: number;
  minimum_order?: number;
  payment_methods: string[];
  tags?: string[];
  opening_date?: string;
  special_features?: string[];
  delivery_fee?: number;
  free_delivery_min?: number;
  special_days?: {
    date: string;
    name: string;
    open: string;
    close: string;
    is_closed: boolean;
  }[];
  contact_phone: string;
  contact_email: string;
  is_open: boolean;
  estimated_delivery_time: number;
}

export type RestaurantStatus = 'open' | 'busy' | 'closed';
