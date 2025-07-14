
import { MenuItem } from './globalTypes';

export interface MenuCustomization {
  id: string;
  name: string;
  type: 'radio' | 'checkbox' | 'select';
  required: boolean;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  price_adjustment: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

export { MenuItem };
