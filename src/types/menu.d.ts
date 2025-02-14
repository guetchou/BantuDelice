
export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  available: boolean;
  restaurant_id: string;
  customization_options?: CustomizationOption[];
  popularity_score?: number;
  dietary_preferences?: string[];
  cuisine_type?: string;
}

export interface CustomizationOption {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  options: {
    id: string;
    name: string;
    price: number;
  }[];
}
