export type ProviderName = 'UBER' | 'OLA' | 'RAPIDO';
export type VehicleType = 'BIKE' | 'AUTO' | 'CAR';
export type QuoteStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'ERROR';

export interface LocationCoordinates {
  address: string;
  latitude: number;
  longitude: number;
}

export interface ProviderQuoteRequest {
  pickup: LocationCoordinates;
  destination: LocationCoordinates;
  distanceKm: number;
  estimatedMinutes: number;
}

export interface NormalizedQuote {
  quoteId?: string;
  provider: ProviderName;
  vehicleType: VehicleType;
  price: number;
  currency: string;
  etaMinutes: number;
  rating: number;
  status: QuoteStatus;
  isCheapest?: boolean;
  isFastest?: boolean;
}
