
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  restaurant_id: string;
  available: boolean;
  created_at: string;
  updated_at?: string;
  ingredients?: string[];
  rating?: number;
  preparation_time?: number;
  dietary_preferences?: string[];
  customization_options?: Record<string, any>;
  nutritional_info?: {
    calories: number | null;
    protein: number | null;
    carbs: number | null;
    fat: number | null;
    fiber: number | null;
  };
  allergens?: string[];
  popularity_score?: number;
}

export interface Table {
  id: string;
  restaurant_id: string;
  table_number: number | string;
  capacity: number;
  minimum_guests: number;
  maximum_guests: number;
  is_available?: boolean;
  location: string;
  created_at: string;
  updated_at: string;
  status?: string;
  is_accessible?: boolean;
  notes?: string;
}

export interface Reservation {
  id: string;
  restaurant_id: string;
  table_id: string;
  user_id?: string;
  reservation_date: string;
  party_size: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  special_requests?: string;
  contact_phone: string;
  contact_email?: string;
  estimated_duration_minutes: number;
  created_at: string;
  updated_at: string;
  
  // Champs additionnels pour compatibilité
  arrival_time?: string;
  departure_time?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  dietary_restrictions?: string[];
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
  cuisine_type: string[] | string;
  price_range: number;
  average_rating: number;
  total_ratings: number;
  featured: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive' | 'pending' | string;
  business_hours: BusinessHours | any;
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
  }[] | any;
  contact_phone: string;
  contact_email: string;
  is_open: boolean;
  estimated_delivery_time: number;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website?: string;
  logo_url?: string;
  banner_image_url?: string;
  cuisine_type: string[] | string;
  price_range: number;
  rating?: number;
  average_rating?: number;
  opening_hours?: BusinessHours | any;
  business_hours?: any;
  status: 'open' | 'busy' | 'closed' | string;
  is_open?: boolean;
}

export interface RestaurantFilters {
  cuisine: string[];
  price: number[];
  rating: number | null;
  distance: number | null;
  openNow: boolean;
  sortBy: 'distance' | 'rating' | 'price' | string;
}

export type RestaurantViewMode = 'grid' | 'map' | 'list';
