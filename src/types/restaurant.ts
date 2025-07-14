
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image_url: string;
  rating: number;
  average_rating: number;
  total_ratings: number;
  cuisine_type: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  is_open: boolean;
  business_hours: BusinessHours;
  min_order: number;
  delivery_fee: number;
  delivery_time: string;
  special_features: string[];
  payment_methods: string[];
  created_at: string;
  updated_at: string;
}

export interface BusinessHours {
  monday: { open: string; close: string; closed?: boolean };
  tuesday: { open: string; close: string; closed?: boolean };
  wednesday: { open: string; close: string; closed?: boolean };
  thursday: { open: string; close: string; closed?: boolean };
  friday: { open: string; close: string; closed?: boolean };
  saturday: { open: string; close: string; closed?: boolean };
  sunday: { open: string; close: string; closed?: boolean };
}

export interface Table {
  id: string;
  restaurant_id: string;
  table_number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  location?: string;
}

export interface RestaurantFilters {
  cuisine_type?: string;
  rating?: number;
  price_range?: string;
  delivery_time?: string;
  is_open?: boolean;
}

export interface SpecialHour {
  id: string;
  restaurant_id: string;
  date: string;
  open_time?: string;
  close_time?: string;
  is_closed: boolean;
  reason?: string;
}
