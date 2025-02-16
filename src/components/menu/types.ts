
import type { CartItem } from '@/types/cart';

export interface MenuItemCardProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url?: string;
    category: string;
    dietary_preferences?: string[];
    nutritional_info?: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
    };
    ingredients?: string[];
    allergens?: string[];
    preparation_time?: number;
    rating?: number;
    popularity_score?: number;
    available: boolean;
  };
  onAddToCart: (item: CartItem) => void;
  onRemoveFromCart: (itemId: string) => void;
  quantity: number;
  showNutritionalInfo?: boolean;
}
