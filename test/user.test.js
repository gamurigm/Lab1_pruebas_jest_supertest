const request = require('supertest');
const app = require('../src/app');
const { resetUsers } = require('../src/controllers/user.controller');

describe('Users API', () => {
  beforeEach(() => {
    resetUsers();
  });

  test('GET /users returns empty array initially', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });

  test('POST /users creates a user and GET returns it', async () => {
    const newUser = { name: 'Alice', email: 'alice@example.com' };
    const post = await request(app).post('/users').send(newUser);
    expect(post.statusCode).toBe(201);
    expect(post.body).toMatchObject({ id: expect.any(Number), name: newUser.name, email: newUser.email });

    const get = await request(app).get('/users');
    expect(get.statusCode).toBe(200);
    expect(get.body).toHaveLength(1);
    expect(get.body[0]).toMatchObject({ name: newUser.name, email: newUser.email });
  });

  test('POST /users rejects invalid input', async () => {
    const res = await request(app).post('/users').send({ name: '', email: 'not-an-email' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
