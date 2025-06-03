
import { MenuItem } from '@/types/globalTypes';

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  phone?: string;
  status: 'pending' | 'approved' | 'suspended';
  image_url?: string;
  rating?: number;
  estimated_preparation_time: number;
  cuisine_type?: string;
  distance?: number;
  menu_items?: MenuItem[];
}
