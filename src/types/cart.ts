
export interface CartItemOption {
  id: string;
  name: string;
  value: string;
  price: number;
  quantity: number;
  price_adjustment: number;
}

export interface CartItem {
  id: string;
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  restaurant_id: string;
  special_instructions?: string;
  combo_item?: boolean;
  options: CartItemOption[];
  description: string;
  image_url: string;
  category?: string;
}
