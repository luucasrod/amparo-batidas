const supabase = require('../config/supabaseClient');

const createRating = async (req, res) => {
  try {
    const { order_id, customer_name, rating, comment } = req.body;

    if (!order_id || !rating) {
      return res.status(400).json({ error: 'Order ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('restaurant_id')
      .eq('id', order_id)
      .single();

    if (orderError || !orderData) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const { data, error } = await supabase
      .from('ratings')
      .insert({
        restaurant_id: orderData.restaurant_id,
        order_id,
        customer_name,
        rating,
        comment,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating rating:', error);
    res.status(500).json({ error: error.message });
  }
};

const getRestaurantRatings = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const { data: ratings, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const total = ratings.length;
    const average = total > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / total
      : 0;

    res.json({
      ratings,
      statistics: {
        average_rating: parseFloat(average.toFixed(2)),
        total_ratings: total,
      },
    });
  } catch (error) {
    console.error('Error getting ratings:', error);
    res.status(500).json({ error: error.message });
  }
};

const getRestaurantRatingsAuth = async (req, res) => {
  try {
    const { data: ratings, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('restaurant_id', req.restaurantId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const total = ratings.length;
    const average = total > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / total
      : 0;

    res.json({
      ratings,
      statistics: {
        average_rating: parseFloat(average.toFixed(2)),
        total_ratings: total,
      },
    });
  } catch (error) {
    console.error('Error getting ratings:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createRating, getRestaurantRatings, getRestaurantRatingsAuth };
