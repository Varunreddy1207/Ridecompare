import request from 'supertest';
import app from '../src/app';

describe('Locations API Integration Tests', () => {
  let authToken = '';
  let savedLocationId = '';

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Location Tester',
        email: `loctest_${Date.now()}@example.com`,
        password: 'Password123!'
      });

    authToken = res.body.data.token;
  });

  it('should search locations by query keyword (200)', async () => {
    const res = await request(app).get('/api/locations/search?q=Sanjay');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].name).toContain('Sanjay');
  });

  it('should create a saved location for authenticated user (201)', async () => {
    const res = await request(app)
      .post('/api/locations/saved')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'My Hostel',
        address: 'Near Sanjay Ghodawat University, Kolhapur',
        latitude: 16.746,
        longitude: 74.373
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.name).toBe('My Hostel');

    savedLocationId = res.body.data.id;
  });

  it('should get saved locations for user (200)', async () => {
    const res = await request(app)
      .get('/api/locations/saved')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.some((l: any) => l.id === savedLocationId)).toBe(true);
  });

  it('should delete a saved location (200)', async () => {
    const res = await request(app)
      .delete(`/api/locations/saved/${savedLocationId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should return 404 when deleting a non-existent saved location', async () => {
    const res = await request(app)
      .delete('/api/locations/saved/non-existent-id-999')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
