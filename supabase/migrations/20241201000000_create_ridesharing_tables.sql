-- Create ridesharing tables
-- Migration: 20241201000000_create_ridesharing_tables.sql

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create ridesharing_rides table
CREATE TABLE IF NOT EXISTS ridesharing_rides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pickup_lat DOUBLE PRECISION NOT NULL,
  pickup_lng DOUBLE PRECISION NOT NULL,
  pickup_address TEXT NOT NULL,
  destination_lat DOUBLE PRECISION NOT NULL,
  destination_lng DOUBLE PRECISION NOT NULL,
  destination_address TEXT NOT NULL,
  current_lat DOUBLE PRECISION,
  current_lng DOUBLE PRECISION,
  price INTEGER NOT NULL CHECK (price > 0),
  available_seats INTEGER NOT NULL DEFAULT 4 CHECK (available_seats >= 0),
  total_seats INTEGER NOT NULL DEFAULT 4 CHECK (total_seats > 0),
  departure_time TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'in_progress', 'completed', 'cancelled')),
  description TEXT,
  vehicle_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ridesharing_passengers table
CREATE TABLE IF NOT EXISTS ridesharing_passengers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ride_id UUID REFERENCES ridesharing_rides(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pickup_lat DOUBLE PRECISION NOT NULL,
  pickup_lng DOUBLE PRECISION NOT NULL,
  pickup_address TEXT,
  destination_lat DOUBLE PRECISION NOT NULL,
  destination_lng DOUBLE PRECISION NOT NULL,
  destination_address TEXT,
  passenger_count INTEGER NOT NULL DEFAULT 1 CHECK (passenger_count > 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'picked_up', 'dropped_off', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  payment_amount INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(ride_id, user_id)
);

-- Create ridesharing_ratings table
CREATE TABLE IF NOT EXISTS ridesharing_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ride_id UUID REFERENCES ridesharing_rides(id) ON DELETE CASCADE,
  rater_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rated_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(ride_id, rater_id, rated_id)
);

-- Create ridesharing_messages table
CREATE TABLE IF NOT EXISTS ridesharing_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ride_id UUID REFERENCES ridesharing_rides(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'location', 'system')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ridesharing_rides_driver_id ON ridesharing_rides(driver_id);
CREATE INDEX IF NOT EXISTS idx_ridesharing_rides_status ON ridesharing_rides(status);
CREATE INDEX IF NOT EXISTS idx_ridesharing_rides_pickup_location ON ridesharing_rides USING GIST (ST_Point(pickup_lng, pickup_lat));
CREATE INDEX IF NOT EXISTS idx_ridesharing_rides_destination_location ON ridesharing_rides USING GIST (ST_Point(destination_lng, destination_lat));
CREATE INDEX IF NOT EXISTS idx_ridesharing_rides_created_at ON ridesharing_rides(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ridesharing_passengers_ride_id ON ridesharing_passengers(ride_id);
CREATE INDEX IF NOT EXISTS idx_ridesharing_passengers_user_id ON ridesharing_passengers(user_id);
CREATE INDEX IF NOT EXISTS idx_ridesharing_passengers_status ON ridesharing_passengers(status);

CREATE INDEX IF NOT EXISTS idx_ridesharing_ratings_ride_id ON ridesharing_ratings(ride_id);
CREATE INDEX IF NOT EXISTS idx_ridesharing_ratings_rated_id ON ridesharing_ratings(rated_id);

CREATE INDEX IF NOT EXISTS idx_ridesharing_messages_ride_id ON ridesharing_messages(ride_id);
CREATE INDEX IF NOT EXISTS idx_ridesharing_messages_created_at ON ridesharing_messages(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_ridesharing_rides_updated_at 
  BEFORE UPDATE ON ridesharing_rides 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ridesharing_passengers_updated_at 
  BEFORE UPDATE ON ridesharing_passengers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE ridesharing_rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE ridesharing_passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ridesharing_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ridesharing_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ridesharing_rides
CREATE POLICY "Users can view all active rides" ON ridesharing_rides
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can view their own rides" ON ridesharing_rides
  FOR SELECT USING (auth.uid() = driver_id);

CREATE POLICY "Users can create their own rides" ON ridesharing_rides
  FOR INSERT WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "Users can update their own rides" ON ridesharing_rides
  FOR UPDATE USING (auth.uid() = driver_id);

CREATE POLICY "Users can delete their own rides" ON ridesharing_rides
  FOR DELETE USING (auth.uid() = driver_id);

-- RLS Policies for ridesharing_passengers
CREATE POLICY "Users can view passengers of their rides" ON ridesharing_passengers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ridesharing_rides 
      WHERE ridesharing_rides.id = ridesharing_passengers.ride_id 
      AND ridesharing_rides.driver_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own passenger records" ON ridesharing_passengers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create passenger records" ON ridesharing_passengers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own passenger records" ON ridesharing_passengers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own passenger records" ON ridesharing_passengers
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for ridesharing_ratings
CREATE POLICY "Users can view ratings for their rides" ON ridesharing_ratings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ridesharing_rides 
      WHERE ridesharing_rides.id = ridesharing_ratings.ride_id 
      AND ridesharing_rides.driver_id = auth.uid()
    )
  );

