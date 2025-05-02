
import { MenuItem } from "./restaurant";

export interface CartItem extends MenuItem {
  quantity: number;
  special_instructions?: string;
  selectedOptions?: CartItemOption[];
  menu_item_id?: string;
  combo_item?: boolean;
  options?: CartItemOption[];
  total?: number;
}

export interface CartItemOption {
  name: string;
  value: string;
  price_adjustment: number;
  id?: string;
  price?: number;
  quantity?: number;
}
