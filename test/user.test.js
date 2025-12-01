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
    const newUser = { name: 'Alice', email: 'alice@gmail.com' };
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

  test('POST /users accepts valid email without spaces', async () => {
    const newUser = { name: 'Bob', email: 'bob@hotmail.com' };
    const res = await request(app).post('/users').send(newUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Bob');
    expect(res.body.email).toBe('bob@hotmail.com');
  });

  test('POST /users accepts various real domains', async () => {
    const users = [
      { name: 'Outlook User', email: 'user@outlook.com' },
      { name: 'Edu User', email: 'student@university.edu' },
      { name: 'EC User', email: 'citizen@gob.ec' },
      { name: 'Edu EC User', email: 'prof@espe.edu.ec' }
    ];

    for (const user of users) {
      const res = await request(app).post('/users').send(user);
      expect(res.statusCode).toBe(201);
      expect(res.body.email).toBe(user.email);
    }
  });

  test('POST /users rejects example.com domain', async () => {
    const res = await request(app).post('/users').send({ name: 'Test', email: 'test@example.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain('example.com is not allowed');
  });

  test('POST /users rejects missing name', async () => {
    const res = await request(app).post('/users').send({ email: 'test@gmail.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain('name and email are required');
  });

  test('POST /users rejects missing email', async () => {
    const res = await request(app).post('/users').send({ name: 'Test User' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain('name and email are required');
  });

  test('POST /users rejects invalid email format', async () => {
    const res = await request(app).post('/users').send({ name: 'Test', email: 'invalid-email' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain('email must be valid');
  });

  test('POST /users creates multiple users with incremental IDs', async () => {
    const user1 = { name: 'Alice', email: 'alice@gmail.com' };
    const user2 = { name: 'Bob', email: 'bob@yahoo.com' };
    
    const res1 = await request(app).post('/users').send(user1);
    const res2 = await request(app).post('/users').send(user2);
    
    expect(res1.body.id).toBe(1);
    expect(res2.body.id).toBe(2);
    
    const get = await request(app).get('/users');
    expect(get.body).toHaveLength(2);
  });

  test('GET /users returns all created users in order', async () => {
    const users = [
      { name: 'User1', email: 'user1@gmail.com' },
      { name: 'User2', email: 'user2@hotmail.com' },
      { name: 'User3', email: 'user3@yahoo.com' }
    ];

    for (const user of users) {
      await request(app).post('/users').send(user);
    }

    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(3);
    expect(res.body[0].name).toBe('User1');
    expect(res.body[1].name).toBe('User2');
    expect(res.body[2].name).toBe('User3');
  });

  test('POST /users rejects non-string name', async () => {
    const res = await request(app).post('/users').send({ name: 123, email: 'test@gmail.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /users rejects non-string email', async () => {
    const res = await request(app).post('/users').send({ name: 'Test', email: 12345 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /users rejects empty body', async () => {
    const res = await request(app).post('/users').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /users rejects duplicate email', async () => {
    const user = { name: 'First', email: 'duplicate@test.com' };
    await request(app).post('/users').send(user);
    const res = await request(app).post('/users').send(user);
    expect(res.statusCode).toBe(409);
    expect(res.body.error).toMatch(/already exists/i);
  });

  test('POST /users rejects name too short', async () => {
    const res = await request(app).post('/users').send({ name: 'Bo', email: 'bo@test.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/name must be at least 3 characters/i);
  });

  test('POST /users trims whitespace from name and email', async () => {
    const res = await request(app).post('/users').send({ name: '  Trim Me  ', email: '  trim@test.com  ' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Trim Me');
    expect(res.body.email).toBe('trim@test.com');
  });

  test('GET /users/:id returns a single user', async () => {
    const user = { name: 'Single', email: 'single@test.com' };
    const created = await request(app).post('/users').send(user);
    const id = created.body.id;

    const res = await request(app).get(`/users/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ id, ...user });
  });

  test('GET /users/:id returns 404 for non-existent user', async () => {
    const res = await request(app).get('/users/999');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  test('PUT /users/:id updates a user', async () => {
    const user = { name: 'To Update', email: 'update@test.com' };
    const created = await request(app).post('/users').send(user);
    const id = created.body.id;

    const updatedData = { name: 'Updated Name', email: 'updated@test.com' };
    const res = await request(app).put(`/users/${id}`).send(updatedData);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ id, ...updatedData });

    const check = await request(app).get(`/users/${id}`);
    expect(check.body.name).toBe(updatedData.name);
  });

  test('PUT /users/:id returns 404 for non-existent user', async () => {
    const res = await request(app).put('/users/999').send({ name: 'New', email: 'new@test.com' });
    expect(res.statusCode).toBe(404);
  });

  test('DELETE /users/:id deletes a user', async () => {
    const user = { name: 'To Delete', email: 'delete@test.com' };
    const created = await request(app).post('/users').send(user);
    const id = created.body.id;

    const res = await request(app).delete(`/users/${id}`);
    expect(res.statusCode).toBe(204);

    const check = await request(app).get(`/users/${id}`);
    expect(check.statusCode).toBe(404);
  });

  test('DELETE /users/:id returns 404 for non-existent user', async () => {
    const res = await request(app).delete('/users/999');
    expect(res.statusCode).toBe(404);
  });

  test('404 for non-existent routes', async () => {
    const res = await request(app).get('/nonexistent');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Not found');
  });

  test('PUT /users/:id rejects short name', async () => {
    const user = { name: 'To Update', email: 'update@test.com' };
    const created = await request(app).post('/users').send(user);
    const id = created.body.id;

    const res = await request(app).put(`/users/${id}`).send({ name: 'Bo' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/name must be at least/i);
  });

  test('PUT /users/:id rejects invalid email', async () => {
    const user = { name: 'To Update', email: 'update@test.com' };
    const created = await request(app).post('/users').send(user);
    const id = created.body.id;

    const res = await request(app).put(`/users/${id}`).send({ email: 'invalid-email' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/email must be valid/i);
  });

  test('PUT /users/:id rejects duplicate email', async () => {
    const user1 = { name: 'User 1', email: 'user1@test.com' };
    const user2 = { name: 'User 2', email: 'user2@test.com' };
    await request(app).post('/users').send(user1);
    const created2 = await request(app).post('/users').send(user2);
    const id2 = created2.body.id;

    const res = await request(app).put(`/users/${id2}`).send({ email: 'user1@test.com' });
    expect(res.statusCode).toBe(409);
    expect(res.body.error).toMatch(/already exists/i);
  });

  // --- Unit Tests for Controller Internals (Coverage for lines 9, 56) ---
  test('Unit: createUser handles undefined req.body', () => {
    const req = {}; // No body property
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    // Import controller directly to test without Express middleware
    const { createUser } = require('../src/controllers/user.controller');
    createUser(req, res);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringMatching(/required/) }));
  });

  test('Unit: updateUser handles undefined req.body', () => {
    // Setup: Create a user first so we can try to update it
    const { createUser, updateUser, resetUsers } = require('../src/controllers/user.controller');
    resetUsers();
    
    const reqCreate = { body: { name: 'Unit', email: 'unit@test.com' } };
    const resCreate = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    createUser(reqCreate, resCreate);
    const userId = resCreate.json.mock.calls[0][0].id;

    // Test update with no body
    const reqUpdate = { params: { id: userId.toString() } }; // No body
    const resUpdate = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    updateUser(reqUpdate, resUpdate);
    
    // Should return user unmodified
    expect(resUpdate.json).toHaveBeenCalled();
    const updatedUser = resUpdate.json.mock.calls[0][0];
    expect(updatedUser.name).toBe('Unit');
  });

  // --- Integration Tests for Partial Updates (Coverage for line 65) ---
  test('PUT /users/:id updates only name (skips email block)', async () => {
    const user = { name: 'Original', email: 'orig@test.com' };
    const created = await request(app).post('/users').send(user);
    const id = created.body.id;

    const res = await request(app).put(`/users/${id}`).send({ name: 'Updated Name' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Name');
    expect(res.body.email).toBe('orig@test.com');
  });

  test('PUT /users/:id updates only email (skips name block)', async () => {
    const user = { name: 'Original', email: 'orig@test.com' };
    const created = await request(app).post('/users').send(user);
    const id = created.body.id;

    const res = await request(app).put(`/users/${id}`).send({ email: 'new@test.com' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Original');
    expect(res.body.email).toBe('new@test.com');
  });
});
