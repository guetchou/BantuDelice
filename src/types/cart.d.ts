
import { MenuItem } from './restaurant';

export interface CartItem {
  id: string;
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  description?: string;
  image_url?: string;
  restaurant_id: string;
  category?: string;
  special_instructions?: string;
  fiber?: number;
  customization_options?: any[];
}
