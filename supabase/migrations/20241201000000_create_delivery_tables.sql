-- Create delivery services table
CREATE TABLE IF NOT EXISTS delivery_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  estimated_time VARCHAR(50) NOT NULL,
  features JSONB DEFAULT '[]',
  coverage JSONB DEFAULT '[]',
  tracking BOOLEAN DEFAULT false,
  insurance BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create deliveries table
CREATE TABLE IF NOT EXISTS deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  pickup_address TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  package_type VARCHAR(50) NOT NULL,
  weight DECIMAL(8,2) NOT NULL,
  dimensions JSONB NOT NULL,
  service_id VARCHAR(50) NOT NULL,
  insurance BOOLEAN DEFAULT false,
  tracking BOOLEAN DEFAULT true,
  special_instructions TEXT,
  contact_name VARCHAR(100) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  contact_email VARCHAR(100),
  estimated_cost DECIMAL(10,2) NOT NULL,
  estimated_distance DECIMAL(8,2),
  estimated_time INTEGER, -- minutes
  actual_cost DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending',
  pickup_coordinates POINT,
  delivery_coordinates POINT,
  driver_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create delivery tracking table
CREATE TABLE IF NOT EXISTS delivery_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id UUID REFERENCES deliveries(id) ON DELETE CASCADE,
  tracking_number VARCHAR(20) NOT NULL,
  status VARCHAR(100) NOT NULL,
  location VARCHAR(200),
  description TEXT,
  coordinates POINT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create delivery zones table
CREATE TABLE IF NOT EXISTS delivery_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  center POINT NOT NULL,
  radius DECIMAL(8,2) NOT NULL, -- in kilometers
  delivery_fee DECIMAL(8,2) NOT NULL,
  estimated_time INTEGER NOT NULL, -- in minutes
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  vehicle_type VARCHAR(50),
  vehicle_plate VARCHAR(20),
  rating DECIMAL(3,2) DEFAULT 5.0,
  status VARCHAR(20) DEFAULT 'available',
  current_location POINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default delivery services
INSERT INTO delivery_services (service_id, name, description, base_price, estimated_time, features, coverage, tracking, insurance) VALUES
('buntudelice-express', 'Buntudelice Express', 'Livraison express en 2-4 heures', 2500.00, '2-4 heures', 
 '["Livraison express", "Suivi GPS", "Assurance incluse", "Service client 24/7"]', 
 '["Brazzaville", "Pointe-Noire", "Dolisie", "Nkayi"]', true, true),

('buntudelice-standard', 'Buntudelice Standard', 'Livraison standard en 24-48 heures', 1500.00, '24-48 heures',
 '["Livraison standard", "Suivi en ligne", "Assurance optionnelle"]',
 '["Tout le Congo"]', true, false),

('buntudelice-economy', 'Buntudelice Economy', 'Livraison économique en 3-5 jours', 800.00, '3-5 jours',
 '["Prix économique", "Livraison groupée"]',
 '["Tout le Congo"]', false, false),

('buntudelice-international', 'Buntudelice International', 'Livraison internationale', 15000.00, '5-10 jours',
 '["Livraison internationale", "Dédouanement", "Suivi avancé", "Assurance complète"]',
 '["Afrique", "Europe", "Amérique"]', true, true);

-- Insert default delivery zones
INSERT INTO delivery_zones (name, center, radius, delivery_fee, estimated_time) VALUES
('Brazzaville Centre', POINT(15.2429, -4.2634), 10.0, 500.00, 30),
('Brazzaville Périphérie', POINT(15.2429, -4.2634), 25.0, 1000.00, 60),
('Pointe-Noire Centre', POINT(11.8636, -4.7997), 10.0, 600.00, 45),
('Pointe-Noire Périphérie', POINT(11.8636, -4.7997), 25.0, 1200.00, 90);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deliveries_tracking_number ON deliveries(tracking_number);
CREATE INDEX IF NOT EXISTS idx_deliveries_user_id ON deliveries(user_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries(status);
CREATE INDEX IF NOT EXISTS idx_delivery_tracking_delivery_id ON delivery_tracking(delivery_id);
CREATE INDEX IF NOT EXISTS idx_delivery_tracking_tracking_number ON delivery_tracking(tracking_number);
CREATE INDEX IF NOT EXISTS idx_delivery_zones_center ON delivery_zones USING GIST(center);

-- Create RLS policies
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

-- Policies for deliveries
CREATE POLICY "Users can view their own deliveries" ON deliveries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own deliveries" ON deliveries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deliveries" ON deliveries
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for delivery tracking (public read for tracking numbers)
CREATE POLICY "Anyone can view delivery tracking by tracking number" ON delivery_tracking
  FOR SELECT USING (true);

-- Policies for delivery services (public read)
CREATE POLICY "Anyone can view delivery services" ON delivery_services
  FOR SELECT USING (true);

-- Policies for delivery zones (public read)
CREATE POLICY "Anyone can view delivery zones" ON delivery_zones
  FOR SELECT USING (true);

-- Create functions for delivery calculations
CREATE OR REPLACE FUNCTION calculate_delivery_cost(
  distance_km DECIMAL,
  service_id VARCHAR,
  weight_kg DECIMAL DEFAULT 1
) RETURNS DECIMAL AS $$
DECLARE
  base_cost DECIMAL;
  service_record RECORD;
BEGIN
  -- Get service base price
  SELECT base_price INTO service_record FROM delivery_services WHERE service_id = $2;
  
  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  
  -- Calculate base cost
  base_cost := service_record.base_price;
  
  -- Add distance cost (100 FCFA per km)
  base_cost := base_cost + (distance_km * 100);
  
  -- Add weight surcharge for packages over 5kg
  IF weight_kg > 5 THEN
    base_cost := base_cost + ((weight_kg - 5) * 200);
  END IF;
  
  RETURN base_cost;
END;
$$ LANGUAGE plpgsql;

-- Function to get nearby delivery zones
CREATE OR REPLACE FUNCTION get_nearby_delivery_zones(
  lat DECIMAL,
  lng DECIMAL,
  max_distance DECIMAL DEFAULT 50
) RETURNS TABLE(
  id UUID,
  name VARCHAR,
  center POINT,
  radius DECIMAL,
  delivery_fee DECIMAL,
  estimated_time INTEGER,
  distance_km DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dz.id,
    dz.name,
    dz.center,
    dz.radius,
    dz.delivery_fee,
    dz.estimated_time,
    ST_Distance(
      dz.center::geography,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) / 1000 as distance_km
  FROM delivery_zones dz
  WHERE dz.active = true
    AND ST_DWithin(
      dz.center::geography,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      max_distance * 1000
    )
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql; 