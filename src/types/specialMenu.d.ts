
import { Database } from "@/integrations/supabase/database.types";

export type SpecialMenu = Database['public']['Tables']['special_menus']['Row'];
export type SpecialMenuInsert = Database['public']['Tables']['special_menus']['Insert'];
export type SpecialMenuUpdate = Database['public']['Tables']['special_menus']['Update'];

export type MenuType = 'seasonal' | 'holiday' | 'event' | 'daily_special';

export interface MenuItem {
  name: string;
  description?: string;
  price: number;
}

