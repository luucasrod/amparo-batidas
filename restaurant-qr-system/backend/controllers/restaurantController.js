const pool = require('../config/database');
const { generateToken, hashPassword, comparePassword } = require('../utils/jwt');

const registerRestaurant = async (req, res) => {
  try {
    const { name, email, password, phone, address, city } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const hashedPassword = await hashPassword(password);

    const result = await pool.query(
      'INSERT INTO restaurants (name, email, password, phone, address, city) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email',
      [name, email, hashedPassword, phone, address, city]
    );

    const token = generateToken(result.rows[0].id);

    res.status(201).json({
      message: 'Restaurant registered successfully',
      restaurant: result.rows[0],
      token,
    });
  } catch (error) {
    console.error('Error registering restaurant:', error);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: error.message });
  }
};

const loginRestaurant = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await pool.query('SELECT * FROM restaurants WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const restaurant = result.rows[0];
    const isPasswordValid = await comparePassword(password, restaurant.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(restaurant.id);

    res.json({
      message: 'Logged in successfully',
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        email: restaurant.email,
      },
      token,
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: error.message });
  }
};

const getRestaurantProfile = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, address, city, logo_url, created_at FROM restaurants WHERE id = $1',
      [req.restaurantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error getting restaurant profile:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateRestaurantProfile = async (req, res) => {
  try {
    const { name, phone, address, city, logo_url } = req.body;

    const result = await pool.query(
      'UPDATE restaurants SET name = COALESCE($1, name), phone = COALESCE($2, phone), address = COALESCE($3, address), city = COALESCE($4, city), logo_url = COALESCE($5, logo_url), updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [name, phone, address, city, logo_url, req.restaurantId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating restaurant profile:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerRestaurant,
  loginRestaurant,
  getRestaurantProfile,
  updateRestaurantProfile,
};
