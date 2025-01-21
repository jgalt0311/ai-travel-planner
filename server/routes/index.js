const express = require('express');
const authRoutes = require('./authRoutes');
const itineraryRoutes = require('./itineraryRoutes');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/itineraries', authenticateToken, itineraryRoutes);

module.exports = router;