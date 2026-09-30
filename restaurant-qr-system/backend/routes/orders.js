const express = require('express');
const router = express.Router();
const { createOrder, addOrderItem, getOrderDetails, getOrderItemsByCustomer, markItemAsPaymentPending, getOrdersByTable, closeOrder } = require('../controllers/orderController');

router.post('/', createOrder);
router.post('/item', addOrderItem);
router.get('/:order_id', getOrderDetails);
router.get('/:order_id/:customer_name', getOrderItemsByCustomer);
router.put('/item/:item_id/paid', markItemAsPaymentPending);
router.get('/table/:table_id', getOrdersByTable);
router.put('/:order_id/close', closeOrder);

module.exports = router;
