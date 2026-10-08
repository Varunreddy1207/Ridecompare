import { RideProvider } from '../provider.interface';
import { NormalizedQuote, ProviderName, ProviderQuoteRequest, VehicleType } from '../../types/provider.types';

export class UberMockProvider implements RideProvider {
  private shouldFail = false;

  public setSimulateFailure(fail: boolean): void {
    this.shouldFail = fail;
  }

  public setFailureSimulation(fail: boolean): void {
    this.shouldFail = fail;
  }

  public getProviderName(): ProviderName {
    return 'UBER';
  }

  public getSupportedVehicleTypes(): VehicleType[] {
    return ['BIKE', 'CAR'];
  }

  public async getQuotes(request: ProviderQuoteRequest): Promise<NormalizedQuote[]> {
    if (this.shouldFail) {
      throw new Error('Uber service unavailable (Simulated)');
    }

    const { distanceKm, estimatedMinutes } = request;

    // Uber Pricing Algorithm:
    // Bike: Base 50 + (distance * 12.0) + (minutes * 0.4)
    const bikeRaw = 50 + distanceKm * 12.0 + estimatedMinutes * 0.4;
    const bikePrice = Math.round(bikeRaw);

    // Car (Uber Go): Base 76 + (distance * 19.5) + (minutes * 0.8)
    const carRaw = 76 + distanceKm * 19.5 + estimatedMinutes * 0.8;
    const carPrice = Math.round(carRaw);

    const quotes: NormalizedQuote[] = [
      {
        provider: 'UBER',
        vehicleType: 'BIKE',
        price: bikePrice,
        currency: 'INR',
        etaMinutes: Math.max(5, Math.round(estimatedMinutes * 1.2)),
        rating: 4.4,
        status: 'AVAILABLE'
      },
      {
        provider: 'UBER',
        vehicleType: 'CAR',
        price: carPrice,
        currency: 'INR',
        etaMinutes: Math.max(6, Math.round(estimatedMinutes * 1.6)),
        rating: 4.5,
        status: 'AVAILABLE'
      }
    ];

    return quotes;
  }
}
