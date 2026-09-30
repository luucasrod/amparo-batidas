const express = require('express');
const router = express.Router();
const { registerRestaurant, loginRestaurant, getRestaurantProfile, updateRestaurantProfile } = require('../controllers/restaurantController');
const { verifyToken } = require('../middleware/auth');

router.post('/register', registerRestaurant);
router.post('/login', loginRestaurant);
router.get('/profile', verifyToken, getRestaurantProfile);
router.put('/profile', verifyToken, updateRestaurantProfile);

module.exports = router;
