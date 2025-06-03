
import { MenuItem } from '@/types/globalTypes';

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  price_range: number;
  cuisine_type?: string;
  rating?: number;
  average_rating?: number;
  is_open?: boolean;
  opening_hours?: any;
  delivery_fee?: number;
  minimum_order?: number;
  estimated_delivery_time?: number;
  estimated_preparation_time: number;
  average_prep_time?: number;
  image_url?: string;
  logo_url?: string;
  banner_url?: string;
  banner_image_url?: string;
  features?: string[];
  created_at?: string;
  updated_at?: string;
  status: 'pending' | 'approved' | 'suspended';
  distance?: number;
  menu_items?: MenuItem[];
  trending?: boolean;
}

export { MenuItem };
