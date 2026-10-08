export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // If coordinates are essentially identical
  if (Math.abs(lat1 - lat2) < 0.0001 && Math.abs(lon1 - lon2) < 0.0001) {
    return 1.2; // Sensible default short hop
  }

  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLineDistance = R * c;

  // Road factor adjustment (roads are typically 1.25x - 1.35x longer than straight-line geodesic distance)
  const roadFactor = 1.3;
  const estimatedKm = straightLineDistance * roadFactor;

  // Return rounded to 1 decimal place with a minimum of 0.8 km
  return Math.max(0.8, Math.round(estimatedKm * 10) / 10);
}

export function estimateTravelMinutes(distanceKm: number): number {
  // Average urban city driving speed in India: ~22-25 km/h
  const avgSpeedKmh = 24;
  const drivingMinutes = (distanceKm / avgSpeedKmh) * 60;
  // Add 2-3 minutes base traffic/signal wait time
  const totalMinutes = Math.round(drivingMinutes + 2);
  // Minimum trip duration of 4 minutes
  return Math.max(4, totalMinutes);
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
