const supabase = require('../config/supabaseClient');
const { generateToken, hashPassword, comparePassword } = require('../utils/jwt');

const registerRestaurant = async (req, res) => {
  try {
    const { name, email, password, phone, address, city } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const hashedPassword = await hashPassword(password);

    const { data, error } = await supabase
      .from('restaurants')
      .insert({ name, email, password: hashedPassword, phone, address, city })
      .select('id, name, email')
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Email already exists' });
      }
      throw error;
    }

    const token = generateToken(data.id);

    res.status(201).json({
      message: 'Restaurant registered successfully',
      restaurant: data,
      token,
    });
  } catch (error) {
    console.error('Error registering restaurant:', error);
    res.status(500).json({ error: error.message });
  }
};

const loginRestaurant = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await comparePassword(password, data.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(data.id);

    res.json({
      message: 'Logged in successfully',
      restaurant: { id: data.id, name: data.name, email: data.email },
      token,
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: error.message });
  }
};

const getRestaurantProfile = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('id, name, email, phone, address, city, logo_url, created_at')
      .eq('id', req.restaurantId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error getting restaurant profile:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateRestaurantProfile = async (req, res) => {
  try {
    const { name, phone, address, city, logo_url } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (address !== undefined) updates.address = address;
    if (city !== undefined) updates.city = city;
    if (logo_url !== undefined) updates.logo_url = logo_url;

    const { data, error } = await supabase
      .from('restaurants')
      .update(updates)
      .eq('id', req.restaurantId)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
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
