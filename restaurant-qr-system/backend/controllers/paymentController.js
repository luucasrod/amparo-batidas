const supabase = require('../config/supabaseClient');

const createPayment = async (req, res) => {
  try {
    const { order_id, customer_name, amount, payment_method } = req.body;

    if (!order_id || !customer_name || !amount) {
      return res.status(400).json({ error: 'Order ID, customer name and amount are required' });
    }

    const { data, error } = await supabase
      .from('payments')
      .insert({
        order_id,
        customer_name,
        amount,
        payment_method: payment_method || 'cash',
        status: 'completed',
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: error.message });
  }
};

const getPaymentsByOrder = async (req, res) => {
  try {
    const { order_id } = req.params;

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', order_id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error getting payments:', error);
    res.status(500).json({ error: error.message });
  }
};

const getOrderTotal = async (req, res) => {
  try {
    const { order_id } = req.params;

    const { data, error } = await supabase
      .from('payments')
      .select('amount')
      .eq('order_id', order_id)
      .eq('status', 'completed');

    if (error) throw error;

    const total = data.reduce((sum, p) => sum + parseFloat(p.amount), 0);

    res.json({ total: parseFloat(total.toFixed(2)) });
  } catch (error) {
    console.error('Error getting order total:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPayment, getPaymentsByOrder, getOrderTotal };
