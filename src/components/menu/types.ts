export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category?: string;
  image_url?: string | null;
  restaurant_id?: string;
  available?: boolean;
  customization_options?: Record<string, any>;
  dietary_preferences?: string[];
  cuisine_type?: string;
  popularity_score?: number;
  rating?: number;
  preparation_time?: number;
  allergens?: string[];
  calories?: number;
  ingredients?: string[];
  seasonal?: boolean;
  featured?: boolean;
}