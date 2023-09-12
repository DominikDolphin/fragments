const request = require('supertest');

const app = require('../../src/app');

describe('GET v1/fragmentsDONTEXIST', () => {
  test('Request resource not found', async () => {
    const res = await request(app)
      .get('/v1/fragmentsDONTEXIST')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.error.message).toBe('not found');
    expect(res.body.error.code).toBe(404);
  });
});
