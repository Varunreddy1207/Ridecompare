import { LocationCoordinates, NormalizedQuote } from './provider.types';

export interface RideRouteInfo {
  distanceKm: number;
  estimatedMinutes: number;
}

export interface RideRecommendation {
  cheapestQuoteId?: string;
  fastestQuoteId?: string;
  bestValueQuoteId?: string;
  provider?: string;
  vehicleType?: string;
  reason?: string;
}

export interface RideCompareData {
  searchId: string;
  route: RideRouteInfo;
  rides: NormalizedQuote[];
  recommendation: RideRecommendation;
}

export interface QuoteDetailData {
  quoteId: string;
  searchId: string;
  provider: string;
  vehicleType: string;
  price: number;
  currency: string;
  etaMinutes: number;
  rating: number;
  status: string;
  pickup: LocationCoordinates;
  destination: LocationCoordinates;
  distanceKm: number;
  estimatedMinutes: number;
  isCheapest: boolean;
  isFastest: boolean;
  createdAt: string;
}

export interface RideHistoryItem {
  id: string;
  userId?: string;
  provider: string;
  vehicleType: string;
  pickupAddress: string;
  destinationAddress: string;
  price: number;
  currency: string;
  status: string;
  rideDate: string;
  createdAt: string;
  // Convenience aliases for frontend
  vehicle?: string;
  pickup?: string;
  destination?: string;
  date?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
