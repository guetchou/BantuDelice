
import { any } from "@/integrations/supabase/database.types";

export type Favorite = any['public']['Tables']['favorites']['Row'];
export type FavoriteInsert = any['public']['Tables']['favorites']['Insert'];
export type FavoriteUpdate = any['public']['Tables']['favorites']['Update'];
