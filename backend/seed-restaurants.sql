-- Script pour insérer des restaurants de test dans Supabase
-- À exécuter dans l'éditeur SQL de Supabase

-- Insérer des restaurants de test
INSERT INTO restaurants (name, address, cuisine_type, description, phone, email, image_url, latitude, longitude, is_open, delivery_radius, min_order_amount, avg_preparation_time) VALUES
(
  'Le Gourmet Congolais',
  '123 Avenue de la Paix, Brazzaville',
  'Cuisine congolaise',
  'Restaurant traditionnel congolais avec des plats authentiques',
  '+242 123 456 789',
  'contact@gourmetcongolais.cd',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop',
  -4.2634,
  15.2429,
  true,
  10,
  0,
  25
),
(
  'Saveurs d''Afrique',
  '456 Boulevard du Commerce, Brazzaville',
  'Panafricaine',
  'Cuisine africaine moderne avec des saveurs authentiques',
  '+242 987 654 321',
  'info@saveursdafrique.cd',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  -4.2640,
  15.2435,
  true,
  8,
  1500,
  35
),
(
  'Chez Matou',
  '789 Rue de la Gastronomie, Brazzaville',
  'Fast Food',
  'Fast-food local avec des burgers et frites maison',
  '+242 555 123 456',
  'contact@chezmatou.cd',
  'https://images.unsplash.com/photo-1555992336-fb0d29498b13?q=80&w=1964&auto=format&fit=crop',
  -4.2628,
  15.2423,
  true,
  5,
  2000,
  20
),
(
  'La Terrasse',
  '321 Place du Marché, Brazzaville',
  'Internationale',
  'Cuisine internationale avec vue panoramique',
  '+242 777 888 999',
  'reservation@laterrasse.cd',
  'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=1780&auto=format&fit=crop',
  -4.2645,
  15.2440,
  true,
  12,
  3000,
  30
),
(
  'Pizza Express',
  '654 Avenue des Pizzas, Brazzaville',
  'Italienne',
  'Pizzas authentiques cuites au feu de bois',
  '+242 666 777 888',
  'commandes@pizzaexpress.cd',
  'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=2070&auto=format&fit=crop',
  -4.2630,
  15.2430,
  true,
  6,
  2500,
  25
);

-- Insérer des éléments de menu pour le premier restaurant
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, available, stock_level, preparation_time, popularity_score) VALUES
(1, 'Poulet Moambé', 'Poulet traditionnel congolais avec sauce moambé', 5000, 'Plats principaux', 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?q=80&w=2070&auto=format&fit=crop', true, 10, 30, 4.8),
(1, 'Fufu et Eru', 'Fufu de manioc avec sauce eru', 3000, 'Plats traditionnels', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop', true, 15, 25, 4.5),
(1, 'Poisson Braisé', 'Poisson frais braisé avec accompagnements', 4500, 'Plats de mer', 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=1780&auto=format&fit=crop', true, 8, 35, 4.7);

-- Insérer des éléments de menu pour le deuxième restaurant
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, available, stock_level, preparation_time, popularity_score) VALUES
(2, 'Thiéboudienne', 'Riz au poisson sénégalais traditionnel', 4000, 'Plats africains', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1934&auto=format&fit=crop', true, 12, 40, 4.6),
(2, 'Yassa Poulet', 'Poulet mariné à la sauce yassa', 3500, 'Plats africains', 'https://images.unsplash.com/photo-1603417406253-4c65c06974c5?q=80&w=2070&auto=format&fit=crop', true, 10, 30, 4.4),
(2, 'Mafé', 'Ragoût de viande à la sauce arachide', 3800, 'Plats africains', 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=1780&auto=format&fit=crop', true, 8, 35, 4.3);

-- Insérer des éléments de menu pour le troisième restaurant
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, available, stock_level, preparation_time, popularity_score) VALUES
(3, 'Burger Matou', 'Burger avec steak haché et fromage', 2500, 'Burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1998&auto=format&fit=crop', true, 20, 15, 4.2),
(3, 'Frites Maison', 'Frites fraîches coupées à la main', 800, 'Accompagnements', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=2070&auto=format&fit=crop', true, 30, 10, 4.0),
(3, 'Chicken Wings', 'Ailes de poulet épicées', 2000, 'Snacks', 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=1780&auto=format&fit=crop', true, 15, 20, 4.1); 