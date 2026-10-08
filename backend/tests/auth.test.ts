import request from 'supertest';
import app from '../src/app';

describe('Auth & User API Integration Tests', () => {
  const uniqueEmail = `test_${Date.now()}@example.com`;
  let authToken = '';
  let userId = '';

  it('should successfully register a new user with valid data (201)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Doe',
        email: uniqueEmail,
        password: 'Password123!',
        phone: '+919988776655'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(uniqueEmail);
    expect(res.body.data.user.passwordHash).toBeUndefined(); // Password must never be exposed

    authToken = res.body.data.token;
    userId = res.body.data.user.id;
  });

  it('should reject registration when email already exists (409)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Clone',
        email: uniqueEmail,
        password: 'Password123!'
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  it('should reject registration with invalid password (400)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Weak Password User',
        email: `weak_${Date.now()}@example.com`,
        password: '123'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should log in successfully with correct credentials (200)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: uniqueEmail,
        password: 'Password123!'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(uniqueEmail);
  });

  it('should reject login with incorrect password (401)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: uniqueEmail,
        password: 'WrongPassword999!'
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('should retrieve current user profile with valid Bearer token (200)', async () => {
    const res = await request(app)
      .get('/api/user/profile')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(userId);
    expect(res.body.data.email).toBe(uniqueEmail);
  });

  it('should reject profile request without token (401)', async () => {
    const res = await request(app).get('/api/user/profile');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should update user profile (200)', async () => {
    const res = await request(app)
      .patch('/api/user/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'John Updated'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('John Updated');
  });
});
