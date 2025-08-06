
import { any } from "@/integrations/supabase/database.types";

export type Review = any['public']['Tables']['reviews']['Row'];
export type ReviewInsert = any['public']['Tables']['reviews']['Insert'];
export type ReviewUpdate = any['public']['Tables']['reviews']['Update'];
