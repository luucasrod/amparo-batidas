const express = require('express');
const router = express.Router();
const { createRating, getRestaurantRatings, getRestaurantRatingsAuth } = require('../controllers/ratingController');
const { verifyToken } = require('../middleware/auth');

router.post('/', createRating);
router.get('/:restaurantId', getRestaurantRatings);
router.get('/auth/my-ratings', verifyToken, getRestaurantRatingsAuth);

module.exports = router;
