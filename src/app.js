const express = require('express');
const cors = require('cors');
const config = require('../config');
const routes = require('./routes/index');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.use('/', routes);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server only if not in test environment
if (require.main === module) {
    app.listen(config.port, () => {
        console.log(`🚀 Server running on port ${config.port}`);
        console.log(`📝 Environment: ${config.nodeEnv}`);
    });
}

module.exports = app;