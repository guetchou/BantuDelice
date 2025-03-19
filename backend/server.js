
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connect } = require('./config/database');
const authRoutes = require('./routes/auth');
const restaurantRoutes = require('./routes/restaurants');
const orderRoutes = require('./routes/orders');
const availabilityRoutes = require('./routes/availability');
const featureFlagsMiddleware = require('./middleware/featureFlags');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connect()
  .then(() => {
    console.log('Connected to database');
  })
  .catch(err => {
    console.error('Error connecting to database:', err);
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Feature flags middleware
app.use(featureFlagsMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/availability', availabilityRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
