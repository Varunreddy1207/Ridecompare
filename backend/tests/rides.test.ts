import request from 'supertest';
import app from '../src/app';

describe('Ride Compare & History API Integration Tests', () => {
  let authToken = '';
  let sampleQuoteId = '';

  beforeAll(async () => {
    // Register a test user for authenticated ride history tests
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Rides Tester',
        email: `ridestest_${Date.now()}@example.com`,
        password: 'Password123!'
      });

    authToken = res.body.data.token;
  });

  it('should compare rides across providers with valid coordinates (200)', async () => {
    const res = await request(app)
      .post('/api/rides/compare')
      .send({
        pickup: {
          address: 'Station Road, Kolhapur',
          latitude: 16.7028,
          longitude: 74.2405
        },
        destination: {
          address: 'Sanjay Ghodawat University, Kolhapur',
          latitude: 16.7450,
          longitude: 74.3720
        }
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.searchId).toBeDefined();
    expect(res.body.data.route.distanceKm).toBeGreaterThan(0);
    expect(res.body.data.route.estimatedMinutes).toBeGreaterThan(0);
    expect(Array.isArray(res.body.data.rides)).toBe(true);
    expect(res.body.data.rides.length).toBeGreaterThanOrEqual(3);

    // Verify presence of at least one cheapest and fastest tag
    const cheapest = res.body.data.rides.find((r: any) => r.isCheapest);
    const fastest = res.body.data.rides.find((r: any) => r.isFastest);
    expect(cheapest).toBeDefined();
    expect(fastest).toBeDefined();

    // Verify recommendation structure
    expect(res.body.data.recommendation).toBeDefined();
    expect(res.body.data.recommendation.provider).toBeDefined();

    // Save a quoteId for subsequent quote test
    sampleQuoteId = res.body.data.rides[0].quoteId;
  });

  it('should reject invalid coordinates with validation error (400)', async () => {
    const res = await request(app)
      .post('/api/rides/compare')
      .send({
        pickup: {
          address: 'Invalid Pickup',
          latitude: 195.0, // Invalid latitude > 90
          longitude: 74.2405
        },
        destination: {
          address: 'Kolhapur',
          latitude: 16.7450,
          longitude: 74.3720
        }
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should retrieve individual quote details by quote ID (200)', async () => {
    expect(sampleQuoteId).toBeDefined();

    const res = await request(app).get(`/api/quotes/${sampleQuoteId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.quoteId).toBe(sampleQuoteId);
    expect(res.body.data.pickup).toBeDefined();
    expect(res.body.data.destination).toBeDefined();
  });

  it('should return 404 for non-existent quote ID', async () => {
    const res = await request(app).get('/api/quotes/non-existent-id-12345');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('should retrieve ride history with pagination (200)', async () => {
    const res = await request(app)
      .get('/api/rides/history?page=1&limit=5')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.items)).toBe(true);
    expect(res.body.data.pagination).toBeDefined();
    expect(res.body.data.pagination.page).toBe(1);
    expect(res.body.data.pagination.limit).toBe(5);
  });
});
