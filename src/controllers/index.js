const tasks = [
    { id: 1, title: 'Setup CI/CD Pipeline', description: 'Configure GitHub Actions', status: 'completed', priority: 'high', createdAt: '2024-01-15' },
    { id: 2, title: 'Write Unit Tests', description: 'Add comprehensive test coverage', status: 'in-progress', priority: 'medium', createdAt: '2024-01-16' },
    { id: 3, title: 'Deploy to Production', description: 'Release new features', status: 'pending', priority: 'high', createdAt: '2024-01-17' }
];

const getTasks = (req, res) => {
    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'completed').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        pending: tasks.filter(t => t.status === 'pending').length
    };
    
    res.json({ 
        message: 'Tasks retrieved successfully',
        data: tasks,
        stats,
        timestamp: new Date().toISOString()
    });
};

const createTask = (req, res) => {
    const { title, description, priority = 'medium' } = req.body;
    
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    
    const newTask = {
        id: tasks.length + 1,
        title,
        description: description || '',
        status: 'pending',
        priority,
        createdAt: new Date().toISOString().split('T')[0]
    };
    
    tasks.push(newTask);
    
    res.status(201).json({
        message: 'Task created successfully',
        data: newTask
    });
};

const updateTask = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const task = tasks.find(t => t.id === parseInt(id));
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    if (status) task.status = status;
    
    res.json({
        message: 'Task updated successfully',
        data: task
    });
};

const getHealth = (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
};

module.exports = { getTasks, createTask, updateTask, getHealth };