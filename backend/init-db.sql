
-- Create database
CREATE DATABASE IF NOT EXISTS buntudelice;
USE buntudelice;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role ENUM('user', 'admin', 'restaurant_owner', 'delivery_driver') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  cuisine_type VARCHAR(100) NOT NULL,
  description TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  image_url VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  opening_hours JSON,
  is_open BOOLEAN DEFAULT TRUE,
  delivery_radius INT DEFAULT 10,
  min_order_amount INT DEFAULT 1000,
  avg_preparation_time INT DEFAULT 30,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INT NOT NULL, -- Stored in cents
  category VARCHAR(100),
  image_url VARCHAR(255),
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  restaurant_id INT NOT NULL,
  total_amount INT NOT NULL, -- Stored in cents
  status ENUM('pending', 'accepted', 'preparing', 'prepared', 'delivering', 'delivered', 'cancelled') DEFAULT 'pending',
  payment_status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  payment_method VARCHAR(50) DEFAULT 'cash',
  delivery_address VARCHAR(255),
  delivery_status ENUM('pending', 'assigned', 'picked_up', 'delivered', 'failed') DEFAULT 'pending',
  special_instructions TEXT,
  delivery_instructions TEXT,
  delivered_at TIMESTAMP NULL,
  cancelled_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price INT NOT NULL, -- Stored in cents
  special_instructions TEXT,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  restaurant_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Create order_tracking_details table
CREATE TABLE IF NOT EXISTS order_tracking_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  location_data JSON,
  handled_by INT,
  estimated_completion_time TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (handled_by) REFERENCES users(id)
);

-- Create delivery_drivers table
CREATE TABLE IF NOT EXISTS delivery_drivers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  status ENUM('available', 'busy', 'offline') DEFAULT 'offline',
  current_latitude DECIMAL(10, 8),
  current_longitude DECIMAL(11, 8),
  average_rating DECIMAL(3, 2) DEFAULT 0.0,
  total_deliveries INT DEFAULT 0,
  last_location_update TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert some sample data
INSERT INTO users (email, password, first_name, last_name, role) VALUES
('admin@example.com', '$2b$10$JMvO3VVK0Q8YC1T4ynpC5u2j/EyAw8CQXw59cdF5gTCCHyKtf/qri', 'Admin', 'User', 'admin'), -- password: admin123
('user@example.com', '$2b$10$EsjzeiLWzOMtOvd1UBmO1uqPojm6gXYMGY9lnE88nnK/bFRgGn7DG', 'Regular', 'User', 'user'), -- password: user123
('owner@example.com', '$2b$10$Dsg7CmhGENB6vF5n8cI3/.IqZMgZeLCY4LqM7J73LJ1Nd.pgFdK9K', 'Restaurant', 'Owner', 'restaurant_owner'); -- password: owner123

INSERT INTO restaurants (name, address, cuisine_type, description, phone, email, image_url, latitude, longitude, is_open, delivery_radius, min_order_amount) VALUES
('Délices Congolais', '123 Avenue de la Paix, Brazzaville', 'Congolais', 'Authentic Congolese cuisine', '+242123456789', 'contact@delicescongolais.com', 'https://example.com/delices.jpg', 4.2634, 15.2429, TRUE, 10, 2000),
('Mami Wata', '45 Boulevard Marien Ngouabi, Brazzaville', 'Poisson', 'Seafood restaurant with river view', '+242987654321', 'info@mamiwata.com', 'https://example.com/mamiwata.jpg', 4.2680, 15.2855, TRUE, 8, 3000),
('Le Grill', '78 Rue de la République, Brazzaville', 'Grillades', 'Best grilled meats in town', '+242555666777', 'contact@legrill.com', 'https://example.com/legrill.jpg', 4.2711, 15.2612, TRUE, 5, 2500);

INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url) VALUES
(1, 'Poulet à la Moambe', 'Chicken in palm nut sauce with rice', 3500, 'Plats', 'https://example.com/moambe.jpg'),
(1, 'Saka Saka', 'Cassava leaves with fish and rice', 3000, 'Plats', 'https://example.com/sakasaka.jpg'),
(1, 'Makemba', 'Plantains with tomato sauce', 1500, 'Accompagnements', 'https://example.com/makemba.jpg'),
(2, 'Poisson Braisé', 'Grilled fish with plantains', 4500, 'Plats', 'https://example.com/poisson.jpg'),
(2, 'Crevettes Grillées', 'Grilled shrimps with spicy sauce', 5500, 'Plats', 'https://example.com/crevettes.jpg'),
(2, 'Salade Mixte', 'Mixed vegetables salad', 1000, 'Accompagnements', 'https://example.com/salade.jpg'),
(3, 'Brochettes de Boeuf', 'Beef skewers with spices', 4000, 'Plats', 'https://example.com/brochettes.jpg'),
(3, 'Côtes d\'Agneau', 'Grilled lamb ribs', 5000, 'Plats', 'https://example.com/cotes.jpg'),
(3, 'Frites de Manioc', 'Cassava fries', 1200, 'Accompagnements', 'https://example.com/frites.jpg');
