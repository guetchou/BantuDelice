export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  available: boolean;
  dietary_preferences: string[];
  category: string;
  cuisine_type: string;
  customization_options: any;
  popularity_score: number;
  restaurant_id: string;
  created_at: string;
}