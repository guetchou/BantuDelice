
-- Users and Auth tables are handled by Supabase Auth

-- Restaurants Table
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address VARCHAR(255) NOT NULL,
    latitude FLOAT,
    longitude FLOAT,
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    opening_hours JSONB,
    cuisine_type VARCHAR(255),
    price_range VARCHAR(10),
    average_rating FLOAT DEFAULT 0,
    delivery_radius FLOAT,
    delivery_fee INTEGER DEFAULT 0,
    banner_image_url VARCHAR(255),
    logo_url VARCHAR(255),
    featured BOOLEAN DEFAULT false,
    is_open BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    image_url VARCHAR(255),
    category VARCHAR(255) NOT NULL,
    is_vegetarian BOOLEAN DEFAULT false,
    is_vegan BOOLEAN DEFAULT false,
    is_gluten_free BOOLEAN DEFAULT false,
    is_spicy BOOLEAN DEFAULT false,
    available BOOLEAN DEFAULT true,
    preparation_time INTEGER, -- in minutes
    popularity_score INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    restaurant_id UUID REFERENCES public.restaurants(id),
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'pending',
    delivery_status VARCHAR(50) DEFAULT 'pending',
    subtotal INTEGER NOT NULL,
    tax INTEGER NOT NULL,
    total INTEGER NOT NULL,
    delivery_fee INTEGER DEFAULT 0,
    delivery_address TEXT,
    delivery_instructions TEXT,
    contact_phone VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT now(),
    accepted_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    special_instructions TEXT,
    promo_code_applied VARCHAR(50),
    discount_amount INTEGER DEFAULT 0,
    payment_method VARCHAR(50) DEFAULT 'cash',
    delivery_method VARCHAR(50) DEFAULT 'delivery'
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES public.menu_items(id),
    menu_item_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    total_price INTEGER NOT NULL,
    options JSONB,
    notes TEXT
);

-- Delivery Drivers Table
CREATE TABLE IF NOT EXISTS public.delivery_drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    vehicle_type VARCHAR(50) NOT NULL,
    current_latitude FLOAT,
    current_longitude FLOAT,
    current_location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'offline',
    is_available BOOLEAN DEFAULT false,
    profile_picture VARCHAR(255),
    average_rating FLOAT DEFAULT 0,
    total_deliveries INTEGER DEFAULT 0,
    total_earnings INTEGER DEFAULT 0,
    commission_rate FLOAT DEFAULT 0.15,
    created_at TIMESTAMPTZ DEFAULT now(),
    last_location_update TIMESTAMPTZ DEFAULT now(),
    verification_status VARCHAR(50) DEFAULT 'pending'
);

-- Delivery Requests Table
CREATE TABLE IF NOT EXISTS public.delivery_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id),
    restaurant_id UUID REFERENCES public.restaurants(id),
    status VARCHAR(50) DEFAULT 'pending',
    pickup_address VARCHAR(255) NOT NULL,
    pickup_latitude FLOAT,
    pickup_longitude FLOAT,
    delivery_address VARCHAR(255) NOT NULL,
    delivery_latitude FLOAT,
    delivery_longitude FLOAT,
    assigned_driver_id UUID REFERENCES public.delivery_drivers(id),
    requested_at TIMESTAMPTZ DEFAULT now(),
    accepted_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    delivery_fee INTEGER NOT NULL,
    is_external BOOLEAN DEFAULT false,
    external_service_id VARCHAR(255),
    notes TEXT,
    priority VARCHAR(50) DEFAULT 'normal',
    estimated_distance FLOAT,
    estimated_duration INTEGER, -- in minutes
    delivery_time TIMESTAMPTZ,
    delivery_instructions TEXT,
    pickup_time TIMESTAMPTZ,
    distance_km FLOAT,
    delivery_type VARCHAR(50) DEFAULT 'standard',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Taxi Drivers Table
CREATE TABLE IF NOT EXISTS public.taxi_drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    vehicle_type VARCHAR(50) NOT NULL,
    vehicle_color VARCHAR(50),
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    vehicle_year INTEGER,
    license_plate VARCHAR(50),
    current_latitude FLOAT,
    current_longitude FLOAT,
    status VARCHAR(50) DEFAULT 'offline',
    average_rating FLOAT DEFAULT 0,
    total_rides INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    last_location_update TIMESTAMPTZ DEFAULT now()
);

-- Taxi Rides Table
CREATE TABLE IF NOT EXISTS public.taxi_rides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    driver_id UUID REFERENCES public.taxi_drivers(id),
    pickup_address VARCHAR(255) NOT NULL,
    pickup_latitude FLOAT NOT NULL,
    pickup_longitude FLOAT NOT NULL,
    destination_address VARCHAR(255) NOT NULL,
    destination_latitude FLOAT NOT NULL,
    destination_longitude FLOAT NOT NULL,
    pickup_time TIMESTAMPTZ NOT NULL,
    pickup_time_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    estimated_price INTEGER NOT NULL,
    actual_price INTEGER,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    vehicle_type VARCHAR(50) NOT NULL,
    distance_km FLOAT,
    duration_min INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Taxi Saved Locations Table
CREATE TABLE IF NOT EXISTS public.taxi_saved_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    address VARCHAR(255) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    is_favorite BOOLEAN DEFAULT false,
    is_current_location BOOLEAN DEFAULT false,
    last_used TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create check_table_existence function
CREATE OR REPLACE FUNCTION public.check_table_existence(table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result boolean;
BEGIN
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
    ) INTO result;
    
    RETURN result;
END;
$$;

-- Create execute_sql function (for admin use only)
CREATE OR REPLACE FUNCTION public.execute_sql(sql_query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    EXECUTE sql_query;
END;
$$;

-- RLS Policies
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taxi_drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taxi_rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taxi_saved_locations ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for each table (just basic examples, should be customized)
CREATE POLICY "Public read access" ON public.restaurants FOR SELECT USING (true);
CREATE POLICY "Owners can update" ON public.restaurants FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Public read access" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Restaurant owners can update" ON public.menu_items FOR UPDATE 
    USING (auth.uid() IN (SELECT owner_id FROM public.restaurants WHERE id = restaurant_id));

CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT 
    USING (auth.uid() = user_id OR auth.uid() IN (SELECT owner_id FROM restaurants WHERE id = restaurant_id));

CREATE POLICY "Drivers can view their delivery requests" ON public.delivery_requests FOR SELECT 
    USING (auth.uid() = assigned_driver_id OR auth.uid() IN (SELECT owner_id FROM restaurants WHERE id = restaurant_id));

CREATE POLICY "Users can view their taxi rides" ON public.taxi_rides FOR SELECT 
    USING (auth.uid() = user_id OR auth.uid() = driver_id);

CREATE POLICY "Users can manage their saved locations" ON public.taxi_saved_locations FOR ALL 
    USING (auth.uid() = user_id);
