
import { Database } from "@/integrations/supabase/database.types";

export type DetailedRestaurantReview = Database['public']['Tables']['detailed_restaurant_reviews']['Row'];
export type DetailedRestaurantReviewInsert = Database['public']['Tables']['detailed_restaurant_reviews']['Insert'];
export type DetailedRestaurantReviewUpdate = Database['public']['Tables']['detailed_restaurant_reviews']['Update'];

export interface ReviewRatings {
  overall: number;
  foodQuality: number;
  service: number;
  delivery: number;
  value: number;
}
