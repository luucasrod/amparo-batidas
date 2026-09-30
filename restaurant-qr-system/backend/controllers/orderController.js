const supabase = require('../config/supabaseClient');
const { v4: uuidv4 } = require('uuid');

const createOrder = async (req, res) => {
  try {
    const { table_id } = req.body;

    if (!table_id) {
      return res.status(400).json({ error: 'Table ID is required' });
    }

    const sessionId = uuidv4();

    const { data: tableData, error: tableError } = await supabase
      .from('tables')
      .select('restaurant_id')
      .eq('id', table_id)
      .single();

    if (tableError || !tableData) {
      return res.status(404).json({ error: 'Table not found' });
    }

    const { data, error } = await supabase
      .from('orders')
      .insert({
        table_id,
        restaurant_id: tableData.restaurant_id,
        session_id: sessionId,
        status: 'open',
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
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

    const { data: menuData, error: menuError } = await supabase
      .from('menu_items')
      .select('price')
      .eq('id', menu_item_id)
      .single();

    if (menuError || !menuData) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    const { data, error } = await supabase
      .from('order_items')
      .insert({
        order_id,
        menu_item_id,
        customer_name,
        quantity: quantity || 1,
        price: menuData.price,
        notes,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Error adding order item:', error);
    res.status(500).json({ error: error.message });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { order_id } = req.params;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*, menu_items(name)')
      .eq('order_id', order_id);

    if (itemsError) throw itemsError;

    const flatItems = items.map((item) => ({
      ...item,
      item_name: item.menu_items?.name,
      menu_items: undefined,
    }));

    const total = flatItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.json({
      ...order,
      items: flatItems,
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

    const { data: items, error } = await supabase
      .from('order_items')
      .select('*, menu_items(name)')
      .eq('order_id', order_id)
      .eq('customer_name', customer_name);

    if (error) throw error;

    const flatItems = items.map((item) => ({
      ...item,
      item_name: item.menu_items?.name,
      menu_items: undefined,
    }));

    const total = flatItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.json({
      customer_name,
      items: flatItems,
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

    const { data, error } = await supabase
      .from('order_items')
      .update({ is_paid: true })
      .eq('id', item_id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Order item not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error marking item as paid:', error);
    res.status(500).json({ error: error.message });
  }
};

const getOrdersByTable = async (req, res) => {
  try {
    const { table_id } = req.params;

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('table_id', table_id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ error: error.message });
  }
};

const closeOrder = async (req, res) => {
  try {
    const { order_id } = req.params;

    const { data, error } = await supabase
      .from('orders')
      .update({ status: 'closed' })
      .eq('id', order_id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(data);
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
