const pool = require('../config/database');
const { generateQRCodeData, generateQRCodeImage } = require('../utils/qrcode');

const createTable = async (req, res) => {
  try {
    const { table_number, capacity } = req.body;

    if (!table_number) {
      return res.status(400).json({ error: 'Table number is required' });
    }

    const qrCodeData = generateQRCodeData(req.restaurantId, null, table_number);

    const result = await pool.query(
      'INSERT INTO tables (restaurant_id, table_number, qr_code_data, capacity) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.restaurantId, table_number, qrCodeData, capacity || 4]
    );

    const table = result.rows[0];
    const qrImage = await generateQRCodeImage(qrCodeData);

    res.status(201).json({
      ...table,
      qr_image: qrImage,
    });
  } catch (error) {
    console.error('Error creating table:', error);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Table already exists' });
    }
    res.status(500).json({ error: error.message });
  }
};

const getRestaurantTables = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tables WHERE restaurant_id = $1 ORDER BY table_number',
      [req.restaurantId]
    );

    const tablesWithQR = await Promise.all(
      result.rows.map(async (table) => ({
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

    const result = await pool.query('SELECT * FROM tables WHERE qr_code_data = $1', [qr_data]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error getting table:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { capacity, is_active } = req.body;

    const result = await pool.query(
      'UPDATE tables SET capacity = COALESCE($1, capacity), is_active = COALESCE($2, is_active) WHERE id = $3 AND restaurant_id = $4 RETURNING *',
      [capacity, is_active, id, req.restaurantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating table:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM tables WHERE id = $1 AND restaurant_id = $2 RETURNING *',
      [id, req.restaurantId]
    );

    if (result.rows.length === 0) {
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
