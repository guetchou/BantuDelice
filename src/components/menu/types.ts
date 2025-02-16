
import type { CartItem } from '@/types/cart';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  is_available: boolean;
  restaurant_id: string;
  created_at: string;
  updated_at: string;
  customization_options?: Record<string, any>;
  dietary_preferences?: string[];
  cuisine_type?: string;
  popularity_score?: number;
  rating?: number;
  preparation_time?: number;
  available: boolean;
  allergens?: string[];
  nutritional_info?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export interface MenuListProps {
  items: MenuItem[];
  onAddToCart: (item: CartItem) => void;
  isLoading?: boolean;
  showNutritionalInfo?: boolean;
}

export interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: CartItem) => void;
  onRemoveFromCart: (itemId: string) => void;
  quantity: number;
  showNutritionalInfo?: boolean;
}
