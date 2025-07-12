
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Create database connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 55509,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
const connect = async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL database connected successfully');
    client.release();
    return pool;
  } catch (err) {
    console.error('Error connecting to PostgreSQL database:', err);
    throw err;
  }
};

// Disconnect from database
const disconnect = async () => {
  try {
    await pool.end();
    console.log('PostgreSQL database disconnected successfully');
  } catch (err) {
    console.error('Error disconnecting from PostgreSQL database:', err);
  }
};

export {
  pool,
  connect,
  disconnect
};
