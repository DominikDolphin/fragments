const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const bufferMessage = 'abcdef';
    const data = Buffer.from(bufferMessage);

    const res = await request(app)
      .get('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send(data);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  describe('GET /v1/fragments/:id', () => {
    test('User can get an id of a fragment', async () => {
      const bufferMessage = 'abcdef';
      const data = Buffer.from(bufferMessage);

      // post to create a fragment
      const res1 = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-type', 'text/plain')
        .send(data);

      const fragmentID = res1.body.fragment.id;

      // API request for GET id
      const res2 = await request(app)
        .get(`/v1/fragments/${fragmentID}`)
        .auth('user1@email.com', 'password1');

      expect(res2.statusCode).toBe(200);
      expect(res2.body.fragment.id).toBe(fragmentID);
      expect(res2.body.fragment.size).toBe(bufferMessage.length);
    });
  });
});
