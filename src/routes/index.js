const express = require('express');
const router = express.Router();
const { getHealth } = require('../controllers/index');

// Health check endpoint
router.get('/health', getHealth);



// API routes
const apiRoutes = require('./api');
router.use('/api', apiRoutes);

module.exports = router;