const pool = require('../config/database');

const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, image_url } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const result = await pool.query(
      'INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.restaurantId, name, description, price, category, image_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ error: error.message });
  }
};

const getRestaurantMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const result = await pool.query(
      'SELECT * FROM menu_items WHERE restaurant_id = $1 AND is_available = true ORDER BY category, name',
      [restaurantId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error getting menu:', error);
    res.status(500).json({ error: error.message });
  }
};

const getMenuItemsByRestaurant = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM menu_items WHERE restaurant_id = $1 ORDER BY category, name',
      [req.restaurantId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error getting menu items:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image_url, is_available } = req.body;

    const result = await pool.query(
      'UPDATE menu_items SET name = COALESCE($1, name), description = COALESCE($2, description), price = COALESCE($3, price), category = COALESCE($4, category), image_url = COALESCE($5, image_url), is_available = COALESCE($6, is_available), updated_at = CURRENT_TIMESTAMP WHERE id = $7 AND restaurant_id = $8 RETURNING *',
      [name, description, price, category, image_url, is_available, id, req.restaurantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM menu_items WHERE id = $1 AND restaurant_id = $2 RETURNING *',
      [id, req.restaurantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createMenuItem,
  getRestaurantMenu,
  getMenuItemsByRestaurant,
  updateMenuItem,
  deleteMenuItem,
};
