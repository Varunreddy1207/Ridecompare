import { RideProvider } from '../provider.interface';
import { NormalizedQuote, ProviderName, ProviderQuoteRequest, VehicleType } from '../../types/provider.types';

export class OlaMockProvider implements RideProvider {
  private shouldFail = false;

  public setSimulateFailure(fail: boolean): void {
    this.shouldFail = fail;
  }

  public setFailureSimulation(fail: boolean): void {
    this.shouldFail = fail;
  }

  public getProviderName(): ProviderName {
    return 'OLA';
  }

  public getSupportedVehicleTypes(): VehicleType[] {
    return ['BIKE', 'AUTO'];
  }

  public async getQuotes(request: ProviderQuoteRequest): Promise<NormalizedQuote[]> {
    if (this.shouldFail) {
      throw new Error('Ola API gateway error 503 (Simulated)');
    }

    const { distanceKm, estimatedMinutes } = request;

    // Ola Pricing Algorithm:
    // Bike: Base 44 + (distance * 10.5) + (minutes * 0.4)
    const bikeRaw = 44 + distanceKm * 10.5 + estimatedMinutes * 0.4;
    const bikePrice = Math.round(bikeRaw);

    // Auto: Base 66 + (distance * 16.5) + (minutes * 0.6)
    const autoRaw = 66 + distanceKm * 16.5 + estimatedMinutes * 0.6;
    const autoPrice = Math.round(autoRaw);

    const quotes: NormalizedQuote[] = [
      {
        provider: 'OLA',
        vehicleType: 'BIKE',
        price: bikePrice,
        currency: 'INR',
        etaMinutes: Math.max(4, Math.round(estimatedMinutes * 1.1)),
        rating: 4.1,
        status: 'AVAILABLE'
      },
      {
        provider: 'OLA',
        vehicleType: 'AUTO',
        price: autoPrice,
        currency: 'INR',
        etaMinutes: Math.max(5, Math.round(estimatedMinutes * 1.4)),
        rating: 4.3,
        status: 'AVAILABLE'
      }
    ];

    return quotes;
  }
}
