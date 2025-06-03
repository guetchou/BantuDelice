
import { MenuItem } from '@/types/globalTypes';

export interface ExtendedMenuItem extends MenuItem {
  profit_margin?: number;
  popularity_score?: number;
  sales_volume?: number;
  last_ordered?: string;
}
