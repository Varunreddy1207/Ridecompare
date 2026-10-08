import { RapidoMockProvider } from '../src/providers/rapido/rapido.mock';
import { OlaMockProvider } from '../src/providers/ola/ola.mock';
import { UberMockProvider } from '../src/providers/uber/uber.mock';
import { ComparisonService } from '../src/services/comparison.service';
import { ProviderQuoteRequest } from '../src/types/provider.types';

describe('Provider Architecture & Fault Tolerance Tests', () => {
  const sampleRequest: ProviderQuoteRequest = {
    pickup: {
      address: 'Shahupuri, Kolhapur',
      latitude: 16.7050,
      longitude: 74.2433
    },
    destination: {
      address: 'Sanjay Ghodawat University',
      latitude: 16.7450,
      longitude: 74.3720
    },
    distanceKm: 4.2,
    estimatedMinutes: 12
  };

  it('should retrieve quotes correctly from Rapido mock provider', async () => {
    const provider = new RapidoMockProvider();
    const quotes = await provider.getQuotes(sampleRequest);

    expect(quotes.length).toBeGreaterThanOrEqual(2);
    quotes.forEach((q) => {
      expect(q.provider).toBe('RAPIDO');
      expect(['BIKE', 'AUTO']).toContain(q.vehicleType);
      expect(q.price).toBeGreaterThan(0);
      expect(q.currency).toBe('INR');
      expect(q.status).toBe('AVAILABLE');
      expect(q.etaMinutes).toBeGreaterThan(0);
    });
  });

  it('should retrieve quotes correctly from Ola mock provider', async () => {
    const provider = new OlaMockProvider();
    const quotes = await provider.getQuotes(sampleRequest);

    expect(quotes.length).toBeGreaterThanOrEqual(2);
    quotes.forEach((q) => {
      expect(q.provider).toBe('OLA');
      expect(['BIKE', 'AUTO']).toContain(q.vehicleType);
      expect(q.price).toBeGreaterThan(0);
      expect(q.currency).toBe('INR');
      expect(q.status).toBe('AVAILABLE');
    });
  });

  it('should retrieve quotes correctly from Uber mock provider', async () => {
    const provider = new UberMockProvider();
    const quotes = await provider.getQuotes(sampleRequest);

    expect(quotes.length).toBeGreaterThanOrEqual(2);
    quotes.forEach((q) => {
      expect(q.provider).toBe('UBER');
      expect(['BIKE', 'CAR']).toContain(q.vehicleType);
      expect(q.price).toBeGreaterThan(0);
      expect(q.currency).toBe('INR');
      expect(q.status).toBe('AVAILABLE');
    });
  });

  it('should tolerate single provider failure without failing entire comparison request', async () => {
    const comparisonService = new ComparisonService();

    // Simulate Uber failure toggle
    comparisonService.uberProvider.setFailureSimulation(true);

    const result = await comparisonService.compareRides(
      sampleRequest.pickup,
      sampleRequest.destination
    );

    // Verify comparison still succeeds
    expect(result).toBeDefined();
    expect(result.searchId).toBeDefined();
    expect(result.rides.length).toBeGreaterThan(0);

    // Rapido & Ola should be AVAILABLE
    const rapidoRides = result.rides.filter((r) => r.provider === 'RAPIDO');
    const olaRides = result.rides.filter((r) => r.provider === 'OLA');
    const uberRides = result.rides.filter((r) => r.provider === 'UBER');

    expect(rapidoRides.length).toBeGreaterThan(0);
    expect(rapidoRides.every((r) => r.status === 'AVAILABLE')).toBe(true);

    expect(olaRides.length).toBeGreaterThan(0);
    expect(olaRides.every((r) => r.status === 'AVAILABLE')).toBe(true);

    // Uber should gracefully be marked UNAVAILABLE
    expect(uberRides.length).toBeGreaterThan(0);
    expect(uberRides.every((r) => r.status === 'UNAVAILABLE')).toBe(true);

    // Recommendation should still pick from available providers
    expect(result.recommendation).toBeDefined();
    expect(result.recommendation?.provider).not.toBe('UBER');

    // Reset failure
    comparisonService.uberProvider.setFailureSimulation(false);
  });
});
