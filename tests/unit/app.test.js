const request = require('supertest');

const app = require('../../src/app');

describe('GET v1/fragments', () => {
  test('Request URL resource that does not exist', async () => {
    const res = await request(app)
      .get('/v1/fragmentsDONTEXIST')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.error.message).toBe('not found');
    expect(res.body.error.code).toBe(404);
  });

  test('Request URL without authentication', async () => {
    const res = await request(app).get('/v1/fragments').auth('falseemail@email.com', 'password1');

    expect(res.body.status).toBe('error');
    expect(res.body.error.message).toBe('Unauthorized');
    expect(res.body.error.code).toBe(401);
  });

  test('Request URL with proper authentication', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');

    expect(res.body.status).toBe('ok');
    expect(res.body.fragments).toEqual([]);
  });

  test('Posting a content type that does not exist results in error', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'asdf');

    expect(res.body.status).toBe('error');
    expect(res.body.error.code).toBe(500);
  });
});
