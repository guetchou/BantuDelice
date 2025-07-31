-- Script d'initialisation pour les données de démonstration bantudelice
-- À exécuter dans l'éditeur SQL de Supabase

-- Créer la table demo_data
CREATE TABLE IF NOT EXISTS public.demo_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('restaurant', 'user', 'order', 'driver', 'review', 'promotion')),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Créer un index sur le type pour les requêtes rapides
CREATE INDEX IF NOT EXISTS idx_demo_data_type ON public.demo_data(type);
CREATE INDEX IF NOT EXISTS idx_demo_data_status ON public.demo_data(status);
CREATE INDEX IF NOT EXISTS idx_demo_data_created_at ON public.demo_data(created_at);

-- Activer RLS (Row Level Security)
ALTER TABLE public.demo_data ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux admins de tout faire
CREATE POLICY "Admins can manage demo data" ON public.demo_data
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'authenticated'
  );

-- Fonction pour créer la table si elle n'existe pas
CREATE OR REPLACE FUNCTION create_demo_data_table_if_not_exists()
RETURNS void AS $$
BEGIN
  -- La table est déjà créée par le script SQL
  -- Cette fonction est juste pour compatibilité
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour insérer des données de démonstration pré-configurées
CREATE OR REPLACE FUNCTION insert_demo_data_batch()
RETURNS void AS $$
BEGIN
  -- Insérer des restaurants de démonstration
  INSERT INTO public.demo_data (type, name, description, status, data) VALUES
  ('restaurant', 'Délices Congolais', 'Cuisine traditionnelle congolaise authentique', 'active', 
   '{"name": "Délices Congolais", "description": "Cuisine traditionnelle congolaise authentique", "cuisine_type": "Congolais", "address": "123 Avenue de la Paix, Brazzaville", "phone": "+242 123 456 789", "email": "contact@delicescongolais.com", "image_url": "/images/restaurants/delices-congolais.jpg", "latitude": 4.2634, "longitude": 15.2429, "delivery_radius": 10, "min_order_amount": 2000, "avg_preparation_time": 30, "is_open": true, "opening_hours": {"monday": {"open": "08:00", "close": "22:00"}, "tuesday": {"open": "08:00", "close": "22:00"}, "wednesday": {"open": "08:00", "close": "22:00"}, "thursday": {"open": "08:00", "close": "22:00"}, "friday": {"open": "08:00", "close": "23:00"}, "saturday": {"open": "09:00", "close": "23:00"}, "sunday": {"open": "10:00", "close": "21:00"}}}'),
  
  ('restaurant', 'Mami Wata', 'Restaurant de fruits de mer avec vue sur le fleuve', 'active',
   '{"name": "Mami Wata", "description": "Restaurant de fruits de mer avec vue sur le fleuve", "cuisine_type": "Poisson", "address": "45 Boulevard Marien Ngouabi, Brazzaville", "phone": "+242 987 654 321", "email": "info@mamiwata.com", "image_url": "/images/restaurants/mami-wata.jpg", "latitude": 4.2680, "longitude": 15.2855, "delivery_radius": 8, "min_order_amount": 3000, "avg_preparation_time": 25, "is_open": true, "opening_hours": {"monday": {"open": "07:00", "close": "21:00"}, "tuesday": {"open": "07:00", "close": "21:00"}, "wednesday": {"open": "07:00", "close": "21:00"}, "thursday": {"open": "07:00", "close": "21:00"}, "friday": {"open": "07:00", "close": "22:00"}, "saturday": {"open": "08:00", "close": "22:00"}, "sunday": {"open": "09:00", "close": "20:00"}}}'),
  
  ('restaurant', 'Le Poulet Moambe', 'Spécialiste du poulet moambe et plats traditionnels', 'active',
   '{"name": "Le Poulet Moambe", "description": "Spécialiste du poulet moambe et plats traditionnels", "cuisine_type": "Congolais", "address": "78 Rue de la Révolution, Brazzaville", "phone": "+242 555 123 456", "email": "contact@pouletmoambe.com", "image_url": "/images/restaurants/poulet-moambe.jpg", "latitude": 4.2650, "longitude": 15.2450, "delivery_radius": 12, "min_order_amount": 1500, "avg_preparation_time": 35, "is_open": true, "opening_hours": {"monday": {"open": "09:00", "close": "21:00"}, "tuesday": {"open": "09:00", "close": "21:00"}, "wednesday": {"open": "09:00", "close": "21:00"}, "thursday": {"open": "09:00", "close": "21:00"}, "friday": {"open": "09:00", "close": "22:00"}, "saturday": {"open": "10:00", "close": "22:00"}, "sunday": {"open": "11:00", "close": "20:00"}}}');

  -- Insérer des utilisateurs de démonstration
  INSERT INTO public.demo_data (type, name, description, status, data) VALUES
  ('user', 'John Doe', 'john.doe@example.com', 'active',
   '{"email": "john.doe@example.com", "first_name": "John", "last_name": "Doe", "phone": "+242 111 222 333", "address": "15 Rue de la République, Brazzaville", "role": "user"}'),
  
  ('user', 'Marie Ngouabi', 'marie.ngouabi@example.com', 'active',
   '{"email": "marie.ngouabi@example.com", "first_name": "Marie", "last_name": "Ngouabi", "phone": "+242 444 555 666", "address": "32 Avenue de l\'Indépendance, Brazzaville", "role": "user"}'),
  
  ('user', 'Pierre Mabiala', 'pierre.mabiala@example.com', 'active',
   '{"email": "pierre.mabiala@example.com", "first_name": "Pierre", "last_name": "Mabiala", "phone": "+242 777 888 999", "address": "8 Boulevard de la Paix, Brazzaville", "role": "user"}');

  -- Insérer des livreurs de démonstration
  INSERT INTO public.demo_data (type, name, description, status, data) VALUES
  ('driver', 'Jean-Baptiste Kimbouala', 'motorcycle - available', 'active',
   '{"name": "Jean-Baptiste Kimbouala", "phone": "+242 123 456 789", "email": "jean.kimbouala@example.com", "vehicle_type": "motorcycle", "status": "available", "current_latitude": 4.2634, "current_longitude": 15.2429, "average_rating": 4.8, "total_deliveries": 156}'),
  
  ('driver', 'Marie-Louise Nzila', 'car - available', 'active',
   '{"name": "Marie-Louise Nzila", "phone": "+242 987 654 321", "email": "marie.nzila@example.com", "vehicle_type": "car", "status": "available", "current_latitude": 4.2680, "current_longitude": 15.2855, "average_rating": 4.6, "total_deliveries": 89}'),
  
  ('driver', 'André Mpassi', 'motorcycle - busy', 'active',
   '{"name": "André Mpassi", "phone": "+242 555 123 456", "email": "andre.mpassi@example.com", "vehicle_type": "motorcycle", "status": "busy", "current_latitude": 4.2650, "current_longitude": 15.2450, "average_rating": 4.9, "total_deliveries": 234}');

  -- Insérer des commandes de démonstration
  INSERT INTO public.demo_data (type, name, description, status, data) VALUES
  ('order', 'Commande #1', '4500 FCFA - delivered', 'active',
   '{"user_id": 1, "restaurant_id": 1, "total_amount": 4500, "status": "delivered", "payment_status": "completed", "delivery_address": "15 Rue de la République, Brazzaville", "items": [{"name": "Poulet Moambe", "quantity": 2, "price": 2000}, {"name": "Fufu", "quantity": 1, "price": 500}]}'),
  
  ('order', 'Commande #2', '3200 FCFA - preparing', 'active',
   '{"user_id": 2, "restaurant_id": 2, "total_amount": 3200, "status": "preparing", "payment_status": "completed", "delivery_address": "32 Avenue de l\'Indépendance, Brazzaville", "items": [{"name": "Poisson Braisé", "quantity": 1, "price": 2500}, {"name": "Attieke", "quantity": 1, "price": 700}]}');

  -- Insérer des avis de démonstration
  INSERT INTO public.demo_data (type, name, description, status, data) VALUES
  ('review', 'Avis #1', '5/5 étoiles', 'active',
   '{"user_id": 1, "restaurant_id": 1, "rating": 5, "comment": "Excellent poulet moambe, très authentique !"}'),
  
  ('review', 'Avis #2', '4/5 étoiles', 'active',
   '{"user_id": 2, "restaurant_id": 2, "rating": 4, "comment": "Bon poisson, livraison rapide"}'),
  
  ('review', 'Avis #3', '5/5 étoiles', 'active',
   '{"user_id": 3, "restaurant_id": 3, "rating": 5, "comment": "Service impeccable, nourriture délicieuse"}');

  -- Insérer des promotions de démonstration
  INSERT INTO public.demo_data (type, name, description, status, data) VALUES
  ('promotion', 'Offre de Bienvenue', '20% de réduction sur votre première commande', 'active',
   '{"name": "Offre de Bienvenue", "description": "20% de réduction sur votre première commande", "discount_type": "percentage", "discount_value": 20, "min_order_amount": 3000, "start_date": "2024-01-01T00:00:00.000Z", "end_date": "2024-12-31T23:59:59.000Z", "code": "BIENVENUE20", "is_active": true, "usage_limit": 1000, "current_usage": 156}'),
  
  ('promotion', 'Livraison Gratuite', 'Livraison gratuite pour les commandes de plus de 5000 FCFA', 'active',
   '{"name": "Livraison Gratuite", "description": "Livraison gratuite pour les commandes de plus de 5000 FCFA", "discount_type": "free_delivery", "discount_value": 0, "min_order_amount": 5000, "start_date": "2024-01-01T00:00:00.000Z", "end_date": "2024-12-31T23:59:59.000Z", "code": "LIVRAISON0", "is_active": true, "usage_limit": 500, "current_usage": 89}');

