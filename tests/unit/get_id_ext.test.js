const request = require('supertest');
const app = require('../../src/app');
const path = require('path');
const fs = require('fs');

describe('GET /v1/fragments/:id.:ext', () => {
  test('Can covert md to html', async () => {
    const bufferMessage = '# abcdef';
    const data = Buffer.from(bufferMessage);

    // post to create a fragment
    const res1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/markdown')
      .send(data);

    const fragmentID = res1.body.fragment.id;

    // API request for GET id
    const res2 = await request(app)
      .get(`/v1/fragments/${fragmentID}.html`)
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(200);
    expect(res2.body).toBe('<h1>abcdef</h1>\n');
  });

  test('Gets Fragment uploaded with same content-type', async () => {
    const bufferMessage = '# abcdefg';
    const data = Buffer.from(bufferMessage);

    // post to create a fragment
    const res1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/markdown')
      .send(data);

    const fragmentID = res1.body.fragment.id;

    // API request for GET id
    const res2 = await request(app)
      .get(`/v1/fragments/${fragmentID}.md`)
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(200);
    expect(res2.body).toBe('# abcdefg');
  });

  test('Returns Error when cannot convert to format', async () => {
    const bufferMessage = '# abcdefghi';
    const data = Buffer.from(bufferMessage);

    // post to create a fragment
    const res1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/markdown')
      .send(data);

    const fragmentID = res1.body.fragment.id;

    // API request for GET id
    const res2 = await request(app)
      .get(`/v1/fragments/${fragmentID}.png`)
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(415);

    // Since the message is dynamic, we just check for the first part of the message.
    expect(res2.body.error).toContain(`The fragment's format`);
  });

  test('Converting markdown to plain text', async () => {
    const bufferMessage = '# abcdefg';
    const data = Buffer.from(bufferMessage);

    // post to create a fragment
    const res1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/markdown')
      .send(data);

    const fragmentID = res1.body.fragment.id;

    // API request for GET id
    const res2 = await request(app)
      .get(`/v1/fragments/${fragmentID}.txt`)
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(200);
    expect(res2.body).toBe('abcdefg');
  });

  test('Converting html to plain text', async () => {
    const bufferMessage = '<div>Hello World</div>';
    const data = Buffer.from(bufferMessage);

    // post to create a fragment
    const res1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/html')
      .send(data);

    const fragmentID = res1.body.fragment.id;

    // API request for GET id
    const res2 = await request(app)
      .get(`/v1/fragments/${fragmentID}.txt`)
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(200);
    expect(res2.body).toBe('Hello World');
  });

  test('Converting gif to png', async () => {
    const image = path.join(__dirname, '../images/space.gif');
    const imageBuffer = fs.readFileSync(image);

    const res1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'image/gif')
      .send(imageBuffer);

    const fragmentID = res1.body.fragment.id;

    // API request for GET id
    const res2 = await request(app)
      .get(`/v1/fragments/${fragmentID}.png`)
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(200);
  });
});
