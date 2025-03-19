
const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

/**
 * Get all restaurants
 * GET /api/restaurants
 */
router.get('/', async (req, res) => {
  try {
    // Parse query parameters for filtering
    const { 
      cuisine_type, 
      min_rating, 
      open_now, 
      search, 
      sort_by, 
      page = 1, 
      limit = 20 
    } = req.query;
    
    // Build base query
    let query = `SELECT r.*, 
                (SELECT COUNT(*) FROM reviews rv WHERE rv.restaurant_id = r.id) as review_count,
                (SELECT AVG(rv.rating) FROM reviews rv WHERE rv.restaurant_id = r.id) as average_rating
                FROM restaurants r
                WHERE 1=1`;
    
    const queryParams = [];
    
    // Add filters
    if (cuisine_type) {
      query += ' AND r.cuisine_type = ?';
      queryParams.push(cuisine_type);
    }
    
    if (min_rating) {
      query += ' AND (SELECT AVG(rv.rating) FROM reviews rv WHERE rv.restaurant_id = r.id) >= ?';
      queryParams.push(parseFloat(min_rating));
    }
    
    if (open_now === 'true') {
      // This is a simplified version. In a real application, you would check against current time and day
      query += ' AND r.is_open = 1';
    }
    
    if (search) {
      query += ' AND (r.name LIKE ? OR r.cuisine_type LIKE ? OR r.address LIKE ?)';
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    // Add sorting
    if (sort_by === 'rating') {
      query += ' ORDER BY average_rating DESC';
    } else if (sort_by === 'reviews') {
      query += ' ORDER BY review_count DESC';
    } else {
      query += ' ORDER BY r.name ASC';
    }
    
    // Add pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), offset);
    
    // Execute query
    const [restaurants] = await pool.query(query, queryParams);
    
    // Count total restaurants for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM restaurants r WHERE 1=1';
    
    // Add the same filters to count query
    if (cuisine_type) {
      countQuery += ' AND r.cuisine_type = ?';
    }
    
    if (min_rating) {
      countQuery += ' AND (SELECT AVG(rv.rating) FROM reviews rv WHERE rv.restaurant_id = r.id) >= ?';
    }
    
    if (open_now === 'true') {
      countQuery += ' AND r.is_open = 1';
    }
    
    if (search) {
      countQuery += ' AND (r.name LIKE ? OR r.cuisine_type LIKE ? OR r.address LIKE ?)';
    }
    
    // Remove limit and offset from params for count query
    const countParams = queryParams.slice(0, queryParams.length - 2);
    
    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;
    
    res.json({
      restaurants,
      pagination: {
        totalResults: total,
        totalPages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page),
        resultsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Error getting restaurants:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get a specific restaurant by ID
 * GET /api/restaurants/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const restaurantId = req.params.id;
    
    // Get restaurant details
    const [restaurants] = await pool.query(
      `SELECT r.*, 
      (SELECT AVG(rv.rating) FROM reviews rv WHERE rv.restaurant_id = r.id) as average_rating,
      (SELECT COUNT(*) FROM reviews rv WHERE rv.restaurant_id = r.id) as review_count
      FROM restaurants r
      WHERE r.id = ?`,
      [restaurantId]
    );
    
    if (restaurants.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    
    const restaurant = restaurants[0];
    
    // Get restaurant reviews
    const [reviews] = await pool.query(
      `SELECT r.*, u.first_name, u.last_name 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.restaurant_id = ?
       ORDER BY r.created_at DESC
       LIMIT 5`,
      [restaurantId]
    );
    
    restaurant.reviews = reviews;
    
    // Get restaurant menu items
    const [menuItems] = await pool.query(
      `SELECT * FROM menu_items 
       WHERE restaurant_id = ? 
       ORDER BY category, name`,
      [restaurantId]
    );
    
    // Group menu items by category
    const menu = {};
    for (const item of menuItems) {
      if (!menu[item.category]) {
        menu[item.category] = [];
      }
      menu[item.category].push(item);
    }
    
    restaurant.menu = menu;
    
    res.json(restaurant);
  } catch (err) {
    console.error('Error getting restaurant details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get menu for a specific restaurant
 * GET /api/restaurants/:id/menu
 */
router.get('/:id/menu', async (req, res) => {
  try {
    const restaurantId = req.params.id;
    
    // Get menu items
    const [menuItems] = await pool.query(
      `SELECT * FROM menu_items 
       WHERE restaurant_id = ? 
       AND available = 1
       ORDER BY category, name`,
      [restaurantId]
    );
    
    // Group menu items by category
    const menu = {};
    for (const item of menuItems) {
      if (!menu[item.category]) {
        menu[item.category] = [];
      }
      menu[item.category].push(item);
    }
    
    res.json(menu);
  } catch (err) {
    console.error('Error getting restaurant menu:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Add a review for a restaurant
 * POST /api/restaurants/:id/reviews
 */
router.post('/:id/reviews', authenticateToken, async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const userId = req.user.userId;
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    // Check if restaurant exists
    const [restaurants] = await pool.query('SELECT * FROM restaurants WHERE id = ?', [restaurantId]);
    
    if (restaurants.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    
    // Check if user already reviewed this restaurant
    const [existingReviews] = await pool.query(
      'SELECT * FROM reviews WHERE restaurant_id = ? AND user_id = ?',
      [restaurantId, userId]
    );
    
    if (existingReviews.length > 0) {
      return res.status(400).json({ error: 'You have already reviewed this restaurant' });
    }
    
    // Create review
    const [result] = await pool.query(
      'INSERT INTO reviews (restaurant_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
      [restaurantId, userId, rating, comment || null]
    );
    
    // Get the created review
    const [reviews] = await pool.query(
      `SELECT r.*, u.first_name, u.last_name 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.id = ?`,
      [result.insertId]
    );
    
    res.status(201).json({
      message: 'Review added successfully',
      review: reviews[0]
    });
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Create a new restaurant (admin only)
 * POST /api/restaurants
 */
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      name,
      address,
      cuisineType,
      description,
      phone,
      email,
      imageUrl,
      latitude,
      longitude,
      openingHours
    } = req.body;
    
    if (!name || !address || !cuisineType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create restaurant
    const [result] = await pool.query(
      `INSERT INTO restaurants 
       (name, address, cuisine_type, description, phone, email, image_url, latitude, longitude, opening_hours) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, address, cuisineType, description, phone, email, imageUrl, latitude, longitude, JSON.stringify(openingHours || {})]
    );
    
    // Get the created restaurant
    const [restaurants] = await pool.query('SELECT * FROM restaurants WHERE id = ?', [result.insertId]);
    
    res.status(201).json({
      message: 'Restaurant created successfully',
      restaurant: restaurants[0]
    });
  } catch (err) {
    console.error('Error creating restaurant:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
