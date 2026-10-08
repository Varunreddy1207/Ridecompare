import { RideProvider } from '../provider.interface';
import { NormalizedQuote, ProviderName, ProviderQuoteRequest, VehicleType } from '../../types/provider.types';

export class RapidoMockProvider implements RideProvider {
  private shouldFail = false;

  public setSimulateFailure(fail: boolean): void {
    this.shouldFail = fail;
  }

  public setFailureSimulation(fail: boolean): void {
    this.shouldFail = fail;
  }

  public getProviderName(): ProviderName {
    return 'RAPIDO';
  }

  public getSupportedVehicleTypes(): VehicleType[] {
    return ['BIKE', 'AUTO'];
  }

  public async getQuotes(request: ProviderQuoteRequest): Promise<NormalizedQuote[]> {
    if (this.shouldFail) {
      throw new Error('Rapido API connection timed out (Simulated)');
    }

    const { distanceKm, estimatedMinutes } = request;

    // Rapido Pricing Algorithm:
    // Bike: Base 36 + (distance * 9.2) + (minutes * 0.4)
    const bikeRaw = 36 + distanceKm * 9.2 + estimatedMinutes * 0.4;
    const bikePrice = Math.round(bikeRaw);

    // Auto: Base 54 + (distance * 14.2) + (minutes * 0.5)
    const autoRaw = 54 + distanceKm * 14.2 + estimatedMinutes * 0.5;
    const autoPrice = Math.round(autoRaw);

    const quotes: NormalizedQuote[] = [
      {
        provider: 'RAPIDO',
        vehicleType: 'BIKE',
        price: bikePrice,
        currency: 'INR',
        etaMinutes: Math.max(3, Math.round(estimatedMinutes * 0.95)),
        rating: 4.2,
        status: 'AVAILABLE'
      },
      {
        provider: 'RAPIDO',
        vehicleType: 'AUTO',
        price: autoPrice,
        currency: 'INR',
        etaMinutes: Math.max(5, Math.round(estimatedMinutes * 1.25)),
        rating: 4.1,
        status: 'AVAILABLE'
      }
    ];

    return quotes;
  }
}
