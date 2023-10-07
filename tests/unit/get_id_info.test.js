const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/info', () => {
  test('v1/fragments/info returns the fragment metadata', async () => {
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
      .get(`/v1/fragments/${fragmentID}/info`)
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(200);
    expect(res2.body.status).toBe('ok');
    //expect(res2.body.fragments.id).toBe(fragmentID);
  });
});
