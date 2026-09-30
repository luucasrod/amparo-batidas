const express = require('express');
const router = express.Router();
const { createPayment, getPaymentsByOrder, getOrderTotal } = require('../controllers/paymentController');

router.post('/', createPayment);
router.get('/:order_id', getPaymentsByOrder);
router.get('/:order_id/total', getOrderTotal);

module.exports = router;