END;
$$ LANGUAGE plpgsql;

-- Fonction pour synchroniser les données de démonstration avec les vraies tables
CREATE OR REPLACE FUNCTION sync_demo_data_to_real_tables()
RETURNS void AS $$
DECLARE
  demo_record RECORD;
BEGIN
  -- Synchroniser les restaurants
  FOR demo_record IN SELECT * FROM public.demo_data WHERE type = 'restaurant' AND status = 'active' LOOP
    INSERT INTO public.restaurants (
      name, description, cuisine_type, address, phone, email, 
      image_url, latitude, longitude, delivery_radius, 
      min_order_amount, avg_preparation_time, is_open, opening_hours
    ) VALUES (
      demo_record.data->>'name',
      demo_record.data->>'description',
      demo_record.data->>'cuisine_type',
      demo_record.data->>'address',
      demo_record.data->>'phone',
      demo_record.data->>'email',
      demo_record.data->>'image_url',
      (demo_record.data->>'latitude')::DECIMAL,
      (demo_record.data->>'longitude')::DECIMAL,
      (demo_record.data->>'delivery_radius')::INTEGER,
      (demo_record.data->>'min_order_amount')::INTEGER,
      (demo_record.data->>'avg_preparation_time')::INTEGER,
      (demo_record.data->>'is_open')::BOOLEAN,
      demo_record.data->'opening_hours'
    ) ON CONFLICT (name) DO UPDATE SET
      description = EXCLUDED.description,
      cuisine_type = EXCLUDED.cuisine_type,
      address = EXCLUDED.address,
      phone = EXCLUDED.phone,
      email = EXCLUDED.email,
      image_url = EXCLUDED.image_url,
      latitude = EXCLUDED.latitude,
      longitude = EXCLUDED.longitude,
      delivery_radius = EXCLUDED.delivery_radius,
      min_order_amount = EXCLUDED.min_order_amount,
      avg_preparation_time = EXCLUDED.avg_preparation_time,
      is_open = EXCLUDED.is_open,
      opening_hours = EXCLUDED.opening_hours,
      updated_at = NOW();
  END LOOP;

  -- Synchroniser les utilisateurs
  FOR demo_record IN SELECT * FROM public.demo_data WHERE type = 'user' AND status = 'active' LOOP
    INSERT INTO public.users (
      email, first_name, last_name, phone, role
    ) VALUES (
      demo_record.data->>'email',
      demo_record.data->>'first_name',
      demo_record.data->>'last_name',
      demo_record.data->>'phone',
      demo_record.data->>'role'
    ) ON CONFLICT (email) DO UPDATE SET
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      phone = EXCLUDED.phone,
      role = EXCLUDED.role,
      updated_at = NOW();
  END LOOP;

  -- Synchroniser les livreurs
  FOR demo_record IN SELECT * FROM public.demo_data WHERE type = 'driver' AND status = 'active' LOOP
    INSERT INTO public.delivery_drivers (
      name, phone, email, vehicle_type, status,
      current_latitude, current_longitude, average_rating, total_deliveries
    ) VALUES (
      demo_record.data->>'name',
      demo_record.data->>'phone',
      demo_record.data->>'email',
      demo_record.data->>'vehicle_type',
      demo_record.data->>'status',
      (demo_record.data->>'current_latitude')::DECIMAL,
      (demo_record.data->>'current_longitude')::DECIMAL,
      (demo_record.data->>'average_rating')::DECIMAL,
      (demo_record.data->>'total_deliveries')::INTEGER
    ) ON CONFLICT (email) DO UPDATE SET
      name = EXCLUDED.name,
      phone = EXCLUDED.phone,
      vehicle_type = EXCLUDED.vehicle_type,
      status = EXCLUDED.status,
      current_latitude = EXCLUDED.current_latitude,
      current_longitude = EXCLUDED.current_longitude,
      average_rating = EXCLUDED.average_rating,
      total_deliveries = EXCLUDED.total_deliveries;
  END LOOP;

  -- Synchroniser les promotions
  FOR demo_record IN SELECT * FROM public.demo_data WHERE type = 'promotion' AND status = 'active' LOOP
    INSERT INTO public.promotions (
      name, description, discount_type, discount_value,
      min_order_amount, start_date, end_date, code, is_active,
      usage_limit, current_usage
    ) VALUES (
      demo_record.data->>'name',
      demo_record.data->>'description',
      demo_record.data->>'discount_type',
      (demo_record.data->>'discount_value')::INTEGER,
      (demo_record.data->>'min_order_amount')::INTEGER,
      (demo_record.data->>'start_date')::TIMESTAMPTZ,
      (demo_record.data->>'end_date')::TIMESTAMPTZ,
      demo_record.data->>'code',
      (demo_record.data->>'is_active')::BOOLEAN,
      (demo_record.data->>'usage_limit')::INTEGER,
      (demo_record.data->>'current_usage')::INTEGER
    ) ON CONFLICT (code) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      discount_type = EXCLUDED.discount_type,
      discount_value = EXCLUDED.discount_value,
      min_order_amount = EXCLUDED.min_order_amount,
      start_date = EXCLUDED.start_date,
      end_date = EXCLUDED.end_date,
      is_active = EXCLUDED.is_active,
      usage_limit = EXCLUDED.usage_limit,
      current_usage = EXCLUDED.current_usage;
  END LOOP;

END;
$$ LANGUAGE plpgsql;

-- Créer un trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_demo_data_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_demo_data_updated_at
  BEFORE UPDATE ON public.demo_data
  FOR EACH ROW
  EXECUTE FUNCTION update_demo_data_updated_at();

-- Insérer les données de démonstration initiales
SELECT insert_demo_data_batch();

-- Commentaires pour documenter la structure
COMMENT ON TABLE public.demo_data IS 'Table pour stocker les données de démonstration inspirées d''Odoo';
COMMENT ON COLUMN public.demo_data.type IS 'Type de données: restaurant, user, order, driver, review, promotion';
COMMENT ON COLUMN public.demo_data.status IS 'Statut: active, inactive, pending';
COMMENT ON COLUMN public.demo_data.data IS 'Données JSON spécifiques au type'; 