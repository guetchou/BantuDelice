-- Tables pour le système de géolocalisation Buntudelice

-- Table des localisations utilisateur
CREATE TABLE IF NOT EXISTS public.user_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('home', 'work', 'favorite', 'recent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des zones de livraison
CREATE TABLE IF NOT EXISTS public.delivery_zones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  center_latitude DECIMAL(10, 8) NOT NULL,
  center_longitude DECIMAL(11, 8) NOT NULL,
  radius_km DECIMAL(5, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) NOT NULL,
  min_order_amount DECIMAL(10, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des restaurants avec géolocalisation
CREATE TABLE IF NOT EXISTS public.restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cuisine_type TEXT NOT NULL,
  image_url TEXT,
  banner_image_url TEXT,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  min_order_amount DECIMAL(10, 2) DEFAULT 0,
  average_prep_time INTEGER DEFAULT 30, -- en minutes
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  phone TEXT,
  email TEXT,
  opening_hours JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des historiques de géolocalisation
CREATE TABLE IF NOT EXISTS public.location_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy DECIMAL(10, 2),
  address TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des points d'intérêt (POI)
CREATE TABLE IF NOT EXISTS public.points_of_interest (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('landmark', 'business', 'transport', 'other')),
  category TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT,
  description TEXT,
  phone TEXT,
  website TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_user_locations_user_id ON public.user_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_locations_type ON public.user_locations(type);
CREATE INDEX IF NOT EXISTS idx_restaurants_coordinates ON public.restaurants(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_restaurants_cuisine_type ON public.restaurants(cuisine_type);
CREATE INDEX IF NOT EXISTS idx_restaurants_is_active ON public.restaurants(is_active);
CREATE INDEX IF NOT EXISTS idx_location_history_user_id ON public.location_history(user_id);
CREATE INDEX IF NOT EXISTS idx_location_history_created_at ON public.location_history(created_at);
CREATE INDEX IF NOT EXISTS idx_points_of_interest_coordinates ON public.points_of_interest(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_points_of_interest_type ON public.points_of_interest(type);

-- RLS (Row Level Security) pour les localisations utilisateur
ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own locations" ON public.user_locations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own locations" ON public.user_locations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own locations" ON public.user_locations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own locations" ON public.user_locations
  FOR DELETE USING (auth.uid() = user_id);

-- RLS pour l'historique de géolocalisation
ALTER TABLE public.location_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own location history" ON public.location_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own location history" ON public.location_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS pour les restaurants (lecture publique)
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active restaurants" ON public.restaurants
  FOR SELECT USING (is_active = true);

-- RLS pour les zones de livraison (lecture publique)
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active delivery zones" ON public.delivery_zones
  FOR SELECT USING (is_active = true);

-- RLS pour les points d'intérêt (lecture publique)
ALTER TABLE public.points_of_interest ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active POIs" ON public.points_of_interest
  FOR SELECT USING (is_active = true);

-- Fonction pour calculer la distance entre deux points (formule de Haversine)
CREATE OR REPLACE FUNCTION public.calculate_distance(
  lat1 DECIMAL,
  lon1 DECIMAL,
  lat2 DECIMAL,
  lon2 DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
  R DECIMAL := 6371; -- Rayon de la Terre en kilomètres
  dLat DECIMAL;
  dLon DECIMAL;
  a DECIMAL;
  c DECIMAL;
BEGIN
  dLat := (lat2 - lat1) * PI() / 180;
  dLon := (lon2 - lon1) * PI() / 180;
  a := 
    SIN(dLat/2) * SIN(dLat/2) +
    COS(lat1 * PI() / 180) * COS(lat2 * PI() / 180) * 
    SIN(dLon/2) * SIN(dLon/2);
  c := 2 * ATAN2(SQRT(a), SQRT(1-a));
  RETURN R * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Fonction pour trouver les restaurants à proximité
CREATE OR REPLACE FUNCTION public.find_nearby_restaurants(
  user_lat DECIMAL,
  user_lon DECIMAL,
  radius_km DECIMAL DEFAULT 5
) RETURNS TABLE (
  id UUID,
  name TEXT,
  cuisine_type TEXT,
  image_url TEXT,
  average_rating DECIMAL,
  delivery_fee DECIMAL,
  min_order_amount DECIMAL,
  average_prep_time INTEGER,
  latitude DECIMAL,
  longitude DECIMAL,
  address TEXT,
  distance_km DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.name,
    r.cuisine_type,
    r.image_url,
    r.average_rating,
    r.delivery_fee,
    r.min_order_amount,
    r.average_prep_time,
    r.latitude,
    r.longitude,
    r.address,
    public.calculate_distance(user_lat, user_lon, r.latitude, r.longitude) as distance_km
  FROM public.restaurants r
  WHERE r.is_active = true
    AND r.latitude IS NOT NULL
    AND r.longitude IS NOT NULL
    AND public.calculate_distance(user_lat, user_lon, r.latitude, r.longitude) <= radius_km
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql STABLE;

-- Fonction pour déterminer la zone de livraison
CREATE OR REPLACE FUNCTION public.get_delivery_zone(
  lat DECIMAL,
  lon DECIMAL
) RETURNS TABLE (
  id UUID,
  name TEXT,
  delivery_fee DECIMAL,
  min_order_amount DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dz.id,
    dz.name,
    dz.delivery_fee,
    dz.min_order_amount
  FROM public.delivery_zones dz
  WHERE dz.is_active = true
    AND public.calculate_distance(lat, lon, dz.center_latitude, dz.center_longitude) <= dz.radius_km
  ORDER BY public.calculate_distance(lat, lon, dz.center_latitude, dz.center_longitude)
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

-- Fonction pour nettoyer l'historique de géolocalisation ancien
CREATE OR REPLACE FUNCTION public.cleanup_location_history(
  days_to_keep INTEGER DEFAULT 30
) RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.location_history
  WHERE created_at < NOW() - INTERVAL '1 day' * days_to_keep;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_locations_updated_at
  BEFORE UPDATE ON public.user_locations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_restaurants_updated_at
  BEFORE UPDATE ON public.restaurants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Données de test pour les zones de livraison (Brazzaville)
INSERT INTO public.delivery_zones (name, description, center_latitude, center_longitude, radius_km, delivery_fee, min_order_amount) VALUES
('Centre-ville', 'Zone centrale de Brazzaville', -4.2634, 15.2429, 5.0, 500, 0),
('Nord Brazzaville', 'Zone nord de Brazzaville', -4.2134, 15.2429, 8.0, 1000, 0),
('Sud Brazzaville', 'Zone sud de Brazzaville', -4.3134, 15.2429, 8.0, 1000, 0),
('Est Brazzaville', 'Zone est de Brazzaville', -4.2634, 15.2929, 8.0, 1000, 0),
('Ouest Brazzaville', 'Zone ouest de Brazzaville', -4.2634, 15.1929, 8.0, 1000, 0);

-- Données de test pour les restaurants
INSERT INTO public.restaurants (name, description, cuisine_type, image_url, average_rating, delivery_fee, min_order_amount, average_prep_time, latitude, longitude, address) VALUES
('Le Gourmet Africain', 'Cuisine africaine traditionnelle', 'african', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop', 4.5, 500, 2000, 25, -4.2634, 15.2429, '123 Avenue de la Paix, Brazzaville'),
('Pizza Express', 'Pizzas italiennes authentiques', 'pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop', 4.2, 600, 3000, 30, -4.2734, 15.2529, '456 Boulevard du Commerce, Brazzaville'),
('Sushi Bar', 'Sushi et cuisine japonaise', 'japanese', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=2070&auto=format&fit=crop', 4.7, 800, 5000, 35, -4.2534, 15.2329, '789 Rue de la Gastronomie, Brazzaville'),
('Burger House', 'Burgers gourmets et fast-food', 'burger', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2070&auto=format&fit=crop', 4.0, 400, 1500, 20, -4.2834, 15.2629, '321 Avenue des Saveurs, Brazzaville'),
('Café Central', 'Café et pâtisseries françaises', 'french', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=2070&auto=format&fit=crop', 4.3, 300, 1000, 15, -4.2434, 15.2229, '654 Place du Marché, Brazzaville');

-- Données de test pour les points d'intérêt
INSERT INTO public.points_of_interest (name, type, category, latitude, longitude, address, description) VALUES
('Aéroport Maya-Maya', 'transport', 'airport', -4.2516, 15.2534, 'Aéroport Maya-Maya, Brazzaville', 'Aéroport international de Brazzaville'),
('Gare Centrale', 'transport', 'train_station', -4.2634, 15.2429, 'Gare Centrale, Brazzaville', 'Gare ferroviaire principale'),
('Marché Total', 'business', 'market', -4.2734, 15.2529, 'Marché Total, Brazzaville', 'Grand marché central'),
('Hôpital Central', 'business', 'hospital', -4.2534, 15.2329, 'Hôpital Central, Brazzaville', 'Hôpital principal de la ville'),
('Université Marien Ngouabi', 'business', 'education', -4.2834, 15.2629, 'Université Marien Ngouabi, Brazzaville', 'Université principale');

-- Commentaires sur les tables
COMMENT ON TABLE public.user_locations IS 'Localisations sauvegardées par les utilisateurs';
COMMENT ON TABLE public.delivery_zones IS 'Zones de livraison avec tarifs';
COMMENT ON TABLE public.restaurants IS 'Restaurants avec géolocalisation';
COMMENT ON TABLE public.location_history IS 'Historique des positions utilisateur';
COMMENT ON TABLE public.points_of_interest IS 'Points d''intérêt et repères'; 