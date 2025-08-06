
import { any } from "@/integrations/supabase/database.types";

export type SpecialMenu = any['public']['Tables']['special_menus']['Row'];
export type SpecialMenuInsert = any['public']['Tables']['special_menus']['Insert'];
export type SpecialMenuUpdate = any['public']['Tables']['special_menus']['Update'];

export type MenuType = 'seasonal' | 'holiday' | 'event' | 'daily_special';

export interface MenuItem {
  name: string;
  description?: string;
  price: number;
}

