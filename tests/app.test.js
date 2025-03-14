const request = require('supertest');
const app = require('../src/app');

describe('Test app.js', () => {
  test('GET / should return Hello, World!', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Hello, World!');
  });
});
