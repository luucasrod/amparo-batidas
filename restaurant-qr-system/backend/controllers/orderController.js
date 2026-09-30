const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const createOrder = async (req, res) => {
  try {
    const { table_id } = req.body;

    if (!table_id) {
      return res.status(400).json({ error: 'Table ID is required' });
    }

    const sessionId = uuidv4();

    const tableResult = await pool.query('SELECT restaurant_id FROM tables WHERE id = $1', [table_id]);

    if (tableResult.rows.length === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }

    const restaurantId = tableResult.rows[0].restaurant_id;

    const result = await pool.query(
      'INSERT INTO orders (table_id, restaurant_id, session_id, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [table_id, restaurantId, sessionId, 'open']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
};

const addOrderItem = async (req, res) => {
  try {
    const { order_id, menu_item_id, customer_name, quantity, notes } = req.body;

    if (!order_id || !menu_item_id || !customer_name) {
      return res.status(400).json({ error: 'Order ID, menu item ID and customer name are required' });
    }

    const menuResult = await pool.query('SELECT price FROM menu_items WHERE id = $1', [menu_item_id]);

    if (menuResult.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    const price = menuResult.rows[0].price;

    const result = await pool.query(
      'INSERT INTO order_items (order_id, menu_item_id, customer_name, quantity, price, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [order_id, menu_item_id, customer_name, quantity || 1, price, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding order item:', error);
    res.status(500).json({ error: error.message });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { order_id } = req.params;

    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [order_id]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const itemsResult = await pool.query(
      `SELECT oi.*, mi.name as item_name
       FROM order_items oi
       JOIN menu_items mi ON oi.menu_item_id = mi.id
       WHERE oi.order_id = $1`,
      [order_id]
    );

    const order = orderResult.rows[0];
    const items = itemsResult.rows;

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({
      ...order,
      items,
      total: parseFloat(total.toFixed(2)),
    });
  } catch (error) {
    console.error('Error getting order details:', error);
    res.status(500).json({ error: error.message });
  }
};

const getOrderItemsByCustomer = async (req, res) => {
  try {
    const { order_id, customer_name } = req.params;

    const result = await pool.query(
      `SELECT oi.*, mi.name as item_name
       FROM order_items oi
       JOIN menu_items mi ON oi.menu_item_id = mi.id
       WHERE oi.order_id = $1 AND oi.customer_name = $2`,
      [order_id, customer_name]
    );

    const total = result.rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({
      customer_name,
      items: result.rows,
      total: parseFloat(total.toFixed(2)),
    });
  } catch (error) {
    console.error('Error getting customer items:', error);
    res.status(500).json({ error: error.message });
  }
};

const markItemAsPaymentPending = async (req, res) => {
  try {
    const { item_id } = req.params;

    const result = await pool.query(
      'UPDATE order_items SET is_paid = true WHERE id = $1 RETURNING *',
      [item_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order item not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error marking item as paid:', error);
    res.status(500).json({ error: error.message });
  }
};

const getOrdersByTable = async (req, res) => {
  try {
    const { table_id } = req.params;

    const result = await pool.query(
      'SELECT * FROM orders WHERE table_id = $1 ORDER BY created_at DESC',
      [table_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ error: error.message });
  }
};

const closeOrder = async (req, res) => {
  try {
    const { order_id } = req.params;

    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['closed', order_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error closing order:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  addOrderItem,
  getOrderDetails,
  getOrderItemsByCustomer,
  markItemAsPaymentPending,
  getOrdersByTable,
  closeOrder,
};
