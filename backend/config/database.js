
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
const connect = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL database connected successfully');
    connection.release();
    return pool;
  } catch (err) {
    console.error('Error connecting to MySQL database:', err);
    throw err;
  }
};

// Disconnect from database
const disconnect = async () => {
  try {
    await pool.end();
    console.log('MySQL database disconnected successfully');
  } catch (err) {
    console.error('Error disconnecting from MySQL database:', err);
  }
};

module.exports = {
  pool,
  connect,
  disconnect
};
