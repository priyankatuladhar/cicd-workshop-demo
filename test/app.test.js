const request = require('supertest');
const app = require('../src/app');

describe('App Tests', () => {
  test('GET / should return welcome message', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);
    
    expect(response.text).toContain('Welcome');
  });

  test('GET /health should return OK', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body.status).toBe('OK');
  });

  test('App should start without errors', () => {
    expect(app).toBeDefined();
  });
});