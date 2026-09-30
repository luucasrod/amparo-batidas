const supabase = require('../config/supabaseClient');

const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, image_url } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const { data, error } = await supabase
      .from('menu_items')
      .insert({ restaurant_id: req.restaurantId, name, description, price, category, image_url })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ error: error.message });
  }
};

const getRestaurantMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_available', true)
      .order('category')
      .order('name');

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error getting menu:', error);
    res.status(500).json({ error: error.message });
  }
};

const getMenuItemsByRestaurant = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', req.restaurantId)
      .order('category')
      .order('name');

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error getting menu items:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image_url, is_available } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = price;
    if (category !== undefined) updates.category = category;
    if (image_url !== undefined) updates.image_url = image_url;
    if (is_available !== undefined) updates.is_available = is_available;

    const { data, error } = await supabase
      .from('menu_items')
      .update(updates)
      .eq('id', id)
      .eq('restaurant_id', req.restaurantId)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id)
      .eq('restaurant_id', req.restaurantId)
      .select()
      .single();

    if (error || !data) {
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
