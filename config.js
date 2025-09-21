require('dotenv').config();

module.exports = {
    secret: process.env.JWT_SECRET || 'default-secret-key',
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development'
};