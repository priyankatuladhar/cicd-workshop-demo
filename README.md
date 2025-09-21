# 📋 Task Tracker Pro - CI/CD Workshop Demo

A modern task management application demonstrating CI/CD best practices with GitHub Actions & Docker.

## 🎆 Features

- **Modern Web Interface** - Clean, responsive task management UI
- **Real-time Statistics** - Live task completion tracking
- **RESTful API** with full CRUD operations
- **Task Status Management** - Pending, In Progress, Completed
- **Priority System** - High, Medium, Low priority tasks
- **JWT authentication** middleware
- **Health monitoring** endpoint
- **Comprehensive test suite**
- **Docker containerization**
- **GitHub Actions** CI/CD pipeline

## 🚀 API Endpoints

- `GET /health` - Health check with uptime
- `GET /api/tasks` - Get all tasks with statistics
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task status
- `GET /api/protected` - Protected route (requires JWT token)

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd cicd-workshop-demo

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the application
npm start
```

The server will start on `http://localhost:3000`

**🌐 Access the Web Interface:** Open your browser and go to `http://localhost:3000`

### Development

```bash
# Run in development mode
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Docker

```bash
# Build and run with Docker
docker build -t task-tracker .
docker run -p 3000:3000 task-tracker

# Or use Docker Compose (recommended)
docker-compose up --build

# Run in background
docker-compose up -d
```

### 🧪 Testing the API

```bash
# Health check
curl http://localhost:3000/health

# Get all tasks with stats
curl http://localhost:3000/api/tasks

# Create new task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Deploy to Production","description":"Release v2.0","priority":"high"}'

# Update task status
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'
```

## Project Structure

```
├── src/
│   ├── controllers/     # Business logic
│   ├── middleware/      # Custom middleware
│   ├── routes/         # Route definitions
│   └── app.js          # Express app setup
├── tests/              # Test files
├── .github/workflows/  # GitHub Actions
├── Dockerfile          # Container definition
└── package.json        # Dependencies
```