CREATE POLICY "Users can view ratings they received" ON ridesharing_ratings
  FOR SELECT USING (auth.uid() = rated_id);

CREATE POLICY "Users can create ratings" ON ridesharing_ratings
  FOR INSERT WITH CHECK (auth.uid() = rater_id);

CREATE POLICY "Users can update their own ratings" ON ridesharing_ratings
  FOR UPDATE USING (auth.uid() = rater_id);

CREATE POLICY "Users can delete their own ratings" ON ridesharing_ratings
  FOR DELETE USING (auth.uid() = rater_id);

-- RLS Policies for ridesharing_messages
CREATE POLICY "Users can view messages for their rides" ON ridesharing_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ridesharing_rides 
      WHERE ridesharing_rides.id = ridesharing_messages.ride_id 
      AND ridesharing_rides.driver_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM ridesharing_passengers 
      WHERE ridesharing_passengers.ride_id = ridesharing_messages.ride_id 
      AND ridesharing_passengers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages" ON ridesharing_messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages" ON ridesharing_messages
  FOR UPDATE USING (auth.uid() = sender_id);

CREATE POLICY "Users can delete their own messages" ON ridesharing_messages
  FOR DELETE USING (auth.uid() = sender_id);

-- Create functions for ridesharing operations
CREATE OR REPLACE FUNCTION get_nearby_rides(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_km DOUBLE PRECISION DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  driver_id UUID,
  pickup_lat DOUBLE PRECISION,
  pickup_lng DOUBLE PRECISION,
  pickup_address TEXT,
  destination_lat DOUBLE PRECISION,
  destination_lng DOUBLE PRECISION,
  destination_address TEXT,
  price INTEGER,
  available_seats INTEGER,
  departure_time TIMESTAMP WITH TIME ZONE,
  distance_km DOUBLE PRECISION,
  driver_name TEXT,
  driver_rating NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.driver_id,
    r.pickup_lat,
    r.pickup_lng,
    r.pickup_address,
    r.destination_lat,
    r.destination_lng,
    r.destination_address,
    r.price,
    r.available_seats,
    r.departure_time,
    ST_Distance(
      ST_Point(user_lng, user_lat)::geography,
      ST_Point(r.pickup_lng, r.pickup_lat)::geography
    ) / 1000 as distance_km,
    u.full_name as driver_name,
    u.rating as driver_rating
  FROM ridesharing_rides r
  JOIN auth.users u ON r.driver_id = u.id
  WHERE r.status = 'active'
    AND r.available_seats > 0
    AND ST_DWithin(
      ST_Point(user_lng, user_lat)::geography,
      ST_Point(r.pickup_lng, r.pickup_lat)::geography,
      radius_km * 1000
    )
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to calculate ride statistics
CREATE OR REPLACE FUNCTION get_ride_statistics(user_uuid UUID)
RETURNS TABLE (
  total_rides INTEGER,
  completed_rides INTEGER,
  cancelled_rides INTEGER,
  total_earnings INTEGER,
  average_rating NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_rides,
    COUNT(*) FILTER (WHERE status = 'completed')::INTEGER as completed_rides,
    COUNT(*) FILTER (WHERE status = 'cancelled')::INTEGER as cancelled_rides,
    COALESCE(SUM(price) FILTER (WHERE status = 'completed'), 0)::INTEGER as total_earnings,
    COALESCE(AVG(rating), 0) as average_rating
  FROM ridesharing_rides r
  LEFT JOIN ridesharing_ratings rr ON r.id = rr.ride_id AND rr.rated_id = user_uuid
  WHERE r.driver_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update ride status
CREATE OR REPLACE FUNCTION update_ride_status(
  ride_uuid UUID,
  new_status TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE ridesharing_rides 
  SET status = new_status, updated_at = NOW()
  WHERE id = ride_uuid AND driver_id = auth.uid();
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ridesharing_rides TO anon, authenticated;
GRANT ALL ON ridesharing_passengers TO anon, authenticated;
GRANT ALL ON ridesharing_ratings TO anon, authenticated;
GRANT ALL ON ridesharing_messages TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_nearby_rides TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_ride_statistics TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_ride_status TO anon, authenticated; 