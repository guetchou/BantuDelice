
import { MenuItem } from "@/types/menu";
import { CartItem } from "@/types/cart";

export interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: CartItem) => void;
  onRemoveFromCart?: (itemId: string) => void;
  quantity?: number;
  showNutritionalInfo?: boolean;
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
