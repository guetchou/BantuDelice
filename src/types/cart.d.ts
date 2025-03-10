
export interface CartItem {
  id: string;
  name: string;
  price: number;
  restaurant_id: string;
  quantity: number;
  image_url?: string;
  category?: string;
  description?: string;
  customization_options?: Record<string, any>;
}
