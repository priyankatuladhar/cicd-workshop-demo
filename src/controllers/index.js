const tasks = [
    { id: 1, title: 'Setup CI/CD Pipeline', description: 'Configure GitHub Actions with automated testing', status: 'completed', priority: 'high', category: 'DevOps', dueDate: '2024-01-20', assignee: 'John Doe', createdAt: '2024-01-15', completedAt: '2024-01-18' },
    { id: 2, title: 'Write Unit Tests', description: 'Add comprehensive test coverage for all components', status: 'in-progress', priority: 'medium', category: 'Development', dueDate: '2024-01-25', assignee: 'Jane Smith', createdAt: '2024-01-16' },
    { id: 3, title: 'Deploy to Production', description: 'Release new features to production environment', status: 'pending', priority: 'high', category: 'Deployment', dueDate: '2024-01-30', assignee: 'Mike Johnson', createdAt: '2024-01-17' },
    { id: 4, title: 'Code Review', description: 'Review pull requests and provide feedback', status: 'in-progress', priority: 'medium', category: 'Development', dueDate: '2024-01-22', assignee: 'Sarah Wilson', createdAt: '2024-01-18' },
    { id: 5, title: 'Update Documentation', description: 'Update API documentation and user guides', status: 'pending', priority: 'low', category: 'Documentation', dueDate: '2024-02-01', assignee: 'Alex Brown', createdAt: '2024-01-19' }
];

const getTasks = (req, res) => {
    const { search, category, status, priority } = req.query;
    let filteredTasks = [...tasks];
    
    // Apply filters
    if (search) {
        filteredTasks = filteredTasks.filter(t => 
            t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.description.toLowerCase().includes(search.toLowerCase())
        );
    }
    if (category) filteredTasks = filteredTasks.filter(t => t.category === category);
    if (status) filteredTasks = filteredTasks.filter(t => t.status === status);
    if (priority) filteredTasks = filteredTasks.filter(t => t.priority === priority);
    
    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'completed').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        pending: tasks.filter(t => t.status === 'pending').length,
        overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length
    };
    
    const categories = [...new Set(tasks.map(t => t.category))];
    
    res.json({ 
        message: 'Tasks retrieved successfully',
        data: filteredTasks,
        stats,
        categories,
        timestamp: new Date().toISOString()
    });
};

const createTask = (req, res) => {
    const { title, description, priority = 'medium', category = 'General', dueDate, assignee } = req.body;
    
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    
    const newTask = {
        id: Math.max(...tasks.map(t => t.id), 0) + 1,
        title,
        description: description || '',
        status: 'pending',
        priority,
        category,
        dueDate: dueDate || null,
        assignee: assignee || 'Unassigned',
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
    const { status, title, description, priority, category, dueDate, assignee } = req.body;
    
    const task = tasks.find(t => t.id === parseInt(id));
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    if (status) task.status = status;
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority) task.priority = priority;
    if (category) task.category = category;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (assignee !== undefined) task.assignee = assignee;
    
    res.json({
        message: 'Task updated successfully',
        data: task
    });
};

const deleteTask = (req, res) => {
    const { id } = req.params;
    const taskIndex = tasks.findIndex(t => t.id === parseInt(id));
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    const deletedTask = tasks.splice(taskIndex, 1)[0];
    
    res.json({
        message: 'Task deleted successfully',
        data: deletedTask
    });
};

const getHealth = (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
};

module.exports = { getTasks, createTask, updateTask, deleteTask, getHealth };