const express = require('express');
const router = express.Router();
const { createMenuItem, getRestaurantMenu, getMenuItemsByRestaurant, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, createMenuItem);
router.get('/', verifyToken, getMenuItemsByRestaurant);
router.get('/:restaurantId', getRestaurantMenu);
router.put('/:id', verifyToken, updateMenuItem);
router.delete('/:id', verifyToken, deleteMenuItem);

module.exports = router;
