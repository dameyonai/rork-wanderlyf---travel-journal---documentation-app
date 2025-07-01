export interface LatLng {
  latitude: number
  longitude: number
}

/** convert degrees to radians */
function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

/**
 * Haversine formula:
 * Calculate distance between two points (in km)
 */
export function calculateDistance(a: LatLng, b: LatLng): number {
  const R = 6371 // Earth radius in km
  const dLat = toRad(b.latitude - a.latitude)
  const dLon = toRad(b.longitude - a.longitude)
  const lat1 = toRad(a.latitude)
  const lat2 = toRad(b.latitude)

  const sinDLat = Math.sin(dLat / 2)
  const sinDLon = Math.sin(dLon / 2)
  const h =
    sinDLat * sinDLat +
    sinDLon * sinDLon * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
  return R * c
}

/**
 * Sum distances between sequential points in an array.
 * Returns total in km.
 */
export function calculateTotalDistance(points: LatLng[]): number {
  if (points.length < 2) return 0
  let total = 0
  for (let i = 1; i < points.length; i++) {
    total += calculateDistance(points[i - 1], points[i])
  }
  return Math.round(total * 100) / 100 // round to 2 decimals
}