const supabase = require('../config/supabaseClient');
const { generateQRCodeData, generateQRCodeImage } = require('../utils/qrcode');

const createTable = async (req, res) => {
  try {
    const { table_number, capacity } = req.body;

    if (!table_number) {
      return res.status(400).json({ error: 'Table number is required' });
    }

    const qrCodeData = generateQRCodeData(req.restaurantId, null, table_number);

    const { data, error } = await supabase
      .from('tables')
      .insert({
        restaurant_id: req.restaurantId,
        table_number,
        qr_code_data: qrCodeData,
        capacity: capacity || 4,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Table already exists' });
      }
      throw error;
    }

    const qrImage = await generateQRCodeImage(qrCodeData);

    res.status(201).json({ ...data, qr_image: qrImage });
  } catch (error) {
    console.error('Error creating table:', error);
    res.status(500).json({ error: error.message });
  }
};

const getRestaurantTables = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .eq('restaurant_id', req.restaurantId)
      .order('table_number');

    if (error) throw error;

    const tablesWithQR = await Promise.all(
      data.map(async (table) => ({
        ...table,
        qr_image: await generateQRCodeImage(table.qr_code_data),
      }))
    );

    res.json(tablesWithQR);
  } catch (error) {
    console.error('Error getting tables:', error);
    res.status(500).json({ error: error.message });
  }
};

const getTableByQRData = async (req, res) => {
  try {
    const { qr_data } = req.body;

    if (!qr_data) {
      return res.status(400).json({ error: 'QR data is required' });
    }

    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .eq('qr_code_data', qr_data)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Table not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error getting table:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { capacity, is_active } = req.body;

    const updates = {};
    if (capacity !== undefined) updates.capacity = capacity;
    if (is_active !== undefined) updates.is_active = is_active;

    const { data, error } = await supabase
      .from('tables')
      .update(updates)
      .eq('id', id)
      .eq('restaurant_id', req.restaurantId)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Table not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error updating table:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('tables')
      .delete()
      .eq('id', id)
      .eq('restaurant_id', req.restaurantId)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Table not found' });
    }

    res.json({ message: 'Table deleted successfully' });
  } catch (error) {
    console.error('Error deleting table:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTable,
  getRestaurantTables,
  getTableByQRData,
  updateTable,
  deleteTable,
};
