
import type { MenuItem } from '@/types/menu';

export interface CartItem extends Omit<MenuItem, 'customization_options'> {
  quantity: number;
  options?: Array<{
    name: string;
    value: string;
    price: number;
  }>;
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
