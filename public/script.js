// Initialize app on load
document.addEventListener('DOMContentLoaded', function() {
    checkStatus();
    loadTasks();
});

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

// Load tasks and update stats
async function loadTasks() {
    const tasksListEl = document.getElementById('tasksList');
    try {
        const response = await fetch('/api/tasks');
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            // Update stats
            document.getElementById('totalTasks').textContent = data.stats.total;
            document.getElementById('completedTasks').textContent = data.stats.completed;
            document.getElementById('inProgressTasks').textContent = data.stats.inProgress;
            document.getElementById('pendingTasks').textContent = data.stats.pending;
            
            // Render tasks
            tasksListEl.innerHTML = data.data.map(task => `
                <div class="task-item">
                    <div class="task-header">
                        <div class="task-title">${task.title}</div>
                        <div class="task-status status-${task.status}">${task.status.replace('-', ' ')}</div>
                    </div>
                    <div class="task-description">${task.description}</div>
                    <div class="task-meta">
                        <span class="priority priority-${task.priority}">${task.priority} priority</span>
                        <span>Created: ${task.createdAt}</span>
                    </div>
                    <div class="task-actions">
                        ${task.status !== 'pending' ? `<button class="btn-small btn-pending" onclick="updateTaskStatus(${task.id}, 'pending')">To Do</button>` : ''}
                        ${task.status !== 'in-progress' ? `<button class="btn-small btn-progress" onclick="updateTaskStatus(${task.id}, 'in-progress')">In Progress</button>` : ''}
                        ${task.status !== 'completed' ? `<button class="btn-small btn-complete" onclick="updateTaskStatus(${task.id}, 'completed')">Complete</button>` : ''}
                    </div>
                </div>
            `).join('');
        } else {
            tasksListEl.innerHTML = '<p>No tasks found</p>';
        }
    } catch (error) {
        tasksListEl.innerHTML = '<p>Error loading tasks</p>';
    }
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
    
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const priority = document.getElementById('priority').value;
    
    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, priority })
        });
        
        if (response.ok) {
            document.getElementById('title').value = '';
            document.getElementById('description').value = '';
            document.getElementById('priority').value = 'medium';
            loadTasks(); // Refresh the list
        } else {
            const error = await response.json();
            alert('Error: ' + error.error);
        }
    } catch (error) {
        alert('Error creating task');
    }
});

// Load tasks button
document.getElementById('loadTasks').addEventListener('click', loadTasks);