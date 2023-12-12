const request = require('supertest');
const app = require('../../src/app');

describe('API Responses', () => {
  test('Authenticated user not updating with the same content-type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .send('# test');

    expect(res.header.location).not.toBe('');
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    const updateRes = await request(app)
      .put(`/v1/fragments/${res.body.fragment.id}`)
      .set('Content-Type', 'text/markdown')
      .auth('user1@email.com', 'password1')
      .send('updated test to fail');

    expect(updateRes.body.status).toBe('error');
    expect(updateRes.body.error.code).toBe(400);
  });

  test('Authenticated user updating with an invalid content-type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/markdown')
      .auth('user1@email.com', 'password1')
      .send('# test');

    expect(res.header.location).not.toBe('');
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    const updateRes = await request(app)
      .put(`/v1/fragments/${res.body.fragment.id}`)
      .set('Content-Type', 'this/notexist')
      .auth('user1@email.com', 'password1')
      .send('updated test to fail');

    expect(updateRes.body.status).toBe('error');
    expect(updateRes.body.error.code).toBe(415);
  });

  test('No fragment found with given ID to update', async () => {
    const updateRes = await request(app)
      .put(`/v1/fragments/asdfasdfasdfasdf`)
      .set('Content-Type', 'this/notexist')
      .auth('user1@email.com', 'password1')
      .send('updated test to fail');

    expect(updateRes.body.status).toBe('error');
    expect(updateRes.body.error.code).toBe(404);
  });

  test('Authenticated user can update a fragment', async () => {
    const res = await request(app)
    .post('/v1/fragments')
    .set('Content-Type', 'text/plain')
    .auth('user1@email.com', 'password1')
    .send('hello world');

    expect(res.header.location).not.toBe('');
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    let id = res.body.fragment.id;

    const updateRes = await request(app)
    .put(`/v1/fragments/${id}`)
    .set('Content-Type', 'text/plain')
    .auth('user1@email.com', 'password1')
    .send('goodbye world');

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.status).toBe('ok');
  });
});
