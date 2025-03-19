
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all orders for the authenticated user
router.get('/', async (req, res) => {
  try {
    const connection = db.getConnection();
    
    const [orders] = await connection.execute(
      `SELECT o.*, r.name as restaurant_name
       FROM orders o
       JOIN restaurants r ON o.restaurant_id = r.id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    
    res.json({ orders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order details by ID
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const connection = db.getConnection();
    
    // Get order details
    const [orders] = await connection.execute(
      `SELECT o.*, r.name as restaurant_name, r.latitude, r.longitude
       FROM orders o
       JOIN restaurants r ON o.restaurant_id = r.id
       WHERE o.id = ? AND o.user_id = ?`,
      [orderId, req.user.id]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = orders[0];
    
    // Get order items
    const [items] = await connection.execute(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orderId]
    );
    
    // Get tracking information
    const [tracking] = await connection.execute(
      'SELECT * FROM delivery_tracking WHERE order_id = ? ORDER BY updated_at DESC LIMIT 1',
      [orderId]
    );
    
    res.json({
      order,
      items,
      tracking: tracking.length > 0 ? tracking[0] : null
    });
  } catch (err) {
    console.error('Error fetching order details:', err);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { restaurant_id, total_amount, items, delivery_address } = req.body;
    
    if (!restaurant_id || !total_amount || !items || !delivery_address) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const connection = db.getConnection();
    
    // Start transaction
    await connection.beginTransaction();
    
    try {
      // Create order
      const orderId = uuidv4();
      await connection.execute(
        `INSERT INTO orders 
         (id, user_id, restaurant_id, total_amount, delivery_address) 
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, req.user.id, restaurant_id, total_amount, delivery_address]
      );
      
      // Create order items
      for (const item of items) {
        await connection.execute(
          `INSERT INTO order_items
           (id, order_id, item_name, quantity, price)
           VALUES (?, ?, ?, ?, ?)`,
          [uuidv4(), orderId, item.name, item.quantity, item.price]
        );
      }
      
      // Initialize tracking
      await connection.execute(
        `INSERT INTO delivery_tracking
         (id, order_id, status)
         VALUES (?, ?, ?)`,
        [uuidv4(), orderId, 'pending']
      );
      
      // Commit transaction
      await connection.commit();
      
      res.status(201).json({
        message: 'Order created successfully',
        order_id: orderId
      });
    } catch (err) {
      // Rollback transaction on error
      await connection.rollback();
      throw err;
    }
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update an order (e.g., add special instructions)
router.patch('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { delivery_instructions } = req.body;
    
    const connection = db.getConnection();
    
    // Check if order exists and belongs to user
    const [orders] = await connection.execute(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [orderId, req.user.id]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Update order
    await connection.execute(
      'UPDATE orders SET delivery_instructions = ? WHERE id = ?',
      [delivery_instructions, orderId]
    );
    
    res.json({
      message: 'Order updated successfully'
    });
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

module.exports = router;
