import { NormalizedQuote, ProviderName, ProviderQuoteRequest, VehicleType } from '../types/provider.types';

export interface RideProvider {
  getProviderName(): ProviderName;
  getSupportedVehicleTypes(): VehicleType[];
  getQuotes(request: ProviderQuoteRequest): Promise<NormalizedQuote[]>;
}
