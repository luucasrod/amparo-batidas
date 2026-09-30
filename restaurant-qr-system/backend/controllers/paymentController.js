const pool = require('../config/database');

const createPayment = async (req, res) => {
  try {
    const { order_id, customer_name, amount, payment_method } = req.body;

    if (!order_id || !customer_name || !amount) {
      return res.status(400).json({ error: 'Order ID, customer name and amount are required' });
    }

    const result = await pool.query(
      'INSERT INTO payments (order_id, customer_name, amount, payment_method, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [order_id, customer_name, amount, payment_method || 'cash', 'completed']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: error.message });
  }
};

const getPaymentsByOrder = async (req, res) => {
  try {
    const { order_id } = req.params;

    const result = await pool.query(
      'SELECT * FROM payments WHERE order_id = $1 ORDER BY created_at DESC',
      [order_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error getting payments:', error);
    res.status(500).json({ error: error.message });
  }
};

const getOrderTotal = async (req, res) => {
  try {
    const { order_id } = req.params;

    const result = await pool.query(
      'SELECT SUM(amount) as total FROM payments WHERE order_id = $1 AND status = $2',
      [order_id, 'completed']
    );

    const total = result.rows[0].total || 0;

    res.json({ total: parseFloat(total) });
  } catch (error) {
    console.error('Error getting order total:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPayment,
  getPaymentsByOrder,
  getOrderTotal,
};
