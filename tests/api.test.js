const request = require('supertest');
const app = require('../src/app');

describe('API Endpoints', () => {


    it('should return health status', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('OK');
    });

    it('should get tasks data with stats', async () => {
        const response = await request(app).get('/api/tasks');
        expect(response.status).toBe(200);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.stats).toBeDefined();
    });

    it('should create a new task', async () => {
        const newTask = { title: 'Test Task', description: 'Test description', priority: 'high' };
        const response = await request(app)
            .post('/api/tasks')
            .send(newTask);
        expect(response.status).toBe(201);
        expect(response.body.data.title).toBe(newTask.title);
        expect(response.body.data.status).toBe('pending');
    });

    it('should return 400 for invalid task data', async () => {
        const response = await request(app)
            .post('/api/tasks')
            .send({ description: 'Test description' }); // missing title
        expect(response.status).toBe(400);
    });

    it('should update task status', async () => {
        const response = await request(app)
            .put('/api/tasks/1')
            .send({ status: 'completed' });
        expect(response.status).toBe(200);
        expect(response.body.data.status).toBe('completed');
    });
});