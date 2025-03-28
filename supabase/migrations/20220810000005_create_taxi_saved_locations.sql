
-- Create the taxi_saved_locations table to store user's favorite and recent locations
CREATE TABLE IF NOT EXISTS public.taxi_saved_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  is_favorite BOOLEAN DEFAULT false,
  is_current_location BOOLEAN DEFAULT false,
  last_used TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  name TEXT
);

-- Create a unique constraint for user+address combinations
CREATE UNIQUE INDEX IF NOT EXISTS taxi_saved_locations_address_user_idx 
ON public.taxi_saved_locations (user_id, address) 
WHERE user_id IS NOT NULL;

-- Add a general index for non-authenticated users (by address only)
CREATE UNIQUE INDEX IF NOT EXISTS taxi_saved_locations_address_idx 
ON public.taxi_saved_locations (address) 
WHERE user_id IS NULL;

-- Add RLS policies
ALTER TABLE public.taxi_saved_locations ENABLE ROW LEVEL SECURITY;

-- Users can view their own locations
CREATE POLICY "Users can view their own locations" 
ON public.taxi_saved_locations FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can insert their own locations
CREATE POLICY "Users can insert their own locations" 
ON public.taxi_saved_locations FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users can update their own locations
CREATE POLICY "Users can update their own locations" 
ON public.taxi_saved_locations FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can delete their own locations
CREATE POLICY "Users can delete their own locations" 
ON public.taxi_saved_locations FOR DELETE 
USING (auth.uid() = user_id);
