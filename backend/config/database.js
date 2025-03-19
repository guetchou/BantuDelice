
const mysql = require('mysql2/promise');

let connection = null;

module.exports = {
  connect: async () => {
    try {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      });
      
      console.log('Connected to MySQL database');
      
      // Initialize database if needed
      await initDatabase();
      
      return connection;
    } catch (err) {
      console.error('Database connection error:', err);
      throw err;
    }
  },
  
  getConnection: () => {
    if (!connection) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return connection;
  },
  
  disconnect: async () => {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
      connection = null;
    }
  }
};

async function initDatabase() {
  // Create tables if they don't exist
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS restaurants (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      cuisine_type VARCHAR(100),
      latitude DOUBLE,
      longitude DOUBLE,
      is_open BOOLEAN DEFAULT TRUE,
      rating DECIMAL(3,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      restaurant_id VARCHAR(36) NOT NULL,
      total_amount INT NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      delivery_address VARCHAR(255),
      payment_status VARCHAR(50) DEFAULT 'pending',
      delivery_status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
    )`,
    
    `CREATE TABLE IF NOT EXISTS order_items (
      id VARCHAR(36) PRIMARY KEY,
      order_id VARCHAR(36) NOT NULL,
      item_name VARCHAR(255) NOT NULL,
      quantity INT NOT NULL,
      price INT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    )`,
    
    `CREATE TABLE IF NOT EXISTS delivery_tracking (
      id VARCHAR(36) PRIMARY KEY,
      order_id VARCHAR(36) NOT NULL,
      status VARCHAR(50) NOT NULL,
      latitude DOUBLE,
      longitude DOUBLE,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    )`
  ];
  
  for (const query of tables) {
    await connection.execute(query);
  }
  
  console.log('Database tables initialized');
}
