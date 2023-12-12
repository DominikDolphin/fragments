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

        console.log(res2);
      expect(res2.statusCode).toBe(200);
      expect(res2.text).toBe(bufferMessage);
    });

    test('GET /v1/fragments/:id returns expected content-type using text/html', async () => {
      const contentTypeTest = 'text/html';
      const bufferMessage = 'message101';
      const data = Buffer.from(bufferMessage);

      // post to create a fragment
      const res1 = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-type', contentTypeTest)
        .send(data);

      const fragmentID = res1.body.fragment.id;

      // API request for GET id
      const res2 = await request(app)
        .get(`/v1/fragments/${fragmentID}`)
        .auth('user1@email.com', 'password1');

      expect(res2.statusCode).toBe(200);
      expect(res2.text).toBe(bufferMessage);
    });

    test('GET /v1/fragments/:id returns expected content-type using text/markdown', async () => {
      const contentTypeTest = 'text/markdown';
      const bufferMessage = 'message101';
      const data = Buffer.from(bufferMessage);

      // post to create a fragment
      const res1 = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-type', contentTypeTest)
        .send(data);

      const fragmentID = res1.body.fragment.id;

      // API request for GET id
      const res2 = await request(app)
        .get(`/v1/fragments/${fragmentID}`)
        .auth('user1@email.com', 'password1');

      expect(res2.statusCode).toBe(200);
      expect(res2.text).toBe(bufferMessage);
    });

    test('GET /v1/fragments/:id returns expected content-type using text/markdown', async () => {
      const contentTypeTest = 'text/markdown';
      const bufferMessage = 'message101';
      const data = Buffer.from(bufferMessage);

      // post to create a fragment
      const res1 = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-type', contentTypeTest)
        .send(data);

      const fragmentID = res1.body.fragment.id;

      // API request for GET id
      const res2 = await request(app)
        .get(`/v1/fragments/${fragmentID}`)
        .auth('user1@email.com', 'password1');

      expect(res2.statusCode).toBe(200);
      expect(res2.text).toBe(bufferMessage);
    });

    test('GET /v1/fragments/:id on an id that does not exist', async () => {

      // API request for GET id
      const res2 = await request(app)
        .get(`/v1/fragments/asdfasdfasdf`)
        .auth('user1@email.com', 'password1');

      expect(res2.statusCode).toBe(404);
      
    });

    test('GET /v1/fragments/:id an image', async () => {
      const contentTypeTest = 'image/png';

      //A very small image/png BASE64 encoded (1x1 resolution)
      const bufferMessage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

      const data = Buffer.from(bufferMessage);

      // post to create a fragment
      const res1 = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-type', contentTypeTest)
        .send(data);

      const fragmentID = res1.body.fragment.id;

      // API request for GET id
      const res2 = await request(app)
        .get(`/v1/fragments/${fragmentID}`)
        .auth('user1@email.com', 'password1');

        console.log(res2);
      expect(res2.statusCode).toBe(200);
      expect(res2.type).toBe('image/png');
      
    });
  });

});
