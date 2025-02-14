
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  customization_options?: {
    name: string;
    value: string;
    price: number;
  }[];
}
