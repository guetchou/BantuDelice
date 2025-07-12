# Supabase Setup for Buntudelice

This guide will help you connect your Buntudelice project to Supabase for database, authentication, and real-time features.

## 1. Install Dependencies

First, install the Supabase JavaScript client:

```bash
npm install @supabase/supabase-js
```

## 2. Environment Configuration

Create a `.env` file in your project root with your Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Getting Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Navigate to Settings > API in your Supabase dashboard
3. Copy the "Project URL" and "anon public" key
4. Replace the values in your `.env` file

## 3. Database Schema

Run these SQL commands in your Supabase SQL editor to create the necessary tables:

### Restaurants Table
```sql
CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  delivery_time INTEGER DEFAULT 30,
  delivery_fee INTEGER DEFAULT 1000,
  cuisine_type VARCHAR(100),
  address TEXT,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Menu Items Table
```sql
CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image_url TEXT,
  category VARCHAR(100),
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  restaurant_id INTEGER REFERENCES restaurants(id),
  items JSONB NOT NULL,
  total INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  delivery_address TEXT NOT NULL,
  delivery_phone VARCHAR(20) NOT NULL,
  delivery_name VARCHAR(255) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 4. Sample Data

Insert some sample restaurants and menu items:

```sql
-- Insert sample restaurants
INSERT INTO restaurants (name, description, image_url, rating, delivery_time, delivery_fee, cuisine_type, address, phone) VALUES
('Le Gourmet Africain', 'Cuisine africaine authentique avec des saveurs traditionnelles', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400', 4.5, 25, 800, 'Africaine', '123 Rue de la Paix, Brazzaville', '+242 123 456 789'),
('Pizza Express', 'Pizzas italiennes fraîches et délicieuses', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', 4.2, 30, 1000, 'Italienne', '456 Avenue du Commerce, Brazzaville', '+242 987 654 321'),
('Sushi Bar', 'Sushi et sashimi de qualité premium', 'https://images.unsplash.com/photo-1579584425555-c3d17c2f9b6b?w=400', 4.7, 35, 1200, 'Japonaise', '789 Boulevard Central, Brazzaville', '+242 555 123 456'),
('Burger House', 'Burgers gourmets avec des ingrédients frais', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 4.3, 20, 600, 'Américaine', '321 Rue des Délices, Brazzaville', '+242 777 888 999'),
('Café Parisien', 'Café et pâtisseries françaises', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400', 4.6, 15, 500, 'Française', '654 Place de la République, Brazzaville', '+242 111 222 333');

-- Insert sample menu items
INSERT INTO menu_items (restaurant_id, name, description, price, image_url, category) VALUES
(1, 'Poulet Braisé', 'Poulet braisé avec accompagnement de plantains et légumes', 3500, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300', 'Plats principaux'),
(1, 'Fufu et Eru', 'Fufu traditionnel avec sauce eru et viande', 2800, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300', 'Plats principaux'),
(2, 'Pizza Margherita', 'Pizza classique avec tomates, mozzarella et basilic', 4500, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300', 'Pizzas'),
(2, 'Pizza Quatre Fromages', 'Pizza avec quatre variétés de fromages', 5200, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300', 'Pizzas'),
(3, 'Sushi Saumon', 'Sushi au saumon frais avec riz vinaigré', 3800, 'https://images.unsplash.com/photo-1579584425555-c3d17c2f9b6b?w=300', 'Sushi'),
(3, 'Sashimi Mix', 'Assortiment de sashimi variés', 4200, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300', 'Sashimi'),
(4, 'Burger Classic', 'Burger avec steak, salade, tomate et fromage', 3200, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300', 'Burgers'),
(4, 'Burger Végétarien', 'Burger végétarien avec galette de légumes', 2800, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300', 'Burgers'),
(5, 'Croissant Beurre', 'Croissant traditionnel au beurre', 800, 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300', 'Pâtisseries'),
(5, 'Café Expresso', 'Expresso italien authentique', 500, 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300', 'Boissons');
```

## 5. Row Level Security (RLS)

Enable RLS and create policies for secure data access:

```sql
-- Enable RLS on all tables
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policies for restaurants (public read access)
CREATE POLICY "Restaurants are viewable by everyone" ON restaurants
  FOR SELECT USING (true);

-- Policies for menu items (public read access)
CREATE POLICY "Menu items are viewable by everyone" ON menu_items
  FOR SELECT USING (true);

-- Policies for orders (users can only see their own orders)
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);
```

## 6. Authentication Setup

In your Supabase dashboard:

1. Go to Authentication > Settings
2. Configure your site URL (e.g., `http://localhost:5173` for development)
3. Add any additional redirect URLs as needed

## 7. Real-time Features

Enable real-time subscriptions for orders:

```sql
-- Enable real-time for orders table
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
```

## 8. Usage in Your App

The project now includes:

- **`src/lib/supabase.ts`**: Supabase client configuration
- **`src/hooks/useSupabase.ts`**: Custom React hooks for data operations
- **TypeScript types**: Full type safety for your database operations

### Example Usage

```tsx
import { useRestaurants } from '@/hooks/useSupabase'

function RestaurantList() {
  const { restaurants, loading, error } = useRestaurants()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {restaurants.map(restaurant => (
        <div key={restaurant.id}>{restaurant.name}</div>
      ))}
    </div>
  )
}
```

## 9. Testing the Connection

1. Start your development server: `npm run dev`
2. Check the browser console for any connection errors
3. Verify that restaurants are loading from Supabase instead of mock data

## 10. Next Steps

- [ ] Set up authentication UI components
- [ ] Implement real-time order tracking
- [ ] Add file upload for restaurant images
- [ ] Configure email notifications
- [ ] Set up payment processing with Stripe

## Troubleshooting

### Common Issues

1. **Connection refused**: Check your Supabase URL and ensure the project is active
2. **CORS errors**: Verify your site URL is configured in Supabase Auth settings
3. **RLS errors**: Make sure you're authenticated when accessing protected data
4. **Type errors**: Regenerate types if you modify the database schema

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues) 