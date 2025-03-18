
export interface DetailedRestaurantReview {
  id: string;
  restaurant_id: string;
  user_id: string;
  order_id: string;
  overall_rating: number;
  food_quality_rating: number;
  service_rating: number;
  delivery_rating: number;
  value_rating: number;
  review_text: string | null;
  photos: string[] | null;
  helpful_count: number;
  verified_purchase: boolean;
  created_at: string;
  updated_at: string;
}

export interface RestaurantReview {
  id: string;
  restaurant_id: string;
  user_id: string;
  order_id?: string;
  rating: number;
  review_text?: string;
  created_at: string;
  updated_at?: string;
  user?: {
    id: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
}

export interface AggregatedReviews {
  overall_rating: number;
  food_quality_rating: number;
  service_rating: number;
  delivery_rating: number;
  value_rating: number;
  total_reviews: number;
}
