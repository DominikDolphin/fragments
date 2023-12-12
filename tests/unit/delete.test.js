const request = require('supertest');
const app = require('../../src/app');

describe('Delete requests', () => {

  test('Authenticated user can delete a fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .send('hello world');

    expect(res.header.location).not.toBe('');
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    const deleteFragment = await request(app)
      .delete(`/v1/fragments/${res.body.fragment.id}`)
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')

    expect(deleteFragment.statusCode).toBe(200);
  });

  test('Authenticated user cannot delete fragment that does not exist', async () => {

    const deleteFragment = await request(app)
      .delete(`/v1/fragments/asdfasdfasdfasdf`)
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')

      console.log(deleteFragment.body);
    // expect(updateRes.body.status).toBe('error');
    expect(deleteFragment.statusCode).toBe(404);
  });
});
