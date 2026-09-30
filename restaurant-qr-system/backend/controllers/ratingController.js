const pool = require('../config/database');

const createRating = async (req, res) => {
  try {
    const { order_id, customer_name, rating, comment } = req.body;

    if (!order_id || !rating) {
      return res.status(400).json({ error: 'Order ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const orderResult = await pool.query('SELECT restaurant_id FROM orders WHERE id = $1', [order_id]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const restaurantId = orderResult.rows[0].restaurant_id;

    const result = await pool.query(
      'INSERT INTO ratings (restaurant_id, order_id, customer_name, rating, comment) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [restaurantId, order_id, customer_name, rating, comment]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating rating:', error);
    res.status(500).json({ error: error.message });
  }
};

const getRestaurantRatings = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const result = await pool.query(
      'SELECT * FROM ratings WHERE restaurant_id = $1 ORDER BY created_at DESC',
      [restaurantId]
    );

    const averageResult = await pool.query(
      'SELECT AVG(rating) as average_rating, COUNT(*) as total_ratings FROM ratings WHERE restaurant_id = $1',
      [restaurantId]
    );

    const stats = averageResult.rows[0];

    res.json({
      ratings: result.rows,
      statistics: {
        average_rating: stats.average_rating ? parseFloat(stats.average_rating.toFixed(2)) : 0,
        total_ratings: parseInt(stats.total_ratings),
      },
    });
  } catch (error) {
    console.error('Error getting ratings:', error);
    res.status(500).json({ error: error.message });
  }
};

const getRestaurantRatingsAuth = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM ratings WHERE restaurant_id = $1 ORDER BY created_at DESC',
      [req.restaurantId]
    );

    const averageResult = await pool.query(
      'SELECT AVG(rating) as average_rating, COUNT(*) as total_ratings FROM ratings WHERE restaurant_id = $1',
      [req.restaurantId]
    );

    const stats = averageResult.rows[0];

    res.json({
      ratings: result.rows,
      statistics: {
        average_rating: stats.average_rating ? parseFloat(stats.average_rating.toFixed(2)) : 0,
        total_ratings: parseInt(stats.total_ratings),
      },
    });
  } catch (error) {
    console.error('Error getting ratings:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createRating,
  getRestaurantRatings,
  getRestaurantRatingsAuth,
};
