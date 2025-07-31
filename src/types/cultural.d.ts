
export interface CulturalEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string;
  image_url: string | null;
  price: number;
  capacity: number | null;
  registered_count: number;
  category: 'gastronomie' | 'musique' | 'danse' | 'art' | 'festival';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface CookingClass {
  id: string;
  title: string;
  description: string | null;
  chef_id: string;
  duration: number;
  price: number;
  max_participants: number;
  current_participants: number;
  schedule: string;
  difficulty_level: 'débutant' | 'intermédiaire' | 'avancé';
  cuisine_type: string;
  ingredients: Record<string, any>;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

export interface Recipe {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  ingredients: Record<string, any>;
  instructions: Record<string, any>;
  preparation_time: number | null;
  cooking_time: number | null;
  difficulty_level: 'facile' | 'moyen' | 'difficile';
  cuisine_type: string;
  image_url: string | null;
  likes_count: number;
  is_featured: boolean;
}

export interface FoodArtisan {
  id: string;
  business_name: string;
  description: string | null;
  specialty: string;
  location: string;
  contact_info: Record<string, any>;
  certification: string[];
  image_url: string | null;
  rating: number;
  is_verified: boolean;
}
