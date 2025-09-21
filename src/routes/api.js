const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask } = require('../controllers/index');
const auth = require('../middleware/auth');

// Task endpoints
router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTask);

// Protected endpoint example
router.get('/protected', auth, (req, res) => {
    res.json({ 
        message: 'This is a protected route',
        userId: req.userId,
        timestamp: new Date().toISOString()
    });
});

module.exports = router;