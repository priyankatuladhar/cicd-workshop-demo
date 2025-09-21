// Initialize app on load
document.addEventListener('DOMContentLoaded', function() {
    checkStatus();
    loadTasks();
    initializeFilters();
    initializeDarkMode();
    
    // Auto-refresh every 30 seconds
    setInterval(() => {
        checkStatus();
        loadTasks();
    }, 30000);
});

// Dark mode toggle
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    }
    
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
        darkModeToggle.textContent = isDark ? '☀️' : '🌙';
    });
}

// Initialize filters
function initializeFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    
    // Debounced search
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => loadTasks(), 300);
    });
    
    categoryFilter.addEventListener('change', loadTasks);
    statusFilter.addEventListener('change', loadTasks);
    priorityFilter.addEventListener('change', loadTasks);
    
    // Export functionality
    document.getElementById('exportBtn').addEventListener('click', exportTasks);
}

// Export tasks to JSON
function exportTasks() {
    fetch('/api/tasks')
        .then(response => response.json())
        .then(data => {
            const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        });
}

// Check health status
async function checkStatus() {
    const statusEl = document.getElementById('status');
    try {
        const response = await fetch('/health');
        const data = await response.json();
        
        if (data.status === 'OK') {
            statusEl.textContent = `✅ Online (Uptime: ${Math.floor(data.uptime)}s)`;
            statusEl.className = 'status-indicator online';
        }
    } catch (error) {
        statusEl.textContent = '❌ Offline';
        statusEl.className = 'status-indicator offline';
    }
}

// Load tasks with filters and update stats
async function loadTasks() {
    const tasksListEl = document.getElementById('tasksList');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    
    const params = new URLSearchParams();
    if (searchInput?.value) params.append('search', searchInput.value);
    if (categoryFilter?.value) params.append('category', categoryFilter.value);
    if (statusFilter?.value) params.append('status', statusFilter.value);
    if (priorityFilter?.value) params.append('priority', priorityFilter.value);
    
    try {
        const response = await fetch(`/api/tasks?${params}`);
        const data = await response.json();
        
        // Update stats with animation
        updateStatsWithAnimation(data.stats);
        
        // Update category filter options
        if (data.categories && categoryFilter) {
            const currentValue = categoryFilter.value;
            categoryFilter.innerHTML = '<option value="">All Categories</option>' +
                data.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
            categoryFilter.value = currentValue;
        }
        
        if (data.data && data.data.length > 0) {
            // Render tasks with enhanced UI
            tasksListEl.innerHTML = data.data.map(task => {
                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
                const daysUntilDue = task.dueDate ? Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;
                
                return `
                    <div class="task-item ${task.status} ${isOverdue ? 'overdue' : ''}">
                        <div class="task-header">
                            <div class="task-title">${task.title}</div>
                            <div class="task-status status-${task.status}">${task.status.replace('-', ' ')}</div>
                        </div>
                        <div class="task-description">${task.description}</div>
                        <div class="task-meta">
                            <div class="task-meta-left">
                                <span class="priority priority-${task.priority}">${task.priority}</span>
                                <span class="category">📁 ${task.category}</span>
                                <span class="assignee">👤 ${task.assignee}</span>
                            </div>
                            <div class="task-meta-right">
                                ${task.dueDate ? `<span class="due-date ${isOverdue ? 'overdue' : ''}">
                                    📅 ${task.dueDate} ${daysUntilDue !== null ? `(${daysUntilDue > 0 ? daysUntilDue + ' days left' : Math.abs(daysUntilDue) + ' days overdue'})` : ''}
                                </span>` : ''}
                                <span class="created-date">Created: ${task.createdAt}</span>
                            </div>
                        </div>
                        <div class="task-actions">
                            ${task.status !== 'pending' ? `<button class="btn-small btn-pending" onclick="updateTaskStatus(${task.id}, 'pending')">To Do</button>` : ''}
                            ${task.status !== 'in-progress' ? `<button class="btn-small btn-progress" onclick="updateTaskStatus(${task.id}, 'in-progress')">In Progress</button>` : ''}
                            ${task.status !== 'completed' ? `<button class="btn-small btn-complete" onclick="updateTaskStatus(${task.id}, 'completed')">Complete</button>` : ''}
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            tasksListEl.innerHTML = '<div class="no-tasks">📋 No tasks found</div>';
        }
    } catch (error) {
        tasksListEl.innerHTML = '<div class="error">⚠️ Error loading tasks</div>';
    }
}

// Animate stats updates
function updateStatsWithAnimation(stats) {
    const statElements = {
        totalTasks: stats.total,
        completedTasks: stats.completed,
        inProgressTasks: stats.inProgress,
        pendingTasks: stats.pending,
        overdueTasks: stats.overdue || 0
    };
    
    Object.entries(statElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            const currentValue = parseInt(element.textContent) || 0;
            if (currentValue !== value) {
                element.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    element.textContent = value;
                    element.style.transform = 'scale(1)';
                }, 150);
            }
        }
    });
}

// Update task status
async function updateTaskStatus(taskId, status) {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            loadTasks(); // Refresh the list
        }
    } catch (error) {
        alert('Error updating task');
    }
}

// Handle form submission
document.getElementById('taskForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        priority: document.getElementById('priority').value,
        category: document.getElementById('category').value,
        dueDate: document.getElementById('dueDate').value || null,
        assignee: document.getElementById('assignee').value || 'Unassigned'
    };
    
    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            // Reset form
            document.getElementById('taskForm').reset();
            document.getElementById('priority').value = 'medium';
            document.getElementById('category').value = 'Development';
            
            // Show success animation
            const submitBtn = document.querySelector('.btn-primary');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '✓ Created!';
            submitBtn.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = 'linear-gradient(45deg, #8B7355, #A0937D)';
            }, 2000);
            
            loadTasks(); // Refresh the list
        } else {
            const error = await response.json();
            showNotification('Error: ' + error.error, 'error');
        }
    } catch (error) {
        showNotification('Error creating task', 'error');
    }
});

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        background: ${type === 'error' ? '#dc3545' : '#28a745'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Load tasks button
document.getElementById('loadTasks').addEventListener('click', loadTasks);