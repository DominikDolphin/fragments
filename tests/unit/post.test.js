const request = require('supertest');
const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  test('authenticated can create a fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send({ body: 'asdf' });

    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.id).toMatch(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
    );
    expect(res.body.fragment.type).toBe('application/json');
    expect(res.body.fragment.size).toBe(15);
    expect(res.body.fragment.ownerId).toBeDefined();
    expect(Date.parse(res.body.fragment.created)).not.toBeNaN();
    expect(Date.parse(res.body.fragment.updated)).not.toBeNaN();
  });

  test('Missing Content Type', async () => {
    const res = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1');

    expect(res.body.error.code).toBe(500);
  });

  test('Invalid Media Type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plains');

    expect(res.body.error.code).toBe(415);
  });
});
