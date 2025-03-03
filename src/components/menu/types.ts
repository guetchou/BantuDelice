
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  available: boolean;
  restaurant_id: string;
  dietary_preferences?: string[];
  customization_options: Record<string, any>;
  popularity_score?: number;
  cuisine_type?: string;
  created_at: string;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export interface MenuFilter {
  category?: string;
  dietary?: string[];
  priceRange?: [number, number];
  searchQuery?: string;
}
