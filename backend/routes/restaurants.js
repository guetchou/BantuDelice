
const express = require('express');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get all restaurants (public)
router.get('/', async (req, res) => {
  try {
    const connection = db.getConnection();
    
    // Build query with optional filters
    let query = `
      SELECT * FROM restaurants 
      WHERE 1=1
    `;
    
    const params = [];
    
    // Apply filters if provided
    if (req.query.cuisine_type) {
      query += ` AND cuisine_type = ?`;
      params.push(req.query.cuisine_type);
    }
    
    if (req.query.search) {
      query += ` AND (name LIKE ? OR address LIKE ?)`;
      const searchTerm = `%${req.query.search}%`;
      params.push(searchTerm, searchTerm);
    }
    
    // Apply sorting
    if (req.query.sort_by) {
      switch (req.query.sort_by) {
        case 'rating':
          query += ` ORDER BY rating DESC`;
          break;
        case 'preparation_time':
          query += ` ORDER BY estimated_preparation_time ASC`;
          break;
        default:
          query += ` ORDER BY name ASC`;
      }
    } else {
      query += ` ORDER BY name ASC`;
    }
    
    // Execute query
    const [restaurants] = await connection.execute(query, params);
    
    res.json({ restaurants });
  } catch (err) {
    console.error('Error fetching restaurants:', err);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

// Get restaurant details by ID
router.get('/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const connection = db.getConnection();
    
    const [restaurants] = await connection.execute(
      'SELECT * FROM restaurants WHERE id = ?',
      [restaurantId]
    );
    
    if (restaurants.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    
    res.json({
      restaurant: restaurants[0]
    });
  } catch (err) {
    console.error('Error fetching restaurant details:', err);
    res.status(500).json({ error: 'Failed to fetch restaurant details' });
  }
});

// Get restaurant menu items
router.get('/:restaurantId/menu', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const connection = db.getConnection();
    
    // Check if restaurant exists
    const [restaurants] = await connection.execute(
      'SELECT * FROM restaurants WHERE id = ?',
      [restaurantId]
    );
    
    if (restaurants.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    
    // In a real application, you would have a menu_items table
    // This is a placeholder response
    const menuItems = [
      { id: 'item1', name: 'Burger', price: 8500, category: 'Main' },
      { id: 'item2', name: 'Fries', price: 3500, category: 'Side' },
      { id: 'item3', name: 'Soda', price: 2000, category: 'Beverage' }
    ];
    
    res.json({ menuItems });
  } catch (err) {
    console.error('Error fetching menu items:', err);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

module.exports = router;
