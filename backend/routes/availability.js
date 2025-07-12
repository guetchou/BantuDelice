
import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { verifyRestaurantOwnership } from '../middleware/restaurantOwner.js';
const router = express.Router();

/**
 * Update menu item availability
 * PATCH /api/availability/menu-items/:id
 */
router.patch('/menu-items/:id', authenticateToken, async (req, res) => {
  try {
    const itemId = req.params.id;
    const { available, stock_level } = req.body;
    
    if (available === undefined && stock_level === undefined) {
      return res.status(400).json({ error: 'Either available or stock_level must be provided' });
    }
    
    // Get menu item to verify ownership
    const [menuItems] = await pool.query(
      `SELECT mi.*, r.user_id 
       FROM menu_items mi 
       JOIN restaurants r ON mi.restaurant_id = r.id 
       WHERE mi.id = ?`,
      [itemId]
    );
    
    if (menuItems.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    const menuItem = menuItems[0];
    
    // Verify restaurant ownership or admin role
    if (req.user.role !== 'admin' && menuItem.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden: You do not own this restaurant' });
    }
    
    // Update availability
    const updateFields = [];
    const updateValues = [];
    
    if (available !== undefined) {
      updateFields.push('available = ?');
      updateValues.push(available);
    }
    
    // If we're making it unavailable and no stock level is provided, set stock to 0
    if (available === false && stock_level === undefined) {
      updateFields.push('stock_level = 0');
    } else if (stock_level !== undefined) {
      updateFields.push('stock_level = ?');
      updateValues.push(stock_level);
      
      // If stock is greater than 0 and available not specified, make it available
      if (stock_level > 0 && available === undefined) {
        updateFields.push('available = TRUE');
      } else if (stock_level === 0 && available === undefined) {
        updateFields.push('available = FALSE');
      }
    }
    
    updateValues.push(itemId);
    
    await pool.query(
      `UPDATE menu_items SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    // Log availability change
    await pool.query(
      `INSERT INTO availability_logs 
       (item_id, item_type, available, stock_level, updated_by) 
       VALUES (?, 'menu_item', ?, ?, ?)`,
      [itemId, available !== undefined ? available : menuItem.available, 
       stock_level !== undefined ? stock_level : menuItem.stock_level, 
       req.user.userId]
    );
    
    res.json({ 
      message: 'Menu item availability updated successfully',
      available: available !== undefined ? available : (stock_level > 0),
      stock_level: stock_level !== undefined ? stock_level : menuItem.stock_level
    });
  } catch (err) {
    console.error('Error updating menu item availability:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Update restaurant availability
 * PATCH /api/availability/restaurants/:id
 */
router.patch('/restaurants/:id', authenticateToken, verifyRestaurantOwnership, async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const { is_open, reason, estimated_reopening, opening_hours, temporary_schedule } = req.body;
    
    const updateFields = [];
    const updateValues = [];
    
    // Update is_open status
    if (is_open !== undefined) {
      updateFields.push('is_open = ?');
      updateValues.push(is_open);
    }
    
    // Update opening hours if provided
    if (opening_hours !== undefined) {
      updateFields.push('opening_hours = ?');
      updateValues.push(JSON.stringify(opening_hours));
    }
    
    // Update temporary schedule if provided
    if (temporary_schedule !== undefined) {
      updateFields.push('temporary_schedule = ?');
      updateValues.push(JSON.stringify(temporary_schedule));
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid update fields provided' });
    }
    
    updateValues.push(restaurantId);
    
    await pool.query(
      `UPDATE restaurants SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    // Log availability change
    await pool.query(
      `INSERT INTO restaurant_status_logs 
       (restaurant_id, is_open, reason, estimated_reopening, updated_by) 
       VALUES (?, ?, ?, ?, ?)`,
      [restaurantId, is_open !== undefined ? is_open : req.restaurant.is_open, 
       reason || null, estimated_reopening || null, req.user.userId]
    );
    
    res.json({ 
      message: 'Restaurant availability updated successfully',
      is_open: is_open !== undefined ? is_open : req.restaurant.is_open
    });
  } catch (err) {
    console.error('Error updating restaurant availability:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Set special hours for a restaurant (holidays, early closings, etc.)
 * POST /api/availability/restaurants/:id/special-hours
 */
router.post('/restaurants/:id/special-hours', authenticateToken, verifyRestaurantOwnership, async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const { date, is_closed, open_time, close_time, reason } = req.body;
    
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }
    
    // Format as ISO date string (YYYY-MM-DD)
    const formattedDate = new Date(date).toISOString().split('T')[0];
    
    // Check if special hours already exist for this date
    const [existingHours] = await pool.query(
      'SELECT * FROM special_hours WHERE restaurant_id = ? AND date = ?',
      [restaurantId, formattedDate]
    );
    
    if (existingHours.length > 0) {
      // Update existing special hours
      await pool.query(
        `UPDATE special_hours 
         SET is_closed = ?, open_time = ?, close_time = ?, reason = ? 
         WHERE restaurant_id = ? AND date = ?`,
        [is_closed || false, open_time || null, close_time || null, reason || null, restaurantId, formattedDate]
      );
    } else {
      // Insert new special hours
      await pool.query(
        `INSERT INTO special_hours 
         (restaurant_id, date, is_closed, open_time, close_time, reason) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [restaurantId, formattedDate, is_closed || false, open_time || null, close_time || null, reason || null]
      );
    }
    
    res.status(201).json({
      message: 'Special hours set successfully',
      date: formattedDate,
      is_closed: is_closed || false,
      open_time: open_time || null,
      close_time: close_time || null,
      reason: reason || null
    });
  } catch (err) {
    console.error('Error setting special hours:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get special hours for a restaurant
 * GET /api/availability/restaurants/:id/special-hours
 */
router.get('/restaurants/:id/special-hours', async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const { from_date, to_date } = req.query;
    
    let query = 'SELECT * FROM special_hours WHERE restaurant_id = ?';
    const queryParams = [restaurantId];
    
    if (from_date) {
      query += ' AND date >= ?';
      queryParams.push(from_date);
    }
    
    if (to_date) {
      query += ' AND date <= ?';
      queryParams.push(to_date);
    }
    
    query += ' ORDER BY date ASC';
    
    const [specialHours] = await pool.query(query, queryParams);
    
    res.json(specialHours);
  } catch (err) {
    console.error('Error getting special hours:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Delete special hours for a restaurant
 * DELETE /api/availability/restaurants/:id/special-hours/:dateId
 */
router.delete('/restaurants/:id/special-hours/:dateId', authenticateToken, verifyRestaurantOwnership, async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const dateId = req.params.dateId;
    
    await pool.query(
      'DELETE FROM special_hours WHERE restaurant_id = ? AND id = ?',
      [restaurantId, dateId]
    );
    
    res.json({ message: 'Special hours deleted successfully' });
  } catch (err) {
    console.error('Error deleting special hours:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
