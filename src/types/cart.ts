
export interface CartItem {
  id: string;
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  description: string;
  restaurant_id: string;
  options: CartItemOption[];
  total: number;
}

export interface CartItemOption {
  id: string;
  name: string;
  value: string;
  price: number;
}
