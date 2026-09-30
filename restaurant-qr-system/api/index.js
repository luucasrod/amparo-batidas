const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '.env' });

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('../backend/routes/auth');
const tableRoutes = require('../backend/routes/tables');
const menuRoutes = require('../backend/routes/menu');
const orderRoutes = require('../backend/routes/orders');
const paymentRoutes = require('../backend/routes/payments');
const ratingRoutes = require('../backend/routes/ratings');

app.use('/api/auth', authRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ratings', ratingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running on Vercel' });
});

module.exports = app;
