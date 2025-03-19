
const { pool } = require('../config/database');

/**
 * Middleware to verify restaurant owner permissions
 * This ensures only restaurant owners can access certain endpoints
 */
const requireRestaurantOwner = async (req, res, next) => {
  try {
    // Check if user is authenticated and user information exists
    if (!req.user || !req.user.userId || !req.user.role) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // If user is admin, allow access (admins can manage all restaurants)
    if (req.user.role === 'admin') {
      return next();
    }
    
    // Check if user is a restaurant owner
    if (req.user.role !== 'restaurant_owner') {
      return res.status(403).json({ error: 'Forbidden: Restaurant owner access required' });
    }
    
    // If restaurantId is provided in the request, verify ownership
    if (req.params.restaurantId || req.body.restaurantId) {
      const restaurantId = req.params.restaurantId || req.body.restaurantId;
      
      const [restaurants] = await pool.query(
        'SELECT * FROM restaurants WHERE id = ? AND user_id = ?',
        [restaurantId, req.user.userId]
      );
      
      if (restaurants.length === 0) {
        return res.status(403).json({ error: 'Forbidden: You do not own this restaurant' });
      }
    }
    
    next();
  } catch (err) {
    console.error('Error in restaurant owner middleware:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Middleware to check if a restaurant belongs to the authenticated owner
 * Use this for routes that operate on a specific restaurant
 */
const verifyRestaurantOwnership = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // If user is admin, allow access
    if (req.user.role === 'admin') {
      return next();
    }
    
    const restaurantId = req.params.id || req.params.restaurantId;
    
    if (!restaurantId) {
      return res.status(400).json({ error: 'Restaurant ID is required' });
    }
    
    // Check restaurant ownership
    const [restaurants] = await pool.query(
      'SELECT * FROM restaurants WHERE id = ? AND user_id = ?',
      [restaurantId, req.user.userId]
    );
    
    if (restaurants.length === 0) {
      return res.status(403).json({ error: 'Forbidden: You do not own this restaurant' });
    }
    
    // Add restaurant data to request for later use
    req.restaurant = restaurants[0];
    next();
  } catch (err) {
    console.error('Error verifying restaurant ownership:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  requireRestaurantOwner,
  verifyRestaurantOwnership
};
