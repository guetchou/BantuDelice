
import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();

/**
 * Get all orders for the current user
 * GET /api/orders
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const [orders] = await pool.query(
      `SELECT o.*, r.name as restaurant_name 
       FROM orders o 
       LEFT JOIN restaurants r ON o.restaurant_id = r.id 
       WHERE o.user_id = ? 
       ORDER BY o.created_at DESC`,
      [userId]
    );
    
    // Get order items for each order
    for (let order of orders) {
      const [items] = await pool.query(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.id]
      );
      order.items = items;
    }
    
    res.json(orders);
  } catch (err) {
    console.error('Error getting orders:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get a specific order by ID
 * GET /api/orders/:id
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.userId;
    
    // Get order with restaurant info
    const [orders] = await pool.query(
      `SELECT o.*, r.name as restaurant_name, r.address as restaurant_address 
       FROM orders o 
       LEFT JOIN restaurants r ON o.restaurant_id = r.id 
       WHERE o.id = ? AND o.user_id = ?`,
      [orderId, userId]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = orders[0];
    
    // Get order items
    const [items] = await pool.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orderId]
    );
    
    order.items = items;
    
    // Get tracking information
    const [tracking] = await pool.query(
      'SELECT * FROM order_tracking_details WHERE order_id = ? ORDER BY timestamp DESC',
      [orderId]
    );
    
    order.tracking = tracking;
    
    res.json(order);
  } catch (err) {
    console.error('Error getting order details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Create a new order
 * POST /api/orders
 */
router.post('/', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const {
      restaurantId,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      specialInstructions
    } = req.body;
    
    if (!restaurantId || !items || !totalAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const userId = req.user.userId;
    
    // Create order
    const [orderResult] = await connection.query(
      `INSERT INTO orders 
       (user_id, restaurant_id, total_amount, delivery_address, payment_method, special_instructions, status, payment_status) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending', 'pending')`,
      [userId, restaurantId, totalAmount, deliveryAddress, paymentMethod, specialInstructions]
    );
    
    const orderId = orderResult.insertId;
    
    // Create order items
    for (const item of items) {
      await connection.query(
        `INSERT INTO order_items 
         (order_id, item_name, quantity, price) 
         VALUES (?, ?, ?, ?)`,
        [orderId, item.name, item.quantity, item.price]
      );
    }
    
    // Add initial tracking entry
    await connection.query(
      `INSERT INTO order_tracking_details 
       (order_id, status, timestamp, notes) 
       VALUES (?, 'pending', NOW(), 'Order received')`,
      [orderId]
    );
    
    await connection.commit();
    
    // Get the created order
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    
    res.status(201).json({
      message: 'Order created successfully',
      order: orders[0]
    });
  } catch (err) {
    await connection.rollback();
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
});

/**
 * Update an order (add special instructions, cancel, etc.)
 * PATCH /api/orders/:id
 */
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.userId;
    
    // Verify order belongs to user
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [orderId, userId]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = orders[0];
    
    // Prevent modification if order is already delivered or cancelled
    if (['delivered', 'cancelled', 'completed'].includes(order.status)) {
      return res.status(400).json({ error: 'Cannot modify completed or cancelled order' });
    }
    
    const allowedUpdates = [
      'delivery_instructions',
      'special_instructions',
      'status' // Allow status updates (e.g., for cancellation)
    ];
    
    const updates = {};
    let hasUpdates = false;
    
    // Create an object with only allowed updates
    for (const key of Object.keys(req.body)) {
      const snakeCaseKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      if (allowedUpdates.includes(snakeCaseKey)) {
        updates[snakeCaseKey] = req.body[key];
        hasUpdates = true;
      }
    }
    
    if (!hasUpdates) {
      return res.status(400).json({ error: 'No valid updates provided' });
    }
    
    // Special handling for cancelled status
    if (updates.status === 'cancelled') {
      updates.cancelled_at = new Date();
      
      // Add tracking entry for cancellation
      await pool.query(
        `INSERT INTO order_tracking_details 
         (order_id, status, timestamp, notes) 
         VALUES (?, 'cancelled', NOW(), 'Order cancelled by customer')`,
        [orderId]
      );
    }
    
    // Convert updates to SQL format
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    
    // Add order ID and user ID to values
    values.push(orderId, userId);
    
    // Update order
    await pool.query(
      `UPDATE orders SET ${fields} WHERE id = ? AND user_id = ?`,
      values
    );
    
    // Get updated order
    const [updatedOrders] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    
    res.json({
      message: 'Order updated successfully',
      order: updatedOrders[0]
    });
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
