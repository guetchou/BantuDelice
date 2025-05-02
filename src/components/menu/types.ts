import type { MenuItem } from "@/types/restaurant";
import type { CartItem } from "@/types/cart";

export interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: CartItem) => void;
  onRemoveFromCart?: (itemId: string) => void;
  quantity?: number;
  showNutritionalInfo?: boolean;
  onClick?: () => void;
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

export interface MenuListProps {
  items: MenuItem[];
  onAddToCart: (item: CartItem) => void;
  onRemoveFromCart?: (itemId: string) => void;
  getQuantity?: (itemId: string) => number;
  filter?: MenuFilter;
  isLoading?: boolean;
  showNutritionalInfo?: boolean;
}

// Export explicite du type MenuItem pour les autres modules
export type { MenuItem, CartItem };
