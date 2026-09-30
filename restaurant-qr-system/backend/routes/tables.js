const express = require('express');
const router = express.Router();
const { createTable, getRestaurantTables, getTableByQRData, updateTable, deleteTable } = require('../controllers/tableController');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, createTable);
router.get('/', verifyToken, getRestaurantTables);
router.post('/scan', getTableByQRData);
router.put('/:id', verifyToken, updateTable);
router.delete('/:id', verifyToken, deleteTable);

module.exports = router;
