
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/database');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const restaurantRoutes = require('./routes/restaurants');
const featureFlags = require('./utils/featureFlags');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Feature flags middleware
app.use(featureFlags.middleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/restaurants', restaurantRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Buntudelice API server',
    version: process.env.API_VERSION || 'v1',
    status: 'running',
    features: featureFlags.getEnabledFeatures()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start the server
db.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log('Enabled features:', featureFlags.getEnabledFeatures());
    });
  })
  .catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing server...');
  db.disconnect();
  process.exit(0);
});
