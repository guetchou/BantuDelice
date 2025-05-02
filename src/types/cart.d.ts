
import { MenuItem } from "./restaurant";

export interface CartItem extends MenuItem {
  quantity: number;
  special_instructions?: string;
  selectedOptions?: CartItemOption[];
}

export interface CartItemOption {
  name: string;
  value: string;
  price_adjustment: number;
}
