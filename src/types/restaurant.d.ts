export interface Restaurant {
  id: string;
  name: string;
  address: string;
  description: string;
  phone: string;
  status: string;
  cuisine_type?: string;
  logo_url?: string;
  banner_url?: string;
  rating?: number;
  delivery_time?: number;
  delivery_fee?: number;
  minimum_order?: number;
  is_open?: boolean;
  opening_hours?: BusinessHours;
  categories?: MenuCategory[];
  menu_items?: MenuItem[];
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface Table {
  id: string;
  tableNumber: string;
  location: string;
  capacity: number;
  minimum_guests: number;
  maximum_guests: number;
  is_available?: boolean;
  is_accessible?: boolean;
  notes?: string;
}

export interface BusinessHours {
  monday?: { open: string; close: string };
  tuesday?: { open: string; close: string };
  wednesday?: { open: string; close: string };
  thursday?: { open: string; close: string };
  friday?: { open: string; close: string };
  saturday?: { open: string; close: string };
  sunday?: { open: string; close: string };
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  items?: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category_id?: string;
  category_name?: string;
  restaurant_id?: string;
  is_available?: boolean;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  allergens?: string[];
  nutritional_info?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  preparation_time?: number;
  options?: MenuItemOption[];
  variations?: MenuItemVariation[];
  popular?: boolean;
  spicy_level?: number;
  tags?: string[];
}

export interface MenuItemOption {
  id: string;
  name: string;
  required?: boolean;
  multiple?: boolean;
  min_selections?: number;
  max_selections?: number;
  choices: MenuItemOptionChoice[];
}

export interface MenuItemOptionChoice {
  id: string;
  name: string;
  price_adjustment: number;
}

export interface MenuItemVariation {
  id: string;
  name: string;
  price: number;
  is_available?: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  success?: boolean;
  error?: string;
  message?: string;
  [key: string]: any;
}
